export const ATTRACTIONS = [
  // POLSKA (10)
  { id: 'pl1', name: 'Zamek Królewski', city: 'Warszawa', cat: 'Muzeum', price: '€8', flat: true, light: true, coords: { lat: 52.2477, lng: 21.0138 }, country: 'pl' },
  { id: 'pl2', name: 'Wawel', city: 'Kraków', cat: 'UNESCO', price: '€6', flat: true, light: true, coords: { lat: 50.0540, lng: 19.9354 }, country: 'pl' },
  { id: 'pl3', name: 'Rynek Główny', city: 'Kraków', cat: 'UNESCO', price: '€0', flat: true, light: true, coords: { lat: 50.0614, lng: 19.9372 }, country: 'pl' },
  { id: 'pl4', name: 'Malbork', city: 'Malbork', cat: 'UNESCO', price: '€10', flat: true, light: true, coords: { lat: 54.0395, lng: 19.0275 }, country: 'pl' },
  { id: 'pl5', name: 'Wieliczka', city: 'Wieliczka', cat: 'UNESCO', price: '€20', flat: false, light: false, coords: { lat: 49.9833, lng: 20.0557 }, country: 'pl' },
  { id: 'pl6', name: 'Tatry – Morskie Oko', city: 'Zakopane', cat: 'Przyroda', price: '€0', flat: false, light: true, coords: { lat: 49.2012, lng: 20.0708 }, country: 'pl' },
  { id: 'pl7', name: 'Stare Miasto Gdańsk', city: 'Gdańsk', cat: 'UNESCO', price: '€0', flat: true, light: true, coords: { lat: 54.3485, lng: 18.6506 }, country: 'pl' },
  { id: 'pl8', name: 'Hala Stulecia', city: 'Wrocław', cat: 'UNESCO', price: '€5', flat: true, light: true, coords: { lat: 51.1068, lng: 17.0773 }, country: 'pl' },
  { id: 'pl9', name: 'Białowieża', city: 'Białowieża', cat: 'Przyroda', price: '€8', flat: true, light: false, coords: { lat: 52.7023, lng: 23.8678 }, country: 'pl' },
  { id: 'pl10', name: 'Kopalnia Guido', city: 'Zabrze', cat: 'Technika', price: '€12', flat: false, light: false, coords: { lat: 50.2945, lng: 18.7889 }, country: 'pl' },

  // NIEMCY (10)
  { id: 'de1', name: 'Brama Brandenburska', city: 'Berlin', cat: 'Zabytek', price: '€0', flat: true, light: true, coords: { lat: 52.5163, lng: 13.3777 }, country: 'de' },
  { id: 'de2', name: 'Mauermuseum', city: 'Berlin', cat: 'Muzeum', price: '€15', flat: true, light: true, coords: { lat: 52.5074, lng: 13.3904 }, country: 'de' },
  { id: 'de3', name: 'Neuschwanstein', city: 'Hohenschwangau', cat: 'Zabytek', price: '€17', flat: false, light: true, coords: { lat: 47.5576, lng: 10.7498 }, country: 'de' },
  { id: 'de4', name: 'Kölner Dom', city: 'Kolonia', cat: 'UNESCO', price: '€0', flat: true, light: true, coords: { lat: 50.9413, lng: 6.9583 }, country: 'de' },
  { id: 'de5', name: 'Marienplatz', city: 'Monachium', cat: 'Zabytek', price: '€0', flat: true, light: true, coords: { lat: 48.1374, lng: 11.5754 }, country: 'de' },
  { id: 'de6', name: 'Miniatur Wunderland', city: 'Hamburg', cat: 'Park', price: '€20', flat: true, light: true, coords: { lat: 53.5439, lng: 9.9870 }, country: 'de' },
  { id: 'de7', name: 'Sächsische Schweiz', city: 'Drezno', cat: 'Przyroda', price: '€0', flat: false, light: true, coords: { lat: 50.9163, lng: 14.3500 }, country: 'de' },
  { id: 'de8', name: 'Hamburg Hafen', city: 'Hamburg', cat: 'Technika', price: '€0', flat: true, light: true, coords: { lat: 53.5488, lng: 9.9872 }, country: 'de' },
  { id: 'de9', name: 'Heidelberg Castle', city: 'Heidelberg', cat: 'Zabytek', price: '€9', flat: false, light: true, coords: { lat: 49.4107, lng: 8.7153 }, country: 'de' },
  { id: 'de10', name: 'Romantische Straße', city: 'Rothenburg', cat: 'Wioska', price: '€0', flat: true, light: true, coords: { lat: 49.3772, lng: 10.1797 }, country: 'de' },

  // HOLANDIA (10)
  { id: 'nl1', name: 'Rijksmuseum', city: 'Amsterdam', cat: 'Muzeum', price: '€22', flat: true, light: true, coords: { lat: 52.3600, lng: 4.8852 }, country: 'nl' },
  { id: 'nl2', name: 'Dom Anne Frank', city: 'Amsterdam', cat: 'Muzeum', price: '€16', flat: true, light: true, coords: { lat: 52.3752, lng: 4.8839 }, country: 'nl' },
  { id: 'nl3', name: 'Keukenhof', city: 'Lisse', cat: 'Park', price: '€19', flat: true, light: true, coords: { lat: 52.2700, lng: 4.5467 }, country: 'nl' },
  { id: 'nl4', name: 'Efteling', city: 'Kaatsheuvel', cat: 'Park rozrywki', price: '€45', flat: true, light: false, coords: { lat: 51.6500, lng: 5.0500 }, country: 'nl' },
  { id: 'nl5', name: 'Kinderdijk', city: 'Molenwaard', cat: 'UNESCO', price: '€0', flat: true, light: true, coords: { lat: 51.8850, lng: 4.6340 }, country: 'nl' },
  { id: 'nl6', name: 'Markthal', city: 'Rotterdam', cat: 'Jedzenie', price: '€0', flat: true, light: true, coords: { lat: 51.9200, lng: 4.4900 }, country: 'nl' },
  { id: 'nl7', name: 'Hoge Veluwe', city: 'Otterlo', cat: 'Przyroda', price: '€12', flat: false, light: false, coords: { lat: 52.1000, lng: 5.8000 }, country: 'nl' },
  { id: 'nl8', name: 'Zaanse Schans', city: 'Zaandam', cat: 'Wioska', price: '€0', flat: true, light: true, coords: { lat: 52.4700, lng: 4.8200 }, country: 'nl' },
  { id: 'nl9', name: 'Madurodam', city: 'Haga', cat: 'Park', price: '€23', flat: true, light: true, coords: { lat: 52.1000, lng: 4.3000 }, country: 'nl' },
  { id: 'nl10', name: 'Delta Works', city: 'Vrouwenpolder', cat: 'Technika', price: '€15', flat: true, light: true, coords: { lat: 51.6200, lng: 3.7000 }, country: 'nl' },

  // BELGIA (10)
  { id: 'be1', name: 'Grand Place', city: 'Bruksela', cat: 'UNESCO', price: '€0', flat: true, light: true, coords: { lat: 50.8467, lng: 4.3525 }, country: 'be' },
  { id: 'be2', name: 'Atomium', city: 'Bruksela', cat: 'Technika', price: '€16', flat: true, light: true, coords: { lat: 50.8951, lng: 4.3416 }, country: 'be' },
  { id: 'be3', name: 'Brugia – Stare Miasto', city: 'Brugia', cat: 'UNESCO', price: '€0', flat: true, light: true, coords: { lat: 51.2093, lng: 3.2247 }, country: 'be' },
  { id: 'be4', name: 'Kanały Brugii', city: 'Brugia', cat: 'Przyroda', price: '€10', flat: true, light: true, coords: { lat: 51.2164, lng: 3.2265 }, country: 'be' },
  { id: 'be5', name: 'Antwerpia – Grote Markt', city: 'Antwerpia', cat: 'Zabytek', price: '€0', flat: true, light: true, coords: { lat: 51.2211, lng: 4.3997 }, country: 'be' },
  { id: 'be6', name: 'Gravensteen', city: 'Gandawa', cat: 'Zabytek', price: '€12', flat: true, light: true, coords: { lat: 51.0570, lng: 3.7204 }, country: 'be' },
  { id: 'be7', name: 'Caves of Han', city: 'Han-sur-Lesse', cat: 'Przyroda', price: '€20', flat: false, light: false, coords: { lat: 50.1260, lng: 5.1860 }, country: 'be' },
  { id: 'be8', name: 'Waterloo', city: 'Waterloo', cat: 'Muzeum', price: '€20', flat: true, light: true, coords: { lat: 50.6806, lng: 4.4120 }, country: 'be' },
  { id: 'be9', name: 'Dinant', city: 'Dinant', cat: 'Wioska', price: '€0', flat: true, light: true, coords: { lat: 50.2600, lng: 4.9100 }, country: 'be' },
  { id: 'be10', name: 'Bouillon Castle', city: 'Bouillon', cat: 'Zabytek', price: '€8', flat: false, light: true, coords: { lat: 49.7933, lng: 5.0670 }, country: 'be' },

  // FRANCJA (10)
  { id: 'fr1', name: 'Wieża Eiffla', city: 'Paryż', cat: 'Zabytek', price: '€29', flat: true, light: true, coords: { lat: 48.8584, lng: 2.2945 }, country: 'fr' },
  { id: 'fr2', name: 'Luwr', city: 'Paryż', cat: 'Muzeum', price: '€22', flat: true, light: true, coords: { lat: 48.8606, lng: 2.3376 }, country: 'fr' },
  { id: 'fr3', name: 'Wersal', city: 'Wersal', cat: 'UNESCO', price: '€20', flat: true, light: true, coords: { lat: 48.8049, lng: 2.1204 }, country: 'fr' },
  { id: 'fr4', name: 'Notre-Dame', city: 'Paryż', cat: 'Zabytek', price: '€0', flat: true, light: true, coords: { lat: 48.8530, lng: 2.3499 }, country: 'fr' },
  { id: 'fr5', name: 'Mont Saint-Michel', city: 'Normandia', cat: 'UNESCO', price: '€11', flat: false, light: true, coords: { lat: 48.6361, lng: -1.5115 }, country: 'fr' },
  { id: 'fr6', name: 'Lazurowe Wybrzeże', city: 'Nicea', cat: 'Przyroda', price: '€0', flat: false, light: true, coords: { lat: 43.7102, lng: 7.2620 }, country: 'fr' },
  { id: 'fr7', name: 'Park Asterix', city: 'Plailly', cat: 'Park rozrywki', price: '€55', flat: true, light: true, coords: { lat: 49.1342, lng: 2.5703 }, country: 'fr' },
  { id: 'fr8', name: 'Katedra w Strasburgu', city: 'Strasburg', cat: 'UNESCO', price: '€0', flat: true, light: true, coords: { lat: 48.5819, lng: 7.7507 }, country: 'fr' },
  { id: 'fr9', name: 'Lyon – Stare Miasto', city: 'Lyon', cat: 'UNESCO', price: '€0', flat: true, light: true, coords: { lat: 45.7640, lng: 4.8357 }, country: 'fr' },
  { id: 'fr10', name: 'Sekwia – rejs', city: 'Paryż', cat: 'Przyroda', price: '€16', flat: true, light: true, coords: { lat: 48.8566, lng: 2.3522 }, country: 'fr' },
];

