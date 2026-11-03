import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const encoder = new TextEncoder();

async function signatureFor(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(bytes)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const secret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!secret) return json({ error: "Payment gateway is not configured yet." }, 503);

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return json({ error: "Sign in is required before payment." }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: userData } = await userClient.auth.getUser(token);
    if (!userData.user) return json({ error: "Sign in is required before payment." }, 401);

    const body = await req.json() as { orderId?: string; razorpayOrderId?: string; razorpayPaymentId?: string; razorpaySignature?: string };
    if (!body.orderId || !body.razorpayOrderId || !body.razorpayPaymentId || !body.razorpaySignature) return json({ error: "Payment verification details are incomplete." }, 400);

    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: order } = await admin.from("orders").select("id, user_id, provider_order_id, payment_status").eq("id", body.orderId).eq("user_id", userData.user.id).maybeSingle();
    if (!order || order.provider_order_id !== body.razorpayOrderId) return json({ error: "Payment order could not be verified." }, 400);
    if (order.payment_status === "paid") return json({ verified: true });

    const expected = await signatureFor(secret, `${body.razorpayOrderId}|${body.razorpayPaymentId}`);
    if (expected !== body.razorpaySignature) {
      await admin.from("orders").update({ payment_status: "failed", payment_error: "Signature verification failed.", updated_at: new Date().toISOString() }).eq("id", order.id);
      return json({ error: "Payment verification failed." }, 400);
    }

    const { error } = await admin.from("orders").update({
      payment_status: "paid",
      status: "confirmed",
      provider_payment_id: body.razorpayPaymentId,
      provider_signature: body.razorpaySignature,
      payment_error: null,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq("id", order.id).neq("payment_status", "paid");
    if (error) return json({ error: "Payment status could not be saved." }, 500);
    return json({ verified: true });
  } catch (_error) {
    return json({ error: "Payment verification failed." }, 500);
  }
});
