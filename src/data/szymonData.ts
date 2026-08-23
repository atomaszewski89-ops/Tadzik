export interface CityGuide {
  name: string;
  desc: string;
  accessibility: string;
  budgetTip: string;
  safetyTip: string;
  toiletTip: string;
}

export interface BudgetCategory {
  id: string;
  name: Record<string, string>;
  cost: number;
  unit: string;
  country: 'NL' | 'BE' | 'PL' | 'DE';
  type: 'transport' | 'attraction' | 'food' | 'other';
}

export const SZYMON_WELCOMES: Record<string, { title: string; subtitle: string; pitch: string; cta: string }> = {
  pl: {
    title: "Cześć, jestem Tadzik! 👋",
    subtitle: "Twój inteligentny, osobisty przewodnik dla seniorów",
    pitch: "Mój cel to sprawić, aby Twoja podróż była bezpieczna, dopasowana do budżetu i całkowicie bezstresowa. Pomogę Ci kontrolować wydatki, zaplanować bezpieczny wyjazd i zdradzę wyjątkowe sekrety podróżowania po Holandii, Belgii, Polsce oraz Niemczech!",
    cta: "W czym mogę Ci dzisiaj pomóc? Wybierz jedno z moich narzędzi lub napisz do mnie poniżej!"
  },
  en: {
    title: "Hello, I am Tadzik! 👋",
    subtitle: "Your intelligent, senior-friendly travel companion",
    pitch: "My mission is to ensure your journey is safe, budget-friendly, and completely stress-free. I will help you monitor expenses, plan a secure trip, and reveal the best local travel secrets for the Netherlands, Belgium, Poland, and Germany!",
    cta: "How can I assist you today? Select one of my special features or chat with me below!"
  },
  nl: {
    title: "Hallo, ik ben Tadzik! 👋",
    subtitle: "Uw intelligente, seniorvriendelijke reisgids",
    pitch: "Mijn missie is om ervoor te zorgen dat uw reis veilig, budgetvriendelijk en volledig stressvrij verloopt. Ik help u uw uitgaven te bewaken, een veilige reis te plannen en deel de beste reistips voor Nederland, België, Polen en Duitsland!",
    cta: "Hoe kan ik u vandaag helpen? Kies een van mijn hulpmiddelen of typ uw vraag hieronder!"
  },
  es: {
    title: "¡Hola, soy Tadzik! 👋",
    subtitle: "Su compañero de viaje inteligente adaptado para mayores",
    pitch: "Mi misión es garantizar que su viaje sea seguro, económico y sin estrés. Le ayudaré a controlar gastos, planificar una ruta de viaje segura y le revelaré los mejores secretos de viaje locales para los Países Bajos, Bélgica, Polonia y Alemania.",
    cta: "¿Cómo puedo ayudarle hoy? ¡Seleccione una de mis funciones o hable conmigo abajo!"
  },
  de: {
    title: "Hallo, ich bin Tadzik! 👋",
    subtitle: "Ihr intelligenter, seniorenfreundlicher Reisebegleiter",
    pitch: "Meine Mission ist es, Ihre Reise sicher, budgetfreundlich und völlig stressfrei zu gestalten. Ich helfe Ihnen, Ihre Ausgaben zu überwachen, einen sicheren Ausflug zu planen und die besten lokalen Reisetipps für die Niederlande, Belgien, Polen und Deutschland zu teilen!",
    cta: "Wie kann ich Ihnen heute helfen? Wählen Sie eine meiner Spezialfunktionen oder chatten Sie unten mit mir!"
  }
};

