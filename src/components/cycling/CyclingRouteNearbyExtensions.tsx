/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CyclingRoute, Language, UserAccount } from '../../types';
import { 
  Home, Utensils, Compass, MapPin, ArrowRight, Navigation, 
  CheckCircle2, RotateCcw, Bookmark, Layers, Search, Sparkles, X, ChevronDown
} from 'lucide-react';
import InAppGoogleMapRoute from '../InAppGoogleMapRoute';

interface CyclingRouteNearbyExtensionsProps {
  route: CyclingRoute;
  allRoutes: CyclingRoute[];
  language: Language;
  account: UserAccount | null;
  onSelectAlternativeRoute?: (route: CyclingRoute) => void;
}

export type ExtensionCategory = 'all' | 'restaurant' | 'cafe' | 'rest' | 'nearby_routes';

interface NearbySpot {
  id: string;
  name: string;
  category: 'restaurant' | 'cafe' | 'rest' | 'lodging' | 'attraction';
  typeLabelPl: string;
  typeLabelEn: string;
  icon: string;
  distanceKm: number;
  estBikeMinutes: number;
  address: string;
  taglinePl: string;
  taglineEn: string;
  openHours: string;
  rating: number;
  features: string[];
}

export default function CyclingRouteNearbyExtensions({
  route,
  allRoutes,
  language,
  account,
  onSelectAlternativeRoute
}: CyclingRouteNearbyExtensionsProps) {
  const pl = language === 'pl';

  // State: Tab for extensions
  const [selectedEndChoice, setSelectedEndChoice] = useState<'return_home' | 'custom_destination' | 'continue_route'>('return_home');
  const [spotFilter, setSpotFilter] = useState<'all' | 'food' | 'rest'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom destination state
  const [customDestinationInput, setCustomDestinationInput] = useState('');
  const [selectedSpotForNav, setSelectedSpotForNav] = useState<NearbySpot | null>(null);
  const [showNavModal, setShowNavModal] = useState(false);
  
  // Home state
  const [customHomeLocation, setCustomHomeLocation] = useState(account?.homeStationOrHotel || (pl ? 'Mój Dom / Hotel' : 'My Home / Hotel'));
  const [isEditingHome, setIsEditingHome] = useState(false);
  const [savedPlanSuccess, setSavedPlanSuccess] = useState(false);

  // Derive nearby attractions / restaurants / rest spots sorted from CLOSEST (Najbliższe) to FURTHEST (Dalsze)
  const nearbySpots: NearbySpot[] = useMemo(() => {
    const cityName = route.city || 'Poznań';
    
    const spots: NearbySpot[] = [
      {
        id: `spot-cafe-${route.id}-1`,
        name: pl ? `Rowerowa Kawiarnia & Lody "${route.city}"` : `Cyclist Cafe & Gelato`,
        category: 'cafe',
        typeLabelPl: 'Kawiarnia & Desery',
        typeLabelEn: 'Cafe & Sweets',
        icon: '☕',
        distanceKm: 0.8,
        estBikeMinutes: 3,
        address: `${route.endPoint}, ${cityName}`,
        taglinePl: 'Świeża kawa, szarlotka i ogródek ze stojakami rowerowymi.',
        taglineEn: 'Specialty coffee, bakery treats and bike racks.',
        openHours: '09:00 - 20:00',
        rating: 4.9,
        features: [pl ? 'Stojaki na rowery' : 'Bike racks', pl ? 'Ładowanie E-Bike' : 'E-Bike plug']
      },
      {
        id: `spot-rest-${route.id}-1`,
        name: pl ? `Karczma Rowerowa i Grill "${cityName}"` : `Bistro & Cyclist Grill`,
        category: 'restaurant',
        typeLabelPl: 'Restauracja & Obiad',
        typeLabelEn: 'Restaurant & Dining',
        icon: '🍲',
        distanceKm: 1.4,
        estBikeMinutes: 5,
        address: `ul. Turystyczna 12, ${cityName}`,
        taglinePl: 'Ciepłe dania, zupy, dania wege i darmowe napełnienie bidonu.',
        taglineEn: 'Warm meals, vegetarian dishes and free water refill.',
        openHours: '11:30 - 22:00',
        rating: 4.8,
        features: [pl ? 'Pompka & narzędzia' : 'Repair tools', pl ? 'Darmowa woda' : 'Free water refill']
      },
      {
        id: `spot-park-${route.id}-1`,
        name: pl ? `Strefa Relaksu & Wiata MOR` : `Rest Oasis & Bike Shelter`,
        category: 'rest',
        typeLabelPl: 'Wiata & Odpoczynek',
        typeLabelEn: 'Shelter & Rest',
        icon: '🌲',
        distanceKm: 2.1,
        estBikeMinutes: 7,
        address: `Bulwar przy ${route.endPoint}`,
        taglinePl: 'Zadaszone wiaty piknikowe, leżaki i stacja naprawcza rowerów.',
        taglineEn: 'Covered picnic gazebos and self-service bike tools.',
        openHours: pl ? 'Całodobowo' : '24/7 Open',
        rating: 4.9,
        features: [pl ? 'Stacja naprawcza' : 'Tool station', pl ? 'Zadaszenie' : 'Roof shelter']
      },
      {
        id: `spot-lake-${route.id}-1`,
        name: pl ? `Przystań Wodna & Pomost Widokowy` : `Scenic Waterfront Pier`,
        category: 'attraction',
        typeLabelPl: 'Punkt Widokowy',
        typeLabelEn: 'Scenic Spot',
        icon: '⛵',
        distanceKm: 3.5,
        estBikeMinutes: 12,
        address: `Przystań Żeglarska, ${cityName}`,
        taglinePl: 'Malowniczy punkt widokowy nad wodą z ławkami w cieniu.',
        taglineEn: 'Scenic waterfront spot with shaded benches.',
        openHours: '08:00 - 21:00',
        rating: 5.0,
        features: [pl ? 'Punkt widokowy' : 'Scenic spot', pl ? 'Toalety ♿' : 'Accessible WC']
      },
      {
        id: `spot-hotel-${route.id}-1`,
        name: pl ? `Zajazd Pod Lasem & Pokoje` : `Forest Lodge & Inn`,
        category: 'lodging',
        typeLabelPl: 'Nocleg & Regeneracja',
        typeLabelEn: 'Lodging & Inn',
        icon: '🛌',
        distanceKm: 4.8,
        estBikeMinutes: 16,
        address: `Leśny Szlak 4, ${cityName}`,
        taglinePl: 'Komfortowy nocleg po trasie z zamykaną rowerownią.',
        taglineEn: 'Overnight stay with secure locked bike garage.',
        openHours: pl ? 'Recepcja 24h' : '24h Front Desk',
        rating: 4.7,
        features: [pl ? 'Zamykana rowerownia' : 'Locked bike storage', pl ? 'Śniadania' : 'Breakfast']
      }
    ];

    return spots.sort((a, b) => a.distanceKm - b.distanceKm);
  }, [route, pl]);

  // Find nearby adjacent routes sorted by distance
  const nearbyAdjacentRoutes = useMemo(() => {
    return allRoutes
      .filter(r => r.id !== route.id)
      .map(r => {
        const isSameCity = r.city.toLowerCase() === route.city.toLowerCase();
        const estDistanceKm = isSameCity ? 2.5 : 9.0;
        return {
          ...r,
          distanceFromCurrentEndKm: estDistanceKm
        };
      })
      .sort((a, b) => a.distanceFromCurrentEndKm - b.distanceFromCurrentEndKm);
  }, [allRoutes, route]);

  // Filtered spots
  const filteredSpots = useMemo(() => {
    return nearbySpots.filter(spot => {
      // Category filter
      if (spotFilter === 'food' && spot.category !== 'restaurant' && spot.category !== 'cafe') return false;
      if (spotFilter === 'rest' && spot.category !== 'rest' && spot.category !== 'attraction' && spot.category !== 'lodging') return false;
      
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          spot.name.toLowerCase().includes(q) ||
          spot.typeLabelPl.toLowerCase().includes(q) ||
          spot.taglinePl.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [nearbySpots, spotFilter, searchQuery]);

  const handleStartNavToSpot = (spot: NearbySpot) => {
    setSelectedSpotForNav(spot);
    setShowNavModal(true);
  };

  const handleCustomNav = () => {
    if (!customDestinationInput.trim()) return;
    setSelectedSpotForNav({
      id: 'custom-user-dest',
      name: customDestinationInput.trim(),
      category: 'attraction',
      typeLabelPl: 'Wpisane Miejsce',
      typeLabelEn: 'Custom Place',
      icon: '📍',
      distanceKm: 2.0,
      estBikeMinutes: 7,
      address: `${customDestinationInput.trim()}, ${route.city}`,
      taglinePl: 'Nawigacja do Twojego wybranego punktu.',
      taglineEn: 'Navigation to your custom selected spot.',
      openHours: '24/7',
      rating: 5.0,
      features: [pl ? 'Nawigacja rowerowa' : 'Bike routing']
    });
    setShowNavModal(true);
  };

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 text-white space-y-4 shadow-xl" id={`route-planner-extender-${route.id}`}>
      {/* NAGŁÓWEK I STATUS TRASY */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600/80 text-white px-2 py-0.5 rounded">
              {pl ? 'Plan Zakończenia Wyprawy' : 'Trip Completion Plan'}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">
              ⚡ {pl ? 'Najbliższe punkty na początku' : 'Nearest first'}
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{pl ? `Gdzie jedziesz po ukończeniu: "${route.title}"?` : `Next stop after "${route.title}"?`}</span>
          </h4>
        </div>

        {/* Punkty Start / Meta */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-slate-400 truncate max-w-[110px]" title={route.startPoint}>
            🟢 {route.startPoint}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="text-slate-300 font-bold truncate max-w-[110px]" title={route.endPoint}>
            🏁 {route.endPoint}
          </span>
        </div>
      </div>

      {/* 3 GŁÓWNE KARTY WYBORU */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Wariant 1: Powrót do Domu */}
        <button
          type="button"
          onClick={() => setSelectedEndChoice('return_home')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
            selectedEndChoice === 'return_home'
              ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500/50'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
              <Home className="w-4 h-4" />
            </span>
            {selectedEndChoice === 'return_home' && (
              <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded">
                {pl ? 'Wybrane' : 'Active'}
              </span>
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-white">{pl ? '1. Powrót do Domu' : '1. Return Home'}</div>
            <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
              {pl ? 'Nawiguj do miejsca startu lub adresu domowego.' : 'Ride back to origin or home.'}
            </div>
          </div>
        </button>

        {/* Wariant 2: Restauracja / Odpoczynek */}
        <button
          type="button"
          onClick={() => setSelectedEndChoice('custom_destination')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
            selectedEndChoice === 'custom_destination'
              ? 'bg-amber-950/60 border-amber-500 text-white ring-1 ring-amber-500/50'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Utensils className="w-4 h-4" />
            </span>
            {selectedEndChoice === 'custom_destination' && (
              <span className="text-[10px] font-bold bg-amber-600 text-white px-1.5 py-0.5 rounded">
                {pl ? 'Wybrane' : 'Active'}
              </span>
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-white">{pl ? '2. Jedzenie & Relaks' : '2. Food & Rest'}</div>
            <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
              {pl ? 'Kawiarnia, obiad lub wiata odpoczynku obok.' : 'Cafe, meal or rest gazebo nearby.'}
            </div>
          </div>
        </button>

        {/* Wariant 3: Kolejna Trasa */}
        <button
          type="button"
          onClick={() => setSelectedEndChoice('continue_route')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
            selectedEndChoice === 'continue_route'
              ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500/50'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <Layers className="w-4 h-4" />
            </span>
            {selectedEndChoice === 'continue_route' && (
              <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                {pl ? 'Wybrane' : 'Active'}
              </span>
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-white">{pl ? '3. Jedź na Inną Trasę' : '3. Connect Next Trail'}</div>
            <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
              {pl ? 'Przejdź na sąsiedni szlak tuż obok mety.' : 'Continue onto adjacent trail.'}
            </div>
          </div>
        </button>
      </div>

      {/* SZCZEGÓŁOWY PANEL W ZALEŻNOŚCI OD WYBORU */}

      {/* 1. SEKCJA: POWRÓT DO DOMU */}
      {selectedEndChoice === 'return_home' && (
        <div className="bg-slate-950 border border-slate-800 p-3.5 sm:p-4 rounded-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs text-slate-300">
              {pl ? 'Cel powrotu:' : 'Destination:'}{' '}
              <strong className="text-white font-bold">{customHomeLocation || route.startPoint}</strong>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingHome(!isEditingHome)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline cursor-pointer self-start sm:self-auto"
            >
              {isEditingHome ? (pl ? 'Zamknij' : 'Close') : (pl ? 'Zmień adres ✏️' : 'Edit address ✏️')}
            </button>
          </div>

          {isEditingHome && (
            <div className="flex gap-2">
              <input
                type="text"
                value={customHomeLocation}
                onChange={(e) => setCustomHomeLocation(e.target.value)}
                placeholder={pl ? 'Wpisz ulicę, miasto lub hotel...' : 'Enter address or hotel...'}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setIsEditingHome(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
              >
                {pl ? 'Zapisz' : 'Save'}
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setSelectedSpotForNav({
                  id: 'return-home-nav',
                  name: customHomeLocation || route.startPoint,
                  category: 'rest',
                  typeLabelPl: 'Powrót do Domu',
                  typeLabelEn: 'Return Home',
                  icon: '🏠',
                  distanceKm: route.distanceKm,
                  estBikeMinutes: Math.round(route.distanceKm * 3.5),
                  address: `${customHomeLocation || route.startPoint}, ${route.city}`,
                  taglinePl: 'Nawiguj bezpieczną drogą powrotną do punktu wyjścia.',
                  taglineEn: 'Navigate back to your start point.',
                  openHours: '24/7',
                  rating: 5.0,
                  features: [pl ? 'Drogi rowerowe' : 'Cycle paths']
                });
                setShowNavModal(true);
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              <Navigation className="w-4 h-4" />
              <span>{pl ? 'Nawiguj do Domu 🚴' : 'Navigate Home 🚴'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSavedPlanSuccess(true);
                setTimeout(() => setSavedPlanSuccess(false), 2500);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>{savedPlanSuccess ? (pl ? '✓ Zapisano w pamięci' : '✓ Saved') : (pl ? 'Zapisz w pamięci trasy' : 'Save route')}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. SEKCJA: MIEJSCA OBOK (RESTAURACJE, KAWIARNIE, ODPOČZYNEK, WŁASNY WPIS) */}
      {(selectedEndChoice === 'custom_destination' || selectedEndChoice === 'return_home') && (
        <div className="space-y-3">
          {/* Pasek wyszukiwania i szybkiego wpisywania własnego miejsca */}
          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>{pl ? 'Wpisz własny punkt docelowy lub wybierz z listy poniżej:' : 'Type destination or pick below:'}</span>
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customDestinationInput}
                  onChange={(e) => setCustomDestinationInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomNav()}
                  placeholder={pl ? 'Wpisz np. Restauracja Rybna, Park, Rynek...' : 'Enter place e.g. Fish Bistro, Central Park...'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-amber-500 placeholder-slate-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                type="button"
                onClick={handleCustomNav}
                disabled={!customDestinationInput.trim()}
                className="bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Navigation className="w-3 h-3" />
                <span>{pl ? 'Jedź tam' : 'Go'}</span>
              </button>
            </div>

            {/* Szybkie filtry listy */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">{pl ? 'Filtr:' : 'Filter:'}</span>
              <button
                type="button"
                onClick={() => setSpotFilter('all')}
                className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium cursor-pointer transition-all ${
                  spotFilter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {pl ? 'Wszystkie' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => setSpotFilter('food')}
                className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium cursor-pointer transition-all ${
                  spotFilter === 'food' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                ☕ {pl ? 'Jedzenie & Kawa' : 'Food & Coffee'}
              </button>
              <button
                type="button"
                onClick={() => setSpotFilter('rest')}
                className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium cursor-pointer transition-all ${
                  spotFilter === 'rest' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                🌲 {pl ? 'Wiaty & Widoki' : 'Rest & Views'}
              </button>
            </div>
          </div>

          {/* Lista miejsc uszeregowana rosnąco odległością */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredSpots.map((spot) => (
              <div
                key={spot.id}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-3 rounded-xl flex items-center justify-between gap-3 transition-all"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{spot.icon}</span>
                    <h5 className="text-xs font-bold text-white truncate">{spot.name}</h5>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{spot.taglinePl}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-mono text-emerald-400 font-semibold">📍 {spot.distanceKm} km</span>
                    <span>• {spot.estBikeMinutes} min rowerem</span>
                    <span>• {spot.openHours}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartNavToSpot(spot)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] py-1.5 px-2.5 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Navigation className="w-3 h-3" />
                  <span>{pl ? 'Wybierz' : 'Pick'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SEKCJA: SĄSIEDNIE TRASY ROWEROWE */}
      {selectedEndChoice === 'continue_route' && (
        <div className="space-y-2.5">
          <div className="text-xs text-slate-300 font-bold">
            {pl ? 'Sąsiednie trasy obok mety (od najbliższej):' : 'Adjacent trails nearby (nearest first):'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {nearbyAdjacentRoutes.slice(0, 4).map((adjRoute) => (
              <div
                key={adjRoute.id}
                className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                    <span className="uppercase font-semibold text-emerald-400">{adjRoute.city}</span>
                    <span className="font-mono text-amber-400 font-bold">+{adjRoute.distanceKm} km</span>
                  </div>
                  <h5 className="text-xs font-bold text-white line-clamp-1">{adjRoute.title}</h5>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{adjRoute.description}</p>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400">
                    📍 {adjRoute.distanceFromCurrentEndKm} km od obecnej mety
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectAlternativeRoute) {
                        onSelectAlternativeRoute(adjRoute);
                      }
                      setSelectedSpotForNav({
                        id: `adj-nav-${adjRoute.id}`,
                        name: adjRoute.title,
                        category: 'attraction',
                        typeLabelPl: 'Kolejna Trasa',
                        typeLabelEn: 'Next Trail',
                        icon: '🚴',
                        distanceKm: adjRoute.distanceFromCurrentEndKm,
                        estBikeMinutes: Math.round(adjRoute.distanceFromCurrentEndKm * 3.5),
                        address: `${adjRoute.startPoint}, ${adjRoute.city}`,
                        taglinePl: adjRoute.description,
                        taglineEn: adjRoute.description,
                        openHours: '24/7',
                        rating: adjRoute.rating || 5.0,
                        features: [adjRoute.surface || 'Asfalt & Szuter']
                      });
                      setShowNavModal(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] py-1 px-2.5 rounded-lg cursor-pointer"
                  >
                    {pl ? 'Połącz i Jedź ➔' : 'Link & Ride ➔'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MODAL NAWIGACJI */}
      {showNavModal && selectedSpotForNav && (
        <div className="bg-slate-950 border border-emerald-500/40 p-3.5 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5" />
              <span>{pl ? `Nawigacja: ${selectedSpotForNav.name}` : `Navigation: ${selectedSpotForNav.name}`}</span>
            </span>
            <button
              type="button"
              onClick={() => setShowNavModal(false)}
              className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
            >
              ✕ {pl ? 'Zamknij' : 'Close'}
            </button>
          </div>

          <InAppGoogleMapRoute
            destination={selectedSpotForNav.address}
            destinationTitle={selectedSpotForNav.name}
            initialStartLocation={`${route.endPoint}, ${route.city}`}
            initialTravelMode="bike"
            city={route.city}
            language={language}
            onClose={() => setShowNavModal(false)}
            autoStartNav={true}
          />
        </div>
      )}
    </div>
  );
}
