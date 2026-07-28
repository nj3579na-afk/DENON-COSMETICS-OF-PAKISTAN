import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, User, Clock, ArrowRight, Search, Tag, Share2, Check } from 'lucide-react';
import { getStoredBlogPosts } from '../services/api';
import { BlogPost } from '../types';

export const BlogPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const posts = getStoredBlogPosts();
    return posts.filter((p) => p.status !== 'Draft');
  });
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const refreshBlogs = () => {
      const posts = getStoredBlogPosts();
      setBlogPosts(posts.filter((p) => p.status !== 'Draft'));
    };

    refreshBlogs();

    window.addEventListener('denon_data_updated', refreshBlogs);
    window.addEventListener('storage', refreshBlogs);

    return () => {
      window.removeEventListener('denon_data_updated', refreshBlogs);
      window.removeEventListener('storage', refreshBlogs);
    };
  }, []);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(blogPosts.map((b) => b.category || 'General')))];

  // Filtered posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(query)));

    return matchesCategory && matchesQuery;
  });

  const handleShare = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full">
          DENON BEAUTY JOURNAL
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Pakistani Skincare Guides & Research
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Expert skincare advice, Rice Water elixirs, Niacinamide spot correctors, Vitamin C tips, and body care routines tailored for Pakistani weather.
        </p>
      </div>

      {selectedPost ? (
        /* Full Article View */
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-12 rounded-3xl border border-stone-200/80 shadow-lg space-y-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <button
              onClick={() => setSelectedPost(null)}
              className="text-xs font-bold text-amber-900 hover:text-stone-900 flex items-center gap-1.5 transition-colors"
            >
              ← Back to Articles
            </button>
            <button
              onClick={() => handleShare(selectedPost)}
              className="px-3 py-1.5 bg-stone-100 hover:bg-amber-100 text-stone-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-md">
              {selectedPost.category}
            </span>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">
              {selectedPost.title}
            </h2>

            {selectedPost.excerpt && (
              <p className="text-sm text-stone-600 italic font-serif border-l-2 border-amber-800 pl-4 py-1">
                "{selectedPost.excerpt}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 border-y border-stone-100 py-3">
              <span className="flex items-center gap-1.5 font-medium text-stone-700">
                <User className="w-4 h-4 text-amber-800" /> {selectedPost.author || 'DENON Skin Care Lab'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-800" /> {selectedPost.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-800" /> {selectedPost.readTime || '3 min read'}
              </span>
            </div>
          </div>

          {selectedPost.image && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body Content */}
          <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
            {selectedPost.content}
          </div>

          {/* Tags */}
          {selectedPost.tags && selectedPost.tags.length > 0 && (
            <div className="pt-6 border-t border-stone-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
                <Tag className="w-3.5 h-3.5 text-amber-800" />
                <span>Tags & Topics:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPost.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Blog List & Search/Filter */
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-50/80 p-4 rounded-2xl border border-stone-200">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-stone-900 text-amber-200 shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-200/60 border border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search skincare articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-800/20"
              />
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 space-y-3">
              <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-800">No Articles Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No published skincare articles match your search or selected category. Check back soon for new guides!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group cursor-pointer bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="aspect-video w-full bg-stone-100 overflow-hidden relative">
                    <img
                      src={post.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-amber-950 bg-amber-100/90 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] text-stone-400 font-semibold">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime || '3 min read'}</span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-900">
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

