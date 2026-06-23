import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings" }] }),
  component: Settings,
});

function Settings() {
  const [f, setF] = useState<any>({
    default_state: "", default_market: "",
    weight_price: 30, weight_strategy: 25, weight_condition: 20, weight_spread: 15, weight_size: 10,
    signature: "", brand_name: "",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from("user_settings").select("*").maybeSingle().then(({ data }) => {
      if (data) setF(data);
      setLoaded(true);
    });
  }, []);

  const set = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const save = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const payload = { ...f, user_id: user!.id };
    delete payload.created_at; delete payload.updated_at;
    const { error } = await supabase.from("user_settings").upsert(payload, { onConflict: "user_id" });
    if (error) toast.error(error.message);
    else toast.success("Settings saved");
  };

  if (!loaded) return null;
  const total = Number(f.weight_price) + Number(f.weight_strategy) + Number(f.weight_condition) + Number(f.weight_spread) + Number(f.weight_size);

  return (
    <div>
      <PageHeader title="Settings" subtitle="Tune the matching engine and your pitch branding." />
      <div className="space-y-6 max-w-3xl">
        <Section title="Market Defaults">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Default state"><Input value={f.default_state ?? ""} onChange={(e) => set("default_state", e.target.value)} /></Field>
            <Field label="Default market"><Input value={f.default_market ?? ""} onChange={(e) => set("default_market", e.target.value)} /></Field>
          </div>
        </Section>

        <Section title="Match Weights" subtitle={`Total: ${total} (does not need to sum to 100)`}>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <Field label="Price"><Input type="number" value={f.weight_price} onChange={(e) => set("weight_price", Number(e.target.value))} /></Field>
            <Field label="Strategy"><Input type="number" value={f.weight_strategy} onChange={(e) => set("weight_strategy", Number(e.target.value))} /></Field>
            <Field label="Condition"><Input type="number" value={f.weight_condition} onChange={(e) => set("weight_condition", Number(e.target.value))} /></Field>
            <Field label="Spread"><Input type="number" value={f.weight_spread} onChange={(e) => set("weight_spread", Number(e.target.value))} /></Field>
            <Field label="Size"><Input type="number" value={f.weight_size} onChange={(e) => set("weight_size", Number(e.target.value))} /></Field>
          </div>
        </Section>

        <Section title="Pitch Branding">
          <Field label="Brand / business name"><Input value={f.brand_name ?? ""} onChange={(e) => set("brand_name", e.target.value)} /></Field>
          <div className="mt-4"><Field label="Signature (added to pitches)"><Textarea rows={3} value={f.signature ?? ""} onChange={(e) => set("signature", e.target.value)} /></Field></div>
        </Section>

        <div className="flex justify-end">
          <Button onClick={save} className="grad-primary text-primary-foreground"><Save className="w-4 h-4 mr-1" /> Save Settings</Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: any) {
  return (
    <div className="glass rounded-2xl p-5 shadow-elevated">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
function Field({ label, children }: any) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
