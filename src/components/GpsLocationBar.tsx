/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { GpsLocationState } from '../services/gpsTransitService';
import { CITY_COORDINATES } from '../data/weatherData';
import { 
  Navigation, 
  MapPin, 
  RefreshCw, 
  LocateFixed, 
  Compass, 
  SlidersHorizontal,
  Check,
  AlertCircle
} from 'lucide-react';

interface GpsLocationBarProps {
  gpsState: GpsLocationState;
  onRefreshGps: () => void;
  onSelectManualLocation: (name: string, lat: number, lng: number) => void;
  language: Language;
  sortByDistance: boolean;
  onToggleSortByDistance: () => void;
  totalAttractionsCount: number;
  hasGpsConsent?: boolean;
}

export const GpsLocationBar: React.FC<GpsLocationBarProps> = ({
  gpsState,
  onRefreshGps,
  onSelectManualLocation,
  language,
  sortByDistance,
  onToggleSortByDistance,
  totalAttractionsCount,
  hasGpsConsent = false
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const pl = language === 'pl';
  const nl = language === 'nl';

  const POPULAR_HUBS = [
    { name: 'Rotterdam Centraal', lat: 51.9244, lng: 4.4777, country: 'NL' },
    { name: 'Amsterdam Centraal', lat: 52.3791, lng: 4.9003, country: 'NL' },
    { name: 'Utrecht Centraal', lat: 52.0894, lng: 5.1102, country: 'NL' },
    { name: 'Den Haag Centraal', lat: 52.0809, lng: 4.3242, country: 'NL' },
    { name: 'Eindhoven Centraal', lat: 51.4433, lng: 5.4814, country: 'NL' },
    { name: 'Kraków Główny', lat: 50.0667, lng: 19.9481, country: 'PL' },
    { name: 'Warszawa Centralna', lat: 52.2288, lng: 21.0032, country: 'PL' },
    { name: 'Gdańsk Główny', lat: 54.3561, lng: 18.6446, country: 'PL' },
    { name: 'Wrocław Główny', lat: 51.0989, lng: 17.0366, country: 'PL' },
    { name: 'Brussels Central', lat: 50.8455, lng: 4.3571, country: 'BE' },
    { name: 'Berlin Hbf', lat: 52.5251, lng: 13.3694, country: 'DE' },
    { name: 'Paris Gare du Nord', lat: 48.8809, lng: 2.3553, country: 'FR' },
  ];

  return (
    <div 
      className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-4 sm:p-5 border border-indigo-900/60 shadow-xl space-y-3"
      id="gps-location-status-bar"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left: GPS Indicator and Current Position */}
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <div className={`p-3 rounded-2xl border font-black shadow-lg transition-all ${
              gpsState.status === 'success' 
                ? 'bg-emerald-500 text-slate-950 border-emerald-300 ring-4 ring-emerald-500/20'
                : gpsState.status === 'locating'
                ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                : 'bg-slate-800 text-amber-300 border-slate-700'
            }`}>
              <Navigation className={`w-5 h-5 ${gpsState.status === 'locating' ? 'animate-spin' : ''}`} />
            </div>
            {gpsState.status === 'success' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
            )}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-400/20 text-emerald-300 text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <LocateFixed className="w-3 h-3" />
                <span>{pl ? 'GPS NA ŻYWO' : nl ? 'LIVE GPS' : 'LIVE GPS'}</span>
              </span>
              {hasGpsConsent ? (
                <span className="bg-indigo-900/60 text-indigo-200 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-indigo-500/40">
                  {pl ? '✓ Zgoda z rejestracji aktywna' : '✓ Registration GPS Consent Active'}
                </span>
              ) : (
                <span className="bg-slate-800 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-700">
                  {pl ? '📍 Tryb stacji domowej' : '📍 Home Station Mode'}
                </span>
              )}
              {gpsState.accuracyMeters && (
                <span className="text-[11px] text-slate-400 font-mono">
                  ±{gpsState.accuracyMeters}m {pl ? 'dokładności' : 'accuracy'}
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5 flex-wrap">
              <span>{pl ? 'Twoja obecna lokalizacja:' : nl ? 'Uw huidige locatie:' : 'Your Current Location:'}</span>
              <span className="text-amber-300 font-mono underline decoration-amber-400/40">
                {gpsState.locationName || (pl ? 'Wykrywanie pozycji GPS...' : 'Detecting GPS position...')}
              </span>
            </h3>

            {gpsState.coords && (
              <p className="text-[11px] text-slate-300 font-medium">
                {pl ? 'Dystanse i czasy dojazdu (Auto, Pociąg, Rower, Pieszo) liczone są bezpośrednio z Twojej pozycji!' : 'Distances and travel times are computed in real time from your exact GPS spot!'}
              </p>
            )}
          </div>
        </div>

        {/* Right: GPS Actions & Sort Button */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto shrink-0 justify-between md:justify-end">
          
          <button
            type="button"
            onClick={onRefreshGps}
            disabled={gpsState.status === 'locating'}
            className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-indigo-400/30 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            id="btn-refresh-user-gps"
            title={pl ? 'Pobierz współrzędne z czujnika GPS' : 'Acquire GPS position'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${gpsState.status === 'locating' ? 'animate-spin' : ''}`} />
            <span>{gpsState.status === 'locating' ? (pl ? 'Lokalizuję...' : 'Locating...') : (pl ? 'Pobierz GPS 📡' : 'Get GPS 📡')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLocationPicker(!showLocationPicker)}
            className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            id="btn-toggle-manual-location"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{pl ? 'Zmień punkt ✏️' : 'Change Origin ✏️'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleSortByDistance}
            className={`flex-1 sm:flex-initial font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md ${
              sortByDistance
                ? 'bg-amber-400 text-slate-950 border border-amber-300 ring-2 ring-amber-400/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-amber-300 border border-amber-400/30'
            }`}
            id="btn-sort-by-gps-distance"
          >
            <Compass className="w-4 h-4 stroke-[2.5]" />
            <span>
              {sortByDistance
                ? (pl ? '✓ Sortowanie: Najbliżej Ciebie' : '✓ Sorted by Distance')
                : (pl ? 'Sortuj: Najbliżej mnie 🧭' : 'Sort: Closest to Me 🧭')}
            </span>
          </button>

        </div>

      </div>

      {/* Manual Location Preset Selector Dropdown */}
      {showLocationPicker && (
        <div className="bg-slate-950/90 border border-indigo-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{pl ? 'Wybierz stację lub punkt startowy do obliczenia odległości:' : 'Select station or starting point for distance calculation:'}</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowLocationPicker(false)}
              className="text-xs text-slate-400 hover:text-white font-bold px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {POPULAR_HUBS.map((hub) => {
              const isSelected = gpsState.locationName.includes(hub.name);
              return (
                <button
                  key={hub.name}
                  type="button"
                  onClick={() => {
                    onSelectManualLocation(hub.name, hub.lat, hub.lng);
                    setShowLocationPicker(false);
                  }}
                  className={`text-left p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-slate-900/90 text-slate-200 border-slate-800 hover:border-indigo-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block">{hub.country}</span>
                    <span className="truncate">{hub.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
