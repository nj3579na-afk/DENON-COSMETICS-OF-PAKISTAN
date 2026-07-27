import { Product, Order, Review, AdminSettings, SkinConsultationRequest, SkinConsultationResult, CategoryType, AuditLog, Customer, CategoryItem, AIKnowledgeItem, BlogPost, SEOSettings, MediaItem } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_ADMIN_SETTINGS, INITIAL_BLOG_POSTS, INITIAL_REVIEWS } from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat-1', name: 'Face Wash', description: 'Deep cleansing, rice water, charcoal & Vitamin C brightening face washes', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400', productCount: 4, isActive: true, sortOrder: 1 },
  { id: 'cat-2', name: 'Beauty Cream', description: 'Export quality brightening, spot removal & night beauty creams', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400', productCount: 3, isActive: true, sortOrder: 2 },
  { id: 'cat-3', name: 'Serum', description: 'Concentrated Niacinamide, Rice Water & Vitamin C glow serums', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400', productCount: 2, isActive: true, sortOrder: 3 },
  { id: 'cat-4', name: 'Hair Removal Spray', description: 'Painless 4D Calcium Thioglycolate hair removing spray', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=400', productCount: 2, isActive: true, sortOrder: 4 },
  { id: 'cat-5', name: 'Body Lotion', description: 'Non-greasy, intensely hydrating all-season body lotion', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400', productCount: 1, isActive: true, sortOrder: 5 },
  { id: 'cat-6', name: 'Cream Bleach', description: 'Gentle skin whitening bleach cream formula with fruit extracts', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400', productCount: 1, isActive: true, sortOrder: 6 },
];

const INITIAL_CUSTOMERS: Customer[] = [];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), adminUser: 'Super Admin (denon_admin)', action: 'Logged into Admin Portal', category: 'Security', ipAddress: '182.185.120.45', details: 'Successful login' },
  { id: 'log-2', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), adminUser: 'Super Admin (denon_admin)', action: 'Updated Settings', category: 'Settings', ipAddress: '182.185.120.45', details: 'Standard shipping rate updated' },
];

const INITIAL_AI_KNOWLEDGE: AIKnowledgeItem[] = [
  { id: 'ai-1', topic: 'Rice Water Science', queryKey: 'rice water benefits', responseText: 'Denon Rice Water Face Wash contains fermented rice amino acids and Niacinamide that fade hyperpigmentation, shrink open pores, and boost radiant skin glow.', category: 'Ingredients', lastUpdated: '2026-07-20' },
  { id: 'ai-2', topic: 'Cash on Delivery Policy', queryKey: 'cod delivery pakistan', responseText: 'We offer nationwide Cash on Delivery (COD) across Pakistan. Delivery takes 2-4 working days via Trax, Leopards, and TCS.', category: 'Shipping', lastUpdated: '2026-07-15' },
  { id: 'ai-3', topic: 'Hair Spray Usage', queryKey: 'hair spray directions', responseText: 'Spray Denon 4D Hair Removal Spray evenly on dry skin, leave for 5 to 7 minutes, and wipe off with a damp cloth in reverse hair direction.', category: 'Products', lastUpdated: '2026-07-18' },
];

const INITIAL_SEO: SEOSettings = {
  metaTitle: 'Denon Cosmetics Pakistan | Official Luxury Skincare & Beauty Creams',
  metaDescription: 'Shop export-quality Denon Cosmetics skincare products in Pakistan. Rice face washes, beauty creams, serums & painless hair removal sprays with nationwide COD.',
  keywords: 'denon cosmetics, rice face wash, beauty cream pakistan, skincare rawalpindi, cod skincare, glowing skin serum',
  ogImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1200',
  robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://denoncosmetics.com/sitemap.xml',
  sitemapUrl: 'https://denoncosmetics.com/sitemap.xml',
};

