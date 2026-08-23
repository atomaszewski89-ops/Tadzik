import { Language } from '../types';

export type TransportType = 'train' | 'tram' | 'bus' | 'metro';
export type EuropeanCountry = 'NL' | 'PL' | 'DE' | 'BE' | 'FR';

export interface IntermediateStop {
  stationName: string;
  time: string;
  platform?: string;
  isAccessible: boolean;
  notes?: string;
}

export interface TimetableDeparture {
  id: string;
  time: string;
  delayMins: number; // 0 = on time
  line: string;
  type: TransportType;
  destination: string;
  origin?: string;
  carrier: string;
  carrierCountry: EuropeanCountry;
  carrierFlag: string;
  platform: string;
  accessibility: {
    stepFree: boolean;
    lowFloor: boolean;
    hasElevator: boolean;
    prioritySeats: boolean;
    restroomPRM?: boolean;
    diningCar?: boolean;
    wifi230V?: boolean;
  };
  ticketInfo: {
    systemName: string;
    howToPay: string;
    seniorDiscount: string;
    estimatedPriceEur?: number;
  };
  stops: IntermediateStop[];
}

export interface StationBoard {
  stationName: string;
  city: string;
  country: EuropeanCountry;
  countryFlag: string;
  currentTime: string;
  departures: TimetableDeparture[];
  arrivals: TimetableDeparture[];
}

