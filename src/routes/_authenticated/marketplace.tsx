import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { Search, MapPin, Sparkles, Link2, Trophy } from "lucide-react";
import { fmtMoney, fmtNum } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/marketplace")({
  head: () => ({ meta: [{ title: "Buyer Marketplace" }] }),
  component: Marketplace,
});

const BUYER_TYPE_CLR: Record<string, string> = {
  cash: "bg-[color:var(--buyer-cash-bg)] text-[color:var(--buyer-cash-fg)] border-[color:var(--buyer-cash-fg)]",
  flip: "bg-[color:var(--buyer-flipper-bg)] text-[color:var(--buyer-flipper-fg)] border-[color:var(--buyer-flipper-fg)]",
  rental: "bg-[color:var(--buyer-landlord-bg)] text-[color:var(--buyer-landlord-fg)] border-[color:var(--buyer-landlord-fg)]",
  landlord: "bg-[color:var(--buyer-landlord-bg)] text-[color:var(--buyer-landlord-fg)] border-[color:var(--buyer-landlord-fg)]",
  land: "bg-amber-100 text-amber-900",
  builder: "bg-amber-100 text-amber-900",
};

function Marketplace() {
  const [filters, setFilters] = useState({ area: "", buyerType: "all", priceMin: "", priceMax: "" });
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [sort, setSort] = useState<"smart" | "portfolio" | "reliability" | "linked">("smart");

  const search = async () => {
    setSearching(true);
    let q = supabase.from("buyers").select("*, buyer_portfolio_stats(*)").eq("status", "active");
    if (filters.area) q = q.contains("target_areas", [filters.area]);
    if (filters.buyerType !== "all") q = q.contains("deal_types", [filters.buyerType]);
    if (filters.priceMin) q = q.gte("price_max", Number(filters.priceMin));
    if (filters.priceMax) q = q.lte("price_min", Number(filters.priceMax));
    const { data } = await q.limit(50);

    const ranked = (data ?? []).map((b: any) => {
      const stats = Array.isArray(b.buyer_portfolio_stats) ? b.buyer_portfolio_stats[0] : b.buyer_portfolio_stats;
      const reliability = b.offers_made_count > 0 ? b.offers_closed_count / b.offers_made_count : 0;
      const smart = (b.deals_bought_count || 0) * 5 + reliability * 30 + (b.proof_of_funds ? 10 : 0) + (stats?.total_count || 0) * 2;
      return { ...b, _stats: stats, _reliability: reliability, _smart: Math.min(100, Math.round(smart)) };
    });
    ranked.sort((a: any, b: any) => {
      if (sort === "portfolio") return (Number(b._stats?.est_portfolio_value) || 0) - (Number(a._stats?.est_portfolio_value) || 0);
      if (sort === "reliability") return b._reliability - a._reliability;
      if (sort === "linked") return (b._stats?.total_count || 0) - (a._stats?.total_count || 0);
      return b._smart - a._smart;
    });
    setResults(ranked);
    setSearching(false);
  };

  return (
    <div>
      <PageHeader title="Buyer Marketplace" subtitle="Find and rank buyers by address, buy-box, and proven closing history." />

      {/* Search bar */}
      <div className="glass rounded-2xl shadow-elevated p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-2">
        <div className="md:col-span-2 relative">
          <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Target area / city / zip" value={filters.area} onChange={(e) => setFilters({ ...filters, area: e.target.value })} className="pl-9" />
        </div>
        <Select value={filters.buyerType} onValueChange={(v) => setFilters({ ...filters, buyerType: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Buyer Types</SelectItem>
            <SelectItem value="flip">Flippers</SelectItem>
            <SelectItem value="rental">Landlords</SelectItem>
            <SelectItem value="wholetail">Wholetail</SelectItem>
            <SelectItem value="land">Land / Builders</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Min price" type="number" value={filters.priceMin} onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })} />
        <Input placeholder="Max price" type="number" value={filters.priceMax} onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })} />
      </div>

      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sort by:</span>
          <Select value={sort} onValueChange={(v: any) => setSort(v)}>
            <SelectTrigger className="h-8 w-[180px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="smart">Smart Match</SelectItem>
              <SelectItem value="linked">Linked Deals</SelectItem>
              <SelectItem value="portfolio">Portfolio Value</SelectItem>
              <SelectItem value="reliability">Closing Reliability</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={search} disabled={searching} className="grad-primary text-primary-foreground">
          <Search className="w-4 h-4 mr-1" /> {searching ? "Searching…" : "Search Buyers"}
        </Button>
      </div>

      {results.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-sm text-muted-foreground">
          Set your filters and click <span className="font-semibold text-foreground">Search Buyers</span> to rank your network for this deal.
        </div>
      ) : (
        <div className="glass rounded-2xl shadow-elevated divide-y divide-border overflow-hidden">
          {results.map((b: any) => {
            const types = (b.deal_types ?? []).slice(0, 3);
            return (
              <Link key={b.id} to="/buyers/$id" params={{ id: b.id }} className="block px-5 py-4 hover:bg-[color:var(--surface-2)]/40 transition-colors">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{b.name}</span>
                      {b.company && <span className="text-xs text-muted-foreground">· {b.company}</span>}
                      {b.proof_of_funds && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-current">
                          POF
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {types.map((t: string) => (
                        <span key={t} className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${BUYER_TYPE_CLR[t] || "bg-muted text-muted-foreground border-transparent"}`}>{t}</span>
                      ))}
                      {b._stats?.total_count > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[color:var(--surface-2)] text-foreground border border-border">
                          <Link2 className="w-2.5 h-2.5" /> {b._stats.total_count} linked
                        </span>
                      )}
                      {b._reliability > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-current">
                          <Trophy className="w-2.5 h-2.5" /> {Math.round(b._reliability * 100)}% close rate
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1.5">
                      {(b.target_areas ?? []).slice(0, 3).join(", ") || "Any area"} · {fmtMoney(b.price_min)} – {fmtMoney(b.price_max)}
                      {b._stats?.est_portfolio_value && <> · Portfolio {fmtMoney(b._stats.est_portfolio_value)}</>}
                      {b._stats?.total_count > 0 && <> · {fmtNum(b._stats.total_count)} deals</>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 text-2xl font-bold number">
                      <Sparkles className="w-4 h-4 text-primary" />
                      {b._smart}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Smart Match</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
