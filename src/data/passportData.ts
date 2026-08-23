/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';

export type PassportCountryCode = 'all' | 'pl' | 'nl' | 'be' | 'fr' | 'de';

export interface PassportCountryTab {
  code: PassportCountryCode;
  flag: string;
  name: Record<Language, string>;
  motto: Record<Language, string>;
}

export interface AttractionSticker {
  id: string;
  name: Record<Language, string>;
  city: string;
  countryCode: 'pl' | 'nl' | 'be' | 'fr' | 'de';
  country: Record<Language, string>;
  icon: string;
  badge?: string;
  coordinates: { lat: number; lng: number };
  radiusMeters: number; // Verification radius (e.g. 600m)
  verificationCode: string; // On-site 6-character check-in code
  checkInQuestion?: Record<Language, string>;
  isCommunityPlace?: boolean;
  addedBy?: string;
  createdAt?: string;
  photoUrl?: string;
  category?: string;
  customVibe?: string;
}

export interface RegionalStamp {
  region: string;
  city: string;
  countryCode: 'pl' | 'nl' | 'be' | 'fr' | 'de';
  country: Record<Language, string>;
  icon: string;
  description: Record<Language, string>;
  coordinates: { lat: number; lng: number };
  radiusKm: number; // Regional geofence radius
  verificationCode: string;
}

export const PASSPORT_COUNTRIES: PassportCountryTab[] = [
  {
    code: 'all',
    flag: '🌍',
    name: {
      pl: 'Wszystkie Kraje',
      nl: 'Alle Landen',
      en: 'All Countries',
      de: 'Alle Länder',
      es: 'Todos los Países',
      fr: 'Tous les Pays',
      ro: 'Toate Țările',
      zh: '全部国家'
    },
    motto: {
      pl: 'Kompletna europejska kolekcja naklejek i pieczątek Tadzika z zabezpieczeniem GPS & QR',
      nl: 'Complete Europese collectie van Tadzik-stempels met GPS & QR verificatie',
      en: 'Complete European collection of Tadzik stickers and stamps with verified GPS & QR protection',
      de: 'Vollständige europäische Sammlung von Tadzik-Stickern mit GPS & QR Prüfung',
      es: 'Colección europea completa de pegatinas y sellos de Tadzik con verificación GPS y QR',
      fr: 'Collection européenne complète de stickers et tampons de Tadzik avec vérification GPS & QR',
      ro: 'Colecția europeană completă de stickere și ștampile Tadzik cu verificare GPS și QR',
      zh: 'Tadzik 完整欧洲旅行贴纸与印章大系（支持真实 GPS 与二维码双重防作弊验证）'
    }
  },
  {
    code: 'pl',
    flag: '🇵🇱',
    name: {
      pl: 'Polska',
      nl: 'Polen',
      en: 'Poland',
      de: 'Polen',
      es: 'Polonia',
      fr: 'Pologne',
      ro: 'Polonia',
      zh: '波兰'
    },
    motto: {
      pl: 'Królewskie zamki, bałtyckie plaże, smocze legendy i zabytkowe rynki',
      nl: 'Koninklijke kastelen, Baltische stranden, draken en historische pleinen',
      en: 'Royal castles, Baltic beaches, dragon legends, and historic town squares',
      de: 'Königsschlösser, Ostseestrände, Drachenlegenden und historische Marktplätze',
      es: 'Castillos reales, playas del Báltico, leyendas de dragones y plazas históricas',
      fr: 'Châteaux royaux, plages de la Baltique, légendes de dragons et places historiques',
      ro: 'Castele regale, plaje la Marea Baltică, legende cu dragoni și piețe istorice',
      zh: '皇家城堡、波罗的海沙滩、神龙传说与历史名城'
    }
  },
  {
    code: 'nl',
    flag: '🇳🇱',
    name: {
      pl: 'Holandia',
      nl: 'Nederland',
      en: 'Netherlands',
      de: 'Niederlande',
      es: 'Países Bajos',
      fr: 'Pays-Bas',
      ro: 'Olanda',
      zh: '荷兰'
    },
    motto: {
      pl: 'Wiatraki, malownicze kanały, arcydzieła sztuki i parki narodowe',
      nl: 'Windmolens, schilderachtige grachten, meesterwerken en nationale parken',
      en: 'Windmills, picturesque canals, art masterpieces, and national parks',
      de: 'Windmühlen, malerische Grachten, Meisterwerke und Nationalparks',
      es: 'Molinos de viento, canales pintorescos, obras maestras y parques nacionales',
      fr: 'Moulins à vent, canaux pittoresques, chefs-d\'œuvre et parcs nationaux',
      ro: 'Mori de vânt, canale pitorești, capodopere de artă și parcuri naționale',
      zh: '风车、诗意运河、艺术名作与国家公园'
    }
  },
  {
    code: 'be',
    flag: '🇧🇪',
    name: {
      pl: 'Belgia',
      nl: 'België',
      en: 'Belgium',
      de: 'Belgien',
      es: 'Bélgica',
      fr: 'Belgique',
      ro: 'Belgia',
      zh: '比利时'
    },
    motto: {
      pl: 'Gotyckie rynki, kultowe Atomium, czekoladowe manufaktury i urok Brugii',
      nl: 'Grote Markt, iconisch Atomium, chocolaterieën en de charme van Brugge',
      en: 'Gothic squares, iconic Atomium, chocolate craft, and Bruges canals',
      de: 'Gotische Plätze, ikonisches Atomium, Schokoladenkunst und der Zauber von Brügge',
      es: 'Plazas góticas, el emblemático Atomium, chocolates artesanos y Brujas',
      fr: 'Places gothiques, Atomium emblématique, chocolats fins et charme de Bruges',
      ro: 'Piețe gotice, emblematicul Atomium, ciocolată artizanală și Bruges',
      zh: '哥特式广场、标志性原子球塔、手工巧克力与布鲁日水城'
    }
  },
  {
    code: 'fr',
    flag: '🇫🇷',
    name: {
      pl: 'Francja',
      nl: 'Frankrijk',
      en: 'France',
      de: 'Frankreich',
      es: 'Francia',
      fr: 'France',
      ro: 'Franța',
      zh: '法国'
    },
    motto: {
      pl: 'Wieża Eiffla, Luwr, paryskie bulwary, zamki i urokliwe kawiarnie',
      nl: 'Eiffeltoren, Louvre, Parijse boulevards, paleizen en sfeervolle cafés',
      en: 'Eiffel Tower, Louvre, Parisian boulevards, palaces, and cozy cafes',
      de: 'Eiffelturm, Louvre, Pariser Boulevards, Schlösser und Cafés',
      es: 'Torre Eiffel, Museo del Louvre, bulevares parisinos y palacios',
      fr: 'Tour Eiffel, Musée du Louvre, boulevards parisiens et châteaux célèbres',
      ro: 'Turnul Eiffel, Luvru, bulevarde pariziene, castele și cafenele cochete',
      zh: '埃菲尔铁塔、卢浮宫、巴黎林荫大道与浪漫宫殿'
    }
  },
  {
    code: 'de',
    flag: '🇩🇪',
    name: {
      pl: 'Niemcy',
      nl: 'Duitsland',
      en: 'Germany',
      de: 'Deutschland',
      es: 'Alemania',
      fr: 'Allemagne',
      ro: 'Germania',
      zh: '德国'
    },
    motto: {
      pl: 'Brama Brandenburska, majestatyczne katedry, zamki i zielone aleje',
      nl: 'Brandenburger Tor, majestueuze kathedralen, kastelen en parken',
      en: 'Brandenburg Gate, grand cathedrals, fairytale castles, and green avenues',
      de: 'Brandenburger Tor, majestätische Dome, Schlösser und grüne Alleen',
      es: 'Puerta de Brandeburgo, grandes catedrales, castillos y amplias avenidas',
      fr: 'Porte de Brandebourg, cathédrales majestueuses, châteaux et avenues',
      ro: 'Poarta Brandenburg, catedrale mărețe, castele de poveste și parcuri',
      zh: '勃兰登堡门、宏伟教堂、童话城堡与绿色大道'
    }
  }
];

