/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'nl' | 'pl' | 'zh' | 'es' | 'de' | 'ro' | 'fr';

export interface TranslationSet {
  title: string;
  subtitle: string;
  budgetLabel: string;
  adultsOnly: string;
  forSmallChildren: string;
  forAdults: string;
  selectVersion: string;
  moodFilter: string;
  searchPlaceholder: string;
  selectCity: string;
  nearbyTransport: string;
  whereToGetOn: string;
  whereToGo: string;
  stationPlanner: string;
  currentStation: string;
  timeAvailable: string;
  bufferNote: string;
  exportToMaps: string;
  virtualPassport: string;
  passportIntro: string;
  weeklyChallenges: string;
  challengeIntro: string;
  cyclingRoutes: string;
  cyclingIntro: string;
  account: string;
  subscriptionRequired: string;
  subscribeBtn: string;
  idealPayment: string;
  weroPayment: string;
  cardPayment: string;
  commentsLabel: string;
  addCommentPlaceholder: string;
  postCommentBtn: string;
  heartsCount: string;
  yearlyFee: string;
  unlockedStatus: string;
  loginBtn: string;
  registerBtn: string;
  username: string;
  password: string;
  orContinueMock: string;
  stampsCollected: string;
  photoUploadPrompt: string;
  challengeSubmitPrompt: string;
  routeTitle: string;
  difficulty: string;
  distance: string;
  stationReturnHeader: string;
  headwayActive: string;
  walkingTime: string;
  safeHeadway: string;
  routePlanned: string;
  commentsTitle: string;
  addPhotoBtn: string;
  addPhotoTitle: string;
  photoCaptionPlaceholder: string;
  photoUrlPlaceholder: string;
  uploadPhotoBtn: string;
  communityPhotos: string;
  addCustomPlaceBtn: string;
  addCustomPlaceTitle: string;
  placeName: string;
  placeCity: string;
  placeRegion: string;
  placeVibe: string;
  placeAdultDescription: string;
  placeChildDescription: string;
  placeAdultBudget: string;
  placeChildBudget: string;
  placeDuration: string;
  submitCustomPlace: string;
}

