import React from 'react';
import { Award, ShieldCheck, Sparkles, MapPin, Heart, CheckCircle2 } from 'lucide-react';
import { AdminSettings } from '../types';

interface AboutUsPageProps {
  settings: AdminSettings;
  setActiveTab: (tab: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ settings, setActiveTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-16 rounded-3xl border border-stone-800 text-center space-y-4 max-w-4xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          DENON COSMETICS PAKISTAN
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-100 leading-tight">
          Pioneering International Luxury Skincare in Pakistan
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
          DENON COSMETICS is dedicated to formulating export-quality cosmetics and skin care treatments engineered specifically for South Asian skin health, climate resilience, and natural radiance.
        </p>
      </div>

      {/* Brand Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Botanical Innovation</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            We blend ancient beauty elixirs like Rice Water and Pearl Extracts with clinical actives like Niacinamide, Vitamin C, and Salicylic Acid.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Dermatologically Tested</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every formula undergoes rigorous quality control to ensure non-irritating, safe, and visible results for all Pakistani skin types.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Export Quality Standards</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Manufactured with international beauty standards in Rawalpindi, Pakistan, delivering premium packaging and potent formulations.
          </p>
        </div>
      </div>

      {/* Factory & Head Office Banner */}
      <div className="bg-stone-50 p-8 sm:p-12 rounded-3xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            HEADQUARTERS & DISTRIBUTION
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Located in Rawalpindi, Pakistan
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Our corporate head office is located at Bajur Tower, Rawalpindi. We dispatch hundreds of Cash on Delivery parcels daily across Lahore, Karachi, Islamabad, Peshawar, Quetta, Multan, and Faisalabad.
          </p>

          <div className="text-xs font-semibold text-stone-800 space-y-1">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-800" />
              <span>{settings.officeAddress}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('contact')}
          className="px-8 py-4 bg-stone-900 text-amber-200 font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-stone-800 shrink-0 shadow-md"
        >
          Get In Touch With Denon
        </button>
      </div>
    </div>
  );
};
