import React, { useState } from 'react';
import { Sparkles, Upload, RefreshCw, CheckCircle2, ShieldCheck, ShoppingBag, ArrowRight, Camera, HelpCircle } from 'lucide-react';
import { Product, SkinConsultationRequest, SkinConsultationResult } from '../types';
import { requestSkinConsultation } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface AISkinConsultationPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  whatsappNumber: string;
}

export const AISkinConsultationPage: React.FC<AISkinConsultationPageProps> = ({
  products,
  onAddToCart,
  onBuyNow,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
  whatsappNumber,
}) => {
  const [age, setAge] = useState('24');
  const [gender, setGender] = useState('Female');
  const [skinType, setSkinType] = useState<SkinConsultationRequest['skinType']>('Combination');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(['Dark Spots', 'Dullness']);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SkinConsultationResult | null>(null);

  const availableConcerns = [
    'Dark Spots & Hyperpigmentation',
    'Active Acne & Pimples',
    'Dullness & Lack of Glow',
    'Dryness & Flaking',
    'Excess Sebum & Oily Shine',
    'Unwanted Body Hair',
    'Fine Lines & Wrinkles',
    'Sunburn & Redness',
  ];

  const handleToggleConcern = (concern: string) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== concern));
    } else {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await requestSkinConsultation({
        age,
        gender,
        skinType,
        skinConcerns: selectedConcerns,
        additionalNotes,
        image: imageBase64 || undefined,
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const recommendedProducts = result
    ? products.filter((p) => result.recommendedProductIds.includes(p.id))
    : [];

  const handleAddAllToCart = () => {
    recommendedProducts.forEach((p) => onAddToCart(p));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-stone-100 p-8 sm:p-12 rounded-3xl border border-amber-600/30 shadow-xl space-y-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-900/80 border border-amber-400/40 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>POWERED BY GEMINI AI DERMATOLOGY ASSISTANT</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-amber-100">
          AI Skincare & Facial Analysis
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl mx-auto">
          Upload a clear photo of your face or select your skin parameters below. Our server-side Gemini AI evaluates your skin health and matches you with exact Denon Rice Water, Vitamin C, or Anti-Acne products!
        </p>
      </div>

      {!result ? (
        /* Consultation Input Form */
        <form onSubmit={handleConsultSubmit} className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-md space-y-8">
          {/* Step 1: Optional Photo Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-stone-900 font-serif">
              Step 1: Upload Face Photo (Optional for AI Visual Analysis)
            </label>
            <div className="border-2 border-dashed border-stone-300 hover:border-amber-600 rounded-2xl p-6 text-center transition-colors bg-stone-50/50 flex flex-col items-center justify-center space-y-3">
              {imageBase64 ? (
                <div className="relative">
                  <img
                    src={imageBase64}
                    alt="Uploaded Face"
                    className="w-32 h-32 object-cover rounded-2xl border-2 border-amber-600 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setImageBase64(null)}
                    className="mt-2 text-xs font-bold text-rose-600 hover:underline"
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-800">
                      Click to upload a clear selfie or facial photo
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      Supported: JPG, PNG. Used only for instant server-side analysis.
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="skin-photo-input"
                  />
                  <label
                    htmlFor="skin-photo-input"
                    className="px-4 py-2 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl cursor-pointer hover:bg-stone-800 transition-colors"
                  >
                    Select Image
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Step 2: Personal Age & Skin Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Your Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
                min="12"
                max="90"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Skin Type</label>
              <select
                value={skinType}
                onChange={(e: any) => setSkinType(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
              >
                <option value="Combination">Combination Skin</option>
                <option value="Oily">Oily Skin</option>
                <option value="Dry">Dry Skin</option>
                <option value="Normal">Normal Skin</option>
                <option value="Sensitive">Sensitive Skin</option>
              </select>
            </div>
          </div>

          {/* Step 3: Skin Concerns Checklist */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <label className="block text-sm font-bold text-stone-900 font-serif">
              Step 3: Select Your Primary Skin Concerns
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableConcerns.map((concern) => {
                const isSelected = selectedConcerns.includes(concern);
                return (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => handleToggleConcern(concern)}
                    className={`p-3 rounded-xl text-xs font-semibold text-left flex items-center justify-between border transition-all ${
                      isSelected
                        ? 'bg-amber-900 text-amber-100 border-amber-800 shadow-2xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{concern}</span>
                    <CheckCircle2
                      className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-stone-300'}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="pt-4 border-t border-stone-100">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Additional Details (e.g., current products, climate)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Living in humid Karachi, facing sunspots after summer..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full p-3 border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-800"
            />
          </div>

          {/* Submit CTA */}
          <button
            id="submit-ai-skin-consult"
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-stone-900 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>AI Server is Analyzing Skin Profile...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Generate My AI Dermatology Routine</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Consultation Results View */
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  AI CONSULTATION REPORT
                </span>
                <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">{result.summary}</h2>
              </div>
              <button
                onClick={() => setResult(null)}
                className="px-4 py-2 bg-stone-100 text-stone-800 hover:bg-stone-200 text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                Re-take Consultation
              </button>
            </div>

            {/* Analysis Paragraph */}
            <div className="space-y-2">
              <h3 className="font-serif text-sm font-bold text-stone-900">Dermatology Assessment</h3>
              <p className="text-xs text-stone-700 leading-relaxed bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60">
                {result.analysis}
              </p>
            </div>

            {/* Morning vs Evening Routine */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-serif text-xs font-bold text-stone-900 uppercase tracking-wider text-amber-900 flex items-center gap-2">
                  <span>☀️ Morning Routine (AM)</span>
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {result.routineAdvice.morning.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-950 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-stone-900 text-stone-100 p-5 rounded-2xl border border-stone-800 space-y-3">
                <h4 className="font-serif text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <span>🌙 Evening Routine (PM)</span>
                </h4>
                <ul className="space-y-2 text-xs text-stone-300">
                  {result.routineAdvice.evening.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-900 text-amber-200 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-[10px] text-stone-400 italic pt-2">{result.disclaimer}</p>
          </div>

          {/* Recommended Denon Products */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                  RECOMMENDED FOR YOUR SKIN PROFILE
                </span>
                <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  Matched Denon Products
                </h2>
              </div>

              <button
                id="add-all-recommended-btn"
                onClick={handleAddAllToCart}
                className="px-5 py-3 bg-stone-900 text-amber-200 hover:bg-stone-800 font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shrink-0"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>Add All Recommended Products to Bag</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                  onQuickView={onQuickView}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  whatsappNumber={whatsappNumber}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