export const translations: Record<Language, TranslationSet> = {
  en: {
    title: "European Tourist Guide & Attractions 🏰",
    subtitle: "Quickly discover top sightseeing spots, castles, museums & parks across Europe with instant train connections! 🧭🚆",
    budgetLabel: "Max Budget per Attraction:",
    adultsOnly: "Adults Version",
    forSmallChildren: "For Kids / Family",
    forAdults: "For Adults",
    selectVersion: "Age Version:",
    moodFilter: "Mood / Vibes:",
    searchPlaceholder: "Search attractions...",
    selectCity: "Select City:",
    nearbyTransport: "Nearby Transport (9292 live feeds)",
    whereToGetOn: "Boarding platform:",
    whereToGo: "Direction:",
    stationPlanner: "Route Planning ♿ (accessible)",
    currentStation: "Simulated Geolocation:",
    timeAvailable: "How much time do you have?",
    bufferNote: "Safe Headway: The system reserves a 30-minute buffer to return you safely without rushing.",
    exportToMaps: "Export Route to Google Maps",
    virtualPassport: "Virtual Passport",
    passportIntro: "Collect regional stamps by visiting cities across Europe (NL, BE, FR, DE, PL) and uploading a photo from each!",
    weeklyChallenges: "Weekly Photo Challenges",
    challengeIntro: "Find the hidden spot in the city, snap a photo, and share with fellow travelers!",
    cyclingRoutes: "Scenic Cycling Routes",
    cyclingIntro: "Explore beautiful European scenery (NL, BE, FR, DE, PL) on two wheels with low-difficulty routes.",
    account: "User Account",
    subscriptionRequired: "An annual subscription of €30 is required to unlock full travel tools, routes, and challenges.",
    subscribeBtn: "Subscribe for €30 / year",
    idealPayment: "Pay with iDEAL",
    weroPayment: "Pay with Wero",
    cardPayment: "Pay with Credit Card",
    commentsLabel: "Traveler Tips & Feedback",
    addCommentPlaceholder: "Write a helpful tip... (large print)",
    postCommentBtn: "Post Tip",
    heartsCount: "Likes",
    yearlyFee: "€30 / year subscription",
    unlockedStatus: "Subscription Active (Paid €30/yr)",
    loginBtn: "Log In",
    registerBtn: "Register",
    username: "Username / Email",
    password: "Password",
    orContinueMock: "Register an account to remember your visits and paid subscription details.",
    stampsCollected: "Passport Stamps Collected",
    photoUploadPrompt: "Upload a photo to get a regional stamp",
    challengeSubmitPrompt: "Submit photo for the current hidden spot contest",
    routeTitle: "Planned Safe Route",
    difficulty: "Difficulty:",
    distance: "Distance:",
    stationReturnHeader: "Rotterdam / Amsterdam Station Safety Router",
    headwayActive: "Route Buffer System Active",
    walkingTime: "Attraction Explore Time:",
    safeHeadway: "Safety Margin (Headway):",
    routePlanned: "Route planned for:",
    commentsTitle: "Comments",
    addPhotoBtn: "Add Photo",
    addPhotoTitle: "Share a Photo of this Place",
    photoCaptionPlaceholder: "Write a short caption... (e.g. Sunny afternoon stroll)",
    photoUrlPlaceholder: "Paste photo web address or click below to simulate upload",
    uploadPhotoBtn: "Add Photo to Gallery",
    communityPhotos: "Community Photos",
    addCustomPlaceBtn: "Add Custom Spot ➕",
    addCustomPlaceTitle: "Suggest a New City Spot",
    placeName: "Spot Name",
    placeCity: "City",
    placeRegion: "Province / Region",
    placeVibe: "Atmosphere / Mood",
    placeAdultDescription: "Adult Version Description",
    placeChildDescription: "Kids / Family Version Description",
    placeAdultBudget: "Adult Admission Fee (€)",
    placeChildBudget: "Kids Admission Fee (€)",
    placeDuration: "Suggested Duration (minutes)",
    submitCustomPlace: "Create Spot and Add Photos!"
  },
  nl: {
    title: "Toeristische Gids & Attracties 🏰",
    subtitle: "Ontdek snel top bezienswaardigheden, kastelen, musea en natuur in Europa met directe treinverbindingen! 🧭🚆",
    budgetLabel: "Maximaal budget per attractie:",
    adultsOnly: "Volwassenen Versie",
    forSmallChildren: "Voor Kinderen / Familie",
    forAdults: "Voor Volwassenen",
    selectVersion: "Leeftijdsversie:",
    moodFilter: "Sfeer / Vibe:",
    searchPlaceholder: "Zoek attracties...",
    selectCity: "Selecteer Stad:",
    nearbyTransport: "Openbaar Vervoer in de buurt (9292 live feeds)",
    whereToGetOn: "Instapperron:",
    whereToGo: "Richting:",
    stationPlanner: "Routeplanning ♿ (ook voor mindervaliden)",
    currentStation: "Gesimuleerde Geolocatie:",
    timeAvailable: "Hoeveel tijd heeft u?",
    bufferNote: "Veilige Terugkeer: Het systeem reserveert een buffer van 30 minuten zodat u ontspannen terugreist.",
    exportToMaps: "Exporteer route naar Google Maps",
    virtualPassport: "Virtueel Paspoort",
    passportIntro: "Verzamel stempels door steden te bezoeken in Europa (NL, BE, FR, DE, PL) en een foto te uploaden!",
    weeklyChallenges: "Wekelijkse Fotouitdagingen",
    challengeIntro: "Vind de verborgen plek in de stad, maak een foto en deel deze met medereizigers!",
    cyclingRoutes: "Mooie Fietsroutes",
    cyclingIntro: "Verken de prachtige Europese landschappen (NL, BE, FR, DE, PL) op de fiets met eenvoudige routes.",
    account: "Gebruikersaccount",
    subscriptionRequired: "Een jaarabonnement van €30 is vereist om alle reishulpmiddelen, routes en uitdagingen te ontgrendelen.",
    subscribeBtn: "Abonneer voor €30 / jaar",
    idealPayment: "Betalen met iDEAL",
    weroPayment: "Betalen met Wero",
    cardPayment: "Betalen met Creditcard",
    commentsLabel: "Reizigerstips & Feedback",
    addCommentPlaceholder: "Schrijf een nuttige tip... (grote letters)",
    postCommentBtn: "Tip plaatsen",
    heartsCount: "Vind-ik-leuks",
    yearlyFee: "€30 / jaar abonnement",
    unlockedStatus: "Abonnement actief (Betaald €30/jr)",
    loginBtn: "Inloggen",
    registerBtn: "Registreren",
    username: "Gebruikersnaam / E-mail",
    password: "Wachtwoord",
    orContinueMock: "Registreer een account om uw bezoeken en betaalde abonnementsgegevens te onthouden.",
    stampsCollected: "Verzamelde paspoortstempels",
    photoUploadPrompt: "Upload een foto om een regionale stempel te krijgen",
    challengeSubmitPrompt: "Stuur een foto in voor de wedstrijd van de verborgen plek",
    routeTitle: "Geplande Veilige Route",
    difficulty: "Moeilijkheidsgraad:",
    distance: "Afstand:",
    stationReturnHeader: "Rotterdam / Amsterdam Station Veiligheidsplanner",
    headwayActive: "Route Buffer Systeem Actief",
    walkingTime: "Attractie Verkenningstijd:",
    safeHeadway: "Veiligheidsmarge (Headway):",
    routePlanned: "Route gepland voor:",
    commentsTitle: "Reacties",
    addPhotoBtn: "Foto toevoegen",
    addPhotoTitle: "Deel een foto van deze plek",
    photoCaptionPlaceholder: "Schrijf een kort bijschrift... (bijv. Zonnige middagwandeling)",
    photoUrlPlaceholder: "Plak fotowebadres of klik hieronder om upload te simuleren",
    uploadPhotoBtn: "Foto toevoegen aan galerij",
    communityPhotos: "Foto's van reizigers",
    addCustomPlaceBtn: "Nieuwe plek toevoegen ➕",
    addCustomPlaceTitle: "Stel een nieuwe plek in de stad voor",
    placeName: "Naam van de plek",
    placeCity: "Stad",
    placeRegion: "Provincie / Regio",
    placeVibe: "Sfeer / Stemming",
    placeAdultDescription: "Beschrijving voor volwassenen",
    placeChildDescription: "Beschrijving voor kinderen / families",
    placeAdultBudget: "Toegangsprijs volwassenen (€)",
    placeChildBudget: "Toegangsprijs kinderen (€)",
    placeDuration: "Aanbeenvolen duur (minuten)",
    submitCustomPlace: "Plek aanmaken en foto's toevoegen!"
  },
  pl: {
    title: "Przewodnik Turystyczny & Atrakcje 🏰",
    subtitle: "Błyskawicznie znajduj najciekawsze atrakcje, zabytki, muzea i parki w Europie wraz z rozkładem pociągów! 🧭🚆",
    budgetLabel: "Maksymalny budżet na atrakcję:",
    adultsOnly: "Wersja dla dorosłych",
    forSmallChildren: "Dla dzieci / Rodzinna",
    forAdults: "Dla dorosłych",
    selectVersion: "Wersja wiekowa:",
    moodFilter: "Atmosfera / Klimat:",
    searchPlaceholder: "Szukaj atrakcji...",
    selectCity: "Wybierz miasto:",
    nearbyTransport: "Pobliskie połączenia (dane 9292 live)",
    whereToGetOn: "Peron odjazdu:",
    whereToGo: "Kierunek:",
    stationPlanner: "Planowanie trasy ♿ (również dla niepełnosprawnych)",
    currentStation: "Symulowana geolokalizacja:",
    timeAvailable: "Ile masz wolnego czasu?",
    bufferNote: "Bezpieczny powrót: System rezerwuje 30-minutowy zapas, abyś zdążył na pociąg bez pośpiechu.",
    exportToMaps: "Eksportuj trasę do Google Maps",
    virtualPassport: "Wirtualny Paszport",
    passportIntro: "Zbieraj pieczątki regionalne, odwiedzając miasta w Europie (Holandia, Belgia, Francja, Niemcy, Polska) i przesyłając zdjęcia!",
    weeklyChallenges: "Cotygodniowe Wyzwania Fotograficzne",
    challengeIntro: "Znajdź ukryte miejsce w mieście, zrób zdjęcie i podziel się z innymi!",
    cyclingRoutes: "Malownicze Trasy Rowerowe",
    cyclingIntro: "Odkryj piękno krajobrazów Holandii, Belgii, Francji, Niemiec i Polski na dwóch kółkach, na łatwych trasach.",
    account: "Konto użytkownika",
    subscriptionRequired: "Roczny abonament w wysokości 30 € jest wymagany do odblokowania pełnych narzędzi, tras i wyzwań.",
    subscribeBtn: "Subskrybuj za 30 € / rok",
    idealPayment: "Płać przez iDEAL",
    weroPayment: "Płać przez Wero",
    cardPayment: "Płać kartą kredytową",
    commentsLabel: "Wskazówki podróżników i opinie",
    addCommentPlaceholder: "Napisz pomocną wskazówkę... (duży druk)",
    postCommentBtn: "Dodaj wskazówkę",
    heartsCount: "Polubienia",
    yearlyFee: "Abonament 30 € / rok",
    unlockedStatus: "Subskrypcja aktywna (Opłacono 30 €/rok)",
    loginBtn: "Zaloguj się",
    registerBtn: "Zarejestruj się",
    username: "Nazwa użytkownika / E-mail",
    password: "Hasło",
    orContinueMock: "Zarejestruj konto, aby zapisać odwiedzone miejsca i status subskrypcji.",
    stampsCollected: "Zebrane pieczątki paszportowe",
    photoUploadPrompt: "Prześlij zdjęcie, aby otrzymać pieczątkę regionalną",
    challengeSubmitPrompt: "Prześlij zdjęcie na konkurs ukrytych miejsc",
    routeTitle: "Zaplanowana Bezpieczna Trasa",
    difficulty: "Trudność:",
    distance: "Dystans:",
    stationReturnHeader: "Bezpieczny Planer Powrotu do Stacji",
    headwayActive: "System bezpiecznego bufora aktywny",
    walkingTime: "Czas na zwiedzanie:",
    safeHeadway: "Margines bezpieczeństwa (Headway):",
    routePlanned: "Trasa zaplanowana na:",
    commentsTitle: "Komentarze",
    addPhotoBtn: "Dodaj zdjęcie",
    addPhotoTitle: "Podziel się zdjęciem z tego miejsca",
    photoCaptionPlaceholder: "Napisz krótki podpis... (np. Słoneczny spacer)",
    photoUrlPlaceholder: "Wklej adres URL zdjęcia lub kliknij poniżej, aby zasymulować przesłanie",
    uploadPhotoBtn: "Dodaj zdjęcie do galerii",
    communityPhotos: "Zdjęcia społeczności",
    addCustomPlaceBtn: "Dodaj nowe miejsce ➕",
    addCustomPlaceTitle: "Zaproponuj nowe miejsce w mieście",
    placeName: "Nazwa miejsca",
    placeCity: "Miasto",
    placeRegion: "Prowincja / Region",
    placeVibe: "Atmosfera / Klimat",
    placeAdultDescription: "Opis dla dorosłych",
    placeChildDescription: "Opis dla dzieci / rodzin",
    placeAdultBudget: "Cena wstępu dla dorosłych (€)",
    placeChildBudget: "Cena wstępu dla dzieci (€)",
    placeDuration: "Sugerowany czas (minuty)",
    submitCustomPlace: "Stwórz miejsce i dodaj zdjęcia!"
  },
  zh: {
    title: "NL 智能旅游助手",
    subtitle: "适合老年人的荷兰城市探索工具。字体超大、预算控制、安全时刻表保障出行。",
    budgetLabel: "单项景点最高预算:",
    adultsOnly: "成人版本",
    forSmallChildren: "儿童 / 亲子",
    forAdults: "成人专属",
    selectVersion: "年龄版本:",
    moodFilter: "氛围 / 调性:",
    searchPlaceholder: "搜索景点...",
    selectCity: "选择城市:",
    nearbyTransport: "周边交通 (9292 实时数据)",
    whereToGetOn: "乘车月台:",
    whereToGo: "行驶方向:",
    stationPlanner: "车站返程安全规划",
    currentStation: "模拟地理定位:",
    timeAvailable: "您当前有多少时间？",
    bufferNote: "安全保障：系统自动保留30分钟缓冲时间，确保您不慌不忙安全返回车站。",
    exportToMaps: "导出路线到谷歌地图",
    virtualPassport: "虚拟护照",
    passportIntro: "通过访问不同城市并上传景点照片来收集各省区域印章！",
    weeklyChallenges: "每周摄影挑战",
    challengeIntro: "寻找城市中的“隐藏景点”，拍摄并与旅伴们分享您的发现！",
    cyclingRoutes: "风景如画的自行车路线",
    cyclingIntro: "用两轮骑行探索美丽的荷兰风光，路线难度低，骑行更舒适。",
    account: "用户账户",
    subscriptionRequired: "需每年支付 €30 订阅费，以解锁全部智能路线规划、交通工具和挑战功能。",
    subscribeBtn: "订阅服务 (€30 / 年)",
    idealPayment: "使用 iDEAL 支付",
    weroPayment: "使用 Wero 支付",
    cardPayment: "使用信用卡支付",
    commentsLabel: "游客建议与反馈",
    addCommentPlaceholder: "写下您的实用旅游建议... (大字显示)",
    postCommentBtn: "发布建议",
    heartsCount: "点赞数",
    yearlyFee: "€30 / 年订阅费",
    unlockedStatus: "订阅已激活 (已付 €30/年)",
    loginBtn: "登录",
    registerBtn: "注册",
    username: "用户名 / 邮箱",
    password: "密码",
    orContinueMock: "注册账号以记录您的足迹与订阅购买状态。",
    stampsCollected: "已收集的护照印章",
    photoUploadPrompt: "上传照片以获取该区域省份印章",
    challengeSubmitPrompt: "提交照片参加本次“隐藏秘境”摄影大赛",
    routeTitle: "安全规划路线",
    difficulty: "难度:",
    distance: "距离:",
    stationReturnHeader: "鹿特丹/阿姆斯特丹中央车站返程安全助手",
    headwayActive: "返程时间缓冲保护中",
    walkingTime: "景点游玩时间:",
    safeHeadway: "安全预留时间 (Headway):",
    routePlanned: "路线规划耗时:",
    commentsTitle: "评论",
    addPhotoBtn: "添加照片",
    addPhotoTitle: "分享这个景点的照片",
    photoCaptionPlaceholder: "写一段简短的说明... (例如：阳光明媚的午后散步)",
    photoUrlPlaceholder: "粘贴照片网址或点击下方按钮模拟上传",
    uploadPhotoBtn: "添加照片至相册",
    communityPhotos: "游客实拍分享",
    addCustomPlaceBtn: "添加新景点 ➕",
    addCustomPlaceTitle: "推荐城市中的新去处",
    placeName: "景点名称",
    placeCity: "城市",
    placeRegion: "省份 / 区域",
    placeVibe: "氛围 / 调性",
    placeAdultDescription: "成人版介绍",
    placeChildDescription: "儿童/亲子版介绍",
    placeAdultBudget: "成人门票 (€)",
    placeChildBudget: "儿童门票 (€)",
    placeDuration: "建议游玩时间 (分钟)",
    submitCustomPlace: "创建景点并添加照片！"
  },
  es: {
    title: "NL Compañero de Viaje Inteligente",
    subtitle: "Su guía adaptada para mayores en ciudades holandesas. Alta legibilidad, control de presupuesto y horarios seguros.",
    budgetLabel: "Presupuesto máximo por atracción:",
    adultsOnly: "Versión de Adultos",
    forSmallChildren: "Para Niños / Familia",
    forAdults: "Para Adultos",
    selectVersion: "Versión de Edad:",
    moodFilter: "Ambiente / Vibras:",
    searchPlaceholder: "Buscar atracciones...",
    selectCity: "Seleccionar Ciudad:",
    nearbyTransport: "Transporte Cercano (datos en vivo 9292)",
    whereToGetOn: "Andén de embarque:",
    whereToGo: "Dirección:",
    stationPlanner: "Planificador de Estación (Retorno Seguro)",
    currentStation: "Geolocalización Simulada:",
    timeAvailable: "¿Cuánto tiempo tiene disponible?",
    bufferNote: "Retorno Seguro: El sistema reserva un colchón de 30 minutos para que regrese tranquilo y sin prisas.",
    exportToMaps: "Exportar ruta a Google Maps",
    virtualPassport: "Pasaporte Virtual",
    passportIntro: "¡Coleccione sellos regionales visitando ciudades y subiendo una foto de cada región!",
    weeklyChallenges: "Desafíos Fotográficos Semanales",
    challengeIntro: "¡Encuentre el lugar escondido de la ciudad, saque una foto y compártala con otros viajeros!",
    cyclingRoutes: "Rutas Ciclistas Escénicas",
    cyclingIntro: "Explore los hermosos paisajes holandeses sobre dos ruedas con rutas de baja dificultad.",
    account: "Cuenta de Usuario",
    subscriptionRequired: "Se requiere una suscripción anual de €30 para desbloquear herramientas de viaje, rutas y desafíos.",
    subscribeBtn: "Suscribirse por €30 / año",
    idealPayment: "Pagar con iDEAL",
    weroPayment: "Pagar con Wero",
    cardPayment: "Pagar con Tarjeta de Crédito",
    commentsLabel: "Consejos de viajeros y opiniones",
    addCommentPlaceholder: "Escriba un consejo útil... (letra grande)",
    postCommentBtn: "Publicar Consejo",
    heartsCount: "Me gusta",
    yearlyFee: "Suscripción de €30 / año",
    unlockedStatus: "Suscripción Activa (Pagado €30/año)",
    loginBtn: "Iniciar Sesión",
    registerBtn: "Registrarse",
    username: "Usuario / Correo",
    password: "Contraseña",
    orContinueMock: "Regístrese para guardar los lugares que ha visitado y el estado de su suscripción.",
    stampsCollected: "Sellos del Pasaporte Coleccionados",
    photoUploadPrompt: "Suba una foto para obtener el sello regional",
    challengeSubmitPrompt: "Enviar foto para el concurso del rincón oculto",
    routeTitle: "Ruta Segura Planificada",
    difficulty: "Dificultad:",
    distance: "Distancia:",
    stationReturnHeader: "Planificador de Retorno Seguro a Estaciones",
    headwayActive: "Margen de seguridad activo para la ruta",
    walkingTime: "Tiempo para explorar atracciones:",
    safeHeadway: "Margen de Seguridad (Headway):",
    routePlanned: "Ruta planificada para:",
    commentsTitle: "Comentarios",
    addPhotoBtn: "Añadir foto",
    addPhotoTitle: "Compartir una foto de este lugar",
    photoCaptionPlaceholder: "Escribe un pie de foto corto... (ej. Paseo de tarde soleada)",
    photoUrlPlaceholder: "Pega la dirección web de la foto o haz clic abajo para simular la subida",
    uploadPhotoBtn: "Añadir foto a la galería",
    communityPhotos: "Fotos de la comunidad",
    addCustomPlaceBtn: "Añadir nuevo lugar ➕",
    addCustomPlaceTitle: "Sugerir un nuevo rincón de la ciudad",
    placeName: "Nombre del lugar",
    placeCity: "Ciudad",
    placeRegion: "Provincia / Región",
    placeVibe: "Atmósfera / Ambiente",
    placeAdultDescription: "Descripción versión adultos",
    placeChildDescription: "Descripción versión niños / familia",
    placeAdultBudget: "Precio adultos (€)",
    placeChildBudget: "Precio niños (€)",
    placeDuration: "Duración sugerida (minutos)",
    submitCustomPlace: "¡Crear lugar y añadir fotos!"
  },
  de: {
    title: "Verlieren Sie sich nicht in der Wildnis! 🌲",
    subtitle: "Tadzik achtet auf Ihren Geldbeutel und sorgt dafür, dass Sie vor Einbruch der Dunkelheit sicher aus dem Wald zurückkehren! 🧭",
    budgetLabel: "Max. Budget pro Attraktion:",
    adultsOnly: "Erwachsenenversion",
    forSmallChildren: "Für Kinder / Familie",
    forAdults: "Für Erwachsene",
    selectVersion: "Altersversion:",
    moodFilter: "Atmosphäre / Stimmung:",
    searchPlaceholder: "Attraktionen suchen...",
    selectCity: "Stadt wählen:",
    nearbyTransport: "Nahegelegene Verkehrsmittel (9292 Live-Daten)",
    whereToGetOn: "Bahnsteig:",
    whereToGo: "Richtung:",
    stationPlanner: "Routenplanung ♿ (auch barrierefrei)",
    currentStation: "Simulierte GPS-Ortung:",
    timeAvailable: "Wie viel Zeit haben Sie?",
    bufferNote: "Sichere Reise: Das System reserviert einen Puffer von 30 Minuten, damit Sie entspannt reisen.",
    exportToMaps: "Route nach Google Maps exportieren",
    virtualPassport: "Virtueller Reisepass",
    passportIntro: "Sammeln Sie regionale Stempel, indem Sie Städte besuchen und ein Foto aus jeder Region hochladen!",
    weeklyChallenges: "Wöchentliche Foto-Herausforderungen",
    challengeIntro: "Finden Sie die versteckte Stelle in der Stadt, machen Sie ein Foto und teilen Sie es mit Mitreisenden!",
    cyclingRoutes: "Malerische Fahrradrouten",
    cyclingIntro: "Erkunden Sie die wunderschöne niederländische Landschaft auf zwei Rädern mit einfachen Routen.",
    account: "Benutzerkonto",
    subscriptionRequired: "Ein Jahresabonnement von 30 € ist erforderlich, um alle Reise-Tools, Routen und Herausforderungen freizuschalten.",
    subscribeBtn: "Für 30 € / Jahr abonnieren",
    idealPayment: "Mit iDEAL bezahlen",
    weroPayment: "Mit Wero bezahlen",
    cardPayment: "Mit Kreditkarte bezahlen",
    commentsLabel: "Reisetipps & Feedback",
    addCommentPlaceholder: "Schreiben Sie einen nützlichen Tipp... (große Schrift)",
    postCommentBtn: "Tipp veröffentlichen",
    heartsCount: "Gefällt mir",
    yearlyFee: "30 € / Jahr Abonnement",
    unlockedStatus: "Abonnement aktiv (Bezahlt €30/Jahr)",
    loginBtn: "Einloggen",
    registerBtn: "Registrieren",
    username: "Benutzername / E-Mail",
    password: "Passwort",
    orContinueMock: "Registrieren Sie ein Konto, um Ihre Besuche und Abonnementdetails zu speichern.",
    stampsCollected: "Gesammelte Reisepass-Stempel",
    photoUploadPrompt: "Laden Sie ein Foto hoch, um den regionalen Stempel zu erhalten",
    challengeSubmitPrompt: "Foto für das Gewinnspiel für versteckte Orte einreichen",
    routeTitle: "Geplante sichere Route",
    difficulty: "Schwierigkeit:",
    distance: "Distanz:",
    stationReturnHeader: "Sicherer Reiseplaner zu Bahnhöfen",
    headwayActive: "Routenzeitpuffer aktiv",
    walkingTime: "Erkundungszeit der Attraktion:",
    safeHeadway: "Sicherheitsmarge (Headway):",
    routePlanned: "Route geplant für:",
    commentsTitle: "Kommentare",
    addPhotoBtn: "Foto hinzufügen",
    addPhotoTitle: "Ein Foto von diesem Ort teilen",
    photoCaptionPlaceholder: "Schreiben Sie eine kurze Bildunterschrift...",
    photoUrlPlaceholder: "Bild-Webadresse einfügen oder unten klicken, um den Upload to simulieren",
    uploadPhotoBtn: "Foto zur Galerie hinzufügen",
    communityPhotos: "Fotos der Community",
    addCustomPlaceBtn: "Neuen Ort hinzufügen ➕",
    addCustomPlaceTitle: "Einen neuen Stadtort vorschlagen",
    placeName: "Name des Ortes",
    placeCity: "Stadt",
    placeRegion: "Provinz / Region",
    placeVibe: "Atmosphäre / Stimmung",
    placeAdultDescription: "Beschreibung für Erwachsene",
    placeChildDescription: "Beschreibung für Kinder / Familie",
    placeAdultBudget: "Eintrittspreis für Erwachsene (€)",
    placeChildBudget: "Eintrittspreis für Kinder (€)",
    placeDuration: "Empfohlene Dauer (Minuten)",
    submitCustomPlace: "Ort erstellen und Fotos hinzufügen!"
  },
  ro: {
    title: "Nu te pierde în sălbăticie! 🌲",
    subtitle: "Tadzik îți păzește portofelul și are grijă să te întorci acasă în siguranță din pădure înainte de întuneric! 🧭",
    budgetLabel: "Buget maxim per atracție:",
    adultsOnly: "Versiune pentru Adulți",
    forSmallChildren: "Pentru Copii / Familie",
    forAdults: "Pentru Adulți",
    selectVersion: "Versiune Vârstă:",
    moodFilter: "Atmosferă / Vibes:",
    searchPlaceholder: "Caută atracții...",
    selectCity: "Selectează Oraș:",
    nearbyTransport: "Transport în apropiere (date live 9292)",
    whereToGetOn: "Peron de îmbarcare:",
    whereToGo: "Direcție:",
    stationPlanner: "Planificator de Traseu ♿ (accesibil)",
    currentStation: "Geolocalizare simulată:",
    timeAvailable: "Cât timp ai la dispoziție?",
    bufferNote: "Întoarcere sigură: Sistemul rezervă un tampon de 30 de minute pentru a te întoarce în siguranță și fără grabă.",
    exportToMaps: "Exportă traseul în Google Maps",
    virtualPassport: "Pașaport Virtual",
    passportIntro: "Colecționează ștampile regionale vizitând orașe și încărcând o fotografie din fiecare!",
    weeklyChallenges: "Provocări Foto Săptămânale",
    challengeIntro: "Găsește locul ascuns din oraș, fă o fotografie și împărtășește-o cu ceilalți călători!",
    cyclingRoutes: "Trasee Bicicletă Pitorești",
    cyclingIntro: "Explorează peisajele minunate olandeze pe două roți cu trasee de dificultate redusă.",
    account: "Cont Utilizator",
    subscriptionRequired: "Este necesar un abonament anual de 30 € pentru a debloca toate instrumentele, traseele și provocările.",
    subscribeBtn: "Abonează-te pentru 30 € / an",
    idealPayment: "Plătește cu iDEAL",
    weroPayment: "Plătește cu Wero",
    cardPayment: "Plătește cu Card de Credit",
    commentsLabel: "Sfaturi de la Călători și Feedback",
    addCommentPlaceholder: "Scrie un sfat util... (scris mare)",
    postCommentBtn: "Postează sfat",
    heartsCount: "Aprecieri",
    yearlyFee: "Abonament de 30 € / an",
    unlockedStatus: "Abonament Activ (Plătit €30/an)",
    loginBtn: "Conectare",
    registerBtn: "Înregistrare",
    username: "Utilizator / Email",
    password: "Parolă",
    orContinueMock: "Înregistrează un cont pentru a-ți salva locurile vizitate și statutul abonamentului.",
    stampsCollected: "Ștampile colectate în Pașaport",
    photoUploadPrompt: "Încarcă o fotografie pentru a primi ștampila regională",
    challengeSubmitPrompt: "Trimite fotografia pentru concursul locului ascuns",
    routeTitle: "Traseu Securizat Planificat",
    difficulty: "Dificultate:",
    distance: "Distanță:",
    stationReturnHeader: "Planificator de Întoarcere Sigură în Gară",
    headwayActive: "Sistem de tampon activ pentru traseu",
    walkingTime: "Timp de explorare:",
    safeHeadway: "Marjă de Siguranță (Headway):",
    routePlanned: "Traseu planificat pentru:",
    commentsTitle: "Comentarii",
    addPhotoBtn: "Adaugă Foto",
    addPhotoTitle: "Împărtășește o fotografie a acestui loc",
    photoCaptionPlaceholder: "Scrie o scurtă descriere... (de ex. Plimbare de după-amiază însorită)",
    photoUrlPlaceholder: "Lipește adresa web a fotografiei sau apasă mai jos pentru simulare",
    uploadPhotoBtn: "Adaugă fotografie în galerie",
    communityPhotos: "Fotografii Comunitate",
    addCustomPlaceBtn: "Adaugă loc nou ➕",
    addCustomPlaceTitle: "Sugerează un loc nou în oraș",
    placeName: "Numele locului",
    placeCity: "Oraș",
    placeRegion: "Provincie / Regiune",
    placeVibe: "Atmosferă / Vibrație",
    placeAdultDescription: "Descriere Versiune Adulți",
    placeChildDescription: "Descriere Versiune Copii / Familie",
    placeAdultBudget: "Preț intrare adulți (€)",
    placeChildBudget: "Preț intrare copii (€)",
    placeDuration: "Durată sugerată (minute)",
    submitCustomPlace: "Creează locul și adaugă fotografii!"
  },
  fr: {
    title: "Ne te perds pas dans la nature ! 🌲",
    subtitle: "Tadzik surveille ton portefeuille et s'assure que tu rentres du bois en toute sécurité avant la nuit ! 🧭",
    budgetLabel: "Budget max par attraction :",
    adultsOnly: "Version Adultes",
    forSmallChildren: "Pour Enfants / Famille",
    forAdults: "Pour Adultes",
    selectVersion: "Version Âge :",
    moodFilter: "Atmosphère / Vibes :",
    searchPlaceholder: "Rechercher des attractions...",
    selectCity: "Sélectionner la Ville :",
    nearbyTransport: "Transports à proximité (flux en direct 9292)",
    whereToGetOn: "Quai d'embarquement :",
    whereToGo: "Direction :",
    stationPlanner: "Planificateur de Route ♿ (accessible)",
    currentStation: "Géolocalisation simulée :",
    timeAvailable: "Combien de temps avez-vous ?",
    bufferNote: "Retour Sécurisé : Le système réserve une marge de 30 de minutes pour retourner en sécurité et sans se presser.",
    exportToMaps: "Exporter l'itinéraire vers Google Maps",
    virtualPassport: "Passeport Virtuel",
    passportIntro: "Collectionnez les tampons régionaux en visitant les villes et en téléchargeant une photo !",
    weeklyChallenges: "Défis Photo Hebdomadaires",
    challengeIntro: "Trouvez le spot caché en ville, prenez une photo et partagez-la avec d'autres voyageurs !",
    cyclingRoutes: "Pistes Cyclables Pittoresques",
    cyclingIntro: "Explorez les magnifiques paysages néerlandais à vélo sur des itinéraires faciles.",
    account: "Compte Utilisateur",
    subscriptionRequired: "Un abonnement annuel de 30 € est requis pour débloquer tous les outils de voyage, itinéraires et défis.",
    subscribeBtn: "S'abonner pour 30 € / an",
    idealPayment: "Payer avec iDEAL",
    weroPayment: "Payer avec Wero",
    cardPayment: "Payer par Carte Bancaire",
    commentsLabel: "Conseils de Voyageurs & Avis",
    addCommentPlaceholder: "Écrire un conseil utile... (gros caractères)",
    postCommentBtn: "Publier le Conseil",
    heartsCount: "J'aime",
    yearlyFee: "Abonnement de 30 € / an",
    unlockedStatus: "Abonnement Actif (Payé €30/an)",
    loginBtn: "Se Connecter",
    registerBtn: "S'enregistrer",
    username: "Utilisateur / E-mail",
    password: "Mot de Passe",
    orContinueMock: "Créez un compte pour sauvegarder vos visites et votre abonnement.",
    stampsCollected: "Tampons de passeport collectés",
    photoUploadPrompt: "Téléchargez une photo pour obtenir votre tampon régional",
    challengeSubmitPrompt: "Envoyer la photo pour le concours du coin secret",
    routeTitle: "Itinéraire Sécurisé Planifié",
    difficulty: "Difficulté :",
    distance: "Distance :",
    stationReturnHeader: "Planificateur de Retour Sécurisé en Gare",
    headwayActive: "Système de marge active de l'itinéraire",
    walkingTime: "Temps d'exploration de l'attraction :",
    safeHeadway: "Marge de Securité (Headway) :",
    routePlanned: "Itinéraire planifié pour :",
    commentsTitle: "Commentaires",
    addPhotoBtn: "Ajouter Photo",
    addPhotoTitle: "Partager une photo de cet endroit",
    photoCaptionPlaceholder: "Écrire une courte légende... (ex: Promenade d'après-midi ensoleillé)",
    photoUrlPlaceholder: "Coller l'adresse web de l'image ou cliquer ci-dessous pour simuler",
    uploadPhotoBtn: "Ajouter la photo à la galerie",
    communityPhotos: "Photos de la Communauté",
    addCustomPlaceBtn: "Ajouter un lieu ➕",
    addCustomPlaceTitle: "Proposer un nouveau lieu en ville",
    placeName: "Nom du lieu",
    placeCity: "Ville",
    placeRegion: "Province / Région",
    placeVibe: "Atmosphère / Vibe",
    placeAdultDescription: "Description Version Adultes",
    placeChildDescription: "Description Version Enfants / Famille",
    placeAdultBudget: "Prix Adulte (€)",
    placeChildBudget: "Prix Enfant (€)",
    placeDuration: "Durée suggérée (minutes)",
    submitCustomPlace: "Créer l'endroit et ajouter des photos !"
  }
};

