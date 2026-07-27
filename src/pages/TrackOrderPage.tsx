import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { getStoredOrders } from '../services/api';

export const TrackOrderPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const orders = getStoredOrders();
    const cleanQuery = query.trim().toUpperCase();

    const found = orders.find((o) => {
      const orderIdMatch = o.id ? o.id.toUpperCase() === cleanQuery : false;
      const phoneStr = o.customer?.phone || '';
      const cleanPhone = phoneStr.replace(/[^0-9]/g, '');
      const cleanTargetPhone = cleanQuery.replace(/[^0-9]/g, '');
      const phoneMatch = cleanTargetPhone.length > 0 && cleanPhone.includes(cleanTargetPhone);
      return orderIdMatch || phoneMatch;
    });

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const getStatusStep = (status: Order['status']) => {
    if (status === 'Pending') return 1;
    if (status === 'Processing') return 2;
    if (status === 'Shipped') return 3;
    if (status === 'Delivered') return 4;
    return 0; // Cancelled
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
          REAL-TIME ORDER STATUS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Track Your Denon Order
        </h1>
        <p className="text-xs text-stone-600 max-w-lg mx-auto">
          Enter your Order Reference ID (e.g. DENON-9821) or mobile phone number to view live Cash on Delivery shipping updates.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Enter Order ID (DENON-XXXX) or Phone Number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-stone-300 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-amber-800"
            />
          </div>
          <button
            id="track-order-submit-btn"
            type="submit"
            className="px-6 py-3 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 shadow-xs"
          >
            Track Order
          </button>
        </div>
        <p className="text-[11px] text-stone-400 text-center">
          Sample Order IDs available to test: <strong className="text-stone-800 font-mono">DENON-9821</strong> or <strong className="text-stone-800 font-mono">DENON-9822</strong>
        </p>
      </form>

      {/* Results View */}
      {hasSearched && (
        <div className="animate-in fade-in duration-200">
          {searchedOrder ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                    ORDER #{searchedOrder.id}
                  </span>
                  <h2 className="font-serif text-xl font-bold text-stone-900 mt-0.5">
                    Order Status: <span className="text-amber-900 font-sans">{searchedOrder.status}</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Placed on: {new Date(searchedOrder.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-500">Payable Amount:</span>
                  <p className="font-sans text-xl font-extrabold text-stone-900">
                    PKR {searchedOrder.total.toLocaleString()}
                  </p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                    {searchedOrder.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <h3 className="font-serif text-sm font-bold text-stone-900">Delivery Status Progress</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { title: 'Order Placed', desc: 'Received in system', step: 1 },
                    { title: 'Processing', desc: 'Packed at Rawalpindi', step: 2 },
                    { title: 'In Transit', desc: searchedOrder.courierName || 'Assigned to Trax/TCS', step: 3 },
                    { title: 'Delivered', desc: 'COD Collected', step: 4 },
                  ].map((s) => {
                    const currentStep = getStatusStep(searchedOrder.status);
                    const isDone = currentStep >= s.step;
                    return (
                      <div
                        key={s.step}
                        className={`p-4 rounded-2xl border transition-all ${
                          isDone
                            ? 'bg-amber-50/80 border-amber-600 shadow-2xs'
                            : 'bg-stone-50 border-stone-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              isDone ? 'bg-amber-800 text-white' : 'bg-stone-300 text-stone-700'
                            }`}
                          >
                            {isDone ? '✓' : s.step}
                          </div>
                          <h4 className="font-bold text-xs text-stone-900">{s.title}</h4>
                        </div>
                        <p className="text-[11px] text-stone-600">{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items List */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <h3 className="font-serif text-sm font-bold text-stone-900">Order Items</h3>
                <div className="space-y-2">
                  {searchedOrder.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded-lg bg-stone-200"
                        />
                        <div>
                          <h4 className="font-bold text-stone-900">{item.product.name}</h4>
                          <span className="text-[10px] text-stone-500">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900">
                        PKR {(item.product.salePrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 text-center rounded-3xl border border-stone-200 space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-900">No Order Found</h3>
              <p className="text-xs text-stone-500">
                We couldn't find an order matching "{query}". Please double-check your Order ID or contact our team on WhatsApp at +92 312 9206522.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
