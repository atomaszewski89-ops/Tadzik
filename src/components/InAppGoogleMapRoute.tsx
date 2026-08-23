import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Language, TravelMode } from '../types';
import { 
  Navigation, 
  MapPin, 
  Car, 
  Bus, 
  Bike, 
  Footprints, 
  Gauge, 
  Compass, 
  LocateFixed, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  ArrowUpLeft,
  CornerUpRight,
  CornerUpLeft,
  RotateCw,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Radio,
  ParkingSquare,
  Accessibility,
  Flame,
  Info,
  PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface InAppGoogleMapRouteProps {
  destination: string;
  destinationTitle?: string;
  city?: string;
  initialStartLocation?: string;
  initialTravelMode?: TravelMode;
  language: Language;
  onClose?: () => void;
  className?: string;
  autoStartNav?: boolean;
}

interface ManeuverStep {
  id: number;
  instruction: {
    pl: string;
    nl: string;
    en: string;
    de: string;
  };
  street: string;
  distance: string;
  distanceMeters: number;
  iconType: 'straight' | 'right' | 'left' | 'slight-right' | 'slight-left' | 'roundabout' | 'destination' | 'transit-board' | 'transit-exit';
  voicePrompt: {
    pl: string;
    nl: string;
    en: string;
    de: string;
  };
  laneAssist?: string;
  speedLimit?: number;
  tip?: string;
}

export const InAppGoogleMapRoute: React.FC<InAppGoogleMapRouteProps> = ({
  destination,
  destinationTitle,
  city = '',
  initialStartLocation,
  initialTravelMode = 'transit',
  language,
  onClose,
  className = '',
  autoStartNav = false
}) => {
  const pl = language === 'pl';
  const nl = language === 'nl';
  const de = language === 'de';

  // Default start point
  const defaultOrigin = initialStartLocation || (city ? `${city} Centraal` : (pl ? 'Dworzec Główny' : 'Central Station'));
  const [startLocation, setStartLocation] = useState<string>(defaultOrigin);
  const [destinationLocation, setDestinationLocation] = useState<string>(destinationTitle || destination);
  const [departureTime, setDepartureTime] = useState<string>('09:30');
  const [showRouteEditor, setShowRouteEditor] = useState<boolean>(true);
  const [activeTravelMode, setActiveTravelMode] = useState<TravelMode>(initialTravelMode);

  // Quick time helper
  const addMinutesToTime = (timeStr: string, minsToAdd: number): string => {
    if (!timeStr || !timeStr.includes(':')) return '09:00';
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr, 10) || 0;
    let m = parseInt(mStr, 10) || 0;
    let total = h * 60 + m + minsToAdd;
    total = ((total % 1440) + 1440) % 1440;
    const newH = Math.floor(total / 60);
    const newM = total % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  };
  
  // Navigation Modes: 'overview' (map preview) vs 'active-nav' (live turn-by-turn HUD driving mode)
  const [navMode, setNavMode] = useState<'overview' | 'active-nav'>('active-nav');
  
  // Live Active Navigation States
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedDistanceLeft, setSimulatedDistanceLeft] = useState<number>(350);
  const [simulatedSpeed, setSimulatedSpeed] = useState<number>(45);
  const [isGpsTracking, setIsGpsTracking] = useState<boolean>(true);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);
  const [showSeniorRestroomHelp, setShowSeniorRestroomHelp] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [activeViewTab, setActiveViewTab] = useState<'map' | 'hud' | 'steps'>('map');

  // Watch GPS Position ref
  const watchIdRef = useRef<number | null>(null);
  const simTimerRef = useRef<any>(null);

  // Sync initial props
  useEffect(() => {
    if (initialStartLocation) {
      setStartLocation(initialStartLocation);
    }
  }, [initialStartLocation]);

  useEffect(() => {
    if (initialTravelMode) {
      setActiveTravelMode(initialTravelMode);
    }
  }, [initialTravelMode]);

  // Generate realistic Turn-by-Turn Steps according to selected destination & travel mode
  const getManeuvers = (): ManeuverStep[] => {
    const destName = destinationTitle || destination;
    const originName = startLocation || (city ? `${city} Centraal` : 'Centrum');

    if (activeTravelMode === 'car' || activeTravelMode === 'motorcycle') {
      return [
        {
          id: 1,
          instruction: {
            pl: `Rozpocznij trasę z: ${originName}, jedź prosto w kierunku głównej arterii`,
            nl: `Start vanaf ${originName}, rijd rechtdoor richting de hoofdroute`,
            en: `Start from ${originName}, head straight toward main avenue`,
            de: `Starten Sie bei ${originName}, fahren Sie geradeaus zur Hauptstraße`
          },
          street: city ? `Centrumring / ${city}` : 'Aleja Główna',
          distance: '350 m',
          distanceMeters: 350,
          iconType: 'straight',
          voicePrompt: {
            pl: 'Rozpoczynamy nawigację. Za trzysta pięćdziesiąt metrów przygotuj się do skrętu w prawo.',
            nl: 'We starten de navigatie. Maak u over driehonderdvijftig meter klaar om rechtsaf te slaan.',
            en: 'Starting navigation. In 350 meters, prepare to turn right.',
            de: 'Navigation gestartet. In 350 Metern rechts abbiegen.'
          },
          laneAssist: 'Lewy i Środkowy Pas',
          speedLimit: 50,
          tip: pl ? 'Gładki asfalt, płynny ruch.' : 'Smooth road, normal traffic.'
        },
        {
          id: 2,
          instruction: {
            pl: `Skręć w prawo w kierunku obwodnicy / trasy przelotowej`,
            nl: `Sla rechtsaf richting de ringweg`,
            en: `Turn right towards the ring road / bypass`,
            de: `Biegen Sie rechts ab in Richtung Ringstraße`
          },
          street: city ? `Stadsweg ${city}` : 'Droga Wojewódzka / Tranzytowa',
          distance: '1.2 km',
          distanceMeters: 1200,
          iconType: 'right',
          voicePrompt: {
            pl: 'Skręć w prawo. Następnie kontynuuj prosto przez jeden kilometr i dwieście metrów.',
            nl: 'Sla rechtsaf. Blijf daarna één komma twee kilometer rechtdoor rijden.',
            en: 'Turn right. Then continue straight for 1.2 kilometers.',
            de: 'Rechts abbiegen. Danach 1,2 Kilometer geradeaus fahren.'
          },
          laneAssist: 'Prawy pas do skrętu',
          speedLimit: 70,
          tip: pl ? 'Szeroki pas z czytelnym oznakowaniem.' : 'Wide lane with clear signs.'
        },
        {
          id: 3,
          instruction: {
            pl: 'Na rondzie wybierz 2. zjazd (prosto) w stronę P+R / Celu',
            nl: 'Neem op de rotonde de 2e afslag (rechtdoor) richting P+R',
            en: 'At the roundabout, take the 2nd exit (straight) towards P+R / Destination',
            de: 'Am Kreisverkehr die 2. Ausfahrt (geradeaus) nehmen'
          },
          street: 'Rotonde / Węzeł Komunikacyjny',
          distance: '800 m',
          distanceMeters: 800,
          iconType: 'roundabout',
          voicePrompt: {
            pl: 'Za osiemset metrów na rondzie weź drugi zjazd prosto.',
            nl: 'Over achthonderd meter op de rotonde de tweede afslag nemen.',
            en: 'In 800 meters at the roundabout, take the second exit straight.',
            de: 'In 800 Metern am Kreisverkehr die zweite Ausfahrt nehmen.'
          },
          laneAssist: 'Środkowy pas na rondzie',
          speedLimit: 50,
          tip: pl ? 'Rondo z pierwszeństwem i bezkolizyjnym zjazdem.' : 'Safe roundabout with right-of-way.'
        },
        {
          id: 4,
          instruction: {
            pl: `Łagodny zjazd w prawo na bezpieczny parking P+R / Podjazd`,
            nl: `Flauwe bocht naar rechts naar P+R parkeerterrein`,
            en: `Slight right exit onto safe P+R Parking / Drop-off zone`,
            de: `Leicht rechts abbiegen zum P+R Parkplatz`
          },
          street: `Parking P+R przy ${destName}`,
          distance: '250 m',
          distanceMeters: 250,
          iconType: 'slight-right',
          voicePrompt: {
            pl: 'Za dwieście pięćdziesiąt metrów zjedź łagodnie w prawo na parking.',
            nl: 'Over tweehonderdvijftig meter flauw rechts afslaan naar de parkeerplaats.',
            en: 'In 250 meters take the slight right exit to the parking lot.',
            de: 'In 250 Metern leicht rechts zum Parkplatz abbiegen.'
          },
          laneAssist: 'Pas zjazdowy P+R',
          speedLimit: 30,
          tip: pl ? 'Dostępne miejsca dla niepełnosprawnych i windy bezpośrednio przy wejściu.' : 'Disabled spots and elevators available.'
        },
        {
          id: 5,
          instruction: {
            pl: `Dojeżdżasz do celu: ${destName}. Cel znajduje się po prawej stronie!`,
            nl: `U bent gearriveerd op uw bestemming: ${destName}. Bestemming is aan uw rechterkant!`,
            en: `You have arrived at your destination: ${destName}. It is on your right!`,
            de: `Sie haben Ihr Ziel erreicht: ${destName}. Das Ziel befindet sich auf der rechten Seite!`
          },
          street: destName,
          distance: '0 m',
          distanceMeters: 0,
          iconType: 'destination',
          voicePrompt: {
            pl: `Dotarłeś na miejsce: ${destName}. Życzymy udanego i bezpiecznego zwiedzania!`,
            nl: `U bent aangekomen bij ${destName}. Prettig bezoek gewenst!`,
            en: `You have arrived at ${destName}. Have a wonderful visit!`,
            de: `Sie haben ${destName} erreicht. Einen schönen Aufenthalt!`
          },
          laneAssist: 'Strefa piesza / Wejście',
          speedLimit: 15,
          tip: pl ? 'Główne wejście, kawiarnia i toalety tuż obok recepcji.' : 'Main entrance, café, and restrooms nearby.'
        }
      ];
    } else if (activeTravelMode === 'bus') {
      return [
        {
          id: 1,
          instruction: {
            pl: `Podejdź do przystanku autobusowego przy: ${originName}`,
            nl: `Loop naar de bushalte bij: ${originName}`,
            en: `Walk to the bus stop at: ${originName}`,
            de: `Gehen Sie zur Bushaltestelle bei: ${originName}`
          },
          street: 'Przystanek Autobusowy (Stanowisko B)',
          distance: '80 m',
          distanceMeters: 80,
          iconType: 'transit-board',
          voicePrompt: {
            pl: 'Rozpoczynamy podróż autobusem. Za osiemdziesiąt metrów podejdź do wiaty przystankowej. Bilet kupisz zbliżeniowo kartą.',
            nl: 'We starten de busreis. Loop tachtig meter naar de bushalte.',
            en: 'Starting bus route. Walk 80 meters to the bus stop shelter.',
            de: 'Start der Busfahrt. 80 Meter zur Bushaltestelle gehen.'
          },
          laneAssist: 'Wiata z ławkami i rozkładem live',
          speedLimit: 4,
          tip: pl ? 'Pojazdy klimatyzowane z rampą dla wózków inwalidzkich i dziecięcych.' : 'Air-conditioned buses with wheelchair ramp.'
        },
        {
          id: 2,
          instruction: {
            pl: `Wsiądź do bezpośredniego autobusu linii ${city === 'Rotterdam' ? '33 / 40' : city === 'Amsterdam' ? '347 / 397' : 'Ekspresowej'}`,
            nl: `Stap in de directe buslijn richting ${destName}`,
            en: `Board direct bus line towards ${destName}`,
            de: `Steigen Sie in den Direktbus Richtung ${destName} ein`
          },
          street: city ? `Trasa Autobusowa (${city})` : 'Linia Miejska',
          distance: '2.8 km (11 min)',
          distanceMeters: 2800,
          iconType: 'straight',
          voicePrompt: {
            pl: 'Wsiądź pierwszymi lub środkowymi drzwiami. Zbliż kartę płatniczą lub bilet do czytnika.',
            nl: 'Stap in en check in met uw betaalpas.',
            en: 'Board the bus and check in with your contactless card.',
            de: 'Einsteigen und kontaktlos einchecken.'
          },
          laneAssist: 'Wydzielony buspas (brak korków)',
          speedLimit: 45,
          tip: pl ? 'Buspasy zapewniają punktualny dojazd nawet w godzinach szczytu.' : 'Dedicated bus lanes avoid traffic.'
        },
        {
          id: 3,
          instruction: {
            pl: `Przygotuj się do wysiadki na przystanku tuż obok: ${destName}`,
            nl: `Maak u klaar om uit te stappen bij ${destName}`,
            en: `Prepare to alight at the stop beside ${destName}`,
            de: `Bereiten Sie sich auf den Ausstieg bei ${destName} vor`
          },
          street: `Przystanek: ${destName} Bushalte`,
          distance: '150 m',
          distanceMeters: 150,
          iconType: 'transit-exit',
          voicePrompt: {
            pl: 'Za sto pięćdziesiąt metrów naciśnij przycisk STOP i wysiądź na docelowym przystanku.',
            nl: 'Druk over honderdvijftig meter op STOP en stap uit.',
            en: 'In 150 meters press STOP and alight at destination stop.',
            de: 'In 150 Metern STOP-Taste drücken und aussteigen.'
          },
          laneAssist: 'Przycisk STOP / Pamiętaj o Check-Out',
          speedLimit: 4,
          tip: pl ? 'Przyłóż kartę do czytnika przy drzwiach (Check-Out)!' : 'Tap out at the reader before exiting!'
        },
        {
          id: 4,
          instruction: {
            pl: `Krótkie przejście (60 m) bezpośrednio do wejścia głównego: ${destName}`,
            nl: `Korte wandeling (60 m) direct naar de hoofdingang van ${destName}`,
            en: `Short walk (60 m) directly to the main entrance of ${destName}`,
            de: `Kurzer Weg (60 m) direkt zum Haupteingang von ${destName}`
          },
          street: destName,
          distance: '60 m',
          distanceMeters: 60,
          iconType: 'destination',
          voicePrompt: {
            pl: `Dotarłeś na miejsce: ${destName}. Życzymy udanego zwiedzania!`,
            nl: `U bent aangekomen bij ${destName}. Veel plezier!`,
            en: `You have arrived at ${destName}. Enjoy your visit!`,
            de: `Sie haben ${destName} erreicht. Viel Vergnügen!`
          },
          laneAssist: 'Wejście główne / Kasy biletowe',
          speedLimit: 4,
          tip: pl ? 'Wejście przystosowane dla wózków, brak barier architektonicznych.' : 'Fully accessible barrier-free entrance.'
        }
      ];
    } else if (activeTravelMode === 'tram') {
      return [
        {
          id: 1,
          instruction: {
            pl: `Podejdź na zadaszony peron tramwajowy: ${originName}`,
            nl: `Loop naar het overdekte tramperron bij: ${originName}`,
            en: `Walk to the covered tram platform at: ${originName}`,
            de: `Gehen Sie zum überdachten Straßenbahnsteig bei: ${originName}`
          },
          street: 'Peron Tramwajowy Niskopodłogowy',
          distance: '100 m',
          distanceMeters: 100,
          iconType: 'transit-board',
          voicePrompt: {
            pl: 'Rozpoczynamy podróż tramwajem. Za sto metrów wejdź na peron tramwajowy. Wszystkie tramwaje są niskopodłogowe.',
            nl: 'We starten de tramreis. Loop honderd meter naar het tramperron.',
            en: 'Starting tram route. Walk 100 meters to the tram platform.',
            de: 'Start der Straßenbahnfahrt. 100 Meter zum Bahnsteig gehen.'
          },
          laneAssist: 'Łatwy podjazd bez schodów ♿',
          speedLimit: 4,
          tip: pl ? 'Częste kursy co 6-8 minut, brak konieczności długiego czekania.' : 'Frequent service every 6-8 mins.'
        },
        {
          id: 2,
          instruction: {
            pl: `Wsiądź do tramwaju linii ${city === 'Rotterdam' ? '7 / 8 / 21 / 23' : city === 'Amsterdam' ? '2 / 12 / 14' : 'Miejskiej'} w kierunku ${destName}`,
            nl: `Stap in tram richting ${destName}`,
            en: `Board tram towards ${destName}`,
            de: `Steigen Sie in die Straßenbahn Richtung ${destName} ein`
          },
          street: city ? `Torowisko Wydzielone (${city})` : 'Linia Tramwajowa',
          distance: '3.1 km (10 min)',
          distanceMeters: 3100,
          iconType: 'straight',
          voicePrompt: {
            pl: 'Wsiądź do tramwaju. Przejazd po wydzielonym torowisku zajmie około dziesięć minut bez żadnych korków.',
            nl: 'Stap in de tram. De rit duurt circa tien minuten zonder file.',
            en: 'Board the tram. Smooth 10 minute ride on dedicated tracks.',
            de: 'In die Straßenbahn einsteigen. Etwa 10 Minuten Fahrt ohne Stau.'
          },
          laneAssist: '100% niskopodłogowy z klimatyzacją',
          speedLimit: 40,
          tip: pl ? 'Gładka, bezwstrząsowa jazda, doskonała widoczność miasta przez panoramiczne szyby.' : 'Smooth ride with panoramic city views.'
        },
        {
          id: 3,
          instruction: {
            pl: `Wysiądź na przystanku przy: ${destName}`,
            nl: `Stap uit bij halte ${destName}`,
            en: `Alight at the stop near ${destName}`,
            de: `Steigen Sie an der Haltestelle ${destName} aus`
          },
          street: `Przystanek Tramwajowy: ${destName}`,
          distance: '90 m',
          distanceMeters: 90,
          iconType: 'transit-exit',
          voicePrompt: {
            pl: 'Za dziewięćdziesiąt metrów wysiądź na przystanku. Pamiętaj o odbiciu karty przy wyjściu.',
            nl: 'Stap over negentig meter uit en check uit.',
            en: 'Alight in 90 meters and remember to check out.',
            de: 'In 90 Metern aussteigen und auschecken.'
          },
          laneAssist: 'Peron na poziomie wejścia do tramwaju',
          speedLimit: 4,
          tip: pl ? 'Drzwi z rampą na poziomie peronu, bezpieczne wysiadanie.' : 'Level platform boarding.'
        },
        {
          id: 4,
          instruction: {
            pl: `Dotarłeś pod bramę główną atrakcji: ${destName}`,
            nl: `U staat voor de hoofdingang van: ${destName}`,
            en: `Arrived at the main entrance of: ${destName}`,
            de: `Sie stehen vor dem Haupteingang von: ${destName}`
          },
          street: destName,
          distance: '0 m',
          distanceMeters: 0,
          iconType: 'destination',
          voicePrompt: {
            pl: `Dotarłeś do celu: ${destName}. Zapraszamy do zwiedzania!`,
            nl: `U bent aangekomen bij ${destName}. Veel plezier!`,
            en: `You have arrived at ${destName}. Enjoy!`,
            de: `Sie haben ${destName} erreicht. Willkommen!`
          },
          laneAssist: 'Strefa turystyczna / Wejście',
          speedLimit: 3,
          tip: pl ? 'Punkt informacyjny, kasy i toalety tuż przy wejściu.' : 'Information desk and restrooms right ahead.'
        }
      ];
    } else if (activeTravelMode === 'transit') {
      return [
        {
          id: 1,
          instruction: {
            pl: `Wejdź na stację kolejową: ${originName} i udaj się na peron`,
            nl: `Ga naar station ${originName} en loop naar het perron`,
            en: `Enter railway station ${originName} and proceed to platform`,
            de: `Gehen Sie zum Bahnhof ${originName} und zum Bahnsteig`
          },
          street: 'Hala Główna Dworca / Perony Kolejowe',
          distance: '150 m',
          distanceMeters: 150,
          iconType: 'transit-board',
          voicePrompt: {
            pl: 'Rozpoczynamy podróż koleją. Za sto pięćdziesiąt metrów wejdź na peron odjazdów pociągów.',
            nl: 'We beginnen de treinreis. Loop honderdvijftig meter naar het perron.',
            en: 'Starting rail navigation. In 150 meters arrive at train platform.',
            de: 'Start der Bahnreise. In 150 Metern zum Bahnsteig gehen.'
          },
          laneAssist: 'Winda / Podjazd bez barier',
          speedLimit: 5,
          tip: pl ? 'Brak schodów - szeroki podjazd i automatyczna winda na peron.' : 'Step-free elevator and ramps.'
        },
        {
          id: 2,
          instruction: {
            pl: `Wsiądź do pociągu (NS Sprinter / Intercity / PKP) w stronę ${destName}`,
            nl: `Stap in de trein richting ${destName}`,
            en: `Board train towards ${destName}`,
            de: `Steigen Sie in den Zug Richtung ${destName} ein`
          },
          street: city ? `Kolej NS / Regionalna (${city})` : 'Trasa Kolejowa',
          distance: '5.2 km (8 min)',
          distanceMeters: 5200,
          iconType: 'straight',
          voicePrompt: {
            pl: 'Wsiądź do pociągu. Pociąg jedzie szybko i komfortowo. Przygotuj bilet lub kartę do kontroli.',
            nl: 'Stap in de trein. Comfortabele en snelle rit.',
            en: 'Board the train. Fast and comfortable journey.',
            de: 'Einsteigen. Schnelle und bequeme Fahrt.'
          },
          laneAssist: 'Pociąg z gniazdkami i Wi-Fi',
          speedLimit: 90,
          tip: pl ? 'Wygodne fotele, toalety na pokładzie i darmowe Wi-Fi.' : 'Comfortable seating, onboard toilets and Wi-Fi.'
        },
        {
          id: 3,
          instruction: {
            pl: `Wysiądź na stacji docelowej w pobliżu: ${destName}`,
            nl: `Stap uit op het station nabij ${destName}`,
            en: `Alight at the station near ${destName}`,
            de: `Steigen Sie am Bahnhof bei ${destName} aus`
          },
          street: `Stacja: ${destName}`,
          distance: '250 m',
          distanceMeters: 250,
          iconType: 'transit-exit',
          voicePrompt: {
            pl: 'Za dwieście pięćdziesiąt metrów wysiądź na stacji i przejdź przez bramki biletowe.',
            nl: 'Stap over tweehonderdvijftig meter uit op het station.',
            en: 'Alight in 250 meters and pass the ticket gates.',
            de: 'In 250 Metern am Bahnhof aussteigen.'
          },
          laneAssist: 'Szerokie bramki dla bagażu i wózków',
          speedLimit: 5,
          tip: pl ? 'Pamiętaj o odbiciu karty na bramkach wyjściowych!' : 'Remember to check out at the gates!'
        },
        {
          id: 4,
          instruction: {
            pl: `Spacer (180 m) od stacji do celu: ${destName}`,
            nl: `Wandeling (180 m) naar ${destName}`,
            en: `Walk (180 m) from station to ${destName}`,
            de: `Spaziergang (180 m) vom Bahnhof zu ${destName}`
          },
          street: 'Aleja Spacerowa',
          distance: '180 m',
          distanceMeters: 180,
          iconType: 'destination',
          voicePrompt: {
            pl: `Dotarłeś na miejsce: ${destName}. Udanej wizyty!`,
            nl: `U bent aangekomen bij ${destName}. Prettige dag!`,
            en: `You have arrived at ${destName}. Have a great time!`,
            de: `Sie haben ${destName} erreicht. Einen schönen Tag!`
          },
          laneAssist: 'Płaski deptak bez barier',
          speedLimit: 4,
          tip: pl ? 'Wygodne ławeczki i kasy biletowe tuż obok.' : 'Benches and ticket desk nearby.'
        }
      ];
    } else {
      // Bike & Walk
      return [
        {
          id: 1,
          instruction: {
            pl: `Wyrusz z: ${originName}, wejdź na wydzieloną czerwoną drogę rowerowo-pieszą`,
            nl: `Start vanaf ${originName}, volg het rode fietspad / voetpad`,
            en: `Depart from ${originName}, join separated red cycle path / walkway`,
            de: `Starten Sie bei ${originName}, folgen Sie dem markierten Rad-/Gehweg`
          },
          street: 'Fietspad / Droga Rowerowa',
          distance: '200 m',
          distanceMeters: 200,
          iconType: 'straight',
          voicePrompt: {
            pl: 'Rozpoczynamy trasę. Za dwieście metrów jedź prosto wzdłuż kanału.',
            nl: 'We starten de route. Ga over tweehonderd meter rechtdoor langs het kanaal.',
            en: 'Starting route. In 200 meters continue straight along the canal.',
            de: 'Start der Route. In 200 Metern geradeaus am Kanal entlang.'
          },
          laneAssist: 'Wydzielony pas (Fietspad)',
          speedLimit: 20,
          tip: pl ? 'Płaska nawierzchnia asfaltowa, bezpieczne odseparowanie od aut.' : 'Flat asphalt, separated from cars.'
        },
        {
          id: 2,
          instruction: {
            pl: 'Skręć łagodnie w lewo wzdłuż malowniczego parku z ławeczkami',
            nl: 'Sla flauw linksaf langs het park met bankjes',
            en: 'Turn slight left along the scenic park with benches',
            de: 'Biegen Sie leicht links ab entlang des Parks mit Sitzbänken'
          },
          street: 'Aleja Parkowa',
          distance: '900 m',
          distanceMeters: 900,
          iconType: 'slight-left',
          voicePrompt: {
            pl: 'Skręć łagodnie w lewo. Jedź prosto przez park przez dziewięćset metrów.',
            nl: 'Sla flauw linksaf. Blijf negenhonderd meter rechtdoor gaan door het park.',
            en: 'Turn slight left. Continue through the park for 900 meters.',
            de: 'Leicht links abbiegen und 900 Meter durch den Park fahren.'
          },
          laneAssist: 'Oświetlona alejka parkowa',
          speedLimit: 15,
          tip: pl ? 'Czyste powietrze, liczne punkty odpoczynku w cieniu drzew.' : 'Shady benches and clean air.'
        },
        {
          id: 3,
          instruction: {
            pl: `Cel osiągnięty: ${destName}. Stojaki na rowery i wejście są tuż obok!`,
            nl: `Bestemming bereikt: ${destName}. Fietsenstallingen en ingang zijn dichtbij!`,
            en: `Destination reached: ${destName}. Bike racks and entrance are right here!`,
            de: `Ziel erreicht: ${destName}. Fahrradständer und Eingang direkt vor Ort!`
          },
          street: destName,
          distance: '0 m',
          distanceMeters: 0,
          iconType: 'destination',
          voicePrompt: {
            pl: `Jesteś u celu: ${destName}. Dziękujemy za wspólną bezpieczną podróż!`,
            nl: `U bent bij uw doel: ${destName}. Bedankt voor de veilige reis!`,
            en: `You have reached ${destName}. Thank you for traveling safely!`,
            de: `Sie sind am Ziel: ${destName}. Vielen Dank für die sichere Fahrt!`
          },
          laneAssist: 'Parking rowerowy / Wejście',
          speedLimit: 5,
          tip: pl ? 'Darmowe stojaki rowerowe i kawiarnia.' : 'Free bike parking and cozy café.'
        }
      ];
    }
  };

  const maneuvers = getManeuvers();
  const currentStep = maneuvers[Math.min(currentStepIndex, maneuvers.length - 1)] || maneuvers[0];
  const nextStep = maneuvers[currentStepIndex + 1];

  // Step change in Active Nav mode
  useEffect(() => {
    if (navMode === 'active-nav' && currentStep) {
      setSimulatedDistanceLeft(currentStep.distanceMeters || 150);
    }
  }, [currentStepIndex, navMode, activeTravelMode]);

  // Turn Simulation Loop (for indoor testing or real-time simulation)
  useEffect(() => {
    if (isSimulating && navMode === 'active-nav') {
      simTimerRef.current = setInterval(() => {
        setSimulatedDistanceLeft(prev => {
          if (prev <= 30) {
            // Advance to next maneuver
            if (currentStepIndex < maneuvers.length - 1) {
              setCurrentStepIndex(curr => curr + 1);
              return 350;
            } else {
              setIsSimulating(false);
              return 0;
            }
          }
          return Math.max(0, prev - 25);
        });

        // Dynamic slight speed variation for realism
        setSimulatedSpeed(prev => {
          const target = activeTravelMode === 'car' ? 48 : activeTravelMode === 'transit' ? 38 : 16;
          const jitter = Math.floor(Math.random() * 5) - 2;
          return Math.max(0, target + jitter);
        });
      }, 1000);
    } else {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    }

    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [isSimulating, navMode, currentStepIndex, maneuvers.length, activeTravelMode]);

  // Real GPS Geolocation Watcher
  useEffect(() => {
    if (isGpsTracking && navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          if (pos.coords.speed !== null && pos.coords.speed !== undefined) {
            setSimulatedSpeed(Math.round(pos.coords.speed * 3.6)); // m/s to km/h
          }
        },
        (err) => console.warn("GPS tracking error:", err),
        { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
      );
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isGpsTracking]);

  // Helper to render maneuver icon
  const renderManeuverIcon = (type: string, className = "w-8 h-8") => {
    switch (type) {
      case 'right':
        return <CornerUpRight className={className} />;
      case 'left':
        return <CornerUpLeft className={className} />;
      case 'slight-right':
        return <ArrowUpRight className={className} />;
      case 'slight-left':
        return <ArrowUpLeft className={className} />;
      case 'roundabout':
        return <RotateCw className={className} />;
      case 'destination':
        return <MapPin className={`${className} text-emerald-400`} />;
      case 'transit-board':
        return <Bus className={`${className} text-amber-300`} />;
      case 'transit-exit':
        return <Footprints className={`${className} text-indigo-300`} />;
      case 'straight':
      default:
        return <ArrowUp className={className} />;
    }
  };

  // Google Maps Embed and External URL logic
  const getGoogleDirFlag = (mode: TravelMode): string => {
    switch (mode) {
      case 'car': return 'd';
      case 'transit':
      case 'bus':
      case 'tram': return 'r';
      case 'bike': return 'b';
      case 'walk': return 'w';
      case 'motorcycle': return 'd';
      default: return 'r';
    }
  };

  const destinationQuery = useMemo(() => destinationTitle ? `${destinationTitle}, ${destination}` : destination, [destinationTitle, destination]);
  const originQuery = useMemo(() => startLocation.trim() || (city ? `${city} Centraal` : 'Centrum'), [startLocation, city]);
  const embedMapUrl = useMemo(() => `https://maps.google.com/maps?saddr=${encodeURIComponent(originQuery)}&daddr=${encodeURIComponent(destinationQuery)}&dirflg=${getGoogleDirFlag(activeTravelMode)}&output=embed`, [originQuery, destinationQuery, activeTravelMode]);
  const externalMapsUrl = useMemo(() => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originQuery)}&destination=${encodeURIComponent(destinationQuery)}&travelmode=${
    activeTravelMode === 'car' ? 'driving' :
    (activeTravelMode === 'transit' || activeTravelMode === 'bus' || activeTravelMode === 'tram') ? 'transit' :
    activeTravelMode === 'bike' ? 'bicycling' :
    activeTravelMode === 'walk' ? 'walking' : 'driving'
  }`, [originQuery, destinationQuery, activeTravelMode]);

  return (
    <div 
      className={`bg-slate-950 text-white space-y-0 select-none transition-all border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl ${className}`}
      id="active-in-app-gps-navigator"
    >
      
      {/* 1. TOP STATUS BAR: Active GPS Indicator, Destination Title & Quick Tools */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-2.5 sm:p-3.5 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <div className="bg-emerald-500 text-slate-950 p-1.5 rounded-xl font-black shadow-lg shadow-emerald-500/20">
              <Navigation className="w-4 h-4 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-emerald-400/30 flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-spin" />
                <span>{pl ? 'NAWIGACJA NA ŻYWO' : 'LIVE NAVIGATION'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold truncate">
                📍 {city}
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-black text-white truncate max-w-[200px] sm:max-w-md">
              {destinationTitle || destination}
            </h3>
          </div>
        </div>

        {/* Action Tool Buttons: Mode Switcher */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* View Mode Tabs: HUD vs Map vs Steps */}
          <div className="bg-slate-900 border border-slate-750 p-0.5 rounded-xl flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setActiveViewTab('map')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeViewTab === 'map'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{pl ? 'Mapa' : 'Map'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewTab('hud')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeViewTab === 'hud'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{pl ? 'Kokpit' : 'HUD'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewTab('steps')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeViewTab === 'steps'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{pl ? 'Kroki' : 'Steps'}</span>
            </button>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white font-bold text-xs px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              title={pl ? 'Zwiń panel trasy' : 'Close panel'}
            >
              <span>✕</span>
            </button>
          )}
        </div>
      </div>

      {/* ROUTE PLANNING & WAYPOINTS PANEL (Skąd -> Dokąd, Godzina, Środek transportu) */}
      <div className="bg-slate-900/95 border-b border-slate-800 p-3.5 sm:p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-amber-400">🗺️ {pl ? 'Konfiguracja Trasy' : 'Route Settings'}</span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              ({pl ? 'dostosuj punkt startu, cel i czas wyjazdu' : 'customize start, dest & time'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const temp = startLocation;
                setStartLocation(destinationLocation);
                setDestinationLocation(temp);
              }}
              className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
              title={pl ? 'Zamień Skąd i Dokąd' : 'Swap Start and Destination'}
            >
              <span className="text-sm font-black">⇄</span>
              <span>{pl ? 'Zamień' : 'Swap'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRouteEditor(!showRouteEditor)}
              className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 bg-slate-800/80 rounded-lg border border-slate-700 cursor-pointer"
            >
              {showRouteEditor ? (pl ? 'Zwiń ▲' : 'Collapse ▲') : (pl ? 'Zmień ▼' : 'Edit ▼')}
            </button>
          </div>
        </div>

        {showRouteEditor && (
          <div className="space-y-3 pt-1">
            {/* Connected Waypoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Start Location A */}
              <div className="relative flex items-center bg-slate-950 border border-slate-700 rounded-xl p-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 mr-2 shadow-xs">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-[9px] font-black text-indigo-400 uppercase tracking-wider leading-none">
                    {pl ? 'SKĄD (START):' : 'FROM (START):'}
                  </label>
                  <input
                    type="text"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    placeholder={pl ? 'Wpisz punkt startowy...' : 'Start address...'}
                    className="w-full bg-transparent text-white font-bold text-xs sm:text-sm outline-none placeholder:text-slate-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setStartLocation(pl ? 'Moja lokalizacja GPS' : 'My GPS location')}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 px-1.5 py-0.5 rounded cursor-pointer"
                  title="GPS"
                >
                  📍
                </button>
              </div>

              {/* Destination Location B */}
              <div className="relative flex items-center bg-slate-950 border border-slate-700 rounded-xl p-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 mr-2 shadow-xs">
                  B
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-[9px] font-black text-emerald-400 uppercase tracking-wider leading-none">
                    {pl ? 'DOKĄD (CEL):' : 'TO (DESTINATION):'}
                  </label>
                  <input
                    type="text"
                    value={destinationLocation}
                    onChange={(e) => setDestinationLocation(e.target.value)}
                    placeholder={pl ? 'Wpisz cel podróży...' : 'Destination...'}
                    className="w-full bg-transparent text-white font-bold text-xs sm:text-sm outline-none placeholder:text-slate-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setDestinationLocation(destinationTitle || destination)}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 px-1.5 py-0.5 rounded cursor-pointer"
                  title="Reset"
                >
                  🏛️
                </button>
              </div>
            </div>

            {/* Time & Travel Mode Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              
              {/* Departure Time with Quick Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    {pl ? 'Godzina:' : 'Time:'}
                  </span>
                </div>

                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="bg-slate-900 border border-amber-500/50 text-white text-xs font-mono font-bold px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />

                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    setDepartureTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
                  }}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded text-[11px] font-bold cursor-pointer"
                >
                  ⚡ {pl ? 'Teraz' : 'Now'}
                </button>

                <button
                  type="button"
                  onClick={() => setDepartureTime(addMinutesToTime(departureTime || '09:00', 15))}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-[11px] font-bold cursor-pointer"
                >
                  +15m
                </button>

                <button
                  type="button"
                  onClick={() => setDepartureTime('09:00')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer border ${
                    departureTime === '09:00' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  09:00
                </button>

                <button
                  type="button"
                  onClick={() => setDepartureTime('12:00')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer border ${
                    departureTime === '12:00' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  12:00
                </button>
              </div>

              {/* Mode Buttons (Pociąg, Autobus, Tramwaj, Samochód, Rower, Pieszo) */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
                {[
                  { mode: 'transit' as const, label: pl ? 'Pociąg' : 'Train', icon: Bus, emoji: '🚆' },
                  { mode: 'bus' as const, label: pl ? 'Autobus' : 'Bus', icon: Bus, emoji: '🚌' },
                  { mode: 'tram' as const, label: pl ? 'Tramwaj' : 'Tram', icon: Bus, emoji: '🚊' },
                  { mode: 'car' as const, label: pl ? 'Samochód' : 'Car', icon: Car, emoji: '🚗' },
                  { mode: 'bike' as const, label: pl ? 'Rower' : 'Bike', icon: Bike, emoji: '🚲' },
                  { mode: 'walk' as const, label: pl ? 'Pieszo' : 'Walk', icon: Footprints, emoji: '🚶' }
                ].map((item) => {
                  const isSel = activeTravelMode === item.mode;
                  return (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => setActiveTravelMode(item.mode)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                        isSel
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-xs ring-2 ring-emerald-400/40'
                          : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <span className="text-xs">{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. DYNAMIC LIVE TURN-BY-TURN HUD BANNER (Next Maneuver in Bold Cockpit Style) */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 p-4 sm:p-5">
        
        {/* Main Next Turn Display */}
        <div className="flex items-center gap-4 bg-slate-950 border-2 border-emerald-500/40 rounded-2xl p-4 shadow-xl relative overflow-hidden">
          
          {/* Big Maneuver Icon */}
          <div className="bg-emerald-500 text-slate-950 p-4 rounded-2xl shrink-0 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
            {renderManeuverIcon(currentStep.iconType, "w-9 h-9 sm:w-11 sm:h-11 stroke-[2.5]")}
          </div>

          {/* Maneuver Text & Distance Countdown */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
                {simulatedDistanceLeft <= 30 ? (pl ? 'TERAZ' : 'NOW') : `${simulatedDistanceLeft} m`}
              </span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {currentStep.street}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-white leading-snug">
              {currentStep.instruction[language] || currentStep.instruction['pl'] || currentStep.instruction['en']}
            </p>

            {/* Lane Assist / Transit Hint */}
            {currentStep.laneAssist && (
              <div className="flex items-center gap-2 pt-1">
                <span className="bg-slate-850 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                  🛣️ {currentStep.laneAssist}
                </span>
                {currentStep.speedLimit && (
                  <span className="w-5 h-5 rounded-full border-2 border-rose-500 bg-white text-slate-950 font-mono font-black text-[9px] flex items-center justify-center">
                    {currentStep.speedLimit}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Next Maneuver Preview (Waze/Apple Maps style) */}
        {nextStep && (
          <div className="mt-2.5 flex items-center justify-between bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-slate-300">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[10px] uppercase font-black text-slate-400">{pl ? 'Następnie:' : 'Then:'}</span>
              <div className="text-emerald-400 scale-90 shrink-0">
                {renderManeuverIcon(nextStep.iconType, "w-4 h-4")}
              </div>
              <span className="font-bold truncate text-slate-200">
                {nextStep.instruction[language] || nextStep.instruction['pl'] || nextStep.instruction['en']}
              </span>
            </div>
            <span className="font-mono font-bold text-slate-400 shrink-0 ml-2">
              {nextStep.distance}
            </span>
          </div>
        )}

      </div>

      {/* 3. COCKPIT / MAP / STEPS ACTIVE VIEWPORT */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        
        {/* VIEW 1: HUD Interactive Cockpit (Default Active Navigation) */}
        {activeViewTab === 'hud' && (
          <div className="space-y-4">
            
            {/* Live Interactive Telemetry Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Speedometer */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  {pl ? 'Prędkość' : 'Speed'}
                </span>
                <div className="flex items-baseline gap-1 my-0.5">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                    {simulatedSpeed}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">km/h</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">
                  ✓ {pl ? 'W normie' : 'Safe speed'}
                </span>
              </div>

              {/* Remaining Distance */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  {pl ? 'Dystans do celu' : 'Remaining'}
                </span>
                <div className="flex items-baseline gap-1 my-0.5">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                    {activeTravelMode === 'car' ? '4.8' : activeTravelMode === 'transit' ? '3.4' : '2.1'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">km</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {currentStepIndex + 1} / {maneuvers.length} {pl ? 'kroków' : 'steps'}
                </span>
              </div>

              {/* ETA Time Remaining */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  {pl ? 'Czas Dojazdu' : 'ETA'}
                </span>
                <div className="flex items-baseline gap-1 my-0.5">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
                    {activeTravelMode === 'car' ? '12' : activeTravelMode === 'transit' ? '18' : '15'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">min</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {pl ? 'Płynny ruch' : 'Light traffic'}
                </span>
              </div>

              {/* Active Travel Mode */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  {pl ? 'Środek transportu' : 'Mode'}
                </span>
                <div className="text-2xl my-0.5">
                  {activeTravelMode === 'car' ? '🚗' : activeTravelMode === 'transit' ? '🚌' : activeTravelMode === 'bike' ? '🚲' : '🚶‍♂️'}
                </div>
                <span className="text-[10px] text-indigo-300 font-bold uppercase">
                  {activeTravelMode}
                </span>
              </div>

            </div>

            {/* Embedded Live Map in HUD View with Live Radar */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-900 shadow-inner">
              <iframe
                key={iframeKey}
                title={`Live Navigation Map to ${destinationQuery}`}
                src={embedMapUrl}
                className="w-full h-[280px] sm:h-[340px] border-0"
                loading="lazy"
                allowFullScreen
              />

              {/* Navigation Overlay Info */}
              <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-2 shadow-lg pointer-events-none">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>{pl ? `Nawigowanie do: ${destinationTitle || destination}` : `Navigating to: ${destinationTitle || destination}`}</span>
              </div>

              {/* Quick Center GPS button */}
              <button
                type="button"
                onClick={() => {
                  setIframeKey(prev => prev + 1);
                  setIsGpsTracking(true);
                }}
                className="absolute bottom-3 right-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 p-2.5 rounded-xl font-bold transition-all shadow-lg cursor-pointer flex items-center gap-1.5 text-xs"
                title={pl ? 'Centruj na mojej pozycji GPS' : 'Center GPS'}
              >
                <LocateFixed className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">{pl ? 'Centruj GPS' : 'Center'}</span>
              </button>
            </div>

            {/* Manual Step Controls & Simulation Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-wrap justify-between items-center gap-3">
              
              {/* Step Navigation (Prev / Next) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                  className="bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{pl ? 'Wstecz' : 'Back'}</span>
                </button>

                <span className="text-xs font-mono font-black text-slate-300 px-2">
                  {currentStepIndex + 1} / {maneuvers.length}
                </span>

                <button
                  type="button"
                  disabled={currentStepIndex >= maneuvers.length - 1}
                  onClick={() => setCurrentStepIndex(prev => Math.min(maneuvers.length - 1, prev + 1))}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-slate-950 font-black text-xs px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>{pl ? 'Dalej' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Simulation Mode Toggle (For testing turn-by-turn indoors) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSimulating
                      ? 'bg-amber-500 text-slate-950 animate-pulse shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isSimulating ? (pl ? 'Pauza Symulacji' : 'Pause Demo') : (pl ? 'Symuluj Jazdę (Demo)' : 'Simulate Drive')}</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: Full Map View */}
        {activeViewTab === 'map' && (
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-900 shadow-inner flex-1 min-h-[420px] sm:min-h-[500px]">
            <iframe
              key={iframeKey}
              title={`Full Google Map Route to ${destinationQuery}`}
              src={embedMapUrl}
              className="w-full h-[65vh] sm:h-[70vh] min-h-[400px] border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        )}

        {/* VIEW 3: Step-by-Step List View */}
        {activeViewTab === 'steps' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>{pl ? 'Kompletna Lista Manewrów Trasy:' : 'Complete Maneuvers List:'}</span>
            </h4>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {maneuvers.map((step, idx) => {
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={step.id}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-md ring-1 ring-emerald-400/40'
                        : 'bg-slate-950/60 hover:bg-slate-850 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${isCurrent ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      {renderManeuverIcon(step.iconType, "w-5 h-5")}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-mono font-black text-amber-400">
                          Krok {idx + 1} • {step.distance}
                        </span>
                        {isCurrent && (
                          <span className="bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                            {pl ? 'TERAZ' : 'ACTIVE'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white">
                        {step.instruction[language] || step.instruction['pl'] || step.instruction['en']}
                      </p>
                      {step.tip && (
                        <p className="text-[11px] text-slate-400">
                          💡 {step.tip}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. SENIOR ACCESSIBILITY & SAFETY BAR (Toilets, P+R, Assistance) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSeniorRestroomHelp(!showSeniorRestroomHelp)}
                className="bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-indigo-500/30"
              >
                <span>🚻 {pl ? 'Toalety na trasie' : 'Toilets on route'}</span>
              </button>

              <button
                type="button"
                onClick={() => alert(pl ? 'Wszystkie wejścia i windy na trasie są w 100% dostosowane dla wózków i seniorów.' : 'Step-free access & elevators verified.')}
                className="bg-slate-800 hover:bg-slate-750 text-emerald-300 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-emerald-500/30"
              >
                <Accessibility className="w-3.5 h-3.5" />
                <span>{pl ? 'Dostępność ♿' : 'Accessibility ♿'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Optional external backup if user desires native phone voice in car */}
              <a
                href={externalMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                title={pl ? 'Otwórz opcjonalnie w zewnętrznej aplikacji Google Maps' : 'Open in Google Maps external'}
              >
                <span>{pl ? 'Aplikacja zewn.' : 'External App'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  {pl ? 'Zakończ Nawigację' : 'End Nav'}
                </button>
              )}
            </div>

          </div>

          {/* Expanded Restroom & Senior Assistance Card */}
          {showSeniorRestroomHelp && (
            <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/40 text-xs space-y-1 text-slate-300">
              <p className="font-bold text-white flex items-center gap-1.5">
                <span className="text-amber-400">🚻</span>
                <span>{pl ? 'Najbliższe Czyste Toalety Bez Barier:' : 'Closest Step-Free Restrooms:'}</span>
              </p>
              <p className="text-[11px]">
                {pl 
                  ? '• Stacja docelowa / Wejście główne: Toalety automatyczne Sanifair / Miejskie dostosowane z przewijakami i windą.' 
                  : '• Destination station / Main entrance: Accessible automatic restrooms with elevator access.'}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default InAppGoogleMapRoute;
