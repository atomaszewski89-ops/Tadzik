import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Sparkles, MapPin, ShieldCheck, RefreshCw, CheckCircle, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface CountryAIAdvisorProps {
  country: 'nl' | 'be' | 'pl' | 'de' | 'fr';
  language: Language;
}

export const CountryAIAdvisor: React.FC<CountryAIAdvisorProps> = ({ country, language }) => {
  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pl = language === 'pl';
  const nl = language === 'nl';
  const de = language === 'de';

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/guide/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, language }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiData(data);
      } else {
        throw new Error("API route fallback");
      }
    } catch (err: any) {
      console.warn("Using localized fallback recommendations:", err);
      const fallbacks: Record<string, any> = {
        nl: {
          cities: [
            {
              name: "Utrecht 🇳🇱",
              desc: pl ? "Urokliwe miasto z unikalnymi dwupoziomowymi kanałami i spokojniejszym tempem niż Amsterdam." : "Charming city with unique double-level canals and a more relaxing pace than Amsterdam.",
              accessibility: pl ? "Płaskie drogi, stacja kolejowa Utrecht Centraal z windami na każdy peron." : "Flat terrain, Utrecht Centraal railway station with elevators to all platforms.",
              budgetTip: pl ? "Darmowy spacer wokół Katedry Dom i ogrodów Pandhof." : "Free walk around the Dom Tower and scenic Pandhof gardens.",
              safetyTip: pl ? "Uważaj na ruchliwe ścieżki rowerowe przy dworcu." : "Watch out for busy cycle tracks near the station.",
              toiletTip: pl ? "Czyste toalety publiczne w centrum handlowym Hoog Catharijne." : "Clean public restrooms in Hoog Catharijne shopping center."
            },
            {
              name: "Haarlem 🇳🇱",
              desc: pl ? "Historyczne, spokojne miasteczko słynące z muzeów i pięknej architektury." : "Historic, peaceful city famous for museums and magnificent architecture.",
              accessibility: pl ? "Kompaktowe centrum, stacja kolejowa ma zabytkowe windy i asystę." : "Compact center, train station features antique elevators and assistance.",
              budgetTip: pl ? "Darmowy relaks na rynku Grote Markt." : "Free relaxation at Grote Markt square.",
              safetyTip: pl ? "Bruk na starym mieście bywa śliski po deszczu." : "Cobblestones can be slippery after rain.",
              toiletTip: pl ? "Czyste toalety w domu handlowym HEMA (0.50 €)." : "Restrooms at HEMA department store (0.50 €)."
            }
          ],
          mainAttractions: [
            {
              name: "Ogrody Keukenhof 🌸",
              desc: pl ? "Najpiękniejszy wiosenny ogród świata z milionami kwitnących tulipanów." : "The world-famous spring garden with millions of blooming tulips.",
              cost: "€19.50",
              seniorFriendlyFactor: pl ? "Płaskie, szerokie ścieżki, możliwość wypożyczenia wózków i setki ławeczek." : "Flat, wide paths, wheelchair rentals available, and hundreds of benches."
            }
          ],
          hiddenGems: [
            {
              name: "Begijnhof (Amsterdam) 🤫",
              desc: pl ? "Ukryty, cichy dziedziniec z XIV wieku, oaza spokoju pośrodku miasta." : "Hidden 14th-century courtyard, an oasis of absolute peace.",
              cost: pl ? "Bezpłatnie" : "Free admission",
              physicalEffortLevel: pl ? "Bardzo niski - mały, płaski dziedziniec z ławkami" : "Very low - flat courtyard with benches"
            }
          ]
        },
        be: {
          cities: [
            {
              name: "Brugia (Bruges) 🇧🇪",
              desc: pl ? "Średniowieczna 'Wenecja Północy' ze wspaniałymi kanałami i bajkowym klimatem." : "Medieval 'Venice of the North' with gorgeous canals and fairy-tale atmosphere.",
              accessibility: pl ? "Autobusy miejskie są w pełni niskopodłogowe." : "Local city buses are fully low-floor.",
              budgetTip: pl ? "Bilet jednodniowy na autobus w aplikacji De Lijn." : "Day pass on the De Lijn app.",
              safetyTip: pl ? "Uważaj na dorożki konne na wąskich uliczkach." : "Watch out for horse carriages on narrow streets.",
              toiletTip: pl ? "Czyste toalety w ratuszu lub na dworcu." : "Clean restrooms in the town hall or train station."
            }
          ],
          mainAttractions: [
            {
              name: "Kanały w Brugii ⛵",
              desc: pl ? "Relaksujący rejs łodzią po kanałach z przewodnikiem." : "Relaxing guided boat cruise along the canals.",
              cost: "€12.00",
              seniorFriendlyFactor: pl ? "Rejs w 100% na siedząco, bez wysiłku." : "Fully seated tour requiring zero physical effort."
            }
          ],
          hiddenGems: [
            {
              name: "Park Minnewater (Jezioro Miłości) 🦢",
              desc: pl ? "Zacieniony park z łabędziami i urokliwym mostem." : "Shady park with swans and scenic bridge.",
              cost: pl ? "Bezpłatnie" : "Free",
              physicalEffortLevel: pl ? "Bardzo niski - płaskie alejki parkowe" : "Very low - flat shady paths"
            }
          ]
        },
        pl: {
          cities: [
            {
              name: "Kraków 🇵🇱",
              desc: pl ? "Królewskie miasto z ogromnym rynkiem i Zamkiem na Wawelu." : "Royal historic city with the massive Main Market Square and Wawel Castle.",
              accessibility: pl ? "Płaski Rynek Główny, na Wawel łagodne podejście." : "Flat main square, gentle ramp approach to Wawel.",
              budgetTip: pl ? "Osoby po 70. roku życia jeżdżą MPK za darmo!" : "Seniors 70+ ride public transit completely free!",
              safetyTip: pl ? "Uważaj na hulajnogi elektryczne na Plantach." : "Watch out for scooters on Planty ring park.",
              toiletTip: pl ? "Czyste toalety w Sukiennicach i na Dworcu Głównym." : "Clean restrooms inside Sukiennice and Main Station."
            }
          ],
          mainAttractions: [
            {
              name: "Zamek Królewski na Wawelu 🏰",
              desc: pl ? "Siedziba polskich królów z pięknym dziedzińcem." : "Historic seat of Polish kings with Renaissance courtyard.",
              cost: "od 15 zł",
              seniorFriendlyFactor: pl ? "Winda na wystawy dla osób z trudnościami w poruszaniu się." : "Elevator access available to state rooms."
            }
          ],
          hiddenGems: [
            {
              name: "Ogród Botaniczny UJ 🌿",
              desc: pl ? "Najstarszy ogród botaniczny w Polsce, cichy i pełen ławek." : "The oldest botanical garden in Poland with shaded benches.",
              cost: "8 zł",
              physicalEffortLevel: pl ? "Niski - płaski ogród z wygodnymi alejkami" : "Low - flat garden paths"
            }
          ]
        },
        de: {
          cities: [
            {
              name: "Drezno (Dresden) 🇩🇪",
              desc: pl ? "Barokowa perła nad Łabą z niesamowitymi zabytkami." : "Baroque gem on the Elbe with stunning architecture.",
              accessibility: pl ? "Nowoczesne tramwaje niskopodłogowe, płaskie deptaki." : "Modern low-floor trams, flat promenades.",
              budgetTip: pl ? "Karta Dresden-Regio-Card na transport i zniżki." : "Dresden-Regio-Card for transit & discounts.",
              safetyTip: pl ? "Bruk bywa śliski po deszczu." : "Cobblestones can be slippery when wet.",
              toiletTip: pl ? "Czyste toalety Sanifair w centrum Altmarkt-Galerie." : "Sanifair restrooms in Altmarkt-Galerie."
            }
          ],
          mainAttractions: [
            {
              name: "Pałac Zwinger 🏰",
              desc: pl ? "Barokowy kompleks pałacowy z fontannami i galeriami." : "Baroque palace with fountains and art galleries.",
              cost: "€14.00",
              seniorFriendlyFactor: pl ? "Winda wewnątrz galerii, mnóstwo ławek na dziedzińcu." : "Elevator inside galleries, many benches."
            }
          ],
          hiddenGems: [
            {
              name: "Wielki Ogród (Großer Garten) 🌳",
              desc: pl ? "Olbrzymi park królewski z miniaturową kolejką." : "Huge royal park with miniature scenic train.",
              cost: pl ? "Wstęp wolny" : "Free admission",
              physicalEffortLevel: pl ? "Niski - jazda kolejką bez wysiłku" : "Low - miniature train ride"
            }
          ]
        },
        fr: {
          cities: [
            {
              name: "Paryż (Paris) 🇫🇷",
              desc: pl ? "Miasto świateł ze wspaniałymi bulwarami i ogrodami." : "City of light with tree-lined boulevards and gardens.",
              accessibility: pl ? "Autobusy RATP są w 100% niskopodłogowe." : "RATP city buses are 100% low-floor.",
              budgetTip: pl ? "Bezpłatne wejście do muzeów dla osób niepełnosprawnych z opiekunem." : "Free museum entry for disabled guests + companion.",
              safetyTip: pl ? "Pilnuj torebki w okolicy Wieży Eiffla." : "Keep bags secure near tourist landmarks.",
              toiletTip: pl ? "Darmowe toalety Sanisette na ulicach Paryża." : "Free automatic Sanisette street restrooms."
            }
          ],
          mainAttractions: [
            {
              name: "Wieża Eiffla 🗼",
              desc: pl ? "Ikoniczna panorama Paryża z wygodnym wjazdem windą." : "Panoramic Paris views with comfortable elevator access.",
              cost: "od €12",
              seniorFriendlyFactor: pl ? "Windy na każdy poziom, pierwszeństwo dla seniorów." : "Elevators to all floors with priority line."
            }
          ],
          hiddenGems: [
            {
              name: "Provins 🏰",
              desc: pl ? "Średniowieczne, urocze miasteczko godzinę od Paryża." : "Charming medieval town 1 hour from Paris.",
              cost: pl ? "Darmowy spacer" : "Free walk",
              physicalEffortLevel: pl ? "Niski - płaskie uliczki z herbaciarniami" : "Low - flat streets & cozy tea rooms"
            }
          ]
        }
      };
      setAiData(fallbacks[country] || fallbacks.nl);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [country, language]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white space-y-6 shadow-xl relative overflow-hidden" id={`ai-guide-${country}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-850 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-400/15 border border-amber-400/30 text-amber-300 p-2.5 rounded-2xl">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>{pl ? 'Rekomendacje Asystenta AI Tadzika 🤖' : 'Tadzik AI Recommendations 🤖'}</span>
            </h4>
            <p className="text-xs text-slate-400 font-semibold">
              {pl ? 'Aktualizowane na żywo pod kątem wygody, wind i toalet' : 'Live generated for accessibility, elevators & comfort'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchSuggestions}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 border border-slate-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{pl ? 'Odśwież AI' : 'Refresh AI'}</span>
        </button>
      </div>

      {loading && (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-bold animate-pulse">
            {pl ? 'Tadzik przygotowuje najnowsze rekomendacje...' : 'Tadzik is compiling fresh recommendations...'}
          </p>
        </div>
      )}

      {!loading && aiData && (
        <div className="space-y-6">
          
          {/* Cities Section */}
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{pl ? 'Polecane Miasta (Łatwy Dostęp dla Seniora):' : 'Recommended Senior-Friendly Cities:'}</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aiData.cities?.map((c: any, idx: number) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2.5">
                  <h6 className="font-black text-sm text-white flex items-center gap-1.5">
                    <span className="text-emerald-400">📍</span>
                    <span>{c.name}</span>
                  </h6>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{c.desc}</p>
                  
                  <div className="text-[11px] space-y-1 pt-2 border-t border-slate-800 text-slate-400">
                    <p><strong className="text-slate-200">♿ {pl ? 'Dostępność:' : 'Access:'}</strong> {c.accessibility}</p>
                    <p><strong className="text-slate-200">💰 {pl ? 'Budżet:' : 'Budget:'}</strong> {c.budgetTip}</p>
                    <p><strong className="text-slate-200">🛡️ {pl ? 'Bezpieczeństwo:' : 'Safety:'}</strong> {c.safetyTip}</p>
                    <p><strong className="text-slate-200">🚻 {pl ? 'Toalety:' : 'Toilets:'}</strong> {c.toiletTip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attractions & Hidden Gems */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Main Attractions */}
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-amber-400">
                🌟 {pl ? 'Główne Atrakcje:' : 'Main Attractions:'}
              </h5>
              <div className="space-y-2.5">
                {aiData.mainAttractions?.map((att: any, idx: number) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h6 className="font-black text-xs text-white">{att.name}</h6>
                      <span className="bg-amber-400/15 text-amber-300 font-mono text-[10px] font-black px-2 py-0.5 rounded-lg border border-amber-400/30">
                        {att.cost}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">{att.desc}</p>
                    <p className="text-[11px] text-emerald-400 font-bold pt-1">
                      ✓ {att.seniorFriendlyFactor}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Gems */}
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-indigo-400">
                💎 {pl ? 'Ciche Perełki (Bez Tłumów):' : 'Hidden Peaceful Gems:'}
              </h5>
              <div className="space-y-2.5">
                {aiData.hiddenGems?.map((gem: any, idx: number) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h6 className="font-black text-xs text-white">{gem.name}</h6>
                      <span className="bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-black px-2 py-0.5 rounded-lg border border-indigo-400/30">
                        {gem.cost}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">{gem.desc}</p>
                    <p className="text-[11px] text-amber-300 font-bold pt-1">
                      ⚡ {pl ? 'Wysiłek:' : 'Effort:'} {gem.physicalEffortLevel}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
