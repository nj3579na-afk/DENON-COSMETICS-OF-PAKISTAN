import React, { useState } from 'react';
import { User, Heart, Package, LogOut, Settings, Key, Phone, MapPin, Mail, ShoppingBag } from 'lucide-react';
import { Product, Order } from '../types';
import { getStoredOrders, getWishlistIds } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface CustomerAccountPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  whatsappNumber: string;
  setActiveTab: (tab: string) => void;
}

export const CustomerAccountPage: React.FC<CustomerAccountPageProps> = ({
  products,
  onAddToCart,
  onBuyNow,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
  whatsappNumber,
  setActiveTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'wishlist' | 'orders'>('profile');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // User details state
  const [name, setName] = useState('Ayesha Chaudhry');
  const [email, setEmail] = useState('ayesha.c@gmail.com');
  const [phone, setPhone] = useState('0301 5544332');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('House 42, Block C, Gulberg III, Lahore');

  const orders = getStoredOrders();
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Account Header */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-3xl border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-800 text-amber-100 flex items-center justify-center font-serif text-2xl font-bold border-2 border-amber-500/50">
            {name.charAt(0)}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-amber-200">{name}</h1>
            <p className="text-xs text-stone-400">{email} • {phone}</p>
            <span className="inline-block mt-1 bg-amber-950 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-700/50">
              VALUED DENON MEMBER
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('wishlist')}
            className="px-4 py-2 bg-stone-800 text-amber-300 text-xs font-bold rounded-xl hover:bg-stone-700 transition-colors"
          >
            Wishlist ({wishlistIds.length})
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-stone-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeSubTab === 'profile' ? 'border-b-2 border-amber-800 text-amber-900' : 'text-stone-400'
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile & Address</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wishlist')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeSubTab === 'wishlist' ? 'border-b-2 border-amber-800 text-amber-900' : 'text-stone-400'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlistedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeSubTab === 'orders' ? 'border-b-2 border-amber-800 text-amber-900' : 'text-stone-400'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>
      </div>

      {/* Sub-Tab Content */}
      {activeSubTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs max-w-2xl space-y-6">
          <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
            Account Details
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Default Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>
            </div>

            <button
              onClick={() => alert('Profile changes saved successfully!')}
              className="px-6 py-2.5 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      )}

      {activeSubTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 space-y-3">
              <Heart className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-900">Your Wishlist is Empty</h3>
              <p className="text-xs text-stone-500">
                Click the heart icon on any product to save your favorite Denon Cosmetics items here.
              </p>
              <button
                onClick={() => setActiveTab('shop')}
                className="px-6 py-2.5 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl"
              >
                Browse Skincare Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                  onQuickView={onQuickView}
                  isWishlisted={true}
                  onToggleWishlist={onToggleWishlist}
                  whatsappNumber={whatsappNumber}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 space-y-3">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-900">No Orders Yet</h3>
              <p className="text-xs text-stone-500">
                When you place a Cash on Delivery order, it will appear here with live tracking.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="font-mono font-bold text-xs bg-stone-100 px-2.5 py-1 rounded">
                      Order #{order.id}
                    </span>
                    <span className="text-xs text-stone-400 ml-3">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded">
                      Status: {order.status}
                    </span>
                    <span className="font-bold text-sm text-stone-900">
                      PKR {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between text-xs text-stone-700">
                      <span>• {item.product.name} (x{item.quantity})</span>
                      <span>PKR {(item.product.salePrice * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
