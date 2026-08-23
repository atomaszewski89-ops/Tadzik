/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { UserAccount, Language, StickerVerificationProof, ClaimedRewardVoucher } from '../types';
import { SectionTravelCompanion } from './AnimatedTravelVehicle';
import { 
  Check, 
  Sparkles, 
  Trophy, 
  Gift, 
  Crown, 
  Printer, 
  X, 
  Compass,
  MapPin,
  Flag,
  Globe2,
  CheckCircle2,
  Filter,
  ShieldCheck,
  QrCode,
  Lock,
  Percent,
  Search,
  Camera,
  Share2,
  FileCheck2,
  Plus
} from 'lucide-react';
import { 
  PassportCountryCode, 
  PASSPORT_COUNTRIES, 
  ALL_PASSPORT_STICKERS, 
  ALL_REGIONAL_STAMPS,
  AttractionSticker,
  RegionalStamp,
  getCommunityStickersFromStorage
} from '../data/passportData';
import PassportVerifyModal from './PassportVerifyModal';
import PassportAdminInspectorModal from './PassportAdminInspectorModal';
import AddPlaceModal, { AttractionPhoto } from './AddPlaceModal';
import { Attraction } from '../types';

interface PassportTabProps {
  language: Language;
  account: UserAccount | null;
  onUpdateAccount: (acc: UserAccount) => void;
  onNavigateTab?: (tab: any) => void;
}

