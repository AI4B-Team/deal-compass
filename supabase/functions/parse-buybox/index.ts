// AI edge function: parse a free-text buy-box description into structured fields.
// Uses Lovable AI Gateway (no key needed by user).
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "text required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const systemPrompt = `You parse cash buyer "buy-box" descriptions for real estate wholesalers into structured JSON.
Output ONLY valid JSON. No prose, no markdown fences. Schema:
{
  "target_areas": string[],          // counties, cities, zips, or neighborhoods
  "property_types": string[],        // one of: sfr, multi, condo, townhouse, land, commercial
  "price_min": number|null,
  "price_max": number|null,
  "deal_types": string[],            // one of: flip, buy_hold, brrrr, turnkey
  "condition_tolerance": string,     // one of: any, turnkey, light, medium, heavy
  "min_beds": number|null,
  "min_baths": number|null,
  "min_sqft": number|null,
  "min_spread": number|null,
  "financing_type": string,          // cash, hard_money, both
  "parsed_summary": string
}
Use null for unknowns. Lowercase enum values. Strip $ and commas from numbers.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway:", resp.status, t);
      if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limited, try again shortly" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits needed" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await resp.json();
    let content: string = data.choices?.[0]?.message?.content ?? "{}";
    // strip fences if present
    content = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(content);

    return new Response(JSON.stringify({ parsed }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
