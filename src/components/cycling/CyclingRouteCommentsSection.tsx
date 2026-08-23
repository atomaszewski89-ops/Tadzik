import React, { useState, useEffect } from 'react';
import { CyclingRouteComment, Language } from '../../types';
import { 
  getCyclingRouteComments, 
  saveCyclingRouteComment, 
  toggleLikeCyclingComment 
} from '../../data/cyclingReviews';
import { 
  MessageSquare, Star, ThumbsUp, Send, Plus, Check, Heart, ShieldCheck, Sparkles 
} from 'lucide-react';

interface CyclingRouteCommentsSectionProps {
  routeId: string;
  routeTitle: string;
  language: Language;
  defaultAuthor?: string;
  onCommentsUpdated?: (count: number, avgRating: number) => void;
}

const QUICK_TAGS_PL = [
  '🟢 Gładki asfalt',
  '🌲 Cudowny cień w upał',
  '☕ Pyszna kawiarnia na trasie',
  '🪑 Dużo ławek do odpoczynku',
  '⚡ E-Bike friendly',
  '🚰 Darmowa woda pitna',
  '📸 Przepiękne widoki',
  '🛡️ 100% bez aut i bezpiecznie'
];

const QUICK_TAGS_EN = [
  '🟢 Smooth paved path',
  '🌲 Great shade in heat',
  '☕ Nice cafe stop',
  '🪑 Plenty of rest benches',
  '⚡ E-Bike friendly',
  '🚰 Free water fountain',
  '📸 Stunning vistas',
  '🛡️ 100% car-free and safe'
];

export default function CyclingRouteCommentsSection({
  routeId,
  routeTitle,
  language,
  defaultAuthor,
  onCommentsUpdated
}: CyclingRouteCommentsSectionProps) {
  const pl = language === 'pl';
  const [comments, setComments] = useState<CyclingRouteComment[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [authorName, setAuthorName] = useState(defaultAuthor || (pl ? 'Rowerzysta' : 'Cyclist'));
  const [rating, setRating] = useState<number>(5);
  const [commentText, setCommentText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [justPosted, setJustPosted] = useState(false);

  useEffect(() => {
    loadComments();
  }, [routeId]);

  const loadComments = () => {
    const list = getCyclingRouteComments(routeId);
    setComments(list);
    if (onCommentsUpdated && list.length > 0) {
      const avg = list.reduce((acc, c) => acc + c.rating, 0) / list.length;
      onCommentsUpdated(list.length, Number(avg.toFixed(1)));
    }
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleLike = (commentId: string) => {
    toggleLikeCyclingComment(routeId, commentId);
    loadComments();
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const saved = saveCyclingRouteComment(routeId, {
      routeId,
      authorName: authorName.trim() || (pl ? 'Anonimowy Rowerzysta' : 'Anonymous Cyclist'),
      rating,
      text: commentText.trim(),
      tags: selectedTags
    });

    setCommentText('');
    setSelectedTags([]);
    setJustPosted(true);
    setTimeout(() => setJustPosted(false), 3000);
    setShowAddForm(false);
    loadComments();
  };

  const quickTags = pl ? QUICK_TAGS_PL : QUICK_TAGS_EN;
  const avgScore = comments.length > 0
    ? (comments.reduce((acc, c) => acc + c.rating, 0) / comments.length).toFixed(1)
    : '5.0';

  return (
    <div className="mt-4 pt-4 border-t border-slate-700/80 space-y-4">
      {/* Header & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>{pl ? 'Komentarze i Opinie Rowerzystów' : 'Cyclist Comments & Reviews'}</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono font-bold">
                {comments.length}
              </span>
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{avgScore} / 5.0</span>
              <span className="text-slate-400 font-normal text-[11px]">
                ({comments.length} {pl ? (comments.length === 1 ? 'opinia' : 'opinii') : 'reviews'})
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-black px-3.5 py-2 rounded-xl border border-indigo-400/30 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm hover:scale-102 active:scale-98"
        >
          {showAddForm ? (
            <span>{pl ? 'Schowaj formularz' : 'Hide form'}</span>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>{pl ? 'Napisz Komentarz ✍️' : 'Add Comment ✍️'}</span>
            </>
          )}
        </button>
      </div>

      {justPosted && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{pl ? 'Dziękujemy! Twój komentarz został pomyślnie opublikowany dla innych rowerzystów.' : 'Thank you! Your review was successfully published.'}</span>
        </div>
      )}

      {/* Add Comment Form */}
      {showAddForm && (
        <form onSubmit={handleSubmitComment} className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-4 space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{pl ? 'Podziel się wrażeniami ze szlaku:' : 'Share your trail review:'}</span>
            </span>

            {/* Star selector */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <Star className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-300 ml-1">{rating}/5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={pl ? 'Twoje imię / Nick' : 'Your name / Nick'}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold outline-none focus:border-indigo-500"
            />
          </div>

          {/* Quick Tags selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {pl ? 'Wybierz szybkie tagi / atuty szlaku:' : 'Pick quick feature tags:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            required
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={pl ? 'Jak oceniasz nawierzchnię, czy były otwarte kawiarnie, czy polecasz trasę seniorom lub rodzinom...' : 'How was the road surface, did you enjoy the scenery, cafe recommendations...'}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 resize-none font-medium"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 text-xs font-bold cursor-pointer"
            >
              {pl ? 'Anuluj' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{pl ? 'Opublikuj Komentarz' : 'Post Review'}</span>
            </button>
          </div>
        </form>
      )}

      {/* List of comments */}
      {comments.length === 0 ? (
        <div className="p-4 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 text-center">
          <p className="text-xs text-slate-400 font-medium">
            {pl ? 'Brak komentarzy do tej trasy. Bądź pierwszym rowerzystą, który zostawi wskazówki!' : 'No reviews yet. Be the first cyclist to share tips!'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {comments.map((comm) => (
            <div
              key={comm.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-3.5 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center text-white text-xs font-black shadow-inner">
                    {comm.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{comm.authorName}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Zweryfikowany rowerzysta" />
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{comm.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${s <= comm.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {comm.text}
              </p>

              {comm.tags && comm.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {comm.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-950/50 text-indigo-300 border border-indigo-800/40 text-[10px] font-bold px-2 py-0.5 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end pt-1">
                <button
                  type="button"
                  onClick={() => handleLike(comm.id)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    comm.likedByMe
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${comm.likedByMe ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{comm.likes || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
