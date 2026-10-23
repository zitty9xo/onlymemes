import React, { useState, useEffect } from 'react';
import { X, Search, Film, TrendingUp, Sparkles, Check, Loader2, ArrowRight } from 'lucide-react';
import { getTrendingGifs, searchGifs } from '../services/giphyService';

export default function GiphyModal({
  isOpen,
  onClose,
  onSelectGif
}) {
  const [gifs, setGifs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Trending');

  const categories = ['Trending', 'Memes', 'Reactions', 'Gaming', 'Anime', 'Coding', 'Cats'];

  // Load trending on mount / open
  useEffect(() => {
    if (isOpen) {
      loadTrending();
    }
  }, [isOpen]);

  const loadTrending = async () => {
    setLoading(true);
    setActiveCategory('Trending');
    setSearchQuery('');
    try {
      const results = await getTrendingGifs(24);
      setGifs(results);
    } catch (e) {
      console.warn('GIPHY load failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      return loadTrending();
    }
    setLoading(true);
    setActiveCategory(searchQuery);
    try {
      const results = await searchGifs(searchQuery, 24);
      setGifs(results);
    } catch (e) {
      console.warn('GIPHY search failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (cat) => {
    setActiveCategory(cat);
    setSearchQuery('');
    setLoading(true);
    try {
      if (cat === 'Trending') {
        const results = await getTrendingGifs(24);
        setGifs(results);
      } else {
        const results = await searchGifs(cat, 24);
        setGifs(results);
      }
    } catch (e) {
      console.warn('Category fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-surface-container-lowest/90 backdrop-blur-xl animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface-container border border-outline-variant rounded-2xl shadow-hard-lg flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-tertiary/20 border border-tertiary flex items-center justify-center shadow-hard">
              <Film className="w-4 h-4 text-tertiary" />
            </div>
            <div>
              <h2 className="font-modern-20 text-2xl font-normal text-on-surface tracking-wide leading-tight">
                GIPHY <span className="text-tertiary font-bold">Meme Discovery</span>
              </h2>
              <span className="font-mono text-[10px] text-outline uppercase tracking-wider">
                Select any trending GIF to publish or customize
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
            aria-label="Close GIPHY modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Categories */}
        <div className="p-4 bg-surface-container-low border-b border-outline-variant/50 flex flex-col gap-3">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search millions of GIFs on GIPHY (e.g. mind blown, cat coding, victory)..."
              className="w-full bg-surface-container border border-outline-variant rounded-xl pl-10 pr-24 py-2 text-xs text-on-surface font-body focus:outline-none focus:border-tertiary transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 rounded-lg bg-tertiary/20 hover:bg-tertiary hover:text-on-tertiary text-tertiary font-mono text-xs font-bold transition-all border border-tertiary/40"
            >
              Search
            </button>
          </form>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold shrink-0 transition-all ${
                  activeCategory === cat
                    ? 'bg-tertiary text-on-tertiary shadow-sm'
                    : 'bg-surface-container border border-outline-variant text-outline hover:text-on-surface hover:border-tertiary/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GIFs Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-surface-container-lowest">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-outline">
              <Loader2 className="w-8 h-8 text-tertiary animate-spin" />
              <span className="font-mono text-xs">Querying GIPHY culture vault...</span>
            </div>
          ) : gifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-outline">
              <Film className="w-8 h-8 opacity-40" />
              <p className="font-body text-xs text-on-surface-variant">No GIFs found for "{searchQuery}".</p>
              <button
                onClick={loadTrending}
                className="mt-2 font-mono text-xs text-primary underline"
              >
                Reset to Trending
              </button>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 md:columns-4 gap-2.5 space-y-2.5">
              {gifs.map((gif) => (
                <div
                  key={gif.id}
                  onClick={() => {
                    onSelectGif(gif);
                    onClose();
                  }}
                  className="break-inside-avoid relative rounded-xl overflow-hidden bg-surface-container border border-outline-variant cursor-pointer group hover:border-tertiary hover:shadow-hard transition-all"
                >
                  <img
                    src={gif.previewUrl || gif.url}
                    alt={gif.title}
                    loading="lazy"
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-surface-container-lowest/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex flex-col justify-end p-2.5 transition-opacity">
                    <p className="font-body text-[11px] font-bold text-on-surface truncate mb-1.5">
                      {gif.title}
                    </p>
                    <span className="inline-flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-tertiary text-on-tertiary font-headline text-[10px] font-bold shadow-sm">
                      <span>Use this GIF</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container-low border-t border-outline-variant/60 flex items-center justify-between text-outline font-mono text-[10px]">
          <span>Powered by GIPHY API</span>
          <span>Click any GIF to use in your meme</span>
        </div>

      </div>
    </div>
  );
}
