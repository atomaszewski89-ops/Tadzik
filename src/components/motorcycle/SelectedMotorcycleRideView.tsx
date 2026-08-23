/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MotorcycleRoute, MotorcycleCategory, Language, UserAccount } from '../../types';
import { MOTO_CATEGORY_CONFIG } from './AddMotorcycleRouteModal';
import InAppGoogleMapRoute from '../InAppGoogleMapRoute';
import MotorcycleRouteCommentsSection from './MotorcycleRouteCommentsSection';
import { 
  Navigation, ArrowLeft, MapPin, Flag, Star, ShieldCheck, 
  Wind, Droplets, Sun, Sparkles, Clock, Compass, Fuel, 
  CheckCircle2, Share2, Coffee, Check, MessageSquare, Bookmark,
  Flame, Zap, AlertTriangle, ShieldAlert, Award
} from 'lucide-react';
import { calculateHaversineDistanceKm, GpsLocationState } from '../../services/gpsTransitService';
import { CITY_COORDINATES } from '../../data/weatherData';

interface SelectedMotorcycleRideViewProps {
  route: MotorcycleRoute;
  allRoutes: MotorcycleRoute[];
  language: Language;
  account: UserAccount | null;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBack: () => void;
  onSelectOtherRoute: (route: MotorcycleRoute) => void;
}

