import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Auto-Marketing pipeline.
 *
 * Selects matched buyers for a deal according to user settings (top N /
 * score threshold / all matches), generates outreach content (AI or
 * template), and dispatches via email / SMS. Each send is logged to
 * `deal_outreach`. If no email/SMS provider is connected, the message is
 * persisted with status='drafted' so the user can review/copy it later.
 */
export const autoMarketDeal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      dealId: z.string().uuid(),
      // dry_run=true generates + logs as 'drafted' regardless of provider
      dryRun: z.boolean().optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: deal, error: dealErr } = await supabase
      .from("deals")
      .select("*")
      .eq("id", data.dealId)
      .single();
    if (dealErr || !deal) throw new Error("Deal not found");

    const { data: settings } = await supabase
      .from("user_settings")
      .select("*")
      .maybeSingle();

    const channels = (settings?.auto_market_channels ?? "email") as
      | "email"
      | "sms"
      | "both";
    const targetMode = (settings?.auto_market_target_mode ?? "top_n") as
      | "all"
      | "threshold"
      | "top_n";
    const minScore = settings?.auto_market_min_score ?? 70;
    const topN = settings?.auto_market_top_n ?? 10;
    const contentMode = (settings?.auto_market_content_mode ?? "ai") as
      | "ai"
      | "template"
      | "both";
    const emailTpl = settings?.auto_market_email_template ?? null;
    const smsTpl = settings?.auto_market_sms_template ?? null;
    const brand = settings?.brand_name ?? "Our Team";
    const signature = settings?.signature ?? "";

    // Pull matches with buyer joined
    let q = supabase
      .from("deal_matches")
      .select("*, buyers(*)")
      .eq("deal_id", data.dealId)
      .order("match_score", { ascending: false });
    const { data: allMatches, error: mErr } = await q;
    if (mErr) throw mErr;
    let matches = (allMatches ?? []).filter((m: any) => m.match_tier !== "Stretch");

    if (targetMode === "threshold") {
      matches = matches.filter((m: any) => (m.match_score ?? 0) >= minScore);
    } else if (targetMode === "top_n") {
      matches = matches.slice(0, topN);
    }

    if (matches.length === 0) {
      return { ok: true, sent: 0, drafted: 0, skipped: 0, message: "No matched buyers met the targeting criteria." };
    }

    let sent = 0;
    let drafted = 0;
    let skipped = 0;
    const errors: string[] = [];

    const channelList: ("email" | "sms")[] =
      channels === "both" ? ["email", "sms"] : [channels];

    for (const m of matches) {
      const buyer = (m as any).buyers;
      if (!buyer) { skipped++; continue; }

      for (const ch of channelList) {
        const recipient =
          ch === "email" ? buyer.email ?? null : buyer.phone ?? null;
        if (!recipient) {
          skipped++;
          await supabase.from("deal_outreach").insert({
            user_id: userId,
            deal_id: data.dealId,
            buyer_id: buyer.id,
            channel: ch,
            recipient: null,
            status: "skipped_no_contact",
            match_score: m.match_score,
          });
          continue;
        }

        let subject: string | null = null;
        let body = "";

        try {
          if (contentMode === "template" && (ch === "email" ? emailTpl : smsTpl)) {
            body = renderTemplate(ch === "email" ? emailTpl! : smsTpl!, { deal, buyer, brand, signature });
            if (ch === "email") subject = `New Deal: ${deal.address}`;
          } else {
            const ai = await generateWithAI({ deal, buyer, channel: ch, brand, signature, reasons: m.match_reasons });
            subject = ai.subject;
            body = ai.body;
            // 'both' mode: if user also has a template, append a divider — keeps user-editable copy visible
            if (contentMode === "both" && (ch === "email" ? emailTpl : smsTpl)) {
              const tpl = renderTemplate(ch === "email" ? emailTpl! : smsTpl!, { deal, buyer, brand, signature });
              body = `${body}\n\n---\n${tpl}`;
            }
          }
        } catch (e: any) {
          errors.push(`AI/template failed for ${buyer.name}: ${e.message}`);
          body = `New deal at ${deal.address}. Asking ${deal.asking_price ?? "TBD"}. Reply if interested.`;
          if (ch === "email") subject = `New Deal: ${deal.address}`;
        }

        // Provider dispatch
        let status = "drafted";
        let errorMsg: string | null = null;

        if (!data.dryRun) {
          try {
            if (ch === "email") {
              const r = await trySendEmail({ to: recipient, subject: subject ?? "New Deal", body, brand });
              status = r.status;
              errorMsg = r.error;
            } else {
              const r = await trySendSms({ to: recipient, body });
              status = r.status;
              errorMsg = r.error;
            }
          } catch (e: any) {
            status = "failed";
            errorMsg = e.message;
          }
        }

        if (status === "sent") sent++;
        else if (status === "drafted") drafted++;
        else if (status.startsWith("skipped") || status === "failed") skipped++;

        await supabase.from("deal_outreach").insert({
          user_id: userId,
          deal_id: data.dealId,
          buyer_id: buyer.id,
          channel: ch,
          recipient,
          subject,
          body,
          status,
          error_message: errorMsg,
          match_score: m.match_score,
        });
      }
    }

    await supabase
      .from("deals")
      .update({
        auto_market_status: sent > 0 ? "sent" : drafted > 0 ? "drafted" : "skipped",
        auto_marketed_at: new Date().toISOString(),
      })
      .eq("id", data.dealId);

    return { ok: true, sent, drafted, skipped, errors };
  });

