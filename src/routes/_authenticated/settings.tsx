import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Zap } from "lucide-react";
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
    auto_market_enabled: false,
    auto_market_channels: "email",
    auto_market_target_mode: "top_n",
    auto_market_min_score: 70,
    auto_market_top_n: 10,
    auto_market_content_mode: "ai",
    auto_market_email_template: "",
    auto_market_sms_template: "",
    auto_market_trigger: "manual",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from("user_settings").select("*").maybeSingle().then(({ data }) => {
      if (data) setF((p: any) => ({ ...p, ...data }));
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
    else toast.success("Settings Saved");
  };

  if (!loaded) return null;
  const total = Number(f.weight_price) + Number(f.weight_strategy) + Number(f.weight_condition) + Number(f.weight_spread) + Number(f.weight_size);

  return (
    <div>
      <PageHeader title="Settings" subtitle="Tune the matching engine, branding, and auto-marketing." />
      <div className="space-y-6 max-w-3xl">
        <Section title="Market Defaults">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Default State"><Input value={f.default_state ?? ""} onChange={(e) => set("default_state", e.target.value)} /></Field>
            <Field label="Default Market"><Input value={f.default_market ?? ""} onChange={(e) => set("default_market", e.target.value)} /></Field>
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
          <Field label="Brand / Business Name"><Input value={f.brand_name ?? ""} onChange={(e) => set("brand_name", e.target.value)} /></Field>
          <div className="mt-4"><Field label="Signature (Added To Pitches)"><Textarea rows={3} value={f.signature ?? ""} onChange={(e) => set("signature", e.target.value)} /></Field></div>
        </Section>

        <Section
          title="Auto-Marketing"
          subtitle="Let Deal Compass automatically reach out to matched buyers — or keep it manual."
          accent
        >
          <div className="flex items-center justify-between p-3 rounded-xl bg-[color:var(--surface-2)]/60 mb-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold text-sm">Enable Auto-Marketing</div>
                <div className="text-xs text-muted-foreground">When off, you reach out manually from each deal page.</div>
              </div>
            </div>
            <Switch checked={!!f.auto_market_enabled} onCheckedChange={(v) => set("auto_market_enabled", v)} />
          </div>

          {f.auto_market_enabled && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Trigger">
                  <Select value={f.auto_market_trigger} onValueChange={(v) => set("auto_market_trigger", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on_create">Immediately On New Deal</SelectItem>
                      <SelectItem value="manual">Only When I Click Auto-Market</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Channels">
                  <Select value={f.auto_market_channels} onValueChange={(v) => set("auto_market_channels", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Only</SelectItem>
                      <SelectItem value="sms">SMS Only</SelectItem>
                      <SelectItem value="both">Email + SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Who To Reach">
                  <Select value={f.auto_market_target_mode} onValueChange={(v) => set("auto_market_target_mode", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top_n">Top N Buyers</SelectItem>
                      <SelectItem value="threshold">Above Score Threshold</SelectItem>
                      <SelectItem value="all">All Matched Buyers</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                {f.auto_market_target_mode === "top_n" && (
                  <Field label="How Many Buyers">
                    <Input type="number" min={1} max={500} value={f.auto_market_top_n} onChange={(e) => set("auto_market_top_n", Number(e.target.value))} />
                  </Field>
                )}
                {f.auto_market_target_mode === "threshold" && (
                  <Field label="Minimum Match Score">
                    <Input type="number" min={0} max={100} value={f.auto_market_min_score} onChange={(e) => set("auto_market_min_score", Number(e.target.value))} />
                  </Field>
                )}
              </div>

              <Field label="Message Style">
                <Select value={f.auto_market_content_mode} onValueChange={(v) => set("auto_market_content_mode", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai">AI-Generated Per Buyer</SelectItem>
                    <SelectItem value="template">Use My Templates Below</SelectItem>
                    <SelectItem value="both">AI Draft + My Template</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {(f.auto_market_content_mode === "template" || f.auto_market_content_mode === "both") && (
                <>
                  <Field label="Email Template (merge fields: {{buyer_name}}, {{address}}, {{price}}, {{arv}}, {{brand}}, {{signature}})">
                    <Textarea rows={5} value={f.auto_market_email_template ?? ""} onChange={(e) => set("auto_market_email_template", e.target.value)}
                      placeholder="Hi {{buyer_name}}, we just locked up {{address}}. Asking {{price}}, ARV {{arv}}. Let me know if you want the full packet. — {{signature}}" />
                  </Field>
                  <Field label="SMS Template">
                    <Textarea rows={3} value={f.auto_market_sms_template ?? ""} onChange={(e) => set("auto_market_sms_template", e.target.value)}
                      placeholder="New deal: {{address}} — asking {{price}}, ARV {{arv}}. Reply YES for packet. — {{brand}}" />
                  </Field>
                </>
              )}

              <div className="text-xs text-muted-foreground p-3 rounded-lg bg-[color:var(--surface-2)]/40">
                Email is sent via Resend and SMS via Twilio. If a provider isn't connected yet, messages are saved as <span className="font-semibold">drafted</span> on each deal so you can review and copy them.
              </div>
            </div>
          )}
        </Section>

        <div className="flex justify-end">
          <Button onClick={save} className="grad-primary text-primary-foreground"><Save className="w-4 h-4 mr-1" /> Save Settings</Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children, accent }: any) {
  return (
    <div className={`glass rounded-2xl p-5 shadow-elevated ${accent ? "ring-1 ring-primary/30" : ""}`}>
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
