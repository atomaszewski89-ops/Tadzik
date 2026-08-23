import React, { useState } from 'react';
import { Language, UserAccount } from '../types';
import { TadzikHero } from './tadzik/TadzikHero';
import { TadzikChat } from './tadzik/TadzikChat';
import { TadzikTripPlanner } from './tadzik/TadzikTripPlanner';
import { TadzikBudget } from './tadzik/TadzikBudget';
import { TadzikSeniorChecklist } from './tadzik/TadzikSeniorChecklist';
import { TadzikCountryGuides } from './tadzik/TadzikCountryGuides';
import { 
  MessageSquare, 
  Navigation, 
  CreditCard, 
  Luggage, 
  Globe, 
  Sparkles,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface TadzikGuideProps {
  language: Language;
  account: UserAccount | null;
  onUpdateAccount?: (updated: UserAccount) => void;
}

export type TadzikTabId = 
  | 'chat' 
  | 'trip-planner' 
  | 'budget' 
  | 'checklist' 
  | 'nl' 
  | 'be' 
  | 'pl_guide' 
  | 'de_guide' 
  | 'fr_guide';

export const TadzikGuide: React.FC<TadzikGuideProps> = ({ 
  language, 
  account, 
  onUpdateAccount 
}) => {
  const [activeTab, setActiveTab] = useState<TadzikTabId>('chat');

  const pl = language === 'pl';
  const nl = language === 'nl';
  const de = language === 'de';

  const navTabs = [
    { 
      id: 'chat' as const, 
      label: pl ? 'Czat z Tadzikiem' : nl ? 'Chat met Tadzik' : 'Chat with Tadzik', 
      icon: MessageSquare,
      badge: 'AI'
    },
    { 
      id: 'trip-planner' as const, 
      label: pl ? 'Ustal Szybką Trasę' : nl ? 'Snelle Route Planner' : 'Fast Route Planner', 
      icon: Navigation,
      badge: '🧭'
    },
    { 
      id: 'budget' as const, 
      label: pl ? 'Budżet & Koszyk' : nl ? 'Budget & Kosten' : 'Budget & Expenses', 
      icon: CreditCard,
      badge: '€'
    },
    { 
      id: 'checklist' as const, 
      label: pl ? 'Niezbędnik Seniora' : nl ? 'Inpaklijst' : 'Senior Checklist', 
      icon: Luggage,
      badge: '🎒'
    },
    { 
      id: 'nl' as const, 
      label: pl ? 'Przewodniki Krajowe' : nl ? 'Landengidsen' : 'Country Guides', 
      icon: Globe,
      badge: '5'
    }
  ];

  // Helper to handle tab changes
  const handleSelectTab = (tabId: TadzikTabId) => {
    setActiveTab(tabId);
  };

  const isCountryTab = ['nl', 'be', 'pl_guide', 'de_guide', 'fr_guide'].includes(activeTab);

  return (
    <div className="w-full space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8 font-sans" id="tadzik-master-guide">
      
      {/* 1. Hero Banner with Quick Actions */}
      <TadzikHero 
        language={language} 
        onSelectTab={handleSelectTab} 
      />

      {/* 2. Modern Segmented Tab Navigation Bar */}
      <div className="sticky top-2 z-20 bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id || (tab.id === 'nl' && isCountryTab);

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id === 'nl' && isCountryTab) {
                    // Keep current country sub-tab
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`flex-1 min-w-[130px] sm:min-w-[160px] py-3 px-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black shadow-md shadow-emerald-500/20 scale-102'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Dynamic Content Switcher */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'chat' && (
            <TadzikChat language={language} />
          )}

          {activeTab === 'trip-planner' && (
            <TadzikTripPlanner 
              language={language} 
              account={account} 
            />
          )}

          {activeTab === 'budget' && (
            <TadzikBudget language={language} />
          )}

          {activeTab === 'checklist' && (
            <TadzikSeniorChecklist language={language} />
          )}

          {isCountryTab && (
            <TadzikCountryGuides 
              language={language}
              selectedCountry={activeTab as 'nl' | 'be' | 'pl_guide' | 'de_guide' | 'fr_guide'}
              onSelectCountry={(c) => setActiveTab(c)}
            />
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default TadzikGuide;

