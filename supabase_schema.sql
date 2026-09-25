-- ========================================================
-- INDIE SUMMER ATELIER — SUPABASE POSTGRESQL SCHEMA
-- Execute in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gqvmdrtlocvidjtiyycv/sql
-- ========================================================

-- 1. PRODUCTS TABLE (1-of-1 Silhouettes & Auction Relics)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  price_inr NUMERIC NOT NULL,
  price_usd NUMERIC DEFAULT 0,
  price_eur NUMERIC DEFAULT 0,
  price_gbp NUMERIC DEFAULT 0,
  price_aed NUMERIC DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'vintage-saree',
  is_one_of_one BOOLEAN DEFAULT TRUE,
  is_bidding BOOLEAN DEFAULT FALSE,
  starting_bid_inr NUMERIC DEFAULT 0,
  current_bid_inr NUMERIC DEFAULT 0,
  min_bid_increment_inr NUMERIC DEFAULT 500,
  bids_count INT DEFAULT 0,
  edition TEXT DEFAULT '1 OF 1 VINTAGE SAREE GOWN',
  status TEXT DEFAULT 'available',
  material TEXT,
  origin TEXT,
  color TEXT,
  color_hex TEXT,
  sizes JSONB DEFAULT '["XS", "S", "M"]'::jsonb,
  image_primary TEXT NOT NULL,
  image_secondary TEXT,
  description TEXT,
  details JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LIVE BIDS TABLE
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  bidder_name TEXT NOT NULL,
  bidder_contact TEXT,
  amount_inr NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SITE SETTINGS & CUSTOMIZATION TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_ref TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  customer_city TEXT,
  customer_pincode TEXT,
  payment_method TEXT DEFAULT 'upi',
  total_amount_inr NUMERIC NOT NULL,
  items JSONB NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) & OPEN POLICIES FOR STOREFRONT & ADMIN
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public write on products" ON public.products FOR ALL USING (true);

CREATE POLICY "Allow public read on bids" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Allow public insert on bids" ON public.bids FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public write on site_settings" ON public.site_settings FOR ALL USING (true);

CREATE POLICY "Allow public read on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);

