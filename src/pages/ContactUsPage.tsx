import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { AdminSettings } from '../types';

interface ContactUsPageProps {
  settings: AdminSettings;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
          DIRECT CUSTOMER SUPPORT
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Contact DENON COSMETICS
        </h1>
        <p className="text-xs text-stone-600">
          Have a question about product usage, Cash on Delivery orders, or distribution partnerships? We are here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <h2 className="font-serif text-xl font-bold text-stone-900">Send Us a Message</h2>

          {submitted ? (
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
              <h3 className="font-serif text-base font-bold text-emerald-900">
                Message Received!
              </h3>
              <p className="text-xs text-emerald-800">
                Thank you for contacting Denon Cosmetics. Our support team in Rawalpindi will reply within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zainab Bibi"
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0300 5633597"
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Message Details *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your query or feedback here..."
                  className="w-full p-3 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-stone-900 text-amber-200 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Info Cards & Socials */}
        <div className="space-y-6">
          <div className="bg-stone-900 text-stone-100 p-8 rounded-3xl border border-stone-800 space-y-6">
            <h2 className="font-serif text-xl font-bold text-amber-200">Head Office Details</h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-900/60 text-amber-400 rounded-xl shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-200">Office Address:</h4>
                  <p className="text-stone-300 mt-0.5">{settings.officeAddress}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-900/60 text-amber-400 rounded-xl shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-200">Phone Support:</h4>
                  <a href={`tel:${settings.phoneNumber}`} className="text-amber-300 hover:underline">
                    {settings.phoneNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-900/60 text-emerald-400 rounded-xl shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-300">WhatsApp Instant Order:</h4>
                  <a href={settings.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline">
                    {settings.whatsappNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-900/60 text-amber-400 rounded-xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-200">Email Address:</h4>
                  <a href={`mailto:${settings.email}`} className="text-stone-300 hover:underline">
                    {settings.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Box */}
          <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-3">
            <h3 className="font-serif text-sm font-bold text-stone-900">Official Social Media Channels</h3>
            <p className="text-xs text-stone-600">Connect with us on social media for daily skincare tips, user results, and exclusive Pakistani promotions:</p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs font-bold">
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="px-3.5 py-2 bg-blue-600 text-white rounded-xl hover:opacity-90">
                Facebook
              </a>
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90">
                Instagram
              </a>
              <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="px-3.5 py-2 bg-rose-600 text-white rounded-xl hover:opacity-90">
                YouTube
              </a>
              <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="px-3.5 py-2 bg-stone-900 text-amber-200 rounded-xl hover:opacity-90">
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
