import React, { useState } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Award, Heart, ShoppingBag, Star, Truck, CheckCircle2, ChevronRight } from 'lucide-react';
import { Product, AdminSettings, CategoryType, CategoryItem } from '../types';
import { getStoredCategories } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  products: Product[];
  setActiveTab: (tab: string) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  settings: AdminSettings;
  setSelectedCategory: (cat: CategoryType) => void;
  categories?: CategoryItem[];
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  setActiveTab,
  onAddToCart,
  onBuyNow,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
  settings,
  setSelectedCategory,
  categories,
}) => {
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  const storedCategories = categories && categories.length > 0 ? categories : getStoredCategories();
  const displayCategories = storedCategories.filter((c) => c.isActive !== false);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner Section */}
      <section className="relative bg-stone-900 text-stone-100 overflow-hidden min-h-[520px] flex items-center border-b border-amber-900/30">
        <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Background Image Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-30 lg:opacity-75 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1200"
            alt="Denon Cosmetics Skincare"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent" />
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

              <button
                id="hero-ai-consult-btn"
                onClick={() => setActiveTab('ai-skin')}
                className="px-6 py-3.5 bg-stone-800/90 hover:bg-stone-800 text-amber-300 border border-amber-500/30 font-bold text-xs uppercase tracking-wider rounded-xl transition-all backdrop-blur-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Skin Consultation</span>
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

      {/* AI Consultation Promo Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-amber-100 p-8 rounded-3xl border border-amber-600/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30">
              ✨ Free AI Skincare Feature
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
              Not Sure What Your Skin Needs?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Upload your face photo or select your skin concerns. Our AI Dermatology Assistant will analyze your skin profile and build a personalized Denon routine!
            </p>
          </div>
          <button
            id="promo-ai-consult-btn"
            onClick={() => setActiveTab('ai-skin')}
            className="px-6 py-3.5 bg-amber-400 text-stone-950 hover:bg-amber-300 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <span>Analyze My Skin Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
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
                  src={cat.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

            <div className="bg-stone-800/60 p-6 rounded-2xl border border-stone-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-900/60 text-amber-300 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-amber-200">Convenient Nationwide COD</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Order directly online or via WhatsApp (+92 312 9206522). Pay Cash on Delivery when courier arrives at your doorstep!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            REAL REVIEWS FROM PAKISTAN
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Loved By Thousands Across Pakistan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-700 italic leading-relaxed">
              "Denon Rice Face Wash removed my stubborn acne spots in just 1 week. My skin feels fresh, hydrated, and so fair!"
            </p>
            <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-xs">
              <span className="font-bold text-stone-900">Saima Khan (Lahore)</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[10px]">
                <CheckCircle2 className="w-3 h-3" /> Verified Buyer
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-700 italic leading-relaxed">
              "Best acne cream in Pakistan! My pimples dried out within 2 days. Fast Cash on Delivery in Islamabad."
            </p>
            <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-xs">
              <span className="font-bold text-stone-900">Muhammad Hamza (Islamabad)</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[10px]">
                <CheckCircle2 className="w-3 h-3" /> Verified Buyer
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-700 italic leading-relaxed">
              "Zero pain and zero burning with Denon 4D Hair Removing Spray! Worked in 5 minutes on my arms."
            </p>
            <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-xs">
              <span className="font-bold text-stone-900">Fatima Zafar (Karachi)</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[10px]">
                <CheckCircle2 className="w-3 h-3" /> Verified Buyer
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
