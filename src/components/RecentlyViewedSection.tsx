import React, { useRef } from 'react';
import { 
  History, 
  Trash2, 
  Compass, 
  Eye, 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  HardDrive, 
  DownloadCloud, 
  Check, 
  Heart,
  Euro,
  X
} from 'lucide-react';
import { Attraction, Language } from '../types';

interface RecentlyViewedSectionProps {
  language: Language;
  recentlyViewedAttractions: Attraction[];
  onSelectAttraction: (att: Attraction) => void;
  onOpenQuickPreview: (att: Attraction) => void;
  onNavigateToAttraction: (att: Attraction) => void;
  onRemoveFromRecentlyViewed: (attId: string, e: React.MouseEvent) => void;
  onClearAllRecentlyViewed: () => void;
  getPhoto: (att: Attraction) => string;
  heartsState: Record<string, number>;
  userLikedState: Record<string, boolean>;
  onToggleHeart: (attId: string) => void;
  selectedVersion: 'adult' | 'child';
  isOfflineCached?: (attId: string) => boolean;
  onToggleOffline?: (att: Attraction, e: React.MouseEvent) => void;
  onQuickAddRecommended?: (att: Attraction) => void;
  allAttractions?: Attraction[];
}

export default function RecentlyViewedSection({
  language,
  recentlyViewedAttractions,
  onSelectAttraction,
  onOpenQuickPreview,
  onNavigateToAttraction,
  onRemoveFromRecentlyViewed,
  onClearAllRecentlyViewed,
  getPhoto,
  heartsState,
  userLikedState,
  onToggleHeart,
  selectedVersion,
  isOfflineCached,
  onToggleOffline,
  onQuickAddRecommended,
  allAttractions = []
}: RecentlyViewedSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getCountryFlag = (city: string, region: string): string => {
    const text = `${city} ${region}`.toLowerCase();
    if (text.includes('kraków') || text.includes('krakow') || text.includes('warszawa') || text.includes('warsaw') || text.includes('polska') || text.includes('poland') || text.includes('gdańsk')) return '🇵🇱';
    if (text.includes('paris') || text.includes('paryż') || text.includes('francja') || text.includes('france')) return '🇫🇷';
    if (text.includes('berlin') || text.includes('niemcy') || text.includes('germany') || text.includes('monachium')) return '🇩🇪';
    if (text.includes('brussels') || text.includes('bruksela') || text.includes('antwerp') || text.includes('belgia') || text.includes('belgium')) return '🇧🇪';
    return '🇳🇱';
  };

  const getCategoryLabel = (category: string): { label: string; icon: string } => {
    switch (category) {
      case 'museum':
        return { label: language === 'pl' ? 'Muzeum' : language === 'nl' ? 'Museum' : 'Museum', icon: '🏛️' };
      case 'park':
      case 'adult_park':
      case 'toddler_park':
        return { label: language === 'pl' ? 'Park & Ogród' : language === 'nl' ? 'Park' : 'Park & Garden', icon: '🌷' };
      case 'forest':
        return { label: language === 'pl' ? 'Las & Przyroda' : language === 'nl' ? 'Bos & Natuur' : 'Forest & Nature', icon: '🌲' };
      case 'historical_site':
        return { label: language === 'pl' ? 'Zabytek & Zamek' : language === 'nl' ? 'Historisch & Kasteel' : 'Historic & Castle', icon: '🏰' };
      case 'beach':
        return { label: language === 'pl' ? 'Plaża & Molo' : language === 'nl' ? 'Strand & Kust' : 'Beach & Pier', icon: '🏖️' };
      case 'waterway':
        return { label: language === 'pl' ? 'Rejs & Kanał' : language === 'nl' ? 'Rondvaart' : 'Canal Cruise', icon: '⛵' };
      case 'restaurant_cafe':
        return { label: language === 'pl' ? 'Kawiarnia & Szarlotka' : language === 'nl' ? 'Café & Gebak' : 'Cafe & Bakery', icon: '☕' };
      case 'childrens_attraction':
      case 'amusement_park':
        return { label: language === 'pl' ? 'Rozrywka & Rodzina' : language === 'nl' ? 'Attractiepark' : 'Family Fun', icon: '🎡' };
      default:
        return { label: language === 'pl' ? 'Atrakcja' : language === 'nl' ? 'Attractie' : 'Attraction', icon: '✨' };
    }
  };

  // Starter popular recommendations if history is empty
  const starterAttractions = allAttractions.filter((a) =>
    ['depot-boijmans', 'krakow-wawel-square', 'rijksmuseum', 'vondelpark', 'dom-tower'].includes(a.id)
  ).slice(0, 4);

  return (
    <section 
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50/70 via-white to-indigo-50/50 border-2 border-amber-200/80 shadow-md p-5 sm:p-6 md:p-7 space-y-4"
      id="recently-viewed-attractions-section"
      aria-label={language === 'pl' ? 'Ostatnio przeglądane atrakcje' : 'Recently viewed attractions'}
    >
      {/* Header bar with senior-friendly clear typography and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <History className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                  <span>{language === 'pl' ? 'Ostatnio Przeglądane' : language === 'nl' ? 'Recent Bekeken' : 'Recently Viewed'}</span>
                  <span className="text-amber-500 text-sm font-bold">✦</span>
                </h3>
                {recentlyViewedAttractions.length > 0 && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-black px-2.5 py-0.5 rounded-full font-mono">
                    {recentlyViewedAttractions.length} {language === 'pl' ? 'miejsc' : language === 'nl' ? 'plekken' : 'spots'}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {language === 'pl' 
                  ? 'Szybki powrót do ostatnio oglądanych i wyszukiwanych miejsc bez ponownego wpisywania' 
                  : language === 'nl' 
                  ? 'Snel terugkeren naar eerder bekeken locaties zonder opnieuw te typen' 
                  : 'Quickly jump back to places you recently opened or searched'}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons: Clear history + Carousel scroll arrows */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {recentlyViewedAttractions.length > 0 && (
            <button
              type="button"
              onClick={onClearAllRecentlyViewed}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title={language === 'pl' ? 'Wyczyść całą historię przeglądania' : 'Wis recente geschiedenis'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'pl' ? 'Wyczyść historię' : language === 'nl' ? 'Geschiedenis wissen' : 'Clear history'}</span>
            </button>
          )}

          {recentlyViewedAttractions.length > 2 && (
            <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors"
                title="Przewiń w lewo"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors"
                title="Przewiń w prawo"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Carousel / Cards List */}
      {recentlyViewedAttractions.length > 0 ? (
        <div 
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-slate-100 scroll-smooth snap-x"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {recentlyViewedAttractions.map((att) => {
            const photo = getPhoto(att);
            const flag = getCountryFlag(att.city, att.region);
            const catInfo = getCategoryLabel(att.category);
            const versionData = selectedVersion === 'adult' ? att.adultVersion : att.childVersion;
            const liked = userLikedState[att.id];
            const hearts = heartsState[att.id] || 0;
            const cached = isOfflineCached ? isOfflineCached(att.id) : false;

            return (
              <div
                key={att.id}
                id={`recently-viewed-card-${att.id}`}
                className="w-72 sm:w-80 shrink-0 bg-white rounded-2xl border-2 border-slate-200/90 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group snap-start relative"
              >
                {/* Remove single item button */}
                <button
                  type="button"
                  onClick={(e) => onRemoveFromRecentlyViewed(att.id, e)}
                  className="absolute top-2.5 right-2.5 z-20 bg-slate-900/80 hover:bg-rose-600 text-white p-1.5 rounded-full shadow-md backdrop-blur-xs transition-colors cursor-pointer"
                  title={language === 'pl' ? 'Usuń to miejsce z ostatnio przeglądanych' : 'Verwijder uit historie'}
                  aria-label="Remove from recent"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                {/* Card Top: Photo & Badges */}
                <div 
                  onClick={() => onOpenQuickPreview(att)}
                  className="relative h-40 w-full bg-slate-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={photo}
                    alt={att.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 items-center max-w-[80%]">
                    <span className="bg-slate-900/90 backdrop-blur-md text-amber-300 font-black text-[11px] px-2.5 py-0.5 rounded-lg border border-amber-400/40 shadow-xs flex items-center gap-1">
                      <span>{flag}</span>
                      <span>{att.city}</span>
                    </span>
                    <span className="bg-indigo-700/90 backdrop-blur-md text-white font-bold text-[10px] px-2 py-0.5 rounded-lg">
                      {catInfo.icon} {catInfo.label}
                    </span>
                  </div>

                  {/* Bottom Title on Photo */}
                  <div className="absolute bottom-2.5 left-3 right-3">
                    <h4 className="text-base sm:text-lg font-black text-white leading-tight line-clamp-1 group-hover:text-amber-300 transition-colors drop-shadow-md">
                      {att.name}
                    </h4>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                      {versionData.description}
                    </p>

                    <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <Euro className="w-3.5 h-3.5 text-amber-600" />
                        <span>
                          {versionData.budget === 0 
                            ? (language === 'pl' ? '0 € (Gratis)' : '0 € (Gratis)') 
                            : `€${versionData.budget} / os.`}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        ♿ {language === 'pl' ? 'Bez barier' : 'Toegankelijk'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons for Seniors */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenQuickPreview(att)}
                        className="w-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-800 font-black text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                        title={language === 'pl' ? 'Zobacz pełne szczegóły miejsca' : 'Bekijk details'}
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{language === 'pl' ? 'Szczegóły' : language === 'nl' ? 'Details' : 'Details'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigateToAttraction(att)}
                        className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs py-2.5 px-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102"
                        title={language === 'pl' ? 'Zaplanuj dojazd i sprawdź pogodę' : 'Plan route & weer'}
                      >
                        <Compass className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{language === 'pl' ? 'Nawiguj 🧭' : 'Route 🧭'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => onSelectAttraction(att)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{language === 'pl' ? 'Przejdź w katalogu' : 'Ga naar catalogus'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        {onToggleOffline && (
                          <button
                            type="button"
                            onClick={(e) => onToggleOffline(att, e)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              cached
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-slate-50 text-slate-400 hover:text-indigo-600 border-slate-200'
                            }`}
                            title={cached ? 'Zapisane offline' : 'Zapisz offline'}
                          >
                            {cached ? <HardDrive className="w-3.5 h-3.5" /> : <DownloadCloud className="w-3.5 h-3.5" />}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onToggleHeart(att.id)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                            liked
                              ? 'bg-rose-50 text-rose-600 border-rose-300'
                              : 'bg-slate-50 text-slate-400 hover:text-rose-500 border-slate-200'
                          }`}
                          title="Polubienie"
                        >
                          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-600' : ''}`} />
                          <span className="text-[10px] font-mono font-bold">{hearts}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Starter State for Seniors */
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-dashed border-amber-300 p-5 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl">
            🕒
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-black text-slate-900">
              {language === 'pl' 
                ? 'Brak historii wyszukiwania – zacznij od polecanych miejsc' 
                : language === 'nl' 
                ? 'Nog geen recente geschiedenis – begin met aanbevolen plekken' 
                : 'No recent history yet – start exploring with top spots'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg mx-auto">
              {language === 'pl'
                ? 'Gdy klikniesz dowolną atrakcję, wyszukasz miasto lub sprawdzisz szczegóły, pojawi się ona w tej sekcji, abyś mógł do niej łatwo wrócić.'
                : 'Places you view, search or inspect will automatically show up here for fast 1-click access.'}
            </p>
          </div>

          {starterAttractions.length > 0 && onQuickAddRecommended && (
            <div className="pt-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
                {language === 'pl' ? 'Polecane na dobry początek:' : 'Aanbevolen startlocaties:'}
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {starterAttractions.map((starter) => (
                  <button
                    key={starter.id}
                    type="button"
                    onClick={() => onQuickAddRecommended(starter)}
                    className="bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs hover:scale-105 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{getCountryFlag(starter.city, starter.region)}</span>
                    <span>{starter.name}</span>
                    <span className="text-[10px] text-amber-600 font-mono">({starter.city})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
