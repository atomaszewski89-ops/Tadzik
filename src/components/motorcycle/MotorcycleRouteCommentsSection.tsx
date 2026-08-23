/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MotorcycleRouteComment, Language } from '../../types';
import { MessageSquare, Send, ThumbsUp, Star, ShieldCheck, Tag, Bike } from 'lucide-react';

interface MotorcycleRouteCommentsSectionProps {
  routeId: string;
  routeTitle: string;
  language: Language;
  currentUsername?: string;
}

const DEFAULT_BIKER_TAGS = [
  '🏍️ Genialne winkle',
  '🏁 Równy, przyczepny asfalt',
  '🍔 Biker-Friendly zajazd',
  '⛽ Stacja z kompresorem',
  '⚠️ Uwaga na piasek w zacienionych łukach',
  '🌄 Niesamowita panorama',
  '☕ Dobra kawa na przełęczy',
  '👮‍♂️ Spokojna trasa bez radarów'
];

const SEEDED_MOTO_COMMENTS: Record<string, MotorcycleRouteComment[]> = {
  'moto-droga-stu-zakretow': [
    {
      id: 'mc-1',
      routeId: 'moto-droga-stu-zakretow',
      authorName: 'Marek „CBR”',
      bikeRidden: 'Honda CBR650R',
      rating: 5,
      text: 'Trasa marzenie! Asfalt po remoncie trzyma jak zły. Zakręt Śmierci robi kolosalne wrażenie, a w Karłowie mnóstwo motocyklistów na parkingu pod Szczelińcem. Polecam jechać rano przed południem.',
      tags: ['🏍️ Genialne winkle', '🏁 Równy, przyczepny asfalt', '☕ Dobra kawa na przełęczy'],
      createdAt: '2026-06-14',
      likes: 18
    },
    {
      id: 'mc-2',
      routeId: 'moto-droga-stu-zakretow',
      authorName: 'Tomasz GS',
      bikeRidden: 'BMW R1250GS Adventure',
      rating: 5,
      text: 'Piękne skały piaskowcowe tuż przy jezdni. W Karłowie zjedliśmy świetny obiad w zajeździe przyjaznym motocyklom. Uważajcie na wilgoć w wąwozie po porannej mgle!',
      tags: ['🍔 Biker-Friendly zajazd', '🌄 Niesamowita panorama', '⚠️ Uwaga na piasek w zacienionych łukach'],
      createdAt: '2026-07-02',
      likes: 12
    }
  ],
  'moto-przelecz-salmopolska': [
    {
      id: 'mc-3',
      routeId: 'moto-przelecz-salmopolska',
      authorName: 'Kuba MT',
      bikeRidden: 'Yamaha MT-09',
      rating: 5,
      text: 'Salmopol to klasyk! Serpentyny ze Szczyrku wyprofilowane wzorowo, a na Białym Krzyżu zawsze świetna atmosfera i dziesiątki maszyn. Oscypek z żurawiną smakuje tu najlepiej.',
      tags: ['🏍️ Genialne winkle', '☕ Dobra kawa na przełęczy'],
      createdAt: '2026-05-28',
      likes: 24
    }
  ],
  'moto-wielka-petla-bieszczadzka': [
    {
      id: 'mc-4',
      routeId: 'moto-wielka-petla-bieszczadzka',
      authorName: 'Rafał Cruiser',
      bikeRidden: 'Harley-Davidson Heritage Classic',
      rating: 5,
      text: 'Siekierezada w Cisnej to punkt obowiązkowy każdego motocyklisty! Widoki na połoniny z Przełęczy Wyżniańskiej zapierają dech. Trasa 144 km to czysta poezja wolności.',
      tags: ['🍔 Biker-Friendly zajazd', '🌄 Niesamowita panorama', '🏁 Równy, przyczepny asfalt'],
      createdAt: '2026-06-20',
      likes: 31
    }
  ]
};

