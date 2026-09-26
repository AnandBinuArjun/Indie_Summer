-- =========================================================================
-- INDIE SUMMER ATELIER — PRODUCTION STORAGE, REALTIME & PATRON POLICIES
-- Execute in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gqvmdrtlocvidjtiyycv/sql
-- =========================================================================

-- 1. EXTEND BIDS TABLE FOR NOTIFICATIONS & CONTACT COORDINATES
ALTER TABLE public.bids 
  ADD COLUMN IF NOT EXISTS bidder_email TEXT,
  ADD COLUMN IF NOT EXISTS bidder_phone TEXT;

-- 2. ENABLE SUPABASE REALTIME REPLICATION
-- This allows instant WebSocket updates on all open screens when a bid is placed or product modified
DO $$
BEGIN
  -- Add bids table to supabase_realtime publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'bids'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;
  END IF;

  -- Add products table to supabase_realtime publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
END $$;

-- 3. CREATE STORAGE BUCKET 'product-images' (IF NOT EXISTS)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

-- 4. STORAGE ROW LEVEL SECURITY (RLS) POLICIES FOR 'product-images'
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow anyone on the web to view / download images from the global CDN
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow authenticated atelier staff / admins to upload images
DROP POLICY IF EXISTS "Staff can upload product images" ON storage.objects;
CREATE POLICY "Staff can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated atelier staff to update images
DROP POLICY IF EXISTS "Staff can update product images" ON storage.objects;
CREATE POLICY "Staff can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images');

-- Allow authenticated staff to delete product images
DROP POLICY IF EXISTS "Staff can delete product images" ON storage.objects;
CREATE POLICY "Staff can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- 5. PATRON WARDROBE RLS POLICY FOR ORDERS
-- In addition to staff seeing all orders, logged-in collectors can securely read their own acquisitions
DROP POLICY IF EXISTS "Patrons can view own orders" ON public.orders;
CREATE POLICY "Patrons can view own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    customer_email = auth.jwt() ->> 'email' 
    OR (auth.jwt() ->> 'email') LIKE '%@indiesummer.in'
  );
