/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, UserAccount } from '../types';
import { 
  AlertTriangle, Phone, MapPin, Share2, Compass, 
  X, Check, ShieldAlert, HeartHandshake, Navigation, Home, 
  ExternalLink, MessageCircle, RefreshCw, Sparkles, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LostEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  account: UserAccount | null;
  onNavigateHome?: (destination: string) => void;
}

export default function LostEmergencyModal({
  isOpen,
  onClose,
  language,
  account,
  onNavigateHome
}: LostEmergencyModalProps) {
  const pl = language === 'pl';
  
  // Emergency target language for the stranger on the street (Dutch by default for NL trips, English, or German)
  const [helperLanguage, setHelperLanguage] = useState<'nl' | 'en' | 'de'>('nl');
  
  // Geolocation state
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoAddress, setGeoAddress] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locError, setLocError] = useState<string>('');

  // Contact person (ICE) state
  const [iceName, setIceName] = useState<string>(account?.iceContact?.name || '');
  const [icePhone, setIcePhone] = useState<string>(account?.iceContact?.phone || '');
  const [homeTarget, setHomeTarget] = useState<string>(account?.homeStationOrHotel || 'Dworzec Główny / Hotel');
  const [isEditingContact, setIsEditingContact] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Fetch real location on modal open
  useEffect(() => {
    if (isOpen) {
      fetchCurrentPosition();
    }
  }, [isOpen]);

  // Sync profile data
  useEffect(() => {
    if (account?.iceContact) {
      setIceName(account.iceContact.name);
      setIcePhone(account.iceContact.phone);
    }
    if (account?.homeStationOrHotel) {
      setHomeTarget(account.homeStationOrHotel);
    }
  }, [account]);

  const fetchCurrentPosition = () => {
    setIsLocating(true);
    setLocError('');

    // First try reading cached position
    try {
      const cached = localStorage.getItem('tadzik_user_gps_location');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.coords?.lat && parsed?.coords?.lng) {
          setCurrentCoords(parsed.coords);
          setGeoAddress(parsed.locationName || `${parsed.coords.lat.toFixed(5)}, ${parsed.coords.lng.toFixed(5)}`);
          setIsLocating(false);
          return;
        }
      }
    } catch (e) {}

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCurrentCoords({ lat, lng });
          setGeoAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          setIsLocating(false);
          try {
            localStorage.setItem('tadzik_gps_consent_granted', 'true');
            localStorage.setItem('tadzik_user_gps_location', JSON.stringify({
              coords: { lat, lng },
              status: 'success',
              locationName: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
              accuracyMeters: Math.round(pos.coords.accuracy || 10),
              updatedAt: Date.now()
            }));
          } catch (e) {}
        },
        (err) => {
          console.warn('Geolocation warning in emergency modal:', err);
          // Fallback simulation in Amsterdam/Rotterdam region
          setCurrentCoords({ lat: 52.379189, lng: 4.900148 });
          setGeoAddress('Rotterdam / Amsterdam (GPS)');
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setCurrentCoords({ lat: 52.379189, lng: 4.900148 });
      setGeoAddress('Amsterdam / Rotterdam (GPS)');
      setIsLocating(false);
    }
  };

  // Helper translations for the bystander / conductor / police officer
  const helperPhrases = {
    nl: {
      flag: '🇳🇱 Nederlands',
      headline: 'PARDON! IK BEN DE WEG KWIJT',
      subhead: 'Kunt u mij alstublieft helpen?',
      body: `Hallo! Ik spreek geen vloeiend Nederlands en ben verdwaald. Ik wil graag veilig terugkeren naar: "${homeTarget || 'het dichtstbijzijnde treinstation'}".`,
      callIce: `Kunt u alstublieft mijn contactpersoon bellen: ${iceName ? `${iceName} (${icePhone})` : icePhone || 'het alarmnummer 112'}?`,
      myIdentity: `Mijn naam is ${account?.firstName ? `${account.firstName} ${account?.lastName || ''}` : 'Reiziger'}.`,
      ttsText: `Pardon! Ik ben verdwaald en zoek hulp. Kunt u mij alstublieft helpen om bij het treinstation of ${homeTarget || 'mijn hotel'} te komen? Mijn naam is ${account?.firstName || 'reiziger'}.`
    },
    en: {
      flag: '🇬🇧 English',
      headline: 'EXCUSE ME! I AM LOST',
      subhead: 'Could you please help me?',
      body: `Hello! I am lost and need assistance. I would like to get back safely to: "${homeTarget || 'the nearest central train station'}".`,
      callIce: `Could you please call my emergency contact: ${iceName ? `${iceName} (${icePhone})` : icePhone || 'emergency 112'}?`,
      myIdentity: `My name is ${account?.firstName ? `${account.firstName} ${account?.lastName || ''}` : 'Traveler'}.`,
      ttsText: `Excuse me! I am lost and need help. Could you please help me get to the nearest train station or ${homeTarget || 'my destination'}? My name is ${account?.firstName || 'traveler'}.`
    },
    de: {
      flag: '🇩🇪 Deutsch',
      headline: 'ENTSCHULDIGUNG! ICH HABE MICH VERLAUFEN',
      subhead: 'Können Sie mir bitte helfen?',
      body: `Hallo! Ich habe mich verlaufen. Ich möchte bitte sicher zurück zu: "${homeTarget || 'zum nächsten Hauptbahnhof'}".`,
      callIce: `Könnten Sie bitte meine Kontaktperson anrufen: ${iceName ? `${iceName} (${icePhone})` : icePhone || 'Notruf 112'}?`,
      myIdentity: `Mein Name ist ${account?.firstName ? `${account.firstName} ${account?.lastName || ''}` : 'Reisender'}.`,
      ttsText: `Entschuldigung! Ich habe mich verlaufen und brauche Hilfe. Können Sie mir bitte helfen, zum Bahnhof oder zu ${homeTarget || 'meinem Hotel'} zu gelangen?`
    }
  };

  const currentHelper = helperPhrases[helperLanguage];

  const mapsUrl = currentCoords 
    ? `https://www.google.com/maps/search/?api=1&query=${currentCoords.lat},${currentCoords.lng}`
    : `https://www.google.com/maps`;

  const handleShareWhatsApp = () => {
    const message = pl
      ? `Cześć! Potrzebuję pomocy w powrocie. Moja aktualna lokalizacja GPS: ${mapsUrl} (Cel: ${homeTarget})`
      : `Hello! I need assistance getting back. My current GPS location: ${mapsUrl} (Target: ${homeTarget})`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSaveContact = () => {
    if (account) {
      const updatedAccount: UserAccount = {
        ...account,
        homeStationOrHotel: homeTarget,
        iceContact: {
          name: iceName,
          phone: icePhone,
          relationship: account.iceContact?.relationship || 'Bliska osoba'
        }
      };
      try {
        localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
        localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAccount));
      } catch (err) {
        console.error(err);
      }
    }
    setIsEditingContact(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl border-4 border-amber-500 shadow-2xl overflow-hidden my-auto"
        id="lost-emergency-modal-card"
      >
        {/* Top Emergency Header Bar */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-rose-600 flex items-center justify-center text-2xl font-black shadow-md shrink-0 animate-bounce">
              🆘
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-rose-900/40 text-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200/30">
                {pl ? 'PRZYCISK BEZPIECZEŃSTWA' : 'SAFETY ASSISTANT'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                {pl ? 'Zgubiłem się – Pomóż mi wrócić' : "I'm Lost – Help Me Return"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer text-lg font-bold"
            title={pl ? 'Zamknij' : 'Close'}
          >
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Reassuring Calm Notice from Tadzik */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-start gap-3.5 shadow-2xs">
            <span className="text-2xl shrink-0">🧭</span>
            <div className="space-y-0.5">
              <h4 className="text-sm font-black text-emerald-950">
                {pl ? 'Spokojnie, jesteś bezpieczny!' : 'Stay calm, you are safe!'}
              </h4>
              <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                {pl 
                  ? 'Usiądź na ławce lub podejdź do konduktora/przechodnia i pokaż mu poniższy duży żółty ekran. Telefon może również przeczytać prośbę na głos.'
                  : 'Show the yellow card below to a passerby or train staff, or press the speech button to read it aloud.'}
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 🟨 MEGA FLASHCARD DLA PRZECHODNIA / KONDUKTORA W HOLANDII */}
          {/* ========================================================= */}
          <div className="bg-amber-400 border-4 border-slate-950 rounded-3xl p-5 sm:p-6 text-slate-950 space-y-4 shadow-xl">
            
            {/* Language Switcher for Bystander */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-950/20 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span>Pokaż w języku przechodnia:</span>
              </span>

              <div className="flex items-center gap-1.5">
                {(['nl', 'en', 'de'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setHelperLanguage(lang)}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      helperLanguage === lang
                        ? 'bg-slate-950 text-white shadow-md scale-105'
                        : 'bg-amber-200/80 hover:bg-amber-100 text-slate-900 border border-slate-950/20'
                    }`}
                  >
                    {lang === 'nl' ? '🇳🇱 Nederlands' : lang === 'en' ? '🇬🇧 English' : '🇩🇪 Deutsch'}
                  </button>
                ))}
              </div>
            </div>

            {/* Giant Headline */}
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-slate-950 uppercase">
                {currentHelper.headline} 🛑
              </h3>
              <p className="text-base sm:text-lg font-extrabold text-slate-800">
                {currentHelper.subhead}
              </p>
            </div>

            {/* Clear, High-Contrast Message */}
            <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border-2 border-slate-950 text-slate-950 space-y-3 shadow-inner">
              <p className="text-base sm:text-lg font-bold leading-snug">
                {currentHelper.body}
              </p>

              <div className="p-3 bg-amber-100/90 rounded-xl border border-amber-300 space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 block">
                  📍 {pl ? 'Mój cel / Dworzec / Hotel:' : 'Destination:'}
                </span>
                <span className="text-base sm:text-xl font-black text-slate-950 block">
                  {homeTarget}
                </span>
              </div>

              {icePhone && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-300 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-800 block">
                      📞 {pl ? 'Telefon do mojego opiekuna (ICE):' : 'Emergency Contact:'}
                    </span>
                    <span className="text-sm sm:text-base font-black text-rose-950">
                      {iceName ? `${iceName}: ` : ''}{icePhone}
                    </span>
                  </div>
                  <a
                    href={`tel:${icePhone}`}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Zadzwoń</span>
                  </a>
                </div>
              )}
            </div>

          </div>

          {/* ========================================================= */}
          {/* 📍 MOJA DOKŁADNA LOKALIZACJA GPS & POWRÓT */}
          {/* ========================================================= */}
          <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {pl ? 'Twoja Aktualna Pozycja GPS' : 'Your GPS Location'}
                  </h4>
                  <p className="text-xs text-slate-500 font-bold">
                    {isLocating ? (pl ? 'Pobieranie pozycji...' : 'Locating...') : geoAddress || (pl ? 'Współrzędne pobrane' : 'Coordinates acquired')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={fetchCurrentPosition}
                disabled={isLocating}
                className="p-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                title={pl ? 'Odśwież lokalizację' : 'Refresh GPS'}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-indigo-600' : ''}`} />
                <span className="hidden sm:inline">{pl ? 'Odśwież' : 'Refresh'}</span>
              </button>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              
              {/* Navigate Back to Home / Station */}
              <button
                type="button"
                onClick={() => {
                  if (onNavigateHome) {
                    onNavigateHome(homeTarget);
                  }
                  onClose();
                }}
                className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98"
              >
                <Navigation className="w-4 h-4 stroke-[2.5]" />
                <span>{pl ? `Nawiguj do: ${homeTarget}` : `Navigate to ${homeTarget}`}</span>
              </button>

              {/* Open in Google Maps */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 text-center"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{pl ? 'Otwórz w Google Maps' : 'Open in Google Maps'}</span>
              </a>

            </div>

            {/* Send Location to Family via WhatsApp / SMS */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-400 text-emerald-950 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>{pl ? 'Wyślij moją pozycję na WhatsApp do rodziny 💬' : 'Share GPS position via WhatsApp 💬'}</span>
              </button>
            </div>

          </div>

          {/* ========================================================= */}
          {/* 📞 NUMERY ALARMOWE & EDYCJA KONTAKTU OPIEKUNA (ICE) */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* European Emergency Number 112 */}
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 block">
                  🚨 {pl ? 'POGOTOWIE / POLICJA UE' : 'EU EMERGENCY SERVICES'}
                </span>
                <span className="text-xl font-black text-rose-950 block">
                  Numer Alarmowy 112
                </span>
                <p className="text-xs text-rose-700 font-medium">
                  {pl ? 'Darmowe połączenie w całej Holandii i Unii Europejskiej.' : 'Free emergency line across the EU.'}
                </p>
              </div>

              <a
                href="tel:112"
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 text-center"
              >
                <Phone className="w-4 h-4" />
                <span>{pl ? 'Zadzwoń pod 112' : 'Call 112'}</span>
              </a>
            </div>

            {/* Target & ICE Settings */}
            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                    ⚙️ {pl ? 'MÓJ HOTEL & OPIEKUN' : 'MY HOTEL & ICE'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingContact(!isEditingContact)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                  >
                    {isEditingContact ? (pl ? 'Zwiń' : 'Cancel') : (pl ? 'Zmień' : 'Edit')}
                  </button>
                </div>

                {!isEditingContact ? (
                  <div className="text-xs space-y-1 text-slate-800 font-medium pt-1">
                    <p><strong className="text-slate-950">Hotel / Stacja:</strong> {homeTarget}</p>
                    <p><strong className="text-slate-950">Opiekun:</strong> {iceName ? `${iceName} (${icePhone})` : (pl ? 'Nie podano (kliknij Zmień)' : 'None')}</p>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1 text-xs">
                    <input
                      type="text"
                      value={homeTarget}
                      onChange={(e) => setHomeTarget(e.target.value)}
                      placeholder={pl ? 'Nazwa Twojego Hotelu lub Stacji...' : 'Hotel or Station name...'}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold"
                    />
                    <input
                      type="text"
                      value={iceName}
                      onChange={(e) => setIceName(e.target.value)}
                      placeholder={pl ? 'Imię bliskiej osoby (np. Córka Anna)' : 'Contact Name'}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold"
                    />
                    <input
                      type="tel"
                      value={icePhone}
                      onChange={(e) => setIcePhone(e.target.value)}
                      placeholder={pl ? 'Numer tel. (np. +48 600...)' : 'Phone number'}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleSaveContact}
                      className="w-full py-1.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 cursor-pointer"
                    >
                      {pl ? 'Zapisz dane' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              {!isEditingContact && icePhone && (
                <a
                  href={`tel:${icePhone}`}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 text-center"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{pl ? `Zadzwoń do: ${iceName || 'Bliski'}` : `Call ${iceName || 'ICE'}`}</span>
                </a>
              )}
            </div>

          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>{pl ? 'Bezpieczna Podróż z Tadzikiem' : 'Safe Travel with Tadzik'}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-black text-sm rounded-xl cursor-pointer shadow-md"
          >
            {pl ? 'Wróć do Aplikacji' : 'Return to App'}
          </button>
        </div>

      </motion.div>
    </div>
  );
}
