import React, { useState } from 'react';
import { Search, Upload, Film, ShieldCheck, User, LogOut } from 'lucide-react';

export default function Header({ user, onOpenAuth, onOpenStudio, onOpenUpload, onOpenGiphy, onOpenAdmin, onOpenProfile, onSignOut, onSmileClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant px-4 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 select-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSmileClick?.();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSmileClick?.();
              }
            }}
            className="w-10 h-10 rounded-xl bg-surface-container border-2 border-primary overflow-hidden flex items-center justify-center shadow-hard hover:scale-110 active:scale-95 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/60"
            title="Click for surprise GIF drop!"
            aria-label="Surprise Smile GIF"
          >
            <span className="material-symbols-outlined text-primary text-2xl font-bold pointer-events-none">sentiment_very_satisfied</span>
          </button>
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex items-center gap-1.5">
              <span className="font-modern-20 text-2xl font-normal text-on-surface tracking-wide">only<span className="text-primary font-bold">memes</span></span>
            </div>
            <p className="font-mono text-[11px] text-outline hidden sm:block">Kinetic Meme & Culture Engine</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <div className="relative flex items-center bg-surface-container-low border border-outline-variant rounded-xl px-3 py-1.5 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all">
            <Search className="w-4 h-4 text-outline mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memes, templates, tags (#gaming, #dev)..."
              className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none font-body"
            />
            <kbd className="hidden lg:inline-block font-mono text-[10px] bg-surface-container px-1.5 py-0.5 rounded text-outline border border-outline-variant/60">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* GIPHY Search Button */}
          <button
            onClick={onOpenGiphy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant hover:border-tertiary text-on-surface hover:text-tertiary font-mono text-xs font-bold transition-all btn-neo"
            title="Search trending GIFs from GIPHY"
          >
            <Film className="w-4 h-4 text-tertiary" />
            <span className="hidden sm:inline">GIPHY</span>
          </button>


          {/* Primary Upload Meme CTA */}
          <button
            onClick={user ? onOpenUpload : onOpenAuth}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary font-headline text-xs sm:text-sm font-bold shadow-hard active:translate-y-0.5 transition-all btn-neo"
            title="Upload meme image or GIF directly to Azure Storage"
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Meme</span>
          </button>

          {/* OnlyAdmins Shortcut (If Admin) */}
          {user?.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/15 border border-primary/50 text-on-surface hover:bg-primary/25 font-grotesk text-xs font-bold transition-all shadow-hard btn-neo"
              title="onlyadmins"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>only<span className="text-primary font-bold">admins</span></span>
            </button>
          )}

          {/* User Profile / Guest Sign In */}
          {user ? (
            <div className="relative pl-1 border-l border-outline-variant">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-surface-container-high transition-colors focus:outline-none"
              >
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=60'}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full border border-primary object-cover"
                />
                <span className="font-mono text-xs text-on-surface font-semibold hidden xl:inline max-w-[100px] truncate">
                  {user.displayName || 'Creator'}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-surface-container border border-outline-variant rounded-xl shadow-hard-lg py-1.5 z-50 flex flex-col gap-0.5 select-none animate-fadeIn">
                    <div className="px-3 py-1.5 border-b border-outline-variant/60">
                      <p className="font-body text-xs text-on-surface font-bold truncate">{user.displayName}</p>
                      <p className="font-mono text-[10px] text-outline truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => { onOpenProfile(); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 text-left font-mono text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>View Profile</span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => { onOpenAdmin(); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 px-3 py-2 text-left font-mono text-xs text-on-surface hover:bg-primary/15 transition-colors font-bold"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span>only<span className="text-primary font-bold">admins</span></span>
                      </button>
                    )}

                    <div className="my-1 border-t border-outline-variant/60" />

                    <button
                      onClick={() => { onSignOut(); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 text-left font-mono text-xs text-error hover:bg-error/15 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-error" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-mono text-xs font-bold transition-all"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
