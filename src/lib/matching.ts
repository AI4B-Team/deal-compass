// Deterministic matching engine. Runs entirely in code — no AI.
// Hard gates first, then weighted fit score, then activity modifier.

export type Buyer = {
  id: string;
  name: string;
  target_areas: string[];
  property_types: string[];
  price_min: number | null;
  price_max: number | null;
  deal_types: string[];
  condition_tolerance: string | null;
  min_beds: number | null;
  min_baths: number | null;
  min_sqft: number | null;
  arv_min: number | null;
  arv_max: number | null;
  min_spread: number | null;
  buyer_tier: string;
  last_purchase_date: string | null;
  last_contacted_date: string | null;
};

export type Deal = {
  id: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  county: string | null;
  property_type: string | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  condition: string | null;
  intended_use: string | null;
  asking_price: number | null;
  arv: number | null;
  estimated_rehab: number | null;
};

export type MatchResult = {
  buyer_id: string;
  score: number;
  tier: "A" | "B" | "C" | "Stretch";
  reasons: string;
  gate_passed: boolean;
};

const CONDITION_RANK: Record<string, number> = { turnkey: 0, light: 1, medium: 2, heavy: 3 };

const norm = (s: string) => s.trim().toLowerCase();

function geoMatch(deal: Deal, areas: string[]): boolean {
  if (!areas || areas.length === 0) return true; // broad buyer
  const needles = [deal.county, deal.city, deal.zip, deal.state].filter(Boolean).map((x) => norm(x as string));
  return areas.some((a) => {
    const v = norm(a);
    if (v === "any" || v === "*" || v === "statewide") return true;
    return needles.some((n) => n === v || n.includes(v) || v.includes(n));
  });
}

function propertyTypeMatch(deal: Deal, types: string[]): boolean {
  if (!types || types.length === 0) return true;
  if (!deal.property_type) return true;
  return types.some((t) => norm(t) === norm(deal.property_type!));
}

// Returns 0..1
function priceFit(deal: Deal, buyer: Buyer): number {
  const p = deal.asking_price;
  if (p === null || p === undefined) return 0.5;
  const lo = buyer.price_min ?? 0;
  const hi = buyer.price_max ?? Number.POSITIVE_INFINITY;
  if (p >= lo && p <= hi) return 1;
  // within 10% outside
  const tolLo = lo * 0.9;
  const tolHi = hi === Infinity ? Infinity : hi * 1.1;
  if (p >= tolLo && p <= tolHi) {
    const distance = p < lo ? (lo - p) / (lo || 1) : (p - hi) / (hi || 1);
    return Math.max(0, 1 - distance * 10);
  }
  return 0;
}

function strategyFit(deal: Deal, buyer: Buyer): number {
  if (!buyer.deal_types || buyer.deal_types.length === 0) return 0.8;
  if (!deal.intended_use) return 0.6;
  const dt = buyer.deal_types.map(norm);
  const use = norm(deal.intended_use);
  if (use === "either") return dt.some((x) => ["flip", "buy_hold", "brrrr", "turnkey"].includes(x)) ? 1 : 0.7;
  if (dt.includes(use)) return 1;
  // partial overlap (flip ↔ brrrr, buy_hold ↔ turnkey)
  if (use === "flip" && dt.includes("brrrr")) return 0.7;
  if (use === "rental" && (dt.includes("buy_hold") || dt.includes("turnkey") || dt.includes("brrrr"))) return 0.85;
  return 0.3;
}

function conditionFit(deal: Deal, buyer: Buyer): number {
  const tol = norm(buyer.condition_tolerance ?? "any");
  if (tol === "any") return 1;
  if (!deal.condition) return 0.7;
  const dRank = CONDITION_RANK[norm(deal.condition)] ?? 2;
  const bRank = CONDITION_RANK[tol] ?? 3;
  if (dRank <= bRank) return 1;
  const diff = dRank - bRank;
  return Math.max(0, 1 - diff * 0.4);
}

function spreadFit(deal: Deal, buyer: Buyer): { fit: number; spread: number | null } {
  const arv = deal.arv ?? 0;
  const price = deal.asking_price ?? 0;
  const rehab = deal.estimated_rehab ?? 0;
  const spread = arv && price ? arv - price - rehab : null;
  const min = buyer.min_spread ?? 0;
  if (!min) {
    // buy-hold buyer — neutral if ARV missing, otherwise full
    if (buyer.arv_min || buyer.arv_max) {
      if (arv >= (buyer.arv_min ?? 0) && arv <= (buyer.arv_max ?? Infinity)) return { fit: 1, spread };
      return { fit: 0.5, spread };
    }
    return { fit: 0.9, spread };
  }
  if (spread === null) return { fit: 0.5, spread };
  if (spread >= min) return { fit: 1, spread };
  if (spread >= min * 0.8) return { fit: 0.6, spread };
  return { fit: 0.2, spread };
}

