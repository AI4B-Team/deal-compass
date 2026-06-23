import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Trash2, Pencil, Sparkles, Zap, Trophy, Copy, ChevronDown, ChevronRight, Send, Mail, MessageSquare } from "lucide-react";
import { fmtMoney, daysUntil, urgencyColor } from "@/lib/format";
import { rankBuyers, DEFAULT_WEIGHTS, type MatchResult } from "@/lib/matching";
import { TierBadge } from "@/components/TierBadge";
import { DealForm } from "@/components/DealForm";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { PropertyIntelligencePanel } from "@/components/PropertyIntelligencePanel";
import { useServerFn } from "@tanstack/react-start";
import { autoMarketDeal } from "@/lib/api/auto-market.functions";

export const Route = createFileRoute("/_authenticated/deals/$id")({
  head: () => ({ meta: [{ title: "Deal" }] }),
  component: DealDetail,
});

const INTEREST = ["not_contacted", "contacted", "interested", "offer_made", "passed", "no_response"];

function DealDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [outreach, setOutreach] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [running, setRunning] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [showStretch, setShowStretch] = useState(false);
  const autoMarket = useServerFn(autoMarketDeal);

  const load = useCallback(async () => {
    const { data: d } = await supabase.from("deals").select("*").eq("id", id).single();
    setDeal(d);
    const { data: m } = await supabase.from("deal_matches").select("*, buyers(*)").eq("deal_id", id).order("match_score", { ascending: false });
    setMatches(m ?? []);
    const { data: o } = await supabase.from("deal_outreach").select("*, buyers(name)").eq("deal_id", id).order("created_at", { ascending: false });
    setOutreach(o ?? []);
    const { data: s } = await supabase.from("user_settings").select("*").maybeSingle();
    setSettings(s);
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const runAutoMarket = async () => {
    if (!deal) return;
    if (matches.length === 0) { toast.error("Run matching first"); return; }
    setMarketing(true);
    try {
      const r = await autoMarket({ data: { dealId: id } });
      toast.success(`Outreach complete — ${r.sent} sent, ${r.drafted} drafted, ${r.skipped} skipped`);
      load();
    } catch (e: any) {
      toast.error(e.message ?? "Auto-marketing failed");
    } finally {
      setMarketing(false);
    }
  };

  const setOverride = async (val: boolean | null) => {
    await supabase.from("deals").update({ auto_market_override: val }).eq("id", id);
    load();
  };


  const findBuyers = async () => {
    if (!deal) return;
    setRunning(true);
    try {
      const { data: buyers } = await supabase.from("buyers").select("*").eq("status", "active");
      if (!buyers || buyers.length === 0) { toast.error("No buyers in list"); return; }
      const { data: settings } = await supabase.from("user_settings").select("*").maybeSingle();
      const weights = settings ? {
        price: settings.weight_price, strategy: settings.weight_strategy,
        condition: settings.weight_condition, spread: settings.weight_spread, size: settings.weight_size,
      } : DEFAULT_WEIGHTS;

      const results = rankBuyers(deal as any, buyers as any, weights);
      const { data: { user } } = await supabase.auth.getUser();

      // Upsert; preserve interest_status/notes/pitch if existing
      const { data: existing } = await supabase.from("deal_matches").select("*").eq("deal_id", id);
      const existingMap = new Map((existing ?? []).map((m: any) => [m.buyer_id, m]));

      const rows = results.map((r) => {
        const prev = existingMap.get(r.buyer_id);
        return {
          ...(prev ?? {}),
          user_id: user!.id,
          deal_id: id,
          buyer_id: r.buyer_id,
          match_score: r.score,
          match_tier: r.tier,
          match_reasons: r.reasons,
        };
      });
      const { error } = await supabase.from("deal_matches").upsert(rows, { onConflict: "deal_id,buyer_id" });
      if (error) throw error;
      toast.success(`Ranked ${results.length} buyers`);
      load();
    } catch (e: any) {
      toast.error(e.message ?? "Match failed");
    } finally {
      setRunning(false);
    }
  };

  const updateMatch = async (matchId: string, patch: any) => {
    const { error } = await supabase.from("deal_matches").update(patch).eq("id", matchId);
    if (error) toast.error(error.message);
    else load();
  };

  const generatePitch = async (m: any, channel: "text" | "email") => {
    try {
      toast.loading("Writing pitch…", { id: "pitch" });
      const { data, error } = await supabase.functions.invoke("generate-pitch", {
        body: { deal, buyer: m.buyers, reasons: m.match_reasons, channel },
      });
      if (error) throw error;
      await updateMatch(m.id, { generated_pitch: data.pitch, pitch_subject: data.subject_line ?? null });
      toast.success("Pitch ready", { id: "pitch" });
    } catch (e: any) {
      toast.error(e.message ?? "Pitch failed", { id: "pitch" });
    }
  };

  const markWinner = async (m: any) => {
    if (!confirm(`Mark ${m.buyers?.name} as the winning buyer?`)) return;
    const fee = prompt("Final assignment fee?", String(deal.assignment_fee ?? ""));
    await supabase.from("deal_matches").update({ is_winner: false }).eq("deal_id", id);
    await supabase.from("deal_matches").update({ is_winner: true, interest_status: "offer_made" }).eq("id", m.id);
    await supabase.from("deals").update({
      assigned_buyer_id: m.buyer_id,
      final_assignment_fee: fee ? Number(fee) : null,
      status: "assigned",
    }).eq("id", id);
    toast.success("Winner locked in");
    load();
  };

  const onDelete = async () => {
    if (!confirm("Delete this deal?")) return;
    await supabase.from("deals").delete().eq("id", id);
    navigate({ to: "/deals" });
  };

  if (!deal) return <div className="text-sm text-muted-foreground">Loading…</div>;

  if (editing) {
    return (
      <div>
        <Link to="/deals/$id" params={{ id }} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"><ArrowLeft className="w-3 h-3" /> Back</Link>
        <PageHeader title={`Edit Deal`} />
        <DealForm initial={deal} onSaved={() => { setEditing(false); load(); }} />
      </div>
    );
  }

  const dd = daysUntil(deal.closing_deadline);
  const ranked = matches.filter((m) => m.match_tier !== "Stretch");
  const stretched = matches.filter((m) => m.match_tier === "Stretch");
  const spread = deal.arv && deal.asking_price ? deal.arv - deal.asking_price - (deal.estimated_rehab ?? 0) : null;

  return (
    <div>
      <Link to="/deals" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"><ArrowLeft className="w-3 h-3" /> All Deals</Link>

      <div className="glass rounded-2xl p-5 sm:p-6 shadow-elevated mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">{deal.address}</h1>
            <div className="text-sm text-muted-foreground mt-1">{[deal.city, deal.state, deal.zip].filter(Boolean).join(", ")}</div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[color:var(--surface-2)]">{deal.status.replace("_", " ")}</span>
              {deal.intended_use && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[color:var(--surface-2)]">{deal.intended_use}</span>}
              {deal.condition && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[color:var(--surface-2)]">{deal.condition}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(true)}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
            <Button variant="ghost" onClick={onDelete} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <Metric label="Asking" v={fmtMoney(deal.asking_price)} />
          <Metric label="ARV" v={fmtMoney(deal.arv)} />
          <Metric label="Rehab" v={fmtMoney(deal.estimated_rehab)} />
          <Metric label="Spread" v={fmtMoney(spread)} accent />
          <Metric label="Closing" v={dd === null ? "—" : dd < 0 ? `${Math.abs(dd)}d over` : `${dd}d left`} cls={urgencyColor(dd)} />
        </div>
      </div>

      {/* Matching */}
      <div className="glass rounded-2xl shadow-elevated overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-semibold flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Buyer Matches</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Ranked deterministically against every buyer in your list.</p>
          </div>
          <Button onClick={findBuyers} disabled={running} className="grad-primary text-primary-foreground">
            <Zap className="w-4 h-4 mr-1" /> {running ? "Matching…" : matches.length ? "Re-Run Match" : "Find Buyers"}
          </Button>
        </div>

        {matches.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Click "Find Buyers" to score every buyer against this deal.</div>
        ) : (
          <div>
            <div className="divide-y divide-border">
              {ranked.map((m) => (
                <MatchRow key={m.id} m={m} onUpdate={updateMatch} onPitch={generatePitch} onWin={markWinner} />
              ))}
            </div>
            {stretched.length > 0 && (
              <div className="border-t border-border">
                <button onClick={() => setShowStretch(!showStretch)} className="w-full px-5 py-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  {showStretch ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  Stretch Matches ({stretched.length}) — close but failed a gate
                </button>
                {showStretch && (
                  <div className="divide-y divide-border">
                    {stretched.map((m) => <MatchRow key={m.id} m={m} onUpdate={updateMatch} onPitch={generatePitch} onWin={markWinner} />)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <PropertyIntelligencePanel address={deal.address} userId={deal.user_id} />
      </div>
    </div>
  );
}

function Metric({ label, v, accent, cls }: { label: string; v: any; accent?: boolean; cls?: string }) {
  return (
    <div className="bg-[color:var(--surface-2)]/60 rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-lg font-semibold number mt-0.5 ${cls ?? (accent ? "text-primary" : "")}`}>{v}</div>
    </div>
  );
}

function MatchRow({ m, onUpdate, onPitch, onWin }: { m: any; onUpdate: any; onPitch: any; onWin: any }) {
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<"text" | "email">("text");
  return (
    <div className={`p-4 sm:p-5 ${m.is_winner ? "bg-[color:var(--tier-a)]/10" : ""}`}>
      <div className="flex items-start gap-4">
        <div className="text-center shrink-0 w-14">
          <div className="text-2xl font-bold number">{m.match_score}</div>
          <TierBadge tier={m.match_tier} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/buyers/$id" params={{ id: m.buyer_id }} className="font-semibold hover:text-primary">{m.buyers?.name}</Link>
            {m.is_winner && <span className="inline-flex items-center gap-1 text-xs text-[color:var(--tier-a)] font-semibold"><Trophy className="w-3 h-3" /> Winner</span>}
          </div>
          {m.buyers?.company && <div className="text-xs text-muted-foreground">{m.buyers.company}</div>}
          <div className="text-xs text-muted-foreground mt-1.5">{m.match_reasons}</div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <Select value={m.interest_status} onValueChange={(v) => onUpdate(m.id, { interest_status: v, contacted_at: v !== "not_contacted" ? new Date().toISOString() : null })}>
            <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>{INTEREST.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setOpen(!open)}><Sparkles className="w-4 h-4 mr-1" /> Pitch</Button>
        </div>
      </div>

      {open && (
        <div className="mt-4 pl-0 sm:pl-[72px] space-y-3">
          <div className="flex items-center gap-2">
            <Select value={channel} onValueChange={(v: any) => setChannel(v)}>
              <SelectTrigger className="h-9 w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="text">Text</SelectItem><SelectItem value="email">Email</SelectItem></SelectContent>
            </Select>
            <Button size="sm" onClick={() => onPitch(m, channel)} className="grad-primary text-primary-foreground"><Sparkles className="w-4 h-4 mr-1" /> Generate</Button>
            {m.generated_pitch && (
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(m.generated_pitch); toast.success("Copied"); }}>
                <Copy className="w-4 h-4 mr-1" /> Copy
              </Button>
            )}
            {!m.is_winner && <Button size="sm" variant="outline" className="ml-auto" onClick={() => onWin(m)}><Trophy className="w-4 h-4 mr-1" /> Mark Winner</Button>}
          </div>
          {m.pitch_subject && <div className="text-xs"><span className="text-muted-foreground">Subject:</span> <span className="font-medium">{m.pitch_subject}</span></div>}
          {m.generated_pitch && <Textarea value={m.generated_pitch} onChange={(e) => onUpdate(m.id, { generated_pitch: e.target.value })} rows={6} className="text-sm" />}
        </div>
      )}
    </div>
  );
}
