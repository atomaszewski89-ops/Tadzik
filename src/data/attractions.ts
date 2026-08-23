/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Attraction, CyclingRoute, ChallengeEntry } from '../types';

export const SEEDED_ATTRACTIONS: Attraction[] = [
  {
    id: 'depot-boijmans',
    name: 'Depot Boijmans Van Beuningen',
    city: 'Rotterdam',
    region: 'Zuid-Holland',
    category: 'museum',
    moods: ['remote work', 'romantic sunset'],
    coordinates: { lat: 51.9142, lng: 4.4725 },
    adultVersion: {
      description: 'The world\'s first publicly accessible art depot. Explore 151,000 artworks in a futuristic mirrored bowl, ending with an iconic rooftop forest sunset view and cafe workspace.',
      budget: 20,
      durationMinutes: 90
    },
    childVersion: {
      description: 'A spectacular giant mirror bowl! Children love finding their reflections outside, hunting for animal art in glass elevators, and exploring the rooftop garden maze.',
      budget: 5,
      durationMinutes: 75
    },
    transport: {
      type: 'tram',
      line: '7',
      destination: 'Willemsplein',
      stopName: 'Museumpark',
      platform: 'A',
      scheduleMinutes: [4, 12, 19, 27, 34, 42, 49, 57]
    }
  },
  {
    id: 'kralingse-bos',
    name: 'Kralingse Bos & Kralingse Plas',
    city: 'Rotterdam',
    region: 'Zuid-Holland',
    category: 'forest',
    moods: ['peace and quiet', 'romantic sunset'],
    coordinates: { lat: 51.9388, lng: 4.5167 },
    adultVersion: {
      description: 'A tranquil forest escape surrounding a massive lake. Features cozy yacht clubs, sailing schools, quiet jogging trails, and sunset viewing spots facing the city skyline.',
      budget: 0,
      durationMinutes: 120
    },
    childVersion: {
      description: 'Ultimate family fun with a free deer park (hertenkamp), a children\'s petting farm, safe sandy beaches, a paddling pool, and an old-fashioned Dutch pancake house!',
      budget: 6,
      durationMinutes: 150
    },
    transport: {
      type: 'metro',
      line: 'A/B/C',
      destination: 'Binnenhof / Nesselande',
      stopName: 'Voorschoterlaan',
      platform: '2',
      scheduleMinutes: [2, 7, 12, 17, 22, 27, 32, 37]
    }
  },
  {
    id: 'rijksmuseum',
    name: 'Rijksmuseum Amsterdam',
    city: 'Amsterdam',
    region: 'Noord-Holland',
    category: 'museum',
    moods: ['peace and quiet', 'remote work'],
    coordinates: { lat: 52.3600, lng: 4.8852 },
    adultVersion: {
      description: 'The grand national museum of the Netherlands. Home to Rembrandts Night Watch, Vermeer masterpieces, and the breathtaking Cuypers library workspace.',
      budget: 22,
      durationMinutes: 120
    },
    childVersion: {
      description: 'Discover history with interactive family trails, search for microscopic details in massive dollhouses, view real medieval armor, and run around the free play fountains in the garden.',
      budget: 0,
      durationMinutes: 90
    },
    transport: {
      type: 'tram',
      line: '2 / 12',
      destination: 'Nieuw Sloten / Amstelstation',
      stopName: 'Spiegelgracht',
      platform: 'B',
      scheduleMinutes: [3, 9, 15, 21, 27, 33, 39, 45]
    }
  },
  {
    id: 'amsterdamse-bos',
    name: 'Amsterdamse Bos (Amsterdam Forest)',
    city: 'Amsterdam',
    region: 'Noord-Holland',
    category: 'forest',
    moods: ['peace and quiet', 'romantic sunset'],
    coordinates: { lat: 52.3122, lng: 4.8436 },
    adultVersion: {
      description: 'An organic park three times larger than Central Park. Offers serene boat rentals, a quiet spa, pristine marsh walking paths, and local goat-cheese organic bistros.',
      budget: 5,
      durationMinutes: 180
    },
    childVersion: {
      description: 'Feed baby goats milk bottles at Ridammerhoeve Goat Farm, conquer high treetops at the Fun Forest Climbing Park, and ride an authentic historic steam tram!',
      budget: 8,
      durationMinutes: 240
    },
    transport: {
      type: 'bus',
      line: '347',
      destination: 'Uithoorn Busstation',
      stopName: 'Amsterdamse Bos',
      platform: '1',
      scheduleMinutes: [5, 15, 25, 35, 45, 55]
    }
  },
  {
    id: 'vondelpark',
    name: 'Vondelpark Oasis',
    city: 'Amsterdam',
    region: 'Noord-Holland',
    category: 'park',
    moods: ['romantic sunset', 'peace and quiet'],
    coordinates: { lat: 52.3580, lng: 4.8682 },
    adultVersion: {
      description: 'A vibrant English-style park in Amsterdam. Ideal for people-watching, reading under ancient weeping willows, or sitting by the beautiful open-air stage pavilion cafe.',
      budget: 0,
      durationMinutes: 90
    },
    childVersion: {
      description: 'Fenced playgrounds with wooden tree towers, safe shallow splash pools in summer, and the famous Groot Melkhuis playground cafe.',
      budget: 3,
      durationMinutes: 100
    },
    transport: {
      type: 'tram',
      line: '1',
      destination: 'Muiderpoortstation',
      stopName: 'Eerste Constantijn Huygensstraat',
      platform: 'A',
      scheduleMinutes: [1, 7, 13, 19, 25, 31, 37, 43]
    }
  },
  {
    id: 'dom-tower',
    name: 'Utrecht Dom Tower & Domplein',
    city: 'Utrecht',
    region: 'Utrecht',
    category: 'historical_site',
    moods: ['romantic sunset', 'peace and quiet'],
    coordinates: { lat: 52.0906, lng: 5.1213 },
    adultVersion: {
      description: 'The tallest church tower in the Netherlands. Climb 465 steps for a spectacular panorama of the canals, ending with a peaceful visit to the historic Pandhof monastery garden.',
      budget: 13,
      durationMinutes: 75
    },
    childVersion: {
      description: 'A fun light-and-climb game path! Kids carry special lanterns, ring 400-year-old giant church bells, and play archaeologist at DOMunder underground tunnels.',
      budget: 8,
      durationMinutes: 90
    },
    transport: {
      type: 'bus',
      line: '2',
      destination: 'Museumkwartier',
      stopName: 'Domplein',
      platform: 'C',
      scheduleMinutes: [8, 23, 38, 53]
    }
  },
  {
    id: 'maximapark',
    name: 'Maximapark & Viking Playground',
    city: 'Utrecht',
    region: 'Utrecht',
    category: 'park',
    moods: ['peace and quiet', 'remote work'],
    coordinates: { lat: 52.0945, lng: 5.0288 },
    adultVersion: {
      description: 'Named the best park in the Netherlands. Explore an exquisite Japanese butterfly garden, a 4km quiet canal boardwalk, and a beautifully designed, light-filled Anafora Teahouse workspace.',
      budget: 0,
      durationMinutes: 120
    },
    childVersion: {
      description: 'An expansive wooden Viking fort playground! Fully enclosed and safe, with sand excavations, balance beams, and family park trains.',
      budget: 2,
      durationMinutes: 120
    },
    transport: {
      type: 'train',
      line: 'Sprinter',
      destination: 'The Hague Central',
      stopName: 'Utrecht Terwijde',
      platform: '2',
      scheduleMinutes: [6, 21, 36, 51]
    }
  },
  {
    id: 'plaswijckpark',
    name: 'Plaswijckpark Rotterdam',
    city: 'Rotterdam',
    region: 'Zuid-Holland',
    category: 'amusement_park',
    moods: ['romantic sunset'],
    coordinates: { lat: 51.9545, lng: 4.4789 },
    adultVersion: {
      description: 'A peaceful, clean park containing old-fashioned pedal boats, picnic spots on canals, and animal reserves for a relaxing slow afternoon in North Rotterdam.',
      budget: 14,
      durationMinutes: 150
    },
    childVersion: {
      description: 'A literal wonderland! Water playground (Havenspeeltun), animal zoo (Apenweide), traffic park where kids drive real pedal go-karts, and an indoor treehouse monkey play area.',
      budget: 14,
      durationMinutes: 240
    },
    transport: {
      type: 'tram',
      line: '25',
      destination: 'Schiebroek',
      stopName: 'Melanchthonweg',
      platform: '1',
      scheduleMinutes: [1, 11, 21, 31, 41, 51]
    }
  },
  {
    id: 'scheveningen-beach',
    name: 'Scheveningen Beach & Pier',
    city: 'Rotterdam',
    region: 'Zuid-Holland',
    category: 'beach',
    moods: ['romantic sunset', 'peace and quiet'],
    coordinates: { lat: 52.1136, lng: 4.2764 },
    adultVersion: {
      description: 'The premier sandy resort of the Netherlands. Walk along the historic two-level pier, enjoy local fresh herring, or take a panoramic sea-view ride on the quiet giant ferris wheel.',
      budget: 9,
      durationMinutes: 120
    },
    childVersion: {
      description: 'A massive sand adventure! Kids love playing on the safe wide shoreline, watching seals at the SEA LIFE aquarium, and jumping in the indoor trampoline park.',
      budget: 12,
      durationMinutes: 180
    },
    transport: {
      type: 'tram',
      line: '9',
      destination: 'Scheveningen Noord',
      stopName: 'Kurhaus',
      platform: 'A',
      scheduleMinutes: [5, 15, 25, 35, 45, 55]
    }
  },
  {
    id: 'spido-cruise',
    name: 'Spido Harbour Cruise',
    city: 'Rotterdam',
    region: 'Zuid-Holland',
    category: 'waterway',
    moods: ['romantic sunset', 'peace and quiet'],
    coordinates: { lat: 51.9090, lng: 4.4842 },
    adultVersion: {
      description: 'A spectacular 75-minute cruise across Rotterdam’s modern harbor docks. Feel the immense scale of Europe\'s largest shipyard, floating past drydocks, cargo cranes, and shipyards.',
      budget: 17,
      durationMinutes: 75
    },
    childVersion: {
      description: 'An exciting boat ride! Children are handed active harbor spyglasses, can climb around the indoor play cabin, and watch massive towering ocean containers up close.',
      budget: 10,
      durationMinutes: 75
    },
    transport: {
      type: 'metro',
      line: 'D/E',
      destination: 'Slinge / De Akkers',
      stopName: 'Leuvehaven',
      platform: '2',
      scheduleMinutes: [3, 10, 18, 25, 33, 40, 48, 55]
    }
  },
  {
    id: 'dudok-cafe',
    name: 'Dudok Rotterdam Grand Cafe',
    city: 'Rotterdam',
    region: 'Zuid-Holland',
    category: 'restaurant_cafe',
    moods: ['remote work', 'peace and quiet'],
    coordinates: { lat: 51.9213, lng: 4.4829 },
    adultVersion: {
      description: 'The quintessential Rotterdam cafe. Set inside a gorgeous mid-century modern architectural hall, it serves the legendary warm Dutch apple pie in a bright, spacious, and relaxed environment.',
      budget: 8,
      durationMinutes: 60
    },
    childVersion: {
      description: 'Extremely family-welcoming! Features high-chairs, special activity placemats, and delicious Dutch baby pancakes (poffertjes) dusted in sweet icing sugar.',
      budget: 5,
      durationMinutes: 65
    },
    transport: {
      type: 'tram',
      line: '21',
      destination: 'De Esch',
      stopName: 'Beurs',
      platform: 'C',
      scheduleMinutes: [2, 12, 22, 32, 42, 52]
    }
  },
  {
    id: 'brussels-grand-place',
    name: 'Grand Place & Chocolate Tasting',
    city: 'Brussels',
    region: 'Brussels-Capital',
    category: 'historical_site',
    moods: ['peace and quiet', 'romantic sunset'],
    coordinates: { lat: 50.8468, lng: 4.3524 },
    adultVersion: {
      description: 'Walk around one of the most beautiful squares in the world, marveling at the baroque guildhalls, followed by a quiet tasting of fine Belgian pralines at a local historic chocolatier.',
      budget: 12,
      durationMinutes: 90
    },
    childVersion: {
      description: 'A magical experience of gold-leaf facades! Children love looking at the gold decorations, hunting for the nearby Tintin comic strip murals, and eating delicious warm Belgian waffles.',
      budget: 6,
      durationMinutes: 100
    },
    transport: {
      type: 'metro',
      line: '1',
      destination: 'Gare Centrale',
      stopName: 'Brussels Central Station',
      platform: '1',
      scheduleMinutes: [5, 15, 25, 35, 45, 55]
    }
  },
  {
    id: 'antwerp-central-station',
    name: 'Antwerpen-Centraal & Diamond Hall',
    city: 'Antwerp',
    region: 'Flanders',
    category: 'historical_site',
    moods: ['peace and quiet', 'remote work'],
    coordinates: { lat: 51.2172, lng: 4.4211 },
    adultVersion: {
      description: 'Widely considered one of the most beautiful railway stations in the world. Enjoy the magnificent multi-level iron and glass dome, historic clock tower, and relaxing cafes.',
      budget: 0,
      durationMinutes: 45
    },
    childVersion: {
      description: 'An exciting train cathedral! Kids love taking the glass elevators to see trains arriving on four different levels and checking out the shiny diamond showcases.',
      budget: 0,
      durationMinutes: 45
    },
    transport: {
      type: 'train',
      line: 'IC',
      destination: 'Rotterdam / Brussels',
      stopName: 'Antwerpen-Centraal',
      platform: '2',
      scheduleMinutes: [10, 30, 50]
    }
  },
  {
    id: 'paris-eiffel-seine',
    name: 'Eiffel Tower Gardens & Seine Boardwalk',
    city: 'Paris',
    region: 'Île-de-France',
    category: 'historical_site',
    moods: ['romantic sunset', 'peace and quiet'],
    coordinates: { lat: 48.8584, lng: 2.2945 },
    adultVersion: {
      description: 'Stroll along the beautifully landscaped park of Champ de Mars directly under the iconic iron spire, ending with a serene walk along the car-free boardwalks of the Seine river.',
      budget: 0,
      durationMinutes: 120
    },
    childVersion: {
      description: 'Take a beautiful vintage carousel ride right next to the Eiffel Tower, watch the sparkling lights of the monument at night, and eat tasty French crêpes with chocolate spread.',
      budget: 5,
      durationMinutes: 90
    },
    transport: {
      type: 'metro',
      line: '6',
      destination: 'Nation',
      stopName: 'Bir-Hakeim',
      platform: 'M6',
      scheduleMinutes: [3, 9, 15, 21, 27, 33, 39, 45, 51, 57]
    }
  },
  {
    id: 'berlin-brandenburg-gate',
    name: 'Brandenburg Gate & Unter den Linden',
    city: 'Berlin',
    region: 'Berlin',
    category: 'historical_site',
    moods: ['peace and quiet', 'romantic sunset'],
    coordinates: { lat: 52.5163, lng: 13.3777 },
    adultVersion: {
      description: 'The monumental neoclassical gate representing European peace and unity. Walk down the famous tree-lined boulevard Unter den Linden to the historic Reichstag with clean, wide-paved paths.',
      budget: 0,
      durationMinutes: 60
    },
    childVersion: {
      description: 'Watch street artists and horse carriages in front of the gate, and enjoy a quick treat at the famous nearby ice cream kiosks.',
      budget: 4,
      durationMinutes: 60
    },
    transport: {
      type: 'metro',
      line: 'U5',
      destination: 'Hauptbahnhof',
      stopName: 'Unter den Linden',
      platform: 'U5-1',
      scheduleMinutes: [4, 14, 24, 34, 44, 54]
    }
  },
  {
    id: 'lazienki-park',
    name: 'Royal Łazienki Palace & Peacock Gardens',
    city: 'Warsaw',
    region: 'Mazovia',
    category: 'park',
    moods: ['peace and quiet', 'romantic sunset'],
    coordinates: { lat: 52.2155, lng: 21.0345 },
    adultVersion: {
      description: 'An exceptional 18th-century royal garden. Stroll past classical Roman-style amphitheaters, floating islands, and the Palace on the Isle, with free live Chopin piano concerts near the monument.',
      budget: 0,
      durationMinutes: 120
    },
    childVersion: {
      description: 'Meet Warsaw\'s legendary friendly red squirrels who jump right next to you to eat walnuts! Watch gorgeous colorful peacocks strutting around the Royal Palace gardens.',
      budget: 2,
      durationMinutes: 120
    },
    transport: {
      type: 'bus',
      line: '116',
      destination: 'Wilanów',
      stopName: 'Łazienki Królewskie',
      platform: '01',
      scheduleMinutes: [5, 15, 25, 35, 45, 55]
    }
  },
  {
    id: 'krakow-wawel-square',
    name: 'Wawel Royal Castle & Dragon Cave',
    city: 'Kraków',
    region: 'Lesser Poland',
    category: 'historical_site',
    moods: ['peace and quiet', 'romantic sunset'],
    coordinates: { lat: 50.0540, lng: 19.9354 },
    adultVersion: {
      description: 'A magnificent fortress on the Vistula River containing centuries of Polish history. Explore the peaceful Renaissance arcaded courtyard and the beautiful cathedral garden overlooking the river.',
      budget: 7,
      durationMinutes: 150
    },
    childVersion: {
      description: 'Stand in front of the famous Wawel Dragon Statue and watch it breathe real fire every 10 minutes! Explore the mystical dragon cave tunnels.',
      budget: 3,
      durationMinutes: 120
    },
    transport: {
      type: 'tram',
      line: '8',
      destination: 'Borek Fałęcki',
      stopName: 'Wawel',
      platform: 'A',
      scheduleMinutes: [8, 18, 28, 38, 48, 58]
    }
  },
  {
    id: 'krakow-kopiec-krakusa',
    name: 'Kopiec Krakusa (Krakus Mound)',
    city: 'Kraków',
    region: 'Lesser Poland',
    category: 'historical_site',
    moods: ['romantic sunset', 'peace and quiet'],
    coordinates: { lat: 50.0380, lng: 19.9594 },
    adultVersion: {
      description: 'The ancient pre-historic Kopiec Krakusa (Krakus Mound) in Kraków, rising high above Lasota Hill. It offers the most spectacular and breathtaking panoramic bird\'s-eye view of the historic Old Town, the Royal Wawel Castle, and the Vistula river bend. Ideal for couples seeking a quiet, highly romantic sunset view.',
      budget: 0,
      durationMinutes: 60
    },
    childVersion: {
      description: 'An ancient giant grassy mound that children absolutely love to climb! The top offers an expansive view of trains passing in the valley below, and the surrounding fields are perfect for a family picnic or flying kites.',
      budget: 0,
      durationMinutes: 45
    },
    transport: {
      type: 'tram',
      line: '3 / 24',
      destination: 'Nowy Bieżanów',
      stopName: 'Cmentarz Podgórski',
      platform: 'B',
      scheduleMinutes: [5, 15, 25, 35, 45, 55]
    }
  },
  {
    id: 'puszcza-kampinoska',
    name: 'Kampinoski Park Narodowy (Puszcza Kampinoska)',
    city: 'Warsaw',
    region: 'Mazovia',
    category: 'forest',
    moods: ['peace and quiet', 'remote work'],
    coordinates: { lat: 52.3421, lng: 20.7412 },
    adultVersion: {
      description: 'Rozległy rezerwat biosfery UNESCO tuż obok stolicy. Malownicze piaszczyste wydmy śródlądowe porośnięte pachnącymi sosnami, bagna pełne rzadkich ptaków oraz setki kilometrów zacisznych leśnych duktów.',
      budget: 0,
      durationMinutes: 180
    },
    childVersion: {
      description: 'Świetna leśna przygoda! Dzieci uwielbiają szukać śladów łosia, biegać po miękkim igliwiu i odpoczywać na drewnianych polanach edukacyjnych.',
      budget: 0,
      durationMinutes: 120
    },
    transport: {
      type: 'bus',
      line: '750 / 800',
      destination: 'Palmiry / Dziekanów Leśny',
      stopName: 'Dziekanów Leśny Szpital',
      platform: '1',
      scheduleMinutes: [10, 30, 50]
    }
  },
  {
    id: 'puszcza-zielonka',
    name: 'Puszcza Zielonka & Wieża Widokowa Dziewicza Góra',
    city: 'Poznań',
    region: 'Greater Poland',
    category: 'forest',
    moods: ['peace and quiet', 'romantic sunset'],
    coordinates: { lat: 52.4845, lng: 17.0090 },
    adultVersion: {
      description: 'Jeden z najpiękniejszych kompleksów leśnych Wielkopolski. Ścieżki pośród starych dębów i sosen, 40-metrowa wieża widokowa z panoramą Poznania oraz leśne jeziora.',
      budget: 0,
      durationMinutes: 150
    },
    childVersion: {
      description: 'Wspinaczka na wysoką wieżę z lornetką, zbieranie szyszek i zabawa na leśnej polanie z placem zabaw w Dziewiczej Bazie.',
      budget: 2,
      durationMinutes: 120
    },
    transport: {
      type: 'train',
      line: 'KW / Polregio',
      destination: 'Wągrowiec',
      stopName: 'Owińska Stacja',
      platform: '1',
      scheduleMinutes: [15, 45]
    }
  },
  {
    id: 'las-wolski-krakow',
    name: 'Las Wolski & Kopiec Piłsudskiego',
    city: 'Kraków',
    region: 'Lesser Poland',
    category: 'forest',
    moods: ['peace and quiet', 'romantic sunset'],
    coordinates: { lat: 50.0570, lng: 19.8510 },
    adultVersion: {
      description: 'Potężny leśny park miejski na wzgórzach wapiennych. Znajdziesz tu klasztor Kamedułów na Bielanach, zaciszne wąwozy i najwyższy krakowski Kopiec Piłsudskiego z widokiem na Tatry w pogodny dzień.',
      budget: 0,
      durationMinutes: 150
    },
    childVersion: {
      description: 'Szerokie leśne ścieżki obok krakowskiego ZOO, bieg na szczyt wielkiego kopca i leśne lody w pobliskiej altanie.',
      budget: 0,
      durationMinutes: 120
    },
    transport: {
      type: 'bus',
      line: '134',
      destination: 'Zoo Kraków',
      stopName: 'Zoo / Las Wolski',
      platform: '1',
      scheduleMinutes: [5, 25, 45]
    }
  },
  {
    id: 'hoge-veluwe-forest',
    name: 'Nationaal Park De Hoge Veluwe & Bos',
    city: 'Utrecht',
    region: 'Gelderland',
    category: 'forest',
    moods: ['peace and quiet', 'remote work'],
    coordinates: { lat: 52.0833, lng: 5.8333 },
    adultVersion: {
      description: 'The largest contiguous forest and heathland reserve in the Low Countries. Famous for its 1,800 free white bicycles, peaceful drifting sands, and world-class Kröller-Müller sculpture garden.',
      budget: 12,
      durationMinutes: 240
    },
    childVersion: {
      description: 'Ride the free mini white bicycles through magical winding forest tunnels and explore the Museonder underground roots museum!',
      budget: 6,
      durationMinutes: 180
    },
    transport: {
      type: 'bus',
      line: '108',
      destination: 'Otterlo / Hoenderloo',
      stopName: 'Centrum Bezoekers Otterlo',
      platform: 'A',
      scheduleMinutes: [10, 40]
    }
  },
  {
    id: 'sonian-forest-brussels',
    name: 'Sonian Forest & Bois de la Cambre (Zoniënwoud)',
    city: 'Brussels',
    region: 'Brussels-Capital',
    category: 'forest',
    moods: ['peace and quiet', 'romantic sunset'],
    coordinates: { lat: 50.7933, lng: 4.4180 },
    adultVersion: {
      description: 'Ancient UNESCO-listed cathedral beech forest extending into Brussels. Features quiet reflective ponds, tranquil shaded trails, and the scenic Robinson Island cafe in the lake.',
      budget: 0,
      durationMinutes: 150
    },
    childVersion: {
      description: 'Take a fun mini ferry across the pond to Robinson Island, feed ducks along the grassy banks, and run freely under giant century-old beech trees.',
      budget: 1,
      durationMinutes: 120
    },
    transport: {
      type: 'tram',
      line: '7 / 8',
      destination: 'Vanderkindere',
      stopName: 'Legrand / Bois de la Cambre',
      platform: '1',
      scheduleMinutes: [6, 16, 26, 36, 46, 56]
    }
  },
  {
    id: 'grunewald-berlin',
    name: 'Grunewald Forest & Teufelssee',
    city: 'Berlin',
    region: 'Berlin',
    category: 'forest',
    moods: ['peace and quiet', 'romantic sunset'],
    coordinates: { lat: 52.4678, lng: 13.2389 },
    adultVersion: {
      description: 'The green lung of Berlin spanning 3,000 hectares of pine and oak woodlands. Features the historic Renaissance Jagdschloss hunting lodge, peaceful swimming lakes, and panoramic hills.',
      budget: 0,
      durationMinutes: 180
    },
    childVersion: {
      description: 'Climb the Grunewald tower for views over the Havel river, look for swans at the lake, and enjoy outdoor forest picnics.',
      budget: 3,
      durationMinutes: 120
    },
    transport: {
      type: 'train',
      line: 'S7',
      destination: 'Potsdam Hauptbahnhof',
      stopName: 'S-Bahnhof Grunewald',
      platform: '2',
      scheduleMinutes: [4, 14, 24, 34, 44, 54]
    }
  },
  {
    id: 'muzeum-powstania-warszawskiego',
    name: 'Muzeum Powstania Warszawskiego',
    city: 'Warsaw',
    region: 'Mazovia',
    category: 'museum',
    moods: ['peace and quiet', 'remote work'],
    coordinates: { lat: 52.2323, lng: 20.9806 },
    adultVersion: {
      description: 'Jedno z najbardziej poruszających i nowocześnie zaprojektowanych muzeów w Europie. Multimedialna ekspozycja, autentyczny samolot Liberator i wieża widokowa z widokiem na Warszawę.',
      budget: 7,
      durationMinutes: 120
    },
    childVersion: {
      description: 'Sala Małego Powstańca z bezpiecznymi historycznymi replikami, stemple z powstańczej poczty i edukacyjny film 3D.',
      budget: 4,
      durationMinutes: 90
    },
    transport: {
      type: 'metro',
      line: 'M2',
      destination: 'Rondo Daszyńskiego',
      stopName: 'Rondo Daszyńskiego',
      platform: '1',
      scheduleMinutes: [3, 7, 11, 15, 19, 23]
    }
  },
  {
    id: 'zamek-krolewski-warszawa',
    name: 'Zamek Królewski & Ogrody Zamkowe',
    city: 'Warsaw',
    region: 'Mazovia',
    category: 'historical_site',
    moods: ['peace and quiet', 'romantic sunset'],
    coordinates: { lat: 52.2478, lng: 21.0145 },
    adultVersion: {
      description: 'Wspaniała barokowo-klasycystyczna rezydencja królów Polski z arcydziełami Rembrandta, Salą Senatorską oraz dwupoziomowymi tarasami ogrodowymi schodzącymi ku Wiśle.',
      budget: 11,
      durationMinutes: 120
    },
    childVersion: {
      description: 'Szukanie złotych koron i orłów na królewskich tronach, przestronne ogrody zamkowe z fontannami i widok na rzekę.',
      budget: 5,
      durationMinutes: 90
    },
    transport: {
      type: 'tram',
      line: '4 / 13 / 20 / 26',
      destination: 'Stare Miasto',
      stopName: 'Stare Miasto',
      platform: 'A',
      scheduleMinutes: [2, 8, 14, 20, 26, 32, 38, 44]
    }
  },
  {
    id: 'plaza-sopot-molo',
    name: 'Plaża w Sopocie & Drewniane Molo',
    city: 'Gdańsk',
    region: 'Pomerania',
    category: 'beach',
    moods: ['romantic sunset', 'peace and quiet'],
    coordinates: { lat: 54.4470, lng: 18.5700 },
    adultVersion: {
      description: 'Najdłuższe drewniane molo w Europie (ponad 511 metrów) wychodzące w głąb Zatoki Gdańskiej. Czyste jodowe powietrze, widok na Grand Hotel i piaszczysta szeroka plaża.',
      budget: 2,
      durationMinutes: 90
    },
    childVersion: {
      description: 'Zbieranie bursztynów i muszelek na plaży, karmienie łabędzi i pyszne gofry z bitą śmietaną przy molo!',
      budget: 2,
      durationMinutes: 90
    },
    transport: {
      type: 'train',
      line: 'SKM',
      destination: 'Gdynia / Wejherowo',
      stopName: 'Sopot Główny',
      platform: '1',
      scheduleMinutes: [5, 15, 25, 35, 45, 55]
    }
  }
];

