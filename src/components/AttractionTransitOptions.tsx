/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Attraction, Language, TravelMode } from '../types';
import { 
  AttractionDistanceInfo, 
  GpsCoordinates, 
  getAttractionTransitInfo 
} from '../services/gpsTransitService';
import { 
  Car, 
  Bus, 
  Bike, 
  Footprints, 
  Compass, 
  Navigation, 
  ChevronRight,
  Clock,
  Sparkles,
  MapPin
} from 'lucide-react';

interface AttractionTransitOptionsProps {
  attraction: Attraction;
  userCoords: GpsCoordinates | null;
  userLocationName: string;
  language: Language;
  onNavigateWithMode: (attraction: Attraction, mode: TravelMode) => void;
}

export const AttractionTransitOptions: React.FC<AttractionTransitOptionsProps> = ({
  attraction,
  userCoords,
  userLocationName,
  language,
  onNavigateWithMode
}) => {
  const pl = language === 'pl';
  const nl = language === 'nl';

  const transitInfo: AttractionDistanceInfo = getAttractionTransitInfo(userCoords, attraction, language);

  const getModeIcon = (mode: TravelMode) => {
    switch (mode) {
      case 'car':
        return <Car className="w-4 h-4 text-amber-500" />;
      case 'transit':
        return <Bus className="w-4 h-4 text-indigo-500" />;
      case 'bike':
        return <Bike className="w-4 h-4 text-emerald-500" />;
      case 'walk':
        return <Footprints className="w-4 h-4 text-sky-500" />;
      default:
        return <Compass className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div 
      className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3.5"
      id={`transit-options-${attraction.id}`}
    >
      {/* Header with calculated distance and origin indicator */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200/70 pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-1.5 rounded-xl shadow-xs">
            <Compass className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
              <span>{pl ? 'Środki komunikacji i dojazd z Twojego GPS:' : nl ? 'Vervoersopties vanaf uw GPS:' : 'Transit Options & Travel Time:'}</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              {pl ? 'Dokładna odległość drogowa:' : 'Accurate route distance:'}{' '}
              <strong className="text-indigo-950 font-black font-mono">{transitInfo.distanceFormatted}</strong>
              {userLocationName ? ` (z: ${userLocationName.split('(')[0].trim()})` : ''}
            </p>
          </div>
        </div>

        <span className="bg-emerald-100 text-emerald-950 font-black text-xs px-3 py-1 rounded-full border border-emerald-300 font-mono shadow-2xs">
          📍 {transitInfo.distanceFormatted}
        </span>
      </div>

      {/* 6 Multi-Modal Transit Grid (Pociąg, Autobus, Tramwaj, Samochód, Rower, Pieszo) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {transitInfo.options.map((opt) => {
          return (
            <button
              key={opt.mode}
              type="button"
              onClick={() => onNavigateWithMode(attraction, opt.mode)}
              className="bg-white hover:bg-indigo-50/60 hover:border-indigo-400 p-3.5 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer text-left space-y-2.5 group hover:scale-[1.02] flex flex-col justify-between"
              id={`btn-mode-${opt.mode}-${attraction.id}`}
              title={pl ? `Kliknij, aby nawigować: ${opt.modeLabel}` : `Click to navigate by ${opt.modeLabel}`}
            >
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                    <span className="text-lg">{opt.icon}</span>
                    <span>{opt.modeLabel}</span>
                  </div>
                  <span className="bg-slate-100 group-hover:bg-indigo-100 text-slate-950 group-hover:text-indigo-950 font-black text-xs px-2.5 py-0.5 rounded-lg font-mono border border-slate-250">
                    {opt.timeFormatted}
                  </span>
                </div>

                {opt.badge && (
                  <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-200">
                    {opt.badge}
                  </span>
                )}

                <p className="text-[11px] text-slate-600 font-medium leading-snug line-clamp-2">
                  {opt.details}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 w-full text-[10px]">
                {opt.costEstimate && (
                  <span className="text-slate-700 font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                    💳 {opt.costEstimate}
                  </span>
                )}
                {opt.calories && (
                  <span className="text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    🔥 ~{opt.calories} kcal
                  </span>
                )}
                <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 ml-auto">
                  <span>{pl ? 'Nawiguj' : 'Go'}</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