export default function MotorcycleRouteCommentsSection({
  routeId,
  routeTitle,
  language,
  currentUsername
}: MotorcycleRouteCommentsSectionProps) {
  const pl = language === 'pl';
  const storageKey = `tadzik_moto_comments_${routeId}`;

  const [comments, setComments] = useState<MotorcycleRouteComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newRating, setNewRating] = useState<number>(5);
  const [authorName, setAuthorName] = useState(currentUsername || (pl ? 'Motocyklista' : 'Biker'));
  const [bikeRidden, setBikeRidden] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setComments(JSON.parse(stored));
      } else {
        const seeded = SEEDED_MOTO_COMMENTS[routeId] || [
          {
            id: `mc-init-${routeId}`,
            routeId,
            authorName: pl ? 'Brat Motocyklowy' : 'Fellow Rider',
            bikeRidden: 'Suzuki V-Strom 650',
            rating: 5,
            text: pl ? 'Świetna, urozmaicona trasa! Równe łuki, znakomity asfalt i piękne krajobrazy. Zdecydowanie polecam!' : 'Amazing route! Great curves, smooth asphalt and beautiful landscapes.',
            tags: ['🏍️ Genialne winkle', '🏁 Równy, przyczepny asfalt'],
            createdAt: '2026-06-01',
            likes: 8
          }
        ];
        setComments(seeded);
      }
    } catch (e) {
      console.error('Error loading moto comments:', e);
    }
  }, [routeId, storageKey, pl]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleLike = (commentId: string) => {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        const isLiked = !c.likedByMe;
        return {
          ...c,
          likes: isLiked ? c.likes + 1 : c.likes - 1,
          likedByMe: isLiked
        };
      }
      return c;
    });
    setComments(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving likes:', e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: MotorcycleRouteComment = {
      id: 'mc-' + Date.now(),
      routeId,
      authorName: authorName.trim() || (pl ? 'Motocyklista' : 'Biker'),
      bikeRidden: bikeRidden.trim() || undefined,
      rating: newRating,
      text: newCommentText.trim(),
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0,
      likedByMe: false
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving new comment:', err);
    }

    setNewCommentText('');
    setSelectedTags([]);
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-700/60 space-y-4" id={`moto-comments-${routeId}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-400">
          <MessageSquare className="w-4 h-4" />
          <h4 className="text-xs font-black uppercase tracking-wider">
            {pl ? `Komentarze & Wskazówki Motocyklistów (${comments.length})` : `Biker Reviews & Tips (${comments.length})`}
          </h4>
        </div>
        <span className="text-[11px] font-bold text-slate-400">
          ⭐ {pl ? 'Średnia ocen:' : 'Average:'}{' '}
          <strong className="text-amber-400">
            {comments.length > 0
              ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
              : '5.0'}
          </strong>{' '}
          / 5.0
        </span>
      </div>

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Star rating selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-300">{pl ? 'Twoja ocena trasy:' : 'Your Rating:'}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="text-amber-400 hover:scale-125 transition-transform p-0.5 cursor-pointer"
                >
                  <Star
                    className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Author Name & Bike */}
          <div className="flex items-center gap-2 flex-1 max-w-sm justify-end">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={pl ? 'Twój nick' : 'Your name'}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-[11px] text-white font-bold placeholder:text-slate-500 outline-none focus:border-rose-500 w-28"
            />
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-[11px] text-slate-300">
              <Bike className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <input
                type="text"
                value={bikeRidden}
                onChange={(e) => setBikeRidden(e.target.value)}
                placeholder={pl ? 'Twój model moto (np. MT-07, GS1250)' : 'Bike model'}
                className="bg-transparent text-white font-bold placeholder:text-slate-500 outline-none w-36 text-[10px]"
              />
            </div>
          </div>
        </div>

        {/* Quick biker tags selector */}
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wide flex items-center gap-1">
            <Tag className="w-3 h-3 text-rose-400" />
            {pl ? 'Wybierz szybkie tagi dla innych motocyklistów:' : 'Select quick biker tags:'}
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {DEFAULT_BIKER_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer font-bold select-none ${
                    isSelected
                      ? 'bg-rose-600 border-rose-400 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment Text Area */}
        <textarea
          rows={2}
          required
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder={pl ? 'Podziel się stanem asfaltu, winklami, gdzie jest dobry zajazd lub na co uważać...' : 'Share road condition, twisties, recommended biker stops...'}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-rose-500 font-medium"
        />

        {/* Submit */}
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{pl ? 'Komentarz widoczny dla społeczności Tadzika' : 'Visible to Tadzik rider community'}</span>
          </p>
          <button
            type="submit"
            className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-rose-600/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{pl ? 'Dodaj Opinię' : 'Post Tip'}</span>
          </button>
        </div>
      </form>

      {/* List of comments */}
      <div className="space-y-2.5">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-1.5 transition-all hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-xs font-black text-rose-300">
                  {comment.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-200">{comment.authorName}</span>
                    {comment.bikeRidden && (
                      <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full border border-slate-700 font-mono font-bold flex items-center gap-1">
                        <span>🏍️</span>
                        <span>{comment.bikeRidden}</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 font-semibold">{comment.createdAt}</span>
                </div>
              </div>

              {/* Rating stars & Likes */}
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${s <= comment.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleLike(comment.id)}
                  className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                    comment.likedByMe
                      ? 'bg-rose-500/20 border-rose-500/60 text-rose-400 font-black'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ThumbsUp className={`w-3 h-3 ${comment.likedByMe ? 'fill-rose-400' : ''}`} />
                  <span>{comment.likes}</span>
                </button>
              </div>
            </div>

            {/* Comment Text */}
            <p className="text-xs text-slate-300 leading-relaxed font-medium pl-8">
              {comment.text}
            </p>

            {/* Tags */}
            {comment.tags && comment.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pl-8 pt-0.5">
                {comment.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-md font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
