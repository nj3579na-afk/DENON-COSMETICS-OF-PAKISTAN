import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AIChatbot } from './components/AIChatbot';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AISkinConsultationPage } from './pages/AISkinConsultationPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { FAQPage } from './pages/FAQPage';
import { BlogPage } from './pages/BlogPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AdminPage } from './pages/AdminPage';

import { Product, CartItem, CategoryType, Order, AdminSettings, CategoryItem } from './types';
import { getStoredProducts, getAdminSettings, getWishlistIds, toggleWishlistId, initializeStorage, getStoredCategories, subscribeToSupabaseRealtime, syncAllFromSupabase } from './services/api';
import { Search, X } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>(() => getStoredCategories());
  const [settings, setSettings] = useState<AdminSettings>(getAdminSettings());

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('denon_cart_items');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed.filter((item) => item && item.product && item.product.id);
          }
        }
      } catch (e) {
        console.warn('Failed to parse saved cart items:', e);
      }
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Persist cart items to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('denon_cart_items', JSON.stringify(cartItems));
      } catch (e) {
        console.warn('Failed to save cart items:', e);
      }
    }
  }, [cartItems]);

  useEffect(() => {
    initializeStorage();
    setProducts(getStoredProducts());
    setCategories(getStoredCategories());
    setWishlistIds(getWishlistIds());
    setSettings(getAdminSettings());

    const refreshDataState = () => {
      setProducts(getStoredProducts());
      setCategories(getStoredCategories());
      setWishlistIds(getWishlistIds());
      setSettings(getAdminSettings());
    };

    // Perform background sync from Supabase
    syncAllFromSupabase().then(refreshDataState);

    window.addEventListener('denon_data_updated', refreshDataState);
    window.addEventListener('denon_categories_updated', refreshDataState);
    window.addEventListener('storage', refreshDataState);

    const unsubscribeRealtime = subscribeToSupabaseRealtime(refreshDataState);

    return () => {
      window.removeEventListener('denon_data_updated', refreshDataState);
      window.removeEventListener('denon_categories_updated', refreshDataState);
      window.removeEventListener('storage', refreshDataState);
      if (unsubscribeRealtime) unsubscribeRealtime();
    };
  }, []);

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (!product || !product.id) return;
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product && item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, quantity: number = 1) => {
    if (!product || !product.id) return;
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product && item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(false);
    setActiveTab('checkout');
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleWishlist = (productId: string) => {
    const updated = toggleWishlistId(productId);
    setWishlistIds(updated);
  };

  const handleOrderCompleted = (order: Order) => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const searchedProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(globalSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(globalSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col justify-between selection:bg-amber-200 selection:text-amber-900">
      {/* Top Header Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        wishlistCount={wishlistIds.length}
        settings={settings}
        onSearchOpen={() => setIsSearchOpen(true)}
      />

      {/* Main Body Content View */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            products={products}
            setActiveTab={setActiveTab}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onQuickView={setQuickViewProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            settings={settings}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />
        )}

        {activeTab === 'shop' && (
          <ShopPage
            products={products}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onQuickView={setQuickViewProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            settings={settings}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesPage
            products={products}
            setActiveTab={setActiveTab}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />
        )}

        {activeTab === 'ai-skin' && (
          <AISkinConsultationPage
            products={products}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onQuickView={setQuickViewProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            whatsappNumber={settings.whatsappNumber}
          />
        )}

        {activeTab === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            discountAmount={appliedDiscount}
            onOrderCompleted={handleOrderCompleted}
            setActiveTab={setActiveTab}
            settings={settings}
          />
        )}

        {activeTab === 'track-order' && <TrackOrderPage />}

        {activeTab === 'account' && (
          <CustomerAccountPage
            products={products}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onQuickView={setQuickViewProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            whatsappNumber={settings.whatsappNumber}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'about' && <AboutUsPage settings={settings} setActiveTab={setActiveTab} />}

        {activeTab === 'contact' && <ContactUsPage settings={settings} />}

        {activeTab === 'faq' && <FAQPage settings={settings} />}

        {activeTab === 'blog' && <BlogPage />}

        {activeTab === 'policies' && <PoliciesPage />}

        {activeTab === 'admin' && (
          <AdminPage
            products={products}
            setProducts={setProducts}
            settings={settings}
            setSettings={setSettings}
            categories={categories}
            setCategories={setCategories}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} settings={settings} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={(discount) => {
          setAppliedDiscount(discount);
          setActiveTab('checkout');
        }}
        freeShippingThreshold={settings.freeShippingThreshold}
        standardShippingFee={settings.standardShippingFee}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Quick View Product Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp whatsappNumber={settings.whatsappNumber} whatsappLink={settings.whatsappLink} />

      {/* AI Skincare Chatbot Assistant */}
      <AIChatbot
        products={products}
        onSelectProduct={(p) => {
          setQuickViewProduct(p);
        }}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="glass-panel rounded-3xl p-6 w-full max-w-2xl shadow-2xl border border-white/60 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-5 h-5 text-amber-800" />
                <input
                  type="text"
                  placeholder="Search Denon products (e.g. Rice, Vitamin C, Charcoal)..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="w-full text-sm font-semibold focus:outline-hidden"
                  autoFocus
                />
              </div>
              <button
                id="close-search-modal-btn"
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {searchedProducts.length === 0 ? (
                <p className="text-xs text-stone-500 py-4 text-center">No matching products found.</p>
              ) : (
                searchedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setQuickViewProduct(p);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 cursor-pointer border border-stone-100"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg bg-stone-100" />
                      <div>
                        <h4 className="font-serif text-xs font-bold text-stone-900">{p.name}</h4>
                        <span className="text-[10px] text-amber-800 font-semibold">{p.category}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-xs text-stone-900">
                      PKR {(p.salePrice ?? 0).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