export const SEEDED_CYCLING_ROUTES: CyclingRoute[] = [
  {
    id: 'lesna-puszcza-zielonka',
    title: 'Szlak Cysterski & Bory Puszczy Zielonka',
    city: 'Poznań / Murowana Goślina',
    country: 'Poland',
    category: 'lesna',
    distanceKm: 28.4,
    estimatedDuration: '2h 15m',
    difficulty: 'easy',
    startPoint: 'Dworzec Letni Poznań Główny (lub Murowana Goślina)',
    endPoint: 'Owińska & Dziewicza Góra (Wieża Widokowa)',
    destinationName: 'Dziewicza Góra & Bory Puszczy Zielonka',
    destinationImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    startCoords: { lat: 52.4064, lng: 16.9252 },
    destinationCoords: { lat: 52.4845, lng: 17.0090 },
    elevationGainMeters: 95,
    description: 'Niezwykła trasa w 90% prowadząca zacienionymi, pachnącymi żywicą traktami leśnymi Puszczy Zielonka. Bezpieczna, bez samochodów, z łagodnym podjazdem pod Dziewiczą Górę i panoramą Wielkopolski.',
    highlights: ['Wieża widokowa na Dziewiczej Górze (40 m)', 'Zabytkowy pocysterski klasztor w Owińskich', 'Krystaliczne Jezioro Kamińsko z pomostami', 'Leśna oaza ciszy, śpiew ptaków i zapach sosen'],
    surface: '85% ubity dukt leśny, 15% gładki asfalt',
    recommendedBike: 'Trekking / Gravel / MTB / E-bike',
    authorName: 'Nadleśnictwo & Przewodnik Tadzik',
    rating: 4.9,
    reviewsCount: 38,
    smartInsights: {
      shadePercent: 90,
      restBenches: 'Zadaszone wiaty i ławki co 2-3 km',
      waterPoints: 'Źródełko w Owińskich i kawiarnia leśna Dziewicza Baza',
      eBikeCharging: true,
      safetyLevel: '100% drogi leśne wyłączone z ruchu aut',
      crowdLevel: 'low',
      elevationMeters: 95,
      recommendedFor: 'Miłośnicy natury, seniorzy, ucieczka przed upałem',
      bikeServiceStations: 'Stacja naprawcza z pompką przy parkingu pod Dziewiczą Górą',
      recommendedTirePressure: '2.8 – 3.5 bar (Gravel/Trekking)',
      windExposure: 'W całości osłonięta lasem iglastym – znikomy opór wiatru',
      bestSeason: 'Kwiecień – Październik'
    },
    pitStops: [
      { name: 'Dworzec Letni Poznań', type: 'service', desc: 'Punkt zbiórki i stojaki rowerowe', kmMark: 0 },
      { name: 'Jezioro Kamińsko', type: 'picnic', desc: 'Pomosty i zadaszona wiata z widokiem na wodę', kmMark: 14.5 },
      { name: 'Klasztor Pocysterski Owińska', type: 'monument', desc: 'Park orientacji przestrzennej i zabytkowe ogrody', kmMark: 22.0 },
      { name: 'Dziewicza Baza Pod Wieżą', type: 'cafe', desc: 'Kawiarnia z domowym ciastem, kawa i ładowarka e-bike', kmMark: 28.4 }
    ]
  },
  {
    id: 'lesna-kampinos-puszcza',
    title: 'Główny Szlak Kampinoski do Palmir',
    city: 'Warszawa / Łomianki',
    country: 'Poland',
    category: 'lesna',
    distanceKm: 22.0,
    estimatedDuration: '1h 50m',
    difficulty: 'easy',
    startPoint: 'Warszawa Młociny (Węzeł Metro)',
    endPoint: 'Dziekanów Leśny & Muzeum Palmiry',
    destinationName: 'Polana Palmiry & Kampinoski Park Narodowy',
    destinationImageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
    startCoords: { lat: 52.2900, lng: 20.9300 },
    destinationCoords: { lat: 52.3421, lng: 20.7412 },
    elevationGainMeters: 45,
    description: 'Urokliwa leśna wstęga Kampinoskiego Parku Narodowego. Świeże sosnowe powietrze, wydmy śródlądowe porośnięte wrzosem oraz pełne wyciszenie tuż za granicami stolicy.',
    highlights: ['Rezerwat przyrody Sieraków', 'Dęby Królewskie i wiekowe sosny', 'Miejsce pamięci Palmiry', 'Leśna polana rekreacyjna w Lipkowie'],
    surface: '75% leśny dukt utwardzony, 25% asfaltowa ścieżka rowerowa',
    recommendedBike: 'Trekking / Gravel / MTB',
    authorName: 'Warszawski Klub Cyklistów',
    rating: 4.8,
    reviewsCount: 29,
    smartInsights: {
      shadePercent: 85,
      restBenches: 'Ławki i stoły piknikowe na węzłach szlaków',
      waterPoints: 'Punkt czerpania wody w Dziekanowie i bistro Młociny',
      eBikeCharging: false,
      safetyLevel: '100% bezpieczne alejki parkowe bez samochodów',
      crowdLevel: 'medium',
      elevationMeters: 45,
      recommendedFor: 'Rodziny, seniorzy, wycieczki relaksacyjne',
      bikeServiceStations: 'Stojak z narzędziami przy polanie w Dziekanowie',
      recommendedTirePressure: '2.5 – 3.2 bar (leśny piasek/szuter)',
      windExposure: 'Osłona drzewna przed wiatrem z zachodu',
      bestSeason: 'Maj – Październik'
    },
    pitStops: [
      { name: 'Węzeł Młociny Metro', type: 'service', desc: 'Punkt startowy z łatwym dojazdem metrem', kmMark: 0 },
      { name: 'Dęby Królewskie Sieraków', type: 'monument', desc: 'Pomnik przyrody i ławeczki wśród wrzosów', kmMark: 9.0 },
      { name: 'Palmiry Muzeum Pamięci', type: 'viewpoint', desc: 'Nowoczesny pawilon pamięci i zadaszone wiaty', kmMark: 22.0 }
    ]
  },
  {
    id: 'polna-kinderdijk-zulawy',
    title: 'Szlak Wiatraków i Polderów Alblasserwaard',
    city: 'Rotterdam / Kinderdijk',
    country: 'Netherlands',
    category: 'polna',
    distanceKm: 24.5,
    estimatedDuration: '1h 45m',
    difficulty: 'easy',
    startPoint: 'Rotterdam Erasmusbrug (Przystań Waterbus)',
    endPoint: 'Wiatraki UNESCO Kinderdijk & Poldery Groot-Ammers',
    destinationName: '19 Zabytkowych Wiatraków UNESCO w Kinderdijk',
    destinationImageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80',
    startCoords: { lat: 51.9170, lng: 4.4840 },
    destinationCoords: { lat: 51.8890, lng: 4.6380 },
    elevationGainMeters: 0,
    description: 'Klasyczna, bezkresna trasa polna i groblowa wśród tradycyjnych holenderskich polderów, kanałów melioracyjnych, wypasających się krów i 19 zabytkowych wiatraków z XVIII wieku.',
    highlights: ['19 wiatraków UNESCO w Kinderdijk', 'Wiejskie serowarnie z degustacją sera Gouda', 'Przeprawa tramwajem wodnym Waterbus z rowerem', 'Szerokie horyzonty i kwitnące łąki'],
    surface: '95% gładki asfalt polderowy, 5% ubita grobla trawiasto-szutrowa',
    recommendedBike: 'Rower Miejski / E-bike / Trekking',
    authorName: 'Holenderski Związek Rowerowy Fietsersbond',
    rating: 5.0,
    reviewsCount: 64,
    smartInsights: {
      shadePercent: 15,
      restBenches: 'Ławki widokowe nad każdym kanałem',
      waterPoints: 'Kawiarnie wiatrakowe, toalety automatyczne na trasie',
      eBikeCharging: true,
      safetyLevel: 'Wydzielone drogi polderowe bez tranzytu samochodowego',
      crowdLevel: 'medium',
      elevationMeters: 0,
      recommendedFor: 'Fotografowie, seniorzy, miłośnicy sielskich widoków',
      bikeServiceStations: 'Automatyczne stacje pompujące przy wjeździe do Kinderdijk',
      recommendedTirePressure: '4.0 – 5.0 bar (gładki asfalt)',
      windExposure: 'Otwarta przestrzeń polderowa – możliwy wiatr boczny',
      bestSeason: 'Kwiecień – Wrzesień'
    },
    pitStops: [
      { name: 'Przystań Erasmusbrug', type: 'service', desc: 'Wjazd na pokład Waterbusa linii 21', kmMark: 0 },
      { name: 'Wiatraki Kinderdijk', type: 'monument', desc: 'Centrum obsługi gości i punkt z darmową wodą', kmMark: 16.0 },
      { name: 'Wiejska Serowarnia Groot-Ammers', type: 'cafe', desc: 'Degustacja tradycyjnego sera i świeży sok jabłkowy', kmMark: 24.5 }
    ]
  },
  {
    id: 'polna-wielkopolska-wies',
    title: 'Sielski Szlak Wśród Zbóż i Wiatraków Koźlaków',
    city: 'Leszno / Osieczna',
    country: 'Poland',
    category: 'polna',
    distanceKm: 19.0,
    estimatedDuration: '1h 30m',
    difficulty: 'easy',
    startPoint: 'Rynek w Osiecznej (Przystań Jezioro Łoniewskie)',
    endPoint: 'Trzy Drewniane Wiatraki Koźlaki & Kąkolewo',
    destinationName: 'Trzy Drewniane Wiatraki Koźlaki w Osiecznej',
    destinationImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    startCoords: { lat: 51.9050, lng: 16.6790 },
    destinationCoords: { lat: 51.9080, lng: 16.6820 },
    elevationGainMeters: 30,
    description: 'Cicha, wiejska trasa biegnąca pośród szumiących łanów zbóż, makowych łąk i urokliwych zagród. Na trasie zachowane drewniane wiatraki i lokalne stoiska ze świeżym miodem.',
    highlights: ['Trzy zabytkowe wiatraki koźlaki w Osiecznej', 'Jezioro Łoniewskie z pomostami i plażą', 'Słonecznikowe pola i sady owocowe', 'Wiejska pasieka z degustacją miodu wielokwiatowego'],
    surface: '60% ubita droga polna, 40% spokojna szosa asfaltowa',
    recommendedBike: 'Gravel / Trekking / E-bike',
    authorName: 'Towarzystwo Ziemi Leszczyńskiej',
    rating: 4.7,
    reviewsCount: 19,
    smartInsights: {
      shadePercent: 25,
      restBenches: 'Wiaty drewniane przy wiatrakach i nad jeziorem',
      waterPoints: 'Sklep wiejski i kawiarnia Przystań Osieczna',
      eBikeCharging: true,
      safetyLevel: 'Znikomy ruch lokalny, spokojne drogi polne',
      crowdLevel: 'low',
      elevationMeters: 30,
      recommendedFor: 'Poszukiwacze sielskiej wsi i wiejskiego spokoju',
      bikeServiceStations: 'Zestaw kluczy i pompka w Przystani Osieczna',
      recommendedTirePressure: '3.0 – 3.8 bar',
      windExposure: 'Otwarte łąki, łagodny wiatr letni',
      bestSeason: 'Czerwiec – Wrzesień (okres kwitnienia zbóż)'
    },
    pitStops: [
      { name: 'Plaża Osieczna', type: 'picnic', desc: 'Pomost rekreacyjny i wypożyczalnia kajaków', kmMark: 0 },
      { name: 'Pasieka Miodowa Kąkolewo', type: 'cafe', desc: 'Kawa z miodem lipowym i domowe ciasto drożdżowe', kmMark: 11.2 },
      { name: 'Wzgórze Trzech Wiatraków', type: 'monument', desc: 'Trzy zabytkowe koźlaki z XVIII w. z widokiem na panoramę jeziora', kmMark: 19.0 }
    ]
  },
  {
    id: 'terenowa-jura-krakowska',
    title: 'Szlak Orlich Gniazd & Wapiennych Ostańców (MTB / Gravel)',
    city: 'Kraków / Ojców',
    country: 'Poland',
    category: 'terenowa',
    distanceKm: 34.0,
    estimatedDuration: '2h 45m',
    difficulty: 'moderate',
    startPoint: 'Kraków Bronowice (Węzeł Rowerowy)',
    endPoint: 'Dolina Prądnika & Zamek Pieskowa Skała',
    destinationName: 'Zamek Pieskowa Skała & Dolina Prądnika',
    destinationImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    startCoords: { lat: 50.0830, lng: 19.8950 },
    destinationCoords: { lat: 50.2440, lng: 19.7800 },
    elevationGainMeters: 280,
    description: 'Ekscytująca trasa terenowa po jurajskich wąwozach, szutrowych duktach i skalnych przesmykach. Wspaniałe wapienne iglice, jaskinie oraz średniowieczne zamki obronne.',
    highlights: ['Zamek w Ojcowie i Pieskowej Skale', 'Maczuga Herkulesa i Brama Krakowska', 'Szutrowe serpentyny Doliny Prądnika', 'Pstrąg Ojcowski wędzony na bukowych zrębkach'],
    surface: '60% ubity szuter/kamień, 25% leśna ścieżka, 15% asfalt',
    recommendedBike: 'MTB (Górski) / Gravel / Mocny E-bike',
    authorName: 'Klub Jurajskich Górali',
    rating: 4.9,
    reviewsCount: 42,
    smartInsights: {
      shadePercent: 70,
      restBenches: 'Wiaty turystyczne w dolinach rzecznych',
      waterPoints: 'Źródło Miłości, restauracje w Ojcowie',
      eBikeCharging: true,
      safetyLevel: 'Szlaki turystyczne bez samochodów, wymagane dobre hamulce',
      crowdLevel: 'medium',
      elevationMeters: 280,
      recommendedFor: 'Aktywni rowerzyści, fani gravela i MTB, miłośnicy skałek',
      bikeServiceStations: 'Punkt serwisowy z kompresorem w centrum Ojcowa',
      recommendedTirePressure: '2.0 – 2.8 bar (opony o szerokim profilu na kamienie)',
      windExposure: 'Wąwozy wapienne chronią w 100% przed wiatrem',
      bestSeason: 'Kwiecień – Październik'
    },
    pitStops: [
      { name: 'Kraków Bronowice', type: 'service', desc: 'Węzeł rowerowy i start w stronę dolinek jurajskich', kmMark: 0 },
      { name: 'Brama Krakowska & Źródło Miłości', type: 'viewpoint', desc: 'Wapienne wrota skalne i czyste źródło', kmMark: 18.0 },
      { name: 'Trawiasta Polana pod Maczugą Herkulesa', type: 'picnic', desc: 'Słynna 30-metrowa maczuga skalna', kmMark: 30.5 },
      { name: 'Zamek Pieskowa Skała', type: 'monument', desc: 'Dziedziniec arkadowy, restauracja i widok na dolinę', kmMark: 34.0 }
    ]
  },
  {
    id: 'terenowa-veluwe-gravel',
    title: 'Szlak Wydm i Wrzosowisk Hoge Veluwe Gravel Trail',
    city: 'Arnhem / Otterlo',
    country: 'Netherlands',
    category: 'terenowa',
    distanceKm: 31.0,
    estimatedDuration: '2h 15m',
    difficulty: 'moderate',
    startPoint: 'Wejście Otterlo Park Narodowy Hoge Veluwe',
    endPoint: 'Muzeum Kröller-Müller & Wydma De Hoge Veluwe',
    destinationName: 'Wydmy i Wrzosowiska Parku Narodowego De Hoge Veluwe',
    destinationImageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    startCoords: { lat: 52.1020, lng: 5.7760 },
    destinationCoords: { lat: 52.0980, lng: 5.8240 },
    elevationGainMeters: 65,
    description: 'Wyjątkowa trasa po unikalnych ruchomych wydmach piaskowych, wrzosowiskach i leśnych bezdrożach środkowej Holandii. Wyśmienita nawierzchnia szutrowo-piaskowa dedykowana rowerom gravel i trekkingowym.',
    highlights: ['Ogród rzeźb i Muzeum Kröller-Müller', 'Piaszczyste wydmy De Hoge Veluwe', 'Stada dzikich jeleni i muflonów', 'Pawilon myśliwski Jachthuis Sint Hubertus'],
    surface: '70% utwardzony czerwony szuter, 20% piasek ubity, 10% asfalt',
    recommendedBike: 'Gravel / MTB / Trekking',
    authorName: 'Park Narodowy Hoge Veluwe',
    rating: 4.9,
    reviewsCount: 51,
    smartInsights: {
      shadePercent: 50,
      restBenches: 'Nowoczesne ławki widokowe na wrzosowiskach',
      waterPoints: 'Bezpłatne stacje wody pitnej i restauracje parkowe',
      eBikeCharging: true,
      safetyLevel: 'Całkowicie zamknięty park dla ruchu samochodowego',
      crowdLevel: 'medium',
      elevationMeters: 65,
      recommendedFor: 'Fani graveli, miłośnicy sztuki i dzikich zwierząt',
      bikeServiceStations: 'Wypożyczalnie i warsztaty "Białe Rowery" na każdym wejściu',
      recommendedTirePressure: '2.5 – 3.2 bar',
      windExposure: 'Wrzosowiska przewiewne, lasy zaciszne',
      bestSeason: 'Sierpień – Wrzesień (okres kwitnienia wrzosów)'
    },
    pitStops: [
      { name: 'Brama Otterlo', type: 'service', desc: 'Punkt informacyjny i darmowa mapa tras szutrowych', kmMark: 0 },
      { name: 'Kröller-Müller Museum Garden', type: 'monument', desc: 'Ogród rzeźb i kawiarnia artystyczna', kmMark: 14.0 },
      { name: 'Pustynia De Hoge Veluwe', type: 'viewpoint', desc: 'Ruchome wydmy śródlądowe i panoramiczne ławeczki', kmMark: 31.0 }
    ]
  },
  {
    id: 'turystyczna-nadmorska-trojmiasto',
    title: 'Nadmorska Promenada Gdańsk Brzeźno – Sopot – Gdynia Orłowo',
    city: 'Gdańsk / Sopot / Gdynia',
    country: 'Poland',
    category: 'turystyczna',
    distanceKm: 18.5,
    estimatedDuration: '1h 30m',
    difficulty: 'easy',
    startPoint: 'Molo Gdańsk Brzeźno (Park Reagana)',
    endPoint: 'Klif i Molo w Gdyni Orłowie',
    destinationName: 'Malowniczy Klif & Molo w Gdyni Orłowie',
    destinationImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    startCoords: { lat: 54.4170, lng: 18.6330 },
    destinationCoords: { lat: 54.4830, lng: 18.5630 },
    elevationGainMeters: 15,
    description: 'Najpiękniejszy i najbardziej komfortowy szlak rowerowy nad Bałtykiem. W całości płaski, z widokiem na Zatokę Gdańską, zapachem jodu i dziesiątkami kawiarni tuż przy plaży.',
    highlights: ['Molo w Sopocie i widok na Grand Hotel', 'Zjawiskowy Klif Orłowski', 'Park Nadmorski im. Ronalda Reagana', 'Świeża smażona ryba w tawernach rybackich'],
    surface: '100% gładka kostka bezfazowa i czerwony asfalt rowerowy',
    recommendedBike: 'Rower Miejski / E-bike / Trekking / Szosowy',
    authorName: 'Rowerowe Trójmiasto',
    rating: 5.0,
    reviewsCount: 88,
    smartInsights: {
      shadePercent: 40,
      restBenches: 'Ławki co 100 metrów z bezpośrednim widokiem na morze',
      waterPoints: 'Liczne zdroje wody miejskiej, toalety i lodziarnie',
      eBikeCharging: true,
      safetyLevel: '100% wydzielona dwukierunkowa autostrada rowerowa',
      crowdLevel: 'high',
      elevationMeters: 15,
      recommendedFor: 'Seniorzy, pary, rodziny z dziećmi, wycieczki rekreacyjne',
      bikeServiceStations: 'Stacje serwisowe IBOMBO co 3-4 km przy wejściach na plażę',
      recommendedTirePressure: '4.5 – 6.0 bar (gładki nadmorski asfalt)',
      windExposure: 'Nadmorska bryza morska – orzeźwiający chłód w upalne dni',
      bestSeason: 'Całoroczna (najpiękniejsza Maj – Wrzesień)'
    },
    pitStops: [
      { name: 'Molo Gdańsk Brzeźno', type: 'viewpoint', desc: 'Początek wydzielonej drogi rowerowej wzdłuż plaży', kmMark: 0 },
      { name: 'Molo w Sopocie', type: 'cafe', desc: 'Kawiarnie na promenadzie, gofry ze świeżymi owocami i lody', kmMark: 9.5 },
      { name: 'Tawerna Rybacka Orłowo', type: 'picnic', desc: 'Tradycyjna smażalnia ryb prosto z kutra rybackiego', kmMark: 16.0 },
      { name: 'Drewniane Molo & Klif Orłowski', type: 'monument', desc: 'Zwieńczenie trasy z widokiem na klif wchodzący w morze', kmMark: 18.5 }
    ]
  },
  {
    id: 'turystyczna-amsterdam-waterland',
    title: 'Malowniczy Szlak Grobli Waterland & Durgerdam',
    city: 'Amsterdam',
    country: 'Netherlands',
    category: 'turystyczna',
    distanceKm: 16.0,
    estimatedDuration: '1h 20m',
    difficulty: 'easy',
    startPoint: 'Amsterdam Centraal (Darmowy prom IJ)',
    endPoint: 'Durgerdam & Ransdorp (Wieża kościelna)',
    destinationName: 'Zabytkowa Wioska Rybacka Durgerdam nad Jeziorem IJmeer',
    destinationImageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=80',
    startCoords: { lat: 52.3790, lng: 4.9000 },
    destinationCoords: { lat: 52.3780, lng: 4.9920 },
    elevationGainMeters: 0,
    description: 'Darmowa przeprawa promowa przez rzekę IJ prosto na zabytkowe groble z drewnianymi domkami rybackimi, zielonymi łąkami i widokiem na żaglówki na jeziorze IJmeer.',
    highlights: ['Darmowy rejs promem Amsterdam Centraal', 'Zabytkowe drewniane domy w Durgerdam', 'Płaska grobla ze stałym widokiem na wodę', 'Tradycyjna kawiarnia herbaciana w Ransdorp'],
    surface: '100% gładki asfalt rowerowy',
    recommendedBike: 'Rower Miejski / E-bike / Trekking',
    authorName: 'Amsterdam Cycling Guild',
    rating: 4.8,
    reviewsCount: 56,
    smartInsights: {
      shadePercent: 20,
      restBenches: 'Ławki na szczycie grobli z widokiem na żaglówki',
      waterPoints: 'Kawiarnie w Durgerdam, punkty z wodą pitną',
      eBikeCharging: true,
      safetyLevel: 'Strefa uspokojonego ruchu z pierwszeństwem rowerów',
      crowdLevel: 'medium',
      elevationMeters: 0,
      recommendedFor: 'Seniorzy, wycieczki fotograficzne, turyści',
      bikeServiceStations: 'Automatyczne stacje naprawcze przy przystani promowej',
      recommendedTirePressure: '4.0 – 5.0 bar',
      windExposure: 'Wiatr znad jeziora IJmeer – czyste powietrze',
      bestSeason: 'Kwiecień – Październik'
    },
    pitStops: [
      { name: 'Prom IJ Buiksloterweg', type: 'service', desc: 'Darmowa 3-minutowa przeprawa przez rzekę IJ', kmMark: 0 },
      { name: 'Durgerdam Haven', type: 'viewpoint', desc: 'Zabytkowa marina z widokiem na żaglówki', kmMark: 9.0 },
      { name: 'De Zwaan Ransdorp', type: 'cafe', desc: 'Herbaciarnia w cieniu kościelnej wieży z tartą jabłkową', kmMark: 16.0 }
    ]
  },
  {
    id: 'dlugodystansowa-zelazny-szlak',
    title: 'Żelazny Szlak Rowerowy (Polska – Czechy Pętla)',
    city: 'Jastrzębie-Zdrój / Karwina',
    country: 'Poland',
    category: 'dlugodystansowa',
    distanceKm: 55.0,
    estimatedDuration: '3h 45m',
    difficulty: 'moderate',
    startPoint: 'Jastrzębie-Zdrój (Dawny Dworzec Kolejowy)',
    endPoint: 'Pętla transgraniczna: Karwina (Czechy) – Zebrzydowice – Godów',
    destinationName: 'Zamek Frysztat w Karwinie & Żelazny Szlak Transgraniczny',
    destinationImageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    startCoords: { lat: 49.9520, lng: 18.5780 },
    destinationCoords: { lat: 49.8540, lng: 18.5420 },
    elevationGainMeters: 140,
    description: 'Wybitna międzynarodowa pętla długodystansowa poprowadzona po dawnych nasypach kolejowych. Minimalne nachylenia, doskonała infrastruktura, punkty serwisowe ze stacjami napraw.',
    highlights: ['Transgraniczna pętla Polska - Czechy', 'Zabytkowy pałac we Frysztacie (Karwina)', 'Stacje kolejowe zaadaptowane na miejsca wypoczynku', 'Czeskie knedliki i kofola na trasie'],
    surface: '92% gładki asfalt, 8% drobny szuter',
    recommendedBike: 'Trekking / Gravel / Szosowy / E-bike',
    authorName: 'Euroregion Śląsk Cieszyński',
    rating: 4.9,
    reviewsCount: 72,
    smartInsights: {
      shadePercent: 60,
      restBenches: 'Nowoczesne zadaszone MOR-y (Miejsca Obsługi Rowerzystów) co 5 km',
      waterPoints: 'Punkty z wodą, restauracje i stacje ładowania e-bike na MOR-ach',
      eBikeCharging: true,
      safetyLevel: '95% bezkolizyjna dawna linia kolejowa',
      crowdLevel: 'medium',
      elevationMeters: 140,
      recommendedFor: 'Wyprawy całodniowe, seniorzy na e-bike, sakwiarze',
      bikeServiceStations: 'Kompleksowe punkty MOR z pompkami, stojakami i ładowarkami e-bike co 7 km',
      recommendedTirePressure: '4.0 – 5.5 bar',
      windExposure: 'Częściowo osłonięta nasypami kolejowymi i drzewami',
      bestSeason: 'Maj – Październik'
    },
    pitStops: [
      { name: 'Stacja Jastrzębie Zdrój', type: 'service', desc: 'Centrum obsługi rowerzystów i duży parking', kmMark: 0 },
      { name: 'Rynek i Pałac Frysztat (Czechy)', type: 'monument', desc: 'Zabytkowy rynek z czeską kawiarnią i ogrodem zamkowym', kmMark: 24.0 },
      { name: 'MOR Zebrzydowice Zamek', type: 'picnic', desc: 'Staw Młyński, zadaszone altany i stacja serwisowa', kmMark: 38.0 },
      { name: 'Godów Dawny Przystanek PKP', type: 'cafe', desc: 'Lokalne bistro z napojami izotonicznymi i kawą', kmMark: 48.0 }
    ]
  },
  {
    id: 'dlugodystansowa-r10-baltyk',
    title: 'Velo Baltica (EuroVelo 10): Ustka – Słowiński PN – Łeba',
    city: 'Ustka / Łeba',
    country: 'Poland',
    category: 'dlugodystansowa',
    distanceKm: 68.0,
    estimatedDuration: '4h 30m',
    difficulty: 'moderate',
    startPoint: 'Promenada i Latarnia Morska w Ustce',
    endPoint: 'Ruchome Wydmy w Łebie (Słowiński Park Narodowy)',
    destinationName: 'Pustynia Wydmowa Łącka Góra & Słowiński Park Narodowy',
    destinationImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    startCoords: { lat: 54.5800, lng: 16.8610 },
    destinationCoords: { lat: 54.7560, lng: 17.5540 },
    elevationGainMeters: 110,
    description: 'Królewska trasa bikepackingowa wzdłuż polskiego wybrzeża. Jezioro Gardno, Jezioro Łebsko, kładki widokowe, lasy sosnowe oraz pustynne ruchome wydmy w Słowińskim Parku Narodowym.',
    highlights: ['Ruchome wydmy w Łebie (Łącka Góra)', 'Wieże widokowe nad Jeziorem Gardno', 'Kraina w Kratę w Swołowie', 'Latarnie morskie w Ustce i Czołpinie'],
    surface: '80% asfalt i płyty kompozytowe na kładkach, 20% utwardzona droga leśna',
    recommendedBike: 'Trekking / Gravel / E-bike',
    authorName: 'Velo Baltica Pomorze Zachodnie & Pomorskie',
    rating: 4.9,
    reviewsCount: 95,
    smartInsights: {
      shadePercent: 65,
      restBenches: 'Miejsca Obsługi Rowerzystów z wiatami, toaletami i stojakami',
      waterPoints: 'Sklepy i punkty gastronomiczne w każdej nadmorskiej wsi',
      eBikeCharging: true,
      safetyLevel: 'Oznakowany europejski korytarz EuroVelo z dala od dróg głównych',
      crowdLevel: 'medium',
      elevationMeters: 110,
      recommendedFor: 'Miłośnicy długich dystansów, bikepackingu i polskiego morza',
      bikeServiceStations: 'MOR Velo Baltica z kompletem narzędzi i kompresorem',
      recommendedTirePressure: '3.2 – 4.5 bar (asfalt + deski + leśny szuter)',
      windExposure: 'Wiatr zachodni w plecy (w kierunku Łeby) – idealna aerodynamika',
      bestSeason: 'Czerwiec – Wrzesień'
    },
    pitStops: [
      { name: 'Latarnia Morska Ustka', type: 'monument', desc: 'Początek trasy z widokiem na otwarte morze', kmMark: 0 },
      { name: 'Wieża Widokowa Rowokół / Gardno', type: 'viewpoint', desc: 'Panorama jeziora i Bałtyku', kmMark: 28.0 },
      { name: 'Czołpino Muzeum Latarnictwa', type: 'service', desc: 'MOR z toaletami, wodą i ładowarkami e-bike', kmMark: 45.0 },
      { name: 'Wydma Łącka Góra Łeba', type: 'monument', desc: 'Ruchome piaski zwane Polską Saharą i parking rowerowy pod wydmą', kmMark: 68.0 }
    ]
  }
];