const passportDict = {
  pl: {
    challengeTag: 'Wielkie Wyzwanie 30 Naklejek Tadzika',
    title: 'Twój Paszport i Album Naklejek z Podróży 🗺️',
    description: 'Zbieraj naklejki ze zwiedzonych miast, regionów i kultowych zabytków w Europie. Za zebranie 30 naklejek otrzymasz wyjątkowy PREZENT OD APLIKACJI: DARMOWY DODATKOWY MIESIĄC SUBKRYPCJI PREMIUM oraz Imienny Certyfikat Honorowego Podróżnika!',
    progressTitle: 'Globalny Postęp Kolekcji (Wszystkie Kraje):',
    stickersUnit: 'Naklejek',
    bronzeMilestone: '🥉 5 Naklejek',
    bronzeSub: 'Brązowa Odznaka',
    silverMilestone: '🥈 15 Naklejek',
    silverSub: 'Srebrny Puchar',
    goldMilestone: '🥇 30 Naklejek',
    goldSub: '🎁 DARMOWY MIESIĄC PREMIUM',
    loginPrompt: '⚠️ Zaloguj się w zakładce "Konto", aby zachować swoje zbierane naklejki na stałe we wszystkich urządzeniach!',
    loginAlert: '⚠️ Zaloguj się w zakładce "Konto", aby zbierać naklejki i odblokować darmowy miesiąc Premium!',
    rewardsHeading: 'Nagrody i Prezent od Aplikacji 🎁',
    rewardsSubheading: 'Oto co otrzymujesz po osiągnięciu poszczególnych progów kolekcji:',
    unlocked: 'ODBLOKOWANE ✔️',
    tier1Goal: 'PROG: 5 NAKLEJEK',
    tier1Title: 'Brązowy Dyplom Podróżnika',
    tier1Desc: 'Oficjalna odznaka w profilu oraz ekskluzywny poradnik PDF "Ukryte Perły Europy dla Seniorów".',
    tier1Claim: 'Odbierz Nagrodę!',
    tier1Need: 'Potrzebujesz 5 naklejek',
    tier2Goal: 'PROG: 15 NAKLEJEK',
    tier2Title: 'Srebrna Gwiazda & Zniżka 20%',
    tier2Desc: 'Srebrna ranga asystenta Tadzika, dedykowane trasy rowerowe premium oraz kod zniżkowy.',
    tier2Claim: 'Odbierz Nagrodę!',
    tier2Need: 'Potrzebujesz 15 naklejek',
    tier3Goal: 'GŁÓWNA NAGRODA VIP!',
    tier3Threshold: 'PROG: 30 NAKLEJEK',
    tier3Title: 'DARMOWY MIESIĄC PREMIUM',
    tier3Desc: 'Główna nagroda od twórców aplikacji! Dodatkowy pełny miesiąc członkostwa bez żadnych opłat + Certyfikat Honorowego Podróżnika!',
    tier3Claim: 'ODBIERZ DARMOWY MIESIĄC PREMIUM!',
    tier3CollectMore: (cur: number) => `Zbierz 30 naklejek (Masz ${cur})`,
    needMoreAlert: (rem: number) => `Brakuje Ci jeszcze ${rem} naklejek do odblokowania darmowego miesiąca Premium! Klikaj "Zaliczone" przy zwiedzanych miejscach.`,
    countrySelectHeader: 'Wybierz kraj, w którym teraz zbierasz naklejki:',
    countryActiveCollecting: 'Kolekcja i pieczątki z kraju:',
    countryProgressLabel: 'Postęp w tym kraju:',
    allCountriesBadge: 'Wszystkie kraje',
    regionsTitle: '1. Pieczątki Prowincji i Regionów',
    attractionsTitle: '2. Naklejki Kultowych Atrakcji i Miast',
    stampEarned: 'Zdobyta',
    stampInPassport: '✔️ Pieczątka w paszporcie (Odkliknij)',
    stampVisited: '📍 Odwiedziłem ten region! (+1 Naklejka)',
    collected: 'Zebrane ✔️',
    addSticker: '+ Dodaj',
    certTitle: 'Certyfikat Honorowego Podróżnika',
    certSubtitle: 'Oficjalne Wyróżnienie Smart Travel Europe 2026',
    certCertifies: 'Niniejszym zaświadcza się z dumą, że:',
    certDefaultName: 'Szanowny Podróżnik',
    certText: 'pomyślnie zdobył(a) kompletną kolekcję 30 Cyfrowych Naklejek i Pieczątek ze zwiedzonych miast, regionów i wyjątkowych atrakcji w Holandii, Belgii, Francji, Niemczech i Polsce.',
    certPrizeBadge: 'NAGRODA OD APLIKACJI: DARMOWY MIESIĄC SUBSKRYPCJI PREMIUM ✔️',
    certSignatureLabel: 'Podpis Opiekuna:',
    certSignature: 'Tadzik Asystent Podróży 🚴‍♂️',
    certPrint: 'Drukuj / Pobierz PDF',
    congratsTitle: 'GRATULACJE! MAMY DLA CIEBIE NAGRODĘ!',
    congratsSubTier3: 'Zebrałeś pełne 30 naklejek! Aplikacja przyznaje Ci DARMOWY DODATKOWY MIESIĄC MEMBERSHIP PREMIUM oraz Osobisty Certyfikat!',
    congratsSubTier2: 'Osiągnąłeś poziom 15 naklejek! Srebrny Puchar i 20% zniżki na kolejne rezerwacje są Twoje!',
    congratsSubTier1: 'Zebrałeś 5 naklejek! Odblokowano Brązowy Dyplom Podróżnika!',
    openCertBtn: 'Otwórz Mój Certyfikat i Odbierz Miesiąc Premium',
    continueJourney: 'Wspaniale, kontynuuj podróż!',
    filterOnlyUncollected: 'Pokaż tylko niezdobyte'
  },
  nl: {
    challengeTag: 'Grote Tadzik 30-Stempels Uitdaging',
    title: 'Uw Reispaspoort & Stempelalbum 🗺️',
    description: 'Verzamel stempels van bezochte steden, regio\'s en monumenten in Europa. Verzamel 30 stempels en ontvang een GRATIS EXTRA MAAND PREMIUM LIDMAATSCHAP van de app en een Persoonlijk Erecertificaat!',
    progressTitle: 'Totale Collectievoortgang (Alle Landen):',
    stickersUnit: 'Stempels',
    bronzeMilestone: '🥉 5 Stempels',
    bronzeSub: 'Bronzen Badge',
    silverMilestone: '🥈 15 Stempels',
    silverSub: 'Zilveren Beker',
    goldMilestone: '🥇 30 Stempels',
    goldSub: '🎁 GRATIS MAAND PREMIUM',
    loginPrompt: '⚠️ Meld u aan onder "Account" om uw verzamelde stempels blijvend op te slaan op al uw apparaten!',
    loginAlert: '⚠️ Meld u aan om uw stempels permanent te bewaren en een gratis maand Premium te ontgrendelen!',
    rewardsHeading: 'Beloningen en App-Prijzen 🎁',
    rewardsSubheading: 'Dit is wat u ontgrendelt bij elke mijlpaal van uw reis:',
    unlocked: 'ONTGRENDELD ✔️',
    tier1Goal: 'DOEL: 5 STEMPELS',
    tier1Title: 'Brons Reizigersdiploma',
    tier1Desc: 'Officiële badge in uw profiel en de exclusieve PDF-gids "Verborgen Parels van Europa voor Senioren".',
    tier1Claim: 'Beloning Ophalen!',
    tier1Need: '5 stempels nodig',
    tier2Goal: 'DOEL: 15 STEMPELS',
    tier2Title: 'Zilveren Ster & 20% Korting',
    tier2Desc: 'Zilveren assistent-rang, exclusieve fietsroutes en 20% kortingsvoucher.',
    tier2Claim: 'Beloning Ophalen!',
    tier2Need: '15 stempels nodig',
    tier3Goal: 'HOOFDPRIJS VIP!',
    tier3Threshold: 'DOEL: 30 STEMPELS',
    tier3Title: 'GRATIS 1 MAAND PREMIUM',
    tier3Desc: 'Hoofdprijs van de app! Een volledige extra maand lidmaatschap gratis + Erecertificaat van Reiziger!',
    tier3Claim: 'ONTVANG GRATIS MAAND PREMIUM!',
    tier3CollectMore: (cur: number) => `Verzamel 30 stempels (U heeft er ${cur})`,
    needMoreAlert: (rem: number) => `U heeft nog ${rem} stempels nodig voor een gratis maand Premium! Klik op "Bezocht" bij uw bezochte plekken.`,
    countrySelectHeader: 'Kies het land waarvan u nu stempels wilt verzamelen:',
    countryActiveCollecting: 'Collectie en stempels voor het land:',
    countryProgressLabel: 'Voortgang in dit land:',
    allCountriesBadge: 'Alle landen',
    regionsTitle: '1. Provincie- & Regiostempels',
    attractionsTitle: '2. Bezienswaardigheden & Steden',
    stampEarned: 'Behaald',
    stampInPassport: '✔️ In paspoort (Ongedaan maken)',
    stampVisited: '📍 Ik heb deze regio bezocht! (+1 Stempel)',
    collected: 'Verzameld ✔️',
    addSticker: '+ Toevoegen',
    certTitle: 'Erecertificaat van de Reiziger',
    certSubtitle: 'Officiële Erkenning Smart Travel Europe 2026',
    certCertifies: 'Hierbij wordt met trots verklaard dat:',
    certDefaultName: 'Geachte Reiziger',
    certText: 'met succes een complete collectie van 30 Digitale Stempels heeft verzameld van bezochte steden, regio\'s en monumenten in Nederland, België, Frankrijk, Duitsland en Polen.',
    certPrizeBadge: 'APP BELONING: 1 MAAND GRATIS PREMIUM SUBSCRIPTIE ✔️',
    certSignatureLabel: 'Handtekening Begeleider:',
    certSignature: 'Tadzik Reisassistent 🚴‍♂️',
    certPrint: 'Printen / Download PDF',
    congratsTitle: 'GEFELICITEERD! U HEEFT EEN PRIJS!',
    congratsSubTier3: 'U heeft alle 30 stempels verzameld! De app beloont u met een GRATIS EXTRA MAAND PREMIUM LIDMAATSCHAP en uw Persoonlijk Certificaat!',
    congratsSubTier2: 'U heeft 15 stempels bereikt! De Zilveren Beker en 20% korting zijn van u!',
    congratsSubTier1: 'U heeft 5 stempels verzameld! Brons Reizigersdiploma ontgrendeld!',
    openCertBtn: 'Open Mijn Certificaat en Ontvang Premium Maand',
    continueJourney: 'Geweldig, reis verder!',
    filterOnlyUncollected: 'Alleen niet verzamelde tonen'
  },
  en: {
    challengeTag: 'Grand Tadzik 30-Sticker Challenge',
    title: 'Your Travel Passport & Sticker Album 🗺️',
    description: 'Collect stickers from visited cities, regions, and landmarks across Europe. Collect 30 stickers and receive an exclusive APP GIFT: A FREE EXTRA MONTH OF PREMIUM MEMBERSHIP and an Honorary Traveler Certificate!',
    progressTitle: 'Global Collection Progress (All Countries):',
    stickersUnit: 'Stickers',
    bronzeMilestone: '🥉 5 Stickers',
    bronzeSub: 'Bronze Badge',
    silverMilestone: '🥈 15 Stickers',
    silverSub: 'Silver Trophy',
    goldMilestone: '🥇 30 Stickers',
    goldSub: '🎁 FREE MONTH OF PREMIUM',
    loginPrompt: '⚠️ Sign in under the "Account" tab to save your collected stamps permanently on all devices!',
    loginAlert: '⚠️ Please log in to save your stickers and unlock a free month of Premium!',
    rewardsHeading: 'Rewards & App Gifts 🎁',
    rewardsSubheading: 'Here is what you unlock at each milestone of your journey:',
    unlocked: 'UNLOCKED ✔️',
    tier1Goal: 'GOAL: 5 STICKERS',
    tier1Title: 'Bronze Traveler Diploma',
    tier1Desc: 'Official profile badge and exclusive PDF guide "Hidden Gems of Europe for Seniors".',
    tier1Claim: 'Claim Reward!',
    tier1Need: 'Requires 5 stickers',
    tier2Goal: 'GOAL: 15 STICKERS',
    tier2Title: 'Silver Star & 20% Discount',
    tier2Desc: 'Silver assistant rank, dedicated premium bike routes, and a 20% booking promo code.',
    tier2Claim: 'Claim Reward!',
    tier2Need: 'Requires 15 stickers',
    tier3Goal: 'VIP GRAND PRIZE!',
    tier3Threshold: 'GOAL: 30 STICKERS',
    tier3Title: 'FREE 1 MONTH PREMIUM PASS',
    tier3Desc: 'Grand prize from the app creators! An extra full month of membership completely free + Honorary Traveler Certificate!',
    tier3Claim: 'CLAIM FREE MONTH OF PREMIUM!',
    tier3CollectMore: (cur: number) => `Collect 30 stickers (You have ${cur})`,
    needMoreAlert: (rem: number) => `You need ${rem} more stickers to unlock free Premium! Mark places as visited.`,
    countrySelectHeader: 'Select which country you are collecting stickers from now:',
    countryActiveCollecting: 'Collection & stamps for country:',
    countryProgressLabel: 'Progress in this country:',
    allCountriesBadge: 'All countries',
    regionsTitle: '1. Province & Regional Stamps',
    attractionsTitle: '2. Landmark & City Stickers',
    stampEarned: 'Earned',
    stampInPassport: '✔️ In passport (Tap to undo)',
    stampVisited: '📍 I visited this region! (+1 Sticker)',
    collected: 'Collected ✔️',
    addSticker: '+ Add',
    certTitle: 'Honorary Traveler Certificate',
    certSubtitle: 'Official Recognition Smart Travel Europe 2026',
    certCertifies: 'This proudly certifies that:',
    certDefaultName: 'Honored Traveler',
    certText: 'has successfully completed the collection of 30 Digital Stickers & Stamps from visited cities, regions, and attractions across the Netherlands, Belgium, France, Germany, and Poland.',
    certPrizeBadge: 'APP REWARD: FREE 1-MONTH PREMIUM PASS ✔️',
    certSignatureLabel: 'Guide Signature:',
    certSignature: 'Tadzik Travel Assistant 🚴‍♂️',
    certPrint: 'Print / Download PDF',
    congratsTitle: 'CONGRATULATIONS! YOU UNLOCKED A PRIZE!',
    congratsSubTier3: 'You collected all 30 stickers! The app awards you a FREE EXTRA MONTH OF PREMIUM MEMBERSHIP and your Personal Certificate!',
    congratsSubTier2: 'You reached 15 stickers! The Silver Trophy and 20% discount code are yours!',
    congratsSubTier1: 'You collected 5 stickers! Bronze Traveler Diploma unlocked!',
    openCertBtn: 'Open My Certificate and Claim Free Premium Month',
    continueJourney: 'Wonderful, continue journey!',
    filterOnlyUncollected: 'Show uncollected only'
  },
  de: {
    challengeTag: 'Große Tadzik 30-Sticker-Herausforderung',
    title: 'Ihr Reisepass & Sticker-Album 🗺️',
    description: 'Sammeln Sie Sticker von besuchten Städten, Regionen und Monumenten in Europa. Bei 30 Stickern erhalten Sie einen KOSTENLOSEN ZUSÄTZLICHEN MONAT PREMIUM-MITGLIEDSCHAFT und ein Ehren-Reisezertifikat!',
    progressTitle: 'Gesamtfortschritt der Sammlung (Alle Länder):',
    stickersUnit: 'Sticker',
    bronzeMilestone: '🥉 5 Sticker',
    bronzeSub: 'Bronze-Abzeichen',
    silverMilestone: '🥈 15 Sticker',
    silverSub: 'Silber-Pokal',
    goldMilestone: '🥇 30 Sticker',
    goldSub: '🎁 KOSTENLOSER MONAT PREMIUM',
    loginPrompt: '⚠️ Melden Sie sich im Tab "Konto" an, um Ihre Stempel dauerhaft auf allen Geräten zu speichern!',
    loginAlert: '⚠️ Bitte melden Sie sich an, um Sticker zu speichern und 1 Monat gratis Premium zu erhalten!',
    rewardsHeading: 'Belohnungen und App-Preise 🎁',
    rewardsSubheading: 'Das schalten Sie bei jedem Meilenstein frei:',
    unlocked: 'FREIGESCHALTET ✔️',
    tier1Goal: 'ZIEL: 5 STICKER',
    tier1Title: 'Bronze-Reisediplom',
    tier1Desc: 'Offizielles Profilabzeichen und PDF-Ratgeber "Verborgene Perlen Europas für Senioren".',
    tier1Claim: 'Belohnung abholen!',
    tier1Need: 'Benötigt 5 Sticker',
    tier2Goal: 'ZIEL: 15 STICKER',
    tier2Title: 'Silberner Stern & 20% Rabatt',
    tier2Desc: 'Silberner Assistenten-Rang, Premium-Radrouten und 20% Rabattcode.',
    tier2Claim: 'Belohnung abholen!',
    tier2Need: 'Benötigt 15 Sticker',
    tier3Goal: 'VIP-HAUPTPREIS!',
    tier3Threshold: 'ZIEL: 30 STICKER',
    tier3Title: '1 MONAT GRATIS PREMIUM',
    tier3Desc: 'Hauptpreis der App! Ein voller Zusatzmonat Mitgliedschaft gratis + Ehren-Zertifikat!',
    tier3Claim: 'GRATIS MONAT PREMIUM SICHERN!',
    tier3CollectMore: (cur: number) => `Sammeln Sie 30 Sticker (Sie haben ${cur})`,
    needMoreAlert: (rem: number) => `Ihnen fehlen noch ${rem} Sticker für gratis Premium!`,
    countrySelectHeader: 'Wählen Sie das Land, aus dem Sie jetzt Sticker sammeln möchten:',
    countryActiveCollecting: 'Sammlung und Stempel für das Land:',
    countryProgressLabel: 'Fortschritt in diesem Land:',
    allCountriesBadge: 'Alle Länder',
    regionsTitle: '1. Provinz- & Regionalstempel',
    attractionsTitle: '2. Sehenswürdigkeiten & Städte',
    stampEarned: 'Erhalten',
    stampInPassport: '✔️ Im Pass (Rückgängig)',
    stampVisited: '📍 Region besucht! (+1 Sticker)',
    collected: 'Gesammelt ✔️',
    addSticker: '+ Hinzufügen',
    certTitle: 'Ehren-Reisezertifikat',
    certSubtitle: 'Offizielle Auszeichnung Smart Travel Europe 2026',
    certCertifies: 'Hiermit wird stolz bescheinigt, dass:',
    certDefaultName: 'Geschätzter Reisender',
    certText: 'erfolgreich eine vollständige Sammlung von 30 digitalen Stickern & Stempeln besuchter Städte und Regionen in den Niederlanden, Belgien, Frankreich, Deutschland und Polen gesammelt hat.',
    certPrizeBadge: 'APP-PREIS: 1 MONAT PREMIUM-MITGLIEDSCHAFT GRATIS ✔️',
    certSignatureLabel: 'Unterschrift Reiseleiter:',
    certSignature: 'Tadzik Reiseassistent 🚴‍♂️',
    certPrint: 'Drucken / PDF herunterladen',
    congratsTitle: 'HERZLICHEN GLÜCKWUNSCH! PREIS FREIGESCHALTET!',
    congratsSubTier3: 'Sie haben alle 30 Sticker gesammelt! Die App schenkt Ihnen 1 MONAT GRATIS PREMIUM und Ihr persönliches Zertifikat!',
    congratsSubTier2: '15 Sticker erreicht! Silber-Pokal und 20% Rabatt gehören Ihnen!',
    congratsSubTier1: '5 Sticker gesammelt! Bronze-Reisediplom freigeschaltet!',
    openCertBtn: 'Zertifikat öffnen & Gratis Premium-Monat sichern',
    continueJourney: 'Wunderbar, Reise fortsetzen!',
    filterOnlyUncollected: 'Nur ungesammelte anzeigen'
  },
  es: {
    challengeTag: 'Gran Desafío de 30 Pegatinas de Tadzik',
    title: 'Tu Pasaporte de Viaje y Álbum de Pegatinas 🗺️',
    description: 'Colecciona pegatinas de ciudades, regiones y monumentos visitados en Europa. ¡Al conseguir 30 pegatinas recibirás 1 MES EXTRA GRATIS DE PREMIUM y tu Certificado Honorífico!',
    progressTitle: 'Progreso de la Colección (Todos los Países):',
    stickersUnit: 'Pegatinas',
    bronzeMilestone: '🥉 5 Pegatinas',
    bronzeSub: 'Insignia de Bronce',
    silverMilestone: '🥈 15 Pegatinas',
    silverSub: 'Trofeo de Plata',
    goldMilestone: '🥇 30 Pegatinas',
    goldSub: '🎁 1 MES GRATIS DE PREMIUM',
    loginPrompt: '⚠️ ¡Inicia sesión en la pestaña "Cuenta" para guardar tus sellos en todos tus dispositivos!',
    loginAlert: '⚠️ ¡Inicia sesión para guardar tus pegatinas y desbloquear 1 mes gratis de Premium!',
    rewardsHeading: 'Recompensas y Premios de la App 🎁',
    rewardsSubheading: 'Esto es lo que desbloqueas en cada etapa de tu viaje:',
    unlocked: 'DESBLOQUEADO ✔️',
    tier1Goal: 'OBJETIVO: 5 PEGATINAS',
    tier1Title: 'Diploma de Viajero de Bronce',
    tier1Desc: 'Insignia oficial en el perfil y guía PDF "Joyas Ocultas de Europa para Seniors".',
    tier1Claim: '¡Reclamar Premio!',
    tier1Need: 'Necesitas 5 pegatinas',
    tier2Goal: 'OBJETIVO: 15 PEGATINAS',
    tier2Title: 'Estrella de Plata y 20% de Descuento',
    tier2Desc: 'Rango de asistente de plata, rutas ciclistas exclusivas y código del 20% de descuento.',
    tier2Claim: '¡Reclamar Premio!',
    tier2Need: 'Necesitas 15 pegatinas',
    tier3Goal: '¡GRAN PREMIO VIP!',
    tier3Threshold: 'OBJETIVO: 30 PEGATINAS',
    tier3Title: '1 MES GRATIS DE PREMIUM',
    tier3Desc: '¡Gran premio de los creadores! Un mes completo extra de membresía sin costo + Certificado Honorífico.',
    tier3Claim: '¡OBTENER MES GRATIS PREMIUM!',
    tier3CollectMore: (cur: number) => `Consigue 30 pegatinas (Tienes ${cur})`,
    needMoreAlert: (rem: number) => `¡Te faltan ${rem} pegatinas para desbloquear el mes gratis de Premium!`,
    countrySelectHeader: 'Elige de qué país deseas coleccionar pegatinas ahora:',
    countryActiveCollecting: 'Colección y sellos del país:',
    countryProgressLabel: 'Progreso en este país:',
    allCountriesBadge: 'Todos los países',
    regionsTitle: '1. Sellos de Provincias y Regiones',
    attractionsTitle: '2. Pegatinas de Monumentos y Ciudades',
    stampEarned: 'Obtenido',
    stampInPassport: '✔️ En pasaporte (Desmarcar)',
    stampVisited: '📍 ¡He visitado esta región! (+1 Pegatina)',
    collected: 'Coleccionado ✔️',
    addSticker: '+ Añadir',
    certTitle: 'Certificado de Viajero Honorífico',
    certSubtitle: 'Reconocimiento Oficial Smart Travel Europe 2026',
    certCertifies: 'Se certifica con orgullo que:',
    certDefaultName: 'Estimado Viajero',
    certText: 'ha completado con éxito la colección de 30 Pegatinas Digitales y Sellos de ciudades, regiones y monumentos visitados en Países Bajos, Bélgica, Francia, Alemania y Polonia.',
    certPrizeBadge: 'PREMIO DE LA APP: 1 MES RENOVADO DE PREMIUM ✔️',
    certSignatureLabel: 'Firma del Guía:',
    certSignature: 'Tadzik Asistente de Viaje 🚴‍♂️',
    certPrint: 'Imprimir / Descargar PDF',
    congratsTitle: '¡FELICIDADES! ¡PREMIO DESBLOQUEADO!',
    congratsSubTier3: '¡Has conseguido las 30 pegatinas! La aplicación te otorga 1 MES EXTRA GRATIS DE PREMIUM y tu Certificado Personal.',
    congratsSubTier2: '¡Has alcanzado 15 pegatinas! ¡El Trofeo de Plata y el 20% de descuento son tuyos!',
    congratsSubTier1: '¡5 pegatinas conseguidas! ¡Diploma de Bronce desbloqueado!',
    openCertBtn: 'Abrir Mi Certificado y Reclamar Mes Premium',
    continueJourney: '¡Excelente, continuar viaje!',
    filterOnlyUncollected: 'Mostrar solo no coleccionadas'
  },
  fr: {
    challengeTag: 'Grand Défi 30 Stickers de Tadzik',
    title: 'Votre Passeport de Voyage & Album de Stickers 🗺️',
    description: 'Collectionnez des stickers des villes, régions et monuments visités en Europe. À 30 stickers, recevez 1 MOIS SUPPLÉMENTAIRE GRATUIT D\'ABONNEMENT PREMIUM et un Certificat d\'Honneur!',
    progressTitle: 'Progression Globale (Tous les Pays):',
    stickersUnit: 'Stickers',
    bronzeMilestone: '🥉 5 Stickers',
    bronzeSub: 'Badge Bronze',
    silverMilestone: '🥈 15 Stickers',
    silverSub: 'Coupe d\'Argent',
    goldMilestone: '🥇 30 Stickers',
    goldSub: '🎁 1 MOIS GRATUIT DE PREMIUM',
    loginPrompt: '⚠️ Connectez-vous dans l\'onglet "Compte" pour sauvegarder vos tampons sur tous vos appareils!',
    loginAlert: '⚠️ Connectez-vous pour enregistrer vos stickers et débloquer 1 mois gratuit de Premium!',
    rewardsHeading: 'Récompenses et Cadeaux de l\'App 🎁',
    rewardsSubheading: 'Voici ce que vous débloquez à chaque étape de votre voyage:',
    unlocked: 'DÉBLOQUÉ ✔️',
    tier1Goal: 'OBJECTIF: 5 STICKERS',
    tier1Title: 'Diplôme de Voyageur de Bronze',
    tier1Desc: 'Badge officiel et guide PDF "Perles Cachées d\'Europe pour les Seniors".',
    tier1Claim: 'Obtenir la Récompense!',
    tier1Need: '5 stickers requis',
    tier2Goal: 'OBJECTIF: 15 STICKERS',
    tier2Title: 'Étoile d\'Argent & 20% de Réduction',
    tier2Desc: 'Rang d\'assistant d\'argent, itinéraires cyclables premium et code promo de 20%.',
    tier2Claim: 'Obtenir la Récompense!',
    tier2Need: '15 stickers requis',
    tier3Goal: 'GRAND PRIX VIP!',
    tier3Threshold: 'OBJECTIF: 30 STICKERS',
    tier3Title: '1 MOIS GRATUIT DE PREMIUM',
    tier3Desc: 'Grand prix des créateurs! Un mois complet supplémentaire offert + Certificat d\'Honneur.',
    tier3Claim: 'RÉCLAMER MON MOIS GRATUIT!',
    tier3CollectMore: (cur: number) => `Collectionnez 30 stickers (Vous en avez ${cur})`,
    needMoreAlert: (rem: number) => `Il vous manque encore ${rem} stickers pour débloquer le mois gratuit!`,
    countrySelectHeader: 'Sélectionnez le pays dont vous collectez les stickers maintenant:',
    countryActiveCollecting: 'Collection et tampons du pays:',
    countryProgressLabel: 'Progression dans ce pays:',
    allCountriesBadge: 'Tous les pays',
    regionsTitle: '1. Tampons des Provinces & Régions',
    attractionsTitle: '2. Monuments & Villes Remarquables',
    stampEarned: 'Obtenu',
    stampInPassport: '✔️ Dans le passeport (Décocher)',
    stampVisited: '📍 J\'ai visité cette région! (+1 Sticker)',
    collected: 'Collecté ✔️',
    addSticker: '+ Ajouter',
    certTitle: 'Certificat de Voyageur d\'Honneur',
    certSubtitle: 'Distinction Officielle Smart Travel Europe 2026',
    certCertifies: 'Il est fièrement certifié que:',
    certDefaultName: 'Cher Voyageur',
    certText: 'a complété avec succès la collection de 30 Stickers & Tampons Numériques des villes, régions et monuments visités aux Pays-Bas, en Belgique, en France, en Allemagne et en Pologne.',
    certPrizeBadge: 'CADEAU DE L\'APPLICATION: 1 MOIS GRATUIT DE PREMIUM ✔️',
    certSignatureLabel: 'Signature du Guide:',
    certSignature: 'Tadzik Assistant Voyage 🚴‍♂️',
    certPrint: 'Imprimer / Télécharger PDF',
    congratsTitle: 'FÉLICITATIONS! RÉCOMPENSE DÉBLOQUÉE!',
    congratsSubTier3: 'Vous avez récolté les 30 stickers! L\'application vous offre 1 MOIS GRATUIT DE PREMIUM et votre Certificat Personnel.',
    congratsSubTier2: 'Vous avez atteint 15 stickers! La Coupe d\'Argent et les 20% de réduction sont à vous!',
    congratsSubTier1: '5 stickers collectés! Diplôme de Bronze débloqué!',
    openCertBtn: 'Ouvrir Mon Certificat & Réclamer le Mois Premium',
    continueJourney: 'Merveilleux, continuez le voyage!',
    filterOnlyUncollected: 'Afficher uniquement non collectés'
  },
  ro: {
    challengeTag: 'Marea Provocare de 30 de Stickere a lui Tadzik',
    title: 'Pașaportul Tău de Călătorie & Album de Stickere 🗺️',
    description: 'Colecționează stickere din orașele, regiunile și monumentele vizitate din Europa. La 30 de stickere primești 1 LUNĂ GRATUITĂ DE ABONAMENT PREMIUM și Certificatul de Călător de Onoare!',
    progressTitle: 'Progresul Global al Colecției (Toate Țările):',
    stickersUnit: 'Stickere',
    bronzeMilestone: '🥉 5 Stickere',
    bronzeSub: 'Insignă de Bronz',
    silverMilestone: '🥈 15 Stickere',
    silverSub: 'Trofeu de Argint',
    goldMilestone: '🥇 30 Stickere',
    goldSub: '🎁 1 LUNĂ GRATUITĂ PREMIUM',
    loginPrompt: '⚠️ Autentifică-te la secțiunea "Cont" pentru a salva ștampilele pe toate dispozitivele!',
    loginAlert: '⚠️ Te rugăm să te autentifici pentru a salva stickerele și a debloca 1 lună gratuită de Premium!',
    rewardsHeading: 'Recompense și Premii din Aplicație 🎁',
    rewardsSubheading: 'Iată ce deblochezi la fiecare etapă a călătoriei:',
    unlocked: 'DEBLOCAT ✔️',
    tier1Goal: 'OBIECTIV: 5 STICKERE',
    tier1Title: 'Diplomă de Călător de Bronz',
    tier1Desc: 'Insignă oficială în profil și ghidul PDF "Perle Ascunse ale Europei pentru Seniori".',
    tier1Claim: 'Revendică Premiul!',
    tier1Need: 'Ai nevoie de 5 stickere',
    tier2Goal: 'OBIECTIV: 15 STICKERE',
    tier2Title: 'Stea de Argint & 20% Reducere',
    tier2Desc: 'Rang de asistent de argint, trasee cicliste premium și cod promoțional de 20%.',
    tier2Claim: 'Revendică Premiul!',
    tier2Need: 'Ai nevoie de 15 stickere',
    tier3Goal: 'MARELE PREMIU VIP!',
    tier3Threshold: 'OBIECTIV: 30 STICKERE',
    tier3Title: '1 LUNĂ GRATUITĂ DE PREMIUM',
    tier3Desc: 'Marele premiu din partea aplicației! O lună suplimentară complet gratuită + Certificat de Călător de Onoare.',
    tier3Claim: 'REVENDICĂ LUNA GRATUITĂ DE PREMIUM!',
    tier3CollectMore: (cur: number) => `Adună 30 de stickere (Ai ${cur})`,
    needMoreAlert: (rem: number) => `Mai ai nevoie de ${rem} stickere pentru a debloca luna gratuită de Premium!`,
    countrySelectHeader: 'Alege din ce țară colecționezi stickere acum:',
    countryActiveCollecting: 'Colecția și ștampilele pentru țara:',
    countryProgressLabel: 'Progres în această țară:',
    allCountriesBadge: 'Toate țările',
    regionsTitle: '1. Ștampile de Provincii & Regiuni',
    attractionsTitle: '2. Monumente & Orașe Emblematice',
    stampEarned: 'Obținut',
    stampInPassport: '✔️ În pașaport (Debifează)',
    stampVisited: '📍 Am vizitat această regiune! (+1 Sticker)',
    collected: 'Colecționat ✔️',
    addSticker: '+ Adaugă',
    certTitle: 'Certificat de Călător de Onoare',
    certSubtitle: 'Recunoaștere Oficială Smart Travel Europe 2026',
    certCertifies: 'Se certifică cu mândrie că:',
    certDefaultName: 'Stimate Călător',
    certText: 'a finalizat cu succes colecția de 30 de Stickere & Ștampile Digitale din orașele, regiunile și monumentele vizitate din Olanda, Belgia, Franța, Germania și Polonia.',
    certPrizeBadge: 'PREMIUL APLICAȚIEI: 1 LUNĂ GRATUITĂ DE PREMIUM ✔️',
    certSignatureLabel: 'Semnătura Ghidului:',
    certSignature: 'Tadzik Asistent de Călătorie 🚴‍♂️',
    certPrint: 'Tipărește / Descarcă PDF',
    congratsTitle: 'FELICITĂRI! AI DEBLOCAT UN PREMIU!',
    congratsSubTier3: 'Ai adunat toate cele 30 de stickere! Aplicația îți acordă 1 LUNĂ GRATUITĂ DE PREMIUM și Certificatul Tău Personal.',
    congratsSubTier2: 'Ai atins 15 stickere! Trofeul de Argint și 20% reducere sunt ale tale!',
    congratsSubTier1: '5 stickere colecționate! Diplomă de Bronz deblocată!',
    openCertBtn: 'Deschide Certificatul și Revendică Luna Premium',
    continueJourney: 'Minunat, continuă călătoria!',
    filterOnlyUncollected: 'Arată doar necolectate'
  },
  zh: {
    challengeTag: 'Tadzik 30枚旅行贴纸集章大挑战',
    title: '您的旅行护照与印章贴纸集 🗺️',
    description: '收集欧洲各大名城、省份与经典地标的数字旅行贴纸。集齐30枚即可获赠应用官方大礼：免费额外获赠1个月高级会员资格及专属荣誉旅行家认证证书！',
    progressTitle: '全球集章总进度 (全部国家)：',
    stickersUnit: '枚贴纸',
    bronzeMilestone: '🥉 5 枚贴纸',
    bronzeSub: '铜牌徽章',
    silverMilestone: '🥈 15 枚贴纸',
    silverSub: '银质奖杯',
    goldMilestone: '🥇 30 枚贴纸',
    goldSub: '🎁 免费1个月高级会员',
    loginPrompt: '⚠️ 请在“账户”页面登录，以跨设备永久保存您的专属贴纸与印章！',
    loginAlert: '⚠️ 请先登录账户，以保存贴纸并解锁免费高级会员！',
    rewardsHeading: '旅行成就与官方奖品 🎁',
    rewardsSubheading: '达成每个旅程里程碑即可解锁以下丰厚奖励：',
    unlocked: '已解锁 ✔️',
    tier1Goal: '目标：5 枚贴纸',
    tier1Title: '铜牌旅行家认证证书',
    tier1Desc: '个人资料官方勋章及《欧洲长者隐秘明珠旅行指南》PDF。',
    tier1Claim: '领取奖励！',
    tier1Need: '还需 5 枚贴纸',
    tier2Goal: '目标：15 枚贴纸',
    tier2Title: '银质成就之星 & 8折预订优惠',
    tier2Desc: '专属银质助理头衔、VIP精品骑行路线及全场8折优惠码。',
    tier2Claim: '领取奖励！',
    tier2Need: '还需 15 枚贴纸',
    tier3Goal: 'VIP 终极大奖！',
    tier3Threshold: '目标：30 枚贴纸',
    tier3Title: '免费1个月高级会员资格',
    tier3Desc: '开发团队重磅大礼！额外获赠整整1个月免费会员时长 + 荣誉旅行家证书！',
    tier3Claim: '立即领取免费会员！',
    tier3CollectMore: (cur: number) => `集齐30枚贴纸（当前已有 ${cur} 枚）`,
    needMoreAlert: (rem: number) => `还差 ${rem} 枚贴纸即可解锁免费会员！`,
    countrySelectHeader: '请选择您当前正在打卡收集的国家：',
    countryActiveCollecting: '当前国家专属贴纸与印章：',
    countryProgressLabel: '本国集章进度：',
    allCountriesBadge: '全部国家',
    regionsTitle: '1. 省份与大区数字印章',
    attractionsTitle: '2. 标志性景点与名城贴纸',
    stampEarned: '已获得',
    stampInPassport: '✔️ 护照已盖章 (点击取消)',
    stampVisited: '📍 我已游览该地区！(+1 贴纸)',
    collected: '已收集 ✔️',
    addSticker: '+ 打卡',
    certTitle: '荣誉旅行家认证证书',
    certSubtitle: 'Smart Travel Europe 2026 官方荣誉授予',
    certCertifies: '兹自豪证明：',
    certDefaultName: '尊敬的旅行者',
    certText: '已成功集齐荷兰、比利时、法国、德国及波兰等各大名城、省份与经典地标的30枚数字旅行贴纸与印章。',
    certPrizeBadge: '应用赠礼：免费续订1个月高级会员资格 ✔️',
    certSignatureLabel: '向导签名：',
    certSignature: 'Tadzik 旅行专属助理 🚴‍♂️',
    certPrint: '打印 / 下载 PDF',
    congratsTitle: '热烈祝贺！您已解锁全新奖励！',
    congratsSubTier3: '您已集齐全部30枚贴纸！应用特授予您免费1个月高级会员及荣誉证书！',
    congratsSubTier2: '您已达到15枚贴纸！银质奖杯与20%折扣优惠已归您所有！',
    congratsSubTier1: '已收集5枚贴纸！铜牌旅行家证书已解锁！',
    openCertBtn: '打开我的证书并领取1个月高级会员',
    continueJourney: '太棒了，继续精彩旅程！',
    filterOnlyUncollected: '仅显示未收集项'
  }
};