export interface Attraction {
  id: string;
  name: string;
  city: string;
  region: string;
  category: 'museum' | 'park' | 'forest' | 'amusement_park' | 'historical_site' | 'childrens_attraction' | 'beach' | 'waterway' | 'restaurant_cafe';
  moods: string[];
  coordinates: { lat: number; lng: number };
  
  // Versions for adults and small children
  adultVersion: {
    description: string;
    budget: number;
    durationMinutes: number;
  };
  childVersion: {
    description: string;
    budget: number;
    durationMinutes: number;
  };
  
  // Nearby transport (9292 style simulated)
  transport: {
    type: 'bus' | 'tram' | 'metro' | 'train';
    line: string;
    destination: string;
    stopName: string;
    platform?: string;
    scheduleMinutes: number[];
  };
}

export interface Comment {
  id: string;
  attractionId: string;
  username: string;
  text: string;
  createdAt: string;
}

export type CyclingCategory = 'terenowa' | 'turystyczna' | 'dlugodystansowa' | 'lesna' | 'polna';

export interface CyclingSmartInsights {
  shadePercent?: number; // e.g. 85 for 85% shade
  restBenches?: string; // e.g. "Ławki i wiaty co 1-2 km"
  waterPoints?: string; // e.g. "2 ujęcia wody pitnej i kawiarnia"
  eBikeCharging?: boolean;
  safetyLevel?: string; // e.g. "100% drogi bezkolizyjne z autami"
  crowdLevel?: 'low' | 'medium' | 'high';
  elevationMeters?: number;
  recommendedFor?: string; // e.g. "Seniorzy, rodziny, miłośnicy natury"
  bikeServiceStations?: string; // e.g. "Stacja samoobsługowa z pompką i kluczami"
  recommendedTirePressure?: string; // e.g. "3.5 - 4.5 bar (Gravel/Trekking)"
  windExposure?: string; // e.g. "Osłonięta lasem, minimalny opór wiatru"
  bestSeason?: string; // e.g. "Kwiecień – Październik"
}