export const SEEDED_CHALLENGES: ChallengeEntry[] = [
  {
    id: 'challenge-rotterdam',
    cityName: 'Rotterdam',
    hiddenSpotName: 'The Cube House Rooftop Gap',
    clue: 'Look straight up between the yellow tiled cubes near Blaak Station where the geometry creates a perfect yellow star against the sky.',
    active: true,
    participantPhotos: [
      {
        username: 'PietTravels',
        photoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80',
        hearts: 48,
        comments: ['Stunning perspective!', 'Took me 20 minutes to find the right angle!']
      },
      {
        username: 'AnnaExploring',
        photoUrl: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=500&auto=format&fit=crop&q=80',
        hearts: 32,
        comments: ['Perfect blue sky in this photo.']
      }
    ]
  },
  {
    id: 'challenge-amsterdam',
    cityName: 'Amsterdam',
    hiddenSpotName: 'The Secret Begijnhof Courtyard Door',
    clue: 'Behind a heavy wooden door near Spui lies a peaceful 14th-century sanctuary where Amsterdam\'s noisy streets completely vanish into silence.',
    active: true,
    participantPhotos: [
      {
        username: 'JanK',
        photoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80',
        hearts: 54,
        comments: ['So quiet here, like stepping back in time.', 'A true hidden oasis.']
      }
    ]
  },
  {
    id: 'challenge-warsaw',
    cityName: 'Warsaw',
    hiddenSpotName: 'The Syrenka River Steps Glow',
    clue: 'Near the Vistula River steps, find the bronze Warsaw Mermaid statue. During sunset, the sky reflects a golden path on her raised shield.',
    active: true,
    participantPhotos: [
      {
        username: 'JanekPl',
        photoUrl: 'https://images.unsplash.com/photo-1573155993874-d5d48af862ba?w=500&auto=format&fit=crop&q=80',
        hearts: 39,
        comments: ['So beautiful at sunset!', 'Golden hour magic!']
      }
    ]
  }
];

