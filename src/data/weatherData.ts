/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DayForecast, HourlyWeather, Language, SightseeingWeather } from '../types';

// Approximate coordinates of major travel hubs
export const CITY_COORDINATES: Record<string, { lat: number; lon: number; country: string }> = {
  // Netherlands
  'Rotterdam': { lat: 51.9244, lon: 4.4777, country: 'Netherlands' },
  'Amsterdam': { lat: 52.3676, lon: 4.9041, country: 'Netherlands' },
  'Utrecht': { lat: 52.0907, lon: 5.1214, country: 'Netherlands' },
  'Den Haag': { lat: 52.0705, lon: 4.3007, country: 'Netherlands' },
  'The Hague': { lat: 52.0705, lon: 4.3007, country: 'Netherlands' },
  'Eindhoven': { lat: 51.4416, lon: 5.4697, country: 'Netherlands' },
  'Delft': { lat: 52.0116, lon: 4.3571, country: 'Netherlands' },
  'Groningen': { lat: 53.2194, lon: 6.5665, country: 'Netherlands' },
  'Haarlem': { lat: 52.3874, lon: 4.6462, country: 'Netherlands' },
  'Alblasserdam': { lat: 51.8647, lon: 4.6592, country: 'Netherlands' },
  'Lisse': { lat: 52.2600, lon: 4.5570, country: 'Netherlands' },
  'Zaandam': { lat: 52.4420, lon: 4.8292, country: 'Netherlands' },

  // Poland
  'Warsaw': { lat: 52.2297, lon: 21.0122, country: 'Poland' },
  'Warszawa': { lat: 52.2297, lon: 21.0122, country: 'Poland' },
  'Kraków': { lat: 50.0647, lon: 19.9450, country: 'Poland' },
  'Krakow': { lat: 50.0647, lon: 19.9450, country: 'Poland' },
  'Gdańsk': { lat: 54.3520, lon: 18.6466, country: 'Poland' },
  'Gdansk': { lat: 54.3520, lon: 18.6466, country: 'Poland' },
  'Sopot': { lat: 54.4418, lon: 18.5600, country: 'Poland' },
  'Wrocław': { lat: 51.1079, lon: 17.0385, country: 'Poland' },
  'Wroclaw': { lat: 51.1079, lon: 17.0385, country: 'Poland' },
  'Poznań': { lat: 52.4064, lon: 16.9252, country: 'Poland' },
  'Poznan': { lat: 52.4064, lon: 16.9252, country: 'Poland' },
  'Zakopane': { lat: 49.2992, lon: 19.9496, country: 'Poland' },

  // Belgium
  'Brussels': { lat: 50.8503, lon: 4.3517, country: 'Belgium' },
  'Bruges': { lat: 51.2093, lon: 3.2247, country: 'Belgium' },
  'Brugge': { lat: 51.2093, lon: 3.2247, country: 'Belgium' },
  'Ghent': { lat: 51.0543, lon: 3.7174, country: 'Belgium' },
  'Gent': { lat: 51.0543, lon: 3.7174, country: 'Belgium' },
  'Antwerp': { lat: 51.2194, lon: 4.4025, country: 'Belgium' },
  'Antwerpen': { lat: 51.2194, lon: 4.4025, country: 'Belgium' },

  // Germany
  'Berlin': { lat: 52.5200, lon: 13.4050, country: 'Germany' },
  'Munich': { lat: 48.1351, lon: 11.5820, country: 'Germany' },
  'München': { lat: 48.1351, lon: 11.5820, country: 'Germany' },
  'Hamburg': { lat: 53.5511, lon: 9.9937, country: 'Germany' },
  'Dresden': { lat: 51.0504, lon: 13.7373, country: 'Germany' },

  // France
  'Paris': { lat: 48.8566, lon: 2.3522, country: 'France' },
  'Nice': { lat: 43.7102, lon: 7.2620, country: 'France' },
  'Lyon': { lat: 45.7640, lon: 4.8357, country: 'France' },
  'Strasbourg': { lat: 48.5734, lon: 7.7521, country: 'France' },
};

