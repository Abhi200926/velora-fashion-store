/*
# Create brands and products tables for global brand catalog

## Purpose
Introduces a brand-aware product catalog backed by Supabase, enabling the store to feature
world-class brands (Nike, Apple, Gucci, etc.) alongside the existing hardcoded VELORA catalog.
Structured for easy expansion to hundreds of products.

## New Tables

### brands
- `id` (uuid, primary key)
- `slug` (text, unique) — URL-safe identifier e.g. "nike", "apple"
- `name` (text, not null) — display name e.g. "Nike"
- `description` (text) — brand overview
- `logo_url` (text) — brand logo image URL
- `cover_url` (text) — brand banner image URL
- `country` (text) — country of origin e.g. "USA"
- `category` (text) — brand category: 'fashion' | 'sportswear' | 'technology' | 'watches' | 'luxury'
- `created_at` (timestamptz, default now())

### products (brand-linked)
- `id` (integer, primary key, identity starting at 1000 to avoid collision with hardcoded IDs 1–100)
- `brand_id` (uuid, foreign key → brands.id, ON DELETE CASCADE)
- `brand_slug` (text, not null) — denormalized for easy filtering without joins
- `name` (text, not null)
- `description` (text)
- `price` (integer, not null) — current price in INR (paise not used; whole rupees)
- `original_price` (integer, not null) — MRP in INR
- `category` (text, not null) — maps to existing CategorySlug values
- `tags` (text[], default '{}')
- `image` (text) — primary product image URL
- `sizes` (text[], default '{}')
- `colors` (text[], default '{}')
- `rating` (numeric(2,1), default 0) — e.g. 4.7
- `review_count` (integer, default 0)
- `stock` (integer, default 0)
- `is_bestseller` (boolean, default false)
- `is_new_arrival` (boolean, default false)
- `is_luxury` (boolean, default false)
- `created_at` (timestamptz, default now())

## Security
- Single-tenant app (no sign-in screen). All policies use `TO anon, authenticated` so the
  anon-key frontend can read the public catalog.
- RLS enabled on both tables.
- Only SELECT is granted publicly (catalog is read-only from the frontend; inserts are done
  via migrations / service role).
- `USING (true)` is acceptable here because the catalog is intentionally public/shared data.

## Notes
1. The products identity sequence starts at 1000 so DB products never collide with the
   existing hardcoded product IDs (1–100) in src/data/products.ts.
2. brand_slug is denormalized onto products for efficient filtering without joins.
3. The existing hardcoded catalog is preserved as-is (the "backup"); DB products are merged
   in at runtime.
*/

-- ===== BRANDS =====
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  logo_url text,
  cover_url text,
  country text,
  category text NOT NULL DEFAULT 'fashion',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON brands TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_brands" ON brands;
CREATE POLICY "public_read_brands" ON brands FOR SELECT
  TO anon, authenticated USING (true);

-- ===== PRODUCTS =====
CREATE TABLE IF NOT EXISTS products (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE,
  brand_slug text NOT NULL,
  name text NOT NULL,
  description text,
  price integer NOT NULL,
  original_price integer NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  image text,
  sizes text[] DEFAULT '{}',
  colors text[] DEFAULT '{}',
  rating numeric(2,1) DEFAULT 0,
  review_count integer DEFAULT 0,
  stock integer DEFAULT 0,
  is_bestseller boolean DEFAULT false,
  is_new_arrival boolean DEFAULT false,
  is_luxury boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Start the identity sequence at 1000 to avoid collision with hardcoded IDs 1-100
ALTER TABLE products ALTER COLUMN id RESTART WITH 1000;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON products TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- Index for brand_slug filtering (brand pages and brand filters)
CREATE INDEX IF NOT EXISTS idx_products_brand_slug ON products(brand_slug);
-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);