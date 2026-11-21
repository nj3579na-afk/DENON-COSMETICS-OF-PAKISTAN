import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, MessageCircle, ShieldCheck, CheckCircle2, Send, MessageSquare, Play, Image as ImageIcon } from 'lucide-react';
import { Product, Review } from '../types';
import { submitCustomerReview } from '../services/api';
import { getYouTubeEmbedUrl } from './VideoUploader';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  whatsappNumber: string;
  reviews?: Review[];
  onReviewSubmitted?: (updatedReviews: Review[]) => void;
  initialTab?: 'benefits' | 'ingredients' | 'howToUse' | 'reviews';
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  whatsappNumber,
  reviews = [],
  onReviewSubmitted,
  initialTab = 'benefits',
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'howToUse' | 'reviews'>(initialTab);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [mediaMode, setMediaMode] = useState<'photo' | 'video'>('photo');

  useEffect(() => {
    if (product) {
      setActiveTab(initialTab || 'benefits');
      setQuantity(1);
      setReviewFeedback('');
      setMediaMode('photo');
    }
  }, [product?.id, initialTab]);

  if (!product) return null;

  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.status !== 'Rejected'
  );
  const liveReviewCount = productReviews.length;
  const liveRating =
    liveReviewCount > 0
      ? (productReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / liveReviewCount).toFixed(1)
      : null;

  const handleProductReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim() || isSubmittingReview) return;
    setIsSubmittingReview(true);
    setReviewFeedback('');
    try {
      const updated = await submitCustomerReview({
        productId: product.id,
        productName: product.name,
        reviewType: 'product',
        customerName: reviewerName,
        city: reviewerCity,
        rating: reviewRating,
        comment: reviewComment,
      });
      if (onReviewSubmitted) onReviewSubmitted(updated);
      setReviewerName('');
      setReviewerCity('');
      setReviewRating(5);
      setReviewComment('');
      setReviewFeedback('Thank you! Your live review has been posted.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Denon Cosmetics! I would like to order:\n\n*Product:* ${product.name}\n*Quantity:* ${quantity}\n*Price:* PKR ${((product.salePrice ?? 0) * (quantity ?? 1)).toLocaleString()}\n\nPlease deliver via Cash on Delivery in Pakistan.`
  );
  const cleanWhatsappNumber = (whatsappNumber || '').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          id="close-quickview-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image / Optional Video Column */}
          <div className="bg-stone-100 p-6 flex flex-col justify-between items-center relative gap-3">
            <span className="absolute top-4 left-4 z-10 bg-amber-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
              {product.brand}
            </span>

            {product.videoUrl && mediaMode === 'video' ? (
              <div className="w-full h-80 rounded-2xl overflow-hidden shadow-md my-auto bg-black flex items-center justify-center">
                {getYouTubeEmbedUrl(product.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(product.videoUrl)!}
                    title={`${product.name} Video`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={product.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-h-80 object-cover rounded-2xl shadow-md my-auto"
              />
            )}

            {product.videoUrl && (
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-stone-200 shadow-xs">
                <button
                  type="button"
                  onClick={() => setMediaMode('photo')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    mediaMode === 'photo'
                      ? 'bg-stone-900 text-amber-200'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaMode('video')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    mediaMode === 'video'
                      ? 'bg-amber-700 text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Watch Video</span>
                </button>
              </div>
            )}

            <div className="w-full pt-2 text-center">
              <span className="text-xs text-stone-500 font-medium flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                100% Original & Dermatologically Tested
              </span>
            </div>
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
            <div>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className="flex items-center gap-2 text-xs text-amber-700 hover:text-amber-900 font-bold mb-1 cursor-pointer"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        liveRating && i < Math.round(Number(liveRating))
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span>
                  {liveRating
                    ? `${liveRating} (${liveReviewCount} ${liveReviewCount === 1 ? 'Review' : 'Reviews'})`
                    : 'No reviews yet — Write one'}
                </span>
              </button>

              <h2 className="font-serif text-xl font-bold text-stone-900 leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-stone-500 mt-1">{product.suitableSkinType}</p>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-sans text-2xl font-extrabold text-stone-900">
                  PKR {(product.salePrice ?? 0).toLocaleString()}
                </span>
                {Boolean(product.retailPrice && product.retailPrice > (product.salePrice ?? 0)) && (
                  <span className="text-sm text-stone-400 line-through">
                    PKR {(product.retailPrice ?? 0).toLocaleString()}
                  </span>
                )}
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-md">
                  Save {product.discountPercent}%
                </span>
              </div>
            </div>

            {/* Description Excerpt */}
            <p className="text-xs text-stone-600 leading-relaxed">{product.description}</p>

            {/* Nav Tabs */}
            <div className="border-b border-stone-200 flex flex-wrap gap-3 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('benefits')}
                className={`pb-2 transition-colors ${
                  activeTab === 'benefits' ? 'border-b-2 border-amber-800 text-amber-900' : 'text-stone-400'
                }`}
              >
                Key Benefits
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`pb-2 transition-colors ${
                  activeTab === 'ingredients' ? 'border-b-2 border-amber-800 text-amber-900' : 'text-stone-400'
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('howToUse')}
                className={`pb-2 transition-colors ${
                  activeTab === 'howToUse' ? 'border-b-2 border-amber-800 text-amber-900' : 'text-stone-400'
                }`}
              >
                How To Use
              </button>
              <button
                id="quickview-reviews-tab-btn"
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 transition-colors flex items-center gap-1 ${
                  activeTab === 'reviews' ? 'border-b-2 border-amber-800 text-amber-900' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Reviews ({liveReviewCount})</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="text-xs text-stone-700 min-h-[60px]">
              {activeTab === 'benefits' && (
                <ul className="space-y-1">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === 'ingredients' && (
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className="px-2 py-1 bg-stone-100 text-stone-800 rounded-md text-[11px] font-medium">
                      {ing}
                    </span>
                  ))}
                </div>
              )}
              {activeTab === 'howToUse' && <p className="leading-relaxed">{product.howToUse}</p>}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {/* Live Product Review Form */}
                  <form
                    onSubmit={handleProductReviewSubmit}
                    className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-xs">
                        Write a Review for this Product
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-0.5 cursor-pointer"
                            title={`${star} Star`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= reviewRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your Name *"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-800 focus:outline-hidden"
                      />
                      <input
                        type="text"
                        placeholder="City (Optional)"
                        value={reviewerCity}
                        onChange={(e) => setReviewerCity(e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-800 focus:outline-hidden"
                      />
                    </div>

                    <textarea
                      required
                      rows={2}
                      placeholder="Share your real experience with this product..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-800 focus:outline-hidden"
                    />

                    {reviewFeedback && (
                      <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {reviewFeedback}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full py-2 bg-stone-900 text-amber-200 text-xs font-bold rounded-lg hover:bg-stone-800 flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingReview ? 'Posting Review...' : 'Post Live Review'}</span>
                    </button>
                  </form>

                  {/* Product Reviews List */}
                  <div className="max-h-44 overflow-y-auto space-y-2.5 pr-1">
                    {productReviews.length === 0 ? (
                      <p className="text-center text-stone-500 py-3 italic">
                        No customer reviews for this product yet. Be the first to share your honest feedback!
                      </p>
                    ) : (
                      productReviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="bg-white p-3 rounded-xl border border-stone-200 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-900">{rev.customerName}</span>
                            <span className="text-[10px] text-stone-400">{rev.date}</span>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(rev.rating)].map((_, idx) => (
                              <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-stone-700 leading-relaxed">{rev.comment}</p>
                          {rev.adminReply && (
                            <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 text-[11px] text-amber-950">
                              <strong>Denon Team:</strong> {rev.adminReply}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-stone-700">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 hover:bg-stone-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-bold text-xs">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1 hover:bg-stone-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  id="quickview-add-cart"
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="py-2.5 px-4 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag
                </button>

                <button
                  id="quickview-buy-now"
                  onClick={() => {
                    onBuyNow(product, quantity);
                    onClose();
                  }}
                  className="py-2.5 px-4 bg-amber-800 text-white text-xs font-bold rounded-xl hover:bg-amber-900 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Buy Now (COD)
                </button>
              </div>

              <a
                id="quickview-whatsapp"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl hover:bg-emerald-100 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Order via WhatsApp Direct</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
