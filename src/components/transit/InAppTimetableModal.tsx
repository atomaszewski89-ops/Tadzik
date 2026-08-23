import React, { useState, useMemo } from 'react';
import { Language } from '../../types';
import { 
  TimetableDeparture, 
  StationBoard, 
  TransportType, 
  getOrCreateStationTimetable,
  SAMPLE_STATION_BOARDS
} from '../../services/timetableService';
import { 
  X, 
  Train, 
  Bus, 
  MapPin, 
  Clock, 
  Search, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Info, 
  CreditCard, 
  Radio, 
  Coffee, 
  Accessibility, 
  Footprints, 
  CheckCircle2, 
  Filter, 
  RefreshCw,
  Globe2,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InAppTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialStation?: string;
  initialFilterType?: TransportType | 'all';
}

const PRESET_STATIONS = [
  { key: 'roosendaal', label: '🇳🇱 Roosendaal Centraal' },
  { key: 'poznan', label: '🇵🇱 Poznań Główny' },
  { key: 'berlin', label: '🇩🇪 Berlin Hauptbahnhof' },
  { key: 'warszawa', label: '🇵🇱 Warszawa Centralna' },
  { key: 'rotterdam', label: '🇳🇱 Rotterdam Centraal' },
  { key: 'amsterdam', label: '🇳🇱 Amsterdam Centraal' },
  { key: 'antwerpen', label: '🇧🇪 Antwerpen-Centraal' },
  { key: 'bruxelles', label: '🇧🇪 Bruxelles-Midi' },
  { key: 'paris', label: '🇫🇷 Paris Gare du Nord' }
];

