/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserAccount, Language, translations, CyclingRoute, CyclingCategory } from '../types';
import { SEEDED_CYCLING_ROUTES } from '../data/attractions';
import SightseeingWeatherCard from './SightseeingWeatherCard';
import InAppGoogleMapRoute from './InAppGoogleMapRoute';
import { SectionTravelCompanion } from './AnimatedTravelVehicle';
import AddCyclingRouteModal, { CATEGORY_CONFIG } from './cycling/AddCyclingRouteModal';
import CyclingRouteCommentsSection from './cycling/CyclingRouteCommentsSection';
import CyclingRouteNearbyExtensions from './cycling/CyclingRouteNearbyExtensions';
import SelectedCyclingRideView from './cycling/SelectedCyclingRideView';
import { calculateHaversineDistanceKm } from '../services/gpsTransitService';
import { 
  Bike, Navigation, Star, ArrowRight, ShieldCheck, MapPin, Flag, 
  Bookmark, Sparkles, X, Plus, MessageSquare, Compass, TreePine, 
  Wheat, Mountain, Map, Filter, Search, BatteryCharging, Droplets, 
  Clock, CheckCircle2, User, Share2, Utensils, RotateCcw, Eye,
  Wind, Gauge, ChevronRight, Layers, Sun
} from 'lucide-react';

interface CyclingRoutesTabProps {
  language: Language;
  account: UserAccount | null;
  onUpdateAccount?: (acc: UserAccount | null) => void;
  onNavigateTab?: (tab: 'explore' | 'station-router' | 'cycling' | 'motorcycle' | 'hotels' | 'passport' | 'challenges' | 'account') => void;
}

const CATEGORY_TABS: Array<{ key: 'all' | CyclingCategory; labelPl: string; labelEn: string; icon: string }> = [
  { key: 'all', labelPl: 'Wszystkie Trasy', labelEn: 'All Routes', icon: '🌟' },
  { key: 'lesna', labelPl: 'Leśne', labelEn: 'Forest Trails', icon: '🌲' },
  { key: 'polna', labelPl: 'Polne', labelEn: 'Countryside & Fields', icon: '🌾' },
  { key: 'terenowa', labelPl: 'Terenowe (MTB/Gravel)', labelEn: 'Off-Road / Gravel', icon: '🚵‍♂️' },
  { key: 'turystyczna', labelPl: 'Turystyczne (Widokowe)', labelEn: 'Touring & Scenic', icon: '🏖️' },
  { key: 'dlugodystansowa', labelPl: 'Długodystansowe (40+ km)', labelEn: 'Long-Distance', icon: '🗺️' }
];

