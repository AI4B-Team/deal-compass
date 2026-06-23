import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fmtMoney, fmtNum } from "@/lib/format";
import { Home, User, Receipt, Mail, PiggyBank, History, ShieldCheck, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function PropertyIntelligencePanel({ address, userId }: { address: string; userId: string | null }) {
  const [record, setRecord] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("property_records").select("*").eq("address", address).maybeSingle();
    setRecord(data);
    if (data?.id) {
      const { data: h } = await supabase.from("property_transaction_history").select("*").eq("property_record_id", data.id).order("sale_date", { ascending: false });
      setHistory(h ?? []);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, [address]);

  const createRecord = async () => {
    if (!userId) return;
    setCreating(true);
    const { error } = await supabase.from("property_records").insert({ user_id: userId, address, data_source: "manual", last_synced_at: new Date().toISOString() } as any);
    setCreating(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Property record created");
    load();
  };

  if (loading) return <div className="glass rounded-2xl p-5 text-sm text-muted-foreground">Loading property intel…</div>;

  if (!record) {
    return (
      <div className="glass rounded-2xl p-5 shadow-elevated">
        <h3 className="font-semibold flex items-center gap-2 mb-2"><Home className="w-4 h-4 text-primary" /> Property Intelligence</h3>
        <p className="text-sm text-muted-foreground mb-3">No record on file for this address yet. Create a blank one and start filling in owner / tax / mortgage data.</p>
        <Button size="sm" onClick={createRecord} disabled={creating} className="grad-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> {creating ? "Creating…" : "Create Property Record"}
        </Button>
      </div>
    );
  }

  const equity = (Number(record.est_current_value) || 0) - (Number(record.loan_balance_est) || 0);
  const equityPct = record.est_current_value ? Math.max(0, Math.min(100, (equity / Number(record.est_current_value)) * 100)) : 0;

  return (
    <div className="glass rounded-2xl shadow-elevated overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-semibold flex items-center gap-2"><Home className="w-4 h-4 text-primary" /> Property Intelligence</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{record.address}</p>
        </div>
        <FreshnessBadge syncedAt={record.last_synced_at} />
      </div>

      <div className="grid sm:grid-cols-2 gap-px bg-border">
        <Section title="Property Details" icon={Home}>
          <Row k="APN" v={record.apn} />
          <Row k="County" v={record.county} />
          <Row k="Beds / Baths" v={`${record.beds ?? "—"} / ${record.baths ?? "—"}`} />
          <Row k="Sqft" v={fmtNum(record.sqft)} />
          <Row k="Year Built" v={record.year_built} />
        </Section>

        <Section title="Owner" icon={User}>
          <Row k="Entity" v={record.owner_entity} />
          <Row k="Absentee" v={record.is_absentee_owner ? "Yes" : record.is_absentee_owner === false ? "No" : "—"} />
          <Row k="Mailing" v={record.owner_mailing_address} />
          <Row k="Last Purchase" v={`${fmtMoney(record.last_purchase_price)} · ${record.last_purchase_date ?? "—"}`} />
        </Section>

        <Section title="Tax Records" icon={Receipt}>
          <Row k="Assessment" v={fmtMoney(record.last_assessment)} />
          <Row k="Assessment Year" v={record.last_assessment_year} />
          <Row k="Annual Tax" v={fmtMoney(record.annual_property_tax)} />
        </Section>

        <Section title="Mortgage & Equity" icon={PiggyBank} badge="live est.">
          <Row k="Loan Amount" v={fmtMoney(record.loan_amount)} />
          <Row k="Balance Est." v={fmtMoney(record.loan_balance_est)} />
          <Row k="Rate Est." v={record.interest_rate_est ? `${record.interest_rate_est}%` : "—"} />
          <Row k="Lender" v={record.lender_name} />
          {record.est_current_value && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Equity</span>
                <span className="font-semibold number">{fmtMoney(equity)}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full grad-primary" style={{ width: `${equityPct}%` }} />
              </div>
            </div>
          )}
        </Section>
      </div>

      {history.length > 0 && (
        <div className="border-t border-border">
          <div className="px-5 py-3 flex items-center gap-2 text-sm font-semibold">
            <History className="w-4 h-4 text-primary" /> Transaction History
          </div>
          <div className="divide-y divide-border">
            {history.map((h) => (
              <div key={h.id} className="px-5 py-2.5 flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{h.sale_type || "Sale"}</div>
                  <div className="text-xs text-muted-foreground">{h.seller_name} → {h.buyer_name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold number">{fmtMoney(h.price)}</div>
                  <div className="text-xs text-muted-foreground">{h.sale_date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, icon: Icon, badge, children }: any) {
  return (
    <div className="bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <h4 className="text-xs font-semibold uppercase tracking-wider">{title}</h4>
        {badge && <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[color:var(--primary-soft)] text-primary">{badge}</span>}
      </div>
      <div className="space-y-1 text-sm">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: any }) {
  return (
    <div className="flex justify-between gap-2 py-0.5">
      <span className="text-muted-foreground text-xs">{k}</span>
      <span className="font-medium text-right text-xs">{v ?? "—"}</span>
    </div>
  );
}

function FreshnessBadge({ syncedAt }: { syncedAt: string | null }) {
  if (!syncedAt) return <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded"><Clock className="w-3 h-3" /> Never synced</span>;
  const days = Math.floor((Date.now() - new Date(syncedAt).getTime()) / 86400000);
  if (days < 7) return <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded"><ShieldCheck className="w-3 h-3" /> Fresh ({days}d)</span>;
  if (days < 30) return <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-1 rounded"><Clock className="w-3 h-3" /> {days}d old</span>;
  return <span className="inline-flex items-center gap-1 text-[10px] text-destructive bg-destructive/10 px-2 py-1 rounded"><Clock className="w-3 h-3" /> Stale ({days}d)</span>;
}
