import React from 'react';
import { Shield, AtSign, Key, ChevronRight, Verified, ShieldAlert, History } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  return (
    <div className="min-h-screen bg-background font-sans text-on-surface flex flex-col overflow-hidden relative">
      {/* Ambient Background Texture */}
      <div className="fixed inset-0 z-0 bg-mesh pointer-events-none"></div>
      
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary-container/20">
            <Shield className="text-on-primary-container w-5 h-5 fill-on-primary-container/20" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
            AI Risk Intelligence
          </span>
        </div>
        <div className="hidden md:flex gap-6">
          <a className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Documentation</a>
          <a className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Status</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-panel rounded-xl border border-outline-variant/15 p-10 shadow-2xl shadow-surface-lowest/50 relative overflow-hidden group"
        >
          {/* Subtle internal glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
          
          <div className="relative z-10">
            <div className="mb-8 text-center md:text-left">
              <h1 className="font-headline font-bold text-3xl text-on-surface tracking-tight mb-2">
                System Access
              </h1>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Identify your analyst credentials to enter the observational lens.
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-primary-container uppercase tracking-widest" htmlFor="email">
                  Analyst Identity
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <AtSign className="text-on-surface-variant w-4 h-4" />
                  </div>
                  <input 
                    className="block w-full pl-11 pr-4 py-3 bg-surface-lowest border border-outline-variant/15 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary/50 text-on-surface text-sm transition-all duration-300 placeholder:text-outline/40" 
                    id="email" 
                    placeholder="name@organization.ai" 
                    required 
                    type="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-primary-container uppercase tracking-widest" htmlFor="key">
                    Security Protocol
                  </label>
                  <a className="text-[10px] font-bold text-outline hover:text-primary uppercase tracking-tighter" href="#">Lost Access?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="text-on-surface-variant w-4 h-4" />
                  </div>
                  <input 
                    className="block w-full pl-11 pr-4 py-3 bg-surface-lowest border border-outline-variant/15 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary/50 text-on-surface text-sm transition-all duration-300 placeholder:text-outline/40" 
                    id="key" 
                    placeholder="••••••••••••••••" 
                    required 
                    type="password"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input className="w-4 h-4 rounded border-outline-variant/15 bg-surface-lowest text-primary focus:ring-primary/20" id="remember" type="checkbox" />
                <label className="text-xs text-on-surface-variant" htmlFor="remember">Persistent session for 24 hours</label>
              </div>

              <button 
                className="w-full group relative flex items-center justify-center py-3.5 px-4 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-sm shadow-lg shadow-primary-container/20 hover:shadow-primary-container/40 active:scale-[0.98] transition-all duration-200 overflow-hidden" 
                type="submit"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center gap-2">
                  Initialize Session
                  <ChevronRight className="w-4 h-4" />
                </span>
              </button>

              <div className="pt-4 text-center">
                <p className="text-xs text-on-surface-variant mb-3">Not part of the aperture yet?</p>
                <button className="text-xs font-bold text-secondary uppercase tracking-widest hover:text-secondary/80 transition-colors" type="button">
                  Request Access Protocol
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Decorative Floating Elements */}
        <div className="fixed bottom-20 left-20 hidden xl:block opacity-20 group">
          <div className="flex flex-col gap-1">
            <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent"></div>
            <div className="h-px w-16 bg-gradient-to-r from-primary to-transparent"></div>
            <div className="h-px w-32 bg-gradient-to-r from-primary to-transparent"></div>
          </div>
          <p className="mt-4 font-headline text-[10px] tracking-[0.3em] uppercase text-primary">Quantum-Safe Encryption Active</p>
        </div>
      </main>

      {/* Footer Security Badges */}
      <footer className="relative z-10 w-full px-8 h-16 flex items-center justify-center gap-8 border-t border-outline-variant/10">
        <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <Verified className="w-4 h-4" />
          <span className="text-[10px] uppercase font-bold tracking-[0.15em]">SOC2 Type II</span>
        </div>
        <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <ShieldAlert className="w-4 h-4" />
          <span className="text-[10px] uppercase font-bold tracking-[0.15em]">ISO 27001</span>
        </div>
        <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <History className="w-4 h-4" />
          <span className="text-[10px] uppercase font-bold tracking-[0.15em]">Audit Log Enabled</span>
        </div>
      </footer>

      {/* Background Graphics */}
      <div className="fixed -bottom-1/4 -left-1/4 w-[80vw] h-[80vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="fixed -top-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>
    </div>
  );
}
