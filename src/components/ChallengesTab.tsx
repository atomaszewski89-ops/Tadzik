/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { UserAccount, Language, ChallengeEntry } from '../types';
import { SEEDED_CHALLENGES } from '../data/attractions';
import { 
  getWeeklyMysteryForDate, 
  calculateDistanceKm, 
  calculateBearing, 
  calculateBearingDegrees,
  MysterySpot 
} from '../data/weeklyMysteries';
import { SectionTravelCompanion } from './AnimatedTravelVehicle';
import { 
  Trophy, 
  MapPin, 
  Sparkles, 
  Compass, 
  Search, 
  Camera, 
  Heart, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Radio,
  Navigation,
  Key,
  Flame,
  Award,
  Globe2,
  HelpCircle,
  Eye,
  Sliders,
  Check,
  RotateCcw
} from 'lucide-react';

interface ChallengesTabProps {
  language: Language;
  account: UserAccount | null;
}

const CONTEST_MOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600&auto=format&fit=crop&q=80'
];

interface RadarCity {
  name: string;
  country: string;
  flag: string;
  countryCode: 'pl' | 'nl' | 'be' | 'de' | 'fr';
  lat: number;
  lng: number;
}

const RADAR_REFERENCE_CITIES: RadarCity[] = [
  { name: 'Amsterdam', country: 'Holandia', flag: '🇳🇱', countryCode: 'nl', lat: 52.3676, lng: 4.9041 },
  { name: 'Rotterdam', country: 'Holandia', flag: '🇳🇱', countryCode: 'nl', lat: 51.9244, lng: 4.4777 },
  { name: 'Utrecht', country: 'Holandia', flag: '🇳🇱', countryCode: 'nl', lat: 52.0907, lng: 5.1214 },
  { name: 'Haarlem', country: 'Holandia', flag: '🇳🇱', countryCode: 'nl', lat: 52.3874, lng: 4.6462 },
  { name: 'Giethoorn', country: 'Holandia', flag: '🇳🇱', countryCode: 'nl', lat: 52.7397, lng: 6.0789 },
  { name: 'Kinderdijk', country: 'Holandia', flag: '🇳🇱', countryCode: 'nl', lat: 51.8884, lng: 4.6315 },
  { name: 'Zaanse Schans', country: 'Holandia', flag: '🇳🇱', countryCode: 'nl', lat: 52.4731, lng: 4.8198 },
  { name: 'Bruksela (Bruxelles)', country: 'Belgia', flag: '🇧🇪', countryCode: 'be', lat: 50.8503, lng: 4.3517 },
  { name: 'Brugia (Brugge)', country: 'Belgia', flag: '🇧🇪', countryCode: 'be', lat: 51.2093, lng: 3.2247 },
  { name: 'Gandawa (Gent)', country: 'Belgia', flag: '🇧🇪', countryCode: 'be', lat: 51.0543, lng: 3.7174 },
  { name: 'Dinant', country: 'Belgia', flag: '🇧🇪', countryCode: 'be', lat: 50.2611, lng: 4.9122 },
  { name: 'Antwerpia', country: 'Belgia', flag: '🇧🇪', countryCode: 'be', lat: 51.2194, lng: 4.4025 },
  { name: 'Berlin', country: 'Niemcy', flag: '🇩🇪', countryCode: 'de', lat: 52.5200, lng: 13.4050 },
  { name: 'Kolonia (Köln)', country: 'Niemcy', flag: '🇩🇪', countryCode: 'de', lat: 50.9375, lng: 6.9603 },
  { name: 'Zamek Eltz', country: 'Niemcy', flag: '🇩🇪', countryCode: 'de', lat: 50.2052, lng: 7.3366 },
  { name: 'Paryż (Paris)', country: 'Francja', flag: '🇫🇷', countryCode: 'fr', lat: 48.8566, lng: 2.3522 },
  { name: 'Kraków (Wawel)', country: 'Polska', flag: '🇵🇱', countryCode: 'pl', lat: 50.0647, lng: 19.9450 },
  { name: 'Warszawa', country: 'Polska', flag: '🇵🇱', countryCode: 'pl', lat: 52.2297, lng: 21.0122 },
  { name: 'Gdańsk', country: 'Polska', flag: '🇵🇱', countryCode: 'pl', lat: 54.3520, lng: 18.6466 },
  { name: 'Wrocław', country: 'Polska', flag: '🇵🇱', countryCode: 'pl', lat: 51.1079, lng: 17.0385 }
];