export const DUTCH_CITIES_SZYMON: CityGuide[] = [
  {
    name: "Amsterdam",
    desc: "Stolica rowerów i kanałów. Choć tętni życiem, posiada urokliwe, spokojne zakątki i światowej klasy muzea w pełni przystosowane dla seniorów.",
    accessibility: "Tramwaje niskopodłogowe z dedykowanymi miejscami. Główne muzea (Rijksmuseum, Van Gogh) posiadają windy i darmowe wózki inwalidzkie.",
    budgetTip: "Kup kartę Museumkaart, jeśli planujesz odwiedzić więcej niż 3-4 muzea w Holandii. To ogromna oszczędność!",
    safetyTip: "Unikaj chodzenia po czerwonych drogach rowerowych – rowerzyści jeżdżą tam szybko. Wieczorem trzymaj się oświetlonych tras wokół Dworca Głównego.",
    toiletTip: "Darmowe i czyste toalety znajdują się w domach towarowych De Bijenkorf oraz we wszystkich większych muzeach i bibliotekach publicznych (OBA)."
  },
  {
    name: "Utrecht",
    desc: "Spokojniejsza alternatywa dla Amsterdamu z dwupoziomowymi kanałami i wspaniałym starym miastem.",
    accessibility: "Strefa piesza w centrum jest płaska, ale uważaj na tradycyjny bruk. Nowoczesny dworzec Utrecht Centraal jest doskonale przystosowany dla seniorów.",
    budgetTip: "Wstęp do ogrodów Pandhof przy katedrze Dom jest całkowicie bezpłatny – to idealne ciche miejsce na odpoczynek z ławkami.",
    safetyTip: "Pociągi do Amsterdamu i Rotterdamu odjeżdżają co 10-15 minut. Zawsze sprawdzaj peron na ekranach, gdyż może ulec zmianie.",
    toiletTip: "Centrum handlowe Hoog Catharijne połączone z dworcem posiada nowoczesne, czyste i płatne (ok. 0.70€) toalety z ułatwionym dostępem."
  },
  {
    name: "Rotterdam",
    desc: "Miasto nowoczesnej architektury z imponującym portem. Szerokie ulice ułatwiają poruszanie się.",
    accessibility: "Najbardziej płaskie i dostępne miasto w Holandii. Nowoczesne metro i autobusy są w 100% dostosowane do potrzeb seniorów.",
    budgetTip: "Bezpłatny wstęp do parku Kralingse Bos i ogrodów historycznych. Wodne tramwaje (Waterbus) są bardzo tanie i oferują świetne widoki.",
    safetyTip: "Okolice stacji Rotterdam Blaak oraz Markthal są bardzo bezpieczne i świetnie oświetlone nawet późnym wieczorem.",
    toiletTip: "W Markthal (hala targowa) toalety znajdują się na poziomie -1 (płatne, z windą). Bezpłatne toalety są dostępne w bibliotece miejskiej naprzeciwko."
  },
  {
    name: "Haarlem",
    desc: "Malownicze, spokojne miasto tuż obok Amsterdamu, słynące z rynków kwiatowych i uroczych dziedzińców (hofjes).",
    accessibility: "Bardzo zwarte centrum handlowe, idealne na piesze spacery. Wiele urokliwych dziedzińców ma płaskie wejścia.",
    budgetTip: "Wstęp na urocze historyczne dziedzińce (Hofjes) jest całkowicie darmowy. Szukaj Hofje van Bakenes!",
    safetyTip: "Miasto jest niezwykle spokojne i bezpieczne, idealne na relaksujący pobyt z dala od amsterdamskiego zgiełku.",
    toiletTip: "Toalety w ratuszu na rynku głównym (Grote Markt) oraz w lokalnych kawiarniach są bardzo przyjazne dla gości."
  }
];

