/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserAccount, Language, translations, Attraction, Comment, RideOffer, TravelMode } from '../types';
import { SEEDED_ATTRACTIONS } from '../data/attractions';
import TadzikGuide from './TadzikGuide';
import AttractionCarpooling from './AttractionCarpooling';
import AddPlaceModal, { AttractionPhoto } from './AddPlaceModal';
import RouteWeatherModal from './RouteWeatherModal';
import CategoryDashboard from './CategoryDashboard';
import RecentlyViewedSection from './RecentlyViewedSection';
import { AttractionTransitOptions } from './AttractionTransitOptions';
import { 
  GpsLocationState, 
  getLiveGpsLocation, 
  calculateHaversineDistanceKm, 
  getAttractionCoordinates, 
  getAttractionTransitInfo, 
  formatDistance 
} from '../services/gpsTransitService';
import { generateSightseeingForecast } from '../data/weatherData';
import { 
  Search, 
  Heart, 
  MessageSquare, 
  Compass, 
  Send, 
  Info, 
  Clock, 
  Check, 
  Filter, 
  Camera, 
  Plus, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  MapPin, 
  ChevronRight,
  Award,
  Globe2,
  CheckCircle2,
  Navigation,
  Sun,
  CloudSun,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Mic,
  Star,
  ExternalLink,
  Zap,
  Tag,
  ArrowRight,
  HelpCircle,
  HardDrive,
  WifiOff,
  DownloadCloud,
  Trash2,
  ShieldCheck,
  Database
} from 'lucide-react';
import {
  getOfflineCachedAttractionIds,
  isAttractionOfflineCached,
  toggleAttractionOfflineCache,
  cacheAllAttractionsOffline,
  clearAllOfflineAttractions,
  getOfflineCacheSummary,
  subscribeToOfflineCacheUpdates
} from '../services/offlineAttractionCache';

interface ExploreTabProps {
  language: Language;
  account: UserAccount | null;
  onUpdateAccount: (acc: UserAccount | null) => void;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onNavigateTab?: (tab: any) => void;
}

// Initial starter comments
const INITIAL_COMMENTS: Comment[] = [
  { id: 'c1', attractionId: 'depot-boijmans', username: 'Klaas_55', text: 'Beautiful rooftop! Make sure you go 30 minutes before sunset for the best view.', createdAt: '2026-07-01' },
  { id: 'c2', attractionId: 'depot-boijmans', username: 'AgataTraveler', text: 'To cudowne miejsce. Wersja z lustrami zachwyca dzieci!', createdAt: '2026-07-02' },
  { id: 'c3', attractionId: 'vondelpark', username: 'Jan_K', text: 'Lekker rustig in de ochtend. Ideaal voor een vroege fietstocht.', createdAt: '2026-07-03' },
  { id: 'c4', attractionId: 'rijksmuseum', username: 'ElderlyExplorer', text: 'Cuypers library has desks for remote work, very silent and inspiring.', createdAt: '2026-07-04' }
];

