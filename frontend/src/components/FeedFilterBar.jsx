import React from 'react';
import { Flame, Sparkles, Trophy, AlertTriangle, LayoutGrid, Rows } from 'lucide-react';

export default function FeedFilterBar({ currentFilter, onFilterChange }) {
  const filters = [
    { id: 'hot', label: 'Hot', icon: Flame, color: 'text-tertiary' },
    { id: 'new', label: 'New', icon: Sparkles, color: 'text-primary' },
    { id: 'top', label: 'Top Dank (90+)', icon: Trophy, color: 'text-secondary' },
    { id: 'edgy', label: 'Spicy / Edgy', icon: AlertTriangle, color: 'text-amber-400' },
  ];

  return (
    <div className="bg-surface-container rounded-xl p-2 border border-outline-variant shadow-hard flex items-center justify-between gap-2 flex-wrap">
      
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {filters.map((f) => {
          const Icon = f.icon;
          const isActive = currentFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                isActive
                  ? 'bg-surface-container-high text-primary border border-primary/50 shadow-inner'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${f.color}`} />
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
