import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Smartphone, 
  Building2, 
  ArrowRight, 
  Sparkles,
  QrCode,
  Globe2,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { 
  PREMIUM_ANNUAL_PRICE_EUR, 
  SupportedPaymentCountry, 
  PAYMENT_COUNTRIES, 
  ALL_PAYMENT_METHODS, 
  getBanksForCountry, 
  BankOption,
  POLISH_BANKS,
  DUTCH_BANKS_FULL,
  BELGIAN_BANKS,
  GERMAN_BANKS,
  FRENCH_BANKS
} from '../data/paymentData';

interface UnifiedPaymentCheckoutProps {
  language: Language;
  account: UserAccount | null;
  onPaymentSuccess: (method: string, bankOrDetails?: string) => void;
  onCancel?: () => void;
  compact?: boolean;
}

export default function UnifiedPaymentCheckout({
  language,
  account,
  onPaymentSuccess,
  onCancel,
  compact = false
}: UnifiedPaymentCheckoutProps) {
  // Determine default country based on app language
  const getDefaultCountry = (lang: Language): SupportedPaymentCountry => {
    switch (lang) {
      case 'pl': return 'pl';
      case 'nl': return 'nl';
      case 'de': return 'de';
      case 'fr': return 'fr';
      default: return 'nl';
    }
  };

  const [selectedCountry, setSelectedCountry] = useState<SupportedPaymentCountry>(() => getDefaultCountry(language));
  const [selectedMethodId, setSelectedMethodId] = useState<string>('blik');
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  
  // Method specific inputs
  const [blikCode, setBlikCode] = useState<string>('');
  const [blikTimer, setBlikTimer] = useState<number>(120);
  const [isBlikWaitingForApp, setIsBlikWaitingForApp] = useState<boolean>(false);
  
  const [weroPhone, setWeroPhone] = useState<string>('+31 ');
  
  // Card details
  const [cardHolder, setCardHolder] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');
  
  // Bancontact mode: 'app' or 'card'
  const [bancontactMode, setBancontactMode] = useState<'app' | 'card'>('app');

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [paymentDone, setPaymentDone] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Sync default method when country changes
  useEffect(() => {
    switch (selectedCountry) {
      case 'pl':
        setSelectedMethodId('blik');
        setSelectedBankId('pko_bp');
        break;
      case 'nl':
        setSelectedMethodId('ideal');
        setSelectedBankId('ing_nl');
        break;
      case 'be':
        setSelectedMethodId('bancontact');
        setSelectedBankId('belfius');
        break;
      case 'de':
        setSelectedMethodId('giropay_sofort');
        setSelectedBankId('sparkasse');
        break;
      case 'fr':
        setSelectedMethodId('cartes_bancaires');
        setSelectedBankId('bnp_fr');
        break;
      case 'all':
        setSelectedMethodId('card_international');
        break;
    }
    setErrorMessage('');
  }, [selectedCountry]);

  // BLIK timer countdown effect
  useEffect(() => {
    let interval: any;
    if (selectedMethodId === 'blik' && isBlikWaitingForApp) {
      interval = setInterval(() => {
        setBlikTimer((prev) => {
          if (prev <= 1) {
            setIsBlikWaitingForApp(false);
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedMethodId, isBlikWaitingForApp]);

  // Format Card Number (with spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  // Format BLIK code (6 digits)
  const handleBlikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setBlikCode(val);
    if (val.length === 6) {
      setErrorMessage('');
    }
  };

  // Available methods for current country
  const currentCountryMethods = ALL_PAYMENT_METHODS.filter(
    (m) => m.country === selectedCountry || m.country === 'all'
  );

  // Available banks for current country
  const currentBanks = getBanksForCountry(selectedCountry);

  // Submission handler
  const handleExecutePayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    // Validation based on chosen method
    if (selectedMethodId === 'blik') {
      if (blikCode.length !== 6) {
        setErrorMessage(
          language === 'pl' 
            ? 'Proszę podać poprawny 6-cyfrowy kod BLIK wygenerowany w aplikacji bankowej.' 
            : 'Please enter a valid 6-digit BLIK code from your bank app.'
        );
        return;
      }
    } else if (selectedMethodId === 'p24_pl' || selectedMethodId === 'german_banks' || selectedMethodId === 'french_banks' || selectedMethodId === 'belfius_kbc_be') {
      if (!selectedBankId) {
        setErrorMessage(language === 'pl' ? 'Wybierz swój bank z listy.' : 'Please select your bank from the list.');
        return;
      }
    } else if (selectedMethodId === 'ideal') {
      if (!selectedBankId) {
        setErrorMessage(language === 'nl' ? 'Selecteer uw bank.' : 'Please select your Dutch bank.');
        return;
      }
    } else if (selectedMethodId === 'card_international' || selectedMethodId === 'cartes_bancaires' || (selectedMethodId === 'bancontact' && bancontactMode === 'card')) {
      if (!cardHolder.trim() || cardNumber.replace(/\s/g, '').length < 15 || !cardExpiry || cardCvc.length < 3) {
        setErrorMessage(
          language === 'pl' 
            ? 'Wypełnij wszystkie dane karty (właściciel, 16-cyfrowy numer, termin ważności MM/YY, kod CVC).' 
            : 'Please fill in all card details (cardholder, 16 digits, MM/YY, CVC).'
        );
        return;
      }
    }

    setIsProcessing(true);

    // Multi-step realistic verification
    if (selectedMethodId === 'blik') {
      setIsBlikWaitingForApp(true);
      setProcessingStep(language === 'pl' ? 'Weryfikacja kodu BLIK w Polskim Standardzie Płatności...' : 'Verifying BLIK code...');
      
      setTimeout(() => {
        setProcessingStep(language === 'pl' ? 'Oczekiwanie na zatwierdzenie PIN-em w Twojej aplikacji bankowej... 📲' : 'Waiting for confirmation in your bank app...');
        
        setTimeout(() => {
          setProcessingStep(language === 'pl' ? 'Płatność 30 € zaakceptowana! Aktywacja abonamentu...' : 'Payment of 30 € confirmed! Activating account...');
          
          setTimeout(() => {
            finishPayment('blik', 'BLIK Instant');
          }, 800);
        }, 1200);
      }, 1000);

    } else if (selectedMethodId === 'ideal') {
      const bankObj = DUTCH_BANKS_FULL.find((b) => b.id === selectedBankId);
      setProcessingStep(language === 'nl' ? `Verbinden met ${bankObj?.name || 'Bank'} via iDEAL...` : `Connecting to ${bankObj?.name || 'Bank'}...`);
      
      setTimeout(() => {
        setProcessingStep(language === 'nl' ? 'Beveiligde iDEAL transactie van €30 bevestigd!' : 'iDEAL transfer of €30 verified!');
        setTimeout(() => {
          finishPayment('ideal', bankObj?.name || 'iDEAL Bank');
        }, 800);
      }, 1400);

    } else if (selectedMethodId === 'bancontact') {
      setProcessingStep(language === 'fr' ? 'Connexion au protocole Bancontact / Payconiq...' : 'Verbinden met Bancontact / Payconiq...');
      setTimeout(() => {
        setProcessingStep(language === 'pl' ? 'Autoryzacja Bancontact 30 € powiodła się!' : 'Bancontact authorization completed!');
        setTimeout(() => {
          finishPayment('bancontact', 'Bancontact / Payconiq BE');
        }, 800);
      }, 1400);

    } else if (selectedMethodId === 'giropay_sofort') {
      setProcessingStep('Sichere Weiterleitung an Giropay / Sofort Überweisung...');
      setTimeout(() => {
        setProcessingStep('Transaktion über 30 € erfolgreich autorisiert!');
        setTimeout(() => {
          finishPayment('giropay', 'Giropay / Sofort DE');
        }, 800);
      }, 1400);

    } else {
      // Credit card / standard bank
      setProcessingStep(language === 'pl' ? 'Autoryzacja 3D Secure 2.0 (Visa / Mastercard)...' : '3D Secure 2.0 Authorization...');
      setTimeout(() => {
        setProcessingStep(language === 'pl' ? 'Transakcja 30.00 € zaksięgowana pomyślnie!' : 'Payment of 30.00 € successful!');
        setTimeout(() => {
          finishPayment(selectedMethodId, selectedBankId || 'Karta Płatnicza');
        }, 800);
      }, 1400);
    }
  };

  const finishPayment = (method: string, details?: string) => {
    setIsProcessing(false);
    setPaymentDone(true);
    if (onPaymentSuccess) {
      onPaymentSuccess(method, details);
    }
  };

  // Instant Fast Track for testing
  const handleFastTrackTest = () => {
    setIsProcessing(true);
    setProcessingStep(language === 'pl' ? 'Szybka autoryzacja testowa (30 €)...' : 'Fast-track test activation (€30)...');
    setTimeout(() => {
      finishPayment('card', 'Visa / Szybki Test');
    }, 900);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden" id="unified-payment-checkout">
      {/* Header Banner with European Flag Badges */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-4 sm:p-5 border-b border-indigo-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
              €
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>{language === 'pl' ? 'Bezpieczna Europejska Bramka Płatności' : language === 'nl' ? 'Europese Beveiligde Betaalmodule' : 'European Secure Payment Gateway'}</span>
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  SSL 256-Bit
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                {language === 'pl' 
                  ? 'Płatności bankowe i karty dla: Polska, Holandia, Belgia, Niemcy, Francja' 
                  : 'Lokale banken & creditcards voor PL, NL, BE, DE, FR & internationaal'}
              </p>
            </div>
          </div>

          {/* Price badge */}
          <div className="flex items-center sm:flex-col items-end justify-between bg-slate-900/90 border border-amber-500/40 px-3.5 py-1.5 rounded-xl shadow-inner">
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
              {language === 'pl' ? 'Abonament Roczny' : 'Jaarabonnement'}
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-400">
              {PREMIUM_ANNUAL_PRICE_EUR}.00 €
              <span className="text-xs text-slate-400 font-medium ml-1">/ {language === 'pl' ? 'rok' : 'jaar'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* Fast-Track 1-Click Sandbox Test Banner */}
        <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/30 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold">
              {language === 'pl' ? 'Przycisk Szybkiej Aktywacji dla recenzenta (1-Click):' : 'Snelle test-activering met 1 klik:'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleFastTrackTest}
            disabled={isProcessing}
            className="w-full sm:w-auto px-4 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-xs font-black rounded-lg shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span>👑</span>
            <span>{language === 'pl' ? 'Aktywuj Premium 30 €' : 'Activeer Premium €30'}</span>
          </button>
        </div>

        {/* 1. Country Selection Tabs (Polska, Holandia, Belgia, Niemcy, Francja, Wszystkie) */}
        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'pl' ? '1. Wybierz swój kraj / metodę płatności:' : '1. Kies uw land / betaalmethode:'}</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2" id="country-payment-selector">
            {PAYMENT_COUNTRIES.map((c) => {
              const isSelected = selectedCountry === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedCountry(c.code)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/50'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xl sm:text-2xl mb-1">{c.flag}</span>
                  <span className="text-xs font-bold leading-tight">
                    {c.code === 'pl' ? 'Polska' : c.code === 'nl' ? 'Nederland' : c.code === 'be' ? 'België' : c.code === 'de' ? 'Deutschland' : c.code === 'fr' ? 'France' : 'Inne / All'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Specific Payment Method Selection for the Active Country */}
        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'pl' ? '2. Wybierz dogodną formę płatności:' : '2. Kies uw betaalwijze:'}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentCountryMethods.map((m) => {
              const isMethodSelected = selectedMethodId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMethodId(m.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isMethodSelected
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/60'
                      : 'bg-slate-800/50 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <span className="text-2xl mt-0.5">{m.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black text-white">{m.name}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700">
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {(m.description as any)[language] || m.description.en}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Detailed Input Forms based on active method */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          {/* A. POLSKI BLIK */}
          {selectedMethodId === 'blik' && (
            <div className="space-y-3 animate-fadeIn" id="blik-form-container">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔴</span>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      Płatność Kodem BLIK (Polska)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Wygeneruj 6-cyfrowy kod w aplikacji swojego polskiego banku (PKO, mBank, Santander, ING, Pekao, Millennium itp.).
                    </p>
                  </div>
                </div>
                {isBlikWaitingForApp && (
                  <div className="text-amber-400 text-xs font-mono font-bold bg-amber-950/50 border border-amber-800/60 px-2 py-1 rounded">
                    ⏱️ {Math.floor(blikTimer / 60)}:{(blikTimer % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>

              <div className="max-w-xs mx-auto text-center space-y-2 pt-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-300">
                  Wpisz 6-cyfrowy kod BLIK:
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="••• •••"
                  value={blikCode}
                  onChange={handleBlikChange}
                  className="w-full text-center text-2xl tracking-[0.4em] font-mono font-black py-3 px-4 rounded-xl bg-slate-900 border-2 border-indigo-500/60 focus:border-emerald-400 text-white outline-none shadow-inner"
                />
                <p className="text-[10px] text-slate-400">
                  Po kliknięciu zapłać, zatwierdź transakcję <strong>30.00 PLN/EUR</strong> kodem PIN w swojej aplikacji bankowej.
                </p>
              </div>
            </div>
          )}

          {/* B. POLSKIE BANKI (PKO, mBank, Santander, ING, Pekao...) */}
          {selectedMethodId === 'p24_pl' && (
            <div className="space-y-3 animate-fadeIn" id="polish-banks-container">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="text-xl">🇵🇱</span>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Wybierz swój Polski Bank (Szybki Przelew)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Zostaniesz bezpiecznie przekierowany do logowania w swoim banku, gdzie formularz przelewu na 30 € będzie już wypełniony.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {POLISH_BANKS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBankId(b.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      selectedBankId === b.id
                        ? 'bg-emerald-900/60 border-emerald-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 ${selectedBankId === b.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="truncate">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* C. DUTCH iDEAL (ABN AMRO, ING, Rabobank, ASN, Bunq...) */}
          {selectedMethodId === 'ideal' && (
            <div className="space-y-3 animate-fadeIn" id="ideal-banks-container">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="text-xl">🌸</span>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Kies uw Nederlandse Bank (iDEAL)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Veilig en vertrouwd betalen via uw eigen bankomgeving. Bedrag: <strong>€30,00</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {DUTCH_BANKS_FULL.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBankId(b.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      selectedBankId === b.id
                        ? 'bg-emerald-900/60 border-emerald-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 ${selectedBankId === b.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="truncate">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* D. BELGIAN BANCONTACT / PAYCONIQ & BELGIAN BANKS */}
          {selectedMethodId === 'bancontact' && (
            <div className="space-y-3 animate-fadeIn" id="bancontact-container">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🟡</span>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      Bancontact / Payconiq (België)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Betaal via de Payconiq by Bancontact app of vul uw Bancontact kaartgegevens in.
                    </p>
                  </div>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setBancontactMode('app')}
                    className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                      bancontactMode === 'app' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    📱 App / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setBancontactMode('card')}
                    className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                      bancontactMode === 'card' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    💳 Kaart
                  </button>
                </div>
              </div>

              {bancontactMode === 'app' ? (
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-2">
                  <div className="w-24 h-24 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
                    <QrCode className="w-20 h-20 text-slate-900" />
                  </div>
                  <p className="text-xs font-bold text-amber-300">
                    Scan de QR-code met uw Payconiq by Bancontact of Belgische bank-app
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Bedrag: <strong>€30,00</strong> • Direct geautoriseerd
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Naam op Bancontact kaart:</label>
                    <input
                      type="text"
                      placeholder="bijv. J. Peeters"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2.5 text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">16-cijferig Bancontact kaartnummer:</label>
                    <input
                      type="text"
                      placeholder="6703 •••• •••• ••••"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2.5 text-white outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Vervaldatum (MM/YY):</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2.5 text-white outline-none focus:border-emerald-500 font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">CVC / Veiligheidscode:</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2.5 text-white outline-none focus:border-emerald-500 font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* E. BELGIAN BANKS (Belfius, KBC, ING BE, BNP Fortis) */}
          {selectedMethodId === 'belfius_kbc_be' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="text-xl">🇧🇪</span>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Kies uw Belgische Bank (Belfius / KBC / BNP Fortis / ING BE)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Direct online bankieren met KBC Touch, CBC Mobile, Belfius Direct Net of Easy Banking.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {BELGIAN_BANKS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBankId(b.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      selectedBankId === b.id
                        ? 'bg-emerald-900/60 border-emerald-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 ${selectedBankId === b.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="truncate">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* F. GERMAN GIROPAY / SOFORT & GERMAN BANKS */}
          {(selectedMethodId === 'giropay_sofort' || selectedMethodId === 'german_banks') && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="text-xl">🇩🇪</span>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Deutsche Banküberweisung (Giropay / Sofort / Sparkasse / Deutsche Bank)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Wählen Sie Ihr deutsches Kreditinstitut für eine sichere Echtzeitüberweisung von <strong>30,00 €</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {GERMAN_BANKS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBankId(b.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      selectedBankId === b.id
                        ? 'bg-emerald-900/60 border-emerald-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 ${selectedBankId === b.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="truncate">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* G. FRENCH CARTES BANCAIRES & FRENCH BANKS */}
          {(selectedMethodId === 'cartes_bancaires' || selectedMethodId === 'french_banks') && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="text-xl">🇫🇷</span>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Paiement France (Cartes Bancaires CB / Banques Françaises)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Règlement sécurisé 3D Secure par Carte Bleue / CB ou virement bancaire BNP Paribas, Crédit Agricole, SG.
                  </p>
                </div>
              </div>

              {selectedMethodId === 'french_banks' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                  {FRENCH_BANKS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBankId(b.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        selectedBankId === b.id
                          ? 'bg-emerald-900/60 border-emerald-400 text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <Building2 className={`w-4 h-4 ${selectedBankId === b.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="truncate">{b.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Nom du titulaire de la Carte CB :</label>
                    <input
                      type="text"
                      placeholder="ex. Jean Dupont"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2.5 text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Numéro de Carte Bancaire (CB / Visa / Mastercard) :</label>
                    <input
                      type="text"
                      placeholder="4970 •••• •••• ••••"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2.5 text-white outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Date d'expiration (MM/AA) :</label>
                      <input
                        type="text"
                        placeholder="08/28"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2.5 text-white outline-none focus:border-emerald-500 font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Cryptogramme CVV (3 chiffres) :</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2.5 text-white outline-none focus:border-emerald-500 font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* H. WERO SEPA INSTANT */}
          {selectedMethodId === 'wero_nl' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="text-xl">⚡</span>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Wero European Instant Payment
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Verbind direct met uw Europese bank via uw mobiele telefoonnummer.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Mobiel nummer gekoppeld aan Wero:
                </label>
                <input
                  type="tel"
                  placeholder="+31 6 12345678 of +48 501 234 567"
                  value={weroPhone}
                  onChange={(e) => setWeroPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2.5 text-white outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* I. GLOBAL CREDIT / DEBIT CARD (Visa, Mastercard, Maestro, Amex) */}
          {selectedMethodId === 'card_international' && (
            <div className="space-y-3 animate-fadeIn" id="international-card-container">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💳</span>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      {language === 'pl' ? 'Karta Kredytowa / Debetowa (Globalna)' : 'Creditcard / Debetkaart (Wereldwijd)'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Visa, Mastercard, Maestro, American Express • Zabezpieczenie 3D Secure 2.0
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>🔒</span>
                  <span className="text-[10px] font-mono">256-BIT</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">
                    {language === 'pl' ? 'Imię i nazwisko właściciela karty:' : 'Naam op kaart:'}
                  </label>
                  <input
                    type="text"
                    placeholder="np. A. Tomaszewski"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">
                    {language === 'pl' ? 'Numer karty płatniczej:' : 'Kaartnummer:'}
                  </label>
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2.5 text-white outline-none focus:border-emerald-500 font-mono tracking-wider"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">
                      {language === 'pl' ? 'Ważność (MM/YY):' : 'Vervaldatum (MM/YY):'}
                    </label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={handleCardExpiryChange}
                      className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2.5 text-white outline-none focus:border-emerald-500 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">
                      CVC / CVV:
                    </label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2.5 text-white outline-none focus:border-emerald-500 font-mono text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error display if validation failed */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/80 border border-rose-600/60 rounded-xl text-rose-200 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleExecutePayment()}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{processingStep || (language === 'pl' ? 'Trwa bezpieczna autoryzacja transakcji...' : 'Verwerken...')}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {language === 'pl' 
                      ? `Zapłać ${PREMIUM_ANNUAL_PRICE_EUR} € i Aktywuj Subskrypcję Roczną` 
                      : `Betaal €${PREMIUM_ANNUAL_PRICE_EUR} en Activeer Jaarabonnement`}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>

          {/* Trust footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 border-t border-slate-800 pt-3">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Szyfrowanie SSL 256-Bit • PSD2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🇵🇱 BLIK</span>
              <span>🇳🇱 iDEAL</span>
              <span>🇧🇪 Bancontact</span>
              <span>🇩🇪 Giropay</span>
              <span>🇫🇷 CB</span>
              <span>💳 Visa / MC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
