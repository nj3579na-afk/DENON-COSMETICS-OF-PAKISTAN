import React from 'react';
import { CategoryType, Product, CategoryItem } from '../types';
import { getStoredCategories } from '../services/api';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoriesPageProps {
  products: Product[];
  setActiveTab: (tab: string) => void;
  setSelectedCategory: (cat: CategoryType) => void;
  categories?: CategoryItem[];
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  products,
  setActiveTab,
  setSelectedCategory,
  categories,
}) => {
  const storedCategories = categories && categories.length > 0 ? categories : getStoredCategories();
  const displayCategories = storedCategories.filter((c) => c.isActive !== false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
          DENON COSMETICS CATEGORIES
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Skincare Formulations by Category
        </h1>
        <p className="text-xs text-stone-600">
          Crafted with active botanical ingredients, Rice Water, Niacinamide, and Vitamin C for pristine skin health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCategories.map((cat, idx) => {
          const count = products.filter((p) => p.category === cat.name).length;
          return (
            <div
              key={cat.id || idx}
              onClick={() => {
                setSelectedCategory(cat.name as CategoryType);
                setActiveTab('shop');
              }}
              className="group cursor-pointer bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-video w-full bg-stone-100 overflow-hidden relative">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md">
                  {count} Products
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    DENON FORMULA
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mt-0.5 group-hover:text-amber-800">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{cat.description}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-900">
                  <span>Explore {cat.name} Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
