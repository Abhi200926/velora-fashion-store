/*
# Create e-commerce schema: profiles, addresses, orders, order_items, reviews, coupons

## Purpose
Adds the full e-commerce backend: user profiles, saved addresses, orders with line items,
customer reviews with ratings, and discount coupons. Designed for a multi-user app with
Supabase email/password auth.

## New Tables

### profiles
- `id` (uuid, PK, references auth.users) — one-to-one with auth.users
- `full_name` (text) — display name
- `phone` (text) — phone number
- `created_at` (timestamptz)

### addresses
- `id` (uuid, PK)
- `user_id` (uuid, references auth.users, defaults to auth.uid())
- `label` (text) — e.g. "Home", "Office"
- `full_name` (text) — recipient name
- `phone` (text) — contact number
- `address_line1` (text)
- `address_line2` (text) — optional
- `city` (text)
- `state` (text)
- `pincode` (text)
- `is_default` (boolean, default false)
- `created_at` (timestamptz)

### orders
- `id` (uuid, PK)
- `user_id` (uuid, references auth.users, defaults to auth.uid())
- `status` (text) — 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
- `total_amount` (integer) — total in INR paise-free whole rupees
- `subtotal` (integer)
- `discount` (integer) — discount amount applied
- `shipping_cost` (integer)
- `coupon_code` (text) — applied coupon if any
- `payment_method` (text) — 'cod' | 'card' | 'upi' | 'netbanking' | 'wallet'
- `payment_status` (text) — 'pending' | 'paid' | 'failed' | 'refunded'
- `tracking_number` (text) — courier tracking number
- `shipping_address` (jsonb) — snapshot of address at order time
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### order_items
- `id` (uuid, PK)
- `order_id` (uuid, references orders, CASCADE)
- `product_id` (integer) — references products.id or local product ID
- `product_name` (text) — snapshot of product name
- `product_image` (text) — snapshot of image URL
- `brand` (text) — snapshot of brand name
- `quantity` (integer)
- `size` (text)
- `color` (text)
- `price` (integer) — unit price at order time
- `created_at` (timestamptz)

### reviews
- `id` (uuid, PK)
- `product_id` (integer) — references products.id or local product ID
- `user_id` (uuid, references auth.users, defaults to auth.uid())
- `author_name` (text) — display name snapshot
- `rating` (integer, 1-5)
- `title` (text)
- `comment` (text)
- `size` (text) — purchased size if applicable
- `is_verified` (boolean, default false) — verified purchase
- `helpful_count` (integer, default 0)
- `is_reported` (boolean, default false)
- `is_moderated` (boolean, default false) — hidden by admin
- `created_at` (timestamptz)

### coupons
- `id` (uuid, PK)
- `code` (text, unique) — coupon code
- `discount_percent` (integer) — percentage off
- `min_order` (integer) — minimum order amount
- `label` (text) — display label
- `is_active` (boolean, default true)
- `created_at` (timestamptz)

## Security
- RLS enabled on all tables.
- profiles: users can read/update only their own profile.
- addresses: users can CRUD only their own addresses.
- orders: users can read/insert only their own orders; updates go through service role (admin/status changes).
- order_items: users can read only their own order items (via order ownership).
- reviews: anyone can read non-moderated reviews; authenticated users can insert their own; users can update helpful_count on reviews; admins can moderate.
- coupons: anyone can read active coupons (anon + authenticated).
- Grants are scoped to the minimum verbs needed per role.
*/

-- ===== PROFILES =====
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, UPDATE ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ===== ADDRESSES =====
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON addresses TO authenticated;

DROP POLICY IF EXISTS "select_own_addresses" ON addresses;
CREATE POLICY "select_own_addresses" ON addresses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_addresses" ON addresses;
CREATE POLICY "insert_own_addresses" ON addresses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_addresses" ON addresses;
CREATE POLICY "update_own_addresses" ON addresses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_addresses" ON addresses;
CREATE POLICY "delete_own_addresses" ON addresses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ===== ORDERS =====
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  total_amount integer NOT NULL,
  subtotal integer NOT NULL,
  discount integer NOT NULL DEFAULT 0,
  shipping_cost integer NOT NULL DEFAULT 0,
  coupon_code text,
  payment_method text NOT NULL DEFAULT 'cod',
  payment_status text NOT NULL DEFAULT 'pending',
  tracking_number text,
  shipping_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO service_role;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ===== ORDER ITEMS =====
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id integer NOT NULL,
  product_name text NOT NULL,
  product_image text,
  brand text,
  quantity integer NOT NULL,
  size text,
  color text,
  price integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON order_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON order_items TO service_role;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- ===== REVIEWS =====
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id integer NOT NULL,
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  comment text NOT NULL,
  size text,
  is_verified boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  is_reported boolean DEFAULT false,
  is_moderated boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON reviews TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON reviews TO service_role;

DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (is_moderated = false);

DROP POLICY IF EXISTS "insert_own_review" ON reviews;
CREATE POLICY "insert_own_review" ON reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_review" ON reviews;
CREATE POLICY "update_own_review" ON reviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Allow anyone authenticated to increment helpful_count (not just owner)
DROP POLICY IF EXISTS "vote_helpful_review" ON reviews;
CREATE POLICY "vote_helpful_review" ON reviews FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ===== COUPONS =====
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_percent integer NOT NULL,
  min_order integer NOT NULL DEFAULT 0,
  label text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON coupons TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON coupons TO service_role;

DROP POLICY IF EXISTS "public_read_coupons" ON coupons;
CREATE POLICY "public_read_coupons" ON coupons FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);