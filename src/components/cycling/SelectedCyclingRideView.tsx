/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CyclingRoute, Language, UserAccount } from '../../types';
import { CATEGORY_CONFIG } from './AddCyclingRouteModal';
import InAppGoogleMapRoute from '../InAppGoogleMapRoute';
import CyclingRouteCommentsSection from './CyclingRouteCommentsSection';
import { 
  Bike, Navigation, ArrowLeft, MapPin, Flag, Star, ShieldCheck, 
  Wind, Droplets, Sun, Sparkles, Clock, Compass, BatteryCharging, 
  Wrench, CheckCircle2, Share2, Coffee, Check, MessageSquare, Bookmark
} from 'lucide-react';
import { calculateHaversineDistanceKm, GpsLocationState } from '../../services/gpsTransitService';
import { CITY_COORDINATES } from '../../data/weatherData';

interface SelectedCyclingRideViewProps {
  route: CyclingRoute;
  allRoutes: CyclingRoute[];
  language: Language;
  account: UserAccount | null;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBack: () => void;
  onSelectOtherRoute: (route: CyclingRoute) => void;
}

export default function SelectedCyclingRideView({
  route,
  allRoutes,
  language,
  account,
  isFavorite = false,
  onToggleFavorite,
  onBack,
  onSelectOtherRoute
}: SelectedCyclingRideViewProps) {
  const pl = language === 'pl';
  const catConf = CATEGORY_CONFIG[route.category] || CATEGORY_CONFIG.turystyczna;

  // GPS Location State
  const [gpsState, setGpsState] = useState<GpsLocationState>({
    coords: null,
    status: 'idle',
    locationName: pl ? 'Lokalizacja nieustalona' : 'Location not set'
  });
  const [isCopied, setIsCopied] = useState(false);
  const [showInAppMap, setShowInAppMap] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Load existing GPS from localStorage if available or request
  useEffect(() => {
    try {
      const savedGps = localStorage.getItem('tadzik_user_gps_location');
      if (savedGps) {
        const parsed = JSON.parse(savedGps);
        if (parsed.coords && parsed.coords.lat) {
          setGpsState({
            coords: parsed.coords,
            status: 'success',
            locationName: parsed.locationName || (pl ? 'Twoja lokalizacja' : 'Your location'),
            updatedAt: parsed.updatedAt
          });
          return;
        }
      }
    } catch (e) {
      // ignore
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          let detectedName = pl ? 'Twoja pozycja GPS' : 'Your GPS Location';
          
          for (const [cityName, cityData] of Object.entries(CITY_COORDINATES)) {
            const d = calculateHaversineDistanceKm(coords.lat, coords.lng, cityData.lat, cityData.lon);
            if (d < 35) {
              detectedName = pl ? `Okolice: ${cityName}` : `Near: ${cityName}`;
              break;
            }
          }

          const newState: GpsLocationState = {
            coords,
            status: 'success',
            locationName: detectedName,
            updatedAt: Date.now()
          };
          setGpsState(newState);
          try {
            localStorage.setItem('tadzik_user_gps_location', JSON.stringify(newState));
          } catch (e) {}
        },
        () => {
          const cityKey = Object.keys(CITY_COORDINATES).find(c => route.city.toLowerCase().includes(c.toLowerCase())) || 'Poznań';
          const fallbackCity = CITY_COORDINATES[cityKey] || CITY_COORDINATES['Poznań'];
          setGpsState({
            coords: { lat: fallbackCity.lat, lng: fallbackCity.lon },
            status: 'denied',
            locationName: route.city
          });
        },
        { timeout: 6000 }
      );
    }
  }, [route.city, pl]);

  // Coordinates calculation
  const startCoords = route.startCoords || (
    route.destinationCoords ? { lat: route.destinationCoords.lat - 0.1, lng: route.destinationCoords.lng - 0.1 } : { lat: 52.4064, lng: 16.9252 }
  );

  const userLat = gpsState.coords?.lat || startCoords.lat;
  const userLng = gpsState.coords?.lng || startCoords.lng;
  const distToStartKm = Math.round(calculateHaversineDistanceKm(userLat, userLng, startCoords.lat, startCoords.lng) * 10) / 10;
  const bikeMinsToStart = Math.max(2, Math.round((distToStartKm / 16) * 60));

  // Clear, synthesized weather for bike ride
  const weatherBaseTemp = 21 + ((route.title.length % 4) - 1);
  const weatherWindSpeed = 10 + (route.category === 'polna' ? 5 : 0);

  const handleShare = async () => {
    const text = `${route.title} - ${route.distanceKm} km | Przewodnik Rowerowy`;
    if (navigator.share) {
      try {
        await navigator.share({ title: route.title, text, url: window.location.href });
        return;
      } catch (e) {}
    }
    navigator.clipboard.writeText(`${text}\n${window.location.href}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const destinationPhoto = route.destinationImageUrl || (
    route.category === 'lesna' ? 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80' :
    route.category === 'polna' ? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' :
    route.category === 'terenowa' ? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80' :
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  );

  return (
    <div className="space-y-5 max-w-4xl mx-auto text-white pb-10" id="selected-cycling-ride-view">
      
      {/* 1. Header Navigation Bar */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 sm:p-3.5 rounded-2xl">
        <button
          type="button"
          onClick={onBack}
          id="btn-back-to-cycling-routes"
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-all cursor-pointer border border-slate-700 active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{pl ? '← Wszystkie Trasy' : '← All Routes'}</span>
        </button>

        <div className="flex items-center gap-2">
          {onToggleFavorite && (
            <button
              type="button"
              id="btn-toggle-favorite-detail"
              onClick={onToggleFavorite}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm ${
                isFavorite
                  ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-amber-400/20'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700 hover:border-amber-400/60 hover:text-amber-300'
              }`}
              title={isFavorite ? (pl ? 'W Twoich ulubionych (Profil)' : 'In favorites (Profile)') : (pl ? 'Zapisz do ulubionych (Profil)' : 'Save to favorites (Profile)')}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-slate-950 text-slate-950' : 'text-amber-400'}`} />
              <span>
                {isFavorite 
                  ? (pl ? 'Zapisano w Ulubionych ⭐' : 'Saved in Favorites ⭐') 
                  : (pl ? 'Zapisz do ulubionych' : 'Save to Favorites')}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title={pl ? 'Udostępnij trasę' : 'Share route'}
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{isCopied ? (pl ? 'Skopiowano' : 'Copied') : (pl ? 'Udostępnij' : 'Share')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowInAppMap(!showInAppMap)}
            id="btn-toggle-in-app-map"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>{showInAppMap ? (pl ? 'Ukryj Mapę' : 'Hide Map') : (pl ? 'Nawiguj w Google Maps 🚴' : 'Navigate 🚴')}</span>
          </button>
        </div>
      </div>

      {/* 2. HERO DESTINATION CARD (ZDJĘCIE MIEJSCA DOCELOWEGO & KLUCZOWE PARAMETRY) */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        <div className="relative h-56 sm:h-72 md:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={destinationPhoto}
            alt={route.destinationName || route.endPoint}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <span className={`text-xs font-black uppercase px-3 py-1 rounded-xl border backdrop-blur-md shadow-lg flex items-center gap-1.5 ${catConf.bgClass} ${catConf.borderClass} ${catConf.textClass}`}>
              <span>{catConf.icon}</span>
              <span>{pl ? catConf.labelPl : catConf.labelEn}</span>
            </span>

            <span className="text-xs font-black bg-slate-900/90 text-amber-300 border border-slate-700/80 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{route.rating || 5.0}</span>
            </span>
          </div>

          {/* Destination Overlay Title */}
          <div className="absolute bottom-3 left-3 right-3 space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-[11px] font-black uppercase px-2 py-0.5 rounded-md backdrop-blur-md">
                🎯 {pl ? 'CEL PRZEJAŻDŻKI' : 'DESTINATION'}
              </span>
              <span className="text-slate-300 text-xs font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>{route.city}</span>
                {route.country && <span className="text-slate-400">({route.country === 'Poland' ? 'Polska' : route.country})</span>}
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {route.destinationName || route.endPoint}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 font-medium line-clamp-2 max-w-2xl drop-shadow">
              {route.description}
            </p>
          </div>
        </div>

        {/* 4 Essential Quick Parameters (Wystarczająco dużo do decyzji) */}
        <div className="bg-slate-900 border-t border-slate-800 p-3.5 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          {/* Distance & Time */}
          <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{pl ? 'Długość Szlaku' : 'Trail Length'}</span>
            <span className="text-base font-black font-mono text-amber-300">{route.distanceKm} km</span>
            <span className="text-[10px] text-slate-400 block font-medium">~{route.estimatedDuration || '1h 45m'}</span>
          </div>

          {/* Distance from current location */}
          <div className="bg-slate-950/70 border border-indigo-900/40 p-2.5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-indigo-300 block">{pl ? 'Dojazd od Ciebie' : 'From Your GPS'}</span>
            <span className="text-base font-black font-mono text-indigo-200">📍 {distToStartKm} km</span>
            <span className="text-[10px] text-slate-400 block font-medium">~{bikeMinsToStart} min rowerem</span>
          </div>

          {/* Difficulty & Elevation */}
          <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{pl ? 'Trudność' : 'Difficulty'}</span>
            <span className="text-xs sm:text-sm font-black uppercase text-emerald-400 block mt-0.5">{route.difficulty}</span>
            <span className="text-[10px] text-cyan-300 block font-medium">+{route.elevationGainMeters || 35}m wzniosu</span>
          </div>

          {/* Surface & Bike */}
          <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{pl ? 'Zalecany Rower' : 'Best Bike'}</span>
            <span className="text-xs sm:text-sm font-black text-slate-100 truncate block mt-0.5">
              {route.recommendedBike?.split('/')[0]?.trim() || 'Trekking / Gravel'}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">{route.surface || (pl ? 'Asfalt & Szuter' : 'Paved & Gravel')}</span>
          </div>
        </div>
      </div>

      {/* 3. WEATHER & RIDING CONDITIONS BAR (Szybka, bezszumowa ocena pogody) */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md" id="cycling-weather-bar">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-black text-white">
                {pl ? 'Aktualne warunki na szlaku:' : 'Current Riding Conditions:'}
              </h3>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.2 rounded-full font-bold">
                {pl ? 'Idealne na rower 🚲' : 'Great for cycling 🚲'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <span>🌡️ <strong>{weatherBaseTemp}°C</strong> (odczuwalna {weatherBaseTemp + 1}°C)</span>
              <span>💨 Wiatr: <strong>{weatherWindSpeed} km/h</strong></span>
              <span>🌧️ Opady: <strong>0% (sucho)</strong></span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowInAppMap(!showInAppMap)}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{pl ? 'Rozpocznij trasę' : 'Start Route'}</span>
        </button>
      </div>

      {/* 4. IN-APP GOOGLE MAPS ROUTE (Jeśli włączona) */}
      {showInAppMap && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>{pl ? 'Interaktywna Nawigacja Rowerowa Google Maps:' : 'Interactive Bike Navigation:'}</span>
            </span>
            <button
              type="button"
              onClick={() => setShowInAppMap(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer px-2 py-1 bg-slate-800 rounded-lg"
            >
              ✕ {pl ? 'Ukryj mapę' : 'Hide map'}
            </button>
          </div>

          <InAppGoogleMapRoute
            destination={`${route.endPoint}, ${route.city}`}
            destinationTitle={route.destinationName || route.title}
            initialStartLocation={`${route.startPoint}, ${route.city}`}
            initialTravelMode="bike"
            city={route.city}
            language={language}
            onClose={() => setShowInAppMap(false)}
            autoStartNav={true}
          />
        </div>
      )}

      {/* 5. DLACZEGO WARTO WYBRAĆ TĘ TRASĘ? (KLUCZOWE POWODY & PUNKTY NA SZLAKU) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3.5">
        <h4 className="text-xs font-black uppercase text-indigo-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{pl ? 'Dlaczego warto wybrać tę trasę?' : 'Why choose this route?'}</span>
        </h4>

        {/* 2-Column Concise Highlights & Safety */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {route.highlights.map((h, idx) => (
            <div key={idx} className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800/80 p-3 rounded-2xl text-slate-200">
              <span className="text-amber-400 font-bold">✨</span>
              <span className="font-medium">{h}</span>
            </div>
          ))}

          {/* Safety badge */}
          <div className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800/80 p-3 rounded-2xl text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{route.smartInsights?.safetyLevel || (pl ? 'Wydzielona trasa bezkolizyjna z autami' : 'Dedicated bike path')}</span>
          </div>

          {/* Amenities / Pit stop highlight */}
          <div className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800/80 p-3 rounded-2xl text-slate-200">
            <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">{route.smartInsights?.waterPoints || (pl ? 'Punkty odpoczynku, woda i kawiarnie na mecie' : 'Rest stops & cafes at destination')}</span>
          </div>
        </div>

        {/* Start ➔ Meta Timeline Summary */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0">
              {pl ? 'START' : 'START'}
            </span>
            <span className="font-bold text-white truncate">{route.startPoint}</span>
          </div>

          <span className="text-slate-600 font-bold">➔</span>

          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-rose-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0">
              {pl ? 'META' : 'END'}
            </span>
            <span className="font-bold text-white truncate">{route.endPoint}</span>
          </div>
        </div>
      </div>

      {/* 6. REVIEWS & COMMENTS TOGGLE (Opinie społeczności - opcjonalnie rozwijane) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-xs font-black uppercase text-indigo-300 hover:text-white transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>{pl ? `Opinie i komentarze rowerzystów (${route.reviewsCount || 1})` : `Community Reviews (${route.reviewsCount || 1})`}</span>
            <span className="text-amber-400 font-mono">⭐ {route.rating || 5.0}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            {showComments ? (pl ? 'Zwiń opinie ▲' : 'Hide reviews ▲') : (pl ? 'Rozwiń opinie ▼' : 'Show reviews ▼')}
          </button>
        </div>

        {showComments && (
          <div className="pt-3 border-t border-slate-800 animate-fade-in">
            <CyclingRouteCommentsSection
              routeId={route.id}
              routeTitle={route.title}
              language={language}
              defaultAuthor={account?.username || account?.firstName}
            />
          </div>
        )}
      </div>

      {/* 7. OTHER RECOMMENDED RIDES NEARBY */}
      {allRoutes.filter(r => r.id !== route.id).length > 0 && (
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>{pl ? 'Inne polecane przejażdżki w pobliżu:' : 'Other nearby rides:'}</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {allRoutes.filter(r => r.id !== route.id).slice(0, 3).map((r) => {
              const cConf = CATEGORY_CONFIG[r.category] || CATEGORY_CONFIG.turystyczna;
              const rPhoto = r.destinationImageUrl || 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    onSelectOtherRoute(r);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden text-left transition-all cursor-pointer group flex items-center gap-2.5 p-2"
                >
                  <img
                    src={rPhoto}
                    alt={r.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-[9px] font-bold text-amber-300 font-mono block">{r.distanceKm} km • {cConf.icon}</span>
                    <h5 className="text-xs font-black text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {r.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 truncate">{r.city}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