export const CATEGORIES = ['Wszystko', 'Muzeum', 'Park', 'Przyroda', 'Jedzenie', 'UNESCO', 'Darmowe', 'Zabytek', 'Technika', 'Wioska', 'Park rozrywki'];

export const COUNTRIES = {
  pl: { name: 'Polska', nameNl: 'Polen', nameDe: 'Polen', nameFr: 'Pologne', nameZh: '波兰', flag: '🇵🇱', currency: 'pln', methods: ['blik', 'card', 'p24'] },
  de: { name: 'Niemcy', nameNl: 'Duitsland', nameDe: 'Deutschland', nameFr: 'Allemagne', nameZh: '德国', flag: '🇩🇪', currency: 'eur', methods: ['sofort', 'klarna', 'card', 'eps'] },
  nl: { name: 'Holandia', nameNl: 'Nederland', nameDe: 'Niederlande', nameFr: 'Pays-Bas', nameZh: '荷兰', flag: '🇳🇱', currency: 'eur', methods: ['ideal', 'bancontact', 'card'] },
  be: { name: 'Belgia', nameNl: 'België', nameDe: 'Belgien', nameFr: 'Belgique', nameZh: '比利时', flag: '🇧🇪', currency: 'eur', methods: ['bancontact', 'card', 'ideal'] },
  fr: { name: 'Francja', nameNl: 'Frankrijk', nameDe: 'Frankreich', nameFr: 'France', nameZh: '法国', flag: '🇫🇷', currency: 'eur', methods: ['cartes_bancaires', 'card'] },
};