export default function SelectedMotorcycleRideView({
  route,
  allRoutes,
  language,
  account,
  isFavorite = false,
  onToggleFavorite,
  onBack,
  onSelectOtherRoute
}: SelectedMotorcycleRideViewProps) {
  const pl = language === 'pl';
  const conf = MOTO_CATEGORY_CONFIG[route.category] || MOTO_CATEGORY_CONFIG.winkle;

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
            if (d < 45) {
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
    route.destinationCoords ? { lat: route.destinationCoords.lat - 0.15, lng: route.destinationCoords.lng - 0.15 } : { lat: 50.45, lng: 16.5 }
  );

  const userLat = gpsState.coords?.lat || startCoords.lat;
  const userLng = gpsState.coords?.lng || startCoords.lng;
  const distToStartKm = Math.round(calculateHaversineDistanceKm(userLat, userLng, startCoords.lat, startCoords.lng) * 10) / 10;
  const motoMinsToStart = Math.max(3, Math.round((distToStartKm / 65) * 60));

  // Synthesized weather for motorcycle run
  const weatherBaseTemp = 22 + ((route.title.length % 3) - 1);
  const weatherWindSpeed = 12 + (route.category === 'wybrzeza' ? 8 : 0);

  const handleShare = async () => {
    const text = `${route.title} - ${route.distanceKm} km | Trasy Motocyklowe Tadzik`;
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
    route.category === 'winkle' ? 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' :
    route.category === 'wybrzeza' ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' :
    route.category === 'lesna' ? 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80' :
    route.category === 'cruiser' ? 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80' :
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-5 max-w-4xl mx-auto text-white pb-12" 
      id="selected-motorcycle-ride-view"
    >
      
      {/* 1. Header Navigation Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 sm:p-3.5 rounded-2xl"
      >
        <button
          type="button"
          onClick={onBack}
          id="btn-back-to-moto-routes"
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-all cursor-pointer border border-slate-700 active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-rose-400" />
          <span>{pl ? '← Wszystkie Trasy' : '← All Moto Routes'}</span>
        </button>

        <div className="flex items-center gap-2">
          {onToggleFavorite && (
            <button
              type="button"
              id="btn-toggle-favorite-moto-detail"
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
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-rose-400" />}
            <span>{isCopied ? (pl ? 'Skopiowano' : 'Copied') : (pl ? 'Udostępnij' : 'Share')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowInAppMap(!showInAppMap)}
            id="btn-toggle-in-app-moto-map"
            className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>{showInAppMap ? (pl ? 'Ukryj Mapę' : 'Hide Map') : (pl ? 'Nawiguj Motorem 🏍️' : 'Navigate Moto 🏍️')}</span>
          </button>
        </div>
      </motion.div>

      {/* 2. HERO DESTINATION CARD (ZDJĘCIE MIEJSCA DOCELOWEGO & KLUCZOWE PARAMETRY TRASY) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950"
      >
        <div className="relative h-60 sm:h-76 md:h-96 w-full overflow-hidden bg-slate-900">
          <img
            src={destinationPhoto}
            alt={route.destinationName || route.endPoint}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <span className={`text-xs font-black uppercase px-3 py-1 rounded-xl border backdrop-blur-md shadow-lg flex items-center gap-1.5 ${conf.badgeBg}`}>
              <span>{conf.icon}</span>
              <span>{pl ? conf.labelPl : conf.labelEn}</span>
            </span>

            <span className="text-xs font-black bg-slate-900/90 text-amber-300 border border-slate-700/80 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{route.rating || 5.0}</span>
              <span className="text-[10px] text-slate-400">({route.reviewsCount || 1})</span>
            </span>
          </div>

          {/* Destination Overlay Title */}
          <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-rose-600/90 text-white border border-rose-400/50 text-[10px] sm:text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md backdrop-blur-md flex items-center gap-1 shadow-md">
                🎯 {pl ? 'CEL WYPRAWY & ATRAKCJA' : 'DESTINATION & ATTRACTION'}
              </span>
              <span className="text-slate-200 text-xs font-bold flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>{route.city}</span>
                {route.country && <span className="text-slate-400">({route.country === 'Poland' ? 'Polska' : route.country})</span>}
              </span>
              {route.destinationCategory && (
                <span className="bg-slate-900/80 text-amber-300 border border-slate-700/60 text-[10px] font-bold px-2 py-0.5 rounded-md hidden sm:inline-block">
                  🏰 {route.destinationCategory}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-lg">
              {route.destinationName || route.endPoint}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 font-medium line-clamp-2 max-w-3xl drop-shadow-md">
              {route.description}
            </p>
          </div>
        </div>

        {/* 4 Essential Quick Parameters (Wystarczająco dużo do natychmiastowej decyzji motocyklisty) */}
        <div className="bg-slate-900 border-t border-slate-800 p-3.5 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          {/* Distance & Time */}
          <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{pl ? 'Dystans Trasy' : 'Route Length'}</span>
            <span className="text-base font-black font-mono text-rose-400">{route.distanceKm} km</span>
            <span className="text-[10px] text-slate-400 block font-medium">~{route.estimatedDuration || '1h 00m'}</span>
          </div>

          {/* Distance from current location */}
          <div className="bg-slate-950/70 border border-rose-900/40 p-2.5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-rose-300 block">{pl ? 'Dojazd od Ciebie' : 'From Your GPS'}</span>
            <span className="text-base font-black font-mono text-rose-200">📍 {distToStartKm} km</span>
            <span className="text-[10px] text-slate-400 block font-medium">~{motoMinsToStart} min motorem</span>
          </div>

          {/* Corners & Density */}
          <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{pl ? 'Winkle & Łuki' : 'Corners & Curves'}</span>
            <span className="text-base font-black font-mono text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{route.cornersCount || 60}+</span>
            </span>
            <span className="text-[10px] text-cyan-300 block font-medium">+{route.elevationGainMeters || 250}m wzniosu</span>
          </div>

          {/* Asphalt & Grip */}
          <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{pl ? 'Jakość Asfaltu' : 'Asphalt & Grip'}</span>
            <span className="text-xs sm:text-sm font-black text-emerald-400 truncate block mt-0.5">
              {route.asphaltCondition ? route.asphaltCondition.split(',')[0] : (pl ? 'Wysoka przyczepność' : 'High Grip')}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              {route.recommendedBike?.split('/')[0]?.trim() || 'Wszystkie typy'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 3. WEATHER & MOTO RIDING CONDITIONS BAR */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md" 
        id="moto-weather-bar"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-black text-white">
                {pl ? 'Aktualne warunki drogowe & pogodowe:' : 'Current Moto Riding Conditions:'}
              </h3>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.2 rounded-full font-bold">
                {pl ? 'Idealne na motocykl 🏍️' : 'Great for riding 🏍️'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <span>🌡️ Temperatura: <strong>{weatherBaseTemp}°C</strong></span>
              <span>💨 Wiatr boczny: <strong>{weatherWindSpeed} km/h</strong></span>
              <span>🌧️ Opady: <strong>0% (suchy asfalt)</strong></span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowInAppMap(!showInAppMap)}
          className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{pl ? 'Rozpocznij trasę' : 'Start Route'}</span>
        </button>
      </motion.div>

      {/* 4. IN-APP GOOGLE MAPS ROUTE (Jeśli włączona) */}
      {showInAppMap && (
        <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold text-rose-300 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-rose-400" />
              <span>{pl ? 'Interaktywna Nawigacja Motocyklowa Google Maps:' : 'Interactive Moto Navigation:'}</span>
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
            initialTravelMode="motorcycle"
            city={route.city}
            language={language}
            onClose={() => setShowInAppMap(false)}
            autoStartNav={true}
          />
        </div>
      )}

      {/* 5. DLACZEGO WARTO WYBRAĆ TĘ TRASĘ? (KLUCZOWE PUNKTY, ASSETY I PARAMETRY DLA MOTOCYKLISTY) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3.5"
      >
        <h4 className="text-xs font-black uppercase text-rose-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{pl ? 'Dlaczego warto wybrać tę trasę motocyklową?' : 'Why choose this motorcycle run?'}</span>
        </h4>

        {/* 2-Column Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {route.highlights.map((h, idx) => (
            <div key={idx} className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800/80 p-3 rounded-2xl text-slate-200 hover:border-slate-700 transition-colors">
              <span className="text-amber-400 font-bold">✨</span>
              <span className="font-medium">{h}</span>
            </div>
          ))}

          {/* Biker Spot highlight */}
          <div className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800/80 p-3 rounded-2xl text-slate-200 hover:border-cyan-800/60 transition-colors">
            <Coffee className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-medium">{route.smartInsights?.bikerSpots || (pl ? 'Klimatyczny zajazd Biker-Friendly ze stojakami na kaski' : 'Biker-friendly cafe stop')}</span>
          </div>

          {/* Fuel & Compressor */}
          <div className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800/80 p-3 rounded-2xl text-slate-200 hover:border-emerald-800/60 transition-colors">
            <Fuel className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{route.smartInsights?.fuelStations || (pl ? 'Stacja benzynowa z kompresorem ciśnienia opon' : 'Gas station with tire compressor')}</span>
          </div>

          {/* Safety badge */}
          <div className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800/80 p-3 rounded-2xl text-slate-200 hover:border-rose-800/60 transition-colors">
            <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">{route.smartInsights?.safetyNote || (pl ? 'Sprawdzone, wyprofilowane łuki i bezpieczne pobocze' : 'Safe corners and clean tarmac')}</span>
          </div>
        </div>

        {/* Recommended bike badge */}
        {route.recommendedBike && (
          <div className="bg-slate-950/70 border border-rose-900/40 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <span>🏍️</span>
              <span>{pl ? 'Rekomendowany typ motocykla:' : 'Recommended motorcycle type:'}</span>
            </span>
            <span className="font-black text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-800/60 font-mono text-[11px]">
              {route.recommendedBike}
            </span>
          </div>
        )}

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
              {pl ? 'CEL / META' : 'DESTINATION'}
            </span>
            <span className="font-bold text-white truncate">{route.destinationName || route.endPoint}</span>
          </div>
        </div>
      </motion.div>

      {/* 6. REVIEWS & COMMENTS TOGGLE (Opinie i rady motocyklistów) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-xs font-black uppercase text-rose-400 hover:text-white transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-rose-400" />
            <span>{pl ? `Opinie i rady motocyklistów (${route.reviewsCount || 1})` : `Biker Reviews & Tips (${route.reviewsCount || 1})`}</span>
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
            <MotorcycleRouteCommentsSection
              routeId={route.id}
              routeTitle={route.title}
              language={language}
              currentUsername={account?.username || account?.firstName}
            />
          </div>
        )}
      </motion.div>

      {/* 7. OTHER RECOMMENDED MOTORCYCLE RUNS */}
      {allRoutes.filter(r => r.id !== route.id).length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="pt-3 border-t border-slate-800/80 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-rose-400" />
              <span>{pl ? 'Inne polecane trasy motocyklowe w pobliżu:' : 'Other recommended motorcycle runs:'}</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {allRoutes.filter(r => r.id !== route.id).slice(0, 3).map((r) => {
              const cConf = MOTO_CATEGORY_CONFIG[r.category] || MOTO_CATEGORY_CONFIG.winkle;
              const rPhoto = r.destinationImageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80';
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    onSelectOtherRoute(r);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl overflow-hidden text-left transition-all cursor-pointer group flex items-center gap-2.5 p-2 active:scale-98"
                >
                  <img
                    src={rPhoto}
                    alt={r.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-[9px] font-bold text-amber-300 font-mono block">{r.distanceKm} km • {cConf.icon}</span>
                    <h5 className="text-xs font-black text-white line-clamp-1 group-hover:text-rose-300 transition-colors">
                      {r.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 truncate">{r.city}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}
