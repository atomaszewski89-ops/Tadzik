/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';

export interface MysterySpot {
  id: string;
  weekIndex: number;
  name: string;
  country: string;
  flag: string;
  lat: number;
  lng: number;
  photoUrl: string;
  riddle: Record<Language, string>;
  clueTerrain: Record<Language, string>;
  clueHistory: Record<Language, string>;
  funFact: Record<Language, string>;
  difficulty: 'easy' | 'medium' | 'hard';
  rewardXp: number;
  badgeTitle: Record<Language, string>;
  badgeEmoji: string;
}

export const WEEKLY_MYSTERY_SPOTS: MysterySpot[] = [
  {
    id: 'mystery-giethoorn',
    weekIndex: 1,
    name: 'Giethoorn',
    country: 'Holandia',
    flag: '🇳🇱',
    lat: 52.7397,
    lng: 6.0789,
    photoUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=800&auto=format&fit=crop&q=80',
    riddle: {
      pl: 'Tutaj asfalt ustępuje wodzie, a zamiast samochodów po ulicach płyną bezszelestne łódki zwane "punterami". Ponad 170 drewnianych mostków łączy kryte strzechą domki na wodzie. Nazywają mnie Wenecją Północy. Czym jestem?',
      nl: 'Hier maakt asfalt plaats voor water. In plaats van auto\'s varen er fluisterbootjes en punters. Meer dan 170 houten bruggetjes verbinden de rietgedekte boerderijen. Ik word het Venetië van het Noorden genoemd. Waar ben ik?',
      en: 'Here asphalt yields to emerald waterways. Instead of cars, silent electric whisper boats glide under 170 wooden arched bridges connecting thatched roof cottages. Known as the Venice of the North. Where am I?',
      de: 'Hier weicht Asphalt smaragdgrünem Wasser. Statt Autos gleiten Flüsterboote unter über 170 Holzbrücken durch Reetdachhäuser. Bekannt als das Venedig des Nordens. Wo bin ich?',
      es: 'Aquí el asfalto cede ante canales de agua. En lugar de coches, barcas silenciosas navegan bajo 170 puentes de madera uniendo casitas con tejados de paja. La Venecia del Norte. ¿Dónde estoy?',
      fr: 'Ici, l\'asphalte laisse place aux canaux. Des bateaux électriques silencieux glissent sous plus de 170 ponts en bois reliant des chaumières féeriques. Connue comme la Venise du Nord. Où suis-je?',
      ro: 'Aici asfaltul face loc canalelor de apă. În loc de mașini, bărci electrice silențioase plutesc sub 170 de poduri din lemn ce leagă case cu stuf. Numită Veneția Nordului. Unde sunt?',
      zh: '这里的柏油路让位于清澈的运河，没有喧闹的汽车，只有静谧的电动平底船穿梭于170多座木桥与茅草屋顶农舍之间。被誉为“北方威尼斯”。我在哪里？'
    },
    clueTerrain: {
      pl: '🌿 Prowincja Overijssel, Park Narodowy Weerribben-Wieden, labirynt płytkich kanałów i torfowisk.',
      nl: '🌿 Provincie Overijssel, Nationaal Park Weerribben-Wieden, doolhof van ondiepe grachten en rietlanden.',
      en: '🌿 Province of Overijssel, Weerribben-Wieden National Park, labyrinth of shallow canals and peat lakes.',
      de: '🌿 Provinz Overijssel, Nationalpark Weerribben-Wieden, Labyrinth aus seichten Grachten.',
      es: '🌿 Provincia de Overijssel, Parque Nacional Weerribben-Wieden, laberinto de canales poco profundos.',
      fr: '🌿 Province d\'Overijssel, Parc national Weerribben-Wieden, dédale de canaux et tourbières.',
      ro: '🌿 Provincia Overijssel, Parcul Național Weerribben-Wieden, labirint de canale.',
      zh: '🌿 上艾瑟尔省，韦里本-维登国家公园，蜿蜒的运河与湿地迷宫。'
    },
    clueHistory: {
      pl: '📜 Założone w XIII wieku przez uchodźców z Morza Śródziemnego; nazwa pochodzi od setek rogów kozich (Geytenhoren) znalezionych po wielkiej powodzi.',
      nl: '📜 Gesticht rond 1230; de naam verwijst naar de vele geitenhorens die na een stormvloed in het veen werden gevonden.',
      en: '📜 Founded around 1230; named after hundreds of goat horns found buried in the peat after the Saint Elizabeth flood.',
      de: '📜 Um 1230 gegründet; benannt nach Ziegenhörnern (Geytenhoren), die nach einer Sturmflut im Torf lagen.',
      es: '📜 Fundado hacia 1230; su nombre proviene de cuernos de cabra hallados tras una gran inundación.',
      fr: '📜 Fondé vers 1230; son nom provient des cornes de chèvre découvertes dans la tourbe après une inondation.',
      ro: '📜 Fondat în jurul anului 1230; numit după coarnele de capră găsite în turbă după inundații.',
      zh: '📜 始建于1230年左右；得名于大洪水后在泥炭沼泽中发现的数百只山羊角。'
    },
    funFact: {
      pl: '💡 Poczta w tej miejscowości wciąż bywa dostarczana łodzią przez listonosza!',
      nl: '💡 De postbode bezorgt hier de post soms nog steeds per punterboot!',
      en: '💡 The postman still delivers mail by boat to canal-side houses!',
      de: '💡 Der Postbote liefert Briefe teilweise noch immer per Boot aus!',
      es: '💡 ¡El cartero todavía reparte el correo en barca por los canales!',
      fr: '💡 Le facteur livre parfois encore le courrier en barque!',
      ro: '💡 Poștașul încă livrează scrisorile cu barca pe canale!',
      zh: '💡 这里的邮递员至今仍有时划着平底船挨家挨户投递信件！'
    },
    difficulty: 'easy',
    rewardXp: 300,
    badgeTitle: {
      pl: 'Kapitan Wodnego Raju Giethoorn',
      nl: 'Kapitein van Waterdorp Giethoorn',
      en: 'Captain of Giethoorn Waterways',
      de: 'Kapitän des Wasserdorfs Giethoorn',
      es: 'Capitán del Paraíso Acuático Giethoorn',
      fr: 'Capitaine de Giethoorn',
      ro: 'Căpitanul Paradisului Acvatic Giethoorn',
      zh: '羊角村水上探险队长'
    },
    badgeEmoji: '🛶'
  },
  {
    id: 'mystery-kinderdijk',
    weekIndex: 2,
    name: 'Kinderdijk',
    country: 'Holandia',
    flag: '🇳🇱',
    lat: 51.8884,
    lng: 4.6315,
    photoUrl: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&auto=format&fit=crop&q=80',
    riddle: {
      pl: '19 monumentalnych drewnianych gigantów stoi w równym szyku wzdłuż kanałów polderu Alblasserwaard. Przez wieki ich potężne skrzydła pompowały miliony litrów wody, ratując ziemię przed falami oceanu. Dziś to perła UNESCO. Gdzie stoję?',
      nl: '19 monumentale windmolens staan zij aan zij langs het water in de Alblasserwaard. Al eeuwen pompen hun wieken water weg om het land droog te houden. UNESCO Werelderfgoed. Waar ben ik?',
      en: '19 monumental windmills stand proudly in line along scenic polder basins. For centuries their canvas sails pumped out floodwaters, preserving the Dutch lowlands below sea level. A UNESCO icon. Where am I?',
      de: '19 monumentale Windmühlen stehen stolz entlang der Polderkanäle und hielten jahrhundertelang das Land trocken. UNESCO-Welterbe. Wo bin ich?',
      es: '19 molinos de viento monumentales alineados a lo largo de los canales del pólder. Durante siglos bombearon agua para mantener la tierra seca. Patrimonio UNESCO. ¿Dónde estoy?',
      fr: '19 moulins à vent monumentaux alignés le long des canaux pour protéger la terre contre les flots. Chef-d\'œuvre de l\'UNESCO. Où suis-je?',
      ro: '19 mori de vânt monumentale aliniate de-a lungul canalelor polderului, pompând apa de secole. Patrimoniu UNESCO. Unde sunt?',
      zh: '19座雄伟的风车整齐排列在低地水渠两旁，数百年来巨型风翼日夜旋转抽水，守护着海平面以下的低洼土地。联合国教科文组织世界遗产。我在哪里？'
    },
    clueTerrain: {
      pl: '🌊 Prowincja Holandia Południowa, zbieg rzek Lek i Noord, poniżej poziomu morza.',
      nl: '🌊 Provincie Zuid-Holland, samenvloeiing van de Lek en de Noord.',
      en: '🌊 Province of South Holland, confluence of the Lek and Noord rivers.',
      de: '🌊 Provinz Südholland, Zusammenfluss der Flüsse Lek und Noord.',
      es: '🌊 Provincia de Holanda Meridional, confluencia de los ríos Lek y Noord.',
      fr: '🌊 Province de Hollande-Méridionale, confluence des rivières Lek et Noord.',
      ro: '🌊 Provincia Olanda de Sud, confluența râurilor Lek și Noord.',
      zh: '🌊 南荷兰省，莱克河与诺德河交汇处。'
    },
    clueHistory: {
      pl: '📜 Legenda głosi, że po wielkiej powodzi św. Elżbiety w 1421 r. fala wyrzuciła na wał kołyskę z niemowlęciem i czuwającym kotem (Stąd nazwa Grobla Dziecięca).',
      nl: '📜 Volgens de legende spoelde na de Sint-Elisabethsvloed in 1421 een wiegje met een baby en een kat aan op de dijk.',
      en: '📜 Legend says after the 1421 flood, a cradle containing a smiling baby and a balancing cat washed ashore safely on the dyke.',
      de: '📜 Der Legende nach wurde nach der Flut von 1421 eine Wiege mit einem Baby und einer Katze unversehrt an den Deich gespült.',
      es: '📜 Cuenta la leyenda que tras la inundación de 1421 una cuna con un bebé y un gato llegó flotando sana y salva al dique.',
      fr: '📜 Selon la légende, après l\'inondation de 1421, un berceau avec un bébé et un chat s\'échoua sur la digue.',
      ro: '📜 Legenda spune că după inundația din 1421 un leagăn cu un bebeluș și o pisică a fost adus la mal.',
      zh: '📜 传说在1421年圣伊丽莎白大洪水后，一只载着婴儿和平衡小猫的摇篮被冲上堤坝并奇迹生还（故名“小孩堤防”）。'
    },
    funFact: {
      pl: '💡 Niektóre z tych wiatraków są nadal zamieszkane przez rodziny certyfikowanych młynarzy!',
      nl: '💡 Verschillende molens worden nog steeds bewoond door gecertificeerde molenaarsfamilies!',
      en: '💡 Several windmills are still inhabited and operated by traditional miller families!',
      de: '💡 Einige der Windmühlen werden noch heute von Müllerfamilien bewohnt!',
      es: '💡 ¡Varios molinos aún están habitados por familias de molineros tradicionales!',
      fr: '💡 Plusieurs moulins sont encore habités par des familles de meuniers!',
      ro: '💡 Câteva mori de vânt sunt încă locuite de familii de morari!',
      zh: '💡 几座风车至今仍有世代传承的专业磨坊主家庭在其中居住和守护！'
    },
    difficulty: 'easy',
    rewardXp: 320,
    badgeTitle: {
      pl: 'Strażnik Wiatraków Kinderdijk',
      nl: 'Molenmeester van Kinderdijk',
      en: 'Kinderdijk Windmill Guardian',
      de: 'Mühlenmeister von Kinderdijk',
      es: 'Guardián de los Molinos de Kinderdijk',
      fr: 'Gardien des Moulins de Kinderdijk',
      ro: 'Păzitorul Morilor de la Kinderdijk',
      zh: '小孩堤防风车守护者'
    },
    badgeEmoji: '💨'
  },
  {
    id: 'mystery-de-haar',
    weekIndex: 3,
    name: 'Kasteel de Haar',
    country: 'Holandia',
    flag: '🇳🇱',
    lat: 52.1217,
    lng: 4.9863,
    photoUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
    riddle: {
      pl: 'Największy i najbardziej baśniowy zamek w Niderlandach. Ma strzeliste neogotyckie wieżyczki, most zwodzony, fosę pełną łabędzi oraz park z 7000 dorosłych drzew przetransportowanych z całego kraju. Gościł Brigitte Bardot i Rogera Moore’a. Jak się nazywa?',
      nl: 'Het grootste en meest sprookjesachtige kasteel van Nederland. Neogotische torens, een ophaalbrug, kasteelgracht en een park met duizenden volgroeide bomen. Beroemd om extravagante feesten met filmsterren. Waar ben ik?',
      en: 'The largest and most fairy-tale castle in the Netherlands. Neogothic spires, a working drawbridge, swan-filled moats, and a 135-acre park. Host to Hollywood stars and Rothschild heirs. What is my name?',
      de: 'Das größte und märchenhafteste Schloss der Niederlande. Neugotische Zinnen, Zugbrücke, Wassergraben und ein riesiger Schlosspark. Wo bin ich?',
      es: 'El castillo más grande y de cuento de hadas de los Países Bajos. Torres neogóticas, puente levadizo, fosos con cisnes y lujosos salones. ¿Cómo me llamo?',
      fr: 'Le plus grand château de conte de fées des Pays-Bas. Tours néogothiques, pont-levis, douves et parc splendide. Où suis-je?',
      ro: 'Cel mai mare castel de poveste din Olanda, cu turnuri neogotice, pod mobil și șanțuri cu lebede. Cum mă numesc?',
      zh: '荷兰规模最大、最像童话世界的新哥特式古堡，拥有尖耸的塔楼、吊桥、天鹅护城河以及种有7000多棵百年老树的华丽凡尔赛风格花园。这里曾是好莱坞巨星云集的庄园。我在哪里？'
    },
    clueTerrain: {
      pl: '🏰 Haarzuilens koło Utrechtu, pośród bujnych ogrodów różanych i labiryntu bukszpanowego.',
      nl: '🏰 Haarzuilens nabij Utrecht, omringd door rozentuinen en een doolhof.',
      en: '🏰 Haarzuilens near Utrecht, surrounded by classic rose gardens and hedge mazes.',
      de: '🏰 Haarzuilens bei Utrecht, inmitten von Rosengärten und barocken Irrgärten.',
      es: '🏰 Haarzuilens cerca de Utrecht, entre jardines de rosas y laberintos.',
      fr: '🏰 Haarzuilens près d\'Utrecht, entouré de roseraies et d\'un labyrinthe.',
      ro: '🏰 Haarzuilens lângă Utrecht, înconjurat de grădini de trandafiri.',
      zh: '🏰 乌得勒支近郊哈尔勒聚伦斯（Haarzuilens），周边环绕着玫瑰园与树篱迷宫。'
    },
    clueHistory: {
      pl: '📜 Odbudowany w 1892 roku przez słynnego architekta Pierre\'a Cuypersa (twórcę Rijksmuseum) dzięki fortunie rodu Rothschildów.',
      nl: '📜 Herbouwd in 1892 door architect Pierre Cuypers met steun van de familie Van Zuylen van Nijevelt en Rothschild.',
      en: '📜 Rebuilt from ruins in 1892 by master architect Pierre Cuypers, funded by the Baroness Hélène de Rothschild.',
      de: '📜 1892 vom berühmten Architekten Pierre Cuypers mit dem Vermögen der Rothschild-Dynastie prachtvoll rekonstruiert.',
      es: '📜 Reconstruido en 1892 por el arquitecto Pierre Cuypers gracias a la fortuna de los Rothschild.',
      fr: '📜 Reconstruit en 1892 par l\'architecte Pierre Cuypers grâce à la fortune des Rothschild.',
      ro: '📜 Reconstruit în 1892 de Pierre Cuypers cu sprijinul familiei Rothschild.',
      zh: '📜 1892年由荷兰国家博物馆总建筑师皮埃尔·库珀斯（Pierre Cuypers）在罗斯柴尔德家族资助下从废墟中奢华重建。'
    },
    funFact: {
      pl: '💡 Aby zamek miał piękny widok, całą sąsiednią wioskę rozebrano i przeniesiono o kilometr dalej!',
      nl: '💡 Het hele oorspronkelijke dorp Haarzuilens werd verplaatst om plaats te maken voor het kasteelpark!',
      en: '💡 The entire village was relocated 1 km away just to make room for the lavish castle gardens!',
      de: '💡 Das gesamte Nachbardorf wurde um einen Kilometer versetzt, um Platz für den Schlosspark zu schaffen!',
      es: '💡 ¡Todo el pueblo vecino fue trasladado un kilómetro para hacer sitio a los jardines del castillo!',
      fr: '💡 Le village voisin entier a été déplacé d\'un kilomètre pour aménager le parc du château!',
      ro: '💡 Întregul sat vecin a fost mutat cu un kilometru pentru a face loc parcului castelului!',
      zh: '💡 当年为了让城堡拥有无遮挡的辽阔庄园视野，整座邻近村庄被整体拆迁平移了一公里！'
    },
    difficulty: 'medium',
    rewardXp: 350,
    badgeTitle: {
      pl: 'Rycerz Zamku De Haar',
      nl: 'Kasteelheer van De Haar',
      en: 'Knight of De Haar Castle',
      de: 'Ritter von Schloss De Haar',
      es: 'Caballero del Castillo De Haar',
      fr: 'Chevalier du Château De Haar',
      ro: 'Cavalerul Castelului De Haar',
      zh: '德哈尔古堡皇家骑士'
    },
    badgeEmoji: '🏰'
  },
  {
    id: 'mystery-atomium',
    weekIndex: 4,
    name: 'Atomium Bruxelles',
    country: 'Belgia',
    flag: '🇧🇪',
    lat: 50.8949,
    lng: 4.3415,
    photoUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&auto=format&fit=crop&q=80',
    riddle: {
      pl: 'Wyglądam jak fantastyczna rzeźba z kosmosu, ale w rzeczywistości jestem komórką elementarną kryształu żelaza powiększoną aż 165 miliardów razy! Posiadam 9 lśniących stalowych kul połączonych tubami z ruchomymi schodami. Gdzie jestem?',
      nl: 'Ik lijk op een futuristisch ruimtestation, maar ik ben een elementaire ijzerkristalcel die 165 miljard keer is uitvergroot! Negen glanzende stalen bollen verbonden met roltrappen. Waar sta ik?',
      en: 'I look like an alien structure, but I am actually a single iron crystal unit cell magnified 165 billion times! Nine interconnected stainless steel spheres reaching 102 meters into the sky. Where am I?',
      de: 'Ich sehe aus wie aus dem Weltraum, bin aber eine 165-milliardenfach vergrößerte Eisen-Kristallzelle mit 9 gigantischen Edelstahlkugeln. Wo stehe ich?',
      es: 'Parezco una nave espacial futurista, pero soy una celda de cristal de hierro ampliada 165 mil millones de veces con 9 esferas gigantes. ¿Dónde estoy?',
      fr: 'Je ressemble à une sculpture extraterrestre, mais je suis une molécule de cristal de fer agrandie 165 milliards de fois avec 9 sphères en acier inoxydable. Où suis-je?',
      ro: 'Arăt ca o sculptură spațială, dar sunt un cristal de fier mărit de 165 de miliarde de ori, cu 9 sfere strălucitoare. Unde sunt?',
      zh: '我看起来像来自外太空的科幻巨构，但实际上是将一颗铁单晶晶胞放大了整整1650亿倍！拥有9颗由巨型自动扶梯管道相连的不锈钢闪亮球体，高达102米。我在哪里？'
    },
    clueTerrain: {
      pl: '🇧🇪 Północna Bruksela, Park Heysel, w pobliżu Mini-Europy i Stadionu Króla Baudouina.',
      nl: '🇧🇪 Noord-Brussel, Heizelpark, vlakbij Mini-Europa.',
      en: '🇧🇪 Northern Brussels, Heysel Plateau, next to Mini-Europe.',
      de: '🇧🇪 Nördliches Brüssel, Heysel-Plateau, nahe Mini-Europa.',
      es: '🇧🇪 Norte de Bruselas, Meseta de Heysel, junto a Mini-Europe.',
      fr: '🇧🇪 Nord de Bruxelles, Plateau du Heysel, près de Mini-Europe.',
      ro: '🇧🇪 Nordul Bruxelles-ului, Platoul Heysel, lângă Mini-Europa.',
      zh: '🇧🇪 布鲁塞尔北部，海瑟尔高地（Heysel Plateau），紧邻微缩欧洲公园。'
    },
    clueHistory: {
      pl: '📜 Zaprojektowane przez André Waterkeyna na Wystawę Światową Expo 58 jako symbol wiary w pokojowe wykorzystanie energii atomowej.',
      nl: '📜 Ontworpen door André Waterkeyn voor de Wereldtentoonstelling Expo 58 als symbool van het atoomtijdperk.',
      en: '📜 Built for the 1958 Brussels World Expo (Expo 58) as a tribute to scientific progress and atomic optimism.',
      de: '📜 Erbaut zur Weltausstellung Expo 58 als Symbol für wissenschaftlichen Fortschritt.',
      es: '📜 Creado para la Exposición Universal de 1958 (Expo 58) como homenaje al progreso atómico pacífico.',
      fr: '📜 Conçu pour l\'Exposition universelle de Bruxelles de 1958 (Expo 58).',
      ro: '📜 Construit pentru Expoziția Universală de la Bruxelles din 1958.',
      zh: '📜 专为1958年布鲁塞尔世界博览会（Expo 58）建造，象征原子能和平利用与人类科学飞跃。'
    },
    funFact: {
      pl: '💡 W najwyższej kuli znajduje się restauracja z panoramicznym widokiem na całą stolicę Belgii!',
      nl: '💡 In de bovenste bol bevindt zich een restaurant met een spectaculair panoramisch uitzicht!',
      en: '💡 The top sphere houses a restaurant with panoramic 360° views across Brussels!',
      de: '💡 In der obersten Kugel befindet sich ein Restaurant mit 360-Grad-Panoramablick!',
      es: '💡 ¡En la esfera superior hay un restaurante con vistas de 360° sobre toda Bruselas!',
      fr: '💡 La sphère supérieure abrite un restaurant avec une vue panoramique sur toute la ville!',
      ro: '💡 În sfera superioară se află un restaurant cu vedere panoramică de 360°!',
      zh: '💡 顶层球体内部设有一家全景餐厅，可以俯瞰布鲁塞尔360度的天际线风光！'
    },
    difficulty: 'easy',
    rewardXp: 280,
    badgeTitle: {
      pl: 'Atomowy Odkrywca Brukseli',
      nl: 'Atoom-Ontdekker Brussel',
      en: 'Brussels Atomic Explorer',
      de: 'Brüsseler Atom-Entdecker',
      es: 'Explorador Atómico de Bruselas',
      fr: 'Explorateur Atomique de Bruxelles',
      ro: 'Explorator Atomic Bruxelles',
      zh: '布鲁塞尔原子球探索家'
    },
    badgeEmoji: '⚛️'
  },
  {
    id: 'mystery-zaanse-schans',
    weekIndex: 5,
    name: 'Zaanse Schans',
    country: 'Holandia',
    flag: '🇳🇱',
    lat: 52.4731,
    lng: 4.8198,
    photoUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&auto=format&fit=crop&q=80',
    riddle: {
      pl: 'W powietrzu czuć tu intensywny zapach mielonego kakao i świeżego drewna. Stoją tu zabytkowe zielone domki, działające wiatraki trące musztardę i barwniki oraz warsztaty rzeźbiące tradycyjne drewniane chodaki (klompen). Co to za skansen?',
      nl: 'De geur van cacao en zaagsel hangt in de lucht. Groene houten Zaanse huizen, draaiende industriemolens voor mosterd en verf, en ambachtelijke klompenmakerijen. Waar ben ik?',
      en: 'The rich aroma of cocoa beans and fresh pine sawdust fills the breeze. Historic green wooden houses, working industrial windmills grinding mustard, oil, and pigments, and master wooden clog workshops. Where am I?',
      de: 'Der Duft von Kakao und Sägemehl liegt in der Luft. Grüne Holzhäuser, historische Farbmühlen und Holzschuhwerkstätten. Wo bin ich?',
      es: 'Huele a cacao molido y madera recién cortada. Casas de madera verde, molinos de mostaza y artesanos que fabrican zuecos tradicionales (klompen). ¿Dónde estoy?',
      fr: 'Le doux parfum du cacao et du bois frais flotte dans l\'air. Maisons vertes typiques, moulins industriels et sabotiers traditionnels. Où suis-je?',
      ro: 'Mirosul de cacao și rumeguș proaspăt umple aerul. Case tradiționale verzi, mori de vânt și ateliere de saboți din lemn. Unde sunt?',
      zh: '微风中弥漫着浓郁的可可香气与新鲜锯末的清香。成排的标志性墨绿色木屋、研磨芥末与矿物颜料的运转工业风车，以及手工雕刻传统木鞋（Klompen）的工坊。我在哪里？'
    },
    clueTerrain: {
      pl: '🇳🇱 Zaandam nad rzeką Zaan, kilkanaście kilometrów na północ od Amsterdamu.',
      nl: '🇳🇱 Zaandam aan de rivier de Zaan, even ten noorden van Amsterdam.',
      en: '🇳🇱 Zaandam along the river Zaan, just 15 minutes north of Amsterdam.',
      de: '🇳🇱 Zaandam an der Zaan, wenige Kilometer nördlich von Amsterdam.',
      es: '🇳🇱 Zaandam junto al río Zaan, al norte de Ámsterdam.',
      fr: '🇳🇱 Zaandam le long de la rivière Zaan, au nord d\'Amsterdam.',
      ro: '🇳🇱 Zaandam pe malul râului Zaan, la nord de Amsterdam.',
      zh: '🇳🇱 赞丹（Zaandam），赞河（Zaan）沿岸，阿姆斯特丹以北约15分钟车程。'
    },
    clueHistory: {
      pl: '📜 W XVII i XVIII wieku rzeka Zaan była pierwszym wielkim zagłębiem przemysłowym świata – działało tu ponad 600 wiatraków napędzających stocznie i manufaktury!',
      nl: '📜 In de Gouden Eeuw stonden hier meer dan 600 industriemolens die zaagden, maalden en persten voor de wereldwijde vloot.',
      en: '📜 In the 17th-century Golden Age, the Zaan region had over 600 industrial windmills powering the world\'s largest shipbuilding powerhouse.',
      de: '📜 Im 17. Jahrhundert arbeiteten hier über 600 Windmühlen als ältestes Industriegebiet der Welt.',
      es: '📜 En el siglo XVII más de 600 molinos impulsaron la primera gran región industrial del mundo para construir barcos.',
      fr: '📜 Au XVIIe siècle, plus de 600 moulins faisaient de cette région la première zone industrielle au monde.',
      ro: '📜 În secolul al XVII-lea peste 600 de mori industriale au alimentat prima zonă industrială a lumii.',
      zh: '📜 在17世纪荷兰黄金时代，赞河地区曾有600多座工业风车日夜轰鸣，是人类历史上最早的大型重工业与造船基地。'
    },
    funFact: {
      pl: '💡 Car Piotr Wielki z Rosji przyjechał tu incognito w 1697 roku, aby osobiście uczyć się ciesielstwa i budowy statków!',
      nl: '💡 Tsaar Peter de Grote kwam hier in 1697 anoniem het vak van scheepstimmerman leren!',
      en: '💡 Russian Tsar Peter the Great lived here undercover in 1697 to learn Dutch shipbuilding carpentry!',
      de: '💡 Zar Peter der Große wohnte 1697 inkognito hier, um das Handwerk des Schiffszimmermanns zu lernen!',
      es: '💡 ¡El zar ruso Pedro el Grande vivió aquí de incógnito en 1697 para aprender a construir barcos!',
      fr: '💡 Le tsar Pierre le Grand y vécut incognito en 1697 pour apprendre la charpenterie navale!',
      ro: '💡 Țarul Petru cel Mare a locuit aici incognito în 1697 pentru a învăța construcția navelor!',
      zh: '💡 1697年，俄罗斯沙皇彼得大帝曾隐姓埋名化身普通学徒住在这里，亲手学习荷兰先进的造船与木工手艺！'
    },
    difficulty: 'easy',
    rewardXp: 290,
    badgeTitle: {
      pl: 'Mistrz Chodaków i Młynów Zaanse',
      nl: 'Meesterklompenmaker van Zaanse Schans',
      en: 'Zaanse Windmill Master',
      de: 'Zaanse Windmühlen-Meister',
      es: 'Maestro de Zaanse Schans',
      fr: 'Maître Artisan de Zaanse Schans',
      ro: 'Maestrul Morilor Zaanse Schans',
      zh: '赞斯堡风车与木鞋大师'
    },
    badgeEmoji: '🪵'
  },
  {
    id: 'mystery-eltz-castle',
    weekIndex: 6,
    name: 'Burg Eltz',
    country: 'Niemcy',
    flag: '🇩🇪',
    lat: 50.2052,
    lng: 7.3366,
    photoUrl: 'https://images.unsplash.com/photo-1548625361-195fe57876a3?w=800&auto=format&fit=crop&q=80',
    riddle: {
      pl: 'Ukryty głęboko w zalesionej dolinie rzeki Elzbach na 70-metrowej skale. Należy do tej samej arystokratycznej rodziny od ponad 850 lat (od 33 pokoleń) i nigdy w historii nie został zdobyty ani zniszczony przez żadną wojnę. Jaki to zamek?',
      nl: 'Verborgen in een diepe bosrijke vallei op een 70 meter hoge rots. Al meer dan 850 jaar (33 generaties) eigendom van dezelfde adellijke familie en nooit verwoest in een oorlog. Welk kasteel is dit?',
      en: 'Hidden deep in a secluded forested river valley upon a 70-meter rock cliff. Owned by the exact same branch of noble family for over 850 years (33 generations), never destroyed by war. Which castle am I?',
      de: 'Tief versteckt im bewaldeten Tal auf einem 70 Meter hohen Felssporn. Seit über 850 Jahren im Besitz derselben Adelsfamilie und niemals zerstört. Welche Burg bin ich?',
      es: 'Oculto en un frondoso valle sobre una roca de 70 metros. Pertenece a la misma familia noble desde hace más de 850 años y jamás fue destruido. ¿Qué castillo soy?',
      fr: 'Niché au fond d\'une vallée boisée sur un éperon rocheux de 70 mètres. Propriété de la même famille depuis plus de 850 ans et jamais détruit. Quel château suis-je?',
      ro: 'Ascuns într-o vale împădurită pe o stâncă de 70 de metri. Aparține aceleiași familii de peste 850 de ani și nu a fost niciodată distrus în războaie. Ce castel sunt?',
      zh: '深藏于茂密森林幽谷中一座70米高的巨石悬崖之上。同一贵族家族在此世袭传承了850多年（整整33代），历史上从未被任何战争攻破或损毁。这是哪座古堡？'
    },
    clueTerrain: {
      pl: '🇩🇪 Nadrenia-Palatynat, lasy nad rzeką Mozelą, pomiędzy Koblencją a Trewirem.',
      nl: '🇩🇪 Rijnland-Palts, bossen nabij de Moezelvallei tussen Koblenz en Trier.',
      en: '🇩🇪 Rhineland-Palatinate, deep Moselle River forest between Koblenz and Trier.',
      de: '🇩🇪 Rheinland-Pfalz, tief im Elzbachtal nahe der Mosel.',
      es: '🇩🇪 Renania-Palatinado, valle del río Mosela.',
      fr: '🇩🇪 Rhénanie-Palatinat, vallée de l\'Elzbach près de la Moselle.',
      ro: '🇩🇪 Renania-Palatinat, valea râului Mosela.',
      zh: '🇩🇪 莱茵兰-普法尔茨州，科布伦茨与特里尔之间的摩泽尔河森林深处。'
    },
    clueHistory: {
      pl: '📜 Pierwsza wzmianka pochodzi z 1157 roku z listu cesarza Fryderyka I Barbarossy.',
      nl: '📜 Eerste vermelding stamt uit 1157 in een oorkonde van keizer Frederik I Barbarossa.',
      en: '📜 First documented in 1157 in an imperial letter signed by Holy Roman Emperor Frederick Barbarossa.',
      de: '📜 Erstmals 1157 urkundlich in einer Schenkung von Kaiser Friedrich Barbarossa erwähnt.',
      es: '📜 Mencionado por primera vez en 1157 por el emperador Federico Barbarroja.',
      fr: '📜 Mentionné pour la première fois en 1157 par l\'empereur Frédéric Barberousse.',
      ro: '📜 Menționat pentru prima dată în 1157 de împăratul Frederic Barbarossa.',
      zh: '📜 最早于1157年神圣罗马帝国皇帝腓特烈一世（巴巴罗萨）签署的皇家特许状中被记载。'
    },
    funFact: {
      pl: '💡 Wizerunek tego zamku widniał na dawnym niemieckim banknocie 500 marek (DM)!',
      nl: '💡 Deze burcht stond afgebeeld op het beroemde Duitse bankbiljet van 500 D-Mark!',
      en: '💡 An illustration of this fairy-tale fortress was featured on the former German 500 Deutsche Mark banknote!',
      de: '💡 Das Schloss war auf dem früheren deutschen 500-D-Mark-Geldschein abgebildet!',
      es: '💡 ¡La silueta de este castillo aparecía en el antiguo billete alemán de 500 marcos!',
      fr: '💡 Le château figurait sur l\'ancien billet allemand de 500 Deutsche Marks!',
      ro: '💡 Acest castel a fost ilustrat pe fosta bancnotă germană de 500 de mărci!',
      zh: '💡 这座梦幻城堡的剪影曾被印在过去的德国500德国马克纸币背面！'
    },
    difficulty: 'hard',
    rewardXp: 400,
    badgeTitle: {
      pl: 'Strażnik Twierdzy Eltz',
      nl: 'Wachter van Burcht Eltz',
      en: 'Guardian of Burg Eltz',
      de: 'Burgvogt von Burg Eltz',
      es: 'Guardián del Castillo de Eltz',
      fr: 'Gardien du Château d\'Eltz',
      ro: 'Păzitorul Cetății Eltz',
      zh: '埃尔茨古堡传奇守护者'
    },
    badgeEmoji: '🛡️'
  },
  {
    id: 'mystery-dinant',
    weekIndex: 7,
    name: 'Dinant',
    country: 'Belgia',
    flag: '🇧🇪',
    lat: 50.2611,
    lng: 4.9122,
    photoUrl: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&auto=format&fit=crop&q=80',
    riddle: {
      pl: 'Przyklejone do pionowej 100-metrowej skały nad rzeką Mozą miasteczko z gotycką kolegiatą i cebulastą kopułą. Każdy most zdobią tu wielkie kolorowe saksofony, bo to ojczyzna ich wynalazcy Adolphe\'a Saxa. Gdzie to jest?',
      nl: 'Gelegen tegen een steile 100 meter hoge rotswand aan de Maas. Een gotische kerk met een peervormige toren en kleurrijke reuzensaxofoons op de brug. Geboortestad van Adolphe Sax. Waar ben ik?',
      en: 'Perched dramatically against a sheer 100-meter limestone cliff along the Meuse River. Dominated by an onion-domed collegiate church and huge colorful saxophones lining the bridge honoring its inventor Adolphe Sax. Where am I?',
      de: 'An eine 100 Meter hohe Felswand an der Maas geschmiegt, mit Zwiebelturm-Stiftskirche und bunten Riesen-Saxophonen zu Ehren des Erfinders Adolphe Sax. Wo bin ich?',
      es: 'Encaramada a un acantilado de piedra caliza de 100 metros junto al río Mosa. Iglesia gótica con cúpula bulbosa y saxofones gigantes en el puente honrando a Adolphe Sax. ¿Dónde estoy?',
      fr: 'Adossée à une falaise vertigineuse de 100 mètres le long de la Meuse. Collégiale gothique au clocher bulbeux et saxophones géants en hommage à Adolphe Sax. Où suis-je?',
      ro: 'Așezat pe o stâncă de 100 de metri de-a lungul râului Meuse. Biserică gotică cu turn bulbar și saxofoane uriașe pe pod. Unde sunt?',
      zh: '依偎在默兹河畔百米垂直石灰岩悬崖绝壁之下，拥有标志性的洋葱顶哥特式大教堂。桥上矗立着五彩缤纷的巨型萨克斯管雕塑，这里是萨克斯风发明家阿道夫·萨克斯的故乡。我在哪里？'
    },
    clueTerrain: {
      pl: '🇧🇪 Walonia, Ardeny belgijskie, wąski wąwóz rzeki Mozy.',
      nl: '🇧🇪 Wallonië, Belgische Ardennen, diepe vallei van de Maas.',
      en: '🇧🇪 Wallonia, Belgian Ardennes, deep river gorge of the Meuse.',
      de: '🇧🇪 Wallonie, belgische Ardennen, tiefes Tal der Maas.',
      es: '🇧🇪 Valonia, Ardenas belgas, garganta del río Mosa.',
      fr: '🇧🇪 Wallonie, Ardennes belges, vallée encaissée de la Meuse.',
      ro: '🇧🇪 Valonia, Ardenii belgieni, defileul râului Meuse.',
      zh: '🇧🇪 瓦隆大区，比利时阿登高地，默兹河深切峡谷。'
    },
    clueHistory: {
      pl: '📜 Cytadela na szczycie skały została wzniesiona w XI wieku, a obecną formę nadali jej Holendrzy w 1818 roku.',
      nl: '📜 De citadel bovenop de rots werd gesticht in de 11e eeuw en in 1818 herbouwd.',
      en: '📜 The cliff-top citadel fortress was originally fortified in 1051 and rebuilt in 1818 by the Dutch.',
      de: '📜 Die Festung auf dem Felsen wurde 1051 gegründet und 1818 neu befestigt.',
      es: '📜 La ciudadela en la cima del risco fue fortificada en 1051 y reconstruida en 1818.',
      fr: '📜 La citadelle perchée sur le rocher date de 1051 et fut reconstruite en 1818.',
      ro: '📜 Citadela de pe stâncă datează din 1051 și a fost reconstruită în 1818.',
      zh: '📜 悬崖顶部的军事要塞要塞始建于1051年，并于1818年由荷兰王国重新加固改建。'
    },
    funFact: {
      pl: '💡 Miejscowy przysmak "Couque de Dinant" to najtwardszy piernik w Europie – trzeba go ssać jak cukierek, bo inaczej można złamać ząb!',
      nl: '💡 De lokale specialiteit "Couque de Dinant" is het hardste koekje ter wereld – je moet het laten smelten in je mond!',
      en: '💡 The famous "Couque de Dinant" honey biscuit is the hardest cookie in Europe – locals break small pieces to melt like candy so you don\'t chip a tooth!',
      de: '💡 Die berühmten "Couque de Dinant" Honigkekse sind so steinhart, dass man sie lutschen muss!',
      es: '💡 ¡La galleta tradicional "Couque de Dinant" es tan dura que debes chuparla como un caramelo!',
      fr: '💡 La célèbre "Couque de Dinant" au miel est le biscuit le plus dur d\'Europe!',
      ro: '💡 Biscuitul tradițional "Couque de Dinant" este atât de tare încât trebuie ținut în gură ca o bomboană!',
      zh: '💡 当地传统名产“迪南硬蜜饼（Couque de Dinant）”是全欧洲最硬的糕点——必须像吃糖果一样含在嘴里慢慢融化，千万不能硬咬！'
    },
    difficulty: 'medium',
    rewardXp: 330,
    badgeTitle: {
      pl: 'Wirtuoz Saksofonu z Dinant',
      nl: 'Saxofoonvirtuoos van Dinant',
      en: 'Dinant Saxophone Virtuoso',
      de: 'Saxophon-Virtuose von Dinant',
      es: 'Virtuoso del Saxofón de Dinant',
      fr: 'Virtuose du Saxophone de Dinant',
      ro: 'Virtuozul Saxofonului din Dinant',
      zh: '迪南萨克斯风传奇探险家'
    },
    badgeEmoji: '🎷'
  },
  {
    id: 'mystery-wawel',
    weekIndex: 8,
    name: 'Zamek Królewski na Wawelu',
    country: 'Polska',
    flag: '🇵🇱',
    lat: 50.0540,
    lng: 19.9354,
    photoUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=80',
    riddle: {
      pl: 'Wapienne wzgórze nad zakolem Wisły, na którym przez stulecia koronowano królów. Znajduje się tu renesansowy dziedziniec arkadowy, dzwon Zygmunta oraz tajemnicza jaskinia, w której według pradawnej legendy mieszkał zionący ogniem smok. Gdzie jesteśmy?',
      nl: 'Kalkstenen heuvel aan een bocht van de Wisła waar koningen werden gekroond. Beroemd om zijn renaissance-binnenplaats, de Sigismund-klok en de legendarische drakengrot. Waar ben ik?',
      en: 'A limestone hill rising above the Vistula River where monarchs were crowned for centuries. Features a magnificent Renaissance arcaded courtyard, the royal Sigismund Bell, and the subterranean cave of a fire-breathing dragon. Where am I?',
      de: 'Ein Kalksteinhügel über der Weichsel, auf dem Könige gekrönt wurden. Mit Renaissance-Arkadenhof, Sigismund-Glocke und der legendären Drachenhöhle. Wo bin ich?',
      es: 'Colina de piedra caliza sobre el río Vístula donde se coronaban reyes. Patio renacentista, la campana de Segismundo y la cueva de un dragón mitológico. ¿Dónde estoy?',
      fr: 'Colline calcaire au-dessus de la Vistule où les rois furent couronnés. Cour Renaissance, cloche Sigismond et repaire légendaire du dragon. Où suis-je?',
      ro: 'Deal de calcar deasupra râului Vistula unde erau încoronați regii, cu clopotul Sigismund și peștera dragonului legendar. Unde sunt?',
      zh: '矗立在维斯瓦河弯道之上的石灰岩山丘，数世纪以来历代国王在此加冕。拥有宏伟的文艺复兴式拱廊庭院、重达13吨的齐格蒙特大钟以及传说中会喷火的恶龙洞穴。我在哪里？'
    },
    clueTerrain: {
      pl: '🇵🇱 Kraków, Małopolska, wapienne wzgórze 228 m n.p.m. nad brzegiem Wisły.',
      nl: '🇵🇱 Krakau, Klein-Polen, heuvel aan de oever van de Wisła.',
      en: '🇵🇱 Krakow, Lesser Poland, limestone hill overlooking the Vistula.',
      de: '🇵🇱 Krakau, Kleinpolen, Kalksteinhügel am Weichselufer.',
      es: '🇵🇱 Cracovia, Pequeña Polonia, colina sobre el río Vístula.',
      fr: '🇵🇱 Cracovie, Petite-Pologne, colline surplombant la Vistule.',
      ro: '🇵🇱 Cracovia, Polonia Mică, deal deasupra râului Vistula.',
      zh: '🇵🇱 克拉科夫，小波兰省，俯瞰维斯瓦河的石灰岩高地。'
    },
    clueHistory: {
      pl: '📜 Siedziba władców Polski od XI wieku; zamek w obecnym renesansowym kształcie ufundowali król Zygmunt I Stary i królowa Bona Sforza.',
      nl: '📜 Residentie van Poolse koningen sinds de 11e eeuw, verbouwd door koning Sigismund I en koningin Bona Sforza.',
      en: '📜 Seat of Polish kings from the 11th century; transformed into a Renaissance masterpiece by King Sigismund I and Queen Bona Sforza.',
      de: '📜 Sitz der polnischen Könige seit dem 11. Jahrhundert, durch König Sigismund I. zum Renaissance-Meisterwerk ausgebaut.',
      es: '📜 Sede de los reyes polacos desde el siglo XI, remodelado en estilo renacentista.',
      fr: '📜 Siège des rois de Pologne depuis le XIe siècle, joyau de la Renaissance.',
      ro: '📜 Reședința regilor Poloniei încă din secolul al XI-lea.',
      zh: '📜 自11世纪起成为波兰历代君主宫邸，由齐格蒙特一世国王与博娜·斯福尔扎王后斥资改建为文艺复兴杰作。'
    },
    funFact: {
      pl: '💡 Metalowy posąg Smoka Wawelskiego u stóp wzgórza naprawdę zieje prawdziwym żywym ogniem co kilka minut!',
      nl: '💡 Het bronzen standbeeld van de Wawel-draak spuwt elke paar minuten echt vuur!',
      en: '💡 The bronze dragon sculpture at the foot of the castle actually breathes real fire every few minutes!',
      de: '💡 Die bronzene Drachenskulptur am Fuße des Burgbergs spuckt alle paar Minuten echtes Feuer!',
      es: '💡 ¡La escultura del dragón al pie de la colina escupe fuego real cada pocos minutos!',
      fr: '💡 La sculpture du dragon au pied de la colline crache du vrai feu toutes les quelques minutes!',
      ro: '💡 Statuia dragonului de la baza dealului scoate flăcări reale la fiecare câteva minute!',
      zh: '💡 城堡山脚下的青铜巨龙雕像每隔几分钟便会真的喷出熊熊烈火！'
    },
    difficulty: 'easy',
    rewardXp: 300,
    badgeTitle: {
      pl: 'Pogromca Smoka Wawelskiego',
      nl: 'Drakenbedwinger van Wawel',
      en: 'Wawel Dragon Champion',
      de: 'Drachenbändiger vom Wawel',
      es: 'Vencedor del Dragón de Wawel',
      fr: 'Vainqueur du Dragon du Wawel',
      ro: 'Învingătorul Dragonului Wawel',
      zh: '瓦维尔巨龙征服者'
    },
    badgeEmoji: '🐉'
  }
];

