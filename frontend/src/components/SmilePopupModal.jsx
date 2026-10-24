import React, { useState, useEffect } from 'react';
import { X, Sparkles, ExternalLink, Shuffle, Loader2 } from 'lucide-react';

const EXPLORE_URL = 'https://tenor.com/search/jack-off-gifs';

const CURATED_GIFS = [
  {
    id: 'ken-jeong',
    title: 'Ken Jeong — The Hangover',
    url: '/gifs/ken-jeong.gif',
    fallback: 'https://images.weserv.nl/?url=https://media.tenor.com/iv_gVuhCZLQAAAAM/jerk-ken-jeong.gif&n=-1',
  },
  {
    id: 'franco',
    title: 'James Franco — This Is The End',
    url: '/gifs/franco.gif',
    fallback: 'https://images.weserv.nl/?url=https://media.tenor.com/Ckw74yedYG8AAAAM/franco-this.gif&n=-1',
  },
  {
    id: 'kermit',
    title: 'Kermit The Frog',
    url: '/gifs/kermit.gif',
    fallback: 'https://images.weserv.nl/?url=https://media.tenor.com/-B05_Hxs7qAAAAAM/paja-kermy.gif&n=-1',
  },
  {
    id: 'michael-keaton',
    title: 'Michael Keaton Reaction',
    url: '/gifs/michael-keaton.gif',
    fallback: 'https://images.weserv.nl/?url=https://media.tenor.com/bCVX-oSmNzoAAAAM/jack-off-jerk-off.gif&n=-1',
  },
  {
    id: 'creep',
    title: 'Laptop Creep Reaction',
    url: '/gifs/creep.gif',
    fallback: 'https://images.weserv.nl/?url=https://media.tenor.com/LxOuNTogG9oAAAAM/creep-creeper.gif&n=-1',
  },
  {
    id: 'koala',
    title: 'Koala Scratch',
    url: '/gifs/koala.gif',
    fallback: 'https://images.weserv.nl/?url=https://media.tenor.com/O61a2Nd1Mj0AAAAM/koala-scratch-koala-meme.gif&n=-1',
  },
  {
    id: 'grand-salute',
    title: 'Grand Salute Reaction',
    url: '/gifs/grand-salute.gif',
    fallback: 'https://images.weserv.nl/?url=https://media.tenor.com/OH7l8jyOBEoAAAAM/grand-salute-jerk-off.gif&n=-1',
  },
  {
    id: 'pepe',
    title: 'Pepe The Frog',
    url: '/gifs/pepe.gif',
    fallback: 'https://images.weserv.nl/?url=https://media.tenor.com/EwcJLtH6Q1wAAAAM/pepe-the-frog-salami.gif&n=-1',
  },
];

export default function SmilePopupModal({ isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Reset to first gif whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setLoading(true);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentGif = CURATED_GIFS[currentIndex];

  const handleNextGif = () => {
    setLoading(true);
    setCurrentIndex((prev) => (prev + 1) % CURATED_GIFS.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container-lowest/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      {/* Centered Square Popup Card */}
      <div
        className="relative w-full max-w-[420px] aspect-square bg-surface-container border-2 border-primary rounded-2xl shadow-hard-lg overflow-hidden flex flex-col animate-scaleUp select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="h-12 px-3.5 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-surface-container border border-primary flex items-center justify-center shadow-hard">
              <span className="material-symbols-outlined text-primary text-base font-bold">sentiment_very_satisfied</span>
            </div>
            <div>
              <h3 className="font-modern-20 text-base font-normal text-on-surface tracking-wide leading-tight flex items-center gap-1.5">
                Surprise Drop <Sparkles className="w-3.5 h-3.5 text-primary" />
              </h3>
              <span className="font-mono text-[9px] text-outline block leading-none">
                {currentGif.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {CURATED_GIFS.length > 1 && (
              <button
                onClick={handleNextGif}
                className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container-high transition-colors flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                title="Shuffle next GIF"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Next</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              title="Close popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* GIF Media Display Area */}
        <div className="flex-1 w-full bg-black/70 relative flex items-center justify-center overflow-hidden min-h-0 p-2">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
          <img
            key={currentGif.url}
            src={currentGif.url}
            referrerPolicy="no-referrer"
            onLoad={() => setLoading(false)}
            onError={(e) => {
              if (currentGif.fallback && e.target.src !== currentGif.fallback) {
                e.target.src = currentGif.fallback;
              } else {
                setLoading(false);
              }
            }}
            alt={currentGif.title}
            className={`w-full h-full object-contain rounded-lg transition-opacity duration-200 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
            loading="eager"
          />
        </div>

        {/* Modal Footer Bar */}
        <div className="h-10 px-3.5 bg-surface-container-low border-t border-outline-variant/60 flex items-center justify-between shrink-0">
          <a
            href={EXPLORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-outline hover:text-primary transition-colors flex items-center gap-1"
          >
            <span>Tenor GIFs</span>
            <ExternalLink className="w-3 h-3 text-primary" />
          </a>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-fixed text-on-primary font-headline text-xs font-bold shadow-hard active:translate-y-0.5 transition-all btn-neo cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
