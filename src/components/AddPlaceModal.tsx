/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Attraction, UserAccount } from '../types';
import { 
  Sparkles, 
  X, 
  Camera, 
  MapPin, 
  Upload, 
  Compass, 
  Clock, 
  Check, 
  Trees, 
  Landmark, 
  Castle, 
  Coffee, 
  Palmtree, 
  FerrisWheel, 
  Flower2, 
  Eye, 
  Award, 
  Euro, 
  Image as ImageIcon,
  Heart,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Sparkle
} from 'lucide-react';

export interface AttractionPhoto {
  id: string;
  url: string;
  caption?: string;
  addedBy?: string;
  date?: string;
  hearts: number;
}

interface AddPlaceModalProps {
  language: Language;
  account: UserAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onPlaceCreated: (newPlace: Attraction, photos: AttractionPhoto[]) => void;
}

// Curated aesthetic preset photos for instant inspiration
const PRESET_INSPIRATIONS = [
  {
    name: { pl: 'Królewski Park & Ogród', en: 'Royal Park & Garden', nl: 'Koninklijk Park' },
    category: 'park',
    url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=900&auto=format&fit=crop&q=80',
    tag: '🌿 Park'
  },
  {
    name: { pl: 'Zabytkowa Uliczka & Zamek', en: 'Historic Castle & Town', nl: 'Historisch Kasteel' },
    category: 'historical',
    url: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=900&auto=format&fit=crop&q=80',
    tag: '🏰 Historia'
  },
  {
    name: { pl: 'Malowniczy Kanał o Zmierzchu', en: 'Scenic Sunset Canal', nl: 'Sfeervolle Gracht' },
    category: 'waterway',
    url: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=900&auto=format&fit=crop&q=80',
    tag: '⛵ Woda'
  },
  {
    name: { pl: 'Słoneczna Leśna Przystań', en: 'Sunlit Forest Sanctuary', nl: 'Zonnig Bos' },
    category: 'forest',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80',
    tag: '🌲 Las'
  },
  {
    name: { pl: 'Przytulna Kawiarnia ze Smakiem', en: 'Artisan Cafe & Terrace', nl: 'Gezellig Café' },
    category: 'restaurant_cafe',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80',
    tag: '☕ Kawiarnia'
  },
  {
    name: { pl: 'Złocista Plaża & Wydmy', en: 'Golden Beach & Dunes', nl: 'Gouden Strand' },
    category: 'beach',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80',
    tag: '🏖️ Plaża'
  }
];

// Popular cities categorized by countries
const POPULAR_CITIES = [
  { country: '🇳🇱 NL', name: 'Rotterdam', region: 'Zuid-Holland' },
  { country: '🇳🇱 NL', name: 'Amsterdam', region: 'Noord-Holland' },
  { country: '🇳🇱 NL', name: 'Utrecht', region: 'Utrecht' },
  { country: '🇳🇱 NL', name: 'Haga (Den Haag)', region: 'Zuid-Holland' },
  { country: '🇧🇪 BE', name: 'Bruksela (Brussels)', region: 'Brussels-Capital' },
  { country: '🇧🇪 BE', name: 'Brugia (Bruges)', region: 'Flanders' },
  { country: '🇧🇪 BE', name: 'Antwerpia', region: 'Flanders' },
  { country: '🇫🇷 FR', name: 'Paryż (Paris)', region: 'Île-de-France' },
  { country: '🇫🇷 FR', name: 'Strasburg', region: 'Grand Est' },
  { country: '🇩🇪 DE', name: 'Berlin', region: 'Berlin' },
  { country: '🇩🇪 DE', name: 'Poczdam (Potsdam)', region: 'Brandenburg' },
  { country: '🇵🇱 PL', name: 'Kraków', region: 'Małopolska' },
  { country: '🇵🇱 PL', name: 'Warszawa', region: 'Mazowsze' },
  { country: '🇵🇱 PL', name: 'Gdańsk', region: 'Pomorze' },
  { country: '🇵🇱 PL', name: 'Wrocław', region: 'Dolny Śląsk' },
  { country: '🇵🇱 PL', name: 'Zakopane', region: 'Małopolska' }
];

