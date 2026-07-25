import React, { useState } from 'react';
import { ShieldCheck, Truck, ArrowRight, CheckCircle2, MessageCircle, MapPin, Phone, User, Mail, FileText } from 'lucide-react';
import { CartItem, Order, AdminSettings } from '../types';
import { saveOrder } from '../services/api';

interface CheckoutPageProps {
  cartItems: CartItem[];
  discountAmount: number;
  onOrderCompleted: (order: Order) => void;
  setActiveTab: (tab: string) => void;
  settings: AdminSettings;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  discountAmount,
  onOrderCompleted,
  setActiveTab,
  settings,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lahore');
  const [province, setProvince] = useState('Punjab');
  const [address, setAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Cash on Delivery (COD)');

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.salePrice * item.quantity, 0);
  const amountAfterDiscount = subtotal - discountAmount;
  const isFreeShipping = amountAfterDiscount >= settings.freeShippingThreshold || cartItems.length === 0;
  const shippingFee = isFreeShipping ? 0 : settings.standardShippingFee;
  const grandTotal = amountAfterDiscount + shippingFee;

  const pakistaniCities = [
    'Rawalpindi',
    'Islamabad',
    'Lahore',
    'Karachi',
    'Peshawar',
    'Quetta',
    'Multan',
    'Faisalabad',
    'Sialkot',
    'Gujranwala',
    'Hyderabad',
    'Abbottabad',
    'Sargodha',
    'Mardan',
    'Sukkur',
    'Bahawalpur',
    'Jhelum',
    'Wah Cantt',
    'Mirpur (AJK)',
    'Other City',
  ];

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const orderId = `DENON-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      customer: {
        fullName,
        email: email || `${phone.replace(/\s/g, '')}@customer.denon.pk`,
        phone,
        city,
        province,
        address,
        orderNotes,
      },
      items: cartItems,
      subtotal,
      discount: discountAmount,
      shippingFee,
      total: grandTotal,
      paymentMethod,
      status: 'Pending',
    };

    saveOrder(newOrder);
    setCompletedOrder(newOrder);
    onOrderCompleted(newOrder);
  };

  if (completedOrder) {
    const whatsappOrderText = encodeURIComponent(
      `Hello Denon Cosmetics! My Cash on Delivery order #${completedOrder.id} has been placed.\n\n*Customer:* ${completedOrder.customer.fullName}\n*Phone:* ${completedOrder.customer.phone}\n*City:* ${completedOrder.customer.city}\n*Total:* PKR ${completedOrder.total.toLocaleString()}\n\nPlease dispatch my order.`
    );
    const whatsappOrderUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappOrderText}`;

    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-center animate-in fade-in duration-300">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              ORDER CONFIRMED VIA CASH ON DELIVERY
            </span>
            <h1 className="font-serif text-3xl font-extrabold text-stone-900 mt-1">
              Thank You for Your Order!
            </h1>
            <p className="text-xs text-stone-600 mt-2">
              Your Order Reference ID is:{' '}
              <strong className="text-stone-900 text-sm bg-stone-100 px-2.5 py-1 rounded-md font-mono">
                {completedOrder.id}
              </strong>
            </p>
          </div>

          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 text-left text-xs space-y-2">
            <p className="flex justify-between">
              <span className="text-stone-500">Customer Name:</span>
              <strong className="text-stone-900">{completedOrder.customer.fullName}</strong>
            </p>
            <p className="flex justify-between">
              <span className="text-stone-500">Phone Number:</span>
              <strong className="text-stone-900">{completedOrder.customer.phone}</strong>
            </p>

            <p className="flex justify-between">
              <span className="text-stone-500">Delivery Address:</span>
              <strong className="text-stone-900 text-right max-w-xs">
                {completedOrder.customer.address}, {completedOrder.customer.city}
              </strong>
            </p>
            <p className="flex justify-between pt-2 border-t border-stone-200 font-bold text-sm">
              <span>Total Payable (COD):</span>
              <span className="text-amber-900">PKR {completedOrder.total.toLocaleString()}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm Order Details on WhatsApp</span>
            </a>

            <button
              onClick={() => setActiveTab('track-order')}
              className="w-full sm:w-auto px-6 py-3 bg-stone-900 text-amber-200 font-bold text-xs rounded-xl hover:bg-stone-800"
            >
              Track Order Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
          SECURE CHECKOUT
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
          Cash on Delivery Details
        </h1>
        <p className="text-xs text-stone-600 mt-0.5">
          Provide your shipping address in Pakistan. Pay Cash on Delivery when courier arrives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Address Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmitOrder} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-800" />
                <span>1. Contact & Shipping Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Chaudhry"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Phone Number (For COD Courier SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                  >
                    {pakistaniCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Province *</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Islamabad Capital">Islamabad Capital Territory</option>
                    <option value="Azad Kashmir">Azad Kashmir</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Complete Street Address (House/Flat No., Street, Sector/Area) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. House 42, Street 8, Block C, Satellite Town, Rawalpindi"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="connectdenon@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Special Delivery Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before arrival, leave with security guard..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="pt-6 border-t border-stone-200 space-y-4">
              <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-800" />
                <span>2. Select Payment Method</span>
              </h2>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('Cash on Delivery (COD)')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery (COD)'
                      ? 'bg-amber-50/80 border-amber-600 shadow-2xs'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery (COD)'}
                      onChange={() => setPaymentMethod('Cash on Delivery (COD)')}
                      className="accent-amber-800"
                    />
                    <div>
                      <h4 className="font-serif text-xs font-bold text-stone-900">
                        Cash on Delivery (COD) — Recommended
                      </h4>
                      <p className="text-[11px] text-stone-600">
                        Pay cash directly to Trax / TCS courier upon delivery at your doorstep.
                      </p>
                    </div>
                  </div>
                  <span className="bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase shrink-0">
                    MOST POPULAR
                  </span>
                </label>

                <label
                  onClick={() => setPaymentMethod('JazzCash')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'JazzCash'
                      ? 'bg-amber-50/80 border-amber-600 shadow-2xs'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'JazzCash'}
                      onChange={() => setPaymentMethod('JazzCash')}
                      className="accent-amber-800"
                    />
                    <div>
                      <h4 className="font-serif text-xs font-bold text-stone-900">JazzCash / EasyPaisa</h4>
                      <p className="text-[11px] text-stone-600">
                        Online wallet payment details will be provided upon order submission.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              id="complete-cod-order-btn"
              type="submit"
              className="w-full py-4 bg-stone-900 text-amber-200 hover:bg-stone-800 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <span>Confirm Order (PKR {grandTotal.toLocaleString()})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="bg-stone-900 text-stone-100 p-6 rounded-3xl border border-stone-800 space-y-4 sticky top-28">
            <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex gap-3 text-xs text-stone-300">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg bg-stone-800 shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-stone-100 line-clamp-1">{item.product.name}</h4>
                    <p className="text-[10px] text-stone-400">Qty: {item.quantity}</p>
                    <p className="font-bold text-amber-300 text-xs">
                      PKR {(item.product.salePrice * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs border-t border-stone-800 pt-4 text-stone-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- PKR {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-400 uppercase">FREE</strong>
                  ) : (
                    `PKR ${shippingFee.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-amber-200 pt-2 border-t border-stone-800">
                <span>Total Amount (COD)</span>
                <span>PKR {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-stone-800/80 rounded-xl text-[11px] text-stone-300 space-y-1">
              <p className="flex items-center gap-1.5 font-bold text-amber-300">
                <ShieldCheck className="w-4 h-4" /> 100% Buyer Guarantee
              </p>
              <p>7-Day hassle-free return or replacement across Pakistan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
