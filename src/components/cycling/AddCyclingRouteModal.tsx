import React, { useState } from 'react';
import { CyclingRoute, CyclingCategory, Language } from '../../types';
import { 
  X, Plus, MapPin, Flag, Compass, Bike, TreePine, Wheat, 
  Mountain, Map, ShieldCheck, Sparkles, Check, Clock, Droplets, BatteryCharging, Armchair
} from 'lucide-react';

interface AddCyclingRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteAdded: (newRoute: CyclingRoute) => void;
  language: Language;
  defaultAuthor?: string;
}

export const CATEGORY_CONFIG: Record<CyclingCategory, {
  labelPl: string;
  labelEn: string;
  icon: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  descPl: string;
  descEn: string;
}> = {
  lesna: {
    labelPl: 'Leśna',
    labelEn: 'Forest Trail',
    icon: '🌲',
    bgClass: 'bg-emerald-950/60 hover:bg-emerald-900/60',
    borderClass: 'border-emerald-500/40 hover:border-emerald-400',
    textClass: 'text-emerald-300',
    descPl: 'Cieniste dukty leśne, puszcze, zapach żywicy i śpiew ptaków',
    descEn: 'Shaded forest trails, pine scent and birdsong'
  },
  polna: {
    labelPl: 'Polna',
    labelEn: 'Countryside & Fields',
    icon: '🌾',
    bgClass: 'bg-amber-950/60 hover:bg-amber-900/60',
    borderClass: 'border-amber-500/40 hover:border-amber-400',
    textClass: 'text-amber-300',
    descPl: 'Sielskie drogi polne, szutry wśród pól uprawnych, łąk i wiatraków',
    descEn: 'Rustic field roads, meadows, windmills & open vistas'
  },
  terenowa: {
    labelPl: 'Terenowa',
    labelEn: 'Off-Road / Gravel / MTB',
    icon: '🚵‍♂️',
    bgClass: 'bg-orange-950/60 hover:bg-orange-900/60',
    borderClass: 'border-orange-500/40 hover:border-orange-400',
    textClass: 'text-orange-300',
    descPl: 'Gravel, MTB, kamieniste szlaki, pagórki i przygoda na bezdrożach',
    descEn: 'Gravel, MTB, rocky tracks, hills and wild adventure'
  },
  turystyczna: {
    labelPl: 'Turystyczna',
    labelEn: 'Touring & Scenic',
    icon: '🏖️',
    bgClass: 'bg-indigo-950/60 hover:bg-indigo-900/60',
    borderClass: 'border-indigo-500/40 hover:border-indigo-400',
    textClass: 'text-indigo-300',
    descPl: 'Płaska, w 100% bezpieczna, gładki asfalt, zabytki, kawiarnie i mola',
    descEn: 'Flat, scenic, paved, elder-friendly with cafe stops'
  },
  dlugodystansowa: {
    labelPl: 'Długodystansowa',
    labelEn: 'Long-Distance Bikepacking',
    icon: '🗺️',
    bgClass: 'bg-cyan-950/60 hover:bg-cyan-900/60',
    borderClass: 'border-cyan-500/40 hover:border-cyan-400',
    textClass: 'text-cyan-300',
    descPl: 'Wyprawy całodniowe (40-100+ km), EuroVelo, pętle transgraniczne',
    descEn: 'Day-long bikepacking trips (40-100+ km) and EuroVelo corridors'
  }
};