// Pre-configured rich timetable database for key European transit stations
export const SAMPLE_STATION_BOARDS: Record<string, StationBoard> = {
  'roosendaal': {
    stationName: 'Roosendaal Centraal',
    city: 'Roosendaal',
    country: 'NL',
    countryFlag: '🇳🇱',
    currentTime: '09:15',
    departures: [
      {
        id: 'rd-01',
        time: '09:20',
        delayMins: 0,
        line: 'NS Intercity (IC 2200)',
        type: 'train',
        destination: 'Amsterdam Centraal via Dordrecht, Rotterdam, Schiphol',
        origin: 'Vlissingen',
        carrier: 'NS (Nederlandse Spoorwegen)',
        carrierCountry: 'NL',
        carrierFlag: '🇳🇱',
        platform: 'Peron 1a',
        accessibility: {
          stepFree: true,
          lowFloor: true,
          hasElevator: true,
          prioritySeats: true,
          restroomPRM: true,
          wifi230V: true
        },
        ticketInfo: {
          systemName: 'System OVpay (Holandia)',
          howToPay: 'Przyłóż kartę płatniczą lub bilet NS z kodem QR do czytnika na peronie (Check-In).',
          seniorDiscount: 'Ulga senioralna NS 60+ / Zniżka weekendowa i poza szczytem',
          estimatedPriceEur: 18.50
        },
        stops: [
          { stationName: 'Roosendaal', time: '09:20', platform: '1a', isAccessible: true },
          { stationName: 'Dordrecht', time: '09:42', platform: '3', isAccessible: true },
          { stationName: 'Rotterdam Centraal', time: '09:56', platform: '4', isAccessible: true, notes: 'Węzeł przesiadkowy i metro RET' },
          { stationName: 'Delft', time: '10:09', platform: '1', isAccessible: true },
          { stationName: 'Den Haag HS', time: '10:18', platform: '3', isAccessible: true },
          { stationName: 'Leiden Centraal', time: '10:31', platform: '5', isAccessible: true },
          { stationName: 'Schiphol Airport', time: '10:48', platform: '1-2', isAccessible: true },
          { stationName: 'Amsterdam Centraal', time: '11:04', platform: '2b', isAccessible: true }
        ]
      },
      {
        id: 'rd-02',
        time: '09:32',
        delayMins: 0,
        line: 'NS Sprinter (SPR 5100)',
        type: 'train',
        destination: 'Breda ➔ Tilburg ➔ Den Bosch',
        origin: 'Roosendaal',
        carrier: 'NS (Nederlandse Spoorwegen)',
        carrierCountry: 'NL',
        carrierFlag: '🇳🇱',
        platform: 'Peron 2',
        accessibility: {
          stepFree: true,
          lowFloor: true,
          hasElevator: true,
          prioritySeats: true,
          restroomPRM: true
        },
        ticketInfo: {
          systemName: 'System OVpay (Holandia)',
          howToPay: 'Karta debetowa/kredytowa VISA/Mastercard lub smartfon (Check-In).',
          seniorDiscount: 'Automatyczna taryfa senioralna',
          estimatedPriceEur: 6.80
        },
        stops: [
          { stationName: 'Roosendaal', time: '09:32', platform: '2', isAccessible: true },
          { stationName: 'Etten-Leur', time: '09:44', platform: '1', isAccessible: true },
          { stationName: 'Breda Centraal', time: '09:54', platform: '6', isAccessible: true, notes: 'Połączenie z pociągami w stronę Niemiec i Belgii' },
          { stationName: 'Tilburg', time: '10:12', platform: '1', isAccessible: true },
          { stationName: "'s-Hertogenbosch (Den Bosch)", time: '10:31', platform: '4', isAccessible: true }
        ]
      },
      {
        id: 'rd-03',
        time: '09:45',
        delayMins: 1,
        line: 'SNCB / NMBS Pociąg Międzynarodowy (L-trein)',
        type: 'train',
        destination: 'Antwerpen-Centraal ➔ Puurs (Belgia)',
        origin: 'Roosendaal',
        carrier: 'SNCB / NMBS (Kolej Belgijska)',
        carrierCountry: 'BE',
        carrierFlag: '🇧🇪',
        platform: 'Peron 3b',
        accessibility: {
          stepFree: true,
          lowFloor: true,
          hasElevator: true,
          prioritySeats: true,
          restroomPRM: true
        },
        ticketInfo: {
          systemName: 'SNCB International / Brupass',
          howToPay: 'Bilet międzynarodowy SNCB w aplikacji lub biletomacie na peronie 3.',
          seniorDiscount: 'SNCB Senior Ticket (stała cena €8.30 za dowolną trasę w Belgii po 9:00)',
          estimatedPriceEur: 8.30
        },
        stops: [
          { stationName: 'Roosendaal (NL)', time: '09:45', platform: '3b', isAccessible: true },
          { stationName: 'Essen (BE)', time: '09:54', platform: '1', isAccessible: true, notes: 'Stacja graniczna' },
          { stationName: 'Kalmthout', time: '10:01', platform: '2', isAccessible: true },
          { stationName: 'Kapellen', time: '10:11', platform: '1', isAccessible: true },
          { stationName: 'Antwerpen-Luchtbal', time: '10:21', platform: '3', isAccessible: true },
          { stationName: 'Antwerpen-Centraal', time: '10:28', platform: '21', isAccessible: true, notes: 'Wspaniały dworzec, windy, perony na 3 poziomach' }
        ]
      },
      {
        id: 'rd-04',
        time: '09:50',
        delayMins: 0,
        line: 'Bravo Autobus Linii 111 (Niskopodłogowy)',
        type: 'bus',
        destination: 'Roosendaal Dworzec ➔ Centrum Medyczne & Stare Miasto',
        carrier: 'Bravo / Arriva Brabant',
        carrierCountry: 'NL',
        carrierFlag: '🇳🇱',
        platform: 'Stanowisko B2',
        accessibility: {
          stepFree: true,
          lowFloor: true,
          hasElevator: false,
          prioritySeats: true
        },
        ticketInfo: {
          systemName: 'OVpay w autobusie',
          howToPay: 'Przyłóż kartę do kasownika przy kierowcy.',
          seniorDiscount: 'Taryfa ulgowa',
          estimatedPriceEur: 2.10
        },
        stops: [
          { stationName: 'Roosendaal Station', time: '09:50', platform: 'B2', isAccessible: true },
          { stationName: 'Roosendaal Centrum / Rynek', time: '09:56', platform: '1', isAccessible: true },
          { stationName: 'Bravis Ziekenhuis (Szpital)', time: '10:04', platform: 'A', isAccessible: true }
        ]
      }
    ],
    arrivals: [
      {
        id: 'rd-arr-01',
        time: '09:12',
        delayMins: 0,
        line: 'NS Intercity',
        type: 'train',
        destination: 'Roosendaal',
        origin: 'Amsterdam Centraal',
        carrier: 'NS (Nederlandse Spoorwegen)',
        carrierCountry: 'NL',
        carrierFlag: '🇳🇱',
        platform: 'Peron 1b',
        accessibility: { stepFree: true, lowFloor: true, hasElevator: true, prioritySeats: true },
        ticketInfo: { systemName: 'OVpay', howToPay: 'Check-Out przy bramkach', seniorDiscount: '60+' },
        stops: []
      },
      {
        id: 'rd-arr-02',
        time: '09:38',
        delayMins: 0,
        line: 'SNCB Pociąg Międzynarodowy',
        type: 'train',
        destination: 'Roosendaal',
        origin: 'Antwerpen-Centraal',
        carrier: 'SNCB / NMBS',
        carrierCountry: 'BE',
        carrierFlag: '🇧🇪',
        platform: 'Peron 3a',
        accessibility: { stepFree: true, lowFloor: true, hasElevator: true, prioritySeats: true },
        ticketInfo: { systemName: 'SNCB', howToPay: 'Bilet międzynarodowy', seniorDiscount: 'Senior Ticket' },
        stops: []
      }
    ]
  },

  'poznan': {
    stationName: 'Poznań Główny (Dworzec Kolejowy & Węzeł MPK)',
    city: 'Poznań',
    country: 'PL',
    countryFlag: '🇵🇱',
    currentTime: '14:20',
    departures: [
      {
        id: 'pz-01',
        time: '14:32',
        delayMins: 0,
        line: 'PKP Intercity: Berlin-Warszawa-Express (BWE 41 / IC 71000)',
        type: 'train',
        destination: 'Warszawa Centralna / Warszawa Wschodnia',
        origin: 'Berlin Hauptbahnhof',
        carrier: 'PKP Intercity (BWE)',
        carrierCountry: 'PL',
        carrierFlag: '🇵🇱',
        platform: 'Peron 4 (Sektor B)',
        accessibility: {
          stepFree: true,
          lowFloor: false,
          hasElevator: true,
          prioritySeats: true,
          restroomPRM: true,
          diningCar: true,
          wifi230V: true
        },
        ticketInfo: {
          systemName: 'PKP Intercity e-Bilet',
          howToPay: 'Bilet elektroniczny z kodem QR w telefonie lub wydruk z kasy.',
          seniorDiscount: 'Bilet dla Seniora 60+ (30% taniej) lub ustawowe ulgi emerytalne.',
          estimatedPriceEur: 14.50
        },
        stops: [
          { stationName: 'Poznań Główny', time: '14:32', platform: '4', isAccessible: true },
          { stationName: 'Konin', time: '15:15', platform: '2', isAccessible: true },
          { stationName: 'Kutno', time: '15:58', platform: '1', isAccessible: true },
          { stationName: 'Warszawa Zachodnia', time: '16:54', platform: '5', isAccessible: true, notes: 'Węzeł z windami i schodami ruchomymi' },
          { stationName: 'Warszawa Centralna', time: '17:02', platform: '3', isAccessible: true, notes: 'Centrum stolicy, bezpośrednie metro i autobusy' }
        ]
      },
      {
        id: 'pz-02',
        time: '14:48',
        delayMins: 0,
        line: 'PKP Intercity: Berlin-Warszawa-Express (BWE 44 / IC 17000)',
        type: 'train',
        destination: 'Berlin Hauptbahnhof via Zbąszynek, Rzepin, Frankfurt(Oder)',
        origin: 'Warszawa Wschodnia',
        carrier: 'PKP Intercity / Deutsche Bahn',
        carrierCountry: 'PL',
        carrierFlag: '🇵🇱',
        platform: 'Peron 4 (Sektor A)',
        accessibility: {
          stepFree: true,
          lowFloor: false,
          hasElevator: true,
          prioritySeats: true,
          restroomPRM: true,
          diningCar: true,
          wifi230V: true
        },
        ticketInfo: {
          systemName: 'Bilet Międzynarodowy BWE / Super Promo',
          howToPay: 'Kod QR na telefonie lub bilet z kasy międzynarodowej.',
          seniorDiscount: 'Zniżka międzynarodowa senior 60+',
          estimatedPriceEur: 16.50
        },
        stops: [
          { stationName: 'Poznań Główny', time: '14:48', platform: '4', isAccessible: true },
          { stationName: 'Zbąszynek', time: '15:28', platform: '1', isAccessible: true },
          { stationName: 'Świebodzin', time: '15:42', platform: '2', isAccessible: true },
          { stationName: 'Rzepin', time: '16:04', platform: '1', isAccessible: true },
          { stationName: 'Frankfurt (Oder) (DE)', time: '16:24', platform: '3', isAccessible: true },
          { stationName: 'Berlin Ostbahnhof', time: '17:15', platform: '7', isAccessible: true },
          { stationName: 'Berlin Hauptbahnhof', time: '17:28', platform: '12', isAccessible: true, notes: 'Główny węzeł przesiadkowy w Niemczech' }
        ]
      },
      {
        id: 'pz-03',
        time: '14:38',
        delayMins: 0,
        line: 'MPK Poznań Tramwaj Linii 12 (Niskopodłogowy Moderus)',
        type: 'tram',
        destination: 'Dworzec Zachodni ➔ Most Dworcowy ➔ Rondo Kaponiera ➔ Stary Rynek ➔ Starołęka',
        carrier: 'MPK Poznań / ZTM Poznań',
        carrierCountry: 'PL',
        carrierFlag: '🇵🇱',
        platform: 'Przystanek Dworzec Zachodni (Stanowisko 01)',
        accessibility: {
          stepFree: true,
          lowFloor: true,
          hasElevator: true,
          prioritySeats: true
        },
        ticketInfo: {
          systemName: 'System PEKA / Karta zbliżeniowa w tramwaju',
          howToPay: 'Zbliż kartę płatniczą w terminalu wewnątrz tramwaju lub aplikacja Jakdojade.',
          seniorDiscount: 'Seniorzy 70+ podróżują w 100% ZA DARMO na podstawie dowodu osobistego!',
          estimatedPriceEur: 0.90
        },
        stops: [
          { stationName: 'Poznań Dworzec Zachodni', time: '14:38', platform: '01', isAccessible: true },
          { stationName: 'Most Dworcowy', time: '14:41', platform: '02', isAccessible: true },
          { stationName: 'Rondo Kaponiera', time: '14:44', platform: '03', isAccessible: true, notes: 'Główny węzeł przesiadkowy z windami na perony PST' },
          { stationName: 'Zamek / Plac Mickiewicza', time: '14:47', platform: '01', isAccessible: true },
          { stationName: 'Plac Wolności / Stary Rynek', time: '14:51', platform: '01', isAccessible: true, notes: 'Ratusz, Koziołki Poznańskie, kawiarnie' },
          { stationName: 'Wrocławska', time: '14:54', platform: '02', isAccessible: true }
        ]
      },
      {
        id: 'pz-04',
        time: '14:45',
        delayMins: 0,
        line: 'MPK Poznań Tramwaj Linii 6 (Niskopodłogowy Solaris Tramino)',
        type: 'tram',
        destination: 'Poznań Główny (Most Dworcowy) ➔ Matyi ➔ Półwiejska (Stary Browar) ➔ Rondo Rataje',
        carrier: 'MPK Poznań',
        carrierCountry: 'PL',
        carrierFlag: '🇵🇱',
        platform: 'Przystanek Most Dworcowy',
        accessibility: {
          stepFree: true,
          lowFloor: true,
          hasElevator: true,
          prioritySeats: true
        },
        ticketInfo: {
          systemName: 'Biletomat w pojeździe / Karta płatnicza',
          howToPay: 'Bilet 15-minutowy (4.00 zł) lub przejazd darmowy dla osób 70+.',
          seniorDiscount: '100% ulga dla osób 70+',
          estimatedPriceEur: 0.90
        },
        stops: [
          { stationName: 'Most Dworcowy', time: '14:45', platform: '01', isAccessible: true },
          { stationName: 'Poznań Główny (Hol Wschodni)', time: '14:48', platform: '01', isAccessible: true },
          { stationName: 'Wierzbięcice', time: '14:52', platform: '02', isAccessible: true },
          { stationName: 'Półwiejska (Stary Browar)', time: '14:55', platform: '01', isAccessible: true, notes: 'Centrum handlowo-sztuczne Stary Browar' }
        ]
      }
    ],
    arrivals: [
      {
        id: 'pz-arr-01',
        time: '14:28',
        delayMins: 0,
        line: 'PKP Intercity: BWE 41',
        type: 'train',
        destination: 'Poznań Główny',
        origin: 'Berlin Hauptbahnhof',
        carrier: 'PKP Intercity',
        carrierCountry: 'PL',
        carrierFlag: '🇵🇱',
        platform: 'Peron 4',
        accessibility: { stepFree: true, lowFloor: false, hasElevator: true, prioritySeats: true, diningCar: true },
        ticketInfo: { systemName: 'PKP', howToPay: 'Kod QR', seniorDiscount: '60+' },
        stops: []
      }
    ]
  },

  'berlin': {
    stationName: 'Berlin Hauptbahnhof (Central Station)',
    city: 'Berlin',
    country: 'DE',
    countryFlag: '🇩🇪',
    currentTime: '11:45',
    departures: [
      {
        id: 'ber-01',
        time: '11:58',
        delayMins: 0,
        line: 'Deutsche Bahn ICE 4 (ICE 143)',
        type: 'train',
        destination: 'Hannover Hbf ➔ Osnabrück ➔ Hengelo ➔ Amsterdam Centraal',
        origin: 'Berlin Ostbahnhof',
        carrier: 'Deutsche Bahn (DB ICE)',
        carrierCountry: 'DE',
        carrierFlag: '🇩🇪',
        platform: 'Peron 13 (Tief / Poziom Dolny)',
        accessibility: {
          stepFree: true,
          lowFloor: true,
          hasElevator: true,
          prioritySeats: true,
          restroomPRM: true,
          diningCar: true,
          wifi230V: true
        },
        ticketInfo: {
          systemName: 'DB Navigator / Europa-Spezial',
          howToPay: 'Aplikacja DB Navigator (kod QR) lub biletomaty na dworcu (z menu w j. polskim).',
          seniorDiscount: 'BahnCard Senior / Zniżka Europa-Spezial',
          estimatedPriceEur: 29.90
        },
        stops: [
          { stationName: 'Berlin Hauptbahnhof', time: '11:58', platform: '13', isAccessible: true },
          { stationName: 'Berlin-Spandau', time: '12:09', platform: '3', isAccessible: true },
          { stationName: 'Stendal Hbf', time: '12:42', platform: '2', isAccessible: true },
          { stationName: 'Hannover Hbf', time: '13:38', platform: '9', isAccessible: true, notes: 'Węzeł przesiadkowy z windami na każdy peron' },
          { stationName: 'Osnabrück Hbf', time: '14:29', platform: '3', isAccessible: true },
          { stationName: 'Bad Bentheim (Granica DE/NL)', time: '15:02', platform: '1', isAccessible: true },
          { stationName: 'Hengelo (NL)', time: '15:20', platform: '2', isAccessible: true, notes: 'Przesiadka do pociągów NS w kierunku Roosendaal / Rotterdam' },
          { stationName: 'Amersfoort Centraal', time: '16:08', platform: '1', isAccessible: true },
          { stationName: 'Amsterdam Centraal', time: '16:44', platform: '2b', isAccessible: true }
        ]
      },
      {
        id: 'ber-02',
        time: '12:15',
        delayMins: 0,
        line: 'PKP Intercity / DB: Berlin-Warszawa-Express (BWE 45)',
        type: 'train',
        destination: 'Frankfurt(Oder) ➔ Poznań Główny ➔ Warszawa Centralna',
        origin: 'Berlin Hauptbahnhof',
        carrier: 'PKP Intercity & DB',
        carrierCountry: 'PL',
        carrierFlag: '🇵🇱',
        platform: 'Peron 12 (Tief)',
        accessibility: {
          stepFree: true,
          lowFloor: false,
          hasElevator: true,
          prioritySeats: true,
          restroomPRM: true,
          diningCar: true,
          wifi230V: true
        },
        ticketInfo: {
          systemName: 'Super Promo International',
          howToPay: 'Kod QR w telefonie / Bilet elektroniczny PKP lub DB.',
          seniorDiscount: 'Zniżka Senior 60+ (30% taniej)',
          estimatedPriceEur: 16.50
        },
        stops: [
          { stationName: 'Berlin Hauptbahnhof', time: '12:15', platform: '12', isAccessible: true },
          { stationName: 'Berlin Ostbahnhof', time: '12:28', platform: '1', isAccessible: true },
          { stationName: 'Frankfurt (Oder)', time: '13:18', platform: '2', isAccessible: true },
          { stationName: 'Rzepin (PL)', time: '13:38', platform: '1', isAccessible: true },
          { stationName: 'Świebodzin', time: '14:02', platform: '2', isAccessible: true },
          { stationName: 'Zbąszynek', time: '14:18', platform: '1', isAccessible: true },
          { stationName: 'Poznań Główny', time: '14:58', platform: '4', isAccessible: true, notes: 'Przyjazd na peron 4, bezpośrednie windy do tramwajów MPK' },
          { stationName: 'Konin', time: '15:45', platform: '1', isAccessible: true },
          { stationName: 'Kutno', time: '16:28', platform: '2', isAccessible: true },
          { stationName: 'Warszawa Centralna', time: '17:35', platform: '3', isAccessible: true }
        ]
      },
      {
        id: 'ber-03',
        time: '12:04',
        delayMins: 0,
        line: 'S-Bahn Berlin (Linia S5 / S7)',
        type: 'tram',
        destination: 'Alexanderplatz ➔ Warschauer Straße ➔ Ostkreuz',
        carrier: 'S-Bahn Berlin / BVG',
        carrierCountry: 'DE',
        carrierFlag: '🇩🇪',
        platform: 'Peron 15 (Stadtbahn / Poziom Górny)',
        accessibility: {
          stepFree: true,
          lowFloor: true,
          hasElevator: true,
          prioritySeats: true
        },
        ticketInfo: {
          systemName: 'BVG Berlin AB Ticket / Deutschlandticket',
          howToPay: 'Karta płatnicza w biletomacie BVG na peronie.',
          seniorDiscount: 'Karta Senior BVG',
          estimatedPriceEur: 3.50
        },
        stops: [
          { stationName: 'Berlin Hauptbahnhof', time: '12:04', platform: '15', isAccessible: true },
          { stationName: 'Friedrichstraße', time: '12:07', platform: '2', isAccessible: true },
          { stationName: 'Hackescher Markt', time: '12:09', platform: '1', isAccessible: true },
          { stationName: 'Alexanderplatz (Wieża TV)', time: '12:12', platform: '3', isAccessible: true }
        ]
      }
    ],
    arrivals: []
  },

  'warszawa': {
    stationName: 'Warszawa Centralna (Dworzec Główny)',
    city: 'Warszawa',
    country: 'PL',
    countryFlag: '🇵🇱',
    currentTime: '16:10',
    departures: [
      {
        id: 'waw-01',
        time: '16:25',
        delayMins: 0,
        line: 'PKP Intercity Express (EIC 1600 / Pendolino)',
        type: 'train',
        destination: 'Kraków Główny via Warszawa Zachodnia, Włoszczowa Płn',
        origin: 'Gdynia Główna',
        carrier: 'PKP Intercity (Express Premium)',
        carrierCountry: 'PL',
        carrierFlag: '🇵🇱',
        platform: 'Peron 3 (Tor 1)',
        accessibility: {
          stepFree: true,
          lowFloor: true,
          hasElevator: true,
          prioritySeats: true,
          restroomPRM: true,
          diningCar: true,
          wifi230V: true
        },
        ticketInfo: {
          systemName: 'PKP Intercity e-Bilet',
          howToPay: 'Kod QR w telefonie / Bilet z kasy.',
          seniorDiscount: 'Bilet dla Seniora 60+ (30% zniżki na wszystkie kategorie pociągów)',
          estimatedPriceEur: 12.00
        },
        stops: [
          { stationName: 'Warszawa Centralna', time: '16:25', platform: '3', isAccessible: true },
          { stationName: 'Warszawa Zachodnia', time: '16:31', platform: '6', isAccessible: true },
          { stationName: 'Włoszczowa Północ', time: '17:34', platform: '1', isAccessible: true },
          { stationName: 'Kraków Główny', time: '18:42', platform: '1', isAccessible: true, notes: 'Dworzec zintegrowany z Galerią Krakowską i tramwajami' }
        ]
      },
      {
        id: 'waw-02',
        time: '16:35',
        delayMins: 0,
        line: 'ZTM Warszawa Tramwaj Linii 7 / 9 (Niskopodłogowy Pesa Jazz)',
        type: 'tram',
        destination: 'Dworzec Centralny ➔ Rondo Dmowskiego (Metro Centrum) ➔ Muzeum Narodowe ➔ Rondo Waszyngtona (Stadion Narodowy)',
        carrier: 'Tramwaje Warszawskie / ZTM',
        carrierCountry: 'PL',
        carrierFlag: '🇵🇱',
        platform: 'Przystanek Dworzec Centralny 07 (Al. Jerozolimskie)',
        accessibility: {
          stepFree: true,
          lowFloor: true,
          hasElevator: true,
          prioritySeats: true
        },
        ticketInfo: {
          systemName: 'Biletomat ZTM / Karta zbliżeniowa w tramwaju',
          howToPay: 'Przyłóż kartę do kasownika lub aplikacja Jakdojade.',
          seniorDiscount: 'Seniorzy 70+ jeżdżą 100% BEZPŁATNIE bez biletu (wystarczy dokument tożsamości)',
          estimatedPriceEur: 0.90
        },
        stops: [
          { stationName: 'Dworzec Centralny', time: '16:35', platform: '07', isAccessible: true },
          { stationName: 'Centrum (Metro Świętokrzyska / Centrum)', time: '16:38', platform: '05', isAccessible: true },
          { stationName: 'Muzeum Narodowe / Nowy Świat', time: '16:42', platform: '03', isAccessible: true },
          { stationName: 'Rondo Waszyngtona (PGE Narodowy)', time: '16:48', platform: '01', isAccessible: true }
        ]
      }
    ],
    arrivals: []
  }
};