export const InAppTimetableModal: React.FC<InAppTimetableModalProps> = ({
  isOpen,
  onClose,
  language,
  initialStation = 'roosendaal',
  initialFilterType = 'all'
}) => {
  const pl = language === 'pl';
  const nl = language === 'nl';
  const de = language === 'de';

  const [currentStationQuery, setCurrentStationQuery] = useState<string>(initialStation);
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<TransportType | 'all'>(initialFilterType);
  const [boardDirection, setBoardDirection] = useState<'departures' | 'arrivals'>('departures');
  const [expandedDepartureId, setExpandedDepartureId] = useState<string | null>(null);

  // Sync if initialStation changes when opening
  React.useEffect(() => {
    if (initialStation) {
      setCurrentStationQuery(initialStation);
    }
  }, [initialStation]);

  const currentBoard: StationBoard = useMemo(() => {
    return getOrCreateStationTimetable(currentStationQuery, language);
  }, [currentStationQuery, language]);

  const filteredDepartures = useMemo(() => {
    const list = boardDirection === 'departures' ? currentBoard.departures : currentBoard.arrivals;
    if (selectedTypeFilter === 'all') return list;
    return list.filter(item => item.type === selectedTypeFilter);
  }, [currentBoard, boardDirection, selectedTypeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputValue.trim()) {
      setCurrentStationQuery(searchInputValue.trim());
      setSearchInputValue('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-5xl text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          id="in-app-transit-timetable-modal"
        >
          {/* ========================================================= */}
          {/* TOP BAR / MODAL HEADER                                    */}
          {/* ========================================================= */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl shrink-0">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      LIVE • W APLIKACJI
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-bold">
                      {pl ? 'Elektroniczna Tablica Rozkładu Jazdy' : 'Live Station Timetable Board'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
                    <span>{currentBoard.countryFlag}</span>
                    <span>{currentBoard.stationName}</span>
                  </h3>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-2xl text-slate-400 hover:text-white transition-all cursor-pointer"
                title={pl ? 'Zamknij rozkład' : 'Close timetable'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Station Switcher Pills + Custom Search Box */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                <span className="text-[11px] text-slate-400 font-bold shrink-0 mr-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-400" />
                  {pl ? 'Stacje główne:' : 'Major Hubs:'}
                </span>
                {PRESET_STATIONS.map((st) => (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => setCurrentStationQuery(st.key)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer text-xs border ${
                      currentStationQuery.toLowerCase().includes(st.key)
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Search Any City / Station in Europe */}
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    placeholder={pl ? 'Wpisz dowolną stację lub miasto (np. Roosendaal, Poznań, Berlin, Breda, Warszawa)...' : 'Type any station or city in Europe...'}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0"
                >
                  {pl ? 'Sprawdź stację' : 'Search'}
                </button>
              </form>
            </div>

            {/* Filter Tabs (Mode & Direction) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
              {/* Departures vs Arrivals */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setBoardDirection('departures')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    boardDirection === 'departures'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{pl ? '🛫 Odjazdy' : '🛫 Departures'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBoardDirection('arrivals')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    boardDirection === 'arrivals'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{pl ? '🏁 Przyjazdy' : '🏁 Arrivals'}</span>
                </button>
              </div>

              {/* Vehicle Type Filters */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                    selectedTypeFilter === 'all'
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {pl ? 'Wszystkie' : 'All'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTypeFilter('train')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                    selectedTypeFilter === 'train'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Train className="w-3 h-3" />
                  <span>{pl ? 'Pociągi' : 'Trains'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTypeFilter('tram')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                    selectedTypeFilter === 'tram'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Bus className="w-3 h-3" />
                  <span>{pl ? 'Tramwaje' : 'Trams'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTypeFilter('bus')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                    selectedTypeFilter === 'bus'
                      ? 'bg-amber-600 text-white border-amber-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Bus className="w-3 h-3" />
                  <span>{pl ? 'Autobusy' : 'Buses'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TIMETABLE BOARD ENTRIES (SCROLLABLE LIST)                 */}
          {/* ========================================================= */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3.5 bg-slate-950">
            {filteredDepartures.length === 0 ? (
              <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <Info className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-slate-400 text-sm font-bold">
                  {pl ? 'Brak rozkładów dla wybranego filtru.' : 'No departures found for this filter.'}
                </p>
              </div>
            ) : (
              filteredDepartures.map((item) => {
                const isExpanded = expandedDepartureId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`bg-slate-900/90 border transition-all duration-200 rounded-2xl overflow-hidden ${
                      isExpanded ? 'border-indigo-500/70 shadow-lg shadow-indigo-950/50' : 'border-slate-850 hover:border-slate-700'
                    }`}
                  >
                    {/* Main Row */}
                    <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Time & Status */}
                      <div className="flex items-center gap-3.5">
                        <div className="flex flex-col items-center bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 min-w-[75px]">
                          <span className="font-mono text-base sm:text-lg font-black text-emerald-400">
                            {item.time}
                          </span>
                          <span className="text-[10px] font-black text-emerald-300 uppercase tracking-tighter">
                            {item.delayMins === 0 ? (pl ? 'Na Czasie' : 'On Time') : `+${item.delayMins} min`}
                          </span>
                        </div>

                        {/* Line & Destination */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-lg">
                              {item.carrierFlag} {item.line}
                            </span>
                            <span className="text-xs font-bold text-slate-400">
                              {item.carrier}
                            </span>
                          </div>

                          <h4 className="font-black text-sm sm:text-base text-white flex items-center gap-2">
                            <span>➔</span>
                            <span>{item.destination}</span>
                          </h4>
                        </div>
                      </div>

                      {/* Right: Platform, Facilities & Expand Action */}
                      <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                        {/* Platform Badge */}
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">{pl ? 'Stanowisko / Peron' : 'Platform'}</span>
                          <span className="bg-amber-950/80 text-amber-300 border border-amber-800/60 px-2.5 py-1 rounded-lg text-xs font-black inline-block">
                            📍 {item.platform}
                          </span>
                        </div>

                        {/* Expand Stops Button */}
                        <button
                          type="button"
                          onClick={() => setExpandedDepartureId(isExpanded ? null : item.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border ${
                            isExpanded
                              ? 'bg-indigo-600 text-white border-indigo-400'
                              : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                          }`}
                        >
                          <span>{isExpanded ? (pl ? 'Zwiń przystanki' : 'Hide stops') : (pl ? 'Przystanki & Bilety' : 'Stops & Fares')}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Facilities Chips Bar */}
                    <div className="px-4 sm:px-5 pb-3 flex items-center gap-2 flex-wrap text-[11px] text-slate-400 border-t border-slate-850/60 pt-2 bg-slate-950/40">
                      {item.accessibility.stepFree && (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                          <Accessibility className="w-3 h-3" /> {pl ? 'Bez barier ♿' : 'Step-free ♿'}
                        </span>
                      )}
                      {item.accessibility.hasElevator && (
                        <span className="inline-flex items-center gap-1 text-indigo-300 font-bold bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded-md">
                          🛗 {pl ? 'Winda na peron' : 'Elevator'}
                        </span>
                      )}
                      {item.accessibility.diningCar && (
                        <span className="inline-flex items-center gap-1 text-amber-300 font-bold bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-md">
                          🍽️ {pl ? 'Wagon gastronomiczny / WARS' : 'Dining car'}
                        </span>
                      )}
                      {item.accessibility.prioritySeats && (
                        <span className="inline-flex items-center gap-1 text-slate-300 font-bold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                          💺 {pl ? 'Miejsca dla seniorów' : 'Priority seating'}
                        </span>
                      )}
                      {item.accessibility.wifi230V && (
                        <span className="inline-flex items-center gap-1 text-sky-300 font-bold bg-sky-950/40 border border-sky-800/40 px-2 py-0.5 rounded-md">
                          ⚡ WiFi & Gniazdka 230V
                        </span>
                      )}
                    </div>

                    {/* EXPANDED SECTION: ALL INTERMEDIATE STOPS & TICKET RULES */}
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 space-y-4"
                      >
                        {/* Ticket & Senior Fare Guide */}
                        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                              <CreditCard className="w-4 h-4 text-emerald-400" />
                              {pl ? 'Jak kupić bilet i zniżki senioralne:' : 'Fares & Senior Discounts:'}
                            </span>
                            {item.ticketInfo.estimatedPriceEur && (
                              <span className="text-xs font-mono font-black text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded border border-amber-800/60">
                                Szacunek: ~€{item.ticketInfo.estimatedPriceEur.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-200 font-medium">
                            <strong>{item.ticketInfo.systemName}:</strong> {item.ticketInfo.howToPay}
                          </p>
                          <div className="text-xs text-amber-300 font-bold flex items-center gap-1.5 pt-1 border-t border-slate-800">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{item.ticketInfo.seniorDiscount}</span>
                          </div>
                        </div>

                        {/* Intermediate Stops Timeline */}
                        {item.stops && item.stops.length > 0 ? (
                          <div className="space-y-2">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                              📍 {pl ? 'Przebieg trasy i godziny na stacjach pośrednich:' : 'Intermediate Stations & Scheduled Times:'}
                            </span>
                            <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-500/40">
                              {item.stops.map((stop, sIdx) => (
                                <div key={sIdx} className="relative flex items-start justify-between gap-3 text-xs">
                                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-indigo-400 ring-2 ring-slate-900" />
                                  <div className="space-y-0.5">
                                    <span className="font-bold text-white block">
                                      {stop.stationName}
                                    </span>
                                    {stop.notes && (
                                      <span className="text-[10px] text-emerald-400 font-bold block">
                                        ✓ {stop.notes}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0 text-right">
                                    {stop.platform && (
                                      <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                                        Peron {stop.platform}
                                      </span>
                                    )}
                                    <span className="font-mono font-black text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                      {stop.time}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">
                            {pl ? 'Bezpośrednie połączenie bez dodatkowych przystanków pośrednich.' : 'Direct line connection.'}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* ========================================================= */}
          {/* FOOTER BAR                                                */}
          {/* ========================================================= */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{pl ? 'Rozkłady zintegrowane z oficjalnymi sieciami NS, DB, PKP Intercity, SNCB, SNCF oraz komunikacją miejską.' : 'Integrated official European rail & transit schedule network.'}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-5 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 w-full sm:w-auto text-center"
            >
              {pl ? 'Gotowe / Zamknij' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InAppTimetableModal;
