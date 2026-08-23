/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MotorcycleRoute, MotorcycleCategory, Language } from '../../types';
import { X, Plus, MapPin, Flag, Sparkles, Navigation, Fuel, Coffee, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AddMotorcycleRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteAdded: (newRoute: MotorcycleRoute) => void;
  language: Language;
  defaultAuthor?: string;
}

export const MOTO_CATEGORY_CONFIG: Record<MotorcycleCategory, {
  labelPl: string;
  labelEn: string;
  icon: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeBg: string;
}> = {
  winkle: {
    labelPl: 'Kręte Winkle & Przełęcze',
    labelEn: 'Twisty Passes & Bends',
    icon: '🏍️',
    bgClass: 'bg-rose-950/80',
    borderClass: 'border-rose-700/60',
    textClass: 'text-rose-300',
    badgeBg: 'bg-rose-600'
  },
  wybrzeza: {
    labelPl: 'Malownicze Wybrzeża & Rzeki',
    labelEn: 'Coastal & River Runs',
    icon: '🌊',
    bgClass: 'bg-cyan-950/80',
    borderClass: 'border-cyan-700/60',
    textClass: 'text-cyan-300',
    badgeBg: 'bg-cyan-600'
  },
  lesna: {
    labelPl: 'Leśne Przeloty & Bezdroża',
    labelEn: 'Forest Cruising & Lakes',
    icon: '🌲',
    bgClass: 'bg-emerald-950/80',
    borderClass: 'border-emerald-700/60',
    textClass: 'text-emerald-300',
    badgeBg: 'bg-emerald-600'
  },
  cruiser: {
    labelPl: 'Turystyka & Cruiser / Chopper',
    labelEn: 'Cruiser & Chill Touring',
    icon: '🦅',
    bgClass: 'bg-amber-950/80',
    borderClass: 'border-amber-700/60',
    textClass: 'text-amber-300',
    badgeBg: 'bg-amber-600'
  },
  adv_long: {
    labelPl: 'Wyprawy ADV & Długodystansowe (100+ km)',
    labelEn: 'Adventure & Long-Distance',
    icon: '🗺️',
    bgClass: 'bg-indigo-950/80',
    borderClass: 'border-indigo-700/60',
    textClass: 'text-indigo-300',
    badgeBg: 'bg-indigo-600'
  }
};