export const ALL_PASSPORT_STICKERS: AttractionSticker[] = [
  // --- POLSKA 🇵🇱 ---
  {
    id: 'sticker-wawel',
    name: { pl: 'Zamek Królewski Wawel', nl: 'Koninklijk Kasteel Wawel', en: 'Wawel Royal Castle', de: 'Königsschloss Wawel', es: 'Castillo Real de Wawel', fr: 'Château royal du Wawel', ro: 'Castelul Regal Wawel', zh: '瓦维尔皇家城堡' },
    city: 'Kraków',
    countryCode: 'pl',
    country: { pl: 'Polska', nl: 'Polen', en: 'Poland', de: 'Polen', es: 'Polonia', fr: 'Pologne', ro: 'Polonia', zh: '波兰' },
    icon: '🏰',
    coordinates: { lat: 50.0540, lng: 19.9354 },
    radiusMeters: 600,
    verificationCode: 'WAWEL-5001',
    checkInQuestion: {
      pl: 'Na którym wzgórzu wznosi się Zamek Królewski?',
      nl: 'Op welke heuvel staat het Koninklijk Kasteel?',
      en: 'On which hill does the Royal Castle stand?',
      de: 'Auf welchem Hügel steht das Königsschloss?',
      es: '¿En qué colina se alza el Castillo Real?',
      fr: 'Sur quelle colline se dresse le Château royal ?',
      ro: 'Pe ce deal se înalță Castelul Regal?',
      zh: '皇家城堡矗立在哪座山丘上？'
    }
  },
  {
    id: 'sticker-wawel-dragon',
    name: { pl: 'Smok Wawelski & Smocza Jama', nl: 'Waweldraak & Drakengrot', en: 'Wawel Dragon & Cave', de: 'Wawel-Drache & Drachenhöhle', es: 'Dragón de Wawel y Cueva', fr: 'Dragon du Wawel et grotte', ro: 'Dragonul Wawel & Peștera', zh: '瓦维尔神龙与龙穴' },
    city: 'Kraków',
    countryCode: 'pl',
    country: { pl: 'Polska', nl: 'Polen', en: 'Poland', de: 'Polen', es: 'Polonia', fr: 'Pologne', ro: 'Polonia', zh: '波兰' },
    icon: '🐉',
    coordinates: { lat: 50.0529, lng: 19.9333 },
    radiusMeters: 450,
    verificationCode: 'SMOK-5002',
    checkInQuestion: {
      pl: 'Co zieje rzeźba Smoka Wawelskiego co kilka minut?',
      nl: 'Wat spuwt het standbeeld van de Waweldraak elke paar minuten?',
      en: 'What does the Wawel Dragon sculpture breathe every few minutes?',
      de: 'Was speit die Drachenskulptur alle paar Minuten?',
      es: '¿Qué escupe la escultura del Dragón de Wawel?',
      fr: 'Que crache la sculpture du Dragon du Wawel ?',
      ro: 'Ce scuipă sculptura Dragonului Wawel?',
      zh: '神龙雕像每隔几分钟会喷出什么？'
    }
  },
  {
    id: 'sticker-lazienki',
    name: { pl: 'Łazienki Królewskie', nl: 'Koninklijk Łazienki Park', en: 'Royal Łazienki Park', de: 'Königlicher Łazienki-Park', es: 'Parque Real Łazienki', fr: 'Parc royal de Łazienki', ro: 'Parcul Regal Łazienki', zh: '瓦津基皇家公园' },
    city: 'Warszawa',
    countryCode: 'pl',
    country: { pl: 'Polska', nl: 'Polen', en: 'Poland', de: 'Polen', es: 'Polonia', fr: 'Pologne', ro: 'Polonia', zh: '波兰' },
    icon: '🦚',
    coordinates: { lat: 52.2144, lng: 21.0353 },
    radiusMeters: 700,
    verificationCode: 'LAZ-5201'
  },
  {
    id: 'sticker-zuraw',
    name: { pl: 'Zabytkowy Żuraw Gdański', nl: 'Historische Kraanpoort', en: 'Historic Gdańsk Crane', de: 'Historisches Krantor', es: 'Grúa histórica de Gdansk', fr: 'Grue médiévale de Gdańsk', ro: 'Macaraua Istorică din Gdańsk', zh: '格但斯克起重机' },
    city: 'Gdańsk',
    countryCode: 'pl',
    country: { pl: 'Polska', nl: 'Polen', en: 'Poland', de: 'Polen', es: 'Polonia', fr: 'Pologne', ro: 'Polonia', zh: '波兰' },
    icon: '⚓',
    coordinates: { lat: 54.3508, lng: 18.6575 },
    radiusMeters: 500,
    verificationCode: 'ZUR-5401'
  },
  {
    id: 'sticker-molo',
    name: { pl: 'Molo w Sopocie', nl: 'Pier van Sopot', en: 'Sopot Pier', de: 'Seebrücke von Sopot', es: 'Muelle de Sopot', fr: 'Jetée de Sopot', ro: 'Pontonul din Sopot', zh: '索波特码头' },
    city: 'Sopot',
    countryCode: 'pl',
    country: { pl: 'Polska', nl: 'Polen', en: 'Poland', de: 'Polen', es: 'Polonia', fr: 'Pologne', ro: 'Polonia', zh: '波兰' },
    icon: '🌊',
    coordinates: { lat: 54.4469, lng: 18.5714 },
    radiusMeters: 500,
    verificationCode: 'MOLO-5402'
  },
  {
    id: 'sticker-wroclaw-krasnale',
    name: { pl: 'Wrocławskie Krasnale i Rynek', nl: 'Wrocław Kabouters', en: 'Wrocław Dwarfs & Old Town', de: 'Breslauer Zwerge', es: 'Enanos de Breslavia', fr: 'Nains de Wrocław', ro: 'Piticii din Wrocław', zh: '弗罗茨瓦夫小矮人' },
    city: 'Wrocław',
    countryCode: 'pl',
    country: { pl: 'Polska', nl: 'Polen', en: 'Poland', de: 'Polen', es: 'Polonia', fr: 'Pologne', ro: 'Polonia', zh: '波兰' },
    icon: '🧙‍♂️',
    coordinates: { lat: 51.1097, lng: 17.0319 },
    radiusMeters: 600,
    verificationCode: 'KRAS-5101'
  },

  // --- HOLANDIA 🇳🇱 ---
  {
    id: 'sticker-rijks',
    name: { pl: 'Rijksmuseum', nl: 'Rijksmuseum', en: 'Rijksmuseum', de: 'Rijksmuseum', es: 'Rijksmuseum', fr: 'Rijksmuseum', ro: 'Rijksmuseum', zh: '荷兰国家博物馆' },
    city: 'Amsterdam',
    countryCode: 'nl',
    country: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' },
    icon: '🖼️',
    coordinates: { lat: 52.3600, lng: 4.8852 },
    radiusMeters: 550,
    verificationCode: 'RIJKS-5201'
  },
  {
    id: 'sticker-depot',
    name: { pl: 'Depot Boijmans', nl: 'Depot Boijmans', en: 'Depot Boijmans', de: 'Depot Boijmans', es: 'Depot Boijmans', fr: 'Depot Boijmans', ro: 'Depot Boijmans', zh: '博伊曼斯艺术仓库' },
    city: 'Rotterdam',
    countryCode: 'nl',
    country: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' },
    icon: '🪞',
    coordinates: { lat: 51.9142, lng: 4.4735 },
    radiusMeters: 500,
    verificationCode: 'DEPOT-5191'
  },
  {
    id: 'sticker-kralingse',
    name: { pl: 'Kralingse Bos & Jezioro', nl: 'Kralingse Bos & Plas', en: 'Kralingse Forest & Lake', de: 'Kralingse Bos & See', es: 'Bosque y Lago Kralingse', fr: 'Forêt et lac Kralingse', ro: 'Pădurea și Lacul Kralingse', zh: '克拉灵塞森林与湖泊' },
    city: 'Rotterdam',
    countryCode: 'nl',
    country: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' },
    icon: '🌲',
    coordinates: { lat: 51.9317, lng: 4.5165 },
    radiusMeters: 800,
    verificationCode: 'KRAL-5193'
  },
  {
    id: 'sticker-domtower',
    name: { pl: 'Wieża Domtoren', nl: 'Domtoren', en: 'Dom Tower', de: 'Domturm', es: 'Torre Dom', fr: 'Tour Dom', ro: 'Turnul Dom', zh: '乌得勒支圆顶大教堂塔楼' },
    city: 'Utrecht',
    countryCode: 'nl',
    country: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' },
    icon: '🗼',
    coordinates: { lat: 52.0907, lng: 5.1214 },
    radiusMeters: 500,
    verificationCode: 'DOM-5209'
  },
  {
    id: 'sticker-vondel',
    name: { pl: 'Vondelpark & Kanały', nl: 'Vondelpark & Grachten', en: 'Vondelpark & Canals', de: 'Vondelpark & Grachten', es: 'Vondelpark y Canales', fr: 'Vondelpark et Canaux', ro: 'Vondelpark & Canale', zh: '冯德尔公园与运河' },
    city: 'Amsterdam',
    countryCode: 'nl',
    country: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' },
    icon: '🌷',
    coordinates: { lat: 52.3580, lng: 4.8686 },
    radiusMeters: 750,
    verificationCode: 'VOND-5235'
  },
  {
    id: 'sticker-scheveningen',
    name: { pl: 'Plaża Scheveningen & Molo', nl: 'Strand Scheveningen', en: 'Scheveningen Beach & Pier', de: 'Strand Scheveningen', es: 'Playa de Scheveningen', fr: 'Plage de Scheveningen', ro: 'Plaja Scheveningen', zh: '斯海弗宁恩海滩' },
    city: 'Den Haag',
    countryCode: 'nl',
    country: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' },
    icon: '🏖️',
    coordinates: { lat: 52.1158, lng: 4.2798 },
    radiusMeters: 600,
    verificationCode: 'SCHEV-5211'
  },
  {
    id: 'sticker-spido',
    name: { pl: 'Rejs Portowy Spido', nl: 'Spido Rondvaart', en: 'Spido Port Cruise', de: 'Spido Hafenrundfahrt', es: 'Crucero por el puerto Spido', fr: 'Croisière portuaire Spido', ro: 'Croazieră Portuară Spido', zh: 'Spido港口游船' },
    city: 'Rotterdam',
    countryCode: 'nl',
    country: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' },
    icon: '🚢',
    coordinates: { lat: 51.9094, lng: 4.4827 },
    radiusMeters: 500,
    verificationCode: 'SPIDO-5190'
  },
  {
    id: 'sticker-plaswijck',
    name: { pl: 'Plaswijckpark', nl: 'Plaswijckpark', en: 'Plaswijckpark', de: 'Plaswijckpark', es: 'Plaswijckpark', fr: 'Plaswijckpark', ro: 'Plaswijckpark', zh: '普拉斯维克公园' },
    city: 'Rotterdam',
    countryCode: 'nl',
    country: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' },
    icon: '🎡',
    coordinates: { lat: 51.9540, lng: 4.4980 },
    radiusMeters: 600,
    verificationCode: 'PLAS-5195'
  },
  {
    id: 'sticker-veluwe',
    name: { pl: 'Park Narodowy Hoge Veluwe', nl: 'Nationaal Park De Hoge Veluwe', en: 'De Hoge Veluwe National Park', de: 'Nationalpark De Hoge Veluwe', es: 'Parque Nacional De Hoge Veluwe', fr: 'Parc national De Hoge Veluwe', ro: 'Parcul Național De Hoge Veluwe', zh: '高费吕沃国家公园' },
    city: 'Ede / Otterlo',
    countryCode: 'nl',
    country: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' },
    icon: '🚲',
    coordinates: { lat: 52.0984, lng: 5.8247 },
    radiusMeters: 1500,
    verificationCode: 'VELU-5209'
  },
  {
    id: 'sticker-zaanse-schans',
    name: { pl: 'Wiatraki Zaanse Schans', nl: 'Molens Zaanse Schans', en: 'Zaanse Schans Windmills', de: 'Windmühlen Zaanse Schans', es: 'Molinos de Zaanse Schans', fr: 'Moulins de Zaanse Schans', ro: 'Morile de Vânt Zaanse Schans', zh: '赞斯堡风车村' },
    city: 'Zaandam',
    countryCode: 'nl',
    country: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' },
    icon: '🌾',
    coordinates: { lat: 52.4731, lng: 4.8197 },
    radiusMeters: 700,
    verificationCode: 'ZAAN-5247'
  },

  // --- BELGIA 🇧🇪 ---
  {
    id: 'sticker-atomium',
    name: { pl: 'Atomium', nl: 'Atomium', en: 'Atomium', de: 'Atomium', es: 'Atomium', fr: 'Atomium', ro: 'Atomium', zh: '原子球塔' },
    city: 'Brussels',
    countryCode: 'be',
    country: { pl: 'Belgia', nl: 'België', en: 'Belgium', de: 'Belgien', es: 'Bélgica', fr: 'Belgique', ro: 'Belgia', zh: '比利时' },
    icon: '⚛️',
    coordinates: { lat: 50.8949, lng: 4.3415 },
    radiusMeters: 550,
    verificationCode: 'ATOM-5089'
  },
  {
    id: 'sticker-grandplace',
    name: { pl: 'Grand Place (Grote Markt)', nl: 'Grote Markt', en: 'Grand Place', de: 'Grand-Place', es: 'Grand Place', fr: 'Grand-Place', ro: 'Grand Place', zh: '布鲁塞尔大广场' },
    city: 'Brussels',
    countryCode: 'be',
    country: { pl: 'Belgia', nl: 'België', en: 'Belgium', de: 'Belgien', es: 'Bélgica', fr: 'Belgique', ro: 'Belgia', zh: '比利时' },
    icon: '🏛️',
    coordinates: { lat: 50.8467, lng: 4.3524 },
    radiusMeters: 450,
    verificationCode: 'GRAND-5084'
  },
  {
    id: 'sticker-bruges-belfry',
    name: { pl: 'Dzwonnica i Kanały Brugii', nl: 'Belfort van Brugge', en: 'Bruges Belfry & Canals', de: 'Belfried von Brügge', es: 'Campanario de Brujas', fr: 'Beffroi de Bruges', ro: 'Turnul din Bruges', zh: '布鲁日钟楼' },
    city: 'Brugia',
    countryCode: 'be',
    country: { pl: 'Belgia', nl: 'België', en: 'Belgium', de: 'Belgien', es: 'Bélgica', fr: 'Belgique', ro: 'Belgia', zh: '比利时' },
    icon: '🔔',
    coordinates: { lat: 51.2082, lng: 3.2247 },
    radiusMeters: 500,
    verificationCode: 'BRUG-5120'
  },

  // --- FRANCJA 🇫🇷 ---
  {
    id: 'sticker-eiffel',
    name: { pl: 'Wieża Eiffla', nl: 'Eiffeltoren', en: 'Eiffel Tower', de: 'Eiffelturm', es: 'Torre Eiffel', fr: 'Tour Eiffel', ro: 'Turnul Eiffel', zh: '埃菲尔铁塔' },
    city: 'Paris',
    countryCode: 'fr',
    country: { pl: 'Francja', nl: 'Frankrijk', en: 'France', de: 'Frankreich', es: 'Francia', fr: 'France', ro: 'Franța', zh: '法国' },
    icon: '🗼',
    coordinates: { lat: 48.8584, lng: 2.2945 },
    radiusMeters: 600,
    verificationCode: 'EIFF-4885'
  },
  {
    id: 'sticker-louvre',
    name: { pl: 'Muzeum Luwr & Piramida', nl: 'Louvre Museum', en: 'Louvre Museum & Pyramid', de: 'Louvre-Museum', es: 'Museo del Louvre', fr: 'Musée du Louvre', ro: 'Muzeul Luvru', zh: '卢浮宫博物馆' },
    city: 'Paris',
    countryCode: 'fr',
    country: { pl: 'Francja', nl: 'Frankrijk', en: 'France', de: 'Frankreich', es: 'Francia', fr: 'France', ro: 'Franța', zh: '法国' },
    icon: '🏛️',
    coordinates: { lat: 48.8606, lng: 2.3376 },
    radiusMeters: 600,
    verificationCode: 'LOUV-4886'
  },
  {
    id: 'sticker-sacre-coeur',
    name: { pl: 'Bazylika Sacré-Cœur & Montmartre', nl: 'Sacré-Cœur & Montmartre', en: 'Sacré-Cœur & Montmartre', de: 'Sacré-Cœur', es: 'Sagrado Corazón', fr: 'Basilique du Sacré-Cœur', ro: 'Sacré-Cœur', zh: '圣心大教堂' },
    city: 'Paris',
    countryCode: 'fr',
    country: { pl: 'Francja', nl: 'Frankrijk', en: 'France', de: 'Frankreich', es: 'Francia', fr: 'France', ro: 'Franța', zh: '法国' },
    icon: '⛪',
    coordinates: { lat: 48.8867, lng: 2.3431 },
    radiusMeters: 550,
    verificationCode: 'SACR-4888'
  },

  // --- NIEMCY 🇩🇪 ---
  {
    id: 'sticker-brandenburg',
    name: { pl: 'Brama Brandenburska', nl: 'Brandenburger Tor', en: 'Brandenburg Gate', de: 'Brandenburger Tor', es: 'Puerta de Brandeburgo', fr: 'Porte de Brandebourg', ro: 'Poarta Brandenburg', zh: '勃兰登堡门' },
    city: 'Berlin',
    countryCode: 'de',
    country: { pl: 'Niemcy', nl: 'Duitsland', en: 'Germany', de: 'Deutschland', es: 'Alemania', fr: 'Allemagne', ro: 'Germania', zh: '德国' },
    icon: '🏛️',
    coordinates: { lat: 52.5163, lng: 13.3777 },
    radiusMeters: 500,
    verificationCode: 'BRAN-5251'
  },
  {
    id: 'sticker-cologne-cathedral',
    name: { pl: 'Katedra w Kolonii', nl: 'Dom van Keulen', en: 'Cologne Cathedral', de: 'Kölner Dom', es: 'Catedral de Colonia', fr: 'Cathédrale de Cologne', ro: 'Catedrala din Köln', zh: '科隆大教堂' },
    city: 'Köln',
    countryCode: 'de',
    country: { pl: 'Niemcy', nl: 'Duitsland', en: 'Germany', de: 'Deutschland', es: 'Alemania', fr: 'Allemagne', ro: 'Germania', zh: '德国' },
    icon: '⛪',
    coordinates: { lat: 50.9413, lng: 6.9583 },
    radiusMeters: 500,
    verificationCode: 'KOLN-5094'
  },
  {
    id: 'sticker-neuschwanstein',
    name: { pl: 'Zamek Neuschwanstein', nl: 'Kasteel Neuschwanstein', en: 'Neuschwanstein Castle', de: 'Schloss Neuschwanstein', es: 'Castillo de Neuschwanstein', fr: 'Château de Neuschwanstein', ro: 'Castelul Neuschwanstein', zh: '新天鹅堡' },
    city: 'Bawaria (Füssen)',
    countryCode: 'de',
    country: { pl: 'Niemcy', nl: 'Duitsland', en: 'Germany', de: 'Deutschland', es: 'Alemania', fr: 'Allemagne', ro: 'Germania', zh: '德国' },
    icon: '🏰',
    coordinates: { lat: 47.5576, lng: 10.7498 },
    radiusMeters: 1000,
    verificationCode: 'NEUS-4755'
  }
];