const INITIAL_MEDIA: MediaItem[] = [
  { id: 'med-1', name: 'denon_rice_facewash.jpg', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800', folder: 'Products', sizeKb: 320, uploadedAt: '2026-07-10' },
  { id: 'med-2', name: 'hero_luminous_banner.jpg', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200', folder: 'Banners', sizeKb: 650, uploadedAt: '2026-07-12' },
  { id: 'med-3', name: 'denon_official_logo.png', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=200', folder: 'Logos', sizeKb: 110, uploadedAt: '2026-07-01' },
];

const INITIAL_ORDERS: Order[] = [];

// In-Memory Global State Cache
let cachedProducts: Product[] = INITIAL_PRODUCTS;
let cachedCategories: CategoryItem[] = INITIAL_CATEGORIES;
let cachedSettings: AdminSettings = INITIAL_ADMIN_SETTINGS;
let cachedOrders: Order[] = INITIAL_ORDERS;
let cachedReviews: Review[] = INITIAL_REVIEWS;
let cachedCustomers: Customer[] = INITIAL_CUSTOMERS;
let cachedAuditLogs: AuditLog[] = INITIAL_AUDIT_LOGS;
let cachedAIKnowledge: AIKnowledgeItem[] = INITIAL_AI_KNOWLEDGE;
let cachedBlogPosts: BlogPost[] = INITIAL_BLOG_POSTS;
let cachedSEO: SEOSettings = INITIAL_SEO;
let cachedMedia: MediaItem[] = INITIAL_MEDIA;
let cachedWishlist: string[] = ['denon-rice-facewash', 'denon-beauty-serum'];

let isInitialized = false;

function notifyDataUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('denon_data_updated'));
    window.dispatchEvent(new CustomEvent('denon_categories_updated', { detail: cachedCategories }));
  }
}

function saveToLocalStorage(key: string, value: any) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`localStorage save error for ${key}:`, e);
    }
  }
}

// Supabase Mappers
function supabaseRowToProduct(row: any): Product {
  return {
    id: String(row.id),
    name: row.name || 'Untitled Product',
    brand: row.brand || 'DENON®',
    category: row.category || 'Face Wash',
    retailPrice: Number(row.retailPrice ?? row.originalPrice ?? row.price ?? 0),
    salePrice: Number(row.salePrice ?? row.price ?? 0),
    discountPercent: Number(row.discountPercent ?? 0),
    image: row.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400',
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description || '',
    benefits: Array.isArray(row.benefits) ? row.benefits : [],
    ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
    howToUse: row.howToUse || row.howtouse || '',
    suitableSkinType: row.suitableSkinType || 'For All Skin Types',
    warnings: row.warnings || '',
    volumeOrWeight: row.volumeOrWeight || row.volume || '',
    stockStatus: row.stockStatus || (row.inStock === false || row.instock === false ? 'Out of Stock' : 'In Stock'),
    stockCount: Number(row.stockCount ?? (row.inStock === false || row.instock === false ? 0 : 50)),
    rating: Number(row.rating ?? 5.0),
    reviewCount: Number(row.reviewCount ?? row.reviewsCount ?? row.reviewscount ?? 0),
    isFeatured: Boolean(row.isFeatured ?? row.isfeatured),
    isBestSeller: Boolean(row.isBestSeller ?? row.isBestseller ?? row.isbestseller),
    isNewArrival: Boolean(row.isNewArrival),
  };
}

function supabaseRowToCategory(row: any): CategoryItem {
  return {
    id: String(row.id),
    name: row.name || 'Face Wash',
    description: row.description || '',
    image: row.image || '',
    productCount: Number(row.productCount ?? 0),
    isActive: row.isActive !== false,
    sortOrder: Number(row.sortOrder ?? 1),
  };
}