// Initial pre-seeded high quality photos
const INITIAL_PHOTOS: Record<string, AttractionPhoto[]> = {
  'depot-boijmans': [
    { id: 'photo-boijmans-1', url: 'https://images.unsplash.com/photo-1616447154831-293f24032a1f?w=600&auto=format&fit=crop&q=80', caption: 'The stunning mirrored bowl reflecting Rotterdam sky.', addedBy: 'Klaas_55', date: '2026-07-01', hearts: 24 },
    { id: 'photo-boijmans-2', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80', caption: 'Stunning rooftop view of the city forest at sunset.', addedBy: 'Piet_Traveler', date: '2026-07-02', hearts: 18 }
  ],
  'kralingse-bos': [
    { id: 'photo-kralingse-1', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80', caption: 'Peaceful walking paths next to the water.', addedBy: 'Jan_K', date: '2026-07-03', hearts: 14 },
    { id: 'photo-kralingse-2', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&fit=crop&q=80', caption: 'Dappled sunlight through the trees in deer park.', addedBy: 'AgataTraveler', date: '2026-07-04', hearts: 31 }
  ],
  'rijksmuseum': [
    { id: 'photo-rijks-1', url: 'https://images.unsplash.com/photo-1601961405399-801fb1f34581?w=600&auto=format&fit=crop&q=80', caption: 'Historic façade of the grand museum.', addedBy: 'ElderlyExplorer', date: '2026-07-04', hearts: 56 },
    { id: 'photo-rijks-2', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80', caption: 'Looking into the magnificent Cuypers library.', addedBy: 'Traveler99', date: '2026-07-05', hearts: 42 }
  ],
  'amsterdamse-bos': [
    { id: 'photo-ambos-1', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80', caption: 'Serene canopy path in the early morning.', addedBy: 'ForestWalks', date: '2026-07-05', hearts: 9 },
    { id: 'photo-ambos-2', url: 'https://images.unsplash.com/photo-1500627869374-13cd993b1115?w=600&auto=format&fit=crop&q=80', caption: 'Organic goat farm feeding pens.', addedBy: 'FamilyFirst', date: '2026-07-06', hearts: 15 }
  ],
  'vondelpark': [
    { id: 'photo-vondel-1', url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600&auto=format&fit=crop&q=80', caption: 'The central bridge on a beautiful summer afternoon.', addedBy: 'VondelFan', date: '2026-07-06', hearts: 22 },
    { id: 'photo-vondel-2', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80', caption: 'Quiet pond side path under weeping willows.', addedBy: 'PeacefulMe', date: '2026-07-07', hearts: 19 }
  ],
  'dom-tower': [
    { id: 'photo-dom-1', url: 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=600&auto=format&fit=crop&q=80', caption: 'Dom Tower of Utrecht seen from the canals.', addedBy: 'UtrechtLocal', date: '2026-07-07', hearts: 35 },
    { id: 'photo-dom-2', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80', caption: 'Monastery garden Pandhof hidden oasis.', addedBy: 'SecretGardens', date: '2026-07-08', hearts: 27 }
  ],
  'maximapark': [
    { id: 'photo-maxima-1', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80', caption: 'Vibrant flowers in the Japanese butterfly gardens.', addedBy: 'Maximo', date: '2026-07-08', hearts: 11 }
  ],
  'plaswijckpark': [
    { id: 'photo-plas-1', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80', caption: 'Children pedal boat area surrounded by flowers.', addedBy: 'RotterdamMom', date: '2026-07-09', hearts: 25 }
  ],
  'krakow-kopiec-krakusa': [
    { id: 'photo-kopiec-1', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=80', caption: 'Breath-taking bird\'s-eye view from Kopiec Krakusa at sunset.', addedBy: 'JanekPl', date: '2026-07-10', hearts: 89 },
    { id: 'photo-kopiec-2', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format&fit=crop&q=80', caption: 'Aerial photography of green hills and pathways.', addedBy: 'TadzikFan', date: '2026-07-11', hearts: 64 }
  ],
  'krakow-wawel-square': [
    { id: 'photo-wawel-1', url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&auto=format&fit=crop&q=80', caption: 'Wawel Royal Castle rising above Vistula river.', addedBy: 'Krakus_99', date: '2026-07-09', hearts: 72 }
  ]
};

const DEFAULT_PLACE_PHOTO = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80';

const ATTRACTION_PHOTOS_MAP: Record<string, string> = {
  'depot-boijmans': 'https://images.unsplash.com/photo-1616447154831-293f24032a1f?w=800&auto=format&fit=crop&q=80',
  'kralingse-bos': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80',
  'rijksmuseum': 'https://images.unsplash.com/photo-1601961405399-801fb1f34581?w=800&auto=format&fit=crop&q=80',
  'amsterdamse-bos': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
  'vondelpark': 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&auto=format&fit=crop&q=80',
  'dom-tower': 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=800&auto=format&fit=crop&q=80',
  'maximapark': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80',
  'plaswijckpark': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
  'scheveningen-beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'spido-cruise': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
  'dudok-cafe': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
  'brussels-grand-place': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
  'antwerp-central-station': 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800&auto=format&fit=crop&q=80',
  'paris-eiffel-seine': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
  'berlin-brandenburg-gate': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
  'lazienki-park': 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&auto=format&fit=crop&q=80',
  'krakow-wawel-square': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=80',
  'krakow-kopiec-krakusa': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80'
};

const getAttractionPhoto = (att: Attraction, photosState?: Record<string, AttractionPhoto[]>): string => {
  if (photosState && photosState[att.id] && photosState[att.id].length > 0) {
    return photosState[att.id][0].url;
  }
  return ATTRACTION_PHOTOS_MAP[att.id] || DEFAULT_PLACE_PHOTO;
};

// Pre-seeded community ride offers (Carpooling)
const INITIAL_RIDE_OFFERS: RideOffer[] = [
  {
    id: 'ride-1',
    attractionId: 'depot-boijmans',
    type: 'offer',
    userName: 'Klaas_55 (Rotterdam)',
    date: 'Jutro, godz. 10:30',
    fromLocation: 'Rotterdam Centraal (Wyjście Południowe)',
    seatsAvailable: 3,
    totalSeats: 4,
    contactInfo: 'tel: +31 6 12345678',
    notes: 'Jedziemy w 2 osoby, mamy wolne tylne kanapy i duży bagażnik. Chętnie podwieziemy seniorów lub rodzinę z dzieckiem.',
    createdAt: '2026-08-12',
    passengers: ['Agata K.']
  },
  {
    id: 'ride-2',
    attractionId: 'krakow-wawel-square',
    type: 'offer',
    userName: 'Tomasz_Podróżnik (Kraków)',
    date: 'Jutro, godz. 09:30',
    fromLocation: 'Kraków Dworzec Główny / Galeria Krakowska',
    seatsAvailable: 2,
    totalSeats: 3,
    contactInfo: 'tel: +48 601 222 333',
    notes: 'Klimatyzowany SUV, zabiorę wózek dziecięcy lub sprzęt piknikowy.',
    createdAt: '2026-08-12',
    passengers: []
  },
  {
    id: 'ride-3',
    attractionId: 'vondelpark',
    type: 'request',
    userName: 'Marta & Janek',
    date: 'Sobota, godz. 11:00',
    fromLocation: 'Amsterdam Bijlmer ArenA / Station',
    seatsAvailable: 2,
    totalSeats: 2,
    contactInfo: 'email: marta.travels@example.com',
    notes: 'Szukamy miłego kierowcy na wspólny przejazd do Vondelparku z południa Amsterdamu. Chętnie dorzucimy się do paliwa!',
    createdAt: '2026-08-12',
    passengers: []
  },
  {
    id: 'ride-4',
    attractionId: 'rijksmuseum',
    type: 'offer',
    userName: 'Pieter_NL',
    date: 'Niedziela, godz. 10:00',
    fromLocation: 'Utrecht Centraal / Park & Ride',
    seatsAvailable: 3,
    totalSeats: 4,
    contactInfo: 'tel: +31 6 98765432',
    notes: 'Wyjazd z Utrechtu prosto pod Muzeum w Amsterdamie. Miła atmosfera, cicha muzyka.',
    createdAt: '2026-08-12',
    passengers: []
  }
];

export default function ExploreTab({ 
  language, 
  account, 
  onUpdateAccount,
  selectedCategory,
  onSelectCategory,
  onNavigateTab
}: ExploreTabProps) {
  const t = translations[language];

  // Active sub-tab inside ExploreTab: Attraction Catalog & Search (#1 Primary Tourism Hub) vs Assistant Guide
  const [activeExploreView, setActiveExploreView] = useState<'attractions' | 'assistant'>('attractions');

  // If user picks a specific category, switch view to attractions catalog
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      setActiveExploreView('attractions');
    }
  }, [selectedCategory]);

  // Core Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedVersion, setSelectedVersion] = useState<'adult' | 'child'>('adult');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<number>(200);
  const [quickFilter, setQuickFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [sortOption, setSortOption] = useState<'rating' | 'distance' | 'hearts' | 'price' | 'duration'>('rating');

  // Offline Cache System State
  const [offlineCachedIds, setOfflineCachedIds] = useState<Set<string>>(() => new Set(getOfflineCachedAttractionIds()));
  const [offlineCacheStats, setOfflineCacheStats] = useState(() => getOfflineCacheSummary());
  const [offlineFeedbackMsg, setOfflineFeedbackMsg] = useState<string | null>(null);

  // Subscribe to offline cache changes from any sub-component or storage sync
  useEffect(() => {
    const unsubscribe = subscribeToOfflineCacheUpdates(() => {
      setOfflineCachedIds(new Set(getOfflineCachedAttractionIds()));
      setOfflineCacheStats(getOfflineCacheSummary());
    });
    return unsubscribe;
  }, []);

  const handleToggleOffline = (att: Attraction, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const res = toggleAttractionOfflineCache(att);
    setOfflineFeedbackMsg(
      language === 'pl'
        ? (res.isCached ? `💾 Zapisano „${att.name}” w pamięci podręcznej offline! (Dostępne bez Internetu)` : `🗑️ Usunięto „${att.name}” z pamięci offline.`)
        : language === 'nl'
        ? (res.isCached ? `💾 "${att.name}" opgeslagen in offline cache!` : `🗑️ "${att.name}" verwijderd uit offline cache.`)
        : (res.isCached ? `💾 Saved "${att.name}" for offline use!` : `🗑️ Removed "${att.name}" from offline cache.`)
    );
    setTimeout(() => setOfflineFeedbackMsg(null), 3500);
  };

  const handleCacheAllOffline = () => {
    const count = cacheAllAttractionsOffline(allAttractions);
    setOfflineFeedbackMsg(
      language === 'pl'
        ? `💾 Zapisano wszystkie ${count} atrakcji w pamięci podręcznej offline wraz z mapami i rozkładami!`
        : language === 'nl'
        ? `💾 Alle ${count} attracties opgeslagen voor offline gebruik!`
        : `💾 Cached all ${count} attractions for offline use with full guides & maps!`
    );
    setTimeout(() => setOfflineFeedbackMsg(null), 4000);
  };

  const handleClearOfflineCache = () => {
    clearAllOfflineAttractions();
    setOfflineFeedbackMsg(
      language === 'pl'
        ? '🗑️ Wyczyszczono pamięć podręczną offline.'
        : language === 'nl'
        ? '🗑️ Offline cache gewist.'
        : '🗑️ Offline cache cleared.'
    );
    setTimeout(() => setOfflineFeedbackMsg(null), 3500);
  };

  // GPS User Location State (Default: Rotterdam Centraal, auto-updated with browser Geolocation)
  const [gpsState, setGpsState] = useState<GpsLocationState>(() => {
    try {
      const stored = localStorage.getItem('tadzik_user_gps_location');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      coords: { lat: 51.9244, lng: 4.4777 },
      status: 'idle',
      locationName: 'Rotterdam Centraal (51.9244°N, 4.4777°E)',
      accuracyMeters: 15
    };
  });

  const [selectedRouteTravelMode, setSelectedRouteTravelMode] = useState<TravelMode>('transit');

  // Check if user has explicitly granted GPS consent at registration or in settings
  const hasGpsConsent = Boolean(
    account?.privacyConsents?.geolocationConsent ??
    (typeof window !== 'undefined' && localStorage.getItem('tadzik_gps_consent_granted') === 'true')
  );

  // Note: Geolocation is only requested upon user action (e.g. clicking 'Odśwież GPS') or when registering a new account with consent
  // To avoid unprompted browser permission dialogs, no automatic GPS call is performed on initial component mount.

  const handleRefreshGps = () => {
    setGpsState(prev => ({ ...prev, status: 'locating' }));
    getLiveGpsLocation()
      .then((res) => {
        const newState: GpsLocationState = {
          coords: res.coords,
          status: 'success',
          locationName: res.locationName,
          accuracyMeters: res.accuracy,
          updatedAt: Date.now()
        };
        setGpsState(newState);
        try {
          localStorage.setItem('tadzik_user_gps_location', JSON.stringify(newState));
          localStorage.setItem('tadzik_gps_consent_granted', 'true');
        } catch (e) {}

        if (account && onUpdateAccount && !account.privacyConsents?.geolocationConsent) {
          const updatedAcc: UserAccount = {
            ...account,
            privacyConsents: {
              ...(account.privacyConsents || {
                termsAccepted: true,
                termsAcceptedAt: new Date().toISOString(),
                geolocationConsent: true,
                cameraConsent: false,
                marketingConsent: false,
                aiPersonalizationConsent: false,
                telemetryConsent: false,
                lastConsentUpdate: new Date().toISOString(),
                consentVersion: 'GDPR-2026.1'
              }),
              geolocationConsent: true,
              lastConsentUpdate: new Date().toISOString()
            }
          };
          try {
            localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAcc));
            localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAcc));
          } catch (e) {}
          onUpdateAccount(updatedAcc);
        }
      })
      .catch((err) => {
        setGpsState(prev => ({
          ...prev,
          status: 'error',
          errorMessage: err.message
        }));
      });
  };

  const handleSelectManualLocation = (name: string, lat: number, lng: number) => {
    const newState: GpsLocationState = {
      coords: { lat, lng },
      status: 'success',
      locationName: `${name} (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`,
      accuracyMeters: 5,
      updatedAt: Date.now()
    };
    setGpsState(newState);
    try {
      localStorage.setItem('tadzik_user_gps_location', JSON.stringify(newState));
    } catch (e) {}
  };

  // Recently Viewed & Searched Attractions State (Tailored for Seniors)
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('tadzik_recently_viewed_attractions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return ['depot-boijmans', 'krakow-wawel-square', 'rijksmuseum', 'vondelpark'];
  });

  const addToRecentlyViewed = (attractionId: string) => {
    if (!attractionId) return;
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== attractionId);
      const updated = [attractionId, ...filtered].slice(0, 12);
      try {
        localStorage.setItem('tadzik_recently_viewed_attractions', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleRemoveFromRecentlyViewed = (attractionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setRecentlyViewedIds((prev) => {
      const updated = prev.filter((id) => id !== attractionId);
      try {
        localStorage.setItem('tadzik_recently_viewed_attractions', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearAllRecentlyViewed = () => {
    setRecentlyViewedIds([]);
    try {
      localStorage.setItem('tadzik_recently_viewed_attractions', JSON.stringify([]));
    } catch (e) {}
  };

  const handleNavigateWithMode = (attraction: Attraction, mode: TravelMode) => {
    addToRecentlyViewed(attraction.id);
    setSelectedRouteTravelMode(mode);
    setSelectedRouteAttraction(attraction);
  };

  // Progressive rendering / batch pagination state for ultra-fast performance
  const [visibleCount, setVisibleCount] = useState<number>(18);
  const [highlightedAttractionId, setHighlightedAttractionId] = useState<string | null>(null);

  // Interactive quick inspection modal
  const [quickPreviewAttraction, setQuickPreviewAttraction] = useState<Attraction | null>(null);

  const handleOpenQuickPreview = (att: Attraction) => {
    addToRecentlyViewed(att.id);
    setQuickPreviewAttraction(att);
  };

  // City to country mapping for reliable cross-filter navigation
  const cityToCountry: Record<string, string> = {
    'Rotterdam': 'nl',
    'Amsterdam': 'nl',
    'Utrecht': 'nl',
    'The Hague': 'nl',
    'Brussels': 'be',
    'Antwerp': 'be',
    'Paris': 'fr',
    'Berlin': 'de',
    'Warsaw': 'pl',
    'Kraków': 'pl'
  };

  // Direct smooth selection of an attraction without filter conflict or jumping to bottom
  const handleDirectSelectAttraction = (targetAtt: Attraction) => {
    addToRecentlyViewed(targetAtt.id);
    setActiveExploreView('attractions');
    
    // Auto-align country if necessary
    const targetCountry = cityToCountry[targetAtt.city] || 'all';
    if (selectedCountry !== 'all' && selectedCountry !== targetCountry) {
      setSelectedCountry(targetCountry);
    }
    if (selectedCity !== 'all' && selectedCity !== targetAtt.city) {
      setSelectedCity('all');
    }
    setSearchQuery('');
    setQuickFilter('all');
    if (selectedMood !== 'all') {
      setSelectedMood('all');
    }
    if (selectedCategory !== 'all' && selectedCategory !== targetAtt.category) {
      onSelectCategory(targetAtt.category || 'all');
    }
    
    // Ensure the card is rendered in the current slice
    setVisibleCount((prev) => Math.max(prev, 150));
    setHighlightedAttractionId(targetAtt.id);
    
    setTimeout(() => {
      const elem = document.getElementById(`attraction-card-${targetAtt.id}`);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);

    setTimeout(() => {
      setHighlightedAttractionId(null);
    }, 3500);
  };

  // Search input reference for keyboard focus
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto search suggestions dropdown active state
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Voice speech recognition simulation state
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  // Synchronize category selection with version if it is toddler_park or adult_park
  useEffect(() => {
    if (selectedCategory === 'toddler_park') {
      setSelectedVersion('child');
    } else if (selectedCategory === 'adult_park') {
      setSelectedVersion('adult');
    }
  }, [selectedCategory]);

  // Keyboard shortcut listener ('/' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Likes/Hearts state for attractions
  const [heartsState, setHeartsState] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('nl_tourist_planner_hearts');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      'depot-boijmans': 124,
      'kralingse-bos': 89,
      'rijksmuseum': 256,
      'amsterdamse-bos': 74,
      'vondelpark': 143,
      'dom-tower': 112,
      'maximapark': 68,
      'plaswijckpark': 95,
      'scheveningen-beach': 167,
      'spido-cruise': 105,
      'dudok-cafe': 92,
      'brussels-grand-place': 210,
      'antwerp-central-station': 188,
      'paris-eiffel-seine': 340,
      'berlin-brandenburg-gate': 295,
      'lazienki-park': 230,
      'krakow-wawel-square': 310,
      'krakow-kopiec-krakusa': 195
    };
  });

  // User liked state
  const [userLikedState, setUserLikedState] = useState<Record<string, boolean>>({});

  // Comments state
  const [commentsState, setCommentsState] = useState<Comment[]>(() => {
    try {
      const stored = localStorage.getItem('nl_tourist_planner_comments');
      return stored ? JSON.parse(stored) : INITIAL_COMMENTS;
    } catch (e) {
      return INITIAL_COMMENTS;
    }
  });

  // Custom attractions added by users
  const [customAttractions, setCustomAttractions] = useState<Attraction[]>(() => {
    try {
      const stored = localStorage.getItem('nl_tourist_planner_custom_attractions');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Photo gallery state
  const [photosState, setPhotosState] = useState<Record<string, AttractionPhoto[]>>(() => {
    try {
      const stored = localStorage.getItem('nl_tourist_planner_photos');
      return stored ? JSON.parse(stored) : INITIAL_PHOTOS;
    } catch (e) {
      return INITIAL_PHOTOS;
    }
  });

  // New photo liked state
  const [photoLikedState, setPhotoLikedState] = useState<Record<string, boolean>>({});

  // Carpooling / Rideshare state
  const [rideOffers, setRideOffers] = useState<RideOffer[]>(() => {
    try {
      const stored = localStorage.getItem('nl_tourist_planner_ride_offers');
      return stored ? JSON.parse(stored) : INITIAL_RIDE_OFFERS;
    } catch (e) {
      return INITIAL_RIDE_OFFERS;
    }
  });

  const handleAddRideOffer = (newOffer: RideOffer) => {
    const updated = [newOffer, ...rideOffers];
    setRideOffers(updated);
    try {
      localStorage.setItem('nl_tourist_planner_ride_offers', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleReserveSeat = (offerId: string, passengerName: string, passengerContact: string) => {
    const updated = rideOffers.map((offer) => {
      if (offer.id === offerId && offer.seatsAvailable > 0) {
        return {
          ...offer,
          seatsAvailable: offer.seatsAvailable - 1,
          passengers: [...(offer.passengers || []), passengerName]
        };
      }
      return offer;
    });
    setRideOffers(updated);
    try {
      localStorage.setItem('nl_tourist_planner_ride_offers', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDeleteRideOffer = (offerId: string) => {
    const updated = rideOffers.filter((offer) => offer.id !== offerId);
    setRideOffers(updated);
    try {
      localStorage.setItem('nl_tourist_planner_ride_offers', JSON.stringify(updated));
    } catch (e) {}
  };

  // Trigger states for UI panels
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [isAddingPhotoForAttraction, setIsAddingPhotoForAttraction] = useState<string | null>(null);
  const [selectedRouteAttraction, setSelectedRouteAttraction] = useState<Attraction | null>(null);

  // Form states for adding photo to existing place
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoCaptionInput, setPhotoCaptionInput] = useState('');
  const [photoAddedByInput, setPhotoAddedByInput] = useState('');
  const [dragActivePhoto, setDragActivePhoto] = useState<string | null>(null);

  // New comment text input state
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [customCommenterName, setCustomCommenterName] = useState('');

  // Persist Comments
  const handleSaveComments = (newComments: Comment[]) => {
    setCommentsState(newComments);
    try {
      localStorage.setItem('nl_tourist_planner_comments', JSON.stringify(newComments));
    } catch (e) {
      console.error(e);
    }
  };

  // Persist Hearts
  const handleHeartToggle = (attractionId: string) => {
    const isLiked = userLikedState[attractionId];
    const newHeartsValue = (heartsState[attractionId] || 0) + (isLiked ? -1 : 1);
    const updatedHearts = {
      ...heartsState,
      [attractionId]: newHeartsValue
    };
    
    setHeartsState(updatedHearts);
    setUserLikedState({
      ...userLikedState,
      [attractionId]: !isLiked
    });

    try {
      localStorage.setItem('nl_tourist_planner_hearts', JSON.stringify(updatedHearts));
    } catch (e) {}

    // Add/remove from saved attractions list if logged in
    if (account) {
      let visitedList = [...account.visitedAttractions];
      if (!isLiked) {
        if (!visitedList.includes(attractionId)) visitedList.push(attractionId);
      } else {
        visitedList = visitedList.filter((id) => id !== attractionId);
      }

      const updatedAccount: UserAccount = {
        ...account,
        visitedAttractions: visitedList
      };
      onUpdateAccount(updatedAccount);
      try {
        localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
      } catch (e) {}
    }
  };

  // Like a specific photo in the community gallery
  const handleLikePhoto = (attractionId: string, photoId: string) => {
    const likeKey = `${attractionId}-${photoId}`;
    const wasLiked = photoLikedState[likeKey];
    
    const attractionPhotos = photosState[attractionId] || [];
    const updatedPhotosForAtt = attractionPhotos.map((p) => {
      if (p.id === photoId) {
        return {
          ...p,
          hearts: p.hearts + (wasLiked ? -1 : 1)
        };
      }
      return p;
    });

    const updatedAllPhotos = {
      ...photosState,
      [attractionId]: updatedPhotosForAtt
    };

    setPhotosState(updatedAllPhotos);
    setPhotoLikedState({
      ...photoLikedState,
      [likeKey]: !wasLiked
    });

    try {
      localStorage.setItem('nl_tourist_planner_photos', JSON.stringify(updatedAllPhotos));
    } catch (e) {}
  };

  const handleAddComment = (attractionId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = newCommentText[attractionId];
    if (!text || !text.trim()) return;

    const commenter = account ? account.username : (customCommenterName.trim() || 'Anonymous');

    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      attractionId,
      username: commenter,
      text: text.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [...commentsState, newComment];
    handleSaveComments(updated);
    
    setNewCommentText({
      ...newCommentText,
      [attractionId]: ''
    });
  };

  // Handle adding custom photos
  const submitCustomPhoto = (attractionId: string, photoUrlOrBase64: string) => {
    const userDisplay = account ? account.username : (photoAddedByInput.trim() || 'Anonymous');
    const displayCaption = photoCaptionInput.trim() || (language === 'nl' ? 'Nieuwe foto van reiziger' : 'New traveler photo');

    const newPhoto: AttractionPhoto = {
      id: `photo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      url: photoUrlOrBase64 || DEFAULT_PLACE_PHOTO,
      caption: displayCaption,
      addedBy: userDisplay,
      date: new Date().toISOString().split('T')[0],
      hearts: 1
    };

    const currentPhotos = photosState[attractionId] || [];
    const updatedPhotos = {
      ...photosState,
      [attractionId]: [...currentPhotos, newPhoto]
    };

    setPhotosState(updatedPhotos);
    try {
      localStorage.setItem('nl_tourist_planner_photos', JSON.stringify(updatedPhotos));
    } catch (e) {}

    // Reset inputs
    setPhotoUrlInput('');
    setPhotoCaptionInput('');
    setPhotoAddedByInput('');
    setIsAddingPhotoForAttraction(null);
  };

  // Base64 file reader helper
  const handlePhotoUploadLocal = (e: React.ChangeEvent<HTMLInputElement>, attractionId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        submitCustomPhoto(attractionId, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop events for Photo Gallery upload
  const handleDragPhoto = (e: React.DragEvent, attractionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActivePhoto(attractionId);
    } else if (e.type === "dragleave") {
      setDragActivePhoto(null);
    }
  };

  const handleDropPhoto = (e: React.DragEvent, attractionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActivePhoto(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        submitCustomPhoto(attractionId, reader.result as string);
      };
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  // Handle new place created from the timeless AddPlaceModal
  const handlePlaceCreated = (newPlace: Attraction, finalPhotosList: AttractionPhoto[]) => {
    const updatedPlaces = [newPlace, ...customAttractions];
    setCustomAttractions(updatedPlaces);
    try {
      localStorage.setItem('nl_tourist_planner_custom_attractions', JSON.stringify(updatedPlaces));
    } catch (err) {}

    const updatedPhotos = {
      ...photosState,
      [newPlace.id]: finalPhotosList
    };
    setPhotosState(updatedPhotos);
    try {
      localStorage.setItem('nl_tourist_planner_photos', JSON.stringify(updatedPhotos));
    } catch (err) {}

    // Dispatch global event so PassportTab immediately updates and displays the new sticker
    try {
      window.dispatchEvent(new Event('passport-stickers-updated'));
    } catch (e) {}

    if (account) {
      const visitedList = account.visitedAttractions || [];
      const collectedStamps = account.collectedStamps || [];
      const stickerId = newPlace.id.startsWith('sticker-') ? newPlace.id : `sticker-${newPlace.id}`;
      
      const updatedVisited = visitedList.includes(newPlace.id) ? visitedList : [newPlace.id, ...visitedList];
      const updatedStamps = collectedStamps.includes(stickerId) ? collectedStamps : [...collectedStamps, stickerId];

      const updatedAccount: UserAccount = {
        ...account,
        visitedAttractions: updatedVisited,
        collectedStamps: updatedStamps,
        stickerProofs: {
          ...(account.stickerProofs || {}),
          [stickerId]: {
            stickerId: stickerId,
            method: 'creator_badge',
            verifiedAt: new Date().toISOString(),
            details: `Autor i Twórca Miejsca: ${newPlace.name} (${newPlace.city})`,
            status: 'verified'
          }
        }
      };
      onUpdateAccount(updatedAccount);
      try {
        localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
      } catch (e) {}
    }

    setSelectedCity(newPlace.city as any);
  };

  // Voice Search prompt simulation
  const handleVoiceSearchToggle = () => {
    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }
    setIsListeningVoice(true);
    // Suggest popular quick terms or simulate voice transcription
    const voiceSamples = ['Rotterdam', 'Park', 'Muzeum', 'Amsterdam', 'Wawel', 'Kraków', 'Paryż', 'Zamek', 'Plaża'];
    const randomTerm = voiceSamples[Math.floor(Math.random() * voiceSamples.length)];

    setTimeout(() => {
      setSearchQuery(randomTerm);
      setIsListeningVoice(false);
    }, 1200);
  };

  // Merge default + custom attractions
  const allAttractions = useMemo(() => [...SEEDED_ATTRACTIONS, ...customAttractions], [customAttractions]);

  // Full Attraction objects for recently viewed list (Senior-friendly quick history hub)
  const recentlyViewedAttractions = useMemo(() => {
    const map = new Map<string, Attraction>();
    allAttractions.forEach((att) => map.set(att.id, att));
    return recentlyViewedIds
      .map((id) => map.get(id))
      .filter((att): att is Attraction => att !== undefined);
  }, [recentlyViewedIds, allAttractions]);

  // Country Mapping helper
  const countryByCity: Record<string, string> = {
    'Rotterdam': 'nl',
    'Amsterdam': 'nl',
    'Utrecht': 'nl',
    'The Hague': 'nl',
    'Brussels': 'be',
    'Antwerp': 'be',
    'Paris': 'fr',
    'Berlin': 'de',
    'Warsaw': 'pl',
    'Kraków': 'pl'
  };

  // Quick Preset Filters definitions with vibrant themes, gradients and animations
  const QUICK_PRESETS = [
    { 
      id: 'all', 
      label: language === 'pl' ? 'Wszystkie' : language === 'nl' ? 'Alles' : 'All', 
      icon: '🌟',
      badge: 'All',
      gradient: 'from-amber-500 via-amber-600 to-yellow-500',
      activeShadow: 'shadow-amber-500/25',
      lightStyle: 'bg-amber-50/80 hover:bg-amber-100/90 text-amber-950 border-amber-200/80 hover:border-amber-300',
      ringColor: 'ring-amber-400'
    },
    { 
      id: 'offline', 
      label: language === 'pl' 
        ? `Offline (${offlineCachedIds.size})` 
        : language === 'nl' 
        ? `Offline (${offlineCachedIds.size})` 
        : `Offline (${offlineCachedIds.size})`, 
      icon: '📶',
      gradient: 'from-indigo-600 via-blue-600 to-cyan-500',
      activeShadow: 'shadow-indigo-500/25',
      lightStyle: 'bg-indigo-50/80 hover:bg-indigo-100/90 text-indigo-950 border-indigo-200/80 hover:border-indigo-300',
      ringColor: 'ring-indigo-400'
    },
    { 
      id: 'monuments', 
      label: language === 'pl' ? 'Zabytki & Historia' : language === 'nl' ? 'Monumenten' : 'Monuments', 
      icon: '🏛️',
      gradient: 'from-orange-600 via-amber-600 to-amber-700',
      activeShadow: 'shadow-orange-500/25',
      lightStyle: 'bg-orange-50/80 hover:bg-orange-100/90 text-orange-950 border-orange-200/80 hover:border-orange-300',
      ringColor: 'ring-orange-400'
    },
    { 
      id: 'parks', 
      label: language === 'pl' ? 'Parki & Natura' : language === 'nl' ? 'Parken & Natuur' : 'Parks & Nature', 
      icon: '🌳',
      gradient: 'from-emerald-600 via-teal-600 to-green-600',
      activeShadow: 'shadow-emerald-500/25',
      lightStyle: 'bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-950 border-emerald-200/80 hover:border-emerald-300',
      ringColor: 'ring-emerald-400'
    },
    { 
      id: 'museums', 
      label: language === 'pl' ? 'Muzea & Sztuka' : language === 'nl' ? 'Musea & Kunst' : 'Museums', 
      icon: '🎨',
      gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
      activeShadow: 'shadow-purple-500/25',
      lightStyle: 'bg-purple-50/80 hover:bg-purple-100/90 text-purple-950 border-purple-200/80 hover:border-purple-300',
      ringColor: 'ring-purple-400'
    },
    { 
      id: 'beaches', 
      label: language === 'pl' ? 'Plaże & Woda' : language === 'nl' ? 'Strand & Water' : 'Beaches & Water', 
      icon: '🏖️',
      gradient: 'from-sky-500 via-cyan-600 to-blue-600',
      activeShadow: 'shadow-sky-500/25',
      lightStyle: 'bg-sky-50/80 hover:bg-sky-100/90 text-sky-950 border-sky-200/80 hover:border-sky-300',
      ringColor: 'ring-sky-400'
    },
    { 
      id: 'cafes', 
      label: language === 'pl' ? 'Kawiarnie' : language === 'nl' ? 'Cafés' : 'Cafés', 
      icon: '☕',
      gradient: 'from-rose-500 via-pink-600 to-red-500',
      activeShadow: 'shadow-rose-500/25',
      lightStyle: 'bg-rose-50/80 hover:bg-rose-100/90 text-rose-950 border-rose-200/80 hover:border-rose-300',
      ringColor: 'ring-rose-400'
    },
    { 
      id: 'free', 
      label: language === 'pl' ? 'Gratis (0 €)' : language === 'nl' ? 'Gratis (0 €)' : 'Free (0 €)', 
      icon: '🆓',
      gradient: 'from-emerald-600 via-lime-600 to-teal-700',
      activeShadow: 'shadow-lime-500/25',
      lightStyle: 'bg-lime-50/80 hover:bg-lime-100/90 text-lime-950 border-lime-300/80 hover:border-lime-400',
      ringColor: 'ring-lime-400'
    },
    { 
      id: 'top_rated', 
      label: language === 'pl' ? 'Top Oceny (4.8+)' : language === 'nl' ? 'Topscore' : 'Top Rated', 
      icon: '⭐',
      gradient: 'from-amber-500 via-yellow-500 to-amber-600',
      activeShadow: 'shadow-amber-500/25',
      lightStyle: 'bg-yellow-50/80 hover:bg-yellow-100/90 text-yellow-950 border-yellow-200/80 hover:border-yellow-300',
      ringColor: 'ring-yellow-400'
    },
    { 
      id: 'accessible', 
      label: language === 'pl' ? 'Bez barier' : language === 'nl' ? 'Toegankelijk' : 'Accessible', 
      icon: '♿',
      gradient: 'from-blue-600 via-indigo-600 to-sky-600',
      activeShadow: 'shadow-blue-500/25',
      lightStyle: 'bg-blue-50/80 hover:bg-blue-100/90 text-blue-950 border-blue-200/80 hover:border-blue-300',
      ringColor: 'ring-blue-400'
    },
    { 
      id: 'indoor', 
      label: language === 'pl' ? 'Pod dachem' : language === 'nl' ? 'Overdekt' : 'Indoor', 
      icon: '🌧️',
      gradient: 'from-violet-600 via-indigo-600 to-slate-700',
      activeShadow: 'shadow-violet-500/25',
      lightStyle: 'bg-violet-50/80 hover:bg-violet-100/90 text-violet-950 border-violet-200/80 hover:border-violet-300',
      ringColor: 'ring-violet-400'
    },
    { 
      id: 'outdoor', 
      label: language === 'pl' ? 'Na słońce' : language === 'nl' ? 'Buitenlucht' : 'Outdoor', 
      icon: '☀️',
      gradient: 'from-amber-500 via-orange-500 to-yellow-500',
      activeShadow: 'shadow-orange-500/25',
      lightStyle: 'bg-amber-50/80 hover:bg-amber-100/90 text-amber-950 border-amber-200/80 hover:border-amber-300',
      ringColor: 'ring-amber-400'
    }
  ];

  // Filter Algorithm with lightning-fast reactive checks
  const filteredAttractions = useMemo(() => {
    return allAttractions.filter((att) => {
      // 1. Country filter
      if (selectedCountry !== 'all') {
        const attCountry = countryByCity[att.city] || 'nl';
        if (attCountry !== selectedCountry) return false;
      }

      // 2. City filter
      if (selectedCity !== 'all' && att.city !== selectedCity) return false;
      
      // 3. Budget filter
      const budget = selectedVersion === 'adult' ? att.adultVersion.budget : att.childVersion.budget;
      if (budget > maxBudget) return false;

      // 4. Mood filter
      if (selectedMood !== 'all' && !att.moods.includes(selectedMood)) return false;

      // 5. Category from Sun & Clouds navigator
      if (selectedCategory && selectedCategory !== 'all') {
        if (selectedCategory === 'museum' && att.category !== 'museum') return false;
        if (selectedCategory === 'forest' && att.category !== 'forest') return false;
        if (selectedCategory === 'romantic' && att.category !== 'romantic' && !att.moods.includes('romantic sunset')) return false;
        if (selectedCategory === 'beach' && att.category !== 'beach') return false;
        if (selectedCategory === 'toddler_park' && att.category !== 'toddler_park' && att.category !== 'amusement_park' && att.category !== 'childrens_attraction') return false;
        if (selectedCategory === 'adult_park' && att.category !== 'adult_park' && att.category !== 'amusement_park') return false;
        if (selectedCategory === 'historical' && att.category !== 'historical' && att.category !== 'historical_site') return false;
        if (selectedCategory === 'park' && att.category !== 'park') return false;
        if (selectedCategory === 'waterway' && att.category !== 'waterway') return false;
        if (selectedCategory === 'restaurant_cafe' && att.category !== 'restaurant_cafe') return false;
      }

      // 6. Quick Presets
      if (quickFilter === 'offline') {
        if (!offlineCachedIds.has(att.id)) return false;
      }
      if (quickFilter === 'free' && budget > 0) return false;
      if (quickFilter === 'monuments' && att.category !== 'historical_site' && att.category !== 'historical') return false;
      if (quickFilter === 'parks' && att.category !== 'park' && att.category !== 'forest') return false;
      if (quickFilter === 'museums' && att.category !== 'museum') return false;
      if (quickFilter === 'beaches' && att.category !== 'beach' && att.category !== 'waterway') return false;
      if (quickFilter === 'cafes' && att.category !== 'restaurant_cafe') return false;
      if (quickFilter === 'indoor' && (att.category === 'park' || att.category === 'beach' || att.category === 'forest')) return false;
      if (quickFilter === 'outdoor' && att.category === 'museum') return false;
      if (quickFilter === 'top_rated') {
        const hearts = heartsState[att.id] || 0;
        if (hearts < 100) return false;
      }

      // 7. Search query matching across title, city, region, descriptions, moods, comments
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = att.name.toLowerCase().includes(q);
        const matchesCity = att.city.toLowerCase().includes(q);
        const matchesRegion = att.region.toLowerCase().includes(q);
        const matchesCategory = att.category.toLowerCase().includes(q);
        const matchesAdultDesc = att.adultVersion.description.toLowerCase().includes(q);
        const matchesChildDesc = att.childVersion.description.toLowerCase().includes(q);
        const matchesMoods = att.moods.some((m) => m.toLowerCase().includes(q));
        const itemComments = commentsState.filter((c) => c.attractionId === att.id);
        const matchesComment = itemComments.some((c) => c.text.toLowerCase().includes(q));
        
        if (!matchesName && !matchesCity && !matchesRegion && !matchesCategory && !matchesAdultDesc && !matchesChildDesc && !matchesMoods && !matchesComment) {
          return false;
        }
      }

      return true;
    });
  }, [allAttractions, selectedCountry, selectedCity, selectedVersion, maxBudget, selectedMood, selectedCategory, quickFilter, searchQuery, heartsState, commentsState, offlineCachedIds]);

  // Sorting
  const displayedAttractions = useMemo(() => {
    const list = [...filteredAttractions];
    list.sort((a, b) => {
      if (sortOption === 'rating') {
        const aScore = (heartsState[a.id] || 0) + (commentsState.filter(c => c.attractionId === a.id).length * 10);
        const bScore = (heartsState[b.id] || 0) + (commentsState.filter(c => c.attractionId === b.id).length * 10);
        return bScore - aScore;
      }
      if (sortOption === 'hearts') {
        return (heartsState[b.id] || 0) - (heartsState[a.id] || 0);
      }
      if (sortOption === 'price') {
        const aBudget = selectedVersion === 'adult' ? a.adultVersion.budget : a.childVersion.budget;
        const bBudget = selectedVersion === 'adult' ? b.adultVersion.budget : b.childVersion.budget;
        return aBudget - bBudget;
      }
      if (sortOption === 'duration') {
        const aDur = selectedVersion === 'adult' ? a.adultVersion.durationMinutes : a.childVersion.durationMinutes;
        const bDur = selectedVersion === 'adult' ? b.adultVersion.durationMinutes : b.childVersion.durationMinutes;
        return aDur - bDur;
      }
      if (sortOption === 'distance') {
        const userLat = gpsState.coords?.lat || 51.9244;
        const userLng = gpsState.coords?.lng || 4.4777;
        const coordsA = getAttractionCoordinates(a);
        const coordsB = getAttractionCoordinates(b);
        const distA = calculateHaversineDistanceKm(userLat, userLng, coordsA.lat, coordsA.lng);
        const distB = calculateHaversineDistanceKm(userLat, userLng, coordsB.lat, coordsB.lng);
        return distA - distB;
      }
      return 0;
    });
    return list;
  }, [filteredAttractions, sortOption, heartsState, commentsState, selectedVersion, gpsState.coords]);

  // Autocomplete suggestions based on current search input
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 1) return [];
    const q = searchQuery.toLowerCase().trim();
    return allAttractions
      .filter((att) => att.name.toLowerCase().includes(q) || att.city.toLowerCase().includes(q))
      .slice(0, 5);
  }, [searchQuery, allAttractions]);

  // Reset visible slice on filter/sort changes to keep UI lightning fast
  useEffect(() => {
    setVisibleCount(18);
  }, [selectedCountry, selectedCity, selectedCategory, quickFilter, selectedMood, maxBudget, searchQuery, sortOption]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('all');
    setSelectedCity('all');
    setSelectedMood('all');
    setMaxBudget(200);
    setQuickFilter('all');
    onSelectCategory('all');
    setVisibleCount(18);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCountry !== 'all' || selectedCity !== 'all' || selectedMood !== 'all' || maxBudget < 200 || quickFilter !== 'all' || (selectedCategory && selectedCategory !== 'all');

  // Cleanly switch sub-views without unwanted scrolling to the bottom of the page
  const handleSwitchExploreView = (view: 'attractions' | 'assistant') => {
    setActiveExploreView(view);
    setTimeout(() => {
      const switcher = document.getElementById('explore-subview-switcher');
      if (switcher) {
        switcher.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div className="space-y-6" id="explore-tab-main">
      
      {/* Sub-view Switcher (High contrast & senior-friendly) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-sm" id="explore-subview-switcher">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleSwitchExploreView('attractions')}
            id="subview-btn-attractions"
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-sm md:text-base transition-all duration-200 cursor-pointer ${
              activeExploreView === 'attractions'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                : 'text-slate-700 hover:text-indigo-700 hover:bg-slate-100'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${activeExploreView === 'attractions' ? 'text-amber-300' : 'text-amber-500'}`} />
            <span>{language === 'pl' ? '🏰 Odkrywaj Miejsca & Atrakcje' : language === 'nl' ? '🏰 Ontdek Plekken & Attracties' : '🏰 Discover Places & Attractions'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchExploreView('assistant')}
            id="subview-btn-assistant"
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-sm md:text-base transition-all duration-200 cursor-pointer ${
              activeExploreView === 'assistant'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                : 'text-slate-700 hover:text-indigo-700 hover:bg-slate-100'
            }`}
          >
            <Compass className={`w-5 h-5 ${activeExploreView === 'assistant' ? 'text-amber-300' : 'text-indigo-600'}`} />
            <span>{language === 'pl' ? '🧭 Asystent Tadzik & Porady' : language === 'nl' ? '🧭 Tadzik Reisgids' : '🧭 Tadzik Travel Guide'}</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-500 pr-2">
          {activeExploreView === 'attractions' ? (
            <span className="bg-amber-50 text-amber-800 px-3 py-1 rounded-lg border border-amber-200/60">
              ✦ Ponad 250+ miejsc • Słoneczko Kategorii • Filtry • Pogoda • Połączenia kolejowe
            </span>
          ) : (
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-100">
              ✦ Czat AI • Planer Trasy • Kalkulator Budżetu • Niezbędnik Seniora
            </span>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: TADZIK AI TRAVEL COMPANION & SENIOR GUIDE         */}
      {/* ========================================================= */}
      {activeExploreView === 'assistant' && (
        <section className="w-full bg-slate-50 rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden" id="tadzik-guide-explore-wrapper">
          <TadzikGuide 
            language={language} 
            account={account} 
            onUpdateAccount={(updated) => onUpdateAccount(updated)}
          />
        </section>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: 250+ ATTRACTIONS CATALOG & DISCOVERY HUB          */}
      {/* ========================================================= */}
      {activeExploreView === 'attractions' && (
        <>
          {/* ULTRA-MODERN DISCOVERY HERO BANNER */}
          <div 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 md:p-10 border border-indigo-800/40 shadow-2xl space-y-6" 
            id="explore-banner"
          >
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-gradient-to-b from-amber-400/20 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              
              {/* Left Column: Vision & Typography */}
              <div className="space-y-4 text-center lg:text-left max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 px-3.5 py-1 rounded-full backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    {language === 'pl' ? 'Wspólna Baza Odkryć Europy' : language === 'nl' ? 'Europese Ontdekkingskaart' : "Europe's Shared Discovery Map"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  {language === 'pl' 
                    ? 'Szybkie Wyszukiwanie & Odkrycia ✦' 
                    : language === 'nl' 
                    ? 'Snel Zoeken & Ontdekken ✦' 
                    : 'Lightning Fast Discovery ✦'}
                </h2>

                <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
                  {language === 'pl' 
                    ? 'Błyskawicznie przeszukuj ponad 250 niezwykłych miejsc w Holandii, Belgii, Francji, Niemczech i Polsce. Filtruj według budżetu, dojazdu, pogody, udogodnień dla seniorów lub rodzin z dziećmi.'
                    : language === 'nl'
                    ? "Bliksemsnel zoeken in meer dan 250 locaties in 5 landen. Filter op budget, reistijd, weer en toegankelijkheid voor iedereen."
                    : "Instantly search 250+ remarkable landmarks across 5 countries. Filter by budget, weather, transit, and senior or family accessibility."}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-xl text-xs font-bold text-slate-200">
                    <Globe2 className="w-3.5 h-3.5 text-amber-300" />
                    {language === 'pl' ? '5 Krajów Europy' : '5 European Countries'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-xl text-xs font-bold text-slate-200">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    {language === 'pl' ? 'Wyszukiwanie w czasie rzeczywistym' : 'Real-time Instant Search'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-xl text-xs font-bold text-slate-200">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    {language === 'pl' ? '+50 XP w Paszporcie za nowe miejsce' : '+50 Passport XP'}
                  </span>
                </div>
              </div>

              {/* Right Column: CTA Box */}
              <div className="relative z-10 w-full lg:w-auto flex flex-col items-center justify-center gap-3">
                <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center gap-4 text-center w-full sm:w-80">
                  
                  <div className="flex items-center justify-center gap-3 text-3xl">
                    <span className="animate-bounce" title="Car">🚗</span>
                    <span className="text-xl font-black text-amber-300 animate-pulse">✦</span>
                    <span className="animate-pulse" title="Leaf">🌿</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">
                      {language === 'pl' ? 'Znasz wyjątkowe miejsce?' : 'Know a hidden spot?'}
                    </h4>
                    <p className="text-[11px] text-indigo-200 font-medium">
                      {language === 'pl' ? 'Dodaj wpis i podziel się ze społecznością' : 'Add it to our live traveler map'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingPlace(true)}
                    id="btn-suggest-place-trigger"
                    className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-xl shadow-amber-500/25 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 group border border-amber-300"
                  >
                    <Plus className="w-5 h-5 text-slate-950 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
                    <span>{language === 'pl' ? 'DODAJ NOWE MIEJSCE' : language === 'nl' ? 'VOEG NIEUWE PLEK TOE' : 'ADD NEW SPOT'}</span>
                    <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
                  </button>

                </div>
              </div>

            </div>
          </div>

          {/* Słoneczko i Chmurki Kategorii z bezpośrednim wyborem kraju */}
          <CategoryDashboard 
            language={language}
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => {
              setQuickFilter('all');
              onSelectCategory(catId);
              setActiveExploreView('attractions');
            }}
            onNavigateTab={onNavigateTab || (() => {})}
            selectedCountry={selectedCountry}
            onSelectCountry={(country) => {
              setSelectedCountry(country);
              setSelectedCity('all');
            }}
            onSelectAttraction={handleDirectSelectAttraction}
            onPlanRoute={(att, mode) => handleNavigateWithMode(att, mode || 'car')}
            userCoords={gpsState.coords}
            userLocationName={gpsState.locationName}
            account={account}
          />
        </>
      )}

      {/* ========================================================= */}
      {/* TIMELESS ADD PLACE MODAL                                 */}
      {/* ========================================================= */}
      <AddPlaceModal
        isOpen={isAddingPlace}
        onClose={() => setIsAddingPlace(false)}
        language={language}
        account={account}
        onPlaceCreated={handlePlaceCreated}
      />

      {/* When in Attractions view, show Search Engine and Results */}
      {activeExploreView === 'attractions' && (
        <>

      {/* ========================================================= */}
      {/* 🕒 OSTATNIO PRZEGLĄDANE & WYSZUKIWANE ATRAKCJE             */}
      {/* ========================================================= */}
      <RecentlyViewedSection
        language={language}
        recentlyViewedAttractions={recentlyViewedAttractions}
        onSelectAttraction={handleDirectSelectAttraction}
        onOpenQuickPreview={(att) => {
          addToRecentlyViewed(att.id);
          setQuickPreviewAttraction(att);
        }}
        onNavigateToAttraction={(att) => handleNavigateWithMode(att, 'transit')}
        onRemoveFromRecentlyViewed={handleRemoveFromRecentlyViewed}
        onClearAllRecentlyViewed={handleClearAllRecentlyViewed}
        getPhoto={(att) => getAttractionPhoto(att, photosState)}
        heartsState={heartsState}
        userLikedState={userLikedState}
        onToggleHeart={handleHeartToggle}
        selectedVersion={selectedVersion}
        isOfflineCached={(id) => offlineCachedIds.has(id)}
        onToggleOffline={handleToggleOffline}
        onQuickAddRecommended={(att) => {
          addToRecentlyViewed(att.id);
          setQuickPreviewAttraction(att);
        }}
        allAttractions={allAttractions}
      />

      {/* ========================================================= */}
      {/* 🚀 ULTRA-MODERN & LIGHTNING FAST SEARCH ENGINE COMMAND HUB */}
      {/* ========================================================= */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-slate-50/70 to-indigo-50/30 border border-slate-200/90 shadow-xl p-5 sm:p-7 md:p-8 space-y-6"
        id="modern-search-engine-hub"
      >
        {/* Subtle decorative glowing background accents */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Search latency / metrics tag */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/30 text-sm">
                🔍
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{language === 'pl' ? 'Wyszukiwarka Odkryć & Atrakcji' : language === 'nl' ? 'Slimme Attractiezoeker' : 'Smart Discovery Search'}</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200">
                  Smart AI Hub
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {language === 'pl' ? 'Wpisz miasto, zabytek, park lub wybierz jeden z interaktywnych filtrów poniżej:' : 'Search by name, city, vibe, or pick an interactive filter below:'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border border-emerald-300 text-xs font-black px-3.5 py-1.5 rounded-full shadow-xs">
              <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 animate-pulse" />
              <span>{displayedAttractions.length} {language === 'pl' ? 'miejsc' : language === 'nl' ? 'locaties' : 'places'}</span>
              <span className="text-emerald-700/80 font-mono text-[10px] bg-emerald-100/80 px-1.5 py-0.5 rounded-full">0.01s</span>
            </span>

            {hasActiveFilters && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-full cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
                title="Wyczyść wszystkie filtry"
              >
                <X className="w-3.5 h-3.5" />
                <span>{language === 'pl' ? 'Wyczyść filtry' : 'Filters wissen'}</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Big Modern Floating Search Command Bar with Dynamic Focus Glow */}
        <div className="relative z-10">
          <div className="relative flex items-center group">
            <div className="absolute left-4 pointer-events-none flex items-center justify-center">
              <Search className="w-5 h-5 text-indigo-600 transition-transform group-focus-within:scale-110 duration-200 stroke-[2.5]" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              id="explore-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={
                language === 'pl'
                  ? 'Wyszukaj miasto, atrakcję lub wpisz słowo kluczowe (np. „Rotterdam”, „Wawel”, „Vondelpark”, „Kawiarnia”, „Rower”)...'
                  : language === 'nl'
                  ? 'Zoek stad, attractie of trefwoord (bijv. "Rotterdam", "Rijksmuseum", "Vondelpark", "Park", "Fiets")...'
                  : 'Search landmark, city, or keyword (e.g. "Rotterdam", "Vondelpark", "Rijksmuseum", "Bike", "Cafe")...'
              }
              className="w-full text-base sm:text-lg font-bold pl-12 pr-32 py-4 bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-slate-200 text-slate-900 shadow-sm focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-400 placeholder:font-medium hover:border-slate-300"
            />

            {/* Right inside actions: Clear (X), Voice, and Keyboard hint */}
            <div className="absolute right-3 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer transition-colors"
                  title="Wyczyść frazę"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handleVoiceSearchToggle}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isListeningVoice
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white border-rose-600 animate-pulse shadow-md shadow-rose-500/30'
                    : 'bg-slate-100 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200 hover:border-indigo-300'
                }`}
                title={language === 'pl' ? 'Wyszukiwanie głosowe' : 'Spraakgestuurd zoeken'}
              >
                <Mic className={`w-4 h-4 ${isListeningVoice ? 'animate-bounce' : ''}`} />
                {isListeningVoice && <span className="text-[10px] font-black uppercase tracking-wider">{language === 'pl' ? 'Słucham...' : 'Luisteren...'}</span>}
              </button>

              <kbd className="hidden md:inline-flex items-center px-2 py-1 text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-300/80 rounded-lg shadow-2xs">
                /
              </kbd>
            </div>
          </div>

          {/* Instant Autocomplete Suggestions Popover */}
          {showSuggestions && searchSuggestions.length > 0 && searchQuery.trim().length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl z-30 p-2 space-y-1"
            >
              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                {language === 'pl' ? 'Szybkie podpowiedzi wyszukiwania:' : 'Snelle suggesties:'}
              </div>
              {searchSuggestions.map((sug) => (
                <button
                  key={sug.id}
                  type="button"
                  onClick={() => {
                    setShowSuggestions(false);
                    handleDirectSelectAttraction(sug);
                  }}
                  className="w-full flex items-center justify-between p-2.5 hover:bg-indigo-50/80 rounded-xl transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={getAttractionPhoto(sug, photosState)}
                      alt={sug.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {sug.name}
                      </h5>
                      <span className="text-[10px] text-slate-500 font-medium">
                        📍 {sug.city}, {sug.region} • <strong className="text-amber-600">€{sug.adultVersion.budget}</strong>
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* 1-Click Quick-Tag Intent Ribbon (Vibrant colors & Animated Icons) */}
        <div className="relative z-10 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-slate-700 font-black">{language === 'pl' ? 'Najpopularniejsze filtry tematyczne:' : 'Populaire snelle thema filters:'}</span>
            </span>
            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              {language === 'pl' ? '1-klik filtrowanie' : '1-klik filter'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-0.5">
            {QUICK_PRESETS.map((preset) => {
              const isActive = quickFilter === preset.id;
              return (
                <motion.button
                  key={preset.id}
                  type="button"
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setQuickFilter(isActive ? 'all' : preset.id);
                  }}
                  className={`group relative px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                    isActive
                      ? `bg-gradient-to-r ${preset.gradient} text-white shadow-lg ${preset.activeShadow} ring-2 ${preset.ringColor} border-transparent`
                      : `${preset.lightStyle} shadow-2xs`
                  }`}
                >
                  <span className="text-base transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6 inline-block">
                    {preset.icon}
                  </span>
                  <span>{preset.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Country & City Fast Tabs (Multi-Tier Navigation) */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>{language === 'pl' ? 'Kraje & Miasta w Europie:' : 'Landen & Steden in Europa:'}</span>
            </label>

            {/* Country Selector Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: language === 'pl' ? 'Wszystkie kraje 🌍' : 'All countries 🌍' },
                { id: 'nl', label: '🇳🇱 Holandia' },
                { id: 'be', label: '🇧🇪 Belgia' },
                { id: 'fr', label: '🇫🇷 Francja' },
                { id: 'de', label: '🇩🇪 Niemcy' },
                { id: 'pl', label: '🇵🇱 Polska' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCountry(c.id);
                    setSelectedCity('all');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer border ${
                    selectedCountry === c.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* City Chips */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { value: 'all', label: language === 'pl' ? 'Wszystkie miasta' : 'Alle steden', flag: '🌍', count: allAttractions.length },
              { value: 'Rotterdam', label: 'Rotterdam', flag: '🇳🇱', country: 'nl' },
              { value: 'Amsterdam', label: 'Amsterdam', flag: '🇳🇱', country: 'nl' },
              { value: 'Utrecht', label: 'Utrecht', flag: '🇳🇱', country: 'nl' },
              { value: 'Brussels', label: 'Brussels', flag: '🇧🇪', country: 'be' },
              { value: 'Antwerp', label: 'Antwerp', flag: '🇧🇪', country: 'be' },
              { value: 'Paris', label: 'Paris', flag: '🇫🇷', country: 'fr' },
              { value: 'Berlin', label: 'Berlin', flag: '🇩🇪', country: 'de' },
              { value: 'Warsaw', label: 'Warsaw', flag: '🇵🇱', country: 'pl' },
              { value: 'Kraków', label: 'Kraków', flag: '🇵🇱', country: 'pl' }
            ]
              .filter((item) => selectedCountry === 'all' || item.value === 'all' || item.country === selectedCountry)
              .map((item) => {
                const count = item.value === 'all' 
                  ? allAttractions.length 
                  : allAttractions.filter(a => a.city === item.value).length;

                return (
                  <button
                    key={item.value}
                    id={`btn-city-${item.value.toLowerCase()}`}
                    onClick={() => setSelectedCity(item.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedCity === item.value
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600'
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                      selectedCity === item.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Detailed Precision Filters Toolbar (Audience, Budget, Mood, Sorting & View Toggle) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          
          {/* 1. Audience Toggle (Dorośli / Dzieci) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'pl' ? 'Kategoria odbiorcy:' : 'Doelgroep:'}
            </label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedVersion('adult')}
                className={`py-1.5 px-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedVersion === 'adult'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🧑 {language === 'pl' ? 'Dorośli' : 'Volwassenen'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedVersion('child')}
                className={`py-1.5 px-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedVersion === 'child'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🧸 {language === 'pl' ? 'Dzieci & Rodziny' : 'Kinderen'}
              </button>
            </div>
          </div>

          {/* 2. Budget Limit Selector */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {language === 'pl' ? 'Maksymalny budżet:' : 'Max budget:'}
              </label>
              <span className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {maxBudget >= 200 ? (language === 'pl' ? 'Dowolny' : 'Any') : `≤ €${maxBudget}`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={maxBudget}
              onChange={(e) => setMaxBudget(parseInt(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span onClick={() => setMaxBudget(0)} className="cursor-pointer hover:text-indigo-600">0€ (Gratis)</span>
              <span onClick={() => setMaxBudget(20)} className="cursor-pointer hover:text-indigo-600">20€</span>
              <span onClick={() => setMaxBudget(50)} className="cursor-pointer hover:text-indigo-600">50€</span>
              <span onClick={() => setMaxBudget(200)} className="cursor-pointer hover:text-indigo-600">200€+</span>
            </div>
          </div>

          {/* 3. Mood / Vibe Selector */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'pl' ? 'Nastrój / Klimat:' : 'Sfeer:'}
            </label>
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">🌟 {language === 'pl' ? 'Wszystkie nastroje' : language === 'nl' ? 'Alle stemmingen' : 'All Vibes'}</option>
              <option value="romantic sunset">🌅 {language === 'pl' ? 'Romantyczny zachód słońca' : 'Romantic sunset'}</option>
              <option value="peace and quiet">🌿 {language === 'pl' ? 'Cisza i spokój' : 'Peace and quiet'}</option>
              <option value="remote work">💻 {language === 'pl' ? 'Praca zdalna / Kawiarnia' : 'Remote work'}</option>
              <option value="family adventure">🧗 {language === 'pl' ? 'Rodzinna przygoda' : 'Family adventure'}</option>
              <option value="historic discovery">🏰 {language === 'pl' ? 'Historyczne odkrycie' : 'Historic discovery'}</option>
            </select>
          </div>

          {/* 4. Sort & View Mode Switcher */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {language === 'pl' ? 'Sortowanie:' : 'Sorteren:'}
              </label>
              {/* View Switcher: Grid vs Compact */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded-md cursor-pointer transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Widok kafelkowy z dużymi zdjęciami"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('compact')}
                  className={`p-1 rounded-md cursor-pointer transition-colors ${
                    viewMode === 'compact' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Widok kompaktowej listy (super szybki podgląd)"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer"
            >
              <option value="rating">⭐ {language === 'pl' ? 'Najwyższa ocena & opinie' : 'Hoogste beoordeling'}</option>
              <option value="hearts">❤️ {language === 'pl' ? 'Najwięcej polubień' : 'Meeste likes'}</option>
              <option value="distance">📍 {language === 'pl' ? 'Najbliżej Ciebie (GPS)' : 'Dichtstbijzijnde'}</option>
              <option value="price">💰 {language === 'pl' ? 'Najniższa cena wstępu' : 'Laagste prijs'}</option>
              <option value="duration">⏱️ {language === 'pl' ? 'Najkrótszy czas zwiedzania' : 'Kortste duur'}</option>
            </select>
          </div>

        </div>

      </motion.div>

      {/* ========================================================= */}
      {/* 2. ATTRACTIONS RESULTS CATALOG (GRID OR COMPACT)          */}
      {/* ========================================================= */}
      <div id="explore-attractions-list">
        {/* Floating Toast Notification for offline operations */}
        {offlineFeedbackMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-950/95 text-white border border-emerald-400/50 shadow-2xl rounded-2xl px-5 py-3.5 flex items-center gap-3 animate-slideUp font-bold text-xs max-w-md backdrop-blur-md">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <HardDrive className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p>{offlineFeedbackMsg}</p>
            </div>
            <button 
              onClick={() => setOfflineFeedbackMsg(null)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dedicated Offline Mode Banner when 'offline' filter is chosen */}
        {quickFilter === 'offline' && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 mb-6 border border-indigo-500/40 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0 shadow-inner">
                  <WifiOff className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-emerald-400/30">
                      {language === 'pl' ? 'Tryb Bez Zasięgu' : 'Offline Ready'}
                    </span>
                    <h3 className="text-lg font-black text-white">
                      {language === 'pl' ? 'Filtr: Miejsca dostępne offline' : 'Filter: Offline Cached Attractions'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 font-medium max-w-2xl">
                    {language === 'pl'
                      ? 'Wyświetlasz wyłącznie atrakcje z pełnymi opisami, koordynatami i rozkładami stacji trwale zapisanymi w pamięci podręcznej. Działają w 100% bez Internetu, w pociągach i strefach bez zasięgu!'
                      : 'Showing attractions stored in your local browser storage with full descriptions and coordinates. 100% functional without internet.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCacheAllOffline}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <DownloadCloud className="w-4 h-4 stroke-[2.5]" />
                  <span>{language === 'pl' ? 'Pobierz wszystkie do offline ⚡' : 'Download all offline ⚡'}</span>
                </button>

                {offlineCachedIds.size > 0 && (
                  <button
                    type="button"
                    onClick={handleClearOfflineCache}
                    className="bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{language === 'pl' ? 'Wyczyść cache' : 'Clear cache'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-3 border-t border-slate-800/80 text-slate-300">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language === 'pl' ? 'Zapisane obiekty:' : 'Cached spots:'} <strong className="text-white">{offlineCachedIds.size} / {allAttractions.length}</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'pl' ? 'Rozmiar cache:' : 'Cache size:'} <strong className="text-white">~{offlineCacheStats.totalSizeKb} KB</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'pl' ? 'Status pamięci:' : 'Status:'} <strong className="text-emerald-400">{language === 'pl' ? 'Pamięć gotowa do podróży' : 'Ready for offline travel'}</strong></span>
              </span>
            </div>
          </div>
        )}

        {displayedAttractions.length === 0 ? (
          <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-3xl p-6 space-y-3">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              {quickFilter === 'offline' ? '📶' : '🔍'}
            </div>
            <h4 className="text-xl font-black text-slate-900">
              {quickFilter === 'offline'
                ? (language === 'pl' ? 'Brak zapisanych atrakcji w trybie offline' : 'Geen offline opgeslagen attracties')
                : (language === 'pl' ? 'Brak pasujących atrakcji' : language === 'nl' ? 'Geen resultaten gevonden' : 'No attractions found')}
            </h4>
            <p className="text-slate-500 font-medium text-xs sm:text-sm max-w-md mx-auto">
              {quickFilter === 'offline'
                ? (language === 'pl'
                    ? 'Nie zapisałeś jeszcze żadnych miejsc w pamięci podręcznej urządzenia. Kliknij poniżej, aby pobrać pełny pakiet atrakcji na wyjazd bez zasięgu sieci!'
                    : 'No attractions in local cache yet. Click below to download spots for offline travel.')
                : (language === 'pl'
                    ? 'Nie znaleziono miejsc dla podanych kryteriów. Spróbuj zwiększyć limit budżetu, zmienić wybrane miasto lub zresetować filtry.'
                    : 'No spots match your filters. Try widening your budget limit or resetting search.')}
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {quickFilter === 'offline' ? (
                <button
                  type="button"
                  onClick={handleCacheAllOffline}
                  className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105 flex items-center gap-1.5"
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>{language === 'pl' ? 'Pobierz wszystkie atrakcje do offline' : 'Download All Attractions Offline'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105"
                >
                  {language === 'pl' ? 'Zresetuj wszystkie filtry' : 'Reset alle filters'}
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'compact' ? (
          /* COMPACT LIST VIEW (Super high-speed scanning) */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {displayedAttractions.slice(0, visibleCount).map((att) => {
              const versionData = selectedVersion === 'adult' ? att.adultVersion : att.childVersion;
              const liked = userLikedState[att.id];
              const heartsCount = heartsState[att.id] || 0;
              const photo = getAttractionPhoto(att, photosState);
              const attCoords = getAttractionCoordinates(att);
              const userLat = gpsState.coords?.lat || 51.9244;
              const userLng = gpsState.coords?.lng || 4.4777;
              const distKm = calculateHaversineDistanceKm(userLat, userLng, attCoords.lat, attCoords.lng) * 1.25;
              const distanceFormatted = formatDistance(distKm);
              const isHighlighted = highlightedAttractionId === att.id;
              const isCached = offlineCachedIds.has(att.id);

              return (
                <div
                  key={att.id}
                  id={`attraction-card-${att.id}`}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 group ${
                    isHighlighted ? 'bg-amber-50/90 ring-2 ring-amber-400' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={photo}
                      alt={att.name}
                      loading="lazy"
                      decoding="async"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 shadow-xs group-hover:scale-103 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-indigo-50 text-indigo-700 font-bold text-[9px] uppercase px-2 py-0.5 rounded">
                          {att.category.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-950 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
                          📍 {distanceFormatted}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          • {att.city}, {att.region}
                        </span>
                        {isCached && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                            <span>Offline Ready</span>
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          ♿ Dostępne
                        </span>
                      </div>
                      <h4 
                        onClick={() => handleDirectSelectAttraction(att)}
                        className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer leading-tight"
                      >
                        {att.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-xl">
                        {versionData.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="text-left sm:text-right font-mono">
                      <span className="text-xs font-bold text-slate-400 block">{selectedVersion === 'adult' ? 'Dorośli' : 'Dzieci'}:</span>
                      <strong className="text-base font-black text-slate-900">
                        {versionData.budget === 0 ? '0 € (Gratis)' : `€${versionData.budget}`}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleToggleOffline(att, e)}
                        className={`p-2.5 rounded-xl cursor-pointer transition-all border ${
                          isCached
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300'
                            : 'bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border-slate-200'
                        }`}
                        title={isCached ? (language === 'pl' ? 'W pamięci offline (Kliknij, aby usunąć)' : 'Cached offline') : (language === 'pl' ? 'Zapisz w pamięci podręcznej offline' : 'Save offline')}
                      >
                        {isCached ? (
                          <HardDrive className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <DownloadCloud className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavigateWithMode(att, 'transit')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Compass className="w-4 h-4 stroke-[2.5]" />
                        <span>{language === 'pl' ? 'Nawiguj do celu 🧭' : 'Navigate in App 🧭'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenQuickPreview(att)}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-colors"
                        title="Szczegóły"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* MODERN RICH GRID VIEW */
          <div className="grid grid-cols-1 gap-8">
            {displayedAttractions.slice(0, visibleCount).map((att) => {
              const versionData = selectedVersion === 'adult' ? att.adultVersion : att.childVersion;
              const liked = userLikedState[att.id];
              const heartsCount = heartsState[att.id] || 0;
              const itemComments = commentsState.filter((c) => c.attractionId === att.id);
              const itemPhotos = photosState[att.id] || [];
              const photo = getAttractionPhoto(att, photosState);
              const attCoords = getAttractionCoordinates(att);
              const userLat = gpsState.coords?.lat || 51.9244;
              const userLng = gpsState.coords?.lng || 4.4777;
              const distKm = calculateHaversineDistanceKm(userLat, userLng, attCoords.lat, attCoords.lng) * 1.25;
              const distanceFormatted = formatDistance(distKm);
              const isHighlighted = highlightedAttractionId === att.id;
              const isCached = offlineCachedIds.has(att.id);
              const todayWeather = generateSightseeingForecast(
                att.city,
                att.region.includes('Polska') || att.city === 'Kraków' || att.city === 'Warsaw' || att.city === 'Gdańsk' ? 'Poland' : 'Netherlands',
                language
              )[0];

              return (
                <div
                  key={att.id}
                  id={`attraction-card-${att.id}`}
                  className={`bg-white rounded-3xl overflow-hidden transition-all duration-500 space-y-0 ${
                    isHighlighted
                      ? 'ring-4 ring-amber-400 ring-offset-4 shadow-2xl scale-[1.01] border-2 border-amber-500'
                      : 'border border-slate-200/90 shadow-md hover:border-indigo-400 hover:shadow-xl'
                  }`}
                >
                  {/* Photo & Dynamic Visual Card Header */}
                  <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-950 overflow-hidden group">
                    <img
                      src={photo}
                      alt={att.name}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                    {/* Top Floating Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-slate-900/90 backdrop-blur-md text-amber-300 font-black text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border border-amber-300/40 shadow-lg flex items-center gap-1">
                          <span>📍 {att.city}</span>
                          <span className="text-white opacity-70">• {att.region}</span>
                        </span>
                        <span className="bg-indigo-600/90 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-indigo-400/40 shadow-md">
                          {att.category.replace('_', ' ')}
                        </span>
                        {isCached && (
                          <span className="bg-emerald-600/90 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 rounded-full border border-emerald-400/40 shadow-md flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Offline Ready</span>
                          </span>
                        )}
                        <span className="bg-emerald-600/90 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 rounded-full border border-emerald-400/40 shadow-md flex items-center gap-1">
                          ♿ {language === 'pl' ? 'Dostępne bez barier' : 'Accessible'}
                        </span>
                      </div>

                      {/* Right top price badge */}
                      <div className="bg-slate-950/90 backdrop-blur-md text-white border border-slate-700/80 px-3.5 py-1.5 rounded-2xl text-right shadow-xl">
                        <span className="text-[10px] text-slate-400 font-bold block">{language === 'pl' ? 'Cena wstępu' : 'Entry'}</span>
                        <div className="text-sm sm:text-base font-black text-amber-300 font-mono">
                          🧑 €{att.adultVersion.budget} <span className="text-slate-400 text-xs">/ 🧸 {att.childVersion.budget === 0 ? (language === 'pl' ? 'Gratis' : 'Free') : `€${att.childVersion.budget}`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Title & Stats Over Image */}
                    <div className="absolute bottom-5 left-5 right-5 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
                          ⭐ {Math.min(5, (4.2 + (heartsCount / 120))).toFixed(1)} / 5.0
                        </span>
                        <span className="bg-black/60 backdrop-blur-sm text-slate-200 text-xs font-bold px-2.5 py-1 rounded-md border border-white/20">
                          ⏱️ {versionData.durationMinutes} min zwiedzania
                        </span>
                        <span className="bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-black px-2.5 py-1 rounded-md border border-indigo-400/40 font-mono shadow-md">
                          🧭 {distanceFormatted} {language === 'pl' ? 'od Twojego GPS' : 'from your GPS'}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                        {att.name}
                      </h3>
                    </div>
                  </div>

                  {/* CLEAN LIVE WEATHER & INSTANT NAVIGATION ACTION BAR */}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 border-b border-slate-800 shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {todayWeather?.icon || '🌤️'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider">
                            {language === 'pl' ? `Pogoda: ${att.city}` : language === 'nl' ? `Weer in ${att.city}` : `Weather in ${att.city}`}
                          </h4>
                          <span className="bg-amber-400/20 text-amber-300 text-xs font-black px-2 py-0.5 rounded-full border border-amber-400/30 font-mono">
                            {todayWeather?.tempMax}°C
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                          {todayWeather?.condition} • {language === 'pl' ? (todayWeather?.rainChance > 25 ? `Szansa na opady: ${todayWeather?.rainChance}% 🌧️` : 'Bez opadów ✨') : `${todayWeather?.rainChance}% rain`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={(e) => handleToggleOffline(att, e)}
                        id={`offline-cache-btn-${att.id}`}
                        className={`px-4 py-3 rounded-2xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border shadow-md ${
                          isCached
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/50'
                            : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/20'
                        }`}
                        title={isCached ? (language === 'pl' ? 'W pamięci podręcznej offline (Kliknij, aby usunąć)' : 'Cached offline') : (language === 'pl' ? 'Zapisz w pamięci podręcznej offline' : 'Save for offline')}
                      >
                        {isCached ? (
                          <>
                            <HardDrive className="w-4 h-4 text-emerald-400" />
                            <span>{language === 'pl' ? 'Offline: Zapisane' : 'Offline: Ready'}</span>
                          </>
                        ) : (
                          <>
                            <DownloadCloud className="w-4 h-4 text-amber-300" />
                            <span>{language === 'pl' ? 'Pobierz offline' : 'Save Offline'}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavigateWithMode(att, 'transit')}
                        id={`btn-plan-route-weather-${att.id}`}
                        className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black text-sm sm:text-base px-6 py-3 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-300 hover:scale-103 shrink-0"
                      >
                        <Compass className="w-5 h-5 stroke-[2.5]" />
                        <span>{language === 'pl' ? 'Nawiguj' : language === 'nl' ? 'Navigeer' : 'Navigate'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Content body */}
                  <div className="p-6 md:p-8 space-y-6">
                    
                    {/* GPS MULTI-MODAL TRANSIT OPTIONS BREAKDOWN */}
                    <AttractionTransitOptions 
                      attraction={att}
                      userCoords={gpsState.coords}
                      userLocationName={gpsState.locationName}
                      language={language}
                      onNavigateWithMode={handleNavigateWithMode}
                    />

                    {/* Descriptions */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                        <Info className="w-5 h-5 text-indigo-600" />
                        <span>{selectedVersion === 'adult' ? (language === 'pl' ? 'Opis dla Dorosłych' : 'Adult Version') : (language === 'pl' ? 'Przewodnik dla Dzieci i Rodzin' : 'Child & Family Guide')}</span>
                      </div>
                      <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                        {versionData.description}
                      </p>
                    </div>

                    {/* Mood Badges */}
                    <div className="flex flex-wrap gap-2">
                      {att.moods.map((mood) => (
                        <span key={mood} className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-full font-bold text-xs shadow-2xs">
                          ✨ {mood}
                        </span>
                      ))}
                    </div>

                    {/* INTERACTIVE TRAVELER PHOTO GALLERY SECTION */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          📸 {t.communityPhotos} ({itemPhotos.length})
                        </h4>
                        <button
                          onClick={() => setIsAddingPhotoForAttraction(isAddingPhotoForAttraction === att.id ? null : att.id)}
                          className="bg-indigo-50/70 text-indigo-700 font-semibold text-xs px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t.addPhotoBtn}</span>
                        </button>
                      </div>

                      {/* Horizontal scroll of photos */}
                      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-stone-50" id={`photo-gallery-${att.id}`}>
                        {itemPhotos.map((photoItem) => {
                          const likeKey = `${att.id}-${photoItem.id}`;
                          const likedPhoto = photoLikedState[likeKey];
                          
                          return (
                            <div 
                              key={photoItem.id}
                              className="flex-shrink-0 w-60 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm relative group snap-start"
                            >
                              <img 
                                src={photoItem.url} 
                                alt={photoItem.caption || att.name} 
                                referrerPolicy="no-referrer"
                                className="w-full h-32 object-cover"
                              />
                              <button
                                onClick={() => handleLikePhoto(att.id, photoItem.id)}
                                className={`absolute top-2 right-2 p-1.5 rounded-full border shadow-sm backdrop-blur-sm cursor-pointer transition-transform duration-200 hover:scale-110 ${
                                  likedPhoto 
                                    ? 'bg-rose-50 text-rose-600 border-rose-200' 
                                    : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-white'
                                }`}
                              >
                                <Heart className={`w-3.5 h-3.5 ${likedPhoto ? 'fill-rose-600 text-rose-600' : ''}`} />
                              </button>

                              <div className="p-3 space-y-1 bg-white">
                                <p className="text-slate-800 font-medium text-xs leading-tight line-clamp-2">
                                  {photoItem.caption}
                                </p>
                                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
                                  <span>👤 {photoItem.addedBy}</span>
                                  <span className="flex items-center gap-0.5 text-rose-600 font-bold">
                                    ❤️ {photoItem.hearts}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        <button
                          onClick={() => setIsAddingPhotoForAttraction(att.id)}
                          className="flex-shrink-0 w-60 h-[210px] bg-slate-50/50 border border-dashed border-slate-300 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors snap-start"
                          id={`btn-photo-plus-${att.id}`}
                        >
                          <div className="bg-indigo-50 text-indigo-700 p-3 rounded-full border border-indigo-200/50 shadow-sm">
                            <Camera className="w-5 h-5 stroke-[2]" />
                          </div>
                          <span className="text-slate-800 font-bold text-sm">
                            ➕ {language === 'nl' ? 'Voeg Uw Foto Toe' : 'Share Your Photo'}
                          </span>
                          <span className="text-[11px] text-slate-500 max-w-[180px] text-center">
                            {language === 'nl' ? 'Druk hier om een foto van uw reis te plaatsen' : 'Click here to post your snapshot of this spot'}
                          </span>
                        </button>
                      </div>

                      {/* Inline expanding upload form */}
                      {isAddingPhotoForAttraction === att.id && (
                        <div 
                          className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200"
                          id={`photo-upload-container-${att.id}`}
                        >
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h5 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                              📸 {t.addPhotoTitle}
                            </h5>
                            <button 
                              onClick={() => setIsAddingPhotoForAttraction(null)}
                              className="text-slate-400 hover:text-slate-600 bg-slate-200/50 p-1 rounded-full cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                              onDragEnter={(e) => handleDragPhoto(e, att.id)}
                              onDragOver={(e) => handleDragPhoto(e, att.id)}
                              onDragLeave={(e) => handleDragPhoto(e, att.id)}
                              onDrop={(e) => handleDropPhoto(e, att.id)}
                              className={`border border-dashed rounded-lg p-5 text-center cursor-pointer flex flex-col items-center justify-center transition-colors min-h-[120px] ${
                                dragActivePhoto === att.id
                                  ? 'border-indigo-500 bg-indigo-50/50'
                                  : 'border-slate-200 hover:border-indigo-400 bg-white'
                              }`}
                              onClick={() => document.getElementById(`photo-file-upload-${att.id}`)?.click()}
                            >
                              <Upload className="w-6 h-6 text-slate-400 mb-1" />
                              <span className="text-slate-800 font-bold text-xs block">
                                {language === 'nl' ? 'Klik of sleep foto hiernaartoe' : 'Select Local File or Drag & Drop'}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-1">
                                Supports PNG, JPG snapshots from your phone
                              </span>
                              <input
                                type="file"
                                id={`photo-file-upload-${att.id}`}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handlePhotoUploadLocal(e, att.id)}
                              />
                            </div>

                            <div className="space-y-2.5">
                              <div>
                                <label className="block text-slate-500 font-semibold text-[11px] mb-0.5" htmlFor={`photo-url-input-${att.id}`}>
                                  Web Photo URL
                                </label>
                                <input
                                  type="text"
                                  id={`photo-url-input-${att.id}`}
                                  placeholder="https://example.com/photo.jpg"
                                  value={photoUrlInput}
                                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                                  className="w-full text-xs p-2 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-500 font-semibold text-[11px] mb-0.5" htmlFor={`photo-caption-${att.id}`}>
                                  Caption / Description *
                                </label>
                                <input
                                  type="text"
                                  id={`photo-caption-${att.id}`}
                                  required
                                  placeholder={t.photoCaptionPlaceholder}
                                  value={photoCaptionInput}
                                  onChange={(e) => setPhotoCaptionInput(e.target.value)}
                                  className="w-full text-xs p-2 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500"
                                />
                              </div>

                              <div className="flex gap-2">
                                {!account && (
                                  <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={photoAddedByInput}
                                    onChange={(e) => setPhotoAddedByInput(e.target.value)}
                                    className="w-1/2 text-xs p-2 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500"
                                  />
                                )}
                                <button
                                  type="button"
                                  onClick={() => submitCustomPhoto(att.id, photoUrlInput)}
                                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-lg border border-indigo-700/10 flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  <span>{t.uploadPhotoBtn}</span>
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      )}
                    </div>

                    {/* Like/Heart Toggles and Social Action row */}
                    <div className="flex items-center justify-between border-t border-b border-slate-100 py-3.5">
                      <button
                        onClick={() => handleHeartToggle(att.id)}
                        id={`heart-btn-${att.id}`}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          liked
                            ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/10 text-slate-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${liked ? 'fill-rose-600 text-rose-600' : ''}`} />
                        <span>{heartsCount} {t.heartsCount}</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-xs">
                        <MessageSquare className="w-4 h-4" />
                        <span>{itemComments.length} {t.commentsTitle}</span>
                      </div>
                    </div>

                    {/* Comments section */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-900">💬 {t.commentsLabel}:</h4>
                      
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1" id={`explore-comments-${att.id}`}>
                        {itemComments.map((comment) => (
                          <div key={comment.id} className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-xs">
                            <div className="flex justify-between text-slate-400 text-[10px] font-semibold">
                              <span>👤 {comment.username}</span>
                              <span>⏱️ {comment.createdAt}</span>
                            </div>
                            <p className="text-slate-700 font-medium mt-1">{comment.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Add comment form */}
                      <form onSubmit={(e) => handleAddComment(att.id, e)} className="flex gap-2">
                        {!account && (
                          <input
                            type="text"
                            placeholder="Your Nickname"
                            value={customCommenterName}
                            onChange={(e) => setCustomCommenterName(e.target.value)}
                            className="w-1/3 border border-slate-200 rounded-lg p-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500"
                            required
                          />
                        )}
                        <input
                          type="text"
                          id={`explore-comment-input-${att.id}`}
                          placeholder={t.addCommentPlaceholder}
                          value={newCommentText[att.id] || ''}
                          onChange={(e) =>
                            setNewCommentText({
                              ...newCommentText,
                              [att.id]: e.target.value
                            })
                          }
                          className="flex-1 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500"
                          required
                        />
                        <button
                          type="submit"
                          id={`explore-comment-submit-${att.id}`}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg border border-indigo-700/10 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>{t.postCommentBtn}</span>
                        </button>
                      </form>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic Progressive Batch Loading (Pokaż więcej / Pokaż wszystkie) */}
        {displayedAttractions.length > visibleCount && (
          <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-slate-200 shadow-md text-center">
            <div className="text-xs sm:text-sm font-extrabold text-slate-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                {language === 'pl' 
                  ? `Wyświetlasz ${Math.min(visibleCount, displayedAttractions.length)} z ${displayedAttractions.length} miejsc` 
                  : language === 'nl'
                  ? `Je bekijkt ${Math.min(visibleCount, displayedAttractions.length)} van ${displayedAttractions.length} locaties`
                  : `Showing ${Math.min(visibleCount, displayedAttractions.length)} of ${displayedAttractions.length} spots`}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 18)}
                className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm py-3 px-6 rounded-2xl shadow-md cursor-pointer transition-all hover:scale-105"
              >
                {language === 'pl' ? 'Załaduj kolejne 18 miejsc ▾' : language === 'nl' ? 'Laad nog 18 plekken ▾' : 'Load 18 More Spots ▾'}
              </button>

              <button
                type="button"
                onClick={() => setVisibleCount(displayedAttractions.length)}
                className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm py-3 px-5 rounded-2xl border border-slate-300 cursor-pointer transition-all"
              >
                {language === 'pl' ? 'Pokaż wszystkie (250+) ⚡' : language === 'nl' ? 'Toon alle plekken ⚡' : 'Show All (250+) ⚡'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* QUICK DETAIL PREVIEW MODAL FOR FAST INSPECTION            */}
      {/* ========================================================= */}
      {quickPreviewAttraction && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full overflow-hidden shadow-2xl relative my-8">
            <button
              type="button"
              onClick={() => setQuickPreviewAttraction(null)}
              className="absolute top-4 right-4 bg-slate-900/90 hover:bg-slate-950 text-white p-2 rounded-full z-20 cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="relative h-56 md:h-64 bg-slate-950">
              <img
                src={getAttractionPhoto(quickPreviewAttraction, photosState)}
                alt={quickPreviewAttraction.name}
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 space-y-1">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                  📍 {quickPreviewAttraction.city}, {quickPreviewAttraction.region}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                  {quickPreviewAttraction.name}
                </h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {language === 'pl' ? 'O miejscu:' : 'Over de locatie:'}
                </h4>
                <p className="text-slate-700 text-sm font-medium leading-relaxed">
                  {selectedVersion === 'adult' ? quickPreviewAttraction.adultVersion.description : quickPreviewAttraction.childVersion.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                <div className="bg-slate-50 border p-2.5 rounded-xl flex-1 text-center font-mono">
                  <span className="text-[10px] text-slate-400 block font-bold">{language === 'pl' ? 'Wstęp Dorośli' : 'Adults'}</span>
                  <strong className="text-sm font-black text-slate-900">€{quickPreviewAttraction.adultVersion.budget}</strong>
                </div>
                <div className="bg-slate-50 border p-2.5 rounded-xl flex-1 text-center font-mono">
                  <span className="text-[10px] text-slate-400 block font-bold">{language === 'pl' ? 'Wstęp Dzieci' : 'Kids'}</span>
                  <strong className="text-sm font-black text-slate-900">€{quickPreviewAttraction.childVersion.budget}</strong>
                </div>
                <div className="bg-slate-50 border p-2.5 rounded-xl flex-1 text-center font-mono">
                  <span className="text-[10px] text-slate-400 block font-bold">{language === 'pl' ? 'Czas zwiedzania' : 'Duration'}</span>
                  <strong className="text-sm font-black text-slate-900">{quickPreviewAttraction.adultVersion.durationMinutes} min</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => handleToggleOffline(quickPreviewAttraction)}
                  className={`px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border shadow-sm ${
                    offlineCachedIds.has(quickPreviewAttraction.id)
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300'
                      : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-slate-200'
                  }`}
                >
                  {offlineCachedIds.has(quickPreviewAttraction.id) ? (
                    <>
                      <HardDrive className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'pl' ? 'Zapisane offline (Usuń)' : 'Saved offline'}</span>
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="w-4 h-4 text-indigo-600" />
                      <span>{language === 'pl' ? 'Zapisz do offline' : 'Save offline'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRouteAttraction(quickPreviewAttraction);
                    setQuickPreviewAttraction(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-black text-xs py-3 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 hover:brightness-105 transition-all"
                >
                  <Compass className="w-4 h-4 stroke-[2.5]" />
                  <span>{language === 'pl' ? 'Zaplanuj Trasę & Pogodę 🧭' : 'Plan Route & Weather 🧭'}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-bold">
              <span>Smart Travel Companion</span>
              <button
                type="button"
                onClick={() => setQuickPreviewAttraction(null)}
                className="text-indigo-600 font-black hover:underline cursor-pointer"
              >
                {language === 'pl' ? 'Zamknij podgląd' : 'Sluiten'}
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {/* ========================================================= */}
      {/* TIMELESS ROUTE & SIGHTSEEING WEATHER MODAL                */}
      {/* ========================================================= */}
      <RouteWeatherModal
        isOpen={!!selectedRouteAttraction}
        onClose={() => setSelectedRouteAttraction(null)}
        attraction={selectedRouteAttraction}
        language={language}
        account={account}
        userCoords={gpsState.coords}
        userLocationName={gpsState.locationName}
        initialTravelMode={selectedRouteTravelMode}
      />

    </div>
  );
}
