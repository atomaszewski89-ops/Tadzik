import { useState } from 'react';
import { UserAccount, Language, TravelMode, translations } from '../types';
import SightseeingWeatherCard from './SightseeingWeatherCard';
import InAppGoogleMapRoute from './InAppGoogleMapRoute';
import InternationalTransitCoordinator from './transit/InternationalTransitCoordinator';
import { SectionTravelCompanion } from './AnimatedTravelVehicle';
import { 
  MapPin, 
  Clock, 
  Calendar,
  Search, 
  Compass, 
  Map, 
  ExternalLink, 
  Bus, 
  Train, 
  Car,
  Bike,
  Footprints,
  Gauge,
  ArrowRight, 
  RotateCcw, 
  Check, 
  Info, 
  ShieldCheck, 
  DollarSign,
  Globe2,
  Sparkles
} from 'lucide-react';

interface StationPlannerTabProps {
  language: Language;
  account: UserAccount | null;
}

const STATION_PLANNER_I18N: Record<Language, {
  badge: string;
  title: string;
  desc: string;
  queryCardTitle: string;
  queryCardDesc: string;
  transportModeLabel: string;
  modes: { car: string; transit: string; motorcycle: string; bike: string; walk: string };
  startLabel: string;
  startPlaceholder: string;
  destLabel: string;
  destPlaceholder: string;
  accessibilityTitle: string;
  accessibilityDesc: string;
  searchBtn: string;
  timelineReady: string;
  accessibilityActive: string;
  searchAgain: string;
  selected: string;
  select: string;
  itineraryTitle: string;
  exportMaps: string;
  supervisedNotice: string;
  totalEstimated: string;
  weatherTitle: string;
  suitcaseTitle: string;
  suitcaseDesc: string;
  passportBackdrop: string;
  option1Title: string;
  option1Desc: string;
  option2Title: string;
  option2Desc: string;
  option3Title: string;
  option3Desc: string;
  stepDeparture: (addr: string) => string;
  stepBus: string;
  stepTrain: string;
  stepAssistedTransfer: string;
  stepArrival: (addr: string) => string;
  stepShuttle: string;
  stepCoach: string;
  stepSprinter: string;
  stepTram: string;
  stepDirectTrain: string;
  stepDirectArrival: (addr: string) => string;
}> = {
  pl: {
    badge: "ROZBUDOWANY PLANER PODRÓŻY",
    title: "Planowanie Bezpiecznej Trasy ♿",
    desc: "Wprowadź dowolną ulicę początkową i miejsce docelowe. Nasz planer dopasuje pociągi, autobusy, tramwaje, samochody, motory, rowery lub trasy piesze, uwzględniając wymogi dla osób niepełnosprawnych oraz starszych na tle zebranych przez Ciebie pamiątkowych naklejek!",
    queryCardTitle: "Nowe wyszukiwanie bezpiecznego wyjazdu",
    queryCardDesc: "Wypełnij dane i wybierz czym chcesz jechać, aby wygenerować optymalne sposoby podróży wraz z cenami",
    transportModeLabel: "Czym chcesz jechać do danej atrakcji? Wybierz środek transportu:",
    modes: { car: "Autem 🚗", transit: "Komunikacją miejską 🚌", motorcycle: "Motorem 🏍️", bike: "Rowerem 🚲", walk: "Pieszo 🚶‍♂️" },
    startLabel: "Ulica startowa / Miejsce startu:",
    startPlaceholder: "np. ul. Spokojna 15, Rotterdam",
    destLabel: "Miejsce docelowe / Cel podróży:",
    destPlaceholder: "np. ul. Wiejska 12, Amsterdam Centraal",
    accessibilityTitle: "Opcje asysty i niepełnosprawności",
    accessibilityDesc: "Zaznacz tę opcję, aby wyszukiwarka uwzględniła ułatwienia dla wózków inwalidzkich, asystę stacyjną oraz windy.",
    searchBtn: "Wyszukaj trasę bezpiecznego wyjazdu 🔍",
    timelineReady: "TRASA ZAPLANOWANA POMYŚLNIE!",
    accessibilityActive: "Ułatwienia bezbarierowe aktywne",
    searchAgain: "Wyszukaj ponownie",
    selected: "WYBRANO ✓",
    select: "Wybierz",
    itineraryTitle: "Szczegółowy przebieg połączenia:",
    exportMaps: "Eksportuj do Google Maps 🗺️",
    supervisedNotice: "Połączenie pod nadzorem asysty Tadzika. Ceny zawierają zniżki dla seniorów.",
    totalEstimated: "Łączny koszt:",
    weatherTitle: "Pogoda w miejscu docelowym na dzień wycieczki:",
    suitcaseTitle: "Pamiątkowa walizka z podróży",
    suitcaseDesc: "Powyższa bezpieczna trasa została zaprezentowana na tle Twoich pamiątkowych plakietek i pieczątek, które zbierasz podczas podróżowania po Holandii, Belgii, Polsce oraz Niemczech! Odwiedzaj nowe miejsca, wrzucaj zdjęcia i odblokowuj kolejne kolorowe naklejki!",
    passportBackdrop: "PASZPORT PODRÓŻNY — TWOJE ZEBRANE NAKLEJKI",
    option1Title: "Pociąg + Autobus",
    option1Desc: "Najwygodniejsza opcja regionalna z ułatwionym niskopodłogowym wejściem do autobusu i bezpośrednią przesiadką na pociąg IC.",
    option2Title: "Autobus Ekspresowy + Pociąg",
    option2Desc: "Szybka trasa międzymiastowa z klimatyzowanym autokarem i bezpośrednim dojazdem pociągiem pod dworzec.",
    option3Title: "Bezpośredni pociąg z asystą (Zalecany) ♿",
    option3Desc: "W pełni dostosowana trasa bezpośrednia. System automatycznie powiadamia asystenta Tadzika oraz obsługę stacji o potrzebie rozłożenia ramp.",
    stepDeparture: (addr) => `Rozpoczęcie wyjazdu z adresu: ${addr}`,
    stepBus: "Miejski autobus niskopodłogowy Linii 44 (Kierunek Stacja Główna, Peron A)",
    stepTrain: "Szybki pociąg Intercity (Kierunek Amsterdam Centraal, Peron 4)",
    stepAssistedTransfer: "Przesiadka asystowana przez obsługę dworca (dostępne windy oraz ruchome schody)",
    stepArrival: (addr) => `Przyjazd do celu podróży: ${addr}`,
    stepShuttle: "Dojazd autobusem ekspresowym Regional Express (Stanowisko 2)",
    stepCoach: "Autokar dalekobieżny z ułatwionym wejściem i asystą kierowcy",
    stepSprinter: "Pociąg Sprinter / Kolej podmiejska do celu (Peron 2)",
    stepTram: "Dojazd niskopodłogowym tramwajem Linii 7 na peron",
    stepDirectTrain: "Pociąg InterCity Direct z rampą wjazdową (Peron 11, asystuje Tadzik)",
    stepDirectArrival: (addr) => `Przyjazd na stację docelową bez barier schodowych: ${addr}`
  },
  en: {
    badge: "ADVANCED TRAVEL PLANNER",
    title: "Safe Point-to-Point Routing ♿",
    desc: "Enter any starting location and final destination. The planner maps out trains, buses, cars, motorcycles, bikes, or walking paths, highlighting step-free transfers, elevators, and pricing.",
    queryCardTitle: "New Point-to-Point Travel Query",
    queryCardDesc: "Provide addresses below and choose your preferred travel vehicle to build complete schedules and options",
    transportModeLabel: "How do you want to travel to this attraction? Choose transport mode:",
    modes: { car: "By Car 🚗", transit: "Public Transit 🚌", motorcycle: "Motorcycle 🏍️", bike: "By Bicycle 🚲", walk: "On Foot 🚶‍♂️" },
    startLabel: "Starting Street / Origin:",
    startPlaceholder: "e.g. Spokojnastreet 15, Rotterdam",
    destLabel: "Destination / Attraction:",
    destPlaceholder: "e.g. Wiejskastreet 12, Amsterdam Centraal",
    accessibilityTitle: "Accessibility & Step-Free Route Planning",
    accessibilityDesc: "Prioritize low-floor city transport, station elevators, boarding ramps, and assistant help.",
    searchBtn: "Search Safe Departure Connections 🔍",
    timelineReady: "SAFE CONNECTION TIMELINE READY!",
    accessibilityActive: "Wheelchair Assistance & Ramps Enabled",
    searchAgain: "Search Again",
    selected: "SELECTED ✓",
    select: "Select",
    itineraryTitle: "Detailed Travel Transfer Itinerary:",
    exportMaps: "Export to Google Maps 🗺️",
    supervisedNotice: "Route supervised by active assistant feed. All fees apply senior discount limits.",
    totalEstimated: "Total Estimated cost:",
    weatherTitle: "Destination Weather Forecast for Sightseeing Day:",
    suitcaseTitle: "Travel Stamp Case Collection",
    suitcaseDesc: "All generated routes are laid over your memory travel stamps database! Complete challenges or upload community attraction snapshots to enrich your visual stamp collection.",
    passportBackdrop: "YOUR MEMORIAL STICKER COLLECTION BACKDROP",
    option1Title: "Train + Bus",
    option1Desc: "Highly comfortable regional connection with low-floor bus entry and direct train platform access.",
    option2Title: "Express Coach + Train",
    option2Desc: "Fast intercity connection with comfortable air-conditioned coach and direct terminal rail transit.",
    option3Title: "Direct Train with Assistance (Recommended) ♿",
    option3Desc: "Fully step-free direct connection. Station staff automatically notified for boarding ramp deployment.",
    stepDeparture: (addr) => `Departure from: ${addr}`,
    stepBus: "Low-floor City Bus Line 44 towards Central Station",
    stepTrain: "Intercity Train towards Amsterdam Centraal, Platform 4",
    stepAssistedTransfer: "Station staff assisted transfer (Elevators and step-free paths available)",
    stepArrival: (addr) => `Arrival at final destination: ${addr}`,
    stepShuttle: "Express Regional Coach to transit hub, Bay 2",
    stepCoach: "Intercity Express Bus connection (Assisted boarding enabled)",
    stepSprinter: "Local Sprinter train to destination, Platform 2",
    stepTram: "Low-floor Tram Line 7 ride to train platforms",
    stepDirectTrain: "InterCity Direct train with boarding ramps (Platform 11, Tadzik assists)",
    stepDirectArrival: (addr) => `Arrived safely without stair barriers at: ${addr}`
  },
  nl: {
    badge: "UITGEBREIDE REISPLANNER",
    title: "Veilige Deur-tot-Deur Routeplanner ♿",
    desc: "Voer uw vertrek- en bestemmingsadres in. De planner combineert treinen, bussen, auto's, motoren, fietsen of wandelingen met aandacht voor rolstoeltoegankelijkheid en seniorenbegeleiding!",
    queryCardTitle: "Nieuwe veilige reisroute zoeken",
    queryCardDesc: "Vul onderstaande adressen in en kies uw vervoersmiddel om de beste reismogelijkheden en tarieven te berekenen",
    transportModeLabel: "Hoe wilt u naar deze bezienswaardigheid reizen? Kies uw vervoer:",
    modes: { car: "Met de auto 🚗", transit: "Openbaar vervoer 🚌", motorcycle: "Met de motor 🏍️", bike: "Met de fiets 🚲", walk: "Te voet 🚶‍♂️" },
    startLabel: "Vertrekadres / Startpunt:",
    startPlaceholder: "bijv. Spoorstraat 15, Rotterdam",
    destLabel: "Bestemming / Bezienswaardigheid:",
    destPlaceholder: "bijv. Stationsplein 12, Amsterdam Centraal",
    accessibilityTitle: "Toegankelijkheid & Hulpdienst",
    accessibilityDesc: "Geef voorrang aan lagevloerbussen, liften op stations, oprijplaten en persoonlijke assistentie.",
    searchBtn: "Zoek Veilige Reisverbindingen 🔍",
    timelineReady: "REISPLAN SUCCESVOL GEGENEREERD!",
    accessibilityActive: "Toegankelijkheidsassistentie Actief",
    searchAgain: "Opnieuw zoeken",
    selected: "GESELECTEERD ✓",
    select: "Kiezen",
    itineraryTitle: "Gedetailleerd reisoverzicht:",
    exportMaps: "Exporteer naar Google Maps 🗺️",
    supervisedNotice: "Begeleid door Tadzik assistentie. Tarieven inclusief seniorenkorting.",
    totalEstimated: "Totale geschatte kosten:",
    weatherTitle: "Weersverwachting op de bestemming:",
    suitcaseTitle: "Herinneringskoffer & Reisstickers",
    suitcaseDesc: "Uw veilige reisroute wordt getoond tegen de achtergrond van uw verzamelde paspoortstickers en stempels van uw reizen door Europa!",
    passportBackdrop: "UW VERZAMELDE REISSTICKERS",
    option1Title: "Trein + Bus",
    option1Desc: "Comfortabele regionale verbinding met lagevloerbus en directe aansluiting op de Intercity trein.",
    option2Title: "Snelbus + Trein",
    option2Desc: "Snelle intercityreis met comfortabele snelbus en aansluitende treinverbinding.",
    option3Title: "Directe trein met assistentie (Aanbevolen) ♿",
    option3Desc: "Volledig drempelvrije directe verbinding met oprijplaten en stationsassistentie.",
    stepDeparture: (addr) => `Vertrek vanaf adres: ${addr}`,
    stepBus: "Lagevloer Stadsbus Lijn 44 richting Centraal Station",
    stepTrain: "Intercity Trein richting Amsterdam Centraal, Spoor 4",
    stepAssistedTransfer: "Begeleide overstap op het station (liften en roltrappen beschikbaar)",
    stepArrival: (addr) => `Aankomst op bestemming: ${addr}`,
    stepShuttle: "Snelbus / Regionale Express rechtstreeks naar de overstaphalte",
    stepCoach: "Intercity snelbusverbinding (met begeleid instappen)",
    stepSprinter: "Sprinter trein naar de bestemming, Spoor 2",
    stepTram: "Lagevloertram Lijn 7 naar de treinperrons",
    stepDirectTrain: "InterCity Direct trein met rolstoelramp (Spoor 11, assistentie gereed)",
    stepDirectArrival: (addr) => `Veilig aangekomen zonder drempels op: ${addr}`
  },
  de: {
    badge: "ERWEITERTER REISEPLANER",
    title: "Sichere Routenplanung ♿",
    desc: "Geben Sie Start- und Zieladresse ein. Unser Planer ermittelt Bahn-, Bus-, Auto-, Motorrad-, Fahrrad- oder Fußrouten mit Barrierefreiheit und Einstiegshilfe.",
    queryCardTitle: "Neue Reiseverbindung suchen",
    queryCardDesc: "Geben Sie die Adressen ein und wählen Sie Ihr Verkehrsmittel, um optimale Reiseoptionen und Preise anzuzeigen",
    transportModeLabel: "Wie möchten Sie zur Attraktion anreisen? Verkehrsmittel wählen:",
    modes: { car: "Mit dem Auto 🚗", transit: "Öffentlicher Verkehr 🚌", motorcycle: "Mit dem Motorrad 🏍️", bike: "Mit dem Fahrrad 🚲", walk: "Zu Fuß 🚶‍♂️" },
    startLabel: "Startadresse / Abfahrtsort:",
    startPlaceholder: "z.B. Hauptstraße 15, Rotterdam",
    destLabel: "Zielort / Sehenswürdigkeit:",
    destPlaceholder: "z.B. Bahnhofplatz 12, Amsterdam Centraal",
    accessibilityTitle: "Barrierefreiheit & Einstiegshilfe",
    accessibilityDesc: "Niederflurbusse, Aufzüge an Bahnhöfen und Rampen bevorzugen.",
    searchBtn: "Sichere Verbindung suchen 🔍",
    timelineReady: "REISEPLAN ERFOLGREICH ERSTELLT!",
    accessibilityActive: "Barrierefreie Assistenz Aktiv",
    searchAgain: "Neu suchen",
    selected: "AUSGEWÄHLT ✓",
    select: "Auswählen",
    itineraryTitle: "Detaillierter Reiseablauf:",
    exportMaps: "In Google Maps öffnen 🗺️",
    supervisedNotice: "Betreut durch Tadzik Assistenz. Preise inklusive Senioreneräßigung.",
    totalEstimated: "Geschätzte Gesamtkosten:",
    weatherTitle: "Wettervorhersage am Zielort:",
    suitcaseTitle: "Reise-Erinnerungskoffer",
    suitcaseDesc: "Ihre Route wird vor dem Hintergrund Ihrer gesammelten Reisestempel und Aufkleber angezeigt!",
    passportBackdrop: "IHRE GESAMMELTEN REISESTICKER",
    option1Title: "Zug + Bus",
    option1Desc: "Bequeme Regionalverbindung mit einfachem Umstieg und Niederflurbus-Zugang.",
    option2Title: "Expressbus + Zug",
    option2Desc: "Schnelle Intercity-Verbindung mit komfortablem Reisebus und direktem Zuganschluss.",
    option3Title: "Direktzug mit Assistenz (Empfohlen) ♿",
    option3Desc: "Vollständig barrierefreie Direktverbindung mit Einstiegshilfe an den Bahnsteigen.",
    stepDeparture: (addr) => `Abfahrt von: ${addr}`,
    stepBus: "Niederflur-Stadtbus Linie 44 Richtung Hauptbahnhof",
    stepTrain: "Intercity-Zug Richtung Amsterdam Centraal, Gleis 4",
    stepAssistedTransfer: "Begleiteter Umstieg am Bahnhof (Aufzüge vorhanden)",
    stepArrival: (addr) => `Ankunft am Ziel: ${addr}`,
    stepShuttle: "Expressbus zum zentralen Busbahnhof, Bussteig 2",
    stepCoach: "Überregionaler Reisebus mit Betreuung beim Einstieg",
    stepSprinter: "Sprinter-Zug vom Bahnhof zum Ziel, Gleis 2",
    stepTram: "Niederflur-Straßenbahn Linie 7 zu den Bahnsteigen",
    stepDirectTrain: "InterCity Direct Zug mit Einstiegsrampe (Gleis 11)",
    stepDirectArrival: (addr) => `Barrierefrei angekommen in: ${addr}`
  },
  es: {
    badge: "PLANIFICADOR DE VIAJE AVANZADO",
    title: "Planificación de Ruta Segura ♿",
    desc: "Introduce tu dirección de inicio y destino. El planificador combina trenes, autobuses, coches, motos, bicicletas o paseos a pie adaptados para mayores y personas con movilidad reducida.",
    queryCardTitle: "Nueva búsqueda de viaje seguro",
    queryCardDesc: "Completa los datos y elige el medio de transporte para ver los itinerarios recomendados con tarifas",
    transportModeLabel: "¿Cómo quieres viajar a esta atracción? Elige el transporte:",
    modes: { car: "En coche 🚗", transit: "Transporte público 🚌", motorcycle: "En moto 🏍️", bike: "En bicicleta 🚲", walk: "A pie 🚶‍♂️" },
    startLabel: "Calle de salida / Punto de inicio:",
    startPlaceholder: "ej. Calle Mayor 15, Rotterdam",
    destLabel: "Destino / Atracción:",
    destPlaceholder: "ej. Plaza de la Estación 12, Ámsterdam",
    accessibilityTitle: "Opciones de accesibilidad y rampas",
    accessibilityDesc: "Prioriza transporte urbano de piso bajo, ascensores y asistencia de embarque.",
    searchBtn: "Buscar Rutas Seguras 🔍",
    timelineReady: "¡ITINERARIO GENERADO CON ÉXITO!",
    accessibilityActive: "Asistencia para movilidad reducida activa",
    searchAgain: "Buscar de nuevo",
    selected: "SELECCIONADO ✓",
    select: "Elegir",
    itineraryTitle: "Itinerario detallado del viaje:",
    exportMaps: "Exportar a Google Maps 🗺️",
    supervisedNotice: "Supervisado por el asistente Tadzik. Precios con descuentos para mayores.",
    totalEstimated: "Coste estimado total:",
    weatherTitle: "Previsión del tiempo en el destino:",
    suitcaseTitle: "Maleta de recuerdos de viaje",
    suitcaseDesc: "¡Tu ruta se presenta sobre el fondo de tus sellos y pegatinas coleccionados en tus viajes por Europa!",
    passportBackdrop: "TUS PEGATINAS DE VIAJE REUNIDAS",
    option1Title: "Tren + Autobús",
    option1Desc: "Cómoda opción regional con autobús de piso bajo y transbordo directo al tren IC.",
    option2Title: "Autobús Exprés + Tren",
    option2Desc: "Ruta rápida interurbana en autocar con aire acondicionado y transbordo directo a tren.",
    option3Title: "Tren directo con asistencia (Recomendado) ♿",
    option3Desc: "Ruta directa 100% sin escalones con aviso automático de rampas al personal de la estación.",
    stepDeparture: (addr) => `Salida desde: ${addr}`,
    stepBus: "Autobús urbano de piso bajo Línea 44 hacia Estación Central",
    stepTrain: "Tren Intercity hacia Amsterdam Centraal, Vía 4",
    stepAssistedTransfer: "Transbordo asistido en la estación (ascensores disponibles)",
    stepArrival: (addr) => `Llegada al destino: ${addr}`,
    stepShuttle: "Autobús Exprés regional hacia el intercambiador",
    stepCoach: "Autocar interurbano con asistencia de conductor en el acceso",
    stepSprinter: "Tren Sprinter hacia el destino, Vía 2",
    stepTram: "Tranvía de piso bajo Línea 7 hacia los andenes",
    stepDirectTrain: "Tren InterCity Direct con rampa de acceso (Vía 11)",
    stepDirectArrival: (addr) => `Llegada segura sin barreras a: ${addr}`
  },
  fr: {
    badge: "PLANIFICATEUR DE VOYAGE AVANCÉ",
    title: "Planification d'Itinéraire Sécurisé ♿",
    desc: "Indiquez votre adresse de départ et votre destination. Le planificateur organise vos trajets en train, bus, voiture, moto, vélo ou marche à pied avec assistance PMR et sans marches.",
    queryCardTitle: "Nouvelle recherche de trajet sécurisé",
    queryCardDesc: "Renseignez les adresses ci-dessous et choisissez votre transport pour afficher les itinéraires complets et les tarifs",
    transportModeLabel: "Comment souhaitez-vous vous rendre à cette attraction ? Choisissez :",
    modes: { car: "En voiture 🚗", transit: "Transports en commun 🚌", motorcycle: "En moto 🏍️", bike: "À vélo 🚲", walk: "À pied 🚶‍♂️" },
    startLabel: "Adresse de départ / Lieu de départ :",
    startPlaceholder: "ex. Rue de la Paix 15, Rotterdam",
    destLabel: "Destination / Monument :",
    destPlaceholder: "ex. Place de la Gare 12, Amsterdam Centraal",
    accessibilityTitle: "Accessibilité & Assistance PMR",
    accessibilityDesc: "Privilégie les bus à plancher surbaissé, les ascenseurs en gare et les rampes d'accès.",
    searchBtn: "Rechercher un trajet sécurisé 🔍",
    timelineReady: "ITINÉRAIRE SÉCURISÉ PRÊT !",
    accessibilityActive: "Assistance accessibilité activée",
    searchAgain: "Nouvelle recherche",
    selected: "SÉLECTIONNÉ ✓",
    select: "Choisir",
    itineraryTitle: "Détail des étapes du trajet :",
    exportMaps: "Exporter vers Google Maps 🗺️",
    supervisedNotice: "Itinéraire supervisé par l'assistant Tadzik. Tarifs incluant réductions seniors.",
    totalEstimated: "Coût total estimé :",
    weatherTitle: "Météo à destination pour le jour de visite :",
    suitcaseTitle: "Valise de souvenirs de voyage",
    suitcaseDesc: "Votre itinéraire est affiché sur fond de vos tampons et autocollants de passeport collectés en Europe !",
    passportBackdrop: "VOS AUTOCOLLANTS DE VOYAGE COLLECTÉS",
    option1Title: "Train + Bus",
    option1Desc: "Option régionale très confortable avec bus à plancher bas et correspondance directe en train IC.",
    option2Title: "Bus Express + Train",
    option2Desc: "Liaison rapide interurbaine en autocar grand confort et correspondance directe en train.",
    option3Title: "Train direct avec assistance (Recommandé) ♿",
    option3Desc: "Liaison directe sans obstacle avec déploiement automatique de rampe en gare.",
    stepDeparture: (addr) => `Départ depuis : ${addr}`,
    stepBus: "Bus urbain à plancher bas Ligne 44 direction Gare Centrale",
    stepTrain: "Train Intercity direction Amsterdam Centraal, Quai 4",
    stepAssistedTransfer: "Correspondance assistée par le personnel de la gare (ascenseurs)",
    stepArrival: (addr) => `Arrivée à destination : ${addr}`,
    stepShuttle: "Navette bus Express vers le pôle d'échange",
    stepCoach: "Autocar régional direct avec assistance à bord",
    stepSprinter: "Train Sprinter vers la destination, Quai 2",
    stepTram: "Tramway à plancher bas Ligne 7 vers les quais",
    stepDirectTrain: "Train InterCity Direct avec rampe d'accès (Quai 11)",
    stepDirectArrival: (addr) => `Arrivée sécurisée sans escalier à : ${addr}`
  },
  ro: {
    badge: "PLANIFICATOR AVANSAT DE CĂLĂTORIE",
    title: "Planificarea Rutelor Sigure ♿",
    desc: "Introduceți adresa de plecare și destinația. Planificatorul combină trenuri, autobuze, mașini, motociclete, biciclete sau plimbări pe jos cu asistență pentru seniori și acces facil fără trepte.",
    queryCardTitle: "Căutare nouă de călătorie sigură",
    queryCardDesc: "Completați adresele și alegeți mijlocul de transport pentru a genera variantele optime de călătorie și prețurile",
    transportModeLabel: "Cu ce doriți să mergeți la această atracție? Alegeți transportul:",
    modes: { car: "Cu mașina 🚗", transit: "Transport public 🚌", motorcycle: "Cu motocicleta 🏍️", bike: "Cu bicicleta 🚲", walk: "Pe jos 🚶‍♂️" },
    startLabel: "Adresa de plecare / Punct de start:",
    startPlaceholder: "ex. Str. Linistii 15, Rotterdam",
    destLabel: "Destinație / Obiectiv turistic:",
    destPlaceholder: "ex. Piata Garii 12, Amsterdam Centraal",
    accessibilityTitle: "Opțiuni de accesibilitate și rampe",
    accessibilityDesc: "Prioritizează transportul cu podea joasă, lifturile din gări și asistența la îmbarcare.",
    searchBtn: "Caută rute sigure 🔍",
    timelineReady: "TRASEU PLANIFICAT CU SUCCES!",
    accessibilityActive: "Asistență pentru scaune rulante activă",
    searchAgain: "Caută din nou",
    selected: "SELECTAT ✓",
    select: "Selectează",
    itineraryTitle: "Desfășurătorul detaliat al călătoriei:",
    exportMaps: "Exportă în Google Maps 🗺️",
    supervisedNotice: "Traseu asistat de Tadzik. Prețurile includ reduceri pentru seniori.",
    totalEstimated: "Cost estimat total:",
    weatherTitle: "Prognoza meteo la destinație:",
    suitcaseTitle: "Valiza cu amintiri din călătorii",
    suitcaseDesc: "Traseul dumneavoastră este afișat pe fundalul abțibildurilor și ștampilelor adunate în călătoriile prin Europa!",
    passportBackdrop: "STICKERELE DUMNEAVOASTRĂ COLECTATE",
    option1Title: "Tren + Autobuz",
    option1Desc: "Opțiune regională confortabilă cu autobuz cu podea coborâtă și transfer direct la trenul IC.",
    option2Title: "Autobuz Expres + Tren",
    option2Desc: "Conexiune rapidă interurbană cu autocar confortabil și legătură directă la tren.",
    option3Title: "Tren direct cu asistență (Recomandat) ♿",
    option3Desc: "Traseu direct 100% fără trepte cu notificare automată pentru instalarea rampelor.",
    stepDeparture: (addr) => `Plecare de la adresa: ${addr}`,
    stepBus: "Autobuz urban cu podea joasă Linia 44 spre Gara Centrală",
    stepTrain: "Tren Intercity spre Amsterdam Centraal, Peronul 4",
    stepAssistedTransfer: "Transfer asistat de personalul gării (lifturi disponibile)",
    stepArrival: (addr) => `Sosire la destinație: ${addr}`,
    stepShuttle: "Autobuz Expres către terminalul central de transfer",
    stepCoach: "Autocar interurban cu asistență la urcare",
    stepSprinter: "Tren Sprinter spre destinație, Peronul 2",
    stepTram: "Tramvai cu podea coborâtă Linia 7 spre peroane",
    stepDirectTrain: "Tren InterCity Direct cu rampă (Peronul 11)",
    stepDirectArrival: (addr) => `Sosire în siguranță fără bariere la: ${addr}`
  },
  zh: {
    badge: "无障碍智能出行规划器",
    title: "安全无障碍路线规划 ♿",
    desc: "输入任何出发地和目的地，系统将智能规划自驾汽车、公共交通、摩托车、自行车或徒步路线组合，优先考虑无障碍设施、电梯与长者出行协助！",
    queryCardTitle: "新建点对点安全出行查询",
    queryCardDesc: "填写地址并选择交通工具即可生成完整的交通时刻表、无障碍指引与参考票价",
    transportModeLabel: "您希望乘坐何种交通工具前往该景点？请选择：",
    modes: { car: "自驾汽车 🚗", transit: "公共交通 🚌", motorcycle: "摩托车 🏍️", bike: "自行车 🚲", walk: "徒步步行 🚶‍♂️" },
    startLabel: "出发地 / 出发街道:",
    startPlaceholder: "例如：鹿特丹 和平路15号",
    destLabel: "目的地 / 景点:",
    destPlaceholder: "例如：阿姆斯特丹中央车站",
    accessibilityTitle: "无障碍协助与轮椅关怀选项",
    accessibilityDesc: "优先选择低地板公交、车站电梯、登车坡道及站务人员协助。",
    searchBtn: "查询安全出行路线 🔍",
    timelineReady: "安全出行路线规划完毕！",
    accessibilityActive: "轮椅与长者协助模式已开启",
    searchAgain: "重新查询",
    selected: "已选择 ✓",
    select: "选择",
    itineraryTitle: "详细换乘行程表:",
    exportMaps: "导出至谷歌地图 🗺️",
    supervisedNotice: "行程由 Tadzik 智能向导提供协助，票价已含长者优惠。",
    totalEstimated: "预计总费用:",
    weatherTitle: "目的地出游日天气预报:",
    suitcaseTitle: "旅行记忆纪念贴纸箱",
    suitcaseDesc: "您的安全路线将展示在您游历欧洲各国收集的纪念印章与贴纸背景之上！",
    passportBackdrop: "您的欧洲旅行纪念贴纸背景",
    option1Title: "火车 + 公交",
    option1Desc: "舒适的区域交通组合，低地板公交无缝衔接城际列车。",
    option2Title: "客运快线 + 火车",
    option2Desc: "长途快速客运联运，提供舒适空调长途客车并直通火车站。",
    option3Title: "直达列车+全程协助（强烈推荐）♿",
    option3Desc: "全流程无台阶直达路线，系统自动通知站台准备轮椅升降坡道。",
    stepDeparture: (addr) => `从出发地启程: ${addr}`,
    stepBus: "乘坐44路低地板无障碍城市公交开往中央火车站",
    stepTrain: "换乘城际特快列车前往阿姆斯特丹中央车站，4号站台",
    stepAssistedTransfer: "车站专人引导换乘（全程配备升降电梯与无障碍通道）",
    stepArrival: (addr) => `安全抵达目的地: ${addr}`,
    stepShuttle: "乘坐区域客运快线直达综合交通枢纽",
    stepCoach: "换乘城际长途空调客车（包含司机上车协助）",
    stepSprinter: "搭乘快线列车前往目的地，2号站台",
    stepTram: "乘坐7路低地板有轨电车前往火车站台",
    stepDirectTrain: "搭乘配备轮椅坡道的 InterCity Direct 特快列车（11号站台）",
    stepDirectArrival: (addr) => `无台阶顺利抵达终点站: ${addr}`
  }
};