export default function AddCyclingRouteModal({
  isOpen,
  onClose,
  onRouteAdded,
  language,
  defaultAuthor
}: AddCyclingRouteModalProps) {
  const pl = language === 'pl';

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CyclingCategory>('lesna');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Poland');
  const [distanceKm, setDistanceKm] = useState<number>(20);
  const [estimatedDuration, setEstimatedDuration] = useState('1h 30m');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'moderate' | 'hard'>('easy');
  const [surface, setSurface] = useState(pl ? '80% gładki asfalt, 20% ubity szuter' : '80% smooth asphalt, 20% gravel');
  const [recommendedBike, setRecommendedBike] = useState('Trekking / Gravel / E-bike');
  const [description, setDescription] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [highlights, setHighlights] = useState<string[]>([
    pl ? 'Punkt widokowy na jezioro' : 'Scenic lake viewpoint',
    pl ? 'Kawiarnia z pyszną szarlotką' : 'Local artisanal bakery cafe'
  ]);
  const [shadePercent, setShadePercent] = useState<number>(75);
  const [restBenches, setRestBenches] = useState(pl ? 'Wiaty i ławki co 2 km' : 'Rest benches every 2 km');
  const [waterPoints, setWaterPoints] = useState(pl ? 'Darmowe źródełko z wodą i kawiarnia' : 'Free drinking water tap and cafe');
  const [eBikeCharging, setEBikeCharging] = useState(true);
  const [authorName, setAuthorName] = useState(defaultAuthor || (pl ? 'Rowerowy Podróżnik' : 'Cycling Enthusiast'));
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGetGpsStart = () => {
    if (!navigator.geolocation) {
      setErrorMsg(pl ? 'Geolokalizacja nie jest wspierana w Twojej przeglądarce.' : 'Geolocation not supported in browser.');
      return;
    }
    setIsGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGettingGps(false);
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        setStartPoint(pl ? `Moja lokalizacja GPS (${lat}, ${lng})` : `My GPS Location (${lat}, ${lng})`);
      },
      (err) => {
        setIsGettingGps(false);
        setStartPoint(pl ? 'Moja aktualna pozycja (GPS)' : 'Current GPS Position');
      },
      { timeout: 8000 }
    );
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim() && highlights.length < 6) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg(pl ? 'Proszę podać tytuł lub nazwę trasy.' : 'Please provide a route title.');
      return;
    }
    if (!startPoint.trim()) {
      setErrorMsg(pl ? 'Proszę podać miejsce startu (skąd wyruszyłeś).' : 'Please provide a starting point.');
      return;
    }
    if (!endPoint.trim()) {
      setErrorMsg(pl ? 'Proszę podać punkt docelowy / metę.' : 'Please provide a destination.');
      return;
    }

    const newRoute: CyclingRoute = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      city: city.trim() || (pl ? 'Wielkopolska / Polska' : 'Custom Region'),
      country: country,
      category: category,
      distanceKm: Number(distanceKm) || 15,
      estimatedDuration: estimatedDuration || '1h 30m',
      difficulty: difficulty,
      startPoint: startPoint.trim(),
      endPoint: endPoint.trim(),
      description: description.trim() || (pl ? 'Wspaniała trasa rowerowa dodana przez członka społeczności Tadzika.' : 'Scenic cycle route added by a community explorer.'),
      highlights: highlights.length > 0 ? highlights : [pl ? 'Piękne widoki krajobrazowe' : 'Scenic viewpoints'],
      surface: surface,
      recommendedBike: recommendedBike,
      authorName: authorName.trim() || (pl ? 'Społeczność Tadzika' : 'Community Explorer'),
      isCommunity: true,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewsCount: 1,
      smartInsights: {
        shadePercent: Number(shadePercent),
        restBenches: restBenches,
        waterPoints: waterPoints,
        eBikeCharging: eBikeCharging,
        safetyLevel: pl ? 'Sprawdzona przez społeczność rowerzystów' : 'Community tested route',
        crowdLevel: 'low',
        elevationMeters: 45,
        recommendedFor: pl ? 'Wszyscy rowerzyści i miłośnicy dwóch kółek' : 'All cycling enthusiasts'
      }
    };

    // Save to localStorage
    try {
      const STORAGE_KEY = 'tadzik_custom_cycling_routes';
      const existing = localStorage.getItem(STORAGE_KEY);
      const list: CyclingRoute[] = existing ? JSON.parse(existing) : [];
      list.unshift(newRoute);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Failed to save custom cycling route:', err);
    }

    onRouteAdded(newRoute);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/30 border border-indigo-500/40 rounded-2xl text-indigo-300">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{pl ? 'Dodaj Swoją Trasę Rowerową' : 'Add Your Custom Cycling Route'}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                  {pl ? 'Dla Każdego' : 'Community'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {pl ? 'Podziel się szlakiem, wpisz skąd wyruszyłeś, dodaj mądre wskazówki dla innych rowerzystów!' : 'Share your favorite trail, starting spot and smart tips with other cyclists!'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-2xl text-rose-200 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-indigo-300">
              {pl ? '1. Tytuł / Nazwa Twojej Trasy:' : '1. Route Name / Title:'} <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={pl ? 'np. Wyprawa Leśna Wokół Jeziora Kierskiego i Puszczy' : 'e.g. Forest Loop around Lake & Countryside'}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white font-bold placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* 2. Route Category Choice */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-amber-300">
              {pl ? '2. Wybierz Rodzaj Trasy:' : '2. Choose Route Category:'} <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(CATEGORY_CONFIG) as CyclingCategory[]).map((catKey) => {
                const conf = CATEGORY_CONFIG[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-400 shadow-md ring-1 ring-indigo-400'
                        : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{conf.icon}</span>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {pl ? conf.labelPl : conf.labelEn}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {pl ? conf.descPl : conf.descEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Start Point ("Skąd wyruszyłeś") & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{pl ? 'Skąd wyruszyłeś? (Start):' : 'Starting Location:'}</span> <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGetGpsStart}
                  disabled={isGettingGps}
                  className="text-[10px] text-indigo-300 hover:text-white font-bold underline flex items-center gap-1 cursor-pointer"
                >
                  <Compass className={`w-3 h-3 ${isGettingGps ? 'animate-spin' : ''}`} />
                  <span>{isGettingGps ? (pl ? 'Pobieram...' : 'GPS...') : (pl ? '📍 Moja pozycja GPS' : '📍 My GPS')}</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                placeholder={pl ? 'np. Dworzec Główny, Parking Leśny, Dom...' : 'e.g. Central Station, Forest Car Park...'}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white font-bold placeholder:text-slate-500 outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5" />
                <span>{pl ? 'Dokąd / Meta (lub Pętla):' : 'Destination / Endpoint:'}</span> <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
                placeholder={pl ? 'np. Wieża Widokowa, Plaża, Pętla powrotna...' : 'e.g. Viewpoint Tower, Beach, Loop...'}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white font-bold placeholder:text-slate-500 outline-none focus:border-rose-500 transition-all"
              />
            </div>
          </div>

          {/* 4. City/Region & Country & Distance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-slate-400">
                {pl ? 'Miasto lub Rejon:' : 'City or Region:'}
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={pl ? 'np. Poznań, Gdańsk, Rotterdam...' : 'e.g. Amsterdam, Poznań...'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-slate-400">
                {pl ? 'Dystans (km):' : 'Distance (km):'}
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-slate-400">
                {pl ? 'Szacowany Czas:' : 'Est. Duration:'}
              </label>
              <input
                type="text"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="np. 1h 45m"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* 5. Smart Insights Section (Mądre Wskazówki) */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{pl ? 'Mądre Wiadomości i Profil Trasy (dla innych rowerzystów):' : 'Smart Insights & Trail Profile:'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <span>🛤️</span>
                  <span>{pl ? 'Nawierzchnia:' : 'Surface Type:'}</span>
                </label>
                <input
                  type="text"
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  placeholder={pl ? 'np. 90% gładki asfalt, 10% ubity szuter' : 'e.g. 90% smooth asphalt, 10% gravel'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <span>🚲</span>
                  <span>{pl ? 'Zalecany Rower:' : 'Recommended Bike:'}</span>
                </label>
                <input
                  type="text"
                  value={recommendedBike}
                  onChange={(e) => setRecommendedBike(e.target.value)}
                  placeholder="np. Trekking / Gravel / Miejski / MTB"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <span>🌲</span>
                  <span>{pl ? `Stopień Zacienienia: ${shadePercent}% (w cieniu)` : `Shade: ${shadePercent}%`}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={shadePercent}
                  onChange={(e) => setShadePercent(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <span>🚰</span>
                  <span>{pl ? 'Woda pitna & Kawiarnie:' : 'Water points & cafes:'}</span>
                </label>
                <input
                  type="text"
                  value={waterPoints}
                  onChange={(e) => setWaterPoints(e.target.value)}
                  placeholder={pl ? 'np. Źródełko w lesie, 2 kawiarnie' : 'e.g. Free water tap, 2 cafes'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 font-bold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={eBikeCharging}
                  onChange={(e) => setEBikeCharging(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <BatteryCharging className="w-4 h-4 text-emerald-400" />
                  <span>{pl ? 'Przyjazna dla rowerów elektrycznych (E-bike friendly / punkty ładowania)' : 'E-bike friendly (charging stops)'}</span>
                </span>
              </label>
            </div>
          </div>

          {/* 6. Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
              {pl ? 'Opis Szlaku & Twoje Wrażenia:' : 'Route Description & Impressions:'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={pl ? 'Napisz kilka zdań jak wygląda trasa, czy są ładne widoki, czy nawierzchnia jest bezpieczna dla każdego...' : 'Describe why you love this route, road safety, nature highlights...'}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-xs text-white font-medium placeholder:text-slate-500 outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* 7. Highlights Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
              {pl ? 'Ciekawe punkty i przystanki na trasie:' : 'Highlights & Stops:'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddHighlight();
                  }
                }}
                placeholder={pl ? 'np. Drewniany pomost, Piekarnia z lodami, Cichy staw...' : 'e.g. Wooden pier, Ice cream bakery...'}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddHighlight}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{pl ? 'Dodaj' : 'Add'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {highlights.map((h, idx) => (
                <span
                  key={idx}
                  className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <span>✨ {h}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    className="text-slate-500 hover:text-rose-400 cursor-pointer ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 8. Author Name */}
          <div className="space-y-1.5 pt-1 border-t border-slate-800">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
              {pl ? 'Podpis Autora Trasy:' : 'Author Signature:'}
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="np. Tomek Rowerzysta"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold outline-none focus:border-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-black transition-all cursor-pointer"
            >
              {pl ? 'Anuluj' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-102 active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>{pl ? 'Opublikuj Trasę w Aplikacji 🚲' : 'Publish Route in App 🚲'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
