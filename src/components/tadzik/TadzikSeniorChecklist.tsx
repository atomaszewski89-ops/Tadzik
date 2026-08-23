import React, { useState } from 'react';
import { Language } from '../../types';
import { 
  CheckCircle, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  PhoneCall, 
  Luggage, 
  Heart, 
  Info,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';

interface TadzikSeniorChecklistProps {
  language: Language;
}

export const TadzikSeniorChecklist: React.FC<TadzikSeniorChecklistProps> = ({ language }) => {
  const pl = language === 'pl';
  const nl = language === 'nl';
  const de = language === 'de';

  const [itemsState, setItemsState] = useState<Record<string, boolean>>({
    phone: true,
    water: true,
    meds: true,
    address: false,
    glasses: true,
    coins: false,
    umbrella: false,
    shoes: true
  });

  const checklistItems = [
    { id: 'phone', title: pl ? 'Telefon naładowany 100% (+ kabel / powerbank)' : 'Phone charged 100% (+ powerbank)', desc: pl ? 'Upewnij się, że masz zapisany numer do bliskich.' : 'Ensure emergency numbers are saved.' },
    { id: 'water', title: pl ? 'Butelka wody mineralnej w torbie' : 'Bottle of mineral water in bag', desc: pl ? 'Nawadnianie jest kluczowe w trakcie spacerów!' : 'Hydration is crucial during walking!' },
    { id: 'meds', title: pl ? 'Leki na cały dzień + dawka rezerwowa' : 'Daily medication + backup dose', desc: pl ? 'Spakuj leki w łatwo dostępne miejsce.' : 'Pack medications in an easily reachable pocket.' },
    { id: 'address', title: pl ? 'Kartka z adresem hotelu/domu w kieszeni' : 'Paper with destination address in pocket', desc: pl ? 'Na wypadek rozładowania baterii w telefonie.' : 'In case phone battery runs out.' },
    { id: 'glasses', title: pl ? 'Okulary korekcyjne / przeciwsłoneczne' : 'Reading / sunglasses', desc: pl ? 'Do czytania rozkładów jazdy i ochrony przed słońcem.' : 'For reading transit timetables comfortably.' },
    { id: 'coins', title: pl ? 'Drobne monety (€0.50 / €1.00) na toalety' : 'Small coins for public restrooms', desc: pl ? 'Wiele toalet na dworcach i w kawiarniach wymaga drobnych.' : 'Many European station toilets require coin entry.' },
    { id: 'umbrella', title: pl ? 'Lekki parasol lub płaszcz przeciwdeszczowy' : 'Compact umbrella / light raincoat', desc: pl ? 'Pogoda w Europie Zachodniej potrafi szybko się zmienić.' : 'Weather can change rapidly in Western Europe.' },
    { id: 'shoes', title: pl ? 'Wygodne, sprawdzone obuwie na płaskiej podeszwie' : 'Comfortable flat-soled walking shoes', desc: pl ? 'Unikaj śliskich butów na zabytkowym bruku.' : 'Avoid slippery soles on historic cobblestones.' }
  ];

  const handleToggle = (id: string) => {
    setItemsState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCheckAll = () => {
    const allChecked: Record<string, boolean> = {};
    checklistItems.forEach(item => {
      allChecked[item.id] = true;
    });
    setItemsState(allChecked);
  };

  const completedCount = Object.values(itemsState).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <div className="space-y-6" id="tadzik-checklist-workspace">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-black uppercase text-emerald-300">
              <Luggage className="w-3.5 h-3.5" />
              <span>{pl ? 'Niezbędnik Seniora Przed Wyjazdem' : 'Senior Departure Essentials'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {pl ? 'Apteczka & Lista Spakowania 🎒' : 'Packing & Safety Checklist 🎒'}
            </h3>

            <p className="text-emerald-100 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
              {pl 
                ? 'Przed wyjściem z domu lub hotelu odhacz poniższe punkty. Dzięki nim unikniesz stresu i będziesz gotowy na każdą niespodziankę!'
                : 'Before leaving home or hotel, check off these items. They guarantee peace of mind and effortless travel!'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCheckAll}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95 shrink-0"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{pl ? 'Odhacz wszystko' : 'Check all'}</span>
          </button>
        </div>
      </div>

      {/* Progress Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            {pl ? 'Stan przygotowania do drogi:' : 'Preparation status:'}
          </span>
          <span className="font-mono font-black text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
            {completedCount} / {checklistItems.length} {pl ? 'gotowe' : 'packed'} ({progressPercent}%)
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div 
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {progressPercent === 100 && (
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center gap-2.5 text-emerald-900 text-xs font-bold animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{pl ? 'Wspaniale! Jesteś w 100% przygotowany i bezpieczny. Życzymy udanej podróży!' : 'Splendid! You are 100% packed and ready. Have a wonderful journey!'}</span>
          </div>
        )}
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {checklistItems.map((item) => {
          const isChecked = itemsState[item.id];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleToggle(item.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-start gap-3.5 cursor-pointer hover:scale-101 active:scale-99 ${
                isChecked
                  ? 'bg-emerald-50/80 border-emerald-300 text-slate-900 shadow-2xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className={`mt-0.5 p-1 rounded-lg shrink-0 ${
                isChecked ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}>
                <CheckCircle className={`w-4 h-4 ${isChecked ? 'stroke-[2.5]' : ''}`} />
              </div>

              <div className="space-y-1">
                <h4 className={`text-xs sm:text-sm font-black ${isChecked ? 'text-emerald-950' : 'text-slate-900'}`}>
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Emergency Assistance Hotline 112 */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-900/40 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="bg-red-600 text-white p-3 rounded-2xl shadow-md animate-pulse">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-black text-sm text-white flex items-center gap-2">
              <span>{pl ? 'Europejski Numer Alarmowy: 112' : 'European Emergency Number: 112'}</span>
            </h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xl">
              {pl 
                ? 'Darmowe połączenie w całej Unii Europejskiej z każdego telefonu komórkowego (nawet bez karty SIM). W razie zagubienia lub problemów zdrowotnych od razu wybierz 112 lub poproś obsługę stacji.'
                : 'Free emergency call across all of Europe. Works on any mobile phone without a SIM card.'}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-black bg-red-600/20 text-red-300 border border-red-500/30 px-3 py-1.5 rounded-xl shrink-0">
          SOS 112
        </span>
      </div>

    </div>
  );
};
