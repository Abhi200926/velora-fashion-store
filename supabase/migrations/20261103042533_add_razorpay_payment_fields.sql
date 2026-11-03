/*
# Add Razorpay payment tracking fields

## Purpose
Adds server-controlled fields needed to connect LUXORA orders to Razorpay Test Mode.
The browser never stores card, CVV, UPI PIN, or Razorpay secret data. Razorpay order
creation, signature verification, and webhook updates happen in Supabase Edge Functions.

## Modified Table

### orders
- `payment_provider` (text) — provider identifier such as `razorpay` or `cod`.
- `provider_order_id` (text) — Razorpay order ID, when an online payment is created.
- `provider_payment_id` (text) — verified Razorpay payment ID.
- `provider_signature` (text) — verified payment signature for auditability.
- `payment_error` (text) — safe status message for a failed attempt.
- `payment_attempts` (integer) — count of server-created payment attempts.
- `paid_at` (timestamptz) — set only after server-side verification.

## Security
- Add a unique index for provider order IDs to prevent duplicate provider orders.
- Remove direct authenticated UPDATE access to orders so payment status cannot be changed from the browser.
- Keep service-role access for the payment Edge Functions.
*/

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_provider text NOT NULL DEFAULT 'cod';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS provider_order_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS provider_payment_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS provider_signature text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_error text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_attempts integer NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS orders_provider_order_id_key
  ON orders(provider_order_id)
  WHERE provider_order_id IS NOT NULL;

REVOKE UPDATE ON orders FROM authenticated;
GRANT SELECT, INSERT ON orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO service_role;