const CATEGORY_OPTIONS = [
  { id: 'park', icon: Flower2, label: { pl: 'Park i Zieleń', en: 'Park & Greenery', nl: 'Park en Groen' }, color: 'from-emerald-500/20 to-teal-500/10 border-emerald-400 text-emerald-950' },
  { id: 'forest', icon: Trees, label: { pl: 'Las i Ścieżki', en: 'Forest & Nature', nl: 'Bos en Natuur' }, color: 'from-green-500/20 to-emerald-500/10 border-green-500 text-green-950' },
  { id: 'historical', icon: Castle, label: { pl: 'Zabytek i Historia', en: 'Historic Landmark', nl: 'Historisch Monument' }, color: 'from-stone-500/20 to-amber-500/10 border-stone-400 text-stone-950' },
  { id: 'museum', icon: Landmark, label: { pl: 'Muzeum i Sztuka', en: 'Museum & Art', nl: 'Museum en Kunst' }, color: 'from-amber-500/20 to-orange-500/10 border-amber-400 text-amber-950' },
  { id: 'romantic', icon: Heart, label: { pl: 'Romantyczny Zakątek', en: 'Romantic Viewpoint', nl: 'Romantische Plek' }, color: 'from-rose-500/20 to-pink-500/10 border-rose-400 text-rose-950' },
  { id: 'beach', icon: Palmtree, label: { pl: 'Plaża i Wybrzeże', en: 'Beach & Coastal', nl: 'Strand en Kust' }, color: 'from-sky-500/20 to-blue-500/10 border-sky-400 text-sky-950' },
  { id: 'restaurant_cafe', icon: Coffee, label: { pl: 'Kawiarnia z Klimatem', en: 'Atmospheric Cafe', nl: 'Sfeervol Café' }, color: 'from-orange-500/20 to-amber-500/10 border-orange-400 text-orange-950' },
  { id: 'adult_park', icon: FerrisWheel, label: { pl: 'Rozrywka i Atrakcja', en: 'Attraction & Fun', nl: 'Attractie en Plezier' }, color: 'from-purple-500/20 to-indigo-500/10 border-purple-400 text-purple-950' },
  { id: 'toddler_park', icon: Sparkles, label: { pl: 'Dla Rodzin i Dzieci', en: 'Family & Kids', nl: 'Familie en Kinderen' }, color: 'from-pink-500/20 to-rose-500/10 border-pink-400 text-pink-950' }
];

const VIBE_OPTIONS = [
  { id: 'peace and quiet', label: { pl: '🌿 Oaza ciszy i relaksu', en: '🌿 Peaceful and relaxing', nl: '🌿 Rust en ontspanning' } },
  { id: 'romantic sunset', label: { pl: '🌅 Złoty zachód słońca', en: '🌅 Romantic sunset', nl: '🌅 Romantische zonsondergang' } },
  { id: 'family adventure', label: { pl: '🧗 Rodzinna przygoda', en: '🧗 Family adventure', nl: '🧗 Familie avontuur' } },
  { id: 'historic discovery', label: { pl: '🏰 Śladami dawnych wieków', en: '🏰 Historic discovery', nl: '🏰 Historische ontdekking' } },
  { id: 'remote work', label: { pl: '☕ Idealne z kawą / książką', en: '☕ Perfect for cafe/book', nl: '☕ Ideaal voor koffie/boek' } }
];

const ACCESSIBILITY_TAGS = [
  { id: 'flat', label: { pl: '♿ Płaski teren / bez schodów', en: '♿ Flat terrain / no stairs', nl: '♿ Vlak terrein' } },
  { id: 'benches', label: { pl: '🪑 Dużo ławek do odpoczynku', en: '🪑 Plenty of resting benches', nl: '🪑 Veel bankjes' } },
  { id: 'toilets', label: { pl: '🚻 Toaleta w pobliżu', en: '🚻 Clean restrooms nearby', nl: '🚻 Toilet in de buurt' } },
  { id: 'cafe', label: { pl: '☕ Kawiarnia / gastronomia', en: '☕ Cafe on site', nl: '☕ Horeca aanwezig' } },
  { id: 'shadow', label: { pl: '🌳 Zacienione alejki', en: '🌳 Shaded paths', nl: '🌳 Schaduwrijke paden' } },
  { id: 'free', label: { pl: '🎫 Wstęp w 100% bezpłatny', en: '🎫 100% Free admission', nl: '🎫 Gratis toegang' } }
];

