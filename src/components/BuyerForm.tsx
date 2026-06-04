import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Save } from "lucide-react";
import { toast } from "sonner";

type Buyer = any;

const PROPERTY_TYPES = ["sfr", "multi", "condo", "townhouse", "land", "commercial"];
const DEAL_TYPES = ["flip", "buy_hold", "brrrr", "turnkey"];
const TIERS = ["A", "B", "C"];
const CONDITIONS = ["any", "turnkey", "light", "medium", "heavy"];

export function BuyerForm({ initial, onSaved }: { initial?: Buyer; onSaved: (id: string) => void }) {
  const [f, setF] = useState<Buyer>(initial ?? {
    name: "", company: "", phone: "", email: "", preferred_contact_method: "text",
    target_areas: [], property_types: [], price_min: null, price_max: null,
    deal_types: [], condition_tolerance: "any", min_beds: null, min_baths: null, min_sqft: null,
    arv_min: null, arv_max: null, min_spread: null, financing_type: "cash",
    buy_box_notes: "", general_notes: "", buyer_tier: "B", proof_of_funds: false, status: "active",
  });
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);

  const set = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const aiParse = async () => {
    if (!f.buy_box_notes?.trim()) {
      toast.error("Write a buy-box description first");
      return;
    }
    setParsing(true);
    try {
      const { data, error } = await supabase.functions.invoke("parse-buybox", { body: { text: f.buy_box_notes } });
      if (error) throw error;
      const p = data?.parsed ?? data;
      setF((prev: any) => ({
        ...prev,
        target_areas: p.target_areas ?? prev.target_areas,
        property_types: p.property_types ?? prev.property_types,
        price_min: p.price_min ?? prev.price_min,
        price_max: p.price_max ?? prev.price_max,
        deal_types: p.deal_types ?? prev.deal_types,
        condition_tolerance: p.condition_tolerance ?? prev.condition_tolerance,
        min_beds: p.min_beds ?? prev.min_beds,
        min_baths: p.min_baths ?? prev.min_baths,
        min_sqft: p.min_sqft ?? prev.min_sqft,
        min_spread: p.min_spread ?? prev.min_spread,
        financing_type: p.financing_type ?? prev.financing_type,
      }));
      toast.success("Parsed — review the fields and save");
    } catch (e: any) {
      toast.error(e.message ?? "Parse failed");
    } finally {
      setParsing(false);
    }
  };

  const save = async () => {
    if (!f.name.trim()) { toast.error("Name required"); return; }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = { ...f, user_id: user!.id };
      delete (payload as any).id;
      delete (payload as any).created_at;
      delete (payload as any).updated_at;

      let id: string;
      if (initial?.id) {
        const { error } = await supabase.from("buyers").update(payload).eq("id", initial.id);
        if (error) throw error;
        id = initial.id;
      } else {
        const { data, error } = await supabase.from("buyers").insert(payload).select("id").single();
        if (error) throw error;
        id = data.id;
      }
      toast.success("Buyer saved");
      onSaved(id);
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const csvSet = (k: string, v: string) => set(k, v.split(",").map((x) => x.trim()).filter(Boolean));

  return (
    <div className="space-y-6">
      {/* Free-text + AI parse */}
      <div className="glass rounded-2xl p-5 shadow-elevated">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-semibold">Describe their buy-box (plain English)</Label>
          <Button type="button" size="sm" variant="outline" onClick={aiParse} disabled={parsing}>
            <Sparkles className="w-4 h-4 mr-1" /> {parsing ? "Parsing…" : "AI Parse"}
          </Button>
        </div>
        <Textarea value={f.buy_box_notes ?? ""} onChange={(e) => set("buy_box_notes", e.target.value)} rows={4}
          placeholder="e.g. Looking for 3/2 SFRs in Duval and Clay counties, $150k–$250k, light to medium rehab, BRRRR or flip, $30k min spread, cash buyer." />
      </div>

      {/* Contact */}
      <Section title="Contact">
        <Grid>
          <Field label="Name *"><Input value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Company"><Input value={f.company ?? ""} onChange={(e) => set("company", e.target.value)} /></Field>
          <Field label="Phone"><Input value={f.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label="Email"><Input type="email" value={f.email ?? ""} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Preferred contact">
            <Select value={f.preferred_contact_method ?? "text"} onValueChange={(v) => set("preferred_contact_method", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="text">Text</SelectItem><SelectItem value="email">Email</SelectItem><SelectItem value="call">Call</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field label="Tier">
            <Select value={f.buyer_tier} onValueChange={(v) => set("buyer_tier", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TIERS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </Grid>
      </Section>

      <Section title="Buy-box">
        <Grid>
          <Field label="Target areas (comma separated)" full>
            <Input value={(f.target_areas ?? []).join(", ")} onChange={(e) => csvSet("target_areas", e.target.value)} placeholder="Duval, Clay, 32256" />
          </Field>
          <Field label="Property types (comma separated)" full>
            <Input value={(f.property_types ?? []).join(", ")} onChange={(e) => csvSet("property_types", e.target.value)} placeholder={PROPERTY_TYPES.join(", ")} />
          </Field>
          <Field label="Deal types (comma separated)" full>
            <Input value={(f.deal_types ?? []).join(", ")} onChange={(e) => csvSet("deal_types", e.target.value)} placeholder={DEAL_TYPES.join(", ")} />
          </Field>
          <Field label="Price min"><Input type="number" value={f.price_min ?? ""} onChange={(e) => set("price_min", e.target.value ? Number(e.target.value) : null)} /></Field>
          <Field label="Price max"><Input type="number" value={f.price_max ?? ""} onChange={(e) => set("price_max", e.target.value ? Number(e.target.value) : null)} /></Field>
          <Field label="Condition tolerance">
            <Select value={f.condition_tolerance ?? "any"} onValueChange={(v) => set("condition_tolerance", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Financing">
            <Select value={f.financing_type ?? "cash"} onValueChange={(v) => set("financing_type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="hard_money">Hard money</SelectItem><SelectItem value="both">Both</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field label="Min beds"><Input type="number" value={f.min_beds ?? ""} onChange={(e) => set("min_beds", e.target.value ? Number(e.target.value) : null)} /></Field>
          <Field label="Min baths"><Input type="number" step="0.5" value={f.min_baths ?? ""} onChange={(e) => set("min_baths", e.target.value ? Number(e.target.value) : null)} /></Field>
          <Field label="Min sqft"><Input type="number" value={f.min_sqft ?? ""} onChange={(e) => set("min_sqft", e.target.value ? Number(e.target.value) : null)} /></Field>
          <Field label="ARV min"><Input type="number" value={f.arv_min ?? ""} onChange={(e) => set("arv_min", e.target.value ? Number(e.target.value) : null)} /></Field>
          <Field label="ARV max"><Input type="number" value={f.arv_max ?? ""} onChange={(e) => set("arv_max", e.target.value ? Number(e.target.value) : null)} /></Field>
          <Field label="Min spread"><Input type="number" value={f.min_spread ?? ""} onChange={(e) => set("min_spread", e.target.value ? Number(e.target.value) : null)} /></Field>
        </Grid>
      </Section>

      <Section title="Notes">
        <Field label="General notes" full><Textarea value={f.general_notes ?? ""} onChange={(e) => set("general_notes", e.target.value)} rows={3} /></Field>
      </Section>

      <div className="flex justify-end gap-2 sticky bottom-4">
        <Button onClick={save} disabled={saving} className="grad-primary text-primary-foreground hover:opacity-90 shadow-elevated">
          <Save className="w-4 h-4 mr-1" /> {saving ? "Saving…" : "Save buyer"}
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: any }) {
  return (
    <div className="glass rounded-2xl p-5 shadow-elevated">
      <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}
function Grid({ children }: { children: any }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>;
}
function Field({ label, children, full }: { label: string; children: any; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2 lg:col-span-3" : ""}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
