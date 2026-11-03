import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const encoder = new TextEncoder();

async function signatureFor(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(bytes)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  try {
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    if (!webhookSecret) return new Response(JSON.stringify({ error: "Webhook is not configured." }), { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const rawBody = await req.text();
    const received = req.headers.get("x-razorpay-signature") ?? "";
    const expected = await signatureFor(webhookSecret, rawBody);
    if (received !== expected) return new Response(JSON.stringify({ error: "Invalid webhook signature." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const payload = JSON.parse(rawBody) as { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string; status?: string; error_description?: string } } } };
    const payment = payload.payload?.payment?.entity;
    if (!payment?.order_id) return new Response(JSON.stringify({ received: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const paid = payload.event === "payment.captured" || payload.event === "order.paid" || payment.status === "captured";
    const failed = payload.event === "payment.failed" || payment.status === "failed";
    const update = paid
      ? { payment_status: "paid", status: "confirmed", provider_payment_id: payment.id ?? null, payment_error: null, paid_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      : failed
        ? { payment_status: "failed", payment_error: payment.error_description ?? "Payment failed.", updated_at: new Date().toISOString() }
        : { updated_at: new Date().toISOString() };
    await admin.from("orders").update(update).eq("provider_order_id", payment.order_id).neq("payment_status", "paid");
    return new Response(JSON.stringify({ received: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (_error) {
    return new Response(JSON.stringify({ error: "Webhook processing failed." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
