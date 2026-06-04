import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Phone, Mail, Search } from "lucide-react";
import { fmtMoney } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/buyers/")({
  head: () => ({ meta: [{ title: "Buyers — Disposition" }] }),
  component: BuyersList,
});

function BuyersList() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("buyers").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setBuyers(data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = buyers.filter((b) => {
    if (!q) return true;
    const hay = [b.name, b.company, b.email, ...(b.target_areas ?? []), ...(b.property_types ?? [])].filter(Boolean).join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div>
      <PageHeader
        title="Buyers"
        subtitle={`${buyers.length} buyer${buyers.length === 1 ? "" : "s"} in your list`}
        action={
          <Link to="/buyers/new">
            <Button className="grad-primary text-primary-foreground hover:opacity-90">
              <Plus className="w-4 h-4 mr-1" /> Add Buyer
            </Button>
          </Link>
        }
      />

      <div className="relative mb-5">
        <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search buyers, areas, types…" className="pl-9 h-11" />
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground mb-4">{buyers.length === 0 ? "No buyers yet. Build your list." : "No matches."}</p>
          {buyers.length === 0 && <Link to="/buyers/new"><Button className="grad-primary text-primary-foreground">Add first buyer</Button></Link>}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <Link key={b.id} to="/buyers/$id" params={{ id: b.id }} className="glass rounded-2xl p-5 hover:border-primary/40 transition shadow-elevated">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{b.name}</div>
                  {b.company && <div className="text-xs text-muted-foreground truncate">{b.company}</div>}
                </div>
                <span className={`shrink-0 ml-2 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${
                  b.buyer_tier === "A" ? "bg-[color:var(--tier-a)]/15 text-[color:var(--tier-a)] border-[color:var(--tier-a)]/30" :
                  b.buyer_tier === "B" ? "bg-[color:var(--tier-b)]/15 text-[color:var(--tier-b)] border-[color:var(--tier-b)]/30" :
                  "bg-[color:var(--tier-c)]/15 text-[color:var(--tier-c)] border-[color:var(--tier-c)]/30"
                }`}>{b.buyer_tier}</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="truncate">{(b.target_areas ?? []).slice(0, 3).join(", ") || "Any area"}</div>
                <div className="truncate">{(b.property_types ?? []).join(", ") || "Any type"}</div>
                <div className="number">{fmtMoney(b.price_min)} – {fmtMoney(b.price_max)}</div>
              </div>
              <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                {b.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{b.phone}</span>}
                {b.email && <span className="inline-flex items-center gap-1 truncate"><Mail className="w-3 h-3" />{b.email}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
