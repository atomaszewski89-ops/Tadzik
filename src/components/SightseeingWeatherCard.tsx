/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DayForecast, Language, SightseeingWeather } from '../types';
import { getSightseeingWeather, getWeatherLabels } from '../data/weatherData';
import { 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Compass, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  Layers,
  Thermometer,
  Eye,
  Info
} from 'lucide-react';

interface SightseeingWeatherCardProps {
  city: string;
  country?: string;
  language: Language;
  attractionName?: string;
  className?: string;
  compact?: boolean;
}

interface WeatherCardStrings {
  loading: string;
  tag: string;
  night: string;
  rain: string;
  noRain: string;
  wind: string;
  dir: string;
  uvIndex: string;
  useSunscreen: string;
  moderateUv: string;
  sunset: string;
  returnBeforeDark: string;
  optimalHours: string;
  tipsFor: (place: string) => string;
  packInBackpack: string;
}

const WEATHER_CARD_I18N: Record<Language, WeatherCardStrings> = {
  pl: {
    loading: 'Tadzik sprawdza prognozę pogody dla wycieczki...',
    tag: 'POGODA DO ZWIEDZANIA',
    night: 'noc',
    rain: 'Deszcz',
    noRain: 'brak opadów',
    wind: 'Wiatr',
    dir: 'kierunek:',
    uvIndex: 'Indeks UV',
    useSunscreen: 'stosuj krem UV',
    moderateUv: 'umiarkowany',
    sunset: 'Zmierzch',
    returnBeforeDark: 'powrót przed zmrokiem',
    optimalHours: 'Optymalne godziny: 10:00 - 17:30',
    tipsFor: (place) => `Rekomendacja Tadzika na wycieczkę do ${place}:`,
    packInBackpack: 'Zabierz do plecaka:'
  },
  en: {
    loading: 'Tadzik is checking the sightseeing weather forecast...',
    tag: 'SIGHTSEEING WEATHER',
    night: 'night',
    rain: 'Rain',
    noRain: 'no rain',
    wind: 'Wind',
    dir: 'dir:',
    uvIndex: 'UV Index',
    useSunscreen: 'use sunscreen',
    moderateUv: 'moderate',
    sunset: 'Sunset',
    returnBeforeDark: 'return before dark',
    optimalHours: 'Optimal hours: 10:00 - 17:30',
    tipsFor: (place) => `Tadzik's sightseeing tips for ${place}:`,
    packInBackpack: 'Pack in backpack:'
  },
  nl: {
    loading: 'Tadzik controleert het weerbericht voor je uitstapje...',
    tag: 'WEER VOOR BEZIENSWAARDIGHEDEN',
    night: 'nacht',
    rain: 'Regen',
    noRain: 'geen regen',
    wind: 'Wind',
    dir: 'richting:',
    uvIndex: 'UV-index',
    useSunscreen: 'gebruik zonnebrandcrème',
    moderateUv: 'matig',
    sunset: 'Zonsondergang',
    returnBeforeDark: 'terug voor het donker',
    optimalHours: 'Optimale uren: 10:00 - 17:30',
    tipsFor: (place) => `Tadziks tips voor een bezoek aan ${place}:`,
    packInBackpack: 'Neem mee in je rugzak:'
  },
  de: {
    loading: 'Tadzik prüft die Wettervorhersage für deinen Ausflug...',
    tag: 'BESICHTIGUNGSWETTER',
    night: 'Nacht',
    rain: 'Regen',
    noRain: 'kein Regen',
    wind: 'Wind',
    dir: 'Richtung:',
    uvIndex: 'UV-Index',
    useSunscreen: 'Sonnenschutz verwenden',
    moderateUv: 'moderat',
    sunset: 'Sonnenuntergang',
    returnBeforeDark: 'Rückkehr vor Einbruch der Dunkelheit',
    optimalHours: 'Optimale Zeiten: 10:00 - 17:30',
    tipsFor: (place) => `Tadziks Ausflugstipps für ${place}:`,
    packInBackpack: 'In den Rucksack packen:'
  },
  es: {
    loading: 'Tadzik está consultando el pronóstico para tu visita...',
    tag: 'CLIMA PARA VISITAS',
    night: 'noche',
    rain: 'Lluvia',
    noRain: 'sin lluvia',
    wind: 'Viento',
    dir: 'dirección:',
    uvIndex: 'Índice UV',
    useSunscreen: 'usar protector solar',
    moderateUv: 'moderado',
    sunset: 'Puesta de sol',
    returnBeforeDark: 'regreso antes de anochecer',
    optimalHours: 'Horas óptimas: 10:00 - 17:30',
    tipsFor: (place) => `Consejos de Tadzik para visitar ${place}:`,
    packInBackpack: 'Lleva en tu mochila:'
  },
  fr: {
    loading: 'Tadzik consulte les prévisions météo pour votre visite...',
    tag: 'MÉTÉO TOURISME',
    night: 'nuit',
    rain: 'Pluie',
    noRain: 'pas de pluie',
    wind: 'Vent',
    dir: 'direction :',
    uvIndex: 'Indice UV',
    useSunscreen: 'crème solaire conseillée',
    moderateUv: 'modéré',
    sunset: 'Coucher du soleil',
    returnBeforeDark: 'retour avant la tombée de la nuit',
    optimalHours: 'Heures optimales : 10:00 - 17:30',
    tipsFor: (place) => `Conseils de Tadzik pour visiter ${place} :`,
    packInBackpack: 'À mettre dans votre sac :'
  },
  ro: {
    loading: 'Tadzik verifică prognoza meteo pentru vizită...',
    tag: 'VREMEA PENTRU VIZITARE',
    night: 'noapte',
    rain: 'Ploaie',
    noRain: 'fără precipitații',
    wind: 'Vânt',
    dir: 'direcție:',
    uvIndex: 'Index UV',
    useSunscreen: 'folosiți protecție solară',
    moderateUv: 'moderat',
    sunset: 'Apus',
    returnBeforeDark: 'întoarcere înainte de întuneric',
    optimalHours: 'Ore optime: 10:00 - 17:30',
    tipsFor: (place) => `Recomandările lui Tadzik pentru vizitarea ${place}:`,
    packInBackpack: 'De pus în rucsac:'
  },
  zh: {
    loading: '塔齐克正在查看观光天气预报...',
    tag: '观光天气',
    night: '夜间',
    rain: '降雨',
    noRain: '无降雨',
    wind: '风速',
    dir: '风向：',
    uvIndex: '紫外线指数',
    useSunscreen: '请涂抹防晒霜',
    moderateUv: '中等',
    sunset: '日落',
    returnBeforeDark: '天黑前返回',
    optimalHours: '最佳游览时间：10:00 - 17:30',
    tipsFor: (place) => `塔齐克对 ${place} 的游览建议：`,
    packInBackpack: '背包建议携带：'
  }
};