export const BELGIAN_TIPS_SZYMON = {
  intro: "Podróż z Holandii do Belgii jest bardzo prosta i niezwykle opłacalna dla seniorów. Oto kluczowe ułatwienia:",
  tips: [
    {
      title: "Belgijski Bilet Seniora (Seniorenticket)",
      desc: "Jeśli masz 65 lat lub więcej, możesz podróżować pociągami w całej Belgii (drugą klasą) za jedyne 8,30 € za bilet powrotny w tym samym dniu! Bilet obowiązuje od poniedziałku do piątku po godzinie 9:00 oraz przez całe weekendy."
    },
    {
      title: "Szybkie Połączenie Eurostar / IC",
      desc: "Z Rotterdamu lub Amsterdamu dojedziesz bezpośrednio do Antwerpii i Brukseli. Pociąg InterCity (IC Brussels) nie wymaga rezerwacji miejsc i jest znacznie tańszy od Eurostaru, a oferuje wygodne wejścia."
    },
    {
      title: "Ułatwienia w Brukseli (Bruxelles-Midi)",
      desc: "Dworzec Bruxelles-Midi jest ogromny. Jeśli potrzebujesz asysty, możesz ją bezpłatnie zarezerwować na stronie belgijskich kolei (SNCB) z 24-godzinnym wyprzedzeniem. Pracownicy pomogą Ci przesiąść się z bagażem."
    },
    {
      title: "Bruk w Brugii (Bruges)",
      desc: "Brugia to najpiękniejsze miasto Belgii, ale całe stare miasto pokryte jest historycznym brukiem. Wybierz wygodne buty z grubszą podeszwą i zaplanuj rejs łodzią po kanałach – to najwygodniejszy sposób zwiedzania bez obciążania stawów."
    }
  ]
};

export const POLISH_TIPS_SZYMON = {
  intro: "Polska to kraj pełen urokliwych miast, niesamowitej historii i wspaniałych zniżek dla seniorów. Oto najważniejsze ułatwienia:",
  tips: [
    {
      title: "Bilet Seniora PKP Intercity (zniżka 30%)",
      desc: "Każdy, kto ukończył 60 lat, otrzymuje zniżkę 30% na przejazdy pociągami PKP Intercity w dowolnej relacji krajowej! Wystarczy okazać dokument ze zdjęciem i datą urodzenia podczas kontroli biletów."
    },
    {
      title: "Bezpłatna Komunikacja Miejska (70+)",
      desc: "W większości polskich miast (m.in. Warszawa, Kraków, Trójmiasto, Wrocław) seniorzy powyżej 70. roku życia mogą korzystać z autobusów, tramwajów i metra całkowicie bezpłatnie! Osoby w wieku 65-69 lat mogą zakupić bardzo tani roczny 'Bilet Seniora'."
    },
    {
      title: "Tanie i pyszne obiady domowe (Bary Mleczne)",
      desc: "Kultowe bary mleczne to świetny sposób na spróbowanie tradycyjnych potraw (pierogi, żurek, gołąbki) w niezwykle atrakcyjnych cenach. Jedzenie jest przygotowywane na miejscu i bardzo świeże."
    },
    {
      title: "Dostępność obiektów zabytkowych",
      desc: "Większość zamków (np. Wawel, Zamek Królewski w Warszawie) posiada windy oraz udogodnienia dla osób o ograniczonej sprawności ruchowej. Warto rezerwować wejścia rano, aby uniknąć kolejek."
    }
  ]
};

export const GERMAN_TIPS_SZYMON = {
  intro: "Podróżowanie po Niemczech oferuje doskonałą infrastrukturę i wysoki standard bezpieczeństwa. Oto wskazówki dla seniorów:",
  tips: [
    {
      title: "Karta BahnCard Senioren",
      desc: "Osoby powyżej 65. roku życia mogą kupić karty zniżkowe BahnCard 25 lub BahnCard 50 w specjalnych, bardzo obniżonych cenach. Karta daje odpowiednio 25% lub 50% zniżki na każdy zakupiony bilet kolejowy."
    },
    {
      title: "Deutschland-Ticket i zniżki regionalne",
      desc: "Bilet Deutschland-Ticket za 49 € miesięcznie pozwala na nielimitowane podróże wszystkimi pociągami regionalnymi (RE, RB) i komunikacją miejską w całych Niemczech. Niektóre kraje związkowe oferują dodatkowe rabaty dla emerytów."
    },
    {
      title: "Czyste toalety przy autostradach (Sanifair)",
      desc: "Na stacjach benzynowych i głównych dworcach toalety sieci Sanifair kosztują 1,00 €, ale otrzymujesz kupon o wartości 0,50 €, który możesz wykorzystać na zakup napoju lub przekąski w sklepie stacyjnym."
    },
    {
      title: "Komunikaty głosowe i zmiany peronów",
      desc: "Niemiecka kolej DB słynie z precyzji, ale opóźnienia i nagłe zmiany peronów się zdarzają. Zawsze słuchaj komunikatów głosowych (często powtarzanych po angielsku) oraz obserwuj tablice informacyjne na peronach."
    }
  ]
};

