/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Language, UserAccount, translations } from './types';
import LanguageSelector from './components/LanguageSelector';
import AccountModal from './components/AccountModal';
import ExploreTab from './components/ExploreTab';
import StationPlannerTab from './components/StationPlannerTab';
import PassportTab from './components/PassportTab';
import ChallengesTab from './components/ChallengesTab';
import CyclingRoutesTab from './components/CyclingRoutesTab';
import MotorcycleRoutesTab from './components/MotorcycleRoutesTab';
import HotelSearchTab from './components/HotelSearchTab';
import CategoryDashboard from './components/CategoryDashboard';
import TadzikGuide from './components/TadzikGuide';
import PWAInstallModal from './components/PWAInstallModal';
import ShareAppModal from './components/ShareAppModal';
import LostEmergencyModal from './components/LostEmergencyModal';
import AnimatedTravelVehicle, { SectionTravelCompanion } from './components/AnimatedTravelVehicle';
import UnifiedPaymentCheckout from './components/UnifiedPaymentCheckout';
import { SEEDED_ATTRACTIONS } from './data/attractions';
import { motion } from 'motion/react';
import { Compass, Train, Bike, Building2, Award, Trophy, User, Sparkles, MapPin, CreditCard, Shield, ShieldCheck, Heart, Camera, Check, Info, Lock, ArrowRight, Star, Quote, X, ChevronRight, Map, LogOut, Search, Smartphone, Download, Share2, Users, LifeBuoy, AlertTriangle } from 'lucide-react';

const SELECTED_INFO: Record<Language, string> = {
  en: 'Selected: English 🇬🇧',
  nl: 'Geselecteerd: Nederlands 🇳🇱',
  pl: 'Wybrano: Polski 🇵🇱',
  zh: '已选择: 中文 🇨🇳',
  es: 'Seleccionado: Español 🇪🇸',
  de: 'Ausgewählt: Deutsch 🇩🇪',
  ro: 'Selectat: Română 🇷🇴',
  fr: 'Sélectionné: Français 🇫🇷',
};

