import React from 'react';
import { CategoryType, Product } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoriesPageProps {
  products: Product[];
  setActiveTab: (tab: string) => void;
  setSelectedCategory: (cat: CategoryType) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  products,
  setActiveTab,
  setSelectedCategory,
}) => {
  const categoryCards: { title: CategoryType; subtitle: string; description: string; img: string }[] = [
    {
      title: 'Face Wash',
      subtitle: 'Rice Water, Vitamin C & Activated Charcoal',
      description: 'Gently cleanses, lightens dark spots, exfoliates dead skin cells, and detoxifies pores without stripping moisture.',
      img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Beauty Cream',
      subtitle: '5-Day Action Pearl & Rice Creams',
      description: 'Iconic Denon 5 Days Formula. Combats freckles, acne scars, hyperpigmentation, and uneven tone for fair luminous skin.',
      img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Hair Removal Spray',
      subtitle: 'Moult Removal 4D, Pink Rose & Lemon Citrus',
      description: 'Fast, painless 5-minute hair removal spray for arms, legs, and body. Zero burning, sting, or skin stimulation.',
      img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Body Lotion',
      subtitle: 'Rice & Pure Aloe Vera 250ml Lotions',
      description: 'Rapid absorption face and body moisturizer. Hydrates for 24 hours, repairs skin barrier, and soothes sun damage.',
      img: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Serum',
      subtitle: 'Export Quality Pearl Radiance Serum',
      description: 'Concentrated beauty serum with pearl powder, Hyaluronic Acid, and Niacinamide for instant dermal glass skin glow.',
      img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Cream Bleach',
      subtitle: 'Sansal Red Anaar & Emerald Shimmer Bleach',
      description: 'Instant wedding and party glow-up. Lightens excess dark facial hair and refines pores with Sansal Whitening Serum.',
      img: 'https://images.unsplash.com/photo-1608248597309-172314f107f7?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Soap',
      subtitle: 'Export Quality Popping Pearl Beauty Soap',
      description: 'Luxury cleansing bar soap with 5 Days Action formula and sun protection for daily luminous body glow.',
      img: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&q=80&w=600',
    },
  ];

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
        {categoryCards.map((cat, idx) => {
          const count = products.filter((p) => p.category === cat.title).length;
          return (
            <div
              key={idx}
              onClick={() => {
                setSelectedCategory(cat.title);
                setActiveTab('shop');
              }}
              className="group cursor-pointer bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-video w-full bg-stone-100 overflow-hidden relative">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md">
                  {count} Products
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    {cat.subtitle}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mt-0.5 group-hover:text-amber-800">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{cat.description}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-900">
                  <span>Explore {cat.title} Collection</span>
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