// Supabase Save Helper
async function saveToSupabase<T>(tableName: string, storeKey: string, data: T[] | T): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Check your Supabase configuration.');
  }

  let storeErrorMsg: string | null = null;
  let relErrorMsg: string | null = null;

  // 1. Save to denon_store key-value table
  try {
    const { error: storeErr } = await supabase
      .from('denon_store')
      .upsert({ key: storeKey, value: data, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (storeErr) {
      storeErrorMsg = storeErr.message;
      console.warn(`denon_store upsert notice (${storeKey}):`, storeErr.message);
    }
  } catch (err: any) {
    storeErrorMsg = err.message || 'Error saving to denon_store';
  }

  // 2. Also try upserting to relational table
  try {
    if (Array.isArray(data)) {
      let rowsToUpsert: any[] = data;
      if (tableName === 'products') {
        rowsToUpsert = data.map((p: any) => ({
          id: String(p.id),
          name: String(p.name || ''),
          description: String(p.description || ''),
          price: Number(p.salePrice ?? p.price ?? 0),
          originalPrice: Number(p.retailPrice ?? p.originalPrice ?? 0),
          image: String(p.image || ''),
          category: String(p.category || 'Face Wash'),
          instock: p.stockStatus !== 'Out of Stock' && (p.stockCount === undefined || Number(p.stockCount) > 0),
          rating: Number(p.rating ?? 5.0),
          reviewscount: Number(p.reviewCount ?? p.reviewsCount ?? 0),
          isbestseller: Boolean(p.isBestSeller ?? p.isBestseller),
          isfeatured: Boolean(p.isFeatured),
          volume: String(p.volumeOrWeight ?? p.volume ?? ''),
          ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
          benefits: Array.isArray(p.benefits) ? p.benefits : [],
          howtouse: String(p.howToUse || ''),
        }));
      } else if (tableName === 'categories') {
        rowsToUpsert = data.map((c: any) => ({
          id: String(c.id),
          name: String(c.name || ''),
          description: String(c.description || ''),
          image: String(c.image || ''),
          productCount: Number(c.productCount ?? 0),
          isActive: c.isActive !== false,
          sortOrder: Number(c.sortOrder ?? 1),
        }));
      }

      if (rowsToUpsert.length > 0) {
        const { error: relErr } = await supabase.from(tableName).upsert(rowsToUpsert as any, { onConflict: 'id' });
        if (relErr) {
          relErrorMsg = relErr.message;
          console.warn(`Relational table upsert notice (${tableName}):`, relErr.message);
        }
      }

      // Handle deletions for relational tables
      if (tableName === 'products' || tableName === 'categories') {
        const { data: currentRows } = await supabase.from(tableName).select('id');
        if (currentRows && currentRows.length > 0) {
          const currentIdsInApp = new Set(data.map((item: any) => String(item.id)));
          const idsToDelete = currentRows.map((r: any) => String(r.id)).filter((id: string) => !currentIdsInApp.has(id));
          if (idsToDelete.length > 0) {
            await supabase.from(tableName).delete().in('id', idsToDelete);
          }
        }
      }
    } else {
      const row = { id: (data as any).id || 'default', ...(data as object) };
      const { error: relErr } = await supabase.from(tableName).upsert(row as any, { onConflict: 'id' });
      if (relErr) {
        relErrorMsg = relErr.message;
      }
    }
  } catch (err: any) {
    relErrorMsg = err.message || `Error saving to ${tableName}`;
  }

  // Log warnings if Supabase sync encounters errors, but do not throw unhandled exceptions
  if (storeErrorMsg || relErrorMsg) {
    console.warn(`Supabase Sync Notice (${tableName}/${storeKey}):`, { denon_store: storeErrorMsg, relational: relErrorMsg });
  }
}

interface FetchResult<T> {
  data: T | null;
  success: boolean;
}

// Supabase Fetch Helper
async function fetchFromSupabase<T>(tableName: string, storeKey: string): Promise<FetchResult<T>> {
  if (!supabase) return { data: null, success: false };
  try {
    // 1. Check denon_store table first
    const { data: storeData, error: storeError } = await supabase
      .from('denon_store')
      .select('value')
      .eq('key', storeKey)
      .maybeSingle();

    if (!storeError && storeData && storeData.value !== undefined && storeData.value !== null) {
      const val = storeData.value;
      if (tableName === 'products' && Array.isArray(val)) {
        return { data: val.map(supabaseRowToProduct) as unknown as T, success: true };
      }
      if (tableName === 'categories' && Array.isArray(val)) {
        return { data: val.map(supabaseRowToCategory) as unknown as T, success: true };
      }
      return { data: val as T, success: true };
    }

    // 2. Check relational table
    const { data, error } = await supabase.from(tableName).select('*');
    if (!error && data && data.length > 0) {
      if (tableName === 'products') {
        return { data: data.map(supabaseRowToProduct) as unknown as T, success: true };
      }
      if (tableName === 'categories') {
        return { data: data.map(supabaseRowToCategory) as unknown as T, success: true };
      }
      return { data: data as unknown as T, success: true };
    }

    if (!error && data && data.length === 0) {
      return { data: [] as unknown as T, success: true };
    }
  } catch (err) {
    console.warn(`Supabase fetch notice for ${tableName}/${storeKey}:`, err);
  }
  return { data: null, success: false };
}

// Main Supabase Sync Routine
export async function syncAllFromSupabase(): Promise<void> {
  if (!supabase) return;
  try {
    const [
      categoriesRes,
      productsRes,
      settingsRes,
      ordersRes,
      reviewsRes,
      customersRes,
      auditLogsRes,
      aiKnowledgeRes,
      blogsRes,
      seoRes,
      mediaRes,
    ] = await Promise.all([
      fetchFromSupabase<CategoryItem[]>('categories', 'categories'),
      fetchFromSupabase<Product[]>('products', 'products'),
      fetchFromSupabase<AdminSettings>('settings', 'settings'),
      fetchFromSupabase<Order[]>('orders', 'orders'),
      fetchFromSupabase<Review[]>('reviews', 'reviews'),
      fetchFromSupabase<Customer[]>('customers', 'customers'),
      fetchFromSupabase<AuditLog[]>('audit_logs', 'audit_logs'),
      fetchFromSupabase<AIKnowledgeItem[]>('ai_knowledge', 'ai_knowledge'),
      fetchFromSupabase<BlogPost[]>('blog_posts', 'blog_posts'),
      fetchFromSupabase<SEOSettings>('seo_settings', 'seo'),
      fetchFromSupabase<MediaItem[]>('media_items', 'media'),
    ]);

    let updated = false;

    if (categoriesRes.success && categoriesRes.data && categoriesRes.data.length > 0) {
      cachedCategories = categoriesRes.data;
      saveToLocalStorage('denon_categories', cachedCategories);
      updated = true;
    } else if (supabase) {
      // Seed initial categories to Supabase if empty/missing
      cachedCategories = INITIAL_CATEGORIES;
      saveToSupabase('categories', 'categories', INITIAL_CATEGORIES).catch(() => {});
      updated = true;
    }

    if (productsRes.success && productsRes.data && productsRes.data.length > 0) {
      cachedProducts = productsRes.data;
      saveToLocalStorage('denon_products', cachedProducts);
      updated = true;
    } else if (supabase) {
      // Seed initial products to Supabase if empty/missing
      cachedProducts = INITIAL_PRODUCTS;
      saveToSupabase('products', 'products', INITIAL_PRODUCTS).catch(() => {});
      updated = true;
    }

    if (settingsRes.success && settingsRes.data) {
      cachedSettings = settingsRes.data;
      saveToLocalStorage('denon_settings', cachedSettings);
      updated = true;
    }
    if (ordersRes.success && ordersRes.data) {
      cachedOrders = ordersRes.data;
      saveToLocalStorage('denon_orders', cachedOrders);
      updated = true;
    }
    if (reviewsRes.success && reviewsRes.data) {
      cachedReviews = reviewsRes.data;
      saveToLocalStorage('denon_reviews', cachedReviews);
      updated = true;
    }
    if (customersRes.success && customersRes.data) {
      cachedCustomers = customersRes.data;
      saveToLocalStorage('denon_customers', cachedCustomers);
      updated = true;
    }
    if (auditLogsRes.success && auditLogsRes.data) {
      cachedAuditLogs = auditLogsRes.data;
      saveToLocalStorage('denon_audit_logs', cachedAuditLogs);
      updated = true;
    }
    if (aiKnowledgeRes.success && aiKnowledgeRes.data) {
      cachedAIKnowledge = aiKnowledgeRes.data;
      saveToLocalStorage('denon_ai_knowledge', cachedAIKnowledge);
      updated = true;
    }
    if (blogsRes.success && blogsRes.data) {
      cachedBlogPosts = blogsRes.data;
      saveToLocalStorage('denon_blog_posts', cachedBlogPosts);
      updated = true;
    }
    if (seoRes.success && seoRes.data) {
      cachedSEO = seoRes.data;
      saveToLocalStorage('denon_seo', cachedSEO);
      updated = true;
    }
    if (mediaRes.success && mediaRes.data) {
      cachedMedia = mediaRes.data;
      saveToLocalStorage('denon_media', cachedMedia);
      updated = true;
    }

    if (updated) {
      notifyDataUpdated();
    }
  } catch (err) {
    console.error('Failed to sync data from Supabase:', err);
  }
}

// Subscribe to Realtime Supabase Database Changes across devices
export function subscribeToSupabaseRealtime(onUpdate: () => void): (() => void) | null {
  if (!supabase) return null;
  try {
    const channel = supabase
      .channel('public:denon_db')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        syncAllFromSupabase().then(onUpdate);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.warn('Supabase Realtime subscription notice:', e);
    return null;
  }
}

// Initialize Storage and kick off Supabase Sync
export function initializeStorage() {
  if (isInitialized) return;
  isInitialized = true;

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const p = localStorage.getItem('denon_products');
      if (p) cachedProducts = JSON.parse(p);

      const c = localStorage.getItem('denon_categories');
      if (c) cachedCategories = JSON.parse(c);

      const o = localStorage.getItem('denon_orders');
      if (o) cachedOrders = JSON.parse(o);

      const s = localStorage.getItem('denon_settings');
      if (s) cachedSettings = JSON.parse(s);

      const r = localStorage.getItem('denon_reviews');
      if (r) cachedReviews = JSON.parse(r);

      const cust = localStorage.getItem('denon_customers');
      if (cust) cachedCustomers = JSON.parse(cust);

      const log = localStorage.getItem('denon_audit_logs');
      if (log) cachedAuditLogs = JSON.parse(log);

      const ai = localStorage.getItem('denon_ai_knowledge');
      if (ai) cachedAIKnowledge = JSON.parse(ai);

      const b = localStorage.getItem('denon_blog_posts');
      if (b) cachedBlogPosts = JSON.parse(b);

      const seo = localStorage.getItem('denon_seo');
      if (seo) cachedSEO = JSON.parse(seo);

      const med = localStorage.getItem('denon_media');
      if (med) cachedMedia = JSON.parse(med);
    } catch (e) {
      console.warn('localStorage read error:', e);
    }
  }

  if (isSupabaseConfigured) {
    syncAllFromSupabase();
  }
}