export function getWeeklyMysteryForDate(d = new Date()): {
  spot: MysterySpot;
  weekNumber: number;
  year: number;
  nextResetDate: Date;
} {
  const year = d.getFullYear();
  
  // Calculate ISO week number
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);

  // Cycle through the list of mystery spots
  const index = (weekNumber - 1) % WEEKLY_MYSTERY_SPOTS.length;
  const spot = WEEKLY_MYSTERY_SPOTS[index] || WEEKLY_MYSTERY_SPOTS[0];

  // Calculate next Monday 00:00:00
  const nextReset = new Date(d);
  const currentDay = d.getDay(); // 0 is Sunday, 1 is Monday
  const daysUntilMonday = (8 - currentDay) % 7 || 7;
  nextReset.setDate(d.getDate() + daysUntilMonday);
  nextReset.setHours(0, 0, 0, 0);

  return {
    spot,
    weekNumber,
    year,
    nextResetDate: nextReset
  };
}

// Distance calculation between two lat/lng coordinates using Haversine formula (km)
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Compass bearing calculation (degrees 0-360)
export function calculateBearingDegrees(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const y = Math.sin((lon2 - lon1) * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.cos((lon2 - lon1) * (Math.PI / 180));
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((brng + 360) % 360);
}

export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const y = Math.sin((lon2 - lon1) * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.cos((lon2 - lon1) * (Math.PI / 180));
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  brng = (brng + 360) % 360;

  if (brng >= 337.5 || brng < 22.5) return '⬆️ Północ (N)';
  if (brng >= 22.5 && brng < 67.5) return '↗️ Północny Wschód (NE)';
  if (brng >= 67.5 && brng < 112.5) return '➡️ Wschód (E)';
  if (brng >= 112.5 && brng < 157.5) return '↘️ Południowy Wschód (SE)';
  if (brng >= 157.5 && brng < 202.5) return '⬇️ Południe (S)';
  if (brng >= 202.5 && brng < 247.5) return '↙️ Południowy Zachód (SW)';
  if (brng >= 247.5 && brng < 292.5) return '⬅️ Zachód (W)';
  return '↖️ Północny Zachód (NW)';
}