export const BUDGET_ITEMS_SZYMON: BudgetCategory[] = [
  // NL Transport
  { id: 'nl_train_day', name: { pl: 'Bilet dzienny na pociąg (NL)', en: 'Train Day Ticket (NL)', nl: 'Trein Dagkaart (NL)', de: 'Tageskarte Zug (NL)' }, cost: 19.50, unit: 'osoba', country: 'NL', type: 'transport' },
  { id: 'nl_tram_single', name: { pl: 'Jednorazowy bilet na tramwaj (NL)', en: '1-Hour Tram Ticket (NL)', nl: 'Uurkaart Tram (NL)', de: '1-Stunde-Straßenbahn-Ticket (NL)' }, cost: 4.50, unit: 'bilet', country: 'NL', type: 'transport' },
  { id: 'nl_ov_senior', name: { pl: 'Zniżka dla Seniorów OV-chipkaart (65+)', en: 'OV-chipkaart Senior Discount (65+)', nl: 'Leeftijdskorting 65+ Reizen', de: 'OV-Chipkarte Seniorenrabatt (65+)' }, cost: -1.50, unit: 'przejazd', country: 'NL', type: 'transport' },
  
  // NL Attractions
  { id: 'nl_rijks', name: { pl: 'Muzeum Rijksmuseum Amsterdam', en: 'Rijksmuseum Amsterdam Entry', nl: 'Rijksmuseum Toegang', de: 'Rijksmuseum Eintritt' }, cost: 22.50, unit: 'osoba', country: 'NL', type: 'attraction' },
  { id: 'nl_canal_cruise', name: { pl: 'Rejs kanałami Amsterdamu', en: 'Amsterdam Canal Cruise', nl: 'Rondvaart Amsterdam', de: 'Grachtenrundfahrt Amsterdam' }, cost: 16.00, unit: 'osoba', country: 'NL', type: 'attraction' },
  { id: 'nl_museumkaart', name: { pl: 'Karta Muzealna (Roczny nielimitowany wstęp)', en: 'Museumkaart (Annual Unlimited)', nl: 'Museumkaart Jaarkaart', de: 'Museumkarte (Jahreskarte)' }, cost: 75.00, unit: 'karta', country: 'NL', type: 'attraction' },
  
  // BE Transport
  { id: 'be_senior_ticket', name: { pl: 'Belgijski Bilet Seniora (Seniorenticket 65+)', en: 'Belgian Senior Return Ticket (65+)', nl: 'Belgisch Seniorenticket Retour (65+)', de: 'Belgisches Seniorenticket Rückfahrt (65+)' }, cost: 8.30, unit: 'osoba/powrót', country: 'BE', type: 'transport' },
  
  // BE Attractions
  { id: 'be_bruges_boat', name: { pl: 'Rejs kanałami w Brugii', en: 'Bruges Canal Boat Tour', nl: 'Boottocht Brugge', de: 'Bootstour Brügge' }, cost: 12.00, unit: 'osoba', country: 'BE', type: 'attraction' },
  
  // Food & Other
  { id: 'food_lunch', name: { pl: 'Prosty lunch seniora (Kawiarnia/Bistro)', en: 'Simple Senior Lunch (Cafe/Bistro)', nl: 'Eenvoudige Lunch', de: 'Einfaches Mittagessen (Café/Bistro)' }, cost: 12.00, unit: 'posiłek', country: 'NL', type: 'food' },
  { id: 'food_dinner', name: { pl: 'Obiad z napojem w restauracji', en: 'Dinner with drink in restaurant', nl: 'Diner in restaurant', de: 'Abendessen mit Getränk im Restaurant' }, cost: 24.00, unit: 'posiłek', country: 'NL', type: 'food' },
  { id: 'food_be_waffle', name: { pl: 'Belgijski gofr z owocami i bitą śmietaną', en: 'Belgian Waffle with fruits & cream', nl: 'Belgische Wafel met slagroom', de: 'Belgische Waffel mit Obst & Sahne' }, cost: 5.50, unit: 'sztuka', country: 'BE', type: 'food' }
];

