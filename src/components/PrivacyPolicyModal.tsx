/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language } from '../types';
import { Shield, ShieldCheck, Lock, FileText, CheckCircle2, X, Download, UserCheck, RefreshCw, AlertCircle, Eye } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export default function PrivacyPolicyModal({ isOpen, onClose, language }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      id="privacy-policy-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 border-b border-indigo-900/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-0.5">
                <span>RODO / GDPR / AVG Compliant</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {language === 'pl' 
                  ? 'Polityka Prywatności & Ochrona Danych (RODO)' 
                  : language === 'nl' 
                  ? 'Privacybeleid & Gegevensbescherming (AVG)' 
                  : 'Privacy Policy & Data Protection (GDPR)'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          
          {/* Key Principles Badge Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-indigo-600 text-white rounded-lg shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs">Privacy by Design</h4>
                <p className="text-[11px] text-slate-600">
                  {language === 'pl' 
                    ? 'Prywatność i bezpieczeństwo wdrożone w architekturze od pierwszej linii kodu.' 
                    : 'Privacy and security engineered into the platform architecture from the ground up.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-emerald-600 text-white rounded-lg shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs">Privacy by Default</h4>
                <p className="text-[11px] text-slate-600">
                  {language === 'pl' 
                    ? 'Wszystkie opcjonalne trackery i zgody są domyślnie wyłączone (brak pre-ticked checkboxów).' 
                    : 'All optional trackers and consents are disabled by default (no pre-checked boxes).'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Data Controller */}
          <section className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>🏢 1.</span>
              <span>{language === 'pl' ? 'Administrator Danych Osobowych' : 'Data Controller'}</span>
            </h3>
            <p className="text-slate-600">
              {language === 'pl' 
                ? 'Administratorem Twoich danych osobowych w rozumieniu Ogólnego Rozporządzenia o Ochronie Danych (RODO - Rozporządzenie UE 2016/679) jest serwis Tadzik Travel Companion. Zapewniamy pełną transparentność i realizację Twoich praw.'
                : 'The Data Controller within the meaning of the General Data Protection Regulation (GDPR - EU Regulation 2016/679) is Tadzik Travel Companion. We guarantee complete transparency and technical enforcement of your privacy rights.'}
            </p>
          </section>

          {/* Section 2: Principles of Consent */}
          <section className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>✍️ 2.</span>
              <span>{language === 'pl' ? 'Aktywna, Świadoma i Dobrowolna Zgoda (Art. 7 RODO)' : 'Active, Informed & Voluntary Consent'}</span>
            </h3>
            <p className="text-slate-600">
              {language === 'pl'
                ? 'Zgodnie z unijnymi wymogami, żadne skrypty śledzące, trackery marketingowe ani pobieranie lokalizacji GPS nie są uruchamiane przed wyrażeniem przez Ciebie aktywnej i dobrowolnej zgody:'
                : 'In accordance with EU regulations, no tracking scripts, marketing trackers, or GPS telemetry are activated before you grant explicit, informed, and active consent:'}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                <strong>{language === 'pl' ? 'Brak domyślnie zaznaczonych pól' : 'No pre-ticked boxes'}:</strong>{' '}
                {language === 'pl' 
                  ? 'Wszystkie checkboxy opcjonalne podczas rejestracji są puste. To Ty decydujesz, jakie uprawnienia przyznajesz.' 
                  : 'All optional consent boxes remain strictly unchecked by default.'}
              </li>
              <li>
                <strong>{language === 'pl' ? 'Rozdzielność zgód' : 'Granular choices'}:</strong>{' '}
                {language === 'pl' 
                  ? 'Zgoda na lokalizację GPS, newsletter marketingowy, analitykę czy personalizację AI są od siebie niezależne.' 
                  : 'Consents for GPS routing, marketing tips, analytics, and AI personalization are completely separate.'}
              </li>
              <li>
                <strong>{language === 'pl' ? 'Łatwe wycofanie' : 'Easy revocation'}:</strong>{' '}
                {language === 'pl' 
                  ? 'Wycofanie każdej zgody jest tak samo proste jak jej wyrażenie – możesz to zrobić w panelu konta w dowolnej chwili.' 
                  : 'You may withdraw any consent at any time directly in your account settings.'}
              </li>
            </ul>
          </section>

          {/* Section 3: Legal Bases */}
          <section className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>⚖️ 3.</span>
              <span>{language === 'pl' ? 'Cele i Podstawy Prawne Przetwarzania' : 'Purposes and Legal Bases for Processing'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-xs text-slate-900">{language === 'pl' ? 'Świadczenie Usługi' : 'Service Delivery'}</div>
                <div className="text-[11px] text-slate-500 font-mono">Art. 6 ust. 1 lit. b RODO</div>
                <p className="text-[11px] text-slate-600">
                  {language === 'pl' ? 'Obsługa konta, paszportu, rejestracji i rocznej subskrypcji.' : 'Account management, stamps, passport, and subscription.'}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-xs text-slate-900">{language === 'pl' ? 'Zgoda Użytkownika' : 'Explicit Consent'}</div>
                <div className="text-[11px] text-slate-500 font-mono">Art. 6 ust. 1 lit. a RODO</div>
                <p className="text-[11px] text-slate-600">
                  {language === 'pl' ? 'Geolokalizacja trasy powrotu, personalizacja AI, powiadomienia.' : 'GPS return route buffer, AI companion recommendations.'}
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: User Rights (Realizacja Praw RODO) */}
          <section className="space-y-3" id="gdpr-user-rights-list">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>🛡️ 4.</span>
              <span>{language === 'pl' ? 'Twoje Prawa i Ich Realizacja w Aplikacji' : 'Your Rights and Technical Implementation'}</span>
            </h3>
            <p className="text-slate-600">
              {language === 'pl'
                ? 'Aplikacja technicznie zapewnia bezpośrednią realizację Twoich praw bez konieczności oczekiwania:'
                : 'The application technically provides immediate self-service execution of your legal rights:'}
            </p>

            <div className="space-y-2">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50/70">
                <Download className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {language === 'pl' ? 'Prawo do przenoszenia danych i dostępu (Art. 15 i 20 RODO)' : 'Right of Access & Portability (Art. 15 & 20 GDPR)'}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {language === 'pl' 
                      ? 'W sekcji profilu możesz jednym kliknięciem pobrać kompletny, maszynowo czytelny plik JSON ze wszystkimi danymi konta, pieczątkami, trasami i zgodami.'
                      : 'Download a full structured JSON export containing your entire profile, visits, stamps, and consents.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50/70">
                <UserCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {language === 'pl' ? 'Prawo do sprostowania (Art. 16 RODO)' : 'Right to Rectification (Art. 16 GDPR)'}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {language === 'pl' 
                      ? 'W dowolnej chwili możesz edytować swoje dane osobowe, numer telefonu, datę urodzenia czy hasło.'
                      : 'Update or correct your personal data, phone number, and preferences directly in your profile.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50/70">
                <RefreshCw className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {language === 'pl' ? 'Prawo do wycofania zgody i ograniczenia (Art. 7 ust. 3 i Art. 18 RODO)' : 'Right to Withdraw Consent & Restrict (Art. 7(3) & Art. 18 GDPR)'}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {language === 'pl' 
                      ? 'Dedykowane Centrum Prywatności pozwala włączać i wyłączać poszczególne moduły lub uruchomić Tryb Minimalnej Prywatności.'
                      : 'Toggle individual consents anytime or enable Minimal Privacy Mode.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-rose-100 bg-rose-50/40">
                <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-rose-900">
                    {language === 'pl' ? 'Prawo do bycia zapomnianym / usunięcia danych (Art. 17 RODO)' : 'Right to Erasure / To Be Forgotten (Art. 17 GDPR)'}
                  </h4>
                  <p className="text-[11px] text-rose-700">
                    {language === 'pl' 
                      ? 'Opcja trwałego usunięcia konta natychmiast wymazuje profil, historię, pieczątki i unieważnia tokeny lokalne.'
                      : 'Permanently purge your account, travel logs, photos, and local data instantly.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Supervisory Authority Contact */}
          <section className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-slate-600 text-xs space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <span>{language === 'pl' ? 'Organ Nadzorczy & Kontakt z IOD / DPO' : 'Supervisory Authority & Contact'}</span>
            </div>
            <p>
              {language === 'pl'
                ? 'Przysługuje Ci prawo wniesienia skargi do właściwego organu nadzorczego ds. ochrony danych osobowych (w Polsce: Prezes Urzędu Ochrony Danych Osobowych – UODO, w Holandii: Autoriteit Persoonsgegevens, lub odpowiedni organ w Twoim kraju UE).'
                : 'You have the right to lodge a complaint with your national Data Protection Authority (e.g. UODO in Poland, Autoriteit Persoonsgegevens in the Netherlands, or your relevant EU supervisory authority).'}
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            {language === 'pl' ? 'Rozumiem i Akceptuję' : language === 'nl' ? 'Begrepen' : 'Understood'}
          </button>
        </div>

      </div>
    </div>
  );
}
