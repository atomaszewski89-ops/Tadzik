import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { SZYMON_WELCOMES, SZYMON_CHAT_FALLBACK_QA } from '../../data/szymonData';
import { 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Mic, 
  MessageSquare, 
  HelpCircle,
  Clock,
  Compass,
  CreditCard,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TadzikChatProps {
  language: Language;
}

interface Message {
  sender: 'user' | 'tadzik';
  text: string;
  time: string;
}

export const TadzikChat: React.FC<TadzikChatProps> = ({ language }) => {
  const pl = language === 'pl';
  const nl = language === 'nl';
  const de = language === 'de';

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome message
  useEffect(() => {
    const welcomeText = SZYMON_WELCOMES[language]?.pitch || SZYMON_WELCOMES['pl'].pitch;
    setMessages([
      {
        sender: 'tadzik',
        text: welcomeText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, [language]);

  // Scroll chat messages container only (does NOT scroll the browser window or page)
  useEffect(() => {
    if (chatScrollContainerRef.current && messages.length > 1) {
      chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
    }
  }, [messages.length, isTyping]);

  // Copy message to clipboard
  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Clear chat
  const handleClearChat = () => {
    const welcomeText = SZYMON_WELCOMES[language]?.pitch || SZYMON_WELCOMES['pl'].pitch;
    setMessages([
      {
        sender: 'tadzik',
        text: welcomeText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || userInput).trim();
    if (!text) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text, time: timestamp }]);
    setUserInput('');
    setIsTyping(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('/api/tadzik/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, language }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data?.text) {
          setMessages(prev => [...prev, { sender: 'tadzik', text: data.text, time: timestamp }]);
          setIsTyping(false);
          return;
        }
      }
      throw new Error('API route offline');
    } catch (e) {
      console.info('Tadzik instant local guidance engine active');
      const queryLower = text.toLowerCase();
      const foundQa = SZYMON_CHAT_FALLBACK_QA.find(qa => 
        qa.keywords.some(kw => queryLower.includes(kw))
      );

      let fallbackAnswer = '';
      if (foundQa) {
        fallbackAnswer = foundQa.answer[language] || foundQa.answer['pl'] || foundQa.answer['en'];
      } else {
        if (pl) {
          fallbackAnswer = `### Dziękuję za pytanie! 🧭\n\nJako Twój wierny pomocnik **Tadzik** chętnie doradzę:\n- **Godziny poza szczytem (9:00 - 16:00)**: Zawsze podróżuj w tych godzinach – unikniesz tłumów i zaoszczędzisz na biletach.\n- **Spokojny powrót**: Zaplanuj powrót z zapasem czasowym, aby być w domu przed zmrokiem.\n- **Wygodne przesiadki**: Na stacjach korzystaj z wind i pytaj konduktorów – w Europie zawsze chętnie pomagają seniorom!\n- Sprawdź zakładkę **Ustal Bezpieczną Trasę**, aby zobaczyć szczegółowy plan podróży krok po kroku.`;
        } else if (nl) {
          fallbackAnswer = `### Bedankt voor je vraag! 🧭\n\nAls jouw persoonlijke reisgenoot **Tadzik** adviseer ik:\n- **Daluren (09:00 - 16:00)**: Reis bij voorkeur buiten de spits voor rust en goedkopere treinkaartjes.\n- **Veilig voor het donker**: Zorg dat je vertrek op tijd gepland is om voor zonsondergang thuis te zijn.\n- **Toegankelijkheid**: Maak gebruik van de liften op stations en de gratis assistentie van NS of De Lijn!\n- Bekijk het tabblad **Veilige Route** voor een compleet reisplan met overstappen en prijzen.`;
        } else {
          fallbackAnswer = `### Thank you for your question! 🧭\n\nAs your travel companion **Tadzik**, here is my top advice:\n- **Off-peak transit (09:00 - 16:00)**: Travel during quiet daytime hours to secure a comfortable seat and lower fares.\n- **Return before dusk**: Plan departure with buffer time to arrive home safely before dark.\n- **Elevators & Assistance**: Look for station elevators and don't hesitate to request conductor assistance.\n- Check our **Set Safe Route** tab for a complete step-by-step transit itinerary with pricing!`;
        }
      }

      setMessages(prev => [...prev, { sender: 'tadzik', text: fallbackAnswer, time: timestamp }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Quick Prompt Chips
  const quickPrompts = [
    { label: pl ? 'Gdzie tanie bilety kolejowe?' : 'Cheap train tickets?', icon: CreditCard },
    { label: pl ? 'Czyste toalety na trasie 🚻' : 'Clean restrooms on route 🚻', icon: MapPin },
    { label: pl ? 'Udogodnienia dla wózków ♿' : 'Wheelchair & elevator access ♿', icon: Compass },
    { label: pl ? 'Jak wrócić przed zmrokiem?' : 'How to return before dusk?', icon: Clock },
    { label: pl ? 'Zniżki dla seniorów 65+' : 'Senior discounts 65+', icon: Sparkles },
    { label: pl ? 'Najlepsze spokojne kawiarnie ☕' : 'Quiet relaxing cafes ☕', icon: MessageSquare }
  ];

  // Voice Search / Dictation simulation
  const handleVoiceInput = () => {
    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }
    setIsListeningVoice(true);
    const sampleQuestions = [
      pl ? 'Jakie są zniżki na pociągi w Holandii dla seniora?' : 'What are the senior train discounts in the Netherlands?',
      pl ? 'Gdzie znajdę czystą toaletę przy Dworcu Centralnym?' : 'Where can I find a clean restroom near the Central Station?',
      pl ? 'O której godzinie najlepiej wyruszyć w podróż powrotną?' : 'What is the best time to start my return journey?'
    ];
    const picked = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];

    setTimeout(() => {
      setUserInput(picked);
      setIsListeningVoice(false);
      inputRef.current?.focus();
    }, 1200);
  };

  return (
    <div className="space-y-6" id="tadzik-chat-workspace">
      
      {/* Top Helper Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/10 via-teal-900/10 to-emerald-900/10 border border-indigo-200/80 p-5 rounded-3xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-md">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
              <span>{pl ? 'Inteligentny Czat z Tadzikiem 💬' : nl ? 'Slimme Chat met Tadzik 💬' : 'Intelligent Chat with Tadzik 💬'}</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Online
              </span>
            </h4>
            <p className="text-slate-600 text-xs font-semibold leading-relaxed">
              {pl 
                ? 'Zapytaj o cokolwiek: toalety, tanie bilety, windy, bezpieczne godziny odjazdu, lokalne przysmaki i porady na każdą trasę!'
                : 'Ask anything: clean restrooms, senior discounts, station elevators, safe departure times, and local travel secrets!'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="text-xs font-bold text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
          title={pl ? 'Wyczyść rozmowę' : 'Clear conversation'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{pl ? 'Nowa rozmowa' : 'New chat'}</span>
        </button>
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{pl ? 'Szybkie pytania (kliknij, aby zapytać):' : 'Quick questions (click to ask):'}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((qp, idx) => {
            const Icon = qp.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(qp.label)}
                disabled={isTyping}
                className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-200 shadow-2xs hover:shadow-xs flex items-center gap-2 cursor-pointer hover:scale-102 active:scale-98 disabled:opacity-50"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>{qp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-4 sm:p-6 h-[480px] shadow-xl flex flex-col justify-between relative overflow-hidden">
        <div 
          ref={chatScrollContainerRef}
          className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 max-h-[440px]"
        >
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            const isCopied = copiedIndex === index;

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-col max-w-[90%] sm:max-w-[80%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                {/* Header */}
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {isUser ? (pl ? 'Ty' : 'You') : 'Tadzik 🧭'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {msg.time}
                  </span>
                </div>

                {/* Message Bubble */}
                <div className={`p-4 sm:p-5 rounded-3xl text-sm leading-relaxed shadow-md relative group ${
                  isUser 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm font-semibold' 
                    : 'bg-slate-950 text-slate-100 border border-slate-800 rounded-tl-sm font-medium'
                }`}>
                  <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed">
                    {msg.text}
                  </p>

                  {/* Actions for Tadzik's response */}
                  {!isUser && (
                    <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-850 text-xs">
                      {/* Copy */}
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.text, index)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold transition-colors cursor-pointer"
                        title={pl ? 'Kopiuj odpowiedź' : 'Copy'}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? (pl ? 'Skopiowano!' : 'Copied!') : (pl ? 'Kopiuj' : 'Copy')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start max-w-[80%]"
            >
              <span className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider px-1">
                {pl ? 'Tadzik myśli...' : 'Tadzik is thinking...'}
              </span>
              <div className="bg-slate-950 text-slate-200 border border-slate-800 p-4 rounded-3xl rounded-tl-sm shadow-md flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" />
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-400 font-semibold ml-1">
                  {pl ? 'Konsultuję przewodniki i mapy...' : 'Consulting guides and maps...'}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input Box Bar */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              pl 
                ? 'Napisz pytanie do Tadzika (np. „Gdzie w Rotterdamie kupię tani bilet?”, „Kawiarnia ze spokojną muzyką”)...'
                : 'Ask Tadzik a question (e.g. "Where can I buy a cheap day pass in Rotterdam?", "Quiet cafe with easy access")...'
            }
            className="w-full text-sm sm:text-base font-semibold pl-5 pr-24 py-4 bg-white rounded-2xl border-2 border-slate-200 text-slate-900 shadow-sm focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
          />

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
              isListeningVoice
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-md'
                : 'bg-slate-50 text-slate-600 hover:text-indigo-600 border-slate-200 hover:border-indigo-300'
            }`}
            title={pl ? 'Mów do mikrofonu (podpowiedź głosowa)' : 'Voice input'}
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!userInput.trim() || isTyping}
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 text-white font-black text-sm px-6 py-4 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 disabled:hover:scale-100 shrink-0"
        >
          <span>{pl ? 'Zapytaj' : 'Send'}</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
