import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, Award, Calendar, Image, Heart, LogOut, Edit3, Check, Trash2 } from 'lucide-react';

export default function ProfileDrawer({ isOpen, onClose, user, onSignOut, onUpdateBio, userPosts = [] }) {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user?.bio || '');

  if (!isOpen || !user) return null;

  const handleSaveBio = () => {
    onUpdateBio(bioText);
    setIsEditingBio(false);
  };

  const myMemes = userPosts.length > 0 ? userPosts : [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container border-l border-outline-variant shadow-2xl flex flex-col">
          
          {/* Header Banner */}
          <div className="relative h-32 bg-gradient-to-r from-secondary-container via-surface-container-highest to-primary-container p-4 flex items-start justify-between">
            <span className="px-2.5 py-1 rounded bg-surface-container-lowest/80 backdrop-blur font-mono text-[10px] text-primary font-bold uppercase tracking-wider border border-primary/30">
              Creator Profile
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-surface-container-lowest/80 hover:bg-surface-container-highest text-on-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Avatar & Info */}
          <div className="px-6 pb-4 flex flex-col gap-4 -mt-12 relative flex-1 overflow-y-auto">
            
            {/* Avatar & Badges */}
            <div className="flex items-end justify-between">
              <div className="relative">
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80'}
                  alt={user.displayName}
                  className="w-24 h-24 rounded-2xl border-4 border-surface-container object-cover shadow-hard bg-surface-container-low"
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-primary border-2 border-surface-container flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-on-primary stroke-[3]" />
                </span>
              </div>

              {/* Role Chip */}
              <div className="flex flex-col items-end gap-1">
                <span className={`font-mono text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
                  user.role === 'admin'
                    ? 'bg-error/20 text-error border-error/50'
                    : 'bg-primary/20 text-primary border-primary/50'
                }`}>
                  {user.role === 'admin' ? '🛡️ Super Admin' : '⭐ Verified Creator'}
                </span>
                <span className="font-mono text-[10px] text-outline">
                  {(user.postsCount || 0) > 0 ? `Creator • ${user.postsCount} ${user.postsCount === 1 ? 'post' : 'posts'}` : 'New Member'}
                </span>
              </div>
            </div>

            {/* Display Name & Email */}
            <div>
              <h2 className="font-modern-20 text-2xl font-normal text-on-surface tracking-wide">
                {user.displayName}
              </h2>
              <div className="flex items-center gap-1.5 font-mono text-xs text-outline pt-0.5">
                <span>{user.email}</span>
                {user.emailVerified && (
                  <span className="text-primary text-[11px] font-bold">✓ Verified</span>
                )}
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/60 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-outline uppercase font-bold tracking-wider">
                  About Me / Bio
                </span>
                {!isEditingBio ? (
                  <button
                    onClick={() => { setIsEditingBio(true); setBioText(user.bio || ''); }}
                    className="flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                ) : (
                  <button
                    onClick={handleSaveBio}
                    className="flex items-center gap-1 font-mono text-[11px] text-primary font-bold hover:underline"
                  >
                    <Check className="w-3 h-3" /> Save
                  </button>
                )}
              </div>

              {isEditingBio ? (
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg p-2 text-xs text-on-surface font-body focus:outline-none focus:border-primary resize-none"
                  rows={3}
                  maxLength={160}
                />
              ) : (
                <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                  {user.bio || 'No bio yet. Click edit to add your comedic motto.'}
                </p>
              )}
            </div>

            {/* Stats Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/50">
                <span className="block font-headline text-lg font-bold text-on-surface">{user.postsCount || 0}</span>
                <span className="font-mono text-[10px] text-outline uppercase">Memes</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/50">
                <span className="block font-headline text-lg font-bold text-primary">{user.likesReceived || 0}</span>
                <span className="font-mono text-[10px] text-outline uppercase">Karma</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/50">
                <span className="block font-headline text-lg font-bold text-secondary">
                  {user.avgAiRating != null ? user.avgAiRating : '—'}
                </span>
                <span className="font-mono text-[10px] text-outline uppercase">
                  {user.avgAiRating != null ? 'AI Rating' : 'AI Score'}
                </span>
              </div>
            </div>

            {/* Member Since Metadata */}
            <div className="flex items-center gap-2 font-mono text-xs text-outline px-1">
              <Calendar className="w-4 h-4 text-outline" />
              <span>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'October 2026'}</span>
            </div>

            {/* My Uploads Stream (Dynamic Real Memes or Clean Empty State) */}
            <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/60">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-primary" /> My Posts ({myMemes.length || user.postsCount || 0})
                </span>
              </div>

              {myMemes.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
                  {myMemes.map((m) => (
                    <div key={m.id} className="relative rounded-xl overflow-hidden border border-outline-variant bg-surface-container-low group aspect-square">
                      <img src={m.mediaUrl} alt={m.caption} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 opacity-90 group-hover:opacity-100 transition-opacity">
                        <span className="font-body text-[10px] text-white truncate font-semibold">
                          {m.caption}
                        </span>
                        <div className="flex items-center justify-between gap-1 mt-0.5">
                          <span className="font-mono text-[9px] text-primary font-bold">
                            ❤️ {m.likeCount || 0}
                          </span>
                          {m.aiRating && (
                            <span className="font-mono text-[9px] text-secondary font-bold">
                              ✨ {m.aiRating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty state for fresh user */
                <div className="p-6 rounded-xl bg-surface-container-low border border-dashed border-outline-variant text-center flex flex-col items-center gap-2 my-1">
                  <span className="material-symbols-outlined text-outline text-3xl">image_not_supported</span>
                  <p className="font-body text-xs text-on-surface-variant">
                    You haven't posted any memes yet.
                  </p>
                  <span className="font-mono text-[10px] text-primary">
                    Upload an image or GIF to see it here!
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] text-outline">
              Session active
            </span>
            <button
              onClick={() => { onSignOut(); onClose(); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error/15 hover:bg-error/25 border border-error/40 text-error font-mono text-xs font-bold transition-colors btn-neo"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
