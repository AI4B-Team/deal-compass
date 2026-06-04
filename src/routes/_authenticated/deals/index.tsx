import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fmtMoney, daysUntil, urgencyColor } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/deals/")({
  head: () => ({ meta: [{ title: "Deals — Disposition" }] }),
  component: DealsList,
});

const STATUS_STYLE: Record<string, string> = {
  locked: "bg-[color:var(--tier-b)]/15 text-[color:var(--tier-b)]",
  marketing: "bg-[color:var(--tier-a)]/15 text-[color:var(--tier-a)]",
  under_assignment: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
  assigned: "bg-[color:var(--tier-c)]/15 text-[color:var(--tier-c)]",
  closed: "bg-muted text-muted-foreground",
  dead: "bg-destructive/15 text-destructive",
};

function DealsList() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("deals").select("*").order("closing_deadline", { ascending: true, nullsFirst: false }).then(({ data }) => {
      setDeals(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHeader
        title="Deals"
        subtitle="Your disposition pipeline."
        action={<Link to="/deals/new"><Button className="grad-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> New Deal</Button></Link>}
      />
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : deals.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground mb-4">No deals yet.</p>
          <Link to="/deals/new"><Button className="grad-primary text-primary-foreground">Add your first deal</Button></Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {deals.map((d) => {
            const dd = daysUntil(d.closing_deadline);
            return (
              <Link key={d.id} to="/deals/$id" params={{ id: d.id }} className="glass rounded-2xl p-4 sm:p-5 hover:border-primary/40 transition shadow-elevated flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold truncate">{d.address}</span>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md ${STATUS_STYLE[d.status] ?? ""}`}>{d.status.replace("_", " ")}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 truncate">{[d.city, d.state, d.zip].filter(Boolean).join(", ")}</div>
                  <div className="text-sm number mt-2">{fmtMoney(d.asking_price)} · ARV {fmtMoney(d.arv)} · fee {fmtMoney(d.assignment_fee)}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-sm font-semibold number ${urgencyColor(dd)}`}>
                    {dd === null ? "—" : dd < 0 ? `${Math.abs(dd)}d over` : `${dd}d`}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">close</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
