/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserAccount, Language } from '../types';
import { SectionTravelCompanion } from './AnimatedTravelVehicle';
import { 
  Building2, 
  Search, 
  MapPin, 
  Star, 
  ExternalLink, 
  Wifi, 
  Coffee, 
  Sparkles, 
  Check, 
  Compass, 
  Clock, 
  ShieldCheck,
  Heart
} from 'lucide-react';

interface HotelSearchTabProps {
  language: Language;
  account: UserAccount | null;
}

interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  stars: number;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  currency: string;
  image: string;
  address: string;
  distanceToCenter: string;
  distanceToStation: string;
  seniorAmenities: string[];
  description: Record<string, string>;
  bookingUrl: string;
}

const FEATURED_HOTELS: Hotel[] = [
  // ROTTERDAM
  {
    id: 'hotel-ny-rotterdam',
    name: 'Hotel New York Rotterdam',
    city: 'Rotterdam',
    country: 'Holandia',
    stars: 4,
    rating: 9.1,
    reviewsCount: 1420,
    pricePerNight: 120,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
    address: 'Koninginnenhoofd 1, 3072 AD Rotterdam',
    distanceToCenter: '1.2 km od centrum',
    distanceToStation: '800 m od stacji metra Wilhelminaplein',
    seniorAmenities: ['🛗 Winda', '🍳 Wyśmienite śniadanie', '🔇 Ciche pokoje', '🚲 Przechowalnia rowerów', '♿ Pełna dostępność'],
    description: {
      pl: 'Ikoniczny hotel w dawnej siedzibie Holland America Line. Piękny widok na rzekę Moza, cicha atmosfera i bezpłatna windy dla gości.',
      nl: 'Historisch hotel in het voormalige hoofdkantoor van de Holland America Line. Prachtig uitzicht op de Maas en uitstekende voorzieningen.',
      en: 'Iconic hotel in the former Holland America Line headquarters. Panoramic river views, spacious quiet rooms, and historic charm.'
    },
    bookingUrl: 'https://www.google.com/travel/hotels/Rotterdam?q=Hotel+New+York+Rotterdam'
  },
  {
    id: 'suite-hotel-rotterdam',
    name: 'ss Rotterdam (Hotel na Statku)',
    city: 'Rotterdam',
    country: 'Holandia',
    stars: 4,
    rating: 8.8,
    reviewsCount: 2100,
    pricePerNight: 95,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80',
    address: '3e Katendrechtsehoofd 25, Rotterdam',
    distanceToCenter: '2.5 km od centrum',
    distanceToStation: 'Przystanek autobusowy tuż przy trapie',
    seniorAmenities: ['🛗 Winda na wszystkie pokłady', '🍳 Śniadanie w restauracji rejsowej', '🅿️ Duży parking', '⚓ Unikalne doświadczenie'],
    description: {
      pl: 'Luksusowy liniowiec pasażerski z lat 50. przekształcony w hotel. Pokoje urządzone w stylu retro z nowoczesnymi udogodnieniami.',
      nl: 'Luxe voormalig cruiseschip omgevormd tot een uniek hotel met prachtig uitzicht over de haven.',
      en: 'Former flagship of Holland America Line turned into a unique floating hotel with vintage charm.'
    },
    bookingUrl: 'https://www.google.com/travel/hotels/Rotterdam?q=ss+Rotterdam+hotel'
  },
  // AMSTERDAM
  {
    id: 'grand-krasnapolsky-ams',
    name: 'Anantara Grand Hotel Krasnapolsky',
    city: 'Amsterdam',
    country: 'Holandia',
    stars: 5,
    rating: 9.2,
    reviewsCount: 3200,
    pricePerNight: 210,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80',
    address: 'Dam 9, 1012 JS Amsterdam',
    distanceToCenter: 'W samym centrum (Plac Dam)',
    distanceToStation: '600 m od Amsterdam Centraal',
    seniorAmenities: ['🛗 Winda', '🍳 Śniadanie w XIX-wiecznym ogrodzie zimowym', '🚆 Blisko tramwaju i stacji', '🔇 Wyciszone okna'],
    description: {
      pl: 'Luksusowy hotel przy placu Dam. Słynie z historycznego ogrodu zimowego, w którym serwowane jest wykwintne śniadanie.',
      nl: 'Luxe vijfsterrenhotel direct aan de Dam met een prachtige historische wintertuin.',
      en: 'Historic 5-star hotel right on Dam Square with an iconic winter garden breakfast room.'
    },
    bookingUrl: 'https://www.google.com/travel/hotels/Amsterdam?q=Grand+Hotel+Krasnapolsky+Amsterdam'
  },
  {
    id: 'eden-hotel-amsterdam',
    name: 'Eden Hotel Amsterdam',
    city: 'Amsterdam',
    country: 'Holandia',
    stars: 4,
    rating: 8.7,
    reviewsCount: 1850,
    pricePerNight: 135,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80',
    address: 'Amstel 144, 1017 AE Amsterdam',
    distanceToCenter: '400 m od Rembrandtplein',
    distanceToStation: 'Przystanek tramwajowy 100 m',
    seniorAmenities: ['🛗 Winda', '☕ Czajnik w pokoju', '🚲 Wynajem rowerów miejskich', '🌊 Widok na rzekę Amstel'],
    description: {
      pl: 'Hotel nad brzegiem rzeki Amstel. Idealny dla seniorów i rodzin pragnących spacerować wzdłuż malowniczych kanałów.',
      nl: 'Charmant hotel aan de Amstel, op loopafstand van musea en historische bruggen.',
      en: 'Charming riverside hotel near Rembrandtplein with quiet scenic canal views.'
    },
    bookingUrl: 'https://www.google.com/travel/hotels/Amsterdam?q=Eden+Hotel+Amsterdam'
  },
  // KRAKÓW
  {
    id: 'hotel-stary-krakow',
    name: 'Hotel Stary Kraków',
    city: 'Kraków',
    country: 'Polska',
    stars: 5,
    rating: 9.4,
    reviewsCount: 980,
    pricePerNight: 110,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80',
    address: 'ul. Szczepańska 5, 31-011 Kraków',
    distanceToCenter: '50 m od Rynku Głównym',
    distanceToStation: '900 m od Dworca Głównego',
    seniorAmenities: ['🛗 Winda', '🏊 Basen w średniowiecznych piwnicach', '🍳 Bogaty bufet śniadaniowy', '🏰 Widok na Stare Miasto'],
    description: {
      pl: 'Elegancki hotel w odrestaurowanej kamienicy z XIV wieku. Posiada basen w gotyckich podziemiach i taras z widokiem na Rynek.',
      nl: 'Sfeervol luxe hotel in de oude binnenstad van Krakau met een uniek zwembad in middeleeuwse kelders.',
      en: 'Boutique luxury hotel in Krakow Old Town featuring a subterranean medieval spa pool.'
    },
    bookingUrl: 'https://www.google.com/travel/hotels/Krakow?q=Hotel+Stary+Krakow'
  },
  // GDAŃSK / SOPOT
  {
    id: 'hotel-gdansk-boutique',
    name: 'Hotel Gdańsk Boutique',
    city: 'Gdańsk',
    country: 'Polska',
    stars: 4,
    rating: 9.0,
    reviewsCount: 1150,
    pricePerNight: 85,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
    address: 'ul. Szafarnia 9, 80-755 Gdańsk',
    distanceToCenter: '200 m od Żurawia i Mariny',
    distanceToStation: '1.2 km od Gdańsk Główny',
    seniorAmenities: ['🛗 Winda', '🍺 Własny browar restauracyjny', '⛵ Widok na Marinę Jachtową', '🍳 Śniadanie z lokalnymi rybami'],
    description: {
      pl: 'Zlokalizowany w zabytkowym spichlerzu z XVII wieku naprzeciwko gdańskiej Mariny. Niezwykły klimat i wyśmienita kuchnia.',
      nl: 'Uniek hotel in een 17e-eeuws pakhuis tegenover de jachthaven van Gdansk.',
      en: 'Boutique hotel in a restored 17th-century granary overlooking the Gdansk yacht marina.'
    },
    bookingUrl: 'https://www.google.com/travel/hotels/Gdansk?q=Hotel+Gdansk+Boutique'
  },
  // BRUSSELS
  {
    id: 'hotel-amigo-brussels',
    name: 'Rocco Forte Hotel Amigo',
    city: 'Brussels',
    country: 'Belgia',
    stars: 5,
    rating: 9.3,
    reviewsCount: 1600,
    pricePerNight: 190,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=80',
    address: 'Rue de l\'Amigo 1, 1000 Bruxelles',
    distanceToCenter: 'Tuż przy Grand Place (50 m)',
    distanceToStation: '400 m od Gare Centrale',
    seniorAmenities: ['🛗 Winda', '🍳 Belgijskie gofry na śniadanie', '🔇 Ciche luksusowe pokoje', '♿ Łatwy dostęp bez stopni'],
    description: {
      pl: 'Eskluzywny hotel położony parę kroków od rynkowego placu Grand Place w Brukseli. Przestronne pokoje i troskliwa obsługa.',
      nl: 'Luxe vijfsterrenhotel op steenworp afstand van de Grote Markt in Brussel.',
      en: 'Elegant luxury hotel moments from Brussels Grand Place with exceptional personalized service.'
    },
    bookingUrl: 'https://www.google.com/travel/hotels/Brussels?q=Hotel+Amigo+Brussels'
  },
  // PARIS
  {
    id: 'hotel-le-walt-paris',
    name: 'Hotel Le Walt Paris',
    city: 'Paris',
    country: 'Francja',
    stars: 4,
    rating: 9.0,
    reviewsCount: 1400,
    pricePerNight: 180,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    address: '37 Avenue de la Motte-Picquet, 75007 Paris',
    distanceToCenter: ' Blisko Wieży Eiffla (800 m)',
    distanceToStation: 'Stacja metra École Militaire tuż obok',
    seniorAmenities: ['🛗 Winda', '☕ Prywatny ogródek dziedzińca', '🥐 Świeże francuskie rogaliki', '🗼 Widok na Wieżę Eiffla'],
    description: {
      pl: 'Arystokratyczny hotel w 7. dzielnicy Paryża. Pokoje zdobione reprodukcjami klasycznych dzieł sztuki z Luwru.',
      nl: 'Stijlvol boetiekhotel nabij de Eiffeltoren met klassieke Franse kunstaccente.',
      en: 'Refined boutique hotel near the Eiffel Tower featuring classic Louvre artwork reproductions.'
    },
    bookingUrl: 'https://www.google.com/travel/hotels/Paris?q=Hotel+Le+Walt+Paris'
  }
];