function WelcomeBanner({ language }: { language: Language }) {
  const text: Record<Language, { heading: string; subheading: string; body: string; badge: string }> = {
    pl: {
      heading: "Przewodnik Turystyczny & Atrakcje 🏰",
      subheading: "Łatwo i szybko odkrywaj najwspanialsze zabytki, muzea, parki i zakątki Europy — z rozkładem pociągów! 🧭🚆",
      body: "Wyszukuj ponad 250 niezwykłych miejsc do zwiedzania w Holandii, Polsce, Niemczech, Belgii i Francji. Błyskawicznie sprawdzaj opisy, ceny, udogodnienia dla rodzin i seniorów oraz bezpośrednie połączenia kolejowe.",
      badge: "Aplikacja Turystyczna"
    },
    nl: {
      heading: "Toeristische Gids & Attracties 🏰",
      subheading: "Vind snel en eenvoudig de mooiste bezienswaardigheden, musea, parken en kastelen in Europa — inclusief treinverbindingen! 🧭🚆",
      body: "Ontdek meer dan 250 unieke locaties in Nederland, Polen, Duitsland, België en Frankrijk. Bekijk direct praktische info, prijzen, toegankelijkheid en actuele treinroutes.",
      badge: "Toeristische App"
    },
    en: {
      heading: "European Tourist Guide & Attractions 🏰",
      subheading: "Quickly and easily discover top sightseeing landmarks, museums, castles, and parks across Europe — with train schedules! 🧭🚆",
      body: "Explore over 250 hand-picked destinations across the Netherlands, Poland, Germany, Belgium, and France with instant search, senior & family accessibility info, and direct rail connections.",
      badge: "Tourism & Travel Guide"
    },
    de: {
      heading: "Willkommen in der Gemeinschaft der Reisenden! 👋",
      subheading: "Starten Sie eine sorgenfreie Reise durch die Niederlande, Belgien, Frankreich, Deutschland und Polen mit Tadzik! 🧭",
      body: "Tadzik ist ein intelligenter Begleiter, der sich um Ihre Sicherheit kümmert, Ihre Anreise plant und die schönsten Radwege sowie seniorengerechte Ausflugsziele in allen Ländern zeigt.",
      badge: "Offizieller Empfang"
    },
    es: {
      heading: "¡Bienvenido a la comunidad de viajeros! 👋",
      subheading: "¡Emprende un viaje sin preocupaciones por los Países Bajos, Bélgica, Francia, Alemania y Polonia con Tadzik! 🧭",
      body: "Tadzik es un guía inteligente que cuida de tu seguridad, planifica tus trayectos y te muestra las mejores rutas ciclistas y lugares adaptados a todas las edades.",
      badge: "Bienvenida Oficial"
    },
    fr: {
      heading: "Bienvenue dans la communauté des voyageurs ! 👋",
      subheading: "Partez pour un voyage serein aux Pays-Bas, en Belgique, en France, en Allemagne et en Pologne avec Tadzik ! 🧭",
      body: "Tadzik est un compagnon intelligent qui veille sur votre sécurité, planifie vos déplacements et vous fait découvrir les plus belles pistes cyclables et attractions adaptées à tous.",
      badge: "Bienvenue Officielle"
    },
    ro: {
      heading: "Bine ați venit în comunitatea călătorilor! 👋",
      subheading: "Porniți într-o călătorie fără griji prin Olanda, Belgia, Franța, Germania și Polonia alături de Tadzik! 🧭",
      body: "Tadzik este un ghid inteligent care are grijă de siguranța dumneavoastră, planifică rutele și vă arată cele mai frumoase piste de biciclete și atracții accesibile pentru toate vârstele.",
      badge: "Bun venit oficial"
    },
    zh: {
      heading: "欢迎加入旅行者大家庭！👋",
      subheading: "与 Tadzik 一起开启畅游荷兰、比利时、法国、德国与波兰的无忧之旅！🧭",
      body: "Tadzik 是您的贴心智能向导，全方位保障您的安全，规划便捷交通，并为您展示最美骑行路线与适合全家各年龄段的优质景点。",
      badge: "官方欢迎致辞"
    }
  };

  const current = text[language] || text.en;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto mb-6 px-4 md:px-0" 
      id="welcome-family-banner"
    >
      <div className="relative bg-gradient-to-br from-indigo-50/90 to-amber-50/60 border-2 border-amber-300 rounded-2xl p-6 md:p-8 shadow-md overflow-hidden flex flex-col md:flex-row items-center gap-6">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider select-none shadow-xs">
          {current.badge}
        </div>
        
        {/* Animated Compass Icon in amber background */}
        <div className="w-16 h-16 shrink-0 bg-amber-100 text-amber-700 rounded-full border-2 border-amber-200 shadow-sm flex items-center justify-center text-3xl select-none animate-pulse">
          🧭
        </div>

        <div className="space-y-2.5 text-center md:text-left flex-1">
          <h2 className="font-display text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {current.heading}
          </h2>
          <h3 className="font-sans text-sm md:text-base font-extrabold text-indigo-950 leading-relaxed">
            {current.subheading}
          </h3>
          <p className="font-sans text-xs md:text-sm text-slate-600 leading-relaxed font-bold">
            {current.body}
          </p>

          {/* Micro animated vehicles parade track */}
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 select-none">
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-amber-200 shadow-xs text-xs font-black text-slate-700">
              <motion.span 
                animate={{ x: [-3, 3, -3] }} 
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="text-sm"
              >
                🚆
              </motion.span>
              <span className="text-[10px] text-purple-700 uppercase tracking-wider">{language === 'pl' ? 'Kolej' : 'Rail'}</span>
            </div>

            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-blue-200 shadow-xs text-xs font-black text-slate-700">
              <motion.span 
                animate={{ x: [-2, 2, -2] }} 
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="text-sm"
              >
                🚌
              </motion.span>
              <span className="text-[10px] text-blue-700 uppercase tracking-wider">{language === 'pl' ? 'Autobus' : 'Bus'}</span>
            </div>

            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-amber-200 shadow-xs text-xs font-black text-slate-700">
              <motion.span 
                animate={{ x: [-2, 2, -2] }} 
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="text-sm"
              >
                🚗
              </motion.span>
              <span className="text-[10px] text-amber-700 uppercase tracking-wider">{language === 'pl' ? 'Samochód' : 'Car'}</span>
            </div>

            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-orange-200 shadow-xs text-xs font-black text-slate-700">
              <motion.span 
                animate={{ x: [-2, 2, -2], rotate: [-2, 2, -2] }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="text-sm"
              >
                🏍️
              </motion.span>
              <span className="text-[10px] text-orange-700 uppercase tracking-wider">{language === 'pl' ? 'Motocykl' : 'Moto'}</span>
            </div>

            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-emerald-200 shadow-xs text-xs font-black text-slate-700">
              <motion.span 
                animate={{ y: [-2, 2, -2], rotate: [-5, 5, -5] }} 
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                className="text-sm"
              >
                🚲
              </motion.span>
              <span className="text-[10px] text-emerald-700 uppercase tracking-wider">{language === 'pl' ? 'Rower' : 'Bike'}</span>
            </div>

            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-teal-200 shadow-xs text-xs font-black text-slate-700">
              <motion.span 
                animate={{ y: [-1.5, 1.5, -1.5] }} 
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                className="text-sm"
              >
                🚶
              </motion.span>
              <span className="text-[10px] text-teal-700 uppercase tracking-wider">{language === 'pl' ? 'Pieszo' : 'Walk'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>('pl');
  const [activeTab, setActiveTab] = useState<'explore' | 'station-router' | 'cycling' | 'motorcycle' | 'hotels' | 'passport' | 'challenges' | 'account'>('explore');
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [langOpen, setLangOpen] = useState<boolean>(false);
  const [showHeaderPayment, setShowHeaderPayment] = useState<boolean>(false);
  const [selectedNatureImage, setSelectedNatureImage] = useState<any | null>(null);
  const [showPWAInstallModal, setShowPWAInstallModal] = useState<boolean>(false);
  const [showLostEmergencyModal, setShowLostEmergencyModal] = useState<boolean>(false);

  // Large Font Mode state (Automatically active for 50+ or togglable)
  const [largeFontMode, setLargeFontMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('tadzik_large_font_mode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Apply or remove large-font-mode CSS class globally on the <html> tag
  useEffect(() => {
    if (largeFontMode) {
      document.documentElement.classList.add('large-font-mode');
    } else {
      document.documentElement.classList.remove('large-font-mode');
    }
    try {
      localStorage.setItem('tadzik_large_font_mode', largeFontMode ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [largeFontMode]);

  // Synchronize largeFontMode if user account specifies it or is 50+
  useEffect(() => {
    if (account) {
      if (account.largeFontMode !== undefined) {
        setLargeFontMode(account.largeFontMode);
      } else if (account.dob) {
        const parts = account.dob.split('-');
        if (parts.length >= 3) {
          const birthYear = parseInt(parts[0], 10);
          const age = new Date().getFullYear() - birthYear;
          if (age >= 50) {
            setLargeFontMode(true);
          }
        }
      }
    }
  }, [account]);

  // Clean tab switching helper ensuring views open smoothly at top
  const handleSwitchTab = (tab: 'explore' | 'station-router' | 'cycling' | 'motorcycle' | 'hotels' | 'passport' | 'challenges' | 'account') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // One-time restricted search states
  const [trialSearchQuery, setTrialSearchQuery] = useState<string>('');
  const [selectedTrialAttraction, setSelectedTrialAttraction] = useState<any | null>(null);
  const [trialSearchUsed, setTrialSearchUsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('tadzik_trial_search_used');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const markTrialSearchUsed = () => {
    setTrialSearchUsed(true);
    try {
      localStorage.setItem('tadzik_trial_search_used', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  // Header payment form states
  const [paymentMethodState, setPaymentMethodState] = useState<'ideal' | 'wero' | 'card' | null>(null);
  const [selectedBankHeader, setSelectedBankHeader] = useState<string>('');
  const [weroNumberHeader, setWeroNumberHeader] = useState<string>('');
  const [cardNameHeader, setCardNameHeader] = useState<string>('');
  const [cardNumberHeader, setCardNumberHeader] = useState<string>('');
  const [cardExpiryHeader, setCardExpiryHeader] = useState<string>('');
  const [cardCvcHeader, setCardCvcHeader] = useState<string>('');
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const handleHeaderPaymentSubmit = () => {
    if (!account) return;

    if (paymentMethodState === 'ideal' && !selectedBankHeader) {
      alert(language === 'pl' ? 'Proszę wybrać swój bank.' : 'Selecteer uw bank.');
      return;
    }
    if (paymentMethodState === 'card' && (!cardNameHeader || !cardNumberHeader || !cardExpiryHeader || !cardCvcHeader)) {
      alert(language === 'pl' ? 'Proszę wypełnić wszystkie dane karty.' : 'Vul alle gegevens in.');
      return;
    }

    setPaymentProcessing(true);

    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);

      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const expiryStr = nextYear.toISOString().split('T')[0];

      const defaultHistory = [
        { name: 'Amsterdam Centraal 🚉', type: 'town' as const, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString().split('T')[0] },
        { name: 'Rijksmuseum 🎨', type: 'attraction' as const, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0] },
        { name: 'Utrecht Centraal ⛪', type: 'town' as const, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString().split('T')[0] }
      ];

      const updatedAccount: UserAccount = {
        ...account,
        hasPaid: true,
        paymentMethod: paymentMethodState || 'card',
        subscriptionExpiry: expiryStr,
        visitedHistory: account.visitedHistory || defaultHistory
      };

      // Save to localStorage & update state
      handleUpdateAccount(updatedAccount);
    }, 1500);
  };

  // Retrieve existing logged in account from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nl_tourist_planner_account');
      if (stored) {
        const parsed = JSON.parse(stored);
        setAccount(parsed);
        if (parsed.privacyConsents?.geolocationConsent !== undefined) {
          localStorage.setItem('tadzik_gps_consent_granted', String(parsed.privacyConsents.geolocationConsent));
        }
      } else {
        // Automatically log in as default user (consents are granted upon new account registration)
        const defaultUser: UserAccount = {
          username: 'Szymon',
          hasPaid: false,
          visitedAttractions: [],
          collectedStamps: ['Zuid-Holland', 'Noord-Holland'],
          submittedPhotos: {},
          privacyConsents: {
            termsAccepted: true,
            termsAcceptedAt: new Date().toISOString(),
            geolocationConsent: false,
            cameraConsent: false,
            notificationsConsent: false,
            marketingConsent: false,
            aiPersonalizationConsent: false,
            telemetryConsent: false,
            lastConsentUpdate: new Date().toISOString(),
            consentVersion: 'GDPR-2026.1'
          }
        };
        setAccount(defaultUser);
        localStorage.setItem('nl_tourist_planner_account', JSON.stringify(defaultUser));
        localStorage.setItem('tadzik_gps_consent_granted', 'false');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleUpdateAccount = (acc: UserAccount | null) => {
    setAccount(acc);
    try {
      if (acc) {
        localStorage.setItem('nl_tourist_planner_account', JSON.stringify(acc));
        // Also update individual profile lookup
        localStorage.setItem(`user_profile_${acc.username.toLowerCase()}`, JSON.stringify(acc));
      } else {
        localStorage.removeItem('nl_tourist_planner_account');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const t = translations[language];

  // 1. NOT LOGGED IN STATE - Soft elegant background onboarding
  if (!account) {
    return (
      <div 
        className="min-h-screen text-slate-800 font-sans p-4 flex flex-col justify-start relative overflow-hidden selection:bg-amber-200" 
        id="login-screen-sky"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(240, 249, 255, 0.65), rgba(224, 242, 254, 0.75)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Whimsical Floating Clouds Backdrop */}
        <div className="absolute top-12 left-[10%] text-6xl text-indigo-200/40 animate-bounce duration-[4000ms] pointer-events-none select-none">☁️</div>
        <div className="absolute top-24 right-[15%] text-7xl text-indigo-100/30 animate-pulse duration-[6000ms] pointer-events-none select-none">☁️</div>
        <div className="absolute bottom-20 left-[18%] text-8xl text-indigo-200/25 animate-bounce duration-[8000ms] pointer-events-none select-none">☁️</div>
        <div className="absolute bottom-32 right-[8%] text-6xl text-indigo-100/35 animate-pulse duration-[5000ms] pointer-events-none select-none">☁️</div>

        {/* Central Card */}
        <main className="w-full max-w-xl mx-auto mt-6 mb-auto z-10 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {/* Account registration/login card at the absolute top */}
            <AccountModal 
              language={language} 
              onLanguageChange={setLanguage}
              account={account} 
              onUpdateAccount={handleUpdateAccount} 
            />
          </motion.div>

          {/* Welkom banner shifted below the login card with joke and greetings */}
          <div className="text-center bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3" id="welcome-message-card">
            <span className="text-4xl inline-block animate-bounce mb-1">🌷</span>
            
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {language === 'pl' ? 'Witamy! ☀️' : language === 'nl' ? 'Welkom! ☀️' : 'Welcome! ☀️'}
            </h1>
            
            <p className="text-slate-700 font-bold text-sm leading-relaxed">
              {language === 'pl' 
                ? 'Nasza aplikacja służy do czerpania z życia pełnymi garściami!' 
                : language === 'nl'
                ? 'Onze applicatie is er om ten volle van het leven te genieten!'
                : 'Our application is here to help you enjoy life to the fullest!'}
            </p>

            <div className="bg-amber-50/60 border border-amber-200/50 p-3.5 rounded-xl text-left text-xs text-amber-900 space-y-1.5 font-medium">
              <span className="font-extrabold text-[10px] bg-amber-200/60 text-amber-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {language === 'pl' ? 'Uśmiech na drogę' : language === 'nl' ? 'Glimlach voor onderweg' : 'A smile for the road'}
              </span>
              <p className="italic leading-relaxed">
                {language === 'pl' 
                  ? 'Czy wiesz, dlaczego podróżowanie z nami między Holandią, Belgią, Francją, Niemcami i Polską jest tak radosne? Ponieważ Tadzik dba o to, by każda trasa była płaska, bezpieczna i pełna słońca! 🚴‍♂️💨' 
                  : language === 'nl'
                  ? 'Weet je waarom reizen met ons tussen Nederland, België, Frankrijk, Duitsland en Polen zo leuk is? Omdat Tadzik ervoor zorgt dat elke route vlak, veilig en zonnig is! 🚴‍♂️💨'
                  : language === 'de'
                  ? 'Weißt du, warum das Reisen mit uns zwischen den Niederlanden, Belgien, Frankreich, Deutschland und Polen so viel Spaß macht? Weil Tadzik dafür sorgt, dass jede Route flach, sicher und sonnig ist! 🚴‍♂️💨'
                  : language === 'fr'
                  ? 'Savez-vous pourquoi voyager avec nous entre les Pays-Bas, la Belgique, la France, l’Allemagne et la Pologne est si agréable ? Parce que Tadzik veille à ce que chaque itinéraire soit plat, sûr et ensoleillé ! 🚴‍♂️💨'
                  : language === 'es'
                  ? '¿Sabes por qué viajar con nosotros entre los Países Bajos, Bélgica, Francia, Alemania y Polonia es tan alegre? ¡Porque Tadzik se asegura de que cada ruta sea plana, segura y soleada! 🚴‍♂️💨'
                  : language === 'ro'
                  ? 'Știi de ce este atât de plăcut să călătorești cu noi între Olanda, Belgia, Franța, Germania și Polonia? Pentru că Tadzik se asigură că fiecare traseu este plat, sigur și plin de soare! 🚴‍♂️💨'
                  : language === 'zh'
                  ? '您知道为什么和我们一起在荷兰、比利时、法国、德国和波兰之间旅行如此愉快吗？因为Tadzik确保每一条路线都平坦、安全、阳光普照！ 🚴‍♂️💨'
                  : 'Do you know why traveling with us across the Netherlands, Belgium, France, Germany, and Poland is so joyful? Because Tadzik makes sure every route is flat, safe, and filled with sunshine! 🚴‍♂️💨'}
              </p>
            </div>

            <p className="text-slate-500 font-extrabold text-xs pt-1.5">
              {language === 'pl' 
                ? 'Dziękujemy, że jesteś z nami i życzymy powodzenia! 🍀' 
                : language === 'nl'
                ? 'Bedankt dat u bij ons bent en veel succes gewenst! 🍀'
                : language === 'de'
                ? 'Danke, dass Sie bei uns sind, und viel Erfolg! 🍀'
                : language === 'fr'
                ? 'Merci d\'être avec nous et bonne chance ! 🍀'
                : language === 'es'
                ? '¡Gracias por estar con nosotros y mucha suerte! 🍀'
                : language === 'ro'
                ? 'Vă mulțumim că sunteți alături de noi și vă dorim mult succes! 🍀'
                : language === 'zh'
                ? '感谢您与我们同在，祝您一切顺利！ 🍀'
                : 'Thank you for being with us and we wish you the best of luck! 🍀'}
            </p>
          </div>
        </main>

        {/* Footer branding */}
        <footer className="w-full max-w-2xl mx-auto text-center font-bold text-slate-500/80 text-xs z-10 py-4 mt-6">
          🇪🇺 Smart European Tourist Companion (NL, BE, FR, DE, PL) • High-Contrast & Accessible Interfaces for Elderly Travellers
        </footer>
      </div>
    );
  }

  // 2. LOGGED IN BUT UNPAID STATE - High-End Premium Encouraging Upgrade Screen
  if (account && !account.hasPaid) {
    const natureImages = [
      {
        id: 'forest',
        titlePl: 'Leśna cisza i zielone polany',
        titleNl: 'Bosstilte en groene weiden',
        titleEn: 'Forest Silence & Clearing',
        emoji: '🌲',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
        descPl: 'Prześwity słoneczne na polanie w sercu parku narodowego Veluwe. Idealne miejsce na odpoczynek i wyciszenie.',
        descNl: 'Zonnestralen op een open plek in het hart van nationaal park Veluwe. Een perfecte plek voor rust en stilte.',
        descEn: 'Sunbeams dancing on a lush clearing in the heart of Veluwe national park. Perfect place for rest.'
      },
      {
        id: 'sunset',
        titlePl: 'Malowniczy zachód słońca',
        titleNl: 'Sfeervolle zonsondergang',
        titleEn: 'Scenic Meadows Sunset',
        emoji: '🌅',
        url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=80',
        descPl: 'Ciepłe, złote barwy słońca schodzącego za horyzont holenderskich łąk i polderów.',
        descNl: 'Warme, gouden kleuren van de zon die achter de horizon van de Nederlandse weiden en polders zakt.',
        descEn: 'Warm gold hues of the sun descending behind the horizon of Dutch meadows and polders.'
      },
      {
        id: 'mountains',
        titlePl: 'Malownicze Tatry i Morskie Oko',
        titleNl: 'Sfeervolle Tatra Bergen',
        titleEn: 'Scenic Tatra Mountains & Lake',
        emoji: '🏔️',
        url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
        descPl: 'Majestatyczne szczyty odbijające się w krystalicznej toni Morskiego Oka w polskiej części Tatr.',
        descNl: 'Majestueuze bergtoppen weerspiegeld in het kristalheldere water van Morskie Oko in Polen.',
        descEn: 'Majestic mountain peaks reflected in the crystal-clear waters of Morskie Oko lake in the Polish Tatras.'
      },
      {
        id: 'meadow',
        titlePl: 'Wiosenny wschód słońca',
        titleNl: 'Morgenstond in de polder',
        titleEn: 'Polder Sunrise Mist',
        emoji: '🌻',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        descPl: 'Budzący się do życia, spowity lekką mgłą poranek pełen dzikich kwiatów i czystego powietrza.',
        descNl: 'Een ontwakende open plek vol wilde bloemen in de polder met frisse ochtendlucht.',
        descEn: 'An awakening meadow filled with wild flowers, gentle morning mist and clean fresh air.'
      }
    ];

    return (
      <div 
        className="min-h-screen text-slate-900 font-sans p-3 md:p-6 relative overflow-hidden" 
        id="app-paywall-screen"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(254, 243, 199, 0.88), rgba(248, 250, 252, 0.92)), url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Subtle decorative background shapes */}
        <div className="absolute top-12 left-[5%] text-7xl opacity-5 pointer-events-none select-none">🌲</div>
        <div className="absolute top-36 right-[8%] text-8xl opacity-5 pointer-events-none select-none">🚲</div>
        <div className="absolute bottom-40 left-[2%] text-9xl opacity-[0.03] pointer-events-none select-none">🧭</div>

        {/* Header container styled as a premium traveler passport & boarding pass card */}
        <header className="w-full max-w-6xl mx-auto z-10 mb-8" id="premium-boarding-pass-header">
          <div className="relative bg-gradient-to-br from-amber-400 via-amber-500 to-indigo-700 p-[3px] rounded-3xl shadow-xl overflow-hidden">
            {/* Romantic blurred photo background */}
            <div 
              className="absolute inset-0 bg-cover bg-center pointer-events-none select-none filter blur-[4px] brightness-[0.8] opacity-35"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80')` }}
            ></div>

            {/* Soft decorative background glow circles for romantic golden hour feel */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-rose-400/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Vintage romantic castle / lock icon watermark overlay graphic (delicate extra) */}
            <div className="absolute top-1/2 left-8 -translate-y-1/2 opacity-[0.05] pointer-events-none select-none text-rose-950">
              <Lock className="w-40 h-40 stroke-[1]" />
            </div>

            <div className="relative bg-white/95 backdrop-blur-md rounded-[21px] overflow-hidden flex flex-col">
              
              {/* Emergency SOS 'Zgubiłem się' Button */}
              <button
                type="button"
                onClick={() => setShowLostEmergencyModal(true)}
                className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black px-2.5 py-1 rounded-lg shadow-sm border border-rose-300 text-[10px] cursor-pointer transition-all hover:scale-105 animate-pulse"
                title={language === 'pl' ? 'Asystent ratunkowy: Zgubiłem się' : 'Emergency Assistant: I am lost'}
              >
                <span>🆘</span>
                <span className="font-extrabold uppercase">{language === 'pl' ? 'Zgubiłem się' : language === 'nl' ? 'Verdwaald' : 'Lost'}</span>
              </button>

              {/* Large Font Mode toggle in Guest header */}
              <button
                type="button"
                onClick={() => setLargeFontMode(!largeFontMode)}
                className={`absolute top-3 left-32 sm:left-36 z-20 flex items-center gap-1 px-2 py-1 rounded-lg border text-[9px] font-black cursor-pointer transition-all ${
                  largeFontMode 
                    ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs' 
                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title={language === 'pl' ? 'Przełącz tryb dużej czcionki (50+)' : 'Toggle Large Font Mode (50+)'}
              >
                <span>🔤</span>
                <span className="hidden sm:inline">{largeFontMode ? 'Duża czcionka: WŁ' : 'Duża czcionka'}</span>
              </button>

              {/* Exit/Log out button absolute-positioned in top right, halved in size */}
              <button
                onClick={() => handleUpdateAccount(null)}
                className="absolute top-3 right-3 flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold px-2 py-1 rounded-lg border border-rose-150 transition-all text-[9px] cursor-pointer shadow-xs z-20"
              >
                <LogOut className="w-2.5 h-2.5" />
                <span>{language === 'pl' ? 'Wyloguj' : language === 'nl' ? 'Uitloggen' : 'Log Out'}</span>
              </button>

              {/* Share with Friends & Family button */}
              <button
                type="button"
                onClick={() => setShowPWAInstallModal(true)}
                className="absolute top-3 right-20 z-20 flex items-center gap-1 bg-gradient-to-r from-amber-50 to-indigo-50 hover:from-amber-100 hover:to-indigo-100 text-indigo-950 border border-indigo-200/80 px-2.5 py-1 rounded-lg shadow-xs text-[9px] font-black cursor-pointer transition-all hover:scale-102"
                title={language === 'pl' ? 'Podziel się ze znajomymi / rodziną (App Store, Google Play)' : 'Share with Friends & Family (App Store, Google Play)'}
              >
                <span>📤</span>
                <span className="hidden sm:inline">{language === 'pl' ? 'Podziel się ze znajomymi' : language === 'nl' ? 'Deel met vrienden' : 'Share with Friends'}</span>
              </button>

              {/* Language Picker in upper right, to the left of install button */}
              <div className="absolute top-3 right-36 sm:right-48 z-20">
                <button 
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 shadow-xs text-[9px] font-black text-slate-800 cursor-pointer select-none transition-colors"
                >
                  <span>🌐</span>
                  <span className="uppercase text-[8px] text-slate-950 font-black tracking-wider">
                    {language === 'en' ? 'EN' : language === 'nl' ? 'NL' : language === 'pl' ? 'PL' : language === 'de' ? 'DE' : language === 'fr' ? 'FR' : language === 'es' ? 'ES' : 'EN'}
                  </span>
                  <span className="text-[6px] opacity-60">▼</span>
                </button>
                
                {langOpen && (
                  <div className="absolute right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden py-0.5 w-24 z-50">
                    {[
                      { code: 'pl', label: 'Polski', flag: '🇵🇱' },
                      { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
                      { code: 'en', label: 'English', flag: '🇬🇧' },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as Language);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center gap-1 py-1 px-2 text-[9px] font-bold hover:bg-slate-50 transition-colors cursor-pointer text-left ${
                          language === lang.code ? 'text-emerald-700 bg-emerald-50/40' : 'text-slate-700'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Layout Content: Identity & Centered Username */}
              <div className="p-5 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 pb-5 relative">
                
                {/* Left side: Premium Old Steam Train Stamp */}
                <div className="shrink-0 flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-gradient-to-br from-slate-900 via-slate-950 to-stone-900 border-2 border-amber-500/80 text-amber-400 rounded-xl flex flex-col items-center justify-center shadow-md rotate-[-1deg] select-none">
                    <span className="text-xl">🚂</span>
                    <span className="text-[6px] font-black tracking-widest text-amber-500 uppercase mt-0.5">TADZIK</span>
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="text-[8px] font-black tracking-wider uppercase text-amber-500 bg-slate-950 px-2 py-0.5 rounded border border-amber-500/20">
                      STEAM EXPRESS
                    </span>
                  </div>
                </div>

                {/* Center Column: Username & Tagline */}
                <div className="flex-1 text-center space-y-2 max-w-md mx-auto">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-rose-50 border border-rose-100 px-6 py-2.5 rounded-2xl shadow-sm">
                    <span className="text-lg md:text-xl font-black text-rose-950 tracking-tight flex items-center gap-2">
                      <span>👤</span>
                      <span>{account.username}</span>
                    </span>
                  </div>
                  
                  <div className="text-[9px] text-emerald-700 font-extrabold uppercase tracking-wider flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    {language === 'pl' ? 'Zalogowano pomyślnie' : language === 'nl' ? 'Succesvol ingelogd' : 'Successfully Logged In'}
                  </div>

                  {/* Tagline: Czeka Ciebie więcej */}
                  <div className="pt-0.5">
                    <p className="text-xs md:text-sm font-black text-rose-600 flex items-center justify-center gap-1.5 animate-pulse">
                      <span>🌹</span>
                      <span>
                        {language === 'pl' 
                          ? 'Czeka Ciebie więcej...' 
                          : language === 'nl' 
                          ? 'Er wacht meer op u...' 
                          : 'More awaits you...'}
                      </span>
                      <span>🌹</span>
                    </p>
                  </div>
                </div>

                {/* Right side spacer to balance the grid on desktop */}
                <div className="w-12 h-12 shrink-0 hidden md:block"></div>
              </div>

              {/* Bottom "Konto Próbne" AI bar */}
              <div
                className="w-full bg-gradient-to-r from-rose-500 via-indigo-600 to-purple-700 py-2.5 px-6 text-white text-center flex flex-col sm:flex-row justify-between items-center gap-2 relative overflow-hidden border-t border-rose-100/10"
              >
                {/* Romantic subtle sparkle floating particles */}
                <span className="absolute left-1/4 top-1 text-xs opacity-40 select-none animate-pulse pointer-events-none">✨</span>
                <span className="absolute right-1/4 bottom-1 text-xs opacity-45 select-none animate-bounce pointer-events-none">✨</span>

                <div className="flex items-center gap-2.5">
                  <span className="text-[9px] font-black tracking-widest text-amber-200 bg-black/25 px-2 py-0.5 rounded border border-amber-400/20 shadow-xs">
                    {language === 'pl' ? 'KONTO PRÓBNE' : 'TEST-ACCOUNT'}
                  </span>
                  <p className="text-[11px] font-extrabold text-rose-50">
                    {language === 'pl' 
                      ? 'Uzyskaj 1 bezpłatne wyszukiwanie atrakcji z asystentem AI' 
                      : language === 'nl' 
                      ? 'Ontvang 1 gratis zoekopdracht voor attracties met AI-assistent' 
                      : 'Get 1 free attraction search with our AI companion'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/25 shadow-xs">
                    <span className="text-[10px] font-black tracking-wider text-amber-300">AI</span>
                    <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('trial-search-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[10px] font-black tracking-tight text-white bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {trialSearchUsed 
                      ? (language === 'pl' ? 'Wykorzystane (0/1)' : 'Verbruikt (0/1)')
                      : (language === 'pl' ? 'Wypróbuj teraz ↓' : 'Probeer nu ↓')
                    }
                  </button>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Hero Section replaced with the exquisite Framed Welcome Banner */}
        <WelcomeBanner language={language} />

        {/* Main Grid content */}
        <main className="w-full max-w-6xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
          
          {/* Left Column: Ultimate Superpowers / Value Pitch (6 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="text-emerald-600">✦</span>
              <span>
                {language === 'pl' ? 'Co zyskujesz z pakietem Premium?' : language === 'nl' ? 'Wat krijgt u met Premium?' : 'What is included in Premium?'}
              </span>
            </h2>

            {/* Feature Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col gap-3 hover:border-emerald-300 transition-all">
                <div className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">
                  🧭
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {language === 'pl' ? 'Opieka Asystenta Tadzika' : language === 'nl' ? 'Persoonlijke Gids Tadzik' : 'Travel Advisor Tadzik'}
                  </h3>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed font-medium">
                    {language === 'pl' 
                      ? 'Niezawodny pomocnik, który dba o budżet, wskazuje przystanki transportu 9292 i przypomina o powrocie przed zmrokiem.' 
                      : language === 'nl'
                      ? 'Betrouwbare gids die uw budget bewaakt, 9292-haltes toont en u eraan herinnert om voor donker thuis te zijn.'
                      : 'Reliable advisor who helps with budget, 9292 stops, and alerts you to return before sunset.'}
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col gap-3 hover:border-emerald-300 transition-all">
                <div className="bg-amber-50 text-amber-700 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">
                  🚲
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {language === 'pl' ? 'Ścieżki Przyjazne Wiekowo' : language === 'nl' ? 'Veilige Fietspaden' : 'Safe Cycling Networks'}
                  </h3>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed font-medium">
                    {language === 'pl' 
                      ? 'Dedykowane, płaskie, gładkie i oświetlone ścieżki rowerowe (fietspaden), w pełni bezpieczne dla seniorów oraz rodzin.' 
                      : language === 'nl'
                      ? 'Speciaal geselecteerde vlakke, geasfalteerde en verlichte fietspaden die veilig zijn voor senioren en gezinnen.'
                      : 'Specially selected flat, paved, and well-lit cycling paths safe for elderly travelers and families.'}
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col gap-3 hover:border-emerald-300 transition-all">
                <div className="bg-indigo-50 text-indigo-700 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">
                  🏷️
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {language === 'pl' ? 'Cyfrowy Paszport i Stemple' : language === 'nl' ? 'Paspoortstempels' : 'Digital Passport Stamps'}
                  </h3>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed font-medium">
                    {language === 'pl' 
                      ? 'Wspaniała zabawa polegająca na zbieraniu regionalnych stempli za odwiedzanie holenderskich atrakcji i miast.' 
                      : language === 'nl'
                      ? 'Leuke uitdaging om regionale stempels te verzamelen wanneer u Nederlandse dorpen en attracties bezoekt.'
                      : 'Fun gamified challenges to collect regional stamps as you explore Dutch towns and landmarks.'}
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col gap-3 hover:border-emerald-300 transition-all">
                <div className="bg-rose-50 text-rose-700 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">
                  📸
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {language === 'pl' ? 'Wymiana Zdjęć i Społeczność' : language === 'nl' ? 'Fotowedstrijden & Community' : 'Private Photo Community'}
                  </h3>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed font-medium">
                    {language === 'pl' 
                      ? 'Przesyłaj ujęcia pięknych lasów, polan, wschodów słońca i bierz udział w inspirujących wyzwaniach społeczności.' 
                      : language === 'nl'
                      ? 'Deel foto\'s van prachtige bossen, open plekken en zonsondergangen en doe mee aan community-uitdagingen.'
                      : 'Upload and browse stunning nature spots, fields of grain, and participate in friendly community challenges.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-emerald-950 text-white rounded-2xl p-5 border border-emerald-900 shadow-lg space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{language === 'pl' ? 'Opinie zadowolonych podróżników' : language === 'nl' ? 'Ervaringen van reizigers' : 'Happy traveler reviews'}</span>
              </h4>
              
              <div className="space-y-3">
                <div className="border-l-2 border-emerald-500 pl-3 space-y-1">
                  <p className="text-xs italic text-emerald-100">
                    "{language === 'pl'
                      ? 'Tadzik uratował naszą wycieczkę rowerową Veluwe! Pokazał nam płaski i bezprogowy zjazd i przypomniał o powrotnym autobusie przed zachodem słońca.'
                      : 'Tadzik heeft onze fietstocht op de Veluwe gered! Hij wees ons een vlakke route en herinnerde ons op tijd aan de bus terug.'}"
                  </p>
                  <span className="block text-[10px] font-bold text-emerald-300">— Janusz i Krystyna, 68 lat (Gdańsk)</span>
                </div>

                <div className="border-l-2 border-emerald-500 pl-3 space-y-1">
                  <p className="text-xs italic text-emerald-100">
                    "{language === 'pl'
                      ? 'Zabawa w zbieranie stempli paszportowych zjednoczyła całą naszą rodzinę. Dzieci i dziadkowie rywalizowali na szlaku, kto zbierze ich więcej!'
                      : 'Het verzamelen van paspoortstempels bracht onze hele familie samen. Zowel kleinkinderen als grootouders vonden het geweldig!'}"
                  </p>
                  <span className="block text-[10px] font-bold text-emerald-300">— Marta z dziećmi, 41 lat (Utrecht)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Companion Pass / Unified European Checkout (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <UnifiedPaymentCheckout
              language={language}
              account={account}
              onPaymentSuccess={(method, details) => {
                const nextYear = new Date();
                nextYear.setFullYear(nextYear.getFullYear() + 1);
                const expiryStr = nextYear.toISOString().split('T')[0];

                const updatedAcc: UserAccount = {
                  ...account,
                  hasPaid: true,
                  paymentMethod: (method as any) || 'card',
                  subscriptionExpiry: expiryStr,
                };

                try {
                  localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAcc));
                  localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAcc));
                } catch (err) {
                  console.error("Local storage error:", err);
                }

                handleUpdateAccount(updatedAcc);
              }}
            />
          </div>
        </main>

        {/* One-Time Demo Attraction Search Section */}
        <section id="trial-search-section" className="w-full max-w-6xl mx-auto z-10 space-y-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 p-6 sm:p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-indigo-800/40 pb-5 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <h3 className="text-xl font-black text-white tracking-tight">
                  {language === 'pl' 
                    ? 'Szybka Wyszukiwarka Odkryć (Wersja Próbna Tadzika)' 
                    : language === 'nl' 
                    ? 'Slimme Attractiezoeker (Tadzik Proefversie)' 
                    : 'Smart Discovery Search (Trial Mode)'}
                </h3>
              </div>
              <p className="text-slate-300 text-xs font-medium leading-relaxed max-w-2xl">
                {language === 'pl'
                  ? 'Przetestuj natychmiastowe wyszukiwanie w Europie! Wpisz nazwę miasta (Rotterdam, Amsterdam, Kraków, Paryż, Berlin) lub kliknij sugerowane szybkie tagi.'
                  : language === 'nl'
                  ? 'Test onze bliksemsnelle zoekfunctie voor Europa! Typ een stad of attractie of klik op de onderstaande snelle suggesties.'
                  : 'Test real-time search across European cities! Type a city or landmark or click quick suggestions below.'}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-full uppercase shadow-md flex items-center gap-1">
                <span>⚡</span>
                <span>
                  {language === 'pl' 
                    ? `Darmowy podgląd: ${trialSearchUsed ? '0/1' : '1/1'}` 
                    : `Trial Preview: ${trialSearchUsed ? '0/1' : '1/1'}`}
                </span>
              </span>
            </div>
          </div>

          {/* Sleek Search Input Bar */}
          <div className="relative z-10 space-y-3">
            <div className="relative flex items-center max-w-2xl">
              <Search className="absolute left-4 w-5 h-5 text-indigo-400 pointer-events-none" />
              <input
                type="text"
                placeholder={
                  language === 'pl' 
                    ? 'Wyszukaj miasto lub atrakcję (np. Rotterdam, Wawel, Vondelpark, Plaża, Muzeum)...' 
                    : language === 'nl' 
                    ? 'Zoek stad of attractie (bijv. Rotterdam, Rijksmuseum, Vondelpark)...' 
                    : 'Search city or attraction...'
                }
                value={trialSearchQuery}
                onChange={(e) => setTrialSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-sm rounded-2xl pl-12 pr-10 py-3.5 text-white font-bold outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent shadow-inner placeholder-slate-400"
              />
              {trialSearchQuery && (
                <button
                  type="button"
                  onClick={() => setTrialSearchQuery('')}
                  className="absolute right-3.5 p-1 text-slate-400 hover:text-white bg-white/10 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Keyword Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: '🇳🇱 Rotterdam', query: 'Rotterdam' },
                { label: '🇳🇱 Amsterdam', query: 'Amsterdam' },
                { label: '🇵🇱 Kraków (Wawel)', query: 'Kraków' },
                { label: '🇵🇱 Warszawa', query: 'Warsaw' },
                { label: '🇫🇷 Paryż (Wieża)', query: 'Paris' },
                { label: '🇩🇪 Berlin', query: 'Berlin' },
                { label: '🌳 Parki & Przyroda', query: 'park' },
                { label: '🎨 Muzea', query: 'museum' }
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setTrialSearchQuery(chip.query)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    trialSearchQuery === chip.query
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/15'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="relative z-10">
            {trialSearchQuery.trim() === '' ? (
              <div className="space-y-3">
                <p className="text-[11px] font-black text-amber-300 uppercase tracking-wider">
                  {language === 'pl' ? 'Polecane popularne atrakcje do przetestowania:' : 'Recommended popular attractions:'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {SEEDED_ATTRACTIONS.slice(0, 4).map((att) => {
                    const photo = {
                      'depot-boijmans': 'https://images.unsplash.com/photo-1616447154831-293f24032a1f?w=600&auto=format&fit=crop&q=80',
                      'kralingse-bos': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
                      'rijksmuseum': 'https://images.unsplash.com/photo-1601961405399-801fb1f34581?w=600&auto=format&fit=crop&q=80',
                      'amsterdamse-bos': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80'
                    }[att.id] || 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&auto=format&fit=crop&q=80';

                    return (
                      <button
                        key={att.id}
                        type="button"
                        onClick={() => {
                          if (trialSearchUsed) {
                            alert(
                              language === 'pl'
                                ? '⚠️ Wykorzystałeś już swój darmowy limit wyszukiwania w wersji próbnej. Aby móc bez ograniczeń przeglądać atrakcje, planować dojazdy, zbierać pieczątki i rozmawiać z Tadzikiem, aktywuj członkostwo w zakładce Profil!'
                                : '⚠️ You have already used your free trial search limit. Activate membership to unlock unlimited searches!'
                            );
                          } else {
                            setSelectedTrialAttraction(att);
                            markTrialSearchUsed();
                          }
                        }}
                        className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl border border-white/15 p-3 text-left hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
                      >
                        <div className="relative h-24 w-full overflow-hidden rounded-xl bg-slate-900">
                          <img
                            src={photo}
                            alt={att.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded">
                            📍 {att.city}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-white mt-2 line-clamp-1 leading-tight group-hover:text-amber-300 transition-colors">
                          {att.name}
                        </h4>
                        <span className="text-[10px] text-slate-300 font-mono mt-1 block">
                          €{att.adultVersion.budget} • {att.adultVersion.durationMinutes} min
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                {/* Filtered list of matching attractions */}
                {(() => {
                  const filtered = SEEDED_ATTRACTIONS.filter(att => 
                    att.name.toLowerCase().includes(trialSearchQuery.toLowerCase()) ||
                    att.city.toLowerCase().includes(trialSearchQuery.toLowerCase()) ||
                    (att.category && att.category.toLowerCase().includes(trialSearchQuery.toLowerCase()))
                  );

                  if (filtered.length === 0) {
                    return (
                      <p className="text-slate-300 text-xs font-bold py-6 text-center bg-white/5 rounded-2xl border border-dashed border-white/20">
                        {language === 'pl' ? '❌ Brak pasujących atrakcji dla tej frazy.' : '❌ No matching attractions found.'}
                      </p>
                    );
                  }

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      {filtered.slice(0, 8).map((att) => {
                        const photo = {
                          'depot-boijmans': 'https://images.unsplash.com/photo-1616447154831-293f24032a1f?w=600&auto=format&fit=crop&q=80',
                          'kralingse-bos': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
                          'rijksmuseum': 'https://images.unsplash.com/photo-1601961405399-801fb1f34581?w=600&auto=format&fit=crop&q=80',
                          'amsterdamse-bos': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
                          'vondelpark': 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600&auto=format&fit=crop&q=80',
                          'dom-tower': 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=600&auto=format&fit=crop&q=80',
                          'maximapark': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80',
                          'plaswijckpark': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
                          'krakow-wawel-square': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&auto=format&fit=crop&q=80',
                          'krakow-kopiec-krakusa': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=80',
                          'paris-eiffel-seine': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
                          'berlin-brandenburg-gate': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
                        }[att.id] || 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&auto=format&fit=crop&q=80';

                        return (
                          <button
                            key={att.id}
                            type="button"
                            onClick={() => {
                              if (trialSearchUsed) {
                                alert(
                                  language === 'pl'
                                    ? '⚠️ Wykorzystałeś już swój darmowy limit wyszukiwania w wersji próbnej. Aby móc bez ograniczeń przeglądać atrakcje, planować dojazdy, zbierać pieczątki i rozmawiać z Tadzikiem, aktywuj członkostwo w zakładce Profil!'
                                    : '⚠️ You have already used your free trial search limit. Activate membership to unlock unlimited searches!'
                                );
                              } else {
                                setSelectedTrialAttraction(att);
                                markTrialSearchUsed();
                              }
                            }}
                            className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl border border-white/15 p-3 text-left hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer animate-fadeIn"
                          >
                            <div className="relative h-24 w-full overflow-hidden rounded-xl bg-slate-900">
                              <img
                                src={photo}
                                alt={att.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded">
                                📍 {att.city}
                              </span>
                            </div>
                            <h4 className="font-bold text-xs text-white mt-2 line-clamp-1 leading-tight group-hover:text-amber-300 transition-colors">
                              {att.name}
                            </h4>
                            <span className="text-[10px] text-slate-300 font-mono mt-1 block">
                              €{att.adultVersion.budget} • {att.adultVersion.durationMinutes} min
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Restricted Demo Detail Modal for Attraction Search */}
        {selectedTrialAttraction && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto select-none animate-fadeIn">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full overflow-hidden shadow-2xl relative my-8">
              <button
                type="button"
                onClick={() => setSelectedTrialAttraction(null)}
                className="absolute top-4 right-4 bg-slate-900/90 hover:bg-slate-950 text-white p-2.5 rounded-full z-10 transition-colors cursor-pointer"
                title={language === 'pl' ? 'Zamknij' : 'Sluiten'}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Image banner */}
              <div className="h-44 md:h-56 relative bg-slate-900">
                <img
                  src={
                    {
                      'depot-boijmans': 'https://images.unsplash.com/photo-1616447154831-293f24032a1f?w=600&auto=format&fit=crop&q=80',
                      'kralingse-bos': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
                      'rijksmuseum': 'https://images.unsplash.com/photo-1601961405399-801fb1f34581?w=600&auto=format&fit=crop&q=80',
                      'amsterdamse-bos': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
                      'vondelpark': 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600&auto=format&fit=crop&q=80',
                      'dom-tower': 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=600&auto=format&fit=crop&q=80',
                      'maximapark': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80',
                      'plaswijckpark': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
                      'scheveningen-beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
                      'spido-cruise': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format&fit=crop&q=80',
                      'dudok-cafe': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
                      'brussels-grand-place': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
                      'antwerp-central-station': 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=600&auto=format&fit=crop&q=80',
                      'paris-eiffel-seine': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
                      'berlin-brandenburg-gate': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
                      'lazienki-park': 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&auto=format&fit=crop&q=80',
                      'krakow-wawel-square': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&auto=format&fit=crop&q=80',
                      'krakow-kopiec-krakusa': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=80'
                    }[selectedTrialAttraction.id] || 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&auto=format&fit=crop&q=80'
                  }
                  alt={selectedTrialAttraction.name}
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                
                <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                  <div>
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider mb-1.5 inline-block">
                      {language === 'pl' ? 'Restrykcyjny Podgląd Próbny' : 'Beperkte Demo-weergave'}
                    </span>
                    <h4 className="text-lg md:text-xl font-black text-white tracking-tight leading-tight">
                      {selectedTrialAttraction.name}
                    </h4>
                    <p className="text-slate-300 text-xs font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {selectedTrialAttraction.city}, {selectedTrialAttraction.region}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 max-h-[50vh] overflow-y-auto">
                {/* Description */}
                <div className="space-y-1.5">
                  <h5 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    {language === 'pl' ? 'O Wybranym Miejscu:' : 'Over deze locatie:'}
                  </h5>
                  <p className="text-slate-700 text-xs md:text-sm leading-relaxed font-semibold">
                    {selectedTrialAttraction.adultVersion?.description || 'No description available for this trial.'}
                  </p>
                </div>

                {/* Restricted Premium Fields Panel */}
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  <h5 className="text-xs font-black uppercase text-slate-950 tracking-wider flex items-center gap-1.5">
                    <span>💎</span>
                    <span>{language === 'pl' ? 'Funkcje Asystenta Premium Tadzika:' : 'Premium Tadzik Assistentie:'}</span>
                  </h5>

                  {/* Feature 1: Transit (Blurred with padlock) */}
                  <div className="relative border border-slate-150 rounded-xl p-3.5 overflow-hidden bg-slate-50">
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-10 text-center p-3 select-none">
                      <Lock className="w-4 h-4 text-amber-500 mb-1" />
                      <span className="text-[10px] font-black text-amber-900 uppercase tracking-tight">
                        {language === 'pl' ? 'Rozkład i Dojazd Zablokowany' : 'Dienstregeling & Route Vergrendeld'}
                      </span>
                    </div>

                    <div className="space-y-1 filter blur-[2px] opacity-30 select-none">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Najlepszy środek transportu:</p>
                      <p className="text-xs font-black text-slate-900">Tramwaj Linia 7 ze stacji Rotterdam Centraal</p>
                    </div>
                  </div>

                  {/* Feature 2: Cycling Route (Blurred with padlock) */}
                  <div className="relative border border-slate-150 rounded-xl p-3.5 overflow-hidden bg-slate-50">
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-10 text-center p-3 select-none">
                      <Lock className="w-4 h-4 text-amber-500 mb-1" />
                      <span className="text-[10px] font-black text-amber-900 uppercase tracking-tight">
                        {language === 'pl' ? 'Przyjazna Ścieżka Rowerowa Zablokowana' : 'Fietspaden & Toegankelijkheid Vergrendeld'}
                      </span>
                    </div>

                    <div className="space-y-1 filter blur-[2px] opacity-30 select-none">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Profil ścieżki (fietspad):</p>
                      <p className="text-xs font-black text-slate-900">Płaska, gładka, 4.2 km od stacji, oświetlona nocą</p>
                    </div>
                  </div>

                  {/* Feature 3: Digital Passport Stamps (Blurred with padlock) */}
                  <div className="relative border border-slate-150 rounded-xl p-3.5 overflow-hidden bg-slate-50">
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-10 text-center p-3 select-none">
                      <Lock className="w-4 h-4 text-amber-500 mb-1" />
                      <span className="text-[10px] font-black text-amber-900 uppercase tracking-tight">
                        {language === 'pl' ? 'Stempel Paszportowy Zablokowany' : 'Paspoortstempel Vergrendeld'}
                      </span>
                    </div>

                    <div className="space-y-1 filter blur-[2px] opacity-30 select-none">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Cyfrowa Pieczęć:</p>
                      <p className="text-xs font-black text-slate-900">Kolekcjonerski stempel prowincji Zuid-Holland</p>
                    </div>
                  </div>
                </div>

                {/* Ultimate Conversion Banner inside the details */}
                <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-5 rounded-2xl border border-indigo-950 shadow-md text-center space-y-3.5">
                  <div className="inline-flex items-center gap-1.5 bg-indigo-800 text-amber-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{language === 'pl' ? 'Ograniczony Podgląd' : 'Beperkte Toegang'}</span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed text-indigo-100 max-w-md mx-auto">
                    {language === 'pl'
                      ? 'Odblokuj pełną kartę asystenta Tadzika dla TEJ oraz wszystkich innych atrakcji w Holandii, Belgii, Francji, Niemczech i Polsce. Zyskaj fietspaden, cyfrowe pieczęcie i wsparcie 24/7!'
                      : language === 'nl'
                      ? 'Ontgrendel de volledige gids van Tadzik voor DEZE en alle andere attracties in 5 landen. Krijg fietspaden, digitale stempels en 24/7 support!'
                      : 'Unlock Tadzik\'s full guide for THIS and all other landmarks across 5 European countries. Get cycling routes, stamps, and 24/7 support!'}
                  </p>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTrialAttraction(null);
                      // Scroll to top payment form beautifully
                      document.getElementById('premium-boarding-pass-header')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <span>✨</span>
                    <span>{language === 'pl' ? 'Aktywuj Członkostwo Premium' : 'Activeer Premium Pass'}</span>
                  </button>
                </div>
              </div>

              {/* Footer row */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-bold">
                <span>🔐 {language === 'pl' ? 'Bezpieczny test demonstracyjny' : 'Veilige demo-test'}</span>
                <button
                  type="button"
                  onClick={() => setSelectedTrialAttraction(null)}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors font-black"
                >
                  {language === 'pl' ? 'Zamknij podgląd' : 'Sluit voorbeeld'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Beautiful Footer branding */}
        <footer className="w-full max-w-6xl mx-auto text-center font-bold text-slate-500/80 text-xs py-8 mt-12 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>🇪🇺 Smart European Travel Companion • {language === 'pl' ? 'Bezpieczny Przewodnik dla Każdego Pokolenia' : 'Accessible Guides for All Generations'}</span>
          <span className="text-[10px] text-slate-400">© 2026 Smart Travel Group</span>
        </footer>

        {/* Share & Mobile Installation Modal */}
        <ShareAppModal
          isOpen={showPWAInstallModal}
          onClose={() => setShowPWAInstallModal(false)}
          language={language}
        />

        {/* Emergency Assistance Modal */}
        <LostEmergencyModal
          isOpen={showLostEmergencyModal}
          onClose={() => setShowLostEmergencyModal(false)}
          language={language}
          account={account}
        />

        {/* Global Animated Traveling Vehicle Layer across the entire guest view */}
        <AnimatedTravelVehicle language={language} />
      </div>
    );
  }

  // Duplicate unreachable state block removed for clean maintenance

  // 3. LOGGED IN & FULLY PAID STATE - Custom solar explorer dashboard with delicate blue background
  return (
    <div 
      className="min-h-screen text-slate-800 font-sans p-3 md:p-6 pb-20 selection:bg-amber-200 relative" 
      id="app-root-container"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(248, 250, 252, 0.60), rgba(241, 245, 249, 0.70)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Fixed Viewport Language, Large Font & Emergency SOS Switcher (Top-left corner) */}
      <div className="fixed top-3 left-3 z-50 flex items-center gap-1.5">
        <div className="relative">
          <button 
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 bg-slate-900/95 hover:bg-slate-950 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-700 shadow-xl text-[10px] font-black text-white cursor-pointer select-none"
          >
            <span>🌐</span>
            <span className="uppercase text-[9px] text-amber-300 font-extrabold tracking-wider">
              {language === 'en' ? '🇬🇧 EN' : language === 'nl' ? '🇳🇱 NL' : language === 'pl' ? '🇵🇱 PL' : language === 'de' ? '🇩🇪 DE' : language === 'fr' ? '🇫🇷 FR' : language === 'es' ? '🇪🇸 ES' : language === 'ro' ? '🇷🇴 RO' : '🇨🇳 ZH'}
            </span>
            <span className="text-[8px] opacity-60">▼</span>
          </button>
          
          {langOpen && (
            <div className="absolute left-0 mt-1 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden py-0.5 w-24 z-50">
              {[
                { code: 'pl', label: 'PL', flag: '🇵🇱' },
                { code: 'nl', label: 'NL', flag: '🇳🇱' },
                { code: 'en', label: 'EN', flag: '🇬🇧' },
                { code: 'de', label: 'DE', flag: '🇩🇪' },
                { code: 'fr', label: 'FR', flag: '🇫🇷' },
                { code: 'es', label: 'ES', flag: '🇪🇸' },
                { code: 'ro', label: 'RO', flag: '🇷🇴' },
                { code: 'zh', label: 'ZH', flag: '🇨🇳' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as Language);
                    setLangOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2 py-1 text-[9px] font-black hover:bg-slate-900 transition-colors cursor-pointer text-left ${
                    language === lang.code ? 'text-amber-400 bg-slate-900' : 'text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Large Font Mode Direct Switcher */}
        <button
          type="button"
          onClick={() => setLargeFontMode(!largeFontMode)}
          className={`flex items-center gap-1 backdrop-blur-md px-2.5 py-1.5 rounded-full border shadow-xl text-[9px] font-black cursor-pointer select-none transition-all ${
            largeFontMode 
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-500/20' 
              : 'bg-slate-900/90 hover:bg-slate-950 text-slate-200 border-slate-700'
          }`}
          title={language === 'pl' ? 'Włącz/Wyłącz powiększoną czcionkę (ułatwienie 50+)' : 'Toggle large font mode'}
        >
          <span>🔤</span>
          <span className="hidden sm:inline">{largeFontMode ? (language === 'pl' ? 'Duża czcionka: WŁ' : 'Large Font: ON') : (language === 'pl' ? 'Duża czcionka' : 'Large font')}</span>
        </button>

        {/* Quick SOS / 'Zgubiłem się' Button in Top Bar */}
        <button
          type="button"
          onClick={() => setShowLostEmergencyModal(true)}
          className="flex items-center gap-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-[9px] px-2.5 py-1.5 rounded-full border border-rose-400 shadow-xl cursor-pointer hover:scale-105 transition-all animate-pulse"
          title={language === 'pl' ? 'Przycisk ratunkowy: Zgubiłem się' : 'Emergency Assistant: I am lost'}
        >
          <span>🆘</span>
          <span className="uppercase tracking-wider">{language === 'pl' ? 'Zgubiłem się' : language === 'nl' ? 'Verdwaald' : 'Lost'}</span>
        </button>
      </div>

      {/* Fixed Viewport Account Info, Share with Friends & Logout controls (Top-right corner) */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-700 shadow-xl">
        <button
          type="button"
          onClick={() => setShowPWAInstallModal(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:from-amber-700 text-slate-950 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider cursor-pointer border border-amber-400/40 transition-all duration-200 shadow-sm flex items-center gap-1"
          title={language === 'pl' ? 'Podziel się ze znajomymi (App Store / Google Play)' : 'Share with Friends (App Store / Google Play)'}
        >
          <span>📤</span>
          <span className="hidden sm:inline">{language === 'pl' ? 'Podziel się' : language === 'nl' ? 'Deel' : 'Share'}</span>
        </button>

        <div 
          onClick={() => setActiveTab('account')}
          className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black text-[10px] shadow border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title={`${language === 'pl' ? 'Pokaż profil' : 'View Profile'} (${account.username})`}
        >
          {account.username ? account.username.charAt(0).toUpperCase() : 'U'}
        </div>
        <button
          onClick={() => handleUpdateAccount(null)}
          className="bg-rose-600/90 hover:bg-rose-700 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider cursor-pointer border border-rose-500/20 transition-all duration-200 shadow-sm flex items-center gap-0.5"
          title={language === 'pl' ? 'Wyloguj' : 'Exit'}
        >
          <span>🚪</span>
          <span className="hidden sm:inline">{language === 'pl' ? 'Wyloguj' : 'Exit'}</span>
        </button>
      </div>

      {/* Upper Utility Row with Multi-language controls */}
      <header className="max-w-6xl mx-auto mb-6">
        <div className="relative flex flex-col justify-start gap-6 bg-gradient-to-r from-emerald-800 via-green-900 to-emerald-950 text-white border border-emerald-700/60 px-6 py-6 md:px-8 md:py-8 rounded-3xl shadow-xl overflow-hidden" id="branding-header">
          {/* Subtle nature design background patterns */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
          <div className="absolute right-12 bottom-[-10px] flex gap-2 text-7xl select-none pointer-events-none opacity-20 filter blur-[0.5px]">
            🌲 🌲 🌳 🌲
          </div>

          {/* Logo & Main Info Container - Sits perfectly, aligned top and shifted left. */}
          <div className="flex items-start gap-3 pr-24 sm:pr-28 md:pr-44 max-w-4xl z-10 mt-6 md:mt-8 -ml-1 md:-ml-3.5">
            {/* Beautiful Smart Travel Logo with continuous moving mini house, car, bicycle */}
            <div className="relative group shrink-0 pt-0.5">
              {/* Outer pulsing glow gradient */}
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-indigo-400 opacity-70 blur-md group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></span>
              
              {/* Main Icon Box */}
              <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-950 to-slate-850 text-white rounded-2xl border border-slate-700/60 shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                {/* Micro-animated Compass Container */}
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="relative z-10 p-1 bg-slate-900/90 rounded-full border border-slate-700/40 shadow-sm"
                >
                  <Compass className="w-5 h-5 text-amber-400 stroke-[2.5]" />
                </motion.div>

                {/* Floating house 🏠 that slowly slides across */}
                <motion.span 
                  animate={{ 
                    x: [-24, 24, -24],
                    y: [-14, 14, -14],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
                  className="absolute text-[10px] pointer-events-none select-none z-0"
                >
                  🏠
                </motion.span>

                {/* Floating car 🚗 that slowly drives along the bottom */}
                <motion.span 
                  animate={{ 
                    x: [24, -24, 24],
                    y: [16, 16, 16]
                  }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  className="absolute text-[10px] pointer-events-none select-none z-0"
                >
                  🚗
                </motion.span>

                {/* Floating bicycle 🚲 cycling diagonally */}
                <motion.span 
                  animate={{ 
                    x: [-24, 24, -24],
                    y: [12, -12, 12],
                    rotate: [0, -15, 15, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
                  className="absolute text-[10px] pointer-events-none select-none z-0"
                >
                  🚲
                </motion.span>
              </div>
            </div>

            <div className="space-y-1 max-w-[65%] sm:max-w-[75%] md:max-w-[85%]">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-sm">
                {t.title}
              </h1>
              <p className="text-emerald-100 font-semibold text-sm md:text-base leading-relaxed">
                {t.subtitle}
              </p>

              {/* Payment prompt banner under description - shifted to the left/center for perfect design alignment */}
              {account && !account.hasPaid ? (
                <div className="pt-2 flex justify-center md:justify-start w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowHeaderPayment(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-900 px-4 py-2 rounded-xl text-xs font-black shadow-lg border border-amber-300 cursor-pointer animate-pulse mx-auto md:mx-0 md:-ml-8"
                  >
                    <span>💳</span>
                    <span>
                      {language === 'pl' 
                        ? 'Kliknij, aby opłacić dostęp (iDEAL, Wero, Karta)' 
                        : language === 'nl' 
                        ? 'Klik om te betalen (iDEAL, Wero, Kaart)' 
                        : 'Click to unlock full access (iDEAL, Wero, Card)'}
                    </span>
                    <span className="bg-slate-900 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded ml-1">
                      25 €
                    </span>
                  </motion.button>
                </div>
              ) : (
                <div className="pt-2 flex justify-center md:justify-start w-full">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-xl border border-emerald-500/30 text-xs font-bold select-none mx-auto md:mx-0 md:-ml-8">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                    <span>
                      {language === 'pl' 
                        ? 'Wersja Premium aktywna (Opłacone) ✔️' 
                        : language === 'nl' 
                        ? 'Premium-versie actief (Betaald) ✔️' 
                        : 'Premium Version Active (Paid) ✔️'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>


        </div>
      </header>

      {/* Main Tab Navigation Menu (Clean, Intuitive & High-Contrast Touch Targets) */}
      <nav className="max-w-6xl mx-auto mb-6 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl overflow-hidden shadow-md flex flex-wrap md:flex-nowrap p-1.5 gap-1.5" id="main-navigation-bar">
        <button
          onClick={() => handleSwitchTab('explore')}
          id="nav-btn-explore"
          className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 px-3.5 font-bold text-xs sm:text-sm md:text-base rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'explore' 
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm font-black' 
              : 'text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/60'
          }`}
        >
          <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'explore' ? 'text-amber-300' : 'text-amber-500'}`} />
          <span>
            {language === 'pl' 
              ? '🏰 Atrakcje & Zwiedzanie' 
              : language === 'nl' 
              ? '🏰 Attracties & Bezienswaardigheden' 
              : '🏰 Attractions & Sightseeing'}
          </span>
        </button>

        <button
          onClick={() => handleSwitchTab('station-router')}
          id="nav-btn-router"
          className={`flex-1 min-w-[145px] flex items-center justify-center gap-2 py-3 px-3.5 font-bold text-xs sm:text-sm md:text-base rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'station-router' 
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm font-black' 
              : 'text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/60'
          }`}
        >
          <Train className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'station-router' ? 'text-amber-300' : 'text-indigo-600'}`} />
          <span>
            {language === 'pl' 
              ? '🚆 Rozkład & Pociągi' 
              : language === 'nl' 
              ? '🚆 Treinen & Dienstregeling' 
              : '🚆 Trains & Schedules'}
          </span>
        </button>

        <button
          onClick={() => handleSwitchTab('cycling')}
          id="nav-btn-cycling"
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-3.5 font-bold text-xs sm:text-sm md:text-base rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'cycling' 
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm font-black' 
              : 'text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/60'
          }`}
        >
          <Bike className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'cycling' ? 'text-amber-300' : 'text-emerald-600'}`} />
          <span>
            {language === 'pl' 
              ? 'Trasy Rowerowe' 
              : language === 'nl' 
              ? 'Fietspaden' 
              : 'Cycling Routes'}
          </span>
        </button>

        <button
          onClick={() => handleSwitchTab('motorcycle')}
          id="nav-btn-motorcycle"
          className={`flex-1 min-w-[135px] flex items-center justify-center gap-2 py-3 px-3.5 font-bold text-xs sm:text-sm md:text-base rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'motorcycle' 
              ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-600/30 font-black ring-2 ring-rose-400/40' 
              : 'text-slate-700 hover:text-rose-700 hover:bg-rose-50/70'
          }`}
        >
          <span className="text-base">🏍️</span>
          <span>
            {language === 'pl' 
              ? 'Trasy na Motor' 
              : language === 'nl' 
              ? 'Motorroutes' 
              : 'Motorcycle Routes'}
          </span>
        </button>

        <button
          onClick={() => handleSwitchTab('hotels')}
          id="nav-btn-hotels"
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-3.5 font-bold text-xs sm:text-sm md:text-base rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'hotels' 
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm font-black' 
              : 'text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/60'
          }`}
        >
          <Building2 className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'hotels' ? 'text-amber-300' : 'text-indigo-600'}`} />
          <span>
            {language === 'pl' 
              ? 'Hotele & Noclegi' 
              : language === 'nl' 
              ? 'Hotels & Verblijf' 
              : 'Hotels & Stays'}
          </span>
        </button>

        <button
          onClick={() => handleSwitchTab('passport')}
          id="nav-btn-passport"
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-3.5 font-bold text-xs sm:text-sm md:text-base rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'passport' 
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm font-black' 
              : 'text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/60'
          }`}
        >
          <Award className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'passport' ? 'text-amber-300' : 'text-amber-600'}`} />
          <span>
            {language === 'pl' 
              ? 'Paszport Podróżnika' 
              : language === 'nl' 
              ? 'Reispaspoort' 
              : 'Travel Passport'}
          </span>
        </button>

        <button
          onClick={() => handleSwitchTab('challenges')}
          id="nav-btn-challenges"
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-3.5 font-bold text-xs sm:text-sm md:text-base rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'challenges' 
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm font-black' 
              : 'text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/60'
          }`}
        >
          <Trophy className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'challenges' ? 'text-amber-300' : 'text-amber-600'}`} />
          <span>
            {language === 'pl' 
              ? 'Wyzwania & Radar' 
              : language === 'nl' 
              ? 'Uitdagingen & Radar' 
              : 'Challenges & Radar'}
          </span>
        </button>

        <button
          onClick={() => handleSwitchTab('account')}
          id="nav-btn-account"
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-3.5 font-bold text-xs sm:text-sm md:text-base rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'account' 
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm font-black' 
              : 'text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/60'
          }`}
        >
          <User className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'account' ? 'text-amber-300' : 'text-slate-600'}`} />
          <span>
            {language === 'pl' 
              ? 'Mój Profil' 
              : language === 'nl' 
              ? 'Mijn Profiel' 
              : 'My Profile'}
          </span>
        </button>
      </nav>

      {/* Main active view port */}
      <main className="max-w-6xl mx-auto" id="app-viewport-body">
        {activeTab === 'explore' && (
          <ExploreTab 
            language={language} 
            account={account} 
            onUpdateAccount={handleUpdateAccount}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onNavigateTab={handleSwitchTab}
          />
        )}

        {activeTab === 'station-router' && (
          <StationPlannerTab language={language} account={account} />
        )}

        {activeTab === 'cycling' && (
          <CyclingRoutesTab 
            language={language} 
            account={account} 
            onUpdateAccount={handleUpdateAccount}
            onNavigateTab={handleSwitchTab}
          />
        )}

        {activeTab === 'motorcycle' && (
          <MotorcycleRoutesTab 
            language={language} 
            account={account} 
            onUpdateAccount={handleUpdateAccount}
            onNavigateTab={handleSwitchTab}
          />
        )}

        {activeTab === 'hotels' && (
          <HotelSearchTab language={language} account={account} />
        )}

        {activeTab === 'passport' && (
          <PassportTab language={language} account={account} onUpdateAccount={handleUpdateAccount} onNavigateTab={handleSwitchTab} />
        )}

        {activeTab === 'challenges' && (
          <ChallengesTab language={language} account={account} />
        )}

        {activeTab === 'account' && (
          <AccountModal 
            language={language} 
            account={account} 
            onUpdateAccount={handleUpdateAccount}
            onNavigateTab={handleSwitchTab}
          />
        )}
      </main>

      {/* Interactive Dutch Payment Gateway Modal */}
      {showHeaderPayment && account && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-3 md:p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-slate-800"
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 relative border-b border-slate-800">
              <button 
                onClick={() => {
                  if (!paymentProcessing) {
                    setShowHeaderPayment(false);
                    setPaymentSuccess(false);
                    setPaymentMethodState(null);
                  }
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold cursor-pointer transition-colors p-1"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500 text-slate-950 p-2 rounded-lg">
                  <CreditCard className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">
                    {language === 'pl' ? 'Bezpieczna Bramka Płatności 🛡️' : language === 'nl' ? 'Beveiligde Betaling 🛡️' : 'Secure Payment Gateway 🛡️'}
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold">
                    {language === 'pl' ? 'Roczny abonament bezpieczeństwa' : language === 'nl' ? 'Jaarabonnement voor reishulp' : 'Annual safety & routing pass'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 md:p-6 space-y-5">
              {!paymentSuccess ? (
                <>
                  {/* Summary / Price tag */}
                  <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <span className="font-bold text-slate-700 text-sm">
                      {language === 'pl' ? 'Pakiet Senior Premium NL' : language === 'nl' ? 'Premium Senior NL Pakket' : 'Senior Premium NL Package'}
                    </span>
                    <span className="text-xl font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      25.00 €
                    </span>
                  </div>

                  {/* Payment method selection tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethodState('ideal')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                        paymentMethodState === 'ideal'
                          ? 'border-emerald-600 bg-emerald-50/40 text-emerald-950'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <span className="text-pink-600 text-sm font-black mb-1">iDEAL</span>
                      <span className="text-[10px] opacity-80">Online Bank</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethodState('wero')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                        paymentMethodState === 'wero'
                          ? 'border-emerald-600 bg-emerald-50/40 text-emerald-950'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <span className="text-indigo-600 text-sm font-black mb-1">wero</span>
                      <span className="text-[10px] opacity-80">Instant SEPA</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethodState('card')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                        paymentMethodState === 'card'
                          ? 'border-emerald-600 bg-emerald-50/40 text-emerald-950'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-slate-800 mb-1" />
                      <span className="text-[10px] opacity-80">{language === 'pl' ? 'Karta' : language === 'nl' ? 'Kaart' : 'Credit Card'}</span>
                    </button>
                  </div>

                  {/* Form fields based on selected payment method */}
                  {paymentMethodState === 'ideal' && (
                    <div className="space-y-2 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      <label className="block text-slate-700 font-bold text-xs">
                        {language === 'pl' ? 'Wybierz swój holenderski bank:' : language === 'nl' ? 'Selecteer uw Nederlandse bank:' : 'Select your Dutch Bank:'}
                      </label>
                      <select
                        value={selectedBankHeader}
                        onChange={(e) => setSelectedBankHeader(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="">-- {language === 'pl' ? 'Kies een bank / Wybierz bank' : 'Kies een bank'} --</option>
                        {['ING', 'Rabobank', 'ABN AMRO', 'SNS Bank', 'ASN Bank', 'RegioBank', 'Triodos Bank'].map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        {language === 'pl' 
                          ? 'Tranzakcja zostanie bezpiecznie zasymulowana poprzez protokół iDEAL.' 
                          : 'U wordt na het klikken veilig doorgeleid naar uw bank.'}
                      </p>
                    </div>
                  )}

                  {paymentMethodState === 'wero' && (
                    <div className="space-y-2 bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                      <label className="block text-slate-700 font-bold text-xs text-left mb-1">
                        {language === 'pl' ? 'Wpisz numer telefonu zarejestrowany w Wero:' : 'Voer uw Wero mobiel nummer in:'}
                      </label>
                      <input
                        type="text"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white text-center font-mono focus:ring-1 focus:ring-emerald-500 font-bold text-slate-800"
                        placeholder="+31 6 12345678"
                        value={weroNumberHeader}
                        onChange={(e) => setWeroNumberHeader(e.target.value)}
                      />
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Wero connects major European retail banks for immediate peer-to-peer transfers.
                      </p>
                    </div>
                  )}

                  {paymentMethodState === 'card' && (
                    <div className="space-y-3 bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          {language === 'pl' ? 'Właściciel karty' : 'Kaarthouder naam'}
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                          placeholder="A. Tomaszewski"
                          value={cardNameHeader}
                          onChange={(e) => setCardNameHeader(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          {language === 'pl' ? 'Numer karty' : 'Kaartnummer'}
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono text-slate-800"
                          placeholder="4111 2222 3333 4444"
                          maxLength={19}
                          value={cardNumberHeader}
                          onChange={(e) => setCardNumberHeader(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">
                            {language === 'pl' ? 'Data ważności' : 'Vervaldatum'}
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border border-slate-300 rounded-lg bg-white text-center font-mono text-slate-800"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardExpiryHeader}
                            onChange={(e) => setCardExpiryHeader(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">CVC</label>
                          <input
                            type="text"
                            className="w-full p-2 border border-slate-300 rounded-lg bg-white text-center font-mono text-slate-800"
                            placeholder="123"
                            maxLength={3}
                            value={cardCvcHeader}
                            onChange={(e) => setCardCvcHeader(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Trigger secure payment simulation button */}
                  {paymentMethodState ? (
                    <button
                      type="button"
                      disabled={paymentProcessing}
                      onClick={handleHeaderPaymentSubmit}
                      className={`w-full font-bold text-sm py-3 rounded-xl border border-emerald-700/10 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        paymentProcessing
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {paymentProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-400 border-t-transparent"></div>
                          <span>
                            {language === 'pl' ? 'Przetwarzanie bezpiecznej transakcji...' : 'Beveiligde transactie verwerken...'}
                          </span>
                        </>
                      ) : (
                        <span>
                          {language === 'pl' ? `Zapłać 25 € teraz` : `Betaal €25 nu`}
                        </span>
                      )}
                    </button>
                  ) : (
                    <p className="text-center text-xs text-stone-500 font-semibold italic">
                      {language === 'pl' ? '👈 Wybierz metodę płatności powyżej, aby rozpocząć' : '👈 Kies hierboven een betaalmethode om te starten'}
                    </p>
                  )}
                </>
              ) : (
                /* Success screen */
                <div className="text-center py-6 space-y-4">
                  <motion.div 
                    initial={{ scale: 0.5, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 shadow-md mx-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </motion.div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">
                      {language === 'pl' ? 'Płatność zakończona sukcesem! 🎉' : language === 'nl' ? 'Betaling succesvol afgerond! 🎉' : 'Payment Completed Successfully! 🎉'}
                    </h4>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium leading-relaxed">
                      {language === 'pl' 
                        ? 'Dziękujemy! Twój roczny abonament premium został pomyślnie aktywowany. Wszystkie funkcje nawigacji, fietspaden oraz wyzwania są teraz odblokowane!'
                        : 'Hartelijk dank! Uw Premium-abonnement is geactiveerd. Alle fietspaden, stempels en 9292 functionaliteiten zijn nu volledig bruikbaar!'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowHeaderPayment(false);
                      setPaymentSuccess(false);
                      setPaymentMethodState(null);
                    }}
                    className="bg-slate-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 cursor-pointer shadow transition-all"
                  >
                    {language === 'pl' ? 'Przejdź do aplikacji' : 'Ga naar de app'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Timeless Footer branding & Legal Liability Disclaimer requested by User */}
      <footer className="max-w-6xl mx-auto mt-12 pt-6 border-t-2 border-stone-200 text-center text-stone-600 font-bold space-y-4 pb-8" id="footer-credits">
        <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl max-w-4xl mx-auto text-left text-xs text-amber-950 font-semibold space-y-2">
          <p className="font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <span>⚠️</span> 
            <span>{language === 'pl' ? 'Klauzula Odpowiedzialności i Prawa Autorskie' : 'Disclaimer & Copyright'}</span>
          </p>
          <p className="leading-relaxed">
            {language === 'pl' ? (
              <>
                Wszystkie prawa zastrzeżone przez <strong>A.Florek</strong>. Aplikacja nie bierze żadnej odpowiedzialności za niepowodzenia w podróży czy inne jakiekolwiek problemy zdrowotne. Wszyscy używają aplikacji na własną odpowiedzialność.
              </>
            ) : language === 'nl' ? (
              <>
                Alle rechten voorbehouden door <strong>A.Florek</strong>. De applicatie aanvaardt geen enkele aansprakelijkheid voor reismislukkingen of andere gezondheidsproblemen. Iedereen gebruikt de applicatie op eigen risico.
              </>
            ) : (
              <>
                All rights reserved by <strong>A.Florek</strong>. The application takes no responsibility for travel failures or any health-related issues. All users utilize the application at their own risk.
              </>
            )}
          </p>
        </div>
        <p className="text-sm opacity-80">🇪🇺 Europe Smart Tourist & Station Buffer Companion (NL, BE, FR, DE, PL) • Timeless Senior-Friendly Design • Large Legible Display</p>
      </footer>

      {/* Share & Mobile App Modal */}
      <ShareAppModal
        isOpen={showPWAInstallModal}
        onClose={() => setShowPWAInstallModal(false)}
        language={language}
      />

      {/* Emergency Assistance Modal */}
      <LostEmergencyModal
        isOpen={showLostEmergencyModal}
        onClose={() => setShowLostEmergencyModal(false)}
        language={language}
        account={account}
      />

      {/* Global Animated Traveling Vehicle Layer across all pages & tabs */}
      <AnimatedTravelVehicle language={language} />
    </div>
  );
}