-- SEED INITIAL SITE SETTINGS
INSERT INTO public.site_settings (key, value)
VALUES
  ('hero_title', '"A SECOND LIFE FOR BEAUTIFUL THINGS."'::jsonb),
  ('hero_subtitle', '"Crafted from vintage Indian sarees, dupattas and handworked textiles. Once it’s gone, that exact piece will never exist again."'::jsonb),
  ('hero_tagline', '"SLOW BATCHES · SINGULAR PIECES · ZERO WASTE"'::jsonb),
  ('current_volume', '"VOL. 001"'::jsonb),
  ('drop_status', '"LIVE FOR ACQUISITION"'::jsonb),
  ('marquee_ticker', '"ONE DESIGN. ONE PIECE. NEVER AGAIN. · COMPLIMENTARY BLUEDART AIR SHIPPING ACROSS INDIA · SLOW BATCHES · DISCOVERED VINTAGE SILKS · ZERO WASTE ATELIER"'::jsonb),
  ('promo_code', '"INDIE10"'::jsonb),
  ('promo_discount', '10'::jsonb),
  ('phone_contact', '"+91 98200 45892"'::jsonb),
  ('email_contact', '"atelier@indiesummer.in"'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- SEED 8 PRODUCTS
INSERT INTO public.products (id, code, name, price_inr, price_usd, price_eur, price_gbp, price_aed, category, is_one_of_one, is_bidding, starting_bid_inr, current_bid_inr, min_bid_increment_inr, bids_count, edition, status, material, origin, color, color_hex, sizes, image_primary, image_secondary, description, details)
VALUES
  (
    'is-001',
    'VINTAGE SAREE / PIECE 01',
    'THE VARANASI CRIMSON PALLU SLIP',
    28500, 340, 315, 275, 1250,
    'vintage-saree',
    true, true,
    28500, 32500, 500, 8,
    '1 OF 1 VINTAGE SAREE GOWN',
    'available',
    'Archival Pure Silk Saree with Gold Zari Paisley Pallu',
    'Discovered in Varanasi · Handcrafted in Goa Atelier',
    'Crimson & Antique Gold', '#A92424',
    '["XS", "S", "M"]'::jsonb,
    '/images/piece-crimson-saree.jpg', '/images/dress.jpg',
    'Crafted from a singular vintage Banarasi silk saree discovered in Varanasi. The gown is sculpted around the ornate heirloom gold zari border and paisley pallu, flowing into an exposed backless silhouette.',
    '["100% authentic vintage pure silk saree with woven antique gold zari", "Designed directly around natural drape of found textile", "One design. One piece. Never again", "Includes complimentary matching vintage silk remnant neck tie", "Hand-signed Certificate of Provenance #IS-001"]'::jsonb
  ),
  (
    'is-002',
    'VINTAGE SAREE / PIECE 02',
    'THE EMERALD BROCADE BACKLESS GOWN',
    34000, 410, 380, 330, 1500,
    'vintage-saree',
    true, false,
    0, 0, 500, 0,
    '1 OF 1 VINTAGE BROCADE GOWN',
    'available',
    'Vintage South Indian Silk Saree with All-Over Floral Zari',
    'Discovered in Tamil Nadu · Handcrafted in Goa Atelier',
    'Imperial Emerald & Gold', '#1E5638',
    '["S", "M"]'::jsonb,
    '/images/piece-emerald-gown.jpg', '/images/hero.jpg',
    'Reborn from an extraordinary vintage emerald silk saree adorned with intricate hand-loomed gold brocade floral bootis. Deep-V cowl back with cascading train.',
    '["Heavy vintage silk drape with natural heirloom patina", "Cut following zero-waste geometry", "Subtle marks of another era celebrating authentic craftsmanship", "Matching emerald silk ribbon included", "Hand-numbered piece #02 of Vol. 001"]'::jsonb
  ),
  (
    'is-003',
    'VINTAGE SAREE / PIECE 03',
    'THE SAFFRON SUNSET HALTER GOWN',
    32000, 385, 355, 305, 1410,
    'vintage-saree',
    true, true,
    32000, 35500, 500, 6,
    '1 OF 1 HEIRLOOM SILK GOWN',
    'available',
    'Vintage Pure Silk Saree with Silver-Gold Zari Weave',
    'Discovered in Rajasthan · Handcrafted in Goa Atelier',
    'Marigold Saffron & Silver', '#D9822B',
    '["XS", "S", "M"]'::jsonb,
    '/images/piece-saffron-gown.jpg', '/images/piece-crimson-saree.jpg',
    'Handcrafted from an antique marigold and saffron silk saree bearing rare dual-toned silver and gold zari work. Fluid halter neckline frames the shoulders before sweeping into a majestic floor-length drape.',
    '["Pure vintage handloom silk with sandwashed matte texture", "Intricate heritage border preserved along hem", "Zero waste cutting with matching pocket square", "One design. One piece. Never again."]'::jsonb
  ),
  (
    'is-004',
    'VINTAGE DUPATTA / PIECE 04',
    'THE ANJUNA INDIGO DUPATTA RESORT SET',
    22500, 270, 250, 215, 990,
    'vintage-dupatta',
    true, false,
    0, 0, 500, 0,
    '1 OF 1 DUPATTA SILHOUETTE',
    'available',
    'Vintage Handwoven Cotton-Silk Dupatta with Zari Borders',
    'Discovered in Bagru · Handcrafted in Goa Atelier',
    'Indigo Mineral & Ivory', '#2C3E55',
    '["S", "M", "L"]'::jsonb,
    '/images/piece-dupatta-set.jpg', '/images/linen.jpg',
    'Consciously tailored from a vintage handwoven Indian dupatta featuring authentic natural indigo block-printing and gold thread border trims. Relaxed wrap tunic with resort trousers.',
    '["Vintage block-printed textile with weathered variations", "Natural hand-carved mother-of-pearl buttons", "Deep functional pockets", "Complimentary express air shipping across India"]'::jsonb
  ),
  (
    'is-005',
    'ZERO-WASTE REMNANTS / PIECE 05',
    'THE ATELIER PLEATED REMNANT COLLAR & SCARF',
    12500, 150, 140, 120, 550,
    'remnants',
    true, false,
    0, 0, 500, 0,
    '1 OF 1 ZERO-WASTE ACCENT',
    'available',
    'Vintage Silk Saree Border Remnants with Gold Thread Tassels',
    'Hand-stitched in Goa Atelier · 100% Circular Remnants',
    'Multicolor Brocade & Antique Zari', '#8D4B32',
    '["One Size"]'::jsonb,
    '/images/piece-remnant-scarf.jpg', '/images/piece-emerald-gown.jpg',
    'Living proof that every beautiful textile deserves a second life. Even the smallest border fragments from our vintage saree gowns are hand-pleated and finished with antique thread tassels.',
    '["100% upcycled vintage saree border remnants", "Intricate hand-pleated construction taking 14 hours", "Adjustable ribbon tie closure", "One design. One piece. Never again."]'::jsonb
  ),
  (
    'is-006',
    'VINTAGE SAREE / PIECE 06',
    'THE SOLSTICE BACKLESS TERRACOTTA SLIP',
    24500, 295, 275, 235, 1080,
    'vintage-saree',
    true, false,
    0, 0, 500, 0,
    '1 OF 1 VINTAGE SAREE GOWN',
    'available',
    'Vintage Pure Silk Saree with Terracotta Hand-dye',
    'Discovered in Varanasi · Handcrafted in Goa Atelier',
    'Terracotta Sunset', '#B85838',
    '["XS", "S", "M"]'::jsonb,
    '/images/dress.jpg', '/images/hero.jpg',
    'Designed entirely around an archival vintage silk saree with faded hand-loomed terracotta tones and intricate gold zari. Bias-cut body with exposed low-back tie silhouette.',
    '["Crafted from single vintage pure silk saree", "Designed around natural border placements", "Carries subtle marks and gentle faded tones of another era"]'::jsonb
  ),
  (
    'is-007',
    'VINTAGE SAREE / PIECE 07',
    'THE GOLDEN HOUR DRAPE GOWN',
    29500, 355, 330, 285, 1300,
    'vintage-saree',
    true, true,
    29500, 31500, 500, 4,
    '1 OF 1 VINTAGE TEXTILE GOWN',
    'available',
    'Vintage Habotai Silk Saree with Champagne Lustre',
    'Discovered in Gujarat · Handcrafted in Goa Atelier',
    'Champagne Saffron', '#D8C7A5',
    '["S", "M"]'::jsonb,
    '/images/hero.jpg', '/images/piece-saffron-gown.jpg',
    'Repurposed from an exceptional vintage Indian silk textile discovered with delicate golden weave work. Liquid cowl neckline and open back that catches coastal golden light.',
    '["100% vintage pure silk with natural aged luster", "Sweeping floor-length column cut", "Zero waste cutting process with repurposed remnants"]'::jsonb
  ),
  (
    'is-008',
    'SLOW-BATCH / PIECE 08',
    'THE MANDREM RELAXED LINEN & VINTAGE BORDER SET',
    18500, 220, 205, 175, 810,
    'vintage-dupatta',
    true, false,
    0, 0, 500, 0,
    '1 OF 1 SLOW BATCH PIECE',
    'available',
    'Hand-spun Organic Flax & Vintage Saree Pallu Inset Details',
    'Handcrafted in India · Zero Waste Atelier',
    'Raw Ecru Sand', '#EFEBE2',
    '["XS", "S", "M", "L"]'::jsonb,
    '/images/linen.jpg', '/images/piece-dupatta-set.jpg',
    'Tailored from slow-batch hand-spun linen and accented with authentic vintage saree border trims along the collar, placket and cuffs. Oversized resort shirt paired with relaxed trousers.',
    '["Hand-spun breathable natural fibers pre-washed for softness", "Vintage saree border accents inside collar", "Natural shell buttons sourced along the Indian coast"]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_inr = EXCLUDED.price_inr,
  is_bidding = EXCLUDED.is_bidding,
  current_bid_inr = EXCLUDED.current_bid_inr,
  min_bid_increment_inr = EXCLUDED.min_bid_increment_inr,
  status = EXCLUDED.status;
