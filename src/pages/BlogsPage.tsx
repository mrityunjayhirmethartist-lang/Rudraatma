import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { BLOGS_DATA } from '../data/blogsData';
import { BlogArticle } from '../types';
import { Search, BookOpen, X, ArrowLeft, Clock, Calendar, User } from 'lucide-react';

export const BlogsPage: React.FC = () => {
  const { navigate } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);

  const categories = ['All', 'Audio Engineering & QC', 'Artwork & Visuals', 'Metadata & Royalties', 'Music Rights & Legal'];

  const filteredArticles = BLOGS_DATA.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              Knowledge Base
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display mt-1">
              Music Distribution & Rights Articles
            </h1>
            <p className="text-sm text-slate-300 mt-2">
              Authoritative technical guides covering audio mastering specifications, cover artwork rejection pitfalls, ISRC/UPC barcode systems, and mechanical copyrights.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-8 pb-6 border-b border-slate-900">
            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles by title or keyword..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-900/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.length === 0 ? (
              <div className="col-span-3 py-16 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
                No articles matching your search criteria. Try a different keyword or category.
              </div>
            ) : (
              filteredArticles.map((art) => (
                <article
                  key={art.id}
                  onClick={() => setActiveArticle(art)}
                  className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider">
                      {art.category}
                    </span>
                    <h2 className="text-base font-bold text-white font-display mt-2 group-hover:text-blue-300 transition-colors">
                      {art.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{art.readTime}</span>
                    </div>
                    <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                      Read Full Article →
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setActiveArticle(null)}
          />
          <div className="relative w-full max-w-2xl bg-[#0b1120] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-mono text-blue-400 uppercase">
                {activeArticle.category}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display leading-tight">
                {activeArticle.title}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-mono pb-4 border-b border-slate-800/60">
                <span>{activeArticle.author}</span>
                <span>·</span>
                <span>{activeArticle.publishedDate}</span>
                <span>·</span>
                <span>{activeArticle.readTime}</span>
              </div>

              <div className="mt-6 space-y-4 text-sm text-slate-200 leading-relaxed font-sans">
                {activeArticle.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
};
