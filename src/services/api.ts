import { Product, Order, Review, AdminSettings, SkinConsultationRequest, SkinConsultationResult, CategoryType, AuditLog, Customer, CategoryItem, AIKnowledgeItem, BlogPost, SEOSettings, MediaItem } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_ADMIN_SETTINGS, INITIAL_FAQS, INITIAL_BLOG_POSTS, INITIAL_REVIEWS } from '../data/initialData';

const PRODUCTS_KEY = 'denon_products';
const ORDERS_KEY = 'denon_orders';
const REVIEWS_KEY = 'denon_reviews';
const SETTINGS_KEY = 'denon_settings';
const WISHLIST_KEY = 'denon_wishlist';
const AUDIT_LOGS_KEY = 'denon_audit_logs';
const CUSTOMERS_KEY = 'denon_customers';
const CATEGORIES_KEY = 'denon_categories';
const AI_KNOWLEDGE_KEY = 'denon_ai_knowledge';
const BLOG_POSTS_KEY = 'denon_blog_posts';
const SEO_KEY = 'denon_seo';
const MEDIA_KEY = 'denon_media';

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

// Helper to initialize LocalStorage if empty
export function initializeStorage() {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(ORDERS_KEY)) {
    const sampleOrders: Order[] = [
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
    localStorage.setItem(ORDERS_KEY, JSON.stringify(sampleOrders));
  }
  if (!localStorage.getItem(REVIEWS_KEY)) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem(SETTINGS_KEY)) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_ADMIN_SETTINGS));
  }
  if (!localStorage.getItem(WISHLIST_KEY)) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(['denon-rice-facewash', 'denon-beauty-serum']));
  }
  if (!localStorage.getItem(AUDIT_LOGS_KEY)) {
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
  if (!localStorage.getItem(CUSTOMERS_KEY)) {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
  }
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(AI_KNOWLEDGE_KEY)) {
    localStorage.setItem(AI_KNOWLEDGE_KEY, JSON.stringify(INITIAL_AI_KNOWLEDGE));
  }
  if (!localStorage.getItem(BLOG_POSTS_KEY)) {
    localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(INITIAL_BLOG_POSTS));
  }
  if (!localStorage.getItem(SEO_KEY)) {
    localStorage.setItem(SEO_KEY, JSON.stringify(INITIAL_SEO));
  }
  if (!localStorage.getItem(MEDIA_KEY)) {
    localStorage.setItem(MEDIA_KEY, JSON.stringify(INITIAL_MEDIA));
  }
}

// Product Storage APIs
export function getStoredProducts(): Product[] {
  initializeStorage();
  const data = localStorage.getItem(PRODUCTS_KEY);
  return data ? JSON.parse(data) : INITIAL_PRODUCTS;
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

// Order Storage APIs
export function getStoredOrders(): Order[] {
  initializeStorage();
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveOrder(order: Order): Order {
  const orders = getStoredOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return order;
}

export function updateOrderStatus(orderId: string, status: Order['status'], trackingNumber?: string, courierName?: string): Order[] {
  const orders = getStoredOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      return { ...o, status, trackingNumber: trackingNumber || o.trackingNumber, courierName: courierName || o.courierName };
    }
    return o;
  });
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  return updated;
}

// Reviews Storage APIs
export function getStoredReviews(): Review[] {
  initializeStorage();
  const data = localStorage.getItem(REVIEWS_KEY);
  return data ? JSON.parse(data) : INITIAL_REVIEWS;
}

export function addReview(review: Review): Review[] {
  const reviews = getStoredReviews();
  reviews.unshift(review);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  return reviews;
}

// Settings Storage APIs
export function getAdminSettings(): AdminSettings {
  initializeStorage();
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : INITIAL_ADMIN_SETTINGS;
}

export function saveAdminSettings(settings: AdminSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Wishlist Storage APIs
export function getWishlistIds(): string[] {
  initializeStorage();
  const data = localStorage.getItem(WISHLIST_KEY);
  return data ? JSON.parse(data) : [];
}

export function toggleWishlistId(productId: string): string[] {
  const current = getWishlistIds();
  const exists = current.includes(productId);
  const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  return updated;
}

export function saveReviews(reviews: Review[]): void {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

// Audit Logs API
export function getStoredAuditLogs(): AuditLog[] {
  initializeStorage();
  const data = localStorage.getItem(AUDIT_LOGS_KEY);
  return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
}

export function addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog[] {
  const logs = getStoredAuditLogs();
  const newLog: AuditLog = {
    ...log,
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog);
  localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
  return logs;
}

// Customers API
export function getStoredCustomers(): Customer[] {
  initializeStorage();
  const data = localStorage.getItem(CUSTOMERS_KEY);
  return data ? JSON.parse(data) : INITIAL_CUSTOMERS;
}

export function saveCustomers(customers: Customer[]): void {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
}

// Categories API
export function getStoredCategories(): CategoryItem[] {
  initializeStorage();
  const data = localStorage.getItem(CATEGORIES_KEY);
  return data ? JSON.parse(data) : INITIAL_CATEGORIES;
}

export function saveCategories(categories: CategoryItem[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

// AI Knowledge Base API
export function getStoredAIKnowledge(): AIKnowledgeItem[] {
  initializeStorage();
  const data = localStorage.getItem(AI_KNOWLEDGE_KEY);
  return data ? JSON.parse(data) : INITIAL_AI_KNOWLEDGE;
}

export function saveAIKnowledge(items: AIKnowledgeItem[]): void {
  localStorage.setItem(AI_KNOWLEDGE_KEY, JSON.stringify(items));
}

// Blog Posts API
export function getStoredBlogPosts(): BlogPost[] {
  initializeStorage();
  const data = localStorage.getItem(BLOG_POSTS_KEY);
  return data ? JSON.parse(data) : INITIAL_BLOG_POSTS;
}

export function saveBlogPosts(posts: BlogPost[]): void {
  localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts));
}

// SEO Settings API
export function getStoredSEOSettings(): SEOSettings {
  initializeStorage();
  const data = localStorage.getItem(SEO_KEY);
  return data ? JSON.parse(data) : INITIAL_SEO;
}

export function saveSEOSettings(seo: SEOSettings): void {
  localStorage.setItem(SEO_KEY, JSON.stringify(seo));
}

// Media Library API
export function getStoredMedia(): MediaItem[] {
  initializeStorage();
  const data = localStorage.getItem(MEDIA_KEY);
  return data ? JSON.parse(data) : INITIAL_MEDIA;
}

export function saveMedia(media: MediaItem[]): void {
  localStorage.setItem(MEDIA_KEY, JSON.stringify(media));
}

// Backup & Restore Database State
export function exportDatabaseBackup(): string {
  initializeStorage();
  const backup = {
    version: '2026.1.0',
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
    if (data.products) localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data.products));
    if (data.orders) localStorage.setItem(ORDERS_KEY, JSON.stringify(data.orders));
    if (data.reviews) localStorage.setItem(REVIEWS_KEY, JSON.stringify(data.reviews));
    if (data.settings) localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
    if (data.auditLogs) localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(data.auditLogs));
    if (data.customers) localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(data.customers));
    if (data.categories) localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data.categories));
    if (data.aiKnowledge) localStorage.setItem(AI_KNOWLEDGE_KEY, JSON.stringify(data.aiKnowledge));
    if (data.blogs) localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(data.blogs));
    if (data.seo) localStorage.setItem(SEO_KEY, JSON.stringify(data.seo));
    if (data.media) localStorage.setItem(MEDIA_KEY, JSON.stringify(data.media));
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
