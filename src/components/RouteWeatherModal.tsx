/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Attraction, Language, TravelMode, UserAccount } from '../types';
import SightseeingWeatherCard from './SightseeingWeatherCard';
import InAppGoogleMapRoute from './InAppGoogleMapRoute';
import { 
  X, 
  MapPin, 
  Compass, 
  CloudSun,
  Navigation,
  Car,
  Bus,
  Bike,
  Footprints
} from 'lucide-react';
import { 
  getAttractionTransitInfo, 
  GpsCoordinates 
} from '../services/gpsTransitService';

interface RouteWeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  attraction: Attraction | null;
  language: Language;
  account: UserAccount | null;
  userCoords?: GpsCoordinates | null;
  userLocationName?: string;
  initialTravelMode?: TravelMode;
}

export default function RouteWeatherModal({
  isOpen,
  onClose,
  attraction,
  language,
  account,
  userCoords = null,
  userLocationName = '',
  initialTravelMode = 'transit'
}: RouteWeatherModalProps) {
  const [selectedTravelMode, setSelectedTravelMode] = useState<TravelMode>(initialTravelMode);

  if (!isOpen || !attraction) return null;

  const transitInfo = getAttractionTransitInfo(userCoords, attraction, language);
  const pl = language === 'pl';
  const nl = language === 'nl';

  // Construct start location string for map
  const effectiveStartLocation = userCoords 
    ? `${userCoords.lat.toFixed(5)}, ${userCoords.lng.toFixed(5)}` 
    : userLocationName || '';

  return (
    <div 
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      id="route-weather-modal-backdrop"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto my-auto relative space-y-6 p-5 sm:p-6 md:p-8"
        id="route-weather-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header with GPS Distance badge */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-100 text-emerald-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <Navigation className="w-3 h-3 text-emerald-700" />
                <span>{pl ? 'NAWIGACJA GPS & POGODA 🧭' : 'GPS NAVIGATION & WEATHER 🧭'}</span>
              </span>
              <span className="bg-indigo-50 text-indigo-900 font-bold text-xs px-2.5 py-0.5 rounded-full border border-indigo-200 font-mono">
                📍 {transitInfo.distanceFormatted} {pl ? 'z Twojej pozycji' : 'from your location'}
              </span>
              <span className="text-xs text-slate-500 font-bold">
                • {attraction.city}, {attraction.region}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
              {attraction.name}
            </h2>

            {userLocationName && (
              <p className="text-xs text-slate-600 font-medium flex items-center gap-1">
                <span className="text-slate-400 font-bold">{pl ? 'Punkt początkowy:' : 'Origin:'}</span>
                <span className="text-slate-900 font-bold">{userLocationName}</span>
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full cursor-pointer transition-colors"
            id="btn-close-route-weather-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Travel Mode Selector Badges (Pociąg, Autobus, Tramwaj, Samochód, Rower, Pieszo) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {transitInfo.options.map((opt) => {
            const isCurrentMode = selectedTravelMode === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                onClick={() => setSelectedTravelMode(opt.mode)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                  isCurrentMode
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-emerald-400/50 scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
                title={opt.details}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1 text-xs font-bold truncate">
                    <span className="text-base">{opt.icon}</span>
                    <span className="truncate">{opt.modeLabel.split(' ')[0]}</span>
                  </div>
                  {isCurrentMode && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-ping" />
                  )}
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className={`text-xs font-black font-mono ${isCurrentMode ? 'text-amber-300' : 'text-slate-900'}`}>
                    {opt.timeFormatted}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 1. Direct In-App Interactive Google Maps Navigation */}
        <InAppGoogleMapRoute
          destination={`${attraction.name}, ${attraction.city}, ${attraction.region}`}
          destinationTitle={attraction.name}
          city={attraction.city}
          initialStartLocation={effectiveStartLocation}
          initialTravelMode={selectedTravelMode}
          language={language}
          onClose={onClose}
          autoStartNav={false}
        />

        {/* 2. Dedicated Sightseeing Weather Card for this attraction */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <CloudSun className="w-4 h-4 text-amber-500" />
            <span>{pl ? 'Prognoza pogody na miejscu docelowym:' : nl ? 'Het weer op deze locatie:' : 'Weather at this destination:'}</span>
          </label>

          <SightseeingWeatherCard 
            city={attraction.city}
            country={attraction.region.includes('Polska') || attraction.city === 'Kraków' || attraction.city === 'Warsaw' || attraction.city === 'Gdańsk' ? 'Poland' : 'Netherlands'}
            language={language}
            attractionName={attraction.name}
          />
        </div>

        {/* Modal Bottom Footer */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-500 font-semibold">
            {pl ? 'Życzymy bezpiecznej podróży i miłego zwiedzania!' : 'Have a safe journey and enjoy sightseeing!'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm"
          >
            {pl ? 'Zamknij' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}
