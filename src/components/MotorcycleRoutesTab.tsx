/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserAccount, Language, translations, MotorcycleRoute, MotorcycleCategory } from '../types';
import { SEEDED_MOTORCYCLE_ROUTES } from '../data/motorcycleRoutes';
import SightseeingWeatherCard from './SightseeingWeatherCard';
import InAppGoogleMapRoute from './InAppGoogleMapRoute';
import { SectionTravelCompanion } from './AnimatedTravelVehicle';
import AddMotorcycleRouteModal, { MOTO_CATEGORY_CONFIG } from './motorcycle/AddMotorcycleRouteModal';
import MotorcycleRouteCommentsSection from './motorcycle/MotorcycleRouteCommentsSection';
import SelectedMotorcycleRideView from './motorcycle/SelectedMotorcycleRideView';
import { 
  Navigation, Star, ArrowRight, ShieldCheck, MapPin, Flag, 
  Sparkles, X, Plus, MessageSquare, Compass, Fuel, Coffee, 
  Search, Filter, Clock, CheckCircle2, User, Share2, Eye, 
  Flame, Zap, AlertTriangle, ShieldAlert, Bookmark, Check
} from 'lucide-react';

interface MotorcycleRoutesTabProps {
  language: Language;
  account: UserAccount | null;
  onUpdateAccount?: (updatedAccount: UserAccount) => void;
  onNavigateTab?: (tab: any) => void;
}

const MOTO_CATEGORY_TABS: Array<{ key: 'all' | MotorcycleCategory; labelPl: string; labelEn: string; icon: string }> = [
  { key: 'all', labelPl: 'Wszystkie Trasy', labelEn: 'All Moto Routes', icon: '🔥' },
  { key: 'winkle', labelPl: 'Kręte Winkle & Przełęcze', labelEn: 'Twisty Passes', icon: '🏍️' },
  { key: 'wybrzeza', labelPl: 'Malownicze Wybrzeża & Rzeki', labelEn: 'Coastal & River', icon: '🌊' },
  { key: 'lesna', labelPl: 'Leśne Przeloty & Bezdroża', labelEn: 'Forest Cruising', icon: '🌲' },
  { key: 'cruiser', labelPl: 'Turystyka & Cruiser', labelEn: 'Cruiser & Chill', icon: '🦅' },
  { key: 'adv_long', labelPl: 'Wyprawy ADV (100+ km)', labelEn: 'ADV Long-Distance', icon: '🗺️' }
];

