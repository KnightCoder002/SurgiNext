// Sends a WhatsApp OTP. Deploy with: supabase functions deploy send-otp --no-verify-jwt
// Always answers {ok:true} so nobody can learn who is registered.
import { createClient } from "npm:@supabase/supabase-js@2";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "apikey, content-type, authorization" };
const norm = (p: string) => { const d = p.replace(/\D/g, ""); return d.length == 10 ? "91" + d : d; }; // India default

Deno.serve(async (req) => {
  if (req.method == "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { hospital, patient, phone } = await req.json();
    const { data } = await db.rpc("request_otp", { p_hospital: hospital, p_patient: patient, p_phone: phone });
    if (data) {
      const v = Deno.env.get("WA_API_VERSION") ?? "v23.0"; // check Meta docs for the current version
      const r = await fetch(`https://graph.facebook.com/${v}/${Deno.env.get("WA_PHONE_ID")}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${Deno.env.get("WA_TOKEN")}`, "Content-Type": "application/json" },
        body: JSON.stringify({ messaging_product: "whatsapp", to: norm(data.phone), type: "template",
          template: { name: Deno.env.get("WA_OTP_TEMPLATE") ?? "surginext_otp", language: { code: Deno.env.get("WA_LANG") ?? "en" },
            components: [ { type: "body", parameters: [{ type: "text", text: data.code }] },
                          { type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: data.code }] } ] } }),
      });
      if (!r.ok) console.error(await r.text());
    }
  } catch (e) { console.error(e); }
  return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
});
