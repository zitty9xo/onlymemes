import React from 'react';
import { Flame, Sparkles, Trophy, Shuffle, Hash, ShieldAlert, BookOpen, Compass } from 'lucide-react';

export default function LeftSidebar({ activeTab, onSelectTab, onOpenAdmin, isAdmin, posts = [] }) {
  const feeds = [
    { id: 'hot', label: 'Trending Hot', icon: Flame, color: 'text-tertiary' },
    { id: 'new', label: 'Fresh Drops', icon: Sparkles, color: 'text-primary' },
    { id: 'top', label: 'Hall of Fame', icon: Trophy, color: 'text-secondary' },
    { id: 'random', label: 'Chaos Shuffle', icon: Shuffle, color: 'text-outline' },
  ];

  const memeHubs = [
    { name: 'r/DankMemes', id: 'dank' },
    { name: 'r/ProgrammerHumor', id: 'dev' },
    { name: 'r/WholesomeMemes', id: 'wholesome' },
    { name: 'r/AnimeMemes', id: 'anime' },
    { name: 'r/CryptoLosses', id: 'crypto' },
  ];

  const tags = ['#coding', '#bugs', '#friday', '#relatable', '#coffee', '#ai', '#cats'];

  return (
    <aside className="hidden lg:flex lg:col-span-2 flex-col gap-5 sticky top-20 select-none">
      
      {/* Feeds Navigation */}
      <div className="bg-surface-container rounded-xl p-3 border border-outline-variant shadow-hard">
        <span className="font-mono text-[10px] uppercase tracking-widest text-outline block mb-2 px-1">
          Feeds & Streams
        </span>
        <div className="flex flex-col gap-1">
          {feeds.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-mono text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-surface-container-high text-primary border-l-2 border-primary shadow-inner'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Community Meme Hubs with Real Counts */}
      <div className="bg-surface-container rounded-xl p-3 border border-outline-variant shadow-hard">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-outline">
            Meme Hubs
          </span>
          <Compass className="w-3.5 h-3.5 text-outline" />
        </div>
        <div className="flex flex-col gap-1">
          {memeHubs.map((hub) => {
            const count = posts.filter(p => p.category === hub.id || p.hub === hub.name).length;
            return (
              <div
                key={hub.name}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer group"
              >
                <span className="font-body text-xs text-on-surface group-hover:text-primary transition-colors font-semibold truncate">
                  {hub.name}
                </span>
                <span className="font-mono text-[10px] text-outline px-1.5 py-0.5 rounded bg-surface-container-low border border-outline-variant/40">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tags Cloud */}
      <div className="bg-surface-container rounded-xl p-3 border border-outline-variant shadow-hard">
        <span className="font-mono text-[10px] uppercase tracking-widest text-outline block mb-2 px-1">
          Topic Tags
        </span>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-container-low hover:bg-secondary/15 hover:text-secondary border border-outline-variant text-on-surface-variant cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* OnlyAdmins Access Button */}
      <div className="p-1">
        <button
          onClick={onOpenAdmin}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface-container-low hover:bg-primary/15 border border-primary/40 hover:border-primary text-white transition-all shadow-hard active:translate-y-0.5 btn-neo group cursor-pointer"
          title="onlyadmins"
        >
          <ShieldAlert className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
          <span className="font-grotesk text-sm font-bold tracking-wider text-white select-none antialiased">
            only<span className="text-primary font-bold">admins</span>
          </span>
        </button>
      </div>

    </aside>
  );
}