export const ALL_REGIONAL_STAMPS: RegionalStamp[] = [
  // --- POLSKA 🇵🇱 ---
  {
    region: 'Mazovia',
    city: 'Warszawa',
    countryCode: 'pl',
    country: { pl: 'Polska', nl: 'Polen', en: 'Poland', de: 'Polen', es: 'Polonia', fr: 'Pologne', ro: 'Polonia', zh: '波兰' },
    icon: '🏰',
    description: {
      pl: 'Serce Polski, zabytkowa Starówka, pałacowe ogrody i koncerty chopinowskie.',
      nl: 'Het hart van Polen, historische oude stad en koninklijke paleistuinen.',
      en: 'The heart of Poland, historic Old Town, royal gardens, and Chopin concerts.',
      de: 'Das Herz Polens, historische Altstadt und königliche Schlossgärten.',
      es: 'El corazón de Polonia, casco antiguo histórico y jardines reales.',
      fr: 'Le cœur de la Pologne, vieille ville historique et jardins royaux.',
      ro: 'Inima Poloniei, centrul vechi istoric și grădinile regale.',
      zh: '波兰的心脏，历史悠久的老城区与皇家花园。'
    },
    coordinates: { lat: 52.2297, lng: 21.0122 },
    radiusKm: 65,
    verificationCode: 'REG-MAZOV-PL'
  },
  {
    region: 'Lesser Poland',
    city: 'Kraków',
    countryCode: 'pl',
    country: { pl: 'Polska', nl: 'Polen', en: 'Poland', de: 'Polen', es: 'Polonia', fr: 'Pologne', ro: 'Polonia', zh: '波兰' },
    icon: '🐉',
    description: {
      pl: 'Królewski Wawel, Rynek Główny, Sukiennice, smocze legendy i krakowski klimat.',
      nl: 'Koninklijk Wawel, Grote Markt, lakenhal en drakenlegendes.',
      en: 'Royal Wawel Castle, Main Market Square, Cloth Hall, and dragon legends.',
      de: 'Königsschloss Wawel, Hauptmarkt, Tuchhallen und Drachenlegenden.',
      es: 'Castillo Real de Wawel, Plaza Mayor y leyendas de dragones.',
      fr: 'Château royal du Wawel, Grand-Place et légendes du dragon.',
      ro: 'Castelul Regal Wawel, Piața Mare și legendele dragonului.',
      zh: '瓦维尔皇家城堡、中央集市广场与神龙传说。'
    },
    coordinates: { lat: 50.0647, lng: 19.9450 },
    radiusKm: 55,
    verificationCode: 'REG-MALOP-PL'
  },
  {
    region: 'Pomerania',
    city: 'Gdańsk / Sopot',
    countryCode: 'pl',
    country: { pl: 'Polska', nl: 'Polen', en: 'Poland', de: 'Polen', es: 'Polonia', fr: 'Pologne', ro: 'Polonia', zh: '波兰' },
    icon: '⛵',
    description: {
      pl: 'Bursztynowe wybrzeże Bałtyku, hanzeatycki Gdańsk, molo w Sopocie i klify.',
      nl: 'Baltische kust, Hanzestad Gdańsk, pier van Sopot en kliffen.',
      en: 'Amber Baltic coast, Hanseatic Gdańsk, Sopot Pier, and scenic seaside cliffs.',
      de: 'Bernsteinküste der Ostsee, Hansestadt Danzig und Seebrücke Sopot.',
      es: 'Costa de ámbar del Báltico, Gdansk hanseática y muelle de Sopot.',
      fr: 'Côte d\'ambre de la Baltique, Gdańsk hanséatique et jetée de Sopot.',
      ro: 'Coasta de chihlimbar a Balticii, Gdańsk hanseatic și pontonul Sopot.',
      zh: '波罗的海琥珀海岸、汉萨同盟格但斯克与索波特码头。'
    },
    coordinates: { lat: 54.3520, lng: 18.6466 },
    radiusKm: 60,
    verificationCode: 'REG-POMER-PL'
  },

  // --- HOLANDIA 🇳🇱 ---
  {
    region: 'Zuid-Holland',
    city: 'Rotterdam / Den Haag',
    countryCode: 'nl',
    country: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' },
    icon: '⚓',
    description: {
      pl: 'Port Europy, futurystyczna architektura, pałace w Hadze i morska tradycja.',
      nl: 'Haven van Europa, futuristische architectuur, paleizen in Den Haag.',
      en: 'Port of Europe, futuristic architecture, royal palaces in The Hague.',
      de: 'Europas größter Hafen, futuristische Architektur und Haager Palais.',
      es: 'Puerto de Europa, arquitectura vanguardista y palacios en La Haya.',
      fr: 'Port de l\'Europe, architecture futuriste et palais royaux de La Haye.',
      ro: 'Portul Europei, arhitectură futuristă și palate regale în Haga.',
      zh: '欧洲大港、前卫建筑与海牙皇家宫殿。'
    },
    coordinates: { lat: 51.9244, lng: 4.4777 },
    radiusKm: 50,
    verificationCode: 'REG-ZH-NL'
  },
  {
    region: 'Noord-Holland',
    city: 'Amsterdam',
    countryCode: 'nl',
    country: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' },
    icon: '🛶',
    description: {
      pl: 'Kanały wpisane na listę UNESCO, arcydzieła Rembrandta i zielone aleje.',
      nl: 'UNESCO-grachten, meesterwerken van Rembrandt en groene parken.',
      en: 'UNESCO canal ring, Rembrandt masterpieces, and vibrant historic streets.',
      de: 'UNESCO-Grachten, Meisterwerke von Rembrandt und lebendige Gassen.',
      es: 'Canales de la UNESCO, obras maestras de Rembrandt y calles históricas.',
      fr: 'Canaux classés à l\'UNESCO, chefs-d\'œuvre de Rembrandt et parcs.',
      ro: 'Canalele UNESCO, capodoperele lui Rembrandt și parcuri verzi.',
      zh: '联合国教科文组织运河圈、伦勃朗名画与历史街区。'
    },
    coordinates: { lat: 52.3676, lng: 4.9041 },
    radiusKm: 55,
    verificationCode: 'REG-NH-NL'
  },
  {
    region: 'Utrecht',
    city: 'Utrecht',
    countryCode: 'nl',
    country: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' },
    icon: '🔔',
    description: {
      pl: 'Urokliwe dwupoziomowe nabrzeża, najwyższa wieża kościelna Domtoren i ogrody.',
      nl: 'Sfeervolle werven, de hoogste Domtoren en historische binnentuinen.',
      en: 'Historic wharf cellars, the soaring Dom Tower, and quiet courtyard gardens.',
      de: 'Historische Grachtenkeller, der Domturm und stille Klostergärten.',
      es: 'Muelle histórico en dos niveles, la torre Dom y jardines conventuales.',
      fr: 'Quais historiques à deux niveaux, la tour Dom et jardins secrets.',
      ro: 'Cheiuri istorice pe două niveluri, turnul Domtoren și grădini.',
      zh: '双层运河古道、标志性圆顶大教堂塔楼与隐秘花园。'
    },
    coordinates: { lat: 52.0907, lng: 5.1214 },
    radiusKm: 40,
    verificationCode: 'REG-UT-NL'
  },

  // --- BELGIA 🇧🇪 ---
  {
    region: 'Brussels-Capital',
    city: 'Brussels',
    countryCode: 'be',
    country: { pl: 'Belgia', nl: 'België', en: 'Belgium', de: 'Belgien', es: 'Bélgica', fr: 'Belgique', ro: 'Belgia', zh: '比利时' },
    icon: '🍫',
    description: {
      pl: 'Złote kamienice Grand Place, kultowe Atomium, czekolada i serce Europy.',
      nl: 'Gouden gildehuizen op de Grote Markt, Atomium, chocolade en EU-hart.',
      en: 'Gilded Grand Place guildhalls, iconic Atomium, world-class chocolate, and EU heart.',
      de: 'Vergoldete Zunfthäuser am Grand-Place, Atomium und feinste Schokolade.',
      es: 'Casas gremiales de la Grand Place, Atomium y el corazón de la UE.',
      fr: 'Maisons dorées de la Grand-Place, Atomium, chocolat et cœur de l\'Europe.',
      ro: 'Clădirile aurite din Grand Place, Atomium și inima Uniunii Europene.',
      zh: '大广场镀金公会大厅、标志性原子球塔与欧洲联盟之心。'
    },
    coordinates: { lat: 50.8503, lng: 4.3517 },
    radiusKm: 35,
    verificationCode: 'REG-BRU-BE'
  },
  {
    region: 'Flanders',
    city: 'Antwerp / Brugia',
    countryCode: 'be',
    country: { pl: 'Belgia', nl: 'België', en: 'Belgium', de: 'Belgien', es: 'Bélgica', fr: 'Belgique', ro: 'Belgia', zh: '比利时' },
    icon: '💎',
    description: {
      pl: 'Średniowieczna bajkowa Brugia, katedra kolejowa w Antwerpii i flamandzka sztuka.',
      nl: 'Sprookjesachtig Brugge, spoorwegkathedraal in Antwerpen en Vlaamse kunst.',
      en: 'Fairytale medieval Bruges, Antwerp railway cathedral, and Flemish art treasures.',
      de: 'Märchenhaftes Brügge, Antwerpens Bahnhofs-Kathedrale und flämische Kunst.',
      es: 'Brujas medieval de cuento de hadas, Amberes y tesoros del arte flamenco.',
      fr: 'Bruges médiévale féerique, cathédrale ferroviaire d\'Anvers et art flamand.',
      ro: 'Bruges medieval de poveste, catedrala feroviară din Anvers și artă flamandă.',
      zh: '童话般的中世纪布鲁日、安特卫普火车站大教堂与佛兰芒艺术瑰宝。'
    },
    coordinates: { lat: 51.2194, lng: 4.4025 },
    radiusKm: 65,
    verificationCode: 'REG-FLA-BE'
  },

  // --- FRANCJA 🇫🇷 ---
  {
    region: 'Île-de-France',
    city: 'Paris',
    countryCode: 'fr',
    country: { pl: 'Francja', nl: 'Frankrijk', en: 'France', de: 'Frankreich', es: 'Francia', fr: 'France', ro: 'Franța', zh: '法国' },
    icon: '🗼',
    description: {
      pl: 'Miasto Świateł, Wieża Eiffla, bulwary nad Sekwaną i niezrównane muzea.',
      nl: 'De Lichtstad, Eiffeltoren, Seine-oevers en wereldberoemde musea.',
      en: 'The City of Light, Eiffel Tower, Seine promenades, and world-class museums.',
      de: 'Die Stadt des Lichts, Eiffelturm, Seine-Promenaden und weltberühmte Museen.',
      es: 'La Ciudad de la Luz, la Torre Eiffel, paseos del Sena y grandes museos.',
      fr: 'La Ville Lumière, Tour Eiffel, berges de la Seine et musées légendaires.',
      ro: 'Orașul Luminilor, Turnul Eiffel, promenadele pe Sena și mari muzee.',
      zh: '光之城、埃菲尔铁塔、塞纳河畔林荫道与世界级博物馆。'
    },
    coordinates: { lat: 48.8566, lng: 2.3522 },
    radiusKm: 50,
    verificationCode: 'REG-IDF-FR'
  },

  // --- NIEMCY 🇩🇪 ---
  {
    region: 'Berlin',
    city: 'Berlin',
    countryCode: 'de',
    country: { pl: 'Niemcy', nl: 'Duitsland', en: 'Germany', de: 'Deutschland', es: 'Alemania', fr: 'Allemagne', ro: 'Germania', zh: '德国' },
    icon: '🐻',
    description: {
      pl: 'Symbol jedności, Wyspa Muzeów, Brama Brandenburska i parki miejskie.',
      nl: 'Symbool van eenheid, Museumeiland, Brandenburger Tor en groene parken.',
      en: 'Symbol of unity, Museum Island, Brandenburg Gate, and expansive parks.',
      de: 'Symbol der Einheit, Museumsinsel, Brandenburger Tor und weitläufige Parks.',
      es: 'Símbolo de unidad, Isla de los Museos, Puerta de Brandeburgo y parques.',
      fr: 'Symbole d\'unité, Île aux Musées, Porte de Brandebourg et parcs verdoyants.',
      ro: 'Simbolul unității, Insula Muzeelor, Poarta Brandenburg și parcuri mari.',
      zh: '团结之象征、博物馆岛、勃兰登堡门与广阔的城市公园。'
    },
    coordinates: { lat: 52.5200, lng: 13.4050 },
    radiusKm: 45,
    verificationCode: 'REG-BER-DE'
  }
];