function sizeFit(deal: Deal, buyer: Buyer): number {
  const checks: number[] = [];
  if (buyer.min_beds) {
    if (deal.beds == null) checks.push(0.6);
    else checks.push(deal.beds >= buyer.min_beds ? 1 : deal.beds >= buyer.min_beds - 1 ? 0.6 : 0.2);
  }
  if (buyer.min_baths) {
    if (deal.baths == null) checks.push(0.6);
    else checks.push(deal.baths >= buyer.min_baths ? 1 : 0.5);
  }
  if (buyer.min_sqft) {
    if (deal.sqft == null) checks.push(0.6);
    else checks.push(deal.sqft >= buyer.min_sqft ? 1 : deal.sqft >= buyer.min_sqft * 0.9 ? 0.6 : 0.2);
  }
  if (checks.length === 0) return 1;
  return checks.reduce((a, b) => a + b, 0) / checks.length;
}

function activityBoost(buyer: Buyer): number {
  let b = 0;
  const recent = (d: string | null) => d && Date.now() - new Date(d).getTime() < 60 * 24 * 3600 * 1000;
  if (recent(buyer.last_purchase_date)) b += 3;
  if (recent(buyer.last_contacted_date)) b += 1;
  if (buyer.buyer_tier === "A") b += 2;
  return Math.min(5, b);
}

export type Weights = {
  price: number; strategy: number; condition: number; spread: number; size: number;
};

export const DEFAULT_WEIGHTS: Weights = { price: 30, strategy: 25, condition: 20, spread: 15, size: 10 };

export function scoreBuyer(deal: Deal, buyer: Buyer, weights: Weights = DEFAULT_WEIGHTS): MatchResult {
  const geo = geoMatch(deal, buyer.target_areas);
  const pt = propertyTypeMatch(deal, buyer.property_types);
  const gatePassed = geo && pt;

  const pf = priceFit(deal, buyer);
  const sf = strategyFit(deal, buyer);
  const cf = conditionFit(deal, buyer);
  const { fit: spf, spread } = spreadFit(deal, buyer);
  const zf = sizeFit(deal, buyer);

  let raw =
    pf * weights.price +
    sf * weights.strategy +
    cf * weights.condition +
    spf * weights.spread +
    zf * weights.size;
  raw += activityBoost(buyer);
  let score = Math.max(0, Math.min(100, Math.round(raw)));

  // Reasons (deterministic)
  const reasons: string[] = [];
  if (geo && buyer.target_areas?.length) reasons.push(`In target area`);
  if (pt && deal.property_type) reasons.push(`${deal.property_type} fits`);
  if (pf >= 0.95 && deal.asking_price) reasons.push(`Price in range`);
  else if (pf > 0 && pf < 0.95) reasons.push(`Price near range`);
  if (sf >= 0.95 && deal.intended_use) reasons.push(`${deal.intended_use} play matches`);
  if (cf >= 0.95 && deal.condition) reasons.push(`${deal.condition} condition OK`);
  if (spread !== null && buyer.min_spread && spread >= buyer.min_spread)
    reasons.push(`Spread $${Math.round(spread).toLocaleString()} ≥ $${buyer.min_spread.toLocaleString()} min`);
  if (zf >= 0.95 && (buyer.min_beds || buyer.min_sqft)) reasons.push(`Size meets minimums`);
  if (buyer.buyer_tier === "A") reasons.push(`Tier A buyer`);

  let tier: MatchResult["tier"];
  if (!gatePassed) {
    tier = "Stretch";
    score = Math.min(score, 60);
  } else if (score >= 85) tier = "A";
  else if (score >= 65) tier = "B";
  else if (score >= 45) tier = "C";
  else tier = "Stretch";

  return {
    buyer_id: buyer.id,
    score,
    tier,
    reasons: reasons.join(" · ") || "—",
    gate_passed: gatePassed,
  };
}

export function rankBuyers(deal: Deal, buyers: Buyer[], weights?: Weights): MatchResult[] {
  return buyers.map((b) => scoreBuyer(deal, b, weights)).sort((a, b) => b.score - a.score);
}
