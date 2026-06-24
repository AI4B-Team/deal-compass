import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { PageHeader } from "@/components/PageHeader";
import { Shield, Users, Briefcase, Building2, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fmtMoney, fmtNum } from "@/lib/format";
import { TransactionDetailDialog } from "@/components/TransactionDetailDialog";
import { InvestorTypeBadge } from "@/components/InvestorTypeBadge";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Back Office — Deal Compass" }] }),
  component: AdminPage,
});

type Tab = "buyers" | "deals" | "transactions";

function AdminPage() {
  const isAdmin = useIsAdmin();
  const [tab, setTab] = useState<Tab>("buyers");
  const [q, setQ] = useState("");
  const [buyers, setBuyers] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [txns, setTxns] = useState<any[]>([]);
  const [openTxn, setOpenTxn] = useState<any | null>(null);
  const [counts, setCounts] = useState({ buyers: 0, deals: 0, txns: 0, users: 0 });

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const [{ data: b }, { data: d }, { data: t }] = await Promise.all([
        supabase.from("buyers").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("deals").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("buyer_transactions").select("*, buyers(name)").order("purchase_date", { ascending: false }).limit(200),
      ]);
      setBuyers(b ?? []);
      setDeals(d ?? []);
      setTxns(t ?? []);
      const uniqueUsers = new Set([...(b ?? []), ...(d ?? [])].map((r: any) => r.user_id));
      setCounts({ buyers: (b ?? []).length, deals: (d ?? []).length, txns: (t ?? []).length, users: uniqueUsers.size });
    })();
  }, [isAdmin]);

  if (isAdmin === null) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center glass rounded-2xl p-8 shadow-elevated">
        <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <h1 className="text-xl font-semibold mb-2">Restricted</h1>
        <p className="text-sm text-muted-foreground">
          The Back Office is only available to admin users. If you need access, ask an existing admin
          to grant you the <span className="font-mono text-foreground">admin</span> role.
        </p>
      </div>
    );
  }

  const ql = q.toLowerCase();
  const fb = buyers.filter((b) => !q || b.name?.toLowerCase().includes(ql) || b.company?.toLowerCase().includes(ql));
  const fd = deals.filter((d) => !q || d.address?.toLowerCase().includes(ql) || d.city?.toLowerCase().includes(ql));
  const ft = txns.filter((t) => !q || t.address?.toLowerCase().includes(ql) || t.buyers?.name?.toLowerCase().includes(ql));

  return (
    <div>
      <PageHeader
        title="Back Office"
        subtitle="Admin-only view across every user, buyer, deal, and linked transaction."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard icon={Users} label="Buyers" v={counts.buyers} />
        <StatCard icon={Briefcase} label="Deals" v={counts.deals} />
        <StatCard icon={Building2} label="Transactions" v={counts.txns} />
        <StatCard icon={Shield} label="Active Users" v={counts.users} />
      </div>

      <div className="glass rounded-2xl shadow-elevated overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1">
            {(["buyers", "deals", "transactions"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="h-9 pl-8 w-[240px]" />
          </div>
        </div>

        {tab === "buyers" && (
          <div className="divide-y divide-border">
            {fb.map((b) => (
              <Link key={b.id} to="/buyers/$id" params={{ id: b.id }} className="flex items-center justify-between px-5 py-3 hover:bg-[color:var(--surface-2)]/40">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{b.name}</span>
                    <InvestorTypeBadge buyer={b} />
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[color:var(--surface-2)] text-muted-foreground">Tier {b.buyer_tier}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {b.company || "—"} · {b.deals_bought_count ?? 0} deals · user {b.user_id?.slice(0, 8)}…
                  </div>
                </div>
                <div className="text-right shrink-0 text-xs text-muted-foreground">
                  {fmtMoney(b.price_min)} – {fmtMoney(b.price_max)}
                </div>
              </Link>
            ))}
            {fb.length === 0 && <div className="p-8 text-sm text-muted-foreground text-center">No buyers match.</div>}
          </div>
        )}

        {tab === "deals" && (
          <div className="divide-y divide-border">
            {fd.map((d) => (
              <Link key={d.id} to="/deals/$id" params={{ id: d.id }} className="flex items-center justify-between px-5 py-3 hover:bg-[color:var(--surface-2)]/40">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium text-sm truncate">{d.address}</span>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[color:var(--surface-2)] text-muted-foreground">{d.status}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {[d.city, d.state].filter(Boolean).join(", ")} · user {d.user_id?.slice(0, 8)}…
                  </div>
                </div>
                <div className="text-right shrink-0 text-sm">
                  <div className="font-semibold number">{fmtMoney(d.asking_price)}</div>
                  <div className="text-[10px] text-muted-foreground">ARV {fmtMoney(d.arv)}</div>
                </div>
              </Link>
            ))}
            {fd.length === 0 && <div className="p-8 text-sm text-muted-foreground text-center">No deals match.</div>}
          </div>
        )}

        {tab === "transactions" && (
          <div className="divide-y divide-border">
            {ft.map((t) => (
              <button key={t.id} onClick={() => setOpenTxn(t)} className="w-full text-left flex items-center justify-between px-5 py-3 hover:bg-[color:var(--surface-2)]/40">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium text-sm truncate">{t.address}</span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[color:var(--primary-soft)] text-primary">{t.deal_type}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t.buyers?.name ?? "—"} · {[t.city, t.state].filter(Boolean).join(", ")} · {fmtNum(t.sqft)} sqft
                  </div>
                </div>
                <div className="text-right shrink-0 text-sm">
                  <div className="font-semibold number">{fmtMoney(t.purchase_price)}</div>
                  {t.sold_price && <div className="text-[10px] text-emerald-700 number">→ {fmtMoney(t.sold_price)}</div>}
                </div>
              </button>
            ))}
            {ft.length === 0 && <div className="p-8 text-sm text-muted-foreground text-center">No transactions match.</div>}
          </div>
        )}
      </div>

      <TransactionDetailDialog txn={openTxn} open={!!openTxn} onOpenChange={(v) => !v && setOpenTxn(null)} />
    </div>
  );
}

function StatCard({ icon: Icon, label, v }: { icon: any; label: string; v: any }) {
  return (
    <div className="glass rounded-2xl p-4 shadow-elevated">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="text-2xl font-bold number mt-1">{v}</div>
    </div>
  );
}