export default function MotorcycleRoutesTab({ 
  language, 
  account,
  onUpdateAccount,
  onNavigateTab 
}: MotorcycleRoutesTabProps) {
  const pl = language === 'pl';
  const t = translations[language] || translations.en;

  // Selected Motorcycle Route State (Full designer view)
  const [selectedRoute, setSelectedRoute] = useState<MotorcycleRoute | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Category Filter
  const [selectedCategory, setSelectedCategory] = useState<'all' | MotorcycleCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('all');

  // Custom User Routes from localStorage
  const [customRoutes, setCustomRoutes] = useState<MotorcycleRoute[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Active Embedded Map View in list mode
  const [activeEmbeddedRoute, setActiveEmbeddedRoute] = useState<{ id: string; title: string; start: string; end: string; city: string } | null>(null);

  // Expanded Comments set (route IDs)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  // AI Route Builder States
  const [showAiBuilder, setShowAiBuilder] = useState(false);
  const [aiCountry, setAiCountry] = useState<string>('Poland');
  const [aiStartCity, setAiStartCity] = useState<string>('Kłodzko');
  const [aiStartPoint, setAiStartPoint] = useState<string>('');
  const [aiEndPoint, setAiEndPoint] = useState<string>('');
  const [aiRouteType, setAiRouteType] = useState<MotorcycleCategory>('winkle');
  const [aiBikePreference, setAiBikePreference] = useState<string>('Naked / Sport / Adventure');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoutes, setGeneratedRoutes] = useState<MotorcycleRoute[]>([]);

  // Load custom routes from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('tadzik_custom_motorcycle_routes');
      if (raw) {
        const parsed: MotorcycleRoute[] = JSON.parse(raw);
        setCustomRoutes(parsed);
      }
    } catch (e) {
      console.error('Failed to load custom motorcycle routes:', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleFavorite = (routeId: string) => {
    if (!account) {
      showToast(pl ? 'Zaloguj się, aby zapisać trasę w profilu!' : 'Sign in to save route to your profile!');
      return;
    }

    const currentFavs = account.favoriteMotorcycleRoutes || [];
    const isFav = currentFavs.includes(routeId);
    const updatedFavs = isFav 
      ? currentFavs.filter(id => id !== routeId)
      : [...currentFavs, routeId];

    const updatedAccount: UserAccount = {
      ...account,
      favoriteMotorcycleRoutes: updatedFavs
    };

    if (onUpdateAccount) {
      onUpdateAccount(updatedAccount);
    }

    try {
      localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
      localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAccount));
    } catch (e) {
      console.error('Failed to save updated account favorites:', e);
    }

    showToast(
      isFav 
        ? (pl ? 'Usunięto trasę z ulubionych w profilu' : 'Removed route from profile favorites')
        : (pl ? 'Zapisano trasę w Ulubionych profilu ⭐' : 'Saved route to profile Favorites ⭐')
    );
  };

  const handleRouteAdded = (newRoute: MotorcycleRoute) => {
    setCustomRoutes(prev => [newRoute, ...prev]);
    setSelectedCategory(newRoute.category);
  };

  const toggleComments = (routeId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }));
  };

  // Combine seeded + custom + generated routes
  const allAvailableRoutes: MotorcycleRoute[] = [
    ...generatedRoutes,
    ...customRoutes,
    ...SEEDED_MOTORCYCLE_ROUTES
  ];

  // Filtering
  const filteredRoutes = allAvailableRoutes.filter((r) => {
    // 1. Category
    if (selectedCategory !== 'all' && r.category !== selectedCategory) {
      return false;
    }
    // 2. Country
    if (selectedCountryFilter !== 'all' && r.country && r.country.toLowerCase() !== selectedCountryFilter.toLowerCase()) {
      return false;
    }
    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchCity = r.city.toLowerCase().includes(q);
      const matchStart = r.startPoint.toLowerCase().includes(q);
      const matchEnd = r.endPoint.toLowerCase().includes(q);
      const matchDest = (r.destinationName || '').toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchBike = (r.recommendedBike || '').toLowerCase().includes(q);
      const matchAsphalt = (r.asphaltCondition || '').toLowerCase().includes(q);
      return matchTitle || matchCity || matchStart || matchEnd || matchDest || matchDesc || matchBike || matchAsphalt;
    }
    return true;
  });

  const countForCategory = (catKey: 'all' | MotorcycleCategory) => {
    if (catKey === 'all') return allAvailableRoutes.length;
    return allAvailableRoutes.filter(r => r.category === catKey).length;
  };

  const handleGenerateRoute = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/motorcycle/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: aiCountry,
          startCity: aiStartCity,
          startPoint: aiStartPoint.trim(),
          endPoint: aiEndPoint.trim(),
          routeType: aiRouteType,
          bikePreference: aiBikePreference,
          language: language,
        }),
      });

      if (!res.ok) {
        throw new Error('AI Route Generation request failed');
      }

      const data = await res.json();
      const newRoute: MotorcycleRoute = {
        id: 'ai-moto-' + Date.now(),
        title: data.title || (pl ? `Trasa Motocyklowa: ${aiStartCity || aiCountry}` : `Motorcycle Run: ${aiStartCity || aiCountry}`),
        city: aiStartCity || aiCountry,
        country: aiCountry,
        category: (data.category as MotorcycleCategory) || aiRouteType,
        distanceKm: data.distanceKm || 60,
        estimatedDuration: data.estimatedDuration || '1h 15m',
        difficulty: data.difficulty || 'moderate',
        startPoint: data.startPoint || (pl ? `${aiStartCity || aiCountry} - Centrum` : `${aiStartCity || aiCountry} Center`),
        endPoint: data.endPoint || (pl ? 'Punkt Widokowy / Zamek' : 'Scenic Viewpoint'),
        destinationName: data.destinationName || data.endPoint || (pl ? 'Punkt Widokowy & Panorama' : 'Scenic Viewpoint'),
        destinationCategory: 'Trasa Widokowa AI',
        destinationImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        description: data.description || (pl ? 'Malownicza trasa wygenerowana przez Tadzika z uwzględnieniem bezpiecznego asfaltu i winkli.' : 'Scenic AI motorcycle route with smooth tarmac and curves.'),
        highlights: Array.isArray(data.highlights) && data.highlights.length > 0
          ? data.highlights
          : [
              pl ? 'Dynamiczne winkle i bezpieczne łuki' : 'Dynamic twisties and safe bends',
              pl ? 'Zajazd Biker-Friendly na trasie' : 'Biker-Friendly cafe stop',
              pl ? 'Stacja benzynowa z kompresorem' : 'Gas station with tire pump'
            ],
        asphaltCondition: data.asphaltCondition || (pl ? 'Gładki, równy asfalt o wysokiej przyczepności' : 'Smooth high-grip asphalt'),
        recommendedBike: data.recommendedBike || aiBikePreference || 'Naked / Sport / Adventure / Cruiser',
        cornersCount: data.cornersCount || 75,
        authorName: 'Tadzik AI Moto Planner 🤖',
        isCommunity: false,
        createdAt: new Date().toISOString().split('T')[0],
        rating: 5.0,
        reviewsCount: 1,
        smartInsights: data.smartInsights || {
          cornersDensity: pl ? `${data.cornersCount || 75} wyprofilowanych zakrętów` : 'High corner density',
          asphaltQuality: data.asphaltCondition || (pl ? 'Wysoka przyczepność' : 'High grip'),
          fuelStations: pl ? 'Stacje paliw z kompresorem co 15-20 km' : 'Gas stations with tire pressure gauge',
          bikerSpots: pl ? 'Kultowy zajazd Biker-Friendly ze stojakami na kaski' : 'Biker-Friendly cafe with parking',
          scenicViewpoints: pl ? 'Punkty widokowe z miejscami na motocykle' : 'Scenic viewpoints with motorcycle parking',
          recommendedBike: data.recommendedBike || 'Wszystkie typy motocykli',
          safetyNote: pl ? 'Czytelne łuki, brak niebezpiecznego piasku' : 'Clear corner lines, clean tarmac',
          recommendedFor: pl ? 'Pasjonaci winkli i motocyklowych wypraw' : 'Motorcycle travel lovers'
        }
      };

      setGeneratedRoutes(prev => [newRoute, ...prev]);
      setSelectedCategory(newRoute.category);
      setShowAiBuilder(false);
      setSelectedRoute(newRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.warn('AI generator offline fallback:', error);
      // Offline fallback
      const fallbackRoute: MotorcycleRoute = {
        id: 'ai-moto-fb-' + Date.now(),
        title: pl ? `Malowniczy Szlak Motocyklowy: ${aiStartCity || aiCountry}` : `Scenic Moto Run: ${aiStartCity || aiCountry}`,
        city: aiStartCity || 'Polska',
        country: aiCountry,
        category: aiRouteType,
        distanceKm: 70,
        estimatedDuration: '1h 20m',
        difficulty: 'moderate',
        startPoint: aiStartPoint || (pl ? `${aiStartCity} - Stacja Paliw z kompresorem` : `${aiStartCity} Gas Station`),
        endPoint: aiEndPoint || (pl ? 'Przełęcz Widokowa / Baza Motocyklowa' : 'Scenic Summit / Biker Hub'),
        destinationName: aiEndPoint || (pl ? 'Przełęcz Widokowa & Panorama Gór' : 'Scenic Summit Viewpoint'),
        destinationCategory: 'Szlak Górski',
        destinationImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        description: pl 
          ? `Ekscytująca trasa motocyklowa w rejonie ${aiStartCity || aiCountry}. Wyselekcjonowana ze względu na jakość asfaltu, płynność winkli i panoramiczne widoki.`
          : `Exciting motorcycle route in ${aiStartCity || aiCountry} with smooth curves and great scenery.`,
        highlights: [
          pl ? 'Płynne, czytelne winkle z dobrą widocznością' : 'Smooth twisties with great visibility',
          pl ? 'Klimatyczny zajazd Biker-Friendly' : 'Cozy Biker-Friendly inn',
          pl ? 'Stacja paliw z kompresorem ciśnienia opon' : 'Gas station with tire compressor',
          pl ? 'Panoramiczny taras widokowy' : 'Panoramic viewpoint'
        ],
        asphaltCondition: pl ? '95% gładki, przyczepny asfalt, szerokie pobocza' : '95% smooth high-grip asphalt',
        recommendedBike: aiBikePreference || 'Naked / Sport / Adventure / Cruiser',
        cornersCount: 80,
        authorName: 'Tadzik AI Moto Planner 🤖',
        isCommunity: false,
        createdAt: new Date().toISOString().split('T')[0],
        rating: 5.0,
        reviewsCount: 1,
        smartInsights: {
          cornersDensity: pl ? 'Wysoka (ok. 80 wyprofilowanych zakrętów)' : 'High (approx 80 bends)',
          asphaltQuality: pl ? 'Gładki, równy asfalt o wysokiej przyczepności' : 'High grip smooth tarmac',
          fuelStations: pl ? 'Stacja paliw 24h na starcie i w połowie trasy' : 'Gas stations at start and mid-point',
          bikerSpots: pl ? 'Kawiarnia z tarasem i parkingiem na motocykle' : 'Cafe with outdoor motorcycle parking',
          scenicViewpoints: pl ? '2 punkty widokowe z miejscem postojowym' : '2 scenic viewpoints',
          recommendedBike: aiBikePreference || 'Naked / Sport / Adventure / Cruiser',
          safetyNote: pl ? 'Bezpieczne, równe pobocza i czytelne łuki' : 'Safe shoulders and readable curves',
          recommendedFor: pl ? 'Miłośnicy dynamicznej jazdy i krajobrazów' : 'Curves enthusiasts and road trippers'
        }
      };

      setGeneratedRoutes(prev => [fallbackRoute, ...prev]);
      setSelectedCategory(fallbackRoute.category);
      setShowAiBuilder(false);
      setSelectedRoute(fallbackRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsGenerating(false);
    }
  };

  // IF A SPECIFIC MOTORCYCLE ROUTE IS SELECTED -> RENDER DESIGNER DETAILS VIEW
  if (selectedRoute) {
    const isFav = account?.favoriteMotorcycleRoutes?.includes(selectedRoute.id) || false;
    return (
      <motion.div
        key={selectedRoute.id}
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.985 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Floating Toast */}
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-rose-500/50 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}

        <SelectedMotorcycleRideView
          route={selectedRoute}
          allRoutes={allAvailableRoutes}
          language={language}
          account={account}
          isFavorite={isFav}
          onToggleFavorite={() => handleToggleFavorite(selectedRoute.id)}
          onBack={() => {
            setSelectedRoute(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectOtherRoute={(newR) => {
            setSelectedRoute(newR);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 pb-12" id="motorcycle-routes-tab-root">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-rose-500/50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner & Section Companion */}
      <div className="relative bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-rose-900/40 shadow-2xl overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-600/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute right-6 bottom-4 opacity-15 text-8xl select-none pointer-events-none">
          🏍️
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-rose-900/60 border border-rose-700/60 text-rose-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <span>🏍️</span>
            <span>{pl ? 'Malownicze Trasy na Motor' : 'Scenic Motorcycle Routes'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
            {pl ? 'Poczuj Wolność na Dwóch Kołach! 🏍️' : 'Feel the Freedom on Two Wheels! 🏍️'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base font-semibold leading-relaxed">
            {pl 
              ? 'Wybierz trasę idealnie dopasowaną pod motor: kręte winkle i przełęcze, malownicze szosy wzdłuż rzek i wybrzeży, leśne przeloty, relaksujący cruising chopperem lub długodystansowe wyprawy ADV. Kliknij dowolną trasę, by zobaczyć zdjęcie miejsca docelowego i pełen profil nawigacyjny!' 
              : 'Discover scenic motorcycle routes tailored for riders: twisty mountain passes, coastal & river runs, forest cruising, relaxed chopper touring, and ADV expeditions. Click any route to view high-res destination photos and riding intel!'}
          </p>

          {/* Action Row: Add Route + AI Planner */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="btn-add-custom-moto-route"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-2 hover:scale-102 active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>{pl ? 'Dodaj Swoją Trasę na Motor ➕' : 'Add Your Motorcycle Route ➕'}</span>
            </button>

            <button
              type="button"
              id="btn-open-ai-moto-planner"
              onClick={() => setShowAiBuilder(!showAiBuilder)}
              className="bg-slate-800/90 hover:bg-slate-700 text-rose-300 hover:text-white border border-rose-700/50 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{pl ? 'Kreator Tras AI (Tadzik Moto Planner) 🤖' : 'AI Moto Route Planner 🤖'}</span>
            </button>
          </div>
        </div>

        {/* Section Companion */}
        <div className="mt-4 pt-3 border-t border-rose-900/40 flex items-center justify-between text-xs text-rose-300 font-bold">
          <SectionTravelCompanion vehicle="motorcycle" language={language} />
          <span className="text-[11px] text-slate-400">
            {pl ? `Dostępnych tras: ${allAvailableRoutes.length}` : `Available routes: ${allAvailableRoutes.length}`}
          </span>
        </div>
      </div>

      {/* 2. AI Route Planner Drawer (Collapsible) */}
      {showAiBuilder && (
        <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5 text-rose-400">
              <div className="p-2 bg-rose-600/20 rounded-xl border border-rose-500/40">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {pl ? 'Tadzik AI Moto Planner — Inteligentny Generator Tras' : 'Tadzik AI Moto Route Generator'}
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  {pl ? 'Podaj skąd wyruszasz, jaki masz typ motocykla i rodzaj winkli, a AI ułoży idealną trasę ze zdjęciem miejsca!' : 'Set your starting location, bike type and preferred twisties, and AI will map the run with destination photos!'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAiBuilder(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Country */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">{pl ? 'Kraj podróży:' : 'Country:'}</label>
              <select
                value={aiCountry}
                onChange={(e) => setAiCountry(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="Poland">🇵🇱 Polska (Poland)</option>
                <option value="Netherlands">🇳🇱 Holandia (Netherlands)</option>
                <option value="Germany">🇩🇪 Niemcy (Germany)</option>
                <option value="Belgium">🇧🇪 Belgia (Belgium)</option>
                <option value="France">🇫🇷 Francja (France)</option>
              </select>
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">{pl ? 'Miasto / Rejon:' : 'City / Region:'}</label>
              <input
                type="text"
                value={aiStartCity}
                onChange={(e) => setAiStartCity(e.target.value)}
                placeholder="np. Kłodzko, Wisła, Adenau..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-rose-500"
              />
            </div>

            {/* Route Category */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">{pl ? 'Kategoria trasy:' : 'Category:'}</label>
              <select
                value={aiRouteType}
                onChange={(e) => setAiRouteType(e.target.value as MotorcycleCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="winkle">🏍️ Kręte Winkle & Przełęcze</option>
                <option value="wybrzeza">🌊 Malownicze Wybrzeża & Rzeki</option>
                <option value="lesna">🌲 Leśne Przeloty & Bezdroża</option>
                <option value="cruiser">🦅 Turystyka & Cruiser / Chopper</option>
                <option value="adv_long">🗺️ Wyprawy ADV & Długodystansowe</option>
              </select>
            </div>

            {/* Bike Preference */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">{pl ? 'Twój typ motocykla:' : 'Bike Type:'}</label>
              <input
                type="text"
                value={aiBikePreference}
                onChange={(e) => setAiBikePreference(e.target.value)}
                placeholder="np. Naked, ADV, Cruiser, Sport..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Optional start / end points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">{pl ? 'Dokładny punkt startowy (opcjonalnie):' : 'Exact Start Point (optional):'}</label>
              <input
                type="text"
                value={aiStartPoint}
                onChange={(e) => setAiStartPoint(e.target.value)}
                placeholder={pl ? 'np. Stacja Orlen, Rynek w mieście...' : 'e.g. Gas station, City square...'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium outline-none focus:border-rose-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">{pl ? 'Punkt docelowy / szczyt (opcjonalnie):' : 'Destination (optional):'}</label>
              <input
                type="text"
                value={aiEndPoint}
                onChange={(e) => setAiEndPoint(e.target.value)}
                placeholder={pl ? 'np. Przełęcz, Zamek, Karczma motocyklowa...' : 'e.g. Mountain Summit, Castle...'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleGenerateRoute}
              disabled={isGenerating}
              className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>{pl ? 'Tadzik planuje winkle i szuka zdjęć...' : 'Mapping twisties and photos...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{pl ? 'Wygeneruj Trasę Motocyklową AI 🏍️' : 'Generate AI Moto Route 🏍️'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 3. Category Filter Tabs & Search Bar */}
      <div className="space-y-3">
        {/* Category Tabs Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" id="moto-category-pills">
          {MOTO_CATEGORY_TABS.map((cat) => {
            const count = countForCategory(cat.key);
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                id={`moto-cat-${cat.key}`}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30 scale-102'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{pl ? cat.labelPl : cat.labelEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-rose-950 text-rose-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Country Filter Row */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={pl ? 'Szukaj trasy, miasta, winkli, zamku lub typu motocykla...' : 'Search route, city, pass, castle or bike...'}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 font-medium placeholder-slate-400 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCountryFilter}
              onChange={(e) => setSelectedCountryFilter(e.target.value)}
              className="w-full sm:w-auto bg-white border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-800 font-bold outline-none focus:border-rose-500 shadow-xs cursor-pointer"
            >
              <option value="all">🌍 {pl ? 'Wszystkie kraje' : 'All Countries'}</option>
              <option value="Poland">🇵🇱 Polska (Poland)</option>
              <option value="Germany">🇩🇪 Niemcy (Germany)</option>
              <option value="Netherlands">🇳🇱 Holandia (Netherlands)</option>
              <option value="Belgium">🇧🇪 Belgia (Belgium)</option>
              <option value="France">🇫🇷 Francja (France)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Active Embedded Map Navigation Section (if activated from list) */}
      {activeEmbeddedRoute && (
        <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
              <Navigation className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-white font-black">{activeEmbeddedRoute.title}</span>
                <p className="text-[11px] text-slate-400">
                  {activeEmbeddedRoute.start} ➔ {activeEmbeddedRoute.end}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveEmbeddedRoute(null)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <InAppGoogleMapRoute
            initialStartLocation={activeEmbeddedRoute.start}
            destination={activeEmbeddedRoute.end}
            destinationTitle={activeEmbeddedRoute.title}
            initialTravelMode="motorcycle"
            city={activeEmbeddedRoute.city}
            language={language}
            onClose={() => setActiveEmbeddedRoute(null)}
            autoStartNav={true}
          />
        </div>
      )}

      {/* 5. Motorcycle Routes Grid */}
      {filteredRoutes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3">
          <span className="text-4xl">🏍️</span>
          <h3 className="text-base font-black text-slate-900">
            {pl ? 'Nie znaleziono tras motocyklowych spełniających kryteria' : 'No motorcycle routes matching your filters'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
            {pl 
              ? 'Spróbuj zmienić filtr kategorii, wyczyścić wyszukiwarkę lub dodaj własną trasę klikając przycisk "Dodaj Swoją Trasę na Motor"!' 
              : 'Try changing category filter, clearing search query or click "Add Your Motorcycle Route" to create one!'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setSelectedCountryFilter('all');
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            {pl ? 'Pokaż Wszystkie Trasy' : 'Show All Routes'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" id="moto-routes-grid">
          {filteredRoutes.map((route) => {
            const conf = MOTO_CATEGORY_CONFIG[route.category] || MOTO_CATEGORY_CONFIG.winkle;
            const isCommentsOpen = !!expandedComments[route.id];
            const isFav = account?.favoriteMotorcycleRoutes?.includes(route.id) || false;

            const coverPhoto = route.destinationImageUrl || (
              route.category === 'winkle' ? 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' :
              route.category === 'wybrzeza' ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' :
              route.category === 'lesna' ? 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80' :
              route.category === 'cruiser' ? 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80' :
              'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
            );

            return (
              <div
                key={route.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl hover:border-rose-300/80 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                id={`moto-card-${route.id}`}
              >
                <div>
                  {/* Visual Header: Destination Photo Hero Cover */}
                  <div 
                    onClick={() => {
                      setSelectedRoute(route);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="relative h-44 sm:h-48 w-full bg-slate-900 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={coverPhoto}
                      alt={route.destinationName || route.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-xl text-[11px] font-black text-white ${conf.badgeBg} shadow-md backdrop-blur-xs`}>
                        <span>{conf.icon}</span>
                        <span>{pl ? conf.labelPl : conf.labelEn}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <span className="bg-slate-900/90 text-amber-300 text-[11px] font-black px-2 py-0.8 rounded-xl border border-slate-700/80 backdrop-blur-xs flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{route.rating || 5.0}</span>
                        </span>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(route.id);
                          }}
                          className={`p-1.5 rounded-xl border backdrop-blur-xs transition-all cursor-pointer shadow-md ${
                            isFav 
                              ? 'bg-amber-400 text-slate-950 border-amber-300' 
                              : 'bg-slate-900/80 text-white border-slate-700 hover:text-amber-300 hover:border-amber-400'
                          }`}
                          title={isFav ? (pl ? 'W ulubionych' : 'In favorites') : (pl ? 'Zapisz do ulubionych' : 'Save to favorites')}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-slate-950' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Photo Overlay Info */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] uppercase font-black tracking-wider text-rose-300 bg-rose-950/80 px-2 py-0.2 rounded border border-rose-800/60 drop-shadow">
                          🎯 {route.destinationName || route.endPoint}
                        </span>
                        <span className="text-[10px] text-slate-200 font-bold drop-shadow">
                          • {route.city}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white line-clamp-1 drop-shadow-md">
                        {route.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body: Info & Parameters */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Motorcycle Metrics Pills (Distance, Duration, Corners, Difficulty) */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-150">
                      {/* Distance */}
                      <div className="text-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                          {pl ? 'Dystans' : 'Distance'}
                        </span>
                        <span className="text-xs font-black text-rose-600 font-mono">
                          {route.distanceKm} km
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="text-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                          {pl ? 'Czas jazdy' : 'Duration'}
                        </span>
                        <span className="text-xs font-black text-slate-800">
                          {route.estimatedDuration || '1h 00m'}
                        </span>
                      </div>

                      {/* Corners Count */}
                      <div className="text-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                          {pl ? 'Winkle' : 'Corners'}
                        </span>
                        <span className="text-xs font-black text-amber-600 font-mono flex items-center justify-center gap-0.5">
                          <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{route.cornersCount || 60}+</span>
                        </span>
                      </div>

                      {/* Difficulty */}
                      <div className="text-center hidden sm:block">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                          {pl ? 'Trudność' : 'Difficulty'}
                        </span>
                        <span className={`text-[11px] font-black uppercase ${
                          route.difficulty === 'challenging' ? 'text-rose-600' :
                          route.difficulty === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {route.difficulty === 'challenging' ? (pl ? 'Wymagająca' : 'Challenging') :
                           route.difficulty === 'medium' ? (pl ? 'Średnia' : 'Medium') : (pl ? 'Łatwa' : 'Easy')}
                        </span>
                      </div>
                    </div>

                    {/* Start -> End Points Box */}
                    <div className="bg-rose-50/50 border border-rose-100 p-2.5 rounded-2xl space-y-1 text-xs">
                      <div className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold text-[10px] uppercase shrink-0 pt-0.5">
                          {pl ? 'Start:' : 'From:'}
                        </span>
                        <span className="font-bold text-slate-800 line-clamp-1">{route.startPoint}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold text-[10px] uppercase shrink-0 pt-0.5">
                          {pl ? 'Meta:' : 'To:'}
                        </span>
                        <span className="font-bold text-slate-800 line-clamp-1">{route.destinationName || route.endPoint}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                      {route.description}
                    </p>

                    {/* Highlights Bullet points */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        {pl ? 'Kluczowe Punkty & Winkle:' : 'Key Highlights:'}
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] font-bold text-slate-700">
                        {route.highlights.slice(0, 2).map((h, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-rose-500 shrink-0" />
                            <span className="line-clamp-1">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Motorcycle Smart Insights (Asphalt Grip, Fuel, Biker spots) */}
                    <div className="bg-slate-900 text-white p-3 rounded-2xl space-y-1.5 border border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-black text-rose-300">
                        <span className="flex items-center gap-1">
                          <span>🏍️</span>
                          <span>{pl ? 'Parametry Tadzika:' : 'Tadzik Insights:'}</span>
                        </span>
                        {route.recommendedBike && (
                          <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full font-mono truncate max-w-[140px]">
                            {route.recommendedBike.split('/')[0]}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-slate-300 font-medium">
                        {/* Asphalt Quality */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-400">🛣️</span>
                          <span className="line-clamp-1">
                            <strong>{pl ? 'Asfalt:' : 'Grip:'}</strong> {route.asphaltCondition ? route.asphaltCondition.split(',')[0] : (pl ? 'Wysoka przyczepność' : 'High grip')}
                          </span>
                        </div>

                        {/* Biker Spots */}
                        <div className="flex items-center gap-1.5">
                          <Coffee className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="line-clamp-1">
                            <strong>{pl ? 'Stop:' : 'Stop:'}</strong> {route.smartInsights?.bikerSpots ? route.smartInsights.bikerSpots.split('(')[0] : (pl ? 'Zajazdy Biker-Friendly' : 'Biker-friendly stops')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom / Action Buttons */}
                <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/70 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Author badge */}
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{route.authorName || (pl ? 'Społeczność Moto' : 'Biker Community')}</span>
                      {route.isCommunity && (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded-full font-black">
                          {pl ? 'Własna' : 'Custom'}
                        </span>
                      )}
                    </span>

                    {/* Actions: Select Route + Reviews + Map */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleComments(route.id)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                          isCommentsOpen
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:text-rose-600'
                        }`}
                        title={pl ? 'Opinie i rady motocyklistów' : 'Reviews'}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{pl ? 'Opinie' : 'Reviews'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRoute(route);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <span>{pl ? 'Wybierz trasę & Zdjęcie 🏍️' : 'View Run & Photo 🏍️'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Comments Drawer */}
                  {isCommentsOpen && (
                    <MotorcycleRouteCommentsSection
                      routeId={route.id}
                      routeTitle={route.title}
                      language={language}
                      currentUsername={account?.username}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Motorcycle Route Modal */}
      <AddMotorcycleRouteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRouteAdded={handleRouteAdded}
        language={language}
        defaultAuthor={account?.username}
      />
    </div>
  );
}