// Helper to infer countryCode from city and region name
export function inferCountryCode(city: string, region?: string): 'pl' | 'nl' | 'be' | 'fr' | 'de' {
  const c = (city || '').toLowerCase();
  const r = (region || '').toLowerCase();
  
  if (
    c.includes('kraków') || c.includes('warszaw') || c.includes('gdańsk') || 
    c.includes('wrocław') || c.includes('sopot') || c.includes('zakopan') || 
    c.includes('pozna') || c.includes('polska') || r.includes('polska') || 
    r.includes('małopolsk') || r.includes('mazowsz') || r.includes('pomorz') || 
    r.includes('dolny śląsk') || r.includes('poland')
  ) {
    return 'pl';
  }
  if (
    c.includes('bruksel') || c.includes('brussel') || c.includes('antwerp') || 
    c.includes('brug') || c.includes('belgi') || r.includes('flanders') || 
    r.includes('brussels') || r.includes('belgium')
  ) {
    return 'be';
  }
  if (
    c.includes('paryż') || c.includes('paris') || c.includes('strasburg') || 
    c.includes('lyon') || c.includes('nice') || c.includes('france') || 
    r.includes('île-de-france') || r.includes('grand est')
  ) {
    return 'fr';
  }
  if (
    c.includes('berlin') || c.includes('poczdam') || c.includes('potsdam') || 
    c.includes('hamburg') || c.includes('münchen') || c.includes('deutschland') || 
    c.includes('germany') || r.includes('brandenburg') || r.includes('berlin')
  ) {
    return 'de';
  }
  return 'nl';
}