export const SZYMON_CHAT_FALLBACK_QA: { keywords: string[]; answer: Record<string, string> }[] = [
  {
    keywords: ['toalet', 'toalety', 'wc', 'restroom', 'toilet', 'plav', 'plev', 'wc-anlagen', 'toiletten'],
    answer: {
      pl: "### Gdzie bezpiecznie pójść do toalety? 🚻\n\nDrogi podróżniku, to niezwykle ważne pytanie! Oto moje sprawdzone punkty:\n1. **W Holandii:** Najlepsze są duże domy towarowe **De Bijenkorf** (zawsze czyste, dostępne dla wózków) oraz **biblioteki miejskie (OBA)**, które są bezpłatne lub kosztują ok. 0.50€. Wszystkie muzea mają darmowe toalety po przejściu kontroli biletowej.\n2. **W Belgii:** Toalety na stacjach kolejowych (np. Brussels-Central) są płatne, ale utrzymane w czystości. Dobrym wyborem są też restauracje sieciowe.",
      en: "### Where to find clean, accessible restrooms? 🚻\n\nDear explorer, this is a vital question! Here are my vetted suggestions:\n1. **In the Netherlands:** Department stores like **De Bijenkorf** offer pristine, accessible toilets. Public libraries (**OBA**) are also great, free or costing only ~€0.50. All museums have free, step-free toilets past the ticket gates.\n2. **In Belgium:** Train stations (like Brussels-Central) have clean, paid restrooms. Local cafes are also highly welcoming.",
      nl: "### Waar vind ik schone, toegankelijke toiletten? 🚻\n\nBeste reiziger, een zeer belangrijke vraag! Hier zijn mijn geteste tips:\n1. **In Nederland:** Grote warenhuizen zoals **De Bijenkorf** hebben uitstekende en rolstoeltoegankelijke toiletten. Openbare bibliotheken (**OBA**) zijn vaak gratis of kosten €0,50. Alle musea hebben gratis, drempelvrije toiletten na de ticketcontrole.\n2. **In België:** Stations (zoals Brussel-Centraal) hebben schone, betaalde toiletten.",
      de: "### Wo findet man saubere, barrierefreie Toiletten? 🚻\n\nLieber Reisender, das ist eine sehr wichtige Frage! Hier sind meine Tipps:\n1. **In den Niederlanden:** Große Warenhäuser wie **De Bijenkorf** bieten makellose, barrierefreie Toiletten. Öffentliche Bibliotheken (**OBA**) sind ebenfalls großartig (kostenlos oder ca. 0,50 €). Alle Museen haben kostenlose, barrierefreie Toiletten hinter den Ticket-Schranken.\n2. **In Belgien:** Bahnhöfe (wie Brüssel-Zentral) haben saubere, kostenpflichtige Toiletten."
    }
  },
  {
    keywords: ['budzet', 'budżet', 'pieniadze', 'tani', 'koszt', 'budget', 'cheap', 'free', 'darmow', 'preiswert', 'geld', 'sparen'],
    answer: {
      pl: "### Jak kontrolować budżet podczas wyjazdu? 💰\n\nMoje najlepsze rady dla seniorów:\n- **Belgia:** Zawsze korzystaj z **Seniorenticket** (bilet powrotny za jedyne 8,30 € po godz. 9:00). To ułamek standardowej ceny!\n- **Holandia:** Pociągi bywają drogie. Unikaj podróży w godzinach szczytu (06:30-09:00 i 16:00-18:30). Korzystaj z biletów ze zniżką grupową lub kart zniżkowych 65+ na OV-chipkaart (34% zniżki).",
      en: "### How to optimize your travel budget? 💰\n\nMy gold-standard budget tips for seniors:\n- **Belgium:** Always buy the **Seniorenticket** (return journey anywhere in Belgium for just €8.30). It saves you an immense amount of money.\n- **Netherlands:** Trains are expensive. Avoid traveling during peak rush hours (06:30-09:00 and 16:00-18:30) to save up to 40% with off-peak cards.",
      nl: "### Hoe bespaart u geld tijdens uw reis? 💰\n\nMijn beste budgettips voor senioren:\n- **België:** Koop altijd het **Seniorenticket** (retour binnen België voor slechts €8,30).\n- **Nederland:** Reis buiten de spitsuren (vermijd 06:30-09:00 en 16:00-18:30) voor kortingen tot 40%.",
      de: "### Wie können Sie Ihr Reisebudget optimieren? 💰\n\nMeine besten Spartipps für Senioren:\n- **Belgien:** Kaufen Sie immer das **Seniorenticket** (Hin- und Rückfahrt überall in Belgien für nur 8,30 € für Personen ab 65 Jahren).\n- **Niederlande:** Züge sind teuer. Vermeiden Sie Fahrten während der Hauptverkehrszeiten (06:30-09:00 und 16:00-18:30), um Geld zu sparen."
    }
  },
  {
    keywords: ['belgi', 'belgii', 'belgium', 'belgie', 'seniorenticket', 'bruksel', 'brugia', 'belgien'],
    answer: {
      pl: "### Praktyczne wskazówki dla wyjazdu do Belgii 🇧🇪\n\nDrogi seniorze, podróż do Belgii to doskonały pomysł! Oto co musisz wiedzieć:\n- **Tani Bilet Seniora (Seniorenticket):** Kupisz go w kasie lub biletomacie SNCB na dowolnej stacji. Kosztuje stałe **8,30 €** i pozwala przejechać całą Belgię tam i z powrotem!\n- **Dworce kolejowe:** Pociągi z Holandii zatrzymują się w Antwerpii (dworzec Antwerpia-Centralna to jedno z najpiękniejszych miejsc w Europie, ma doskonałe windy) oraz Brukseli.\n- **Przesiadki:** Na stacjach przesiadkowych zawsze szukaj wind oznaczonych niebieskim symbolem wózka/osoby starszej. Unikaj ruchomych schodów z ciężkim bagażem.",
      en: "### Essential Guidelines for Visiting Belgium 🇧🇪\n\nDear traveler, visiting Belgium is extremely straightforward! Key points:\n- **Belgian Senior Ticket (Seniorenticket):** Only **€8.30** for a full round-trip anywhere in the country (65+ age limit). Valid after 9:00 AM on weekdays, and all day on weekends.\n- **Scenic Stations:** The train from the Netherlands stops at Antwerpen-Centraal, which is a breathtaking architectural wonder and fully equipped with heavy-duty elevators.\n- **Bruges Accessibility:** The charming city of Bruges has beautiful cobblestone paths which can be bumpy. I recommend taking the guided canal cruise (€12) to enjoy the sights while sitting comfortably.",
      nl: "### Praktische tips voor reizen naar België 🇧🇪\n\nBeste reiziger, een bezoek aan België is zeer eenvoudig:\n- **Seniorenticket:** Slechts **€8,30** voor een retourrit door heel België (65+). Geldig na 9:00 uur op weekdagen en de hele dag in het weekend.\n- **Antwerpen-Centraal:** Een prachtig station met uitstekende liften en drempelvrije perrons.\n- **Brugge:** De kasseien in Brugge kunnen hobbelig zijn. Neem een comfortabele rondvaartboot (€12) om zittend van de stad te genieten.",
      de: "### Wichtige Tipps für Ihren Besuch in Belgien 🇧🇪\n\nLieber Reisender, ein Ausflug nach Belgien ist denkbar einfach!\n- **Belgisches Seniorenticket:** Nur **8,30 €** für eine komplette Hin- und Rückfahrt im ganzen Land (ab 65 Jahren). Gilt an Wochentagen ab 9:00 Uhr und am Wochenende ganztägig.\n- **Antwerpen-Centraal:** Einer der schönsten Bahnhöfe der Welt mit barrierefreien Aufzügen.\n- **Brügge:** Das historische Pflaster kann holprig sein. Machen Sie eine gemütliche Kanalfahrt (€12), um die Stadt sitzend zu bewundern."
    }
  },
  {
    keywords: ['powrot', 'powrót', 'bezpiecz', 'night', 'return', 'safety', 'safe', 'wieczor', 'dark', 'ausflug', 'wyjazd', 'reisen', 'trip', 'start'],
    answer: {
      pl: "### Mój Bezpieczny Plan Trasy 🛡️\n\nTwoje bezpieczeństwo i spokój podczas podróży są dla mnie absolutnym priorytetem! Oto zasady bezpiecznej podróży:\n1. **Używaj Planera Bezpiecznej Trasy dla Seniorów:** Wpisz swoją ulicę startową oraz miejsce docelowe w formularzu 'Ustal Bezpieczną Trasę ♿' obok, a system dobierze dla Ciebie trasę bliską, tanią i w pełni dostępną dla osób chorych, zmęczonych oraz niepełnosprawnych ruchowo!\n2. **Kalkuluj koszty:** Sprawdzaj z góry ceny przejazdów pociągiem, autobusem, samochodem, motocyklem, rowerem lub trasą pieszą, aby dopasować je optymalnie do Twojego budżetu.\n3. **Miej przy sobie naładowany telefon:** Zawsze noś mały powerbank w torbie i upewnij się, że masz zapisany numer telefonu do hotelu na kartce papieru (na wypadek rozładowania baterii).",
      en: "### My Safe Route Planner 🛡️\n\nYour security and peace of mind during travels are my absolute priority! Rules for a safe trip:\n1. **Use the Safe Route Planner for Seniors:** Enter your starting street and destination in the 'Set Safe Route ♿' form next to us, and the system will present you with a route tailored to seniors (close, low cost, and fully accessible for sick & disabled travelers)!\n2. **Compare travel costs:** Check prices and timing for trains, buses, cars, motorcycles, bicycles, or walking to find the perfect fit for your wallet.\n3. **Battery & Written Address:** Always carry a portable charger. Crucially, keep your hotel card or a written slip of paper with the hotel address in your pocket.",
      nl: "### Mijn Veilige Route Planner 🛡️\n\nUw veiligheid en gemoedsrust tijdens uw reizen zijn mijn absolute prioriteit! Regels voor een veilige reis:\n1. **Gebruik de Seniorenroute Planner:** Voer uw startstraat en bestemming in de 'Senioren-Route ♿' in om een route te vinden die dichtbij, goedkoop en volledig toegankelijk is voor zieken en gehandicapten!\n2. **Vergelijk reiskosten:** Bekijk vooraf de opties voor treinen, bussen, auto's, motoren, fietsen of wandelingen.\n3. **Papieren adres:** Draag altijd een kaartje met het adres in uw zak.",
      de: "### Mein Sicherer Routenplaner 🛡️\n\nIhre Sicherheit und Gelassenheit auf Reisen haben für mich oberste Priorität! Regeln für eine sichere Reise:\n1. **Nutzen Sie den Senioren-Routenplaner:** Geben Sie Ihren Startpunkt und Ihr Reiseziel im Formular 'Senioren-Route ♿' ein, und das System zeigt Ihnen eine barrierefreie Route für Kranke, Senioren und Behinderte!\n2. **Reisekosten vergleichen:** Vergleichen Sie die Optionen für Bahn, Bus, Auto, Motorrad, Fahrrad oder Fußweg, um Ihr Budget zu schonen.\n3. **Telefon-Akku & Adresse:** Tragen Sie immer eine Powerbank und die Hoteladresse auf Papier bei sich."
    }
  }
];
