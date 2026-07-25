import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Menu, X, Sparkles, Phone, MessageCircle, MapPin, User, ShieldCheck } from 'lucide-react';
import { AdminSettings } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  setIsCartOpen: (open: boolean) => void;
  wishlistCount: number;
  settings: AdminSettings;
  onSearchOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  setIsCartOpen,
  wishlistCount,
  settings,
  onSearchOpen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop All' },
    { id: 'categories', label: 'Categories' },
    { id: 'ai-skin', label: '✨ AI Skin Consultation', highlight: true },
    { id: 'track-order', label: 'Track Order' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'blog', label: 'Skincare Blog' },
    { id: 'admin', label: 'Admin Panel', admin: true },
  ];

  return (
    <header className="sticky top-0 z-40 glass-header shadow-xs">
      {/* Top Banner Bar */}
      <div className="bg-stone-900/90 backdrop-blur-md text-stone-200 text-xs py-2 px-4 border-b border-stone-800/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Original & Dermatologically Tested
            </span>
            <span className="hidden md:inline text-stone-500">|</span>
            <span className="hidden md:inline">FREE Shipping on Orders Over PKR 2,000 (COD Available)</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${settings.phoneNumber}`}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{settings.phoneNumber}</span>
            </a>
            <a
              href={settings.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {settings.whatsappNumber}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-700 hover:text-amber-700 focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center">
            <button
              id="brand-logo-btn"
              onClick={() => setActiveTab('home')}
              className="text-left group focus:outline-hidden"
            >
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wider text-stone-900 group-hover:text-amber-800 transition-colors">
                DENON
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-amber-700 font-sans font-bold uppercase -mt-1">
                COSMETICS • PAKISTAN
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative py-2 transition-all ${
                  activeTab === item.id
                    ? 'text-amber-800 font-semibold'
                    : 'text-stone-700 hover:text-amber-800'
                } ${
                  item.highlight
                    ? 'px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100 shadow-2xs font-semibold'
                    : ''
                } ${item.admin ? 'text-xs text-stone-500 hover:text-stone-900' : ''}`}
              >
                {item.label}
                {activeTab === item.id && !item.highlight && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Action Icons: Search, Wishlist, Cart, Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="header-search-btn"
              onClick={onSearchOpen}
              className="p-2 text-stone-700 hover:text-amber-800 hover:bg-stone-100 rounded-full transition-colors"
              title="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              id="header-wishlist-btn"
              onClick={() => setActiveTab('account')}
              className="relative p-2 text-stone-700 hover:text-amber-800 hover:bg-stone-100 rounded-full transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 bg-stone-900 text-amber-100 rounded-full hover:bg-stone-800 transition-all shadow-xs"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-semibold hidden sm:inline">Bag</span>
              <span className="bg-amber-400 text-stone-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            </button>

            <button
              id="header-account-btn"
              onClick={() => setActiveTab('account')}
              className="p-2 text-stone-700 hover:text-amber-800 hover:bg-stone-100 rounded-full transition-colors"
              title="Customer Account"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-white/60 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-1 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-amber-100/80 text-amber-900 font-bold backdrop-blur-xs'
                    : 'text-stone-700 hover:bg-white/60'
                } ${item.highlight ? 'bg-amber-200/60 text-amber-950 font-semibold border border-amber-300/50' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-200 text-xs text-stone-600 space-y-1">
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>{settings.officeAddress}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-700" />
              <span>Phone: {settings.phoneNumber}</span>
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