// Category to attractive emoji icon mapping
export function getCategoryEmoji(category?: string): string {
  switch (category) {
    case 'park': return '🌿';
    case 'forest': return '🌲';
    case 'historical':
    case 'historical_site': return '🏰';
    case 'museum': return '🏛️';
    case 'romantic': return '💖';
    case 'beach': return '🏖️';
    case 'restaurant_cafe': return '☕';
    case 'adult_park':
    case 'amusement_park': return '🎡';
    case 'toddler_park':
    case 'childrens_attraction': return '🎠';
    case 'waterway': return '⛵';
    default: return '📍';
  }
}

// Localized country name helper
export function getCountryLocalized(code: 'pl' | 'nl' | 'be' | 'fr' | 'de'): Record<Language, string> {
  const map: Record<'pl' | 'nl' | 'be' | 'fr' | 'de', Record<Language, string>> = {
    pl: { pl: 'Polska', nl: 'Polen', en: 'Poland', de: 'Polen', es: 'Polonia', fr: 'Pologne', ro: 'Polonia', zh: '波兰' },
    nl: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' },
    be: { pl: 'Belgia', nl: 'België', en: 'Belgium', de: 'Belgien', es: 'Bélgica', fr: 'Belgique', ro: 'Belgia', zh: '比利时' },
    fr: { pl: 'Francja', nl: 'Frankrijk', en: 'France', de: 'Frankreich', es: 'Francia', fr: 'France', ro: 'Franța', zh: '法国' },
    de: { pl: 'Niemcy', nl: 'Duitsland', en: 'Germany', de: 'Deutschland', es: 'Alemania', fr: 'Allemagne', ro: 'Germania', zh: '德国' }
  };
  return map[code] || map.nl;
}