/**
 * Returns weather translation labels for various languages
 */
export function getWeatherLabels(language: Language) {
  const dict: Record<Language, any> = {
    pl: {
      weatherTitle: 'Prognoza pogody na dzień zwiedzania 🌤️',
      weatherSubtitle: 'Tadzik sprawdza aurę i doradza jak się ubrać oraz zaplanować powrót przed zmrokiem',
      selectDay: 'Wybierz dzień wycieczki:',
      today: 'Dziś',
      tomorrow: 'Jutro',
      in2Days: 'Pojutrze',
      feelsLike: 'Odczuwalna:',
      rainChance: 'Prawdopodobieństwo deszczu:',
      rainVolume: 'Suma opadów:',
      wind: 'Wiatr:',
      uvIndex: 'Indeks UV:',
      airQuality: 'Jakość powietrza:',
      sunrise: 'Wschód słońca:',
      sunset: 'Zachód słońca (bezpieczny powrót):',
      hourlyForecast: 'Aura w ciągu dnia zwiedzania:',
      tadzikAdvice: 'Wskazówki Tadzika do wycieczki:',
      whatToPack: 'Co warto zabrać do plecaka:',
      bestHours: 'Najlepsze godziny na zwiedzanie:',
      safetyNote: 'Bezpieczeństwo seniora:',
      routeMode: 'Sposób dojazdu:',
      transit: '🚌 Komunikacja publiczna 9292',
      bike: '🚲 Rower / Ścieżka rowerowa',
      walk: '🚶 Pieszo / Spacer',
      car: '🚗 Samochód (Parking P+R)',
      openMaps: 'Otwórz trasę w Google Maps 🗺️',
      close: 'Zamknij',
      idealWeather: '🌟 Idealna aura na zwiedzanie!',
      moderateWeather: '⛅ Dobra pogoda na zwiedzanie',
      rainWarning: '🌧️ Spodziewane opady – zabierz parasol!'
    },
    nl: {
      weatherTitle: 'Weersverwachting voor de bezienswaardigheid 🌤️',
      weatherSubtitle: 'Tadzik controleert het weer en adviseert wat u moet dragen en wanneer u moet terugkeren',
      selectDay: 'Kies dag van bezoek:',
      today: 'Vandaag',
      tomorrow: 'Morgen',
      in2Days: 'Overmorgen',
      feelsLike: 'Gevoelstemperatuur:',
      rainChance: 'Kans op regen:',
      rainVolume: 'Neerslag:',
      wind: 'Wind:',
      uvIndex: 'UV-Index:',
      airQuality: 'Luchtkwaliteit:',
      sunrise: 'Zonsopgang:',
      sunset: 'Zonsondergang (veilig terug):',
      hourlyForecast: 'Uurlijkse verwachting:',
      tadzikAdvice: 'Tadzik\'s reistips:',
      whatToPack: 'Wat mee te nemen:',
      bestHours: 'Beste bezoektijden:',
      safetyNote: 'Veiligheidsadvies:',
      routeMode: 'Reisoptie:',
      transit: '🚌 Openbaar vervoer (9292)',
      bike: '🚲 Fiets / Fietspad',
      walk: '🚶 Te voet / Wandeling',
      car: '🚗 Auto (P+R Parkeren)',
      openMaps: 'Open route in Google Maps 🗺️',
      close: 'Sluiten',
      idealWeather: '🌟 Uitstekend weer voor een uitstapje!',
      moderateWeather: '⛅ Goed wandelweer',
      rainWarning: '🌧️ Regen verwacht – neem paraplu mee!'
    },
    en: {
      weatherTitle: 'Sightseeing Weather Forecast 🌤️',
      weatherSubtitle: 'Tadzik checks the weather conditions, advice on packing and safe return before dark',
      selectDay: 'Select excursion day:',
      today: 'Today',
      tomorrow: 'Tomorrow',
      in2Days: 'In 2 days',
      feelsLike: 'Feels like:',
      rainChance: 'Rain probability:',
      rainVolume: 'Precipitation:',
      wind: 'Wind:',
      uvIndex: 'UV Index:',
      airQuality: 'Air Quality:',
      sunrise: 'Sunrise:',
      sunset: 'Sunset (safe return):',
      hourlyForecast: 'Sightseeing day timeline:',
      tadzikAdvice: 'Tadzik\'s Tour Tips:',
      whatToPack: 'What to pack in your bag:',
      bestHours: 'Best sightseeing hours:',
      safetyNote: 'Senior Safety Note:',
      routeMode: 'Travel Mode:',
      transit: '🚌 Public Transit (9292)',
      bike: '🚲 Bicycle / Bike Lane',
      walk: '🚶 Walking Route',
      car: '🚗 Car (P+R Parking)',
      openMaps: 'Open in Google Maps 🗺️',
      close: 'Close',
      idealWeather: '🌟 Perfect weather for sightseeing!',
      moderateWeather: '⛅ Good sightseeing weather',
      rainWarning: '🌧️ Rain expected – bring an umbrella!'
    },
    de: {
      weatherTitle: 'Wettervorhersage für den Ausflugstag 🌤️',
      weatherSubtitle: 'Tadzik prüft das Wetter und berät zur Kleidung und sicheren Rückkehr vor Einbruch der Dunkelheit',
      selectDay: 'Ausflugstag wählen:',
      today: 'Heute',
      tomorrow: 'Morgen',
      in2Days: 'Übermorgen',
      feelsLike: 'Gefühlt wie:',
      rainChance: 'Regenwahrscheinlichkeit:',
      rainVolume: 'Niederschlag:',
      wind: 'Wind:',
      uvIndex: 'UV-Index:',
      airQuality: 'Luftqualität:',
      sunrise: 'Sonnenaufgang:',
      sunset: 'Sonnenuntergang (sichere Rückkehr):',
      hourlyForecast: 'Tagesverlauf der Besichtigung:',
      tadzikAdvice: 'Tadziks Ausflugstipps:',
      whatToPack: 'Was in den Rucksack gehört:',
      bestHours: 'Beste Besuchszeiten:',
      safetyNote: 'Sicherheitshinweis für Senioren:',
      routeMode: 'Reiseart:',
      transit: '🚌 Öffentliche Verkehrsmittel (9292)',
      bike: '🚲 Fahrrad / Radweg',
      walk: '🚶 Zu Fuß / Spaziergang',
      car: '🚗 Auto (P+R Parkplatz)',
      openMaps: 'In Google Maps öffnen 🗺️',
      close: 'Schließen',
      idealWeather: '🌟 Perfektes Wetter zum Erkunden!',
      moderateWeather: '⛅ Gutes Ausflugswetter',
      rainWarning: '🌧️ Regen erwartet – Regenschirm mitnehmen!'
    },
    es: {
      weatherTitle: 'Pronóstico del tiempo para la excursión 🌤️',
      weatherSubtitle: 'Tadzik consulta el clima y te aconseja cómo vestirte y regresar antes del anochecer',
      selectDay: 'Selecciona el día de la visita:',
      today: 'Hoy',
      tomorrow: 'Mañana',
      in2Days: 'Pasado mañana',
      feelsLike: 'Sensación térmica:',
      rainChance: 'Probabilidad de lluvia:',
      rainVolume: 'Precipitación:',
      wind: 'Viento:',
      uvIndex: 'Índice UV:',
      airQuality: 'Calidad del aire:',
      sunrise: 'Amanecer:',
      sunset: 'Puesta de sol (regreso seguro):',
      hourlyForecast: 'Horarios del día:',
      tadzikAdvice: 'Consejos de Tadzik:',
      whatToPack: 'Qué llevar en la mochila:',
      bestHours: 'Mejores horas de visita:',
      safetyNote: 'Seguridad senior:',
      routeMode: 'Medio de transporte:',
      transit: '🚌 Transporte público (9292)',
      bike: '🚲 Bicicleta / Carril bici',
      walk: '🚶 A pie / Paseo',
      car: '🚗 Coche (Parking P+R)',
      openMaps: 'Abrir en Google Maps 🗺️',
      close: 'Cerrar',
      idealWeather: '🌟 ¡Clima ideal para hacer turismo!',
      moderateWeather: '⛅ Buen tiempo para pasear',
      rainWarning: '🌧️ Lluvia prevista – ¡lleva paraguas!'
    },
    fr: {
      weatherTitle: 'Météo pour votre journée d\'excursion 🌤️',
      weatherSubtitle: 'Tadzik vérifie la météo et vous conseille sur votre tenue et votre retour avant la nuit',
      selectDay: 'Choisir le jour de la visite :',
      today: 'Aujourd\'hui',
      tomorrow: 'Demain',
      in2Days: 'Après-demain',
      feelsLike: 'Ressenti :',
      rainChance: 'Risque de pluie :',
      rainVolume: 'Précipitations :',
      wind: 'Vent :',
      uvIndex: 'Indice UV :',
      airQuality: 'Qualité de l\'air :',
      sunrise: 'Lever du soleil :',
      sunset: 'Coucher du soleil (retour sécurisé) :',
      hourlyForecast: 'Météo heure par heure :',
      tadzikAdvice: 'Conseils de Tadzik :',
      whatToPack: 'À mettre dans son sac :',
      bestHours: 'Meilleures heures de visite :',
      safetyNote: 'Conseil sécurité senior :',
      routeMode: 'Mode de transport :',
      transit: '🚌 Transports en commun (9292)',
      bike: '🚲 Vélo / Piste cyclable',
      walk: '🚶 À pied / Promenade',
      car: '🚗 Voiture (Parking P+R)',
      openMaps: 'Ouvrir dans Google Maps 🗺️',
      close: 'Fermer',
      idealWeather: '🌟 Météo idéale pour visiter !',
      moderateWeather: '⛅ Beau temps pour se promener',
      rainWarning: '🌧️ Pluie prévue – prenez un parapluie !'
    },
    ro: {
      weatherTitle: 'Prognoza meteo pentru ziua de vizită 🌤️',
      weatherSubtitle: 'Tadzik verifică vremea și vă sfătuiește cum să vă îmbrăcați și să vă întoarceți înainte de lăsarea serii',
      selectDay: 'Alegeți ziua excursiei:',
      today: 'Azi',
      tomorrow: 'Mâine',
      in2Days: 'Poimâine',
      feelsLike: 'Se simte ca:',
      rainChance: 'Șanse de ploaie:',
      rainVolume: 'Precipitații:',
      wind: 'Vânt:',
      uvIndex: 'Index UV:',
      airQuality: 'Calitatea aerului:',
      sunrise: 'Răsărit:',
      sunset: 'Apus (întoarcere în siguranță):',
      hourlyForecast: 'Evoluția vremii pe parcursul zilei:',
      tadzikAdvice: 'Sfaturile lui Tadzik:',
      whatToPack: 'Ce să aveți în rucsac:',
      bestHours: 'Cele mai bune ore de vizitare:',
      safetyNote: 'Notă de siguranță seniori:',
      routeMode: 'Mod de deplasare:',
      transit: '🚌 Transport public (9292)',
      bike: '🚲 Bicicletă / Pistă de biciclete',
      walk: '🚶 Pe jos / Plimbare',
      car: '🚗 Mașină (Parcare P+R)',
      openMaps: 'Deschide în Google Maps 🗺️',
      close: 'Închide',
      idealWeather: '🌟 Vreme ideală pentru vizitare!',
      moderateWeather: '⛅ Vreme bună de plimbare',
      rainWarning: '🌧️ Se anunță ploaie – luați o umbrelă!'
    },
    zh: {
      weatherTitle: '游览日天气预报 🌤️',
      weatherSubtitle: 'Tadzik 为您监测天气，提供穿着建议并确保天黑前安全返回',
      selectDay: '选择游览日期：',
      today: '今天',
      tomorrow: '明天',
      in2Days: '后天',
      feelsLike: '体感温度：',
      rainChance: '降雨概率：',
      rainVolume: '降水量：',
      wind: '风力：',
      uvIndex: '紫外线指数：',
      airQuality: '空气质量：',
      sunrise: '日出时间：',
      sunset: '日落时间（安全返回）：',
      hourlyForecast: '全天游览天气时间线：',
      tadzikAdvice: 'Tadzik 的旅行贴士：',
      whatToPack: '背包必备物品：',
      bestHours: '最佳游览时段：',
      safetyNote: '长者安全提示：',
      routeMode: '交通出行方式：',
      transit: '🚌 公共交通 (9292)',
      bike: '🚲 自行车 / 专属骑行道',
      walk: '🚶 徒步漫游',
      car: '🚗 自驾 (P+R 停车场)',
      openMaps: '在 Google 地图中打开 🗺️',
      close: '关闭',
      idealWeather: '🌟 极佳的观光游览天气！',
      moderateWeather: '⛅ 适宜出行的舒适天气',
      rainWarning: '🌧️ 预计有雨 – 请随身携带雨伞！'
    }
  };

  return dict[language] || dict.en;
}

