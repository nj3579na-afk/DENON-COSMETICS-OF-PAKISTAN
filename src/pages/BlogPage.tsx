import React, { useState } from 'react';
import { BookOpen, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { INITIAL_BLOG_POSTS } from '../data/initialData';
import { BlogPost } from '../types';

export const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
          DENON BEAUTY JOURNAL
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Pakistani Skincare Guides & Research
        </h1>
        <p className="text-xs text-stone-600">
          Expert skincare advice, Rice Water elixirs, Vitamin C tips, and body care routines tailored for Pakistani weather.
        </p>
      </div>

      {selectedPost ? (
        /* Full Post View */
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-md space-y-6 animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedPost(null)}
            className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
          >
            ← Back to All Articles
          </button>

          <span className="text-xs font-bold uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-md">
            {selectedPost.category}
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
            {selectedPost.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 border-y border-stone-100 py-3">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> {selectedPost.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {selectedPost.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {selectedPost.readTime}
            </span>
          </div>

          <img
            src={selectedPost.image}
            alt={selectedPost.title}
            className="w-full h-80 object-cover rounded-2xl"
          />

          <div className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line space-y-4">
            {selectedPost.content}
          </div>
        </div>
      ) : (
        /* Posts Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INITIAL_BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group cursor-pointer bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-video w-full bg-stone-100 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-base font-bold text-stone-900 mt-2 group-hover:text-amber-800 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-3 leading-relaxed">
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
  );
};
