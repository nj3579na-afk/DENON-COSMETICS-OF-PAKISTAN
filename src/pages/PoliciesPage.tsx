import React, { useState } from 'react';
import { ShieldCheck, Truck, RefreshCw, FileText } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const [activePolicy, setActivePolicy] = useState<'shipping' | 'return' | 'privacy' | 'terms'>('shipping');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
          TRANSPARENT STORE POLICIES
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Denon Cosmetics Terms & Policies
        </h1>
        <p className="text-xs text-stone-600 max-w-lg mx-auto">
          We prioritize 100% customer trust, fast Cash on Delivery shipping, and hassle-free returns across Pakistan.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-stone-200 gap-2 text-xs font-bold">
        <button
          onClick={() => setActivePolicy('shipping')}
          className={`px-4 py-2.5 rounded-t-xl transition-colors ${
            activePolicy === 'shipping'
              ? 'bg-stone-900 text-amber-200'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          Shipping & COD Policy
        </button>
        <button
          onClick={() => setActivePolicy('return')}
          className={`px-4 py-2.5 rounded-t-xl transition-colors ${
            activePolicy === 'return'
              ? 'bg-stone-900 text-amber-200'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          7-Day Return & Replacement
        </button>
        <button
          onClick={() => setActivePolicy('privacy')}
          className={`px-4 py-2.5 rounded-t-xl transition-colors ${
            activePolicy === 'privacy'
              ? 'bg-stone-900 text-amber-200'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          Privacy & Security
        </button>
        <button
          onClick={() => setActivePolicy('terms')}
          className={`px-4 py-2.5 rounded-t-xl transition-colors ${
            activePolicy === 'terms'
              ? 'bg-stone-900 text-amber-200'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          Terms & Conditions
        </button>
      </div>

      {/* Policy Content Body */}
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs text-xs text-stone-700 leading-relaxed space-y-4">
        {activePolicy === 'shipping' && (
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900">Nationwide Cash on Delivery (COD) Policy</h2>
            <p>
              DENON COSMETICS delivers products across all major Pakistani cities, including Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Quetta, Multan, Faisalabad, Sialkot, and surrounding areas via trusted courier partners (Trax, TCS, Leopard).
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Free Shipping:</strong> All orders with a net total above PKR 2,000 qualify for FREE delivery.</li>
              <li><strong>Standard Delivery Fee:</strong> Orders below PKR 2,000 carry a flat shipping rate of PKR 199 nationwide.</li>
              <li><strong>Delivery Timeline:</strong> Orders are packed within 24 hours from Rawalpindi. Courier delivery takes 2 to 4 working days.</li>
              <li><strong>Verification:</strong> You may receive an automated SMS or phone call from 0300 5633597 to verify your address prior to dispatch.</li>
            </ul>
          </div>
        )}

        {activePolicy === 'return' && (
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900">7-Day Return & Replacement Policy</h2>
            <p>
              Your satisfaction is our highest priority. If an item arrives damaged, defective, or incorrect, we offer a 7-day hassle-free replacement guarantee.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To be eligible for a return, your item must be unused, in its original Denon packaging with unbroken seals.</li>
              <li>Contact connectdenon@gmail.com or WhatsApp us at +92 312 9206522 within 7 days of receiving your parcel.</li>
              <li>Once verified, our team will dispatch a replacement parcel or issue a direct store credit / bank refund.</li>
            </ul>
          </div>
        )}

        {activePolicy === 'privacy' && (
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900">Privacy & Data Protection Policy</h2>
            <p>
              DENON COSMETICS respects your personal data. We collect customer names, phone numbers, and shipping addresses strictly for order fulfillment, COD courier dispatch, and customer service.
            </p>
            <p>We do not sell or share customer contact numbers with third parties outside of our official courier partners.</p>
          </div>
        )}

        {activePolicy === 'terms' && (
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900">Terms & Conditions of Service</h2>
            <p>
              By accessing Denon Cosmetics website or placing Cash on Delivery orders, you agree to comply with our store terms. Prices are listed in Pakistani Rupees (PKR) and are subject to official manufacturer updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