import { uploadImageToSupabase } from '../lib/supabase';

// Products
export function getStoredProducts(): Product[] {
  initializeStorage();
  return cachedProducts;
}

export async function processAndUploadProductImages(products: Product[]): Promise<Product[]> {
  if (!supabase) return products;
  let updated = [...products];
  let changed = false;

  for (let i = 0; i < updated.length; i++) {
    const prod = updated[i];
    if (prod.image && prod.image.startsWith('data:image/')) {
      const cdnUrl = await uploadImageToSupabase(prod.image, `prod_${prod.id}`);
      updated[i] = { ...prod, image: cdnUrl };
      changed = true;
    }
  }

  if (changed) {
    cachedProducts = updated;
    notifyDataUpdated();
  }
  return updated;
}

export async function saveProducts(products: Product[]): Promise<Product[]> {
  cachedProducts = products;
  saveToLocalStorage('denon_products', products);
  notifyDataUpdated();

  try {
    // Async upload base64 images if present and persist
    const processed = await processAndUploadProductImages(products);
    saveToLocalStorage('denon_products', processed);
    await saveToSupabase('products', 'products', processed);
    return processed;
  } catch (err) {
    console.warn('Supabase product sync notice (saved locally):', err);
    return products;
  }
}

// Orders
export function getStoredOrders(): Order[] {
  initializeStorage();
  return cachedOrders;
}

