import React from 'react';
import { Search, Bell } from 'lucide-react';
import { View } from '../types';
import { cn } from '../lib/utils';

interface TopNavProps {
  currentView: View;
}

export function TopNav({ currentView }: TopNavProps) {
  const viewLabels: Record<View, string> = {
    login: 'Login',
    dashboard: 'AI Risk Dashboard',
    simulation: 'Simulation Workspace',
    metrics: 'Metrics & Performance'
  };

  return (
    <header className="bg-background/60 backdrop-blur-md border-b border-outline-variant/15 shadow-2xl shadow-cyan-900/10 sticky top-0 z-50 flex justify-between items-center px-8 h-16 w-full">
      <div className="flex items-center gap-6">
        <span className="text-xl font-headline font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
          {viewLabels[currentView]}
        </span>
        <nav className="hidden md:flex gap-8">
          {['Dashboard', 'Simulation', 'Metrics', 'Settings'].map((item) => {
            const isActive = viewLabels[currentView].includes(item);
            return (
              <button
                key={item}
                className={cn(
                  "font-headline font-bold tracking-tight text-sm transition-all duration-300 pb-1",
                  isActive 
                    ? "text-primary-container border-b-2 border-primary-container" 
                    : "text-on-surface opacity-70 hover:text-primary-container hover:opacity-100"
                )}
              >
                {item}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-4 h-4" />
          <input 
            className="bg-surface-lowest border-none rounded-full pl-10 pr-4 py-1.5 text-xs w-48 focus:ring-1 focus:ring-primary-container/50 text-on-surface transition-all" 
            placeholder="Search parameters..." 
            type="text"
          />
        </div>
        <button className="text-on-surface hover:text-primary-container transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-background"></span>
        </button>
        <div className="flex items-center gap-3 pl-2 border-l border-outline-variant/30">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
            <img 
              alt="Analyst Profile" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfG_wiHSv7XneiwdxD5fIDyntZPSDIX8kYuJy98RcYJWYAhcP2qyWDcYAM8yiuKfP21HGzYB0k2aqpPbhzkTAezuqr6PDWo4mJWpcY7qqnYhQFui5VZhBdawZ8WN61K_15U048-hEsMu0oC-JPbEJ3SeC6Pwq543fUB48dSqHfNisjecYkfPlRzfazIXbVwDNKXFBH9j6n9LG4Qfx-B2wI8w0a5wopEhpD9iUhsZcDWUz1xcAhE-buYjkBO4toKmyUHSbYNFnOzhOQ"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden xl:block">
            <p className="text-xs font-bold text-on-surface leading-none">Senior Analyst</p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Active Session</p>
          </div>
        </div>
      </div>
    </header>
  );
}
