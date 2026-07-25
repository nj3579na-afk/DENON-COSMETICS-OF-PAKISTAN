import React, { useState } from 'react';
import { X, Star, ShoppingBag, MessageCircle, ShieldCheck, CheckCircle2, Truck } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  whatsappNumber: string;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  whatsappNumber,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'howToUse'>('benefits');

  if (!product) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello Denon Cosmetics! I would like to order:\n\n*Product:* ${product.name}\n*Quantity:* ${quantity}\n*Price:* PKR ${(product.salePrice * quantity).toLocaleString()}\n\nPlease deliver via Cash on Delivery in Pakistan.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="close-quickview-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="bg-stone-100 p-6 flex flex-col justify-between items-center relative">
            <span className="absolute top-4 left-4 bg-amber-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
              {product.brand}
            </span>
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-h-80 object-cover rounded-2xl shadow-md my-auto"
            />
            <div className="w-full pt-4 text-center">
              <span className="text-xs text-stone-500 font-medium flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                100% Original & Dermatologically Tested
              </span>
            </div>
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-600 font-bold mb-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span>{product.rating} ({product.reviewCount} Reviews)</span>
              </div>

              <h2 className="font-serif text-xl font-bold text-stone-900 leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-stone-500 mt-1">{product.suitableSkinType}</p>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-sans text-2xl font-extrabold text-stone-900">
                  PKR {product.salePrice.toLocaleString()}
                </span>
                {product.retailPrice > product.salePrice && (
                  <span className="text-sm text-stone-400 line-through">
                    PKR {product.retailPrice.toLocaleString()}
                  </span>
                )}
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-md">
                  Save {product.discountPercent}%
                </span>
              </div>
            </div>

            {/* Description Excerpt */}
            <p className="text-xs text-stone-600 leading-relaxed">{product.description}</p>

            {/* Nav Tabs */}
            <div className="border-b border-stone-200 flex gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('benefits')}
                className={`pb-2 transition-colors ${
                  activeTab === 'benefits' ? 'border-b-2 border-amber-800 text-amber-900' : 'text-stone-400'
                }`}
              >
                Key Benefits
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`pb-2 transition-colors ${
                  activeTab === 'ingredients' ? 'border-b-2 border-amber-800 text-amber-900' : 'text-stone-400'
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('howToUse')}
                className={`pb-2 transition-colors ${
                  activeTab === 'howToUse' ? 'border-b-2 border-amber-800 text-amber-900' : 'text-stone-400'
                }`}
              >
                How To Use
              </button>
            </div>

            {/* Tab Content */}
            <div className="text-xs text-stone-700 min-h-[60px]">
              {activeTab === 'benefits' && (
                <ul className="space-y-1">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === 'ingredients' && (
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className="px-2 py-1 bg-stone-100 text-stone-800 rounded-md text-[11px] font-medium">
                      {ing}
                    </span>
                  ))}
                </div>
              )}
              {activeTab === 'howToUse' && <p className="leading-relaxed">{product.howToUse}</p>}
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-stone-700">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 hover:bg-stone-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-bold text-xs">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1 hover:bg-stone-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  id="quickview-add-cart"
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="py-2.5 px-4 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag
                </button>

                <button
                  id="quickview-buy-now"
                  onClick={() => {
                    onBuyNow(product, quantity);
                    onClose();
                  }}
                  className="py-2.5 px-4 bg-amber-800 text-white text-xs font-bold rounded-xl hover:bg-amber-900 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Buy Now (COD)
                </button>
              </div>

              <a
                id="quickview-whatsapp"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl hover:bg-emerald-100 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Order via WhatsApp Direct</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
