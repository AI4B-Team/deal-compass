import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BuyerForm } from "@/components/BuyerForm";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Pencil, Phone, Mail } from "lucide-react";
import { fmtMoney } from "@/lib/format";
import { toast } from "sonner";
import { LinkedDealsPanel } from "@/components/LinkedDealsPanel";

export const Route = createFileRoute("/_authenticated/buyers/$id")({
  head: () => ({ meta: [{ title: "Buyer" }] }),
  component: BuyerDetail,
});

function BuyerDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);

  const load = () => {
    supabase.from("buyers").select("*").eq("id", id).single().then(({ data }) => setBuyer(data));
    supabase.from("deal_matches").select("*, deals(*)").eq("buyer_id", id).order("match_score", { ascending: false }).then(({ data }) => setMatches(data ?? []));
  };
  useEffect(load, [id]);

  const onDelete = async () => {
    if (!confirm("Delete this buyer?")) return;
    await supabase.from("buyers").delete().eq("id", id);
    toast.success("Buyer deleted");
    navigate({ to: "/buyers" });
  };

  if (!buyer) return <div className="text-sm text-muted-foreground">Loading…</div>;

  if (editing) {
    return (
      <div>
        <Link to="/buyers/$id" params={{ id }} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"><ArrowLeft className="w-3 h-3" /> Back</Link>
        <PageHeader title={`Edit ${buyer.name}`} />
        <BuyerForm initial={buyer} onSaved={() => { setEditing(false); load(); }} />
      </div>
    );
  }

  return (
    <div>
      <Link to="/buyers" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"><ArrowLeft className="w-3 h-3" /> All Buyers</Link>
      <PageHeader
        title={buyer.name}
        subtitle={buyer.company || undefined}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(true)}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
            <Button variant="ghost" onClick={onDelete} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 shadow-elevated">
          <h3 className="text-sm font-semibold mb-3">Contact</h3>
          <div className="space-y-2 text-sm">
            {buyer.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" />{buyer.phone}</div>}
            {buyer.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-muted-foreground" />{buyer.email}</div>}
            <div className="text-muted-foreground">Prefers: {buyer.preferred_contact_method}</div>
            <div className="text-muted-foreground">Tier: <span className="text-foreground font-semibold">{buyer.buyer_tier}</span></div>
            <div className="text-muted-foreground">Proof of funds: {buyer.proof_of_funds ? "Yes" : "No"}</div>
            <div className="text-muted-foreground">Bought: {buyer.deals_bought_count} deals</div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 lg:col-span-2 shadow-elevated">
          <h3 className="text-sm font-semibold mb-3">Buy-box</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Row label="Areas" v={(buyer.target_areas ?? []).join(", ") || "Any"} />
            <Row label="Property types" v={(buyer.property_types ?? []).join(", ") || "Any"} />
            <Row label="Price" v={`${fmtMoney(buyer.price_min)} – ${fmtMoney(buyer.price_max)}`} />
            <Row label="Strategy" v={(buyer.deal_types ?? []).join(", ") || "Any"} />
            <Row label="Condition" v={buyer.condition_tolerance ?? "Any"} />
            <Row label="Financing" v={buyer.financing_type ?? "—"} />
            <Row label="Min beds/baths" v={`${buyer.min_beds ?? "—"} / ${buyer.min_baths ?? "—"}`} />
            <Row label="Min sqft" v={buyer.min_sqft ?? "—"} />
            <Row label="ARV range" v={`${fmtMoney(buyer.arv_min)} – ${fmtMoney(buyer.arv_max)}`} />
            <Row label="Min spread" v={fmtMoney(buyer.min_spread)} />
          </div>
          {buyer.buy_box_notes && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Notes</div>
              <p className="text-sm whitespace-pre-wrap">{buyer.buy_box_notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 mt-4 shadow-elevated">
        <h3 className="text-sm font-semibold mb-3">Matched Deals ({matches.length})</h3>
        {matches.length === 0 ? (
          <p className="text-sm text-muted-foreground">No matches yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {matches.map((m) => (
              <Link key={m.id} to="/deals/$id" params={{ id: m.deal_id }} className="flex items-center justify-between py-3 hover:bg-[color:var(--surface-2)]/40 px-2 rounded">
                <div>
                  <div className="font-medium text-sm">{m.deals?.address}</div>
                  <div className="text-xs text-muted-foreground">{m.interest_status} · {m.match_reasons}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold number">{m.match_score}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">{m.match_tier}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <LinkedDealsPanel buyerId={id} />
      </div>
    </div>
  );
}

function Row({ label, v }: { label: string; v: any }) {
  return (
    <div className="flex justify-between gap-3 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{v}</span>
    </div>
  );
}
