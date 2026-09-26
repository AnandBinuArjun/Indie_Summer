-- ========================================================
-- INDIE SUMMER ATELIER — SUPABASE RLS HARDENING MIGRATION
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gqvmdrtlocvidjtiyycv/sql
-- ========================================================

-- 1. DROP EXISTING UNRESTRICTED POLICIES
DROP POLICY IF EXISTS "Allow public write on products" ON public.products;
DROP POLICY IF EXISTS "Allow public read on products" ON public.products;
DROP POLICY IF EXISTS "Allow public write on site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow public read on site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow public insert on bids" ON public.bids;
DROP POLICY IF EXISTS "Allow public read on bids" ON public.bids;
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read on orders" ON public.orders;

-- 2. ENSURE RLS IS ACTIVATED ON ALL TABLES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. PRODUCTS POLICIES
-- Anyone can view the catalogue
CREATE POLICY "Public can view products"
  ON public.products FOR SELECT
  USING (true);

-- Only authenticated atelier staff can create, edit or delete products
CREATE POLICY "Staff can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. SITE SETTINGS POLICIES
-- Anyone can read storefront announcements, headlines & configs
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- Only authenticated atelier staff can alter site settings
CREATE POLICY "Staff can manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. BIDS POLICIES
-- Anyone can view auction bids
CREATE POLICY "Public can view bids"
  ON public.bids FOR SELECT
  USING (true);

-- Public can place a bid, but must satisfy validation criteria (positive amount, valid bidder name, target product)
CREATE POLICY "Public can place validated bids"
  ON public.bids FOR INSERT
  WITH CHECK (
    amount_inr > 0 AND
    length(trim(bidder_name)) >= 2 AND
    product_id IS NOT NULL
  );

-- Only authenticated atelier staff can modify or delete bids
CREATE POLICY "Staff can manage bids"
  ON public.bids FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. ORDERS POLICIES (PII PROTECTION & GUEST CHECKOUT)
-- Guest shoppers can submit an order upon completing checkout
CREATE POLICY "Shoppers can submit checkout orders"
  ON public.orders FOR INSERT
  WITH CHECK (
    total_amount_inr > 0 AND
    length(trim(customer_name)) >= 2 AND
    length(trim(order_ref)) >= 6
  );

-- ONLY authenticated atelier staff can view customer orders and personal information
CREATE POLICY "Staff can view customer orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (true);

-- ONLY authenticated atelier staff can update order status (e.g. dispatched, delivered)
CREATE POLICY "Staff can update customer orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ONLY authenticated atelier staff can delete orders
CREATE POLICY "Staff can delete customer orders"
  ON public.orders FOR DELETE
  TO authenticated
  USING (true);
