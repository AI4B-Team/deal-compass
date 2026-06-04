// AI edge function: write a personalized pitch for a matched buyer about a specific deal.
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { deal, buyer, reasons, channel } = await req.json();
    if (!deal || !buyer) {
      return new Response(JSON.stringify({ error: "deal and buyer required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const isText = channel === "text";

    const systemPrompt = `You write disposition pitches for a real estate wholesaler reaching out to a known cash buyer about a deal that fits their buy-box.

Voice: direct-response, confident, personable, NO fluff. Lead with why it fits THEIR box. Numbers first. Short paragraphs.
${isText ? "Channel: SMS / text. 2-4 short sentences max. No subject line. Casual, friendly, like texting a buyer you know." : "Channel: email. 4-7 sentences. Crisp subject. Professional but warm. Sign off naturally."}

Output ONLY valid JSON, no prose or fences:
{ "pitch": string, "subject_line": ${isText ? "null" : "string"} }`;

    const userPrompt = `BUYER
Name: ${buyer.name}${buyer.company ? ` (${buyer.company})` : ""}
Their box: areas=${(buyer.target_areas ?? []).join(", ") || "any"} | types=${(buyer.property_types ?? []).join(", ") || "any"} | $${buyer.price_min ?? "?"}–$${buyer.price_max ?? "?"} | strategy=${(buyer.deal_types ?? []).join(", ")} | condition=${buyer.condition_tolerance} | min spread=$${buyer.min_spread ?? "?"}

DEAL
${deal.address}, ${[deal.city, deal.state, deal.zip].filter(Boolean).join(", ")}
${deal.property_type ?? ""} · ${deal.beds ?? "?"}/${deal.baths ?? "?"} · ${deal.sqft ?? "?"} sqft · ${deal.condition ?? ""} condition
Asking: $${deal.asking_price ?? "?"} | ARV: $${deal.arv ?? "?"} | Rehab: $${deal.estimated_rehab ?? "?"} | Closing: ${deal.closing_deadline ?? "TBD"}
${deal.description ? `Notes: ${deal.description}` : ""}

WHY IT FITS THEIR BOX
${reasons ?? ""}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway:", resp.status, t);
      if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits needed" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await resp.json();
    let content: string = data.choices?.[0]?.message?.content ?? "{}";
    content = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    const out = JSON.parse(content);

    return new Response(JSON.stringify(out), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