const UI_TEXT = {
  pl: {
    tabQuest: '🕵️ Śledztwo Tygodnia',
    tabRadar: '🛰️ Radar Ciepło-Zimno',
    tabStickers: '🏅 Album Naklejek AI',
    tabGallery: '📸 Ściana Odkrywców',
    heroTag: 'NOWA ZAGADKA CO TYDZIEŃ',
    heroTitle: 'Wielkie Śledztwo & Radar Detektywistyczny 🗺️',
    heroDesc: 'Co tydzień Tadzik ukrywa sekretne miejsce w Europie. Korzystaj z radaru odległości, rozszyfruj wskazówki i zdobądź 300 XP oraz Złotą Odznakę!',
    nextReset: 'Następna zagadka za:',
    days: 'Dni', hours: 'Godz', mins: 'Min', secs: 'Sek',
    rewardLabel: 'NAGRODA: +300 XP & Złota Odznaka',
    clueRiddle: '1. Zagadka Wierszowana',
    clueRadar: '2. Radar "Ciepło - Zimno"',
    cluePhoto: '3. Zdjęcie Szpiegowskie',
    clueTrivia: '4. Fakty & Koła Ratunkowe',
    readAloud: 'Odczytaj na głos 🎙️',
    stopAudio: 'Zatrzymaj głos',
    readingNow: 'Głos Tadzika czyta zagadkę...',
    radarScan: 'Zeskanuj Odległość 📡',
    radarPrompt: 'Wybierz miasto ze stacji pomiarowych, aby namierzyć azymut i temperaturę:',
    filterAll: 'Wszystkie kraje',
    distLabel: 'Dystans w linii prostej:',
    bearingLabel: 'Kierunek do celu:',
    tempBoiling: '🔥 PŁONĄCO GORĄCO! Jesteś na miejscu (< 25 km)!',
    tempHot: '☀️ BARDZO GORĄCO! Cel tuż obok (25 - 80 km)!',
    tempWarm: '⛅ CIEPŁO! Dobry kierunek (80 - 200 km)!',
    tempCold: '❄️ ZIMNO! Szukaj w innym regionie (200 - 450 km)!',
    tempFreezing: '🧊 BARDZO ZIMNO! Inny kraniec Europy (> 450 km)!',
    spyClarity: 'Ostrość:',
    zoom: 'Powiększenie:',
    filterNormal: 'Zwykły',
    filterNV: 'Noktowizor 🟢',
    filterXray: 'Rentgen 🔵',
    filterSepia: 'Sepia 📜',
    lifelinesHeader: 'Koła Ratunkowe Tadzika 💡',
    lifelineLetters: '🔤 Pierwsza i ostatnia litera',
    lifelineCategory: '🏰 Kategoria miejsca',
    lifelineLength: '🔢 Liczba liter',
    guessTitle: 'Twoja Odpowiedź & Dedukcja 🎯',
    guessPlaceholder: 'Wpisz nazwę (np. Giethoorn, Kasteel de Haar, Atomium, Burg Eltz...)',
    guessBtn: 'Sprawdź Odpowiedź 🚀',
    triesLeft: (n: number) => `Pozostałe próby: ${n}/5`,
    quickPicks: 'Szybki wybór popularnych miejsc:',
    solvedTitle: '🎉 BRAWO! ROZWIĄZAŁEŚ TAJEMNICĘ TYGODNIA!',
    solvedDesc: 'Tajemniczym miejscem tego tygodnia jest:',
    wrongGuess: (name: string, hint: string) => `Niestety, "${name}" to nie to miejsce! Podpowiedź Tadzika: ${hint}`,
    albumTitle: 'Wirtualny Album Naklejek Podróżnika 🤖',
    albumSubtitle: 'Zbieraj unikalne odznaki i naklejki z europejskich miast!',
    checkinTitle: 'Odbierz naklejkę za wizytę w mieście:',
    selectCity: 'Wybierz miasto:',
    whatDidYouDo: 'Co ciekawego tam robiłeś?:',
    activityPlaceholder: 'np. Spacerowałem po starym rynku i jadłem lokalne gofry...',
    stickBtn: 'Przyklej do Albumu! ✨',
    galleryTitle: 'Ściana Odkrywców & Zdjęcia Podróżników 📸',
    gallerySub: 'Podziel się zdjęciem ze swojej wyprawy i zobacz relacje innych!',
    postPhotoBtn: 'Dodaj Moje Zdjęcie 📷',
    likesCount: 'Polubień',
    commentsCount: (n: number) => `${n} Komentarzy`,
    addComment: 'Dodaj komentarz...',
    loginPrompt: 'Zaloguj się w zakładce Konto, aby brać udział w konkursach i zapisywać punkty.'
  },
  nl: {
    tabQuest: '🕵️ Weekmysterie',
    tabRadar: '🛰️ Warm-Koud Radar',
    tabStickers: '🏅 AI Stickeralbum',
    tabGallery: '📸 Reizigersgalerij',
    heroTag: 'ELKE WEEK EEN NIEUWE PLEK',
    heroTitle: 'Grote Geheime Plek Zoektocht & Radar 🗺️',
    heroDesc: 'Elke week verstopt Tadzik een geheime plek in Europa. Gebruik de afstandsradar, ontcijfer aanwijzingen en win 300 XP!',
    nextReset: 'Volgend mysterie over:',
    days: 'Dagen', hours: 'Uur', mins: 'Min', secs: 'Sec',
    rewardLabel: 'BELONING: +300 XP & Gouden Badge',
    clueRiddle: '1. Rijmend Raadsel',
    clueRadar: '2. Warm-Koud Radar',
    cluePhoto: '3. Spionnenfoto',
    clueTrivia: '4. Feiten & Hulplijnen',
    readAloud: 'Voorlezen 🎙️',
    stopAudio: 'Stop geluid',
    readingNow: 'Tadzik leest het raadsel voor...',
    radarScan: 'Afstand Scannen 📡',
    radarPrompt: 'Kies een referentiestad om afstand en richting te berekenen:',
    filterAll: 'Alle landen',
    distLabel: 'Afstand in vogelvlucht:',
    bearingLabel: 'Richting:',
    tempBoiling: '🔥 KOKEND HEET! U bent er bijna (< 25 km)!',
    tempHot: '☀️ ZEER HEET! Vlakbij het doel (25 - 80 km)!',
    tempWarm: '⛅ WARM! Goede richting (80 - 200 km)!',
    tempCold: '❄️ KOUD! Zoek in een andere regio (200 - 450 km)!',
    tempFreezing: '🧊 IJSKOUD! Aan de andere kant van Europa (> 450 km)!',
    spyClarity: 'Scherpte:',
    zoom: 'Zoom:',
    filterNormal: 'Normaal',
    filterNV: 'Nachtvisie 🟢',
    filterXray: 'Röntgen 🔵',
    filterSepia: 'Sepia 📜',
    lifelinesHeader: 'Tadziks Hulplijnen 💡',
    lifelineLetters: '🔤 Eerste & laatste letter',
    lifelineCategory: '🏰 Type bezienswaardigheid',
    lifelineLength: '🔢 Aantal letters',
    guessTitle: 'Uw Detective Antwoord 🎯',
    guessPlaceholder: 'Typ naam (bijv. Giethoorn, Kasteel de Haar, Atomium...)',
    guessBtn: 'Controleer Antwoord 🚀',
    triesLeft: (n: number) => `Resterende pogingen: ${n}/5`,
    quickPicks: 'Snelle suggesties:',
    solvedTitle: '🎉 GEFELICITEERD! MYSTERIE OPGELOST!',
    solvedDesc: 'De geheime plek van deze week is:',
    wrongGuess: (name: string, hint: string) => `Helaas, "${name}" is niet juist! Tip: ${hint}`,
    albumTitle: 'Virtueel Reizigers Stickeralbum 🤖',
    albumSubtitle: 'Verzamel unieke badges en stickers van Europese steden!',
    checkinTitle: 'Claim een sticker voor uw stadsbezoek:',
    selectCity: 'Selecteer stad:',
    whatDidYouDo: 'Wat heeft u daar gedaan?:',
    activityPlaceholder: 'bijv. Rondvaart gemaakt over de grachten...',
    stickBtn: 'Plakken in Album! ✨',
    galleryTitle: 'Reizigersgalerij & Foto\'s 📸',
    gallerySub: 'Bekijk foto\'s van mede-ontdekkers en deel uw ervaring!',
    postPhotoBtn: 'Foto Toevoegen 📷',
    likesCount: 'Likes',
    commentsCount: (n: number) => `${n} Reacties`,
    addComment: 'Plaats een reactie...',
    loginPrompt: 'Log in onder Account om uw voortgang op te slaan.'
  },
  en: {
    tabQuest: '🕵️ Weekly Mystery Quest',
    tabRadar: '🛰️ Hot & Cold Radar',
    tabStickers: '🏅 AI Sticker Album',
    tabGallery: '📸 Explorers Gallery',
    heroTag: 'NEW MYSTERY EVERY WEEK',
    heroTitle: 'Great European Detective Hunt & Radar 🗺️',
    heroDesc: 'Every week Tadzik hides a legendary European secret gem. Use satellite radar, decipher clues and win 300 XP & Golden Detective Badge!',
    nextReset: 'Next mystery in:',
    days: 'Days', hours: 'Hours', mins: 'Mins', secs: 'Secs',
    rewardLabel: 'PRIZE: +300 XP & Gold Badge',
    clueRiddle: '1. Poetic Riddle',
    clueRadar: '2. Hot & Cold Radar',
    cluePhoto: '3. Spy Photograph',
    clueTrivia: '4. Trivia & Lifelines',
    readAloud: 'Read Aloud 🎙️',
    stopAudio: 'Stop audio',
    readingNow: "Tadzik's voice is reading the riddle...",
    radarScan: 'Scan Distance 📡',
    radarPrompt: 'Select a reference city to compute distance, direction and search temperature:',
    filterAll: 'All countries',
    distLabel: 'Straight-line distance:',
    bearingLabel: 'Bearing to target:',
    tempBoiling: '🔥 BOILING HOT! You are right there (< 25 km)!',
    tempHot: '☀️ VERY HOT! Very close (25 - 80 km)!',
    tempWarm: '⛅ WARM! Good direction (80 - 200 km)!',
    tempCold: '❄️ COLD! Look in another region (200 - 450 km)!',
    tempFreezing: '🧊 FREEZING! Across the continent (> 450 km)!',
    spyClarity: 'Clarity:',
    zoom: 'Zoom:',
    filterNormal: 'Normal',
    filterNV: 'Night Vision 🟢',
    filterXray: 'X-Ray 🔵',
    filterSepia: 'Sepia 📜',
    lifelinesHeader: "Tadzik's Lifelines 💡",
    lifelineLetters: '🔤 First & last letters',
    lifelineCategory: '🏰 Place Category',
    lifelineLength: '🔢 Character count',
    guessTitle: 'Your Detective Deduction 🎯',
    guessPlaceholder: 'Enter place name (e.g. Giethoorn, Kasteel de Haar, Atomium...)',
    guessBtn: 'Verify Answer 🚀',
    triesLeft: (n: number) => `Attempts left: ${n}/5`,
    quickPicks: 'Quick candidate picks:',
    solvedTitle: '🎉 AWESOME! YOU SOLVED THE MYSTERY!',
    solvedDesc: "This week's secret place is:",
    wrongGuess: (name: string, hint: string) => `"${name}" is incorrect! Tadzik's hint: ${hint}`,
    albumTitle: 'Virtual Travel AI Sticker Album 🤖',
    albumSubtitle: 'Collect unique badges and stickers from European cities!',
    checkinTitle: 'Claim a sticker for your city visit:',
    selectCity: 'Select city:',
    whatDidYouDo: 'What did you do there?:',
    activityPlaceholder: 'e.g. Took a canal cruise and tasted apple pie...',
    stickBtn: 'Stick into Album! ✨',
    galleryTitle: 'Explorers Wall & Community Photos 📸',
    gallerySub: 'See photos from other travelers and share your own!',
    postPhotoBtn: 'Submit Photo 📷',
    likesCount: 'Likes',
    commentsCount: (n: number) => `${n} Comments`,
    addComment: 'Add a comment...',
    loginPrompt: 'Sign in under Account to participate and save achievements.'
  },
  de: {
    tabQuest: '🕵️ Wochen-Rätsel',
    tabRadar: '🛰️ Heiß-Kalt Radar',
    tabStickers: '🏅 KI Sticker-Album',
    tabGallery: '📸 Entdecker-Galerie',
    heroTag: 'JEDE WOCHE EIN NEUER ORT',
    heroTitle: 'Europäische Detektiv-Suche & Radar 🗺️',
    heroDesc: 'Jede Woche versteckt Tadzik einen Geheimtipp in Europa. Nutzen Sie das Entfernungsradar und gewinnen Sie 300 XP!',
    nextReset: 'Nächstes Rätsel in:',
    days: 'Tage', hours: 'Std', mins: 'Min', secs: 'Sek',
    rewardLabel: 'BELOHNUNG: +300 XP & Goldene Badge',
    clueRiddle: '1. Reimgedicht',
    clueRadar: '2. Heiß-Kalt Radar',
    cluePhoto: '3. Spionagefoto',
    clueTrivia: '4. Fakten & Joker',
    readAloud: 'Vorlesen 🎙️',
    stopAudio: 'Ton stoppen',
    readingNow: 'Tadzik liest das Rätsel vor...',
    radarScan: 'Entfernung scannen 📡',
    radarPrompt: 'Wählen Sie eine Stadt, um Distanz und Temperatur zu messen:',
    filterAll: 'Alle Länder',
    distLabel: 'Luftlinie:',
    bearingLabel: 'Richtung:',
    tempBoiling: '🔥 KOCHEND HEISS! Fast am Ziel (< 25 km)!',
    tempHot: '☀️ SEHR HEISS! Ganz nah (25 - 80 km)!',
    tempWarm: '⛅ WARM! Gute Richtung (80 - 200 km)!',
    tempCold: '❄️ KALT! Andere Region wählen (200 - 450 km)!',
    tempFreezing: '🧊 EISKALT! Anderes Ende von Europa (> 450 km)!',
    spyClarity: 'Schärfe:',
    zoom: 'Zoom:',
    filterNormal: 'Normal',
    filterNV: 'Nachtsicht 🟢',
    filterXray: 'Röntgen 🔵',
    filterSepia: 'Sepia 📜',
    lifelinesHeader: 'Tadziks Joker 💡',
    lifelineLetters: '🔤 Erster & letzter Buchstabe',
    lifelineCategory: '🏰 Kategorie',
    lifelineLength: '🔢 Anzahl Buchstaben',
    guessTitle: 'Ihre Antwort 🎯',
    guessPlaceholder: 'Name eingeben (z.B. Giethoorn, Kasteel de Haar, Atomium...)',
    guessBtn: 'Antwort prüfen 🚀',
    triesLeft: (n: number) => `Verbleibende Versuche: ${n}/5`,
    quickPicks: 'Schnellauswahl:',
    solvedTitle: '🎉 HERVORRAGEND! RÄTSEL GELÖST!',
    solvedDesc: 'Der geheime Ort dieser Woche ist:',
    wrongGuess: (name: string, hint: string) => `"${name}" ist leider falsch! Hinweis: ${hint}`,
    albumTitle: 'Virtuelles KI Sticker-Album 🤖',
    albumSubtitle: 'Sammeln Sie einzigartige Abzeichen europäischer Städte!',
    checkinTitle: 'Sticker für Stadtbesuch sichern:',
    selectCity: 'Stadt wählen:',
    whatDidYouDo: 'Was haben Sie dort erlebt?:',
    activityPlaceholder: 'z.B. Bootsfahrt durch die Grachten...',
    stickBtn: 'Ins Album kleben! ✨',
    galleryTitle: 'Entdecker-Galerie & Fotos 📸',
    gallerySub: 'Sehen Sie Fotos anderer Reisender und teilen Sie Ihre eigenen!',
    postPhotoBtn: 'Foto hochladen 📷',
    likesCount: 'Gefällt mir',
    commentsCount: (n: number) => `${n} Kommentare`,
    addComment: 'Kommentar schreiben...',
    loginPrompt: 'Melden Sie sich im Konto-Tab an, um Ihren Fortschritt zu speichern.'
  },
  es: {
    tabQuest: '🕵️ Misterio Semanal',
    tabRadar: '🛰️ Radar Frío-Caliente',
    tabStickers: '🏅 Álbum de Pegatinas AI',
    tabGallery: '📸 Galería de Viajeros',
    heroTag: 'UN NUEVO LUGAR CADA SEMANA',
    heroTitle: 'Gran Búsqueda de Detectives & Radar 🗺️',
    heroDesc: 'Cada semana Tadzik esconde un lugar secreto en Europa. ¡Usa el radar satelital, descifra pistas y gana 300 XP!',
    nextReset: 'Próximo misterio en:',
    days: 'Días', hours: 'Horas', mins: 'Min', secs: 'Seg',
    rewardLabel: 'PREMIO: +300 XP & Insignia de Oro',
    clueRiddle: '1. Acertijo Rimado',
    clueRadar: '2. Radar Frío-Caliente',
    cluePhoto: '3. Foto Espía',
    clueTrivia: '4. Curiosidades & Comodines',
    readAloud: 'Leer en voz alta 🎙️',
    stopAudio: 'Detener audio',
    readingNow: 'Tadzik está leyendo el acertijo...',
    radarScan: 'Escanear Distancia 📡',
    radarPrompt: 'Elige una ciudad de referencia para medir distancia y rumbo:',
    filterAll: 'Todos los países',
    distLabel: 'Distancia en línea recta:',
    bearingLabel: 'Rumbo al objetivo:',
    tempBoiling: '🔥 ¡HIRVIENDO! ¡Estás casi ahí (< 25 km)!',
    tempHot: '☀️ ¡MUY CALIENTE! Muy cerca (25 - 80 km)!',
    tempWarm: '⛅ ¡CALIENTE! Buena dirección (80 - 200 km)!',
    tempCold: '❄️ ¡FRÍO! Busca en otra región (200 - 450 km)!',
    tempFreezing: '🧊 ¡MUY FRÍO! Al otro extremo de Europa (> 450 km)!',
    spyClarity: 'Nitidez:',
    zoom: 'Zoom:',
    filterNormal: 'Normal',
    filterNV: 'Visión Nocturna 🟢',
    filterXray: 'Rayos X 🔵',
    filterSepia: 'Sepia 📜',
    lifelinesHeader: 'Comodines de Tadzik 💡',
    lifelineLetters: '🔤 Primera y última letra',
    lifelineCategory: '🏰 Tipo de lugar',
    lifelineLength: '🔢 Número de letras',
    guessTitle: 'Tu Deducción 🎯',
    guessPlaceholder: 'Escribe el nombre (ej. Giethoorn, Atomium...)',
    guessBtn: 'Comprobar Respuesta 🚀',
    triesLeft: (n: number) => `Intentos restantes: ${n}/5`,
    quickPicks: 'Sugerencias rápidas:',
    solvedTitle: '🎉 ¡GENIAL! ¡MISTERIO RESUELTO!',
    solvedDesc: 'El lugar secreto de esta semana es:',
    wrongGuess: (name: string, hint: string) => `¡"${name}" no es correcto! Pista: ${hint}`,
    albumTitle: 'Álbum Virtual de Pegatinas AI 🤖',
    albumSubtitle: '¡Colecciona insignias y recuerdos de ciudades europeas!',
    checkinTitle: 'Consigue una pegatina por tu visita:',
    selectCity: 'Selecciona ciudad:',
    whatDidYouDo: '¿Qué hiciste allí?:',
    activityPlaceholder: 'ej. Paseo en barco por los canales...',
    stickBtn: '¡Pegar en el Álbum! ✨',
    galleryTitle: 'Muro de Exploradores 📸',
    gallerySub: '¡Descubre fotos de otros viajeros y comparte la tuya!',
    postPhotoBtn: 'Subir Foto 📷',
    likesCount: 'Me gusta',
    commentsCount: (n: number) => `${n} Comentarios`,
    addComment: 'Escribir comentario...',
    loginPrompt: 'Inicia sesión en la pestaña Cuenta para guardar tu progreso.'
  },
  fr: {
    tabQuest: '🕵️ Mystère Hebdomadaire',
    tabRadar: '🛰️ Radar Chaud-Froid',
    tabStickers: '🏅 Album Stickers IA',
    tabGallery: '📸 Galerie des Explorateurs',
    heroTag: 'UN NOUVEAU LIEU CHAQUE SEMAINE',
    heroTitle: 'Grande Chasse aux Mystères & Radar 🗺️',
    heroDesc: 'Chaque semaine, Tadzik cache un lieu secret en Europe. Utilisez le radar satellite, découvrez les indices et gagnez 300 XP!',
    nextReset: 'Prochain mystère dans:',
    days: 'Jours', hours: 'Heures', mins: 'Min', secs: 'Sec',
    rewardLabel: 'PRIX: +300 XP & Badge Or',
    clueRiddle: '1. Énigme Poétique',
    clueRadar: '2. Radar Chaud-Froid',
    cluePhoto: '3. Photo Espion',
    clueTrivia: '4. Anecdotes & Indices Joker',
    readAloud: 'Lecture audio 🎙️',
    stopAudio: 'Arrêter l\'audio',
    readingNow: 'Tadzik lit l\'énigme...',
    radarScan: 'Scanner la distance 📡',
    radarPrompt: 'Sélectionnez une ville pour calculer la distance et le cap:',
    filterAll: 'Tous les pays',
    distLabel: 'Distance à vol d\'oiseau:',
    bearingLabel: 'Direction du cap:',
    tempBoiling: '🔥 BRÛLANT! Vous êtes presque sur place (< 25 km)!',
    tempHot: '☀️ TRÈS CHAUD! Tout près du but (25 - 80 km)!',
    tempWarm: '⛅ TIÈDE! Bonne direction (80 - 200 km)!',
    tempCold: '❄️ FROID! Cherchez dans une autre région (200 - 450 km)!',
    tempFreezing: '🧊 TRÈS FROID! À l\'autre bout de l\'Europe (> 450 km)!',
    spyClarity: 'Clarté:',
    zoom: 'Zoom:',
    filterNormal: 'Normal',
    filterNV: 'Vision Nocturne 🟢',
    filterXray: 'Rayons X 🔵',
    filterSepia: 'Sépia 📜',
    lifelinesHeader: 'Indices Joker de Tadzik 💡',
    lifelineLetters: '🔤 Première & dernière lettre',
    lifelineCategory: '🏰 Catégorie du lieu',
    lifelineLength: '🔢 Nombre de lettres',
    guessTitle: 'Votre Déduction 🎯',
    guessPlaceholder: 'Nom du lieu (ex. Giethoorn, Atomium...)',
    guessBtn: 'Vérifier la Réponse 🚀',
    triesLeft: (n: number) => `Tentatives restantes: ${n}/5`,
    quickPicks: 'Suggestions rapides:',
    solvedTitle: '🎉 FÉLICITATIONS! MYSTÈRE RÉSOLU!',
    solvedDesc: 'Le lieu secret de la semaine est:',
    wrongGuess: (name: string, hint: string) => `"${name}" n'est pas correct! Indice: ${hint}`,
    albumTitle: 'Album Virtuel de Stickers IA 🤖',
    albumSubtitle: 'Collectionnez des badges uniques des villes d\'Europe!',
    checkinTitle: 'Obtenir un sticker pour votre visite:',
    selectCity: 'Choisir la ville:',
    whatDidYouDo: 'Qu\'avez-vous fait là-bas?:',
    activityPlaceholder: 'ex. Balade en bateau sur les canaux...',
    stickBtn: 'Coller dans l\'Album! ✨',
    galleryTitle: 'Mur des Explorateurs 📸',
    gallerySub: 'Découvrez les photos des voyageurs et partagez la vôtre!',
    postPhotoBtn: 'Ajouter une Photo 📷',
    likesCount: 'J\'aime',
    commentsCount: (n: number) => `${n} Commentaires`,
    addComment: 'Ajouter un commentaire...',
    loginPrompt: 'Connectez-vous dans l\'onglet Compte pour enregistrer vos points.'
  },
  ro: {
    tabQuest: '🕵️ Misterul Săptămânii',
    tabRadar: '🛰️ Radar Cald-Rece',
    tabStickers: '🏅 Album Stickere AI',
    tabGallery: '📸 Galeria Exploratorilor',
    heroTag: 'LOC SECRET NOU ÎN FIECARE SĂPTĂMÂNĂ',
    heroTitle: 'Marea Misiune Detectiv & Radar 🗺️',
    heroDesc: 'În fiecare săptămână Tadzik ascunde un loc secret în Europa. Folosește radarul de distanță și câștigă 300 XP!',
    nextReset: 'Următorul mister în:',
    days: 'Zile', hours: 'Ore', mins: 'Min', secs: 'Sec',
    rewardLabel: 'PREMIU: +300 XP & Insignă de Aur',
    clueRiddle: '1. Ghicitoare în Versuri',
    clueRadar: '2. Radar Cald-Rece',
    cluePhoto: '3. Poză Spion',
    clueTrivia: '4. Secrete & Ajutoare',
    readAloud: 'Citește cu voce tare 🎙️',
    stopAudio: 'Oprește vocea',
    readingNow: 'Vocea lui Tadzik citește ghicitoarea...',
    radarScan: 'Scanează Distanța 📡',
    radarPrompt: 'Alege un oraș de referință pentru a calcula distanța și direcția:',
    filterAll: 'Toate țările',
    distLabel: 'Distanță în linie dreaptă:',
    bearingLabel: 'Direcția spre țintă:',
    tempBoiling: '🔥 FIERBINTE! Ești aproape acolo (< 25 km)!',
    tempHot: '☀️ FOARTE CALD! Foarte aproape (25 - 80 km)!',
    tempWarm: '⛅ CĂLDUȚ! Direcție bună (80 - 200 km)!',
    tempCold: '❄️ RECE! Caută în altă regiune (200 - 450 km)!',
    tempFreezing: '🧊 ÎNGHEȚAT! În celălalt capăt al Europei (> 450 km)!',
    spyClarity: 'Claritate:',
    zoom: 'Zoom:',
    filterNormal: 'Normal',
    filterNV: 'Vedere de Noapte 🟢',
    filterXray: 'Raze X 🔵',
    filterSepia: 'Sepia 📜',
    lifelinesHeader: 'Ajutoarele lui Tadzik 💡',
    lifelineLetters: '🔤 Prima și ultima literă',
    lifelineCategory: '🏰 Categoria locului',
    lifelineLength: '🔢 Număr de litere',
    guessTitle: 'Răspunsul Tău 🎯',
    guessPlaceholder: 'Introdu numele (ex. Giethoorn, Atomium...)',
    guessBtn: 'Verifică Răspunsul 🚀',
    triesLeft: (n: number) => `Încercări rămase: ${n}/5`,
    quickPicks: 'Sugestii rapide:',
    solvedTitle: '🎉 FELICITĂRI! AI REZOLVAT MISTERUL!',
    solvedDesc: 'Locul secret de săptămâna aceasta este:',
    wrongGuess: (name: string, hint: string) => `"${name}" este incorect! Indiciu: ${hint}`,
    albumTitle: 'Album Virtual de Stickere AI 🤖',
    albumSubtitle: 'Colecționează insigne din marile orașe europene!',
    checkinTitle: 'Primește un autocolant pentru vizita ta:',
    selectCity: 'Selectează orașul:',
    whatDidYouDo: 'Ce ai făcut acolo?:',
    activityPlaceholder: 'ex. M-am plimbat cu barca pe canale...',
    stickBtn: 'Lipește în Album! ✨',
    galleryTitle: 'Galeria Exploratorilor 📸',
    gallerySub: 'Vezi fotografiile altor călători și trimite propria poză!',
    postPhotoBtn: 'Încarcă Poză 📷',
    likesCount: 'Aprecieri',
    commentsCount: (n: number) => `${n} Comentarii`,
    addComment: 'Adaugă un comentariu...',
    loginPrompt: 'Autentifică-te în fila Cont pentru a salva progresul.'
  },
  zh: {
    tabQuest: '🕵️ 每周秘境搜寻',
    tabRadar: '🛰️ 冷热卫星雷达',
    tabStickers: '🏅 AI 徽章画册',
    tabGallery: '📸 探索者打卡墙',
    heroTag: '每周一解锁全新神秘宝藏地',
    heroTitle: '欧洲名胜大侦探探索 & 雷达搜寻 🗺️',
    heroDesc: '每周 Tadzik 将在欧洲地图隐藏一处秘境。使用冷热卫星雷达，解开诗歌谜语，赢取 300 经验值与金牌大侦探勋章！',
    nextReset: '下期秘境倒计时：',
    days: '天', hours: '小时', mins: '分', secs: '秒',
    rewardLabel: '本周奖励：+300 XP & 金牌勋章',
    clueRiddle: '1. 诗意押韵谜题',
    clueRadar: '2. 冷热距离雷达',
    cluePhoto: '3. 间谍照片分析',
    clueTrivia: '4. 历史秘闻与锦囊',
    readAloud: '朗读谜题 🎙️',
    stopAudio: '停止播放',
    readingNow: '专属向导正在朗读谜题...',
    radarScan: '扫描距离 📡',
    radarPrompt: '选择参考城市，雷达将实时计算与秘境的直线距离与搜寻热度：',
    filterAll: '全部国家',
    distLabel: '直线距离：',
    bearingLabel: '方位角：',
    tempBoiling: '🔥 滚烫滚烫！您几乎已经抵达目的地了 (< 25 公里)！',
    tempHot: '☀️ 火热！距离非常接近 (25 - 80 公里)！',
    tempWarm: '⛅ 温热！方向正确，继续前行 (80 - 200 公里)！',
    tempCold: '❄️ 寒冷！请尝试搜索其他大区 (200 - 450 公里)！',
    tempFreezing: '🧊 冰冻极寒！您正在欧洲另一端 (> 450 公里)！',
    spyClarity: '清晰度：',
    zoom: '缩放：',
    filterNormal: '原色',
    filterNV: '夜视绿光 🟢',
    filterXray: '透视蓝光 🔵',
    filterSepia: '复古暖棕 📜',
    lifelinesHeader: 'Tadzik 侦探锦囊 💡',
    lifelineLetters: '🔤 首尾字母提示',
    lifelineCategory: '🏰 景点类型分类',
    lifelineLength: '🔢 字符字数提示',
    guessTitle: '您的侦探推断答案 🎯',
    guessPlaceholder: '输入地名（例如：羊角村、德哈尔城堡、原子球塔...）',
    guessBtn: '提交我的答案 🚀',
    triesLeft: (n: number) => `剩余竞猜机会：${n}/5 次`,
    quickPicks: '热门候选项快捷输入：',
    solvedTitle: '🎉 恭喜！您成功破解了本周神秘秘境！',
    solvedDesc: '本周的神秘宝藏地点是：',
    wrongGuess: (name: string, hint: string) => `很遗憾，“${name}”不是正确答案！提示：${hint}`,
    albumTitle: '虚拟 AI 旅行徽章贴纸画册 🤖',
    albumSubtitle: '打卡并收集欧洲各大城市的专属荣誉贴纸！',
    checkinTitle: '打卡获取城市专属贴纸：',
    selectCity: '选择城市：',
    whatDidYouDo: '您在那里体验了什么？：',
    activityPlaceholder: '例如：乘坐游船穿梭于风景如画的运河...',
    stickBtn: '贴入画册！✨',
    galleryTitle: '探索者打卡长廊 📸',
    gallerySub: '浏览其他旅行者的实地探险照片，分享您的足迹！',
    postPhotoBtn: '上传照片 📷',
    likesCount: '点赞',
    commentsCount: (n: number) => `${n} 条评论`,
    addComment: '写下您的旅行心得...',
    loginPrompt: '请在“账户”页面登录以保存您的成就和贴纸。'
  }
};

