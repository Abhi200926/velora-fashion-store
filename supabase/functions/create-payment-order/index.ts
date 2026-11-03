import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const encoder = new TextEncoder();

async function hmacSha256(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const keyId = Deno.env.get("RAZORPAY_KEY_ID");
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!keyId || !keySecret) return json({ error: "Payment gateway is not configured yet." }, 503);

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) return json({ error: "Sign in is required before payment." }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: userData } = await userClient.auth.getUser(token);
    if (!userData.user) return json({ error: "Sign in is required before payment." }, 401);

    const { orderId } = await req.json() as { orderId?: string };
    if (!orderId) return json({ error: "A valid order is required." }, 400);

    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: order, error: orderError } = await admin
      .from("orders")
      .select("id, user_id, total_amount, payment_status, provider_order_id, payment_attempts")
      .eq("id", orderId)
      .eq("user_id", userData.user.id)
      .maybeSingle();
    if (orderError || !order) return json({ error: "Order could not be found." }, 404);
    if (order.payment_status === "paid") return json({ error: "This order has already been paid." }, 409);
    if (order.provider_order_id) return json({ razorpayOrderId: order.provider_order_id, keyId, amount: order.total_amount * 100, currency: "INR" });

    const receipt = `luxora_${order.id.replaceAll("-", "").slice(0, 24)}`;
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: order.total_amount * 100, currency: "INR", receipt, payment_capture: 1 }),
    });
    if (!razorpayResponse.ok) return json({ error: "Payment gateway could not create a payment order." }, 502);

    const razorpayOrder = await razorpayResponse.json() as { id?: string; amount?: number; currency?: string };
    if (!razorpayOrder.id || !razorpayOrder.amount || !razorpayOrder.currency) return json({ error: "Payment gateway returned an invalid response." }, 502);

    const { error: updateError } = await admin.from("orders").update({
      payment_provider: "razorpay",
      provider_order_id: razorpayOrder.id,
      payment_attempts: (order.payment_attempts ?? 0) + 1,
      payment_error: null,
      updated_at: new Date().toISOString(),
    }).eq("id", order.id).is("provider_order_id", null);
    if (updateError) return json({ error: "Payment order could not be saved." }, 500);

    return json({ razorpayOrderId: razorpayOrder.id, keyId, amount: razorpayOrder.amount, currency: razorpayOrder.currency });
  } catch (_error) {
    return json({ error: "Payment order creation failed." }, 500);
  }
});