export default function AddPlaceModal({
  language,
  account,
  isOpen,
  onClose,
  onPlaceCreated
}: AddPlaceModalProps) {
  // Form State
  const [name, setName] = useState('');
  const [city, setCity] = useState('Rotterdam');
  const [customCity, setCustomCity] = useState('');
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [category, setCategory] = useState<string>('park');
  const [vibe, setVibe] = useState('peace and quiet');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['flat', 'benches']);
  
  // Budget & Duration
  const [isFree, setIsFree] = useState(true);
  const [adultBudget, setAdultBudget] = useState(0);
  const [childBudget, setChildBudget] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [transitLine, setTransitLine] = useState('');
  const [transitStop, setTransitStop] = useState('');

  // Photos (up to 3)
  const [photos, setPhotos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentCityName = isCustomCity ? (customCity.trim() || 'Wspaniałe Miasto') : city;

  // Handle Tag toggle
  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => 
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  // Upload file to photos
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && photos.length < 3) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => [...prev, reader.result as string].slice(0, 3));
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag & drop upload
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0] && photos.length < 3) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => [...prev, reader.result as string].slice(0, 3));
      };
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  // Add preset inspiration photo
  const handleAddPreset = (url: string) => {
    if (photos.length < 3 && !photos.includes(url)) {
      setPhotos((prev) => [...prev, url]);
    }
  };

  // Handle URL Add
  const handleAddUrl = () => {
    if (urlInput.trim() && photos.length < 3) {
      setPhotos((prev) => [...prev, urlInput.trim()]);
      setUrlInput('');
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `custom-spot-${Date.now()}`;
    const authorName = account ? account.username : 'Odkrywca_Tadzik';

    // Infer region from city
    const matchedCity = POPULAR_CITIES.find(c => c.name === city);
    const region = matchedCity ? matchedCity.region : 'Europa';

    // Assemble rich tags in description
    const tagLabels = selectedTags
      .map(id => ACCESSIBILITY_TAGS.find(t => t.id === id)?.label[language as 'pl' | 'en' | 'nl'] || '')
      .filter(Boolean)
      .join(' • ');

    const finalDescription = description.trim() || 
      (language === 'pl' ? 'Urokliwe i godne polecenia miejsce na mapie wspólnych odkryć.' : 'A picturesque and welcoming spot recommended by local explorers.');

    const newPlace: Attraction = {
      id: newId,
      name: name.trim(),
      city: currentCityName,
      region: region,
      category: category as any,
      moods: [vibe, ...(tagLabels ? [tagLabels] : [])],
      coordinates: { lat: 52.0000, lng: 5.0000 },
      adultVersion: {
        description: finalDescription,
        budget: isFree ? 0 : (adultBudget || 0),
        durationMinutes: durationMinutes || 60
      },
      childVersion: {
        description: finalDescription,
        budget: isFree ? 0 : (childBudget || 0),
        durationMinutes: durationMinutes || 60
      },
      transport: {
        type: 'bus',
        line: transitLine.trim() || '10',
        destination: 'Centrum',
        stopName: transitStop.trim() || `${name.trim()} - Główny Przystanek`,
        platform: 'A',
        scheduleMinutes: [10, 30, 50]
      }
    };

    // Prepare photos list
    const finalPhotosList: AttractionPhoto[] = [];
    const defaultCover = PRESET_INSPIRATIONS.find(p => p.category === category)?.url || PRESET_INSPIRATIONS[0].url;

    if (photos.length === 0) {
      finalPhotosList.push({
        id: `photo-${newId}-default`,
        url: defaultCover,
        caption: language === 'pl' ? `Widok ${name.trim()}` : `View of ${name.trim()}`,
        addedBy: authorName,
        date: new Date().toISOString().split('T')[0],
        hearts: 5
      });
    } else {
      photos.forEach((urlOrBase64, index) => {
        finalPhotosList.push({
          id: `photo-${newId}-${index + 1}`,
          url: urlOrBase64,
          caption: language === 'pl' ? `Zdjęcie ${index + 1} - ${name.trim()}` : `Photo ${index + 1} of ${name.trim()}`,
          addedBy: authorName,
          date: new Date().toISOString().split('T')[0],
          hearts: 5 - index
        });
      });
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      onPlaceCreated(newPlace, finalPhotosList);
      onClose();
      setSubmittedSuccess(false);
    }, 1200);
  };

  const selectedCategoryObj = CATEGORY_OPTIONS.find(c => c.id === category) || CATEGORY_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white rounded-3xl border border-slate-200/90 max-w-4xl w-full overflow-hidden shadow-2xl relative my-auto flex flex-col max-h-[92vh]"
        id="add-place-timeless-modal"
      >
        {/* ========================================================= */}
        {/* HERO HEADER                                               */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative border-b border-indigo-900/60 shrink-0">
          {/* Ambient background sparkle glow */}
          <div className="absolute top-0 right-0 w-96 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white p-2 rounded-full cursor-pointer transition-all duration-200"
            title={language === 'pl' ? 'Zamknij' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-8">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 border border-amber-300">
                <Sparkles className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    {language === 'pl' ? 'Współtwórz Przewodnik ✦' : 'Community Explorer ✦'}
                  </span>
                  <span className="text-xs text-amber-300 font-bold hidden md:inline">
                    {language === 'pl' ? '🎫 Tworzy nową naklejkę w Paszporcie (+50 XP)' : '🎫 Creates new Passport Sticker (+50 XP)'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  {language === 'pl' 
                    ? 'Dodaj nowe miejsce do zwiedzania' 
                    : language === 'nl' 
                    ? 'Voeg een nieuwe bezienswaardigheid toe' 
                    : 'Add a new spot to explore'}
                </h2>
              </div>
            </div>

            {/* Tab switch for mobile / quick toggle */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10 self-stretch sm:self-auto justify-center">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'form' 
                    ? 'bg-amber-400 text-slate-950 shadow-sm' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                📝 {language === 'pl' ? 'Kreator wpisu' : 'Editor'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'preview' 
                    ? 'bg-amber-400 text-slate-950 shadow-sm' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{language === 'pl' ? 'Podgląd na żywo' : 'Live Preview'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODAL BODY (FORM OR PREVIEW)                              */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          
          {submittedSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg border-2 border-emerald-300">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5] animate-bounce" />
              </div>
              <div className="space-y-1">
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {language === 'pl' ? '✨ Nowa Naklejka w Paszporcie!' : '✨ New Passport Sticker Created!'}
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
                  {language === 'pl' ? 'Miejsce i Naklejka dodane pomyślnie! 🎉' : 'Place & Sticker successfully created! 🎉'}
                </h3>
              </div>

              {/* Generated Sticker preview card */}
              <div className="bg-white border-2 border-amber-400 rounded-2xl p-4 shadow-md max-w-xs w-full flex items-center gap-3">
                <div className="text-3xl p-2 bg-amber-50 rounded-xl border border-amber-200">
                  {category === 'park' ? '🌿' : category === 'forest' ? '🌲' : category === 'museum' ? '🏛️' : category === 'historical_site' ? '🏰' : '📍'}
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-black text-amber-700 uppercase">Nowa Naklejka Paszportu</span>
                  <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{name || 'Twoje Miejsce'}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">📍 {currentCityName}</p>
                </div>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm font-semibold max-w-md">
                {language === 'pl' 
                  ? 'Twoje odkrycie jest już widoczne w Przewodniku oraz w Paszporcie Podróżnika ze stemplem i weryfikacją GPS!' 
                  : 'Your spot is now live in the Guide and Traveler Passport with verified GPS and QR check-in!'}
              </p>
            </div>
          ) : activeTab === 'preview' ? (
            /* ======================================================= */
            /* LIVE PREVIEW SCREEN                                     */
            /* ======================================================= */
            <div className="max-w-xl mx-auto space-y-4 py-2">
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs font-bold text-amber-900">
                <Sparkle className="w-5 h-5 text-amber-600 shrink-0 animate-spin" />
                <span>
                  {language === 'pl' 
                    ? 'Tak Twoje miejsce będzie wyglądać w oficjalnej liście atrakcji dla każdego użytkownika:' 
                    : 'This is how your spot will look on the official attractions list:'}
                </span>
              </div>

              {/* Mock Rendered Attraction Card */}
              <div className="bg-white rounded-3xl border-2 border-indigo-200/80 p-5 shadow-xl space-y-4 overflow-hidden relative">
                {/* Image Cover */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={photos[0] || PRESET_INSPIRATIONS.find(p => p.category === category)?.url || PRESET_INSPIRATIONS[0].url}
                    alt="Preview cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-black px-2.5 py-1 rounded-lg border border-white/20">
                      📍 {currentCityName}
                    </span>
                    <span className="bg-emerald-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm">
                      👤 {language === 'pl' ? 'Współtwórca' : 'Community'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-black px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1">
                    <Euro className="w-3.5 h-3.5" />
                    <span>{isFree ? (language === 'pl' ? 'Wstęp bezpłatny' : 'Free') : `${adultBudget} € / os.`}</span>
                  </div>
                </div>

                {/* Card Title & Meta */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xl font-black text-slate-950 tracking-tight">
                      {name || (language === 'pl' ? 'Nazwa Twojego Miejsca' : 'Your Spot Name')}
                    </h4>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{durationMinutes} min</span>
                    </span>
                  </div>
                  <p className="text-xs text-indigo-900 font-extrabold mt-0.5">
                    {selectedCategoryObj.label[language as 'pl' | 'en' | 'nl']} • {vibe}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                  "{description || (language === 'pl' ? 'Opis miejsca, udogodnienia i porady dla seniorów oraz rodzin z dziećmi...' : 'Spot description and travel tips...')}"
                </p>

                {/* Tags */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedTags.map((tagId) => {
                      const tagObj = ACCESSIBILITY_TAGS.find(t => t.id === tagId);
                      if (!tagObj) return null;
                      return (
                        <span key={tagId} className="text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200/80 px-2 py-0.5 rounded-md">
                          {tagObj.label[language as 'pl' | 'en' | 'nl']}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('form')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow cursor-pointer transition-all"
                  >
                    ✏️ {language === 'pl' ? 'Wróć do edycji' : 'Back to Editing'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ======================================================= */
            /* FULL INTERACTIVE FORM                                  */
            /* ======================================================= */
            <form onSubmit={handleSubmit} className="space-y-6" id="create-place-form">
              
              {/* SECTION 1: NAME & CITY SELECTOR */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">1</span>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">
                    {language === 'pl' ? 'Podstawowe informacje i lokalizacja' : 'Basic Info & Location'}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-900 font-extrabold text-xs mb-1" htmlFor="place-name-input">
                      {language === 'pl' ? 'Nazwa miejsca / atrakcji *' : 'Spot / Attraction Name *'}
                    </label>
                    <input
                      type="text"
                      id="place-name-input"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'pl' ? 'np. Ogrody Botaniczne Trompenburg, Ukryty Pałacyk, Kawiarnia u Jana' : 'e.g. Trompenburg Botanical Garden, Secret Canal View'}
                      className="w-full text-sm sm:text-base p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    />
                  </div>

                  {/* City selector pills + custom option */}
                  <div>
                    <label className="block text-slate-900 font-extrabold text-xs mb-1.5">
                      {language === 'pl' ? 'Wybierz miasto lub wpisz własne *' : 'Select City or Type Custom *'}
                    </label>
                    
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200 scrollbar-none">
                      {POPULAR_CITIES.map((c) => {
                        const isSelected = !isCustomCity && city === c.name;
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => {
                              setIsCustomCity(false);
                              setCity(c.name);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            <span className="opacity-80 text-[10px] mr-1">{c.country}</span>
                            <span>{c.name}</span>
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => setIsCustomCity(true)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                          isCustomCity 
                            ? 'bg-amber-400 text-slate-950 font-black shadow-xs' 
                            : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                        }`}
                      >
                        ✍️ {language === 'pl' ? '+ Wpisz inne miasto' : '+ Other city'}
                      </button>
                    </div>

                    {isCustomCity && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2"
                      >
                        <input
                          type="text"
                          required={isCustomCity}
                          value={customCity}
                          onChange={(e) => setCustomCity(e.target.value)}
                          placeholder={language === 'pl' ? 'Wpisz nazwę miasta (np. Delft, Sopot, Lyon)...' : 'Type city name...'}
                          className="w-full text-xs sm:text-sm p-2.5 bg-white border-2 border-amber-400 rounded-xl font-bold text-slate-900 outline-none"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: CATEGORY & VIBE SELECTION */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">2</span>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">
                    {language === 'pl' ? 'Kategoria i charakter miejsca' : 'Category & Atmosphere'}
                  </h3>
                </div>

                {/* Category Grid */}
                <div>
                  <label className="block text-slate-900 font-extrabold text-xs mb-2">
                    {language === 'pl' ? 'Wybierz kategorię *' : 'Choose Category *'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {CATEGORY_OPTIONS.map((cat) => {
                      const Icon = cat.icon;
                      const isCatSelected = category === cat.id;

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                            isCatSelected
                              ? `bg-gradient-to-br ${cat.color} border-indigo-600 shadow-md ring-2 ring-indigo-500/20 scale-[1.02]`
                              : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 ${isCatSelected ? 'bg-white shadow-xs' : 'bg-slate-200/70'}`}>
                            <Icon className={`w-4 h-4 stroke-[2.5] ${isCatSelected ? 'text-indigo-600' : 'text-slate-600'}`} />
                          </div>
                          <span className="text-xs font-black leading-tight">
                            {cat.label[language as 'pl' | 'en' | 'nl']}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Vibe selection */}
                <div>
                  <label className="block text-slate-900 font-extrabold text-xs mb-1.5">
                    {language === 'pl' ? 'Jaki klimat panuje w tym miejscu?' : 'What vibe does this spot have?'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {VIBE_OPTIONS.map((v) => {
                      const isVibeSelected = vibe === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setVibe(v.id)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                            isVibeSelected
                              ? 'bg-amber-100 border-amber-400 text-amber-950 font-black shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{v.label[language as 'pl' | 'en' | 'nl']}</span>
                          {isVibeSelected && <Check className="w-3.5 h-3.5 text-amber-800 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accessibility Badges */}
                <div>
                  <label className="block text-slate-900 font-extrabold text-xs mb-1.5">
                    {language === 'pl' ? 'Udogodnienia i ułatwienia (zaznacz pasujące):' : 'Accessibility & Features:'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ACCESSIBILITY_TAGS.map((t) => {
                      const isTagSelected = selectedTags.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => toggleTag(t.id)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isTagSelected
                              ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{t.label[language as 'pl' | 'en' | 'nl']}</span>
                          {isTagSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 3: DESCRIPTION, DURATION & PRICING */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">3</span>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">
                    {language === 'pl' ? 'Opis i praktyczne wskazówki' : 'Description & Practical Tips'}
                  </h3>
                </div>

                <div>
                  <label className="block text-slate-900 font-extrabold text-xs mb-1" htmlFor="place-desc-input">
                    {language === 'pl' ? 'Krótki opis dla podróżników i seniorów *' : 'Short description for visitors *'}
                  </label>
                  <textarea
                    id="place-desc-input"
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={language === 'pl' ? 'Napisz, co warto zobaczyć, w jakich godzinach jest najładniej, czy łatwo dojść i co Cię zachwyciło...' : 'Describe what makes this place special, best time to visit, and accessibility...'}
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pricing Toggle */}
                  <div className="space-y-2">
                    <label className="block text-slate-900 font-extrabold text-xs">
                      {language === 'pl' ? 'Koszt wstępu' : 'Admission Cost'}
                    </label>
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setIsFree(true)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          isFree ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        🆓 {language === 'pl' ? 'Darmowy wstęp (0 €)' : 'Free (0 €)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFree(false)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          !isFree ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        💶 {language === 'pl' ? 'Płatny bilet' : 'Paid Admission'}
                      </button>
                    </div>

                    {!isFree && (
                      <div className="grid grid-cols-2 gap-2 pt-1 animate-in fade-in">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Dorośli (€)</label>
                          <input
                            type="number"
                            min="0"
                            value={adultBudget}
                            onChange={(e) => setAdultBudget(parseInt(e.target.value) || 0)}
                            className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Dzieci (€)</label>
                          <input
                            type="number"
                            min="0"
                            value={childBudget}
                            onChange={(e) => setChildBudget(parseInt(e.target.value) || 0)}
                            className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Duration Slider / Stepper */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-slate-900 font-extrabold text-xs">
                        {language === 'pl' ? 'Sugerowany czas zwiedzania' : 'Estimated Time'}
                      </label>
                      <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        ⏱️ {durationMinutes} min
                      </span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="240"
                      step="15"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>15m (Krótki spacer)</span>
                      <span>1h</span>
                      <span>2h+</span>
                      <span>4h (Pół dnia)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: PHOTO GALLERY & PRESETS */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">4</span>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base">
                      {language === 'pl' ? 'Zdjęcia i galeria (do 3 fotografii)' : 'Photos & Visual Gallery'}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {photos.length}/3 {language === 'pl' ? 'zdjęć' : 'photos'}
                  </span>
                </div>

                {/* 3 Photo Slots Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => {
                    const currentImg = photos[idx];
                    return (
                      <div
                        key={idx}
                        className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${
                          currentImg
                            ? 'border-indigo-600 bg-white shadow-sm'
                            : isDragging
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-slate-300 hover:border-indigo-500 bg-slate-50'
                        }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => {
                          if (!currentImg) {
                            document.getElementById(`photo-slot-uploader-${idx}`)?.click();
                          }
                        }}
                      >
                        {currentImg ? (
                          <>
                            <img
                              src={currentImg}
                              alt={`Slot ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPhotos((prev) => prev.filter((_, i) => i !== idx));
                              }}
                              className="absolute top-1.5 right-1.5 bg-slate-950/80 hover:bg-red-600 text-white p-1 rounded-full shadow transition-colors"
                              title="Usuń zdjęcie"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute bottom-0 inset-x-0 bg-slate-950/70 backdrop-blur-xs py-1 text-center">
                              <span className="text-[10px] text-white font-extrabold">
                                {idx === 0 ? '⭐ Okładka główna' : `Zdjęcie #${idx + 1}`}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-2">
                            <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                            <span className="text-[11px] text-slate-600 font-extrabold block">
                              {idx === 0 ? '+ Okładka' : `+ Zdjęcie #${idx + 1}`}
                            </span>
                            <span className="text-[9px] text-slate-400 hidden sm:block">Kliknij lub upuść</span>
                          </div>
                        )}

                        <input
                          type="file"
                          id={`photo-slot-uploader-${idx}`}
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Instant Curated Inspiration Presets */}
                <div className="pt-2">
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5">
                    {language === 'pl' ? '💡 Brak własnego zdjęcia? Kliknij gotową inspirację:' : '💡 No photo? Click a beautiful preset:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRESET_INSPIRATIONS.map((preset, pIdx) => {
                      const isAdded = photos.includes(preset.url);
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleAddPreset(preset.url)}
                          disabled={photos.length >= 3 || isAdded}
                          className={`flex items-center gap-2 p-1.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                              : photos.length >= 3
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-xs text-slate-800'
                          }`}
                        >
                          <img src={preset.url} alt={preset.tag} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                          <div className="truncate">
                            <span className="text-[10px] font-black text-indigo-600 block">{preset.tag}</span>
                            <span className="text-[11px] truncate block">{preset.name[language as 'pl' | 'en' | 'nl']}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Paste URL option */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder={language === 'pl' ? 'Lub wklej bezpośredni link URL do zdjęcia...' : 'Or paste direct photo URL...'}
                    className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 outline-none focus:bg-white focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    disabled={!urlInput.trim() || photos.length >= 3}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {language === 'pl' ? 'Dodaj link' : 'Add Link'}
                  </button>
                </div>
              </div>

              {/* MODAL ACTIONS FOOTER */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs py-3 px-5 rounded-xl transition-all cursor-pointer"
                >
                  {language === 'pl' ? 'Anuluj' : 'Cancel'}
                </button>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className="flex-1 sm:flex-initial bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-extrabold text-xs py-3 px-4 rounded-xl border border-indigo-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-indigo-700" />
                    <span>{language === 'pl' ? 'Zobacz podgląd' : 'Preview'}</span>
                  </button>

                  <button
                    type="submit"
                    id="submit-place-publish-btn"
                    className="flex-1 sm:flex-initial bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm py-3 px-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
                  >
                    <Sparkles className="w-4 h-4 stroke-[2.5]" />
                    <span>{language === 'pl' ? 'OPUBLIKUJ W PRZEWODNIKU ✦' : 'PUBLISH IN GUIDE ✦'}</span>
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>
      </motion.div>
    </div>
  );
}
