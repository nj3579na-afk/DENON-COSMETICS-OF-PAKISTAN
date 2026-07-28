import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Tag, MessageCircle, Check } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: (appliedCouponDiscount: number) => void;
  freeShippingThreshold: number;
  standardShippingFee: number;
  whatsappNumber: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  freeShippingThreshold,
  standardShippingFee,
  whatsappNumber,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.salePrice * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const amountAfterDiscount = subtotal - discountAmount;
  const isFreeShipping = amountAfterDiscount >= freeShippingThreshold || items.length === 0;
  const shippingFee = isFreeShipping ? 0 : standardShippingFee;
  const grandTotal = amountAfterDiscount + shippingFee;

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - amountAfterDiscount);
  const freeShippingProgress = Math.min(100, (amountAfterDiscount / freeShippingThreshold) * 100);

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'DENON10') {
      setDiscountPercent(10);
      setCouponMsg('10% OFF Coupon Applied Successfully!');
    } else if (couponCode.trim().toUpperCase() === 'DENON20') {
      setDiscountPercent(20);
      setCouponMsg('20% OFF Special VIP Discount Applied!');
    } else {
      setDiscountPercent(0);
      setCouponMsg('Invalid coupon code. Try "DENON10"');
    }
  };

  const generateWhatsAppCartSummary = () => {
    const itemsList = items
      .map((i) => `• ${i?.product?.name || 'Product'} (x${i?.quantity || 1}) - PKR ${((i?.product?.salePrice ?? 0) * (i?.quantity ?? 1)).toLocaleString()}`)
      .join('\n');
    const msg = `Hello Denon Cosmetics! I would like to order the following items via Cash on Delivery:\n\n${itemsList}\n\n*Total Order Amount:* PKR ${(grandTotal ?? 0).toLocaleString()}\n*Shipping:* ${shippingFee === 0 ? 'FREE Shipping' : `PKR ${(shippingFee ?? 0).toLocaleString()}`}\n\nPlease confirm my order address.`;
    const cleanWhatsappNumber = (whatsappNumber || '').replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-lg font-bold text-stone-100">Your Shopping Bag</h2>
              <span className="bg-amber-800 text-amber-100 text-xs font-bold px-2 py-0.5 rounded-full">
                {items.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-amber-50 p-3.5 border-b border-amber-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 mb-1.5">
              <Truck className="w-4 h-4 text-amber-700" />
              {isFreeShipping ? (
                <span className="text-emerald-800 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> You Unlocked FREE Nationwide Shipping!
                </span>
              ) : (
                <span>
                  Add <strong className="text-amber-950">PKR {(amountNeededForFreeShipping ?? 0).toLocaleString()}</strong> more for FREE Shipping!
                </span>
              )}
            </div>
            <div className="w-full bg-amber-200/70 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-700 h-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">Your bag is empty</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Explore Denon’s luxury Rice Water, Vitamin C, and Beauty Serums for radiant skin.
                  </p>
                </div>
                <button
                  id="empty-cart-shop-now"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-stone-900 text-amber-200 text-xs font-bold rounded-lg hover:bg-stone-800 transition-colors"
                >
                  Explore Skincare Products
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={item?.product?.id || `cart-item-${idx}`}
                  className="flex gap-4 p-3 rounded-xl border border-stone-200/90 bg-stone-50/50 hover:bg-white transition-all shadow-2xs"
                >
                  <img
                    src={item?.product?.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03'}
                    alt={item?.product?.name || 'Product'}
                    className="w-20 h-20 object-cover rounded-lg bg-stone-100 border border-stone-200"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif text-xs font-bold text-stone-900 line-clamp-2">
                          {item?.product?.name || 'Skincare Item'}
                        </h4>
                        <button
                          id={`remove-item-${item?.product?.id}`}
                          onClick={() => item?.product?.id && onRemoveItem(item.product.id)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-amber-800 font-semibold">{item?.product?.brand || 'DENON'}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-300 rounded-md bg-white">
                        <button
                          id={`dec-qty-${item?.product?.id}`}
                          onClick={() => item?.product?.id && onUpdateQuantity(item.product.id, -1)}
                          className="p-1 hover:bg-stone-100 text-stone-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-900">{item?.quantity || 1}</span>
                        <button
                          id={`inc-qty-${item?.product?.id}`}
                          onClick={() => item?.product?.id && onUpdateQuantity(item.product.id, 1)}
                          className="p-1 hover:bg-stone-100 text-stone-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-sm text-stone-900">
                          PKR {((item?.product?.salePrice ?? 0) * (item?.quantity ?? 1)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 bg-stone-50 border-t border-stone-200 space-y-3">
              {/* Coupon Code Input */}
              <div className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. DENON10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-700 uppercase"
                    />
                  </div>
                  <button
                    id="apply-coupon-btn"
                    onClick={applyCoupon}
                    className="px-3 py-2 bg-stone-900 text-stone-100 text-xs font-bold rounded-lg hover:bg-stone-800"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <p
                    className={`text-[11px] font-medium ${
                      discountPercent > 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {couponMsg}
                  </p>
                )}
              </div>

              {/* Order Summary Calculation */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">PKR {(subtotal ?? 0).toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({discountPercent}%)</span>
                    <span>- PKR {(discountAmount ?? 0).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Nationwide Shipping</span>
                  <span className="font-semibold text-stone-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase">FREE</span>
                    ) : (
                      `PKR ${(shippingFee ?? 0).toLocaleString()}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total (Cash on Delivery)</span>
                  <span className="text-amber-900">PKR {(grandTotal ?? 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Primary Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  id="cart-checkout-btn"
                  onClick={() => {
                    onClose();
                    onProceedToCheckout(discountAmount);
                  }}
                  className="w-full py-3 px-4 bg-stone-900 text-amber-200 font-bold text-xs rounded-xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Proceed to Cash on Delivery Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  id="cart-whatsapp-btn"
                  href={generateWhatsAppCartSummary()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Directly via WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
