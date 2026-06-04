import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { fmtMoney, daysUntil, urgencyColor } from "@/lib/format";
import { Briefcase, Users, Plus, Clock, TrendingUp, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Disposition" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [deals, setDeals] = useState<any[]>([]);
  const [buyersCount, setBuyersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [d, b] = await Promise.all([
        supabase.from("deals").select("*").not("status", "in", "(closed,dead)").order("closing_deadline", { ascending: true, nullsFirst: false }),
        supabase.from("buyers").select("id", { count: "exact", head: true }),
      ]);
      setDeals(d.data ?? []);
      setBuyersCount(b.count ?? 0);
      setLoading(false);
    })();
  }, []);

  const activeCount = deals.length;
  const urgent = deals.filter((d) => {
    const dd = daysUntil(d.closing_deadline);
    return dd !== null && dd <= 7;
  }).length;
  const pipelineValue = deals.reduce((sum, d) => sum + (Number(d.assignment_fee) || 0), 0);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Your disposition pipeline — sorted by the clock."
        action={
          <Link to="/deals/new">
            <Button className="grad-primary text-primary-foreground hover:opacity-90">
              <Plus className="w-4 h-4 mr-1" /> New Deal
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8">
        <Stat icon={Briefcase} label="Active deals" value={activeCount} />
        <Stat icon={AlertCircle} label="Closing this week" value={urgent} accent={urgent > 0} />
        <Stat icon={Users} label="Buyers in list" value={buyersCount} />
        <Stat icon={TrendingUp} label="Pipeline value" value={fmtMoney(pipelineValue)} />
      </div>

      <div className="glass rounded-2xl overflow-hidden shadow-elevated">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Deals by deadline</h2>
          <Link to="/deals" className="text-xs text-muted-foreground hover:text-foreground">View all →</Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : deals.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No active deals yet.</p>
            <Link to="/deals/new"><Button className="grad-primary text-primary-foreground">Add your first deal</Button></Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {deals.slice(0, 8).map((d) => {
              const dd = daysUntil(d.closing_deadline);
              return (
                <Link key={d.id} to="/deals/$id" params={{ id: d.id }} className="flex items-center justify-between p-4 hover:bg-[color:var(--surface-2)]/50 transition">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{d.address}</div>
                    <div className="text-xs text-muted-foreground truncate">{[d.city, d.state].filter(Boolean).join(", ")} · {fmtMoney(d.asking_price)} · {d.status}</div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <div className={`text-sm font-semibold number ${urgencyColor(dd)}`}>
                      {dd === null ? "No deadline" : dd < 0 ? `${Math.abs(dd)}d overdue` : `${dd}d left`}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">closing</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: any; accent?: boolean }) {
  return (
    <div className="glass rounded-2xl p-4 lg:p-5 shadow-elevated">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl lg:text-3xl font-semibold number">{value}</div>
    </div>
  );
}