export const REGIONS_STAMPS_DATA = [
  { region: 'Zuid-Holland', city: 'Rotterdam', icon: '⚓', description: 'Port of Europe, futuristic architecture, and deep maritime heritage.' },
  { region: 'Noord-Holland', city: 'Amsterdam', icon: '🛶', description: 'Canals, vibrant history, Rembrandt masterpieces, and green forest lanes.' },
  { region: 'Utrecht', city: 'Utrecht', icon: '🔔', description: 'Charming historic wharves, the Dom tower, and tranquil monastic gardens.' },
  { region: 'Brussels-Capital', city: 'Brussels', icon: '🍫', description: 'Magnificent guildhalls, tasty chocolates, and the heart of the European Union.' },
  { region: 'Flanders', city: 'Antwerp', icon: '💎', description: 'Historic railway cathedral, diamond quarter, and vibrant Belgian design.' },
  { region: 'Île-de-France', city: 'Paris', icon: '🗼', description: 'The City of Light, romantic Seine boardwalks, and legendary monuments.' },
  { region: 'Berlin', city: 'Berlin', icon: '🐻', description: 'A symbol of unity, rich historical architecture, and peaceful city paths.' },
  { region: 'Mazovia', city: 'Warsaw', icon: '🏰', description: 'Historic palaces, friendly squirrels, and beautiful classical Chopin concerts.' },
  { region: 'Lesser Poland', city: 'Kraków', icon: '🐉', description: 'Ancient Royal Wawel castle, breathing dragons, and historical Polish culture.' }
];
