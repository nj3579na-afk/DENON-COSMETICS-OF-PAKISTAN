import React from 'react';
import { ShoppingBag, Heart, Eye, MessageCircle, Star, Sparkles, CheckCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  whatsappNumber: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onQuickView,
  isWishlisted,
  onToggleWishlist,
  whatsappNumber,
}) => {
  const whatsappMessage = encodeURIComponent(
    `Hello Denon Cosmetics! I would like to place an order for:\n\n*Product:* ${product.name}\n*Price:* PKR ${product.salePrice.toLocaleString()}\n*Category:* ${product.category}\n\nPlease confirm availability for Cash on Delivery in Pakistan.`
  );
  const cleanWhatsappNumber = (whatsappNumber || '').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="group relative glass-card rounded-2xl border border-white/70 shadow-xs hover:shadow-xl hover:bg-white/90 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.discountPercent > 0 && (
          <span className="bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
            {product.discountPercent}% OFF
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-stone-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
            BEST SELLER
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
            NEW
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        id={`wishlist-btn-${product.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product.id);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
          isWishlisted
            ? 'bg-rose-50 text-rose-600 border border-rose-200'
            : 'bg-white/80 text-stone-600 hover:text-rose-600 hover:bg-white'
        }`}
        title="Add to Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
      </button>

      {/* Product Image Container */}
      <div
        onClick={() => onQuickView(product)}
        className="relative aspect-square w-full bg-stone-100 overflow-hidden cursor-pointer group"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-4 py-2 bg-white/95 text-stone-900 text-xs font-bold rounded-full shadow-md flex items-center gap-1.5 hover:bg-amber-100 transition-all transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick Details
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold tracking-wider text-amber-800 uppercase text-[10px]">
              {product.brand}
            </span>
            <span className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          <h3
            onClick={() => onQuickView(product)}
            className="font-serif text-sm font-bold text-stone-900 hover:text-amber-800 cursor-pointer line-clamp-2 leading-snug"
          >
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 mt-1 line-clamp-1">{product.suitableSkinType}</p>
        </div>

        {/* Price & Discount */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-lg font-extrabold text-stone-900">
              PKR {product.salePrice.toLocaleString()}
            </span>
            {product.retailPrice > product.salePrice && (
              <span className="font-sans text-xs text-stone-400 line-through">
                PKR {product.retailPrice.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
            <CheckCircle className="w-3 h-3" /> Cash on Delivery Available
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <button
              id={`add-cart-btn-${product.id}`}
              onClick={() => onAddToCart(product)}
              className="w-full py-2 px-3 bg-stone-900 text-white text-xs font-bold rounded-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              Add to Bag
            </button>

            <button
              id={`buy-now-btn-${product.id}`}
              onClick={() => onBuyNow(product)}
              className="w-full py-2 px-3 bg-amber-700 text-white text-xs font-bold rounded-lg hover:bg-amber-800 transition-colors flex items-center justify-center gap-1 shadow-2xs"
            >
              Buy Now
            </button>
          </div>

          {/* WhatsApp Direct Order Button */}
          <a
            id={`whatsapp-order-btn-${product.id}`}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1.5 px-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
