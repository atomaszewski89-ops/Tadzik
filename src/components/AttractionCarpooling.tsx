/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserAccount, Language, RideOffer } from '../types';
import { 
  Car, 
  Users, 
  Plus, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle, 
  UserPlus, 
  Trash2, 
  X, 
  Info, 
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AttractionCarpoolingProps {
  attractionId: string;
  attractionName: string;
  attractionCity: string;
  language: Language;
  account: UserAccount | null;
  rideOffers: RideOffer[];
  onAddRideOffer: (offer: RideOffer) => void;
  onReserveSeat: (offerId: string, passengerName: string, passengerContact: string) => void;
  onDeleteRideOffer: (offerId: string) => void;
}

interface CarpoolingStrings {
  title: string;
  ridesCount: (count: number) => string;
  subtitle: string;
  hide: string;
  showRides: string;
  safetyTitle: string;
  safetyDesc: string;
  activeListings: string;
  driverOffersCount: (count: number) => string;
  passengerRequestsCount: (count: number) => string;
  postRideBtn: string;
  postRideModalTitle: (place: string) => string;
  offerSeatsBtn: string;
  requestRideBtn: string;
  yourName: string;
  yourNamePlaceholder: string;
  departureDateTime: string;
  departurePlaceholder: string;
  pickupLocation: string;
  pickupPlaceholder: (city: string) => string;
  freeSeatsAvailable: string;
  numberOfPassengers: string;
  person1: string;
  persons2: string;
  persons3: string;
  persons4: string;
  phoneContact: string;
  phonePlaceholder: string;
  notes: string;
  notesPlaceholder: string;
  cancel: string;
  publishRideBtn: string;
  driverOfferBadge: string;
  passengerRequestBadge: string;
  freeSeatsBadge: (available: number, total: number) => string;
  start: string;
  joinedPassengers: (names: string) => string;
  deleteEntry: string;
  requestSeatBtn: string;
  noRidesYet: (place: string) => string;
  reserveSeatModalTitle: string;
  travelWithDriver: (driver: string, date: string) => string;
  reservedSuccessTitle: string;
  reservedSuccessDesc: string;
  yourFullName: string;
  phoneForContact: string;
  confirmAndSend: string;
  fillNameAlert: string;
  publishedSuccessAlert: string;
}

const CARPOOLING_I18N: Record<Language, CarpoolingStrings> = {
  pl: {
    title: 'Wspólny Przejazd / Carpooling (Podróżuj Razem)',
    ridesCount: (c) => `${c} ogłoszeń`,
    subtitle: 'Zaoferuj wolne miejsca w aucie na jutro lub dołącz do kogoś, kto ma samochód!',
    hide: 'Zwiń',
    showRides: 'Pokaż przejazdy',
    safetyTitle: 'Bezpieczne i ekologiczne podróżowanie:',
    safetyDesc: 'Dzielcie się kosztami paliwa, pomagajcie seniorom bez własnego auta i poznawajcie nowych przyjaciół w podróży! Dodaj wpis poniżej.',
    activeListings: 'Dostępne przejazdy:',
    driverOffersCount: (c) => `${c} Ofert kierowców`,
    passengerRequestsCount: (c) => `${c} Szukających transportu`,
    postRideBtn: 'Dodaj Przejazd lub Ogłoszenie',
    postRideModalTitle: (p) => `Nowe Ogłoszenie Przejazdu do: ${p}`,
    offerSeatsBtn: '🚗 Oferuję miejsca w aucie',
    requestRideBtn: '🙋‍♂️ Szukam transportu / kierowcy',
    yourName: 'Twoje Imię / Nick *',
    yourNamePlaceholder: 'np. Marek T. / Krystyna',
    departureDateTime: 'Kiedy jedziesz? (Data i godzina) *',
    departurePlaceholder: 'np. Jutro (13.08), godz. 10:00',
    pickupLocation: 'Miejsce Startu / Odbioru *',
    pickupPlaceholder: (city) => `np. ${city} Stacja Główna lub z domu`,
    freeSeatsAvailable: 'Liczba wolnych miejsc w aucie *',
    numberOfPassengers: 'Dla ilu osób szukasz miejsca? *',
    person1: '1 osoba',
    persons2: '2 osoby',
    persons3: '3 osoby (np. mała rodzina)',
    persons4: '4 osoby',
    phoneContact: 'Numer telefonu / Kontakt dla pasażerów *',
    phonePlaceholder: 'np. +48 600 123 456 lub marek@email.com',
    notes: 'Dodatkowe uwagi (auto, bagażnik, pory wyjazdu)',
    notesPlaceholder: 'np. Mam duży bagażnik na składany wózek, cicha spokojna jazda',
    cancel: 'Anuluj',
    publishRideBtn: '🚀 Opublikuj Przejazd',
    driverOfferBadge: '🚗 Kierowca Oferuje Miejsca',
    passengerRequestBadge: '🙋‍♂️ Szukam Transportu',
    freeSeatsBadge: (a, t) => `${a} / ${t} wolnych miejsc`,
    start: 'Start:',
    joinedPassengers: (n) => `✔️ Dołączyli pasażerowie: ${n}`,
    deleteEntry: 'Usuń wpis',
    requestSeatBtn: 'Dołącz / Zarezerwuj Miejsce',
    noRidesYet: (p) => `Brak jeszcze wpisów o przejazdach do atrakcji ${p}. Bądź pierwszy i dodaj ogłoszenie!`,
    reserveSeatModalTitle: 'Rezerwacja Miejsca w Aucie',
    travelWithDriver: (d, date) => `Jedziesz z kierowcą: ${d} (${date})`,
    reservedSuccessTitle: 'Zarezerwowano miejsce!',
    reservedSuccessDesc: 'Kierowca otrzymał powiadomienie. Zadzwoni lub napisze pod podany numer telefonu.',
    yourFullName: 'Twoje Imię i Nazwisko / Nick *',
    phoneForContact: 'Numer telefonu do kontaktu *',
    confirmAndSend: '✔️ Potwierdź i Wyślij Zgłoszenie',
    fillNameAlert: 'Wypełnij swoje imię oraz dane kontaktowe!',
    publishedSuccessAlert: '✅ Ogłoszenie przejazdu zostało opublikowane! Inni podróżnicy mogą teraz się z Tobą połączyć.'
  },
  en: {
    title: 'Community Carpooling & Ride Sharing',
    ridesCount: (c) => `${c} rides`,
    subtitle: 'Offer free seats in your car or find a ride with fellow travelers!',
    hide: 'Hide',
    showRides: 'View Rides',
    safetyTitle: 'Safe & eco-friendly travel:',
    safetyDesc: 'Share fuel costs, help senior travelers without cars, and enjoy the trip together!',
    activeListings: 'Active listings:',
    driverOffersCount: (c) => `${c} Driver offers`,
    passengerRequestsCount: (c) => `${c} Passenger requests`,
    postRideBtn: 'Post Ride Offer / Request',
    postRideModalTitle: (p) => `Post a Ride to: ${p}`,
    offerSeatsBtn: '🚗 Offering seats in car',
    requestRideBtn: '🙋‍♂️ Looking for a ride',
    yourName: 'Your Name *',
    yourNamePlaceholder: 'e.g. Mark T. / Christina',
    departureDateTime: 'Departure Date & Time *',
    departurePlaceholder: 'e.g. Tomorrow (13.08), 10:00 AM',
    pickupLocation: 'Pickup Location *',
    pickupPlaceholder: (city) => `e.g. ${city} Central Station`,
    freeSeatsAvailable: 'Free Seats Available *',
    numberOfPassengers: 'Number of Passengers *',
    person1: '1 person',
    persons2: '2 persons',
    persons3: '3 persons (e.g. small family)',
    persons4: '4 persons',
    phoneContact: 'Phone / Contact Info *',
    phonePlaceholder: 'e.g. +31 6 12345678 or mark@email.com',
    notes: 'Notes / Car model / Luggage space',
    notesPlaceholder: 'e.g. Spacious trunk for wheelchair, quiet relaxed drive',
    cancel: 'Cancel',
    publishRideBtn: '🚀 Publish Ride Listing',
    driverOfferBadge: '🚗 Driver Offering Seats',
    passengerRequestBadge: '🙋‍♂️ Passenger Requesting Ride',
    freeSeatsBadge: (a, t) => `${a} / ${t} seats available`,
    start: 'Start:',
    joinedPassengers: (n) => `✔️ Joined passengers: ${n}`,
    deleteEntry: 'Delete listing',
    requestSeatBtn: 'Request Seat / Join Ride',
    noRidesYet: (p) => `No ride offers posted yet for ${p}. Be the first to share a ride!`,
    reserveSeatModalTitle: 'Reserve Seat in Car',
    travelWithDriver: (d, date) => `Riding with driver: ${d} (${date})`,
    reservedSuccessTitle: 'Seat Reserved!',
    reservedSuccessDesc: 'The driver received your notification and will contact you via phone or email.',
    yourFullName: 'Your Full Name / Nickname *',
    phoneForContact: 'Contact Phone Number *',
    confirmAndSend: '✔️ Confirm & Send Request',
    fillNameAlert: 'Please enter your name and contact details!',
    publishedSuccessAlert: '✅ Ride offer published successfully! Fellow travelers can now connect with you.'
  },
  nl: {
    title: 'Carpooling & Ritten Delen (Samen Reizen)',
    ridesCount: (c) => `${c} ritten`,
    subtitle: 'Bied vrije zitplaatsen aan in je auto of reis gezellig mee met andere ontdekkers!',
    hide: 'Inklappen',
    showRides: 'Bekijk ritten',
    safetyTitle: 'Veilig & duurzaam reizen:',
    safetyDesc: 'Deel brandstofkosten, help senioren zonder auto en ontmoet nieuwe reisgenoten!',
    activeListings: 'Beschikbare ritten:',
    driverOffersCount: (c) => `${c} Bestuurdersaanbiedingen`,
    passengerRequestsCount: (c) => `${c} Passagiersverzoeken`,
    postRideBtn: 'Rit Aanbieden of Vragen',
    postRideModalTitle: (p) => `Nieuwe rit naar: ${p}`,
    offerSeatsBtn: '🚗 Ik bied vrije plaatsen aan',
    requestRideBtn: '🙋‍♂️ Ik zoek vervoer / bestuurder',
    yourName: 'Uw Naam / Bijnaam *',
    yourNamePlaceholder: 'bijv. Jan K. / Petra',
    departureDateTime: 'Wanneer vertrekt u? (Datum & tijd) *',
    departurePlaceholder: 'bijv. Morgen om 10:00 uur',
    pickupLocation: 'Vertreklocatie / Ophaalpunt *',
    pickupPlaceholder: (city) => `bijv. ${city} Centraal Station`,
    freeSeatsAvailable: 'Aantal vrije plaatsen *',
    numberOfPassengers: 'Voor hoeveel personen zoekt u vervoer? *',
    person1: '1 persoon',
    persons2: '2 personen',
    persons3: '3 personen',
    persons4: '4 personen',
    phoneContact: 'Telefoonnummer / Contactgegevens *',
    phonePlaceholder: 'bijv. +31 6 12345678 of jan@email.nl',
    notes: 'Extra opmerkingen (auto, bagageruimte)',
    notesPlaceholder: 'bijv. Grote kofferbak voor rolstoel, rustige rit',
    cancel: 'Annuleren',
    publishRideBtn: '🚀 Rit Publiceren',
    driverOfferBadge: '🚗 Bestuurder Biedt Plaatsen',
    passengerRequestBadge: '🙋‍♂️ Zoekt Vervoer',
    freeSeatsBadge: (a, t) => `${a} / ${t} vrije plaatsen`,
    start: 'Start:',
    joinedPassengers: (n) => `✔️ Aangemelde passagiers: ${n}`,
    deleteEntry: 'Verwijder rit',
    requestSeatBtn: 'Mee-reizen / Plaats Reserveren',
    noRidesYet: (p) => `Nog geen ritten geplaatst voor ${p}. Wees de eerste en plaats een advertentie!`,
    reserveSeatModalTitle: 'Plaats in Auto Reserveren',
    travelWithDriver: (d, date) => `U reist met bestuurder: ${d} (${date})`,
    reservedSuccessTitle: 'Plaats gereserveerd!',
    reservedSuccessDesc: 'De bestuurder heeft bericht ontvangen en neemt contact met u op.',
    yourFullName: 'Uw Naam en Achternaam *',
    phoneForContact: 'Telefoonnummer voor contact *',
    confirmAndSend: '✔️ Bevestigen en Verzenden',
    fillNameAlert: 'Vul alstublieft uw naam en contactgegevens in!',
    publishedSuccessAlert: '✅ Uw rit is geplaatst! Andere reizigers kunnen nu contact met u opnemen.'
  },
  de: {
    title: 'Fahrgemeinschaften & Carpooling (Gemeinsam Reisen)',
    ridesCount: (c) => `${c} Fahrten`,
    subtitle: 'Biete freie Plätze in deinem Auto an oder fahre entspannt mit anderen!',
    hide: 'Einklappen',
    showRides: 'Fahrten anzeigen',
    safetyTitle: 'Sicher & umweltfreundlich reisen:',
    safetyDesc: 'Benzinkosten teilen, Senioren ohne Auto unterstützen und neue Reisefreunde kennenlernen!',
    activeListings: 'Verfügbare Fahrten:',
    driverOffersCount: (c) => `${c} Fahrerangebote`,
    passengerRequestsCount: (c) => `${c} Mitfahranfragen`,
    postRideBtn: 'Fahrt anbieten oder anfragen',
    postRideModalTitle: (p) => `Fahrtangebot nach: ${p}`,
    offerSeatsBtn: '🚗 Biete freie Plätze im Auto',
    requestRideBtn: '🙋‍♂️ Suche Mitfahrgelegenheit',
    yourName: 'Dein Name *',
    yourNamePlaceholder: 'z.B. Markus T. / Claudia',
    departureDateTime: 'Abfahrtsdatum & Uhrzeit *',
    departurePlaceholder: 'z.B. Morgen um 10:00 Uhr',
    pickupLocation: 'Treffpunkt / Abholort *',
    pickupPlaceholder: (city) => `z.B. ${city} Hauptbahnhof`,
    freeSeatsAvailable: 'Freie Sitzplätze *',
    numberOfPassengers: 'Für wie viele Personen suchst du? *',
    person1: '1 Person',
    persons2: '2 Personen',
    persons3: '3 Personen',
    persons4: '4 Personen',
    phoneContact: 'Telefonnummer / Kontaktdaten *',
    phonePlaceholder: 'z.B. +49 170 1234567',
    notes: 'Hinweise (Kofferraum, Fahrzeug)',
    notesPlaceholder: 'z.B. Großer Kofferraum für Rollstuhl, ruhige Fahrt',
    cancel: 'Abbrechen',
    publishRideBtn: '🚀 Fahrt veröffentlichen',
    driverOfferBadge: '🚗 Fahrer bietet Plätze an',
    passengerRequestBadge: '🙋‍♂️ Sucht Mitfahrgelegenheit',
    freeSeatsBadge: (a, t) => `${a} / ${t} freie Plätze`,
    start: 'Start:',
    joinedPassengers: (n) => `✔️ Mitfahrer: ${n}`,
    deleteEntry: 'Eintrag löschen',
    requestSeatBtn: 'Platz anfragen / Mitfahren',
    noRidesYet: (p) => `Noch keine Fahrten nach ${p} eingetragen. Sei der Erste!`,
    reserveSeatModalTitle: 'Platz im Auto anfragen',
    travelWithDriver: (d, date) => `Fahrt mit: ${d} (${date})`,
    reservedSuccessTitle: 'Platz reserviert!',
    reservedSuccessDesc: 'Der Fahrer wurde benachrichtigt und wird dich kontaktieren.',
    yourFullName: 'Dein vollständiger Name *',
    phoneForContact: 'Telefonnummer für Rückfragen *',
    confirmAndSend: '✔️ Bestätigen & Anfrage senden',
    fillNameAlert: 'Bitte Namen und Kontaktdaten angeben!',
    publishedSuccessAlert: '✅ Fahrtangebot erfolgreich veröffentlicht!'
  },
  es: {
    title: 'Viajes Compartidos / Carpooling (Viajar Juntos)',
    ridesCount: (c) => `${c} viajes`,
    subtitle: '¡Ofrece plazas libres en tu coche o viaja con otros compañeros!',
    hide: 'Ocultar',
    showRides: 'Ver viajes',
    safetyTitle: 'Viajes seguros y sostenibles:',
    safetyDesc: '¡Comparte gastos, ayuda a viajeros mayores y disfruta del trayecto!',
    activeListings: 'Viajes disponibles:',
    driverOffersCount: (c) => `${c} Ofertas de conductores`,
    passengerRequestsCount: (c) => `${c} Solicitudes de pasajeros`,
    postRideBtn: 'Publicar Oferta / Solicitud',
    postRideModalTitle: (p) => `Publicar viaje a: ${p}`,
    offerSeatsBtn: '🚗 Ofrezco plazas en mi coche',
    requestRideBtn: '🙋‍♂️ Busco transporte / conductor',
    yourName: 'Tu Nombre *',
    yourNamePlaceholder: 'ej. Carlos M. / Laura',
    departureDateTime: 'Fecha y hora de salida *',
    departurePlaceholder: 'ej. Mañana a las 10:00',
    pickupLocation: 'Punto de recogida *',
    pickupPlaceholder: (city) => `ej. ${city} Estación Central`,
    freeSeatsAvailable: 'Plazas libres disponibles *',
    numberOfPassengers: '¿Para cuántas personas buscas? *',
    person1: '1 persona',
    persons2: '2 personas',
    persons3: '3 personas',
    persons4: '4 personas',
    phoneContact: 'Teléfono / Contacto *',
    phonePlaceholder: 'ej. +34 600 123 456',
    notes: 'Notas adicionales (maletero, coche)',
    notesPlaceholder: 'ej. Maletero amplio, conducción tranquila',
    cancel: 'Cancelar',
    publishRideBtn: '🚀 Publicar Viaje',
    driverOfferBadge: '🚗 Conductor Ofrece Plazas',
    passengerRequestBadge: '🙋‍♂️ Pasajero Busca Viaje',
    freeSeatsBadge: (a, t) => `${a} / ${t} plazas libres`,
    start: 'Inicio:',
    joinedPassengers: (n) => `✔️ Pasajeros unidos: ${n}`,
    deleteEntry: 'Eliminar anuncio',
    requestSeatBtn: 'Reservar Plaza / Unirse',
    noRidesYet: (p) => `Aún no hay viajes publicados para ${p}. ¡Sé el primero en compartir!`,
    reserveSeatModalTitle: 'Reservar Plaza en Coche',
    travelWithDriver: (d, date) => `Viajas con: ${d} (${date})`,
    reservedSuccessTitle: '¡Plaza reservada!',
    reservedSuccessDesc: 'El conductor ha recibido el aviso y se pondrá en contacto contigo.',
    yourFullName: 'Tu Nombre Completo *',
    phoneForContact: 'Teléfono de contacto *',
    confirmAndSend: '✔️ Confirmar y Enviar Solicitud',
    fillNameAlert: 'Por favor, introduce tu nombre y datos de contacto.',
    publishedSuccessAlert: '✅ ¡Viaje publicado con éxito!'
  },
  fr: {
    title: 'Covoiturage Communautaire (Voyager Ensemble)',
    ridesCount: (c) => `${c} trajets`,
    subtitle: 'Proposez des places libres dans votre voiture ou voyagez avec d\'autres passionnés !',
    hide: 'Masquer',
    showRides: 'Voir les trajets',
    safetyTitle: 'Voyages sûrs et écologiques :',
    safetyDesc: 'Partagez les frais de carburant, aidez les seniors sans voiture et profitez du voyage ensemble !',
    activeListings: 'Trajets disponibles :',
    driverOffersCount: (c) => `${c} Offres de conducteurs`,
    passengerRequestsCount: (c) => `${c} Demandes de passagers`,
    postRideBtn: 'Proposer ou Demander un Trajet',
    postRideModalTitle: (p) => `Nouveau trajet vers : ${p}`,
    offerSeatsBtn: '🚗 Je propose des places',
    requestRideBtn: '🙋‍♂️ Je cherche un trajet',
    yourName: 'Votre Nom / Pseudo *',
    yourNamePlaceholder: 'ex. Pierre D. / Sophie',
    departureDateTime: 'Date et heure de départ *',
    departurePlaceholder: 'ex. Demain à 10h00',
    pickupLocation: 'Lieu de prise en charge *',
    pickupPlaceholder: (city) => `ex. Gare Centrale de ${city}`,
    freeSeatsAvailable: 'Places libres disponibles *',
    numberOfPassengers: 'Pour combien de personnes ? *',
    person1: '1 personne',
    persons2: '2 personnes',
    persons3: '3 personnes',
    persons4: '4 personnes',
    phoneContact: 'Téléphone / Contact *',
    phonePlaceholder: 'ex. +33 6 12 34 56 78',
    notes: 'Remarques (véhicule, bagages)',
    notesPlaceholder: 'ex. Grand coffre pour poussette, conduite tranquille',
    cancel: 'Annuler',
    publishRideBtn: '🚀 Publier le Trajet',
    driverOfferBadge: '🚗 Conducteur Propose des Places',
    passengerRequestBadge: '🙋‍♂️ Recherche un Trajet',
    freeSeatsBadge: (a, t) => `${a} / ${t} places libres`,
    start: 'Départ :',
    joinedPassengers: (n) => `✔️ Passagers inscrits : ${n}`,
    deleteEntry: 'Supprimer l\'annonce',
    requestSeatBtn: 'Réserver une Place / Rejoindre',
    noRidesYet: (p) => `Aucun trajet publié pour ${p}. Soyez le premier à partager !`,
    reserveSeatModalTitle: 'Réserver une Place en Voiture',
    travelWithDriver: (d, date) => `Vous voyagez avec : ${d} (${date})`,
    reservedSuccessTitle: 'Place réservée !',
    reservedSuccessDesc: 'Le conducteur a été notifié et vous recontactera rapidement.',
    yourFullName: 'Votre Nom et Prénom *',
    phoneForContact: 'Numéro de téléphone *',
    confirmAndSend: '✔️ Confirmer et Envoyer',
    fillNameAlert: 'Veuillez renseigner votre nom et vos coordonnées !',
    publishedSuccessAlert: '✅ Trajet publié avec succès !'
  },
  ro: {
    title: 'Carpooling & Călătorii Comune (Călătoriți Împreună)',
    ridesCount: (c) => `${c} anunțuri`,
    subtitle: 'Oferă locuri libere în mașină sau călătorește alături de alți turiști!',
    hide: 'Ascunde',
    showRides: 'Vezi cursele',
    safetyTitle: 'Călătorie sigură și ecologică:',
    safetyDesc: 'Împărțiți costurile combustibilului, ajutați seniorii fără mașină și faceți noi prieteni!',
    activeListings: 'Curse disponibile:',
    driverOffersCount: (c) => `${c} Oferte șoferi`,
    passengerRequestsCount: (c) => `${c} Cereri pasageri`,
    postRideBtn: 'Adaugă Cursă sau Cerere',
    postRideModalTitle: (p) => `Cursă nouă către: ${p}`,
    offerSeatsBtn: '🚗 Ofer locuri în mașină',
    requestRideBtn: '🙋‍♂️ Caut transport / șofer',
    yourName: 'Numele tău *',
    yourNamePlaceholder: 'ex. Mihai T. / Elena',
    departureDateTime: 'Data și ora plecării *',
    departurePlaceholder: 'ex. Mâine la ora 10:00',
    pickupLocation: 'Locație de plecare / Preluare *',
    pickupPlaceholder: (city) => `ex. ${city} Gara Centrală`,
    freeSeatsAvailable: 'Locuri libere disponibile *',
    numberOfPassengers: 'Pentru câte persoane cauți loc? *',
    person1: '1 persoană',
    persons2: '2 persoane',
    persons3: '3 persoane',
    persons4: '4 persoane',
    phoneContact: 'Număr de telefon / Contact *',
    phonePlaceholder: 'ex. +40 720 123 456',
    notes: 'Observații suplimentare (mașină, portbagaj)',
    notesPlaceholder: 'ex. Portbagaj încăpător, mers liniștit',
    cancel: 'Anulează',
    publishRideBtn: '🚀 Publică Cursa',
    driverOfferBadge: '🚗 Șoferul Oferă Locuri',
    passengerRequestBadge: '🙋‍♂️ Pasagerul Caută Transport',
    freeSeatsBadge: (a, t) => `${a} / ${t} locuri libere`,
    start: 'Plecare:',
    joinedPassengers: (n) => `✔️ Pasageri alăturați: ${n}`,
    deleteEntry: 'Șterge anunțul',
    requestSeatBtn: 'Rezervă Loc / Alătură-te',
    noRidesYet: (p) => `Nu există încă anunțuri pentru ${p}. Fii primul care adaugă o cursă!`,
    reserveSeatModalTitle: 'Rezervare Loc în Mașină',
    travelWithDriver: (d, date) => `Mergi cu șoferul: ${d} (${date})`,
    reservedSuccessTitle: 'Loc rezervat cu succes!',
    reservedSuccessDesc: 'Șoferul a primit notificarea și te va contacta în curând.',
    yourFullName: 'Numele și Prenumele tău *',
    phoneForContact: 'Număr de telefon pentru contact *',
    confirmAndSend: '✔️ Confirmă și Trimite Cererea',
    fillNameAlert: 'Te rugăm să completezi numele și datele de contact!',
    publishedSuccessAlert: '✅ Anunțul de călătorie a fost publicat cu succes!'
  },
  zh: {
    title: '社区拼车与共享出行 (携手同游)',
    ridesCount: (c) => `${c} 条行程`,
    subtitle: '在车内提供空座，或与其他旅行者结伴同行！',
    hide: '收起',
    showRides: '查看行程',
    safetyTitle: '安全且环保的出行方式：',
    safetyDesc: '分摊油费，帮助无车长者，在旅途中结识新朋友！',
    activeListings: '当前行程列表：',
    driverOffersCount: (c) => `${c} 位车主提供空座`,
    passengerRequestsCount: (c) => `${c} 条求车需求`,
    postRideBtn: '发布拼车或求车信息',
    postRideModalTitle: (p) => `发布前往 ${p} 的行程：`,
    offerSeatsBtn: '🚗 我是车主，提供空座',
    requestRideBtn: '🙋‍♂️ 我需要乘车 / 寻找司机',
    yourName: '您的姓名 / 昵称 *',
    yourNamePlaceholder: '例如：李先生 / 张女士',
    departureDateTime: '出发日期与时间 *',
    departurePlaceholder: '例如：明天上午 10:00',
    pickupLocation: '出发 / 接送地点 *',
    pickupPlaceholder: (city) => `例如：${city} 中央车站或家门口`,
    freeSeatsAvailable: '车内可用空座数 *',
    numberOfPassengers: '您需要预订几人座位？*',
    person1: '1 人',
    persons2: '2 人',
    persons3: '3 人 (如小家庭)',
    persons4: '4 人',
    phoneContact: '电话 / 联系方式 *',
    phonePlaceholder: '例如：+86 138 0000 0000 或 微信',
    notes: '补充说明 (车型、后备箱空间等)',
    notesPlaceholder: '例如：后备箱大可放折叠轮椅，驾驶平稳安全',
    cancel: '取消',
    publishRideBtn: '🚀 立即发布行程',
    driverOfferBadge: '🚗 车主提供空座',
    passengerRequestBadge: '🙋‍♂️ 乘客求车',
    freeSeatsBadge: (a, t) => `剩余 ${a} / ${t} 个空位`,
    start: '出发点：',
    joinedPassengers: (n) => `✔️ 已加入乘客：${n}`,
    deleteEntry: '删除此行程',
    requestSeatBtn: '立即申请座位 / 加入行程',
    noRidesYet: (p) => `目前尚无前往 ${p} 的拼车信息。成为第一位分享行程的人吧！`,
    reserveSeatModalTitle: '申请预订车内座位',
    travelWithDriver: (d, date) => `搭乘司机：${d} (${date})`,
    reservedSuccessTitle: '座位申请成功！',
    reservedSuccessDesc: '车主已收到您的申请通知，将通过您填写的电话与您联系。',
    yourFullName: '您的姓名 / 昵称 *',
    phoneForContact: '联系电话 *',
    confirmAndSend: '✔️ 确认并提交申请',
    fillNameAlert: '请填写您的姓名与联系方式！',
    publishedSuccessAlert: '✅ 拼车信息已成功发布！其他旅行者现在可以与您联系。'
  }
};

export default function AttractionCarpooling({
  attractionId,
  attractionName,
  attractionCity,
  language,
  account,
  rideOffers,
  onAddRideOffer,
  onReserveSeat,
  onDeleteRideOffer
}: AttractionCarpoolingProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [selectedOfferForReservation, setSelectedOfferForReservation] = useState<RideOffer | null>(null);

  const loc = CARPOOLING_I18N[language] || CARPOOLING_I18N.en;

  // Form State
  const [formType, setFormType] = useState<'offer' | 'request'>('offer');
  const [userNameInput, setUserNameInput] = useState<string>(account?.username || '');
  const [dateInput, setDateInput] = useState<string>('Jutro, godz. 10:00');
  const [fromLocationInput, setFromLocationInput] = useState<string>(`${attractionCity} Stacja Główna / Centrum`);
  const [seatsInput, setSeatsInput] = useState<number>(3);
  const [contactInput, setContactInput] = useState<string>(account?.email || account?.phone || '');
  const [notesInput, setNotesInput] = useState<string>('');

  // Reservation modal state
  const [passengerNameInput, setPassengerNameInput] = useState<string>(account?.username || '');
  const [passengerContactInput, setPassengerContactInput] = useState<string>(account?.phone || account?.email || '');
  const [reservationSuccess, setReservationSuccess] = useState<boolean>(false);

  // Filter ride offers for this specific attraction
  const attractionRides = rideOffers.filter((r) => r.attractionId === attractionId);
  const driverOffers = attractionRides.filter((r) => r.type === 'offer');
  const passengerRequests = attractionRides.filter((r) => r.type === 'request');

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNameInput.trim() || !contactInput.trim()) {
      alert(loc.fillNameAlert);
      return;
    }

    const newOffer: RideOffer = {
      id: `ride-${Date.now()}`,
      attractionId,
      type: formType,
      userName: userNameInput.trim(),
      date: dateInput.trim() || 'Jutro, godz. 10:00',
      fromLocation: fromLocationInput.trim() || attractionCity,
      seatsAvailable: seatsInput,
      totalSeats: seatsInput,
      contactInfo: contactInput.trim(),
      notes: notesInput.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      passengers: []
    };

    onAddRideOffer(newOffer);
    setShowAddForm(false);
    setNotesInput('');
    alert(loc.publishedSuccessAlert);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfferForReservation || !passengerNameInput.trim()) return;

    onReserveSeat(selectedOfferForReservation.id, passengerNameInput.trim(), passengerContactInput.trim());
    setReservationSuccess(true);
    setTimeout(() => {
      setReservationSuccess(false);
      setSelectedOfferForReservation(null);
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50/40 border border-amber-300 rounded-2xl overflow-hidden shadow-xs">
      
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 md:p-5 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-amber-100/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-slate-950 p-2.5 rounded-xl text-xl shadow-xs shrink-0 font-black">
            🚗
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-slate-950 text-sm md:text-base">
                {loc.title}
              </h4>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                {loc.ridesCount(attractionRides.length)}
              </span>
            </div>
            <p className="text-slate-600 text-xs font-semibold mt-0.5">
              {loc.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs shrink-0">
          <span className="hidden sm:inline">
            {isExpanded ? loc.hide : loc.showRides}
          </span>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-700" /> : <ChevronDown className="w-5 h-5 text-amber-700" />}
        </div>
      </button>

      {/* Expanded Content Section */}
      {isExpanded && (
        <div className="p-4 md:p-6 border-t border-amber-200/80 bg-white space-y-6">
          
          {/* Quick Info Box */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-950 font-medium">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="font-extrabold text-slate-900 block">
                {loc.safetyTitle}
              </strong>
              <p className="leading-relaxed">
                {loc.safetyDesc}
              </p>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                {loc.activeListings}
              </span>
              <span className="bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-black px-2.5 py-0.5 rounded-lg">
                🚗 {loc.driverOffersCount(driverOffers.length)}
              </span>
              <span className="bg-teal-50 text-teal-900 border border-teal-200 text-xs font-black px-2.5 py-0.5 rounded-lg">
                🙋‍♂️ {loc.passengerRequestsCount(passengerRequests.length)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{loc.postRideBtn}</span>
            </button>
          </div>

          {/* Add Offer Form Modal / Collapsible */}
          {showAddForm && (
            <form onSubmit={handleCreateOffer} className="bg-slate-900 text-white p-5 rounded-2xl border border-amber-400/50 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚘</span>
                  <h5 className="font-extrabold text-white text-base">
                    {loc.postRideModalTitle(attractionName)}
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form type toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormType('offer')}
                  className={`py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all cursor-pointer border flex items-center justify-center gap-2 ${
                    formType === 'offer'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <span>{loc.offerSeatsBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormType('request')}
                  className={`py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all cursor-pointer border flex items-center justify-center gap-2 ${
                    formType === 'request'
                      ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <span>{loc.requestRideBtn}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                
                {/* User Name */}
                <div className="space-y-1">
                  <label className="block text-amber-300">
                    {loc.yourName}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={loc.yourNamePlaceholder}
                    value={userNameInput}
                    onChange={(e) => setUserNameInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>

                {/* Date / Time */}
                <div className="space-y-1">
                  <label className="block text-amber-300">
                    {loc.departureDateTime}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={loc.departurePlaceholder}
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>

                {/* Pickup Location */}
                <div className="space-y-1">
                  <label className="block text-amber-300">
                    {loc.pickupLocation}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={loc.pickupPlaceholder(attractionCity)}
                    value={fromLocationInput}
                    onChange={(e) => setFromLocationInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>

                {/* Seats count */}
                <div className="space-y-1">
                  <label className="block text-amber-300">
                    {formType === 'offer' ? loc.freeSeatsAvailable : loc.numberOfPassengers}
                  </label>
                  <select
                    value={seatsInput}
                    onChange={(e) => setSeatsInput(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                  >
                    <option value="1">{loc.person1}</option>
                    <option value="2">{loc.persons2}</option>
                    <option value="3">{loc.persons3}</option>
                    <option value="4">{loc.persons4}</option>
                  </select>
                </div>

                {/* Contact phone/email */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-amber-300">
                    {loc.phoneContact}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={loc.phonePlaceholder}
                    value={contactInput}
                    onChange={(e) => setContactInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-amber-300">
                    {loc.notes}
                  </label>
                  <input
                    type="text"
                    placeholder={loc.notesPlaceholder}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium"
                  />
                </div>

              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer"
                >
                  {loc.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2.5 px-5 rounded-xl shadow-md cursor-pointer uppercase tracking-wider"
                >
                  {loc.publishRideBtn}
                </button>
              </div>
            </form>
          )}

          {/* List of Offers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attractionRides.length > 0 ? (
              attractionRides.map((ride) => {
                const isDriverOffer = ride.type === 'offer';
                const hasSeats = ride.seatsAvailable > 0;
                const isMyOffer = account && account.username === ride.userName;

                return (
                  <div
                    key={ride.id}
                    className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                      isDriverOffer 
                        ? 'bg-amber-50/40 border-amber-300/80 shadow-2xs' 
                        : 'bg-teal-50/40 border-teal-300/80 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Badge Row */}
                      <div className="flex justify-between items-center">
                        <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-md border ${
                          isDriverOffer
                            ? 'bg-amber-400 text-slate-950 border-amber-500'
                            : 'bg-teal-500 text-white border-teal-600'
                        }`}>
                          {isDriverOffer ? loc.driverOfferBadge : loc.passengerRequestBadge}
                        </span>

                        <span className="text-[11px] font-bold text-slate-400">
                          {ride.createdAt}
                        </span>
                      </div>

                      {/* User & Date */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-black text-slate-950 text-base flex items-center gap-1.5">
                            <span>👤</span>
                            <span>{ride.userName}</span>
                          </h5>

                          <div className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                            hasSeats 
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                              : 'bg-rose-100 text-rose-900 border-rose-300'
                          }`}>
                            💺 {loc.freeSeatsBadge(ride.seatsAvailable, ride.totalSeats)}
                          </div>
                        </div>

                        <div className="space-y-1 text-xs text-slate-700 font-semibold pt-1">
                          <p className="flex items-center gap-1 text-indigo-900 font-bold">
                            <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>{ride.date}</span>
                          </p>

                          <p className="flex items-center gap-1 text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{loc.start} <strong>{ride.fromLocation}</strong></span>
                          </p>
                        </div>

                        {ride.notes && (
                          <p className="text-xs text-slate-600 bg-white/80 p-2 rounded-xl border border-slate-200/80 mt-2 font-medium italic">
                            "{ride.notes}"
                          </p>
                        )}
                      </div>

                      {/* Passengers list if any */}
                      {ride.passengers && ride.passengers.length > 0 && (
                        <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-bold">
                          {loc.joinedPassengers(ride.passengers.join(', '))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                      <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{ride.contactInfo}</span>
                      </div>

                      <div className="flex gap-1.5">
                        {isMyOffer && (
                          <button
                            type="button"
                            onClick={() => onDeleteRideOffer(ride.id)}
                            className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                            title={loc.deleteEntry}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        {isDriverOffer && hasSeats && (
                          <button
                            type="button"
                            onClick={() => setSelectedOfferForReservation(ride)}
                            className="bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                            <span>{loc.requestSeatBtn}</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <Car className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-slate-700 text-xs font-bold">
                  {loc.noRidesYet(attractionName)}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Reservation Modal */}
      {selectedOfferForReservation && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedOfferForReservation(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-2xl">💺🚗</span>
              <h4 className="font-black text-slate-950 text-lg">
                {loc.reserveSeatModalTitle}
              </h4>
              <p className="text-slate-600 text-xs font-medium">
                {loc.travelWithDriver(selectedOfferForReservation.userName, selectedOfferForReservation.date)}
              </p>
            </div>

            {reservationSuccess ? (
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-center space-y-2 text-emerald-950">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
                <h5 className="font-extrabold text-sm">{loc.reservedSuccessTitle}</h5>
                <p className="text-xs font-medium">
                  {loc.reservedSuccessDesc}
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmReservation} className="space-y-3 text-xs font-bold text-slate-800">
                <div className="space-y-1">
                  <label>{loc.yourFullName}</label>
                  <input
                    type="text"
                    required
                    placeholder="np. Agata K."
                    value={passengerNameInput}
                    onChange={(e) => setPassengerNameInput(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label>{loc.phoneForContact}</label>
                  <input
                    type="text"
                    required
                    placeholder="np. +48 500 111 222"
                    value={passengerContactInput}
                    onChange={(e) => setPassengerContactInput(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOfferForReservation(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl font-bold cursor-pointer"
                  >
                    {loc.cancel}
                  </button>

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-5 rounded-xl shadow-sm cursor-pointer"
                  >
                    {loc.confirmAndSend}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
