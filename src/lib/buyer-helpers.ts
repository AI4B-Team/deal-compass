// Derive a human-readable investor type from a buyer's deal_types array.
export function deriveInvestorType(buyer: { deal_types?: string[] | null }): string {
  const types = buyer?.deal_types ?? [];
  if (types.length === 0) return "Investor";
  const first = types[0];
  const map: Record<string, string> = {
    flip: "Flipper",
    rental: "Landlord",
    wholetail: "Wholetailer",
    land: "Builder",
    new_build: "Builder",
    buy_hold: "Landlord",
  };
  if (types.length > 1) return "Multi-Strategy";
  return map[first] ?? first.replace(/_/g, " ");
}

export function monthsBetween(start: string | null | undefined, end: string | null | undefined): number | null {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
  return Math.max(0, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
}

export function zillowUrl(address: string, city?: string | null, state?: string | null, zip?: string | null): string {
  const q = [address, city, state, zip].filter(Boolean).join(", ");
  return `https://www.zillow.com/homes/${encodeURIComponent(q)}_rb/`;
}