// Convert any community-created attraction into a full Passport Sticker
export function convertAttractionToSticker(attraction: any, authorName?: string, photoUrl?: string): AttractionSticker {
  const countryCode = inferCountryCode(attraction.city, attraction.region);
  const icon = getCategoryEmoji(attraction.category);
  const safeName = attraction.name || 'Nowe Miejsce Podróży';
  
  // Clean alphanumeric code for verification
  const codePrefix = safeName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'COMM';
  const stickerId = attraction.id.startsWith('sticker-') ? attraction.id : `sticker-${attraction.id}`;
  
  return {
    id: stickerId,
    name: {
      pl: safeName,
      nl: safeName,
      en: safeName,
      de: safeName,
      es: safeName,
      fr: safeName,
      ro: safeName,
      zh: safeName
    },
    city: attraction.city || 'Rotterdam',
    countryCode: countryCode,
    country: getCountryLocalized(countryCode),
    icon: icon,
    badge: '✨ Nowa Naklejka Społeczności',
    coordinates: attraction.coordinates || { lat: 52.0000, lng: 5.0000 },
    radiusMeters: 600,
    verificationCode: `SPOT-${codePrefix}-2026`,
    checkInQuestion: {
      pl: `Jaka jest wyjątkowa atmosfera tego miejsca dodanego przez podróżnika w mieście ${attraction.city}?`,
      nl: `Wat is de unieke sfeer van deze plek toegevoegd door reizigers in ${attraction.city}?`,
      en: `What is the unique atmosphere of this place added by travelers in ${attraction.city}?`,
      de: `Was ist die besondere Atmosphäre dieses Ortes in ${attraction.city}?`,
      es: `¿Cuál es el ambiente especial de este lugar en ${attraction.city}?`,
      fr: `Quelle est l'atmosphère de ce lieu à ${attraction.city} ?`,
      ro: `Care este atmosfera acestui loc din ${attraction.city}?`,
      zh: `旅行者在 ${attraction.city} 发现的这个新景点有什么特色？`
    },
    isCommunityPlace: true,
    addedBy: authorName || 'Odkrywca Społeczności',
    createdAt: new Date().toISOString().split('T')[0],
    photoUrl: photoUrl || attraction.photoUrl,
    category: attraction.category,
    customVibe: attraction.moods?.[0]
  };
}

// Retrieve community stickers stored in localStorage
export function getCommunityStickersFromStorage(): AttractionSticker[] {
  try {
    const raw = localStorage.getItem('nl_tourist_planner_custom_attractions');
    if (!raw) return [];
    const attractions = JSON.parse(raw);
    if (!Array.isArray(attractions)) return [];
    
    // Also check stored community photos
    let photosMap: Record<string, any[]> = {};
    try {
      const photosRaw = localStorage.getItem('nl_tourist_planner_photos');
      if (photosRaw) photosMap = JSON.parse(photosRaw);
    } catch {}

    return attractions.map((att: any) => {
      const photoUrl = photosMap[att.id]?.[0]?.url || undefined;
      const author = photosMap[att.id]?.[0]?.addedBy || undefined;
      return convertAttractionToSticker(att, author, photoUrl);
    });
  } catch (e) {
    return [];
  }
}

