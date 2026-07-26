-- ====================================================================
-- DENON COSMETICS - SUPABASE DATABASE & STORAGE SETUP SCRIPT
-- Copy and run this script in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ====================================================================

-- 1. CREATE STORAGE BUCKET FOR IMAGES
INSERT INTO storage.buckets (id, name, public)
VALUES ('denon-images', 'denon-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for denon-images
CREATE POLICY "Public Read Access on denon-images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'denon-images');

CREATE POLICY "Public Upload Access on denon-images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'denon-images');

CREATE POLICY "Public Update Access on denon-images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'denon-images');

CREATE POLICY "Public Delete Access on denon-images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'denon-images');


-- 2. CREATE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  "productCount" INT DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  "sortOrder" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  "originalPrice" NUMERIC,
  image TEXT,
  category TEXT NOT NULL,
  inStock BOOLEAN DEFAULT true,
  rating NUMERIC DEFAULT 5.0,
  reviewsCount INT DEFAULT 0,
  badge TEXT,
  isBestseller BOOLEAN DEFAULT false,
  isFeatured BOOLEAN DEFAULT false,
  volume TEXT,
  ingredients TEXT[],
  benefits TEXT[],
  howToUse TEXT,
  metaTitle TEXT,
  metaDescription TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  date TIMESTAMPTZ DEFAULT NOW(),
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  "shippingFee" NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  "paymentMethod" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Processing',
  "trackingNumber" TEXT,
  "courierName" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  "storeName" TEXT,
  "supportEmail" TEXT,
  "supportPhone" TEXT,
  "whatsappNumber" TEXT,
  "bankName" TEXT,
  "bankAccountTitle" TEXT,
  "bankAccountNumber" TEXT,
  "bankIban" TEXT,
  "easypaisaNumber" TEXT,
  "easypaisaTitle" TEXT,
  "jazzcashNumber" TEXT,
  "jazzcashTitle" TEXT,
  "codEnabled" BOOLEAN DEFAULT true,
  "bankTransferEnabled" BOOLEAN DEFAULT true,
  "easypaisaEnabled" BOOLEAN DEFAULT true,
  "jazzcashEnabled" BOOLEAN DEFAULT true,
  "standardShippingRate" NUMERIC,
  "freeShippingThreshold" NUMERIC,
  "bannerAnnouncement" TEXT,
  "enableMaintenanceMode" BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CREATE GENERAL KEY-VALUE STORE TABLE FOR FULL DATA BACKUP
CREATE TABLE IF NOT EXISTS public.denon_store (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY AND PERMIT ALL ACCESS FOR APP
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.denon_store ENABLE ROW LEVEL SECURITY;

-- Category Policies
DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write categories" ON public.categories;
CREATE POLICY "Allow public write categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- Product Policies
DROP POLICY IF EXISTS "Allow public read products" ON public.products;
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write products" ON public.products;
CREATE POLICY "Allow public write products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Order Policies
DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write orders" ON public.orders;
CREATE POLICY "Allow public write orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Settings Policies
DROP POLICY IF EXISTS "Allow public read settings" ON public.settings;
CREATE POLICY "Allow public read settings" ON public.settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write settings" ON public.settings;
CREATE POLICY "Allow public write settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- Denon Store Policies
DROP POLICY IF EXISTS "Allow public read denon_store" ON public.denon_store;
CREATE POLICY "Allow public read denon_store" ON public.denon_store FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write denon_store" ON public.denon_store;
CREATE POLICY "Allow public write denon_store" ON public.denon_store FOR ALL USING (true) WITH CHECK (true);


-- 8. INITIAL SEED DATA FOR CATEGORIES
INSERT INTO public.categories (id, name, description, image, "productCount", "isActive", "sortOrder") VALUES
('cat-1', 'Face Wash', 'Deep cleansing, rice water, charcoal & Vitamin C brightening face washes', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400', 4, true, 1),
('cat-2', 'Beauty Cream', 'Export quality brightening, spot removal & night beauty creams', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400', 3, true, 2),
('cat-3', 'Serum', 'Concentrated Niacinamide, Rice Water & Vitamin C glow serums', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400', 2, true, 3),
('cat-4', 'Hair Removal Spray', 'Painless 4D Calcium Thioglycolate hair removing spray', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=400', 2, true, 4),
('cat-5', 'Body Lotion', 'Non-greasy, intensely hydrating all-season body lotion', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400', 1, true, 5),
('cat-6', 'Cream Bleach', 'Gentle skin whitening bleach cream formula with fruit extracts', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400', 1, true, 6)
ON CONFLICT (id) DO NOTHING;

-- 9. INITIAL SEED DATA FOR PRODUCTS
INSERT INTO public.products (id, name, description, price, "originalPrice", image, category, "inStock", rating, "reviewsCount", badge, "isBestseller", "isFeatured", volume) VALUES
('denon-rice-facewash', 'Denon Rice Water Brightening Face Wash', 'Enriched with natural rice extract and hyaluronic acid for deep pore cleansing, glass skin glow, and instant hydration.', 649, 850, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600', 'Face Wash', true, 4.9, 142, 'BEST SELLER', true, true, '150 ml'),
('denon-beauty-cream', 'Denon Export Quality Whitening Beauty Cream', 'Formulated with Kojic Acid, Alpha Arbutin, and Niacinamide to diminish dark spots, acne marks, and uneven pigmentation.', 799, 1100, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600', 'Beauty Cream', true, 4.8, 98, 'EXPORT QUALITY', true, true, '50 g'),
('denon-glow-serum', 'Denon 10% Niacinamide + Rice Serum', 'Concentrated brightening serum that shrinks open pores, balances sebum, and locks in luminous moisture all day.', 999, 1450, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600', 'Serum', true, 4.9, 84, 'HOT SELLER', true, true, '30 ml'),
('denon-hair-removal-spray', 'Denon Painless 4D Hair Removal Spray', 'Revolutionary spray-on hair removal formula with Aloe Vera and Calcium Thioglycolate. Smooth skin in 6 minutes.', 550, 750, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=600', 'Hair Removal Spray', true, 4.7, 210, 'PAINLESS', true, true, '150 ml')
ON CONFLICT (id) DO NOTHING;
