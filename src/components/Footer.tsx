import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Truck, RefreshCw, Award, ArrowUp } from 'lucide-react';
import { AdminSettings } from '../types';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  settings: AdminSettings;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, settings }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-10 border-t border-stone-800">
      {/* Brand Value Props Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-stone-800/80 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
            <div className="p-3 bg-amber-900/40 text-amber-400 rounded-lg">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-100 text-sm">Nationwide COD</h4>
              <p className="text-xs text-stone-400">Fast 2-4 day delivery across Pakistan</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
            <div className="p-3 bg-amber-900/40 text-amber-400 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-100 text-sm">100% Authentic</h4>
              <p className="text-xs text-stone-400">Original & Dermatologically Tested</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
            <div className="p-3 bg-amber-900/40 text-amber-400 rounded-lg">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-100 text-sm">7-Day Guarantee</h4>
              <p className="text-xs text-stone-400">Hassle-free return & replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
            <div className="p-3 bg-amber-900/40 text-amber-400 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-100 text-sm">Export Quality</h4>
              <p className="text-xs text-stone-400">Formulated with botanical precision</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
        {/* Col 1: Brand Info & Socials */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h3 className="font-serif text-2xl font-extrabold tracking-wider text-amber-200">
              DENON COSMETICS
            </h3>
            <p className="text-xs tracking-widest uppercase text-amber-600 font-semibold mt-0.5">
              SKIN BEAUTY • PAKISTAN
            </p>
          </div>

          <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
            Pakistan’s premier international-standard cosmetics brand. Formulated with botanical extracts, Rice Water, Niacinamide, and Vitamin C for pure, radiant, and healthy skin.
          </p>

          <div className="pt-2">
            <h5 className="text-xs font-semibold uppercase text-stone-200 tracking-wider mb-3">
              Follow Our Official Social Media
            </h5>
            <div className="flex items-center gap-3">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                title="Facebook"
              >
                <span className="font-bold text-xs">FB</span>
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                title="Instagram"
              >
                <span className="font-bold text-xs">IG</span>
              </a>
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                title="YouTube"
              >
                <span className="font-bold text-xs">YT</span>
              </a>
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                title="TikTok"
              >
                <span className="font-bold text-xs">TK</span>
              </a>
            </div>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="font-serif text-sm font-semibold text-stone-100 uppercase tracking-wider mb-4 border-b border-amber-800/40 pb-2">
            Explore Denon
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-400">
            <li>
              <button onClick={() => setActiveTab('shop')} className="hover:text-amber-300 transition-colors">
                Shop All Skincare
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('categories')} className="hover:text-amber-300 transition-colors">
                Product Categories
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('ai-skin')} className="hover:text-amber-300 text-amber-400 font-medium transition-colors">
                ✨ AI Skin Consultation
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('track-order')} className="hover:text-amber-300 transition-colors">
                Track Your Order
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('blog')} className="hover:text-amber-300 transition-colors">
                Skincare Beauty Blog
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('about')} className="hover:text-amber-300 transition-colors">
                Brand Story & Mission
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Care & Policies */}
        <div>
          <h4 className="font-serif text-sm font-semibold text-stone-100 uppercase tracking-wider mb-4 border-b border-amber-800/40 pb-2">
            Policies & FAQ
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-400">
            <li>
              <button onClick={() => setActiveTab('faq')} className="hover:text-amber-300 transition-colors">
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('policies')} className="hover:text-amber-300 transition-colors">
                Shipping & COD Policy
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('policies')} className="hover:text-amber-300 transition-colors">
                Return & Refund Policy
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('policies')} className="hover:text-amber-300 transition-colors">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('policies')} className="hover:text-amber-300 transition-colors">
                Terms & Conditions
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Direct Contact Info */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-semibold text-stone-100 uppercase tracking-wider mb-4 border-b border-amber-800/40 pb-2">
            Head Office (Pakistan)
          </h4>
          <p className="flex items-start gap-2.5 text-xs text-stone-300">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{settings.officeAddress}</span>
          </p>
          <p className="flex items-center gap-2.5 text-xs text-stone-300">
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Phone: {settings.phoneNumber}</span>
          </p>
          <p className="flex items-center gap-2.5 text-xs text-emerald-400 font-medium">
            <MessageCircle className="w-4 h-4 shrink-0" />
            <a href={settings.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
              WhatsApp: {settings.whatsappNumber}
            </a>
          </p>
          <p className="flex items-center gap-2.5 text-xs text-stone-300">
            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{settings.email}</span>
          </p>
        </div>
      </div>

      {/* Bottom Legal & Payment Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <p>© {new Date().getFullYear()} DENON COSMETICS (Pakistan). All rights reserved.</p>

        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded-sm text-[10px] text-emerald-400 font-bold uppercase">
            Cash On Delivery (COD)
          </span>
          <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded-sm text-[10px] text-amber-300 font-bold uppercase">
            JazzCash
          </span>
          <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded-sm text-[10px] text-green-300 font-bold uppercase">
            EasyPaisa
          </span>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
