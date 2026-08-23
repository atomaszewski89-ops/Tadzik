import React, { useState } from 'react';
import { Language, UserAccount } from '../../types';
import InAppGoogleMapRoute from '../InAppGoogleMapRoute';
import { planTransitRoute, PlannedTransitItinerary } from '../../services/transitRouteEngine';
import TransitRouteResultView from './TransitRouteResultView';
import { 
  Compass, 
  MapPin, 
  Car, 
  Train, 
  Bus, 
  Sparkles, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Info, 
  Navigation, 
  ArrowRight, 
  Search, 
  RotateCcw, 
  SlidersHorizontal, 
  Accessibility, 
  Coffee, 
  Zap, 
  Bike, 
  Footprints, 
  Edit3, 
  LocateFixed, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle, 
  Armchair, 
  Route, 
  ChevronRight, 
  Heart, 
  Baby, 
  Landmark, 
  Loader2,
  TrainTrack
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TadzikTripPlannerProps {
  language: Language;
  account: UserAccount | null;
}

export type TransportMode = 'train' | 'tram' | 'bus' | 'public' | 'car' | 'motorcycle' | 'bicycle' | 'walk';

export const TadzikTripPlanner: React.FC<TadzikTripPlannerProps> = ({ language }) => {
  const pl = language === 'pl';
  const nl = language === 'nl';
  const de = language === 'de';
  const es = language === 'es';
  const fr = language === 'fr';

  // Helpers for dates
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getWeekendSaturdayDateString = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = (6 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const todayStr = getTodayDateString();
    const tomorrowStr = getTomorrowDateString();
    if (dateStr === todayStr) return pl ? 'Dzisiaj' : nl ? 'Vandaag' : 'Today';
    if (dateStr === tomorrowStr) return pl ? 'Jutro' : nl ? 'Morgen' : 'Tomorrow';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  // State management
  const [startStreet, setStartStreet] = useState<string>('');
  const [destPlace, setDestPlace] = useState<string>('');
  const [departureDate, setDepartureDate] = useState<string>(getTodayDateString);
  const [departureTime, setDepartureTime] = useState<string>('09:30');
  const [selectedTransportMode, setSelectedTransportMode] = useState<TransportMode>('public');
  
  // Real GPS Geolocation state
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);
  const [gpsSuccessNotice, setGpsSuccessNotice] = useState<string | null>(null);

  // Thematic Destination Categories: 'attractions' | 'romantic' | 'kids' | 'stations' | null
  const [activeSuggestionCategory, setActiveSuggestionCategory] = useState<'attractions' | 'romantic' | 'kids' | 'stations' | null>(null);

  // Validation error state
  const [inputError, setInputError] = useState<string | null>(null);

  // View states
  const [isTripSearched, setIsTripSearched] = useState<boolean>(false);
  const [isSearchingAnimation, setIsSearchingAnimation] = useState<boolean>(false);
  const [currentItinerary, setCurrentItinerary] = useState<PlannedTransitItinerary | null>(null);

  // Accessibility & Options
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [avoidStairs, setAvoidStairs] = useState(true);
  const [needRestroom, setNeedRestroom] = useState(true);
  const [needElevators, setNeedElevators] = useState(true);
  const [needPrioritySeats, setNeedPrioritySeats] = useState(true);

  // Public transit preferences
  const [preferDirectOnly, setPreferDirectOnly] = useState(false);
  const [extraTransferBuffer, setExtraTransferBuffer] = useState(true);

  // Live GPS geolocation handler (respects registration GPS consent & cached coordinates)
  const handleGetLiveGPSLocation = () => {
    try {
      const cached = localStorage.getItem('tadzik_user_gps_location');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.locationName && parsed.locationName !== 'Rotterdam Centraal (51.9244°N, 4.4777°E)') {
          setStartStreet(parsed.locationName);
          setGpsSuccessNotice(pl ? `📍 Zastosowano zapamiętaną lokalizację GPS: ${parsed.locationName}` : `📍 Applied remembered GPS: ${parsed.locationName}`);
          return;
        }
      }
    } catch (e) {}

    if (!navigator.geolocation) {
      setInputError(pl ? 'Twoje urządzenie lub przeglądarka nie obsługuje modułu lokalizacji GPS.' : 'Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingGps(true);
    setInputError(null);
    setGpsSuccessNotice(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy || 0);

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1800);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
            {
              signal: controller.signal,
              headers: { 'Accept-Language': pl ? 'pl,en' : nl ? 'nl,en' : 'en' }
            }
          );
          clearTimeout(timeoutId);

          let formattedName = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
          if (res.ok) {
            const data = await res.json();
            const addr = data.address;
            const road = addr?.road || addr?.pedestrian || addr?.street || addr?.suburb;
            const houseNumber = addr?.house_number;
            const city = addr?.city || addr?.town || addr?.village || addr?.municipality;
            
            if (road && city) {
              formattedName = `${road}${houseNumber ? ' ' + houseNumber : ''}, ${city}`;
            } else if (data.display_name) {
              const parts = data.display_name.split(', ');
              formattedName = parts.slice(0, 3).join(', ');
            }
          }

          setStartStreet(formattedName);
          setGpsSuccessNotice(pl ? `📍 Wykryto lokalizację: ${formattedName}` : `📍 Detected location: ${formattedName}`);

          try {
            localStorage.setItem('tadzik_gps_consent_granted', 'true');
            localStorage.setItem('tadzik_user_gps_location', JSON.stringify({
              coords: { lat, lng: lon },
              status: 'success',
              locationName: formattedName,
              accuracyMeters: accuracy,
              updatedAt: Date.now()
            }));
          } catch (e) {}
        } catch {
          const coordName = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
          setStartStreet(coordName);
          setGpsSuccessNotice(pl ? `📍 Pozycja GPS: ${coordName}` : `📍 GPS: ${coordName}`);
          try {
            localStorage.setItem('tadzik_gps_consent_granted', 'true');
            localStorage.setItem('tadzik_user_gps_location', JSON.stringify({
              coords: { lat, lng: lon },
              status: 'success',
              locationName: coordName,
              accuracyMeters: accuracy,
              updatedAt: Date.now()
            }));
          } catch (e) {}
        } finally {
          setIsLocatingGps(false);
        }
      },
      (error) => {
        setIsLocatingGps(false);
        let errorMsg = pl ? 'Nie udało się pobrać współrzędnych GPS z telefonu/urządzenia.' : 'Failed to retrieve GPS location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = pl ? 'Brak uprawnień: Zezwól przeglądarce na dostęp do lokalizacji w ustawieniach urządzenia.' : 'Location permission denied. Please allow location access in your device settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = pl ? 'Sygnał GPS jest obecnie niedostępny. Upewnij się, że masz włączoną lokalizację.' : 'GPS signal unavailable. Please ensure location services are enabled.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = pl ? 'Przekroczono czas oczekiwania na sygnał GPS. Spróbuj ponownie.' : 'GPS signal request timed out.';
        }
        setInputError(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  };

  // Helper to add minutes to HH:MM time string
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

  // Generate dynamic travel steps based on selected transport mode
  const getTravelModeDetails = (mode: TransportMode) => {
    const start = startStreet.trim() || (pl ? 'Punkt Startowy' : 'Start Point');
    const dest = destPlace.trim() || (pl ? 'Miejsce Docelowe' : 'Destination');
    const time = departureTime || '09:30';

    switch (mode) {
      case 'train':
        return {
          title: pl ? "Pociąg / Szybka Kolej (Intercity / Regionalne 🚆)" : nl ? "Trein (Intercity / Regionaal 🚆)" : "Train & Railway (Intercity / Regional 🚆)",
          badge: pl ? "Szybka Kolej & WARS ☕" : "High-Speed Rail ☕",
          durationMins: 45,
          totalPrice: 12.00,
          comfortScore: "9.9/10",
          desc: pl 
            ? "Wygodna podróż pociągiem z dedykowanymi miejscami dla seniorów, wagonem restauracyjnym WARS/Bistro, toaletami dla osób z niepełnosprawnością i windami peronowymi." 
            : "Comfortable rail journey with senior priority seating, onboard dining car, accessible restrooms, and station elevators.",
          tips: pl 
            ? "Bilety kupisz przez aplikację kolejową (PKP/NS/DB) lub w kasie biletowej. Seniorzy 60+ otrzymują automatyczną zniżkę na bilet dla seniora." 
            : "Senior discounts available for passengers aged 60+. Step-free platform access guaranteed.",
          steps: [
            {
              time: time,
              action: pl ? `Dojście na peron stacji: ${start} (Winda A)` : `Station concourse & platform entrance at ${start}`,
              icon: MapPin,
              detail: pl ? 'Szerokie bramki biletowe, winda na peron, brak schodów.' : 'Step-free elevator to platform, wide fare gates.'
            },
            {
              time: addMinutesToTime(time, 8),
              action: pl ? "Pociąg Intercity / Regionalny (Peron 1, Tor 2)" : "Intercity Train (Platform 1, Track 2)",
              icon: Train,
              cost: "€7.50 / 32 zł",
              detail: pl ? 'Wagon bezbarierowy, klimatyzacja, toaleta PRM, obsługa kelnerska WARS.' : 'Accessible coach, AC, priority seats, onboard bistro.'
            },
            {
              time: addMinutesToTime(time, 35),
              action: pl ? "Przyjazd na stację węzłową i przesiadka na pociąg aglomeracyjny" : "Arrival at Junction Station & transfer",
              icon: TrainTrack,
              cost: "€4.50 / 18 zł",
              detail: pl ? 'Przejście na peron obok (10 minut na spokojny odpoczynek i toaletę).' : 'Cross-platform transfer with 10-minute buffer.'
            },
            {
              time: addMinutesToTime(time, 45),
              action: pl ? `Przybycie na stację docelową: ${dest}` : `Arrival at destination station: ${dest}`,
              icon: Navigation,
              detail: pl ? 'Zjazd windą prosto do centrum miasta lub na przystanek komunikacji.' : 'Direct elevator exit to promenade and town square.'
            }
          ]
        };

      case 'tram':
        return {
          title: pl ? "Tramwaj Miejski (Niskopodłogowe Linie Szynowe 🚋)" : nl ? "Tram (Lagevloertrams 🚋)" : "City Tram (Low-Floor Tramways 🚋)",
          badge: pl ? "100% Niska Podłoga ♿" : "100% Low-Floor ♿",
          durationMins: 28,
          totalPrice: 3.20,
          comfortScore: "9.9/10",
          desc: pl 
            ? "Cicha, nowoczesna podróż tramwajem niskopodłogowym. Wejście bezpośrednio z krawędzi peronu bez stopni, automatyczne drzwi i biletomaty wewnątrz składu." 
            : "Smooth low-floor city tram with level platform boarding, zero stairs, and contactless payment onboard.",
          tips: pl 
            ? "Wystarczy zbliżyć kartę bankową VISA/Mastercard do kasownika wewnątrz tramwaju przy wejściu i wyjściu." 
            : "Tap your contactless card at onboard reader upon boarding and exiting.",
          steps: [
            {
              time: time,
              action: pl ? `Dojście na przystanek tramwajowy: ${start}` : `Walk to tram stop at ${start}`,
              icon: MapPin,
              detail: pl ? 'Wysoki peron tramwajowy na równi z podłogą wagonu.' : 'Platform flush with tram floor.'
            },
            {
              time: addMinutesToTime(time, 5),
              action: pl ? "Tramwaj Niskopodłogowy Linia 9 (Kierunek: Centrum)" : "Low-Floor Tram Line 9 (Direction: Center)",
              icon: TrainTrack,
              cost: "€1.80 / 8 zł",
              detail: pl ? 'Szerokie podwójne drzwi, rampa wjazdowa, zapowiedzi głosowe przystanków.' : 'Wide double doors, wheelchair ramp, audio stop announcements.'
            },
            {
              time: addMinutesToTime(time, 20),
              action: pl ? "Przesiadka na Tramwaj Linii 16 na wspólnym peronie" : "Transfer to Tram Line 16 on shared platform",
              icon: TrainTrack,
              cost: "W cenie biletu",
              detail: pl ? 'Ten sam peron wyspowy – brak konieczności schodzenia po schodach.' : 'Same platform transfer – zero elevation change.'
            },
            {
              time: addMinutesToTime(time, 28),
              action: pl ? `Wysiadka pod samym wejściem do: ${dest}` : `Step off directly at: ${dest}`,
              icon: Navigation,
              detail: pl ? 'Bezpośrednie wyjście z peronu na deptak.' : 'Direct step onto pedestrian walkway.'
            }
          ]
        };

      case 'bus':
        return {
          title: pl ? "Autobus Miejski / Przyspieszony (Linie Niskopodłogowe 🚌)" : nl ? "Bus (Stads- en Streekbussen 🚌)" : "City & Regional Bus (Accessible 🚌)",
          badge: pl ? "Funkcja Przyklęku 🚏" : "Kneeling Bus 🚏",
          durationMins: 32,
          totalPrice: 3.00,
          comfortScore: "9.8/10",
          desc: pl 
            ? "Bezpośrednia trasa autobusowa nowoczesnymi pojazdami z funkcją przyklęku na przystanku, klimatyzacją i dedykowanymi miejscami dla seniorów." 
            : "Accessible bus route with kneeling suspension, air conditioning, and senior seating.",
          tips: pl 
            ? "Autobus obniża poziom wejścia przy krawężniku przystanku. Bilet kupisz zbliżeniowo u kierowcy lub w biletomacie." 
            : "Vehicle kneels at curb for easy entry. Tap contactless card inside vehicle.",
          steps: [
            {
              time: time,
              action: pl ? `Dojście do zatoki autobusowej: ${start}` : `Walk to bus shelter at ${start}`,
              icon: MapPin,
              detail: pl ? 'Zadaszona wiata z ławeczką i tablicą odjazdów na żywo.' : 'Sheltered stop with rest bench and live departures.'
            },
            {
              time: addMinutesToTime(time, 6),
              action: pl ? "Autobus Przyspieszony Linia 174 (Klimatyzowany)" : "Express Bus Line 174 (Air Conditioned)",
              icon: Bus,
              cost: "€1.80 / 8 zł",
              detail: pl ? 'Przyklęk na przystanku, miękkie fotele dla seniorów tuż przy wejściu.' : 'Kneeling vehicle, priority seats at entrance.'
            },
            {
              time: addMinutesToTime(time, 24),
              action: pl ? "Przesiadka na dworcu autobusowym (Zadaszone stanowisko B)" : "Sheltered bus terminal transfer (Bay B)",
              icon: Bus,
              cost: "€1.20 / 5 zł",
              detail: pl ? 'Odpoczynek w poczekalni, 8 minut zapasu czasu na przesiadkę.' : 'Terminal rest lounge, 8 min connection buffer.'
            },
            {
              time: addMinutesToTime(time, 32),
              action: pl ? `Przybycie na przystanek docelowy: ${dest}` : `Arrival at destination stop: ${dest}`,
              icon: Navigation,
              detail: pl ? 'Zatoka autobusowa 30 metrów od głównego wejścia.' : 'Bus bay 30 meters from main entrance.'
            }
          ]
        };

      case 'public':
        return {
          title: pl ? "Zintegrowana Komunikacja (Pociąg + Tramwaj + Autobus 🚆🚋🚌)" : nl ? "Geïntegreerd Openbaar Vervoer (Trein + Tram + Bus 🚆🚋🚌)" : "Integrated Transit (Train + Tram + Bus 🚆🚋🚌)",
          badge: pl ? "Rekomendowane • 100% Bez Barier ♿" : "Recommended • Barrier-Free ♿",
          durationMins: 35,
          totalPrice: 4.50,
          comfortScore: "9.8/10",
          desc: pl 
            ? "Optymalne połączenie kolei regionalnej, szybkiego tramwaju i autobusu. Wszystkie przesiadki zaplanowane w węzłach z windami i 100% niskopodłogowym taborem." 
            : "Optimal combination of regional rail, modern tram and city buses with level transfers and elevators.",
          tips: pl 
            ? "Jeden bilet aglomeracyjny lub zbliżenie karty OVpay/bankowej obsługuje wszystkie środki transportu na trasie." 
            : "Single unified transit ticket or contactless card works on all vehicles.",
          steps: [
            {
              time: time,
              action: pl ? `Wejście na stację: ${start} (Winda A na peron)` : `Platform entrance at ${start} (Elevator A)`,
              icon: MapPin,
              detail: pl ? 'Równy podjazd, szerokie bramki, asystent stacji.' : 'Wide ticket gates, level ramps and station support.'
            },
            {
              time: addMinutesToTime(time, 10),
              action: pl ? "Pociąg regionalny / Kolej miejska (Klimatyzacja, toaleta PRM)" : "Regional train (Air-conditioned, PRM restroom)",
              icon: Train,
              cost: "€3.00 / 14 zł",
              detail: pl ? 'Wagon niskopodłogowy, miejsca siedzące z pierwszeństwem dla seniorów.' : 'Low-floor carriage with senior priority seats.'
            },
            {
              time: addMinutesToTime(time, 25),
              action: pl ? "Wygodna przesiadka: Tramwaj niskopodłogowy / Autobus" : "Transfer to low-floor city tram/bus",
              icon: Bus,
              cost: "€1.50 / 6 zł",
              detail: pl ? 'Wejście bezpośrednio z poziomu peronu – zero stopni.' : 'Level boarding directly from platform.'
            },
            {
              time: addMinutesToTime(time, 35),
              action: pl ? `Spokojne dojście do celu: ${dest}` : `Gentle arrival walk to: ${dest}`,
              icon: Navigation,
              detail: pl ? 'Cel znajduje się 50 metrów od przystanku. Szeroki, równy chodnik.' : 'Destination is 50 meters away on a flat walkway.'
            }
          ]
        };

      case 'car':
        return {
          title: pl ? "Samochód (Trasa z Parkingiem P+R 🚗)" : nl ? "Auto (Route met P+R Parkeren 🚗)" : "Car Route (with P+R Parking 🚗)",
          badge: pl ? "Płynna Jazda 🛣️" : "Smooth Drive 🛣️",
          durationMins: 30,
          totalPrice: 8.50,
          comfortScore: "9.8/10",
          desc: pl 
            ? "Spokojna trasa z ominięciem zatorów miejskich, bezpieczny parking P+R z szerokimi miejscami i bezpośrednią windą na deptak." 
            : "Smooth drive avoiding heavy traffic, senior-friendly P+R garage with elevator.",
          tips: pl 
            ? "Wjazd na parking P+R jest tani, jeśli skorzystasz z biletu komunikacji miejskiej do centrum. Zachowaj bilet parkingowy!" 
            : "Use P+R for discounted parking combined with public transit ticket.",
          steps: [
            {
              time: time,
              action: pl ? `Start autem z: ${start}` : `Departure by car from: ${start}`,
              icon: MapPin,
              detail: pl ? 'Wyjazd w porze bezpiecznego i płynnego ruchu drogowego.' : 'Departure during quiet traffic hours.'
            },
            {
              time: addMinutesToTime(time, 15),
              action: pl ? "Przejazd drogą główną / obwodnicą + stacja z toaletą" : "Highway section + clean rest stop",
              icon: Car,
              cost: "€4.00 (paliwo)",
              detail: pl ? 'Zjazd na stację paliw z dostępną toaletą i kawiarnią.' : 'Free access to clean restrooms and coffee station.'
            },
            {
              time: addMinutesToTime(time, 25),
              action: pl ? "Wjazd na parking P+R (szerokie miejsca parkingowe, winda)" : "Arrival at P+R Garage (Wide spaces, elevator)",
              icon: Info,
              cost: "€4.50 (parking)",
              detail: pl ? 'Winda z parkingu prowadzi bezpośrednio na poziom deptaka.' : 'Direct elevator access to the main promenade level.'
            },
            {
              time: addMinutesToTime(time, 30),
              action: pl ? `Krótki spacer do: ${dest}` : `Short flat stroll to: ${dest}`,
              icon: Navigation,
              detail: pl ? 'Płaski deptak wyłączony z ruchu samochodowego, ławeczki co kilkadziesiąt metrów.' : 'Pedestrian-only street with resting benches.'
            }
          ]
        };

      case 'motorcycle':
        return {
          title: pl ? "Motocykl / Skuter (Trasa Widokowa 🏍️)" : nl ? "Motor / Scooter (Panoramaroute 🏍️)" : "Motorcycle / Scooter (Scenic Route 🏍️)",
          badge: pl ? "Trasa Krajobrazowa 🏞️" : "Scenic Route 🏞️",
          durationMins: 22,
          totalPrice: 3.80,
          comfortScore: "9.5/10",
          desc: pl 
            ? "Malownicza, bezpieczna trasa omijająca korki, z darmowymi miejscami postojowymi dla jednośladów tuż przy wejściu." 
            : "Scenic and breezy route with free dedicated motorcycle parking near destination.",
          tips: pl 
            ? "W miastach europejskich jednoślady mogą bezpłatnie parkować w wyznaczonych strefach dla motocykli." 
            : "Park in dedicated two-wheeler bays free of charge.",
          steps: [
            {
              time: time,
              action: pl ? `Start motocyklem / skuterem z: ${start}` : `Start from: ${start}`,
              icon: MapPin,
              detail: pl ? 'Płynny start trasą o równej nawierzchni asfaltowej.' : 'Smooth departure along well-maintained asphalt roads.'
            },
            {
              time: addMinutesToTime(time, 10),
              action: pl ? "Punkt postojowy: Kawiarnia przydrożna & punkt widokowy" : "Rest stop: Roadside cafe & viewpoint",
              icon: Coffee,
              cost: "€2.00 (kawa)",
              detail: pl ? 'Możliwość rozprostowania nóg, toaleta i ciepła herbata.' : 'Opportunity to stretch legs, restroom and warm drink.'
            },
            {
              time: addMinutesToTime(time, 19),
              action: pl ? "Darmowy bezpieczny parking dla jednośladów" : "Dedicated free motorcycle parking zone",
              icon: Info,
              cost: "€1.80 (paliwo)",
              detail: pl ? 'Stanowiska postojowe tuż przy celu podróży.' : 'Covered bike stalls just near the entrance.'
            },
            {
              time: addMinutesToTime(time, 22),
              action: pl ? `Wejście do: ${dest}` : `Arrival at: ${dest}`,
              icon: Navigation,
              detail: pl ? 'Zero opłat parkingowych, wejście bezpośrednio z chodnika.' : 'Zero parking fees, direct sidewalk entrance.'
            }
          ]
        };

      case 'bicycle':
        return {
          title: pl ? "Rower / E-Bike (Płaskie Ścieżki Rowerowe 🚲)" : nl ? "Fiets / E-Bike (Vlakke Fietspaden 🚲)" : "Bicycle / E-Bike (Flat Bike Paths 🚲)",
          badge: pl ? "100% Ekologicznie 🌿" : "100% Eco-Friendly 🌿",
          durationMins: 25,
          totalPrice: 0.00,
          comfortScore: "9.9/10",
          desc: pl 
            ? "Bezpieczna trasa w całości poprowadzona wydzielonymi, płaskimi ścieżkami rowerowymi (Fietspad), z dala od samochodów." 
            : "Safe, separated asphalt bike lanes with zero elevation strain and e-bike charging stations.",
          tips: pl 
            ? "W Holandii i Europie rower ma zawsze pierwszeństwo na ścieżkach. Korzystaj z darmowych parkingów rowerowych!" 
            : "Bicycles have dedicated right-of-way on Dutch fietspads.",
          steps: [
            {
              time: time,
              action: pl ? `Wyruszenie rowerem z: ${start}` : `Depart by bike from: ${start}`,
              icon: MapPin,
              detail: pl ? 'Wjazd na oświetloną, gładką ścieżkę rowerową.' : 'Direct access onto paved bike path.'
            },
            {
              time: addMinutesToTime(time, 12),
              action: pl ? "Przejazd przez park & stacja serwisowa (Pompka/E-Bike)" : "Scenic park ride & public bike pump station",
              icon: Bike,
              cost: "0.00 zł / €0",
              detail: pl ? 'Cieniste aleje, bezpłatna pompka rowerowa i ławeczki do odpoczynku.' : 'Tree canopy, free air pump and quiet park benches.'
            },
            {
              time: addMinutesToTime(time, 22),
              action: pl ? "Strzeżony bezpłatny parking rowerowy" : "Free guarded bicycle parking hub",
              icon: Info,
              cost: "Gratis",
              detail: pl ? 'Automatyczne stojaki rowerowe i monitoring miejski.' : 'Secured municipal bike racks.'
            },
            {
              time: addMinutesToTime(time, 25),
              action: pl ? `Przybycie do: ${dest}` : `Arrival at: ${dest}`,
              icon: Navigation,
              detail: pl ? '1 minuta spaceru od parkingu do głównych drzwi wejściowych.' : '1-minute walk from bike racks to main entrance.'
            }
          ]
        };

      case 'walk':
        return {
          title: pl ? "Pieszo / Spacer (Zielone Deptaki i Bulwary 🚶)" : nl ? "Te Voet (Wandelboulevards 🚶)" : "Walking / Stroll (Pedestrian Promenades 🚶)",
          badge: pl ? "Zdrowy Relaks 🌸" : "Healthy Stroll 🌸",
          durationMins: 30,
          totalPrice: 0.00,
          comfortScore: "9.9/10",
          desc: pl 
            ? "Relaksujący spacer malowniczymi deptakami, parkami i bulwarami bez schodów, z ławeczkami co kilkadziesiąt metrów." 
            : "Peaceful walking route through pedestrian streets, flat parks and zero stair obstacles.",
          tips: pl 
            ? "Trasa ma całkowicie płaski profil. Na trasie znajdują się bezpłatne miejskie punkty z wodą pitną." 
            : "100% flat walkway with free drinking water fountains on the way.",
          steps: [
            {
              time: time,
              action: pl ? `Początek spaceru: ${start}` : `Start walking from: ${start}`,
              icon: MapPin,
              detail: pl ? 'Równa nawierzchnia z płyt chodnikowych bez krawężników.' : 'Smooth pavement without high curbs.'
            },
            {
              time: addMinutesToTime(time, 12),
              action: pl ? "Aleja parkowa z ławeczkami w cieniu drzew" : "Tree-shaded park alley with rest benches",
              icon: Footprints,
              detail: pl ? 'Możliwość krótkiego odpoczynku, śpiew ptaków, czysta toaleta.' : 'Rest benches every 100 meters, clean public WC.'
            },
            {
              time: addMinutesToTime(time, 24),
              action: pl ? "Zabytkowy deptak & fontanna miejska" : "Historic pedestrian square & fountain",
              icon: Sparkles,
              detail: pl ? 'Strefa całkowicie wyłączona z ruchu pojazdów kołowych.' : 'Pedestrianized historic zone.'
            },
            {
              time: addMinutesToTime(time, 30),
              action: pl ? `Bezpośrednie wejście do: ${dest}` : `Direct arrival at: ${dest}`,
              icon: Navigation,
              detail: pl ? 'Wejście z poziomu zero, automatyczne drzwi przesuwne.' : 'Ground-level automatic sliding doors.'
            }
          ]
        };
    }
  };

  const currentOption = getTravelModeDetails(selectedTransportMode);
  const totalDuration = currentOption.durationMins;
  const estimatedArrival = addMinutesToTime(departureTime, totalDuration);
  const recommendedReturnTime = addMinutesToTime(departureTime, 240);

  const handleExecuteSearch = async () => {
    if (!startStreet.trim() && !destPlace.trim()) {
      setInputError(pl ? 'Wpisz proszę punkt startowy lub miejsce docelowe podróży.' : 'Please enter origin or destination.');
      return;
    }

    setInputError(null);
    setIsSearchingAnimation(true);

    try {
      const planned = await planTransitRoute({
        origin: startStreet.trim() || (pl ? 'Moja bieżąca lokalizacja GPS' : 'Current GPS Location'),
        destination: destPlace.trim() || (pl ? 'Poznań Główny' : 'Poznan Glowny'),
        departureDate,
        departureTime,
        transportMode: selectedTransportMode,
        needElevators,
        avoidStairs,
        needRestroom,
        needPrioritySeats,
        language
      });
      setCurrentItinerary(planned);
      setIsTripSearched(true);
      setTimeout(() => {
        const resultsEl = document.getElementById('calculated-route-results-hub');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Error planning transit route:', err);
    } finally {
      setIsSearchingAnimation(false);
    }
  };

  const handleStartNewSearch = () => {
    setIsTripSearched(false);
    setCurrentItinerary(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwapPlaces = () => {
    const temp = startStreet;
    setStartStreet(destPlace);
    setDestPlace(temp);
    setInputError(null);
  };

  // Quick departure time helpers
  const setQuickTimeNow = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setDepartureTime(`${hh}:${mm}`);
  };

  const setQuickTimePlus15 = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const t = addMinutesToTime(`${hh}:${mm}`, 15);
    setDepartureTime(t);
  };

  const setQuickTimePlus30 = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const t = addMinutesToTime(`${hh}:${mm}`, 30);
    setDepartureTime(t);
  };

  // Granular transport modes including Train, Tram, Bus, Integrated Transit, Car, Bike, Walk, Motorcycle
  const transportModes = [
    {
      id: 'train' as const,
      title: pl ? 'Pociąg (Kolej)' : nl ? 'Trein' : 'Train (Rail)',
      subtitle: pl ? 'Intercity, ICE, koleje regionalne & perony' : 'High-speed & regional trains',
      icon: Train,
      emoji: '🚆',
      tag: pl ? 'Szybka Kolej' : 'Railway',
      badgeColor: 'indigo'
    },
    {
      id: 'tram' as const,
      title: pl ? 'Tramwaj' : nl ? 'Tram' : 'Tram / Streetcar',
      subtitle: pl ? 'Niskopodłogowe linie miejskie, zero barier' : 'Low-floor city tramways',
      icon: TrainTrack,
      emoji: '🚋',
      tag: pl ? '100% Niska Podłoga' : 'Level Boarding',
      badgeColor: 'emerald'
    },
    {
      id: 'bus' as const,
      title: pl ? 'Autobus' : nl ? 'Bus' : 'Bus',
      subtitle: pl ? 'Linie miejskie, przyklęk & regionalne' : 'City & regional coaches',
      icon: Bus,
      emoji: '🚌',
      tag: pl ? 'Bezpośrednie linie' : 'Direct Lines',
      badgeColor: 'amber'
    },
    {
      id: 'public' as const,
      title: pl ? 'Zintegrowana' : nl ? 'Alles Gecombineerd' : 'All Public Transit',
      subtitle: pl ? 'Optymalne: Pociąg + Tramwaj + Autobus' : 'Train, Tram & Bus unified',
      icon: Route,
      emoji: '🚆🚋🚌',
      tag: pl ? 'Rekomendowane' : 'Recommended',
      badgeColor: 'teal'
    },
    {
      id: 'car' as const,
      title: pl ? 'Samochód' : nl ? 'Auto' : 'Car',
      subtitle: pl ? 'Parking P+R, bez korków & postoje' : 'P+R Parking & highway',
      icon: Car,
      emoji: '🚗',
      tag: pl ? 'Wygodne' : 'Comfortable',
      badgeColor: 'blue'
    },
    {
      id: 'bicycle' as const,
      title: pl ? 'Rower / E-Bike' : nl ? 'Fiets / E-Bike' : 'Bicycle / E-Bike',
      subtitle: pl ? 'Wydzielone ścieżki rowerowe & Fietspad' : 'Flat dedicated bike paths',
      icon: Bike,
      emoji: '🚲',
      tag: pl ? '100% Eko' : 'Eco Friendly',
      badgeColor: 'green'
    },
    {
      id: 'walk' as const,
      title: pl ? 'Pieszo / Spacer' : nl ? 'Te Voet' : 'Walking / Stroll',
      subtitle: pl ? 'Szerokie deptaki, parki, bez schodów' : 'Flat parks & promenades',
      icon: Footprints,
      emoji: '🚶‍♂️',
      tag: pl ? 'Zdrowy ruch' : 'Relaxing',
      badgeColor: 'purple'
    },
    {
      id: 'motorcycle' as const,
      title: pl ? 'Motocykl' : nl ? 'Motor' : 'Motorcycle',
      subtitle: pl ? 'Trasa widokowa i postoje jednośladów' : 'Scenic road & parking',
      icon: Zap,
      emoji: '🏍️',
      tag: pl ? 'Płynna jazda' : 'Breezy',
      badgeColor: 'orange'
    }
  ];

  // Thematic Destination Quick Suggestions
  const attractionSuggestions = [
    { name: pl ? 'Stary Rynek i Ratusz w Poznaniu' : 'Old Market Square Poznań', country: 'PL', type: 'Zabytki 🏛️', desc: pl ? 'Koziołki poznańskie, kawiarnie' : 'Historic square' },
    { name: pl ? 'Ostrów Tumski i Katedra' : 'Cathedral Island', country: 'PL', type: 'Kultura ⛪', desc: pl ? 'Kolebka państwa, most Jordana' : 'Historic cathedral' },
    { name: pl ? 'Park Cytadela & Muzeum Uzbrojenia' : 'Citadel Park', country: 'PL', type: 'Park 🌳', desc: pl ? 'Spokojne aleje, rzeźby Abakanowicz' : 'Huge peaceful park' },
    { name: pl ? 'Jezioro Maltańskie & Termy Maltańskie' : 'Lake Malta', country: 'PL', type: 'Relaks 🏊', desc: pl ? 'Kolejka Maltanka, spacer bulwarem' : 'Lakeside walk' },
    { name: pl ? 'Binnenhof & Mauritshuis, Haga' : 'Mauritshuis, The Hague', country: 'NL', type: 'Sztuka 🎨', desc: pl ? 'Dziewczyna z perłą, królewskie alejki' : 'Art museum' },
    { name: pl ? 'Ogród Botaniczny Keukenhof' : 'Keukenhof Gardens', country: 'NL', type: 'Natura 🌷', desc: pl ? 'Słynne ogrody tulipanowe' : 'Tulip paradise' }
  ];

  const stationSuggestions = [
    { name: pl ? 'Poznań Główny (Dworzec PKP & ZTM)' : 'Poznan Main Station', country: 'PL', type: 'Dworzec Kolejowy 🚆', desc: pl ? 'Windy, kasy biletowe, WARS, perony 1-6' : 'Main rail hub' },
    { name: pl ? 'Dworzec Roosendaal (Stacja Węzłowa NS)' : 'Roosendaal Station', country: 'NL', type: 'Węzeł NS / NMBS 🚆', desc: pl ? 'Połączenia do Amsterdamu, Antwerpii i Brukseli' : 'Cross-border hub' },
    { name: pl ? 'Berlin Hauptbahnhof (Główny Dworzec)' : 'Berlin Hbf', country: 'DE', type: 'Superhub DB 🚆', desc: pl ? 'Ekspresy ICE, Berlin-Warszawa Express' : 'Central rail hub' },
    { name: pl ? 'Rondo Kaponiera (Węzeł Tramwajowy)' : 'Rondo Kaponiera Tram Hub', country: 'PL', type: 'Tramwaje MPK 🚋', desc: pl ? 'Poziom -2 szybki tramwaj PST, windy' : 'Central tram junction' },
    { name: pl ? 'Dworzec Autobusowy Poznań (PKS / FlixBus)' : 'Poznan Bus Terminal', country: 'PL', type: 'Autobusy 🚌', desc: pl ? 'Zadaszone stanowiska, kasy biletowe' : 'Intercity bus station' },
    { name: pl ? 'Amsterdam Centraal' : 'Amsterdam Centraal', country: 'NL', type: 'Kolej & Metro 🚆🚇', desc: pl ? 'Pociągi Eurostar, NS, promy miejskie' : 'Historic central terminal' }
  ];

  const romanticSuggestions = [
    { name: pl ? 'Uroczy Ogród Botaniczny w Poznaniu' : 'Poznań Botanical Garden', country: 'PL', type: 'Romantyczne 💖', desc: pl ? 'Cieniste ławeczki, zapach kwiatów' : 'Romantic alleys' },
    { name: pl ? 'Klimatyczne Kanały w Utrechcie' : 'Oudegracht Canals Utrecht', country: 'NL', type: 'Urokliwe 🍷', desc: pl ? 'Nastrojowe tarasy nad samą wodą' : 'Canal-side dining' },
    { name: pl ? 'Zamek w Kórniku i Arboretum' : 'Kornik Castle', country: 'PL', type: 'Historia 🏰', desc: pl ? 'Zabytkowy pałac z jeziorem' : 'Castle & lake' }
  ];

  const kidsSuggestions = [
    { name: pl ? 'Nowe Zoo & Kolejka Wąskotorowa Maltanka' : 'New Zoo & Maltanka Train', country: 'PL', type: 'Dla Dzieci 🎠', desc: pl ? 'Słoniarnia, niska podłoga' : 'Zoo and kid train' },
    { name: pl ? 'Park Rozrywki Efteling' : 'Efteling Theme Park', country: 'NL', type: 'Bajkowy Świat 🧚', desc: pl ? 'Bajkowy las, płaskie alejki' : 'Fairy tale park' },
    { name: pl ? 'Palmiarnia Poznańska' : 'Poznań Palm House', country: 'PL', type: 'Egzotyka 🌴', desc: pl ? 'Egzotyczne ryby, papugi i rośliny' : 'Tropical garden' }
  ];

  return (
    <div className="relative rounded-3xl overflow-hidden p-3 sm:p-6 md:p-8 border border-white/10 shadow-2xl space-y-6 sm:space-y-8" id="tadzik-trip-planner-workspace">
      {/* ========================================================= */}
      {/* 🌄 PONADCZASOWE, ARTYSTYCZNE TŁO PODRÓŻY                   */}
      {/* ========================================================= */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Curated high-resolution European architectural & rail twilight backdrop */}
        <img
          src="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=1920&auto=format&fit=crop&q=85"
          alt="Timeless European travel landscape"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter saturate-[1.2] brightness-[0.75] scale-105"
        />
        {/* Modern dark luxury gradients & frosted ambient lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/85 to-slate-950/98 backdrop-blur-[3px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px]" />
        {/* Luminous glow nodes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>
      
      {/* ========================================================= */}
      {/* 🧭 PONADCZASOWY NAGŁÓWEK HERO BANNER                      */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-2xl text-white p-6 sm:p-8 md:p-10 border border-white/12 shadow-2xl">
        {/* Modern ambient lighting accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-xs">
                <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                <span>{pl ? 'Nowoczesny Planer Podróży 🧭' : 'Modern Trip Planner 🧭'}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 bg-amber-400/15 text-amber-300 border border-amber-400/30 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{pl ? 'Pociągi • Tramwaje • Autobusy' : 'Trains • Trams • Buses'}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
                <Accessibility className="w-3.5 h-3.5 text-indigo-300" />
                <span>{pl ? '100% Bez Barier ♿' : 'Barrier-Free ♿'}</span>
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {pl ? 'Dokąd chcesz wyruszyć?' : nl ? 'Waar wil je naartoe reizen?' : 'Where would you like to travel?'}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm md:text-base font-normal leading-relaxed">
              {pl 
                ? 'Wybierz czym chcesz jechać (pociąg, tramwaj, autobus, auto, rower lub pieszo) i wpisz punkty podróży. Tadzik zaplanuje idealne połączenie z uwzględnieniem czasu, peronów i wygody.'
                : 'Select your preferred transport (train, tram, bus, car, bike or walk) and enter journey points. Tadzik calculates optimal routes with step-free guidance and platform details.'}
            </p>
          </div>

          {/* Assistant status & control */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-center space-y-1 shadow-inner">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                {pl ? 'STATUS PLANERA' : 'PLANNER STATUS'}
              </span>
              <span className="text-sm font-black text-white flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{isTripSearched ? (pl ? 'Trasa wyznaczona' : 'Route ready') : (pl ? 'Gotowy do wyznaczenia trasy' : 'Ready to plan')}</span>
              </span>
            </div>

            {isTripSearched && (
              <button
                type="button"
                onClick={handleStartNewSearch}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-102 active:scale-98 shadow-lg shadow-amber-400/20"
              >
                <Edit3 className="w-4 h-4" />
                <span>{pl ? 'Zmień punkty trasy' : 'Modify route'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 🚀 GŁÓWNY MODUŁ PLANOWANIA TRASY                           */}
      {/* ========================================================= */}
      <div 
        className="bg-slate-950/85 backdrop-blur-2xl rounded-3xl border border-white/12 shadow-2xl overflow-hidden text-white"
        id="tadzik-search-modal-box"
      >
        {/* Express Navigation Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
              <Route className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-md">
                  {pl ? 'INTELIGENTNY PLANER' : 'SMART PLANNER'}
                </span>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">•</span>
                <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                  {pl ? 'Wybierz środek transportu i wprowadź punkty' : 'Select vehicle & route'}
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                {pl ? 'Skonfiguruj swoją podróż:' : 'Configure Your Journey:'}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Swap Origin/Destination */}
            <button
              type="button"
              onClick={handleSwapPlaces}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
              title={pl ? 'Zamień Skąd i Dokąd miejscami' : 'Swap Origin and Destination'}
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-300" />
              <span>{pl ? 'Zamień A ⇄ B' : 'Swap A ⇄ B'}</span>
            </button>

            {/* Senior Accessibility Filter Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
                showAdvancedSettings 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black' 
                  : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
              }`}
            >
              <SlidersHorizontal className={`w-3.5 h-3.5 ${showAdvancedSettings ? 'text-slate-950' : 'text-emerald-400'}`} />
              <span>{pl ? 'Udogodnienia' : 'Accessibility'}</span>
              {showAdvancedSettings && <span className="w-2 h-2 rounded-full bg-slate-950" />}
            </button>
          </div>
        </div>

        {/* Validation error notice */}
        {inputError && (
          <div className="m-5 sm:m-7 p-4 bg-rose-950/80 border border-rose-500/40 rounded-2xl flex items-center gap-3 text-rose-200 text-xs font-bold animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{inputError}</span>
          </div>
        )}

        <div className="p-5 sm:p-7 md:p-8 space-y-8">
          
          {/* ========================================================= */}
          {/* 1. SEKCJA: WYBÓR ŚRODKA TRANSPORTU (POCIĄGI/TRAMWAJE/ITP) */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-950" />
                <span>{pl ? '1. Czym chcesz jechać? (Wybierz środek transportu):' : '1. How do you want to travel? (Select transport):'}</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-0.5 rounded-full">
                {pl ? 'Pociągi • Tramwaje • Autobusy • Auto • Rower' : 'Trains • Trams • Buses • Car • Bike'}
              </span>
            </div>

            {/* Dedicated Modern Transport Mode Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
              {transportModes.map((mode) => {
                const isSelected = selectedTransportMode === mode.id;
                const ModeIcon = mode.icon;

                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedTransportMode(mode.id)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                      isSelected
                        ? 'bg-gradient-to-b from-indigo-900/90 to-slate-900/95 text-white border-emerald-400 shadow-xl scale-[1.02] ring-4 ring-emerald-500/25'
                        : 'bg-slate-900/60 hover:bg-slate-850/80 text-slate-200 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 bg-emerald-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                        ✓ Aktywny
                      </span>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-2xl sm:text-3xl">{mode.emoji}</span>
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        isSelected 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {mode.tag}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h5 className="font-black text-sm text-white leading-tight flex items-center gap-1.5">
                        <ModeIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span>{mode.title}</span>
                      </h5>
                      <p className={`text-[11px] font-medium leading-snug ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                        {mode.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick transit filter pills (when public/train/tram/bus is selected) */}
            {(selectedTransportMode === 'public' || selectedTransportMode === 'train' || selectedTransportMode === 'tram' || selectedTransportMode === 'bus') && (
              <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-indigo-200 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{pl ? 'Szybkie filtry pojazdów szynowych i miejskich:' : 'Quick vehicle filters:'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setSelectedTransportMode('train')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedTransportMode === 'train'
                        ? 'bg-indigo-500 text-white font-black shadow-sm'
                        : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    <span>🚆</span>
                    <span>{pl ? 'Tylko Pociągi' : 'Trains Only'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTransportMode('tram')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedTransportMode === 'tram'
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    <span>🚋</span>
                    <span>{pl ? 'Tylko Tramwaje' : 'Trams Only'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTransportMode('bus')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedTransportMode === 'bus'
                        ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <span>🚌</span>
                    <span>{pl ? 'Tylko Autobusy' : 'Buses Only'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTransportMode('public')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedTransportMode === 'public'
                        ? 'bg-teal-500 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-teal-400'
                    }`}
                  >
                    <span>🚆🚋🚌</span>
                    <span>{pl ? 'Zintegrowana (Wszystkie)' : 'All Transit'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* 2. SEKCJA: POLA SKĄD (PUNKT A) ORAZ DOKĄD (PUNKT B)        */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 ring-4 ring-indigo-950" />
                <span>{pl ? '2. Trasa podróży (Punkt A ➔ Punkt B):' : '2. Journey Route (Origin ➔ Destination):'}</span>
              </label>
              <span className="text-[11px] font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                {pl ? 'Wpisz adres, miasto lub stację' : 'Type address, city or station'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* POINT A: ORIGIN */}
              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black">A</span>
                    <span>{pl ? 'Punkt Startowy (Skąd wyruszasz):' : 'Origin (Start point):'}</span>
                  </span>
                  
                  {/* Live GPS Autocomplete Button */}
                  <button
                    type="button"
                    onClick={handleGetLiveGPSLocation}
                    disabled={isLocatingGps}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLocatingGps ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{pl ? 'Odczytuję GPS...' : 'Locating GPS...'}</span>
                      </>
                    ) : (
                      <>
                        <LocateFixed className="w-3.5 h-3.5" />
                        <span>{pl ? 'Moja lokalizacja GPS' : 'Use Current GPS'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={startStreet}
                    onChange={(e) => {
                      setStartStreet(e.target.value);
                      setInputError(null);
                      setGpsSuccessNotice(null);
                    }}
                    placeholder={pl ? 'np. Roosendaal / Poznań / Twój adres domowy' : 'e.g. Roosendaal / Poznan / Your address'}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-2xl text-white font-bold text-sm sm:text-base placeholder-slate-500 transition-all outline-hidden"
                  />
                </div>

                {gpsSuccessNotice && (
                  <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{gpsSuccessNotice}</span>
                  </p>
                )}
              </div>

              {/* POINT B: DESTINATION */}
              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black">B</span>
                    <span>{pl ? 'Cel Podróży (Dokąd jedziesz):' : 'Destination (Where to):'}</span>
                  </span>
                  
                  <span className="text-[11px] text-slate-400">
                    {pl ? 'Atrakcja, miasto lub dworzec' : 'Attraction, city or hub'}
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={destPlace}
                    onChange={(e) => {
                      setDestPlace(e.target.value);
                      setInputError(null);
                    }}
                    placeholder={pl ? 'np. Stary Rynek Poznań / Amsterdam / Keukenhof' : 'e.g. Old Market Square / Amsterdam'}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-2xl text-white font-bold text-sm sm:text-base placeholder-slate-500 transition-all outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Quick Destination Ideas Categorized (Attractions, Stations, Romantic, Kids) */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{pl ? 'Szybkie podpowiedzi celów:' : 'Quick destination ideas:'}</span>
                </span>

                <button
                  type="button"
                  onClick={() => setActiveSuggestionCategory(activeSuggestionCategory === 'stations' ? null : 'stations')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeSuggestionCategory === 'stations'
                      ? 'bg-indigo-500 text-white font-black'
                      : 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  <span>🚆</span>
                  <span>{pl ? 'Dworce & Węzły Kolejowe' : 'Stations & Hubs'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSuggestionCategory(activeSuggestionCategory === 'attractions' ? null : 'attractions')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeSuggestionCategory === 'attractions'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  <span>🏛️</span>
                  <span>{pl ? 'Zabytki & Atrakcje' : 'Top Attractions'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSuggestionCategory(activeSuggestionCategory === 'romantic' ? null : 'romantic')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeSuggestionCategory === 'romantic'
                      ? 'bg-rose-500 text-white font-black'
                      : 'bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  <span>💖</span>
                  <span>{pl ? 'Parki & Romantyczne' : 'Parks & Romantic'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSuggestionCategory(activeSuggestionCategory === 'kids' ? null : 'kids')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeSuggestionCategory === 'kids'
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/30'
                  }`}
                >
                  <span>🎠</span>
                  <span>{pl ? 'Dla Dzieci & Rodzin' : 'Kids & Family'}</span>
                </button>
              </div>

              {/* Suggestions Grid Dropdown */}
              <AnimatePresence>
                {activeSuggestionCategory && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-3.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 shadow-xl"
                  >
                    {(activeSuggestionCategory === 'stations' ? stationSuggestions :
                      activeSuggestionCategory === 'attractions' ? attractionSuggestions :
                      activeSuggestionCategory === 'romantic' ? romanticSuggestions : kidsSuggestions
                    ).map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setDestPlace(item.name);
                          setInputError(null);
                        }}
                        className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-emerald-400/60 text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md">
                            {item.type}
                          </span>
                          <span className="text-xs">{item.country === 'PL' ? '🇵🇱' : item.country === 'NL' ? '🇳🇱' : '🇩🇪'}</span>
                        </div>
                        <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. SEKCJA: DATA I GODZINA WYRUSZENIA                      */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-950" />
                <span>{pl ? '3. Kiedy wyruszasz w drogę?' : '3. When are you leaving?'}</span>
              </label>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                {formatDisplayDate(departureDate)} • ⏰ {departureTime}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date Input with Quick Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>{pl ? 'Data odjazdu:' : 'Departure date:'}</span>
                </span>

                <div className="flex gap-2">
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 focus:border-indigo-400 rounded-2xl text-white font-bold text-sm outline-hidden cursor-pointer"
                  />
                </div>

                {/* Quick Date Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={() => setDepartureDate(getTodayDateString())}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      departureDate === getTodayDateString()
                        ? 'bg-indigo-500 text-white font-black'
                        : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {pl ? '📅 Dzisiaj' : 'Today'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDepartureDate(getTomorrowDateString())}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      departureDate === getTomorrowDateString()
                        ? 'bg-indigo-500 text-white font-black'
                        : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {pl ? '🌅 Jutro' : 'Tomorrow'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDepartureDate(getWeekendSaturdayDateString())}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      departureDate === getWeekendSaturdayDateString()
                        ? 'bg-indigo-500 text-white font-black'
                        : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {pl ? '🏖️ Najbliższy weekend' : 'Weekend'}
                  </button>
                </div>
              </div>

              {/* Time Input with Quick Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{pl ? 'Godzina odjazdu:' : 'Departure time:'}</span>
                </span>

                <div className="flex gap-2">
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 focus:border-emerald-400 rounded-2xl text-white font-bold text-sm outline-hidden cursor-pointer"
                  />
                </div>

                {/* Quick Time Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={setQuickTimeNow}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 transition-all cursor-pointer"
                  >
                    {pl ? '⚡ Teraz' : 'Now'}
                  </button>

                  <button
                    type="button"
                    onClick={setQuickTimePlus15}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500 transition-all cursor-pointer"
                  >
                    +15 min
                  </button>

                  <button
                    type="button"
                    onClick={setQuickTimePlus30}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500 transition-all cursor-pointer"
                  >
                    +30 min
                  </button>

                  <button
                    type="button"
                    onClick={() => setDepartureTime('09:00')}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500 transition-all cursor-pointer"
                  >
                    09:00
                  </button>

                  <button
                    type="button"
                    onClick={() => setDepartureTime('12:00')}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500 transition-all cursor-pointer"
                  >
                    12:00
                  </button>

                  <button
                    type="button"
                    onClick={() => setDepartureTime('15:00')}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500 transition-all cursor-pointer"
                  >
                    15:00
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. ROZWIJANE FILTRY BEZPIECZEŃSTWA I DOSTĘPNOŚCI          */}
          {/* ========================================================= */}
          {showAdvancedSettings && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-5 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-300 uppercase tracking-wider text-xs flex items-center gap-2">
                  <Accessibility className="w-4 h-4 text-emerald-400" />
                  <span>{pl ? 'Udogodnienia Bez Barier i Bezpieczeństwo Seniora:' : 'Senior Accessibility & Comfort:'}</span>
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {pl ? 'Aktywne algorytmy bez barier' : 'Active Safe Routing'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <label className="flex items-center gap-3 p-3 bg-slate-900/80 border border-emerald-500/20 rounded-xl cursor-pointer hover:bg-slate-900">
                  <input
                    type="checkbox"
                    checked={avoidStairs}
                    onChange={(e) => setAvoidStairs(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-800 border-slate-700"
                  />
                  <span className="font-bold text-slate-200">{pl ? 'Unikaj schodów (pochylnie/rampy)' : 'Avoid stairs (ramps only)'}</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-900/80 border border-emerald-500/20 rounded-xl cursor-pointer hover:bg-slate-900">
                  <input
                    type="checkbox"
                    checked={needElevators}
                    onChange={(e) => setNeedElevators(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-800 border-slate-700"
                  />
                  <span className="font-bold text-slate-200">{pl ? 'Tylko stacje z windami peronowymi' : 'Elevators required'}</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-900/80 border border-emerald-500/20 rounded-xl cursor-pointer hover:bg-slate-900">
                  <input
                    type="checkbox"
                    checked={needRestroom}
                    onChange={(e) => setNeedRestroom(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-800 border-slate-700"
                  />
                  <span className="font-bold text-slate-200">{pl ? 'Toalety bez barier na trasie' : 'Accessible restrooms'}</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-900/80 border border-emerald-500/20 rounded-xl cursor-pointer hover:bg-slate-900">
                  <input
                    type="checkbox"
                    checked={needPrioritySeats}
                    onChange={(e) => setNeedPrioritySeats(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-800 border-slate-700"
                  />
                  <span className="font-bold text-slate-200">{pl ? 'Miejsca siedzące z pierwszeństwem' : 'Priority seating'}</span>
                </label>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 5. GŁÓWNY PRZYCISK WYZNACZANIA TRASY                       */}
          {/* ========================================================= */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleExecuteSearch}
              disabled={isSearchingAnimation}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:via-teal-300 hover:to-emerald-400 text-slate-950 font-black text-base sm:text-lg md:text-xl py-4 sm:py-5 px-6 rounded-2xl shadow-xl shadow-emerald-500/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              {/* Shimmer light pass animation */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

              {isSearchingAnimation ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-slate-950" />
                  <span>{pl ? 'Tadzik planuje optymalną trasę...' : 'Calculating optimal route...'}</span>
                </>
              ) : (
                <>
                  <Search className="w-6 h-6 text-slate-950 stroke-[2.5]" />
                  <span>
                    {pl 
                      ? `Zaplanuj Podróż: ${currentOption.title.split(' ')[0]} ➔` 
                      : `Calculate Route: ${currentOption.title.split(' ')[0]} ➔`}
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 🎯 WYNIKI WYSZUKIWANIA I SZCZEGÓŁOWY PLAN TRASY            */}
      {/* ========================================================= */}
      {isTripSearched && currentItinerary && (
        <TransitRouteResultView
          itinerary={currentItinerary}
          language={language}
          departureDate={departureDate}
          departureTime={departureTime}
          selectedTransportMode={selectedTransportMode}
          onStartNewSearch={handleStartNewSearch}
          formatDisplayDate={formatDisplayDate}
        />
      )}

      {/* ========================================================= */}
      {/* 🗺️ INTERAKTYWNA MAPA I PROFIL TRASY (PODGLĄD DOMYŚLNY)      */}
      {/* ========================================================= */}
      {!isTripSearched && (
        <div className="bg-slate-950/85 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-white/10 text-white space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  {currentOption.badge}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  {formatDisplayDate(departureDate)} • {departureTime}
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentOption.title}
              </h4>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-700/80">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{pl ? 'Czas trasy' : 'Est. Time'}</span>
                <strong className="text-emerald-400 text-sm font-black font-mono">⏱️ ~{totalDuration} min</strong>
              </div>
              <div className="w-px h-7 bg-slate-700" />
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{pl ? 'Przybycie' : 'Arrival'}</span>
                <strong className="text-white text-sm font-black font-mono">⏰ {estimatedArrival}</strong>
              </div>
            </div>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {currentOption.desc}
          </p>

          {/* Step-by-Step Preview Timeline */}
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Route className="w-4 h-4 text-emerald-400" />
              <span>{pl ? 'Etapy podróży krok po kroku:' : 'Step-by-step preview:'}</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {currentOption.steps.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        ⏰ {step.time}
                      </span>
                      <div className="w-7 h-7 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
                        <StepIcon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h6 className="text-xs font-black text-white leading-snug">
                        {step.action}
                      </h6>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {step.detail}
                      </p>
                    </div>

                    {'cost' in step && (
                      <span className="text-[10px] font-bold text-amber-300 pt-1 block">
                        💰 {(step as any).cost}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Helpful Senior Tips Card */}
          <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <p className="text-xs text-indigo-200 font-medium">
              <strong className="text-white block font-bold">{pl ? 'Wskazówka Tadzika:' : 'Tadzik Tip:'}</strong>
              {currentOption.tips}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default TadzikTripPlanner;
