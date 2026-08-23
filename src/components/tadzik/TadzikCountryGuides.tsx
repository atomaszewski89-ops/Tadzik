import React, { useState } from 'react';
import { Language } from '../../types';
import { CountryAIAdvisor } from '../CountryAIAdvisor';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  Train, 
  Bus, 
  Info, 
  Coffee, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface TadzikCountryGuidesProps {
  language: Language;
  selectedCountry: 'nl' | 'be' | 'pl_guide' | 'de_guide' | 'fr_guide';
  onSelectCountry: (country: 'nl' | 'be' | 'pl_guide' | 'de_guide' | 'fr_guide') => void;
}

export const TadzikCountryGuides: React.FC<TadzikCountryGuidesProps> = ({ 
  language, 
  selectedCountry, 
  onSelectCountry 
}) => {
  const pl = language === 'pl';
  const nl = language === 'nl';
  const de = language === 'de';

  const countryTabs = [
    { id: 'nl' as const, code: 'nl', flag: '🇳🇱', name: pl ? 'Holandia' : nl ? 'Nederland' : 'Netherlands', tag: pl ? 'OVpay & Pociągi NS' : 'OVpay & NS Trains' },
    { id: 'be' as const, code: 'be', flag: '🇧🇪', name: pl ? 'Belgia' : nl ? 'België' : 'Belgium', tag: pl ? 'Bilet Seniora 8.30€' : 'Senior Ticket €8.30' },
    { id: 'pl_guide' as const, code: 'pl', flag: '🇵🇱', name: pl ? 'Polska' : nl ? 'Polen' : 'Poland', tag: pl ? 'Darmowe MPK 70+' : 'Free City Transit 70+' },
    { id: 'de_guide' as const, code: 'de', flag: '🇩🇪', name: pl ? 'Niemcy' : nl ? 'Duitsland' : 'Germany', tag: pl ? 'Deutschland-Ticket & DB' : 'Deutschland-Ticket & DB' },
    { id: 'fr_guide' as const, code: 'fr', flag: '🇫🇷', name: pl ? 'Francja' : nl ? 'Frankrijk' : 'France', tag: pl ? 'Navigo & TGV Inoui' : 'Navigo & TGV Inoui' }
  ];

  // Specific country curated data
  const countryGuidesData: Record<string, {
    title: string;
    subtitle: string;
    transitDiscount: string;
    transitDiscountDesc: string;
    accessibility: string[];
    toilets: string[];
    foodTip: string;
    safetyTip: string;
  }> = {
    nl: {
      title: pl ? 'Holandia: Królestwo Rowerów i Super Nowoczesnej Kolei 🇳🇱' : 'Netherlands: Transit & Accessibility Guide 🇳🇱',
      subtitle: pl ? 'Amsterdam, Rotterdam, Haga, Utrecht, Haarlem' : 'Amsterdam, Rotterdam, The Hague, Utrecht, Haarlem',
      transitDiscount: pl ? 'OVpay (Płatność Kartą Zbliżeniową)' : 'OVpay Contactless Payment',
      transitDiscountDesc: pl ? 'Nie musisz kupować papierowych biletów! Wystarczy przyłożyć kartę płatniczą lub telefon przy wejściu i wyjściu (Check-In / Check-Out) z pociągu, tramwaju czy autobusu.' : 'No paper tickets needed! Just tap in and tap out with your contactless debit card or phone.',
      accessibility: [
        pl ? 'Wszystkie stacje NS posiadają windy na perony' : 'All NS stations have platform elevators',
        pl ? 'Tramwaje w Amsterdamie i Rotterdamie są w 100% niskopodłogowe' : 'Trams in Amsterdam & Rotterdam are 100% low-floor',
        pl ? 'Darmowa asysta kolejowa NS dla osób z trudnościami w poruszaniu się' : 'Free NS travel assistance available on booking'
      ],
      toilets: [
        pl ? 'Stacje kolejowe: Sanifair / 2theloo (0.70€ - 1.00€ z bonem zniżkowym na kawę)' : 'Train stations: Sanifair / 2theloo clean restrooms',
        pl ? 'Domy towarowe De Bijenkorf i HEMA: Czyste toalety dla klientów' : 'Department stores De Bijenkorf and HEMA'
      ],
      foodTip: pl ? 'Zjedz ciepłe Stroopwafel na targu lub kawałek Appeltaart z bitą śmietaną w kawiarni z ogródkiem.' : 'Try warm Stroopwafel or traditional Dutch apple pie in a quiet cafe.',
      safetyTip: pl ? 'UWAGA na ścieżki rowerowe! Nigdy nie stawaj na czerwonej nawierzchni ścieżki rowerowej – rowerzyści jeżdżą szybko i bezszelestnie.' : 'Watch out for bike paths! Never walk on red asphalt bike lanes.'
    },
    be: {
      title: pl ? 'Belgia: Zabytkowe Miasta, Czekolada i Kolej NMBS 🇧🇪' : 'Belgium: Senior Travel Guide 🇧🇪',
      subtitle: pl ? 'Bruksela, Brugia, Gandawa, Antwerpia' : 'Brussels, Bruges, Ghent, Antwerp',
      transitDiscount: pl ? 'Senior Ticket NMBS (Bilet Seniora 65+ za 8.30€)' : 'Senior Ticket NMBS (€8.30 Return)',
      transitDiscountDesc: pl ? 'Osoby po 65 roku życia mogą podróżować pociągiem w obie strony do dowolnego miasta w Belgii za jedyne 8.30€ (od poniedziałku do piątku od 9:00, w weekendy bez ograniczeń godzinowych).' : 'Seniors 65+ can travel anywhere in Belgium round-trip for only €8.30 outside rush hours.',
      accessibility: [
        pl ? 'Główne dworce (Bruxelles-Midi, Brugge, Antwerpen) w pełni dostosowane' : 'Main stations fully equipped with elevators and ramps',
        pl ? 'Zabytkowy bruk w Brugii i Gandawie – zalecane stabilne buty sportowe' : 'Historic cobblestones in Bruges - comfortable flat shoes recommended',
        pl ? 'Bezpłatne windy miejskie łączące górne i dolne miasto w Brukseli' : 'Free public elevators connecting upper and lower Brussels'
      ],
      toilets: [
        pl ? 'Dworce kolejowe: Czyste toalety 2theloo' : 'Train stations: 2theloo accessible restrooms',
        pl ? 'Galerie Królewskie św. Huberta – toalety na parterze' : 'Royal Galleries of Saint-Hubert'
      ],
      foodTip: pl ? 'Prawdziwe gofry brukselskie z cukrem pudrem i filiżanka gorącej belgijskiej czekolady.' : 'Authentic Brussels waffle with icing sugar and hot Belgian chocolate.',
      safetyTip: pl ? 'Na stacjach metra w Brukseli trzymaj portfel i torebkę z przodu ciała.' : 'Keep your bag in front when taking Brussels metro.'
    },
    pl_guide: {
      title: pl ? 'Polska: Złota Jesień, Zabytki i Ulgi Komunikacyjne 🇵🇱' : 'Poland: Transit & Senior Guide 🇵🇱',
      subtitle: pl ? 'Warszawa, Kraków, Wrocław, Gdańsk, Poznań' : 'Warsaw, Krakow, Wroclaw, Gdansk, Poznan',
      transitDiscount: pl ? 'Darmowe MPK dla osób 70+ & Bilet Seniora PKP' : 'Free City Transit 70+ & PKP Senior Card',
      transitDiscountDesc: pl ? 'W większości polskich miast (Warszawa, Kraków, Gdańsk, Wrocław) osoby po 70. roku życia jeżdżą autobusami i tramwajami całkowicie ZA DARMO na dowód osobisty. PKP Intercity oferuje stałą ulgę 37% dla seniorów 60+.' : 'In major Polish cities, seniors 70+ ride trams and buses 100% free with ID card.',
      accessibility: [
        pl ? 'Większość taboru tramwajowego i autobusowego jest w 100% niskopodłogowa' : 'Nearly all modern city buses and trams are 100% low-floor',
        pl ? 'Dworce główne po modernizacji (Warszawa Centralna, Kraków Główny, Wrocław) bez barier' : 'Modernized railway stations equipped with ramps and elevators',
        pl ? 'Planty krakowskie i parki warszawskie oferują setki ławeczek w cieniu' : 'Abundant shaded benches in historic parks and green rings'
      ],
      toilets: [
        pl ? 'Dworce PKP: Nowoczesne toalety dworcowe (płatność kartą lub 3-4 zł)' : 'Modern train station restrooms with card payment',
        pl ? 'Galerie handlowe przy dworcach (np. Galeria Krakowska, Złote Tarasy) – bezpłatne' : 'Shopping malls adjacent to stations with free access'
      ],
      foodTip: pl ? 'Tradycyjny żurek w chlebku, pierogi z owocami leśnymi i kompot z jabłek.' : 'Traditional pierogi dumplings and hot fruit compote in milk bars.',
      safetyTip: pl ? 'Na przejściach dla pieszych upewnij się, że samochody całkowicie się zatrzymały przed wejściem na jezdnię.' : 'Ensure cars have fully stopped before stepping onto pedestrian crossings.'
    },
    de_guide: {
      title: pl ? 'Niemcy: Punktualność, Porządek i Deutschland-Ticket 🇩🇪' : 'Germany: Transit & Comfort Guide 🇩🇪',
      subtitle: pl ? 'Berlin, Monachium, Drezno, Frankfurt, Hamburg' : 'Berlin, Munich, Dresden, Frankfurt, Hamburg',
      transitDiscount: pl ? 'Deutschland-Ticket (D-Ticket) & BahnCard 50' : 'Deutschland-Ticket & DB BahnCard',
      transitDiscountDesc: pl ? 'D-Ticket pozwala podróżować wszystkimi pociągami regionalnymi (RE, RB), metrem (U-Bahn), kolejkami S-Bahn, tramwajami i autobusami w całych Niemczech bez kupowania pojedynczych biletów.' : 'D-Ticket offers unlimited nationwide regional transit, S-Bahn, U-Bahn, and buses.',
      accessibility: [
        pl ? 'System DB StationService z dedykowaną pomocą dla podróżnych' : 'DB Mobility Service for step-free boarding',
        pl ? 'Stacje S-Bahn i U-Bahn wyposażone w pasy dotykowe i windy' : 'Tactile paving and platform elevators across transit networks',
        pl ? 'Szerokie, bezpieczne deptaki bez ruchu samochodowego' : 'Spacious pedestrian zones free of car traffic'
      ],
      toilets: [
        pl ? 'Sanifair na wszystkich dworcach DB i autostradach Autobahn (1.00€ z kuponem)' : 'Sanifair network across DB stations and highway rest stops',
        pl ? 'Toalety miejskie "City-Toilette" przy głównych placach' : 'City-Toilette automatic cabins near town squares'
      ],
      foodTip: pl ? 'Kawa zbożowa lub herbata z kawałkiem ciasta drożdżowego z kruszonką (Streuselkuchen).' : 'Filter coffee with traditional crumb cake (Streuselkuchen).',
      safetyTip: pl ? 'W pociągach dalekobieżnych ICE warto zarezerwować miejsce siedzące w strefie ciszy (Ruhebereich).' : 'On ICE trains, reserve a seat in the designated Quiet Zone.'
    },
    fr_guide: {
      title: pl ? 'Francja: Elegancja, Zabytki i Szybka Kolej TGV 🇫🇷' : 'France: Senior Travel Guide 🇫🇷',
      subtitle: pl ? 'Paryż, Lyon, Nicea, Strasburg, Marsylia' : 'Paris, Lyon, Nice, Strasbourg, Marseille',
      transitDiscount: pl ? 'Karta Senior SNCF & Navigo Easy' : 'SNCF Senior Card & Navigo Easy',
      transitDiscountDesc: pl ? 'Karta Avantage Senior zapewnia do 30% zniżki na wszystkie bilety pociągów TGV i Intercités. W Paryżu karta zbliżeniowa Navigo Easy ułatwia przejazdy metrem i autobusami bez papierowych karnetów.' : 'Senior travel card gives 30% off high-speed TGV tickets across France.',
      accessibility: [
        pl ? 'Nowoczesne tramwaje i autobusy w Paryżu i Strasburgu w 100% niskopodłogowe' : 'Modern city trams and buses are 100% step-free',
        pl ? 'Większość muzeów narodowych posiada bezpłatny wstęp lub dedykowane windy' : 'National museums offer dedicated elevators and priority queues',
        pl ? 'Ogrody Tuileries i Ogrody Luksemburskie z tysiącami zielonych krzeseł' : 'Luxembourg & Tuileries gardens with thousands of relaxing park chairs'
      ],
      toilets: [
        pl ? 'Bezpłatne toalety samoczyszczące Sanisette na ulicach Paryża' : 'Free automatic Sanisette public restrooms throughout Paris',
        pl ? 'Dworce kolejowe (Gare de Lyon, Gare du Nord): Toalety PointWC' : 'Major train stations: PointWC premium attended restrooms'
      ],
      foodTip: pl ? 'Chrupiący maślany rogalik (Croissant au beurre) z café crème w cieniu paryskiej kamienicy.' : 'Fresh warm butter croissant with café crème at a pavement cafe.',
      safetyTip: pl ? 'W paryskim metrze unikaj starych linii z głębokimi schodami – korzystaj z autobusów miejskich RATP z pięknym widokiem za oknem!' : 'Prefer surface RATP buses over deep metro stations for great sightseeing views.'
    }
  };

  const currentGuide = countryGuidesData[selectedCountry] || countryGuidesData.nl;
  const currentTab = countryTabs.find(t => t.id === selectedCountry) || countryTabs[0];

  return (
    <div className="space-y-6" id="tadzik-country-guides-workspace">
      
      {/* Country Selection Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-3xl">
        {countryTabs.map((tab) => {
          const isSelected = selectedCountry === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCountry(tab.id)}
              className={`flex-1 min-w-[140px] py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black shadow-lg scale-102'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-lg">{tab.flag}</span>
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Country Card */}
      <motion.div 
        key={selectedCountry}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6"
      >
        {/* Country Title Header */}
        <div className="border-b border-slate-100 pb-5 space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
              {currentTab.tag}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {currentGuide.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">
            {currentGuide.subtitle}
          </p>
        </div>

        {/* Highlight 1: Transit & Senior Discounts */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-black text-sm sm:text-base">
            <Train className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{currentGuide.transitDiscount}</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
            {currentGuide.transitDiscountDesc}
          </p>
        </div>

        {/* 2-Column Grid: Accessibility & Clean Restrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Column A: Accessibility */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
            <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>{pl ? 'Dostępność i Windy ♿' : 'Accessibility & Lifts ♿'}</span>
            </h4>
            <ul className="space-y-2">
              {currentGuide.accessibility.map((acc, idx) => (
                <li key={idx} className="text-xs text-slate-700 font-medium flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{acc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column B: Restrooms & Hygiene */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
            <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>{pl ? 'Czyste Toalety na Trasie 🚻' : 'Clean Restrooms 🚻'}</span>
            </h4>
            <ul className="space-y-2">
              {currentGuide.toilets.map((toilet, idx) => (
                <li key={idx} className="text-xs text-slate-700 font-medium flex items-start gap-2">
                  <span className="text-indigo-600 font-bold shrink-0">•</span>
                  <span>{toilet}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Food & Safety Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
            <Coffee className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-black uppercase text-amber-900 block">
                {pl ? 'Co warto zjeść i wypić:' : 'Culinary recommendation:'}
              </span>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                {currentGuide.foodTip}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-black uppercase text-indigo-900 block">
                {pl ? 'Rada bezpieczeństwa Tadzika:' : 'Safety advice:'}
              </span>
              <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                {currentGuide.safetyTip}
              </p>
            </div>
          </div>

        </div>

        {/* Real Gemini AI Country Suggestions integration */}
        <div className="pt-4 border-t border-slate-100">
          <CountryAIAdvisor country={currentTab.code} language={language} />
        </div>

      </motion.div>

    </div>
  );
};