export default function StationPlannerTab({ language, account }: StationPlannerTabProps) {
  const i18n = STATION_PLANNER_I18N[language] || STATION_PLANNER_I18N.en;

  // View state: 'international' (cross-border transit) or 'local' (single city/station routes)
  const [plannerView, setPlannerView] = useState<'international' | 'local'>('international');

  // Input states
  const [startStreet, setStartStreet] = useState('ul. Spokojna 15, Rotterdam');
  const [destPlace, setDestPlace] = useState('ul. Wiejska 12, Amsterdam Centraal');
  const [departureDate, setDepartureDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [departureTime, setDepartureTime] = useState('09:30');
  const [selectedTravelMode, setSelectedTravelMode] = useState<TravelMode>('transit');
  const [isAccessibleMode, setIsAccessibleMode] = useState(true);
  const [isTripSearched, setIsTripSearched] = useState(false);
  const [selectedTransitOption, setSelectedTransitOption] = useState<number>(0);

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

  // Pre-configured stickers representing past travels
  const defaultStickers = [
    { name: "Rotterdam Centraal ⚓", color: "from-amber-400 to-orange-500", text: "NL 🇳🇱", rot: "-rotate-6", x: "top-2 left-6" },
    { name: "Amsterdam Canals 🛶", color: "from-blue-500 to-indigo-600", text: "NL 🇳🇱", rot: "rotate-12", x: "bottom-4 left-10" },
    { name: "Utrecht Tower 🔔", color: "from-emerald-500 to-teal-600", text: "NL 🇳🇱", rot: "-rotate-12", x: "top-4 right-12" },
    { name: "Brussels Chocolate 🍫", color: "from-amber-600 to-amber-800", text: "BE 🇧🇪", rot: "rotate-6", x: "bottom-6 right-8" },
    { name: "Bruges Romance 🏰", color: "from-pink-500 to-rose-600", text: "BE 🇧🇪", rot: "-rotate-3", x: "top-1/3 left-1/3" },
    { name: "Ghent Castle 🛡️", color: "from-purple-500 to-violet-600", text: "BE 🇧🇪", rot: "rotate-3", x: "bottom-1/3 right-1/3" }
  ];

  // Merge default stickers and actual passport stamps collected by user
  const collectedStamps = (account?.collectedStamps || []).map((stampId, index) => ({
    name: `${stampId} ★`,
    color: index % 2 === 0 ? "from-cyan-500 to-blue-600" : "from-fuchsia-500 to-purple-600",
    text: "PASSPORT ✔️",
    rot: index % 2 === 0 ? "rotate-8" : "-rotate-8",
    x: `top-${12 + (index * 8)} left-${24 + (index * 12)}`
  }));

  const allStickers = [...defaultStickers, ...collectedStamps];

  // Google Maps Directions link generator
  const getGoogleMapsUrl = () => {
    const modeParam = selectedTravelMode === 'car' ? 'driving' :
      selectedTravelMode === 'transit' ? 'transit' :
      selectedTravelMode === 'motorcycle' ? 'two_wheeler' :
      selectedTravelMode === 'bike' ? 'bicycling' : 'walking';
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startStreet)}&destination=${encodeURIComponent(destPlace)}&travelmode=${modeParam}`;
  };

  // Dynamic Travel options generated based on chosen travel mode
  const getTravelOptionsForMode = () => {
    switch (selectedTravelMode) {
      case 'car':
        return [
          {
            title: language === 'pl' ? 'Autostrada A-Road + Parking P+R' : 'High-Speed Highway + P+R Parking',
            type: "car-highway",
            desc: language === 'pl' ? 'Najszybszy dojazd drogami ekspresowymi z zarezerwowanym miejscem parkingowym P+R przy wejściu.' : 'Direct motorway route with guarded P+R parking bays.',
            duration: "45 minut",
            totalPrice: 8.50,
            steps: [
              { time: "08:30", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "08:35", action: language === 'pl' ? 'Wyjazd na obwodnicę i autostradę A4 / A13 (Płynny ruch)' : 'Enter Highway A4/A13', icon: Car, cost: "€5.50 paliwo" },
              { time: "09:05", action: language === 'pl' ? 'Wjazd na dedykowany parking P+R przy atrakcji' : 'Enter P+R Parking at destination', icon: Check, cost: "€3.00" },
              { time: "09:15", action: i18n.stepArrival(destPlace), icon: MapPin }
            ]
          },
          {
            title: language === 'pl' ? 'Malownicza Trasa Krajoznawcza N-Road' : 'Scenic Countryside N-Road',
            type: "car-scenic",
            desc: language === 'pl' ? 'Piękna, relaksująca trasa przez zielone tereny, wiatraki i wioski z postojem na kawę.' : 'Scenic rural route avoiding tolls and highways.',
            duration: "1h 05m",
            totalPrice: 6.20,
            steps: [
              { time: "09:00", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "09:15", action: language === 'pl' ? 'Trasa N209 wzdłuż kanałów i zabytkowych wiatraków' : 'Drive via scenic canal road N209', icon: Car, cost: "€6.20 paliwo" },
              { time: "09:50", action: language === 'pl' ? 'Krótki postój krajoznawczy w punkcie widokowym' : 'Scenic rest stop', icon: Info },
              { time: "10:05", action: i18n.stepArrival(destPlace), icon: MapPin }
            ]
          },
          {
            title: language === 'pl' ? 'Dojazd Bezpośredni z Miejscem dla Niepełnosprawnych ♿' : 'Accessible Drive with Reserved Disabled Bay ♿',
            type: "car-accessible",
            desc: language === 'pl' ? 'Dojazd pod samo wejście główne z obniżonym krawężnikiem i asystą parkingową.' : 'Direct entrance drop-off with wheelchair assistance.',
            duration: "48 minut",
            totalPrice: 6.50,
            steps: [
              { time: "09:15", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "09:20", action: language === 'pl' ? 'Dojazd z asystą GPS Tadzika do strefy Kiss&Ride / Niepełnosprawni' : 'GPS navigation to accessible drop-off zone', icon: Car, cost: "€6.50" },
              { time: "09:55", action: language === 'pl' ? 'Parkowanie na bezpłatnym szerokim stanowisku dla niepełnosprawnych' : 'Park at reserved disabled parking stall', icon: ShieldCheck, cost: "€0" },
              { time: "10:03", action: i18n.stepArrival(destPlace), icon: MapPin }
            ]
          }
        ];

      case 'motorcycle':
        return [
          {
            title: language === 'pl' ? 'Trasa Motocyklowa Krajoznawcza (Zakręty i Widoki) 🏍️' : 'Scenic Motorcycle Cruise 🏍️',
            type: "moto-scenic",
            desc: language === 'pl' ? 'Wyselekcjonowana przez motocyklistów trasa z doskonałym asfaltem, malowniczymi zakrętami i darmowym parkingiem dla jednośladów.' : 'Curated twisty route with smooth tarmac, scenic views and free moto bays.',
            duration: "38 minut",
            totalPrice: 2.80,
            steps: [
              { time: "09:00", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "09:10", action: language === 'pl' ? 'Płynna jazda drogami krajobrazowymi N-wegen z widokiem na rzekę' : 'Ride along scenic river N-roads', icon: Gauge, cost: "€2.80 paliwo" },
              { time: "09:32", action: language === 'pl' ? 'Darmowe dedykowane stanowisko dla motocykli + zamykane szafki na kaski' : 'Free dedicated motorcycle stall & helmet lockers', icon: Check, cost: "€0" },
              { time: "09:38", action: i18n.stepArrival(destPlace), icon: MapPin }
            ]
          },
          {
            title: language === 'pl' ? 'Ekspresowy Przelot Moto' : 'Express Motorcycle Transit',
            type: "moto-express",
            desc: language === 'pl' ? 'Szybka i bezpośrednia trasa obwodnicą pozwalająca ominąć wszelkie miejskie korki.' : 'Fast bypass route with lane-filtering convenience.',
            duration: "28 minut",
            totalPrice: 3.10,
            steps: [
              { time: "08:45", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "08:50", action: language === 'pl' ? 'Szybki przelot trasą dwujezdniową A20' : 'Bypass ride on A20', icon: Gauge, cost: "€3.10 paliwo" },
              { time: "09:10", action: language === 'pl' ? 'Wjazd na bezpłatny parking dla jednośladów' : 'Free motorcycle parking arrival', icon: Check, cost: "€0" },
              { time: "09:13", action: i18n.stepArrival(destPlace), icon: MapPin }
            ]
          },
          {
            title: language === 'pl' ? 'Trasa Moto-Wyprawowa ze Zwiedzaniem' : 'Moto Sightseeing Tour',
            type: "moto-tour",
            desc: language === 'pl' ? 'Trasa turystyczna przez historyczne groble i miasteczka z punktami foto.' : 'Touring ride through historical dikes and villages.',
            duration: "52 minuty",
            totalPrice: 3.50,
            steps: [
              { time: "10:00", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "10:15", action: language === 'pl' ? 'Przejazd przez zabytkową groblę z panoramicznym widokiem' : 'Ride scenic historical dike', icon: Gauge, cost: "€3.50" },
              { time: "10:45", action: language === 'pl' ? 'Zabezpieczone stanowisko moto przy głównym dziedzińcu' : 'Secure moto bay at main courtyard', icon: ShieldCheck },
              { time: "10:52", action: i18n.stepArrival(destPlace), icon: MapPin }
            ]
          }
        ];

      case 'bike':
        return [
          {
            title: language === 'pl' ? 'Wydzielona Ścieżka Rowerowa Fietspad (Zieleń & Natura) 🚲' : 'Dedicated Bike Path Fietspad 🚲',
            type: "bike-nature",
            desc: language === 'pl' ? 'W 100% asfaltowa, płaska i odseparowana od aut holenderska ścieżka rowerowa wzdłuż kanałów.' : '100% flat, paved and isolated bike lane along greenery.',
            duration: "42 minuty",
            totalPrice: 0.00,
            steps: [
              { time: "09:00", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "09:08", action: language === 'pl' ? 'Wjazd na bezkolizyjną ścieżkę rowerową Fietspad LF-Route' : 'Join traffic-free Fietspad cycling artery', icon: Bike, cost: "€0" },
              { time: "09:35", action: language === 'pl' ? 'Zadaszony stojak rowerowy z ładowarką e-bike przy wejściu' : 'Covered bike rack with e-bike charging station', icon: Check, cost: "€0" },
              { time: "09:42", action: i18n.stepArrival(destPlace), icon: MapPin }
            ]
          },
          {
            title: language === 'pl' ? 'Szybka Magistrala Rowerowa Snelfietsroute (E-Bike)' : 'Fast Cycling Highway (Snelfietsroute)',
            type: "bike-fast",
            desc: language === 'pl' ? 'Szeroka magistrala rowerowa z pierwszeństwem przejazdu na skrzyżowaniach.' : 'Express cycle highway with intersection priority.',
            duration: "25 minut (E-Bike) / 35 min",
            totalPrice: 0.00,
            steps: [
              { time: "08:30", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "08:35", action: language === 'pl' ? 'Jazda magistralą rowerową Snelfietsroute F15' : 'Ride on Snelfietsroute F15 expressway', icon: Bike, cost: "€0" },
              { time: "09:00", action: language === 'pl' ? 'Bezpieczny parking rowerowy przy recepcji' : 'Secure bike parking at reception', icon: ShieldCheck },
              { time: "09:05", action: i18n.stepArrival(destPlace), icon: MapPin }
            ]
          },
          {
            title: language === 'pl' ? 'Rower + Pociąg (Wagon Rowerowy NS)' : 'Bike + Train Rail Hybrid',
            type: "bike-train",
            desc: language === 'pl' ? 'Dojazd rowerem na dworzec, przejazd pociągiem z rowerem i krótki finisz na dwóch kółkach.' : 'Cycle to station, take train with bike in dedicated car.',
            duration: "32 minuty",
            totalPrice: 7.50,
            steps: [
              { time: "09:10", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "09:18", action: language === 'pl' ? 'Wjazd rowerem do wagonu rowerowego pociągu NS' : 'Board train bike compartment (low-floor)', icon: Train, cost: "€7.50" },
              { time: "09:35", action: language === 'pl' ? 'Zjazd z peronu windą rowerową' : 'Alight and take station bike ramp/lift', icon: Bike },
              { time: "09:42", action: i18n.stepArrival(destPlace), icon: MapPin }
            ]
          }
        ];

      case 'walk':
        return [
          {
            title: language === 'pl' ? 'Spacer Krajoznawczy Bulwarami i Parkami 🚶‍♂️' : 'Scenic Walking Promenade 🚶‍♂️',
            type: "walk-parks",
            desc: language === 'pl' ? 'Piękny, łagodny spacer po płaskich chodnikach przez parki i aleje z ławeczkami co 80 metrów.' : 'Flat pedestrian promenade through leafy parks with resting benches.',
            duration: "35 minut (spokojny chód)",
            totalPrice: 0.00,
            steps: [
              { time: "09:30", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "09:40", action: language === 'pl' ? 'Spacer zabytkową aleją lipową z cieniem i ławkami' : 'Stroll via shaded tree-lined avenue with benches', icon: Footprints, cost: "€0" },
              { time: "09:58", action: language === 'pl' ? 'Przejście bezpieczną kładką pieszą nad kanałem' : 'Cross scenic pedestrian bridge', icon: Footprints },
              { time: "10:05", action: i18n.stepArrival(destPlace), icon: MapPin }
            ]
          },
          {
            title: language === 'pl' ? 'Krótki Trakt Miejski z Chodnikami' : 'Direct Urban Pedestrian Route',
            type: "walk-direct",
            desc: language === 'pl' ? 'Najkrótsza trasa piesza z doskonałym oświetleniem i przejściami dla pieszych z sygnalizacją dźwiękową.' : 'Direct sidewalk route with audible pedestrian crossings.',
            duration: "25 minut",
            totalPrice: 0.00,
            steps: [
              { time: "10:00", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "10:08", action: language === 'pl' ? 'Przejście szerokim chodnikiem miejskim bez barier' : 'Walk on broad barrier-free pavement', icon: Footprints, cost: "€0" },
              { time: "10:22", action: language === 'pl' ? 'Bezpieczne przejście z sygnalizacją dla seniorów' : 'Cross at pedestrian signal zone', icon: Check },
              { time: "10:25", action: i18n.stepArrival(destPlace), icon: MapPin }
            ]
          },
          {
            title: language === 'pl' ? 'Trasa Piesza w 100% Bezbarierowa ♿' : '100% Step-Free Accessible Walk ♿',
            type: "walk-accessible",
            desc: language === 'pl' ? 'Całkowity brak schodów, krawężników i progów. Łagodne zjazdy przystosowane dla wózków inwalidzkich i chodzików.' : 'Zero stairs, gentle ramp kerbs and wide level walkways.',
            duration: "30 minut",
            totalPrice: 0.00,
            steps: [
              { time: "09:15", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "09:25", action: language === 'pl' ? 'Trakt z łagodnymi rampami zamiast schodów' : 'Walk via ramped step-free sidewalks', icon: ShieldCheck, cost: "€0" },
              { time: "09:40", action: language === 'pl' ? 'Przejście przez automatyczne drzwi wejściowe na poziomie 0' : 'Level-ground automatic entrance arrival', icon: Check },
              { time: "09:45", action: i18n.stepArrival(destPlace), icon: MapPin }
            ]
          }
        ];

      default: // 'transit'
        return [
          {
            title: i18n.option1Title,
            type: "train-bus",
            desc: i18n.option1Desc,
            duration: "1h 35m",
            totalPrice: 18.20,
            steps: [
              { time: "08:15", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "08:35", action: i18n.stepBus, icon: Bus, cost: "€3.40" },
              { time: "08:52", action: i18n.stepTrain, icon: Train, cost: "€14.80" },
              { time: "09:32", action: i18n.stepAssistedTransfer, icon: Info },
              { time: "09:50", action: i18n.stepArrival(destPlace), icon: MapPin }
            ]
          },
          {
            title: i18n.option2Title,
            type: "coach-train",
            desc: i18n.option2Desc,
            duration: "2h 10m",
            totalPrice: 24.50,
            steps: [
              { time: "11:20", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "11:45", action: i18n.stepShuttle, icon: Bus, cost: "€4.50" },
              { time: "12:30", action: i18n.stepCoach, icon: Bus, cost: "€12.00" },
              { time: "13:15", action: i18n.stepSprinter, icon: Train, cost: "€8.00" },
              { time: "13:45", action: i18n.stepArrival(destPlace), icon: MapPin }
            ]
          },
          {
            title: i18n.option3Title,
            type: "accessible-direct",
            desc: i18n.option3Desc,
            duration: "1h 15m",
            totalPrice: 21.50,
            steps: [
              { time: "09:10", action: i18n.stepDeparture(startStreet), icon: MapPin },
              { time: "09:25", action: i18n.stepTram, icon: Bus, cost: "€3.00" },
              { time: "09:40", action: i18n.stepDirectTrain, icon: Train, cost: "€18.50" },
              { time: "10:25", action: i18n.stepDirectArrival(destPlace), icon: MapPin }
            ]
          }
        ];
    }
  };

  const travelOptions = getTravelOptionsForMode();

  return (
    <div className="space-y-8 max-w-5xl mx-auto" id="station-planner-tab-main">
      
      {/* Title block */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-emerald-700/50 relative overflow-hidden">
        <div className="absolute right-4 bottom-[-20px] text-8xl opacity-15 pointer-events-none select-none">♿</div>
        <div className="relative z-10 space-y-2">
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
            {i18n.badge}
          </span>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <span>{i18n.title}</span>
          </h2>
          <p className="text-emerald-100 font-semibold text-sm md:text-base leading-relaxed max-w-3xl">
            {i18n.desc}
          </p>

          <div className="pt-2">
            <SectionTravelCompanion language={language} vehicle="train" />
          </div>
        </div>
      </div>

      {/* View Switcher: International & Domestic Transit Hub vs Local Station Planner */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-300 flex flex-col sm:flex-row gap-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setPlannerView('international')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
            plannerView === 'international'
              ? 'bg-indigo-900 text-white shadow-md scale-101 border border-indigo-700'
              : 'text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Train className="w-4 h-4 text-amber-400" />
          <span>
            {language === 'pl' 
              ? '🚆 Pociągi Krajowe & Międzynarodowe (PL 🇵🇱, NL 🇳🇱, DE 🇩🇪, BE 🇧🇪, FR 🇫🇷)' 
              : '🚆 National & Cross-Country Rail (PL 🇵🇱, NL 🇳🇱, DE 🇩🇪, BE 🇧🇪, FR 🇫🇷)'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setPlannerView('local')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
            plannerView === 'local'
              ? 'bg-emerald-800 text-white shadow-md scale-101 border border-emerald-600'
              : 'text-slate-700 hover:bg-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-300" />
          <span>
            {language === 'pl' 
              ? '📍 Lokalny Planer Przejazdów & Stacji' 
              : '📍 Local Station & City Route Planner'}
          </span>
        </button>
      </div>

      {/* Conditionally render International Transit Coordinator or Local Planner */}
      {plannerView === 'international' ? (
        <InternationalTransitCoordinator language={language} account={account} />
      ) : (
        <>
          {!isTripSearched ? (
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6" id="planner-search-card">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 text-indigo-900 rounded-2xl">
                <Compass className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950 tracking-tight">
                  {i18n.queryCardTitle}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {i18n.queryCardDesc}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const temp = startStreet;
                setStartStreet(destPlace);
                setDestPlace(temp);
              }}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 self-start sm:self-auto"
              title="Zamień miejsca Skąd i Dokąd"
            >
              <span className="text-sm font-black">⇄</span>
              <span>{language === 'pl' ? 'Zamień Miejsca' : 'Swap Places'}</span>
            </button>
          </div>

          {/* Transport Mode Choice - 5 Options: Car, Transit, Motorcycle, Bike, Walk */}
          <div className="space-y-2.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
            <label className="block text-slate-900 font-black text-xs uppercase tracking-wider">
              {i18n.transportModeLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { mode: 'car' as const, label: i18n.modes.car, emoji: '🚗', icon: Car },
                { mode: 'transit' as const, label: i18n.modes.transit, emoji: '🚌', icon: Bus },
                { mode: 'motorcycle' as const, label: i18n.modes.motorcycle, emoji: '🏍️', icon: Gauge },
                { mode: 'bike' as const, label: i18n.modes.bike, emoji: '🚲', icon: Bike },
                { mode: 'walk' as const, label: i18n.modes.walk, emoji: '🚶‍♂️', icon: Footprints }
              ].map((item) => {
                const isSelected = selectedTravelMode === item.mode;
                return (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setSelectedTravelMode(item.mode)}
                    id={`planner-mode-btn-${item.mode}`}
                    className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-900 text-white border-indigo-950 shadow-md scale-102 font-black ring-4 ring-indigo-500/10'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl select-none leading-none">{item.emoji}</span>
                    <span className="text-center text-[11px] leading-tight mt-0.5">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* WAYPOINT INPUTS: CONNECTED ROUTE (A ➔ B) */}
          <div className="relative bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 sm:p-6 space-y-4">
            
            {/* Vertical Connector Line */}
            <div className="absolute left-9 top-14 bottom-14 w-0.5 border-l-2 border-dashed border-indigo-400/80 hidden sm:block pointer-events-none" />

            {/* 1. Start Location (Skąd) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 relative">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-600/20 shrink-0">
                  A
                </div>
                <div className="sm:w-28 shrink-0">
                  <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 block">
                    {language === 'pl' ? 'PUNKT STARTU' : 'START POINT'}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {language === 'pl' ? 'Skąd wyruszasz:' : 'From:'}
                  </span>
                </div>
              </div>

              <div className="flex-1 relative">
                <input
                  id="start-street-input"
                  type="text"
                  value={startStreet}
                  onChange={(e) => setStartStreet(e.target.value)}
                  placeholder={i18n.startPlaceholder}
                  className="w-full text-sm sm:text-base font-bold py-3.5 px-4 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all shadow-2xs"
                />
                {startStreet && (
                  <button
                    type="button"
                    onClick={() => setStartStreet('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs p-1"
                    title="Wyczyść"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStartStreet(language === 'pl' ? 'Moja bieżąca lokalizacja (GPS)' : 'Current GPS Location')}
                className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-indigo-700 text-xs font-bold px-3 py-3 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>📍</span>
                <span className="hidden lg:inline">{language === 'pl' ? 'Moja Lokalizacja' : 'My GPS'}</span>
              </button>
            </div>

            {/* 2. Destination Location (Dokąd) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 relative pt-1">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-600/20 shrink-0">
                  B
                </div>
                <div className="sm:w-28 shrink-0">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 block">
                    {language === 'pl' ? 'CEL PODRÓŻY' : 'DESTINATION'}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {language === 'pl' ? 'Dokąd jedziesz:' : 'To:'}
                  </span>
                </div>
              </div>

              <div className="flex-1 relative">
                <input
                  id="dest-place-input"
                  type="text"
                  value={destPlace}
                  onChange={(e) => setDestPlace(e.target.value)}
                  placeholder={i18n.destPlaceholder}
                  className="w-full text-sm sm:text-base font-bold py-3.5 px-4 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all shadow-2xs"
                />
                {destPlace && (
                  <button
                    type="button"
                    onClick={() => setDestPlace('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs p-1"
                    title="Wyczyść"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setDestPlace(language === 'pl' ? 'Dworzec Główny Centraal' : 'Central Station')}
                className="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-emerald-700 text-xs font-bold px-3 py-3 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>🏛️</span>
                <span className="hidden lg:inline">{language === 'pl' ? 'Dworzec Główny' : 'Central Station'}</span>
              </button>
            </div>

          </div>

          {/* 3. DATE & TIME OF DEPARTURE & QUICK PRESETS (KIEDY I O KTÓREJ GODZINIE) */}
          <div className="bg-amber-50/60 rounded-2xl border-2 border-amber-200/80 p-4 sm:p-5 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              {/* RAMKA: DATA PODRÓŻY */}
              <div className="bg-white rounded-xl border border-amber-300 p-3.5 space-y-2.5 min-w-0 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg shrink-0">
                      <Calendar className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-950 block truncate">
                        {language === 'pl' ? 'Data wyjazdu (Kiedy):' : 'Departure Date:'}
                      </span>
                      <span className="text-[10px] text-amber-800 font-medium block truncate">
                        {language === 'pl' ? 'Dzień rozpoczęcia podróży' : 'Select travel date'}
                      </span>
                    </div>
                  </div>

                  <input
                    type="date"
                    value={departureDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full sm:w-auto text-xs sm:text-sm font-black font-mono py-2 px-3 bg-amber-50/60 border-2 border-amber-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-2xs"
                  />
                </div>

                {/* Szybkie przyciski dnia */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-amber-100">
                  <button
                    type="button"
                    onClick={() => setDepartureDate(new Date().toISOString().split('T')[0])}
                    className="px-2.5 py-1 bg-amber-100/80 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-lg text-xs font-black transition-all cursor-pointer shadow-2xs"
                  >
                    📅 {language === 'pl' ? 'Dzisiaj' : 'Today'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const tmrw = new Date();
                      tmrw.setDate(tmrw.getDate() + 1);
                      setDepartureDate(tmrw.toISOString().split('T')[0]);
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    🌅 {language === 'pl' ? 'Jutro' : 'Tomorrow'}
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
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    🏖️ {language === 'pl' ? 'Weekend' : 'Weekend'}
                  </button>
                </div>
              </div>

              {/* RAMKA: GODZINA WYJAZDU */}
              <div className="bg-white rounded-xl border border-amber-300 p-3.5 space-y-2.5 min-w-0 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg shrink-0">
                      <Clock className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-950 block truncate">
                        {language === 'pl' ? 'Godzina wyjazdu:' : 'Departure Time:'}
                      </span>
                      <span className="text-[10px] text-amber-800 font-medium block truncate">
                        {language === 'pl' ? 'Godzina rozpoczęcia trasy' : 'Select start time'}
                      </span>
                    </div>
                  </div>

                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full sm:w-auto text-xs sm:text-sm font-black font-mono py-2 px-3 bg-amber-50/60 border-2 border-amber-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-2xs"
                  />
                </div>

                {/* Szybkie przyciski godziny */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-amber-100">
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const hh = String(now.getHours()).padStart(2, '0');
                      const mm = String(now.getMinutes()).padStart(2, '0');
                      setDepartureTime(`${hh}:${mm}`);
                    }}
                    className="px-2.5 py-1 bg-amber-500 text-slate-950 rounded-lg text-xs font-black transition-all cursor-pointer shadow-xs"
                  >
                    ⚡ {language === 'pl' ? 'Teraz' : 'Now'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepartureTime(addMinutesToTime(departureTime || '09:00', 15))}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    +15 min
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepartureTime(addMinutesToTime(departureTime || '09:00', 30))}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    +30 min
                  </button>
                  {['09:00', '12:00', '15:00'].map((timePreset) => (
                    <button
                      key={timePreset}
                      type="button"
                      onClick={() => setDepartureTime(timePreset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
                        departureTime === timePreset
                          ? 'bg-amber-400 text-slate-950 font-black border-amber-500'
                          : 'bg-white hover:bg-amber-100 text-amber-950 border-amber-300'
                      }`}
                    >
                      {timePreset}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Accessibility Option Checklist Toggle */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5 select-none">♿</span>
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  {i18n.accessibilityTitle}
                </h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  {i18n.accessibilityDesc}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAccessibleMode(!isAccessibleMode)}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer ${
                isAccessibleMode ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
              type="button"
              aria-label="Toggle accessibility planning mode"
            >
              <span className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
                isAccessibleMode ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Search Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (startStreet.trim() && destPlace.trim()) {
                  setIsTripSearched(true);
                }
              }}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 hover:from-emerald-700 hover:to-indigo-800 text-white font-black text-base sm:text-lg py-4 px-6 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-3 border border-emerald-400/40 hover:scale-[1.01] active:scale-98"
              id="search-route-submit-btn"
            >
              <Compass className="w-6 h-6 stroke-[2.5]" />
              <span>{language === 'pl' ? 'WYZNACZ TRASĘ I POKAŻ POŁĄCZENIA 🧭' : i18n.searchBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Results Section - "na tle naklejek zebranych w czasie podróżowania gdzie się już było" */
        <div className="space-y-6" id="planner-results-card">
          
          <div className="relative bg-slate-900 text-white rounded-3xl border-4 border-slate-950 p-5 md:p-8 shadow-2xl overflow-hidden min-h-[480px]">
            
            {/* Visual background collage of travel stickers ("na tle zebranych naklejek") */}
            <div className="absolute inset-0 opacity-15 pointer-events-none select-none overflow-hidden" id="collected-stickers-collage-bg">
              <div className="absolute text-[9px] uppercase font-black text-emerald-400 tracking-widest top-4 left-4 border border-emerald-500/20 px-2 py-0.5 rounded bg-slate-950/40">
                {i18n.passportBackdrop}
              </div>
              <div className="absolute inset-0 flex flex-wrap justify-between p-12 items-center gap-10">
                {allStickers.map((sticker, idx) => (
                  <div
                    key={idx}
                    className={`w-28 h-28 rounded-full border-2 border-dashed border-white/60 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br ${sticker.color} ${sticker.rot} shadow-2xl shrink-0`}
                  >
                    <span className="text-[8px] font-black tracking-widest uppercase text-white/90">{sticker.text}</span>
                    <span className="text-[10px] font-black truncate w-full block mt-1 text-white">{sticker.name}</span>
                    <span className="text-[7px] font-bold text-amber-300 mt-0.5">★ COLLECTED ★</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Results Header Content */}
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  {i18n.timelineReady}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white mt-1 leading-snug">
                  {startStreet} ➔ {destPlace}
                </h3>
                {isAccessibleMode && (
                  <span className="inline-flex items-center gap-1 bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold mt-1.5">
                    ♿ {i18n.accessibilityActive}
                  </span>
                )}
              </div>

              {/* Reset button */}
              <button
                onClick={() => setIsTripSearched(false)}
                className="bg-slate-800 hover:bg-slate-700 active:bg-slate-650 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{i18n.searchAgain}</span>
              </button>
            </div>

            {/* Travel modes horizontal chooser */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 pt-5">
              {travelOptions.map((option, idx) => {
                const isSelected = selectedTransitOption === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedTransitOption(idx)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-40 ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 text-white shadow-lg shadow-amber-400/5 scale-102'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xl">
                          {option.type === 'train-bus' ? '🚆🚌' : option.type === 'plane-train' ? '✈️🚆' : '🚆♿'}
                        </span>
                        <span className="font-mono font-black text-amber-400 text-lg bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          €{option.totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white mt-2 leading-tight">
                        {option.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                        {option.desc}
                      </p>
                    </div>
                    <div className="flex justify-between items-center w-full border-t border-slate-800 pt-2 text-[10px] font-bold text-slate-400">
                      <span>⏱️ {option.duration}</span>
                      <span className="text-amber-400 font-extrabold">
                        {isSelected ? i18n.selected : i18n.select}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Route Detailed Itinerary */}
            <div className="relative z-10 mt-6 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800 p-5 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-900 pb-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
                  <h4 className="font-extrabold text-white text-base">
                    {i18n.itineraryTitle}
                  </h4>
                </div>

                {/* Google Maps link */}
                <a
                  href={getGoogleMapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-emerald-500 transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-102"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>{i18n.exportMaps}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Steps timeline graphic */}
              <div className="space-y-6 pl-4 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {travelOptions[selectedTransitOption].steps.map((step, sIdx) => {
                  return (
                    <div key={sIdx} className="flex gap-4 items-start relative z-10 group">
                      {/* Timeline point */}
                      <div className="w-5.5 h-5.5 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-amber-400 text-xs shrink-0 mt-1 shadow-md group-hover:scale-110 transition-transform">
                        {sIdx === 0 ? 'A' : sIdx === travelOptions[selectedTransitOption].steps.length - 1 ? 'B' : '•'}
                      </div>

                      {/* Time Indicator */}
                      <span className="font-mono font-black text-xs text-amber-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded shrink-0 mt-0.5">
                        {step.time}
                      </span>

                      {/* Action details */}
                      <div className="flex-1 bg-slate-900/65 border border-slate-800 p-3 rounded-xl flex justify-between items-center gap-2">
                        <p className="text-xs font-bold text-slate-100 leading-relaxed">
                          {step.action}
                        </p>
                        {step.cost && (
                          <span className="font-mono font-black text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                            {step.cost}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Summary Footer */}
              <div className="border-t border-slate-900 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-bold text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>
                    {i18n.supervisedNotice}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{i18n.totalEstimated}</span>
                  <span className="text-base font-black text-amber-400">
                    €{travelOptions[selectedTransitOption].totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Embedded In-App Interactive Google Maps Navigation */}
          <div className="pt-2">
            <InAppGoogleMapRoute
              destination={destPlace}
              destinationTitle={destPlace}
              initialStartLocation={startStreet}
              initialTravelMode={selectedTravelMode}
              language={language}
              autoStartNav={false}
            />
          </div>

          {/* DEDICATED SIGHTSEEING WEATHER FORECAST FOR THE DESTINATION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>🌤️</span>
                <span>{i18n.weatherTitle}</span>
              </h3>
            </div>
            <SightseeingWeatherCard
              city={destPlace.includes('Amsterdam') ? 'Amsterdam' : destPlace.includes('Rotterdam') ? 'Rotterdam' : destPlace.includes('Utrecht') ? 'Utrecht' : destPlace.includes('Haag') ? 'Den Haag' : destPlace.includes('Bruksela') || destPlace.includes('Brussels') ? 'Brussels' : destPlace.includes('Kraków') || destPlace.includes('Krakow') ? 'Kraków' : destPlace.includes('Warszawa') || destPlace.includes('Warsaw') ? 'Warszawa' : 'Rotterdam'}
              language={language}
              attractionName={destPlace}
            />
          </div>

          {/* Interactive sticker album quick summary widget for senior reassurance */}
          <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl flex items-start gap-3">
            <span className="text-2xl mt-0.5 select-none">🎒</span>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-amber-900">
                {i18n.suitcaseTitle}
              </h4>
              <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                {i18n.suitcaseDesc}
              </p>
            </div>
          </div>

        </div>
      )}
        </>
      )}

    </div>
  );
}