export default function SightseeingWeatherCard({
  city,
  country = 'Netherlands',
  language,
  attractionName,
  className = '',
  compact = false
}: SightseeingWeatherCardProps) {
  const [weatherData, setWeatherData] = useState<SightseeingWeather | null>(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const t = getWeatherLabels(language);
  const cardT = WEATHER_CARD_I18N[language] || WEATHER_CARD_I18N.en;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getSightseeingWeather(city, country, language).then((data) => {
      if (isMounted) {
        setWeatherData(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [city, country, language]);

  if (loading || !weatherData) {
    return (
      <div className={`bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 border border-indigo-700/50 animate-pulse flex items-center justify-center gap-3 ${className}`}>
        <span className="text-2xl animate-spin">🌤️</span>
        <span className="text-sm font-bold text-indigo-200">
          {cardT.loading}
        </span>
      </div>
    );
  }

  const currentDay: DayForecast = weatherData.availableDays[selectedDayIdx] || weatherData.selectedDay;

  // Determine badge styling based on sightseeing rating
  const ratingBadge = {
    ideal: {
      bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      label: t.idealWeather,
      icon: '🌟'
    },
    good: {
      bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      label: t.moderateWeather,
      icon: '⛅'
    },
    moderate: {
      bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      label: t.moderateWeather,
      icon: '🌤️'
    },
    rain_warning: {
      bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      label: t.rainWarning,
      icon: '🌧️'
    }
  }[currentDay.sightseeingRating || 'ideal'];

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border-2 border-indigo-500/30 p-4 sm:p-5 md:p-6 shadow-xl overflow-hidden relative ${className}`}>
      
      {/* Subtle atmospheric light effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with Location & Day picker */}
      <div className="relative z-10 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-indigo-800/40 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wider">
                {cardT.tag}
              </span>
              <span className="text-xs text-indigo-300 font-semibold">
                📍 {city}, {weatherData.country}
              </span>
            </div>
            <h4 className="text-lg md:text-xl font-black text-white mt-1 flex items-center gap-2">
              <span>{currentDay.dayName}</span>
              <span className="text-xs font-semibold text-slate-400">({currentDay.date})</span>
            </h4>
          </div>

          {/* Rating indicator */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${ratingBadge.bg}`}>
            <span>{ratingBadge.icon}</span>
            <span>{ratingBadge.label}</span>
          </div>
        </div>

        {/* Multi-day selector buttons */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none" id="weather-day-selector">
          {weatherData.availableDays.map((day, idx) => {
            const isSelected = selectedDayIdx === idx;
            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDayIdx(idx)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-md scale-105'
                    : 'bg-indigo-900/40 hover:bg-indigo-900/80 text-indigo-200 border-indigo-800/50 hover:border-indigo-600'
                }`}
              >
                <span>{day.icon}</span>
                <span>{day.dayShort}</span>
                <span className={`font-mono text-[10px] ${isSelected ? 'text-slate-950 font-bold' : 'text-indigo-300'}`}>
                  {day.tempMax}°C
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Weather Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Main Temperature & Aura Display */}
          <div className="bg-indigo-900/40 border border-indigo-700/40 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-4xl select-none">{currentDay.icon}</span>
              <div className="text-right">
                <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                  {currentDay.tempMax}°C
                </div>
                <div className="text-[11px] text-indigo-300 font-semibold">
                  {t.feelsLike} <strong className="text-white font-bold">{currentDay.feelsLike}°C</strong> ({cardT.night}: {currentDay.tempMin}°C)
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-indigo-800/40 text-xs font-bold text-amber-300">
              {currentDay.condition}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
            
            {/* Rain Chance */}
            <div className="bg-slate-900/60 border border-indigo-800/30 rounded-xl p-2.5 flex flex-col justify-between">
              <span className="text-indigo-400 text-xs font-bold flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                {cardT.rain}
              </span>
              <div className="mt-1">
                <div className="text-base sm:text-lg font-black font-mono text-white">
                  {currentDay.rainChance}%
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">
                  {currentDay.rainMm > 0 ? `${currentDay.rainMm} mm` : cardT.noRain}
                </div>
              </div>
            </div>

            {/* Wind */}
            <div className="bg-slate-900/60 border border-indigo-800/30 rounded-xl p-2.5 flex flex-col justify-between">
              <span className="text-indigo-400 text-xs font-bold flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                {cardT.wind}
              </span>
              <div className="mt-1">
                <div className="text-base sm:text-lg font-black font-mono text-white">
                  {currentDay.windSpeed} <span className="text-[10px] font-normal text-slate-300">km/h</span>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">
                  {cardT.dir} {currentDay.windDirection}
                </div>
              </div>
            </div>

            {/* UV Index */}
            <div className="bg-slate-900/60 border border-indigo-800/30 rounded-xl p-2.5 flex flex-col justify-between">
              <span className="text-indigo-400 text-xs font-bold flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                {cardT.uvIndex}
              </span>
              <div className="mt-1">
                <div className="text-base sm:text-lg font-black font-mono text-amber-300">
                  {currentDay.uvIndex} / 11
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">
                  {currentDay.uvIndex > 5 ? cardT.useSunscreen : cardT.moderateUv}
                </div>
              </div>
            </div>

            {/* Sunset / Safe Return */}
            <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-2.5 flex flex-col justify-between">
              <span className="text-amber-300 text-xs font-bold flex items-center gap-1">
                <span>🌅</span>
                {cardT.sunset}
              </span>
              <div className="mt-1">
                <div className="text-base sm:text-lg font-black font-mono text-amber-400">
                  {currentDay.sunset}
                </div>
                <div className="text-[10px] text-amber-200/80 font-bold leading-tight">
                  {cardT.returnBeforeDark}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Hourly Timeline for the visit */}
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-bold text-indigo-200 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {t.hourlyForecast}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {cardT.optimalHours}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-0.5">
            {currentDay.hourly.map((h, hIdx) => (
              <div 
                key={hIdx} 
                className="bg-indigo-900/30 border border-indigo-800/40 rounded-xl p-2 text-center flex flex-col items-center justify-between gap-1 shadow-inner"
              >
                <span className="font-mono font-bold text-[11px] text-slate-300">{h.time}</span>
                <span className="text-xl my-0.5 select-none">{h.icon}</span>
                <span className="font-mono font-black text-xs text-white">{h.temp}°C</span>
                <span className="text-[9px] font-bold text-blue-300 flex items-center gap-0.5">
                  💧 {h.rainChance}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tadzik's Smart Packing & Sightseeing Recommendations */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/30 rounded-xl p-3.5 sm:p-4 space-y-2 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧭</span>
            <h5 className="font-extrabold text-xs sm:text-sm text-amber-300">
              {cardT.tipsFor(attractionName || city)}
            </h5>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {currentDay.tadzikTips.advice}
          </p>

          {/* Packing checklist chips */}
          <div className="pt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-amber-300 font-bold mr-1">
              🎒 {cardT.packInBackpack}
            </span>
            {currentDay.tadzikTips.packing.map((item, pIdx) => (
              <span 
                key={pIdx}
                className="inline-flex items-center gap-1 bg-amber-400/15 border border-amber-400/30 text-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-lg"
              >
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