export function saveOrder(order: Order): Order {
  cachedOrders = [order, ...cachedOrders];
  saveToLocalStorage('denon_orders', cachedOrders);
  notifyDataUpdated();
  saveToSupabase('orders', 'orders', cachedOrders);
  return order;
}

export function updateOrderStatus(orderId: string, status: Order['status'], trackingNumber?: string, courierName?: string): Order[] {
  cachedOrders = cachedOrders.map((o) => {
    if (o.id === orderId) {
      return { ...o, status, trackingNumber: trackingNumber || o.trackingNumber, courierName: courierName || o.courierName };
    }
    return o;
  });
  saveToLocalStorage('denon_orders', cachedOrders);
  notifyDataUpdated();
  saveToSupabase('orders', 'orders', cachedOrders);
  return cachedOrders;
}

// Reviews
export function getStoredReviews(): Review[] {
  initializeStorage();
  return cachedReviews;
}

export function addReview(review: Review): Review[] {
  cachedReviews = [review, ...cachedReviews];
  saveToLocalStorage('denon_reviews', cachedReviews);
  notifyDataUpdated();
  saveToSupabase('reviews', 'reviews', cachedReviews);
  return cachedReviews;
}

export function saveReviews(reviews: Review[]): void {
  cachedReviews = reviews;
  saveToLocalStorage('denon_reviews', reviews);
  notifyDataUpdated();
  saveToSupabase('reviews', 'reviews', reviews);
}