export interface CyclingPitStop {
  name: string;
  type: 'cafe' | 'water' | 'viewpoint' | 'service' | 'monument' | 'picnic';
  desc: string;
  kmMark?: number;
}

export interface CyclingRouteComment {
  id: string;
  routeId: string;
  authorName: string;
  rating: number; // 1 to 5
  text: string;
  tags?: string[];
  createdAt: string;
  likes: number;
  likedByMe?: boolean;
}

export interface CyclingRoute {
  id: string;
  title: string;
  city: string;
  country?: string;
  category: CyclingCategory;
  distanceKm: number;
  estimatedDuration?: string;
  difficulty: 'easy' | 'medium' | 'moderate' | 'hard';
  startPoint: string;
  endPoint: string;
  description: string;
  highlights: string[];
  surface?: string;
  recommendedBike?: string;
  authorName?: string;
  isCommunity?: boolean;
  createdAt?: string;
  rating?: number;
  reviewsCount?: number;
  smartInsights?: CyclingSmartInsights;
  destinationImageUrl?: string;
  destinationName?: string;
  destinationCoords?: { lat: number; lng: number };
  startCoords?: { lat: number; lng: number };
  elevationGainMeters?: number;
  pitStops?: CyclingPitStop[];
}

// ==========================================
// MOTORCYCLE (TRASY NA MOTOR) TYPES
// ==========================================
export type MotorcycleCategory = 'winkle' | 'wybrzeza' | 'lesna' | 'cruiser' | 'adv_long';

