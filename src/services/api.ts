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

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cust-101', fullName: 'Ayesha Chaudhry', email: 'ayesha.c@gmail.com', phone: '0301 5544332', city: 'Lahore', province: 'Punjab', totalOrders: 3, totalSpent: 3449, status: 'Active', joinedDate: '2026-05-12' },
  { id: 'cust-102', fullName: 'Usman Ali', email: 'usman.ali@yahoo.com', phone: '0333 4455667', city: 'Rawalpindi', province: 'Punjab', totalOrders: 2, totalSpent: 2100, status: 'Active', joinedDate: '2026-06-01' },
  { id: 'cust-103', fullName: 'Fatima Zafar', email: 'fatima.z@hotmail.com', phone: '0312 9988771', city: 'Karachi', province: 'Sindh', totalOrders: 4, totalSpent: 5200, status: 'Active', joinedDate: '2026-04-18' },
  { id: 'cust-104', fullName: 'Zainab Bibi', email: 'zainab.b@gmail.com', phone: '0300 1234567', city: 'Islamabad', province: 'Federal', totalOrders: 1, totalSpent: 1199, status: 'Active', joinedDate: '2026-07-02' },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), adminUser: 'Super Admin (denon_admin)', action: 'Logged into Admin Portal', category: 'Security', ipAddress: '182.185.120.45', details: 'Successful 2FA login from Rawalpindi, PK' },
  { id: 'log-2', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), adminUser: 'Super Admin (denon_admin)', action: 'Updated Shipping Rates', category: 'Settings', ipAddress: '182.185.120.45', details: 'Standard shipping set to PKR 199, Free threshold PKR 2,000' },
  { id: 'log-3', timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), adminUser: 'Inventory Manager', action: 'Restocked Product', category: 'Products', ipAddress: '39.40.110.12', details: 'Added 50 units to Denon Rice Facial Face Wash' },
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

const INITIAL_ORDERS: Order[] = [
  {
    id: 'DENON-9821',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    customer: {
      fullName: 'Ayesha Chaudhry',
      email: 'ayesha.c@gmail.com',
      phone: '0301 5544332',
      city: 'Lahore',
      province: 'Punjab',
      address: 'House 42, Block C, Gulberg III, Lahore',
      orderNotes: 'Please call before delivery',
    },
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[9], quantity: 1 },
    ],
    subtotal: 1149,
    discount: 0,
    shippingFee: 0,
    total: 1149,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Shipped',
    trackingNumber: 'TRAX-9988221',
    courierName: 'Trax Courier PK',
  },
  {
    id: 'DENON-9822',
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    customer: {
      fullName: 'Usman Ali',
      email: 'usman.ali@yahoo.com',
      phone: '0333 4455667',
      city: 'Rawalpindi',
      province: 'Punjab',
      address: 'Street 12, F-Block, Satellite Town, Rawalpindi',
    },
    items: [{ product: INITIAL_PRODUCTS[5], quantity: 2 }],
    subtotal: 1100,
    discount: 100,
    shippingFee: 0,
    total: 1000,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Processing',
  },
];

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

