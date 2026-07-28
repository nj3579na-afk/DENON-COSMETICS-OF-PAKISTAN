import React, { useState, useEffect } from 'react';
import { User, Heart, Package, LogOut, Phone, MapPin, Mail, Lock, UserPlus, LogIn, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Product, Order, Customer } from '../types';
import { getStoredOrders, saveCustomers, getStoredCustomers } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Customer session state
  const [currentUser, setCurrentUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>('');
  const [authSuccess, setAuthSuccess] = useState<string>('');

  // Form states for login/signup
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authCity, setAuthCity] = useState('Lahore');
  const [authAddress, setAuthAddress] = useState('');

  // Editable Profile state
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileAddress, setProfileAddress] = useState('');

  // Check auth status on load
  useEffect(() => {
    checkAuthSession();
  }, []);

  const checkAuthSession = async () => {
    setLoading(true);

    // 1. Check Supabase Auth session if configured
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const customerProfile: Customer = {
            id: session.user.id,
            fullName: userMeta.fullName || session.user.email?.split('@')[0] || 'Customer',
            email: session.user.email || '',
            phone: userMeta.phone || '',
            city: userMeta.city || 'Lahore',
            province: userMeta.province || 'Punjab',
            address: userMeta.address || '',
            totalOrders: 0,
            totalSpent: 0,
            status: 'Active',
            joinedDate: new Date().toISOString().split('T')[0],
          };
          applyUserSession(customerProfile);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase session check notice:', err);
      }
    }

    // 2. Local session fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('denon_current_customer');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          applyUserSession(parsed);
        } catch (e) {
          localStorage.removeItem('denon_current_customer');
        }
      }
    }

    setLoading(false);
  };

  const applyUserSession = (user: Customer) => {
    setCurrentUser(user);
    setProfileName(user.fullName);
    setProfileEmail(user.email);
    setProfilePhone(user.phone);
    setProfileCity(user.city || 'Lahore');
    setProfileAddress(user.address || '');

    if (typeof window !== 'undefined') {
      localStorage.setItem('denon_current_customer', JSON.stringify(user));
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!authEmail || !authPassword) {
      setAuthError('Please enter both email address and password.');
      return;
    }

    // Attempt Supabase Auth Sign In first
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });

        if (!error && data.user) {
          const meta = data.user.user_metadata || {};
          const userProfile: Customer = {
            id: data.user.id,
            fullName: meta.fullName || authEmail.split('@')[0],
            email: data.user.email || authEmail,
            phone: meta.phone || '',
            city: meta.city || 'Lahore',
            province: meta.province || 'Punjab',
            address: meta.address || '',
            totalOrders: 0,
            totalSpent: 0,
            status: 'Active',
            joinedDate: new Date().toISOString().split('T')[0],
          };
          applyUserSession(userProfile);
          setAuthSuccess('Welcome back! Signed in successfully.');
          return;
        } else if (error) {
          console.warn('Supabase auth sign in notice:', error.message);
        }
      } catch (err: any) {
        console.warn('Supabase sign in failed, trying local store:', err);
      }
    }

    // Local DB fallback lookup
    const localUsersStr = localStorage.getItem('denon_customer_accounts') || '[]';
    const localUsers: any[] = JSON.parse(localUsersStr);
    const found = localUsers.find((u) => u.email.toLowerCase() === authEmail.toLowerCase() && u.password === authPassword);

    if (found) {
      const userProfile: Customer = {
        id: found.id,
        fullName: found.fullName,
        email: found.email,
        phone: found.phone || '',
        city: found.city || 'Lahore',
        province: 'Punjab',
        address: found.address || '',
        totalOrders: 0,
        totalSpent: 0,
        status: 'Active',
        joinedDate: found.joinedDate || new Date().toISOString().split('T')[0],
      };
      applyUserSession(userProfile);
      setAuthSuccess('Signed in successfully!');
    } else {
      setAuthError('Invalid credentials. If you do not have an account, please click "Create Account".');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!authEmail || !authPassword || !authFullName) {
      setAuthError('Please fill in your Full Name, Email, and Password.');
      return;
    }

    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    const newCustomerId = `cust_${Date.now()}`;
    const userProfile: Customer = {
      id: newCustomerId,
      fullName: authFullName,
      email: authEmail,
      phone: authPhone,
      city: authCity,
      province: 'Punjab',
      address: authAddress,
      totalOrders: 0,
      totalSpent: 0,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    // Try Supabase Auth Sign Up
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: {
              fullName: authFullName,
              phone: authPhone,
              city: authCity,
              address: authAddress,
            },
          },
        });

        if (error) {
          console.warn('Supabase auth sign up notice:', error.message);
        } else if (data.user) {
          userProfile.id = data.user.id;
        }
      } catch (err: any) {
        console.warn('Supabase sign up error:', err);
      }
    }

    // Save to local customer database
    const localUsersStr = localStorage.getItem('denon_customer_accounts') || '[]';
    const localUsers: any[] = JSON.parse(localUsersStr);
    localUsers.push({
      id: userProfile.id,
      fullName: authFullName,
      email: authEmail,
      phone: authPhone,
      city: authCity,
      address: authAddress,
      password: authPassword,
      joinedDate: userProfile.joinedDate,
    });
    localStorage.setItem('denon_customer_accounts', JSON.stringify(localUsers));

    // Register in global admin customer list
    const existingCustomers = getStoredCustomers();
    if (!existingCustomers.some((c) => c.email === authEmail)) {
      saveCustomers([...existingCustomers, userProfile]);
    }

    applyUserSession(userProfile);
    setAuthSuccess('Account created successfully! Welcome to Denon Cosmetics.');
  };

  const handleSignOut = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out notice:', e);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem('denon_current_customer');
    setAuthSuccess('Logged out successfully.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedProfile: Customer = {
      ...currentUser,
      fullName: profileName,
      email: profileEmail,
      phone: profilePhone,
      city: profileCity,
      address: profileAddress,
    };

    applyUserSession(updatedProfile);

    // Update in Supabase auth metadata if available
    if (supabase) {
      supabase.auth.updateUser({
        data: {
          fullName: profileName,
          phone: profilePhone,
          city: profileCity,
          address: profileAddress,
        },
      });
    }

    alert('Your profile and address details have been saved successfully!');
  };

  const allOrders = getStoredOrders();
  // Filter orders by currently logged in user's email or phone
  const userOrders = currentUser
    ? allOrders.filter(
        (o) =>
          o.customer.email.toLowerCase() === currentUser.email.toLowerCase() ||
          (currentUser.phone && o.customer.phone === currentUser.phone)
      )
    : [];

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-stone-500 mt-2 font-medium">Checking customer session...</p>
      </div>
    );
  }

  // 1. UNAUTHENTICATED CUSTOMER VIEW -> SIGN IN / CREATE ACCOUNT
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-900 text-amber-200 flex items-center justify-center mx-auto shadow-md">
              <User className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">Denon Customer Portal</h1>
            <p className="text-xs text-stone-500">
              {authMode === 'login'
                ? 'Sign in to access your saved address, wishlist and order tracking.'
                : 'Create your private Denon account to start shopping.'}
            </p>
          </div>

          {/* Auth Tab Switcher */}
          <div className="flex bg-stone-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthError('');
                setAuthSuccess('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'login' ? 'bg-stone-900 text-amber-200 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setAuthError('');
                setAuthSuccess('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'signup' ? 'bg-stone-900 text-amber-200 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {authMode === 'login' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-amber-200 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Sign In to My Account</span>
              </button>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleSignUp} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fatima Khan"
                  value={authFullName}
                  onChange={(e) => setAuthFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Phone (Pakistan)</label>
                <input
                  type="text"
                  placeholder="0300 1234567"
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Lahore / Karachi"
                    value={authCity}
                    onChange={(e) => setAuthCity(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 chars"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  placeholder="House #, Street name, Sector..."
                  value={authAddress}
                  onChange={(e) => setAuthAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-amber-100 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Create Account & Register</span>
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED CUSTOMER VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Account Header */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-3xl border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-800 text-amber-100 flex items-center justify-center font-serif text-2xl font-bold border-2 border-amber-500/50">
            {currentUser.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-amber-200">{currentUser.fullName}</h1>
            <p className="text-xs text-stone-400">{currentUser.email} {currentUser.phone ? `• ${currentUser.phone}` : ''}</p>
            <span className="inline-block mt-1 bg-amber-950 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-700/50">
              AUTHENTICATED DENON MEMBER
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

          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-950 text-red-200 text-xs font-bold rounded-xl border border-red-800/60 hover:bg-red-900 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-stone-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeSubTab === 'profile' ? 'border-b-2 border-amber-800 text-amber-900 font-bold' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile & Shipping Address</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wishlist')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeSubTab === 'wishlist' ? 'border-b-2 border-amber-800 text-amber-900 font-bold' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlistedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeSubTab === 'orders' ? 'border-b-2 border-amber-800 text-amber-900 font-bold' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({userOrders.length})</span>
        </button>
      </div>

      {/* Sub-Tab Content */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm max-w-2xl space-y-6">
          <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
            Personal Details & Delivery Address
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={profileEmail}
                className="w-full px-3 py-2 border border-stone-200 bg-stone-50 text-stone-500 rounded-xl text-xs font-medium cursor-not-allowed"
              />
              <p className="text-[10px] text-stone-400 mt-1">Email address is tied to your account identity.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  value={profileCity}
                  onChange={(e) => setProfileCity(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Default Address</label>
                <input
                  type="text"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 shadow-sm transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
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
          {userOrders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 space-y-3">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-900">No Orders Placed Yet</h3>
              <p className="text-xs text-stone-500">
                When you place a Cash on Delivery order with email <span className="font-bold text-stone-700">{currentUser.email}</span>, it will appear here with live tracking.
              </p>
            </div>
          ) : (
            userOrders.map((order) => (
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
                      PKR {(order.total ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={item?.product?.id || `item-${idx}`} className="flex items-center justify-between text-xs text-stone-700">
                      <span>• {item?.product?.name || 'Item'} (x{item?.quantity || 1})</span>
                      <span>PKR {((item?.product?.salePrice ?? 0) * (item?.quantity ?? 1)).toLocaleString()}</span>
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