function renderTemplate(
  tpl: string,
  ctx: { deal: any; buyer: any; brand: string; signature: string },
) {
  const map: Record<string, string> = {
    "{{buyer_name}}": ctx.buyer.name ?? "there",
    "{{buyer_company}}": ctx.buyer.company ?? "",
    "{{address}}": ctx.deal.address ?? "",
    "{{city}}": ctx.deal.city ?? "",
    "{{state}}": ctx.deal.state ?? "",
    "{{price}}": ctx.deal.asking_price ? `$${Number(ctx.deal.asking_price).toLocaleString()}` : "TBD",
    "{{arv}}": ctx.deal.arv ? `$${Number(ctx.deal.arv).toLocaleString()}` : "TBD",
    "{{rehab}}": ctx.deal.estimated_rehab ? `$${Number(ctx.deal.estimated_rehab).toLocaleString()}` : "TBD",
    "{{beds}}": String(ctx.deal.beds ?? ""),
    "{{baths}}": String(ctx.deal.baths ?? ""),
    "{{sqft}}": String(ctx.deal.sqft ?? ""),
    "{{brand}}": ctx.brand,
    "{{signature}}": ctx.signature,
  };
  let out = tpl;
  for (const [k, v] of Object.entries(map)) out = out.split(k).join(v);
  return out;
}

async function generateWithAI(opts: {
  deal: any;
  buyer: any;
  channel: "email" | "sms";
  brand: string;
  signature: string;
  reasons: string | null;
}): Promise<{ subject: string | null; body: string }> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    return {
      subject: opts.channel === "email" ? `New Deal: ${opts.deal.address}` : null,
      body: `Hi ${opts.buyer.name}, ${opts.brand} just locked up ${opts.deal.address}. Asking ${opts.deal.asking_price ? `$${Number(opts.deal.asking_price).toLocaleString()}` : "TBD"}. Reply if interested.`,
    };
  }

  const sys =
    opts.channel === "email"
      ? "Write a concise, professional real-estate wholesale email pitch (120-180 words). Return JSON: {\"subject\": string, \"body\": string}. No markdown."
      : "Write a 1-2 sentence SMS pitch (max 320 chars) for a real-estate wholesale deal. Return JSON: {\"body\": string}. No emoji.";

  const user = `Brand: ${opts.brand}
Buyer: ${opts.buyer.name} (${opts.buyer.company ?? "—"}) — tier ${opts.buyer.buyer_tier}
Buyer focus: ${(opts.buyer.deal_types ?? []).join(", ")} in ${(opts.buyer.target_areas ?? []).join(", ")}
Deal: ${opts.deal.address}, ${opts.deal.city ?? ""} ${opts.deal.state ?? ""}
${opts.deal.beds ?? "?"}bd/${opts.deal.baths ?? "?"}ba ${opts.deal.sqft ?? "?"}sf
Asking: ${opts.deal.asking_price ?? "TBD"} | ARV: ${opts.deal.arv ?? "TBD"} | Rehab: ${opts.deal.estimated_rehab ?? "TBD"}
Why this is a fit: ${opts.reasons ?? "strong buy-box overlap"}
Signature: ${opts.signature || opts.brand}`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`AI gateway ${res.status}`);
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);
  return { subject: parsed.subject ?? null, body: parsed.body ?? "" };
}

async function trySendEmail(opts: { to: string; subject: string; body: string; brand: string }): Promise<{ status: string; error: string | null }> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!lovableKey || !resendKey) {
    return { status: "drafted", error: null };
  }
  try {
    const r = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from: `${opts.brand} <onboarding@resend.dev>`,
        to: [opts.to],
        subject: opts.subject,
        text: opts.body,
      }),
    });
    if (!r.ok) return { status: "failed", error: `Resend ${r.status}` };
    return { status: "sent", error: null };
  } catch (e: any) {
    return { status: "failed", error: e.message };
  }
}

async function trySendSms(opts: { to: string; body: string }): Promise<{ status: string; error: string | null }> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const twilioKey = process.env.TWILIO_API_KEY;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!lovableKey || !twilioKey || !from) {
    return { status: "drafted", error: null };
  }
  try {
    const r = await fetch("https://connector-gateway.lovable.dev/twilio/Messages.json", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": twilioKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: opts.to, From: from, Body: opts.body }),
    });
    if (!r.ok) return { status: "failed", error: `Twilio ${r.status}` };
    return { status: "sent", error: null };
  } catch (e: any) {
    return { status: "failed", error: e.message };
  }
}
