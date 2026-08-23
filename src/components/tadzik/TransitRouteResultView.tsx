import React, { useState } from 'react';
import { Language } from '../../types';
import { PlannedTransitItinerary, PlannedLeg } from '../../services/transitRouteEngine';
import InAppGoogleMapRoute from '../InAppGoogleMapRoute';
import InAppTimetableModal from '../transit/InAppTimetableModal';
import { TransportType } from '../../services/timetableService';
import { 
  Compass, 
  MapPin, 
  Train, 
  Bus, 
  Sparkles, 
  Calendar,
  Sun, 
  ShieldCheck, 
  Info,
  Navigation,
  ExternalLink,
  RotateCcw,
  Accessibility,
  Coffee,
  CheckCircle2,
  Globe2,
  CreditCard,
  Layers,
  ArrowRight,
  Footprints,
  Armchair,
  Radio,
  Clock,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';

interface TransitRouteResultViewProps {
  itinerary: PlannedTransitItinerary;
  language: Language;
  departureDate: string;
  departureTime: string;
  selectedTransportMode: 'train' | 'tram' | 'bus' | 'public' | 'car' | 'motorcycle' | 'bicycle' | 'walk';
  onStartNewSearch: () => void;
  formatDisplayDate: (dateStr: string) => string;
}

export const TransitRouteResultView: React.FC<TransitRouteResultViewProps> = ({
  itinerary,
  language,
  departureDate,
  departureTime,
  selectedTransportMode,
  onStartNewSearch,
  formatDisplayDate
}) => {
  const pl = language === 'pl';
  const nl = language === 'nl';
  const de = language === 'de';

  // In-App Live Timetable Modal State
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState<boolean>(false);
  const [timetableModalStation, setTimetableModalStation] = useState<string>('roosendaal');
  const [timetableModalFilter, setTimetableModalFilter] = useState<TransportType | 'all'>('all');

  const openTimetable = (stationQuery: string, filterType: TransportType | 'all' = 'all') => {
    setTimetableModalStation(stationQuery);
    setTimetableModalFilter(filterType);
    setIsTimetableModalOpen(true);
  };

  const getLegIcon = (leg: PlannedLeg) => {
    switch (leg.type) {
      case 'train':
        return Train;
      case 'tram':
      case 'bus':
      case 'metro':
        return Bus;
      case 'walk':
        return Footprints;
      default:
        return Navigation;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-8 text-white space-y-7 shadow-2xl"
      id="calculated-route-results-hub"
    >
      {/* ========================================================= */}
      {/* 1. NAGŁÓWEK PODSUMOWANIA TRASY                            */}
      {/* ========================================================= */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 border-b border-slate-800 pb-6">
        <div className="space-y-2.5 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase px-3 py-1 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{pl ? 'Trasa Bezpieczna & Bez Barier ♿' : 'Step-Free Safe Route ♿'}</span>
            </span>

            {itinerary.isCrossBorder && (
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase px-3 py-1 rounded-xl border border-indigo-500/30 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{pl ? 'Trasa Międzynarodowa' : 'Cross-Border Corridor'}</span>
              </span>
            )}

            <span className="bg-indigo-500/15 text-indigo-200 text-xs font-bold px-3 py-1 rounded-xl border border-indigo-500/30 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{formatDisplayDate(departureDate)} • ⏰ {departureTime}</span>
            </span>

            <span className="text-slate-300 font-mono text-xs font-bold bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
              {pl ? 'Komfort:' : 'Comfort:'} <strong className="text-amber-300">{itinerary.comfortScore}</strong>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white flex items-center gap-2 flex-wrap tracking-tight">
            <span className="text-emerald-400">{itinerary.originFormatted}</span>
            <span className="text-amber-400 font-mono">➔</span>
            <span className="text-white">{itinerary.destinationFormatted}</span>
          </h3>

          {/* Involved Countries Flags */}
          {itinerary.countriesInvolved && itinerary.countriesInvolved.length > 0 && (
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-xs text-slate-400 font-bold">{pl ? 'Kraje na trasie:' : 'Countries:'}</span>
              <div className="flex items-center gap-1.5">
                {itinerary.countriesInvolved.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-lg text-xs font-bold text-slate-200">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Total Duration, Transfers, Cost & Quick Nav Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
          <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 justify-between sm:justify-start">
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{pl ? 'Czas podróży' : 'Duration'}</span>
              <strong className="text-base sm:text-lg font-black text-emerald-400 font-mono">⏱️ {itinerary.totalDuration}</strong>
            </div>
            <div className="w-px h-9 bg-slate-800" />
            <div className="text-center sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{pl ? 'Przesiadki' : 'Transfers'}</span>
              <strong className="text-base sm:text-lg font-black text-indigo-300 font-mono">{itinerary.transfersCount}</strong>
            </div>
            <div className="w-px h-9 bg-slate-800" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{pl ? 'Szacowany koszt' : 'Est. Price'}</span>
              <strong className="text-base sm:text-lg font-black text-amber-400 font-mono">
                €{itinerary.totalPriceEur?.toFixed(2) || '0.00'}
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const navEl = document.getElementById('active-in-app-gps-navigator');
              if (navEl) {
                navEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <Navigation className="w-4 h-4 fill-slate-950" />
            <span>{pl ? 'Przejdź do Mapy i Nawigacji' : 'Go to Map Navigation'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. ROZKŁADY JAZDY & OFICJALNI PRZEWOŹNICY W APLIKACJI     */}
      {/* (Wyświetlane dla Komunikacji Publicznej / Pociągów / Tramwajów / Autobusów) */}
      {/* ========================================================= */}
      {(selectedTransportMode === 'public' || selectedTransportMode === 'train' || selectedTransportMode === 'tram' || selectedTransportMode === 'bus') && (
        <div className="space-y-3.5 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900 p-5 rounded-3xl border border-indigo-500/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="text-sm font-black uppercase tracking-wider text-indigo-200 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{pl ? 'Rozkłady Jazdy Pociągów, Autobusów i Tramwajów (Live w Aplikacji):' : 'Live Transit & Rail Departure Boards (In-App):'}</span>
              </h4>
              <p className="text-xs text-slate-300 font-medium">
                {pl 
                  ? 'Kliknij dowolną stację lub przewoźnika poniżej, aby bez opuszczania aplikacji zobaczyć odjazdy, perony, opóźnienia i przystanki pośrednie.'
                  : 'Click any carrier or station to view real-time departures, platforms and intermediate stops directly in the app.'}
              </p>
            </div>

            {/* Primary View Timetable Button */}
            <button
              type="button"
              onClick={() => openTimetable(itinerary.originFormatted || 'roosendaal', 'all')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98"
            >
              <Clock className="w-4 h-4 text-amber-300" />
              <span>{pl ? 'Wyświetl Tablicę Rozkładów w Aplikacji' : 'View Timetables in App'}</span>
            </button>
          </div>

          {/* Carrier Interactive Cards that Open In-App Timetables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {itinerary.operators && itinerary.operators.map((op, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const targetStation = op.country === 'NL' ? 'roosendaal' : op.country === 'DE' ? 'berlin' : op.country === 'BE' ? 'antwerpen' : op.country === 'FR' ? 'paris' : 'poznan';
                  openTimetable(targetStation, 'all');
                }}
                className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/60 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all duration-200 group cursor-pointer text-left w-full shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{op.flag || '🚆'}</span>
                  <div>
                    <span className="text-xs font-black text-white block group-hover:text-indigo-300 transition-colors">
                      {op.name}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{pl ? 'Zobacz rozkład w aplikacji' : 'View live timetable'}</span>
                    </span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-all shrink-0">
                  <Search className="w-4 h-4" />
                </div>
              </button>
            ))}

            {/* Direct Google Maps Live Transit Link */}
            <a
              href={itinerary.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-950/60 to-slate-900 hover:from-emerald-900/80 hover:to-slate-850 border border-emerald-500/40 hover:border-emerald-400 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all duration-200 group cursor-pointer shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🗺️</span>
                <div>
                  <span className="text-xs font-black text-emerald-300 block group-hover:text-emerald-200 transition-colors">
                    Google Maps Transit
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {pl ? 'Nawigacja satelitarna na żywo' : 'Live satellite directions'}
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-600 text-slate-950 group-hover:scale-110 transition-transform shrink-0 font-black text-xs">
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PODSUMOWANIE KOMFORTU I WSKAZÓWKI BEZPIECZEŃSTWA        */}
      {/* ========================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            {pl ? 'Podsumowanie Trasy & Wygoda Seniora:' : 'Senior Comfort & Route Summary:'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          {itinerary.summaryDescription}
        </p>
        {itinerary.safetyAndComfortTips && (
          <div className="flex items-start gap-2.5 text-xs font-bold text-amber-300 pt-2 border-t border-slate-800/80">
            <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <span>{itinerary.safetyAndComfortTips}</span>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 4. HARMONOGRAM KROK PO KROKU (Z PRZESIADKAMI I PERONAMI)   */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>{pl ? 'Harmonogram Podróży Krok po Kroku (W co wsiąść i gdzie się przesiąść):' : 'Step-by-Step Travel Schedule (Train & Transfers):'}</span>
          </h4>
          <span className="text-xs text-slate-400 font-mono font-bold">
            {itinerary.legs?.length || 0} {pl ? 'etapów' : 'legs'}
          </span>
        </div>

        <div className="space-y-3.5">
          {itinerary.legs && itinerary.legs.map((leg, idx) => {
            const LegIcon = getLegIcon(leg);
            const isTrain = leg.type === 'train';
            const isWalk = leg.type === 'walk';

            return (
              <div 
                key={idx}
                className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-4 sm:p-5 rounded-2xl space-y-3.5 transition-all duration-200 shadow-md"
              >
                {/* Leg Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${
                      isTrain 
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' 
                        : isWalk
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      <LegIcon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-wider block">
                        {pl ? `ETAP ${leg.legNumber}` : `LEG ${leg.legNumber}`} • ⏱️ {leg.duration} {leg.distance ? `(${leg.distance})` : ''}
                      </span>
                      <h5 className="font-black text-sm sm:text-base text-white">
                        {leg.title}
                      </h5>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    {leg.type !== 'walk' && (
                      <button
                        type="button"
                        onClick={() => openTimetable(leg.departureStation, leg.type === 'train' ? 'train' : leg.type === 'tram' ? 'tram' : 'bus')}
                        className="px-3 py-1 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-300" />
                        <span>{pl ? 'Rozkład w aplikacji' : 'Timetable in app'}</span>
                      </button>
                    )}

                    {leg.carrierCountry && (
                      <span className="text-xs bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-bold text-slate-300">
                        {leg.carrierLogo || '🚆'} {leg.carrier}
                      </span>
                    )}
                    {leg.priceEur !== undefined && leg.priceEur > 0 && (
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/50 border border-amber-900/40 px-2.5 py-1 rounded-lg shrink-0">
                        €{leg.priceEur.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stations & Platforms Route Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-850 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-emerald-400 block">
                      🛫 {pl ? 'WYJAZD / ODJAZD' : 'DEPARTURE'} ({leg.departureTime})
                    </span>
                    <p className="font-bold text-white text-sm">
                      {leg.departureStation}
                    </p>
                    {leg.departurePlatform && (
                      <span className="inline-block bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 px-2 py-0.5 rounded text-[11px] font-black">
                        📍 {leg.departurePlatform}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 sm:border-l sm:border-slate-800 sm:pl-3">
                    <span className="text-[10px] font-black uppercase text-amber-400 block">
                      🏁 {pl ? 'PRZYJAZD' : 'ARRIVAL'} ({leg.arrivalTime})
                    </span>
                    <p className="font-bold text-white text-sm">
                      {leg.arrivalStation}
                    </p>
                    {leg.arrivalPlatform && (
                      <span className="inline-block bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded text-[11px] font-black">
                        📍 {leg.arrivalPlatform}
                      </span>
                    )}
                  </div>
                </div>

                {/* Transfer Guidance (If buffer exists) */}
                {leg.transferBufferMins && leg.transferBufferMins > 0 && (
                  <div className="bg-indigo-950/40 border border-indigo-500/30 p-3 rounded-xl flex items-start gap-2.5 text-xs text-indigo-200">
                    <Coffee className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-indigo-300 block">
                        {pl 
                          ? `Spokojna Przesiadka: ${leg.transferBufferMins} minut buforu bezpieczeństwa`
                          : `Comfortable Transfer: ${leg.transferBufferMins} minutes safety buffer`}
                      </span>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        {leg.transferInstructions || (pl ? 'Szerokie windy na peron, brak pośpiechu, czas na skorzystanie z toalety i zakup herbaty.' : 'Elevator platform connection.')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Ticket & Accessibility Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                  {leg.ticketSystem && (
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-300 font-medium">
                        <strong>{leg.ticketSystem.name}:</strong> {leg.ticketSystem.howToPay} ({leg.ticketSystem.seniorDiscount})
                      </span>
                    </div>
                  )}

                  {leg.accessibility && (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Accessibility className="w-3.5 h-3.5 shrink-0" />
                      <span>{leg.accessibility}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. GWARANCJA ZMROKU I BEZPIECZNEGO POWROTU                */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 shrink-0">
            <Sun className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h5 className="font-black text-sm text-amber-300 uppercase tracking-wide">
              {pl ? 'Gwarancja Bezpieczeństwa: Zmrok & Spokojny Powrót' : 'Daylight Safety & Return Time'}
            </h5>
            <p className="text-xs text-slate-300 font-medium">
              {pl 
                ? `Zalecany start w drogę powrotną: przed godziną ${itinerary.recommendedReturnTime || '18:00'}, by spokojnie wrócić za widoku.`
                : `Recommended return departure: before ${itinerary.recommendedReturnTime || '18:00'} for daylight return.`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onStartNewSearch}
          className="bg-white/10 hover:bg-white/20 text-white text-xs font-black px-5 py-3 rounded-xl border border-white/20 transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2 hover:scale-102 active:scale-98"
        >
          <RotateCcw className="w-4 h-4 text-amber-300" />
          <span>{pl ? 'Wyszukaj inną trasę' : 'New Search'}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 6. INTERAKTYWNA MAPA GOOGLE MAPS NA ŻYWO                  */}
      {/* ========================================================= */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>{pl ? 'Interaktywna Mapa Google Maps na Żywo:' : 'Interactive Live Google Maps Route:'}</span>
          </h4>
          <span className="text-xs text-emerald-400 font-bold">
            {pl ? 'Widok satelitarny & manewry' : 'Live satellite & navigation'}
          </span>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
          <InAppGoogleMapRoute
            destination={itinerary.destinationFormatted || (pl ? 'Poznań Główny' : 'Destination')}
            initialStartLocation={itinerary.originFormatted || (pl ? 'Moja lokalizacja GPS' : 'Current Location')}
            initialTravelMode={
              selectedTransportMode === 'car' ? 'DRIVING' :
              selectedTransportMode === 'bicycle' ? 'BICYCLING' :
              selectedTransportMode === 'walk' ? 'WALKING' : 'TRANSIT'
            }
            language={language}
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 7. WBUDOWANY MODAL ROZKŁADÓW JAZDY LIVE (IN-APP TIMETABLE) */}
      {/* ========================================================= */}
      <InAppTimetableModal
        isOpen={isTimetableModalOpen}
        onClose={() => setIsTimetableModalOpen(false)}
        language={language}
        initialStation={timetableModalStation}
        initialFilterType={timetableModalFilter}
      />
    </motion.div>
  );
};

export default TransitRouteResultView;