// Supabase Save Helper
async function saveToSupabase<T>(tableName: string, storeKey: string, data: T[] | T): Promise<void> {
  if (!supabase) return;
  try {
    // 1. Save to denon_store key-value table
    await supabase.from('denon_store').upsert({ key: storeKey, value: data, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    // 2. Also try upserting to relational table
    if (Array.isArray(data)) {
      await supabase.from(tableName).upsert(data as any, { onConflict: 'id' });
    } else {
      const row = { id: (data as any).id || 'default', ...(data as object) };
      await supabase.from(tableName).upsert(row as any, { onConflict: 'id' });
    }
  } catch (err) {
    console.warn(`Supabase save notice for ${tableName}/${storeKey}:`, err);
  }
}

// Supabase Fetch Helper
async function fetchFromSupabase<T>(tableName: string, storeKey: string, fallbackDefault: T): Promise<T> {
  if (!supabase) return fallbackDefault;
  try {
    // 1. Check denon_store table first
    const { data: storeData, error: storeError } = await supabase.from('denon_store').select('value').eq('key', storeKey).single();
    if (!storeError && storeData && storeData.value) {
      return storeData.value as T;
    }

    // 2. Check relational table
    const { data, error } = await supabase.from(tableName).select('*');
    if (!error && data && data.length > 0) {
      if (Array.isArray(fallbackDefault)) {
        return data as unknown as T;
      } else {
        return data[0] as unknown as T;
      }
    }
  } catch (err) {
    console.warn(`Supabase fetch notice for ${tableName}/${storeKey}:`, err);
  }
  return fallbackDefault;
}

// Main Supabase Sync Routine
export async function syncAllFromSupabase(): Promise<void> {
  if (!supabase) return;
  try {
    const [
      categories,
      products,
      settings,
      orders,
      reviews,
      customers,
      auditLogs,
      aiKnowledge,
      blogs,
      seo,
      media,
    ] = await Promise.all([
      fetchFromSupabase<CategoryItem[]>('categories', 'categories', INITIAL_CATEGORIES),
      fetchFromSupabase<Product[]>('products', 'products', INITIAL_PRODUCTS),
      fetchFromSupabase<AdminSettings>('settings', 'settings', INITIAL_ADMIN_SETTINGS),
      fetchFromSupabase<Order[]>('orders', 'orders', INITIAL_ORDERS),
      fetchFromSupabase<Review[]>('reviews', 'reviews', INITIAL_REVIEWS),
      fetchFromSupabase<Customer[]>('customers', 'customers', INITIAL_CUSTOMERS),
      fetchFromSupabase<AuditLog[]>('audit_logs', 'audit_logs', INITIAL_AUDIT_LOGS),
      fetchFromSupabase<AIKnowledgeItem[]>('ai_knowledge', 'ai_knowledge', INITIAL_AI_KNOWLEDGE),
      fetchFromSupabase<BlogPost[]>('blog_posts', 'blog_posts', INITIAL_BLOG_POSTS),
      fetchFromSupabase<SEOSettings>('seo_settings', 'seo', INITIAL_SEO),
      fetchFromSupabase<MediaItem[]>('media_items', 'media', INITIAL_MEDIA),
    ]);

    cachedCategories = categories;
    cachedProducts = products;
    cachedSettings = settings;
    cachedOrders = orders;
    cachedReviews = reviews;
    cachedCustomers = customers;
    cachedAuditLogs = auditLogs;
    cachedAIKnowledge = aiKnowledge;
    cachedBlogPosts = blogs;
    cachedSEO = seo;
    cachedMedia = media;

    notifyDataUpdated();
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
  if (isSupabaseConfigured) {
    syncAllFromSupabase();
  }
}

// Products
export function getStoredProducts(): Product[] {
  initializeStorage();
  return cachedProducts;
}

export function saveProducts(products: Product[]): void {
  cachedProducts = products;
  notifyDataUpdated();
  saveToSupabase('products', 'products', products);
}

// Orders
export function getStoredOrders(): Order[] {
  initializeStorage();
  return cachedOrders;
}

export function saveOrder(order: Order): Order {
  cachedOrders = [order, ...cachedOrders];
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
  notifyDataUpdated();
  saveToSupabase('reviews', 'reviews', cachedReviews);
  return cachedReviews;
}

export function saveReviews(reviews: Review[]): void {
  cachedReviews = reviews;
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
  notifyDataUpdated();
  saveToSupabase('customers', 'customers', customers);
}

// Categories
export function getStoredCategories(): CategoryItem[] {
  initializeStorage();
  return cachedCategories;
}

export function saveCategories(categories: CategoryItem[]): void {
  cachedCategories = categories;
  notifyDataUpdated();
  saveToSupabase('categories', 'categories', categories);
}

// AI Knowledge
export function getStoredAIKnowledge(): AIKnowledgeItem[] {
  initializeStorage();
  return cachedAIKnowledge;
}

export function saveAIKnowledge(items: AIKnowledgeItem[]): void {
  cachedAIKnowledge = items;
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
