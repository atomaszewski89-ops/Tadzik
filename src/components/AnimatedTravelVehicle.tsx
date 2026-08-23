/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { Train, Bus, Bike, Car, Footprints, Zap, Sparkles, Volume2, VolumeX, Shuffle, Settings2, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';

export type VehicleType = 'train' | 'bus' | 'car' | 'motorcycle' | 'bicycle' | 'walk' | 'random';
export type VehicleSpeed = 'slow' | 'normal' | 'fast';

interface AnimatedTravelVehicleProps {
  language: Language;
}

interface VehicleInfo {
  id: VehicleType;
  icon: string;
  emoji: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  soundlessGreeting: Record<Language, string[]>;
  color: string;
  badgeBg: string;
}

export const VEHICLE_CONFIGS: Record<Exclude<VehicleType, 'random'>, VehicleInfo> = {
  train: {
    id: 'train',
    icon: '🚆',
    emoji: '🚆',
    name: {
      pl: 'Pociąg 🚆',
      nl: 'Trein 🚆',
      en: 'Train 🚆',
      de: 'Zug 🚆',
      es: 'Tren 🚆',
      fr: 'Train 🚆',
      ro: 'Tren 🚆',
      zh: '火车 🚆',
    },
    description: {
      pl: 'Komfortowa i punktualna podróż kolejowa po Europie',
      nl: 'Comfortabele en stipte treinreis door Europa',
      en: 'Comfortable & punctual rail journey across Europe',
      de: 'Komfortable und pünktliche Bahnreise durch Europa',
      es: 'Viaje en tren cómodo y puntual por Europa',
      fr: 'Voyage en train confortable et ponctuel à travers l\'Europe',
      ro: 'Călătorie confortabilă și punctuală cu trenul prin Europa',
      zh: '准时舒适的欧洲全景铁道列车之旅',
    },
    soundlessGreeting: {
      pl: ['Pociąg gotowy do odjazdu! Proszę wsiadać! 🚆', 'Bezpieczna podróż z zapasem 30 minut bufora! ⏱️', 'Kolej to wygoda i piękne widoki za oknem! 🌾'],
      nl: ['De trein staat klaar voor vertrek! Instappen alstublieft! 🚆', 'Zorgeloos reizen met 30 minuten spoorbuffer! ⏱️', 'Geniet van het prachtige uitzicht vanuit de coupé! 🌾'],
      en: ['All aboard! Train is departing on schedule! 🚆', 'Safe journey with 30-min return headway buffer! ⏱️', 'Relax and enjoy the scenic views from your window! 🌾'],
      de: ['Alles einsteigen! Der Zug fährt pünktlich ab! 🚆', 'Sorglos reisen mit 30 Minuten Zeitpuffer! ⏱️', 'Entspannen und die Aussicht im Zug genießen! 🌾'],
      es: ['¡Todos a bordo! ¡El tren sale a su hora! 🚆', '¡Viaje seguro con 30 min de margen de retorno! ⏱️', '¡Relájate y disfruta del paisaje desde la ventanilla! 🌾'],
      fr: ['En voiture ! Le train part à l\'heure ! 🚆', 'Voyage serein avec 30 minutes de marge de sécurité ! ⏱️', 'Détendez-vous et admirez les paysages qui défilent ! 🌾'],
      ro: ['Poftiți în vagoane! Trenul pleacă conform programului! 🚆', 'Călătorie fără griji cu 30 min marjă de siguranță! ⏱️', 'Relaxează-te și admiră priveliștea pe fereastră! 🌾'],
      zh: ['列车准点发车，请各位旅客就座！🚆', '尊享 30 分钟安全返回余量，出行无忧！⏱️', '靠窗而坐，尽赏窗外如画欧陆风景！🌾'],
    },
    color: 'from-purple-500 to-indigo-700',
    badgeBg: 'bg-purple-500/10 text-purple-700 border-purple-300',
  },
  bus: {
    id: 'bus',
    icon: '🚌',
    emoji: '🚌',
    name: {
      pl: 'Autobus / Tramwaj 🚌',
      nl: 'Bus / Tram 🚌',
      en: 'Bus / Tram 🚌',
      de: 'Bus / Tram 🚌',
      es: 'Autobús / Tranvía 🚌',
      fr: 'Bus / Tramway 🚌',
      ro: 'Autobuz / Tramvai 🚌',
      zh: '公交 / 有轨电车 🚌',
    },
    description: {
      pl: 'Wygodny transport miejski i regionalny bez barier',
      nl: 'Comfortabel stads- en streekvervoer zonder drempels',
      en: 'Convenient urban & regional public transport',
      de: 'Bequemer Stadt- und Regionalverkehr ohne Barrieren',
      es: 'Transporte público urbano y regional sin barreras',
      fr: 'Transports en commun urbains et régionaux accessibles',
      ro: 'Transport public urban și regional fără bariere',
      zh: '便捷无障碍的城市与区域公共交通',
    },
    soundlessGreeting: {
      pl: ['Przystanek na żądanie – bezpieczna podróż! 🚌', 'Niskopodłogowy autobus z klimatyzacją! 🚏', 'Komunikacja miejska bez barier schodowych! 🌆'],
      nl: ['Halte op verzoek – veilige reis! 🚌', 'Lagevloerbus met airconditioning! 🚏', 'Openbaar vervoer zonder drempels! 🌆'],
      en: ['Next stop on demand – safe journey! 🚌', 'Low-floor air-conditioned bus! 🚏', 'Step-free public transit at your service! 🌆'],
      de: ['Halt auf Verlangen – sichere Fahrt! 🚌', 'Niederflurbus mit Klimaanlage! 🚏', 'Barrierefreier Nahverkehr! 🌆'],
      es: ['¡Próxima parada – viaje seguro! 🚌', '¡Autobús de piso bajo con aire acondicionado! 🚏', '¡Transporte accesible sin escalones! 🌆'],
      fr: ['Arrêt demandé – voyage serein ! 🚌', 'Bus à plancher surbaissé et climatisé ! 🚏', 'Transports en commun 100% accessibles ! 🌆'],
      ro: ['Următoarea oprire – călătorie sigură! 🚌', 'Autobuz cu podea joasă și aer condiționat! 🚏', 'Transport public fără bariere! 🌆'],
      zh: ['下一站准时到达，安心出行！🚌', '全车低地板无障碍空调公交！🚏', '无台阶公共交通，贴心守护！🌆'],
    },
    color: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-500/10 text-blue-700 border-blue-300',
  },
  car: {
    id: 'car',
    icon: '🚗',
    emoji: '🚗',
    name: {
      pl: 'Samochód 🚗',
      nl: 'Auto 🚗',
      en: 'Car 🚗',
      de: 'Auto 🚗',
      es: 'Coche 🚗',
      fr: 'Voiture 🚗',
      ro: 'Mașină 🚗',
      zh: '汽车 🚗',
    },
    description: {
      pl: 'Malownicza trasa samochodowa przez zabytkowe miasteczka',
      nl: 'Schilderachtige autorit door historische steden',
      en: 'Scenic road trip through historic towns',
      de: 'Malerische Autoreise durch historische Städte',
      es: 'Ruta panorámica en coche por pueblos históricos',
      fr: 'Road-trip pittoresque à travers les cités historiques',
      ro: 'Excursie pitorească cu mașina prin orașe istorice',
      zh: '穿越历史小镇的风情自驾之旅',
    },
    soundlessGreeting: {
      pl: ['Szerokiej i bezpiecznej drogi! 🚗', 'Piękny dzień na wycieczkę za miasto! 🛣️', 'Kierunek: relaks i wspaniałe widoki! 🌳'],
      nl: ['Veilige reis over de wegen! 🚗', 'Mooie dag voor een autotocht! 🛣️', 'Bestemming: ontspanning en natuur! 🌳'],
      en: ['Safe travels on the open road! 🚗', 'Perfect day for a scenic drive! 🛣️', 'Destination: relaxation & sights! 🌳'],
      de: ['Gute und sichere Fahrt! 🚗', 'Perfekter Tag für einen Ausflug! 🛣️', 'Ziel: Entspannung und Aussicht! 🌳'],
      es: ['¡Buen viaje por carretera! 🚗', '¡Día ideal para una escapada! 🛣️', '¡Destino: relax y bellos paisajes! 🌳'],
      fr: ['Bonne route en toute sécurité ! 🚗', 'Parfaite journée pour une balade ! 🛣️', 'Destination : détente et paysages ! 🌳'],
      ro: ['Drum bun și călătorie sigură! 🚗', 'O zi minunată pentru o plimbare cu mașina! 🛣️', 'Destinație: relaxare și priveliști! 🌳'],
      zh: ['一路顺风，自驾畅行！🚗', '享受沿途绝美风景！🛣️', '目的地：轻松度假与探索！🌳'],
    },
    color: 'from-amber-500 to-rose-600',
    badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-300',
  },
  motorcycle: {
    id: 'motorcycle',
    icon: '🏍️',
    emoji: '🏍️',
    name: {
      pl: 'Motocykl / Skuter 🏍️',
      nl: 'Motor / Scooter 🏍️',
      en: 'Motorcycle 🏍️',
      de: 'Motorrad / Roller 🏍️',
      es: 'Moto / Escúter 🏍️',
      fr: 'Moto / Scooter 🏍️',
      ro: 'Motocicletă 🏍️',
      zh: '摩托车 / 踏板车 🏍️',
    },
    description: {
      pl: 'Trasa widokowa na dwóch kółkach ze spokojnymi postojami',
      nl: 'Panoramarit op twee wielen met ontspannen tussenstops',
      en: 'Scenic touring ride on two wheels with easy stops',
      de: 'Panoramafahrt auf zwei Rädern mit gemütlichen Pausen',
      es: 'Ruta panorámica sobre dos ruedas con paradas cómodas',
      fr: 'Balade panoramique sur deux roues avec pauses détente',
      ro: 'Traseu panoramic pe două roți cu opriri plăcute',
      zh: '两轮全景风景骑行，尽享惬意停留',
    },
    soundlessGreeting: {
      pl: ['Wspaniała trasa widokowa na dwóch kółkach! 🏍️', 'Wiatr, wolność i malownicze drogi! 🛣️', 'Bezpieczna i spokojna jazda turystyczna! 🌄'],
      nl: ['Prachtige panoramische tocht op twee wielen! 🏍️', 'Vrijheid en schilderachtige wegen! 🛣️', 'Veilige en ontspannen toertocht! 🌄'],
      en: ['Fantastic scenic touring on two wheels! 🏍️', 'Freedom, fresh air and lovely roads! 🛣️', 'Safe, relaxed exploration ride! 🌄'],
      de: ['Herrliche Panoramatour auf zwei Rädern! 🏍️', 'Freiheit und malerische Straßen! 🛣️', 'Sicher und entspannt unterwegs! 🌄'],
      es: ['¡Fantástica ruta panorámica en dos ruedas! 🏍️', '¡Libertad y carreteras pintorescas! 🛣️', '¡Paseo seguro y relajado! 🌄'],
      fr: ['Magnifique balade panoramique sur deux roues ! 🏍️', 'Liberté et routes pittoresques ! 🛣️', 'Voyage serein et reposant ! 🌄'],
      ro: ['Traseu panoramic minunat pe două roți! 🏍️', 'Libertate și drumuri pitorești! 🛣️', 'Călătorie sigură și relaxantă! 🌄'],
      zh: ['两轮全景风景漫游，畅享自由！🏍️', '微风拂面，领略如画沿途美景！🛣️', '安全平稳，尽享休闲自驾时光！🌄'],
    },
    color: 'from-orange-500 to-amber-600',
    badgeBg: 'bg-orange-500/10 text-orange-700 border-orange-300',
  },
  bicycle: {
    id: 'bicycle',
    icon: '🚲',
    emoji: '🚲',
    name: {
      pl: 'Rower 🚲',
      nl: 'Fiets 🚲',
      en: 'Bicycle 🚲',
      de: 'Fahrrad 🚲',
      es: 'Bicicleta 🚲',
      fr: 'Vélo 🚲',
      ro: 'Bicicletă 🚲',
      zh: '自行车 🚲',
    },
    description: {
      pl: 'Ekologiczna przejażdżka po zielonych ścieżkach fietspaden',
      nl: 'Milieuvriendelijke rit over de mooiste fietspaden',
      en: 'Eco-friendly ride along scenic green bike paths',
      de: 'Umweltfreundliche Fahrt auf grünen Radwegen',
      es: 'Paseo ecológico por preciosos carriles bici',
      fr: 'Balade écologique sur les pistes cyclables verdoyantes',
      ro: 'Plimbare ecologică pe piste de biciclete verzi',
      zh: '漫游风景如画的专属绿色自行车道',
    },
    soundlessGreeting: {
      pl: ['Dzyń, dzyń! Czas na wiatr we włosach! 🚲', 'Najlepsza trasa rowerowa z Tadzikiem! 🌷', 'Ruch to zdrowie i wspaniała zabawa! 🌞'],
      nl: ['Tring tring! Tijd voor een heerlijke fietstocht! 🚲', 'De beste fietspaden met Tadzik! 🌷', 'Lekker buiten bewegen in de natuur! 🌞'],
      en: ['Ring ring! Wind in your hair on two wheels! 🚲', 'Best cycling paths in Europe with Tadzik! 🌷', 'Fresh air and healthy exploration! 🌞'],
      de: ['Klingeling! Frische Luft auf zwei Rädern! 🚲', 'Die schönsten Radwege mit Tadzik! 🌷', 'Bewegung, Natur und Fahrspaß! 🌞'],
      es: ['¡Ring ring! ¡A pedalear con buena brisa! 🚲', '¡Las mejores rutas en bici con Tadzik! 🌷', '¡Naturaleza, salud y diversión! 🌞'],
      fr: ['Dring dring ! Le vent dans les cheveux à vélo ! 🚲', 'Les plus belles pistes cyclables avec Tadzik ! 🌷', 'Air pur et grand plaisir de pédaler ! 🌞'],
      ro: ['Țâr-țâr! Vântul în plete pe două roți! 🚲', 'Cele mai frumoase trasee de bicicletă cu Tadzik! 🌷', 'Mișcare în aer liber și sănătate! 🌞'],
      zh: ['叮叮！微风拂面，享受骑行慢时光！🚲', '与 Tadzik 一起探索欧洲最美自行车道！🌷', '呼吸新鲜空气，拥抱自然与健康！🌞'],
    },
    color: 'from-emerald-400 to-teal-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
  },
  walk: {
    id: 'walk',
    icon: '🚶',
    emoji: '🚶',
    name: {
      pl: 'Pieszo / Spacer 🚶',
      nl: 'Te voet / Wandeling 🚶',
      en: 'Walking / Stroll 🚶',
      de: 'Zu Fuß / Spaziergang 🚶',
      es: 'A pie / Paseo 🚶',
      fr: 'À pied / Promenade 🚶',
      ro: 'Pe jos / Plimbare 🚶',
      zh: '徒步 / 散步 🚶',
    },
    description: {
      pl: 'Spokojny spacer deptakami i parkami bez barier',
      nl: 'Rustige wandeling door voetgangersstraten en parken',
      en: 'Peaceful stroll along pedestrian zones & parks',
      de: 'Ruhiger Spaziergang durch Fußgängerzonen und Parks',
      es: 'Paseo tranquilo por zonas peatonales y parques',
      fr: 'Agréable promenade dans les zones piétonnes et parcs',
      ro: 'Plimbare liniștită prin zone pietonale și parcuri',
      zh: '漫步于林荫步道与步行街，平稳舒适',
    },
    soundlessGreeting: {
      pl: ['Miły i zdrowy spacer po zabytkowych alejkach! 🚶', 'Krok po kroku odkrywamy urokliwe zakątki! 🌲', 'Spokojne tempo, świeże powietrze i relaks! 🌸'],
      nl: ['Heerlijke en gezonde wandeling door historische lanen! 🚶', 'Stap voor stap mooie plekjes ontdekken! 🌲', 'Rustig tempo, frisse lucht en ontspanning! 🌸'],
      en: ['Pleasant & healthy stroll along historic streets! 🚶', 'Step by step discovering hidden gems! 🌲', 'Relaxed pace, fresh air and peace of mind! 🌸'],
      de: ['Angenehmer und gesunder Spaziergang! 🚶', 'Schritt für Schritt schöne Ecken entdecken! 🌲', 'Ruhiges Tempo, frische Luft und Erholung! 🌸'],
      es: ['¡Agradable y saludable paseo por calles históricas! 🚶', '¡Paso a paso descubriendo rincones únicos! 🌲', '¡Ritmo tranquilo, aire fresco y relax! 🌸'],
      fr: ['Agréable promenade revigorante ! 🚶', 'Pas à pas, découvrons des trésors cachés ! 🌲', 'Rythme tranquille, grand air et détente ! 🌸'],
      ro: ['Plimbare plăcută și sănătoasă prin alei istorice! 🚶', 'Pas cu pas descoperim locuri minunate! 🌲', 'Ritm liniștit, aer curat și relaxare! 🌸'],
      zh: ['漫步于静谧的历史街巷，身心舒畅！🚶', '一步一景，发现旅途中的美好角落！🌲', '悠闲漫步，呼吸新鲜空气，从容惬意！🌸'],
    },
    color: 'from-teal-400 to-cyan-600',
    badgeBg: 'bg-teal-500/10 text-teal-700 border-teal-300',
  },
};

const SPEED_DURATIONS: Record<VehicleSpeed, number> = {
  slow: 24,
  normal: 14,
  fast: 8,
};

const VEHICLE_KEYS: Array<Exclude<VehicleType, 'random'>> = ['train', 'bus', 'car', 'motorcycle', 'bicycle', 'walk'];

const I18N_UI: Record<Language, {
  widgetTitle: string;
  chooseVehicle: string;
  speed: string;
  slow: string;
  normal: string;
  fast: string;
  pause: string;
  play: string;
  hide: string;
  show: string;
  companionStatus: string;
  randomMode: string;
  clickMe: string;
}> = {
  pl: {
    widgetTitle: 'Animowany Podróżnik Tadzika',
    chooseVehicle: 'Wybierz pojazd na stronie:',
    speed: 'Prędkość przemieszczania / jazdy:',
    slow: 'Spokojna 🐢',
    normal: 'Turystyczna 🚶',
    fast: 'Ekspresowa 🚀',
    pause: 'Zatrzymaj ruch',
    play: 'Wznów ruch',
    hide: 'Zwiń panel',
    show: 'Pojazd na stronie',
    companionStatus: 'Przemierza stronę w tle',
    randomMode: 'Losowo zmieniaj pojazdy (Auto-Tour) 🎲',
    clickMe: 'Kliknij na mnie! ✨',
  },
  nl: {
    widgetTitle: "Tadziks Geanimeerde Reiziger",
    chooseVehicle: 'Kies een voertuig voor op de pagina:',
    speed: 'Snelheid van de reis:',
    slow: 'Rustig 🐢',
    normal: 'Toeristisch 🚶',
    fast: 'Express 🚀',
    pause: 'Pauzeer beweging',
    play: 'Hervat beweging',
    hide: 'Paneel inklappen',
    show: 'Voertuig op pagina',
    companionStatus: 'Reist over de pagina op de achtergrond',
    randomMode: 'Willekeurig wisselen (Auto-Tour) 🎲',
    clickMe: 'Klik op mij! ✨',
  },
  en: {
    widgetTitle: "Tadzik's Animated Traveling Companion",
    chooseVehicle: 'Choose vehicle across the pages:',
    speed: 'Travel speed:',
    slow: 'Relaxed 🐢',
    normal: 'Scenic 🚶',
    fast: 'Express 🚀',
    pause: 'Pause animation',
    play: 'Resume animation',
    hide: 'Collapse panel',
    show: 'Page Companion',
    companionStatus: 'Traversing the page smoothly in background',
    randomMode: 'Auto-Cycle Vehicles (Tour Mode) 🎲',
    clickMe: 'Click on me! ✨',
  },
  de: {
    widgetTitle: 'Tadziks animierter Reisebegleiter',
    chooseVehicle: 'Fahrzeug für alle Seiten wählen:',
    speed: 'Reisegeschwindigkeit:',
    slow: 'Gemütlich 🐢',
    normal: 'Touristisch 🚶',
    fast: 'Express 🚀',
    pause: 'Pause',
    play: 'Weiter',
    hide: 'Einklappen',
    show: 'Reisebegleiter',
    companionStatus: 'Fährt sanft über den Bildschirm',
    randomMode: 'Fahrzeuge automatisch wechseln 🎲',
    clickMe: 'Klick mich an! ✨',
  },
  es: {
    widgetTitle: 'Compañero de Viaje Animado de Tadzik',
    chooseVehicle: 'Elige el vehículo de la página:',
    speed: 'Velocidad de trayecto:',
    slow: 'Paseo 🐢',
    normal: 'Turística 🚶',
    fast: 'Exprés 🚀',
    pause: 'Pausar',
    play: 'Reanudar',
    hide: 'Plegar panel',
    show: 'Vehículo en página',
    companionStatus: 'Recorre la pantalla suavemente',
    randomMode: 'Cambio automático de vehículo 🎲',
    clickMe: '¡Haz clic en mí! ✨',
  },
  fr: {
    widgetTitle: 'Compagnon de Voyage Animé de Tadzik',
    chooseVehicle: 'Choisissez le véhicule qui traverse la page :',
    speed: 'Vitesse de déplacement :',
    slow: 'Tranquille 🐢',
    normal: 'Touristique 🚶',
    fast: 'Express 🚀',
    pause: 'Pause',
    play: 'Reprendre',
    hide: 'Réduire',
    show: 'Compagnon de page',
    companionStatus: 'Traverse la page en arrière-plan',
    randomMode: 'Changer automatiquement de véhicule 🎲',
    clickMe: 'Cliquez sur moi ! ✨',
  },
  ro: {
    widgetTitle: 'Însoțitorul de Călătorie Animat al lui Tadzik',
    chooseVehicle: 'Alege vehiculul care străbate pagina:',
    speed: 'Viteza de călătorie:',
    slow: 'Liniștit 🐢',
    normal: 'Turistic 🚶',
    fast: 'Expres 🚀',
    pause: 'Pauză',
    play: 'Continuă',
    hide: 'Restrânge',
    show: 'Vehicul pe pagină',
    companionStatus: 'Călătorește pe fundalul paginii',
    randomMode: 'Schimbare automată a vehiculelor 🎲',
    clickMe: 'Apasă pe mine! ✨',
  },
  zh: {
    widgetTitle: 'Tadzik 专属穿梭旅行伴侣动画',
    chooseVehicle: '选择在页面穿梭行驶的交通工具：',
    speed: '穿梭行驶速度：',
    slow: '悠闲慢行 🐢',
    normal: '观光标准 🚶',
    fast: '极速特快 🚀',
    pause: '暂停穿梭',
    play: '继续穿梭',
    hide: '收起面板',
    show: '页面旅行伴侣',
    companionStatus: '正在页面背景中平稳巡游',
    randomMode: '随机循环轮播载具 (全景巡航) 🎲',
    clickMe: '点我互动！✨',
  },
};

export default function AnimatedTravelVehicle({ language }: AnimatedTravelVehicleProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(() => {
    try {
      const saved = localStorage.getItem('tadzik_travel_vehicle');
      if (saved === 'airplane') return 'train';
      return (saved as VehicleType) || 'train';
    } catch {
      return 'train';
    }
  });

  const [activeVehicleId, setActiveVehicleId] = useState<Exclude<VehicleType, 'random'>>('train');
  const [speed, setSpeed] = useState<VehicleSpeed>(() => {
    try {
      const saved = localStorage.getItem('tadzik_vehicle_speed');
      return (saved as VehicleSpeed) || 'normal';
    } catch {
      return 'normal';
    }
  });

  const [isPaused, setIsPaused] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [tripCount, setTripCount] = useState(0);
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [verticalOffset, setVerticalOffset] = useState(65); // Percentage of screen height

  const ui = I18N_UI[language] || I18N_UI.en;

  // Determine current active vehicle
  useEffect(() => {
    if (selectedVehicle === 'random') {
      const next = VEHICLE_KEYS[tripCount % VEHICLE_KEYS.length];
      setActiveVehicleId(next);
    } else {
      setActiveVehicleId(selectedVehicle);
    }
  }, [selectedVehicle, tripCount]);

  // Adjust vertical positioning based on vehicle type
  useEffect(() => {
    if (activeVehicleId === 'train') {
      // Trains glide across lower section
      setVerticalOffset(76 + ((tripCount * 4) % 12));
    } else if (activeVehicleId === 'bus') {
      // Buses drive on mid-lower roadway
      setVerticalOffset(68 + ((tripCount * 5) % 12));
    } else if (activeVehicleId === 'car') {
      // Cars drive mid-low
      setVerticalOffset(72 + ((tripCount * 6) % 14));
    } else if (activeVehicleId === 'motorcycle') {
      // Motorcycles tour smoothly
      setVerticalOffset(64 + ((tripCount * 5) % 14));
    } else if (activeVehicleId === 'bicycle') {
      // Bikes travel near bottom/middle
      setVerticalOffset(65 + ((tripCount * 5) % 15));
    } else if (activeVehicleId === 'walk') {
      // Pedestrians walk on promenade
      setVerticalOffset(74 + ((tripCount * 3) % 12));
    }
  }, [activeVehicleId, tripCount]);

  const handleSaveVehicle = (v: VehicleType) => {
    setSelectedVehicle(v);
    try {
      localStorage.setItem('tadzik_travel_vehicle', v);
    } catch {}
  };

  const handleSaveSpeed = (s: VehicleSpeed) => {
    setSpeed(s);
    try {
      localStorage.setItem('tadzik_vehicle_speed', s);
    } catch {}
  };

  // Called when one traverse across screen completes
  const handleTripComplete = useCallback(() => {
    setTripCount((prev) => prev + 1);
    // Occasionally alternate direction for whimsical variety
    if (Math.random() > 0.65) {
      setDirection((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'));
    }
  }, []);

  const currentConfig = VEHICLE_CONFIGS[activeVehicleId] || VEHICLE_CONFIGS.train;

  const handleVehicleClick = () => {
    const greetings = currentConfig.soundlessGreeting[language] || currentConfig.soundlessGreeting.en;
    const randomMsg = greetings[Math.floor(Math.random() * greetings.length)];
    setSpeechBubble(randomMsg);
    setTimeout(() => {
      setSpeechBubble(null);
    }, 4500);
  };

  const duration = SPEED_DURATIONS[speed] || 14;

  return (
    <>
      {/* 1. Global Viewport Traveling Vehicle Animation Layer */}
      <div 
        className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none"
        aria-hidden="true"
        id="animated-travel-sky-layer"
      >
        <AnimatePresence>
          {!isPaused && (
            <motion.div
              key={`${activeVehicleId}-${tripCount}-${direction}-${speed}`}
              initial={{ 
                x: direction === 'ltr' ? '-15vw' : '115vw',
                y: `${verticalOffset}vh`,
                opacity: 0,
                scale: 0.9
              }}
              animate={{ 
                x: direction === 'ltr' ? '115vw' : '-15vw',
                y: [
                  `${verticalOffset}vh`,
                  `${verticalOffset - 1.5}vh`,
                  `${verticalOffset + 1}vh`,
                  `${verticalOffset}vh`
                ],
                opacity: [0, 1, 1, 1, 0],
                scale: [0.9, 1, 1, 1, 0.95]
              }}
              transition={{ 
                duration: duration,
                ease: "linear",
                times: [0, 0.08, 0.5, 0.92, 1]
              }}
              onAnimationComplete={handleTripComplete}
              className="absolute pointer-events-auto cursor-pointer group"
              style={{
                top: 0,
                left: 0,
                transformOrigin: 'center center'
              }}
              onClick={handleVehicleClick}
            >
              {/* Vehicle Container with floating trail effects */}
              <div className="relative flex items-center gap-1">
                {activeVehicleId === 'bus' && (
                  <div className={`flex items-center gap-1 opacity-70 ${direction === 'ltr' ? 'order-first' : 'order-last'}`}>
                    <span className="text-[11px] animate-pulse">🚏</span>
                    <span className="h-0.5 w-6 bg-gradient-to-r from-transparent via-blue-200 to-blue-400 rounded-full"></span>
                  </div>
                )}

                {activeVehicleId === 'car' && (
                  <div className={`flex items-center gap-1 opacity-70 ${direction === 'ltr' ? 'order-first' : 'order-last'}`}>
                    <span className="text-[11px] animate-pulse">💨</span>
                    <span className="h-0.5 w-6 bg-gradient-to-r from-transparent via-amber-200 to-amber-400 rounded-full"></span>
                  </div>
                )}

                {activeVehicleId === 'motorcycle' && (
                  <div className={`flex items-center gap-1 opacity-75 ${direction === 'ltr' ? 'order-first' : 'order-last'}`}>
                    <span className="text-[10px] animate-pulse">✨</span>
                    <span className="h-0.5 w-6 bg-gradient-to-r from-transparent via-orange-300 to-amber-500 rounded-full"></span>
                  </div>
                )}

                {activeVehicleId === 'bicycle' && (
                  <div className={`flex items-center gap-1 opacity-75 ${direction === 'ltr' ? 'order-first' : 'order-last'}`}>
                    <span className="text-[10px] animate-bounce">🌷</span>
                    <span className="h-0.5 w-5 bg-gradient-to-r from-transparent via-emerald-300 to-emerald-500 rounded-full"></span>
                  </div>
                )}

                {activeVehicleId === 'walk' && (
                  <div className={`flex items-center gap-1 opacity-75 ${direction === 'ltr' ? 'order-first' : 'order-last'}`}>
                    <span className="text-[10px] animate-bounce">🌸</span>
                    <span className="h-0.5 w-4 bg-gradient-to-r from-transparent via-teal-200 to-teal-400 rounded-full"></span>
                  </div>
                )}

                {activeVehicleId === 'train' && (
                  <div className={`flex items-center gap-1 opacity-75 ${direction === 'ltr' ? 'order-first' : 'order-last'}`}>
                    <span className="text-[11px] animate-pulse">💨</span>
                    <span className="text-[8px] opacity-60">💨</span>
                    <span className="h-0.5 w-10 border-b border-dashed border-indigo-400/80"></span>
                  </div>
                )}

                {/* Main Vehicle Badge with smooth floating bobbing animation */}
                <motion.div
                  animate={{ 
                    y: activeVehicleId === 'bicycle' || activeVehicleId === 'walk' ? [-2, 2, -2] : activeVehicleId === 'car' ? [-1, 1, -1] : [-2, 2, -2],
                    rotate: direction === 'ltr' 
                      ? [0, 1, -1, 0]
                      : [0, -1, 1, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: activeVehicleId === 'bicycle' ? 0.8 : 2.5, 
                    ease: "easeInOut" 
                  }}
                  className={`relative p-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border-2 border-amber-300/80 flex items-center justify-center gap-1.5 transition-transform hover:scale-125 ${
                    direction === 'rtl' ? '-scale-x-100' : ''
                  }`}
                  title={`${currentConfig.name[language] || currentConfig.name.en} • ${ui.clickMe}`}
                >
                  {/* Subtle pulsing background glow */}
                  <span className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${currentConfig.color} opacity-40 blur-xs group-hover:opacity-80 transition-opacity`}></span>

                  {/* Cute vehicle icon */}
                  <span className="relative z-10 text-2xl filter drop-shadow-sm select-none">
                    {currentConfig.emoji}
                  </span>

                  {/* Tiny Tadzik Pilot/Rider indicator */}
                  <span className="relative z-10 text-[10px] bg-slate-900 text-amber-300 font-black px-1.5 py-0.5 rounded-full border border-slate-700 shadow-xs hidden group-hover:inline-block">
                    Tadzik 🧭
                  </span>
                </motion.div>

                {/* Speech balloon when user clicks vehicle */}
                <AnimatePresence>
                  {speechBubble && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: -40 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-950/95 text-white border-2 border-amber-400 px-3 py-2 rounded-2xl shadow-2xl text-xs font-black min-w-[200px] max-w-xs text-center z-50 pointer-events-none"
                    >
                      <p className="leading-snug text-amber-200">
                        {speechBubble}
                      </p>
                      <div className="w-2.5 h-2.5 bg-slate-950 border-r-2 border-b-2 border-amber-400 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Floating Vehicle Selector Widget (Senior-Friendly, Bottom-Left Corner) */}
      <div 
        className="fixed bottom-3 left-3 z-40"
        id="travel-vehicle-control-dock"
      >
        <div className="relative">
          {/* Main Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="flex items-center gap-2 bg-slate-900/95 hover:bg-slate-950 text-white px-3.5 py-2 rounded-full border-2 border-amber-400/80 shadow-2xl backdrop-blur-md text-xs font-black cursor-pointer transition-all duration-200"
            title={ui.widgetTitle}
          >
            <span className="text-base animate-bounce">{currentConfig.emoji}</span>
            <span className="hidden sm:inline text-amber-300 font-extrabold text-[11px] uppercase tracking-wider">
              {currentConfig.name[language] || currentConfig.name.en}
            </span>
            <span className="text-[10px] text-slate-400">
              {isPanelOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </span>
          </motion.button>

          {/* Expanded Configuration Modal / Flyout */}
          <AnimatePresence>
            {isPanelOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-12 left-0 w-72 sm:w-80 bg-slate-950/95 text-white border-2 border-amber-400/90 rounded-3xl p-4 shadow-2xl backdrop-blur-xl space-y-3 z-50"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">🧭</span>
                    <div>
                      <h4 className="font-black text-xs text-amber-300 uppercase tracking-wider">
                        {ui.widgetTitle}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {ui.companionStatus}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPanelOpen(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* 1. Vehicle Selection Buttons */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">
                    {ui.chooseVehicle}
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['train', 'bus', 'car', 'motorcycle', 'bicycle', 'walk'] as const).map((key) => {
                      const cfg = VEHICLE_CONFIGS[key];
                      const isSelected = selectedVehicle === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleSaveVehicle(key)}
                          className={`flex items-center gap-2 p-2 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-[1.02]'
                              : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-lg">{cfg.emoji}</span>
                          <div className="leading-tight">
                            <div className="font-black text-[11px] line-clamp-1">{cfg.name[language] || cfg.name.en}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Random / Auto-Tour Toggle */}
                  <button
                    type="button"
                    onClick={() => handleSaveVehicle('random')}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-[11px] font-black transition-all cursor-pointer mt-1 ${
                      selectedVehicle === 'random'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-300 shadow-md'
                        : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800'
                    }`}
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>{ui.randomMode}</span>
                  </button>
                </div>

                {/* 2. Speed Controls */}
                <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">
                    {ui.speed}
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['slow', 'normal', 'fast'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSaveSpeed(s)}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-black transition-all text-center cursor-pointer border ${
                          speed === s
                            ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {ui[s]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Pause / Play toggle */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 font-bold">
                    {isPaused ? '⏸️ Wstrzymano' : '▶️ W ruchu'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPaused(!isPaused)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer border transition-colors ${
                      isPaused 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400' 
                        : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    <span>{isPaused ? ui.play : ui.pause}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

/**
 * Reusable Section Travel Companion Badge for embedding across headers, cards & tabs
 */
export function SectionTravelCompanion({ 
  vehicle = 'train',
  language,
  subtitle
}: { 
  vehicle?: VehicleType;
  language: Language;
  subtitle?: string;
}) {
  const currentKey: Exclude<VehicleType, 'random'> = vehicle === 'random' ? 'train' : vehicle;
  const cfg = VEHICLE_CONFIGS[currentKey] || VEHICLE_CONFIGS.train;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/90 border border-amber-200/80 shadow-xs select-none">
      <motion.span 
        animate={{ 
          x: [-3, 3, -3],
          y: [-2, 2, -2],
          rotate: [-4, 4, -4]
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="text-lg"
      >
        {cfg.emoji}
      </motion.span>
      <div className="text-[11px] font-extrabold text-slate-800 leading-tight">
        <span className="text-amber-600 uppercase tracking-wider text-[9px] font-black block">
          {cfg.name[language] || cfg.name.en}
        </span>
        {subtitle || (cfg.description[language] || cfg.description.en)}
      </div>
    </div>
  );
}