export default function PassportTab({ language, account, onUpdateAccount, onNavigateTab }: PassportTabProps) {
  const p = passportDict[language] || passportDict.en;
  
  // Country segregation state
  const [selectedCountry, setSelectedCountry] = useState<PassportCountryCode>('all');
  const [onlyUncollected, setOnlyUncollected] = useState(false);
  
  // Dynamic Community Stickers state (automatically populated when any user adds a new place!)
  const [communityStickers, setCommunityStickers] = useState<AttractionSticker[]>(() => {
    return getCommunityStickersFromStorage();
  });

  // Listen for real-time community place additions across the app
  useEffect(() => {
    const refreshCommunityStickers = () => {
      setCommunityStickers(getCommunityStickersFromStorage());
    };

    window.addEventListener('passport-stickers-updated', refreshCommunityStickers);
    window.addEventListener('storage', refreshCommunityStickers);
    return () => {
      window.removeEventListener('passport-stickers-updated', refreshCommunityStickers);
      window.removeEventListener('storage', refreshCommunityStickers);
    };
  }, []);

  // Combined active stickers list (official pre-seeded + dynamic community stickers)
  const effectiveAttractionStickers = useMemo(() => {
    return [...ALL_PASSPORT_STICKERS, ...communityStickers];
  }, [communityStickers]);
  
  // Modals state
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showRewardClaimModal, setShowRewardClaimModal] = useState<'tier1' | 'tier2' | 'tier3' | null>(null);
  const [showAdminInspectorModal, setShowAdminInspectorModal] = useState(false);
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);
  const [newStickerNotice, setNewStickerNotice] = useState<{ name: string; city: string; icon: string } | null>(null);
  const [selectedItemForVerification, setSelectedItemForVerification] = useState<{
    item: AttractionSticker | RegionalStamp;
    isRegional: boolean;
  } | null>(null);
  const [activeVoucherModal, setActiveVoucherModal] = useState<ClaimedRewardVoucher | null>(null);

  // Total collected stickers from user account
  const collectedStampsList = account?.collectedStamps || [];
  const stickerProofs = account?.stickerProofs || {};
  const claimedRewards = account?.claimedRewards || [];
  const totalCollected = collectedStampsList.length;
  const TARGET_STICKERS_GOAL = 30;
  const progressPercentage = Math.min(100, Math.round((totalCollected / TARGET_STICKERS_GOAL) * 100));

  // Handler for adding a new sightseeing spot directly from Passport:
  // Automatically creates the spot, adds the sticker to the album, awards it to the creator with proof, and notifies the app!
  const handlePassportPlaceCreated = (newPlace: Attraction, finalPhotosList: AttractionPhoto[]) => {
    let existingPlaces: any[] = [];
    try {
      const raw = localStorage.getItem('nl_tourist_planner_custom_attractions');
      if (raw) existingPlaces = JSON.parse(raw);
    } catch {}
    const updatedPlaces = [newPlace, ...existingPlaces];
    try {
      localStorage.setItem('nl_tourist_planner_custom_attractions', JSON.stringify(updatedPlaces));
    } catch {}

    let existingPhotos: Record<string, any[]> = {};
    try {
      const rawP = localStorage.getItem('nl_tourist_planner_photos');
      if (rawP) existingPhotos = JSON.parse(rawP);
    } catch {}
    existingPhotos[newPlace.id] = finalPhotosList;
    try {
      localStorage.setItem('nl_tourist_planner_photos', JSON.stringify(existingPhotos));
    } catch {}

    // Refresh stickers in real-time
    setCommunityStickers(getCommunityStickersFromStorage());

    // Dispatch global event
    try {
      window.dispatchEvent(new Event('passport-stickers-updated'));
    } catch {}

    const stickerId = newPlace.id.startsWith('sticker-') ? newPlace.id : `sticker-${newPlace.id}`;

    if (account) {
      const visitedList = account.visitedAttractions || [];
      const collectedStamps = account.collectedStamps || [];
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

      if (updatedStamps.length === 5) {
        setShowRewardClaimModal('tier1');
      } else if (updatedStamps.length === 15) {
        setShowRewardClaimModal('tier2');
      } else if (updatedStamps.length === 30) {
        setShowRewardClaimModal('tier3');
      }
    }

    const iconMap: Record<string, string> = {
      park: '🌿', forest: '🌲', historical: '🏰', museum: '🏛️', romantic: '💖', beach: '🏖️', restaurant_cafe: '☕'
    };
    const chosenIcon = iconMap[newPlace.category] || '📍';

    setNewStickerNotice({ name: newPlace.name, city: newPlace.city, icon: chosenIcon });
    setTimeout(() => {
      setNewStickerNotice(null);
    }, 10000);
  };

  // Compute count of collected items per country including dynamic community stickers
  const countryStats = useMemo(() => {
    const stats: Record<PassportCountryCode, { total: number; collected: number }> = {
      all: { total: ALL_REGIONAL_STAMPS.length + effectiveAttractionStickers.length, collected: totalCollected },
      pl: { total: 0, collected: 0 },
      nl: { total: 0, collected: 0 },
      be: { total: 0, collected: 0 },
      fr: { total: 0, collected: 0 },
      de: { total: 0, collected: 0 }
    };

    // Calculate regional stamps
    ALL_REGIONAL_STAMPS.forEach((stamp) => {
      const code = stamp.countryCode;
      if (stats[code]) {
        stats[code].total += 1;
        if (collectedStampsList.includes(stamp.region)) {
          stats[code].collected += 1;
        }
      }
    });

    // Calculate attraction stickers (official + user added)
    effectiveAttractionStickers.forEach((st) => {
      const code = st.countryCode;
      if (stats[code]) {
        stats[code].total += 1;
        if (collectedStampsList.includes(st.id)) {
          stats[code].collected += 1;
        }
      }
    });

    return stats;
  }, [collectedStampsList, totalCollected, effectiveAttractionStickers]);

  // Filter regional stamps by selected country
  const filteredRegionalStamps = useMemo(() => {
    return ALL_REGIONAL_STAMPS.filter((item) => {
      if (selectedCountry !== 'all' && item.countryCode !== selectedCountry) {
        return false;
      }
      if (onlyUncollected && collectedStampsList.includes(item.region)) {
        return false;
      }
      return true;
    });
  }, [selectedCountry, onlyUncollected, collectedStampsList]);

  // Filter attraction stickers by selected country (official + community)
  const filteredAttractionStickers = useMemo(() => {
    return effectiveAttractionStickers.filter((item) => {
      if (selectedCountry !== 'all' && item.countryCode !== selectedCountry) {
        return false;
      }
      if (onlyUncollected && collectedStampsList.includes(item.id)) {
        return false;
      }
      return true;
    });
  }, [selectedCountry, onlyUncollected, collectedStampsList, effectiveAttractionStickers]);

  // Active country metadata
  const currentCountryObj = PASSPORT_COUNTRIES.find(c => c.code === selectedCountry) || PASSPORT_COUNTRIES[0];
  const activeCountryCollected = countryStats[selectedCountry]?.collected || 0;
  const activeCountryTotal = countryStats[selectedCountry]?.total || 1;
  const activeCountryPercent = Math.round((activeCountryCollected / activeCountryTotal) * 100);

  const handleOpenVerifyModal = (item: AttractionSticker | RegionalStamp, isRegional: boolean) => {
    if (!account) {
      alert(p.loginAlert);
      return;
    }
    setSelectedItemForVerification({ item, isRegional });
  };

  const handleVerifySuccess = (itemId: string, proof: StickerVerificationProof) => {
    if (!account) return;

    const isAlreadyInList = collectedStampsList.includes(itemId);
    const updatedStamps = isAlreadyInList ? collectedStampsList : [...collectedStampsList, itemId];
    const updatedProofs: Record<string, StickerVerificationProof> = {
      ...(account.stickerProofs || {}),
      [itemId]: proof
    };

    const updatedAccount: UserAccount = {
      ...account,
      collectedStamps: updatedStamps,
      stickerProofs: updatedProofs
    };

    onUpdateAccount(updatedAccount);
    try {
      localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
    } catch (e) {
      console.error(e);
    }

    setSelectedItemForVerification(null);

    // Trigger celebratory modal if hit milestones
    if (!isAlreadyInList) {
      if (updatedStamps.length === 5) {
        setShowRewardClaimModal('tier1');
      } else if (updatedStamps.length === 15) {
        setShowRewardClaimModal('tier2');
      } else if (updatedStamps.length === 30) {
        setShowRewardClaimModal('tier3');
      }
    }
  };

  const handleRemoveSticker = (itemId: string) => {
    if (!account) return;
    const updatedStamps = collectedStampsList.filter(s => s !== itemId);
    const updatedProofs = { ...(account.stickerProofs || {}) };
    delete updatedProofs[itemId];

    const updatedAccount: UserAccount = {
      ...account,
      collectedStamps: updatedStamps,
      stickerProofs: updatedProofs
    };

    onUpdateAccount(updatedAccount);
    try {
      localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
    } catch (e) {
      console.error(e);
    }
    setSelectedItemForVerification(null);
  };

  const handleClaimTier2Reward = () => {
    if (!account) return;
    if (totalCollected < 15) {
      alert('Do odebrania zniżki 20% wymagane jest 15 zweryfikowanych naklejek obecności!');
      return;
    }

    // Generate verified voucher
    const now = new Date();
    const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const voucherCode = `TADZIK20-VERIFIED-${randomSuffix}-2026`;

    const newVoucher: ClaimedRewardVoucher = {
      id: `voucher-tier2-${Date.now()}`,
      tier: 'tier2',
      rewardTitle: 'Oficjalny Voucher Zniżkowy 20% na Atrakcje & Bilety',
      voucherCode: voucherCode,
      discountPercent: 20,
      claimedAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      status: 'active',
      verificationSignature: `SHA256-AUTH-${account.username.toUpperCase()}-T2-${randomSuffix}`
    };

    const existingVouchers = account.claimedRewards || [];
    const updatedAccount: UserAccount = {
      ...account,
      claimedRewards: [...existingVouchers.filter(v => v.tier !== 'tier2'), newVoucher]
    };

    onUpdateAccount(updatedAccount);
    try {
      localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
    } catch (e) {
      console.error(e);
    }

    setShowRewardClaimModal(null);
    setActiveVoucherModal(newVoucher);
  };

  const handleClaimTier3Reward = () => {
    if (!account) return;
    if (totalCollected < 30) {
      alert(p.needMoreAlert(30 - totalCollected));
      return;
    }

    const now = new Date();
    const currentExpiry = account.subscriptionExpiry ? new Date(account.subscriptionExpiry) : null;
    const baseDate = currentExpiry && currentExpiry > now ? currentExpiry : now;
    const newExpiry = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const vipToken = `VIP-PASS-2026-${randomSuffix}-30MIN`;

    const newVoucher: ClaimedRewardVoucher = {
      id: `voucher-tier3-${Date.now()}`,
      tier: 'tier3',
      rewardTitle: 'Certyfikowany Pass VIP & Darmowy Miesiąc Subskrypcji Premium',
      voucherCode: vipToken,
      claimedAt: now.toISOString(),
      expiresAt: newExpiry.toISOString(),
      status: 'active',
      verificationSignature: `SHA256-VIP-SEAL-${account.username.toUpperCase()}-${randomSuffix}`
    };

    const existingVouchers = account.claimedRewards || [];
    const updatedAccount: UserAccount = {
      ...account,
      hasPaid: true,
      subscriptionExpiry: newExpiry.toISOString().split('T')[0],
      claimedRewards: [...existingVouchers.filter(v => v.tier !== 'tier3'), newVoucher]
    };

    onUpdateAccount(updatedAccount);
    try {
      localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
    } catch (e) {
      console.error(e);
    }

    setShowRewardClaimModal(null);
    setShowCertificateModal(true);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto" id="passport-tab-container">
      
      {/* Grand Album Header */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 p-6 md:p-8 rounded-3xl border border-amber-400 shadow-xl relative overflow-hidden">
        <div className="absolute right-4 bottom-2 text-9xl opacity-20 pointer-events-none select-none">
          📖
        </div>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-slate-950 text-amber-300 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
            <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{p.challengeTag}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950 leading-tight">
            {p.title}
          </h2>

          <p className="text-slate-900 font-bold text-sm md:text-base max-w-2xl leading-relaxed">
            {p.description}
          </p>

          <div className="pt-1">
            <SectionTravelCompanion language={language} vehicle="train" />
          </div>

          {/* Progress Tracker Card */}
          <div className="bg-slate-950/90 text-white p-5 rounded-2xl border border-amber-300/30 shadow-lg space-y-3 mt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 fill-amber-400" />
                <span>{p.progressTitle}</span>
              </span>
              <span className="text-sm font-black bg-amber-400 text-slate-950 px-3 py-1 rounded-lg">
                {totalCollected} / {TARGET_STICKERS_GOAL} {p.stickersUnit} ({progressPercentage}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div 
                className="bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Threshold Milestones */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-bold text-slate-300 text-center">
              <div className={`p-2 rounded-xl border ${totalCollected >= 5 ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-800'}`}>
                <span>{p.bronzeMilestone}</span>
                <span className="block text-[9px] text-slate-400 font-normal">{p.bronzeSub}</span>
              </div>

              <div className={`p-2 rounded-xl border ${totalCollected >= 15 ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-800'}`}>
                <span>{p.silverMilestone}</span>
                <span className="block text-[9px] text-slate-400 font-normal">{p.silverSub}</span>
              </div>

              <div className={`p-2 rounded-xl border ${totalCollected >= 30 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 animate-pulse' : 'bg-slate-900 border-slate-800'}`}>
                <span>{p.goldMilestone}</span>
                <span className="block text-[9px] text-emerald-400 font-black">{p.goldSub}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic New Sticker Celebratory Live Banner */}
      {newStickerNotice && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 sm:p-5 rounded-2xl border-2 border-emerald-300 shadow-xl flex items-center justify-between gap-4 animate-in zoom-in-95">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-3xl shrink-0 shadow-inner">
              {newStickerNotice.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  ✨ Nowa Naklejka w Twoim Paszporcie!
                </span>
                <span className="text-xs text-emerald-200 font-bold hidden sm:inline">
                  +1 do kolekcji & Certyfikat Twórcy
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-white mt-0.5">
                {newStickerNotice.name} • {newStickerNotice.city}
              </h4>
              <p className="text-xs text-emerald-100 font-medium">
                Miejsce zostało pomyślnie dodane do bazy przewodnika, a jego oficjalna naklejka jest już wklejona do Twojego paszportu!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNewStickerNotice(null)}
            className="text-white/80 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Top Banner Action: Create Place Sticker & Inspector Audit Hub */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
            🛡️
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
              <span>System Paszportu & Społeczności Podróżników 2026</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Aktywny
              </span>
            </h4>
            <p className="text-[11px] text-slate-300 font-medium">
              Dodawaj nowe miejsca, generuj kolejne naklejki i zdobywaj darmowy miesiąc Premium!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsAddPlaceOpen(true)}
            className="flex-1 sm:flex-initial bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{language === 'pl' ? 'Dodaj Miejsce (+1 Naklejka)' : 'Add Place (+1 Sticker)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAdminInspectorModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold px-3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-slate-700"
            title="Panel Inspektora & Audytu"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">Audyt</span>
          </button>
        </div>
      </div>

      {!account && (
        <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-xl p-4 font-bold text-sm text-center">
          {p.loginPrompt}
        </div>
      )}

      {/* REWARDS & PRIZES SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Gift className="w-7 h-7 text-indigo-600" />
          <div>
            <h3 className="text-xl font-extrabold text-slate-950">
              {p.rewardsHeading}
            </h3>
            <p className="text-slate-600 text-xs font-semibold">
              {p.rewardsSubheading}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Reward Tier 1 */}
          <div className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
            totalCollected >= 5 ? 'bg-amber-50/50 border-amber-300 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-80'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🥉</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                  totalCollected >= 5 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'
                }`}>
                  {totalCollected >= 5 ? p.unlocked : p.tier1Goal}
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">{p.tier1Title}</h4>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                {p.tier1Desc}
              </p>
            </div>

            <button
              onClick={() => setShowRewardClaimModal('tier1')}
              disabled={totalCollected < 5}
              className={`w-full mt-4 py-2.5 px-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
                totalCollected >= 5 
                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-sm' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {totalCollected >= 5 ? p.tier1Claim : p.tier1Need}
            </button>
          </div>

          {/* Reward Tier 2 */}
          <div className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
            totalCollected >= 15 ? 'bg-indigo-50/50 border-indigo-300 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-80'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🥈</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                  totalCollected >= 15 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {totalCollected >= 15 ? p.unlocked : p.tier2Goal}
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">{p.tier2Title}</h4>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                {p.tier2Desc}
              </p>
            </div>

            <button
              onClick={() => {
                if (totalCollected >= 15) {
                  handleClaimTier2Reward();
                } else {
                  alert('Do odebrania zniżki 20% potrzebujesz 15 zweryfikowanych naklejek!');
                }
              }}
              disabled={totalCollected < 15}
              className={`w-full mt-4 py-2.5 px-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
                totalCollected >= 15 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {totalCollected >= 15 ? 'Odbierz Kod Rabatowy 20% 🏷️' : p.tier2Need}
            </button>
          </div>

          {/* Reward Tier 3 - GRAND PRIZE */}
          <div className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
            totalCollected >= 30 ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white border-emerald-400 shadow-lg' : 'bg-slate-50 border-amber-300 opacity-90'
          }`}>
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🥇🎁</span>
                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${
                  totalCollected >= 30 ? 'bg-amber-300 text-slate-950' : 'bg-amber-100 text-amber-900 font-bold'
                }`}>
                  {totalCollected >= 30 ? p.tier3Goal : p.tier3Threshold}
                </span>
              </div>
              <h4 className="font-extrabold text-base leading-tight">
                {p.tier3Title}
              </h4>
              <p className={`text-xs font-medium leading-relaxed ${totalCollected >= 30 ? 'text-emerald-50' : 'text-slate-600'}`}>
                {p.tier3Desc}
              </p>
            </div>

            <button
              onClick={() => {
                if (totalCollected >= 30) {
                  setShowRewardClaimModal('tier3');
                } else {
                  alert(p.needMoreAlert(30 - totalCollected));
                }
              }}
              className={`w-full mt-4 py-3 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider ${
                totalCollected >= 30 
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md animate-pulse' 
                  : 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold'
              }`}
            >
              <Crown className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>{totalCollected >= 30 ? p.tier3Claim : p.tier3CollectMore(totalCollected)}</span>
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🧭 COUNTRY SELECTION & SEGREGATION BAR (WYBIERZ KRAJ DO ZBIERANIA NAKLEJEK) */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-amber-300/80 rounded-3xl p-6 shadow-md space-y-4" id="country-selector-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 uppercase tracking-wider">
              <Globe2 className="w-4 h-4 text-amber-600" />
              <span>{p.countrySelectHeader}</span>
            </div>
            <h3 className="text-lg font-black text-slate-950">
              Wybór Kraju Kolekcji Naklejek 🗺️
            </h3>
          </div>

          <button
            onClick={() => setOnlyUncollected(!onlyUncollected)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              onlyUncollected 
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{p.filterOnlyUncollected}</span>
          </button>
        </div>

        {/* Country Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-1">
          {PASSPORT_COUNTRIES.map((c) => {
            const isSelected = selectedCountry === c.code;
            const stats = countryStats[c.code];
            const countryName = c.name[language] || c.name.en;

            return (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c.code)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-slate-950 text-white border-amber-400 shadow-md ring-2 ring-amber-400/50 scale-102'
                    : 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{c.flag}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isSelected 
                      ? 'bg-amber-400 text-slate-950' 
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}>
                    {stats?.collected || 0}/{stats?.total || 0}
                  </span>
                </div>

                <div className="mt-2.5">
                  <span className="font-extrabold text-xs block truncate leading-tight">
                    {countryName}
                  </span>
                  <span className={`text-[10px] font-semibold block mt-0.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                    {Math.round(((stats?.collected || 0) / (stats?.total || 1)) * 100)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dedicated Country Highlights Banner */}
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white border border-amber-300 shadow-sm flex items-center justify-center text-3xl">
              {currentCountryObj.flag}
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                {p.countryActiveCollecting} {currentCountryObj.name[language] || currentCountryObj.name.en}
              </div>
              <p className="text-slate-700 text-xs font-semibold mt-0.5">
                {currentCountryObj.motto[language] || currentCountryObj.motto.en}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-amber-200 shadow-xs shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                {p.countryProgressLabel}
              </span>
              <span className="text-xs font-black text-slate-950">
                {activeCountryCollected} / {activeCountryTotal} ({activeCountryPercent}%)
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-amber-400 flex items-center justify-center font-black text-xs text-amber-900 bg-amber-50">
              {activeCountryPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: REGIONAL STAMPS */}
      {/* ========================================================================= */}
      <div className="space-y-4" id="passport-regional-stamps">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
            <span>🏛️</span>
            <span>{p.regionsTitle} ({filteredRegionalStamps.length})</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {filteredRegionalStamps.filter(s => collectedStampsList.includes(s.region)).length} / {filteredRegionalStamps.length}
          </span>
        </div>

        {filteredRegionalStamps.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-xs font-bold">
            Wszystkie pieczątki w tej kategorii zostały już zebrane! 🏆
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredRegionalStamps.map((item) => {
              const isCollected = collectedStampsList.includes(item.region);
              const proof = stickerProofs[item.region];
              const desc = item.description[language] || item.description.en;
              const countryName = item.country[language] || item.country.en;
              
              return (
                <div
                  key={item.region}
                  className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                    isCollected
                      ? 'border-emerald-500 bg-emerald-50/10 shadow-sm'
                      : 'border-slate-200 hover:border-indigo-300 shadow-sm'
                  }`}
                >
                  {/* Stamp graphic */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-11 h-11 rounded-full border flex items-center justify-center text-xl shadow-inner ${
                          isCollected 
                            ? 'border-emerald-500 bg-emerald-100 text-emerald-900' 
                            : 'border-slate-200 bg-slate-50 grayscale'
                        }`}>
                          {item.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-black text-slate-900 leading-none">{item.region}</h4>
                            <span className="text-[10px] font-bold text-slate-400">({countryName})</span>
                          </div>
                          <p className="text-slate-500 font-semibold text-xs mt-1">{item.city}</p>
                        </div>
                      </div>

                      {isCollected && (
                        <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>{proof?.method === 'gps' ? '📍 GPS' : proof?.method === 'qr_code' ? '🏷️ QR' : '✔️ Zweryfikowano'}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed font-medium">
                      {desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenVerifyModal(item, true)}
                      className={`w-full text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                        isCollected 
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {isCollected ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Pokaż Certyfikat Obecności</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Potwierdź Obecność w Regionie (+1)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: LANDMARK & CITY STICKERS + COMMUNITY STICKERS */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-4" id="passport-landmark-stickers">
        
        {/* Community Generated Stickers Feature Banner */}
        <div className="bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-amber-500/10 border-2 border-amber-300/60 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-sm shrink-0">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-slate-900">
                  {language === 'pl' ? 'Dynamiczne Naklejki Społeczności Podróżników 🌍' : 'Dynamic Community Traveler Stickers 🌍'}
                </h4>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  +{communityStickers.length} {language === 'pl' ? 'nowych' : 'new'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-0.5 leading-relaxed">
                {language === 'pl' 
                  ? 'Gdy Ty lub inni podróżnicy dodacie nowe miejsce do zwiedzania w aplikacji, system automatycznie generuje nową oficjalną naklejkę do tego Paszportu!'
                  : 'Whenever you or fellow explorers add a new place to visit, the app automatically generates a brand new official sticker into this Passport!'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddPlaceOpen(true)}
            className="w-full md:w-auto bg-slate-900 hover:bg-slate-950 text-amber-300 font-black text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'pl' ? 'Dodaj Nowe Miejsce (+1 Naklejka)' : 'Add Place (+1 Sticker)'}</span>
          </button>
        </div>

        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
            <span>✨</span>
            <span>{p.attractionsTitle} ({filteredAttractionStickers.length})</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {filteredAttractionStickers.filter(s => collectedStampsList.includes(s.id)).length} / {filteredAttractionStickers.length}
          </span>
        </div>

        {filteredAttractionStickers.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-xs font-bold">
            Wszystkie naklejki w tej kategorii zostały już zebrane! 🏆
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {filteredAttractionStickers.map((st) => {
              const isCollected = collectedStampsList.includes(st.id);
              const proof = stickerProofs[st.id];
              const stickerName = st.name[language] || st.name.en;
              const countryName = st.country[language] || st.country.en;
              const isCommunity = st.isCommunityPlace;

              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleOpenVerifyModal(st, false)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-between items-center group relative ${
                    isCollected
                      ? 'bg-amber-50/80 border-amber-400 shadow-sm scale-102 ring-1 ring-amber-400'
                      : isCommunity
                      ? 'bg-indigo-50/40 border-indigo-200 hover:border-amber-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-amber-300 opacity-80 hover:opacity-100 shadow-xs'
                  }`}
                >
                  {/* Community place badge */}
                  {isCommunity && (
                    <div className="absolute top-1 left-1 bg-indigo-600 text-amber-300 text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                      <span>✨</span>
                      <span>{st.addedBy ? st.addedBy.slice(0, 10) : 'Społeczność'}</span>
                    </div>
                  )}

                  {isCollected && (
                    <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white p-0.5 rounded-full shadow" title="Zweryfikowano obecność">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  <div className={`text-3xl my-2 transition-transform duration-300 group-hover:scale-110 ${isCollected ? '' : 'grayscale opacity-50'}`}>
                    {st.icon}
                  </div>

                  <div className="space-y-0.5 w-full">
                    <h5 className="font-extrabold text-xs text-slate-900 leading-tight line-clamp-1">
                      {stickerName}
                    </h5>
                    <p className="text-[10px] text-slate-500 font-semibold block truncate">
                      📍 {st.city} • {countryName}
                    </p>
                  </div>

                  <div className={`mt-2 w-full text-[9px] font-black py-1 rounded-md uppercase tracking-wider flex items-center justify-center gap-1 ${
                    isCollected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600 group-hover:bg-amber-100'
                  }`}>
                    {isCollected ? (
                      <>
                        <ShieldCheck className="w-3 h-3 text-slate-900" />
                        <span>Zweryfikowano</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-2.5 h-2.5 text-slate-400" />
                        <span>Weryfikuj GPS</span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {selectedItemForVerification && (
        <PassportVerifyModal
          language={language}
          account={account}
          item={selectedItemForVerification.item}
          isRegional={selectedItemForVerification.isRegional}
          isAlreadyCollected={collectedStampsList.includes(
            selectedItemForVerification.isRegional 
              ? (selectedItemForVerification.item as RegionalStamp).region 
              : (selectedItemForVerification.item as AttractionSticker).id
          )}
          existingProof={
            stickerProofs[
              selectedItemForVerification.isRegional 
                ? (selectedItemForVerification.item as RegionalStamp).region 
                : (selectedItemForVerification.item as AttractionSticker).id
            ]
          }
          onClose={() => setSelectedItemForVerification(null)}
          onVerifySuccess={handleVerifySuccess}
          onRemoveSticker={handleRemoveSticker}
        />
      )}

      {/* Organizer & Admin Inspector Modal */}
      {showAdminInspectorModal && (
        <PassportAdminInspectorModal
          language={language}
          account={account}
          onUpdateAccount={onUpdateAccount}
          onClose={() => setShowAdminInspectorModal(false)}
        />
      )}

      {/* Active Voucher Display Modal */}
      {activeVoucherModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-indigo-500 p-6 md:p-8 max-w-md w-full text-center space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setActiveVoucherModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border-2 border-indigo-300 text-indigo-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
              🏷️
            </div>

            <div className="space-y-1.5">
              <span className="bg-indigo-100 text-indigo-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Certyfikowany Voucher Anty-Cheat ✔️
              </span>
              <h3 className="text-xl font-black text-slate-950">
                {activeVoucherModal.rewardTitle}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Pokaż ten kod przy kasie biletowej lub weryfikatorowi na trasie, aby naliczyć 20% rabatu.
              </p>
            </div>

            <div className="bg-slate-950 text-white rounded-2xl p-4 space-y-2 border-2 border-amber-400 shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Twój Unikalny Kod Rabatowy:
              </span>
              <div className="font-mono text-lg font-black text-amber-400 tracking-wider select-all">
                {activeVoucherModal.voucherCode}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Ważny do: {new Date(activeVoucherModal.expiresAt).toLocaleDateString()}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveVoucherModal(null)}
              className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-3 rounded-xl text-xs cursor-pointer shadow-sm"
            >
              Zapisano w Moim Profilu
            </button>
          </div>
        </div>
      )}

      {/* Interactive Certificate View Modal */}
      {showCertificateModal && account && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-amber-50 border-4 border-amber-400 rounded-3xl p-6 md:p-8 max-w-2xl w-full text-slate-950 relative shadow-2xl space-y-6">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 bg-slate-900 text-white p-2 rounded-full cursor-pointer hover:bg-slate-950"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-amber-300 pb-4">
              <span className="text-5xl">📜👑</span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-wide">
                {p.certTitle}
              </h3>
              <p className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
                {p.certSubtitle}
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 py-2">
              <p className="text-sm font-semibold text-slate-800">
                {p.certCertifies}
              </p>
              
              <div className="text-2xl md:text-3xl font-black text-indigo-900 underline decoration-amber-400 decoration-4">
                {account.username || p.certDefaultName}
              </div>

              <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed max-w-lg mx-auto">
                {p.certText}
              </p>

              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-4 py-2 rounded-xl text-xs font-black border border-emerald-300">
                <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{p.certPrizeBadge}</span>
              </div>
            </div>

            {/* Signatures & Footer */}
            <div className="flex justify-between items-end border-t border-amber-300 pt-4 text-xs font-bold text-slate-600">
              <div>
                <span className="block text-[10px] text-slate-400">{p.certSignatureLabel}</span>
                <span className="font-extrabold text-indigo-900">{p.certSignature}</span>
              </div>

              <button
                onClick={() => window.print()}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-950"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>{p.certPrint}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Celebratory Reward Modal */}
      {showRewardClaimModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 max-w-md w-full text-center space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setShowRewardClaimModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-5xl animate-bounce">
              {showRewardClaimModal === 'tier3' ? '🥇🎁🎉' : showRewardClaimModal === 'tier2' ? '🥈🎉' : '🥉🎉'}
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-950">
                {p.congratsTitle}
              </h3>
              <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                {showRewardClaimModal === 'tier3'
                  ? p.congratsSubTier3
                  : showRewardClaimModal === 'tier2'
                  ? p.congratsSubTier2
                  : p.congratsSubTier1}
              </p>
            </div>

            {showRewardClaimModal === 'tier2' && (
              <button
                onClick={handleClaimTier2Reward}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
              >
                <Percent className="w-4 h-4" />
                <span>Generuj Mój Oficjalny Kod Rabatowy 20%</span>
              </button>
            )}

            {showRewardClaimModal === 'tier3' && (
              <button
                onClick={handleClaimTier3Reward}
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
              >
                <span>📜</span>
                <span>{p.openCertBtn}</span>
              </button>
            )}

            <button
              onClick={() => setShowRewardClaimModal(null)}
              className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-slate-950 cursor-pointer"
            >
              {p.continueJourney}
            </button>
          </div>
        </div>
      )}

      {/* Add Place Modal (Opens directly in Passport to generate new official sticker) */}
      <AddPlaceModal
        isOpen={isAddPlaceOpen}
        onClose={() => setIsAddPlaceOpen(false)}
        onPlaceCreated={handlePassportPlaceCreated}
        language={language}
        account={account}
      />

    </div>
  );
}