type ActiveViewMode = 'quest' | 'radar' | 'stickers' | 'gallery';

export default function ChallengesTab({ language, account }: ChallengesTabProps) {
  const ui = UI_TEXT[language] || UI_TEXT.en;
  const [activeView, setActiveView] = useState<ActiveViewMode>('quest');

  // Weekly mystery spot computation
  const weeklyInfo = useMemo(() => getWeeklyMysteryForDate(), []);
  const currentSpot: MysterySpot = weeklyInfo.spot;

  // Live countdown timer to next mystery reset
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = weeklyInfo.nextResetDate.getTime() - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weeklyInfo.nextResetDate]);

  // Solved state storage
  const solvedStorageKey = `solved_mystery_${weeklyInfo.year}_w${weeklyInfo.weekNumber}_${account?.username || 'guest'}`;
  const [isSolved, setIsSolved] = useState<boolean>(() => {
    try {
      return localStorage.getItem(solvedStorageKey) === 'true';
    } catch {
      return false;
    }
  });

  // Hot-or-Cold Radar State
  const [selectedRadarCity, setSelectedRadarCity] = useState<string>(RADAR_REFERENCE_CITIES[0].name);
  const [radarCountryFilter, setRadarCountryFilter] = useState<'all' | 'pl' | 'nl' | 'be' | 'de' | 'fr'>('all');
  const [isRadarScanning, setIsRadarScanning] = useState(false);
  const [radarResult, setRadarResult] = useState<{ 
    distanceKm: number; 
    bearing: string; 
    bearingDegrees: number; 
    tempRating: 'boiling' | 'hot' | 'warm' | 'cold' | 'freezing';
  } | null>(null);

  // Photo Lab State
  const [clarityLevel, setClarityLevel] = useState<number>(30);
  const [photoFilter, setPhotoFilter] = useState<'normal' | 'nightvision' | 'xray' | 'sepia'>('normal');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Guessing Arena State
  const [userGuessInput, setUserGuessInput] = useState<string>('');
  const [remainingTries, setRemainingTries] = useState<number>(5);
  const [wrongGuessMsg, setWrongGuessMsg] = useState<string | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  // Lifelines
  const [unlockedLifelines, setUnlockedLifelines] = useState({
    letters: false,
    category: false,
    count: false
  });

  // Filtered radar cities based on country filter
  const filteredRadarCities = useMemo(() => {
    if (radarCountryFilter === 'all') return RADAR_REFERENCE_CITIES;
    return RADAR_REFERENCE_CITIES.filter(c => c.countryCode === radarCountryFilter);
  }, [radarCountryFilter]);

  // Handler: Scan radar distance
  const handleTestRadar = (cityName?: string) => {
    const targetCityName = cityName || selectedRadarCity;
    const city = RADAR_REFERENCE_CITIES.find(c => c.name.toLowerCase() === targetCityName.toLowerCase()) || RADAR_REFERENCE_CITIES[0];
    
    setIsRadarScanning(true);
    setTimeout(() => {
      const dist = calculateDistanceKm(city.lat, city.lng, currentSpot.lat, currentSpot.lng);
      const bearing = calculateBearing(city.lat, city.lng, currentSpot.lat, currentSpot.lng);
      const bearingDegrees = calculateBearingDegrees(city.lat, city.lng, currentSpot.lat, currentSpot.lng);

      let tempRating: 'boiling' | 'hot' | 'warm' | 'cold' | 'freezing' = 'freezing';
      if (dist <= 25) tempRating = 'boiling';
      else if (dist <= 80) tempRating = 'hot';
      else if (dist <= 200) tempRating = 'warm';
      else if (dist <= 450) tempRating = 'cold';
      else tempRating = 'freezing';

      setRadarResult({ distanceKm: dist, bearing, bearingDegrees, tempRating });
      setIsRadarScanning(false);
    }, 400);
  };

  // Check User Guess
  const handleCheckGuess = () => {
    const cleanGuess = userGuessInput.trim().toLowerCase();
    if (!cleanGuess) return;

    const targetName = currentSpot.name.toLowerCase();
    const spotAliases = [
      targetName,
      targetName.replace('kasteel ', ''),
      targetName.replace('zamek ', ''),
      targetName.replace('burg ', ''),
      targetName.replace('bruxelles', 'brussels'),
      targetName.replace('bruxelles', 'bruksela')
    ];

    const isMatch = spotAliases.some(alias => cleanGuess.includes(alias) || alias.includes(cleanGuess));

    if (isMatch) {
      setIsSolved(true);
      setShowVictoryModal(true);
      setWrongGuessMsg(null);
      try {
        localStorage.setItem(solvedStorageKey, 'true');
        const mysterySticker = {
          id: `sticker-mystery-${currentSpot.id}`,
          city: currentSpot.name,
          emoji: currentSpot.badgeEmoji,
          title: currentSpot.badgeTitle[language] || currentSpot.badgeTitle.pl,
          gradient: 'from-amber-400 to-yellow-600',
          congrats: `Zwycięzca Tajemnicy Tygodnia ${weeklyInfo.weekNumber}! Doskonała robota detektywistyczna!`
        };
        const updated = [...stickers.filter((s: any) => s.id !== mysterySticker.id), mysterySticker];
        setStickers(updated);
        localStorage.setItem('nl_tourist_planner_stickers', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    } else {
      const nextTries = remainingTries - 1;
      setRemainingTries(Math.max(0, nextTries));
      const hint = currentSpot.clueTerrain[language] || currentSpot.clueTerrain.pl;
      setWrongGuessMsg(ui.wrongGuess(userGuessInput, hint));
    }
  };

  // Community & Photos
  const [challenges, setChallenges] = useState<ChallengeEntry[]>(() => {
    try {
      const stored = localStorage.getItem('nl_tourist_planner_challenges');
      return stored ? JSON.parse(stored) : SEEDED_CHALLENGES;
    } catch {
      return SEEDED_CHALLENGES;
    }
  });

  const [submitterName, setSubmitterName] = useState('');
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});

  // AI Sticker Album states
  const [stickers, setStickers] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('nl_tourist_planner_stickers');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [checkinCity, setCheckinCity] = useState('Amsterdam');
  const [userActivity, setUserActivity] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedAlert, setClaimedAlert] = useState<any | null>(null);

  const handleAwardSticker = async () => {
    if (!userActivity.trim()) return;
    setIsClaiming(true);
    setClaimedAlert(null);
    try {
      const res = await fetch('/api/contests/award-sticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityOrAttraction: checkinCity,
          userActivity: userActivity,
          language: language
        })
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      if (data && data.stickerTitle) {
        const newSticker = {
          id: 'sticker-' + Date.now(),
          city: checkinCity,
          emoji: data.emoji || '🏅',
          title: data.stickerTitle,
          gradient: data.gradient || 'from-yellow-400 to-amber-600',
          congrats: data.aiCongratulations || 'Świetna robota!'
        };
        const updated = [...stickers, newSticker];
        setStickers(updated);
        localStorage.setItem('nl_tourist_planner_stickers', JSON.stringify(updated));
        setClaimedAlert(newSticker);
        setUserActivity('');
      } else {
        throw new Error('Invalid response');
      }
    } catch {
      const fallbackSticker = {
        id: 'sticker-fb-' + Date.now(),
        city: checkinCity,
        emoji: '🏅',
        title: `${checkinCity} Explorer`,
        gradient: 'from-amber-400 to-orange-500',
        congrats: 'Gratulacje z okazji odwiedzenia wspaniałego miejsca!'
      };
      const updated = [...stickers, fallbackSticker];
      setStickers(updated);
      localStorage.setItem('nl_tourist_planner_stickers', JSON.stringify(updated));
      setClaimedAlert(fallbackSticker);
      setUserActivity('');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleLikeEntry = (entryIndex: number) => {
    const activeChallenge = challenges[0];
    const voteKey = `${activeChallenge.id}-${entryIndex}`;
    if (hasVoted[voteKey]) return;

    const updated = challenges.map((c, idx) => {
      if (idx === 0) {
        const photos = [...c.participantPhotos];
        photos[entryIndex] = {
          ...photos[entryIndex],
          hearts: photos[entryIndex].hearts + 1
        };
        return { ...c, participantPhotos: photos };
      }
      return c;
    });

    setChallenges(updated);
    try {
      localStorage.setItem('nl_tourist_planner_challenges', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setHasVoted({ ...hasVoted, [voteKey]: true });
  };

  const handleAddComment = (entryIndex: number, e: React.FormEvent) => {
    e.preventDefault();
    const activeChallenge = challenges[0];
    const inputKey = `${activeChallenge.id}-${entryIndex}`;
    const txt = commentText[inputKey];
    if (!txt || !txt.trim()) return;

    const commenter = account ? account.username : (submitterName.trim() || 'Podróżnik');

    const updated = challenges.map((c, idx) => {
      if (idx === 0) {
        const photos = [...c.participantPhotos];
        photos[entryIndex] = {
          ...photos[entryIndex],
          comments: [...photos[entryIndex].comments, `${commenter}: ${txt.trim()}`]
        };
        return { ...c, participantPhotos: photos };
      }
      return c;
    });

    setChallenges(updated);
    try {
      localStorage.setItem('nl_tourist_planner_challenges', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setCommentText({ ...commentText, [inputKey]: '' });
  };

  const albumCities = [
    { name: 'Amsterdam', flag: '🇳🇱', defaultEmoji: '🚲' },
    { name: 'Rotterdam', flag: '🇳🇱', defaultEmoji: '🚢' },
    { name: 'Bruxelles', flag: '🇧🇪', defaultEmoji: '🇧🇪' },
    { name: 'Kraków', flag: '🇵🇱', defaultEmoji: '🏰' },
    { name: 'Berlin', flag: '🇩🇪', defaultEmoji: '🐻' },
    { name: 'Paris', flag: '🇫🇷', defaultEmoji: '🗼' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12" id="challenges-tab-root">

      {/* 1. TOP HERO HEADER - VIBRANT MISSION CONTROL */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white p-6 md:p-8 border-2 border-indigo-500/40 shadow-2xl">
        {/* Glowing radar grid effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg">
              <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>{ui.heroTag}</span>
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
              {ui.heroTitle}
            </h1>

            <p className="text-slate-200 text-sm md:text-base leading-relaxed font-medium">
              {ui.heroDesc}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="bg-indigo-900/80 border border-indigo-400/40 px-3 py-1.5 rounded-xl text-xs font-black text-indigo-200 shadow-sm flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-indigo-300" />
                <span>Tydzień {weeklyInfo.weekNumber} • {weeklyInfo.year}</span>
              </span>
              <span className="bg-amber-400 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs shadow-sm flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>{ui.rewardLabel}</span>
              </span>
            </div>

            <div className="pt-2">
              <SectionTravelCompanion language={language} vehicle="train" />
            </div>
          </div>

          {/* Live Countdown Card */}
          <div className="w-full md:w-auto bg-slate-900/95 border-2 border-indigo-400/40 p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center backdrop-blur-md shrink-0">
            <div className="flex items-center gap-1.5 text-amber-400 font-black text-xs uppercase tracking-wider mb-2.5">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>{ui.nextReset}</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="bg-slate-950 border border-indigo-800/60 px-3 py-2 rounded-xl text-center">
                <span className="text-xl md:text-2xl font-black text-white block">{timeLeft.days}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">{ui.days}</span>
              </div>
              <div className="bg-slate-950 border border-indigo-800/60 px-3 py-2 rounded-xl text-center">
                <span className="text-xl md:text-2xl font-black text-white block">{timeLeft.hours}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">{ui.hours}</span>
              </div>
              <div className="bg-slate-950 border border-indigo-800/60 px-3 py-2 rounded-xl text-center">
                <span className="text-xl md:text-2xl font-black text-white block">{timeLeft.minutes}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">{ui.mins}</span>
              </div>
              <div className="bg-slate-950 border border-indigo-800/60 px-3 py-2 rounded-xl text-center">
                <span className="text-xl md:text-2xl font-black text-amber-400 block">{timeLeft.seconds}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">{ui.secs}</span>
              </div>
            </div>

            {isSolved && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-black text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ROZWIĄZANE ✔️ (+300 XP)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MODE NAVIGATION TABS (VIBRANT & EASY TO SWITCH) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setActiveView('quest')}
          className={`py-3 px-4 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeView === 'quest'
              ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>{ui.tabQuest}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('radar')}
          className={`py-3 px-4 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeView === 'radar'
              ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>{ui.tabRadar}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('stickers')}
          className={`py-3 px-4 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeView === 'stickers'
              ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>{ui.tabStickers}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('gallery')}
          className={`py-3 px-4 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeView === 'gallery'
              ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>{ui.tabGallery}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: MYSTERY QUEST & DETECTIVE CLUES DOSSIER */}
      {/* ========================================================================= */}
      {activeView === 'quest' && (
        <div className="space-y-6">
          
          {/* 4 Interactive Clues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* CLUE 1: POETIC RIDDLE */}
            <div className="bg-white rounded-3xl border-2 border-amber-300/80 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-lg font-black">
                      📜
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      {ui.clueRiddle}
                    </h3>
                  </div>
                  <span className="text-[11px] bg-amber-100 text-amber-900 font-black px-2.5 py-1 rounded-full uppercase">
                    {currentSpot.difficulty}
                  </span>
                </div>

                <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50/60 border border-amber-200 rounded-2xl text-slate-800 text-sm leading-relaxed italic font-serif relative shadow-inner">
                  <span className="text-4xl text-amber-300/80 absolute top-1 left-2 font-black leading-none select-none">“</span>
                  <p className="relative z-10 pl-4 font-semibold text-slate-900">
                    {currentSpot.riddle[language] || currentSpot.riddle.pl}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                <span className="font-bold">Kraj: {currentSpot.flag} {currentSpot.country}</span>
                <span className="font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">Zagadka podróżnika</span>
              </div>
            </div>

            {/* CLUE 2: RADAR PREVIEW (CLICK TO SCAN) */}
            <div className="bg-white rounded-3xl border-2 border-indigo-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-black">
                      🛰️
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      {ui.clueRadar}
                    </h3>
                  </div>
                  <span className="text-[11px] bg-indigo-100 text-indigo-800 font-black px-2.5 py-1 rounded-full uppercase">
                    Satelita Live
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium">
                  {ui.radarPrompt}
                </p>

                <div className="flex gap-2">
                  <select
                    value={selectedRadarCity}
                    onChange={(e) => {
                      setSelectedRadarCity(e.target.value);
                      handleTestRadar(e.target.value);
                    }}
                    className="flex-1 text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    {RADAR_REFERENCE_CITIES.map(c => (
                      <option key={c.name} value={c.name}>
                        {c.flag} {c.name} ({c.country})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleTestRadar()}
                    disabled={isRadarScanning}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Radio className={`w-3.5 h-3.5 ${isRadarScanning ? 'animate-spin' : ''}`} />
                    <span>{ui.radarScan}</span>
                  </button>
                </div>

                {/* Radar readout */}
                {radarResult && (
                  <div className={`p-3.5 rounded-2xl border-2 animate-fadeIn space-y-2 ${
                    radarResult.tempRating === 'boiling'
                      ? 'bg-rose-50 border-rose-300 text-rose-950'
                      : radarResult.tempRating === 'hot'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : radarResult.tempRating === 'warm'
                      ? 'bg-yellow-50 border-yellow-300 text-yellow-950'
                      : radarResult.tempRating === 'cold'
                      ? 'bg-blue-50 border-blue-200 text-blue-950'
                      : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-indigo-400/50 flex items-center justify-center">
                          <Navigation 
                            className="w-4 h-4 text-rose-400 transition-transform duration-500" 
                            style={{ transform: `rotate(${radarResult.bearingDegrees}deg)` }}
                          />
                        </div>
                        <div>
                          <div className="text-xs font-black">{radarResult.bearing} ({radarResult.bearingDegrees}°)</div>
                          <div className="text-[10px] text-slate-500">Kierunek ze stacji</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black">{radarResult.distanceKm} km</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">W linii prostej</div>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-black/10 font-bold text-xs">
                      {radarResult.tempRating === 'boiling' && ui.tempBoiling}
                      {radarResult.tempRating === 'hot' && ui.tempHot}
                      {radarResult.tempRating === 'warm' && ui.tempWarm}
                      {radarResult.tempRating === 'cold' && ui.tempCold}
                      {radarResult.tempRating === 'freezing' && ui.tempFreezing}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveView('radar')}
                  className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Otwórz pełny ekran radaru</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CLUE 3: SPY PHOTO LAB */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-lg font-black">
                      🔍
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      {ui.cluePhoto}
                    </h3>
                  </div>
                  <span className="text-[11px] bg-slate-100 text-slate-800 font-black px-2.5 py-1 rounded-full">
                    {ui.spyClarity} {clarityLevel}%
                  </span>
                </div>

                {/* Filter and Zoom controls */}
                <div className="flex items-center justify-between gap-1 flex-wrap text-xs">
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'normal' as const, label: ui.filterNormal },
                      { id: 'nightvision' as const, label: ui.filterNV },
                      { id: 'xray' as const, label: ui.filterXray },
                      { id: 'sepia' as const, label: ui.filterSepia }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setPhotoFilter(f.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                          photoFilter === f.id
                            ? 'bg-slate-950 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      type="button"
                      onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.5))}
                      disabled={zoomLevel <= 1}
                      className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-black text-slate-700 px-1">{zoomLevel}x</span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.5))}
                      disabled={zoomLevel >= 2.5}
                      className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Spy Photo Render Box */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-300 shadow-inner">
                  <img
                    src={currentSpot.photoUrl}
                    alt="Mystery Spy Clue"
                    referrerPolicy="no-referrer"
                    style={{
                      filter: `blur(${(100 - clarityLevel) / 8}px) contrast(${100 + (clarityLevel / 2)}%) ${
                        photoFilter === 'nightvision'
                          ? 'hue-rotate(90deg) saturate(200%) brightness(120%)'
                          : photoFilter === 'xray'
                          ? 'invert(100%) hue-rotate(180deg)'
                          : photoFilter === 'sepia'
                          ? 'sepia(100%) contrast(110%)'
                          : ''
                      }`,
                      transform: `scale(${zoomLevel})`,
                      transition: 'filter 0.3s ease, transform 0.3s ease'
                    }}
                    className="w-full h-full object-cover select-none"
                  />
                  
                  {photoFilter === 'nightvision' && (
                    <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none border-2 border-emerald-500/30">
                      <span className="absolute top-2 left-2 text-[9px] font-mono text-emerald-400 font-bold bg-black/70 px-1.5 py-0.5 rounded">
                        NV-MODE // ACTIVE
                      </span>
                    </div>
                  )}
                </div>

                {/* Slider / Preset clarity */}
                <div className="flex items-center gap-2 pt-1">
                  {[25, 50, 75, 100].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setClarityLevel(lvl)}
                      className={`flex-1 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                        clarityLevel === lvl
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {lvl}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CLUE 4: TRIVIA & LIFELINES */}
            <div className="bg-white rounded-3xl border-2 border-emerald-300/80 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center text-lg font-black">
                      💡
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      {ui.clueTrivia}
                    </h3>
                  </div>
                  <span className="text-[11px] bg-emerald-100 text-emerald-900 font-black px-2.5 py-1 rounded-full">
                    Kronika
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800">
                    <strong className="block font-black text-slate-900 mb-0.5">🌿 Ukształtowanie:</strong>
                    <p>{currentSpot.clueTerrain[language] || currentSpot.clueTerrain.pl}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800">
                    <strong className="block font-black text-slate-900 mb-0.5">📜 Historia:</strong>
                    <p>{currentSpot.clueHistory[language] || currentSpot.clueHistory.pl}</p>
                  </div>
                </div>

                {/* Lifeline buttons */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="text-[11px] font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{ui.lifelinesHeader}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setUnlockedLifelines(prev => ({ ...prev, letters: true }))}
                      className={`p-2 rounded-xl border text-[10px] font-black transition-all cursor-pointer ${
                        unlockedLifelines.letters
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {unlockedLifelines.letters ? `${currentSpot.name[0]}...${currentSpot.name[currentSpot.name.length - 1]}` : ui.lifelineLetters}
                    </button>

                    <button
                      type="button"
                      onClick={() => setUnlockedLifelines(prev => ({ ...prev, category: true }))}
                      className={`p-2 rounded-xl border text-[10px] font-black transition-all cursor-pointer ${
                        unlockedLifelines.category
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {unlockedLifelines.category ? 'Zabytek / Natura' : ui.lifelineCategory}
                    </button>

                    <button
                      type="button"
                      onClick={() => setUnlockedLifelines(prev => ({ ...prev, count: true }))}
                      className={`p-2 rounded-xl border text-[10px] font-black transition-all cursor-pointer ${
                        unlockedLifelines.count
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {unlockedLifelines.count ? `${currentSpot.name.length} znaków` : ui.lifelineLength}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 3. GUESSING & DEDUCTION ARENA */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 border-2 border-indigo-500/50 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                  <span>🎯</span>
                  <span>{ui.guessTitle}</span>
                </h2>
                <p className="text-xs md:text-sm text-slate-300 font-medium">
                  Wpisz nazwę tajemniczego miejsca lub wybierz z propozycji poniżej.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-indigo-900 border border-indigo-400/40 px-3.5 py-1.5 rounded-xl text-xs font-black text-amber-300 shadow">
                  {ui.triesLeft(remainingTries)}
                </span>
              </div>
            </div>

            {isSolved ? (
              <div className="bg-emerald-950/90 border-2 border-emerald-400 p-6 rounded-2xl text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl mx-auto shadow-xl animate-bounce">
                  {currentSpot.badgeEmoji}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-emerald-300">
                    {ui.solvedTitle}
                  </h3>
                  <p className="text-sm text-slate-200 font-bold max-w-lg mx-auto">
                    {ui.solvedDesc} <span className="text-amber-300 underline text-base font-black">{currentSpot.name} ({currentSpot.country})</span>!
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 bg-slate-900 border border-amber-400/50 px-4 py-2 rounded-xl text-amber-300 font-black text-sm shadow">
                  <span>🏆 Odznaka:</span>
                  <span className="text-white">{currentSpot.badgeTitle[language] || currentSpot.badgeTitle.pl} (+300 XP)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={userGuessInput}
                    onChange={(e) => setUserGuessInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckGuess()}
                    placeholder={ui.guessPlaceholder}
                    className="flex-1 bg-slate-950 border-2 border-slate-700 focus:border-indigo-400 text-white px-4 py-3.5 rounded-2xl text-sm font-bold outline-none shadow-inner"
                  />

                  <button
                    onClick={handleCheckGuess}
                    disabled={remainingTries <= 0 || !userGuessInput.trim()}
                    className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm px-6 py-3.5 rounded-2xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider shrink-0 disabled:opacity-50"
                  >
                    <span>{ui.guessBtn}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick candidate chips */}
                <div className="space-y-2">
                  <span className="text-[11px] uppercase font-black text-slate-400 block">
                    {ui.quickPicks}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Giethoorn',
                      'Kinderdijk',
                      'Kasteel de Haar',
                      'Atomium Bruxelles',
                      'Zaanse Schans',
                      'Burg Eltz',
                      'Dinant',
                      'Zamek Wawel',
                      'Keukenhof'
                    ].map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setUserGuessInput(name)}
                        className="bg-slate-800/90 hover:bg-indigo-600 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                      >
                        📍 {name}
                      </button>
                    ))}
                  </div>
                </div>

                {wrongGuessMsg && (
                  <div className="p-4 bg-rose-950/90 border border-rose-500 rounded-2xl text-rose-200 text-xs animate-fadeIn space-y-1">
                    <p className="font-black text-sm">{wrongGuessMsg}</p>
                    <p className="text-rose-300 text-xs font-medium">
                      Wskazówka: Użyj Radaru Satelitarnego powyżej lub sprawdź podpowiedzi geograficzne!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: DEDICATED FULL-SCREEN SATELLITE RADAR CONSOLE */}
      {/* ========================================================================= */}
      {activeView === 'radar' && (
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 md:p-8 border-2 border-indigo-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-800/40 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Konsola Radaru Europejskiego 🛰️</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                Satelitarny Skaner Odległości "Ciepło - Zimno"
              </h2>
            </div>

            {/* Country Selector for Radar */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { code: 'all' as const, label: 'Wszystkie 🌍' },
                { code: 'pl' as const, label: '🇵🇱 Polska' },
                { code: 'nl' as const, label: '🇳🇱 Holandia' },
                { code: 'be' as const, label: '🇧🇪 Belgia' },
                { code: 'de' as const, label: '🇩🇪 Niemcy' },
                { code: 'fr' as const, label: '🇫🇷 Francja' }
              ].map(item => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setRadarCountryFilter(item.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    radarCountryFilter === item.code
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Radar Visualizer Circle & HUD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left: Animated Radar HUD */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-3xl border-2 border-indigo-500/30 relative overflow-hidden shadow-inner">
              
              {/* Radar circular screen */}
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full border-4 border-emerald-500/50 bg-slate-950 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden">
                
                {/* Concentric rings */}
                <div className="absolute w-52 h-52 rounded-full border border-emerald-500/20" />
                <div className="absolute w-36 h-36 rounded-full border border-emerald-500/30" />
                <div className="absolute w-20 h-20 rounded-full border border-emerald-500/40" />
                <div className="absolute w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                
                {/* Crosshairs */}
                <div className="absolute inset-x-0 h-px bg-emerald-500/30" />
                <div className="absolute inset-y-0 w-px bg-emerald-500/30" />

                {/* Rotating Sweep Beam */}
                <div 
                  className="absolute inset-0 rounded-full pointer-events-none origin-center animate-spin"
                  style={{
                    animationDuration: '4s',
                    background: 'conic-gradient(from 0deg, rgba(16,185,129,0.4) 0deg, rgba(16,185,129,0) 60deg, transparent 360deg)'
                  }}
                />

                {/* Dynamic Blip if scanned */}
                {radarResult && (
                  <div 
                    className="absolute w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-[0_0_15px_#f43f5e] animate-ping"
                    style={{
                      transform: `translate(${Math.min(90, radarResult.distanceKm / 5)}px, -${Math.min(90, radarResult.distanceKm / 6)}px)`
                    }}
                  />
                )}

                {/* Compass markers */}
                <span className="absolute top-2 text-[10px] font-black text-emerald-400 font-mono">N (0°)</span>
                <span className="absolute bottom-2 text-[10px] font-black text-emerald-400 font-mono">S (180°)</span>
                <span className="absolute left-2 text-[10px] font-black text-emerald-400 font-mono">W (270°)</span>
                <span className="absolute right-2 text-[10px] font-black text-emerald-400 font-mono">E (90°)</span>
              </div>

              {/* Status footer */}
              <div className="mt-4 flex items-center justify-between w-full text-xs font-mono text-emerald-400 px-2">
                <span>RADAR STATUS: ACTIVE</span>
                <span>RANGE: 1500 KM</span>
              </div>
            </div>

            {/* Right: City Picker & Live Thermal Telemetry */}
            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-slate-300">
                  Wybierz stację pomiarową i kliknij "Zeskanuj":
                </span>
                
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {filteredRadarCities.map(city => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => {
                        setSelectedRadarCity(city.name);
                        handleTestRadar(city.name);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        selectedRadarCity === city.name
                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-300/40'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <span>{city.flag} {city.name}</span>
                      <span className="text-[10px] opacity-70">{city.country}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Radar Result Telemetry Card */}
              {radarResult && (
                <div className="bg-slate-900 border-2 border-indigo-400/40 p-5 rounded-2xl space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div>
                      <div className="text-xs text-slate-400 font-bold">Stacja Pomiarowa:</div>
                      <div className="text-sm font-black text-white">{selectedRadarCity}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-bold">Odległość:</div>
                      <div className="text-lg font-black text-amber-400">{radarResult.distanceKm} km</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Azymut do celu:</span>
                    <span className="font-black text-indigo-300">{radarResult.bearing} ({radarResult.bearingDegrees}°)</span>
                  </div>

                  {/* Temperature feedback banner */}
                  <div className={`p-3 rounded-xl font-black text-xs text-center border ${
                    radarResult.tempRating === 'boiling'
                      ? 'bg-rose-500 text-white border-rose-400'
                      : radarResult.tempRating === 'hot'
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : radarResult.tempRating === 'warm'
                      ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                      : radarResult.tempRating === 'cold'
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {radarResult.tempRating === 'boiling' && ui.tempBoiling}
                    {radarResult.tempRating === 'hot' && ui.tempHot}
                    {radarResult.tempRating === 'warm' && ui.tempWarm}
                    {radarResult.tempRating === 'cold' && ui.tempCold}
                    {radarResult.tempRating === 'freezing' && ui.tempFreezing}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: AI STICKER ALBUM & CHECK-IN BOARD */}
      {/* ========================================================================= */}
      {activeView === 'stickers' && (
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl border-2 border-indigo-500/40 p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏅</span>
              <div>
                <h3 className="font-black text-lg md:text-xl text-white">
                  {ui.albumTitle}
                </h3>
                <p className="text-xs text-slate-300">
                  {ui.albumSubtitle}
                </p>
              </div>
            </div>
            <span className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs shadow-sm">
              {stickers.length} / 6 Naklejek
            </span>
          </div>

          {/* Stickers grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {albumCities.map((city) => {
              const earned = stickers.find(s => s.city.toLowerCase() === city.name.toLowerCase());
              return (
                <div
                  key={city.name}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center relative group transition-all hover:bg-slate-900"
                >
                  {earned ? (
                    <div className="space-y-2 flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${earned.gradient} flex items-center justify-center shadow-xl text-3xl border-2 border-white animate-bounce`}>
                        {earned.emoji}
                      </div>
                      <span className="text-xs font-black text-slate-100 line-clamp-1">{earned.title}</span>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Zdobyta ✔️</span>
                    </div>
                  ) : (
                    <div className="space-y-2 flex flex-col items-center opacity-40">
                      <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xl">
                        🔒
                      </div>
                      <span className="text-xs font-bold text-slate-400">{city.flag} {city.name}</span>
                      <span className="text-[10px] font-medium text-slate-500 italic">Zablokowane</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Check-in Sticker Generator Form */}
          <div className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800 space-y-4">
            <h4 className="font-black text-sm text-amber-300 flex items-center gap-1.5">
              <span>🚀</span>
              <span>{ui.checkinTitle}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-slate-400">
                  {ui.selectCity}
                </label>
                <select
                  value={checkinCity}
                  onChange={(e) => setCheckinCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500 font-bold"
                >
                  {albumCities.map(c => (
                    <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-[10px] font-black uppercase text-slate-400">
                  {ui.whatDidYouDo}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={ui.activityPlaceholder}
                    value={userActivity}
                    onChange={(e) => setUserActivity(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAwardSticker}
                    disabled={isClaiming || !userActivity.trim()}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-5 rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {isClaiming ? "Generuję..." : ui.stickBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {claimedAlert && (
            <div className="bg-emerald-950 border-2 border-emerald-400 rounded-2xl p-4 flex items-start gap-3.5 animate-fadeIn">
              <span className="text-3xl animate-bounce">🎉</span>
              <div className="space-y-1 text-slate-200 text-xs">
                <p className="font-black text-emerald-400 text-sm">
                  Naklejka została pomyślnie dodana do Twojego albumu!
                </p>
                <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs py-0.5">
                  <span className={`px-2 py-0.5 rounded bg-gradient-to-r ${claimedAlert.gradient} text-white`}>{claimedAlert.emoji}</span>
                  <span>{claimedAlert.title}</span>
                </div>
                <p className="italic font-medium leading-relaxed">{claimedAlert.congrats}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: COMMUNITY EXPLORERS WALL & PHOTO GALLERY */}
      {/* ========================================================================= */}
      {activeView === 'gallery' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-950 flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-600" />
                <span>{ui.galleryTitle}</span>
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {ui.gallerySub}
              </p>
            </div>

            <button
              onClick={() => {
                if (!account) {
                  alert(ui.loginPrompt);
                  return;
                }
                const randomPhoto = CONTEST_MOCK_PHOTOS[Math.floor(Math.random() * CONTEST_MOCK_PHOTOS.length)];
                const updated = challenges.map((c, idx) => {
                  if (idx === 0) {
                    return {
                      ...c,
                      participantPhotos: [
                        {
                          username: account.username,
                          photoUrl: randomPhoto,
                          hearts: 1,
                          comments: ['System: Zdjęcie zatwierdzone przez Tadzika!']
                        },
                        ...c.participantPhotos
                      ]
                    };
                  }
                  return c;
                });
                setChallenges(updated);
                try {
                  localStorage.setItem('nl_tourist_planner_challenges', JSON.stringify(updated));
                } catch (e) {
                  console.error(e);
                }
                alert('✅ Zdjęcie zostało pomyślnie dodane!');
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>{ui.postPhotoBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges[0]?.participantPhotos.map((entry, index) => {
              const voteKey = `contest-${index}`;
              const liked = hasVoted[voteKey];

              return (
                <div
                  key={index}
                  className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full bg-slate-200">
                    <img
                      src={entry.photoUrl}
                      alt={`Foto od ${entry.username}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-slate-950/90 text-white px-3 py-1 rounded-xl text-xs font-black shadow">
                      👤 {entry.username}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                      <button
                        onClick={() => handleLikeEntry(index)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                          liked
                            ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-rose-300 hover:text-rose-600 text-slate-700'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-600 text-rose-600' : ''}`} />
                        <span>{entry.hearts} {ui.likesCount}</span>
                      </button>

                      <div className="flex items-center gap-1 text-slate-500 font-bold text-xs">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{ui.commentsCount(entry.comments.length)}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                      {entry.comments.map((c, cidx) => (
                        <div key={cidx} className="bg-white border border-slate-100 p-2 rounded-xl text-xs text-slate-800 font-medium">
                          {c}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={(e) => handleAddComment(index, e)} className="flex gap-2">
                      {!account && (
                        <input
                          type="text"
                          placeholder="Twój nick"
                          value={submitterName}
                          onChange={(e) => setSubmitterName(e.target.value)}
                          className="w-1/3 border border-slate-200 bg-white rounded-xl p-2 text-xs font-bold focus:outline-none focus:border-indigo-500"
                          required
                        />
                      )}
                      <input
                        type="text"
                        placeholder={ui.addComment}
                        value={commentText[`${challenges[0].id}-${index}`] || ''}
                        onChange={(e) =>
                          setCommentText({
                            ...commentText,
                            [`${challenges[0].id}-${index}`]: e.target.value
                          })
                        }
                        className="flex-1 border border-slate-200 bg-white rounded-xl p-2 text-xs font-medium focus:outline-none focus:border-indigo-500"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VICTORY MODAL POPUP */}
      {showVictoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 md:p-8 max-w-lg w-full text-white shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center text-4xl mx-auto shadow-2xl animate-bounce">
              {currentSpot.badgeEmoji}
            </div>

            <div className="space-y-2">
              <span className="text-amber-400 text-xs font-black uppercase tracking-widest block">
                ⭐ {ui.solvedTitle} ⭐
              </span>
              <h3 className="text-2xl font-black text-white">
                {currentSpot.name} ({currentSpot.country})
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                Twoja dedukcja okazała się bezbłędna! Zdobyłeś tytuł Mistrza Poszukiwań i unikalną odznakę!
              </p>
            </div>

            <div className="bg-slate-800/90 border border-amber-400/40 p-4 rounded-2xl text-left space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-amber-300">
                <span>🏅 Zdobyta Odznaka:</span>
                <span>+{currentSpot.rewardXp} XP</span>
              </div>
              <p className="text-sm font-black text-white">
                {currentSpot.badgeTitle[language] || currentSpot.badgeTitle.pl}
              </p>
              <p className="text-xs text-slate-300 italic font-medium">
                {currentSpot.funFact[language] || currentSpot.funFact.pl}
              </p>
            </div>

            <button
              onClick={() => setShowVictoryModal(false)}
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black py-3.5 rounded-xl transition-all shadow-lg cursor-pointer uppercase tracking-wider text-xs"
            >
              Odbierz Nagrodę i Zamknij 🏅
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