export interface MotorcycleSmartInsights {
  cornersDensity?: string; // e.g. "Wysoka (120+ ostrych winkli i łuków)"
  asphaltQuality?: string; // e.g. "Gładki, równy asfalt o wysokiej przyczepności"
  fuelStations?: string; // e.g. "Stacje z kompresorem co 15-20 km"
  bikerSpots?: string; // e.g. "Kultowe zajazdy i kawiarnie Biker Friendly"
  scenicViewpoints?: string; // e.g. "3 punkty z parkingiem na motocykle"
  recommendedBike?: string; // e.g. "Sport / Naked / Turystyk / Chopper"
  safetyNote?: string; // e.g. "Szerokie pobocze, czytelne łuki, brak piasku"
  recommendedFor?: string; // e.g. "Miłośnicy winkli, wyprawy solo i w grupie"
}

export interface MotorcycleRouteComment {
  id: string;
  routeId: string;
  authorName: string;
  rating: number; // 1 to 5
  text: string;
  bikeRidden?: string; // e.g. "BMW R1250GS", "Honda Rebel 500", "Yamaha MT-07"
  tags?: string[];
  createdAt: string;
  likes: number;
  likedByMe?: boolean;
}

export interface MotorcycleRoute {
  id: string;
  title: string;
  city: string;
  country?: string;
  category: MotorcycleCategory;
  distanceKm: number;
  estimatedDuration?: string;
  difficulty: 'easy' | 'moderate' | 'medium' | 'challenging';
  startPoint: string;
  endPoint: string;
  description: string;
  highlights: string[];
  asphaltCondition?: string;
  recommendedBike?: string;
  cornersCount?: number;
  authorName?: string;
  isCommunity?: boolean;
  createdAt?: string;
  rating?: number;
  reviewsCount?: number;
  destinationName?: string;
  destinationCategory?: string;
  destinationImageUrl?: string;
  startCoords?: { lat: number; lng: number };
  destinationCoords?: { lat: number; lng: number };
  elevationGainMeters?: number;
  smartInsights?: MotorcycleSmartInsights;
}

