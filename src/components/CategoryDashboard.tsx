/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Attraction, TravelMode, UserAccount } from '../types';
import { SEEDED_ATTRACTIONS } from '../data/attractions';
import { getAttractionPhoto, DEFAULT_PLACE_PHOTO, CATEGORY_FALLBACK_PHOTOS } from '../data/attractionPhotos';
import { 
  getAttractionTransitInfo, 
  GpsCoordinates 
} from '../services/gpsTransitService';
import RouteWeatherModal from './RouteWeatherModal';
import { 
  Landmark, 
  Trees, 
  Heart, 
  Palmtree, 
  Sparkles, 
  FerrisWheel, 
  Castle, 
  Flower2, 
  Ship, 
  Coffee, 
  Bike,
  Search,
  X,
  Compass,
  MapPin,
  Check,
  User,
  Train,
  ArrowRight,
  Info,
  Clock,
  Euro,
  ZoomIn,
  Eye,
  Crown,
  Waves,
  Lightbulb,
  Tag,
  Bus,
  Car,
  Footprints,
  Navigation,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface CategoryDashboardProps {
  language: Language;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onNavigateTab: (tab: 'explore' | 'station-router' | 'cycling' | 'passport' | 'challenges' | 'account') => void;
  selectedCountry?: string;
  onSelectCountry?: (country: string) => void;
  onSelectAttraction?: (attraction: Attraction) => void;
  onPlanRoute?: (attraction: Attraction, mode?: TravelMode) => void;
  userCoords?: GpsCoordinates | null;
  userLocationName?: string;
  account?: UserAccount | null;
}

interface CategoryItem {
  id: string;
  icon: any;
  label: Record<Language, string>;
  subtitle: Record<Language, string>;
  vehicleEmoji: string;
  targetTab?: 'explore' | 'cycling';
  isPrioritySenior?: boolean; // Highlighted & extra large for seniors (Muzea, Parki, Zabytki)
  animationType: 'float' | 'sway' | 'pulse' | 'spin' | 'wiggle' | 'wave' | 'bounce';
  colorClasses: {
    iconBg: string;
    iconText: string;
    cloudActiveBg: string;
    bubblesActiveBg: string;
    borderColor: string;
  };
}

const CATEGORIES: CategoryItem[] = [
  { 
    id: 'museum', 
    icon: Landmark, 
    vehicleEmoji: '🚆',
    isPrioritySenior: true,
    animationType: 'float',
    label: { 
      en: 'Museums', 
      nl: 'Musea', 
      pl: 'Muzea', 
      zh: '博物馆', 
      es: 'Museos',
      de: 'Museen',
      ro: 'Muzee',
      fr: 'Musées'
    },
    subtitle: {
      pl: 'Wystawy & Sztuka 🎨',
      en: 'Art & Exhibitions 🎨',
      nl: 'Kunst & Collecties 🎨',
      de: 'Kunst & Schätze 🎨',
      es: 'Arte y Colecciones 🎨',
      fr: 'Art & Expositions 🎨',
      ro: 'Artă & Istorie 🎨',
      zh: '艺术与展览 🎨'
    },
    colorClasses: {
      iconBg: 'bg-amber-100 text-amber-900 border-2 border-amber-400 shadow-sm',
      iconText: 'text-amber-900',
      cloudActiveBg: 'from-amber-100 to-amber-200 border-amber-500 shadow-[0_0_16px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/40',
      bubblesActiveBg: 'bg-amber-100 border-amber-500',
      borderColor: 'border-amber-400'
    }
  },
  { 
    id: 'historical', 
    icon: Castle, 
    vehicleEmoji: '🚆',
    isPrioritySenior: true,
    animationType: 'pulse',
    label: { 
      en: 'Historical', 
      nl: 'Historisch', 
      pl: 'Zabytki', 
      zh: '历史古迹', 
      es: 'Histórico',
      de: 'Historisch',
      ro: 'Istoric',
      fr: 'Historique'
    },
    subtitle: {
      pl: 'Zamki & Starówki 🏰',
      en: 'Castles & Old Towns 🏰',
      nl: 'Kastelen & Erfgoed 🏰',
      de: 'Burgen & Altstadt 🏰',
      es: 'Castillos y Patrimonio 🏰',
      fr: 'Châteaux & Histoire 🏰',
      ro: 'Castele & Cetăți 🏰',
      zh: '城堡与古建 🏰'
    },
    colorClasses: {
      iconBg: 'bg-stone-200 text-stone-900 border-2 border-stone-400 shadow-sm',
      iconText: 'text-stone-900',
      cloudActiveBg: 'from-stone-100 to-stone-200 border-stone-600 shadow-[0_0_16px_rgba(120,113,108,0.35)] ring-2 ring-stone-400/40',
      bubblesActiveBg: 'bg-stone-200 border-stone-600',
      borderColor: 'border-stone-500'
    }
  },
  { 
    id: 'park', 
    icon: Flower2, 
    vehicleEmoji: '🚲',
    isPrioritySenior: true,
    animationType: 'sway',
    label: { 
      en: 'Parks', 
      nl: 'Parken', 
      pl: 'Parki', 
      zh: '城市公园', 
      es: 'Parques',
      de: 'Parks',
      ro: 'Parcuri',
      fr: 'Parcs'
    },
    subtitle: {
      pl: 'Ogrody & Alejki 🌷',
      en: 'Gardens & Strolls 🌷',
      nl: 'Tuinen & Wandelen 🌷',
      de: 'Gärten & Spaziergänge 🌷',
      es: 'Jardines y Paseos 🌷',
      fr: 'Jardins & Balades 🌷',
      ro: 'Grădini & Plimbări 🌷',
      zh: '园林与散步 🌷'
    },
    colorClasses: {
      iconBg: 'bg-lime-100 text-lime-900 border-2 border-lime-400 shadow-sm',
      iconText: 'text-lime-900',
      cloudActiveBg: 'from-lime-100 to-lime-200 border-lime-500 shadow-[0_0_16px_rgba(132,204,22,0.35)] ring-2 ring-lime-400/40',
      bubblesActiveBg: 'bg-lime-100 border-lime-500',
      borderColor: 'border-lime-500'
    }
  },
  { 
    id: 'forest', 
    icon: Trees, 
    vehicleEmoji: '🚲',
    animationType: 'sway',
    label: { 
      en: 'Forests', 
      nl: 'Bossen', 
      pl: 'Lasy', 
      zh: '森林', 
      es: 'Bosques',
      de: 'Wälder',
      ro: 'Păduri',
      fr: 'Forêts'
    },
    subtitle: {
      pl: 'Natura & Czyste powietrze 🌲',
      en: 'Nature & Fresh Air 🌲',
      nl: 'Natuur & Bosrust 🌲',
      de: 'Natur & Frische Luft 🌲',
      es: 'Naturaleza y Aire Puro 🌲',
      fr: 'Nature & Air Pur 🌲',
      ro: 'Natură & Aer Curat 🌲',
      zh: '自然森林与氧吧 🌲'
    },
    colorClasses: {
      iconBg: 'bg-emerald-100 text-emerald-900 border-2 border-emerald-400 shadow-sm',
      iconText: 'text-emerald-900',
      cloudActiveBg: 'from-emerald-100 to-emerald-200 border-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.35)] ring-2 ring-emerald-400/40',
      bubblesActiveBg: 'bg-emerald-100 border-emerald-500',
      borderColor: 'border-emerald-500'
    }
  },
  { 
    id: 'waterway', 
    icon: Ship, 
    vehicleEmoji: '🚗',
    animationType: 'wave',
    label: { 
      en: 'Canals', 
      nl: 'Grachten', 
      pl: 'Kanały', 
      zh: '运河游船', 
      es: 'Canales',
      de: 'Grachten',
      ro: 'Canale',
      fr: 'Canaux'
    },
    subtitle: {
      pl: 'Rejsy & Statki 🚢',
      en: 'Cruises & Boat Trips 🚢',
      nl: 'Rondvaarten & Schepen 🚢',
      de: 'Schifffahrt & Wasser 🚢',
      es: 'Paseos en Barco 🚢',
      fr: 'Croisières en Bateau 🚢',
      ro: 'Plimbări cu Vaporul 🚢',
      zh: '游船与水上风光 🚢'
    },
    colorClasses: {
      iconBg: 'bg-cyan-100 text-cyan-900 border-2 border-cyan-400 shadow-sm',
      iconText: 'text-cyan-900',
      cloudActiveBg: 'from-cyan-100 to-cyan-200 border-cyan-500 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400/40',
      bubblesActiveBg: 'bg-cyan-100 border-cyan-500',
      borderColor: 'border-cyan-500'
    }
  },
  { 
    id: 'restaurant_cafe', 
    icon: Coffee, 
    vehicleEmoji: '🚲',
    animationType: 'bounce',
    label: { 
      en: 'Cafes', 
      nl: 'Cafés', 
      pl: 'Kawiarnie', 
      zh: '咖啡馆', 
      es: 'Cafeterías',
      de: 'Cafés',
      ro: 'Cafenele',
      fr: 'Cafés'
    },
    subtitle: {
      pl: 'Kawa & Odpoczynek ☕',
      en: 'Coffee & Relaxation ☕',
      nl: 'Koffie & Gebak ☕',
      de: 'Kaffee & Gemütlichkeit ☕',
      es: 'Café y Descanso ☕',
      fr: 'Pause Café & Douceur ☕',
      ro: 'Cafea & Relaxare ☕',
      zh: '咖啡与悠闲时光 ☕'
    },
    colorClasses: {
      iconBg: 'bg-orange-100 text-orange-900 border-2 border-orange-400 shadow-sm',
      iconText: 'text-orange-900',
      cloudActiveBg: 'from-orange-100 to-orange-200 border-orange-500 shadow-[0_0_16px_rgba(249,115,22,0.35)] ring-2 ring-orange-400/40',
      bubblesActiveBg: 'bg-orange-100 border-orange-500',
      borderColor: 'border-orange-500'
    }
  },
  { 
    id: 'cycling', 
    icon: Bike, 
    vehicleEmoji: '🚲',
    animationType: 'wiggle',
    label: { 
      en: 'Cycling', 
      nl: 'Fietspaden', 
      pl: 'Ścieżki', 
      zh: '骑行路线', 
      es: 'Ciclismo',
      de: 'Radwege',
      ro: 'Piste Biciclete',
      fr: 'Pistes Cyclables'
    },
    subtitle: {
      pl: 'Trasy Rowerowe & E-bike 🚴',
      en: 'Bike Trails & E-bike 🚴',
      nl: 'Fietsroutes & Knooppunten 🚴',
      de: 'Routen & E-Bike 🚴',
      es: 'Rutas y Paseos Bici 🚴',
      fr: 'Vélo & Itinéraires 🚴',
      ro: 'Trasee de Bicicletă 🚴',
      zh: '风景骑行绿道 🚴'
    },
    targetTab: 'cycling',
    colorClasses: {
      iconBg: 'bg-teal-100 text-teal-900 border-2 border-teal-400 shadow-sm',
      iconText: 'text-teal-900',
      cloudActiveBg: 'from-teal-100 to-teal-200 border-teal-500 shadow-[0_0_16px_rgba(20,184,166,0.35)] ring-2 ring-teal-400/40',
      bubblesActiveBg: 'bg-teal-100 border-teal-500',
      borderColor: 'border-teal-500'
    }
  },
  { 
    id: 'beach', 
    icon: Palmtree, 
    vehicleEmoji: '🚗',
    animationType: 'sway',
    label: { 
      en: 'Beaches', 
      nl: 'Stranden', 
      pl: 'Plaże', 
      zh: '海滩海边', 
      es: 'Playas',
      de: 'Strände',
      ro: 'Plaje',
      fr: 'Plages'
    },
    subtitle: {
      pl: 'Wybrzeże & Szum morza 🏖️',
      en: 'Coast & Sea Breeze 🏖️',
      nl: 'Kust & Zeelucht 🏖️',
      de: 'Strand & Meeresluft 🏖️',
      es: 'Costa y Brisa Marina 🏖️',
      fr: 'Plage & Brise Marine 🏖️',
      ro: 'Litoral & Briza Mării 🏖️',
      zh: '海滨风光与漫步 🏖️'
    },
    colorClasses: {
      iconBg: 'bg-sky-100 text-sky-900 border-2 border-sky-400 shadow-sm',
      iconText: 'text-sky-900',
      cloudActiveBg: 'from-sky-100 to-sky-200 border-sky-500 shadow-[0_0_16px_rgba(14,165,233,0.35)] ring-2 ring-sky-400/40',
      bubblesActiveBg: 'bg-sky-100 border-sky-500',
      borderColor: 'border-sky-500'
    }
  },
  { 
    id: 'romantic', 
    icon: Heart, 
    vehicleEmoji: '🚗',
    animationType: 'pulse',
    label: { 
      en: 'Romantic', 
      nl: 'Romantisch', 
      pl: 'Romantyczne', 
      zh: '浪漫去处', 
      es: 'Romántico',
      de: 'Romantisch',
      ro: 'Romantice',
      fr: 'Romantique'
    },
    subtitle: {
      pl: 'Punkty Widokowe & Zachody 🌅',
      en: 'Viewpoints & Sunsets 🌅',
      nl: 'Uitzichten & Zonsondergang 🌅',
      de: 'Aussicht & Sonnenuntergang 🌅',
      es: 'Miradores y Atardeceres 🌅',
      fr: 'Points de Vue & Couchers 🌅',
      ro: 'Priveliști & Apus de Soare 🌅',
      zh: '观景点与落日 🌅'
    },
    colorClasses: {
      iconBg: 'bg-rose-100 text-rose-900 border-2 border-rose-400 shadow-sm',
      iconText: 'text-rose-900',
      cloudActiveBg: 'from-rose-100 to-rose-200 border-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.35)] ring-2 ring-rose-300/40',
      bubblesActiveBg: 'bg-rose-100 border-rose-400',
      borderColor: 'border-rose-400'
    }
  },
  { 
    id: 'toddler_park', 
    icon: Sparkles, 
    vehicleEmoji: '🚲',
    animationType: 'wiggle',
    label: { 
      en: 'For Toddlers', 
      nl: 'Voor Peuters', 
      pl: 'Dla Maluchów', 
      zh: '幼儿公园', 
      es: 'Para Niños',
      de: 'Für Kleinkinder',
      ro: 'Pentru Copii',
      fr: 'Pour Tout-Petits'
    },
    subtitle: {
      pl: 'Place Zabaw & Z Wnukami 🧸',
      en: 'Playgrounds & Grandkids 🧸',
      nl: 'Speeltuinen & Kleinkinderen 🧸',
      de: 'Spielplätze & Enkelkinder 🧸',
      es: 'Parques y Nietos 🧸',
      fr: 'Jeux & Petits-Enfants 🧸',
      ro: 'Joacă & Nepoți 🧸',
      zh: '儿童游乐与亲子 🧸'
    },
    colorClasses: {
      iconBg: 'bg-pink-100 text-pink-900 border-2 border-pink-400 shadow-sm',
      iconText: 'text-pink-900',
      cloudActiveBg: 'from-pink-100 to-pink-200 border-pink-400 shadow-[0_0_16px_rgba(236,72,153,0.35)] ring-2 ring-pink-300/40',
      bubblesActiveBg: 'bg-pink-100 border-pink-400',
      borderColor: 'border-pink-400'
    }
  },
  { 
    id: 'adult_park', 
    icon: FerrisWheel, 
    vehicleEmoji: '✈️',
    animationType: 'spin',
    label: { 
      en: 'Amusement', 
      nl: 'Pretparken', 
      pl: 'Rozrywka', 
      zh: '游乐园区', 
      es: 'Atracciones',
      de: 'Freizeitparks',
      ro: 'Parcuri Distracție',
      fr: 'Parcs d\'Attractions'
    },
    subtitle: {
      pl: 'Parki Rozrywki & Koła 🎡',
      en: 'Theme Parks & Ferris Wheels 🎡',
      nl: 'Attracties & Reuzenrad 🎡',
      de: 'Freizeitparks & Riesenrad 🎡',
      es: 'Parques de Atracciones 🎡',
      fr: 'Parcs à Thème & Grande Roue 🎡',
      ro: 'Parcuri de Aventură 🎡',
      zh: '主题乐园与摩天轮 🎡'
    },
    colorClasses: {
      iconBg: 'bg-purple-100 text-purple-900 border-2 border-purple-400 shadow-sm',
      iconText: 'text-purple-900',
      cloudActiveBg: 'from-purple-100 to-purple-200 border-purple-500 shadow-[0_0_16px_rgba(168,85,247,0.35)] ring-2 ring-purple-400/40',
      bubblesActiveBg: 'bg-purple-100 border-purple-500',
      borderColor: 'border-purple-500'
    }
  }
];

const SUN_GREETINGS: Record<Language, { title: string; subtitle: string }> = {
  pl: {
    title: "Witaj słoneczko, gdzie mnie dzisiaj zabierzesz? ☀️",
    subtitle: "Kliknij na dowolną chmurkę lub słoneczko, aby wybrać rodzaj atrakcji z bazy!"
  },
  nl: {
    title: "Hallo zon, waar breng je me vandaag naartoe? ☀️",
    subtitle: "Klik op het zonnetje of een wolk om direct alle musea, bossen en attracties uit de database te kiezen!"
  },
  en: {
    title: "Hello sun, where will you take me today? ☀️",
    subtitle: "Click the sun or any cloud to open the full selection of museums, forests and attractions in the database!"
  },
  de: {
    title: "Hallo Sonne, wohin bringst du mich heute? ☀️",
    subtitle: "Klicken Sie auf die Sonne oder eine Wolke, um Museen, Wälder und Attraktionen auszuwählen!"
  },
  fr: {
    title: "Bonjour soleil, où m'emmènes-tu aujourd'hui ? ☀️",
    subtitle: "Cliquez sur le soleil ou un nuage pour choisir parmi tous les musées et attractions !"
  },
  ro: {
    title: "Bună soare, unde mă vei duce astăzi? ☀️",
    subtitle: "Apasă pe soare sau pe orice nor pentru a alege din baza de date de muzee și atracții!"
  },
  es: {
    title: "Hola sol, ¿a dónde me llevarás hoy? ☀️",
    subtitle: "¡Toca el sol o cualquier nube para elegir entre todos los museos y atracciones!"
  },
  zh: {
    title: "你好阳光，今天你要带我要去哪里？☀️",
    subtitle: "点击太阳或任何云朵，直接在数据库中选择您想去的博物馆、森林和景点！"
  }
};

/**
 * Animated Senior-Friendly Icon Component
 * Gives dynamic micro-animations matching the nature of the category (sway, pulse, spin, float, wave, bounce)
 */
function AnimatedCategoryIcon({ 
  icon: Icon, 
  animationType, 
  isPriority,
  isLargeMode,
  isClicked
}: { 
  icon: any; 
  animationType: string; 
  isPriority?: boolean;
  isLargeMode?: boolean;
  isClicked?: boolean;
}) {
  let animateProps: any = {};
  let transitionProps: any = {};

  if (animationType === 'spin') {
    animateProps = { rotate: [0, 360] };
    transitionProps = { repeat: Infinity, duration: 12, ease: 'linear' };
  } else if (animationType === 'sway') {
    animateProps = { rotate: [-8, 8, -8] };
    transitionProps = { repeat: Infinity, duration: 2.2, ease: 'easeInOut' };
  } else if (animationType === 'pulse') {
    animateProps = { scale: [1, 1.15, 1], y: [0, -1, 0] };
    transitionProps = { repeat: Infinity, duration: 1.8, ease: 'easeInOut' };
  } else if (animationType === 'float') {
    animateProps = { y: [-2, 2, -2], rotate: [-2, 2, -2] };
    transitionProps = { repeat: Infinity, duration: 2.2, ease: 'easeInOut' };
  } else if (animationType === 'wave') {
    animateProps = { y: [-2, 2, -2], rotate: [-6, 6, -6] };
    transitionProps = { repeat: Infinity, duration: 2.2, ease: 'easeInOut' };
  } else if (animationType === 'bounce') {
    animateProps = { y: [-2.5, 0, -2.5] };
    transitionProps = { repeat: Infinity, duration: 1.4, ease: 'easeInOut' };
  } else if (animationType === 'wiggle') {
    animateProps = { rotate: [0, 10, -10, 0], scale: [1, 1.08, 1] };
    transitionProps = { repeat: Infinity, duration: 2, ease: 'easeInOut' };
  }

  // Size definition: priority categories (Muzea, Parki, Zabytki) receive enlarged icons
  const iconSizeClass = isLargeMode
    ? (isPriority ? 'w-7 h-7 stroke-[2.5]' : 'w-6 h-6 stroke-[2.3]')
    : (isPriority ? 'w-5.5 h-5.5 stroke-[2.5]' : 'w-4.5 h-4.5 stroke-[2.3]');

  return (
    <motion.div
      animate={isClicked ? { scale: [1, 1.35, 1], rotate: [0, 15, -15, 0] } : animateProps}
      transition={isClicked ? { duration: 0.4 } : transitionProps}
      className="flex items-center justify-center shrink-0 drop-shadow-xs"
    >
      <Icon className={iconSizeClass} />
    </motion.div>
  );
}

export default function CategoryDashboard({ 
  language, 
  selectedCategory, 
  onSelectCategory, 
  onNavigateTab,
  selectedCountry = 'all',
  onSelectCountry,
  onSelectAttraction,
  onPlanRoute,
  userCoords = null,
  userLocationName = '',
  account = null
}: CategoryDashboardProps) {
  
  // Selection Modal State
  const [modalCategory, setModalCategory] = useState<string | null>(null);
  const [modalSearch, setModalSearch] = useState<string>('');
  const [modalCountry, setModalCountry] = useState<string>(selectedCountry || 'all');
  const [selectedAttractionModal, setSelectedAttractionModal] = useState<Attraction | null>(null);
  const [customAttractions, setCustomAttractions] = useState<Attraction[]>([]);

  // Direct In-App Route Planner State
  const [activeRouteAttraction, setActiveRouteAttraction] = useState<Attraction | null>(null);
  const [activeRouteTravelMode, setActiveRouteTravelMode] = useState<TravelMode>('car');

  const handleTriggerTripPlan = (att: Attraction, mode: TravelMode = 'car') => {
    if (onPlanRoute) {
      onPlanRoute(att, mode);
    } else {
      setActiveRouteTravelMode(mode);
      setActiveRouteAttraction(att);
    }
  };

  // Keep modalCountry synced if parent changes selectedCountry
  useEffect(() => {
    if (selectedCountry) {
      setModalCountry(selectedCountry);
    }
  }, [selectedCountry]);
  
  // Layout view switcher: 'solar' (default orbital sun track), 'grid' (2-column balanced grid), 'list' (full-width list)
  const [layoutMode, setLayoutMode] = useState<'solar' | 'grid' | 'list'>('solar');
  
  // Visual click feedback animation state
  const [clickedCategoryId, setClickedCategoryId] = useState<string | null>(null);
  const [seniorFriendlyMode, setSeniorFriendlyMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tadzik_senior_category_mode') === 'true';
    } catch {
      return true; // Enabled by default for senior clarity
    }
  });

  // 5-second Inactivity Hint for Seniors (subtle pulsating circles & guides)
  const [showInactivityHints, setShowInactivityHints] = useState<boolean>(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = useCallback(() => {
    setShowInactivityHints(false);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      setShowInactivityHints(true);
    }, 5000);
  }, []);

  useEffect(() => {
    resetInactivityTimer();

    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener('mousemove', handleUserActivity, { passive: true });
    window.addEventListener('pointerdown', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });
    window.addEventListener('scroll', handleUserActivity, { passive: true });

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('pointerdown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, [resetInactivityTimer]);

  const toggleSeniorMode = () => {
    resetInactivityTimer();
    const next = !seniorFriendlyMode;
    setSeniorFriendlyMode(next);
    try {
      localStorage.setItem('tadzik_senior_category_mode', next ? 'true' : 'false');
    } catch {}
  };

  // Country mapping
  const countryByCity: Record<string, string> = {
    'Rotterdam': 'nl',
    'Amsterdam': 'nl',
    'Utrecht': 'nl',
    'The Hague': 'nl',
    'Arnhem': 'nl',
    'Apeldoorn': 'nl',
    'Breda': 'nl',
    'Brussels': 'be',
    'Antwerp': 'be',
    'Paris': 'fr',
    'Berlin': 'de',
    'Warsaw': 'pl',
    'Kraków': 'pl',
    'Poznań': 'pl',
    'Gdańsk': 'pl',
    'Sopot': 'pl',
    'Katowice': 'pl'
  };

  const COUNTRIES_LIST = [
    { id: 'all', label: language === 'pl' ? 'Wszystkie kraje 🌍' : language === 'nl' ? 'Alle landen 🌍' : 'All countries 🌍', flag: '🌍', badge: '5' },
    { id: 'nl', label: language === 'pl' ? 'Holandia' : language === 'nl' ? 'Nederland' : 'Netherlands', flag: '🇳🇱', badge: 'NL' },
    { id: 'pl', label: language === 'pl' ? 'Polska' : language === 'nl' ? 'Polen' : 'Poland', flag: '🇵🇱', badge: 'PL' },
    { id: 'de', label: language === 'pl' ? 'Niemcy' : language === 'nl' ? 'Duitsland' : 'Germany', flag: '🇩🇪', badge: 'DE' },
    { id: 'be', label: language === 'pl' ? 'Belgia' : language === 'nl' ? 'België' : 'Belgium', flag: '🇧🇪', badge: 'BE' },
    { id: 'fr', label: language === 'pl' ? 'Francja' : language === 'nl' ? 'Frankrijk' : 'France', flag: '🇫🇷', badge: 'FR' }
  ];

  // Load custom user attractions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nl_tourist_planner_custom_attractions');
      if (saved) {
        setCustomAttractions(JSON.parse(saved));
      }
    } catch (err) {}
  }, [modalCategory]);

  const handleCloudClick = (cat: CategoryItem) => {
    resetInactivityTimer();
    // Trigger visual tap feedback
    setClickedCategoryId(cat.id);
    setTimeout(() => {
      setClickedCategoryId(null);
    }, 600);

    if (cat.targetTab === 'cycling') {
      onNavigateTab('cycling');
    } else {
      // Set active category and open the interactive selection menu modal!
      onSelectCategory(cat.id);
      setModalCategory(cat.id);
      setModalCountry(selectedCountry || 'all');
      setSelectedAttractionModal(null);
      setModalSearch('');
    }
  };

  const handleSunClick = () => {
    resetInactivityTimer();
    setClickedCategoryId('all');
    setTimeout(() => {
      setClickedCategoryId(null);
    }, 600);

    onSelectCategory('all');
    setModalCategory('all');
    setModalCountry(selectedCountry || 'all');
    setSelectedAttractionModal(null);
    setModalSearch('');
  };

  // Combine seeded + custom user attractions
  const allAttractions = [...SEEDED_ATTRACTIONS, ...customAttractions];

  // Helper filter attractions by category & country
  const getFilteredAttractionsForCategory = (catId: string | null, search: string, countryFilter: string) => {
    if (!catId) return [];
    
    return allAttractions.filter((att) => {
      // Country logic
      if (countryFilter !== 'all') {
        const c = countryByCity[att.city] || 'nl';
        if (c !== countryFilter) return false;
      }

      // Category logic
      if (catId !== 'all') {
        if (catId === 'museum' && att.category !== 'museum') return false;
        if (catId === 'forest' && att.category !== 'forest') return false;
        if (catId === 'romantic' && att.category !== 'romantic' && (!att.moods || !att.moods.includes('romantic sunset'))) return false;
        if (catId === 'beach' && att.category !== 'beach') return false;
        if (catId === 'toddler_park' && att.category !== 'toddler_park' && att.category !== 'childrens_attraction') return false;
        if (catId === 'adult_park' && att.category !== 'adult_park' && att.category !== 'amusement_park') return false;
        if (catId === 'historical' && att.category !== 'historical' && att.category !== 'historical_site') return false;
        if (catId === 'park' && att.category !== 'park') return false;
        if (catId === 'waterway' && att.category !== 'waterway') return false;
        if (catId === 'restaurant_cafe' && att.category !== 'restaurant_cafe') return false;
      }

      // Search logic
      if (search.trim() !== '') {
        const q = search.toLowerCase();
        const matchesName = att.name.toLowerCase().includes(q);
        const matchesCity = att.city.toLowerCase().includes(q);
        const matchesRegion = att.region ? att.region.toLowerCase().includes(q) : false;
        const matchesDesc = att.adultVersion.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesRegion && !matchesDesc) return false;
      }

      return true;
    });
  };

  const modalMatchingList = getFilteredAttractionsForCategory(modalCategory, modalSearch, modalCountry);
  const activeCategoryObj = CATEGORIES.find(c => c.id === modalCategory);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 bg-gradient-to-b from-sky-50 via-indigo-50/20 to-amber-50/30 border-2 border-indigo-100 rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-md relative text-center overflow-hidden" id="category-solar-hub">
      {/* Whimsical backdrop style */}
      <div className="absolute top-4 right-6 text-indigo-400/80 font-mono text-[10px] font-black pointer-events-none select-none uppercase tracking-widest hidden md:flex items-center gap-1">
        <span>☀️ European Solar Navigation Hub</span>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <span>{(SUN_GREETINGS[language] || SUN_GREETINGS['en']).title}</span>
        </h2>
        <p className="text-slate-600 font-semibold text-xs md:text-sm mt-1 max-w-lg mx-auto">
          {(SUN_GREETINGS[language] || SUN_GREETINGS['en']).subtitle}
        </p>

        {/* Controls Bar: Senior Mode & Layout Switcher */}
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
          {/* Senior Mode Toggle */}
          <button
            type="button"
            onClick={toggleSeniorMode}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
              seniorFriendlyMode 
                ? 'bg-amber-400 text-slate-950 border-amber-500 ring-2 ring-amber-300' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title="Przełącz powiększone ikony i opisy dla seniorów"
          >
            <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>
              {language === 'pl' 
                ? (seniorFriendlyMode ? '👓 Duże ikony' : '👓 Standard')
                : (seniorFriendlyMode ? '👓 Large Icons' : '👓 Standard')}
            </span>
          </button>

          {/* View Mode Switcher */}
          <div className="inline-flex bg-white p-0.5 rounded-full border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                resetInactivityTimer();
                setLayoutMode('solar');
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                layoutMode === 'solar'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={language === 'pl' ? 'Układ słoneczny (ścieżka)' : 'Solar Path'}
            >
              <span>☀️</span>
              <span className="hidden xs:inline">{language === 'pl' ? 'Słoneczko' : 'Solar'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                resetInactivityTimer();
                setLayoutMode('grid');
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                layoutMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={language === 'pl' ? 'Układ kafelkowy (siatka)' : 'Grid'}
            >
              <span>🔲</span>
              <span className="hidden xs:inline">{language === 'pl' ? 'Siatka' : 'Grid'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                resetInactivityTimer();
                setLayoutMode('list');
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                layoutMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={language === 'pl' ? 'Układ listy' : 'List'}
            >
              <span>📋</span>
              <span className="hidden xs:inline">{language === 'pl' ? 'Lista' : 'List'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🌍 KROK 1: WYBÓR KRAJU PRZED SŁONECZKIEM I CHMURKAMI */}
      <div className="mb-5 p-3 sm:p-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-indigo-100 shadow-sm text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
          <label className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
            <span className="text-base">🗺️</span>
            <span>{language === 'pl' ? 'Krok 1: Wybierz kraj do zwiedzania:' : language === 'nl' ? 'Stap 1: Kies een land om te ontdekken:' : 'Step 1: Choose country to explore:'}</span>
          </label>
          {selectedCountry !== 'all' && onSelectCountry && (
            <button
              type="button"
              onClick={() => onSelectCountry('all')}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer self-start sm:self-auto"
            >
              {language === 'pl' ? 'Pokaż wszystkie kraje' : 'Show all countries'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2">
          {COUNTRIES_LIST.map((country) => {
            const isCountryActive = selectedCountry === country.id;
            return (
              <motion.button
                key={country.id}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                id={`btn-solar-country-${country.id}`}
                onClick={() => {
                  if (onSelectCountry) {
                    onSelectCountry(country.id);
                  }
                }}
                className={`py-1.5 sm:py-2 px-2 sm:px-2.5 rounded-xl font-black text-[11px] sm:text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 border shadow-2xs ${
                  isCountryActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-700 shadow-md scale-102 ring-2 ring-indigo-300'
                    : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border-slate-200 hover:border-indigo-300'
                }`}
                title={country.label}
              >
                <span className="text-sm sm:text-base leading-none shrink-0">{country.flag}</span>
                <span className="truncate">{country.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* CATEGORY DISPLAY SECTIONS (Solar / Grid / List) */}
      <div className="relative py-2 sm:py-4 w-full" id="solar-orbital-viewport">
        {/* 💡 Delikatna 5-sekundowa wskazówka dla Seniora, gdy nie wykonał żadnej akcji */}
        <AnimatePresence>
          {showInactivityHints && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mb-5 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 shadow-lg border-2 border-amber-500 flex items-center justify-between gap-2.5 text-left z-30 relative ring-4 ring-amber-300/40"
              id="senior-inactivity-hint-banner"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-bold text-lg sm:text-xl border border-amber-600/30"
                >
                  💡
                </motion.div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-slate-950 tracking-tight leading-snug">
                    <span>
                      {language === 'pl' 
                        ? 'Wskazówka: Kliknij pulsującą kategorię, aby zaplanować wycieczkę!' 
                        : language === 'nl' 
                        ? 'Tip: Klik op een categorie om bezienswaardigheden te ontdekken!' 
                        : 'Helpful Tip: Tap any pulsing category below to plan your trip!'}
                    </span>
                  </h4>
                  <p className="text-[10px] sm:text-xs font-bold text-amber-950/90 leading-tight">
                    {language === 'pl'
                      ? 'Dla seniorów polecamy: Muzea 🏛️, Parki 🌷 oraz Zabytki 🏰 ze spokojnymi alejkami.'
                      : language === 'nl'
                      ? 'Aanbevolen: Musea 🏛️, Parken 🌷 en Kastelen 🏰 met rustige wandelpaden.'
                      : 'Recommended for relaxed pace: Museums 🏛️, Parks 🌷 and Historical Castles 🏰.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInactivityHints(false)}
                className="p-1.5 rounded-xl bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 cursor-pointer transition-colors shrink-0"
                title={language === 'pl' ? 'Zamknij podpowiedź' : 'Close tip'}
                aria-label="Close tip"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Central Sun Component (Always available as "All" quick trigger) */}
        <div className="flex justify-center mb-6 sm:mb-8 relative z-10">
          <div className="relative">
            {/* 5-second inactivity pulsating halo on central sun */}
            {showInactivityHints && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: [1, 1.35, 1.65], opacity: [0.8, 0.4, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-4 border-amber-400 bg-amber-400/30 pointer-events-none z-20"
              />
            )}

            {/* Click ripple animation on Sun */}
            <AnimatePresence>
              {clickedCategoryId === 'all' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.9 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border-4 border-amber-400 bg-amber-400/30 pointer-events-none z-30"
                />
              )}
            </AnimatePresence>

            <motion.button 
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92, rotate: 15 }}
              onClick={handleSunClick}
              className={`group relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 border-2 border-amber-300 rounded-full shadow-lg flex flex-col items-center justify-center select-none cursor-pointer ${
                selectedCategory === 'all' 
                  ? 'ring-4 ring-amber-400/50 border-orange-600 shadow-amber-300/50 scale-108' 
                  : 'hover:shadow-xl'
              }`}
              id="glowing-central-sun"
              title={language === 'pl' ? 'Pokaż wszystkie atrakcje z bazy' : 'All Attractions'}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none"
              >
                <div className="w-13 h-13 sm:w-16 sm:h-16 border-2 border-dashed border-amber-700 rounded-full"></div>
              </motion.div>

              {/* Glowing inner core */}
              <div className="relative flex flex-col items-center justify-center text-center">
                <span className="text-xl sm:text-2xl drop-shadow-md leading-none">☀️</span>
                <span className="font-sans font-black text-[8px] sm:text-[9px] text-amber-950 uppercase tracking-wider mt-0.5 px-1.5 py-0.5 bg-amber-200/80 rounded-full border border-amber-700/20 shadow-2xs">
                  {language === 'pl' ? 'WSZYSTKIE' : language === 'nl' ? 'ALLE' : 'ALL'}
                </span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* MODE 1: SOLAR ORBITAL ALTERNATING TRACK (Strictly fitted within container margins) */}
        {layoutMode === 'solar' && (
          <div className="relative w-full">
            {/* Central vertical golden-orange ray */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-amber-400/80 -translate-x-1/2 pointer-events-none z-0"></div>

            {/* Alternating Clouds */}
            <div className="space-y-4 sm:space-y-5 relative z-10 w-full">
              {CATEGORIES.map((cat, idx) => {
                const isSelected = selectedCategory === cat.id;
                const isLeft = idx % 2 === 0;
                const isClicked = clickedCategoryId === cat.id;

                return (
                  <div key={cat.id} className="flex items-center w-full relative min-h-[46px] sm:min-h-[52px]">
                    {/* Center node indicator */}
                    <div 
                      className={`absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-300 z-20 ${
                        isSelected 
                          ? 'bg-amber-500 border-orange-600 scale-125 shadow-md ring-2 ring-amber-300' 
                          : 'bg-white border-amber-400 group-hover:border-amber-500'
                      }`}
                    />

                    {/* Left side column */}
                    <div className="w-1/2 flex justify-end pr-2.5 sm:pr-4 md:pr-6 z-10 min-w-0">
                      {isLeft && (
                        <div className="relative max-w-full min-w-0">
                          {/* Click ripple animation burst */}
                          <AnimatePresence>
                            {isClicked && (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0.9 }}
                                animate={{ scale: 1.35, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className={`absolute inset-0 rounded-2xl border-2 ${cat.colorClasses.borderColor} bg-amber-300/25 pointer-events-none z-30`}
                              />
                            )}
                          </AnimatePresence>

                          <motion.button
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            onClick={() => handleCloudClick(cat)}
                            className={`group relative flex items-center justify-start gap-1.5 sm:gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl min-h-[44px] sm:min-h-[52px] w-full max-w-[150px] xs:max-w-[185px] sm:max-w-[245px] cursor-pointer text-slate-900 border-2 transition-all shadow-2xs ${
                              isSelected 
                                ? `bg-gradient-to-r ${cat.colorClasses.cloudActiveBg}` 
                                : 'bg-white/95 hover:bg-slate-50 border-slate-200/90 hover:border-indigo-300 hover:shadow-xs'
                            }`}
                            title={`${cat.label[language]} - ${cat.subtitle[language] || ''}`}
                          >
                            {/* Cloud Bubbles decoration - scaled down for compact fit */}
                            <span 
                              className={`absolute -top-1 left-2 w-3 h-3 rounded-full border-t border-l pointer-events-none ${
                                isSelected ? cat.colorClasses.bubblesActiveBg : 'bg-white border-slate-200'
                              }`} 
                            />
                            <span 
                              className={`absolute -top-1.5 left-5 w-4 h-4 rounded-full border-t border-x pointer-events-none ${
                                isSelected ? cat.colorClasses.bubblesActiveBg : 'bg-white border-slate-200'
                              }`} 
                            />

                            {/* Animated Category Icon in Senior-Friendly High Contrast Badge with Inactivity Pulsing Circle */}
                            <div className="relative shrink-0">
                              {/* Delikatna animacja wskazówki (pulsujący okrąg) po 5 sekundach braku akcji */}
                              {showInactivityHints && (
                                <>
                                  <motion.span
                                    initial={{ scale: 0.9, opacity: 0.9 }}
                                    animate={{ scale: [1, 1.45, 1.8], opacity: [0.85, 0.35, 0] }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 2.2,
                                      ease: "easeOut",
                                      delay: (idx % 4) * 0.3
                                    }}
                                    className={`absolute -inset-1 rounded-xl border-2 pointer-events-none z-10 ${
                                      cat.isPrioritySenior 
                                        ? 'border-amber-500 bg-amber-400/25 ring-1 ring-amber-300/40' 
                                        : 'border-indigo-400 bg-indigo-400/20'
                                    }`}
                                  />
                                  {cat.isPrioritySenior && (
                                    <motion.span
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                      className="absolute -top-1.5 -left-1.5 bg-amber-400 text-slate-950 font-black text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-2xs border border-white z-30 pointer-events-none"
                                      title="Polecane dla Seniora"
                                    >
                                      ✨
                                    </motion.span>
                                  )}
                                </>
                              )}

                              <div className={`p-1 sm:p-2 rounded-lg sm:rounded-xl relative z-10 ${cat.colorClasses.iconBg} ${isSelected ? 'ring-2 ring-amber-400' : ''}`}>
                                <AnimatedCategoryIcon 
                                  icon={cat.icon} 
                                  animationType={cat.animationType}
                                  isPriority={cat.isPrioritySenior}
                                  isLargeMode={seniorFriendlyMode}
                                  isClicked={isClicked}
                                />
                              </div>
                            </div>

                            {/* Text Content */}
                            <div className="relative z-10 flex flex-col text-left py-0 min-w-0 flex-1 overflow-hidden">
                              <div className="flex items-center gap-1 min-w-0">
                                <span className={`select-none font-black text-slate-900 leading-tight truncate ${seniorFriendlyMode ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-xs'}`}>
                                  {cat.label[language]}
                                </span>
                                {cat.isPrioritySenior && (
                                  <span className="text-[8px] bg-amber-400 text-slate-950 font-black px-1 py-0.2 rounded shrink-0 hidden xs:inline-block">
                                    TOP
                                  </span>
                                )}
                              </div>

                              {/* Subtitle helper description */}
                              <span className="text-[9px] sm:text-[10.5px] font-bold text-slate-500 leading-tight truncate mt-0.5">
                                {cat.subtitle[language] || cat.subtitle['en']}
                              </span>
                            </div>

                            {/* Animated vehicle emoji */}
                            <motion.span 
                              animate={{ y: [-1, 1, -1] }} 
                              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                              className="text-xs sm:text-base shrink-0 opacity-85 group-hover:opacity-100 transition-transform ml-0.5"
                            >
                              {cat.vehicleEmoji}
                            </motion.span>
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Right side column */}
                    <div className="w-1/2 flex justify-start pl-2.5 sm:pl-4 md:pr-6 z-10 min-w-0">
                      {!isLeft && (
                        <div className="relative max-w-full min-w-0">
                          {/* Click ripple animation burst */}
                          <AnimatePresence>
                            {isClicked && (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0.9 }}
                                animate={{ scale: 1.35, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className={`absolute inset-0 rounded-2xl border-2 ${cat.colorClasses.borderColor} bg-amber-300/25 pointer-events-none z-30`}
                              />
                            )}
                          </AnimatePresence>

                          <motion.button
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            onClick={() => handleCloudClick(cat)}
                            className={`group relative flex items-center justify-start gap-1.5 sm:gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl min-h-[44px] sm:min-h-[52px] w-full max-w-[150px] xs:max-w-[185px] sm:max-w-[245px] cursor-pointer text-slate-900 border-2 transition-all shadow-2xs ${
                              isSelected 
                                ? `bg-gradient-to-r ${cat.colorClasses.cloudActiveBg}` 
                                : 'bg-white/95 hover:bg-slate-50 border-slate-200/90 hover:border-indigo-300 hover:shadow-xs'
                            }`}
                            title={`${cat.label[language]} - ${cat.subtitle[language] || ''}`}
                          >
                            {/* Cloud Bubbles decoration */}
                            <span 
                              className={`absolute -top-1 left-2 w-3 h-3 rounded-full border-t border-l pointer-events-none ${
                                isSelected ? cat.colorClasses.bubblesActiveBg : 'bg-white border-slate-200'
                              }`} 
                            />
                            <span 
                              className={`absolute -top-1.5 left-5 w-4 h-4 rounded-full border-t border-x pointer-events-none ${
                                isSelected ? cat.colorClasses.bubblesActiveBg : 'bg-white border-slate-200'
                              }`} 
                            />

                            {/* Animated Category Icon in Senior-Friendly High Contrast Badge with Inactivity Pulsing Circle */}
                            <div className="relative shrink-0">
                              {/* Delikatna animacja wskazówki (pulsujący okrąg) po 5 sekundach braku akcji */}
                              {showInactivityHints && (
                                <>
                                  <motion.span
                                    initial={{ scale: 0.9, opacity: 0.9 }}
                                    animate={{ scale: [1, 1.45, 1.8], opacity: [0.85, 0.35, 0] }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 2.2,
                                      ease: "easeOut",
                                      delay: (idx % 4) * 0.3
                                    }}
                                    className={`absolute -inset-1 rounded-xl border-2 pointer-events-none z-10 ${
                                      cat.isPrioritySenior 
                                        ? 'border-amber-500 bg-amber-400/25 ring-1 ring-amber-300/40' 
                                        : 'border-indigo-400 bg-indigo-400/20'
                                    }`}
                                  />
                                  {cat.isPrioritySenior && (
                                    <motion.span
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                      className="absolute -top-1.5 -left-1.5 bg-amber-400 text-slate-950 font-black text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-2xs border border-white z-30 pointer-events-none"
                                      title="Polecane dla Seniora"
                                    >
                                      ✨
                                    </motion.span>
                                  )}
                                </>
                              )}

                              <div className={`p-1 sm:p-2 rounded-lg sm:rounded-xl relative z-10 ${cat.colorClasses.iconBg} ${isSelected ? 'ring-2 ring-amber-400' : ''}`}>
                                <AnimatedCategoryIcon 
                                  icon={cat.icon} 
                                  animationType={cat.animationType}
                                  isPriority={cat.isPrioritySenior}
                                  isLargeMode={seniorFriendlyMode}
                                  isClicked={isClicked}
                                />
                              </div>
                            </div>

                            {/* Text Content */}
                            <div className="relative z-10 flex flex-col text-left py-0 min-w-0 flex-1 overflow-hidden">
                              <div className="flex items-center gap-1 min-w-0">
                                <span className={`select-none font-black text-slate-900 leading-tight truncate ${seniorFriendlyMode ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-xs'}`}>
                                  {cat.label[language]}
                                </span>
                                {cat.isPrioritySenior && (
                                  <span className="text-[8px] bg-amber-400 text-slate-950 font-black px-1 py-0.2 rounded shrink-0 hidden xs:inline-block">
                                    TOP
                                  </span>
                                )}
                              </div>

                              {/* Subtitle helper description */}
                              <span className="text-[9px] sm:text-[10.5px] font-bold text-slate-500 leading-tight truncate mt-0.5">
                                {cat.subtitle[language] || cat.subtitle['en']}
                              </span>
                            </div>

                            {/* Animated vehicle emoji */}
                            <motion.span 
                              animate={{ y: [-1, 1, -1] }} 
                              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                              className="text-xs sm:text-base shrink-0 opacity-85 group-hover:opacity-100 transition-transform ml-0.5"
                            >
                              {cat.vehicleEmoji}
                            </motion.span>
                          </motion.button>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 2: RESPONSIVE GRID (2 Columns, perfectly aligned, 100% visible) */}
        {layoutMode === 'grid' && (
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3 text-left">
            {CATEGORIES.map((cat, idx) => {
              const isSelected = selectedCategory === cat.id;
              const isClicked = clickedCategoryId === cat.id;

              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleCloudClick(cat)}
                  className={`group relative flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl border-2 transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? `bg-gradient-to-r ${cat.colorClasses.cloudActiveBg} ring-2 ring-amber-400 border-amber-500`
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="relative shrink-0">
                    {showInactivityHints && (
                      <motion.span
                        animate={{ scale: [1, 1.3, 1.5], opacity: [0.8, 0.4, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: (idx % 3) * 0.3 }}
                        className="absolute -inset-1 rounded-xl border-2 border-amber-400 pointer-events-none"
                      />
                    )}
                    <div className={`p-2 rounded-xl ${cat.colorClasses.iconBg}`}>
                      <AnimatedCategoryIcon 
                        icon={cat.icon} 
                        animationType={cat.animationType}
                        isPriority={cat.isPrioritySenior}
                        isLargeMode={seniorFriendlyMode}
                        isClicked={isClicked}
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-black text-xs sm:text-sm text-slate-900 truncate">
                        {cat.label[language]}
                      </span>
                      {cat.isPrioritySenior && (
                        <span className="text-[8px] bg-amber-400 text-slate-950 font-black px-1 py-0.2 rounded shrink-0">
                          TOP
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500 truncate mt-0.5">
                      {cat.subtitle[language] || cat.subtitle['en']}
                    </p>
                  </div>

                  <span className="text-base shrink-0 opacity-80 group-hover:scale-115 transition-transform">
                    {cat.vehicleEmoji}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* MODE 3: FULL-WIDTH LIST (Maximum legibility and detailed subtitles for seniors) */}
        {layoutMode === 'list' && (
          <div className="space-y-2 text-left">
            {CATEGORIES.map((cat, idx) => {
              const isSelected = selectedCategory === cat.id;
              const isClicked = clickedCategoryId === cat.id;

              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCloudClick(cat)}
                  className={`w-full group relative flex items-center justify-between gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? `bg-gradient-to-r ${cat.colorClasses.cloudActiveBg} ring-2 ring-amber-400 border-amber-500`
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      {showInactivityHints && (
                        <motion.span
                          animate={{ scale: [1, 1.3, 1.5], opacity: [0.8, 0.4, 0] }}
                          transition={{ repeat: Infinity, duration: 2, delay: (idx % 3) * 0.3 }}
                          className="absolute -inset-1 rounded-xl border-2 border-amber-400 pointer-events-none"
                        />
                      )}
                      <div className={`p-2.5 rounded-xl ${cat.colorClasses.iconBg}`}>
                        <AnimatedCategoryIcon 
                          icon={cat.icon} 
                          animationType={cat.animationType}
                          isPriority={cat.isPrioritySenior}
                          isLargeMode={seniorFriendlyMode}
                          isClicked={isClicked}
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-slate-900">
                          {cat.label[language]}
                        </span>
                        {cat.isPrioritySenior && (
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-md">
                            🧓 Polecane dla seniora
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {cat.subtitle[language] || cat.subtitle['en']}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-lg opacity-85 group-hover:scale-120 transition-transform">
                      {cat.vehicleEmoji}
                    </span>
                    <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-lg">
                      {language === 'pl' ? 'Otwórz' : 'Open'} →
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Action Button to Open Category Database Picker Modal */}
      <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setModalCategory(selectedCategory || 'museum');
            setSelectedAttractionModal(null);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6 rounded-2xl shadow-md border border-indigo-500 transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-spin" />
          <span>
            {language === 'pl' 
              ? '📋 Wybierz konkretne muzeum lub miejsce z bazy' 
              : language === 'nl' 
              ? '📋 Kies een specifiek museum of plek uit de database' 
              : '📋 Choose specific museum or spot from database'}
          </span>
        </motion.button>

        {selectedCategory !== 'all' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onSelectCategory('all');
              setModalCategory(null);
            }}
            className="bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 px-3.5 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            title="Clear Filter"
          >
            <span>
              {language === 'pl' ? 'Resetuj filtr:' : 'Active Filter:'}{' '}
              <span className="underline font-black">
                {CATEGORIES.find((c) => c.id === selectedCategory)?.label[language]}
              </span>
            </span>
            <X className="w-4 h-4 text-amber-900 stroke-[3]" />
          </motion.button>
        )}
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE CATEGORY ATTRACTION SELECTION MODAL          */}
      {/* ========================================================= */}
      <AnimatePresence>
        {modalCategory && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full overflow-hidden shadow-2xl relative my-auto text-slate-800 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 relative shrink-0 border-b border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setModalCategory(null);
                    setSelectedAttractionModal(null);
                  }}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full cursor-pointer transition-colors z-10"
                  title={language === 'pl' ? 'Zamknij okno' : 'Close'}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3.5 pr-10">
                  <div className="bg-amber-400 text-slate-950 p-3 rounded-2xl shadow-md shrink-0">
                    {activeCategoryObj ? (
                      <AnimatedCategoryIcon 
                        icon={activeCategoryObj.icon}
                        animationType={activeCategoryObj.animationType}
                        isPriority={true}
                        isLargeMode={true}
                      />
                    ) : (
                      <Compass className="w-7 h-7 stroke-[2.5]" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-black text-white tracking-tight flex flex-wrap items-center gap-2">
                      <span>
                        {modalCategory === 'all'
                          ? (language === 'pl' ? 'Wszystkie atrakcje w bazie' : language === 'nl' ? 'Alle attracties in de database' : 'All Database Attractions')
                          : (activeCategoryObj?.label[language] || modalCategory)}
                      </span>
                      <span className="text-xs bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full shadow-xs">
                        {modalMatchingList.length} {language === 'pl' ? 'miejsc' : 'spots'}
                      </span>
                    </h3>
                    <p className="text-slate-300 text-xs font-medium mt-0.5">
                      {language === 'pl'
                        ? 'Zdjęcia, najprostsze informacje o kosztach, dojeździe i opisie dla każdej atrakcji.'
                        : language === 'nl'
                        ? 'Foto\'s, kosten, reisinformatie en beschrijving voor elke attractie.'
                        : 'Photos, budget, transport, and simple overview for each attraction.'}
                    </p>
                  </div>
                </div>

                {/* Country Filter Pills inside Modal */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-3.5 pt-2 border-t border-white/10 scrollbar-none">
                  <span className="text-[11px] font-black text-amber-300 shrink-0 mr-1 flex items-center gap-1">
                    <span>🌍</span>
                    <span>{language === 'pl' ? 'Kraj:' : 'Country:'}</span>
                  </span>
                  {COUNTRIES_LIST.map((c) => {
                    const isCountryActive = modalCountry === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setModalCountry(c.id);
                          if (onSelectCountry && c.id !== 'all') {
                            onSelectCountry(c.id);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                          isCountryActive
                            ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300/40 scale-105'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Category Switcher Pills inside Modal */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-2.5 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => {
                      setModalCategory('all');
                      onSelectCategory('all');
                      setSelectedAttractionModal(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                      modalCategory === 'all'
                        ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300/40'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    ☀️ {language === 'pl' ? 'Wszystkie' : language === 'nl' ? 'Alle' : 'All'}
                  </button>

                  {CATEGORIES.map((cat) => {
                    const CatIcon = cat.icon;
                    const isCatActive = modalCategory === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setModalCategory(cat.id);
                          onSelectCategory(cat.id);
                          setSelectedAttractionModal(null);
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                          isCatActive
                            ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300/40'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        <CatIcon className="w-4 h-4 stroke-[2.5]" />
                        <span>{cat.label[language]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Body with Search + Attraction List */}
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 bg-slate-100/70">
                
                {/* Search box inside modal */}
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    placeholder={
                      language === 'pl'
                        ? `Szukaj w kategorii ${activeCategoryObj?.label['pl'] || 'miejsca'} (nazwa, miasto, opis)...`
                        : language === 'nl'
                        ? `Zoek in ${activeCategoryObj?.label['nl'] || 'locaties'}...`
                        : 'Search name, city, keyword or description...'
                    }
                    className="w-full text-xs sm:text-sm pl-11 pr-8 py-2.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:border-indigo-500 shadow-xs placeholder-slate-400"
                  />
                  {modalSearch && (
                    <button
                      type="button"
                      onClick={() => setModalSearch('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* List of Attractions */}
                {modalMatchingList.length === 0 ? (
                  <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-8 sm:p-12 text-center space-y-3 shadow-xs">
                    <Compass className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
                    <h4 className="text-sm sm:text-base font-black text-slate-800">
                      {language === 'pl'
                        ? 'Brak obiektów pasujących do wybranych filtrów w tej kategorii.'
                        : language === 'nl'
                        ? 'Geen locaties gevonden voor deze filters in deze categorie.'
                        : 'No matching attractions found with current filters.'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      {language === 'pl'
                        ? 'Kliknij inny kraj powyżej (np. „Wszystkie kraje 🌍”) lub zresetuj wyszukiwanie.'
                        : 'Try switching country filter to "All countries" or clearing the search text.'}
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setModalCountry('all');
                          setModalSearch('');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        {language === 'pl' ? 'Pokaż wszystkie kraje 🌍' : 'Show all countries 🌍'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {modalMatchingList.map((att) => {
                      const isSelectedCard = selectedAttractionModal?.id === att.id;
                      const isCustom = att.id.startsWith('custom-');
                      const attCountryCode = countryByCity[att.city] || 'nl';
                      const flag = attCountryCode === 'pl' ? '🇵🇱' : attCountryCode === 'de' ? '🇩🇪' : attCountryCode === 'be' ? '🇧🇪' : attCountryCode === 'fr' ? '🇫🇷' : '🇳🇱';
                      const photoUrl = getAttractionPhoto(att);
                      const isFree = att.adultVersion.budget === 0;

                      const transitInfo = getAttractionTransitInfo(userCoords, att, language);

                      return (
                        <div
                          key={att.id}
                          id={`modal-attraction-${att.id}`}
                          className={`bg-white rounded-3xl border transition-all overflow-hidden shadow-xs hover:shadow-md flex flex-col sm:flex-row gap-0 group ${
                            isSelectedCard
                              ? 'border-indigo-600 ring-2 ring-indigo-500/30 shadow-lg bg-indigo-50/10'
                              : 'border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          {/* Photo Section */}
                          <div className="sm:w-52 md:w-60 h-48 sm:h-auto min-h-[170px] relative shrink-0 bg-slate-900 overflow-hidden">
                            <img
                              src={photoUrl}
                              alt={att.name}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = CATEGORY_FALLBACK_PHOTOS[att.category] || DEFAULT_PLACE_PHOTO;
                              }}
                            />
                            {/* Gradient overlay for badges */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                            {/* Top Badges over Photo */}
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                              <span className="text-[11px] font-black bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-lg border border-white/20 shadow-xs flex items-center gap-1">
                                <span>{flag}</span>
                                <span>{att.city}</span>
                              </span>
                            </div>

                            {/* Bottom Badge: Category or Community */}
                            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                              {isCustom ? (
                                <span className="text-[9px] font-black bg-emerald-600/90 backdrop-blur-md text-white px-2 py-0.5 rounded-md border border-emerald-400/40">
                                  👤 {language === 'pl' ? 'Dodane przez użytkownika' : 'Community'}
                                </span>
                              ) : (
                                <span className="text-[9px] font-black bg-indigo-600/90 backdrop-blur-md text-white px-2 py-0.5 rounded-md border border-indigo-400/40 uppercase tracking-wider">
                                  {att.category}
                                </span>
                              )}
                              
                              <span className="text-[10px] font-black text-amber-300 bg-black/70 px-2 py-0.5 rounded-md">
                                ⏱️ {att.adultVersion.durationMinutes} min
                              </span>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              {/* Header Title and City */}
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                    {att.name}
                                  </h4>
                                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mt-1">
                                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                    <span>{att.city}, {att.region}</span>
                                    {transitInfo.distanceKm > 0 && (
                                      <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-mono text-[11px]">
                                        📍 ~{transitInfo.distanceFormatted}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Price Highlight Tag */}
                                <div className="shrink-0 text-right">
                                  {isFree ? (
                                    <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1">
                                      <span>✅</span>
                                      <span>{language === 'pl' ? 'Wstęp 0 € (Gratis)' : 'Free (0 €)'}</span>
                                    </div>
                                  ) : (
                                    <div className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1">
                                      <span>💶</span>
                                      <span>{att.adultVersion.budget} €</span>
                                      {att.childVersion && att.childVersion.budget > 0 && (
                                        <span className="text-[10px] text-amber-700 font-semibold">(🧸 {att.childVersion.budget} €)</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Short readable description */}
                              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-2.5 line-clamp-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                                {att.adultVersion.description}
                              </p>
                            </div>

                            {/* Multi-modal Travel Options Section (Car, Train, Bus, Walk) */}
                            <div className="pt-2.5 border-t border-slate-100 space-y-2.5">
                              {/* Quick Mode Estimates */}
                              {(() => {
                                const carOpt = transitInfo.options.find(o => o.mode === 'car');
                                const transitOpt = transitInfo.options.find(o => o.mode === 'transit');
                                const busOpt = transitInfo.options.find(o => o.mode === 'bus');
                                const walkOpt = transitInfo.options.find(o => o.mode === 'walk');

                                return (
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider mr-1">
                                      {language === 'pl' ? 'Opcje dojazdu:' : 'Route options:'}
                                    </span>
                                    
                                    <button
                                      type="button"
                                      onClick={() => handleTriggerTripPlan(att, 'car')}
                                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 hover:border-emerald-300 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs hover:scale-103"
                                      title={language === 'pl' ? 'Zaplanuj trasę samochodem' : 'Plan driving route'}
                                    >
                                      <span>🚗</span>
                                      <span>{language === 'pl' ? 'Samochód' : 'Car'}</span>
                                      {carOpt && (
                                        <span className="font-mono text-[11px] font-black text-emerald-700">
                                          {carOpt.timeFormatted}
                                        </span>
                                      )}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleTriggerTripPlan(att, 'transit')}
                                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 hover:border-indigo-300 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs hover:scale-103"
                                      title={language === 'pl' ? 'Zaplanuj trasę pociągiem' : 'Plan train route'}
                                    >
                                      <span>🚆</span>
                                      <span>{language === 'pl' ? 'Pociąg' : 'Train'}</span>
                                      {transitOpt && (
                                        <span className="font-mono text-[11px] font-black text-indigo-700">
                                          {transitOpt.timeFormatted}
                                        </span>
                                      )}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleTriggerTripPlan(att, 'bus')}
                                      className="bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 hover:border-sky-300 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs hover:scale-103"
                                      title={language === 'pl' ? 'Zaplanuj trasę autobusem' : 'Plan bus route'}
                                    >
                                      <span>🚌</span>
                                      <span>{language === 'pl' ? 'Autobus' : 'Bus'}</span>
                                      {busOpt && (
                                        <span className="font-mono text-[11px] font-black text-sky-700">
                                          {busOpt.timeFormatted}
                                        </span>
                                      )}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleTriggerTripPlan(att, 'walk')}
                                      className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 hover:border-amber-300 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs hover:scale-103"
                                      title={language === 'pl' ? 'Trasa piesza' : 'Walking route'}
                                    >
                                      <span>🚶</span>
                                      <span>{language === 'pl' ? 'Pieszo' : 'Walk'}</span>
                                      {walkOpt && (
                                        <span className="font-mono text-[11px] font-black text-amber-700">
                                          {walkOpt.timeFormatted}
                                        </span>
                                      )}
                                    </button>
                                  </div>
                                );
                              })()}

                              {/* Station / Stop info & Main Action Buttons */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                  <div className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-slate-200">
                                    {att.transport.type === 'bus' ? (
                                      <Bus className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                    ) : (
                                      <Train className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                    )}
                                    <span className="truncate max-w-[200px] sm:max-w-xs">
                                      {att.transport.type.toUpperCase()}: {att.transport.line} ({att.transport.stopName})
                                    </span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                  {/* Main Plan Journey Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleTriggerTripPlan(att, 'car')}
                                    className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center gap-1.5 hover:scale-103"
                                  >
                                    <Navigation className="w-4 h-4 stroke-[2.5]" />
                                    <span>{language === 'pl' ? 'Planuj podróż 🧭' : 'Plan Trip 🧭'}</span>
                                  </button>

                                  {/* Select & View in List */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const targetCountry = countryByCity[att.city] || 'nl';
                                      if (onSelectCountry) {
                                        onSelectCountry(targetCountry);
                                      }
                                      if (onSelectAttraction) {
                                        onSelectAttraction(att);
                                      } else {
                                        onSelectCategory(att.category || modalCategory || 'all');
                                        onNavigateTab('explore');
                                      }
                                      setModalCategory(null);
                                    }}
                                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center gap-1.5"
                                  >
                                    <Compass className="w-4 h-4 stroke-[2.5]" />
                                    <span className="hidden sm:inline">{language === 'pl' ? 'Pokaż na liście' : 'View in List'}</span>
                                    <span className="sm:hidden">{language === 'pl' ? 'Lista' : 'List'}</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory(modalCategory || 'all');
                    onNavigateTab('explore');
                    setModalCategory(null);
                  }}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Compass className="w-4 h-4 text-amber-300" />
                  <span>
                    {language === 'pl'
                      ? `Zobacz wszystkie atrakcje na głównej liście (${modalMatchingList.length}) 📋`
                      : `View all spots in main explore list (${modalMatchingList.length}) 📋`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModalCategory(null);
                    setSelectedAttractionModal(null);
                  }}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                >
                  {language === 'pl' ? 'Zamknij okno ✖️' : 'Close ✖️'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Direct In-App Route & Weather Planner Modal */}
      <RouteWeatherModal
        isOpen={!!activeRouteAttraction}
        onClose={() => setActiveRouteAttraction(null)}
        attraction={activeRouteAttraction}
        language={language}
        account={account}
        userCoords={userCoords}
        userLocationName={userLocationName}
        initialTravelMode={activeRouteTravelMode}
      />
    </div>
  );
}
