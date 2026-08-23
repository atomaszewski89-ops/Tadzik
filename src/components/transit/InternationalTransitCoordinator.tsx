import React, { useState, useMemo, useEffect } from 'react';
import { Language, UserAccount } from '../../types';
import InAppGoogleMapRoute from '../InAppGoogleMapRoute';
import { 
  Train, 
  Bus, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Info, 
  CreditCard, 
  Layers, 
  Globe2, 
  ExternalLink,
  Luggage,
  Accessibility,
  Radio,
  Coffee,
  HelpCircle,
  Filter,
  Check,
  Building,
  Navigation,
  Calendar,
  Search,
  ArrowLeftRight,
  Utensils,
  Wifi,
  Zap,
  VolumeX,
  Ticket,
  ChevronDown,
  ChevronUp,
  Tag,
  AlertCircle,
  CalendarDays,
  Milestone,
  Route,
  Flame,
  BadgePercent,
  SlidersHorizontal,
  Sun,
  Sunrise,
  Sunset,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type EuropeanCountryCode = 'NL' | 'PL' | 'BE' | 'DE' | 'FR';

export interface CountryInfo {
  code: EuropeanCountryCode;
  name: { pl: string; nl: string; en: string; de: string };
  flag: string;
  majorHubs: string[];
  localOperators: string;
  nationalTrain: string;
  ticketSystem: string;
  seniorPerk: string;
}

export const SUPPORTED_TRANSIT_COUNTRIES: Record<EuropeanCountryCode, CountryInfo> = {
  NL: {
    code: 'NL',
    name: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande' },
    flag: '🇳🇱',
    majorHubs: ['Rotterdam Centraal', 'Amsterdam Centraal', 'Utrecht Centraal', 'Eindhoven Centraal', 'Hengelo'],
    localOperators: 'RET (Rotterdam), GVB (Amsterdam), HTM (Haga), U-OV (Utrecht)',
    nationalTrain: 'NS (Nederlandse Spoorwegen) / NS International',
    ticketSystem: 'OVpay (Bezpośrednie zbliżenie karty płatniczej VISA/Mastercard przy wejściu i wyjściu)',
    seniorPerk: 'Zniżki NS Dal Voordeel i zintegrowane ulgi senioralne'
  },
  PL: {
    code: 'PL',
    name: { pl: 'Polska', nl: 'Polen', en: 'Poland', de: 'Polen' },
    flag: '🇵🇱',
    majorHubs: ['Warszawa Centralna', 'Kraków Główny', 'Poznań Główny', 'Wrocław Główny', 'Gdańsk Główny', 'Katowice'],
    localOperators: 'ZTM Warszawa, MPK Kraków, MPK Wrocław, ZTM Poznań',
    nationalTrain: 'PKP Intercity (Express InterCity, BWE, IC Wawel, Pendolino)',
    ticketSystem: 'Bilety elektroniczne PKP (kod QR) + biletomaty miejskie (karta/BLIK)',
    seniorPerk: 'Seniorzy 70+ jeżdżą 100% ZA DARMO w miastach; Bilet dla Seniora 60+ (30% taniej w PKP)'
  },
  BE: {
    code: 'BE',
    name: { pl: 'Belgia', nl: 'België', en: 'Belgium', de: 'Belgien' },
    flag: '🇧🇪',
    majorHubs: ['Bruxelles-Midi (Zuid)', 'Bruxelles-Central', 'Antwerpen-Centraal', 'Gent-Sint-Pieters', 'Liège-Guillemins'],
    localOperators: 'STIB/MIVB (Bruksela Metro/Tram), De Lijn (Flandria), TEC (Walonia)',
    nationalTrain: 'SNCB / NMBS (Koleje Belgijskie) & Eurostar',
    ticketSystem: 'Brupass Contactless (karta płatnicza EMV) + bilety SNCB online/aplikacja',
    seniorPerk: 'SNCB Senior Ticket: stała, super niska cena na dowolną trasę w całej Belgii po 9:00 rano'
  },
  DE: {
    code: 'DE',
    name: { pl: 'Niemcy', nl: 'Duitsland', en: 'Germany', de: 'Deutschland' },
    flag: '🇩🇪',
    majorHubs: ['Berlin Hauptbahnhof', 'Köln Hbf', 'Frankfurt (Main) Hbf', 'Hannover Hbf', 'Düsseldorf Hbf', 'München Hbf'],
    localOperators: 'BVG (Berlin), KVB (Kolonia), MVG (Monachium), RMV (Frankfurt)',
    nationalTrain: 'Deutsche Bahn (DB ICE International, IC, Regional-Express)',
    ticketSystem: 'DB Navigator (kod QR) + biletomaty z językiem polskim + Deutschlandticket',
    seniorPerk: 'BahnCard Senior + zniżki Europa-Spezial z gwarancją miejsca w strefie ciszy'
  },
  FR: {
    code: 'FR',
    name: { pl: 'Francja', nl: 'Frankrijk', en: 'France', de: 'Frankreich' },
    flag: '🇫🇷',
    majorHubs: ['Paris Gare du Nord', 'Paris Gare de l\'Est', 'Paris Gare de Lyon', 'Lille Europe', 'Strasbourg'],
    localOperators: 'RATP (Paryż Metro/RER/Tramwaje), TCL (Lyon), RTM (Marsylia)',
    nationalTrain: 'SNCF (TGV InOui, TGV Lyria, Eurostar, TER)',
    ticketSystem: 'Navigo Easy / Płatność zbliżeniowa w telefonie + SNCF Connect (kod QR)',
    seniorPerk: 'Carte Avantage Senior SNCF (gwarantowane 30% zniżki na wszystkie pociągi TGV)'
  }
};

export const POPULAR_STATIONS_BY_COUNTRY: Record<EuropeanCountryCode, { city: string; station: string; isMajorHub?: boolean }[]> = {
  PL: [
    { city: 'Warszawa', station: 'Warszawa Centralna', isMajorHub: true },
    { city: 'Kraków', station: 'Kraków Główny', isMajorHub: true },
    { city: 'Gdańsk', station: 'Gdańsk Główny', isMajorHub: true },
    { city: 'Wrocław', station: 'Wrocław Główny', isMajorHub: true },
    { city: 'Poznań', station: 'Poznań Główny', isMajorHub: true },
    { city: 'Zakopane', station: 'Zakopane Dworzec Główny', isMajorHub: true },
    { city: 'Katowice', station: 'Katowice Dworzec Główny', isMajorHub: true },
    { city: 'Gdynia', station: 'Gdynia Główna' },
    { city: 'Sopot', station: 'Sopot' },
    { city: 'Toruń', station: 'Toruń Główny' },
    { city: 'Lublin', station: 'Lublin Główny' },
    { city: 'Szczecin', station: 'Szczecin Główny' },
    { city: 'Łódź', station: 'Łódź Fabryczna' }
  ],
  NL: [
    { city: 'Rotterdam', station: 'Rotterdam Centraal', isMajorHub: true },
    { city: 'Amsterdam', station: 'Amsterdam Centraal', isMajorHub: true },
    { city: 'Utrecht', station: 'Utrecht Centraal', isMajorHub: true },
    { city: 'Schiphol', station: 'Schiphol Airport', isMajorHub: true },
    { city: 'Den Haag', station: 'Den Haag Centraal' },
    { city: 'Eindhoven', station: 'Eindhoven Centraal', isMajorHub: true },
    { city: 'Maastricht', station: 'Maastricht Centraal' },
    { city: 'Arnhem', station: 'Arnhem Centraal' },
    { city: 'Groningen', station: 'Groningen' },
    { city: 'Leiden', station: 'Leiden Centraal' }
  ],
  DE: [
    { city: 'Berlin', station: 'Berlin Hauptbahnhof', isMajorHub: true },
    { city: 'München', station: 'München Hauptbahnhof', isMajorHub: true },
    { city: 'Frankfurt', station: 'Frankfurt (Main) Hauptbahnhof', isMajorHub: true },
    { city: 'Köln', station: 'Köln Hauptbahnhof', isMajorHub: true },
    { city: 'Hamburg', station: 'Hamburg Hauptbahnhof', isMajorHub: true },
    { city: 'Düsseldorf', station: 'Düsseldorf Hbf' },
    { city: 'Hannover', station: 'Hannover Hbf' },
    { city: 'Leipzig', station: 'Leipzig Hbf' },
    { city: 'Nürnberg', station: 'Nürnberg Hbf' },
    { city: 'Stuttgart', station: 'Stuttgart Hbf' },
    { city: 'Dresden', station: 'Dresden Hbf' }
  ],
  BE: [
    { city: 'Bruksela', station: 'Bruxelles-Midi (Zuid)', isMajorHub: true },
    { city: 'Bruksela', station: 'Bruxelles-Central' },
    { city: 'Brugia', station: 'Brugge Station', isMajorHub: true },
    { city: 'Gent', station: 'Gent-Sint-Pieters', isMajorHub: true },
    { city: 'Antwerpia', station: 'Antwerpen-Centraal', isMajorHub: true },
    { city: 'Oostende', station: 'Oostende' },
    { city: 'Liège', station: 'Liège-Guillemins' },
    { city: 'Leuven', station: 'Leuven' },
    { city: 'Namur', station: 'Namur' }
  ],
  FR: [
    { city: 'Paryż', station: 'Paris Gare de Lyon', isMajorHub: true },
    { city: 'Paryż', station: 'Paris Gare du Nord', isMajorHub: true },
    { city: 'Paryż', station: 'Paris Montparnasse', isMajorHub: true },
    { city: 'Lyon', station: 'Lyon Part-Dieu', isMajorHub: true },
    { city: 'Marsylia', station: 'Marseille Saint-Charles', isMajorHub: true },
    { city: 'Bordeaux', station: 'Bordeaux Saint-Jean', isMajorHub: true },
    { city: 'Strasbourg', station: 'Strasbourg' },
    { city: 'Nicea', station: 'Nice-Ville' },
    { city: 'Lille', station: 'Lille Europe' }
  ]
};

export const POPULAR_BUS_STATIONS_BY_COUNTRY: Record<EuropeanCountryCode, { city: string; station: string; isMajorHub?: boolean }[]> = {
  PL: [
    { city: 'Warszawa', station: 'Warszawa Dworzec Autobusowy Zachodni (PKS)', isMajorHub: true },
    { city: 'Kraków', station: 'Kraków MDA (Małopolski Dworzec Autobusowy)', isMajorHub: true },
    { city: 'Katowice', station: 'Katowice Dworzec Autobusowy Sądowa', isMajorHub: true },
    { city: 'Wrocław', station: 'Wrocław Dworzec Autobusowy Wroclavia', isMajorHub: true },
    { city: 'Gdańsk', station: 'Gdańsk Dworzec Autobusowy (PKS)', isMajorHub: true },
    { city: 'Poznań', station: 'Poznań Dworzec Autobusowy Główny' },
    { city: 'Zakopane', station: 'Zakopane Dworzec Autobusowy' },
    { city: 'Lublin', station: 'Lublin Dworzec Autobusowy Główny' }
  ],
  NL: [
    { city: 'Amsterdam', station: 'Amsterdam Sloterdijk Bus Station (FlixBus Hub)', isMajorHub: true },
    { city: 'Rotterdam', station: 'Rotterdam Centraal Bus Terminal (Conradstraat)', isMajorHub: true },
    { city: 'Utrecht', station: 'Utrecht Centraal Jaarbeurszijde Busstation', isMajorHub: true },
    { city: 'Eindhoven', station: 'Eindhoven Station Bus Terminal', isMajorHub: true },
    { city: 'Haga', station: 'Den Haag Centraal Busplatform' }
  ],
  DE: [
    { city: 'Berlin', station: 'Berlin ZOB (Zentraler Omnibusbahnhof)', isMajorHub: true },
    { city: 'München', station: 'München ZOB Hackerbrücke', isMajorHub: true },
    { city: 'Frankfurt', station: 'Frankfurt (Main) Hbf Fernbusbahnhof', isMajorHub: true },
    { city: 'Köln', station: 'Köln Flughafen / ZOB Köln-Bonn', isMajorHub: true },
    { city: 'Hamburg', station: 'Hamburg ZOB am Hauptbahnhof', isMajorHub: true }
  ],
  BE: [
    { city: 'Bruksela', station: 'Bruxelles-Nord Busstation (Gare du Nord)', isMajorHub: true },
    { city: 'Bruksela', station: 'Bruxelles-Midi Bus Terminal (Rue de France)', isMajorHub: true },
    { city: 'Antwerpia', station: 'Antwerpen Franklin Rooseveltplaats', isMajorHub: true },
    { city: 'Brugia', station: 'Brugge Station Busstation' },
    { city: 'Gent', station: 'Gent-Dampoort Busstation' }
  ],
  FR: [
    { city: 'Paryż', station: 'Paris Bercy Seine (Gare Routière)', isMajorHub: true },
    { city: 'Paryż', station: 'Paris Gallieni (Gare Routière)', isMajorHub: true },
    { city: 'Lyon', station: 'Lyon Perrache Gare Routière', isMajorHub: true },
    { city: 'Marsylia', station: 'Marseille Saint-Charles Gare Routière', isMajorHub: true },
    { city: 'Lille', station: 'Lille Boulevard de Turin (FlixBus)' }
  ]
};

export interface InternationalTransitRoute {
  id: string;
  title: string;
  fromCountry: { code: EuropeanCountryCode; name: string; flag: string; city: string };
  toCountry: { code: EuropeanCountryCode; name: string; flag: string; city: string };
  viaCountries: { code: EuropeanCountryCode; flag: string; hub: string }[];
  totalDuration: string;
  totalPriceEur: number;
  totalPricePln: number;
  comfortRating: string;
  transfersCount: number;
  tags: string[];
  operators: { name: string; country: string; badge: string; type: string }[];
  legs: {
    legNumber: number;
    stageTitle: string;
    country: string;
    operator: string;
    operatorLogo: string;
    vehicleType: 'local-tram' | 'national-ic' | 'crossborder-express' | 'night-train' | 'transfer-hub';
    departureStation: string;
    departureTime: string;
    departurePlatform: string;
    arrivalStation: string;
    arrivalTime: string;
    arrivalPlatform: string;
    duration: string;
    distance: string;
    seatReservation: boolean;
    ticketSystem: {
      name: string;
      howToPay: string;
      seniorDiscount: string;
    };
    accessibilityNotes: string;
    transferBufferMins?: number;
    transferTips?: string;
  }[];
}

interface InternationalTransitCoordinatorProps {
  language: Language;
  account: UserAccount | null;
  initialFromCountry?: EuropeanCountryCode;
  initialToCountry?: EuropeanCountryCode;
}

export const ALL_INTERNATIONAL_CORRIDORS: InternationalTransitRoute[] = [
  // 1. HOLANDIA ➔ POLSKA (Dzienny Ekspres przez Niemcy)
  {
    id: 'nl-pl-day-warszawa',
    title: '🇳🇱 Holandia (Rotterdam/Amsterdam) ➔ 🇩🇪 Niemcy (Berlin) ➔ 🇵🇱 Polska (Warszawa Centralna)',
    fromCountry: { code: 'NL', name: 'Holandia', flag: '🇳🇱', city: 'Rotterdam Centraal' },
    toCountry: { code: 'PL', name: 'Polska', flag: '🇵🇱', city: 'Warszawa Centralna' },
    viaCountries: [{ code: 'DE', flag: '🇩🇪', hub: 'Berlin Hauptbahnhof' }],
    totalDuration: '11h 20m',
    totalPriceEur: 69.50,
    totalPricePln: 298.00,
    comfortRating: '9.9/10 (Super Komfort & WARS)',
    transfersCount: 2,
    tags: ['Dzienne połączenie', 'Wagon WARS', 'Niskopodłogowe przesiadki', 'Gwarancja skomunikowania'],
    operators: [
      { name: 'RET / NS', country: 'NL', badge: '🇳🇱 NS Intercity Direct', type: 'Kolej Holenderska' },
      { name: 'DB ICE International', country: 'DE', badge: '🇩🇪 DB ICE Express', type: 'Ekspres Niemiecki' },
      { name: 'PKP Intercity (BWE)', country: 'PL', badge: '🇵🇱 Berlin-Warszawa Express', type: 'Ekspres PKP' },
      { name: 'ZTM Warszawa', country: 'PL', badge: '🇵🇱 Tramwaje Warszawskie', type: 'Komunikacja Miejska' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: Dojazd Lokalny RET + Pociąg NS w Holandii (Rotterdam ➔ Hengelo/Granica)',
        country: 'Holandia 🇳🇱',
        operator: 'NS (Nederlandse Spoorwegen) & RET',
        operatorLogo: '🚆 NS Intercity Direct',
        vehicleType: 'national-ic',
        departureStation: 'Rotterdam Centraal (lub Amsterdam Centraal)',
        departureTime: '07:12',
        departurePlatform: 'Peron 4',
        arrivalStation: 'Amersfoort Centraal / Hengelo',
        arrivalTime: '08:24',
        arrivalPlatform: 'Peron 2',
        duration: '1h 12m',
        distance: '105 km',
        seatReservation: false,
        ticketSystem: {
          name: 'System OVpay (Holandia)',
          howToPay: 'Wystarczy zbliżyć kartę debetową/kredytową VISA/Mastercard lub telefon do czytnika przy wejściu i wyjściu (Check-In / Check-Out).',
          seniorDiscount: 'Automatyczna ulga senioralna po powiązaniu karty z kontem NS.'
        },
        accessibilityNotes: '100% niskopodłogowe wejście, windy na każdym peronie, asysta stacyjna gotowa przy wagonie 3.',
        transferBufferMins: 22,
        transferTips: 'Spokojna przesiadka na tym samym peronie wyspowym (cross-platform). Dostępna kawiarnia z gorącą herbatą i czysta toaleta.'
      },
      {
        legNumber: 2,
        stageTitle: 'Etap 2: Szybki Ekspres Międzynarodowy przez Niemcy (Hengelo ➔ Berlin Hbf)',
        country: 'Niemcy 🇩🇪',
        operator: 'Deutsche Bahn (DB International)',
        operatorLogo: '⚡ ICE / IC International',
        vehicleType: 'crossborder-express',
        departureStation: 'Hengelo / Bad Bentheim Hub',
        departureTime: '08:46',
        departurePlatform: 'Peron 1',
        arrivalStation: 'Berlin Hauptbahnhof (Tief)',
        arrivalTime: '13:08',
        arrivalPlatform: 'Peron 13',
        duration: '4h 22m',
        distance: '470 km',
        seatReservation: true,
        ticketSystem: {
          name: 'Bilet Międzynarodowy DB / Europa-Spezial',
          howToPay: 'Wspólny bilet międzynarodowy z gwarancją przesiadki (DB Navigator lub bilet zintegrowany). Kod QR w telefonie.',
          seniorDiscount: 'Ulga DB Senior 65+ w cenie biletu, darmowa rezerwacja miejsca w strefie ciszy.'
        },
        accessibilityNotes: 'Wagon restauracyjny (Bordbistro) z obsługą do stolika, gniazdka 230V przy każdym fotelu, toalety przystosowane dla wózków.',
        transferBufferMins: 35,
        transferTips: 'Gwarantowane 35 minut buforu bezpieczeństwa na Berlin Hbf. Wszystkie poziomy połączone szerokimi windami panoramicznymi.'
      },
      {
        legNumber: 3,
        stageTitle: 'Etap 3: Bezpośredni Ekspres Berlin ➔ Poznań ➔ Warszawa (BWE)',
        country: 'Polska 🇵🇱',
        operator: 'PKP Intercity (Berlin-Warszawa-Express)',
        operatorLogo: '🇵🇱 PKP Intercity Express (EIC / BWE)',
        vehicleType: 'crossborder-express',
        departureStation: 'Berlin Hauptbahnhof',
        departureTime: '13:43',
        departurePlatform: 'Peron 12',
        arrivalStation: 'Warszawa Centralna',
        arrivalTime: '19:10',
        arrivalPlatform: 'Peron 3',
        duration: '5h 27m',
        distance: '575 km',
        seatReservation: true,
        ticketSystem: {
          name: 'PKP Intercity (Bilet Międzynarodowy Super Promo)',
          howToPay: 'Bilet elektroniczny z kodem QR, akceptowany przez konduktorów PKP w telefonie lub wydruku.',
          seniorDiscount: 'Ulga Bilet dla Seniora (30% taniej dla osób 60+) lub ulgi ustawowe (karta seniora).'
        },
        accessibilityNotes: 'Obsługa WARS oferuje pyszne polskie obiady (żurek, pierogi, herbata z cytryną) z dostawą do fotela!',
        transferBufferMins: 15,
        transferTips: 'Dworzec Warszawa Centralna: bezpośredni zjazd windami do podziemnych przejść na tramwaje i autobusy ZTM.'
      },
      {
        legNumber: 4,
        stageTitle: 'Etap 4: Finałowy Dojazd Tramwajem Niskopodłogowym ZTM pod Hotel / Cel',
        country: 'Polska 🇵🇱',
        operator: 'ZTM Warszawa (Tramwaje Warszawskie)',
        operatorLogo: '🚊 Tramwaj Niskopodłogowy Linia 7 / 9 / 24',
        vehicleType: 'local-tram',
        departureStation: 'Warszawa Dworzec Centralny (Przystanek 07)',
        departureTime: '19:25',
        departurePlatform: 'Przystanek tramwajowy naziemny',
        arrivalStation: 'Twój Hotel / Rynek / Atrakcja Docelowa',
        arrivalTime: '19:38',
        arrivalPlatform: 'Przystanek bez barier',
        duration: '13m',
        distance: '4.5 km',
        seatReservation: false,
        ticketSystem: {
          name: 'ZTM Bilet Czasowy 20-minutowy / Senioralny',
          howToPay: 'Płatność kartą w biletomacie wewnątrz każdego tramwaju lub zbliżeniowo u motorniczego.',
          seniorDiscount: 'Osoby 70+ podróżują 100% BEZPŁATNIE (wystarczy dokument tożsamości ze zdjęciem).'
        },
        accessibilityNotes: 'Pojazdy 100% niskopodłogowe z rampą wysuwaną dla osób z walizkami lub wózkami.'
      }
    ]
  },

  // 2. HOLANDIA ➔ POLSKA (Kraków / Małopolska przez Hannover i Wrocław)
  {
    id: 'nl-pl-krakow-wawel',
    title: '🇳🇱 Holandia (Amsterdam/Rotterdam) ➔ 🇩🇪 Niemcy (Hannover) ➔ 🇵🇱 Polska (Kraków Główny)',
    fromCountry: { code: 'NL', name: 'Holandia', flag: '🇳🇱', city: 'Amsterdam Centraal' },
    toCountry: { code: 'PL', name: 'Polska', flag: '🇵🇱', city: 'Kraków Główny' },
    viaCountries: [{ code: 'DE', flag: '🇩🇪', hub: 'Hannover Hbf / Frankfurt (Oder)' }],
    totalDuration: '12h 05m',
    totalPriceEur: 74.00,
    totalPricePln: 318.00,
    comfortRating: '9.8/10 (Komfort z WARS & IC Wawel)',
    transfersCount: 2,
    tags: ['Bezpośrednio pod Wawel', 'Krakowski Szybki Tramwaj', 'Winda do Galerii'],
    operators: [
      { name: 'NS International', country: 'NL', badge: '🇳🇱 NS Intercity Berlinka', type: 'Kolej Holenderska' },
      { name: 'DB ICE Express', country: 'DE', badge: '🇩🇪 DB ICE Sprinter', type: 'Kolej Niemiecka' },
      { name: 'PKP Intercity (IC Wawel)', country: 'PL', badge: '🇵🇱 IC Wawel (Przemyśl/Kraków)', type: 'Ekspres PKP' },
      { name: 'MPK Kraków', country: 'PL', badge: '🇵🇱 MPK Kraków (KST)', type: 'Tramwaj Miejski' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: Amsterdam Centraal ➔ Niemcy Express (Bad Bentheim)',
        country: 'Holandia 🇳🇱',
        operator: 'NS International',
        operatorLogo: '🚆 NS Intercity Berlinka',
        vehicleType: 'national-ic',
        departureStation: 'Amsterdam Centraal',
        departureTime: '07:00',
        departurePlatform: 'Peron 7b',
        arrivalStation: 'Bad Bentheim / Hannover Hbf',
        arrivalTime: '10:18',
        arrivalPlatform: 'Peron 3',
        duration: '3h 18m',
        distance: '310 km',
        seatReservation: true,
        ticketSystem: {
          name: 'Bilet Zintegrowany NS International',
          howToPay: 'Jeden bilet na całą podróż międzynarodową, kod QR w aplikacji lub pdf.',
          seniorDiscount: 'Zniżka międzynarodowa dla seniora 60+.'
        },
        accessibilityNotes: 'Płaskie wejścia na peronach Amsterdam Centraal, automatyczna winda na każdym torze.',
        transferBufferMins: 25,
        transferTips: 'Hannover Hbf posiada komfortową poczekalnię DB Lounge z darmową kawą dla posiadaczy biletów międzynarodowych.'
      },
      {
        legNumber: 2,
        stageTitle: 'Etap 2: Szybki Pociąg do Węzła Granicznego / Berlin / Wrocław',
        country: 'Niemcy 🇩🇪',
        operator: 'Deutsche Bahn (ICE)',
        operatorLogo: '⚡ ICE Sprinter',
        vehicleType: 'crossborder-express',
        departureStation: 'Hannover Hbf',
        departureTime: '10:43',
        departurePlatform: 'Peron 9',
        arrivalStation: 'Berlin Hbf / Frankfurt (Oder)',
        arrivalTime: '12:28',
        arrivalPlatform: 'Peron 14',
        duration: '1h 45m',
        distance: '280 km',
        seatReservation: true,
        ticketSystem: {
          name: 'DB Transit System',
          howToPay: 'W cenie zintegrowanego biletu.',
          seniorDiscount: 'Zagwarantowane miejsce siedzące przy oknie.'
        },
        accessibilityNotes: 'Klimatyzacja, Wi-Fi pokładowe z polskim i holenderskim portalem podróżnym.',
        transferBufferMins: 32,
        transferTips: 'Przejście windą na peron pociągu IC Wawel bezpośrednio do Krakowa.'
      },
      {
        legNumber: 3,
        stageTitle: 'Etap 3: Bezpośredni Pociąg IC Wawel do Krakowa Głównego',
        country: 'Polska 🇵🇱',
        operator: 'PKP Intercity (IC Wawel)',
        operatorLogo: '🇵🇱 PKP Intercity IC Wawel',
        vehicleType: 'crossborder-express',
        departureStation: 'Berlin Hbf / Frankfurt (Oder)',
        departureTime: '13:00',
        departurePlatform: 'Peron 2',
        arrivalStation: 'Kraków Główny',
        arrivalTime: '19:05',
        arrivalPlatform: 'Peron 1 (Przy Galerii Krakowskiej)',
        duration: '6h 05m',
        distance: '590 km',
        seatReservation: true,
        ticketSystem: {
          name: 'PKP Intercity Rezerwacja Miejsc',
          howToPay: 'Bilet elektroniczny z miejscówką wagonową.',
          seniorDiscount: 'Ulga ustawowa / Bilet Seniora PKP 30% taniej.'
        },
        accessibilityNotes: 'Peron 1 w Krakowie jest bezpośrednio połączony z Dworcem Głównym i Galerią bez żadnych schodów (pochylnie i windy).',
        transferBufferMins: 15,
        transferTips: 'Zejście schodami ruchomymi lub windą na podziemny przystanek Krakowskiego Szybkiego Tramwaju (KST).'
      },
      {
        legNumber: 4,
        stageTitle: 'Etap 4: Krakowski Szybki Tramwaj MPK pod Wawel / Sukiennice',
        country: 'Polska 🇵🇱',
        operator: 'MPK Kraków (KST)',
        operatorLogo: '🚊 Tramwaj Niskopodłogowy Linia 50 / 3 / 24',
        vehicleType: 'local-tram',
        departureStation: 'Dworzec Główny Tunel (KST)',
        departureTime: '19:20',
        departurePlatform: 'Peron podziemny A',
        arrivalStation: 'Wawel / Poczta Główna / Rynek',
        arrivalTime: '19:32',
        arrivalPlatform: 'Przystanek bez barier',
        duration: '12m',
        distance: '3.2 km',
        seatReservation: false,
        ticketSystem: {
          name: 'Bilet MPK Kraków 20-minutowy',
          howToPay: 'Płatność kartą w biletomacie wewnątrz tramwaju.',
          seniorDiscount: 'Seniorzy 70+ bezpłatnie na podstawie dowodu osobistego.'
        },
        accessibilityNotes: 'Przystanek podziemny klimatyzowany z pełną informacją głosową i wizualną.'
      }
    ]
  },

  // 3. POLSKA ➔ NIEMCY ➔ HOLANDIA (Powrót do Rotterdamu / Amsterdamu)
  {
    id: 'pl-nl-return-rotterdam',
    title: '🇵🇱 Polska (Warszawa/Poznań) ➔ 🇩🇪 Niemcy (Berlin) ➔ 🇳🇱 Holandia (Rotterdam/Amsterdam)',
    fromCountry: { code: 'PL', name: 'Polska', flag: '🇵🇱', city: 'Warszawa Centralna' },
    toCountry: { code: 'NL', name: 'Holandia', flag: '🇳🇱', city: 'Rotterdam Centraal' },
    viaCountries: [{ code: 'DE', flag: '🇩🇪', hub: 'Berlin Hbf / Utrecht Centraal' }],
    totalDuration: '11h 15m',
    totalPriceEur: 68.00,
    totalPricePln: 292.00,
    comfortRating: '9.9/10 (Skoordynowany Powrót)',
    transfersCount: 2,
    tags: ['Ekspres powrotny', 'Płynna przesiadka w Berlinie', 'Płatność OVpay'],
    operators: [
      { name: 'PKP Intercity (BWE)', country: 'PL', badge: '🇵🇱 Berlin-Warszawa Express', type: 'Ekspres PKP' },
      { name: 'DB ICE Express', country: 'DE', badge: '🇩🇪 DB ICE International', type: 'Kolej Niemiecka' },
      { name: 'NS Intercity', country: 'NL', badge: '🇳🇱 NS Kolej', type: 'Kolej Holenderska' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: Ekspres Berlin-Warszawa-Express z Polski do Berlina',
        country: 'Polska ➔ Niemcy 🇵🇱🇩🇪',
        operator: 'PKP Intercity & DB',
        operatorLogo: '🇵🇱 Berlin-Warszawa Express (EIC)',
        vehicleType: 'crossborder-express',
        departureStation: 'Warszawa Centralna (lub Poznań Główny 08:32)',
        departureTime: '06:00',
        departurePlatform: 'Peron 2',
        arrivalStation: 'Berlin Hauptbahnhof',
        arrivalTime: '11:15',
        arrivalPlatform: 'Peron 11',
        duration: '5h 15m',
        distance: '575 km',
        seatReservation: true,
        ticketSystem: {
          name: 'PKP / DB Bilet Międzynarodowy',
          howToPay: 'Kupiony na portalu intercity.pl lub bahn.de, kod QR.',
          seniorDiscount: 'Ulga ustawowa dla seniora 30%.'
        },
        accessibilityNotes: 'Obsługa WARS na pokładzie, asysta bagażowa przy wsiadaniu.',
        transferBufferMins: 30,
        transferTips: 'Berlin Hbf: komfortowa przesiadka na pociąg ICE do Holandii.'
      },
      {
        legNumber: 2,
        stageTitle: 'Etap 2: Pociąg ICE International do Holandii (Hengelo / Utrecht)',
        country: 'Niemcy ➔ Holandia 🇩🇪🇳🇱',
        operator: 'Deutsche Bahn & NS',
        operatorLogo: '⚡ ICE International',
        vehicleType: 'crossborder-express',
        departureStation: 'Berlin Hauptbahnhof',
        departureTime: '11:45',
        departurePlatform: 'Peron 13',
        arrivalStation: 'Utrecht Centraal / Amersfoort',
        arrivalTime: '16:10',
        arrivalPlatform: 'Peron 5',
        duration: '4h 25m',
        distance: '480 km',
        seatReservation: true,
        ticketSystem: {
          name: 'DB / NS International System',
          howToPay: 'Wspólny bilet tranzytowy.',
          seniorDiscount: 'Miejsca z pierwszeństwem dla osób starszych.'
        },
        accessibilityNotes: 'Klimatyzowany pociąg, gniazdka elektryczne, bez barier schodowych.',
        transferBufferMins: 20,
        transferTips: 'Utrecht Centraal to największy i najnowocześniejszy dworzec w Holandii – w 100% z windami i ruchomymi chodnikami.'
      },
      {
        legNumber: 3,
        stageTitle: 'Etap 3: Bezpośredni Intercity NS do Rotterdamu + Tramwaj RET',
        country: 'Holandia 🇳🇱',
        operator: 'NS (Nederlandse Spoorwegen)',
        operatorLogo: '🚆 NS Intercity Dubbeldekker',
        vehicleType: 'national-ic',
        departureStation: 'Utrecht Centraal',
        departureTime: '16:30',
        departurePlatform: 'Peron 9',
        arrivalStation: 'Rotterdam Centraal',
        arrivalTime: '17:08',
        arrivalPlatform: 'Peron 1',
        duration: '38m',
        distance: '55 km',
        seatReservation: false,
        ticketSystem: {
          name: 'OVpay / Bilet NS',
          howToPay: 'Odbicie karty płatniczej w bramkach przy wyjściu.',
          seniorDiscount: 'Zniżki automatyczne.'
        },
        accessibilityNotes: 'Bezpieczne zakończenie podróży – asystent Tadzik wita na stacji docelowej!'
      }
    ]
  },

  // 4. HOLANDIA ➔ BELGIA ➔ FRANCJA (Rotterdam ➔ Bruksela ➔ Paryż Eurostar)
  {
    id: 'nl-be-fr-paris-eurostar',
    title: '🇳🇱 Holandia (Rotterdam) ➔ 🇧🇪 Belgia (Bruksela) ➔ 🇫🇷 Francja (Paryż Gare du Nord)',
    fromCountry: { code: 'NL', name: 'Holandia', flag: '🇳🇱', city: 'Rotterdam Centraal' },
    toCountry: { code: 'FR', name: 'Francja', flag: '🇫🇷', city: 'Paris Gare du Nord' },
    viaCountries: [
      { code: 'BE', flag: '🇧🇪', hub: 'Bruxelles-Midi' }
    ],
    totalDuration: '2h 37m',
    totalPriceEur: 49.00,
    totalPricePln: 210.00,
    comfortRating: '10/10 (Superszybki Eurostar 300 km/h)',
    transfersCount: 1,
    tags: ['Duża Prędkość', 'Bezpośredni Eurostar', 'Metro RATP Paryż', 'Brak przesiadek w pociągu'],
    operators: [
      { name: 'Eurostar High-Speed', country: 'NL/BE/FR', badge: '🚄 Eurostar International', type: 'Kolej Dużych Prędkości' },
      { name: 'RATP Paris', country: 'FR', badge: '🇫🇷 Metro / RER Paryż', type: 'Komunikacja Miejska' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: Pociąg Dużych Prędkości Eurostar (Rotterdam ➔ Bruksela ➔ Paryż)',
        country: 'Holandia ➔ Belgia ➔ Francja 🇳🇱🇧🇪🇫🇷',
        operator: 'Eurostar (ex-Thalys)',
        operatorLogo: '🚄 Eurostar Red Train (300 km/h)',
        vehicleType: 'crossborder-express',
        departureStation: 'Rotterdam Centraal',
        departureTime: '08:58',
        departurePlatform: 'Peron 1',
        arrivalStation: 'Paris Gare du Nord',
        arrivalTime: '11:35',
        arrivalPlatform: 'Peron 5',
        duration: '2h 37m',
        distance: '450 km',
        seatReservation: true,
        ticketSystem: {
          name: 'Bilet Eurostar Standard / Senior',
          howToPay: 'Rezerwacja z kodem QR w aplikacji Eurostar lub bilet pdf.',
          seniorDiscount: 'Taryfa Senior 60+ z darmowym miejscem przy stoliku.'
        },
        accessibilityNotes: 'Obsługa barowa Eurostar Café, kawa Nespresso i świeże rogaliki croissant, dedykowane miejsca dla wózków.',
        transferBufferMins: 20,
        transferTips: 'Gare du Nord: bezpośrednie zejście windami do stacji metra RATP Linii 4 i 5.'
      },
      {
        legNumber: 2,
        stageTitle: 'Etap 2: Metro RATP Paryż prosto pod Wieżę Eiffla / Luwr / Katedrę',
        country: 'Francja 🇫🇷',
        operator: 'RATP Paris',
        operatorLogo: '🚇 Metro Linia 4 / RER B',
        vehicleType: 'local-tram',
        departureStation: 'Paris Gare du Nord (Metro)',
        departureTime: '11:55',
        departurePlatform: 'Kierunek Bagneux / Châtelet',
        arrivalStation: 'Châtelet-Les Halles / Cité (Notre-Dame)',
        arrivalTime: '12:08',
        arrivalPlatform: 'Stacja centralna Cité',
        duration: '13m',
        distance: '4.2 km',
        seatReservation: false,
        ticketSystem: {
          name: 'Bilet T+ / Navigo Easy / Płatność zbliżeniowa',
          howToPay: 'Karta Navigo Easy lub zbliżenie smartfona do bramki biletowej RATP.',
          seniorDiscount: 'Ulgi Navigo Senior w kasach RATP.'
        },
        accessibilityNotes: 'Główne stacje centralne wyposażone w windy i schody ruchome.'
      }
    ]
  },

  // 5. FRANCJA ➔ NIEMCY ➔ POLSKA (Paryż ➔ Berlin ➔ Warszawa)
  {
    id: 'fr-de-pl-paris-warszawa',
    title: '🇫🇷 Francja (Paryż) ➔ 🇩🇪 Niemcy (Frankfurt/Berlin) ➔ 🇵🇱 Polska (Warszawa Centralna)',
    fromCountry: { code: 'FR', name: 'Francja', flag: '🇫🇷', city: 'Paris Gare de l\'Est' },
    toCountry: { code: 'PL', name: 'Polska', flag: '🇵🇱', city: 'Warszawa Centralna' },
    viaCountries: [
      { code: 'DE', flag: '🇩🇪', hub: 'Frankfurt (Main) Hbf / Berlin Hbf' }
    ],
    totalDuration: '12h 45m',
    totalPriceEur: 89.00,
    totalPricePln: 382.00,
    comfortRating: '9.7/10 (Luksusowy TGV Duplex + BWE)',
    transfersCount: 2,
    tags: ['TGV Duplex', 'Szybki Tranzyt Niemiecki', 'WARS Polski Obiad'],
    operators: [
      { name: 'SNCF / DB (TGV InOui)', country: 'FR/DE', badge: '🚄 TGV InOui Franco-Allemand', type: 'Kolej Francusko-Niemiecka' },
      { name: 'DB ICE Sprinter', country: 'DE', badge: '🇩🇪 DB ICE', type: 'Kolej Niemiecka' },
      { name: 'PKP Intercity', country: 'PL', badge: '🇵🇱 Berlin-Warszawa Express', type: 'Ekspres PKP' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: TGV Duplex Dużych Prędkości (Paryż Gare de l\'Est ➔ Frankfurt / Berlin)',
        country: 'Francja ➔ Niemcy 🇫🇷🇩🇪',
        operator: 'SNCF & DB (Alleo)',
        operatorLogo: '🚄 TGV InOui Duplex (320 km/h)',
        vehicleType: 'crossborder-express',
        departureStation: 'Paris Gare de l\'Est',
        departureTime: '07:20',
        departurePlatform: 'Peron 6',
        arrivalStation: 'Frankfurt (Main) Hbf / Mannheim',
        arrivalTime: '11:00',
        arrivalPlatform: 'Peron 8',
        duration: '3h 40m',
        distance: '580 km',
        seatReservation: true,
        ticketSystem: {
          name: 'Bilet TGV Franco-Allemand',
          howToPay: 'Kupiony na SNCF Connect lub DB Navigator z kodem QR.',
          seniorDiscount: 'Zniżka Carte Senior SNCF / DB Senior.'
        },
        accessibilityNotes: 'Dwupoziomowy pociąg z cichą strefą górnego pokładu z widokiem na krajobrazy Szampanii i Alzacji.',
        transferBufferMins: 30,
        transferTips: 'Frankfurt Hbf: bezpieczna przesiadka peron w peron na pociąg ICE do Berlina.'
      },
      {
        legNumber: 2,
        stageTitle: 'Etap 2: Ekspres DB ICE do Berlina Hauptbahnhof',
        country: 'Niemcy 🇩🇪',
        operator: 'Deutsche Bahn (DB)',
        operatorLogo: '⚡ ICE Sprinter',
        vehicleType: 'crossborder-express',
        departureStation: 'Frankfurt (Main) Hbf',
        departureTime: '11:30',
        departurePlatform: 'Peron 9',
        arrivalStation: 'Berlin Hauptbahnhof',
        arrivalTime: '15:25',
        arrivalPlatform: 'Peron 14',
        duration: '3h 55m',
        distance: '540 km',
        seatReservation: true,
        ticketSystem: {
          name: 'DB Transit Ticket',
          howToPay: 'W cenie zintegrowanego biletu.',
          seniorDiscount: 'Miejsca z pierwszeństwem.'
        },
        accessibilityNotes: 'Klimatyzowany wagon z gniazdkami i darmowym Wi-Fi.',
        transferBufferMins: 35,
        transferTips: 'Berlin Hbf: zjazd windą na peron pociągu Berlin-Warszawa Express.'
      },
      {
        legNumber: 3,
        stageTitle: 'Etap 3: Wieczorny Berlin-Warszawa-Express do Warszawy Centralnej',
        country: 'Polska 🇵🇱',
        operator: 'PKP Intercity',
        operatorLogo: '🇵🇱 Berlin-Warszawa Express',
        vehicleType: 'crossborder-express',
        departureStation: 'Berlin Hauptbahnhof',
        departureTime: '16:00',
        departurePlatform: 'Peron 12',
        arrivalStation: 'Warszawa Centralna',
        arrivalTime: '21:20',
        arrivalPlatform: 'Peron 4',
        duration: '5h 20m',
        distance: '575 km',
        seatReservation: true,
        ticketSystem: {
          name: 'PKP Intercity Międzynarodowy',
          howToPay: 'Kod QR w telefonie.',
          seniorDiscount: '30% ulga dla seniorów 60+.'
        },
        accessibilityNotes: 'Kolacja w wagonie WARS, przyjazd do centrum Warszawy bez barier.'
      }
    ]
  },

  // 6. BELGIA ➔ NIEMCY ➔ POLSKA (Bruksela ➔ Köln ➔ Berlin ➔ Kraków/Wrocław)
  {
    id: 'be-de-pl-brussels-krakow',
    title: '🇧🇪 Belgia (Bruksela Midi) ➔ 🇩🇪 Niemcy (Köln/Berlin) ➔ 🇵🇱 Polska (Wrocław/Kraków)',
    fromCountry: { code: 'BE', name: 'Belgia', flag: '🇧🇪', city: 'Bruxelles-Midi' },
    toCountry: { code: 'PL', name: 'Polska', flag: '🇵🇱', city: 'Kraków Główny' },
    viaCountries: [
      { code: 'DE', flag: '🇩🇪', hub: 'Köln Hbf / Berlin Hbf' }
    ],
    totalDuration: '12h 10m',
    totalPriceEur: 79.00,
    totalPricePln: 339.00,
    comfortRating: '9.8/10 (Komfort ICE & IC Odra/Wawel)',
    transfersCount: 2,
    tags: ['Przez malowniczą Nadrenię', 'Przesiadka przy Katedrze w Kolonii', 'Kraków bez barier'],
    operators: [
      { name: 'DB ICE International', country: 'BE/DE', badge: '🚄 ICE Bruxelles-Köln', type: 'Kolej Dużych Prędkości' },
      { name: 'DB Intercity', country: 'DE', badge: '🇩🇪 DB ICE Berlin', type: 'Kolej Niemiecka' },
      { name: 'PKP Intercity', country: 'PL', badge: '🇵🇱 IC Wawel / Odra', type: 'Ekspres PKP' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: ICE Dużych Prędkości (Bruxelles-Midi ➔ Liège ➔ Köln Hbf)',
        country: 'Belgia ➔ Niemcy 🇧🇪🇩🇪',
        operator: 'Deutsche Bahn & SNCB',
        operatorLogo: '🚄 ICE International 300 km/h',
        vehicleType: 'crossborder-express',
        departureStation: 'Bruxelles-Midi (Zuid)',
        departureTime: '08:23',
        departurePlatform: 'Peron 3',
        arrivalStation: 'Köln Hauptbahnhof (przy Katedrze)',
        arrivalTime: '10:15',
        arrivalPlatform: 'Peron 6',
        duration: '1h 52m',
        distance: '220 km',
        seatReservation: true,
        ticketSystem: {
          name: 'Bilet SNCB Europe / DB International',
          howToPay: 'Elektroniczny bilet z kodem QR.',
          seniorDiscount: 'SNCB / DB Senior tariff.'
        },
        accessibilityNotes: 'Stacja Köln Hbf położona jest tuż pod słynną Katedrą, z windami na każdy peron.',
        transferBufferMins: 25,
        transferTips: 'Piękny widok na Katedrę Kolońską podczas oczekiwania na połączenie do Berlina.'
      },
      {
        legNumber: 2,
        stageTitle: 'Etap 2: Ekspres ICE do Berlina lub Frankfurt (Oder)',
        country: 'Niemcy 🇩🇪',
        operator: 'Deutsche Bahn (DB)',
        operatorLogo: '⚡ ICE Express',
        vehicleType: 'crossborder-express',
        departureStation: 'Köln Hauptbahnhof',
        departureTime: '10:40',
        departurePlatform: 'Peron 2',
        arrivalStation: 'Berlin Hauptbahnhof',
        arrivalTime: '15:05',
        arrivalPlatform: 'Peron 13',
        duration: '4h 25m',
        distance: '570 km',
        seatReservation: true,
        ticketSystem: {
          name: 'DB Transit System',
          howToPay: 'W cenie zintegrowanego biletu.',
          seniorDiscount: 'Gwarantowane miejsce w strefie cichej podróży.'
        },
        accessibilityNotes: 'Klimatyzowany pociąg, barek pokładowy.',
        transferBufferMins: 30,
        transferTips: 'Berlin Hbf: komfortowa przesiadka do pociągu IC Wawel do Krakowa.'
      },
      {
        legNumber: 3,
        stageTitle: 'Etap 3: Pociąg IC Wawel do Wrocławia i Krakowa Głównego',
        country: 'Polska 🇵🇱',
        operator: 'PKP Intercity',
        operatorLogo: '🇵🇱 PKP Intercity IC Wawel',
        vehicleType: 'crossborder-express',
        departureStation: 'Berlin Hauptbahnhof',
        departureTime: '15:35',
        departurePlatform: 'Peron 2',
        arrivalStation: 'Kraków Główny',
        arrivalTime: '21:30',
        arrivalPlatform: 'Peron 1',
        duration: '5h 55m',
        distance: '590 km',
        seatReservation: true,
        ticketSystem: {
          name: 'Bilet PKP Intercity z miejscówką',
          howToPay: 'Kod QR w telefonie.',
          seniorDiscount: '30% zniżki dla osób 60+.'
        },
        accessibilityNotes: 'Bezpośredni zjazd windami do tunelu Krakowskiego Szybkiego Tramwaju (KST).'
      }
    ]
  },

  // 7. NIEMCY ➔ HOLANDIA (Berlin / Köln ➔ Amsterdam / Rotterdam)
  {
    id: 'de-nl-berlin-rotterdam',
    title: '🇩🇪 Niemcy (Berlin/Düsseldorf) ➔ 🇳🇱 Holandia (Arnhem/Utrecht/Rotterdam)',
    fromCountry: { code: 'DE', name: 'Niemcy', flag: '🇩🇪', city: 'Berlin Hauptbahnhof' },
    toCountry: { code: 'NL', name: 'Holandia', flag: '🇳🇱', city: 'Rotterdam Centraal' },
    viaCountries: [{ code: 'NL', flag: '🇳🇱', hub: 'Utrecht Centraal' }],
    totalDuration: '6h 15m',
    totalPriceEur: 39.00,
    totalPricePln: 168.00,
    comfortRating: '9.9/10 (Bezpośredni ICE International)',
    transfersCount: 1,
    tags: ['Bezpośredni do Utrechtu', 'Łatwy dojazd do Rotterdamu', 'Wygodne wagony'],
    operators: [
      { name: 'DB ICE International', country: 'DE/NL', badge: '⚡ ICE International', type: 'Kolej Dużych Prędkości' },
      { name: 'NS Intercity', country: 'NL', badge: '🇳🇱 NS Intercity', type: 'Kolej Holenderska' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: ICE International (Berlin Hbf ➔ Hannover ➔ Utrecht Centraal)',
        country: 'Niemcy ➔ Holandia 🇩🇪🇳🇱',
        operator: 'Deutsche Bahn & NS',
        operatorLogo: '⚡ ICE International',
        vehicleType: 'crossborder-express',
        departureStation: 'Berlin Hauptbahnhof',
        departureTime: '08:35',
        departurePlatform: 'Peron 13',
        arrivalStation: 'Utrecht Centraal',
        arrivalTime: '14:28',
        arrivalPlatform: 'Peron 7',
        duration: '5h 53m',
        distance: '595 km',
        seatReservation: true,
        ticketSystem: {
          name: 'Bilet DB / NS Europa-Spezial',
          howToPay: 'Kod QR w telefonie.',
          seniorDiscount: 'Zniżka międzynarodowa dla seniorów.'
        },
        accessibilityNotes: 'Obsługa stacyjna Tadzika gotowa w Utrechcie do pomocy przy przesiadce.',
        transferBufferMins: 18,
        transferTips: 'Przesiadka peron w peron na pociąg NS Intercity do Rotterdamu.'
      },
      {
        legNumber: 2,
        stageTitle: 'Etap 2: Szybki Pociąg NS do Rotterdamu Centraal',
        country: 'Holandia 🇳🇱',
        operator: 'NS (Nederlandse Spoorwegen)',
        operatorLogo: '🚆 NS Intercity Dubbeldekker',
        vehicleType: 'national-ic',
        departureStation: 'Utrecht Centraal',
        departureTime: '14:46',
        departurePlatform: 'Peron 9',
        arrivalStation: 'Rotterdam Centraal',
        arrivalTime: '15:24',
        arrivalPlatform: 'Peron 3',
        duration: '38m',
        distance: '55 km',
        seatReservation: false,
        ticketSystem: {
          name: 'W cenie biletu tranzytowego / OVpay',
          howToPay: 'Wystarczy bilet zintegrowany lub zbliżenie karty płatniczej.',
          seniorDiscount: 'Zniżki senioralne.'
        },
        accessibilityNotes: 'Rotterdam Centraal w 100% dostosowany, schody ruchome, windy, metro RET tuż obok.'
      }
    ]
  },

  // ==========================================
  // DOMESTIC RAIL ROUTES (KRAJOWE POŁĄCZENIA KOLEJOWE W DANYM KRAJU)
  // ==========================================

  // --- 8. POLSKA 🇵🇱: WARSZAWA ➔ KRAKÓW GŁÓWNY (EIP Pendolino) ---
  {
    id: 'pl-pl-warszawa-krakow',
    title: '🇵🇱 Polska Krajowa: Warszawa Centralna ➔ Kraków Główny (EIP Pendolino / WARS)',
    fromCountry: { code: 'PL', name: 'Polska', flag: '🇵🇱', city: 'Warszawa Centralna' },
    toCountry: { code: 'PL', name: 'Polska', flag: '🇵🇱', city: 'Kraków Główny' },
    viaCountries: [],
    totalDuration: '2h 15m',
    totalPriceEur: 24.00,
    totalPricePln: 104.00,
    comfortRating: '10/10 (Ekspres Pendolino 200 km/h)',
    transfersCount: 0,
    tags: ['Bezpośredni Pendolino', 'Wagon WARS', 'Strefa Ciszy', 'Darmowy poczęstunek w cenie'],
    operators: [
      { name: 'PKP Intercity (EIP)', country: 'PL', badge: '🇵🇱 Express InterCity Premium (Pendolino)', type: 'Kolej Dużych Prędkości' },
      { name: 'MPK Kraków (KST)', country: 'PL', badge: '🚊 Krakowski Szybki Tramwaj', type: 'Komunikacja Miejska' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: Bezpośredni Ekspres EIP Pendolino (Warszawa Centralna ➔ Kraków Główny)',
        country: 'Polska 🇵🇱',
        operator: 'PKP Intercity (Express InterCity Premium)',
        operatorLogo: '🚅 EIP Pendolino 200 km/h',
        vehicleType: 'crossborder-express',
        departureStation: 'Warszawa Centralna',
        departureTime: '09:20',
        departurePlatform: 'Peron 3',
        arrivalStation: 'Kraków Główny',
        arrivalTime: '11:35',
        arrivalPlatform: 'Peron 1',
        duration: '2h 15m',
        distance: '293 km',
        seatReservation: true,
        ticketSystem: {
          name: 'PKP Intercity / Bilet dla Seniora (30% taniej)',
          howToPay: 'Bilet internetowy (kod QR na telefonie) lub biletomaty na dworcu. Konduktor skanuje kod.',
          seniorDiscount: '30% stałej zniżki dla osób 60+ (Bilet dla Seniora) na wszystkie kategorie pociągów.'
        },
        accessibilityNotes: 'Dźwigi dla osób na wózkach, automatycznie otwierane drzwi, wagon restauracyjny WARS, asysta PKP na peronie.',
        transferBufferMins: 15,
        transferTips: 'Dworzec Kraków Główny: zjazd windami bezpośrednio do podziemnego tunelu Krakowskiego Szybkiego Tramwaju.'
      },
      {
        legNumber: 2,
        stageTitle: 'Etap 2: Krakowski Szybki Tramwaj KST (Dworzec Główny Tunel ➔ Rynek / Wawel)',
        country: 'Polska 🇵🇱',
        operator: 'MPK Kraków',
        operatorLogo: '🚊 Tramwaj Niskopodłogowy Linia 50 / 19',
        vehicleType: 'local-tram',
        departureStation: 'Dworzec Główny Tunel (KST)',
        departureTime: '11:45',
        departurePlatform: 'Kierunek Kurdwanów / Borek',
        arrivalStation: 'Rondo Mogilskie / Poczta Główna (Rynek)',
        arrivalTime: '11:55',
        arrivalPlatform: 'Przystanek naziemny',
        duration: '10m',
        distance: '3.2 km',
        seatReservation: false,
        ticketSystem: {
          name: 'MPK Kraków Bilet 20-minutowy',
          howToPay: 'Płatność kartą w biletomacie wewnątrz tramwaju.',
          seniorDiscount: 'Seniorzy 70+ podróżują 100% BEZPŁATNIE (dowód osobisty).'
        },
        accessibilityNotes: 'Przystanek podziemny z windami i schodami ruchomymi prosto na płytę dworca.'
      }
    ]
  },

  // --- 9. POLSKA 🇵🇱: TRÓJMIASTO (GDAŃSK) ➔ WARSZAWA ➔ KRAKÓW ---
  {
    id: 'pl-pl-gdansk-warszawa-krakow',
    title: '🇵🇱 Polska Krajowa: Gdańsk Główny ➔ Warszawa Centralna ➔ Kraków Główny',
    fromCountry: { code: 'PL', name: 'Polska', flag: '🇵🇱', city: 'Gdańsk Główny' },
    toCountry: { code: 'PL', name: 'Polska', flag: '🇵🇱', city: 'Kraków Główny' },
    viaCountries: [{ code: 'PL', flag: '🇵🇱', hub: 'Warszawa Centralna' }],
    totalDuration: '5h 05m',
    totalPriceEur: 36.00,
    totalPricePln: 154.00,
    comfortRating: '9.9/10 (Przekątna Polski w EIP)',
    transfersCount: 0,
    tags: ['Bezpośrednie połączenie Trójmiasto - Małopolska', 'WARS', 'Trasa Nadmorska'],
    operators: [
      { name: 'PKP Intercity EIP', country: 'PL', badge: '🇵🇱 EIP Pendolino', type: 'Kolej Dużych Prędkości' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: EIP Pendolino Północ ➔ Południe (Gdańsk Główny ➔ Warszawa ➔ Kraków)',
        country: 'Polska 🇵🇱',
        operator: 'PKP Intercity (EIP)',
        operatorLogo: '🚅 EIP Pendolino',
        vehicleType: 'crossborder-express',
        departureStation: 'Gdańsk Główny',
        departureTime: '06:45',
        departurePlatform: 'Peron 2',
        arrivalStation: 'Kraków Główny',
        arrivalTime: '11:50',
        arrivalPlatform: 'Peron 3',
        duration: '5h 05m',
        distance: '620 km',
        seatReservation: true,
        ticketSystem: {
          name: 'Super Promo PKP Intercity',
          howToPay: 'Aplikacja PKP / portal intercity.pl / kasy biletowe.',
          seniorDiscount: 'Ulga dla seniorów 60+ (30% taniej).'
        },
        accessibilityNotes: 'Dedykowane miejsca dla seniorów i osób z ograniczoną sprawnością ruchową, catering WARS.'
      }
    ]
  },

  // --- 10. POLSKA 🇵🇱: WROCŁAW GŁÓWNY ➔ POZNAŃ ➔ GDAŃSK ---
  {
    id: 'pl-pl-wroclaw-poznan-gdansk',
    title: '🇵🇱 Polska Krajowa: Wrocław Główny ➔ Poznań Główny ➔ Bydgoszcz ➔ Gdańsk Główny',
    fromCountry: { code: 'PL', name: 'Polska', flag: '🇵🇱', city: 'Wrocław Główny' },
    toCountry: { code: 'PL', name: 'Polska', flag: '🇵🇱', city: 'Gdańsk Główny' },
    viaCountries: [{ code: 'PL', flag: '🇵🇱', hub: 'Poznań Główny' }],
    totalDuration: '4h 45m',
    totalPriceEur: 19.50,
    totalPricePln: 84.00,
    comfortRating: '9.6/10 (Komfortowe wagony bezprzedziałowe IC)',
    transfersCount: 0,
    tags: ['Bezpośredni IC Heweliusz', 'Klimatyzacja', 'Gniazdka 230V'],
    operators: [
      { name: 'PKP Intercity (IC)', country: 'PL', badge: '🇵🇱 PKP Intercity IC', type: 'Ekspres Krajowy' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: Bezpośredni Pociąg IC (Wrocław Główny ➔ Poznań ➔ Gdańsk Główny)',
        country: 'Polska 🇵🇱',
        operator: 'PKP Intercity (IC)',
        operatorLogo: '🚆 IC Heweliusz / Bałtyk',
        vehicleType: 'national-ic',
        departureStation: 'Wrocław Główny',
        departureTime: '07:35',
        departurePlatform: 'Peron 4',
        arrivalStation: 'Gdańsk Główny',
        arrivalTime: '12:20',
        arrivalPlatform: 'Peron 1',
        duration: '4h 45m',
        distance: '480 km',
        seatReservation: true,
        ticketSystem: {
          name: 'PKP Bilet Taniomiastowy / Bilet dla Seniora',
          howToPay: 'Kod QR w telefonie lub biletomat PKP.',
          seniorDiscount: '30% zniżki dla osób powyżej 60. roku życia.'
        },
        accessibilityNotes: 'Nowe wagony z rampami i strefami dla wózków, nowoczesne toalety z przewijakami.'
      }
    ]
  },

  // --- 11. POLSKA 🇵🇱: KRAKÓW GŁÓWNY ➔ NOWY TARG ➔ ZAKOPANE ---
  {
    id: 'pl-pl-krakow-zakopane',
    title: '🇵🇱 Polska Krajowa: Kraków Główny ➔ Nowy Targ ➔ Zakopane (Tatry Express)',
    fromCountry: { code: 'PL', name: 'Polska', flag: '🇵🇱', city: 'Kraków Główny' },
    toCountry: { code: 'PL', name: 'Polska', flag: '🇵🇱', city: 'Zakopane' },
    viaCountries: [],
    totalDuration: '2h 08m',
    totalPriceEur: 7.50,
    totalPricePln: 32.00,
    comfortRating: '9.7/10 (Malownicza linia podhalańska)',
    transfersCount: 0,
    tags: ['Tatry Express', 'Zmodernizowana linia górska', 'Widoki na Tatry'],
    operators: [
      { name: 'PKP Intercity / Polregio', country: 'PL', badge: '🇵🇱 Koleje Małopolskie / IC', type: 'Kolej Regionalna & IC' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: Malowniczy przejazd Koleją Podhalańską (Kraków ➔ Zakopane)',
        country: 'Polska 🇵🇱',
        operator: 'PKP Intercity / Koleje Małopolskie',
        operatorLogo: '🚆 IC Tatry / Podhalanin',
        vehicleType: 'national-ic',
        departureStation: 'Kraków Główny',
        departureTime: '08:40',
        departurePlatform: 'Peron 2',
        arrivalStation: 'Zakopane Dworzec Główny',
        arrivalTime: '10:48',
        arrivalPlatform: 'Peron 1',
        duration: '2h 08m',
        distance: '104 km',
        seatReservation: true,
        ticketSystem: {
          name: 'Bilet Górski PKP / Polregio',
          howToPay: 'Kod QR lub karta w pociągu.',
          seniorDiscount: 'Ulga Małopolska dla Seniora.'
        },
        accessibilityNotes: 'Nowo wyremontowany dworzec w Zakopanem z pełną dostępnością dla niepełnosprawnych.'
      }
    ]
  },

  // --- 12. HOLANDIA 🇳🇱: AMSTERDAM ➔ SCHIPHOL ➔ ROTTERDAM (NS Intercity Direct) ---
  {
    id: 'nl-nl-amsterdam-rotterdam',
    title: '🇳🇱 Holandia Krajowa: Amsterdam Centraal ➔ Schiphol Airport ➔ Rotterdam Centraal (HSL Direct)',
    fromCountry: { code: 'NL', name: 'Holandia', flag: '🇳🇱', city: 'Amsterdam Centraal' },
    toCountry: { code: 'NL', name: 'Holandia', flag: '🇳🇱', city: 'Rotterdam Centraal' },
    viaCountries: [{ code: 'NL', flag: '🇳🇱', hub: 'Schiphol Airport' }],
    totalDuration: '39m',
    totalPriceEur: 17.80,
    totalPricePln: 76.50,
    comfortRating: '9.9/10 (Szybka kolej HSL-Zuid co 15 minut)',
    transfersCount: 0,
    tags: ['Ekspres HSL Direct', 'Bezpośredni na lotnisko', 'Płatność zbliżeniowa OVpay'],
    operators: [
      { name: 'NS Intercity Direct', country: 'NL', badge: '🇳🇱 NS Intercity Direct HSL', type: 'Kolej Dużych Prędkości' },
      { name: 'RET Rotterdam', country: 'NL', badge: '🇳🇱 Metro & Tramwaje Rotterdam', type: 'Komunikacja Miejska' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: Szybki Pociąg HSL Intercity Direct (Amsterdam ➔ Schiphol ➔ Rotterdam)',
        country: 'Holandia 🇳🇱',
        operator: 'NS (Nederlandse Spoorwegen)',
        operatorLogo: '⚡ NS Intercity Direct Traxx',
        vehicleType: 'national-ic',
        departureStation: 'Amsterdam Centraal',
        departureTime: '10:05',
        departurePlatform: 'Peron 14a',
        arrivalStation: 'Rotterdam Centraal',
        arrivalTime: '10:44',
        arrivalPlatform: 'Peron 4',
        duration: '39m',
        distance: '75 km',
        seatReservation: false,
        ticketSystem: {
          name: 'System OVpay (Holandia)',
          howToPay: 'Wystarczy zbliżyć dowolną kartę płatniczą VISA/Mastercard lub telefon do bramki na dworcu (Check-In i Check-Out).',
          seniorDiscount: 'Zniżki NS Dal Voordeel i ulgi wiekowe.'
        },
        accessibilityNotes: 'Niskopodłogowy tabor, windy na każdym peronie, bezprogowe przejście do metra RET.',
        transferBufferMins: 10,
        transferTips: 'Rotterdam Centraal: zejście schodami ruchomymi do stacji metra linii D/E i tramwajów.'
      }
    ]
  },

  // --- 13. HOLANDIA 🇳🇱: UTRECHT ➔ EINDHOVEN ➔ MAASTRICHT ---
  {
    id: 'nl-nl-utrecht-maastricht',
    title: '🇳🇱 Holandia Krajowa: Utrecht Centraal ➔ \'s-Hertogenbosch ➔ Eindhoven ➔ Maastricht',
    fromCountry: { code: 'NL', name: 'Holandia', flag: '🇳🇱', city: 'Utrecht Centraal' },
    toCountry: { code: 'NL', name: 'Holandia', flag: '🇳🇱', city: 'Maastricht' },
    viaCountries: [{ code: 'NL', flag: '🇳🇱', hub: 'Eindhoven Centraal' }],
    totalDuration: '1h 55m',
    totalPriceEur: 28.50,
    totalPricePln: 122.00,
    comfortRating: '9.8/10 (Piętrowy NS Dubbeldekker VIRM)',
    transfersCount: 0,
    tags: ['Bezpośredni do Limburga', 'Piętrowy pociąg panoramiczny', 'Strefa ciszy'],
    operators: [
      { name: 'NS Intercity', country: 'NL', badge: '🇳🇱 NS Dubbeldekker Intercity', type: 'Kolej Holenderska' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: NS Intercity Północ-Południe (Utrecht ➔ Eindhoven ➔ Maastricht)',
        country: 'Holandia 🇳🇱',
        operator: 'NS (Nederlandse Spoorwegen)',
        operatorLogo: '🚆 NS Intercity VIRMm',
        vehicleType: 'national-ic',
        departureStation: 'Utrecht Centraal',
        departureTime: '08:22',
        departurePlatform: 'Peron 18',
        arrivalStation: 'Maastricht Centraal',
        arrivalTime: '10:17',
        arrivalPlatform: 'Peron 1',
        duration: '1h 55m',
        distance: '185 km',
        seatReservation: false,
        ticketSystem: {
          name: 'OVpay / E-ticket NS',
          howToPay: 'Zbliżenie karty bankowej lub bilet w aplikacji NS.',
          seniorDiscount: 'Ulgi NS dla osób powyżej 65 roku życia.'
        },
        accessibilityNotes: 'Komfortowe fotele, toalety przystosowane dla wózków, doskonała klimatyzacja.'
      }
    ]
  },

  // --- 14. NIEMCY 🇩🇪: BERLIN HBF ➔ LEIPZIG ➔ NÜRNBERG ➔ MÜNCHEN HBF ---
  {
    id: 'de-de-berlin-munchen',
    title: '🇩🇪 Niemcy Krajowe: Berlin Hauptbahnhof ➔ Leipzig ➔ Nürnberg ➔ München Hauptbahnhof',
    fromCountry: { code: 'DE', name: 'Niemcy', flag: '🇩🇪', city: 'Berlin Hauptbahnhof' },
    toCountry: { code: 'DE', name: 'Niemcy', flag: '🇩🇪', city: 'München Hauptbahnhof' },
    viaCountries: [{ code: 'DE', flag: '🇩🇪', hub: 'Nürnberg Hbf' }],
    totalDuration: '3h 55m',
    totalPriceEur: 49.00,
    totalPricePln: 210.00,
    comfortRating: '10/10 (ICE 4 Sprinter 300 km/h)',
    transfersCount: 0,
    tags: ['ICE Sprinter', 'Magistrala VDE 8', 'Bordrestaurant', 'WiFi i gniazdka'],
    operators: [
      { name: 'Deutsche Bahn ICE', country: 'DE', badge: '🇩🇪 DB ICE Sprinter', type: 'Kolej Dużych Prędkości' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: ICE Sprinter przez Turyngię i Bawarię (Berlin ➔ Monachium)',
        country: 'Niemcy 🇩🇪',
        operator: 'Deutsche Bahn (DB Fernverkehr)',
        operatorLogo: '⚡ DB ICE 4 Sprinter',
        vehicleType: 'crossborder-express',
        departureStation: 'Berlin Hauptbahnhof (Tief)',
        departureTime: '08:04',
        departurePlatform: 'Peron 1',
        arrivalStation: 'München Hauptbahnhof',
        arrivalTime: '11:59',
        arrivalPlatform: 'Peron 21',
        duration: '3h 55m',
        distance: '625 km',
        seatReservation: true,
        ticketSystem: {
          name: 'DB Sparpreis / Flexpreis / BahnCard',
          howToPay: 'Aplikacja DB Navigator lub bilet z kodem QR.',
          seniorDiscount: 'BahnCard 25/50 Senior (zniżka od cen biletów).'
        },
        accessibilityNotes: 'Wagon gastronomiczny z ciepłymi daniami bawarskimi, obsługa stacyjna DB Bahnhofsmission.'
      }
    ]
  },

  // --- 15. NIEMCY 🇩🇪: KÖLN HBF ➔ FRANKFURT (MAIN) HBF ---
  {
    id: 'de-de-koln-frankfurt',
    title: '🇩🇪 Niemcy Krajowe: Köln Hauptbahnhof ➔ Frankfurt Flughafen ➔ Frankfurt (Main) Hbf',
    fromCountry: { code: 'DE', name: 'Niemcy', flag: '🇩🇪', city: 'Köln Hauptbahnhof' },
    toCountry: { code: 'DE', name: 'Niemcy', flag: '🇩🇪', city: 'Frankfurt (Main) Hauptbahnhof' },
    viaCountries: [{ code: 'DE', flag: '🇩🇪', hub: 'Frankfurt Flughafen Fernbahnhof' }],
    totalDuration: '1h 05m',
    totalPriceEur: 29.00,
    totalPricePln: 124.00,
    comfortRating: '9.9/10 (Trasa Szybkich Prędkości 300 km/h)',
    transfersCount: 0,
    tags: ['Super Szybki ICE 3', 'Widok na Katedrę w Kolonii', 'Dojazd na lotnisko'],
    operators: [
      { name: 'Deutsche Bahn ICE', country: 'DE', badge: '🇩🇪 DB ICE 3', type: 'Kolej Dużych Prędkości' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: ICE 300 km/h Magistralą Köln-Rhein/Main',
        country: 'Niemcy 🇩🇪',
        operator: 'Deutsche Bahn',
        operatorLogo: '⚡ DB ICE 3 Neo',
        vehicleType: 'crossborder-express',
        departureStation: 'Köln Hauptbahnhof',
        departureTime: '09:12',
        departurePlatform: 'Peron 7',
        arrivalStation: 'Frankfurt (Main) Hauptbahnhof',
        arrivalTime: '10:17',
        arrivalPlatform: 'Peron 9',
        duration: '1h 05m',
        distance: '180 km',
        seatReservation: true,
        ticketSystem: {
          name: 'DB Super Sparpreis',
          howToPay: 'Kod QR w telefonie.',
          seniorDiscount: 'Dostępne ulgi senioralne.'
        },
        accessibilityNotes: 'Bezprogowy dostęp na stacjach lotniskowych i głównych.'
      }
    ]
  },

  // --- 16. BELGIA 🇧🇪: BRUKSELA ➔ GENT ➔ BRUGIA ➔ OOSTENDE ---
  {
    id: 'be-be-brussels-brugge-oostende',
    title: '🇧🇪 Belgia Krajowa: Bruxelles-Midi ➔ Gent-Sint-Pieters ➔ Brugge (Bruggia) ➔ Oostende',
    fromCountry: { code: 'BE', name: 'Belgia', flag: '🇧🇪', city: 'Bruxelles-Midi' },
    toCountry: { code: 'BE', name: 'Belgia', flag: '🇧🇪', city: 'Brugge (Brugia)' },
    viaCountries: [{ code: 'BE', flag: '🇧🇪', hub: 'Gent-Sint-Pieters' }],
    totalDuration: '1h 02m',
    totalPriceEur: 8.30,
    totalPricePln: 35.50,
    comfortRating: '9.9/10 (SNCB Bilet Seniora tylko €8.30!)',
    transfersCount: 0,
    tags: ['Bilet Seniora €8.30 w całej Belgii', 'Bezpośrednio do bajkowej Brugii', 'Tabor M7'],
    operators: [
      { name: 'SNCB / NMBS', country: 'BE', badge: '🇧🇪 SNCB Intercity IC', type: 'Koleje Belgijskie' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: Bezpośredni Pociąg Intercity SNCB do Brugii i nad Morze Północne',
        country: 'Belgia 🇧🇪',
        operator: 'SNCB / NMBS (Koleje Belgijskie)',
        operatorLogo: '🚆 SNCB Intercity M7',
        vehicleType: 'national-ic',
        departureStation: 'Bruxelles-Midi (lub Central)',
        departureTime: '09:30',
        departurePlatform: 'Peron 10',
        arrivalStation: 'Brugge Station',
        arrivalTime: '10:32',
        arrivalPlatform: 'Peron 2',
        duration: '1h 02m',
        distance: '95 km',
        seatReservation: false,
        ticketSystem: {
          name: 'SNCB Seniorenticket (Bilet Seniora)',
          howToPay: 'Kup w kasie SNCB, biletomacie lub w aplikacji SNCB.',
          seniorDiscount: 'Stała, ryczałtowa cena €8.30 w obie strony dla osób 65+ w całej Belgii po godz. 9:00!'
        },
        accessibilityNotes: 'Dworzec w Brugii połączony z urokliwym deptakiem prowadzącym na Rynek i kanały.',
        transferTips: 'Przed dworcem czekają autobusy miejskie De Lijn wjeżdżające bezpośrednio do centrum historycznego.'
      }
    ]
  },

  // --- 17. FRANCJA 🇫🇷: PARYŻ ➔ LYON ➔ MARSYLIA (TGV InOui) ---
  {
    id: 'fr-fr-paris-lyon-marseille',
    title: '🇫🇷 Francja Krajowa: Paris Gare de Lyon ➔ Lyon Part-Dieu ➔ Marseille Saint-Charles',
    fromCountry: { code: 'FR', name: 'Francja', flag: '🇫🇷', city: 'Paris Gare de Lyon' },
    toCountry: { code: 'FR', name: 'Francja', flag: '🇫🇷', city: 'Marseille Saint-Charles' },
    viaCountries: [{ code: 'FR', flag: '🇫🇷', hub: 'Lyon Part-Dieu' }],
    totalDuration: '3h 04m',
    totalPriceEur: 45.00,
    totalPricePln: 193.00,
    comfortRating: '10/10 (TGV InOui Duplex 320 km/h)',
    transfersCount: 0,
    tags: ['TGV InOui 320 km/h', 'Z Paryża na Lazurowe Wybrzeże', 'Wagon Café Bar'],
    operators: [
      { name: 'SNCF Voyageurs', country: 'FR', badge: '🇫🇷 TGV InOui Duplex', type: 'Kolej Dużych Prędkości' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: TGV InOui z Paryża do Prowansji i Morza Śródziemnego',
        country: 'Francja 🇫🇷',
        operator: 'SNCF (Société Nationale des Chemins de fer Français)',
        operatorLogo: '🚅 TGV InOui Duplex',
        vehicleType: 'crossborder-express',
        departureStation: 'Paris Gare de Lyon',
        departureTime: '08:58',
        departurePlatform: 'Hala 1 / Peron G',
        arrivalStation: 'Marseille Saint-Charles',
        arrivalTime: '12:02',
        arrivalPlatform: 'Peron A',
        duration: '3h 04m',
        distance: '750 km',
        seatReservation: true,
        ticketSystem: {
          name: 'SNCF Connect / Carte Avantage Senior',
          howToPay: 'Kod QR w aplikacji SNCF Connect lub bilet elektroniczny.',
          seniorDiscount: 'Gwarantowane 30% zniżki z kartą Carte Avantage Senior.'
        },
        accessibilityNotes: 'Tabor piętrowy z dedykowanymi miejscami dla seniorów i niepełnosprawnych na dolnym poziomie.'
      }
    ]
  },

  // --- 18. FRANCJA 🇫🇷: PARYŻ ➔ BORDEAUX (TGV InOui 2h) ---
  {
    id: 'fr-fr-paris-bordeaux',
    title: '🇫🇷 Francja Krajowa: Paris Montparnasse ➔ Tours ➔ Bordeaux Saint-Jean',
    fromCountry: { code: 'FR', name: 'Francja', flag: '🇫🇷', city: 'Paris Montparnasse' },
    toCountry: { code: 'FR', name: 'Francja', flag: '🇫🇷', city: 'Bordeaux Saint-Jean' },
    viaCountries: [],
    totalDuration: '2h 04m',
    totalPriceEur: 39.00,
    totalPricePln: 167.00,
    comfortRating: '10/10 (Ekspres Atlantycki 320 km/h)',
    transfersCount: 0,
    tags: ['Błyskawiczny TGV 2h 04m', 'Magistrala LGV Océane', 'Komfort Premium'],
    operators: [
      { name: 'SNCF TGV', country: 'FR', badge: '🇫🇷 TGV InOui Océane', type: 'Kolej Dużych Prędkości' }
    ],
    legs: [
      {
        legNumber: 1,
        stageTitle: 'Etap 1: TGV Atlantique (Paris ➔ Bordeaux)',
        country: 'Francja 🇫🇷',
        operator: 'SNCF',
        operatorLogo: '🚅 TGV InOui Océane',
        vehicleType: 'crossborder-express',
        departureStation: 'Paris Montparnasse',
        departureTime: '10:10',
        departurePlatform: 'Hala 2 / Peron 5',
        arrivalStation: 'Bordeaux Saint-Jean',
        arrivalTime: '12:14',
        arrivalPlatform: 'Peron 1',
        duration: '2h 04m',
        distance: '580 km',
        seatReservation: true,
        ticketSystem: {
          name: 'SNCF Connect',
          howToPay: 'Bilet z kodem QR.',
          seniorDiscount: 'Zniżki Carte Senior.'
        },
        accessibilityNotes: 'Dworzec Bordeaux w pełni zintegrowany z nowoczesną siecią tramwajów TBM.'
      }
    ]
  }
];

export const InternationalTransitCoordinator: React.FC<InternationalTransitCoordinatorProps> = ({
  language,
  account,
  initialFromCountry = 'PL',
  initialToCountry = 'PL'
}) => {
  const pl = language === 'pl';
  const nl = language === 'nl';
  const de = language === 'de';

  // Active Country Tab: 'PL' | 'NL' | 'DE' | 'BE' | 'FR' | 'CROSS_BORDER'
  const [activeCountryTab, setActiveCountryTab] = useState<EuropeanCountryCode | 'CROSS_BORDER'>('PL');

  // Transport Mode State: 'ALL' | 'TRAIN' | 'BUS'
  const [transportMode, setTransportMode] = useState<'ALL' | 'TRAIN' | 'BUS'>('ALL');

  // Search Form State: Skąd, Dokąd, Kiedy, O której godzinie
  const [originStation, setOriginStation] = useState<string>('Warszawa Centralna');
  const [destinationStation, setDestinationStation] = useState<string>('Kraków Główny');
  const [departureDate, setDepartureDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [departureTime, setDepartureTime] = useState<string>('09:30');
  const [isSeniorDiscount, setIsSeniorDiscount] = useState<boolean>(true);
  const [isDirectOnly, setIsDirectOnly] = useState<boolean>(false);
  const [activeQuickTab, setActiveQuickTab] = useState<'search' | 'corridors'>('search');

  // Selection for detailed leg inspection
  const [selectedConnectionId, setSelectedConnectionId] = useState<string>('transit-1');
  const [selectedLegIndex, setSelectedLegIndex] = useState<number>(0);
  const [expandedDetails, setExpandedDetails] = useState<boolean>(true);

  // Modals
  const [showTicketingGuideModal, setShowTicketingGuideModal] = useState<boolean>(false);
  const [showSeniorAssistanceModal, setShowSeniorAssistanceModal] = useState<boolean>(false);

  // Helper to add minutes to time string (HH:MM)
  const addMinutes = (timeStr: string, mins: number): string => {
    const [hStr, mStr] = (timeStr || '09:00').split(':');
    let h = parseInt(hStr, 10) || 0;
    let m = parseInt(mStr, 10) || 0;
    let total = h * 60 + m + mins;
    total = ((total % 1440) + 1440) % 1440;
    const newH = Math.floor(total / 60);
    const newM = total % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  };

  // Helper to format duration in Polish / English
  const formatDuration = (totalMins: number) => {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (h === 0) return `${m} min`;
    return m > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${h}h 00m`;
  };

  // Set default stations when country tab changes
  const handleCountryTabChange = (country: EuropeanCountryCode | 'CROSS_BORDER') => {
    setActiveCountryTab(country);
    if (country === 'CROSS_BORDER') {
      setOriginStation(transportMode === 'BUS' ? 'Rotterdam Conradstraat Busstation' : 'Rotterdam Centraal');
      setDestinationStation(transportMode === 'BUS' ? 'Warszawa Zachodnia Dworzec Autobusowy' : 'Warszawa Centralna');
    } else if (country === 'PL') {
      setOriginStation(transportMode === 'BUS' ? 'Warszawa Zachodnia Dworzec Autobusowy (PKS)' : 'Warszawa Centralna');
      setDestinationStation(transportMode === 'BUS' ? 'Kraków MDA Dworzec Autobusowy' : 'Kraków Główny');
    } else if (country === 'NL') {
      setOriginStation(transportMode === 'BUS' ? 'Amsterdam Sloterdijk Bus Terminal' : 'Amsterdam Centraal');
      setDestinationStation(transportMode === 'BUS' ? 'Rotterdam Centraal Conradstraat' : 'Rotterdam Centraal');
    } else if (country === 'DE') {
      setOriginStation(transportMode === 'BUS' ? 'Berlin ZOB (Zentraler Omnibusbahnhof)' : 'Berlin Hauptbahnhof');
      setDestinationStation(transportMode === 'BUS' ? 'München ZOB Hackerbrücke' : 'München Hauptbahnhof');
    } else if (country === 'BE') {
      setOriginStation(transportMode === 'BUS' ? 'Bruxelles-Nord Busstation' : 'Bruxelles-Midi (Zuid)');
      setDestinationStation(transportMode === 'BUS' ? 'Brugge Station Busstation' : 'Brugge Station');
    } else if (country === 'FR') {
      setOriginStation(transportMode === 'BUS' ? 'Paris Bercy Seine Gare Routière' : 'Paris Gare de Lyon');
      setDestinationStation(transportMode === 'BUS' ? 'Lyon Perrache Gare Routière' : 'Lyon Part-Dieu');
    }
  };

  // Swap origin and destination
  const handleSwapStations = () => {
    const temp = originStation;
    setOriginStation(destinationStation);
    setDestinationStation(temp);
  };

  // Quick preset time helpers
  const setTimeToNow = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    setDepartureTime(`${h}:${m}`);
  };

  const bumpTimeHours = (hours: number) => {
    setDepartureTime(prev => addMinutes(prev, hours * 60));
  };

  // DYNAMIC MULTI-MODAL TRANSIT TIMETABLE ENGINE (TRAIN & BUS)
  // Calculates realistic train and bus schedules based on origin, destination, departure time, and chosen transport mode
  const generatedTrainConnections = useMemo(() => {
    const effectiveCountry = activeCountryTab === 'CROSS_BORDER' ? 'INTERNATIONAL' : activeCountryTab;
    const from = originStation.trim() || (transportMode === 'BUS' ? 'Dworzec Autobusowy' : 'Dworzec Główny');
    const to = destinationStation.trim() || (transportMode === 'BUS' ? 'Dworzec Autobusowy Docelowy' : 'Stacja Docelowa');

    // Base duration estimate based on route character
    let baseDurationMins = 135; // default ~2h 15m
    let distanceKm = 295;
    let basePricePln = 105;
    let basePriceEur = 25;

    // Smart duration tuning based on typical pairs
    const lowerFrom = from.toLowerCase();
    const lowerTo = to.toLowerCase();
    const isWawKrk = (lowerFrom.includes('warszaw') && lowerTo.includes('kraków')) || (lowerFrom.includes('kraków') && lowerTo.includes('warszaw'));
    const isWawGda = (lowerFrom.includes('warszaw') && lowerTo.includes('gdańsk')) || (lowerFrom.includes('gdańsk') && lowerTo.includes('warszaw'));
    const isWawWro = (lowerFrom.includes('warszaw') && lowerTo.includes('wroc')) || (lowerFrom.includes('wroc') && lowerTo.includes('warszaw'));
    const isKrkZak = (lowerFrom.includes('kraków') && lowerTo.includes('zakop')) || (lowerFrom.includes('zakop') && lowerTo.includes('kraków'));
    const isAmsRtd = (lowerFrom.includes('amsterdam') && lowerTo.includes('rotterdam')) || (lowerFrom.includes('rotterdam') && lowerTo.includes('amsterdam'));
    const isBerMun = (lowerFrom.includes('berlin') && lowerTo.includes('münchen')) || (lowerFrom.includes('münchen') && lowerTo.includes('berlin'));
    const isBruBru = (lowerFrom.includes('bru') && lowerTo.includes('brug')) || (lowerFrom.includes('brug') && lowerTo.includes('bru'));
    const isParLyo = (lowerFrom.includes('paris') && lowerTo.includes('lyon')) || (lowerFrom.includes('lyon') && lowerTo.includes('paris'));
    const isRtdWaw = (lowerFrom.includes('rotterdam') && lowerTo.includes('warszaw')) || (lowerFrom.includes('warszaw') && lowerTo.includes('rotterdam'));

    if (isWawKrk) {
      baseDurationMins = 138; // 2h 18m
      distanceKm = 293;
      basePricePln = 149;
      basePriceEur = 35;
    } else if (isWawGda) {
      baseDurationMins = 155; // 2h 35m
      distanceKm = 330;
      basePricePln = 149;
      basePriceEur = 35;
    } else if (isWawWro) {
      baseDurationMins = 210; // 3h 30m
      distanceKm = 390;
      basePricePln = 135;
      basePriceEur = 32;
    } else if (isKrkZak) {
      baseDurationMins = 120; // 2h 00m
      distanceKm = 110;
      basePricePln = 45;
      basePriceEur = 10.50;
    } else if (isAmsRtd) {
      baseDurationMins = 39; // 39 min
      distanceKm = 78;
      basePricePln = 75;
      basePriceEur = 17.50;
    } else if (isBerMun) {
      baseDurationMins = 235; // 3h 55m ICE Sprinter
      distanceKm = 620;
      basePricePln = 380;
      basePriceEur = 89;
    } else if (isBruBru) {
      baseDurationMins = 58; // 58 min
      distanceKm = 95;
      basePricePln = 62;
      basePriceEur = 14.50;
    } else if (isParLyo) {
      baseDurationMins = 116; // 1h 56m TGV
      distanceKm = 460;
      basePricePln = 320;
      basePriceEur = 75;
    } else if (isRtdWaw) {
      baseDurationMins = 675; // 11h 15m
      distanceKm = 1195;
      basePricePln = 380;
      basePriceEur = 89;
    }

    // Dynamic Templates: Trains and Buses
    const transitTemplates = [
      // 1. FAST TRAIN EXPRESS
      {
        idOffset: 1,
        mode: 'TRAIN' as const,
        minuteOffset: 12,
        durationMins: baseDurationMins,
        type: 'FAST_EXPRESS',
        name: activeCountryTab === 'PL' ? 'EIP 3504 Pendolino' :
              activeCountryTab === 'NL' ? 'NS Intercity Direct 9245 (HSL-Zuid)' :
              activeCountryTab === 'DE' ? 'ICE 723 Sprinter' :
              activeCountryTab === 'BE' ? 'IC 1832 (M7 Next-Gen)' :
              activeCountryTab === 'FR' ? 'TGV InOui 6612 Duplex' : 'Eurostar / BWE Express',
        subtext: activeCountryTab === 'PL' ? 'Express InterCity Premium (200 km/h) • Strefa Ciszy • WARS' :
                 activeCountryTab === 'NL' ? 'Direct 200 km/h HSL via Schiphol • OVpay Contactless' :
                 activeCountryTab === 'DE' ? 'Hochgeschwindigkeitszug 300 km/h • Bordrestaurant' :
                 activeCountryTab === 'BE' ? 'Direct Intercity • Seniorenticket €8.30 po 9:00' :
                 activeCountryTab === 'FR' ? 'Grande Vitesse 320 km/h • Carte Senior -30%' : 'Direct High-Speed Corridor',
        platformDep: 'Peron 3, Tor 2',
        platformArr: 'Peron 1, Tor 4',
        transfers: 0,
        priceMultiplier: 1.0,
        comfort: '★★★★★ 4.9/5 (Klasa Premium Kolej)',
        amenities: ['🍽️ Wagon WARS / Bistro', '📶 Darmowe WiFi 5G', '⚡ Gniazdka 230V + USB-C', '🤫 Strefa Ciszy', '❄️ Klimatyzacja', '♿ Winda & Asysta']
      },
      // 2. FLIXBUS DIRECT EXPRESS (BUS)
      {
        idOffset: 2,
        mode: 'BUS' as const,
        minuteOffset: 25,
        durationMins: Math.round(baseDurationMins * 1.32),
        type: 'BUS_EXPRESS',
        name: activeCountryTab === 'PL' ? 'FlixBus N1340 Express' :
              activeCountryTab === 'NL' ? 'FlixBus Line 802 Direct' :
              activeCountryTab === 'DE' ? 'FlixBus 045 Sprinter' :
              activeCountryTab === 'BE' ? 'FlixBus 110 Express' :
              activeCountryTab === 'FR' ? 'FlixBus 724 Direct' : 'FlixBus Euro-Express 920',
        subtext: pl ? 'Autokar dalekobieżny z gwarancją miejsca • Duży bagaż w luku (20kg) w cenie • Toaleta na pokładzie' : 'Direct long-distance coach • 20kg hold luggage included • Free WiFi & Power outlets',
        platformDep: activeCountryTab === 'PL' ? 'Stanowisko 4 (Dworzec Autobusowy Zachodni)' :
                     activeCountryTab === 'NL' ? 'Platform B (Bus Station)' :
                     activeCountryTab === 'DE' ? 'Bussteig 3 (ZOB)' :
                     activeCountryTab === 'BE' ? 'Quai 2 (Bus Terminal)' :
                     activeCountryTab === 'FR' ? 'Quai 12 (Gare Routière)' : 'Bus Bay 3 (Central Bus Hub)',
        platformArr: activeCountryTab === 'PL' ? 'Stanowisko 2 (Dworzec Autobusowy)' :
                     activeCountryTab === 'NL' ? 'Platform C (Bus Station)' :
                     activeCountryTab === 'DE' ? 'Bussteig 5 (ZOB)' :
                     activeCountryTab === 'BE' ? 'Quai 4 (Busstation)' :
                     activeCountryTab === 'FR' ? 'Quai 6 (Gare Routière)' : 'Bus Bay 1',
        transfers: 0,
        priceMultiplier: 0.44, // Economical bus pricing
        comfort: '★★★★☆ 4.8/5 (Ekspres Autobusowy)',
        amenities: ['📶 Darmowe WiFi pokładowe', '🔌 Gniazdka 230V + USB', '🧳 Bagaż w luku 20kg w cenie', '🚻 Toaleta na pokładzie', '❄️ Klimatyzacja', '📱 Śledzenie GPS na żywo']
      },
      // 3. REGULAR TRAIN INTERCITY
      {
        idOffset: 3,
        mode: 'TRAIN' as const,
        minuteOffset: 48,
        durationMins: Math.round(baseDurationMins * 1.15),
        type: 'REGULAR_IC',
        name: activeCountryTab === 'PL' ? 'IC 13102 Jagiełło' :
              activeCountryTab === 'NL' ? 'NS Intercity 3148 (Dubbeldekker)' :
              activeCountryTab === 'DE' ? 'DB IC 2154' :
              activeCountryTab === 'BE' ? 'SNCB IC 512' :
              activeCountryTab === 'FR' ? 'TER 88125 Nomad' : 'EC 45 Berlin-Warszawa-Express',
        subtext: activeCountryTab === 'PL' ? 'Komfortowy pociąg Intercity • Wagon barowy • Miejsca z dużym miejscem na nogi' :
                 activeCountryTab === 'NL' ? 'Klimatyzowany piętrowy skład NS • Cicha strefa pracy' :
                 activeCountryTab === 'DE' ? 'Intercity z wagonem rowerowym i strefą rodzinną' :
                 activeCountryTab === 'BE' ? 'Pociąg dalekobieżny z niskopodłogowym wejściem' :
                 activeCountryTab === 'FR' ? 'Nowoczesny skład regionalny Express' : 'EuroCity z wagonem restauracyjnym WARS',
        platformDep: 'Peron 2, Tor 1',
        platformArr: 'Peron 4, Tor 2',
        transfers: 0,
        priceMultiplier: 0.68,
        comfort: '★★★★☆ 4.7/5 (Standard Wysoki)',
        amenities: ['☕ Kącik kawowy / Bar', '📶 Darmowe WiFi', '⚡ Gniazdka 230V', '❄️ Klimatyzacja', '🧳 Duże półki na walizki']
      },
      // 4. REGIONAL CARRIER / SINDBAD / BLABLACAR BUS (BUS)
      {
        idOffset: 4,
        mode: 'BUS' as const,
        minuteOffset: 65,
        durationMins: Math.round(baseDurationMins * 1.40),
        type: 'BUS_CARRIER',
        name: activeCountryTab === 'PL' ? 'Sindbad Eurobus 01' :
              activeCountryTab === 'NL' ? 'De Lijn / Qbuzz Snelbus' :
              activeCountryTab === 'DE' ? 'DB IC Bus 430' :
              activeCountryTab === 'BE' ? 'De Lijn Express 410' :
              activeCountryTab === 'FR' ? 'BlaBlaCar Bus FR-512' : 'Sindbad International 112',
        subtext: pl ? 'Sprawdzony przewoźnik autokarowy • Dedykowane stanowiska odjazdowe • Pomoc kierowcy przy załadunku walizek' : 'Reliable intercity coach • Generous luggage policy • Air-conditioned cabin',
        platformDep: 'Stanowisko 7 (Terminal Autobusowy)',
        platformArr: 'Stanowisko 3 (Dworzec Autobusowy)',
        transfers: 0,
        priceMultiplier: 0.38,
        comfort: '★★★★☆ 4.6/5 (Komfort & Oszczędność)',
        amenities: ['📶 WiFi pokładowe', '⚡ Porty USB przy fotelach', '🧳 2x Bagaż w cenie', '🚻 Toaleta', '❄️ Klimatyzacja']
      },
      // 5. HIGH-SPEED EXPRESS TRAIN
      {
        idOffset: 5,
        mode: 'TRAIN' as const,
        minuteOffset: 85,
        durationMins: baseDurationMins,
        type: 'FAST_EXPRESS',
        name: activeCountryTab === 'PL' ? 'EIP 5302 Pendolino' :
              activeCountryTab === 'NL' ? 'NS Intercity Direct 9255' :
              activeCountryTab === 'DE' ? 'ICE 801 Sprinter' :
              activeCountryTab === 'BE' ? 'IC 1836' :
              activeCountryTab === 'FR' ? 'TGV InOui 6620' : 'Eurostar 9432',
        subtext: activeCountryTab === 'PL' ? 'Szybkie połączenie ekspresowe • Darmowy poczęstunek w cenie biletu' :
                 activeCountryTab === 'NL' ? 'Płynna jazda magistralą HSL-Zuid z widokiem na poldery' :
                 activeCountryTab === 'DE' ? 'Flagowy skład DB z obsługą kelnerską na miejscach 1. i 2. klasy' :
                 activeCountryTab === 'BE' ? 'Ekspresowe połączenie przez Flandrię' :
                 activeCountryTab === 'FR' ? 'Bezpośredni przelot TGV z prędkością 320 km/h' : 'Ekspres międzynarodowy',
        platformDep: 'Peron 4, Tor 3',
        platformArr: 'Peron 2, Tor 1',
        transfers: 0,
        priceMultiplier: 1.0,
        comfort: '★★★★★ 4.9/5 (Klasa Premium)',
        amenities: ['🍽️ Pełne menu WARS / Bistro', '📶 Stabilne WiFi', '⚡ Gniazdka przy każdym fotelu', '🤫 Strefa Ciszy', '☕ Darmowa woda/kawa']
      },
      // 6. FLIXBUS PANORAMA / NIGHT COACH (BUS)
      {
        idOffset: 6,
        mode: 'BUS' as const,
        minuteOffset: 105,
        durationMins: Math.round(baseDurationMins * 1.35),
        type: 'BUS_EXPRESS',
        name: activeCountryTab === 'PL' ? 'PKS Polonus Express' :
              activeCountryTab === 'NL' ? 'FlixBus Panorama Line N814' :
              activeCountryTab === 'DE' ? 'FlixBus N12 Nachtbus' :
              activeCountryTab === 'BE' ? 'BlaBlaCar Bus 512' :
              activeCountryTab === 'FR' ? 'BlaBlaCar Bus FR-701' : 'FlixBus N1390 Cross-Border',
        subtext: pl ? 'Autokar z dodatkową przestrzenią na nogi (Extra Legroom) • Odjazd z głównego węzła autobusowego' : 'Comfortable coach with extra legroom and panoramic windows',
        platformDep: 'Stanowisko 1 (Dworzec Autobusowy)',
        platformArr: 'Stanowisko 4 (Dworzec Autobusowy)',
        transfers: 0,
        priceMultiplier: 0.45,
        comfort: '★★★★☆ 4.7/5 (Extra Miejsce na nogi)',
        amenities: ['📶 Szybkie WiFi', '🔌 Gniazdka 230V', '💺 Dodatkowa przestrzeń na nogi', '🚻 Toaleta', '❄️ Klimatyzacja']
      },
      // 7. TRAIN WITH 1 TRANSFER
      {
        idOffset: 7,
        mode: 'TRAIN' as const,
        minuteOffset: 125,
        durationMins: Math.round(baseDurationMins * 1.22),
        type: 'TRANSIT_1_CHANGE',
        name: activeCountryTab === 'PL' ? 'IC 53106 + Regio (1 przesiadka)' :
              activeCountryTab === 'NL' ? 'NS Intercity + Sprinter (1 przesiadka Utrecht)' :
              activeCountryTab === 'DE' ? 'ICE 518 + RE 9 (1 przesiadka)' :
              activeCountryTab === 'BE' ? 'IC 1520 + S-Train (1 przesiadka)' :
              activeCountryTab === 'FR' ? 'TGV + TER (1 przesiadka)' : 'NightJet / EuroCity',
        subtext: pl ? 'Połączenie kolejowe z 1 wygodną przesiadką (gwarantowany 20-minutowy bufor i ten sam peron)' : '1 easy train transfer with guaranteed buffer',
        platformDep: 'Peron 1, Tor 2',
        platformArr: 'Peron 3, Tor 1',
        transfers: 1,
        priceMultiplier: 0.55,
        comfort: '★★★★☆ 4.5/5 (Kolej Ekonomiczna & Elastyczna)',
        amenities: ['📶 WiFi', '⚡ Gniazdka', '❄️ Klimatyzacja', '♿ Niska podłoga']
      },
      // 8. BUS WITH 1 TRANSFER / REGIONAL CONNECTOR
      {
        idOffset: 8,
        mode: 'BUS' as const,
        minuteOffset: 145,
        durationMins: Math.round(baseDurationMins * 1.50),
        type: 'TRANSIT_1_CHANGE',
        name: activeCountryTab === 'PL' ? 'PKS + FlixBus Express (1 przesiadka węzłowa)' :
              activeCountryTab === 'NL' ? 'Qbuzz + FlixBus (1 przesiadka)' :
              activeCountryTab === 'DE' ? 'DB Bus + FlixBus (1 przesiadka)' :
              activeCountryTab === 'BE' ? 'TEC + FlixBus (1 przesiadka)' :
              activeCountryTab === 'FR' ? 'Transdev + BlaBlaCar Bus' : 'FlixBus Inter-Connecting Bus',
        subtext: pl ? 'Połączenie autobusowe z przesiadką na głównym dworcu przesiadkowym • 25 min czasu na przesiadkę' : 'Bus route with 1 hub connection and safe transfer window',
        platformDep: 'Stanowisko 9 (Dworzec Autobusowy)',
        platformArr: 'Stanowisko 1 (Dworzec Autobusowy)',
        transfers: 1,
        priceMultiplier: 0.32,
        comfort: '★★★★☆ 4.4/5 (Super Oszczędność)',
        amenities: ['📶 WiFi', '🧳 2x Bagaż w cenie', '🚻 Toaleta', '❄️ Nawiew indywidualny']
      }
    ];

    return transitTemplates
      .filter(t => {
        if (transportMode === 'TRAIN' && t.mode !== 'TRAIN') return false;
        if (transportMode === 'BUS' && t.mode !== 'BUS') return false;
        if (isDirectOnly && t.transfers > 0) return false;
        return true;
      })
      .map(t => {
        const depTime = addMinutes(departureTime, t.minuteOffset);
        const arrTime = addMinutes(depTime, t.durationMins);
        
        let pricePln = Math.round(basePricePln * t.priceMultiplier);
        let priceEur = Number((basePriceEur * t.priceMultiplier).toFixed(2));

        // Senior discount calculations
        if (isSeniorDiscount) {
          if (activeCountryTab === 'PL') {
            pricePln = Math.round(pricePln * 0.70); // 30% zniżki na Bilet dla Seniora 60+
            priceEur = Number((priceEur * 0.70).toFixed(2));
          } else if (activeCountryTab === 'BE') {
            priceEur = t.mode === 'TRAIN' ? 8.30 : Number((priceEur * 0.75).toFixed(2)); // SNCB Seniorenticket stała kwota 8.30 EUR dla pociągu
            pricePln = Math.round(priceEur * 4.30);
          } else if (activeCountryTab === 'FR') {
            priceEur = Number((priceEur * 0.70).toFixed(2)); // Carte Avantage Senior 30%
            pricePln = Math.round(priceEur * 4.30);
          } else if (activeCountryTab === 'DE') {
            priceEur = Number((priceEur * 0.75).toFixed(2)); // BahnCard Senior ~25%
            pricePln = Math.round(priceEur * 4.30);
          } else {
            priceEur = Number((priceEur * 0.75).toFixed(2));
            pricePln = Math.round(priceEur * 4.30);
          }
        }

        return {
          id: `transit-${t.idOffset}`,
          mode: t.mode,
          trainName: t.name,
          trainSubtext: t.subtext,
          depStation: from,
          depTime: depTime,
          depPlatform: t.platformDep,
          arrStation: to,
          arrTime: arrTime,
          arrPlatform: t.platformArr,
          durationFormatted: formatDuration(t.durationMins),
          durationMins: t.durationMins,
          distanceKm: distanceKm,
          transfers: t.transfers,
          pricePln: pricePln,
          priceEur: priceEur,
          comfort: t.comfort,
          amenities: t.amenities,
          status: 'PUNCTUAL', // on-time status
          isFastest: t.idOffset === 1,
          isCheapest: t.idOffset === 4 || t.idOffset === 8
        };
      });
  }, [originStation, destinationStation, departureTime, activeCountryTab, isSeniorDiscount, isDirectOnly, transportMode, pl]);

  // Selected active train connection object
  const activeTrainConnection = generatedTrainConnections.find(c => c.id === selectedConnectionId) || generatedTrainConnections[0];

  // Country pill options
  const countryTabs: { code: EuropeanCountryCode | 'CROSS_BORDER'; label: string; flag: string; operator: string }[] = [
    { code: 'PL', label: pl ? 'Polska' : 'Poland', flag: '🇵🇱', operator: 'PKP Intercity / FlixBus' },
    { code: 'NL', label: pl ? 'Holandia' : 'Netherlands', flag: '🇳🇱', operator: 'NS Intercity / OVpay' },
    { code: 'DE', label: pl ? 'Niemcy' : 'Germany', flag: '🇩🇪', operator: 'DB ICE / FlixBus' },
    { code: 'BE', label: pl ? 'Belgia' : 'Belgium', flag: '🇧🇪', operator: 'SNCB / De Lijn' },
    { code: 'FR', label: pl ? 'Francja' : 'France', flag: '🇫🇷', operator: 'SNCF TGV / BlaBlaBus' },
    { code: 'CROSS_BORDER', label: pl ? 'Międzynarodowe' : 'Cross-Border', flag: '🇪🇺', operator: 'Eurostar / FlixBus Euro' }
  ];

  // Popular station list for quick pills based on selected country and transport mode
  const currentPopularStations = useMemo(() => {
    if (transportMode === 'BUS') {
      if (activeCountryTab === 'CROSS_BORDER') {
        return [
          { city: 'Rotterdam', station: 'Rotterdam Conradstraat Bus Terminal' },
          { city: 'Warszawa', station: 'Warszawa Dworzec Autobusowy Zachodni (PKS)' },
          { city: 'Berlin', station: 'Berlin ZOB (Zentraler Omnibusbahnhof)' },
          { city: 'Bruksela', station: 'Bruxelles-Nord Busstation' },
          { city: 'Paryż', station: 'Paris Bercy Seine Gare Routière' },
          { city: 'Kraków', station: 'Kraków MDA Dworzec Autobusowy' },
          { city: 'Amsterdam', station: 'Amsterdam Sloterdijk Bus Station' }
        ];
      }
      return POPULAR_BUS_STATIONS_BY_COUNTRY[activeCountryTab] || POPULAR_BUS_STATIONS_BY_COUNTRY.PL;
    }

    if (activeCountryTab === 'CROSS_BORDER') {
      return [
        { city: 'Rotterdam', station: 'Rotterdam Centraal' },
        { city: 'Warszawa', station: 'Warszawa Centralna' },
        { city: 'Berlin', station: 'Berlin Hauptbahnhof' },
        { city: 'Bruksela', station: 'Bruxelles-Midi (Zuid)' },
        { city: 'Paryż', station: 'Paris Gare du Nord' },
        { city: 'Kraków', station: 'Kraków Główny' },
        { city: 'Amsterdam', station: 'Amsterdam Centraal' }
      ];
    }
    return POPULAR_STATIONS_BY_COUNTRY[activeCountryTab] || POPULAR_STATIONS_BY_COUNTRY.PL;
  }, [activeCountryTab, transportMode]);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-2xl space-y-0" id="train-search-coordinator">
      
      {/* 1. TOP TRANSIT COMMAND HEADER */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-7 md:p-8 border-b-2 border-amber-400/40 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-10 text-9xl opacity-5 pointer-events-none select-none font-mono">🚆</div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          
          {/* Status Line: Live Network Status */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 tracking-wider">
                <Train className="w-3.5 h-3.5" />
                <span>{pl ? 'WYSZUKIWARKA POCIĄGÓW I AUTOBUSÓW' : 'EUROPEAN RAILWAY & COACH SEARCH'}</span>
              </span>

              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{pl ? 'Rozkład Jazdy na Żywo 2026' : 'Live Timetables Active'}</span>
              </span>
            </div>

            {/* Quick Modals: Ticketing & Senior Assistance */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTicketingGuideModal(true)}
                className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-1.5 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>{pl ? 'Jak kupić bilet?' : 'Ticketing Info'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSeniorAssistanceModal(true)}
                className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 text-xs font-bold px-3.5 py-1.5 rounded-xl border border-indigo-700/60 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Accessibility className="w-3.5 h-3.5 text-emerald-400" />
                <span>{pl ? 'Ulgi i Asysta 60+ ♿' : 'Senior Perks 60+'}</span>
              </button>
            </div>
          </div>

          {/* Main Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>{pl ? 'Wyszukaj Pociąg lub Autobus w Polsce i Europie 🚄🚌' : 'Search Trains & Coaches in Europe 🚄🚌'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-4xl leading-relaxed mt-1">
              {pl 
                ? 'Wpisz stację odjazdu, stację docelową oraz godzinę, a inteligentny koordynator wyliczy rozkład pociągów (PKP, Pendolino, ICE, TGV) oraz autobusów (FlixBus, Sindbad), perony/stanowiska, zniżki senioralne (30% taniej) oraz bezpośrednią trasę GPS!'
                : 'Select your origin, destination station, transport mode (Train or Bus), and departure time for coordinated timetables, platforms/bays, and live tracking.'}
            </p>
          </div>

          {/* Country Tabs Selector: High-Contrast Big Buttons */}
          <div className="pt-2">
            <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block mb-1.5">
              {pl ? 'WYBIERZ PAŃSTWO / ZASIĘG PODRÓŻY:' : 'SELECT COUNTRY / TRAVEL SCOPE:'}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {countryTabs.map(tab => {
                const isActive = activeCountryTab === tab.code;
                return (
                  <button
                    key={tab.code}
                    type="button"
                    onClick={() => handleCountryTabChange(tab.code)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-sm ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-lg scale-102 ring-2 ring-amber-300'
                        : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{tab.flag}</span>
                      {isActive && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="text-xs font-black block">{tab.label}</span>
                      <span className={`text-[10px] font-medium block truncate ${isActive ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                        {tab.operator.split('/')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* 2. INTERACTIVE HIGH-CONTRAST TRANSIT SEARCH PANEL (Skąd ➔ Dokąd, Kiedy, O której godzinie) */}
      <div className="bg-slate-50 p-4 sm:p-6 md:p-7 border-b-2 border-slate-200 space-y-5">
        
        {/* Search Engine Main Form Card */}
        <div className="bg-gradient-to-b from-white to-slate-50/80 rounded-3xl border-2 border-indigo-200/90 shadow-xl p-5 sm:p-7 space-y-5 relative overflow-hidden">
          
          {/* Subtle Top Glowing Banner Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 via-emerald-500 to-amber-400" />

          {/* Header Row of Search Form with Vibrant Visual Identity and Transport Mode Selector */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md shrink-0 text-white ${
                transportMode === 'BUS' 
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-emerald-200' 
                  : 'bg-gradient-to-br from-indigo-600 to-blue-700 shadow-indigo-200'
              }`}>
                {transportMode === 'BUS' ? <Bus className="w-5 h-5" /> : <Train className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-indigo-700 tracking-wider">
                    {pl ? 'Planer Podróży (Pociąg & Autobus)' : 'Transit Route Planner'}
                  </span>
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <Flame className="w-3 h-3" />
                    <span>Live 2026</span>
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  {pl 
                    ? (activeCountryTab === 'CROSS_BORDER' ? '🌍 Połączenia Międzynarodowe (Kolej & FlixBus)' : `🚆 Transport: ${countryTabs.find(c => c.code === activeCountryTab)?.label || 'Regionalny'}`)
                    : 'Train & Bus Connection Search'}
                </h4>
              </div>
            </div>

            {/* Transport Mode Switcher Tabs + Senior Discount */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
              
              {/* Transport Mode Pill Switcher (Wszystko | Pociąg | Autobus) */}
              <div className="bg-slate-100 p-1 rounded-2xl border-2 border-slate-200 flex items-center gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setTransportMode('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    transportMode === 'ALL'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/70'
                  }`}
                >
                  <span>🚆+🚌</span>
                  <span>{pl ? 'Wszystko' : 'All'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTransportMode('TRAIN');
                    if (originStation.toLowerCase().includes('autobus')) {
                      setOriginStation(activeCountryTab === 'PL' ? 'Warszawa Centralna' : 'Dworzec Główny');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    transportMode === 'TRAIN'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-indigo-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Train className="w-3.5 h-3.5" />
                  <span>{pl ? 'Pociąg' : 'Train'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTransportMode('BUS');
                    if (!originStation.toLowerCase().includes('autobus') && !originStation.toLowerCase().includes('zob')) {
                      setOriginStation(activeCountryTab === 'PL' ? 'Warszawa Zachodnia Dworzec Autobusowy (PKS)' : 'Dworzec Autobusowy');
                      setDestinationStation(activeCountryTab === 'PL' ? 'Kraków MDA Dworzec Autobusowy' : 'Dworzec Autobusowy');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    transportMode === 'BUS'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Bus className="w-3.5 h-3.5" />
                  <span>{pl ? 'Autobus / FlixBus' : 'Bus / Coach'}</span>
                </button>
              </div>

              {/* Senior Discount Badge Toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 px-3.5 py-1.5 rounded-2xl text-xs font-black text-emerald-950 hover:border-emerald-400 hover:shadow-xs transition-all select-none shadow-2xs">
                <input
                  type="checkbox"
                  checked={isSeniorDiscount}
                  onChange={(e) => setIsSeniorDiscount(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <BadgePercent className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{pl ? 'Ulga Seniora 60+ (-30%)' : 'Senior Discount 60+'}</span>
                </span>
              </label>
            </div>
          </div>

          {/* Form Inputs Grid: Skąd (From) ⇄ Dokąd (To) with Distinct High-Contrast Cards */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3.5 items-center">
            
            {/* SKĄD (ORIGIN STATION) - Vibrant Blue Accent */}
            <div className="bg-blue-50/70 hover:bg-blue-50/90 border-2 border-blue-200 focus-within:border-blue-600 focus-within:bg-white rounded-2xl p-3.5 space-y-1.5 transition-all shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-mono shadow-2xs">A</span>
                  <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span>{pl ? (transportMode === 'BUS' ? 'Dworzec Początkowy (Skąd):' : 'Stacja Początkowa (Skąd):') : 'Departure Station / Terminal:'}</span>
                </label>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded-full">
                  {pl ? 'Start trasy' : 'Start'}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={originStation}
                  onChange={(e) => setOriginStation(e.target.value)}
                  placeholder={pl ? (transportMode === 'BUS' ? 'Wpisz dworzec autobusowy (np. Warszawa Zachodnia)...' : 'Wpisz stację odjazdu (np. Warszawa Centralna)...') : 'Type departure station / bus stop...'}
                  className="w-full text-sm font-black py-2.5 pl-3 pr-9 bg-white border border-blue-200 rounded-xl text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-2xs"
                />
                {originStation && (
                  <button
                    type="button"
                    onClick={() => setOriginStation('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* SWAP BUTTON (⇄) - Center Floating Circle */}
            <div className="flex justify-center my-[-4px] md:my-0">
              <button
                type="button"
                onClick={handleSwapStations}
                title={pl ? 'Zamień stację początkową z docelową' : 'Swap Origin & Destination'}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-slate-950 p-3.5 rounded-2xl border-2 border-amber-300 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 group flex items-center justify-center shrink-0"
              >
                <ArrowLeftRight className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300 stroke-[2.5]" />
              </button>
            </div>

            {/* DOKĄD (DESTINATION STATION) - Vibrant Emerald Accent */}
            <div className="bg-emerald-50/70 hover:bg-emerald-50/90 border-2 border-emerald-200 focus-within:border-emerald-600 focus-within:bg-white rounded-2xl p-3.5 space-y-1.5 transition-all shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[10px] font-mono shadow-2xs">B</span>
                  <Milestone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{pl ? (transportMode === 'BUS' ? 'Dworzec Docelowy (Dokąd):' : 'Stacja Docelowa (Dokąd):') : 'Destination Station / Terminal:'}</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  {pl ? 'Cel podróży' : 'Destination'}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={destinationStation}
                  onChange={(e) => setDestinationStation(e.target.value)}
                  placeholder={pl ? (transportMode === 'BUS' ? 'Wpisz dworzec docelowy (np. Kraków MDA)...' : 'Wpisz stację docelową (np. Kraków Główny)...') : 'Type destination station / bus stop...'}
                  className="w-full text-sm font-black py-2.5 pl-3 pr-9 bg-white border border-emerald-200 rounded-xl text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all shadow-2xs"
                />
                {destinationStation && (
                  <button
                    type="button"
                    onClick={() => setDestinationStation('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Form Inputs Row 2: DATA & GODZINA (Kompaktowe, wielobarwne kasetony) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            
            {/* RAMKA: DATA PODRÓŻY - Purple Accent */}
            <div className="bg-purple-50/60 border-2 border-purple-200/90 rounded-2xl p-3 sm:p-3.5 space-y-2 min-w-0 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[11px] sm:text-xs font-black text-purple-950 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-2xs shrink-0">
                    <CalendarDays className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{pl ? 'Data podróży:' : 'Travel Date:'}</span>
                </label>
                <input
                  type="date"
                  value={departureDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="text-xs font-black py-1.5 px-2.5 bg-white border-2 border-purple-300 rounded-xl text-slate-950 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all cursor-pointer shadow-2xs"
                />
              </div>

              {/* Szybkie przyciski dnia */}
              <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-purple-200/70">
                <button
                  type="button"
                  onClick={() => setDepartureDate(new Date().toISOString().split('T')[0])}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-white hover:bg-purple-100 text-purple-950 border border-purple-300 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                >
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span>{pl ? 'Dziś' : 'Today'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tmrw = new Date();
                    tmrw.setDate(tmrw.getDate() + 1);
                    setDepartureDate(tmrw.toISOString().split('T')[0]);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                >
                  <Sunrise className="w-3 h-3 text-orange-500" />
                  <span>{pl ? 'Jutro' : 'Tomorrow'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    const day = d.getDay();
                    const diff = (6 - day + 7) % 7 || 7;
                    d.setDate(d.getDate() + diff);
                    setDepartureDate(d.toISOString().split('T')[0]);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                >
                  <span>🏖️</span>
                  <span>{pl ? 'Weekend' : 'Weekend'}</span>
                </button>
              </div>
            </div>

            {/* RAMKA: GODZINA WYJAZDU - Amber Accent */}
            <div className="bg-amber-50/60 border-2 border-amber-200/90 rounded-2xl p-3 sm:p-3.5 space-y-2 min-w-0 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[11px] sm:text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xs shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{pl ? 'Godzina odjazdu:' : 'Departure Time:'}</span>
                </label>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="text-xs font-mono font-black py-1.5 px-2.5 bg-white border-2 border-amber-300 rounded-xl text-slate-950 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all shadow-2xs"
                />
              </div>

              {/* Szybkie przyciski godziny z kolorami i ikonami */}
              <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-amber-200/70">
                <button
                  type="button"
                  onClick={setTimeToNow}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-slate-950 border border-amber-400 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                >
                  <span>⏱️</span>
                  <span>{pl ? 'Teraz' : 'Now'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => bumpTimeHours(1)}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white hover:bg-amber-100 text-amber-950 border border-amber-200 transition-all cursor-pointer shadow-2xs"
                >
                  +1h
                </button>
                <button
                  type="button"
                  onClick={() => bumpTimeHours(2)}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white hover:bg-amber-100 text-amber-950 border border-amber-200 transition-all cursor-pointer shadow-2xs"
                >
                  +2h
                </button>
                {['08:00', '12:00', '16:00', '19:00'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDepartureTime(t)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer shadow-2xs ${
                      departureTime === t
                        ? 'bg-slate-900 text-white font-black border-slate-900 shadow-xs'
                        : 'bg-white hover:bg-amber-100 text-slate-800 border-amber-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Opcje filtrów i udogodnień */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>
                  {transportMode === 'BUS' 
                    ? (pl ? 'Rozkład autobusów z gwarancją miejsca i bagażem 20kg w cenie' : 'Coach timetables with seat guarantee and luggage')
                    : (pl ? 'Rozkład dopasowany automatycznie do wybranej godziny na żywo' : 'Timetable synchronized with live hour')}
                </span>
              </span>
            </div>

            {/* Direct Trips Only Filter Toggle */}
            <button
              type="button"
              onClick={() => setIsDirectOnly(!isDirectOnly)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border-2 ${
                isDirectOnly
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white border-indigo-700 shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300 shadow-2xs'
              }`}
            >
              {transportMode === 'BUS' ? <Bus className="w-4 h-4" /> : <Train className="w-4 h-4" />}
              <span>{pl ? 'Tylko bezpośrednie połączenia' : 'Direct routes only'}</span>
              {isDirectOnly && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">ON</span>}
            </button>
          </div>

          {/* Quick Popular Stations / Terminals Chips for Selected Country with Colorful Station Badges */}
          <div className="pt-3 border-t border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Route className="w-4 h-4 text-indigo-600" />
                <span>
                  {transportMode === 'BUS' 
                    ? (pl ? 'Popularne Dworce Autobusowe (Kliknij by wstawić jako cel):' : 'Popular Bus Terminals & Hubs:') 
                    : (pl ? 'Popularne Stacje Kolejowe (Kliknij by wstawić jako cel):' : 'Popular Railway Stations:')}
                </span>
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {pl ? 'Szybki wybór' : 'Quick select'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentPopularStations.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (!originStation || originStation === item.station) {
                      setDestinationStation(item.station);
                    } else {
                      setDestinationStation(item.station);
                    }
                  }}
                  className="px-3 py-2 rounded-2xl text-xs font-black bg-white hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-600 hover:text-white text-slate-800 border-2 border-slate-200 hover:border-transparent transition-all cursor-pointer flex items-center gap-2 shadow-2xs hover:shadow-md hover:scale-102 active:scale-95 group"
                >
                  <span className="w-5 h-5 rounded-lg bg-indigo-100 group-hover:bg-white/20 text-indigo-700 group-hover:text-white flex items-center justify-center text-[10px]">
                    {transportMode === 'BUS' ? '🚌' : '🚆'}
                  </span>
                  <span>{item.station}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Search Results / Timetable List Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
          <div className="space-y-0.5">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>{pl ? `Znalezione Połączenia od godziny ${departureTime}:` : `Found Connections from ${departureTime}:`}</span>
              <span className="bg-indigo-600 text-white text-xs px-2.5 py-0.5 rounded-full font-mono">
                {generatedTrainConnections.length} {pl ? 'połączeń' : 'routes'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {pl 
                ? `Trasa: ${originStation} ➔ ${destinationStation} • Data: ${departureDate}` 
                : `Route: ${originStation} ➔ ${destinationStation} • Date: ${departureDate}`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{pl ? 'Wszystkie perony i stanowiska zweryfikowane' : 'Platforms & bays verified'}</span>
          </div>
        </div>

        {/* 3. ELECTRONIC DEPARTURE BOARD: CONNECTION CARDS (TRAIN & BUS) */}
        <div className="space-y-3">
          {generatedTrainConnections.map((conn) => {
            const isSelected = selectedConnectionId === conn.id;
            const isBus = conn.mode === 'BUS';
            return (
              <div
                key={conn.id}
                onClick={() => {
                  setSelectedConnectionId(conn.id);
                  setSelectedLegIndex(0);
                }}
                className={`rounded-3xl border-2 transition-all cursor-pointer overflow-hidden ${
                  isSelected
                    ? isBus
                      ? 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/90 border-emerald-600 shadow-xl ring-2 ring-emerald-200'
                      : 'bg-gradient-to-br from-indigo-50/90 via-white to-emerald-50/90 border-indigo-600 shadow-xl ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Main Card Grid */}
                <div className="p-4 sm:p-5 md:p-6 space-y-4">
                  
                  {/* Top Row: Transit Mode, Operator & Badges */}
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                        isBus 
                          ? 'bg-emerald-700 text-white' 
                          : conn.isFastest 
                            ? 'bg-amber-400 text-slate-950 shadow-xs' 
                            : 'bg-slate-900 text-white'
                      }`}>
                        {isBus ? <Bus className="w-3.5 h-3.5 text-emerald-300" /> : <Train className="w-3.5 h-3.5" />}
                        <span>{conn.trainName}</span>
                      </span>

                      {isBus && (
                        <span className="bg-teal-100 text-teal-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-teal-300 flex items-center gap-1">
                          <span>🚌</span>
                          <span>{pl ? 'Autokar / Autobus' : 'Coach / Bus'}</span>
                        </span>
                      )}

                      {!isBus && (
                        <span className="bg-indigo-100 text-indigo-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-indigo-300 flex items-center gap-1">
                          <span>🚆</span>
                          <span>{pl ? 'Kolej' : 'Train'}</span>
                        </span>
                      )}

                      {conn.isFastest && (
                        <span className="bg-emerald-100 text-emerald-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-300">
                          ⚡ {pl ? 'Najszybsze' : 'Fastest'}
                        </span>
                      )}

                      {conn.isCheapest && (
                        <span className="bg-amber-100 text-amber-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-300">
                          💰 {pl ? 'Najtańsze' : 'Cheapest'}
                        </span>
                      )}

                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{pl ? 'Punktualnie 🟢' : 'On Time 🟢'}</span>
                      </span>
                    </div>

                    {/* Price & Senior Tag */}
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black font-mono text-slate-950">
                        {conn.pricePln} zł <span className="text-xs text-slate-500 font-normal">/ €{conn.priceEur}</span>
                      </div>
                      {isSeniorDiscount && (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          ✓ {pl ? 'Cena z ulgą seniora 60+' : 'Senior 60+ fare'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle Row: Departure ➔ Journey Bar ➔ Arrival */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* DEPARTURE STATION */}
                    <div className="md:col-span-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl font-black font-mono text-slate-950 tracking-tight">
                          {conn.depTime}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          isBus ? 'bg-emerald-100 text-emerald-950' : 'bg-indigo-100 text-indigo-950'
                        }`}>
                          {conn.depPlatform}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900">
                        {conn.depStation}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-bold">
                        📍 {pl ? (isBus ? 'Dworzec / Stanowisko Odjazdu' : 'Stacja Odjazdu') : 'Origin Station'}
                      </p>
                    </div>

                    {/* JOURNEY DURATION & ROUTE LINE */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center space-y-1 py-2 md:py-0">
                      <span className="text-xs font-mono font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        ⏱️ {conn.durationFormatted}
                      </span>

                      <div className="w-full flex items-center gap-1 px-4">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isBus ? 'bg-emerald-600' : 'bg-indigo-600'}`} />
                        <div className="flex-1 h-0.5 bg-slate-300 relative">
                          <div className={`absolute inset-0 rounded-full ${isBus ? 'bg-emerald-600' : 'bg-indigo-600'}`} />
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                      </div>

                      <span className="text-[11px] font-bold text-slate-500">
                        {conn.transfers === 0 
                          ? (pl ? 'Bezpośredni (0 przesiadek)' : 'Direct (0 transfers)')
                          : (pl ? '1 przesiadka (bezpieczny bufor)' : '1 transfer (safe buffer)')}
                      </span>
                    </div>

                    {/* ARRIVAL STATION */}
                    <div className="md:col-span-4 space-y-1 md:text-right">
                      <div className="flex items-center md:justify-end gap-2">
                        <span className="bg-emerald-100 text-emerald-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                          {conn.arrPlatform}
                        </span>
                        <span className="text-2xl sm:text-3xl font-black font-mono text-slate-950 tracking-tight">
                          {conn.arrTime}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900">
                        {conn.arrStation}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-bold">
                        🎯 {pl ? (isBus ? 'Dworzec / Stanowisko Przyjazdu' : 'Stacja Przyjazdu') : 'Destination Station'}
                      </p>
                    </div>

                  </div>

                  {/* Bottom Row: Onboard Amenities & Action Buttons */}
                  <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {conn.amenities.map((am, aIdx) => (
                        <span key={aIdx} className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                          {am}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedConnectionId(conn.id);
                          setExpandedDetails(true);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                          isBus ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>{pl ? 'Szczegóły i Mapa GPS' : 'View Itinerary & Map'}</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 4. ACTIVE SELECTED TRANSIT ITINERARY INSPECTOR & IN-APP GPS NAVIGATION */}
      {activeTrainConnection && expandedDetails && (
        <div className="p-5 sm:p-7 md:p-8 space-y-6 bg-slate-900 text-white">
          
          {/* Inspector Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-1">
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider ${
                activeTrainConnection.mode === 'BUS' ? 'bg-emerald-400 text-slate-950' : 'bg-amber-400 text-slate-950'
              }`}>
                {activeTrainConnection.mode === 'BUS' 
                  ? (pl ? 'WYBRANY AUTOKAR & ROZKŁAD KROK PO KROKU 🚌' : 'SELECTED COACH SCHEDULE 🚌')
                  : (pl ? 'WYBRANY POCIĄG & ROZKŁAD KROK PO KROKU 🚆' : 'SELECTED TRAIN SCHEDULE 🚆')}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{activeTrainConnection.trainName}</span>
                <span className="text-sm font-normal text-slate-400">({activeTrainConnection.depStation} ➔ {activeTrainConnection.arrStation})</span>
              </h3>
              <p className="text-xs text-slate-300">
                {activeTrainConnection.trainSubtext}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black px-3.5 py-1.5 rounded-xl font-mono">
                ⏱️ {activeTrainConnection.durationFormatted} ({activeTrainConnection.distanceKm} km)
              </span>
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl font-mono">
                {activeTrainConnection.pricePln} zł (€{activeTrainConnection.priceEur})
              </span>
            </div>
          </div>

          {/* Visual Step-by-Step Stations & Platforms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Departure Station Inspector Card */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{pl ? (activeTrainConnection.mode === 'BUS' ? 'Odjazd z Dworca / Stanowiska:' : 'Odjazd ze Stacji:') : 'Departure Point:'}</span>
                </span>
                <span className="bg-amber-400 text-slate-950 text-sm font-mono font-black px-3 py-0.5 rounded-md">
                  {activeTrainConnection.depTime}
                </span>
              </div>
              <h4 className="text-lg font-black text-white">
                {activeTrainConnection.depStation}
              </h4>
              <div className="text-xs text-indigo-300 font-bold flex items-center gap-2 bg-slate-900 p-2 rounded-xl">
                <span>📍 {activeTrainConnection.depPlatform}</span>
                <span>•</span>
                <span>♿ {pl ? 'Dostęp bez barier / pomoc asystenta' : 'Step-free access & assistance'}</span>
              </div>
            </div>

            {/* Arrival Station Inspector Card */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{pl ? (activeTrainConnection.mode === 'BUS' ? 'Przyjazd do Dworca / Stanowiska:' : 'Przyjazd do Stacji:') : 'Arrival Point:'}</span>
                </span>
                <span className="bg-emerald-400 text-slate-950 text-sm font-mono font-black px-3 py-0.5 rounded-md">
                  {activeTrainConnection.arrTime}
                </span>
              </div>
              <h4 className="text-lg font-black text-white">
                {activeTrainConnection.arrStation}
              </h4>
              <div className="text-xs text-emerald-300 font-bold flex items-center gap-2 bg-slate-900 p-2 rounded-xl">
                <span>📍 {activeTrainConnection.arrPlatform}</span>
                <span>•</span>
                <span>🚋 {pl ? 'Dojście do komunikacji miejskiej, tramwajów i taksówek' : 'Direct access to local transit'}</span>
              </div>
            </div>

          </div>

          {/* In-App Live GPS Navigation Map for this exact connection */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-400 tracking-wider">
              <Navigation className="w-4 h-4" />
              <span>{pl ? (activeTrainConnection.mode === 'BUS' ? 'Nawigacja na Żywo w Aplikacji (Autobus + Dojście na Stanowisko):' : 'Nawigacja na Żywo w Aplikacji (Pociąg + Dojście na Peron):') : 'In-App Live Navigation:'}</span>
            </div>

            <InAppGoogleMapRoute
              destination={activeTrainConnection.arrStation}
              destinationTitle={activeTrainConnection.arrStation}
              initialStartLocation={activeTrainConnection.depStation}
              initialTravelMode="transit"
              language={language}
              autoStartNav={true}
            />
          </div>

        </div>
      )}

      {/* 5. PRE-CONFIGURED SHOWCASE INTERNATIONAL CORRIDORS (NL ➔ PL ➔ BE ➔ DE ➔ FR) */}
      <div className="bg-slate-100 p-5 sm:p-7 border-t border-slate-300 space-y-4">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="space-y-0.5">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-indigo-600" />
              <span>{pl ? 'Skoordynowane Magistrale Międzynarodowe (Showcase Europejski):' : 'Showcase European Cross-Border Corridors:'}</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              {pl ? 'Gotowe, przetestowane trasy transgraniczne łączące 5 państw ze zsynchronizowanymi przesiadkami i biletami.' : 'Curated multi-country synchronized rail corridors.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALL_INTERNATIONAL_CORRIDORS.slice(0, 6).map((corridor) => (
            <button
              key={corridor.id}
              type="button"
              onClick={() => {
                setOriginStation(`${corridor.fromCountry.city}`);
                setDestinationStation(`${corridor.toCountry.city}`);
                window.scrollTo({ top: document.getElementById('train-search-coordinator')?.offsetTop || 0, behavior: 'smooth' });
              }}
              className="p-4 rounded-2xl border-2 bg-white border-slate-200 hover:border-indigo-600 hover:shadow-md text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 group"
            >
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-base">{corridor.fromCountry.flag} ➔ {corridor.toCountry.flag}</span>
                  <span className="bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded-md font-mono text-xs font-black">
                    ⏱️ {corridor.totalDuration}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {corridor.title}
                </h4>
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-2 text-xs font-bold">
                <span className="text-slate-500">{corridor.transfersCount} {pl ? 'przesiadki' : 'transfers'}</span>
                <span className="font-mono text-slate-950 font-black">
                  {corridor.totalPricePln} zł / €{corridor.totalPriceEur}
                </span>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* 6. TICKETING GUIDE MODAL */}
      <AnimatePresence>
        {showTicketingGuideModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowTicketingGuideModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 text-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="bg-indigo-100 text-indigo-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    {pl ? 'KOMPENDIUM BILETOWE 5 PAŃSTW' : '5-COUNTRY TRANSIT TICKETING GUIDE'}
                  </span>
                  <h3 className="text-2xl font-black text-slate-950">
                    {pl ? 'Jak Płacić i Kasować Bilety w Każdym Kraju? 💳' : 'How to Pay & Validate in Each Country? 💳'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTicketingGuideModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Polska */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-2">
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>🇵🇱 Polska (PKP Intercity, Polregio, Komunikacja Miejska)</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {pl 
                      ? 'W pociągach ekspresowych PKP Intercity (Pendolino, IC) bilet z kodem QR okazuje się w telefonie konduktorowi. Bilet dla Seniora (dla osób 60+) gwarantuje 30% zniżki na wszystkie relacje krajowe.'
                      : 'Advance QR code tickets for PKP rail; senior 60+ discount gives 30% off.'}
                  </p>
                  <p className="text-[11px] font-bold text-amber-800 bg-amber-50 p-2 rounded-lg">
                    🎁 Seniorzy 70+ podróżują w miastach w 100% ZA DARMO! Wystarczy dowód osobisty.
                  </p>
                </div>

                {/* 2. Holandia */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-2">
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>🇳🇱 Holandia (OVpay & NS)</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {pl 
                      ? 'Wszystkie pociągi NS, tramwaje RET/GVB/HTM i autobusy obsługują system OVpay. Wystarczy przyłożyć zbliżeniową kartę płatniczą VISA/Mastercard lub telefon przy bramce dworca (Check-In) oraz koniecznie przy wyjściu (Check-Out).'
                      : 'Tap your contactless bank card at check-in and check-out on all Dutch trains, buses, and trams.'}
                  </p>
                  <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                    ✓ Brak konieczności kupowania biletów papierowych.
                  </p>
                </div>

                {/* 3. Belgia */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-2">
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>🇧🇪 Belgia (SNCB / NMBS & STIB Bruksela)</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {pl 
                      ? 'Koleje belgijskie SNCB oferują bilet "Senior Ticket" dla osób 65+ za stałą, bardzo niską opłatę (8,30 €) w całej Belgii po godzinie 9:00.'
                      : 'SNCB Senior Ticket offers fixed low fare (8.30 €) across Belgium after 9:00 AM.'}
                  </p>
                  <p className="text-[11px] font-bold text-indigo-800 bg-indigo-50 p-2 rounded-lg">
                    ✓ Eurostar łączy Brukselę z Rotterdamem w 1h 10m i Paryżem w 1h 22m.
                  </p>
                </div>

                {/* 4. Niemcy */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-2">
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>🇩🇪 Niemcy (Deutsche Bahn DB & Deutschlandticket)</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {pl 
                      ? 'Dla pociągów ICE/IC zalecamy bilet z gwarantowaną rezerwacją miejsca siedzącego w strefie ciszy (Ruhebereich). Kod QR z aplikacji DB Navigator okazuje się konduktorowi.'
                      : 'Advance DB ICE tickets with guaranteed quiet zone seat reservations via DB Navigator app.'}
                  </p>
                  <p className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg">
                    ✓ Ulgi senioralne DB Senior zniżka na bilety Europa-Spezial.
                  </p>
                </div>

                {/* 5. Francja */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-2 md:col-span-2">
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>🇫🇷 Francja (SNCF TGV & RATP Paryż)</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {pl 
                      ? 'Szybkie pociągi TGV InOui oraz Eurostar wymagają wcześniejszej rezerwacji miejsca. W Paryżu metro RATP korzysta z kart Navigo Easy lub aplikacji w telefonie.'
                      : 'Mandatory seat reservations on TGV & Eurostar; Navigo Easy or smartphone contactless ticketing on Paris RATP metro.'}
                  </p>
                  <p className="text-[11px] font-bold text-indigo-800 bg-indigo-50 p-2 rounded-lg">
                    ✓ Karta Carte Avantage Senior daje gwarantowane 30% zniżki na wszystkie pociągi TGV we Francji.
                  </p>
                </div>

              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowTicketingGuideModal(false)}
                  className="bg-slate-950 hover:bg-slate-800 text-white font-black text-xs px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  {pl ? 'Zamknij Przewodnik' : 'Close Guide'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. SENIOR ACCESSIBILITY & LUGGAGE ASSISTANCE MODAL */}
      <AnimatePresence>
        {showSeniorAssistanceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowSeniorAssistanceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-5 text-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="bg-emerald-100 text-emerald-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    {pl ? 'BEZPIECZEŃSTWO & ASYSTA' : 'ACCESSIBILITY'}
                  </span>
                  <h3 className="text-2xl font-black text-slate-950">
                    {pl ? 'Udogodnienia dla Seniorów i Bagażu ♿' : 'Senior Accessibility & Luggage Assistance ♿'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSeniorAssistanceModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-medium">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h5 className="font-black text-slate-900 text-sm">
                    🛗 1. Gwarancja Wind i Ramp na Wszystkich Dworcach
                  </h5>
                  <p>
                    {pl 
                      ? 'Główne dworce posiadają windy panoramiczne łączące perony z halami głównymi bez konieczności pokonywania schodów z walizką.'
                      : 'Elevators and step-free access verified across all primary hubs.'}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h5 className="font-black text-slate-900 text-sm">
                    🧳 2. Bezpłatna Asysta Dworcowa (Pomoc z Bagażem)
                  </h5>
                  <p>
                    {pl 
                      ? 'W każdym kraju możesz zamówić bezpłatną asystę stacyjną (NS Assistance w Holandii, DB Mobilitätsservice w Niemczech, PKP Asysta w Polsce). Pracownik dworca pomoże wnieść walizkę i odprowadzi na właściwy peron.'
                      : 'Free station assistance for seniors and luggage can be requested in each country.'}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h5 className="font-black text-slate-900 text-sm">
                    ☕ 3. Bezpieczny Czas na Przesiadkę (Bufor Bezpieczeństwa)
                  </h5>
                  <p>
                    {pl 
                      ? 'Wszystkie trasy w naszym koordynatorze zaplanowano z minimum 20-35 minutowym buforem, co pozwala na spokojny spacer, skorzystanie z toalety i zakup ciepłej herbaty bez pośpiechu.'
                      : 'Routes include 20-35 min buffers for relaxed transfers and comfort breaks.'}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSeniorAssistanceModal(false)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  {pl ? 'Rozumiem' : 'Understood'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default InternationalTransitCoordinator;
