import React from 'react';
import { Upload, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function EmptyFeedState({ onOpenUpload, onOpenStudio }) {
  return (
    <div className="bg-surface-container rounded-xl border border-outline-variant shadow-hard-lg p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-5 my-2">
      
      {/* Icon with glowing ring */}
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-surface-container-low border-2 border-primary flex items-center justify-center shadow-glow-primary">
          <span className="material-symbols-outlined text-primary text-4xl">smart_toy</span>
        </div>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
        </span>
      </div>

      {/* Title & Copy */}
      <div className="max-w-md flex flex-col gap-2">
        <h3 className="font-modern-20 text-3xl sm:text-4xl font-normal text-on-surface tracking-wide">
          The Meme Vault is Empty
        </h3>
        <p className="font-body text-sm text-on-surface-variant leading-relaxed">
          Zero default memes, zero fake bots, 100% clean slate. Be the legendary creator who drops the very first meme on OnlyMemes!
        </p>
      </div>

      {/* AI Bot Evaluation Banner */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low border border-primary/40 font-mono text-xs text-primary">
        <Sparkles className="w-4 h-4 text-primary" />
        <span>AI Judge is waiting to rate your humor & check safety</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center w-full sm:w-auto pt-2">
        <button
          onClick={onOpenUpload}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary font-headline text-sm font-bold shadow-hard active:translate-y-0.5 transition-all"
        >
          <Upload className="w-4 h-4 stroke-[2.5]" />
          <span>Upload Image / GIF</span>
        </button>
      </div>

      {/* Features Pill */}
      <div className="pt-4 flex items-center justify-center gap-4 flex-wrap text-outline font-mono text-[11px]">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Sexuality & Vulgarity Filter
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-secondary" /> 0-100 Creativity Score
        </span>
        <span>•</span>
        <span>Max 10 MB Uploads</span>
      </div>

    </div>
  );
}