export interface UserPrivacyConsents {
  // Required: Terms of Service & Privacy Policy (Art. 6(1)(b) GDPR / RODO)
  termsAccepted: boolean;
  termsAcceptedAt?: string;

  // Voluntary granular opt-in consents (Art. 6(1)(a) GDPR / RODO)
  geolocationConsent: boolean;      // Zgoda na precyzyjną lokalizację GPS (bufor powrotu, geofencing i stacje)
  cameraConsent: boolean;           // Zgoda na aparat / kamerę (foto-dowody w Paszporcie i wyzwaniach)
  notificationsConsent?: boolean;   // Zgoda na powiadomienia systemowe i alerty pogodowe
  marketingConsent: boolean;        // Zgoda na komunikację marketingową i newsletter podróżniczy
  aiPersonalizationConsent: boolean;// Zgoda na profilowanie i personalizację rekomendacji AI
  telemetryConsent: boolean;        // Zgoda na anonimową telemetrię i analizę wydajności aplikacji

  lastConsentUpdate?: string;       // ISO timestamp of last update
  consentVersion?: string;          // e.g. "GDPR-2026.1"
}

export interface StickerVerificationProof {
  stickerId: string;
  verifiedAt: string; // ISO date string
  method: 'gps' | 'qr_code' | 'photo_proof' | 'organizer_override' | 'creator_badge';
  coordinates?: { lat: number; lng: number };
  distanceMeters?: number;
  photoUrl?: string;
  verificationHash?: string;
  deviceFingerprint?: string;
  details?: string;
  status?: 'verified' | 'pending' | 'revoked';
}

