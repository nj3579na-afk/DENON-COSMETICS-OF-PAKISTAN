import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Grid, List, Sparkles } from 'lucide-react';
import { Product, CategoryType, AdminSettings } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  settings: AdminSettings;
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  onAddToCart,
  onBuyNow,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
  settings,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categoriesList: CategoryType[] = [
    'All',
    'Face Wash',
    'Beauty Cream',
    'Body Lotion',
    'Hair Removal Spray',
    'Serum',
    'Cream Bleach',
    'Soap',
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesPrice = p.salePrice <= maxPrice;

        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.salePrice - b.salePrice;
        if (sortBy === 'price-high') return b.salePrice - a.salePrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return 0; // featured
      });
  }, [products, selectedCategory, searchQuery, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-3xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            DENON COSMETICS CATALOG
          </span>
          <h1 className="font-serif text-3xl font-extrabold mt-1">Shop Skincare Collection</h1>
          <p className="text-xs text-stone-300 mt-1 max-w-xl">
            100% Original Rice Water, Vitamin C, Beauty Serums & Hair Removal Sprays with Cash on Delivery across Pakistan.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-800 p-2 rounded-xl text-xs text-amber-300 font-semibold border border-stone-700">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Showing {filteredProducts.length} Products</span>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search by product name, Rice, Vitamin C, Charcoal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-stone-700">
              <span>Max Price:</span>
              <span className="text-amber-900 font-bold">PKR {(maxPrice ?? 2000).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="200"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-800 cursor-pointer"
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 border-t border-stone-100 text-xs">
          <span className="font-bold text-stone-500 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 space-y-4">
          <p className="text-stone-500 text-sm font-medium">
            No products found matching "{searchQuery}" or selected price limit.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setMaxPrice(2000);
            }}
            className="px-5 py-2 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
      )}
    </div>
  );
};
