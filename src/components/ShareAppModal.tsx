/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  ExternalLink, 
  X, 
  Users, 
  HeartHandshake
} from 'lucide-react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export default function ShareAppModal({
  isOpen,
  onClose,
  language
}: ShareAppModalProps) {
  const [copiedPlay, setCopiedPlay] = useState(false);
  const [copiedAppStore, setCopiedAppStore] = useState(false);

  const pl = language === 'pl';
  const nl = language === 'nl';

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tadzik-travel.app';
  const playStoreUrl = 'https://play.google.com/store/search?q=Tadzik%20Senior%20Travel&c=apps';
  const appStoreUrl = 'https://apps.apple.com/app/id6470000000';

  const shareTitle = pl 
    ? 'Tadzik – Przyjazny Przewodnik i Transport po Europie' 
    : nl 
    ? 'Tadzik – Slimme Reishulp voor Europa' 
    : 'Tadzik – Accessible Travel & Transit Companion for Europe';

  const shareText = pl
    ? `Cześć! Przesyłam Ci aplikację Tadzik – świetny, prosty w obsłudze przewodnik i planer podróży po Europie (Holandia, Polska, Belgia, Niemcy, Francja). Sprawdź i korzystaj: ${appUrl} lub znajdź w Google Play / App Store!`
    : nl
    ? `Hoi! Ik deel de Tadzik app met je – een handige, toegankelijke reisgids en planner voor Europa (NL, PL, BE, DE, FR). Bekijk het hier: ${appUrl} of in de Google Play / App Store!`
    : `Hi! Check out Tadzik – a friendly, senior-accessible European transit and travel companion (NL, PL, BE, DE, FR): ${appUrl} or find on Google Play / App Store!`;

  if (!isOpen) return null;

  const handleCopyLink = (type: 'play' | 'appstore') => {
    let textToCopy = playStoreUrl;
    if (type === 'appstore') textToCopy = appStoreUrl;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      if (type === 'play') {
        setCopiedPlay(true);
        setTimeout(() => setCopiedPlay(false), 2500);
      } else if (type === 'appstore') {
        setCopiedAppStore(true);
        setTimeout(() => setCopiedAppStore(false), 2500);
      }
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: appUrl,
        });
      } catch (err) {
        console.log('Share dismissed or failed', err);
      }
    } else {
      handleWhatsAppShare();
    }
  };

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn"
      id="share-app-modal-backdrop"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl border-2 border-indigo-200 shadow-2xl w-full max-w-2xl overflow-hidden my-auto relative space-y-5 p-5 sm:p-6 md:p-8"
        id="share-app-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-950 flex items-center justify-center text-white text-2xl shadow-lg border border-indigo-400/40 shrink-0">
              <Users className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-300">
                  {pl ? 'POLEĆ BLISKIM' : nl ? 'DEEL MET VRIENDEN' : 'SHARE WITH LOVED ONES'}
                </span>
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-300">
                  {pl ? 'BEZPŁATNIE' : '100% FREE'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-0.5">
                {pl ? 'Podziel się ze znajomymi i rodziną' : nl ? 'Deel met vrienden en familie' : 'Share Tadzik with Family & Friends'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full cursor-pointer transition-colors"
            id="btn-close-share-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Friendly message intro */}
          <div className="bg-gradient-to-r from-amber-50 via-indigo-50 to-emerald-50 border-2 border-indigo-100 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 space-y-1.5 shadow-xs">
            <p className="font-extrabold text-slate-950 flex items-center gap-1.5 text-sm sm:text-base">
              <HeartHandshake className="w-5 h-5 text-indigo-700 shrink-0" />
              <span>
                {pl ? 'Podaruj bliskim wygodne i bezpieczne podróżowanie!' : nl ? 'Help uw dierbaren zorgeloos reizen!' : 'Give loved ones a stress-free travel guide!'}
              </span>
            </p>
            <p className="text-slate-600 leading-relaxed text-xs">
              {pl
                ? 'Wyślij polecenie Tadzika rodzicom, dziadkom, dzieciom lub znajomym. Aplikacja ułatwia poruszanie się po Holandii, Polsce, Belgii, Niemczech i Francji z asystą seniora i dużymi przyciskami.'
                : nl
                ? 'Deel met familie of vrienden. Ideaal voor reizen tussen Nederland, Polen, België, Duitsland en Frankrijk.'
                : 'Send Tadzik to family or friends for easy public transit across the Netherlands, Poland, Belgium, Germany, and France.'}
            </p>
          </div>

          {/* Official App Stores Section (Google Play & Apple App Store) */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛍️</span>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">
                  {pl ? 'Przekierowanie do oficjalnych sklepów (App Store & Google Play):' : nl ? 'Officiële App Stores:' : 'Official App Stores:'}
                </h4>
              </div>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                iOS & Android
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Google Play Box with Visit and Copy */}
              <div className="bg-slate-800/95 border border-slate-700 rounded-xl p-3 space-y-2 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center text-xl shrink-0 border border-slate-700">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a1.99 1.99 0 0 1-.61-.955V2.769c.144-.37.368-.707.61-.955zm11.24 11.242l2.302 2.302-12.723 7.34 10.421-9.642zm2.302-2.302L14.85 8.452 4.43.812l12.722 7.341.001.001.001.001-.005.001zm1.06 1.06l3.35 1.933c.84.485.84 1.28 0 1.765l-3.35 1.934-2.115-2.116 2.115-2.116z" fill="#34A853"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Dla telefonów Android</p>
                    <h5 className="text-sm font-black text-white">Google Play Store</h5>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <a
                    href={playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-2 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer text-center"
                    id="btn-open-google-play"
                  >
                    <span>Otwórz sklep</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('play')}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-[11px] py-2 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    id="btn-copy-google-play"
                  >
                    {copiedPlay ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPlay ? 'Skopiowano!' : 'Kopiuj link'}</span>
                  </button>
                </div>
              </div>

              {/* Apple App Store Box with Visit and Copy */}
              <div className="bg-slate-800/95 border border-slate-700 rounded-xl p-3 space-y-2 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center text-xl shrink-0 border border-slate-700">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-1.97.6-2.6 1.34-.56.64-1.04 1.7-0.91 2.73 1 .08 1.98-.45 2.59-1.2z" fill="#FFFFFF"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Dla iPhone / iPad</p>
                    <h5 className="text-sm font-black text-white">Apple App Store</h5>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <a
                    href={appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] py-2 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer text-center"
                    id="btn-open-apple-appstore"
                  >
                    <span>Otwórz sklep</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('appstore')}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-[11px] py-2 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    id="btn-copy-apple-appstore"
                  >
                    {copiedAppStore ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAppStore ? 'Skopiowano!' : 'Kopiuj link'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Instant Direct Share Channels */}
          <div className="space-y-3">
            <h4 className="font-black text-xs sm:text-sm text-slate-900 flex items-center gap-2">
              <span>⚡</span>
              <span>{pl ? 'Wyślij jednym kliknięciem przez komunikator:' : nl ? 'Deel direct via messenger:' : 'Share instantly via messenger:'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 hover:border-emerald-500 text-emerald-950 p-4 rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs hover:scale-102"
                id="btn-share-whatsapp"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
                  💬
                </div>
                <div className="text-left">
                  <span className="text-sm font-black block">WhatsApp</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">{pl ? 'Wyślij na czat lub do grupy' : 'Send to chat or group'}</span>
                </div>
              </button>

              {/* Native Phone Share / Inne komunikatory */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 hover:border-purple-500 text-purple-950 p-4 rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs hover:scale-102"
                id="btn-share-native"
              >
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-black block">{pl ? 'Inne komunikatory & Opcje' : 'Other messengers & Options'}</span>
                  <span className="text-[11px] text-purple-700 font-semibold">{pl ? 'Messenger, Telegram, AirDrop...' : 'Messenger, Telegram, AirDrop...'}</span>
                </div>
              </button>
            </div>
          </div>

          {/* QR Code Section for instant camera scanning */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3" id="share-qr-section">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-indigo-700" />
              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                {pl ? 'Kod QR do natychmiastowego zeskanowania:' : nl ? 'QR-code om te scannen:' : 'QR Code to scan:'}
              </h4>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="bg-white p-2 border-2 border-slate-900 rounded-xl shadow-md shrink-0">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(appUrl)}`}
                  alt="Tadzik QR Code" 
                  className="w-32 h-32"
                />
              </div>
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-300">
                  📷 {pl ? 'Aparat w telefonie' : 'Phone camera'}
                </div>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {pl ? 'Zeskanuj aparatem w smartfonie' : 'Scan with your smartphone camera'}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pl
                    ? 'Osoba obok Ciebie może po prostu skierować aparat telefonu na ten kod QR, by od razu otworzyć aplikację na swoim telefonie.'
                    : 'Anyone nearby can simply point their phone camera at this QR code to open the app on their phone instantly.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <span>🛡️</span>
            <span>{pl ? 'Bezpłatnie i bezpiecznie dla całej rodziny' : 'Free & safe for all generations'}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm"
          >
            {pl ? 'Zamknij' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}