export default function HotelSearchTab({ language, account }: HotelSearchTabProps) {
  const [citySearch, setCitySearch] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<number>(300);
  const [selectedStars, setSelectedStars] = useState<number>(0); // 0 = all
  const [elevatorOnly, setElevatorOnly] = useState<boolean>(true);
  const [breakfastOnly, setBreakfastOnly] = useState<boolean>(false);
  const [savedHotels, setSavedHotels] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nl_tourist_planner_saved_hotels');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const t: Record<Language, any> = {
    pl: {
      partner: 'Oficjalna Wyszukiwarka Hoteli',
      mainHeading: 'Wyszukuj Noclegi i Hotele bezpośrednio w Booking.com 🛌',
      mainSubheading: 'Wpisz miasto, termin podróży i liczbę osób. Nasza aplikacja natychmiast przekieruje Cię do zweryfikowanych noclegów na Booking.com z opcją bezpłatnego odwołania i śniadania!',
      liveWidgetTitle: 'Wyszukiwarka Noclegów Booking.com',
      liveWidgetDesc: 'Wypełnij formularz poniżej, aby natychmiast wyszukać wolne pokoje na Booking.com',
      priceGuarantee: '✔️ Gwarancja Najniższej Ceny Booking.com',
      whereTo: '📍 Dokąd jedziesz? (Wpisz Miasto)',
      cityPlaceholder: 'np. Rotterdam, Kraków, Amsterdam, Warszawa...',
      checkIn: '📅 Data Przyjazdu (Check-in)',
      checkOut: '📅 Data Wyjazdu (Check-out)',
      guests: '👥 Liczba Gości',
      guest1: '1 Dorosły (Podróż w pojedynkę)',
      guest2: '2 Dorosłych (Para / Seniorzy)',
      guest3: '3 Dorosłych / Rodzina',
      guest4: '4 Osoby (Rodzina z dziećmi)',
      elevator: 'Winda',
      breakfast: 'Śniadanie',
      freeCancel: 'Bezpłatne odwołanie',
      searchBooking: '🔍 Szukaj w Booking.com',
      typeCity: 'Wpisz Miasto',
      priceSlider: 'Rolka Ceny za Nocleg',
      upTo: 'do',
      perNight: '€ / noc',
      cheap: 'Tanie',
      luxury: 'Luksus',
      starsLabel: 'Standard Hotelu (Gwiazdki)',
      allStandards: '✨ Wszystkie standardy (3★, 4★, 5★)',
      stars3: '⭐ 3 Gwiazdki (Komfort & Dobra cena)',
      stars4: '⭐⭐ 4 Gwiazdki (Wyższy standard)',
      stars5: '👑 5 Gwiazdek (Luksus VIP)',
      seniorAmenities: 'Udogodnienia seniora:',
      filterElevator: '🛗 Winda i Bez barier',
      filterBreakfast: '🍳 Wyśmienite śniadanie',
      otherTownTitle: 'Nie widzisz swojego miasteczka?',
      otherTownDesc: 'Możesz wyszukać dowolny hotel na świecie jednym kliknięciem bezpośrednio w wyszukiwarce Booking.com.',
      openCustomSearch: 'Wyszukaj inne miasto na Booking.com',
      verifiedList: 'Lista zweryfikowanych hoteli polecanych przez Tadzika',
      bookOnBooking: 'Zarezerwuj na Booking.com',
      reviews: 'opinii'
    },
    nl: {
      partner: 'Officiële Hotelzoeker',
      mainHeading: 'Zoek en Boek Rechtstreeks via Booking.com 🛌',
      mainSubheading: 'Vul stad, reisdatum en aantal personen in voor directe geverifieerde zoekresultaten op Booking.com met gratis annulering!',
      liveWidgetTitle: 'Booking.com Accommodatiezoeker',
      liveWidgetDesc: 'Vul het formulier in om direct beschikbare kamers te vinden',
      priceGuarantee: '✔️ Laagsteprijsgarantie Booking.com',
      whereTo: '📍 Waar gaat de reis naartoe? (Stad)',
      cityPlaceholder: 'bijv. Rotterdam, Amsterdam, Utrecht...',
      checkIn: '📅 Incheckdatum',
      checkOut: '📅 Uitcheckdatum',
      guests: '👥 Aantal gasten',
      guest1: '1 Volwassene (Alleenreizend)',
      guest2: '2 Volwassenen (Koppel / Senioren)',
      guest3: '3 Volwassenen / Familie',
      guest4: '4 Personen (Familie met kinderen)',
      elevator: 'Lift',
      breakfast: 'Ontbijt',
      freeCancel: 'Gratis annuleren',
      searchBooking: '🔍 Zoeken op Booking.com',
      typeCity: 'Typ Stad',
      priceSlider: 'Prijsschuifbalk per nacht',
      upTo: 'tot',
      perNight: '€ / nacht',
      cheap: 'Voordelig',
      luxury: 'Luxe',
      starsLabel: 'Hotelklasse (Sterren)',
      allStandards: '✨ Alle categorieën (3★, 4★, 5★)',
      stars3: '⭐ 3 Sterren (Comfort & goede prijs)',
      stars4: '⭐⭐ 4 Sterren (Hogere standaard)',
      stars5: '👑 5 Sterren (VIP Luxe)',
      seniorAmenities: 'Seniorenvoorzieningen:',
      filterElevator: '🛗 Lift & Drempelvrij',
      filterBreakfast: '🍳 Uitstekend ontbijt',
      otherTownTitle: 'Staat uw specifieke stad er niet tussen?',
      otherTownDesc: 'U kunt met één klik elk hotel wereldwijd direct op Booking.com opzoeken.',
      openCustomSearch: 'Zoek andere stad op Booking.com',
      verifiedList: 'Geverifieerde aanbevolen hotels van Tadzik',
      bookOnBooking: 'Boek op Booking.com',
      reviews: 'beoordelingen'
    },
    en: {
      partner: 'Official Hotel Partner',
      mainHeading: 'Search and Book Accommodations directly via Booking.com 🛌',
      mainSubheading: 'Enter city, travel dates, and guests for instant verified results on Booking.com with free cancellation and breakfast options!',
      liveWidgetTitle: 'Booking.com Accommodation Search',
      liveWidgetDesc: 'Complete the form below to instantly find available rooms on Booking.com',
      priceGuarantee: '✔️ Booking.com Best Price Guarantee',
      whereTo: '📍 Where are you going? (Type City)',
      cityPlaceholder: 'e.g. Rotterdam, Krakow, Amsterdam, Paris...',
      checkIn: '📅 Check-in Date',
      checkOut: '📅 Check-out Date',
      guests: '👥 Guests',
      guest1: '1 Adult (Solo Traveler)',
      guest2: '2 Adults (Couple / Seniors)',
      guest3: '3 Adults / Family',
      guest4: '4 Guests (Family with kids)',
      elevator: 'Elevator',
      breakfast: 'Breakfast',
      freeCancel: 'Free Cancellation',
      searchBooking: '🔍 Search on Booking.com',
      typeCity: 'Type City',
      priceSlider: 'Price per Night Slider',
      upTo: 'up to',
      perNight: '€ / night',
      cheap: 'Budget',
      luxury: 'Luxury',
      starsLabel: 'Hotel Standard (Stars)',
      allStandards: '✨ All Categories (3★, 4★, 5★)',
      stars3: '⭐ 3 Stars (Comfort & Good Value)',
      stars4: '⭐⭐ 4 Stars (Superior Comfort)',
      stars5: '👑 5 Stars (VIP Luxury)',
      seniorAmenities: 'Senior Amenities:',
      filterElevator: '🛗 Elevator & Step-free',
      filterBreakfast: '🍳 Superb Breakfast',
      otherTownTitle: 'Looking for another specific destination?',
      otherTownDesc: 'You can search any hotel worldwide in one click directly on Booking.com.',
      openCustomSearch: 'Search other city on Booking.com',
      verifiedList: 'Verified Hotels Recommended by Tadzik',
      bookOnBooking: 'Book on Booking.com',
      reviews: 'reviews'
    },
    de: {
      partner: 'Offizieller Hotelpartner',
      mainHeading: 'Unterkünfte direkt auf Booking.com suchen und buchen 🛌',
      mainSubheading: 'Stadt, Reisedaten und Personenzahl eingeben für sofortige Suchergebnisse auf Booking.com mit kostenloser Stornierung!',
      liveWidgetTitle: 'Booking.com Hotelsuche',
      liveWidgetDesc: 'Formular ausfüllen, um freie Zimmer auf Booking.com zu finden',
      priceGuarantee: '✔️ Booking.com Bestpreisgarantie',
      whereTo: '📍 Wohin reisen Sie? (Stadt eingeben)',
      cityPlaceholder: 'z.B. Rotterdam, Berlin, Amsterdam, München...',
      checkIn: '📅 Anreisedatum (Check-in)',
      checkOut: '📅 Abreisedatum (Check-out)',
      guests: '👥 Anzahl Gäste',
      guest1: '1 Erwachsener (Alleinreisend)',
      guest2: '2 Erwachsene (Paar / Senioren)',
      guest3: '3 Erwachsene / Familie',
      guest4: '4 Personen (Familie mit Kindern)',
      elevator: 'Aufzug',
      breakfast: 'Frühstück',
      freeCancel: 'Kostenlose Stornierung',
      searchBooking: '🔍 Auf Booking.com suchen',
      typeCity: 'Stadt eingeben',
      priceSlider: 'Preis pro Nacht Schieberegler',
      upTo: 'bis zu',
      perNight: '€ / Nacht',
      cheap: 'Günstig',
      luxury: 'Luxus',
      starsLabel: 'Hotelkategorie (Sterne)',
      allStandards: '✨ Alle Kategorien (3★, 4★, 5★)',
      stars3: '⭐ 3 Sterne (Komfort & Guter Preis)',
      stars4: '⭐⭐ 4 Sterne (Gehobener Standard)',
      stars5: '👑 5 Sterne (VIP Luxus)',
      seniorAmenities: 'Seniorenausstattung:',
      filterElevator: '🛗 Aufzug & Barrierefrei',
      filterBreakfast: '🍳 Hervorragendes Frühstück',
      otherTownTitle: 'Ihre Wunschstadt nicht gefunden?',
      otherTownDesc: 'Mit einem Klick finden Sie jedes Hotel weltweit direkt auf Booking.com.',
      openCustomSearch: 'Andere Stadt auf Booking.com suchen',
      verifiedList: 'Von Tadzik empfohlene Hotels',
      bookOnBooking: 'Auf Booking.com buchen',
      reviews: 'Bewertungen'
    },
    es: {
      partner: 'Buscador Oficial de Hoteles',
      mainHeading: 'Busca y reserva alojamientos directamente en Booking.com 🛌',
      mainSubheading: '¡Introduce ciudad, fechas y huéspedes para ver alojamientos verificados en Booking.com con cancelación gratis y desayuno!',
      liveWidgetTitle: 'Buscador de Hoteles Booking.com',
      liveWidgetDesc: 'Completa el formulario para encontrar habitaciones disponibles',
      priceGuarantee: '✔️ Mejor Precio Garantizado Booking.com',
      whereTo: '📍 ¿A dónde vas? (Escribe la Ciudad)',
      cityPlaceholder: 'ej. Rotterdam, Madrid, Ámsterdam, Barcelona...',
      checkIn: '📅 Fecha de Entrada (Check-in)',
      checkOut: '📅 Fecha de Salida (Check-out)',
      guests: '👥 Número de Huéspedes',
      guest1: '1 Adulto (Viajero individual)',
      guest2: '2 Adultos (Pareja / Personas mayores)',
      guest3: '3 Adultos / Familia',
      guest4: '4 Personas (Familia con niños)',
      elevator: 'Ascensor',
      breakfast: 'Desayuno',
      freeCancel: 'Cancelación gratuita',
      searchBooking: '🔍 Buscar en Booking.com',
      typeCity: 'Escribe la Ciudad',
      priceSlider: 'Precio por noche',
      upTo: 'hasta',
      perNight: '€ / noche',
      cheap: 'Económico',
      luxury: 'Lujo',
      starsLabel: 'Estrellas del Hotel',
      allStandards: '✨ Todas las categorías (3★, 4★, 5★)',
      stars3: '⭐ 3 Estrellas (Confort y buen precio)',
      stars4: '⭐⭐ 4 Estrellas (Estándar superior)',
      stars5: '👑 5 Estrellas (Lujo VIP)',
      seniorAmenities: 'Servicios para mayores:',
      filterElevator: '🛗 Ascensor y sin barreras',
      filterBreakfast: '🍳 Desayuno excelente',
      otherTownTitle: '¿Buscas otra ciudad?',
      otherTownDesc: 'Puedes buscar cualquier hotel del mundo con un clic directamente en Booking.com.',
      openCustomSearch: 'Buscar otra ciudad en Booking.com',
      verifiedList: 'Hoteles verificados recomendados por Tadzik',
      bookOnBooking: 'Reservar en Booking.com',
      reviews: 'opiniones'
    },
    fr: {
      partner: 'Partenaire Hôtelier Officiel',
      mainHeading: 'Recherchez et réservez directement sur Booking.com 🛌',
      mainSubheading: 'Indiquez la ville, les dates et le nombre de voyageurs pour des résultats vérifiés sur Booking.com avec annulation gratuite !',
      liveWidgetTitle: 'Recherche d\'Hôtels Booking.com',
      liveWidgetDesc: 'Remplissez le formulaire pour trouver des chambres disponibles',
      priceGuarantee: '✔️ Garantie du meilleur prix Booking.com',
      whereTo: '📍 Où allez-vous ? (Indiquez la Ville)',
      cityPlaceholder: 'ex. Rotterdam, Paris, Amsterdam, Lyon...',
      checkIn: '📅 Date d\'arrivée (Check-in)',
      checkOut: '📅 Date de départ (Check-out)',
      guests: '👥 Nombre de voyageurs',
      guest1: '1 Adulte (Voyageur solo)',
      guest2: '2 Adultes (Couple / Seniors)',
      guest3: '3 Adultes / Famille',
      guest4: '4 Personnes (Famille avec enfants)',
      elevator: 'Ascenseur',
      breakfast: 'Petit-déjeuner',
      freeCancel: 'Annulation gratuite',
      searchBooking: '🔍 Rechercher sur Booking.com',
      typeCity: 'Indiquez la Ville',
      priceSlider: 'Prix par nuit',
      upTo: 'jusqu\'à',
      perNight: '€ / nuit',
      cheap: 'Économique',
      luxury: 'Luxe',
      starsLabel: 'Étoiles de l\'Hôtel',
      allStandards: '✨ Toutes les catégories (3★, 4★, 5★)',
      stars3: '⭐ 3 Étoiles (Confort & Bon rapport qualité-prix)',
      stars4: '⭐⭐ 4 Étoiles (Standing supérieur)',
      stars5: '👑 5 Étoiles (Luxe VIP)',
      seniorAmenities: 'Équipements seniors :',
      filterElevator: '🛗 Ascenseur & Plain-pied',
      filterBreakfast: '🍳 Délicieux petit-déjeuner',
      otherTownTitle: 'Vous cherchez une autre ville ?',
      otherTownDesc: 'Recherchez n\'importe quel hôtel dans le monde en un clic sur Booking.com.',
      openCustomSearch: 'Rechercher une autre ville sur Booking.com',
      verifiedList: 'Hôtels vérifiés recommandés par Tadzik',
      bookOnBooking: 'Réserver sur Booking.com',
      reviews: 'avis'
    },
    ro: {
      partner: 'Partener Oficial Hotelier',
      mainHeading: 'Căutați și rezervați cazare direct pe Booking.com 🛌',
      mainSubheading: 'Introduceți orașul, perioada și numărul de oaspeți pentru rezultate verificate pe Booking.com cu anulare gratuită și mic dejun!',
      liveWidgetTitle: 'Motor de Căutare Booking.com',
      liveWidgetDesc: 'Completați formularul pentru a găsi camere disponibile',
      priceGuarantee: '✔️ Garanția celui mai mic preț Booking.com',
      whereTo: '📍 Unde călătoriți? (Introduceți Orașul)',
      cityPlaceholder: 'de ex. Rotterdam, București, Amsterdam, Cracovia...',
      checkIn: '📅 Data Sosirii (Check-in)',
      checkOut: '📅 Data Plecării (Check-out)',
      guests: '👥 Număr Oaspeți',
      guest1: '1 Adult (Călătorie solo)',
      guest2: '2 Adulți (Cuplu / Seniori)',
      guest3: '3 Adulți / Familie',
      guest4: '4 Persoane (Familie cu copii)',
      elevator: 'Lift',
      breakfast: 'Mic dejun',
      freeCancel: 'Anulare gratuită',
      searchBooking: '🔍 Caută pe Booking.com',
      typeCity: 'Introduceți Orașul',
      priceSlider: 'Preț pe noapte',
      upTo: 'până la',
      perNight: '€ / noapte',
      cheap: 'Accesibil',
      luxury: 'Lux',
      starsLabel: 'Standard Hotel (Stele)',
      allStandards: '✨ Toate categoriile (3★, 4★, 5★)',
      stars3: '⭐ 3 Stele (Confort & Preț bun)',
      stars4: '⭐⭐ 4 Stele (Standard superior)',
      stars5: '👑 5 Stele (Lux VIP)',
      seniorAmenities: 'Facilități pentru seniori:',
      filterElevator: '🛗 Lift & Acces facil',
      filterBreakfast: '🍳 Mic dejun excelent',
      otherTownTitle: 'Căutați alt oraș?',
      otherTownDesc: 'Puteți căuta orice hotel din lume printr-un singur clic direct pe Booking.com.',
      openCustomSearch: 'Caută alt oraș pe Booking.com',
      verifiedList: 'Hoteluri recomandate de Tadzik',
      bookOnBooking: 'Rezervă pe Booking.com',
      reviews: 'recenzii'
    },
    zh: {
      partner: '官方酒店合作伙伴',
      mainHeading: '在 Booking.com 上直接搜索并预订优质酒店 🛌',
      mainSubheading: '输入目的地城市、入住日期与入住人数，即可在 Booking.com 查找支持免费取消和含早服务的放心房源！',
      liveWidgetTitle: 'Booking.com 实时房源搜索',
      liveWidgetDesc: '填写下方表单，即刻获取 Booking.com 空房信息',
      priceGuarantee: '✔️ Booking.com 最低价格保障',
      whereTo: '📍 目的地城市（输入城市名）',
      cityPlaceholder: '例如：鹿特丹、阿姆斯特丹、巴黎、华沙...',
      checkIn: '📅 入住日期 (Check-in)',
      checkOut: '📅 离店日期 (Check-out)',
      guests: '👥 入住人数',
      guest1: '1 位成人（单人出行）',
      guest2: '2 位成人（伴侣 / 长者双人）',
      guest3: '3 位成人 / 家庭',
      guest4: '4 位客人（带儿童家庭）',
      elevator: '电梯',
      breakfast: '含早餐',
      freeCancel: '免费取消',
      searchBooking: '🔍 在 Booking.com 搜索',
      typeCity: '输入城市名',
      priceSlider: '每晚价格区间',
      upTo: '最高',
      perNight: '€ / 晚',
      cheap: '经济实惠',
      luxury: '奢华尊享',
      starsLabel: '酒店星级标准',
      allStandards: '✨ 全部星级 (3★, 4★, 5★)',
      stars3: '⭐ 3 星级（舒适高性价比）',
      stars4: '⭐⭐ 4 星级（高品质享受）',
      stars5: '👑 5 星级（VIP 奢华体验）',
      seniorAmenities: '适老无障碍设施：',
      filterElevator: '🛗 配备电梯・全程无障碍',
      filterBreakfast: '🍳 提供丰盛早餐',
      otherTownTitle: '想要寻找其他特定城市？',
      otherTownDesc: '一键前往 Booking.com 搜索全球任意城市的丰富住宿选择。',
      openCustomSearch: '在 Booking.com 搜索其他城市',
      verifiedList: 'Tadzik 精选认证推荐酒店列表',
      bookOnBooking: '在 Booking.com 立即预订',
      reviews: '条评价'
    }
  };

  const currentT = t[language] || t.en;

  const toggleSaveHotel = (hotelId: string) => {
    const isSaved = savedHotels.includes(hotelId);
    const updated = isSaved ? savedHotels.filter(id => id !== hotelId) : [...savedHotels, hotelId];
    setSavedHotels(updated);
    try {
      localStorage.setItem('nl_tourist_planner_saved_hotels', JSON.stringify(updated));
    } catch (e) {}
  };

  // Filter list
  const filteredHotels = FEATURED_HOTELS.filter((hotel) => {
    if (citySearch.trim() !== '') {
      const q = citySearch.toLowerCase();
      const matchCity = hotel.city.toLowerCase().includes(q);
      const matchName = hotel.name.toLowerCase().includes(q);
      const matchCountry = hotel.country.toLowerCase().includes(q);
      if (!matchCity && !matchName && !matchCountry) return false;
    }
    if (hotel.pricePerNight > maxBudget) return false;
    if (selectedStars > 0 && hotel.stars < selectedStars) return false;
    
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto" id="hotels-search-tab-root">
      
      {/* Header Banner with Booking.com Partnership */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl border border-blue-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-6 -bottom-6 opacity-15 text-8xl pointer-events-none select-none">
          🏨
        </div>

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full border border-blue-400/40 uppercase tracking-wider shadow-md">
            <span className="bg-white text-blue-900 font-extrabold text-[10px] px-1.5 py-0.5 rounded">Booking.com</span>
            <span>{currentT.partner}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
            {currentT.mainHeading}
          </h2>

          <p className="text-blue-100 text-sm md:text-base font-semibold leading-relaxed">
            {currentT.mainSubheading}
          </p>

          <div className="pt-2">
            <SectionTravelCompanion language={language} vehicle="car" />
          </div>
        </div>
      </div>

      {/* Interactive Booking.com Live Search Widget Box */}
      <div className="bg-blue-900 text-white border-2 border-blue-600 rounded-3xl p-5 md:p-7 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-blue-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-amber-400 text-blue-950 p-2 rounded-xl text-xl font-black shadow-xs">
              🏨
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{currentT.liveWidgetTitle}</span>
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">LIVE</span>
              </h3>
              <p className="text-blue-200 text-xs font-medium">
                {currentT.liveWidgetDesc}
              </p>
            </div>
          </div>

          <div className="text-xs bg-blue-950/80 px-3 py-1.5 rounded-xl border border-blue-700/60 font-bold text-amber-300">
            {currentT.priceGuarantee}
          </div>
        </div>

        <form 
          action="https://www.booking.com/searchresults.html" 
          method="get" 
          target="_blank"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Target Destination Input */}
          <div className="space-y-1.5">
            <label className="block text-blue-200 font-extrabold text-xs uppercase tracking-wider">
              {currentT.whereTo}
            </label>
            <input
              type="text"
              name="ss"
              required
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder={currentT.cityPlaceholder}
              className="w-full p-3 rounded-xl bg-white text-slate-900 font-extrabold text-sm border-2 border-amber-400 shadow-inner focus:ring-2 focus:ring-amber-300"
            />
          </div>

          {/* Check-in date selection */}
          <div className="space-y-1.5">
            <label className="block text-blue-200 font-extrabold text-xs uppercase tracking-wider">
              {currentT.checkIn}
            </label>
            <input
              type="date"
              defaultValue={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
              className="w-full p-3 rounded-xl bg-blue-950 text-white font-bold text-sm border border-blue-700"
            />
          </div>

          {/* Check-out date selection */}
          <div className="space-y-1.5">
            <label className="block text-blue-200 font-extrabold text-xs uppercase tracking-wider">
              {currentT.checkOut}
            </label>
            <input
              type="date"
              defaultValue={new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]}
              className="w-full p-3 rounded-xl bg-blue-950 text-white font-bold text-sm border border-blue-700"
            />
          </div>

          {/* Guests selection */}
          <div className="space-y-1.5">
            <label className="block text-blue-200 font-extrabold text-xs uppercase tracking-wider">
              {currentT.guests}
            </label>
            <select
              name="group_adults"
              defaultValue="2"
              className="w-full p-3 rounded-xl bg-blue-950 text-white font-bold text-sm border border-blue-700"
            >
              <option value="1">{currentT.guest1}</option>
              <option value="2">{currentT.guest2}</option>
              <option value="3">{currentT.guest3}</option>
              <option value="4">{currentT.guest4}</option>
            </select>
          </div>

          {/* Submit Button to Booking.com */}
          <div className="sm:col-span-2 lg:col-span-4 pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-3 text-xs font-bold text-blue-200">
              <span className="flex items-center gap-1">✔️ {currentT.elevator}</span>
              <span>•</span>
              <span className="flex items-center gap-1">✔️ {currentT.breakfast}</span>
              <span>•</span>
              <span className="flex items-center gap-1">✔️ {currentT.freeCancel}</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>{currentT.searchBooking}</span>
              <ExternalLink className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </form>
      </div>

      {/* Filter controls box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Option 1: Single City Text Input */}
          <div className="space-y-1.5">
            <label className="block text-slate-900 font-black text-xs uppercase tracking-wider">
              📍 {currentT.typeCity}
            </label>
            <div className="relative">
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder={currentT.cityPlaceholder}
                className="w-full p-3 pl-10 border-2 border-indigo-200 focus:border-indigo-600 rounded-xl bg-slate-50 font-extrabold text-sm text-slate-900 shadow-2xs focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-indigo-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Option 2: Price range slider (Rolka Ceny za Nocleg) */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center">
              <label className="block text-slate-900 font-black text-xs uppercase tracking-wider">
                💶 {currentT.priceSlider}
              </label>
              <span className="text-xs font-black text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200">
                {currentT.upTo} {maxBudget} {currentT.perNight}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
              <span>50 € ({currentT.cheap})</span>
              <span>250 €</span>
              <span>500 € ({currentT.luxury})</span>
            </div>
          </div>

          {/* Option 3: Hotel Standard (Liczba Gwiazdek) */}
          <div className="space-y-1.5">
            <label className="block text-slate-900 font-black text-xs uppercase tracking-wider">
              ⭐ {currentT.starsLabel}
            </label>
            <select
              value={selectedStars}
              onChange={(e) => setSelectedStars(Number(e.target.value))}
              className="w-full p-3 border-2 border-amber-200 focus:border-amber-500 rounded-xl bg-amber-50/50 font-black text-sm text-slate-900 shadow-2xs"
            >
              <option value="0">{currentT.allStandards}</option>
              <option value="3">{currentT.stars3}</option>
              <option value="4">{currentT.stars4}</option>
              <option value="5">{currentT.stars5}</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-400 mr-2 uppercase tracking-wider text-[10px]">
            {currentT.seniorAmenities}
          </span>

          <button
            onClick={() => setElevatorOnly(!elevatorOnly)}
            className={`px-3 py-1.5 rounded-full font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              elevatorOnly 
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs' 
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${elevatorOnly ? 'inline' : 'hidden'}`} />
            <span>{currentT.filterElevator}</span>
          </button>

          <button
            onClick={() => setBreakfastOnly(!breakfastOnly)}
            className={`px-3 py-1.5 rounded-full font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              breakfastOnly 
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs' 
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${breakfastOnly ? 'inline' : 'hidden'}`} />
            <span>{currentT.filterBreakfast}</span>
          </button>
        </div>
      </div>

      {/* Quick External Booking Helper Box */}
      <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 text-slate-950 p-2.5 rounded-xl text-xl shadow-xs">
            🌐
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              {currentT.otherTownTitle}
            </h4>
            <p className="text-slate-600 text-xs font-medium">
              {currentT.otherTownDesc}
            </p>
          </div>
        </div>

        <a
          href={`https://www.google.com/travel/hotels?q=Hotels+in+${encodeURIComponent(citySearch.trim() || 'Rotterdam')}+with+elevator+near+station`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>{currentT.openCustomSearch}</span>
          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
        </a>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="hotels-results-grid">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => {
            const isSaved = savedHotels.includes(hotel.id);

            return (
              <div 
                key={hotel.id} 
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Hotel Photo Banner */}
                  <div className="relative h-48 md:h-52 w-full bg-slate-900 overflow-hidden">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-slate-700 shadow-md flex items-center gap-1">
                      <span className="text-amber-400 font-extrabold text-sm">{hotel.pricePerNight} {hotel.currency}</span>
                      <span className="text-[10px] text-slate-400 font-bold">/ {language === 'pl' ? 'noc' : 'night'}</span>
                    </div>

                    {/* Star Rating & Save Heart */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                        <span>⭐</span>
                        <span>{hotel.rating}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSaveHotel(hotel.id)}
                        className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                          isSaved ? 'bg-rose-600 text-white shadow' : 'bg-slate-900/80 text-slate-300 hover:text-white'
                        }`}
                        title={isSaved ? 'Zapisano do ulubionych' : 'Zapisz hotel'}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom Title overlay */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="text-lg md:text-xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
                        {hotel.name}
                      </h3>
                      <p className="text-slate-300 text-xs font-semibold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{hotel.city}, {hotel.country}</span>
                      </p>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3.5">
                    
                    {/* Distance Indicators */}
                    <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="flex items-center gap-1">
                        <span>🏙️</span>
                        <span>{hotel.distanceToCenter}</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <span>🚆</span>
                        <span>{hotel.distanceToStation}</span>
                      </span>
                    </div>

                    {/* Senior Amenities Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {hotel.seniorAmenities.map((amenity, idx) => (
                        <span 
                          key={idx}
                          className="bg-indigo-50 text-indigo-900 border border-indigo-100 text-[11px] font-extrabold px-2.5 py-1 rounded-md"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-xs leading-relaxed font-medium">
                      {hotel.description[language] || hotel.description['en']}
                    </p>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="p-5 pt-0 mt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 font-bold">
                    <span>🛡️ {language === 'pl' ? 'Sprawdzona rezerwacja' : 'Verified booking'}</span>
                  </div>

                  <a
                    href={hotel.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{language === 'pl' ? 'Sprawdź Dostępność' : 'Check Availability'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="font-extrabold text-slate-900 text-base">
              {language === 'pl' ? 'Brak wyników w naszej bezpośredniej bazie dla wybranego filtra' : 'No direct matches in local database'}
            </h4>
            <p className="text-slate-500 text-xs max-w-md mx-auto">
              {language === 'pl'
                ? 'Użyj przycisku wyszukiwania w Google Hotels powyżej, aby zobaczyć wszystkie wolne hotele w tym mieście!'
                : 'Use the Google Hotels search button above to view all open accommodations!'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
