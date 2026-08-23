/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../../types';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TadzikBudgetProps {
  language: Language;
}

interface CustomExpenseItem {
  id: string;
  name: string;
  cost: number;
  country: string;
  type: string;
}

export const TadzikBudget: React.FC<TadzikBudgetProps> = ({ language }) => {
  const pl = language === 'pl';
  const nl = language === 'nl';
  const de = language === 'de';

  const [budgetLimit, setBudgetLimit] = useState<number>(120);
  const [selectedExpenses, setSelectedExpenses] = useState<CustomExpenseItem[]>([
    { id: 'b1', name: pl ? 'Bilet dobowy tramwaj / autobus (Rotterdam RET)' : 'Day Pass Public Transit', cost: 9.50, country: 'NL', type: 'transport' },
    { id: 'b2', name: pl ? 'Kawa & tradycyjne ciastko Appeltaart' : 'Coffee & Traditional Apple Pie', cost: 6.00, country: 'NL', type: 'food' },
    { id: 'b3', name: pl ? 'Bilet do Muzeum ze zniżką seniora' : 'Museum Ticket (Senior Discount)', cost: 14.00, country: 'NL', type: 'attraction' }
  ]);
  const [selectedCountry, setSelectedCountry] = useState<'NL' | 'BE' | 'PL' | 'DE' | 'FR'>('NL');
  const [customExpenseName, setCustomExpenseName] = useState('');
  const [customExpenseCost, setCustomExpenseCost] = useState<string>('');

  // Remove item
  const handleRemoveExpense = (id: string) => {
    setSelectedExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Add custom item
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const costNum = parseFloat(customExpenseCost);
    if (!customExpenseName.trim() || isNaN(costNum) || costNum <= 0) return;

    const newItem: CustomExpenseItem = {
      id: `custom-exp-${Date.now()}`,
      name: customExpenseName.trim(),
      cost: costNum,
      country: selectedCountry,
      type: 'custom'
    };

    setSelectedExpenses(prev => [...prev, newItem]);
    setCustomExpenseName('');
    setCustomExpenseCost('');
  };

  // Clear all expenses
  const handleClearAll = () => {
    setSelectedExpenses([]);
  };

  const totalCost = selectedExpenses.reduce((sum, item) => sum + item.cost, 0);
  const remainingBudget = budgetLimit - totalCost;
  const percentageSpent = Math.min(100, Math.round((totalCost / (budgetLimit || 1)) * 100));

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="tadzik-budget-workspace">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1 rounded-full text-xs font-black uppercase text-indigo-300">
              <CreditCard className="w-3.5 h-3.5" />
              <span>{pl ? 'Kontrola Portfela & Koszyka Podróżnego' : 'Travel Wallet & Expense Planner'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {pl ? 'Kalkulator Wydatków i Budżetu 💰' : 'Expense & Budget Calculator 💰'}
            </h3>

            <p className="text-indigo-200 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
              {pl 
                ? 'Ustal bezpieczny limit dzienny, dodawaj planowane wydatki (bilety kolejowe, kawa, posiłki, noclegi) i kontroluj swój budżet w podróży.'
                : 'Set a safe daily limit, log your planned expenses (transit, coffee, meals, tickets), and keep full control over your travel budget.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-bold text-slate-400 hover:text-rose-400 bg-white/10 hover:bg-rose-500/20 border border-white/20 px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{pl ? 'Wyczyść listę' : 'Reset list'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Budget Limit Gauge */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              {pl ? 'Twój limit dzienny na wycieczkę:' : 'Your daily budget limit:'}
            </label>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
                €{budgetLimit}
              </span>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(parseInt(e.target.value, 10))}
                className="w-48 sm:w-64 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Metric Pill */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{pl ? 'Suma wydatków' : 'Total spent'}</span>
              <strong className="text-base font-black text-slate-900 font-mono">€{totalCost.toFixed(2)}</strong>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{pl ? 'Pozostało' : 'Remaining'}</span>
              <strong className={`text-base font-black font-mono ${remainingBudget < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                €{remainingBudget.toFixed(2)}
              </strong>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>{pl ? `Wykorzystano: ${percentageSpent}%` : `Used: ${percentageSpent}%`}</span>
            <span>
              {remainingBudget >= 0 ? (
                <span className="text-emerald-700 font-black">✓ {pl ? 'W granicach normy' : 'Within budget'}</span>
              ) : (
                <span className="text-rose-600 font-black">⚠️ {pl ? 'Przekroczono limit!' : 'Over budget!'}</span>
              )}
            </span>
          </div>

          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                percentageSpent > 100 
                  ? 'bg-rose-500' 
                  : percentageSpent > 80 
                  ? 'bg-amber-500' 
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${percentageSpent}%` }}
            />
          </div>
        </div>

      </div>

      {/* Expenses Management & Add Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <span>{pl ? 'Lista Zaplanowanych Wydatków' : 'Planned Expenses'} ({selectedExpenses.length})</span>
          </h4>
          <span className="font-mono font-black text-base text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
            €{totalCost.toFixed(2)}
          </span>
        </div>

        {/* Add Custom Expense Form */}
        <form onSubmit={handleAddCustom} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
            {pl ? 'Dodaj wydatek do listy:' : 'Add an expense to list:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-2">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value as any)}
                className="w-full text-xs font-bold p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="NL">🇳🇱 NL</option>
                <option value="BE">🇧🇪 BE</option>
                <option value="PL">🇵🇱 PL</option>
                <option value="DE">🇩🇪 DE</option>
                <option value="FR">🇫🇷 FR</option>
              </select>
            </div>
            <div className="sm:col-span-6">
              <input
                type="text"
                value={customExpenseName}
                onChange={(e) => setCustomExpenseName(e.target.value)}
                placeholder={pl ? 'Nazwa wydatku (np. Bilet tramwajowy, Obiad, Kawiarnia, Muzeum)...' : 'Expense name (e.g. Train ticket, Lunch, Coffee)...'}
                className="w-full text-xs font-semibold p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={customExpenseCost}
                onChange={(e) => setCustomExpenseCost(e.target.value)}
                placeholder="€ Kwota"
                className="w-full text-xs font-bold p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-3 rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{pl ? 'Dodaj' : 'Add'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Expenses List */}
        {selectedExpenses.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="text-4xl">🛒</div>
            <p className="text-xs font-bold text-slate-600">
              {pl ? 'Twoja lista wydatków jest pusta.' : 'Your expense list is empty.'}
            </p>
            <p className="text-[11px] text-slate-400">
              {pl ? 'Wpisz powyżej nazwę oraz kwotę, aby dodać pozycję do kalkulatora.' : 'Enter a name and amount above to log an expense.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence>
              {selectedExpenses.map((exp) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                      {exp.country || 'EUR'}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      {exp.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-xs sm:text-sm text-slate-900">
                      €{exp.cost.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExpense(exp.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title={pl ? 'Usuń wydatek' : 'Remove item'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>

    </div>
  );
};
