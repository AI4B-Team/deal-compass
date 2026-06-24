import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fmtMoney, fmtNum } from "@/lib/format";
import { Building2, MapPin, Plus, Sparkles, ShieldCheck, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { TransactionDetailDialog } from "@/components/TransactionDetailDialog";

type Txn = {
  id: string;
  address: string;
  city: string | null;
  state: string | null;
  property_type: string | null;
  deal_type: string;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  purchase_price: number | null;
  purchase_date: string | null;
  sold_price: number | null;
  sold_date: string | null;
  arv_at_purchase: number | null;
  confidence: string;
};

const DEAL_TYPE_COLORS: Record<string, string> = {
  flip: "bg-[color:var(--primary-soft)] text-primary",
  rental: "bg-blue-100 text-blue-900",
  land: "bg-amber-100 text-amber-900",
  wholetail: "bg-emerald-100 text-emerald-900",
};

export function LinkedDealsPanel({ buyerId }: { buyerId: string }) {
  const [txns, setTxns] = useState<Txn[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openTxn, setOpenTxn] = useState<Txn | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: t }, { data: s }] = await Promise.all([
      supabase.from("buyer_transactions").select("*").eq("buyer_id", buyerId).order("purchase_date", { ascending: false }),
      supabase.from("buyer_portfolio_stats").select("*").eq("buyer_id", buyerId).maybeSingle(),
    ]);
    setTxns((t as any) ?? []);
    setStats(s);
    setLoading(false);
  };
  useEffect(() => { load(); }, [buyerId]);

  const filtered = filter === "all" ? txns : txns.filter((t) => t.deal_type === filter);

  const summary = stats
    ? `Closes a deal every ~${Math.round(Number(stats.avg_days_between_purchases) || 0)} days, mostly ${stats.main_property_type || "mixed"}${
        stats.avg_purchase_arv_pct ? ` at ${Math.round(Number(stats.avg_purchase_arv_pct) * 100)}% of ARV` : ""
      }.`
    : null;

  return (
    <div className="glass rounded-2xl shadow-elevated overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Linked Deals & Portfolio</h3>
          {summary && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-primary" /> {summary}
            </p>
          )}
        </div>
        <Button size="sm" variant="outline" onClick={() => setAdding(!adding)}>
          <Plus className="w-4 h-4 mr-1" /> Add Transaction
        </Button>
      </div>

      {/* Stat rail */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 px-5 py-4 bg-[color:var(--surface-2)]/40">
          <Stat label="Total" v={fmtNum(stats.total_count)} />
          <Stat label="Flips" v={fmtNum(stats.flip_count)} />
          <Stat label="Rentals" v={fmtNum(stats.rental_count)} />
          <Stat label="Land" v={fmtNum(stats.land_count)} />
          <Stat label="Portfolio" v={fmtMoney(stats.est_portfolio_value)} />
          <Stat label="Avg Purchase" v={fmtMoney(stats.avg_purchase_price)} />
        </div>
      )}

      {adding && <AddTxnForm buyerId={buyerId} onDone={() => { setAdding(false); load(); }} />}

      <div className="px-5 py-3 border-t border-border flex items-center gap-3">
        <span className="text-xs text-muted-foreground">Filter:</span>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="flip">Flips</SelectItem>
            <SelectItem value="rental">Rentals</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="wholetail">Wholetail</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} of {txns.length}</span>
      </div>

      {loading ? (
        <div className="p-8 text-sm text-muted-foreground text-center">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-sm text-muted-foreground text-center">No linked transactions yet.</div>
      ) : (
        <div className="divide-y divide-border">
          {filtered.map((t) => (
            <button key={t.id} onClick={() => setOpenTxn(t)} className="w-full text-left px-5 py-3 flex items-center justify-between gap-4 hover:bg-[color:var(--surface-2)]/40 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm flex items-center gap-2 flex-wrap">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{t.address}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${DEAL_TYPE_COLORS[t.deal_type] || "bg-muted text-muted-foreground"}`}>
                    {t.deal_type}
                  </span>
                  <ConfidenceBadge c={t.confidence} />
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {[t.city, t.state].filter(Boolean).join(", ")} · {t.beds ?? "—"}bd/{t.baths ?? "—"}ba · {fmtNum(t.sqft)} sqft
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold number">{fmtMoney(t.purchase_price)}</div>
                <div className="text-[10px] text-muted-foreground">{t.purchase_date ?? "—"}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <TransactionDetailDialog txn={openTxn} open={!!openTxn} onOpenChange={(v) => !v && setOpenTxn(null)} />
    </div>
  );
}

function Stat({ label, v }: { label: string; v: any }) {
  return (
    <div className="bg-card rounded-lg p-2.5 border border-border">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold number mt-0.5">{v}</div>
    </div>
  );
}

function ConfidenceBadge({ c }: { c: string }) {
  if (c === "verified") return <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded"><ShieldCheck className="w-2.5 h-2.5" /> Verified</span>;
  if (c === "estimated") return <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded"><Clock className="w-2.5 h-2.5" /> Estimated</span>;
  return <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"><AlertTriangle className="w-2.5 h-2.5" /> Stale</span>;
}

function AddTxnForm({ buyerId, onDone }: { buyerId: string; onDone: () => void }) {
  const [form, setForm] = useState({ address: "", city: "", state: "", deal_type: "flip", property_type: "single_family", purchase_price: "", purchase_date: "", days_on_market: "" });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!form.address) { toast.error("Address required"); return; }
    setSaving(true);
    const { error } = await supabase.from("buyer_transactions").insert({
      buyer_id: buyerId,
      address: form.address,
      city: form.city || null,
      state: form.state || null,
      deal_type: form.deal_type,
      property_type: form.property_type || null,
      purchase_price: form.purchase_price ? Number(form.purchase_price) : null,
      purchase_date: form.purchase_date || null,
      days_on_market: form.days_on_market ? Number(form.days_on_market) : null,
      confidence: "self_reported" as any,
      source: "self_reported",
    } as any);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Transaction added");
    onDone();
  };
  return (
    <div className="px-5 py-4 bg-[color:var(--surface-2)]/60 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-2">
      <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="col-span-2" />
      <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
      <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
      <Select value={form.deal_type} onValueChange={(v) => setForm({ ...form, deal_type: v })}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="flip">Flip</SelectItem>
          <SelectItem value="rental">Rental</SelectItem>
          <SelectItem value="land">Land</SelectItem>
          <SelectItem value="wholetail">Wholetail</SelectItem>
        </SelectContent>
      </Select>
      <Input placeholder="Purchase price" type="number" value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })} />
      <Input placeholder="Date" type="date" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} />
      <Input placeholder="Days on market" type="number" value={form.days_on_market} onChange={(e) => setForm({ ...form, days_on_market: e.target.value })} />
      <Button onClick={save} disabled={saving} className="grad-primary text-primary-foreground">{saving ? "Saving…" : "Save"}</Button>
    </div>
  );
}