export interface ClaimedRewardVoucher {
  id: string;
  tier: 'tier1' | 'tier2' | 'tier3';
  rewardTitle: string;
  voucherCode: string;
  qrCodeUrl?: string;
  claimedAt: string;
  expiresAt: string;
  status: 'active' | 'used' | 'expired';
  discountPercent?: number;
  verificationSignature: string;
}

export interface UserAccount {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  age?: number;
  largeFontMode?: boolean;
  iceContact?: {
    name: string;
    phone: string;
    relationship?: string;
  };
  homeStationOrHotel?: string;
  verificationMethod?: string;
  verificationValue?: string;
  password?: string;
  hasPaid: boolean;
  paymentMethod?: 'ideal' | 'wero' | 'card' | 'blik' | 'p24' | 'bancontact' | 'belfius' | 'kbc' | 'giropay' | 'sofort' | 'cartes_bancaires' | 'sepa' | string;
  visitedAttractions: string[]; // Attraction IDs
  collectedStamps: string[]; // Region names (e.g. "Zuid-Holland", "Noord-Holland")
  submittedPhotos: Record<string, string>; // Challenge ID -> Photo data/URL
  subscriptionExpiry?: string; // ISO date string (YYYY-MM-DD)
  visitedHistory?: { name: string; type: 'city' | 'attraction' | 'town'; date: string }[];
  privacyConsents?: UserPrivacyConsents;
  registeredAt?: string;
  stickerProofs?: Record<string, StickerVerificationProof>;
  claimedRewards?: ClaimedRewardVoucher[];
  favoriteCyclingRoutes?: string[]; // IDs of saved/favorite cycling routes
  favoriteMotorcycleRoutes?: string[]; // IDs of saved/favorite motorcycle routes
}