/**
 * Intelligent generator to dynamically produce live timetable boards for ANY searched station
 */
export function getOrCreateStationTimetable(query: string, language: Language = 'pl'): StationBoard {
  const q = (query || '').toLowerCase().trim();

  // Check static match
  if (q.includes('roosendaal')) return SAMPLE_STATION_BOARDS['roosendaal'];
  if (q.includes('poznan') || q.includes('poznań')) return SAMPLE_STATION_BOARDS['poznan'];
  if (q.includes('berlin')) return SAMPLE_STATION_BOARDS['berlin'];
  if (q.includes('warszaw') || q.includes('warsaw')) return SAMPLE_STATION_BOARDS['warszawa'];

  // Determine country
  let country: EuropeanCountry = 'PL';
  let countryFlag = '🇵🇱';
  let carrierName = 'PKP Intercity & Komunikacja Miejska';
  let defaultHub = 'Poznań Główny / Warszawa';

  if (q.includes('holand') || q.includes('amsterdam') || q.includes('rotterdam') || q.includes('utrecht') || q.includes('haga') || q.includes('breda') || q.includes('tilburg') || q.includes('eindhoven') || q.includes('hengelo')) {
    country = 'NL';
    countryFlag = '🇳🇱';
    carrierName = 'NS (Nederlandse Spoorwegen) / 9292';
    defaultHub = 'Rotterdam Centraal / Amsterdam Centraal';
  } else if (q.includes('niemc') || q.includes('german') || q.includes('frankfurt') || q.includes('koloni') || q.includes('köln') || q.includes('hamburg') || q.includes('monachium') || q.includes('münchen') || q.includes('düsseldorf') || q.includes('hannover')) {
    country = 'DE';
    countryFlag = '🇩🇪';
    carrierName = 'Deutsche Bahn (DB ICE/IC)';
    defaultHub = 'Berlin Hbf / Hannover Hbf';
  } else if (q.includes('belgi') || q.includes('bruksel') || q.includes('brussels') || q.includes('antwerp') || q.includes('gent') || q.includes('brug')) {
    country = 'BE';
    countryFlag = '🇧🇪';
    carrierName = 'SNCB / NMBS (Belgian Train)';
    defaultHub = 'Bruxelles-Midi / Antwerpen-Centraal';
  } else if (q.includes('franc') || q.includes('paryż') || q.includes('paris') || q.includes('lille') || q.includes('lyon') || q.includes('strasbourg')) {
    country = 'FR';
    countryFlag = '🇫🇷';
    carrierName = 'SNCF (TGV InOui & RATP)';
    defaultHub = 'Paris Gare du Nord / Gare de Lyon';
  }

  const cleanName = query.trim() ? `${query.trim().charAt(0).toUpperCase() + query.trim().slice(1)}` : (country === 'NL' ? 'Roosendaal' : 'Poznań Główny');

  return {
    stationName: `${cleanName} (Stacja / Dworzec Główny)`,
    city: cleanName,
    country,
    countryFlag,
    currentTime: '10:00',
    departures: [
      {
        id: `dyn-${cleanName}-1`,
        time: '10:15',
        delayMins: 0,
        line: country === 'NL' ? 'NS Intercity Direct' : country === 'DE' ? 'DB ICE Express' : country === 'BE' ? 'SNCB IC Express' : country === 'FR' ? 'TGV InOui' : 'PKP Intercity (Ekspres)',
        type: 'train',
        destination: `${defaultHub} (Połączenie Międzynarodowe)`,
        origin: cleanName,
        carrier: carrierName,
        carrierCountry: country,
        carrierFlag: countryFlag,
        platform: 'Peron 1 (Winda)',
        accessibility: {
          stepFree: true,
          lowFloor: true,
          hasElevator: true,
          prioritySeats: true,
          restroomPRM: true,
          diningCar: true,
          wifi230V: true
        },
        ticketInfo: {
          systemName: country === 'NL' ? 'OVpay (Karta zbliżeniowa)' : country === 'DE' ? 'DB Navigator' : country === 'BE' ? 'SNCB Senior Ticket' : country === 'FR' ? 'SNCF Connect' : 'PKP e-Bilet',
          howToPay: country === 'NL' ? 'Zbliżenie karty bankowej na bramce.' : 'Kod QR w telefonie lub bilet z kasy.',
          seniorDiscount: country === 'PL' ? 'Ulga 60+ (30% taniej) / 70+ Bezpłatnie w miastach' : 'Ulga senioralna 60+',
          estimatedPriceEur: 15.00
        },
        stops: [
          { stationName: cleanName, time: '10:15', platform: '1', isAccessible: true },
          { stationName: 'Stacja Węzłowa A', time: '10:45', platform: '2', isAccessible: true },
          { stationName: defaultHub, time: '11:30', platform: '4', isAccessible: true, notes: 'Węzeł przesiadkowy i windy' }
        ]
      },
      {
        id: `dyn-${cleanName}-2`,
        time: '10:28',
        delayMins: 0,
        line: 'Tramwaj / Autobus Niskopodłogowy Linii 1',
        type: 'tram',
        destination: `${cleanName} Centrum / Stare Miasto / Szpital`,
        carrier: 'Komunikacja Miejska',
        carrierCountry: country,
        carrierFlag: countryFlag,
        platform: 'Stanowisko 01 (Niski peron)',
        accessibility: {
          stepFree: true,
          lowFloor: true,
          hasElevator: true,
          prioritySeats: true
        },
        ticketInfo: {
          systemName: 'Bilet Miejski zbliżeniowy',
          howToPay: 'Płatność kartą w pojeździe.',
          seniorDiscount: 'Senior 70+ Bezpłatnie / Bilet ulgowy',
          estimatedPriceEur: 1.00
        },
        stops: [
          { stationName: `${cleanName} Dworzec`, time: '10:28', platform: '01', isAccessible: true },
          { stationName: `${cleanName} Centrum`, time: '10:35', platform: '01', isAccessible: true },
          { stationName: `${cleanName} Rynek`, time: '10:42', platform: '02', isAccessible: true }
        ]
      }
    ],
    arrivals: []
  };
}
