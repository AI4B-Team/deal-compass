import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fmtMoney } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { TransactionDetailDialog } from "@/components/TransactionDetailDialog";
import { MapPin, ArrowRight } from "lucide-react";

export function BuyerPortfolioInline({ buyerId, subjectArvPct }: { buyerId: string; subjectArvPct?: number | null }) {
  const [stats, setStats] = useState<any | null>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [open, setOpen] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: s }, { data: t }] = await Promise.all([
        supabase.from("buyer_portfolio_stats").select("*").eq("buyer_id", buyerId).maybeSingle(),
        supabase
          .from("buyer_transactions")
          .select("*")
          .eq("buyer_id", buyerId)
          .order("purchase_date", { ascending: false })
          .limit(3),
      ]);
      setStats(s);
      setRecent((t as any[]) ?? []);
    })();
  }, [buyerId]);

  if (!stats && recent.length === 0) return null;

  return (
    <div className="mt-3 rounded-lg border border-border bg-[color:var(--surface-2)]/40 p-3">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          Track Record
        </div>
        {stats && (
          <div className="text-[11px] text-muted-foreground">
            <span className="text-foreground font-semibold">{stats.total_count}</span> deals ·
            avg <span className="text-foreground font-semibold">{fmtMoney(stats.avg_purchase_price)}</span>
          </div>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="text-xs text-muted-foreground">No linked transactions yet.</div>
      ) : (
        <div className="space-y-1">
          {recent.map((t) => (
            <button
              key={t.id}
              onClick={() => setOpen(t)}
              className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-card text-left text-xs group"
            >
              <span className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="truncate font-medium">{t.address}</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-card text-muted-foreground shrink-0">
                  {t.deal_type}
                </span>
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="number font-semibold">{fmtMoney(t.purchase_price)}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
              </span>
            </button>
          ))}
          {stats && stats.total_count > 3 && (
            <Link
              to="/buyers/$id"
              params={{ id: buyerId }}
              className="block text-[11px] text-primary hover:underline px-2 pt-1"
            >
              View all {stats.total_count} deals →
            </Link>
          )}
        </div>
      )}

      <TransactionDetailDialog txn={open} open={!!open} onOpenChange={(v) => !v && setOpen(null)} subjectArvPct={subjectArvPct} />
    </div>
  );
}
