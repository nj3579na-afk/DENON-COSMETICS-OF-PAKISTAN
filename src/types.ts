export type CategoryType = 
  | 'Beauty Cream'
  | 'Face Wash'
  | 'Cream Bleach'
  | 'Body Lotion'
  | 'Hair Removal Spray'
  | 'Serum'
  | 'Soap'
  | 'Scrub'
  | 'Mask'
  | 'All';

export interface Product {
  id: string;
  name: string;
  brand: string; // e.g. "DENON Skin Beauty", "DENON®", "Sansal"
  category: CategoryType;
  retailPrice: number; // in PKR
  salePrice: number;   // in PKR
  discountPercent: number;
  image: string;
  images?: string[];
  description: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string;
  suitableSkinType: string;
  warnings?: string;
  volumeOrWeight?: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockCount: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  image?: string;
  status?: 'Approved' | 'Pending' | 'Rejected';
  adminReply?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  category: 'Security' | 'Products' | 'Categories' | 'Orders' | 'Settings' | 'Content' | 'AI';
  ipAddress: string;
  details: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'Blocked';
  joinedDate: string;
  notes?: string;
}

export interface CategoryItem {
  id: string;
  name: CategoryType;
  description: string;
  image: string;
  productCount: number;
  isActive: boolean;
  sortOrder: number;
}

export interface AIKnowledgeItem {
  id: string;
  topic: string;
  queryKey: string;
  responseText: string;
  category: 'Products' | 'Ingredients' | 'Shipping' | 'Policies' | 'SkinCare';
  lastUpdated: string;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  robotsTxt: string;
  sitemapUrl: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  folder: 'Products' | 'Banners' | 'Blogs' | 'Logos';
  sizeKb: number;
  uploadedAt: string;
}

export type AdminRole = 'Super Admin' | 'Store Manager' | 'Inventory Lead' | 'Support Representative';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastLogin: string;
  twoFactorEnabled: boolean;
}

export interface Order {
  id: string;
  date: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    province: string;
    address: string;
    orderNotes?: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'Cash on Delivery (COD)' | 'JazzCash' | 'EasyPaisa' | 'Bank Transfer';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  courierName?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  wishlist: string[]; // product IDs
}

export interface SkinConsultationRequest {
  image?: string; // base64
  age: string;
  gender?: string;
  skinType: 'Oily' | 'Dry' | 'Combination' | 'Normal' | 'Sensitive';
  skinConcerns: string[]; // e.g. ['Acne', 'Dark Spots', 'Pigmentation', 'Dullness', 'Dryness']
  additionalNotes?: string;
}

export interface SkinConsultationResult {
  summary: string;
  analysis: string;
  routineAdvice: {
    morning: string[];
    evening: string[];
  };
  recommendedProductIds: string[];
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedProducts?: string[];
}

export interface AdminSettings {
  brandName?: string;
  websiteTitle?: string;
  logoUrl?: string;
  secondaryLogoUrl?: string;
  faviconUrl?: string;
  brandDescription?: string;
  brandTagline?: string;
  copyrightText?: string;
  whatsappNumber: string;
  whatsappLink: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  email: string;
  customerSupportEmail?: string;
  businessEmail?: string;
  officeAddress: string;
  googleMapsUrl?: string;
  facebookUrl: string;
  facebookEnabled?: boolean;
  instagramUrl: string;
  instagramEnabled?: boolean;
  youtubeUrl: string;
  youtubeEnabled?: boolean;
  tiktokUrl: string;
  tiktokEnabled?: boolean;
  linkedinUrl?: string;
  linkedinEnabled?: boolean;
  twitterUrl?: string;
  twitterEnabled?: boolean;
  whatsappButtonLink?: string;
  contactButtonLink?: string;
  orderNowButtonLink?: string;
  buyNowButtonLink?: string;
  headerMenuLinksJson?: string;
  footerLinksJson?: string;
  externalRedirectsJson?: string;
  senderEmail?: string;
  replyToEmail?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  orderConfirmationEmailEnabled?: boolean;
  supportAutoReplyEnabled?: boolean;
  adminLowStockAlertsEnabled?: boolean;
  adminFullName?: string;
  adminUsername?: string;
  adminEmail?: string;
  adminPhone?: string;
  adminPhotoUrl?: string;
  adminPosition?: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  bannerTitle: string;
  bannerSubtitle: string;
  announcementText?: string;
  footerText?: string;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
  aiConsultationEnabled?: boolean;
  autoLogoutMinutes?: number;
  twoFactorRequired?: boolean;
  currency?: string;
  timezone?: string;
  loginAttemptLimit?: number;
  securityQuestionsJson?: string;
  activeSessionsJson?: string;
  trustedDevicesJson?: string;
  adminPasswordHash?: string;
  adminTwoFactorPin?: string;

  // Payment Method Settings
  easypaisaEnabled?: boolean;
  easypaisaAccountTitle?: string;
  easypaisaMobileNumber?: string;
  easypaisaQrCode?: string;
  easypaisaInstructions?: string;

  jazzcashEnabled?: boolean;
  jazzcashAccountTitle?: string;
  jazzcashMobileNumber?: string;
  jazzcashQrCode?: string;
  jazzcashInstructions?: string;

  bankEnabled?: boolean;
  bankName?: string;
  bankAccountTitle?: string;
  bankAccountNumber?: string;
  bankIban?: string;
  bankQrCode?: string;
  bankInstructions?: string;

  codEnabled?: boolean;
  codInstructions?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Orders & Delivery' | 'COD & Payment' | 'Products & Skincare' | 'Return & Guarantee';
}