// Admin Settings
export function getAdminSettings(): AdminSettings {
  initializeStorage();
  return cachedSettings;
}

export function saveAdminSettings(settings: AdminSettings): void {
  cachedSettings = settings;
  saveToLocalStorage('denon_settings', settings);
  notifyDataUpdated();
  saveToSupabase('settings', 'settings', settings);
}

// Wishlist
export function getWishlistIds(): string[] {
  initializeStorage();
  return cachedWishlist;
}

export function toggleWishlistId(productId: string): string[] {
  const exists = cachedWishlist.includes(productId);
  cachedWishlist = exists ? cachedWishlist.filter((id) => id !== productId) : [...cachedWishlist, productId];
  notifyDataUpdated();
  saveToSupabase('wishlist', 'wishlist', cachedWishlist);
  return cachedWishlist;
}

// Audit Logs
export function getStoredAuditLogs(): AuditLog[] {
  initializeStorage();
  return cachedAuditLogs;
}

export function addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog[] {
  const newLog: AuditLog = {
    ...log,
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  cachedAuditLogs = [newLog, ...cachedAuditLogs];
  saveToLocalStorage('denon_audit_logs', cachedAuditLogs);
  notifyDataUpdated();
  saveToSupabase('audit_logs', 'audit_logs', cachedAuditLogs);
  return cachedAuditLogs;
}

// Customers
export function getStoredCustomers(): Customer[] {
  initializeStorage();
  return cachedCustomers;
}

export function saveCustomers(customers: Customer[]): void {
  cachedCustomers = customers;
  saveToLocalStorage('denon_customers', customers);
  notifyDataUpdated();
  saveToSupabase('customers', 'customers', customers);
}

// Categories
export function getStoredCategories(): CategoryItem[] {
  initializeStorage();
  return cachedCategories;
}

export async function processAndUploadCategoryImages(categories: CategoryItem[]): Promise<CategoryItem[]> {
  if (!supabase) return categories;
  let updated = [...categories];
  let changed = false;

  for (let i = 0; i < updated.length; i++) {
    const cat = updated[i];
    if (cat.image && cat.image.startsWith('data:image/')) {
      const cdnUrl = await uploadImageToSupabase(cat.image, `cat_${cat.id}`);
      updated[i] = { ...cat, image: cdnUrl };
      changed = true;
    }
  }

  if (changed) {
    cachedCategories = updated;
    saveToLocalStorage('denon_categories', updated);
    notifyDataUpdated();
  }
  return updated;
}

export async function saveCategories(categories: CategoryItem[]): Promise<CategoryItem[]> {
  cachedCategories = categories;
  saveToLocalStorage('denon_categories', categories);
  notifyDataUpdated();

  try {
    const processed = await processAndUploadCategoryImages(categories);
    saveToLocalStorage('denon_categories', processed);
    await saveToSupabase('categories', 'categories', processed);
    return processed;
  } catch (err) {
    console.warn('Supabase category sync notice (saved locally):', err);
    return categories;
  }
}

// AI Knowledge
export function getStoredAIKnowledge(): AIKnowledgeItem[] {
  initializeStorage();
  return cachedAIKnowledge;
}

export function saveAIKnowledge(items: AIKnowledgeItem[]): void {
  cachedAIKnowledge = items;
  saveToLocalStorage('denon_ai_knowledge', items);
  notifyDataUpdated();
  saveToSupabase('ai_knowledge', 'ai_knowledge', items);
}

// Blog Posts
export function getStoredBlogPosts(): BlogPost[] {
  initializeStorage();
  return cachedBlogPosts;
}

export function saveBlogPosts(posts: BlogPost[]): void {
  cachedBlogPosts = posts;
  saveToLocalStorage('denon_blog_posts', posts);
  notifyDataUpdated();
  saveToSupabase('blog_posts', 'blog_posts', posts);
}

// SEO Settings
export function getStoredSEOSettings(): SEOSettings {
  initializeStorage();
  return cachedSEO;
}

export function saveSEOSettings(seo: SEOSettings): void {
  cachedSEO = seo;
  saveToLocalStorage('denon_seo', seo);
  notifyDataUpdated();
  saveToSupabase('seo_settings', 'seo', seo);
}

// Media
export function getStoredMedia(): MediaItem[] {
  initializeStorage();
  return cachedMedia;
}

export function saveMedia(media: MediaItem[]): void {
  cachedMedia = media;
  saveToLocalStorage('denon_media', media);
  notifyDataUpdated();
  saveToSupabase('media_items', 'media', media);
}

// Backup & Restore Database State
export function exportDatabaseBackup(): string {
  initializeStorage();
  const backup = {
    version: '2026.2.0-supabase',
    timestamp: new Date().toISOString(),
    products: getStoredProducts(),
    orders: getStoredOrders(),
    reviews: getStoredReviews(),
    settings: getAdminSettings(),
    auditLogs: getStoredAuditLogs(),
    customers: getStoredCustomers(),
    categories: getStoredCategories(),
    aiKnowledge: getStoredAIKnowledge(),
    blogs: getStoredBlogPosts(),
    seo: getStoredSEOSettings(),
    media: getStoredMedia(),
  };
  return JSON.stringify(backup, null, 2);
}

export function restoreDatabaseBackup(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    if (data.products) saveProducts(data.products);
    if (data.orders) { cachedOrders = data.orders; saveToSupabase('orders', 'orders', data.orders); }
    if (data.reviews) saveReviews(data.reviews);
    if (data.settings) saveAdminSettings(data.settings);
    if (data.auditLogs) { cachedAuditLogs = data.auditLogs; saveToSupabase('audit_logs', 'audit_logs', data.auditLogs); }
    if (data.customers) saveCustomers(data.customers);
    if (data.categories) saveCategories(data.categories);
    if (data.aiKnowledge) saveAIKnowledge(data.aiKnowledge);
    if (data.blogs) saveBlogPosts(data.blogs);
    if (data.seo) saveSEOSettings(data.seo);
    if (data.media) saveMedia(data.media);
    notifyDataUpdated();
    return true;
  } catch (err) {
    console.error('Failed to restore backup:', err);
    return false;
  }
}

