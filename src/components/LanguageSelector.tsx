/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

const SELECTED_INFO: Record<Language, string> = {
  en: 'Selected: English 🇬🇧',
  nl: 'Geselecteerd: Nederlands 🇳🇱',
  pl: 'Wybrano: Polski 🇵🇱',
  zh: '已选择: 中文 🇨🇳',
  es: 'Seleccionado: Español 🇪🇸',
  de: 'Ausgewählt: Deutsch 🇩🇪',
  ro: 'Selectat: Română 🇷🇴',
  fr: 'Sélectionné: Français 🇫🇷',
};

const TITLE_INFO: Record<Language, string> = {
  en: 'Select Language:',
  nl: 'Selecteer Taal:',
  pl: 'Wybierz Język:',
  zh: '选择语言：',
  es: 'Seleccionar Idioma:',
  de: 'Sprache wählen:',
  ro: 'Selectează Limba:',
  fr: 'Choisir la langue :',
};

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-amber-50/50 rounded-xl border border-amber-200/60 shadow-sm w-full" id="lang-selector-container">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-stone-700 font-extrabold text-lg md:text-xl">
          <Globe className="w-6 h-6 text-amber-700" />
          <span>{TITLE_INFO[currentLanguage] || TITLE_INFO.en}</span>
        </div>
        
        {/* Only 2 small letters of the selected country next to it */}
        <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded border border-amber-300/60 lowercase select-none">
          {currentLanguage.toLowerCase()}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 w-full">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            id={`lang-btn-${lang.code}`}
            onClick={() => onLanguageChange(lang.code)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-base font-bold transition-all shadow-sm cursor-pointer ${
              currentLanguage === lang.code
                ? 'bg-amber-700 text-white ring-3 ring-amber-400'
                : 'bg-white text-stone-800 border-2 border-stone-300 hover:border-amber-700 hover:bg-amber-50/40'
            }`}
          >
            <span className="text-xl" role="img" aria-label={lang.label}>
              {lang.flag}
            </span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
