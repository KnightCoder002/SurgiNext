// Sends "follow-up is tomorrow" WhatsApp reminders. Called daily by pg_cron (see README). Deploy with --no-verify-jwt.
import { createClient } from "npm:@supabase/supabase-js@2";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const norm = (p: string) => { const d = p.replace(/\D/g, ""); return d.length == 10 ? "91" + d : d; };

Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== Deno.env.get("CRON_SECRET")) return new Response("no", { status: 401 });
  const tomorrow = new Date(Date.now() + 19800000 + 864e5).toISOString().slice(0, 10); // tomorrow in IST
  const { data } = await db.from("patients").select("id,name,phone,followup_date,hospitals(name)")
    .eq("followup_date", tomorrow).is("reminder_sent_at", null).not("consent_at", "is", null); // only patients who consented
  const v = Deno.env.get("WA_API_VERSION") ?? "v23.0";
  let sent = 0;
  for (const p of (data ?? []) as any[]) {
    const date = new Date(p.followup_date + "T00:00:00Z").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
    const r = await fetch(`https://graph.facebook.com/${v}/${Deno.env.get("WA_PHONE_ID")}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("WA_TOKEN")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: norm(p.phone), type: "template",
        template: { name: Deno.env.get("WA_REMINDER_TEMPLATE") ?? "surginext_followup", language: { code: Deno.env.get("WA_LANG") ?? "en" },
          components: [{ type: "body", parameters: [p.name, p.hospitals?.name ?? "the hospital", date].map((text) => ({ type: "text", text })) }] } }),
    });
    if (r.ok) { await db.from("patients").update({ reminder_sent_at: new Date().toISOString() }).eq("id", p.id); sent++; }
    else console.error(await r.text());
  }
  return new Response(JSON.stringify({ sent }), { headers: { "Content-Type": "application/json" } });
});
