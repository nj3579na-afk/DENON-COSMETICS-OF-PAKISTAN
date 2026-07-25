import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react';
import { INITIAL_FAQS } from '../data/initialData';
import { AdminSettings } from '../types';

interface FAQPageProps {
  settings: AdminSettings;
}

export const FAQPage: React.FC<FAQPageProps> = ({ settings }) => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [search, setSearch] = useState('');

  const filteredFaqs = INITIAL_FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
          HELP & FREQUENTLY ASKED QUESTIONS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Got Questions? We Have Answers.
        </h1>
        <p className="text-xs text-stone-600 max-w-lg mx-auto">
          Everything you need to know about Denon Cosmetics, Cash on Delivery in Pakistan, ingredient safety, and AI skin consultation.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400" />
        <input
          type="text"
          placeholder="Search FAQs (e.g. COD, Rice face wash, delivery time)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-xs font-medium focus:ring-1 focus:ring-amber-800 shadow-xs"
        />
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full p-5 text-left font-serif text-sm font-bold text-stone-900 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
              >
                <span>{faq.question}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-amber-800 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3 bg-stone-50/50">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help CTA */}
      <div className="bg-amber-50 p-8 rounded-3xl border border-amber-200 text-center space-y-3">
        <h3 className="font-serif text-lg font-bold text-amber-950">Still Have Questions?</h3>
        <p className="text-xs text-amber-900 max-w-md mx-auto">
          Chat directly with our customer support team in Rawalpindi via WhatsApp for instant assistance!
        </p>
        <a
          href={settings.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-xs"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp ({settings.whatsappNumber})</span>
        </a>
      </div>
    </div>
  );
};
