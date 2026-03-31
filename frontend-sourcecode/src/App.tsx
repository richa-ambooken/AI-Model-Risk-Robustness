import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { Simulation } from './views/Simulation';
import { Metrics } from './views/Metrics';
import { View } from './types';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <Login onLogin={() => setCurrentView('dashboard')} />;
      case 'dashboard':
        return <Dashboard />;
      case 'simulation':
        return <Simulation />;
      case 'metrics':
        return <Metrics />;
      default:
        return <Dashboard />;
    }
  };

  if (currentView === 'login') {
    return <Login onLogin={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex flex-col flex-1 min-w-0">
        <TopNav currentView={currentView} />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
