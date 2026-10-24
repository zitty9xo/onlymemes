import React from 'react';
import { TrendingUp, ShieldCheck, Award, Users, Activity, Sparkles, Hash, Upload } from 'lucide-react';

export default function RightSidebar({ user, posts = [], onOpenStudio, onOpenUpload }) {
  // Real dynamic flair determination
  const getRealFlair = () => {
    if (!user) {
      return { title: 'Guest Explorer', icon: '👀', color: 'text-outline' };
    }
    if (user.role === 'admin') {
      return { title: 'Super Admin', icon: '🛡️', color: 'text-error' };
    }
    const userPostsCount = posts.filter(p => p.authorId === user.uid).length || user.postsCount || 0;
    if (userPostsCount >= 10) {
      return { title: 'Top Creator', icon: '🔥', color: 'text-tertiary' };
    }
    if (userPostsCount > 0) {
      return { title: 'Meme Creator', icon: '⭐', color: 'text-primary' };
    }
    return { title: 'New Member', icon: '🌱', color: 'text-secondary' };
  };

  const flair = getRealFlair();

  // Real categories and actual count from live posts array
  const topicChannels = [
    { name: '#dank', label: 'Dank Memes' },
    { name: '#dev', label: 'Tech & Code' },
    { name: '#gaming', label: 'Gaming' },
    { name: '#crypto', label: 'Crypto & Markets' },
    { name: '#wholesome', label: 'Wholesome' },
  ].map(channel => ({
    ...channel,
    count: posts.filter(p => p.tag === channel.name || p.tags?.includes(channel.name)).length
  }));

  return (
    <aside className="hidden lg:flex lg:col-span-3 flex-col gap-4 sticky top-20 select-none">
      
      {/* Community Card: r/OnlyMemes Front Page */}
      <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant shadow-hard">
        
        {/* Banner with Gradient Accent */}
        <div className="h-20 bg-gradient-to-r from-secondary-container via-surface-container-highest to-primary-container p-3 flex items-end">
          <span className="px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur font-mono text-[10px] text-on-surface font-bold uppercase tracking-wider">
            About Community
          </span>
        </div>

        <div className="p-4 flex flex-col gap-3">
          
          {/* Avatar & Title */}
          <div className="flex items-start gap-3 -mt-8">
            <div className="w-12 h-12 rounded-xl bg-surface-container-lowest border-2 border-primary overflow-hidden flex items-center justify-center shadow-hard">
              <span className="material-symbols-outlined text-primary text-3xl font-bold pointer-events-none">sentiment_very_satisfied</span>
            </div>
            <div className="pt-4">
              <h3 className="font-modern-20 text-xl text-on-surface font-normal tracking-wide leading-tight">r/OnlyMemes</h3>
              <span className="font-mono text-[11px] text-outline">Community Hub • est. 2026</span>
            </div>
          </div>

          {/* Description */}
          <p className="font-body text-xs text-on-surface-variant leading-relaxed">
            The home of real-time meme culture, internet satire, and AI-audited proof-of-humor ratings. Zero default spam, 100% community-crafted.
          </p>

          {/* Real Live Stats Bar */}
          <div className="grid grid-cols-2 gap-2 py-2 bg-surface-container-low rounded-lg p-2 text-center border border-outline-variant/40">
            <div>
              <span className="block font-headline text-lg text-on-surface font-bold">
                {posts.length}
              </span>
              <span className="font-mono text-[10px] text-outline uppercase tracking-wider">
                Total Memes
              </span>
            </div>
            <div>
              <span className="block font-headline text-lg text-primary font-bold flex items-center justify-center gap-1.5">
                <span className={`w-2 h-2 rounded-full inline-block ${user ? 'bg-primary animate-pulse' : 'bg-outline'}`}></span>
                {user ? '1 Online' : '0 Active'}
              </span>
              <span className="font-mono text-[10px] text-outline uppercase tracking-wider">
                {user ? 'Session Active' : 'Guest Mode'}
              </span>
            </div>
          </div>

          {/* Real User Flair */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/50 text-xs">
            <div className="flex items-center gap-2">
              <span>{flair.icon}</span>
              <span className="font-mono text-[11px] text-outline">Your Flair:</span>
              <span className={`font-mono text-[11px] font-bold ${flair.color}`}>
                {flair.title}
              </span>
            </div>
            <Award className="w-3.5 h-3.5 text-outline" />
          </div>

          {/* Action Button: Upload Meme */}
          <div className="flex flex-col gap-2">
            <button
              onClick={onOpenUpload}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary font-headline text-xs font-bold shadow-hard btn-neo transition-all flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Upload Meme</span>
            </button>
          </div>

          {/* AI Guard & Roaster Telemetry */}
          <div className="p-2.5 rounded-lg bg-surface-container-low border border-secondary/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="p-1 rounded-md bg-secondary/15 text-secondary shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <div className="min-w-0">
                <span className="font-mono text-[10px] font-bold text-secondary block truncate">
                  AI Guard & Roaster
                </span>
                <span className="font-mono text-[9px] text-outline block">
                  Auditing NSFW & Vulgarity
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/30 font-bold uppercase shrink-0">
              Active
            </span>
          </div>

          {/* Community Rules */}
          <div className="pt-2 border-t border-outline-variant/60">
            <span className="font-mono text-[10px] uppercase tracking-widest text-outline block mb-2">
              Community Rules
            </span>
            <ul className="flex flex-col gap-1.5 font-body text-xs text-on-surface-variant">
              <li className="flex items-center gap-2">
                <span className="font-mono text-primary font-bold text-[11px]">1.</span>
                <span>No explicit sexuality or NSFW content (Auto-banned)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-primary font-bold text-[11px]">2.</span>
                <span>AI evaluates vulgarity & rates creativity (0-100)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-primary font-bold text-[11px]">3.</span>
                <span>No fake or disposable burner email accounts</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Community Channels & Real Topics */}
      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant shadow-hard">
        <div className="flex items-center justify-between mb-3">
          <span className="font-headline text-sm font-bold text-on-surface flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-primary" />
            Topic Channels
          </span>
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">Live Feed</span>
        </div>
        <div className="flex flex-col gap-2">
          {topicChannels.map((topic) => (
            <div
              key={topic.name}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-high transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-surface-container-low border border-outline-variant text-primary text-[11px] font-mono flex items-center justify-center font-bold">
                  #
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-xs text-on-surface truncate font-bold">{topic.label}</p>
                  <p className="font-mono text-[10px] text-outline truncate">{topic.name}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-low border border-outline-variant/60 font-mono text-[10px] text-outline">
                {topic.count} {topic.count === 1 ? 'meme' : 'memes'}
              </span>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}