// Call AI Skin Consultation endpoint
export async function requestSkinConsultation(req: SkinConsultationRequest): Promise<SkinConsultationResult> {
  try {
    const response = await fetch('/api/skin-consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!response.ok) throw new Error('Skin consultation request failed');
    return await response.json();
  } catch (err) {
    console.error('API consultation error fallback:', err);
    return {
      summary: `Targeted Skincare Routine for ${req.skinType} Skin`,
      analysis: `Your skin selection (${req.skinConcerns.join(', ')}) shows a need for active brightening and oil balance. Ingredients like Rice Water, Niacinamide, and Salicylic Acid are optimal.`,
      routineAdvice: {
        morning: ['Wash with Denon Face Wash', 'Apply Denon Serum', 'Moisturize with Denon Lotion'],
        evening: ['Cleanse face', 'Apply Denon Rice Beauty Cream', 'Leave overnight'],
      },
      recommendedProductIds: ['denon-rice-facewash', 'denon-beauty-serum', 'denon-rice-beauty-cream'],
      disclaimer: 'Note: AI recommendations are informational and do not replace professional medical advice.',
    };
  }
}

// Call AI Chatbot endpoint
export async function sendChatMessage(message: string, history: any[] = []): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    if (!response.ok) throw new Error('Chat API error');
    const data = await response.json();
    return data.reply;
  } catch (err) {
    return 'Welcome to DENON COSMETICS! You can contact our team directly on WhatsApp (+92 312 9206522) for instant product questions or COD orders!';
  }
}
