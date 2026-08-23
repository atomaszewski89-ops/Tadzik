import React from 'react';
import { Language } from '../../types';
import { Compass, Sparkles, ShieldCheck, Heart, Clock, Sun, CheckCircle, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

interface TadzikHeroProps {
  language: Language;
  onSelectTab: (tab: 'chat' | 'trip-planner' | 'budget' | 'checklist' | 'nl' | 'be' | 'pl_guide' | 'de_guide' | 'fr_guide') => void;
}

export const TadzikHero: React.FC<TadzikHeroProps> = ({ language, onSelectTab }) => {
  const pl = language === 'pl';
  const nl = language === 'nl';
  const de = language === 'de';

  return (
    <div 
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-teal-950 to-indigo-950 text-white p-6 sm:p-8 md:p-10 border border-teal-800/40 shadow-2xl space-y-6"
      id="tadzik-hero-banner"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-gradient-to-b from-amber-400/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative subtle background stamp */}
      <div className="absolute right-4 bottom-2 text-emerald-500/5 select-none pointer-events-none hidden lg:block">
        <span className="text-[14rem] font-black leading-none">🧭</span>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        
        {/* Left Column: Vision, Avatar & Badges */}
        <div className="space-y-4 max-w-2xl">
          
          {/* Status badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-3.5 py-1 rounded-full backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                {pl ? 'Tadzik • Twój Osobisty Przewodnik' : nl ? 'Tadzik • Jouw Persoonlijke Gids' : de ? 'Tadzik • Ihr Reisebegleiter' : 'Tadzik • Your Personal Travel Guide'}
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5 bg-amber-400/15 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              {pl ? '100% Bezpieczeństwo i Dostępność ♿' : '100% Safety & Accessibility ♿'}
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight flex items-center gap-3">
              <span>{pl ? 'Tadzik Pomoże w Podróży 🧭' : nl ? 'Tadzik Helpt Je Onderweg 🧭' : de ? 'Tadzik Hilft Ihnen Auf Reisen 🧭' : 'Tadzik Travel Assistant 🧭'}</span>
            </h2>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed font-medium">
              {pl ? (
                <>
                  Z nami nie zginiesz w podróży! 🌲 Pilnuję Twojego portfela, wskazuję czyste toalety, windy, najwygodniejsze przesiadki i dbam o to, byś <span className="text-amber-300 font-bold">przed zmrokiem</span> bezpiecznie dotarł do celu i wrócił do ciepłego domu.
                </>
              ) : nl ? (
                <>
                  Met Tadzik raak je nooit de weg kwijt! 🌲 Ik let op je budget, wijs schone toiletten en liften aan, en zorg dat je <span className="text-amber-300 font-bold">voor het donker</span> veilig en ontspannen thuis bent.
                </>
              ) : (
                <>
                  Never get lost on your journey! 🌲 Tadzik watches your wallet, spots clean restrooms & elevators, plans gentle low-floor transit, and ensures you arrive <span className="text-amber-300 font-bold">safely before dark</span>.
                </>
              )}
            </p>
          </div>

          {/* Key Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-xl text-xs font-bold text-slate-200">
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              {pl ? 'Zawsze przed zmrokiem' : 'Safe return before dusk'}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-xl text-xs font-bold text-slate-200">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              {pl ? 'Udogodnienia dla seniorów' : 'Senior-tailored comfort'}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-xl text-xs font-bold text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {pl ? 'AI Asystent 24/7' : '24/7 AI Assistant'}
            </span>
          </div>
        </div>

        {/* Right Column: Quick Action Cards */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          
          {/* Action 1: Safe Route Planner */}
          <button
            type="button"
            onClick={() => onSelectTab('trip-planner')}
            className="flex-1 sm:w-80 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black p-4 rounded-2xl shadow-xl shadow-amber-500/20 transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer hover:scale-102 active:scale-98 group border border-amber-300"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="bg-slate-950 text-amber-400 p-2.5 rounded-xl">
                <Navigation className="w-5 h-5 stroke-[2.5] group-hover:rotate-45 transition-transform" />
              </div>
              <div>
                <span className="text-xs uppercase font-black tracking-wider text-slate-900 block">
                  {pl ? 'Szybki Start' : 'Quick Start'}
                </span>
                <span className="text-sm font-black text-slate-950">
                  {pl ? 'Ustal Szybką i Bezpieczną Trasę 🧭' : 'Plan Fast & Safe Route 🧭'}
                </span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-slate-950 shrink-0 animate-pulse" />
          </button>

          {/* Action 2: Chat with Tadzik */}
          <button
            type="button"
            onClick={() => onSelectTab('chat')}
            className="flex-1 sm:w-80 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold p-4 rounded-2xl border border-white/20 transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer hover:scale-102 active:scale-98 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 text-emerald-300 p-2.5 rounded-xl border border-emerald-400/30">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-emerald-300 font-black uppercase tracking-wider block">
                  {pl ? 'Porozmawiaj' : 'Talk with AI'}
                </span>
                <span className="text-sm font-black text-white">
                  {pl ? 'Zadaj Pytanie Tadzikowi 💬' : 'Ask Tadzik Anything 💬'}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-black text-amber-300 bg-amber-400/15 px-2 py-1 rounded-lg">AI</span>
          </button>

        </div>

      </div>
    </div>
  );
};
