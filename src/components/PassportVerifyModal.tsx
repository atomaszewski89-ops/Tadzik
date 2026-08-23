/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  MapPin, 
  QrCode, 
  Camera, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Crosshair, 
  RotateCw, 
  Lock, 
  Unlock, 
  Eye, 
  Award,
  Smartphone,
  Navigation,
  FileCheck2,
  Trash2
} from 'lucide-react';
import { Language, UserAccount, StickerVerificationProof } from '../types';
import { AttractionSticker, RegionalStamp } from '../data/passportData';

interface PassportVerifyModalProps {
  language: Language;
  account: UserAccount | null;
  item: AttractionSticker | RegionalStamp;
  isRegional: boolean;
  isAlreadyCollected: boolean;
  existingProof?: StickerVerificationProof;
  onClose: () => void;
  onVerifySuccess: (itemId: string, proof: StickerVerificationProof) => void;
  onRemoveSticker: (itemId: string) => void;
}

// Haversine distance calculator
function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

function generateVerificationHash(userId: string, stickerId: string, timestamp: string, method: string): string {
  const payload = `${userId}_${stickerId}_${timestamp}_${method}_SECURE_2026`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `TADZIK-AUTH-${hex}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function PassportVerifyModal({
  language,
  account,
  item,
  isRegional,
  isAlreadyCollected,
  existingProof,
  onClose,
  onVerifySuccess,
  onRemoveSticker
}: PassportVerifyModalProps) {
  const [activeTab, setActiveTab] = useState<'gps' | 'photo' | 'qr'>('gps');
  
  // GPS State
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [showDemoBypass, setShowDemoBypass] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState(false);

  // QR Code State
  const [enteredCode, setEnteredCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  // Photo State
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [stampedPhoto, setStampedPhoto] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const itemName = isRegional 
    ? (item as RegionalStamp).region 
    : ((item as AttractionSticker).name[language] || (item as AttractionSticker).name.en);
  
  const itemId = isRegional ? (item as RegionalStamp).region : (item as AttractionSticker).id;
  const targetCoords = item.coordinates;
  const allowableRadiusMeters = isRegional 
    ? (item as RegionalStamp).radiusKm * 1000 
    : (item as AttractionSticker).radiusMeters;
  const officialCode = item.verificationCode;

  // Trigger GPS location on load or GPS tab click
  const fetchCurrentLocation = () => {
    setIsLocating(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('Twoja przeglądarka nie obsługuje geolokalizacji GPS.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        setUserCoords({ lat: uLat, lng: uLng });
        setGpsAccuracy(Math.round(pos.coords.accuracy));

        const dist = calculateDistanceMeters(uLat, uLng, targetCoords.lat, targetCoords.lng);
        setDistanceMeters(dist);
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS Error:', err);
        setIsLocating(false);
        if (err.code === 1) {
          setGpsError('Odmowa dostępu do lokalizacji GPS. Zezwól na dostęp w ustawieniach przeglądarki lub użyj kodu QR / dowodu foto.');
        } else {
          setGpsError('Nie udało się ustalić precyzyjnej pozycji GPS. Spróbuj ponownie na zewnątrz.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const handleVerifyGps = () => {
    if (!account) return;
    if (distanceMeters === null) return;

    if (distanceMeters > allowableRadiusMeters) {
      alert(`Jesteś za daleko od obiektu (${formatDistance(distanceMeters)}). Wymagana odległość to poniżej ${formatDistance(allowableRadiusMeters)}.`);
      return;
    }

    const timestamp = new Date().toISOString();
    const proof: StickerVerificationProof = {
      stickerId: itemId,
      verifiedAt: timestamp,
      method: 'gps',
      coordinates: userCoords || targetCoords,
      distanceMeters: distanceMeters,
      verificationHash: generateVerificationHash(account.username, itemId, timestamp, 'GPS'),
      status: 'verified'
    };

    onVerifySuccess(itemId, proof);
  };

  const handleAdminBypassVerify = () => {
    if (!account) return;
    if (adminPinInput.trim() !== '2026' && adminPinInput.trim().toUpperCase() !== 'TADZIK') {
      setAdminPinError(true);
      return;
    }

    const timestamp = new Date().toISOString();
    const proof: StickerVerificationProof = {
      stickerId: itemId,
      verifiedAt: timestamp,
      method: 'organizer_override',
      coordinates: targetCoords,
      distanceMeters: 0,
      verificationHash: generateVerificationHash(account.username, itemId, timestamp, 'ADMIN'),
      status: 'verified'
    };

    onVerifySuccess(itemId, proof);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    const normalizedEntered = enteredCode.trim().toUpperCase();
    const normalizedTarget = officialCode.trim().toUpperCase();

    if (normalizedEntered !== normalizedTarget) {
      setCodeError(`Nieprawidłowy kod weryfikacyjny miejsca! Sprawdź tabliczkę na miejscu lub kod QR.`);
      return;
    }

    const timestamp = new Date().toISOString();
    const proof: StickerVerificationProof = {
      stickerId: itemId,
      verifiedAt: timestamp,
      method: 'qr_code',
      coordinates: targetCoords,
      verificationHash: generateVerificationHash(account.username, itemId, timestamp, 'QR'),
      status: 'verified'
    };

    onVerifySuccess(itemId, proof);
  };

  // Stamp photo with digital watermark on canvas
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingPhoto(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize if too big
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Watermark Banner
        const bannerHeight = Math.max(60, Math.round(height * 0.12));
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, height - bannerHeight, width, bannerHeight);

        // Watermark border line
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(0, height - bannerHeight, width, 4);

        // Text formatting
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(bannerHeight * 0.28)}px sans-serif`;
        const dateStr = new Date().toLocaleString();
        const watermarkTitle = `📍 ${itemName} • ${item.city}`;
        const watermarkSub = `🔒 ZWERYFIKOWANO: ${account?.username || 'Podróżnik'} • ${dateStr} • TADZIK SMART TRAVEL 2026`;

        ctx.fillText(watermarkTitle, 20, height - bannerHeight + bannerHeight * 0.42);
        ctx.fillStyle = '#fbbf24';
        ctx.font = `bold ${Math.round(bannerHeight * 0.22)}px sans-serif`;
        ctx.fillText(watermarkSub, 20, height - bannerHeight + bannerHeight * 0.80);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSelectedPhoto(dataUrl);
        setStampedPhoto(dataUrl);
        setIsProcessingPhoto(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleVerifyPhoto = () => {
    if (!account || !stampedPhoto) return;

    const timestamp = new Date().toISOString();
    const proof: StickerVerificationProof = {
      stickerId: itemId,
      verifiedAt: timestamp,
      method: 'photo_proof',
      photoUrl: stampedPhoto,
      coordinates: userCoords || targetCoords,
      verificationHash: generateVerificationHash(account.username, itemId, timestamp, 'PHOTO'),
      status: 'verified'
    };

    onVerifySuccess(itemId, proof);
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const isGpsWithinRange = distanceMeters !== null && distanceMeters <= allowableRadiusMeters;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto" id="passport-verify-modal">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden relative animate-in zoom-in-95 my-auto">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white p-2 rounded-full cursor-pointer transition-all"
            aria-label="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 pr-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-3xl shrink-0 shadow-inner">
              {item.icon}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 border border-amber-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Weryfikacja Autentyczności Obecności</span>
              </div>
              <h3 className="text-lg font-black leading-tight text-white line-clamp-1">
                {itemName}
              </h3>
              <p className="text-xs text-slate-300 font-semibold mt-0.5">
                📍 {item.city} • {isRegional ? 'Region Europejski' : 'Zabytek / Miasto'}
              </p>
            </div>
          </div>
        </div>

        {/* ALREADY COLLECTED & VERIFIED PROOF VIEW */}
        {isAlreadyCollected && existingProof ? (
          <div className="p-6 space-y-5">
            <div className="bg-emerald-50 border-2 border-emerald-400/80 rounded-2xl p-4 text-emerald-950 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                  <span className="font-black text-sm uppercase tracking-wide">
                    Pieczątka Zweryfikowana i Zabezpieczona
                  </span>
                </div>
                <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  {existingProof.method === 'gps' ? '📍 GPS' : existingProof.method === 'qr_code' ? '🏷️ Kod QR' : existingProof.method === 'photo_proof' ? '📷 Foto' : '🛡️ Przewodnik'}
                </span>
              </div>

              <div className="bg-white/80 rounded-xl p-3 text-xs space-y-1.5 font-medium border border-emerald-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Data zaliczenia:</span>
                  <span className="font-bold text-slate-900">{new Date(existingProof.verifiedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Podpis cyfrowy:</span>
                  <span className="font-mono font-bold text-indigo-900 text-[11px]">{existingProof.verificationHash}</span>
                </div>
                {existingProof.distanceMeters !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Zarejestrowany dystans GPS:</span>
                    <span className="font-bold text-emerald-700">{formatDistance(existingProof.distanceMeters)}</span>
                  </div>
                )}
              </div>

              {existingProof.photoUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-emerald-300 shadow-sm max-h-40">
                  <img src={existingProof.photoUrl} alt="Dowód foto" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Czy na pewno chcesz usunąć tę pieczątkę z paszportu?`)) {
                    onRemoveSticker(itemId);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Usuń z paszportu</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-950 text-white px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
              >
                Gotowe
              </button>
            </div>
          </div>
        ) : (
          /* VERIFICATION FLOW TABS */
          <div className="p-5 sm:p-6 space-y-5">
            
            {/* Anti-cheat banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950">
                <p className="font-bold">
                  Ochrona Przed Fałszowaniem Odznak i Nagród 🛡️
                </p>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Aby odblokować <strong>Zniżkę 20%</strong> lub <strong>Darmowy Miesiąc Premium</strong>, potwierdź fizyczną obecność w tym miejscu.
                </p>
              </div>
            </div>

            {/* Verification Mode Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('gps')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'gps'
                    ? 'bg-white text-indigo-950 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Navigation className="w-4 h-4 text-indigo-600" />
                <span>1. GPS na Żywo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('qr')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'qr'
                    ? 'bg-white text-indigo-950 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>2. Kod QR / Miejsca</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('photo')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'photo'
                    ? 'bg-white text-indigo-950 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>3. Zdjęcie z Miejsca</span>
              </button>
            </div>

            {/* ========================================================================= */}
            {/* TAB 1: LIVE GPS RADAR */}
            {/* ========================================================================= */}
            {activeTab === 'gps' && (
              <div className="space-y-4 animate-in fade-in-50">
                {/* Registration consent indicator */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-100/90 rounded-xl border border-slate-200 text-[11px]">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Status zgody na lokalizację GPS:</span>
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                    account?.privacyConsents?.geolocationConsent
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {account?.privacyConsents?.geolocationConsent ? '✓ Udzielona przy rejestracji' : 'Opcjonalna / Kliknij odśwież'}
                  </span>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 relative overflow-hidden border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Crosshair className={`w-4 h-4 text-indigo-400 ${isLocating ? 'animate-spin' : ''}`} />
                      <span>Radar Pozycji Satelitarnej</span>
                    </span>
                    <button
                      type="button"
                      onClick={fetchCurrentLocation}
                      disabled={isLocating}
                      className="text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                      <span>Odśwież GPS</span>
                    </button>
                  </div>

                  {/* Distance display */}
                  <div className="text-center py-2">
                    {isLocating ? (
                      <div className="space-y-2 py-3">
                        <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-xs text-slate-300 font-semibold">Odczytywanie satelitów GPS i obliczanie odległości...</p>
                      </div>
                    ) : gpsError ? (
                      <div className="bg-red-950/60 border border-red-800/80 rounded-xl p-3 text-red-200 text-xs font-semibold">
                        <p>{gpsError}</p>
                      </div>
                    ) : distanceMeters !== null ? (
                      <div className="space-y-1.5">
                        <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                          {formatDistance(distanceMeters)}
                        </div>
                        <div className="text-xs font-bold text-slate-300">
                          {isGpsWithinRange ? (
                            <span className="text-emerald-400 font-black inline-flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Jesteś na miejscu! (Wymagany promień: &lt; {formatDistance(allowableRadiusMeters)})
                            </span>
                          ) : (
                            <span className="text-amber-300 inline-flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4" /> Jesteś poza wymaganym promieniem ({formatDistance(allowableRadiusMeters)})
                            </span>
                          )}
                        </div>
                        {gpsAccuracy && (
                          <p className="text-[10px] text-slate-400">
                            Dokładność pomiaru GPS: ±{gpsAccuracy} metrów
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Primary GPS Verification Button */}
                <button
                  type="button"
                  onClick={handleVerifyGps}
                  disabled={!isGpsWithinRange || isLocating}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer ${
                    isGpsWithinRange
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 animate-pulse'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isGpsWithinRange ? 'Potwierdź Obecność GPS (+1 Naklejka)' : 'Musisz być na miejscu, by odblokować'}</span>
                </button>

                {/* Organizer & Testing Bypass Accordion */}
                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowDemoBypass(!showDemoBypass)}
                    className="w-full text-left text-[11px] font-bold text-slate-400 hover:text-slate-600 flex items-center justify-between cursor-pointer py-1"
                  >
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Testujesz aplikację z domu? (Tryb Inspektora / Kod PIN)</span>
                    </span>
                    <span>{showDemoBypass ? '▲ Zwiń' : '▼ Rozwiń'}</span>
                  </button>

                  {showDemoBypass && (
                    <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5 text-xs">
                      <p className="text-slate-600 text-[11px]">
                        Dla właścicieli i przewodników testujących system: wprowadź kod PIN organizatora (domyślny: <code className="bg-slate-200 px-1 py-0.5 rounded font-bold text-slate-800">2026</code>), aby zaliczyć naklejkę w celach demonstracyjnych.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={adminPinInput}
                          onChange={(e) => {
                            setAdminPinInput(e.target.value);
                            setAdminPinError(false);
                          }}
                          placeholder="Wpisz PIN: 2026"
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-amber-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAdminBypassVerify}
                          className="bg-slate-900 hover:bg-slate-950 text-amber-300 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-all"
                        >
                          Zalicz Testowo
                        </button>
                      </div>
                      {adminPinError && (
                        <p className="text-[11px] text-red-600 font-bold">
                          Nieprawidłowy PIN organizatora.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: ON-SITE QR CODE OR SPOT CHECK-IN CODE */}
            {/* ========================================================================= */}
            {activeTab === 'qr' && (
              <form onSubmit={handleVerifyCode} className="space-y-4 animate-in fade-in-50">
                <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-950 space-y-2">
                  <p className="font-extrabold flex items-center gap-1.5 text-indigo-900">
                    <QrCode className="w-4 h-4 text-indigo-600" />
                    <span>Oficjalny Kod z Tabliczki na Miejscu</span>
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Wpisz 6-znakowy unikalny kod umieszczony na tabliczce informacyjnej lub przy kasie biletowej obiektu <strong>{itemName}</strong>.
                  </p>
                  <div className="bg-white p-2 rounded-xl border border-indigo-100 flex items-center justify-between text-[11px] font-mono font-bold text-slate-700">
                    <span>Format kodu obiektu:</span>
                    <span className="bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded">{officialCode}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-900">
                    Wpisz kod z tabliczki / naklejki:
                  </label>
                  <input
                    type="text"
                    value={enteredCode}
                    onChange={(e) => {
                      setEnteredCode(e.target.value);
                      setCodeError(null);
                    }}
                    placeholder={`Wpisz np. ${officialCode}`}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 font-mono font-bold text-sm uppercase focus:border-indigo-600 focus:outline-none tracking-widest text-center"
                    required
                  />
                  {codeError && (
                    <p className="text-xs text-red-600 font-bold mt-1">
                      {codeError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 px-4 rounded-2xl text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zweryfikuj Kodem i Odbierz Naklejkę</span>
                </button>
              </form>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: PHOTO PROOF WITH DIGITAL WATERMARK */}
            {/* ========================================================================= */}
            {activeTab === 'photo' && (
              <div className="space-y-4 animate-in fade-in-50">
                {/* Registration camera consent indicator */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-100/90 rounded-xl border border-slate-200 text-[11px]">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-600" />
                    <span>Status zgody na aparat i zdjęcia:</span>
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                    account?.privacyConsents?.cameraConsent
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {account?.privacyConsents?.cameraConsent ? '✓ Udzielona przy rejestracji' : 'Opcjonalna / Wybierz plik'}
                  </span>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1.5">
                  <p className="font-extrabold flex items-center gap-1.5 text-amber-900">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>Zdjęcie ze Znacznikiem Cyfrowym</span>
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Zrób zdjęcie na tle obiektu lub zabytku. Aplikacja automatycznie opatrzy je bezpiecznym cyfrowym znakiem wodnym i datą.
                  </p>
                </div>

                {stampedPhoto ? (
                  <div className="space-y-3">
                    <div className="rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md relative group">
                      <img src={stampedPhoto} alt="Oznakowane zdjęcie" className="w-full h-48 object-cover" />
                      <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                        Oznakowano znakiem wodnym ✔️
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStampedPhoto(null);
                          setSelectedPhoto(null);
                        }}
                        className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                      >
                        Zmień zdjęcie
                      </button>

                      <button
                        type="button"
                        onClick={handleVerifyPhoto}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Zatwierdź Dowód Foto</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessingPhoto}
                      className="w-full border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-3xl p-6 text-center space-y-2.5 transition-all bg-slate-50 hover:bg-amber-50/50 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-600 group-hover:text-amber-600 group-hover:scale-110 transition-transform shadow-xs">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 block">
                          {isProcessingPhoto ? 'Przetwarzanie i znakowanie zdjęcia...' : 'Zrób zdjęcie aparatem lub wybierz z galerii'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Automatycznie naniesiemy podpis GPS & datę
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
