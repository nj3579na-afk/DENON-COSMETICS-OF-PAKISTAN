import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Award, Heart, ShoppingBag, Star, Truck, CheckCircle2, ChevronRight, ChevronDown, ChevronUp, Send, MessageSquare, MapPin } from 'lucide-react';
import { Product, AdminSettings, CategoryType, CategoryItem, Review, StoreLocation } from '../types';
import { getStoredCategories, submitCustomerReview } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { getYouTubeEmbedUrl } from '../components/VideoUploader';

const DEFAULT_HERO_IMAGE = '/assets/aistudio/file_00000000ee1c82078dbe50efdb247c23_bd748c5f.png';

interface HomePageProps {
  products: Product[];
  setActiveTab: (tab: string) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOpenReviews?: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  settings: AdminSettings;
  setSelectedCategory: (cat: CategoryType) => void;
  categories?: CategoryItem[];
  reviews?: Review[];
  onReviewSubmitted?: (updatedReviews: Review[]) => void;
  stores?: StoreLocation[];
  onOpenStoreLocator?: (city?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  setActiveTab,
  onAddToCart,
  onBuyNow,
  onQuickView,
  onOpenReviews,
  wishlistIds,
  onToggleWishlist,
  settings,
  setSelectedCategory,
  categories,
  reviews = [],
  onReviewSubmitted,
  stores = [],
  onOpenStoreLocator,
}) => {
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  const categoryList = categories && categories.length > 0 ? categories : getStoredCategories();
  const displayCategories = categoryList.filter((c) => c.isActive !== false);

  // Live Customer Reviews State
  const [reviewFilter, setReviewFilter] = useState<'all' | 'brand' | 'product'>('all');
  const [reviewTarget, setReviewTarget] = useState<string>('brand-general');
  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Hero Media (Multi-image auto slideshow every 2-3s or optional short video)
  const configuredHeroImages = (settings.heroImages || []).map((img) => img.trim()).filter(Boolean);
  const heroImages = configuredHeroImages.length > 0 ? configuredHeroImages : [DEFAULT_HERO_IMAGE];
  const heroVideoUrl = (settings.heroVideoUrl || '').trim();
  const shouldShowHeroVideo = Boolean(heroVideoUrl) && settings.heroMediaType === 'video';
  const heroYouTubeEmbed = shouldShowHeroVideo ? getYouTubeEmbedUrl(heroVideoUrl) : null;
  const heroSlideIntervalMs = Math.max(1500, Math.min(10000, Number(settings.heroSlideIntervalMs) || 2500));

  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  useEffect(() => {
    setHeroSlideIndex((prev) => (prev >= heroImages.length ? 0 : prev));
  }, [heroImages.length]);

  useEffect(() => {
    if (shouldShowHeroVideo || heroImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroImages.length);
    }, heroSlideIntervalMs);
    return () => window.clearInterval(timer);
  }, [shouldShowHeroVideo, heroImages.length, heroSlideIntervalMs]);

  const liveReviews = reviews.filter((r) => r.status !== 'Rejected');
  const filteredLiveReviews = liveReviews.filter((r) => {
    if (reviewFilter === 'brand') {
      return r.reviewType === 'brand' || r.reviewType === 'delivery' || r.productId === 'brand-general' || r.productId === 'service-delivery';
    }
    if (reviewFilter === 'product') {
      return r.productId !== 'brand-general' && r.productId !== 'service-delivery';
    }
    return true;
  });

  const avgLiveRating =
    liveReviews.length > 0
      ? (liveReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / liveReviews.length).toFixed(1)
      : null;

  const handleWebsiteReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !reviewComment.trim() || isSubmittingReview) return;
    setIsSubmittingReview(true);
    setReviewSuccess('');

    try {
      let reviewType: 'product' | 'brand' | 'delivery' = 'brand';
      let productName = `${settings.brandName || 'DENON COSMETICS'} (Brand Experience)`;

      if (reviewTarget === 'service-delivery') {
        reviewType = 'delivery';
        productName = 'Delivery & Customer Service';
      } else if (reviewTarget !== 'brand-general') {
        reviewType = 'product';
        const matched = products.find((p) => p.id === reviewTarget);
        productName = matched?.name || reviewTarget;
      }

      const updated = await submitCustomerReview({
        productId: reviewTarget,
        productName,
        reviewType,
        customerName,
        city: customerCity,
        rating: reviewRating,
        comment: reviewComment,
      });

      if (onReviewSubmitted) onReviewSubmitted(updated);
      setCustomerName('');
      setCustomerCity('');
      setReviewRating(5);
      setReviewComment('');
      setReviewSuccess('Thank you! Your real review is now live on the website.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner Section */}
      <section className="relative bg-stone-900 text-stone-100 overflow-hidden min-h-[520px] flex items-center border-b border-amber-900/30">
        <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Background Image / Video Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 opacity-25 lg:opacity-45 overflow-hidden pointer-events-none">
          {shouldShowHeroVideo ? (
            heroYouTubeEmbed ? (
              <iframe
                src={`${heroYouTubeEmbed}?autoplay=1&mute=1&loop=1&controls=0&playsinline=1&rel=0&playlist=${heroYouTubeEmbed.split('/').pop() || ''}`}
                title="Denon Cosmetics Hero Video"
                className="w-full h-full scale-110 pointer-events-none"
                allow="autoplay; encrypted-media"
              />
            ) : (
              <video
                key={heroVideoUrl}
                src={heroVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover object-center"
              />
            )
          ) : (
            heroImages.map((imgUrl, idx) => (
              <img
                key={`${imgUrl}-${idx}`}
                src={imgUrl}
                alt={`Denon Cosmetics Hero ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                  idx === heroSlideIndex % heroImages.length ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-stone-900/35" />
          <div className="absolute inset-0 bg-stone-900/25" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>DENON COSMETICS • EXPORT QUALITY PAKISTAN</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-100 leading-tight">
              {settings.bannerTitle}
            </h1>

            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              {settings.bannerSubtitle}. Discover our signature Rice Water Face Wash, 5-Day Pearl Beauty Cream, and painless 4D Hair Removal Sprays.
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-shop-all-btn"
                onClick={() => setActiveTab('shop')}
                className="px-6 py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-105 flex items-center gap-2"
              >
                <span>Shop All Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-6 border-t border-stone-800 flex flex-wrap items-center gap-6 text-xs text-stone-400">
              <span className="flex items-center gap-1.5 font-medium text-stone-200">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> 100% Original Products
              </span>
              <span className="flex items-center gap-1.5 font-medium text-stone-200">
                <Truck className="w-4 h-4 text-amber-400" /> Nationwide COD
              </span>
              <span className="flex items-center gap-1.5 font-medium text-stone-200">
                <Award className="w-4 h-4 text-amber-400" /> Dermatologically Tested
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              EXPLORE BY CATEGORY
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Shop Denon Product Line
            </h2>
          </div>
          <button
            id="view-all-categories-btn"
            onClick={() => setActiveTab('categories')}
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((cat, idx) => (
            <div
              key={cat.id || idx}
              onClick={() => {
                setSelectedCategory(cat.name as CategoryType);
                setActiveTab('shop');
              }}
              className="group cursor-pointer bg-white rounded-2xl p-3 border border-stone-200/80 hover:border-amber-500/50 hover:shadow-lg transition-all text-center space-y-3"
            >
              <div className="aspect-square w-full rounded-xl bg-stone-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400';
                  }}
                />
              </div>
              <div>
                <h3 className="font-serif text-xs font-bold text-stone-900 group-hover:text-amber-800">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              HANDPICKED FOR YOU
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Featured Skincare Essentials
            </h2>
          </div>
          <button
            id="view-featured-shop-btn"
            onClick={() => setActiveTab('shop')}
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
          >
            <span>Shop Collection</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onQuickView={onQuickView}
              onOpenReviews={onOpenReviews}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              whatsappNumber={settings.whatsappNumber}
            />
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="bg-stone-50 py-12 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                CUSTOMER FAVORITES
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                Most Popular Denon Products
              </h2>
            </div>
            <button
              id="view-bestsellers-btn"
              onClick={() => setActiveTab('shop')}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
            >
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                onQuickView={onQuickView}
                onOpenReviews={onOpenReviews}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                whatsappNumber={settings.whatsappNumber}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Denon Cosmetics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-stone-100 p-8 sm:p-12 rounded-3xl border border-stone-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              OUR COMMITMENT TO BEAUTY
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold">Why Choose DENON COSMETICS?</h2>
            <p className="text-xs sm:text-sm text-stone-300">
              We engineer world-class skincare tailored specifically to Pakistani skin types, climate conditions, and beauty needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-stone-800/60 p-6 rounded-2xl border border-stone-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-900/60 text-amber-300 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-amber-200">Export Quality Standards</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Formulated using pure Rice Water extracts, Mandarin Vitamin C, Niacinamide, and Activated Charcoal under strict quality controls.
              </p>
            </div>

            <div className="bg-stone-800/60 p-6 rounded-2xl border border-stone-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-900/60 text-amber-300 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-amber-200">5-Day Action Formula</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Our iconic Denon Pearl and Rice Beauty Creams deliver visible reduction in dark spots, freckles, and dullness within days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Find DENON Near You (Smart Store Locator Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-800">
              <MapPin className="w-3.5 h-3.5" />
              <span>FIND DENON NEAR YOU • PAKISTAN</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Locate Authorized Pharmacies, Cosmetics Shops & Distributors
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Explore our interactive Pakistan Store Locator to find verified DENON COSMETICS outlets in your city, view available products, or get instant Google Maps directions.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {['Peshawar', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Quetta', 'Multan', 'Faisalabad'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => (onOpenStoreLocator ? onOpenStoreLocator(city) : setActiveTab('stores'))}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            <div className="bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl text-center lg:text-right">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Active Verified Locations
              </span>
              <span className="font-serif text-xl font-extrabold text-stone-900">
                {stores.filter((s) => s.isActive !== false && s.approvalStatus === 'Approved').length}{' '}
                {stores.filter((s) => s.isActive !== false && s.approvalStatus === 'Approved').length === 1 ? 'Store' : 'Stores'} Live
              </span>
            </div>
            <button
              id="home-open-store-locator-btn"
              type="button"
              onClick={() => (onOpenStoreLocator ? onOpenStoreLocator('') : setActiveTab('stores'))}
              className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-amber-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Find Our Stores</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Live Customer Reviews Section */}
      <section id="customer-reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 border-b border-stone-200 pb-5">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            LIVE CUSTOMER REVIEWS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Real Customer Feedback & Brand Reviews
          </h2>
          <p className="text-xs text-stone-600">
            {liveReviews.length > 0
              ? `${avgLiveRating} / 5.0 average rating across ${liveReviews.length} live customer ${liveReviews.length === 1 ? 'review' : 'reviews'}`
              : 'Share your real experience with our brand, delivery service, or any product.'}
          </p>
        </div>

        {/* Write a Live Review Form */}
        <form
          onSubmit={handleWebsiteReviewSubmit}
          className="max-w-2xl mx-auto bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">Write a Live Review</h3>
              <p className="text-[11px] text-stone-500">Share feedback about our brand, service, or any product</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700">Review About *</label>
            <select
              value={reviewTarget}
              onChange={(e) => setReviewTarget(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 focus:ring-1 focus:ring-amber-800 focus:outline-hidden"
            >
              <option value="brand-general">{settings.brandName || 'DENON COSMETICS'} — Brand & Quality</option>
              <option value="service-delivery">Delivery, Packaging & Customer Service</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  Product: {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">Your Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ayesha Khan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-amber-800 focus:outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">City (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Lahore"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-amber-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700">Your Rating *</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                  title={`${star} Star`}
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-stone-600 ml-2">{reviewRating} / 5</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700">Your Review *</label>
            <textarea
              required
              rows={3}
              placeholder="Share your honest experience with our brand, quality, or delivery..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-amber-800 focus:outline-hidden"
            />
          </div>

          {reviewSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{reviewSuccess}</span>
            </div>
          )}

          <button
            id="submit-website-review-btn"
            type="submit"
            disabled={isSubmittingReview}
            className="w-full py-3 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmittingReview ? 'Submitting Review...' : 'Submit Live Review'}</span>
          </button>
        </form>

        {/* See Reviews Toggle Section (Below Review Form) */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                  Customer Reviews ({liveReviews.length})
                </h3>
                <p className="text-xs text-stone-500">
                  {liveReviews.length > 0
                    ? `Average Rating ${avgLiveRating} / 5.0 • Click "See Reviews" to read all brand & product feedback`
                    : 'Click "See Reviews" to view customer feedback as it is posted'}
                </p>
              </div>
            </div>

            <button
              id="see-reviews-toggle-btn"
              type="button"
              onClick={() => setShowAllReviews((prev) => !prev)}
              className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>{showAllReviews ? 'Hide Reviews' : `See Reviews (${liveReviews.length})`}</span>
              {showAllReviews ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Live Customer Reviews (Only Shown After Clicking "See Reviews") */}
        {showAllReviews && (
          <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setReviewFilter('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  reviewFilter === 'all'
                    ? 'bg-stone-900 text-amber-200'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                All ({liveReviews.length})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('brand')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  reviewFilter === 'brand'
                    ? 'bg-stone-900 text-amber-200'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                Brand & Service
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('product')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  reviewFilter === 'product'
                    ? 'bg-stone-900 text-amber-200'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                Product Reviews
              </button>
            </div>

            {filteredLiveReviews.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-dashed border-stone-300 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">No Customer Reviews Yet</h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Be the first real customer to leave a live review about {settings.brandName || 'DENON COSMETICS'} or any of our skincare products using the form above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLiveReviews.map((review) => {
                  const matchedProduct = products.find((p) => p.id === review.productId);
                  const subjectLabel =
                    review.productName ||
                    matchedProduct?.name ||
                    (review.productId === 'service-delivery'
                      ? 'Delivery & Customer Service'
                      : `${settings.brandName || 'DENON COSMETICS'} Brand`);

                  return (
                    <div
                      key={review.id}
                      className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 truncate max-w-[180px]">
                            {subjectLabel}
                          </span>
                        </div>

                        <p className="text-xs text-stone-700 leading-relaxed">"{review.comment}"</p>

                        {review.adminReply && (
                          <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-950">
                            <strong>{settings.brandName || 'DENON'} Reply:</strong> {review.adminReply}
                          </div>
                        )}
                      </div>

                      <div className="pt-2.5 border-t border-stone-100 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-stone-900">{review.customerName}</span>
                          <span className="block text-[10px] text-stone-400">{review.date}</span>
                        </div>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> Live Customer
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