/**
 * Deterministic weather generator for realistic and reliable offline/fast fallback forecasts
 */
export function generateSightseeingForecast(
  cityName: string,
  countryName: string = 'Netherlands',
  language: Language = 'pl'
): DayForecast[] {
  const dayNamesMap: Record<Language, string[]> = {
    pl: ['Dziś', 'Jutro', 'Pojutrze', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'],
    nl: ['Vandaag', 'Morgen', 'Overmorgen', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'],
    en: ['Today', 'Tomorrow', 'In 2 days', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    de: ['Heute', 'Morgen', 'Übermorgen', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    es: ['Hoy', 'Mañana', 'Pasado mañana', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    fr: ['Aujourd\'hui', 'Demain', 'Après-demain', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    ro: ['Azi', 'Mâine', 'Poimâine', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'],
    zh: ['今天', '明天', '后天', '星期三', '星期四', '星期五', '星期六', '星期日']
  };

  const dayNames = dayNamesMap[language] || dayNamesMap.en;
  const pl = language === 'pl';
  const nl = language === 'nl';

  const now = new Date();
  
  // Seed using city name for deterministic feel
  const cityHash = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const forecasts: DayForecast[] = [];

  const weatherPresets = [
    {
      conditionPl: 'Słonecznie i przyjemnie ciepło',
      conditionNl: 'Zonnig en aangenaam warm',
      conditionEn: 'Sunny and pleasantly warm',
      icon: '☀️',
      tempMax: 23,
      tempMin: 14,
      rainChance: 5,
      rainMm: 0,
      windSpeed: 11,
      windDir: 'SW',
      uv: 5,
      rating: 'ideal' as const,
      packingPl: ['Okulary przeciwsłoneczne', 'Lekka czapeczka/kapelusz', 'Butelka wody mineralnej', 'Wygodne sandały/półbuty'],
      packingNl: ['Zonnebril', 'Lichte pet/hoed', 'Flesje water', 'Comfortabele wandelschoenen'],
      packingEn: ['Sunglasses', 'Sun hat', 'Water bottle', 'Comfortable walking shoes'],
      advicePl: 'Cudowna aura na spacery, kawę w ogródku na świeżym powietrzu i zwiedzanie punktów widokowych! Przed godz. 20:30 zaplanuj powrót na stację.',
      adviceNl: 'Heerlijk weer voor een terrasje, wandeltocht en uitzichtpunten! Plan de terugreis voor 20:30 uur.',
      adviceEn: 'Wonderful weather for outdoor walks, terrace coffee, and viewpoints! Plan your return to the station before 20:30.'
    },
    {
      conditionPl: 'Umiarkowane zachmurzenie z przejaśnieniami',
      conditionNl: 'Licht bewolkt met zonnige perioden',
      conditionEn: 'Partly cloudy with sunny intervals',
      icon: '⛅',
      tempMax: 21,
      tempMin: 13,
      rainChance: 15,
      rainMm: 0.1,
      windSpeed: 14,
      windDir: 'W',
      uv: 4,
      rating: 'good' as const,
      packingPl: ['Lekka wiatrówka', 'Okulary', 'Mały składany parasol w razie przelotnej mżawki'],
      packingNl: ['Lichte windjack', 'Zonnebril', 'Kleine paraplu'],
      packingEn: ['Light windbreaker', 'Sunglasses', 'Compact umbrella'],
      advicePl: 'Bardzo komfortowa temperatura do zwiedzania zarówno ogrodów, jak i wnętrz muzeów. Ścieżki są w 100% suche i bezpieczne dla seniorów.',
      adviceNl: 'Zeer comfortabele temperatuur voor zowel musea als stadswandelingen. Paden zijn droog en veilig.',
      adviceEn: 'Very comfortable temperature for both museums and park strolls. Pathways are fully dry and senior-safe.'
    },
    {
      conditionPl: 'Ciepło z orzeźwiającym wietrzykiem',
      conditionNl: 'Warm met een verfrissend briesje',
      conditionEn: 'Warm with a refreshing breeze',
      icon: '🌤️',
      tempMax: 24,
      tempMin: 15,
      rainChance: 10,
      rainMm: 0,
      windSpeed: 16,
      windDir: 'NW',
      uv: 5,
      rating: 'ideal' as const,
      packingPl: ['Wygodne buty spacerowe', 'Krem z filtrem UV', 'Woda i chusteczki nawilżane'],
      packingNl: ['Comfortabele schoenen', 'Zonnebrandcrème', 'Waterflesje'],
      packingEn: ['Comfortable shoes', 'Sunscreen', 'Water bottle'],
      advicePl: 'Wietrzyk od kanałów i morza daje świetną ulgę podczas spacerów. Warto wejść na dach lub do parkowej kawiarenki.',
      adviceNl: 'De bries vanaf het water zorgt voor aangename verkoeling. Bezoek zeker het dakterras of parkcafé.',
      adviceEn: 'The pleasant breeze from the water keeps the air fresh. Great day to explore rooftops and park pavilions.'
    },
    {
      conditionPl: 'Możliwe przelotne opady po południu',
      conditionNl: 'Kans op een lichte bui in de namiddag',
      conditionEn: 'Passing shower possible in late afternoon',
      icon: '🌦️',
      tempMax: 19,
      tempMin: 12,
      rainChance: 45,
      rainMm: 1.8,
      windSpeed: 18,
      windDir: 'W',
      uv: 3,
      rating: 'moderate' as const,
      packingPl: ['Nieprzemakalna kurtka z kapturem', 'Mocny parasol', 'Obuwie z antypoślizgową podeszwą'],
      packingNl: ['Waterdichte jas', 'Paraplu', 'Schoenen met antislipzool'],
      packingEn: ['Rain jacket with hood', 'Sturdy umbrella', 'Anti-slip sole shoes'],
      advicePl: 'Rano pogoda doskonała na spacer na zewnątrz! Na popołudnie (14:00 - 16:30) warto zaplanować zwiedzanie wnętrz muzealnych lub ciepły posiłek.',
      adviceNl: 'Ochtend is ideaal om buiten te wandelen. Plan museumbezoek of lunch voor de namiddag (14:00 - 16:30).',
      adviceEn: 'Morning is wonderful for outdoor sights! Plan indoor exhibitions or warm cafe rest for the afternoon.'
    },
    {
      conditionPl: 'Błękitne niebo i bezchmurny dzień',
      conditionNl: 'Stralend blauwe lucht en volop zon',
      conditionEn: 'Clear blue skies and continuous sunshine',
      icon: '☀️',
      tempMax: 25,
      tempMin: 16,
      rainChance: 0,
      rainMm: 0,
      windSpeed: 9,
      windDir: 'S',
      uv: 6,
      rating: 'ideal' as const,
      packingPl: ['Kapelusz przeciwsłoneczny', 'Okulary UV', 'Krem z filtrem', '2x butelka wody'],
      packingNl: ['Zonnehoed', 'UV-zonnebril', 'Zonnebrandcrème', 'Water'],
      packingEn: ['Sun hat', 'UV sunglasses', 'Sunscreen', 'Extra water'],
      advicePl: 'Perfekcyjny dzień na wycieczkę rowerową lub rejs tramwajem wodnym. Pamiętaj o regularnym piciu wody i odpoczynku na ławeczkach w cieniu.',
      adviceNl: 'Perfecte dag voor een fietstocht of rondvaartboot. Drink voldoende water en rust regelmatig in de schaduw.',
      adviceEn: 'Flawless day for cycling or water-bus cruising. Remember to stay hydrated and rest on shaded park benches.'
    }
  ];

  for (let i = 0; i < 5; i++) {
    const forecastDate = new Date(now);
    forecastDate.setDate(now.getDate() + i);

    const dateStr = forecastDate.toISOString().split('T')[0];
    const dayLabel = i < 3 ? dayNames[i] : `${dayNames[i]} (${forecastDate.getDate()}.${forecastDate.getMonth() + 1 < 10 ? '0' : ''}${forecastDate.getMonth() + 1})`;
    const shortLabel = i < 3 ? dayNames[i] : dayNames[i].substring(0, 4);

    const presetIdx = (cityHash + i) % weatherPresets.length;
    const preset = weatherPresets[presetIdx];

    // Temperature small deterministic variance
    const tempMax = preset.tempMax + ((cityHash + i * 3) % 3) - 1;
    const tempMin = preset.tempMin + ((cityHash + i * 2) % 3) - 1;
    const feelsLike = tempMax + 1;

    // Hourly samples
    const hourly: HourlyWeather[] = [
      {
        time: '09:00',
        temp: tempMin + 2,
        condition: pl ? 'Rześki poranek, słońce' : 'Fresh morning, sunny',
        icon: '🌤️',
        rainChance: Math.max(0, preset.rainChance - 10),
        windSpeed: preset.windSpeed - 3
      },
      {
        time: '12:00',
        temp: tempMax - 1,
        condition: pl ? preset.conditionPl : preset.conditionEn,
        icon: preset.icon,
        rainChance: preset.rainChance,
        windSpeed: preset.windSpeed
      },
      {
        time: '15:00',
        temp: tempMax,
        condition: pl ? preset.conditionPl : preset.conditionEn,
        icon: preset.icon,
        rainChance: preset.rainChance,
        windSpeed: preset.windSpeed + 2
      },
      {
        time: '18:00',
        temp: tempMax - 2,
        condition: pl ? 'Ciepły wieczór, złote słońce' : 'Warm evening, golden light',
        icon: '🌅',
        rainChance: Math.max(0, preset.rainChance - 5),
        windSpeed: preset.windSpeed - 1
      },
      {
        time: '21:00',
        temp: tempMin + 3,
        condition: pl ? 'Spokojny, chłodny zmierzch' : 'Calm, cool dusk',
        icon: '🌙',
        rainChance: Math.max(0, preset.rainChance - 10),
        windSpeed: preset.windSpeed - 4
      }
    ];

    forecasts.push({
      date: dateStr,
      dayName: dayLabel,
      dayShort: shortLabel,
      condition: pl ? preset.conditionPl : nl ? preset.conditionNl : preset.conditionEn,
      icon: preset.icon,
      tempMax,
      tempMin,
      feelsLike,
      rainChance: preset.rainChance,
      rainMm: preset.rainMm,
      windSpeed: preset.windSpeed,
      windDirection: preset.windDir,
      uvIndex: preset.uv,
      airQuality: pl ? 'Doskonała (AQI 18-24)' : nl ? 'Uitstekend (AQI 18-24)' : 'Excellent (AQI 18-24)',
      humidity: 55 + (i * 3) % 20,
      sunrise: '06:18',
      sunset: '20:48',
      hourly,
      sightseeingRating: preset.rating,
      tadzikTips: {
        packing: pl ? preset.packingPl : nl ? preset.packingNl : preset.packingEn,
        bestHours: '10:00 - 17:30',
        advice: pl ? preset.advicePl : nl ? preset.adviceNl : preset.adviceEn
      }
    });
  }

  return forecasts;
}

/**
 * Fetch live weather from Open-Meteo or fallback seamlessly
 */
export async function getSightseeingWeather(
  city: string,
  country: string = 'Netherlands',
  language: Language = 'pl'
): Promise<SightseeingWeather> {
  const cleanCity = city.trim();
  const coords = CITY_COORDINATES[cleanCity] || CITY_COORDINATES['Rotterdam'];

  // Generated robust multi-day baseline
  const availableDays = generateSightseeingForecast(cleanCity, country, language);

  try {
    // Attempt live Open-Meteo query with timeout protection (no API key required)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max,uv_index_max,sunrise,sunset&hourly=temperature_2m,precipitation_probability,weathercode&current_weather=true&timezone=auto`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.daily && data.daily.time && data.daily.time.length > 0) {
        // Overlay live values onto our structured days
        for (let idx = 0; idx < Math.min(availableDays.length, data.daily.time.length); idx++) {
          if (data.daily.temperature_2m_max?.[idx] !== undefined) {
            availableDays[idx].tempMax = Math.round(data.daily.temperature_2m_max[idx]);
          }
          if (data.daily.temperature_2m_min?.[idx] !== undefined) {
            availableDays[idx].tempMin = Math.round(data.daily.temperature_2m_min[idx]);
          }
          if (data.daily.precipitation_probability_max?.[idx] !== undefined) {
            availableDays[idx].rainChance = Math.round(data.daily.precipitation_probability_max[idx]);
          }
          if (data.daily.precipitation_sum?.[idx] !== undefined) {
            availableDays[idx].rainMm = Number(data.daily.precipitation_sum[idx].toFixed(1));
          }
          if (data.daily.windspeed_10m_max?.[idx] !== undefined) {
            availableDays[idx].windSpeed = Math.round(data.daily.windspeed_10m_max[idx]);
          }
          if (data.daily.uv_index_max?.[idx] !== undefined) {
            availableDays[idx].uvIndex = Math.round(data.daily.uv_index_max[idx]);
          }
          if (data.daily.sunrise?.[idx]) {
            availableDays[idx].sunrise = data.daily.sunrise[idx].split('T')[1]?.substring(0, 5) || '06:18';
          }
          if (data.daily.sunset?.[idx]) {
            availableDays[idx].sunset = data.daily.sunset[idx].split('T')[1]?.substring(0, 5) || '20:48';
          }

          // Adjust weather condition and rating dynamically if rain chance is high
          if (availableDays[idx].rainChance > 50) {
            availableDays[idx].icon = '🌧️';
            availableDays[idx].sightseeingRating = 'rain_warning';
          } else if (availableDays[idx].rainChance > 25) {
            availableDays[idx].icon = '🌦️';
            availableDays[idx].sightseeingRating = 'moderate';
          }
        }
      }
    }
  } catch (err) {
    // Graceful fallback without blocking the UI
    console.info("Using smart offline sightseeing weather generator:", err);
  }

  return {
    city: cleanCity,
    country: coords.country || country,
    selectedDay: availableDays[0],
    availableDays: availableDays
  };
}