export interface RideOffer {
  id: string;
  attractionId: string;
  type: 'offer' | 'request'; // 'offer' = driver offering seats, 'request' = passenger looking for ride
  userName: string;
  date: string;
  fromLocation: string;
  seatsAvailable: number;
  totalSeats: number;
  contactInfo: string;
  notes?: string;
  createdAt: string;
  passengers?: string[];
}

export interface ChallengeEntry {
  id: string;
  cityName: string;
  hiddenSpotName: string;
  clue: string;
  active: boolean;
  participantPhotos: {
    username: string;
    photoUrl: string;
    hearts: number;
    comments: string[];
  }[];
}

export type TravelMode = 'car' | 'transit' | 'bus' | 'tram' | 'motorcycle' | 'bike' | 'walk';

export interface HourlyWeather {
  time: string; // e.g. "09:00", "12:00", "15:00", "18:00", "21:00"
  temp: number; // in °C
  condition: string; // e.g. "Słonecznie", "Częściowo pochmurno", "Przelotny deszcz"
  icon: string; // e.g. "☀️", "⛅", "🌦️", "🌧️", "☁️"
  rainChance: number; // 0 - 100%
  windSpeed: number; // km/h
}

export interface DayForecast {
  date: string; // YYYY-MM-DD
  dayName: string; // e.g. "Dzisiaj", "Jutro", "Sobota", "Niedziela"
  dayShort: string; // e.g. "Dziś", "Jutro", "Sob", "Niedz"
  condition: string; // e.g. "Słonecznie z lekkim wiaterkiem"
  icon: string; // e.g. "☀️"
  tempMax: number; // °C
  tempMin: number; // °C
  feelsLike: number; // °C
  rainChance: number; // %
  rainMm: number; // mm
  windSpeed: number; // km/h
  windDirection: string; // e.g. "NW", "SW", "Zachodni"
  uvIndex: number; // 0 - 11
  airQuality: string; // e.g. "Doskonała (AQI 20)"
  humidity: number; // %
  sunrise: string; // e.g. "06:18"
  sunset: string; // e.g. "20:52"
  hourly: HourlyWeather[];
  sightseeingRating: 'ideal' | 'good' | 'moderate' | 'rain_warning';
  tadzikTips: {
    packing: string[]; // e.g. ["Wygodne buty", "Lekka wiatrówka", "Okulary przeciwsłoneczne"]
    bestHours: string; // e.g. "10:00 - 17:00"
    advice: string; // e.g. "Cudowna pogoda na spacer! Pamiętaj o bezpiecznym powrocie przed zmierzchem o 20:45."
  };
}

export interface SightseeingWeather {
  city: string;
  country: string;
  selectedDay: DayForecast;
  availableDays: DayForecast[];
}

