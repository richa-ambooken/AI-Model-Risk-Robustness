import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  BarChart3, 
  Settings, 
  Plus, 
  HelpCircle, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { View, NAV_ITEMS } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="h-screen w-64 hidden lg:flex flex-col border-r border-outline-variant/15 bg-surface-low shadow-[4px_0_24px_rgba(0,0,0,0.3)] sticky top-0 shrink-0">
      <div className="py-6 px-6 flex flex-col h-full">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <ShieldCheck className="text-on-primary-container w-6 h-6" />
            </div>
            <div>
              <h1 className="font-headline text-primary-container font-black text-lg leading-none tracking-tight">Risk Intelligence</h1>
              <p className="text-[10px] text-on-surface-variant/60 font-medium tracking-widest uppercase mt-1">v2.4.0</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col space-y-2 flex-grow">
          {NAV_ITEMS.map((item) => {
            const Icon = { LayoutDashboard, Activity, BarChart3 }[item.icon] || LayoutDashboard;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 group text-left",
                  isActive 
                    ? "bg-gradient-to-r from-primary-container/10 to-transparent text-primary-container border-l-4 border-primary-container translate-x-1" 
                    : "text-on-surface-variant/60 hover:bg-surface-high hover:text-primary"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "fill-primary-container/20")} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
          
          <button className="flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant/60 hover:bg-surface-high hover:text-primary transition-colors group text-left">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </nav>

        <div className="mt-auto space-y-4">
          <button className="w-full bg-primary-container text-on-primary-container py-2.5 px-4 rounded font-bold text-sm shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            New Simulation
          </button>
          
          <div className="pt-4 border-t border-outline-variant/15 space-y-1">
            <button className="flex items-center gap-3 px-4 py-2 text-on-surface-variant/60 hover:text-primary text-sm transition-colors w-full text-left">
              <HelpCircle className="w-4 h-4" />
              Support
            </button>
            <button 
              onClick={() => onViewChange('login')}
              className="flex items-center gap-3 px-4 py-2 text-on-surface-variant/60 hover:text-error text-sm transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