export default function AddMotorcycleRouteModal({
  isOpen,
  onClose,
  onRouteAdded,
  language,
  defaultAuthor
}: AddMotorcycleRouteModalProps) {
  const pl = language === 'pl';

  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Poland');
  const [category, setCategory] = useState<MotorcycleCategory>('winkle');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [distanceKm, setDistanceKm] = useState<number>(65);
  const [estimatedDuration, setEstimatedDuration] = useState('1h 15m');
  const [difficulty, setDifficulty] = useState<'easy' | 'moderate' | 'medium' | 'challenging'>('moderate');
  const [description, setDescription] = useState('');
  const [asphaltCondition, setAsphaltCondition] = useState(pl ? 'Gładki, równy asfalt o wysokiej przyczepności' : 'Smooth asphalt with high grip');
  const [recommendedBike, setRecommendedBike] = useState('Naked / Sport / Adventure / Cruiser');
  const [cornersCount, setCornersCount] = useState<number>(85);
  const [fuelStations, setFuelStations] = useState('');
  const [bikerSpots, setBikerSpots] = useState('');
  const [scenicViewpoints, setScenicViewpoints] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [destinationImageUrl, setDestinationImageUrl] = useState('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80');
  const [destinationName, setDestinationName] = useState('');
  const [authorName, setAuthorName] = useState(defaultAuthor || (pl ? 'Pasjonat Motocykli' : 'Biker Enthusiast'));
  const [isLocating, setIsLocating] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);

  const PHOTO_PRESETS = [
    { label: pl ? 'Góry & Serpentyny' : 'Mountains & Hairpins', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' },
    { label: pl ? 'Wybrzeże & Morze' : 'Coast & Sea', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
    { label: pl ? 'Leśny Przelot' : 'Forest Cruising', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80' },
    { label: pl ? 'Malownicze Jeziora' : 'Scenic Lakes', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
    { label: pl ? 'Zachód Słońca & Cruiser' : 'Sunset Highway', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80' }
  ];

  if (!isOpen) return null;

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(pl ? 'Twoja przeglądarka nie obsługuje geolokalizacji.' : 'Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setGpsSuccess(true);
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        setStartPoint(`${pl ? '📍 Moja aktualna pozycja GPS' : '📍 Current GPS location'} (${lat}, ${lng})`);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        setStartPoint(pl ? '📍 Moja aktualna lokalizacja' : '📍 My current spot');
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !startPoint.trim() || !endPoint.trim()) {
      alert(pl ? 'Proszę podać nazwę trasy, punkt startowy oraz punkt docelowy!' : 'Please fill in route title, start and destination!');
      return;
    }

    const customHighlights = highlightsInput.trim()
      ? highlightsInput.split('\n').map(h => h.trim()).filter(Boolean)
      : [
          pl ? `Panoramiczne winkle na odcinku ${startPoint} -> ${endPoint}` : `Scenic bends from ${startPoint} to ${endPoint}`,
          pl ? 'Postój w klimatycznym zajeździe Biker-Friendly' : 'Rest stop at Biker-Friendly cafe',
          pl ? 'Gładki, bezpieczny asfalt o wysokiej przyczepności' : 'High-grip smooth asphalt road'
        ];

    const newRoute: MotorcycleRoute = {
      id: 'custom-moto-' + Date.now(),
      title: title.trim(),
      city: city.trim() || (pl ? 'Własna trasa' : 'Custom Route'),
      country: country,
      category: category,
      distanceKm: Number(distanceKm) || 45,
      estimatedDuration: estimatedDuration.trim() || '1h 00m',
      difficulty: difficulty,
      startPoint: startPoint.trim(),
      endPoint: endPoint.trim(),
      destinationName: destinationName.trim() || endPoint.trim() || title.trim(),
      destinationImageUrl: destinationImageUrl.trim() || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      description: description.trim() || (pl ? 'Wspaniała trasa motocyklowa dodana przez użytkownika.' : 'Scenic motorcycle route shared by community biker.'),
      highlights: customHighlights,
      asphaltCondition: asphaltCondition.trim() || (pl ? 'Gładki asfalt' : 'Smooth asphalt'),
      recommendedBike: recommendedBike.trim() || 'Wszystkie typy (All bikes)',
      cornersCount: Number(cornersCount) || 50,
      authorName: authorName.trim() || (pl ? 'Motocyklista' : 'Rider'),
      isCommunity: true,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewsCount: 1,
      smartInsights: {
        cornersDensity: pl ? `${cornersCount} wyprofilowanych zakrętów` : `${cornersCount} scenic bends`,
        asphaltQuality: asphaltCondition.trim() || (pl ? 'Wysoka przyczepność' : 'High grip'),
        fuelStations: fuelStations.trim() || (pl ? 'Stacje paliw z kompresorem na trasie' : 'Gas stations with tire pump on route'),
        bikerSpots: bikerSpots.trim() || (pl ? 'Kawiarnie i zajazdy przyjazne motocyklistom' : 'Biker-friendly cafes'),
        scenicViewpoints: scenicViewpoints.trim() || (pl ? 'Punkty widokowe z miejscami parkingowymi' : 'Scenic viewpoints with parking'),
        recommendedBike: recommendedBike.trim() || 'Sport / Naked / ADV / Cruiser',
        safetyNote: pl ? 'Trasa sprawdzona przez społeczność, bezpieczne pobocza' : 'Community tested, safe shoulders',
        recommendedFor: pl ? 'Wszyscy pasjonaci dwóch kółek' : 'All motorcycle riders'
      }
    };

    // Save to localStorage
    try {
      const stored = localStorage.getItem('tadzik_custom_motorcycle_routes');
      const existing = stored ? JSON.parse(stored) : [];
      const updated = [newRoute, ...existing];
      localStorage.setItem('tadzik_custom_motorcycle_routes', JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving motorcycle route:', err);
    }

    onRouteAdded(newRoute);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-700 text-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden my-auto max-h-[92vh] flex flex-col"
        id="add-motorcycle-route-modal"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-rose-950/90 to-slate-950 p-5 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 rounded-2xl text-white shadow-lg shadow-rose-600/30">
              <span className="text-xl">🏍️</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">
                {pl ? 'Dodaj Swoją Trasę Motocyklową' : 'Add Your Motorcycle Route'}
              </h3>
              <p className="text-xs text-rose-300 font-semibold">
                {pl ? 'Podziel się ulubionymi winklami i szlakami ze społecznością motocyklistów!' : 'Share your favorite twisties and scenic runs with fellow bikers!'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* 1. Category selector (5 specific motorcycle categories) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase text-rose-400 tracking-wider">
              1. {pl ? 'Wybierz Rodzaj Trasy na Motor:' : 'Select Route Category:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {(Object.keys(MOTO_CATEGORY_CONFIG) as MotorcycleCategory[]).map((catKey) => {
                const conf = MOTO_CATEGORY_CONFIG[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400/40 font-black'
                        : 'bg-slate-800/90 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{conf.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight line-clamp-1">
                        {pl ? conf.labelPl : conf.labelEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Route Title & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-[11px] font-bold text-slate-300">
                {pl ? 'Nazwa trasy:' : 'Route Title:'} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={pl ? 'np. Serpentyny Przełęczy Salmopolskiej, Winkle Eifel...' : 'e.g. Mountain Pass Twisty Run...'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-rose-500 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-300">
                {pl ? 'Miasto / Rejon:' : 'City / Region:'}
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="np. Wisła, Szczyrk, Nürburg..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-rose-500 font-bold"
              />
            </div>
          </div>

          {/* 3. Start Point (Skąd wyruszyłeś) with GPS Auto-locate */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black uppercase text-emerald-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{pl ? 'Skąd wyruszyłeś? (Punkt Startowy):' : 'Starting Location:'} *</span>
              </label>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? (pl ? 'Pobieram GPS...' : 'Locating...') : (pl ? '📍 Moja pozycja GPS' : '📍 Current GPS')}</span>
              </button>
            </div>

            <input
              type="text"
              required
              value={startPoint}
              onChange={(e) => {
                setStartPoint(e.target.value);
                setGpsSuccess(false);
              }}
              placeholder={pl ? 'Wpisz miasto, ulicę, stację benzynową lub kliknij GPS powyżej...' : 'Type address, gas station or click GPS...'}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold placeholder:text-slate-500 outline-none focus:border-emerald-500"
            />
            {gpsSuccess && (
              <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{pl ? 'Pomyślnie ustalono Twoją współrzędną startową!' : 'GPS Start coordinate detected!'}</span>
              </p>
            )}
          </div>

          {/* 4. End Point (Dokąd dojeżdżasz) */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-rose-400 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5" />
                <span>{pl ? 'Dokąd dojeżdżasz? (Punkt Docelowy / Pętla):' : 'Destination / Endpoint:'} *</span>
              </label>
              <input
                type="text"
                required
                value={endPoint}
                onChange={(e) => {
                  setEndPoint(e.target.value);
                  if (!destinationName) setDestinationName(e.target.value);
                }}
                placeholder={pl ? 'np. Szczyt Przełęczy, Baza Motocyklowa, Zamek, Pętla...' : 'e.g. Mountain Pass Summit, Castle, Loop...'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold placeholder:text-slate-500 outline-none focus:border-rose-500"
              />
            </div>

            {/* Destination Photo & Presets */}
            <div className="space-y-2 pt-1 border-t border-slate-800/80">
              <label className="block text-[11px] font-bold text-amber-300">
                📸 {pl ? 'Zdjęcie miejsca docelowego / krajobrazu trasy:' : 'Destination Photo / Scenic View:'}
              </label>
              
              {/* Photo Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {PHOTO_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDestinationImageUrl(preset.url)}
                    className={`relative rounded-xl overflow-hidden border h-16 cursor-pointer text-left transition-all group ${
                      destinationImageUrl === preset.url
                        ? 'border-rose-500 ring-2 ring-rose-500/50 scale-102'
                        : 'border-slate-700 opacity-70 hover:opacity-100 hover:border-slate-500'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-1.5">
                      <span className="text-[9px] font-black text-white leading-tight line-clamp-1">
                        {preset.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Image URL */}
              <input
                type="url"
                value={destinationImageUrl}
                onChange={(e) => setDestinationImageUrl(e.target.value)}
                placeholder={pl ? 'Lub wklej własny URL zdjęcia (https://...)' : 'Or paste custom image URL (https://...)'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-[11px] text-slate-300 font-mono placeholder:text-slate-500 outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* 5. Motorcycle metrics: Distance, Duration, Corners count, Difficulty */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-300">
                {pl ? 'Dystans (km):' : 'Distance (km):'}
              </label>
              <input
                type="number"
                min={1}
                max={999}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-black font-mono outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-300">
                {pl ? 'Czas jazdy:' : 'Ride Time:'}
              </label>
              <input
                type="text"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="np. 1h 20m"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-bold outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-300">
                {pl ? 'Liczba winkli:' : 'Corners Count:'}
              </label>
              <input
                type="number"
                min={0}
                max={900}
                value={cornersCount}
                onChange={(e) => setCornersCount(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-rose-300 font-black font-mono outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-300">
                {pl ? 'Trudność:' : 'Difficulty:'}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white font-bold outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="easy">{pl ? 'Łatwa (Cruiser)' : 'Easy'}</option>
                <option value="moderate">{pl ? 'Umiarkowana' : 'Moderate'}</option>
                <option value="medium">{pl ? 'Średnia (Winkle)' : 'Medium'}</option>
                <option value="challenging">{pl ? 'Wymagająca (Agrafki)' : 'Challenging'}</option>
              </select>
            </div>
          </div>

          {/* 6. Bike Type & Asphalt Grip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-300">
                {pl ? 'Zalecany typ motocykla:' : 'Recommended Bike:'}
              </label>
              <input
                type="text"
                value={recommendedBike}
                onChange={(e) => setRecommendedBike(e.target.value)}
                placeholder="np. Naked / Sport / Adventure / Chopper..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-300">
                {pl ? 'Jakość asfaltu & przyczepność:' : 'Asphalt Condition:'}
              </label>
              <input
                type="text"
                value={asphaltCondition}
                onChange={(e) => setAsphaltCondition(e.target.value)}
                placeholder="np. Gładki, wysoka przyczepność, brak piasku..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* 7. Fuel & Biker friendly spots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-amber-300 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5" />
                <span>{pl ? 'Stacje paliw & kompresor opon:' : 'Gas stations & tire pump:'}</span>
              </label>
              <input
                type="text"
                value={fuelStations}
                onChange={(e) => setFuelStations(e.target.value)}
                placeholder={pl ? 'np. Orlen na starcie, stacja 24h z kompresorem...' : 'e.g. 24h gas station with tire pressure...'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5" />
                <span>{pl ? 'Zajazdy Biker-Friendly & Kawiarnie:' : 'Biker-Friendly Cafes:'}</span>
              </label>
              <input
                type="text"
                value={bikerSpots}
                onChange={(e) => setBikerSpots(e.target.value)}
                placeholder={pl ? 'np. Karczma z parkingiem moto, taras z widokiem...' : 'e.g. Biker pub with helmet racks...'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* 8. Description */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-300">
              {pl ? 'Opis wrażeń z trasy, zakrętów i krajobrazów:' : 'Route description & scenery:'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={pl ? 'Opisz jak prowadzą się winkle, gdzie warto zwolnić, jaki jest stan nawierzchni po deszczu...' : 'Describe twists, viewpoints, road condition...'}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white font-medium outline-none focus:border-rose-500"
            />
          </div>

          {/* 9. Highlights (line by line) */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-300">
              {pl ? 'Ciekawe punkty na trasie (każdy w nowej linii):' : 'Key Highlights (one per line):'}
            </label>
            <textarea
              rows={2}
              value={highlightsInput}
              onChange={(e) => setHighlightsInput(e.target.value)}
              placeholder={pl ? 'Punkt widokowy na jezioro\nKultowa serpentyna\nŚwietna smażalnia ryb' : 'Scenic mountain pass\nFamous hairpin bend\nCafe stop'}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white font-medium outline-none focus:border-rose-500"
            />
          </div>

          {/* Author Name */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-400">
              {pl ? 'Twój podpis / Nick motocyklisty:' : 'Author name / Biker handle:'}
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-300 font-bold outline-none focus:border-rose-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              {pl ? 'Anuluj' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-1.5 hover:scale-102 active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>{pl ? 'Zapisz i Opublikuj Trasę 🏍️' : 'Save & Publish Route 🏍️'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