export default function CyclingRoutesTab({ 
  language, 
  account, 
  onUpdateAccount, 
  onNavigateTab 
}: CyclingRoutesTabProps) {
  const pl = language === 'pl';
  const t = translations[language] || translations.en;

  // Notification for favorite action
  const [favoriteToast, setFavoriteToast] = useState<{ message: string; isSaved: boolean } | null>(null);

  // Selected Route for dedicated Detailed Ride View
  const [selectedRoute, setSelectedRoute] = useState<CyclingRoute | null>(null);

  // Active Category Filter
  const [selectedCategory, setSelectedCategory] = useState<'all' | CyclingCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('all');

  // Custom User Routes from localStorage
  const [customRoutes, setCustomRoutes] = useState<CyclingRoute[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // User GPS for quick distance calculations on cards
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Active Map View
  const [activeEmbeddedRoute, setActiveEmbeddedRoute] = useState<{ id: string; title: string; start: string; end: string; city: string } | null>(null);

  // Expanded Comments set (route IDs)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  // Expanded Nearby Planner & Extensions set (route IDs)
  const [expandedExtensions, setExpandedExtensions] = useState<Record<string, boolean>>({});

  // AI Route Builder States
  const [showAiBuilder, setShowAiBuilder] = useState(false);
  const [aiCountry, setAiCountry] = useState<string>('Poland');
  const [aiStartCity, setAiStartCity] = useState<string>('Poznań');
  const [aiStartPoint, setAiStartPoint] = useState<string>('');
  const [aiEndPoint, setAiEndPoint] = useState<string>('');
  const [aiRouteType, setAiRouteType] = useState<CyclingCategory>('lesna');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoutes, setGeneratedRoutes] = useState<CyclingRoute[]>([]);

  // Load custom routes & GPS from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('tadzik_custom_cycling_routes');
      if (raw) {
        const parsed: CyclingRoute[] = JSON.parse(raw);
        setCustomRoutes(parsed);
      }
    } catch (e) {
      console.error('Failed to load custom routes:', e);
    }

    try {
      const savedGps = localStorage.getItem('tadzik_user_gps_location');
      if (savedGps) {
        const parsed = JSON.parse(savedGps);
        if (parsed.coords?.lat && parsed.coords?.lng) {
          setUserCoords(parsed.coords);
        }
      }
    } catch (e) {
      // ignore
    }

    if (!userCoords && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // fallback default Poznan
          setUserCoords({ lat: 52.4064, lng: 16.9252 });
        },
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }
  }, []);

  const handleRouteAdded = (newRoute: CyclingRoute) => {
    setCustomRoutes(prev => [newRoute, ...prev]);
    setSelectedCategory(newRoute.category);
  };

  const toggleComments = (routeId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }));
  };

  const toggleExtensions = (routeId: string) => {
    setExpandedExtensions(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }));
  };

  // Toggle route in user favorites (stored in UserAccount & localStorage for Profile tab)
  const handleToggleFavorite = (route: CyclingRoute) => {
    const currentFavorites = account?.favoriteCyclingRoutes || [];
    const isAlreadyFav = currentFavorites.includes(route.id);
    let updatedFavorites: string[];

    if (isAlreadyFav) {
      updatedFavorites = currentFavorites.filter(id => id !== route.id);
    } else {
      updatedFavorites = [...currentFavorites, route.id];
    }

    if (account) {
      const updatedAccount: UserAccount = {
        ...account,
        favoriteCyclingRoutes: updatedFavorites
      };
      if (onUpdateAccount) {
        onUpdateAccount(updatedAccount);
      }
      try {
        localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
        localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAccount));
      } catch (e) {
        console.error('Error saving favorite route:', e);
      }
    } else {
      // Fallback in case account is null
      try {
        const key = 'tadzik_guest_favorite_cycling_routes';
        const saved = JSON.parse(localStorage.getItem(key) || '[]');
        const next = isAlreadyFav ? saved.filter((id: string) => id !== route.id) : [...saved, route.id];
        localStorage.setItem(key, JSON.stringify(next));
      } catch (e) {
        console.error('Guest favorite save error:', e);
      }
    }

    // Show friendly toast notification
    setFavoriteToast({
      message: !isAlreadyFav 
        ? (pl ? `Zapisano "${route.title}" do ulubionych w Twoim Profilu! ⭐` : `Saved "${route.title}" to your favorites in Profile! ⭐`)
        : (pl ? `Usunięto "${route.title}" z ulubionych.` : `Removed "${route.title}" from favorites.`),
      isSaved: !isAlreadyFav
    });

    setTimeout(() => {
      setFavoriteToast(null);
    }, 4000);
  };

  // Combine seeded + custom + generated routes
  const allAvailableRoutes: CyclingRoute[] = [
    ...generatedRoutes,
    ...customRoutes,
    ...SEEDED_CYCLING_ROUTES
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
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchBike = (r.recommendedBike || '').toLowerCase().includes(q);
      return matchTitle || matchCity || matchStart || matchEnd || matchDesc || matchBike;
    }
    return true;
  });

  const countForCategory = (catKey: 'all' | CyclingCategory) => {
    if (catKey === 'all') return allAvailableRoutes.length;
    return allAvailableRoutes.filter(r => r.category === catKey).length;
  };

  const handleGenerateRoute = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/cycling/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: aiCountry,
          startCity: aiStartCity,
          startPoint: aiStartPoint.trim(),
          endPoint: aiEndPoint.trim(),
          language: language,
          routeType: aiRouteType,
        }),
      });

      if (!res.ok) {
        throw new Error('API Key missing or fetch error');
      }

      const data = await res.json();
      if (data && data.title) {
        const newRoute: CyclingRoute = {
          id: 'ai-' + Date.now(),
          title: data.title,
          category: data.category || aiRouteType,
          difficulty: data.difficulty || 'easy',
          distanceKm: data.distanceKm || 24,
          estimatedDuration: data.estimatedDuration || '1h 45m',
          startPoint: data.startPoint || aiStartPoint || `${aiStartCity} Dworzec / Centrum`,
          endPoint: data.endPoint || aiEndPoint || `${aiStartCity} Park Krajobrazowy`,
          description: data.description || (pl ? 'Optymalna trasa zaprojektowana przez Tadzika.' : 'Custom planned cycling path.'),
          highlights: data.highlights || [pl ? 'Punkt widokowy' : 'Scenic spot', pl ? 'Odpoczynek na ławce' : 'Rest bench'],
          surface: data.surface || (pl ? '85% gładki asfalt, 15% szuter' : '85% asphalt, 15% gravel'),
          recommendedBike: data.recommendedBike || 'Trekking / Gravel / E-bike',
          city: aiStartCity || aiCountry,
          country: aiCountry,
          authorName: pl ? 'Sztuczna Inteligencja Tadzik' : 'Tadzik AI Planner',
          isCommunity: false,
          createdAt: new Date().toISOString().split('T')[0],
          rating: 5.0,
          reviewsCount: 1,
          smartInsights: data.smartInsights || {
            shadePercent: 80,
            restBenches: pl ? 'Ławki i wiaty co 2 km' : 'Benches every 2 km',
            waterPoints: pl ? 'Źródełko z wodą i kawiarnia' : 'Water tap and cafe',
            eBikeCharging: true,
            safetyLevel: pl ? '100% drogi bezkolizyjne z autami' : '100% car-free path',
            recommendedFor: pl ? 'Seniorzy, rodziny, miłośnicy natury' : 'Seniors, families and nature lovers'
          }
        };
        setGeneratedRoutes(prev => [newRoute, ...prev]);
        setSelectedCategory(newRoute.category);
      }
    } catch (err) {
      console.warn("AI generation error, generating local fallback:", err);
      const effectiveStart = aiStartPoint.trim() || `${aiStartCity} Dworzec Główny`;
      const effectiveEnd = aiEndPoint.trim() || `${aiStartCity} Oaza Przyrody i Jezioro`;

      const categoryDefaults: Record<CyclingCategory, { title: string; desc: string; dist: number; surface: string; shade: number }> = {
        lesna: {
          title: pl ? `Leśny Szlak Cienia i Natury (${aiStartCity})` : `Forest Canopy Trail (${aiStartCity})`,
          desc: pl ? `Zacieniona, kojąca trasa wiodąca przez gęste lasy i rezerwaty przyrody ze startem w ${effectiveStart} do ${effectiveEnd}.` : `Shaded forest trail from ${effectiveStart} to ${effectiveEnd}.`,
          dist: 26.0,
          surface: pl ? '80% ubity dukt leśny, 20% asfalt' : '80% forest trail, 20% asphalt',
          shade: 90
        },
        polna: {
          title: pl ? `Sielski Szlak Polny & Wiejskie Zagrody (${aiStartCity})` : `Rustic Countryside & Field Route (${aiStartCity})`,
          desc: pl ? `Przepiękna trasa wśród falujących zbóż, łąk i wiatraków, minimalny ruch samochodowy, idealna na spokojny odpoczynek.` : `Scenic rustic route through open fields and meadows from ${effectiveStart} to ${effectiveEnd}.`,
          dist: 21.5,
          surface: pl ? '70% droga polna ubita, 30% asfalt' : '70% field track, 30% asphalt',
          shade: 25
        },
        terenowa: {
          title: pl ? `Szlak Terenowy Gravel & MTB (${aiStartCity})` : `Gravel & Off-Road Challenge (${aiStartCity})`,
          desc: pl ? `Dynamiczna trasa terenowa ze zróżnicowaną nawierzchnią szutrową, leśnymi przesmykami i punktami widokowymi.` : `Dynamic off-road gravel trail with scenic climbs and varied terrain from ${effectiveStart} to ${effectiveEnd}.`,
          dist: 32.0,
          surface: pl ? '65% ubity szuter/kamień, 25% dukt leśny, 10% asfalt' : '65% gravel, 25% forest trail, 10% asphalt',
          shade: 65
        },
        turystyczna: {
          title: pl ? `Malownicza Trasa Turystyczna (${aiStartCity})` : `Scenic Touring Pathway (${aiStartCity})`,
          desc: pl ? `W 100% asfaltowa, płaska, bezpieczna dla każdego trasa turystyczna z licznymi kawiarniami i ławkami widokowymi.` : `Completely paved, flat, elder-friendly scenic route connecting ${effectiveStart} and ${effectiveEnd}.`,
          dist: 18.0,
          surface: pl ? '100% gładki asfalt rowerowy' : '100% smooth paved cycleway',
          shade: 45
        },
        dlugodystansowa: {
          title: pl ? `Wielka Pętla Długodystansowa 50+ km (${aiStartCity})` : `Grand Long-Distance Bikepacking Loop (${aiStartCity})`,
          desc: pl ? `Wspaniała wyprawa całodniowa z przygotowaną infrastrukturą MOR (Miejsca Obsługi Rowerzystów) i stacjami naprawczymi.` : `All-day touring loop (50+ km) with rest areas and bike repair stations from ${effectiveStart} to ${effectiveEnd}.`,
          dist: 52.0,
          surface: pl ? '90% asfalt, 10% drobny szuter' : '90% asphalt, 10% gravel',
          shade: 55
        }
      };

      const cDef = categoryDefaults[aiRouteType] || categoryDefaults.turystyczna;

      const fallbackRoute: CyclingRoute = {
        id: 'ai-fallback-' + Date.now(),
        title: cDef.title,
        category: aiRouteType,
        difficulty: aiRouteType === 'terenowa' || aiRouteType === 'dlugodystansowa' ? 'moderate' : 'easy',
        distanceKm: cDef.dist,
        estimatedDuration: aiRouteType === 'dlugodystansowa' ? '3h 30m' : '1h 40m',
        startPoint: effectiveStart,
        endPoint: effectiveEnd,
        description: cDef.desc,
        highlights: [
          pl ? `Przystań i widok na panoramę ${aiStartCity}` : `Viewpoint overlooking ${aiStartCity}`,
          pl ? 'Czyste ujęcia wody i punkty odpoczynku z ławkami' : 'Clean water taps & shaded rest benches',
          pl ? 'Rowerowa kawiarenka z lokalnymi przysmakami' : 'Local cyclist cafe with artisan treats',
          pl ? 'Wydzielone bezpieczne bezdroża bez ruchu aut' : 'Dedicated car-free pathways'
        ],
        surface: cDef.surface,
        recommendedBike: aiRouteType === 'terenowa' ? 'Gravel / MTB' : aiRouteType === 'polna' ? 'Trekking / Gravel' : 'Miejski / E-bike / Trekking',
        city: aiStartCity || aiCountry,
        country: aiCountry,
        authorName: pl ? 'Przewodnik Tadzik' : 'Tadzik Guide',
        isCommunity: false,
        createdAt: new Date().toISOString().split('T')[0],
        rating: 5.0,
        reviewsCount: 1,
        smartInsights: {
          shadePercent: cDef.shade,
          restBenches: pl ? 'Zadaszone wiaty i ławki na trasie' : 'Covered picnic spots along trail',
          waterPoints: pl ? 'Kawiarnie i punkty z wodą' : 'Water points & cafes',
          eBikeCharging: true,
          safetyLevel: pl ? 'Trasa sprawdzona, bezkolizyjna z autami' : 'Tested car-free route',
          recommendedFor: pl ? 'Wszyscy entuzjaści rowerowych wycieczek' : 'All cycling enthusiasts'
        }
      };

      setGeneratedRoutes(prev => [fallbackRoute, ...prev]);
      setSelectedCategory(aiRouteType);
    } finally {
      setIsGenerating(false);
    }
  };

  // If a route is actively selected, display the full redesigned designer view with destination photo, distance from user, cyclist advice and weather
  if (selectedRoute) {
    const isFav = (account?.favoriteCyclingRoutes || []).includes(selectedRoute.id);
    return (
      <SelectedCyclingRideView
        route={selectedRoute}
        allRoutes={allAvailableRoutes}
        language={language}
        account={account}
        isFavorite={isFav}
        onToggleFavorite={() => handleToggleFavorite(selectedRoute)}
        onBack={() => {
          setSelectedRoute(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectOtherRoute={(newR) => {
          setSelectedRoute(newR);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="cycling-tab-main">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-5 md:p-6 rounded-3xl shadow-xl text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/20 text-white">
              <Bike className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  {pl ? 'Trasy Rowerowe & Szlaki' : 'Cycling Routes & Trails'}
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                  {pl ? '5 Kategorii' : '5 Categories'}
                </span>
              </div>
              <p className="text-slate-300 text-xs md:text-sm mt-1 font-medium max-w-xl">
                {pl 
                  ? 'Wybierz rodzaj trasy: leśną, polną, terenową, turystyczną lub długodystansową. Dodaj własną trasę ze startem z GPS i komentuj szlaki innych podróżników!' 
                  : 'Choose by category: forest, countryside, off-road, touring or long-distance. Add your own route and comment on trails!'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Add Custom Route Button */}
            <button
              type="button"
              id="add-custom-route-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-4 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-102 active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>{pl ? 'Dodaj Swoją Trasę ➕' : 'Add Your Route ➕'}</span>
            </button>

            {/* AI Generator Toggle Button */}
            <button
              type="button"
              onClick={() => setShowAiBuilder(!showAiBuilder)}
              className={`flex-1 sm:flex-none font-black text-xs px-4 py-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                showAiBuilder
                  ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{showAiBuilder ? (pl ? 'Ukryj Generator' : 'Hide AI') : (pl ? 'Kreator IA 🤖' : 'AI Planner 🤖')}</span>
            </button>
          </div>
        </div>

        {/* 2. Primary 5-Category Filter Tabs (Strict User Requirement) */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>{pl ? 'Wybierz rodzaj trasy, którą chcesz jechać:' : 'Select route style you want to ride:'}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {filteredRoutes.length} {pl ? 'dostępnych tras' : 'available routes'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {CATEGORY_TABS.map((tab) => {
              const isSelected = selectedCategory === tab.key;
              const count = countForCategory(tab.key);
              return (
                <button
                  key={tab.key}
                  id={`cat-filter-${tab.key}`}
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1 group ${
                    isSelected
                      ? 'bg-gradient-to-b from-indigo-600 to-indigo-700 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                      : 'bg-slate-800/90 border-slate-700/80 text-slate-300 hover:bg-slate-750 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">{tab.icon}</span>
                  <span className="text-[11px] font-black leading-tight line-clamp-1">
                    {pl ? tab.labelPl : tab.labelEn}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-indigo-900/80 text-indigo-200' : 'bg-slate-900 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Search & Country filter Bar */}
        <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={pl ? 'Szukaj trasy po nazwie, mieście, startu, nawierzchni...' : 'Search by name, city, surface...'}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCountryFilter}
              onChange={(e) => setSelectedCountryFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-indigo-300 font-bold outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">{pl ? '🌍 Wszystkie kraje' : '🌍 All Countries'}</option>
              <option value="Poland">🇵🇱 Polska</option>
              <option value="Netherlands">🇳🇱 Holandia</option>
              <option value="Germany">🇩🇪 Niemcy</option>
              <option value="Belgium">🇧🇪 Belgia</option>
              <option value="France">🇫🇷 Francja</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Route Builder Panel (Collapsible) */}
      {showAiBuilder && (
        <div className="bg-slate-900 text-white border border-indigo-500/40 p-5 md:p-6 rounded-3xl shadow-2xl space-y-5 animate-fade-in" id="cycling-ai-builder">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-600 p-2 rounded-xl text-white font-mono text-base shadow-sm">🤖</div>
              <div>
                <h3 className="font-black text-base text-white tracking-tight flex items-center gap-2">
                  <span>{pl ? 'Osobisty Kreator Tras Rowerowych IA' : 'AI Cycling Route Planner'}</span>
                  <span className="text-xs bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold">
                    v2.5
                  </span>
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  {pl ? 'Wybierz rodzaj trasy, wpisz skąd chcesz wyruszyć – Tadzik wygeneruje optymalny szlak z mądrymi wskazówkami!' : 'Choose style and start spot – Tadzik plans the ideal bike route!'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAiBuilder(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Country */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-indigo-300">
                1. {pl ? 'Kraj podróży:' : 'Country:'}
              </label>
              <select
                value={aiCountry}
                onChange={(e) => {
                  setAiCountry(e.target.value);
                  if (e.target.value === 'Poland') setAiStartCity('Poznań');
                  if (e.target.value === 'Netherlands') setAiStartCity('Rotterdam');
                  if (e.target.value === 'Germany') setAiStartCity('Berlin');
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Poland">🇵🇱 Polska</option>
                <option value="Netherlands">🇳🇱 Holandia</option>
                <option value="Germany">🇩🇪 Niemcy</option>
                <option value="Belgium">🇧🇪 Belgia</option>
                <option value="France">🇫🇷 Francja</option>
              </select>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-indigo-300">
                2. {pl ? 'Miasto lub Rejon:' : 'City / Region:'}
              </label>
              <input
                type="text"
                value={aiStartCity}
                onChange={(e) => setAiStartCity(e.target.value)}
                placeholder="np. Poznań, Gdańsk, Rotterdam, Amsterdam..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold placeholder:text-slate-500 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Start & End Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-emerald-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>3. {pl ? 'Skąd wyruszasz? (Start):' : 'Starting Spot:'}</span>
              </label>
              <input
                type="text"
                value={aiStartPoint}
                onChange={(e) => setAiStartPoint(e.target.value)}
                placeholder={pl ? 'np. Dworzec Główny, Jezioro Malta, Molo...' : 'e.g. Central Station, Beach, Lake...'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-rose-400 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5" />
                <span>4. {pl ? 'Dokąd chcesz dojechać? (Meta / Pętla):' : 'Destination / Endpoint:'}</span>
              </label>
              <input
                type="text"
                value={aiEndPoint}
                onChange={(e) => setAiEndPoint(e.target.value)}
                placeholder={pl ? 'np. Puszcza Zielonka, Zamek, Plaża, Pętla...' : 'e.g. Nature Reserve, Castle, Loop...'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Route Category in AI Planner (5 categories) */}
          <div className="space-y-2">
            <label className="block text-[11px] font-black uppercase text-amber-300">
              5. {pl ? 'Wybierz rodzaj generowanej trasy:' : 'Select Route Category:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {(Object.keys(CATEGORY_CONFIG) as CyclingCategory[]).map((catKey) => {
                const conf = CATEGORY_CONFIG[catKey];
                const isSelected = aiRouteType === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setAiRouteType(catKey)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-xl">{conf.icon}</span>
                    <span className="text-xs font-bold leading-tight">
                      {pl ? conf.labelPl : conf.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateRoute}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-black text-sm py-3.5 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 border border-indigo-400/30"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{pl ? 'Tadzik projektuje trasę rowerową...' : 'AI is planning your bike route...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{pl ? 'Wygeneruj Trasę Rowerową przez IA 🤖' : 'Generate Route with AI 🤖'}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Routes List */}
      <div className="space-y-6" id="cycling-routes-list">
        {filteredRoutes.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
            <span className="text-4xl">🚲</span>
            <h3 className="text-base font-bold text-white">
              {pl ? 'Brak tras pasujących do wybranych filtrów' : 'No routes matching selected filters'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {pl ? 'Zmień wybraną kategorię lub dodaj swoją własną trasę do aplikacji za pomocą przycisku "Dodaj Swoją Trasę"!' : 'Try selecting another category or add your custom route using the button above!'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSelectedCountryFilter('all');
              }}
              className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
            >
              {pl ? 'Pokaż wszystkie trasy' : 'Show all routes'}
            </button>
          </div>
        ) : (
          filteredRoutes.map((route) => {
            const catConf = CATEGORY_CONFIG[route.category] || CATEGORY_CONFIG.turystyczna;
            const isCommentsOpen = !!expandedComments[route.id];
            const isExtensionsOpen = !!expandedExtensions[route.id];

            // Calculate distance from user to route start point if coords exist
            let distFromUserKm: number | null = null;
            if (userCoords && route.startCoords) {
              distFromUserKm = Math.round(calculateHaversineDistanceKm(userCoords.lat, userCoords.lng, route.startCoords.lat, route.startCoords.lng) * 10) / 10;
            } else if (userCoords && route.destinationCoords) {
              distFromUserKm = Math.round(calculateHaversineDistanceKm(userCoords.lat, userCoords.lng, route.destinationCoords.lat, route.destinationCoords.lng) * 10) / 10;
            }

            const defaultPhoto = route.destinationImageUrl || (
              route.category === 'lesna' ? 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80' :
              route.category === 'polna' ? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80' :
              route.category === 'terenowa' ? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80' :
              route.category === 'dlugodystansowa' ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' :
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
            );

            return (
              <div
                key={route.id}
                id={`cycling-card-${route.id}`}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl overflow-hidden shadow-xl transition-all space-y-0 text-white group"
              >
                {/* 1. Destination Photo Banner (Zdjęcie miejsca do którego będziemy jechać) */}
                <div 
                  className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-950 cursor-pointer"
                  onClick={() => {
                    setSelectedRoute(route);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <img
                    src={defaultPhoto}
                    alt={route.destinationName || route.endPoint}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className={`text-[10px] sm:text-[11px] font-black uppercase px-2.5 py-1 rounded-xl border backdrop-blur-md shadow-md flex items-center gap-1.5 ${catConf.bgClass} ${catConf.borderClass} ${catConf.textClass}`}>
                      <span>{catConf.icon}</span>
                      <span>{pl ? catConf.labelPl : catConf.labelEn}</span>
                    </span>

                    <span className="text-xs font-black bg-slate-900/90 text-amber-300 border border-slate-700/80 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{route.rating || 5.0}</span>
                    </span>
                  </div>

                  {/* Destination Info Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                    <div className="space-y-1 max-w-lg">
                      <span className="text-[10px] font-black uppercase text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-md backdrop-blur-md">
                        🎯 {pl ? 'CEL PRZEJAŻDŻKI' : 'RIDE DESTINATION'}
                      </span>
                      <h4 className="text-sm sm:text-base md:text-lg font-black text-white drop-shadow line-clamp-1">
                        {route.destinationName || route.endPoint}
                      </h4>
                      <p className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span>{route.city}</span>
                      </p>
                    </div>

                    {distFromUserKm !== null && (
                      <div className="bg-slate-900/90 border border-indigo-500/40 backdrop-blur-md px-3 py-1.5 rounded-2xl text-right shrink-0 shadow-lg">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">{pl ? 'Od Ciebie' : 'From You'}</span>
                        <span className="text-xs sm:text-sm font-mono font-black text-amber-300">📍 {distFromUserKm} km</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Route Card Header */}
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3.5">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Community Badge */}
                      {route.isCommunity && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{pl ? 'Trasa Społeczności' : 'Community Route'}</span>
                        </span>
                      )}

                      {/* Country */}
                      <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                        <span>{route.country === 'Poland' ? '🇵🇱 Polska' : route.country === 'Netherlands' ? '🇳🇱 Holandia' : route.country}</span>
                      </span>
                    </div>

                    <h3 
                      onClick={() => {
                        setSelectedRoute(route);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-base sm:text-lg font-black text-white leading-tight cursor-pointer hover:text-emerald-300 transition-colors"
                    >
                      {route.title}
                    </h3>

                    {route.authorName && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <User className="w-3 h-3 text-indigo-400" />
                        <span>{pl ? 'Autor szlaku:' : 'Author:'} <strong className="text-slate-300">{route.authorName}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Right metrics */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{pl ? 'Dystans' : 'Distance'}</span>
                      <span className="text-sm font-black font-mono text-amber-300">{route.distanceKm} km</span>
                    </div>

                    {route.estimatedDuration && (
                      <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">{pl ? 'Szac. Czas' : 'Time'}</span>
                        <span className="text-xs font-black font-mono text-slate-200">{route.estimatedDuration}</span>
                      </div>
                    )}

                    <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{pl ? 'Trudność' : 'Difficulty'}</span>
                      <span className="text-xs font-black uppercase text-emerald-400">{route.difficulty}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body - Streamlined and high contrast */}
                <div className="p-4 sm:p-5 space-y-3.5">
                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium line-clamp-2">
                    {route.description}
                  </p>

                  {/* Start ➔ End Path Timeline */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs shadow-inner">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0">
                        {pl ? 'START' : 'START'}
                      </span>
                      <span className="font-bold text-white truncate">{route.startPoint}</span>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 rotate-90 sm:rotate-0 self-center shrink-0" />

                    <div className="flex items-center gap-2 min-w-0">
                      <span className="bg-rose-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0">
                        {pl ? 'META' : 'END'}
                      </span>
                      <span className="font-bold text-white truncate">{route.endPoint}</span>
                    </div>
                  </div>

                  {/* 💡 Essential Decision Attributes: Surface, Bike & Shade */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-950/50 border border-slate-800 p-2.5 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 block">{pl ? 'Rower:' : 'Bike:'}</span>
                      <span className="font-bold text-white truncate block">{route.recommendedBike?.split('/')[0]?.trim() || 'Trekking / Gravel'}</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800 p-2.5 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 block">{pl ? 'Nawierzchnia:' : 'Surface:'}</span>
                      <span className="font-bold text-slate-200 truncate block">{route.surface || (pl ? 'Asfalt & Szuter' : 'Paved & Gravel')}</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800 p-2.5 rounded-xl col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-bold text-slate-400 block">{pl ? 'Bezpieczeństwo:' : 'Safety:'}</span>
                      <span className="font-bold text-emerald-300 truncate block">{route.smartInsights?.safetyLevel || (pl ? 'Wydzielona trasa' : 'Dedicated path')}</span>
                    </div>
                  </div>

                  {/* Highlights (Top 2 for decision) */}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {route.highlights.slice(0, 2).map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-950/40 border border-slate-800/80 p-2 rounded-xl text-slate-300 text-xs font-medium">
                          <span className="text-amber-400">✨</span>
                          <span className="truncate">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* In-App Interactive Google Map Embed */}
                  {activeEmbeddedRoute?.id === route.id && (
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{pl ? 'Interaktywna Nawigacja Rowerowa Google Maps:' : 'Interactive Google Maps Route:'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveEmbeddedRoute(null)}
                          className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{pl ? 'Zamknij Mapę' : 'Close Map'}</span>
                        </button>
                      </div>
                      <InAppGoogleMapRoute
                        destination={`${route.endPoint}, ${route.city}`}
                        destinationTitle={route.title}
                        initialStartLocation={`${route.startPoint}, ${route.city}`}
                        initialTravelMode="bike"
                        city={route.city}
                        language={language}
                        onClose={() => setActiveEmbeddedRoute(null)}
                        autoStartNav={true}
                      />
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                    {/* Primary CTA: Choose this ride */}
                    <button
                      type="button"
                      id={`btn-select-ride-${route.id}`}
                      onClick={() => {
                        setSelectedRoute(route);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer hover:scale-102 active:scale-98 border border-emerald-400/40"
                    >
                      <Bike className="w-4 h-4 text-amber-300" />
                      <span>{pl ? 'Wybierz tę przejażdżkę 🚴 (Zdjęcie, Dystans, Pogoda)' : 'Select this Ride 🚴 (Photo, Distance, Weather)'}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />
                    </button>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                      {/* Save / Favorite Route Button */}
                      {(() => {
                        const isFav = (account?.favoriteCyclingRoutes || []).includes(route.id);
                        return (
                          <button
                            type="button"
                            id={`btn-fav-route-${route.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(route);
                            }}
                            className={`text-xs font-black px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                              isFav
                                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                                : 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-amber-300 border-slate-700 hover:border-amber-400/50'
                            }`}
                            title={isFav ? (pl ? 'W Twoich ulubionych (Profil)' : 'In favorites (Profile)') : (pl ? 'Zapisz do ulubionych (Profil)' : 'Save to favorites (Profile)')}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-slate-950 text-slate-950' : 'text-amber-400'}`} />
                            <span>
                              {isFav 
                                ? (pl ? 'W ulubionych ⭐' : 'Saved ⭐') 
                                : (pl ? 'Zapisz do ulubionych' : 'Save to Favorites')}
                            </span>
                          </button>
                        );
                      })()}

                      {/* Comments Toggle Button */}
                      <button
                        type="button"
                        id={`comments-toggle-${route.id}`}
                        onClick={() => toggleComments(route.id)}
                        className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isCommentsOpen
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                            : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:text-white hover:border-slate-600'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{pl ? 'Opinie' : 'Reviews'}</span>
                        <span className="text-[10px] bg-slate-900 text-amber-400 font-mono px-1.5 py-0.2 rounded-full font-bold">
                          ⭐ {route.rating || 5.0}
                        </span>
                      </button>

                      {/* Planner, End of Route & Nearby Extension Button */}
                      <button
                        type="button"
                        id={`extensions-toggle-${route.id}`}
                        onClick={() => toggleExtensions(route.id)}
                        className={`text-xs font-black px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isExtensionsOpen
                            ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white border-amber-300 shadow-lg ring-2 ring-amber-400/30'
                            : 'bg-slate-800/90 text-amber-300 border-amber-500/40 hover:bg-slate-750 hover:border-amber-400'
                        }`}
                      >
                        <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                        <span>{pl ? 'Atrakcje obok' : 'Nearby Spots'}</span>
                      </button>

                      {/* In-App Map Navigation Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (activeEmbeddedRoute?.id === route.id) {
                            setActiveEmbeddedRoute(null);
                          } else {
                            setActiveEmbeddedRoute({
                              id: route.id,
                              title: route.title,
                              start: `${route.startPoint}, ${route.city}`,
                              end: `${route.endPoint}, ${route.city}`,
                              city: route.city
                            });
                          }
                        }}
                        id={`cycle-map-toggle-${route.id}`}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
                      >
                        <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {activeEmbeddedRoute?.id === route.id 
                            ? (pl ? 'Ukryj Mapę' : 'Hide Map')
                            : (pl ? 'Mapa' : 'Map')}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 🚴 CYCLING ROUTE NEARBY EXTENSIONS & END-OF-TRIP PLANNER */}
                  {isExtensionsOpen && (
                    <CyclingRouteNearbyExtensions
                      route={route}
                      allRoutes={allAvailableRoutes}
                      language={language}
                      account={account}
                    />
                  )}

                  {/* 💬 INTERACTIVE COMMENTS SECTION FOR EVERY ROUTE */}
                  {isCommentsOpen && (
                    <CyclingRouteCommentsSection
                      routeId={route.id}
                      routeTitle={route.title}
                      language={language}
                      defaultAuthor={account?.username || account?.firstName}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Route Modal */}
      <AddCyclingRouteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRouteAdded={handleRouteAdded}
        language={language}
        defaultAuthor={account?.username || account?.firstName}
      />

      {/* Floating Favorite Notification Toast */}
      {favoriteToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 text-xs ${
            favoriteToast.isSaved 
              ? 'bg-slate-900 text-white border-amber-400/80 shadow-amber-500/20'
              : 'bg-slate-900 text-slate-200 border-slate-700'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{favoriteToast.isSaved ? '⭐' : '🗑️'}</span>
              <div>
                <p className="font-bold leading-snug">{favoriteToast.message}</p>
                {favoriteToast.isSaved && onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('account')}
                    className="text-[11px] font-black text-amber-300 hover:text-amber-200 underline mt-1 cursor-pointer block"
                  >
                    {pl ? 'Przejdź do Profilu (Zakładka Ulubione) ➔' : 'Go to Profile (Saved Routes) ➔'}
                  </button>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFavoriteToast(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
