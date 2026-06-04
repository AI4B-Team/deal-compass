import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { toast } from "sonner";

const PROPERTY_TYPES = ["sfr", "multi", "condo", "townhouse", "land", "commercial"];
const CONDITIONS = ["turnkey", "light", "medium", "heavy"];
const USES = ["flip", "rental", "either"];
const STATUSES = ["locked", "marketing", "under_assignment", "assigned", "closed", "dead"];

export function DealForm({ initial, onSaved }: { initial?: any; onSaved: (id: string) => void }) {
  const [f, setF] = useState<any>(initial ?? {
    address: "", city: "", state: "", zip: "", county: "",
    property_type: "sfr", beds: null, baths: null, sqft: null, year_built: null,
    condition: "medium", intended_use: "either",
    contract_price: null, assignment_fee: null, asking_price: null, arv: null, estimated_rehab: null,
    contract_date: null, inspection_deadline: null, closing_deadline: null,
    status: "locked", description: "", deal_notes: "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));
  const num = (k: string) => (e: any) => set(k, e.target.value ? Number(e.target.value) : null);

  const save = async () => {
    if (!f.address.trim()) { toast.error("Address required"); return; }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = { ...f, user_id: user!.id };
      delete payload.id; delete payload.created_at; delete payload.updated_at;
      let id: string;
      if (initial?.id) {
        const { error } = await supabase.from("deals").update(payload).eq("id", initial.id);
        if (error) throw error;
        id = initial.id;
      } else {
        const { data, error } = await supabase.from("deals").insert(payload).select("id").single();
        if (error) throw error;
        id = data.id;
      }
      toast.success("Deal saved");
      onSaved(id);
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Section title="Property">
        <Grid>
          <Field label="Address *" full><Input value={f.address} onChange={(e) => set("address", e.target.value)} /></Field>
          <Field label="City"><Input value={f.city ?? ""} onChange={(e) => set("city", e.target.value)} /></Field>
          <Field label="State"><Input value={f.state ?? ""} onChange={(e) => set("state", e.target.value)} /></Field>
          <Field label="Zip"><Input value={f.zip ?? ""} onChange={(e) => set("zip", e.target.value)} /></Field>
          <Field label="County"><Input value={f.county ?? ""} onChange={(e) => set("county", e.target.value)} /></Field>
          <Field label="Property type">
            <Select value={f.property_type ?? "sfr"} onValueChange={(v) => set("property_type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PROPERTY_TYPES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Beds"><Input type="number" value={f.beds ?? ""} onChange={num("beds")} /></Field>
          <Field label="Baths"><Input type="number" step="0.5" value={f.baths ?? ""} onChange={num("baths")} /></Field>
          <Field label="Sqft"><Input type="number" value={f.sqft ?? ""} onChange={num("sqft")} /></Field>
          <Field label="Year built"><Input type="number" value={f.year_built ?? ""} onChange={num("year_built")} /></Field>
          <Field label="Condition">
            <Select value={f.condition ?? "medium"} onValueChange={(v) => set("condition", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Intended use">
            <Select value={f.intended_use ?? "either"} onValueChange={(v) => set("intended_use", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{USES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </Grid>
      </Section>

      <Section title="Numbers">
        <Grid>
          <Field label="Contract price"><Input type="number" value={f.contract_price ?? ""} onChange={num("contract_price")} /></Field>
          <Field label="Assignment fee"><Input type="number" value={f.assignment_fee ?? ""} onChange={num("assignment_fee")} /></Field>
          <Field label="Asking price"><Input type="number" value={f.asking_price ?? ""} onChange={num("asking_price")} /></Field>
          <Field label="ARV"><Input type="number" value={f.arv ?? ""} onChange={num("arv")} /></Field>
          <Field label="Estimated rehab"><Input type="number" value={f.estimated_rehab ?? ""} onChange={num("estimated_rehab")} /></Field>
          <Field label="Status">
            <Select value={f.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </Grid>
      </Section>

      <Section title="The clock">
        <Grid>
          <Field label="Contract date"><Input type="date" value={f.contract_date ?? ""} onChange={(e) => set("contract_date", e.target.value || null)} /></Field>
          <Field label="Inspection deadline"><Input type="date" value={f.inspection_deadline ?? ""} onChange={(e) => set("inspection_deadline", e.target.value || null)} /></Field>
          <Field label="Closing deadline"><Input type="date" value={f.closing_deadline ?? ""} onChange={(e) => set("closing_deadline", e.target.value || null)} /></Field>
        </Grid>
      </Section>

      <Section title="Notes">
        <Field label="Description (used for pitches)" full><Textarea value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={3} /></Field>
        <div className="mt-4"><Field label="Internal deal notes" full><Textarea value={f.deal_notes ?? ""} onChange={(e) => set("deal_notes", e.target.value)} rows={2} /></Field></div>
      </Section>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} className="grad-primary text-primary-foreground hover:opacity-90 shadow-elevated">
          <Save className="w-4 h-4 mr-1" /> {saving ? "Saving…" : "Save deal"}
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
