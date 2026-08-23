/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserAccount, Language, translations, UserPrivacyConsents, CyclingRoute, MotorcycleRoute } from '../types';
import { SEEDED_CYCLING_ROUTES } from '../data/attractions';
import { SEEDED_MOTORCYCLE_ROUTES } from '../data/motorcycleRoutes';
import { CITY_COORDINATES } from '../data/weatherData';
import { 
  getLiveGpsLocation, 
  getNearestCityFromCoords, 
  GpsLocationState, 
  calculateHaversineDistanceKm 
} from '../services/gpsTransitService';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import ShareAppModal from './ShareAppModal';
import UnifiedPaymentCheckout from './UnifiedPaymentCheckout';
import { 
  CreditCard, ShieldCheck, CheckCircle2, Lock, Sparkles, Coins, LogOut, Check, 
  User, Mail, Phone, Calendar, FileText, Smartphone, Key, Shield, Download, 
  Trash2, Sliders, ToggleLeft, ToggleRight, Eye, RefreshCw, AlertTriangle, 
  AlertCircle, Info, ChevronRight, UserCheck, ShieldAlert, Share2, Users,
  Bike, Bookmark, ArrowRight, MapPin, Star, Navigation, LocateFixed, Compass,
  SlidersHorizontal, Home, Building2, Zap
} from 'lucide-react';

interface AccountModalProps {
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  account: UserAccount | null;
  onUpdateAccount: (acc: UserAccount | null) => void;
  onNavigateTab?: (tab: 'explore' | 'station-router' | 'cycling' | 'motorcycle' | 'hotels' | 'passport' | 'challenges' | 'account') => void;
}

const DUTCH_BANKS = ['ING', 'Rabobank', 'ABN AMRO', 'SNS Bank', 'ASN Bank', 'RegioBank', 'Triodos Bank'];

const COUNTRIES = [
  { code: 'PL', flag: '🇵🇱', prefix: '+48', name: { pl: 'Polska', nl: 'Polen', en: 'Poland', de: 'Polen', es: 'Polonia', fr: 'Pologne', ro: 'Polonia', zh: '波兰' } },
  { code: 'NL', flag: '🇳🇱', prefix: '+31', name: { pl: 'Holandia', nl: 'Nederland', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', ro: 'Olanda', zh: '荷兰' } },
  { code: 'DE', flag: '🇩🇪', prefix: '+49', name: { pl: 'Niemcy', nl: 'Duitsland', en: 'Germany', de: 'Deutschland', es: 'Alemania', fr: 'Allemagne', ro: 'Germania', zh: '德国' } },
  { code: 'GB', flag: '🇬🇧', prefix: '+44', name: { pl: 'Wielka Brytania', nl: 'Verenigd Koninkrijk', en: 'United Kingdom', de: 'Vereinigtes Königreich', es: 'Reino Unido', fr: 'Royaume-Uni', ro: 'Marea Britanie', zh: '英国' } },
  { code: 'BE', flag: '🇧🇪', prefix: '+32', name: { pl: 'Belgia', nl: 'België', en: 'Belgium', de: 'Belgien', es: 'Bélgica', fr: 'Belgique', ro: 'Belgia', zh: '比利时' } },
  { code: 'FR', flag: '🇫🇷', prefix: '+33', name: { pl: 'Francja', nl: 'Frankrijk', en: 'France', de: 'Frankreich', es: 'Francia', fr: 'France', ro: 'Franța', zh: '法国' } },
  { code: 'ES', flag: '🇪🇸', prefix: '+34', name: { pl: 'Hiszpania', nl: 'Spanje', en: 'Spain', de: 'Spanien', es: 'España', fr: 'Espagne', ro: 'Spania', zh: '西班牙' } },
  { code: 'IT', flag: '🇮🇹', prefix: '+39', name: { pl: 'Włochy', nl: 'Italië', en: 'Italy', de: 'Italien', es: 'Italia', fr: 'Italie', ro: 'Italia', zh: '意大利' } },
  { code: 'US', flag: '🇺🇸', prefix: '+1', name: { pl: 'USA', nl: 'Verenigde Staten', en: 'USA', de: 'USA', es: 'EE. UU.', fr: 'États-Unis', ro: 'SUA', zh: '美国' } },
  { code: 'UA', flag: '🇺🇦', prefix: '+380', name: { pl: 'Ukraina', nl: 'Oekraïne', en: 'Ukraine', de: 'Ukraine', es: 'Ucrania', fr: 'Ukraine', ro: 'Ucraina', zh: '乌克兰' } },
  { code: 'CZ', flag: '🇨🇿', prefix: '+420', name: { pl: 'Czechy', nl: 'Tsjechië', en: 'Czech Republic', de: 'Tschechien', es: 'República Checa', fr: 'République tchèque', ro: 'Cehia', zh: '捷克' } },
  { code: 'SK', flag: '🇸🇰', prefix: '+421', name: { pl: 'Słowacja', nl: 'Slowakije', en: 'Slovakia', de: 'Slowakei', es: 'Eslovaquia', fr: 'Slovaquie', ro: 'Slovacia', zh: '斯洛伐克' } },
  { code: 'LT', flag: '🇱🇹', prefix: '+370', name: { pl: 'Litwa', nl: 'Litouwen', en: 'Lithuania', de: 'Litauen', es: 'Lituania', fr: 'Lituanie', ro: 'Lituania', zh: '立陶宛' } },
  { code: 'DK', flag: '🇩🇰', prefix: '+45', name: { pl: 'Dania', nl: 'Denemarken', en: 'Denmark', de: 'Dänemark', es: 'Dinamarca', fr: 'Danemark', ro: 'Danemarca', zh: '丹麦' } },
  { code: 'SE', flag: '🇸🇪', prefix: '+46', name: { pl: 'Szwecja', nl: 'Zweden', en: 'Sweden', de: 'Schweden', es: 'Suecia', fr: 'Suède', ro: 'Suedia', zh: '瑞典' } },
  { code: 'NO', flag: '🇳🇴', prefix: '+47', name: { pl: 'Norwegia', nl: 'Noorwegen', en: 'Norway', de: 'Norwegen', es: 'Noruega', fr: 'Norvège', ro: 'Norvegia', zh: '挪威' } },
  { code: 'IE', flag: '🇮🇪', prefix: '+353', name: { pl: 'Irlandia', nl: 'Ierland', en: 'Ireland', de: 'Irland', es: 'Irlanda', fr: 'Irlande', ro: 'Irlanda', zh: '爱尔兰' } },
  { code: 'CH', flag: '🇨🇭', prefix: '+41', name: { pl: 'Szwajcaria', nl: 'Zwitserland', en: 'Switzerland', de: 'Schweiz', es: 'Suiza', fr: 'Suisse', ro: 'Elveția', zh: '瑞士' } },
  { code: 'AT', flag: '🇦🇹', prefix: '+43', name: { pl: 'Austria', nl: 'Oostenrijk', en: 'Austria', de: 'Österreich', es: 'Austria', fr: 'Autriche', ro: 'Austria', zh: '奥地利' } },
  { code: 'PT', flag: '🇵🇹', prefix: '+351', name: { pl: 'Portugalia', nl: 'Portugal', en: 'Portugal', de: 'Portugal', es: 'Portugal', fr: 'Portugal', ro: 'Portugalia', zh: '葡萄牙' } },
];

const localT: Record<Language, any> = {
  pl: {
    firstName: "Imię",
    lastName: "Nazwisko",
    email: "Adres E-mail",
    phone: "Numer Telefonu",
    dob: "Data Urodzenia",
    verificationMethod: "Metoda Weryfikacji Tożsamości",
    verificationValue: "Numer Karty / Dokumentu",
    registerTitle: "Rejestracja",
    loginTitle: "Logowanie",
    verifySeniorCard: "Europejska Karta Seniora",
    verifyIdCard: "Dowód Osobisty / Paszport",
    verifyRegular: "Karta Podróżnika Tadzik",
    verifyDobPrompt: "Weryfikacja wieku (zalecane dla seniorów)",
    recoverViaPhone: "Odzyskiwanie konta przez numer telefonu 📱",
    recoverMethod: "Co chcesz odzyskać?",
    recoverPassword: "Odzyskaj moje hasło",
    recoverEmail: "Odzyskaj mój e-mail / login",
    phoneRequired: "Zarejestrowany numer telefonu",
    dobRequired: "Data urodzenia do weryfikacji",
    recoverBtn: "Zweryfikuj tożsamość i odzyskaj",
    backToLogin: "Anuluj i wróć do logowania",
    errorNoUser: "Nie znaleziono użytkownika o podanym numerze telefonu i dacie urodzenia.",
    successEmailFound: "Konto zweryfikowane! Twój zarejestrowany e-mail to:",
    successResetPassword: "Tożsamość zweryfikowana! Wprowadź teraz nowe hasło dla konta:",
    setNewPasswordBtn: "Zapisz i ustaw nowe hasło",
    passwordChanged: "Hasło zostało pomyślnie zmienione! Możesz się teraz zalogować.",
    requiredFields: "Proszę uzupełnić wszystkie wymagane pola.",
    pwdMismatch: "Hasło musi mieć co najmniej 4 znaki.",
    userExists: "Konto o tym adresie e-mail już istnieje w systemie.",
    welcomeBack: "Zalogowano pomyślnie! Witaj z powrotem.",
    invalidPwd: "Nieprawidłowe hasło. Spróbuj ponownie lub odzyskaj je.",
    noUserWithEmail: "Konto o tym adresie e-mail nie istnieje. Zarejestruj się poniżej.",
    // RODO / GDPR Privacy translations
    gdprHeader: "Ochrona Danych i Zgody (RODO / GDPR)",
    privacyByDesignNotice: "Privacy by Design & Default: Domyślnie brak włączonych trackerów. Zgoda na GPS wyrażana jest raz przy rejestracji.",
    oneTimeConsentNotice: "💡 Zgoda na GPS wyrażana przy rejestracji: Wybierasz raz – aplikacja zapamiętuje Twoją decyzję i NIE pyta o zgodę na GPS przy każdym kolejnym uruchomieniu!",
    grantAllConsentsBtn: "✨ Zezwól na wszystkie uprawnienia jednym kliknięciem (Zalecane)",
    termsConsentLabel: "Akceptuję Regulamin Serwisu oraz Politykę Prywatności (RODO)",
    termsConsentRequired: "Wymagane do świadczenia usługi (Art. 6 ust. 1 lit. b RODO)",
    viewGdprDetails: "Zobacz pełną klauzulę informacyjną RODO i prawa",
    optionalConsentsTitle: "Zgoda na lokalizację GPS oraz opcje dodatkowe:",
    geoConsentLabel: "📍 Zgoda na lokalizację GPS (Zapamiętana przy rejestracji)",
    geoConsentDesc: "Wyrażając zgodę przy rejestracji, aplikacja zapamiętuje Twój wybór i automatycznie oblicza odległości, stacje i trasy bez każdorazowego pytania o dostęp do GPS.",
    cameraConsentLabel: "📷 Zgoda na dostęp do aparatu / kamery",
    cameraConsentDesc: "Umożliwia wykonywanie zdjęć ze znacznikiem czasu i stemplem SHA do Paszportu oraz wyzwań foto.",
    marketingConsentLabel: "📣 Zgoda na powiadomienia i wskazówki turystyczne",
    marketingConsentDesc: "Otrzymuj rekomendacje nowych tras, wyzwań fotograficznych i promocji biletowych na e-mail.",
    aiConsentLabel: "🤖 Zgoda na profilowanie i personalizację AI przez Tadzika",
    aiConsentDesc: "Dopasowywanie rekomendacji do Twoich preferencji (dostępność dla seniorów/wózków, tempo podróży).",
    telemetryConsentLabel: "📊 Anonimowa telemetria UX i analityka",
    telemetryConsentDesc: "Pomaga nam optymalizować działanie aplikacji bez śledzenia użytkownika między witrynami.",
    termsConsentError: "Do rejestracji wymagana jest akceptacja Regulaminu i Polityki Prywatności (RODO).",
    privacyCenterTab: "Centrum Prywatności RODO",
    profileTab: "Profil & Subskrypcja",
    travelHistoryTab: "Dziennik Podróży",
    exportDataTitle: "Eksport Danych (Art. 20 RODO)",
    exportDataBtn: "Pobierz wszystkie moje dane (JSON)",
    exportDataDesc: "Prawo do przenoszenia danych: Pobierz kopię profilu, historii, pieczątek i zgód w otwartym formacie JSON.",
    minimalPrivacyBtn: "Włącz Tryb Minimalnej Prywatności",
    minimalPrivacyDesc: "Natychmiast wycofuje wszystkie opcjonalne zgody (lokalizacja, marketing, AI, analityka) zgodnie z Privacy by Default.",
    consentManagerTitle: "Zarządzanie Zgodami (Art. 7 ust. 3 RODO)",
    consentManagerDesc: "Możesz w dowolnej chwili włączyć lub wycofać każdą z opcjonalnych zgód. Zmiana obowiązuje natychmiast.",
    deleteAccountTitle: "Prawo do bycia zapomnianym (Art. 17 RODO)",
    deleteAccountBtn: "Trwale usuń konto i wszystkie moje dane",
    deleteAccountWarning: "Uwaga: Ta operacja bezpowrotnie wykasuje Twój profil, pieczątki, historię wizyt i unieważni sesję.",
    deleteAccountConfirmPrompt: "Czy na pewno chcesz bezpowrotnie usunąć swoje konto i wszystkie zgromadzone dane?",
    deleteAccountConfirmBtn: "Tak, usuń bezpowrotnie",
    deleteAccountCancelBtn: "Anuluj",
    saveProfileBtn: "Zapisz poprawione dane",
    profileUpdatedSuccess: "Dane profilowe zostały pomyślnie zaktualizowane!",
  },
  nl: {
    firstName: "Voornaam",
    lastName: "Achternaam",
    email: "E-mailadres",
    phone: "Telefoonnummer",
    dob: "Geboortedatum",
    verificationMethod: "Identiteitsverificatie",
    verificationValue: "Kaart- of Documentnummer",
    registerTitle: "Registreren",
    loginTitle: "Inloggen",
    verifySeniorCard: "Europese Seniorenkaart",
    verifyIdCard: "Identiteitskaart / Paspoort",
    verifyRegular: "Tadzik Reispaspoort",
    verifyDobPrompt: "Leeftijdsverificatie (Aanbevolen)",
    recoverViaPhone: "Account herstellen via telefoon 📱",
    recoverMethod: "Wat wilt u herstellen?",
    recoverPassword: "Wachtwoord herstellen",
    recoverEmail: "E-mailadres / login herstellen",
    phoneRequired: "Geregistreerd telefoonnummer",
    dobRequired: "Geboortedatum voor verificatie",
    recoverBtn: "Verifiëren & Herstellen",
    backToLogin: "Annuleren en terugkeren",
    errorNoUser: "Geen gebruiker gevonden met dit telefoonnummer en geboortedatum.",
    successEmailFound: "Account geverifieerd! Uw geregistreerde e-mailadres is:",
    successResetPassword: "Account geverifieerd! Voer uw nieuwe wachtwoord in voor account:",
    setNewPasswordBtn: "Wachtwoord opslaan",
    passwordChanged: "Wachtwoord succesvol gewijzigd! U kunt nu inloggen.",
    requiredFields: "Vul alstublieft alle verplichte velden in.",
    pwdMismatch: "Het wachtwoord moet minimaal 4 tekens lang zijn.",
    userExists: "Een gebruiker met dit e-mailadres bestaat al.",
    welcomeBack: "Succesvol ingelogd! Welkom terug.",
    invalidPwd: "Onjuist wachtwoord. Probeer het opnieuw of herstel uw wachtwoord.",
    noUserWithEmail: "Geen account gevonden met dit e-mailadres. Registreer u hieronder.",
    // RODO / GDPR Privacy translations
    gdprHeader: "Gegevensbescherming & Toestemming (AVG / GDPR)",
    privacyByDesignNotice: "Privacy by Design & Default: Geen vooraf ingeschakelde trackers. Vrijwillige en actieve toestemming (geen vooraf aangevinkte vakjes).",
    oneTimeConsentNotice: "💡 GPS-toestemming bij registratie: U kiest één keer – de app onthoudt uw keuze en zal u niet bij elk bezoek opnieuw om GPS-toestemming vragen!",
    grantAllConsentsBtn: "✨ Alle toestemmingen in één klik verlenen (Aanbevolen)",
    termsConsentLabel: "Ik ga akkoord met de Gebruiksvoorwaarden en het Privacybeleid (AVG)",
    termsConsentRequired: "Vereist voor dienstverlening (Art. 6 lid 1 sub b AVG)",
    viewGdprDetails: "Bekijk de volledige AVG-informatieclausule en rechten",
    optionalConsentsTitle: "GPS-locatietoestemming en optionele instellingen:",
    geoConsentLabel: "📍 Toestemming voor continue GPS-geolocatie (Registratie)",
    geoConsentDesc: "Door bij registratie toestemming te geven, onthoudt de app uw keuze permanent en berekent deze automatisch afstanden, stations en routes zonder herhaaldelijke pop-ups.",
    cameraConsentLabel: "📷 Toestemming voor camera & fotoverificatie",
    cameraConsentDesc: "Maakt het mogelijk om tijdgestempelde en cryptografisch beveiligde fotobewijzen voor paspoortstickers te maken.",
    marketingConsentLabel: "📣 Toestemming voor reistips en meldingen",
    marketingConsentDesc: "Ontvang e-mails over nieuwe fietsroutes, uitdagingen en kortingen.",
    aiConsentLabel: "🤖 Toestemming voor AI-personalisatie door Tadzik",
    aiConsentDesc: "Stem aanbevelingen af op uw tempo en behoeften (toegankelijkheid voor senioren/rolstoelen).",
    telemetryConsentLabel: "📊 Anonieme telemetrie en UX-analyse",
    telemetryConsentDesc: "Helps ons de app-prestaties te verbeteren zonder cross-site tracking.",
    termsConsentError: "Acceptatie van de Algemene Voorwaarden en het Privacybeleid (AVG) is vereist.",
    privacyCenterTab: "AVG Privacycentrum",
    profileTab: "Profiel & Abonnement",
    travelHistoryTab: "Reisdagboek",
    exportDataTitle: "Gegevensoverdraagbaarheid (Art. 20 AVG)",
    exportDataBtn: "Download al mijn gegevens (JSON)",
    exportDataDesc: "Recht op dataportabiliteit: Download een machineleesbaar JSON-bestand met uw profiel, bezoeken, stempels en toestemmingen.",
    minimalPrivacyBtn: "Minimale Privacymodus Inschakelen",
    minimalPrivacyDesc: "Trekt onmiddellijk alle optionele toestemmingen in volgens Privacy by Default.",
    consentManagerTitle: "Toestemmingsbeheer (Art. 7 lid 3 AVG)",
    consentManagerDesc: "Schakel individuele toestemmingen in of uit. Wijzigingen worden direct van kracht.",
    deleteAccountTitle: "Recht op vergetelheid (Art. 17 AVG)",
    deleteAccountBtn: "Account en alle gegevens definitief verwijderen",
    deleteAccountWarning: "Waarschuwing: Dit verwijdert uw profiel, stempels en reisgeschiedenis onherroepelijk.",
    deleteAccountConfirmPrompt: "Weet u zeker dat u uw account en alle gegevens wilt wissen?",
    deleteAccountConfirmBtn: "Ja, definitief verwijderen",
    deleteAccountCancelBtn: "Annuleren",
    saveProfileBtn: "Gegevens opslaan",
    profileUpdatedSuccess: "Profielgegevens succesvol bijgewerkt!",
  },
  en: {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phone: "Phone Number",
    dob: "Date of Birth",
    verificationMethod: "Identity Verification Method",
    verificationValue: "Card / Document Number",
    registerTitle: "Register",
    loginTitle: "Log In",
    verifySeniorCard: "European Senior Card",
    verifyIdCard: "ID Card / Passport",
    verifyRegular: "Tadzik Traveler Card",
    verifyDobPrompt: "Age verification (Recommended)",
    recoverViaPhone: "Recover Account via Phone 📱",
    recoverMethod: "What do you want to recover?",
    recoverPassword: "Recover my password",
    recoverEmail: "Recover my email / login",
    phoneRequired: "Registered phone number",
    dobRequired: "Date of birth for verification",
    recoverBtn: "Verify Identity & Recover",
    backToLogin: "Cancel and return to login",
    errorNoUser: "No user found with the provided phone number and date of birth.",
    successEmailFound: "Account verified! Your registered email is:",
    successResetPassword: "Identity verified! Enter your new password for account:",
    setNewPasswordBtn: "Save & Set New Password",
    passwordChanged: "Password successfully changed! You can now log in.",
    requiredFields: "Please fill in all required fields.",
    pwdMismatch: "Password must be at least 4 characters.",
    userExists: "A user with this email address already exists.",
    welcomeBack: "Successfully logged in! Welcome back.",
    invalidPwd: "Incorrect password. Please try again or recover it.",
    noUserWithEmail: "Account with this email does not exist. Register below.",
    // RODO / GDPR Privacy translations
    gdprHeader: "Data Protection & Consents (GDPR / AVG)",
    privacyByDesignNotice: "Privacy by Design & Default: No pre-activated trackers. Voluntary, active consent (no pre-checked boxes).",
    oneTimeConsentNotice: "💡 One-time GPS registration consent: You grant consent once at sign-up – the app permanently remembers your choice and will NOT ask for GPS permission every single time you open the app.",
    grantAllConsentsBtn: "✨ Grant all permissions in 1-click (Recommended)",
    termsConsentLabel: "I accept the Terms of Service and Privacy Policy (GDPR)",
    termsConsentRequired: "Required for service execution (Art. 6(1)(b) GDPR)",
    viewGdprDetails: "View complete GDPR transparency notice and rights",
    optionalConsentsTitle: "GPS location consent & preferences:",
    geoConsentLabel: "📍 Continuous GPS Location Consent (Registration)",
    geoConsentDesc: "By giving consent at registration, the app remembers your choice to calculate live transit, stations, and distances without repetitive permission prompts.",
    cameraConsentLabel: "📷 Consent for camera & photo proof capture",
    cameraConsentDesc: "Allows capturing timestamped, SHA-verified photo proofs for Passport stickers and photo challenges.",
    marketingConsentLabel: "📣 Consent for travel recommendations and tips",
    marketingConsentDesc: "Receive email updates on scenic cycling routes, photo challenges, and ticket perks.",
    aiConsentLabel: "🤖 Consent for AI profiling & personalization by Tadzik",
    aiConsentDesc: "Tailors itineraries to your travel pace and accessibility needs (senior / family friendly).",
    telemetryConsentLabel: "📊 Anonymous UX telemetry and diagnostics",
    telemetryConsentDesc: "Helps us improve performance without cross-site tracking.",
    termsConsentError: "Acceptance of Terms of Service and Privacy Policy (GDPR) is required.",
    privacyCenterTab: "GDPR Privacy Center",
    profileTab: "Profile & Subscription",
    travelHistoryTab: "Travel Log",
    exportDataTitle: "Data Portability (Art. 20 GDPR)",
    exportDataBtn: "Download All My Data (JSON Export)",
    exportDataDesc: "Right to data portability: Download a complete, machine-readable JSON copy of your profile, visits, stamps, and consents.",
    minimalPrivacyBtn: "Apply Minimal Privacy Mode",
    minimalPrivacyDesc: "Immediately revokes all optional consents according to Privacy by Default.",
    consentManagerTitle: "Consent Management (Art. 7(3) GDPR)",
    consentManagerDesc: "Toggle individual consents anytime. Changes take effect instantly.",
    deleteAccountTitle: "Right to Erasure (Art. 17 GDPR)",
    deleteAccountBtn: "Permanently Delete Account & All My Data",
    deleteAccountWarning: "Warning: This action irreversibly wipes your profile, stamps, travel history, and revokes your session.",
    deleteAccountConfirmPrompt: "Are you sure you want to permanently delete your account and all data?",
    deleteAccountConfirmBtn: "Yes, delete permanently",
    deleteAccountCancelBtn: "Cancel",
    saveProfileBtn: "Save Profile Changes",
    profileUpdatedSuccess: "Profile data updated successfully!",
  },
  de: {
    firstName: "Vorname",
    lastName: "Nachname",
    email: "E-Mail-Adresse",
    phone: "Telefonnummer",
    dob: "Geburtsdatum",
    verificationMethod: "Identitätsprüfung",
    verificationValue: "Karten- oder Dokumentnummer",
    registerTitle: "Registrieren",
    loginTitle: "Anmelden",
    verifySeniorCard: "Europäische Seniorenkarte",
    verifyIdCard: "Personalausweis / Reisepass",
    verifyRegular: "Tadzik Reisepass",
    verifyDobPrompt: "Altersprüfung (Empfohlen)",
    recoverViaPhone: "Konto über Telefonnummer wiederherstellen 📱",
    recoverMethod: "Was möchten Sie wiederherstellen?",
    recoverPassword: "Passwort wiederherstellen",
    recoverEmail: "E-Mail-Adresse / Login wiederherstellen",
    phoneRequired: "Registrierte Telefonnummer",
    dobRequired: "Geburtsdatum zur Verifizierung",
    recoverBtn: "Identität prüfen & wiederherstellen",
    backToLogin: "Abbrechen und zurück",
    errorNoUser: "Kein Benutzer mit dieser Telefonnummer und diesem Geburtsdatum gefunden.",
    successEmailFound: "Konto verifiziert! Ihre registrierte E-Mail lautet:",
    successResetPassword: "Identität verifiziert! Neues Passwort eingeben für:",
    setNewPasswordBtn: "Neues Passwort speichern",
    passwordChanged: "Passwort erfolgreich geändert! Sie können sich jetzt anmelden.",
    requiredFields: "Bitte füllen Sie alle erforderlichen Felder aus.",
    pwdMismatch: "Das Passwort muss mindestens 4 Zeichen lang sein.",
    userExists: "Ein Benutzer mit dieser E-Mail existiert bereits.",
    welcomeBack: "Erfolgreich angemeldet! Willkommen zurück.",
    invalidPwd: "Falsches Passwort. Bitte erneut versuchen.",
    noUserWithEmail: "Kein Konto mit dieser E-Mail gefunden. Jetzt registrieren.",
    gdprHeader: "Datenschutz & Einwilligungen (DSGVO / GDPR)",
    privacyByDesignNotice: "Privacy by Design & Default: Keine voreingestellten Tracker. Freiwillige und aktive Einwilligung.",
    oneTimeConsentNotice: "💡 Einmalige Zustimmung bei der Registrierung: Die App speichert Ihre Präferenzen und fragt nicht bei jedem Start erneut.",
    grantAllConsentsBtn: "✨ Alle Berechtigungen mit 1 Klick erteilen (Empfohlen)",
    termsConsentLabel: "Ich akzeptiere die Nutzungsbedingungen und die Datenschutzerklärung (DSGVO)",
    termsConsentRequired: "Erforderlich zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO)",
    viewGdprDetails: "Vollständige DSGVO-Informationen und Rechte ansehen",
    optionalConsentsTitle: "Freiwillige Einwilligungen (jederzeit widerrufbar):",
    geoConsentLabel: "📍 Einwilligung zur präzisen GPS-Standortbestimmung",
    geoConsentDesc: "Ermöglicht automatische Stationserkennung und den sicheren Rückkehr-Puffer (Safe Headway).",
    cameraConsentLabel: "📷 Einwilligung für Kamera- und Fotozugriff",
    cameraConsentDesc: "Ermöglicht das Aufnehmen von manipulationssicheren Fotobeweisen für den Reisepass.",
    marketingConsentLabel: "📣 Einwilligung für Reiseempfehlungen und Tipps",
    marketingConsentDesc: "Erhalte E-Mails zu neuen Radrouten, Foto-Wettbewerben und Ermäßigungen.",
    aiConsentLabel: "🤖 Einwilligung zur KI-Personalisierung durch Tadzik",
    aiConsentDesc: "Passt Empfehlungen an dein Reisetempo und Barrierefreiheit an.",
    telemetryConsentLabel: "📊 Anonyme UX-Telemetrie und Analyse",
    telemetryConsentDesc: "Hilft uns, die Leistung der App ohne seitenübergreifendes Tracking zu verbessern.",
    termsConsentError: "Die Zustimmung zu Nutzungsbedingungen und Datenschutz ist erforderlich.",
    privacyCenterTab: "DSGVO Datenschutz-Center",
    profileTab: "Profil & Mitgliedschaft",
    travelHistoryTab: "Reisetagebuch",
    exportDataTitle: "Datenübertragbarkeit (Art. 20 DSGVO)",
    exportDataBtn: "Alle meine Daten herunterladen (JSON)",
    exportDataDesc: "Recht auf Datenübertragbarkeit: Lade eine maschinenlesbare JSON-Datei deines Profils herunter.",
    minimalPrivacyBtn: "Minimalen Datenschutzmodus aktivieren",
    minimalPrivacyDesc: "Widerruft sofort alle optionalen Einwilligungen gemäß Privacy by Default.",
    consentManagerTitle: "Einwilligungsverwaltung (Art. 7 Abs. 3 DSGVO)",
    consentManagerDesc: "Einwilligungen jederzeit aktivieren oder widerrufen.",
    deleteAccountTitle: "Recht auf Löschung (Art. 17 DSGVO)",
    deleteAccountBtn: "Konto und alle Daten endgültig löschen",
    deleteAccountWarning: "Achtung: Dies löscht unwiderruflich dein Profil, Stempel und Reisedaten.",
    deleteAccountConfirmPrompt: "Möchtest du dein Konto und alle Daten wirklich endgültig löschen?",
    deleteAccountConfirmBtn: "Ja, endgültig löschen",
    deleteAccountCancelBtn: "Abbrechen",
    saveProfileBtn: "Profiländerungen speichern",
    profileUpdatedSuccess: "Profildaten erfolgreich aktualisiert!",
  },
  es: {
    firstName: "Nombre",
    lastName: "Apellidos",
    email: "Correo electrónico",
    phone: "Número de teléfono",
    dob: "Fecha de nacimiento",
    verificationMethod: "Método de verificación de identidad",
    verificationValue: "Número de documento o tarjeta",
    registerTitle: "Registro",
    loginTitle: "Iniciar sesión",
    verifySeniorCard: "Tarjeta Europea de Mayores",
    verifyIdCard: "DNI / Pasaporte",
    verifyRegular: "Pasaporte de Viajero Tadzik",
    verifyDobPrompt: "Verificación de edad (Recomendado)",
    recoverViaPhone: "Recuperar cuenta por teléfono 📱",
    recoverMethod: "¿Qué deseas recuperar?",
    recoverPassword: "Recuperar mi contraseña",
    recoverEmail: "Recuperar mi correo / usuario",
    phoneRequired: "Número de teléfono registrado",
    dobRequired: "Fecha de nacimiento para verificar",
    recoverBtn: "Verificar identidad y recuperar",
    backToLogin: "Cancelar y volver al inicio de sesión",
    errorNoUser: "No se encontró ningún usuario con ese teléfono y fecha de nacimiento.",
    successEmailFound: "¡Cuenta verificada! Tu correo registrado es:",
    successResetPassword: "¡Identidad verificada! Introduce tu nueva contraseña para:",
    setNewPasswordBtn: "Guardar y establecer contraseña",
    passwordChanged: "¡Contraseña cambiada con éxito! Ya puedes iniciar sesión.",
    requiredFields: "Por favor, completa todos los campos requeridos.",
    pwdMismatch: "La contraseña debe tener al menos 4 caracteres.",
    userExists: "Ya existe un usuario con este correo electrónico.",
    welcomeBack: "¡Sesión iniciada con éxito! Bienvenido de nuevo.",
    invalidPwd: "Contraseña incorrecta. Inténtalo de nuevo.",
    noUserWithEmail: "No existe cuenta con este correo. Regístrate abajo.",
    gdprHeader: "Protección de Datos y Consentimientos (RGPD / GDPR)",
    privacyByDesignNotice: "Privacidad por diseño y por defecto: sin rastreadores preactivados.",
    oneTimeConsentNotice: "💡 Consentimiento único al registrarte: La app guardará tus preferencias y no te molestará en cada apertura.",
    grantAllConsentsBtn: "✨ Conceder todos los permisos en 1 clic (Recomendado)",
    termsConsentLabel: "Acepto las Condiciones del Servicio y la Política de Privacidad (RGPD)",
    termsConsentRequired: "Requerido para la prestación del servicio (Art. 6.1.b RGPD)",
    viewGdprDetails: "Ver cláusula completa del RGPD y derechos",
    optionalConsentsTitle: "Consentimientos voluntarios (puedes revocarlos en cualquier momento):",
    geoConsentLabel: "📍 Consentimiento para geolocalización GPS precisa",
    geoConsentDesc: "Permite la detección automática de estaciones y el margen de retorno seguro (Safe Headway).",
    cameraConsentLabel: "📷 Consentimiento para acceso a cámara y fotos de prueba",
    cameraConsentDesc: "Permite capturar fotos de prueba con sello temporal y firma SHA para el Pasaporte.",
    marketingConsentLabel: "📣 Consentimiento para recomendaciones y consejos de viaje",
    marketingConsentDesc: "Recibe correos sobre nuevas rutas ciclistas, desafíos y descuentos.",
    aiConsentLabel: "🤖 Consentimiento para personalización por IA con Tadzik",
    aiConsentDesc: "Adapta las recomendaciones a tu ritmo de viaje y accesibilidad.",
    telemetryConsentLabel: "📊 Telemetría anónima de UX y análisis",
    telemetryConsentDesc: "Nos ayuda a optimizar el rendimiento sin rastreo entre sitios.",
    termsConsentError: "Es obligatorio aceptar las Condiciones y la Política de Privacidad.",
    privacyCenterTab: "Centro de Privacidad RGPD",
    profileTab: "Perfil y Suscripción",
    travelHistoryTab: "Diario de Viajes",
    exportDataTitle: "Portabilidad de Datos (Art. 20 RGPD)",
    exportDataBtn: "Descargar todos mis datos (JSON)",
    exportDataDesc: "Derecho a la portabilidad: Descarga una copia en formato JSON de tu perfil y visitas.",
    minimalPrivacyBtn: "Activar Modo de Privacidad Mínima",
    minimalPrivacyDesc: "Revoca de inmediato todos los consentimientos opcionales.",
    consentManagerTitle: "Gestión de Consentimientos (Art. 7.3 RGPD)",
    consentManagerDesc: "Activa o desactiva consentimientos individuales en cualquier momento.",
    deleteAccountTitle: "Derecho al Olvido (Art. 17 RGPD)",
    deleteAccountBtn: "Eliminar permanentemente mi cuenta y mis datos",
    deleteAccountWarning: "Atención: Esta acción borrará de forma irreversible tu perfil y tus datos.",
    deleteAccountConfirmPrompt: "¿Seguro que deseas eliminar definitivamente tu cuenta y datos?",
    deleteAccountConfirmBtn: "Sí, eliminar definitivamente",
    deleteAccountCancelBtn: "Cancelar",
    saveProfileBtn: "Guardar cambios del perfil",
    profileUpdatedSuccess: "¡Datos del perfil actualizados correctamente!",
  },
  fr: {
    firstName: "Prénom",
    lastName: "Nom",
    email: "Adresse e-mail",
    phone: "Numéro de téléphone",
    dob: "Date de naissance",
    verificationMethod: "Méthode de vérification d'identité",
    verificationValue: "Numéro de carte ou pièce d'identité",
    registerTitle: "Créer un compte",
    loginTitle: "Connexion",
    verifySeniorCard: "Carte Senior Européenne",
    verifyIdCard: "Carte d'identité / Passeport",
    verifyRegular: "Passeport de voyageur Tadzik",
    verifyDobPrompt: "Vérification de l'âge (Recommandé)",
    recoverViaPhone: "Récupération de compte par téléphone 📱",
    recoverMethod: "Que souhaitez-vous récupérer ?",
    recoverPassword: "Récupérer mon mot de passe",
    recoverEmail: "Récupérer mon e-mail / identifiant",
    phoneRequired: "Numéro de téléphone enregistré",
    dobRequired: "Date de naissance pour vérification",
    recoverBtn: "Vérifier l'identité et récupérer",
    backToLogin: "Annuler et revenir à la connexion",
    errorNoUser: "Aucun utilisateur trouvé avec ce numéro et cette date de naissance.",
    successEmailFound: "Compte vérifié ! Votre e-mail enregistré est :",
    successResetPassword: "Identité vérifiée ! Saisissez votre nouveau mot de passe pour :",
    setNewPasswordBtn: "Enregistrer le nouveau mot de passe",
    passwordChanged: "Mot de passe modifié avec succès ! Vous pouvez vous connecter.",
    requiredFields: "Veuillez remplir tous les champs obligatoires.",
    pwdMismatch: "Le mot de passe doit comporter au moins 4 caractères.",
    userExists: "Un utilisateur avec cet e-mail existe déjà.",
    welcomeBack: "Connexion réussie ! Bon retour parmi nous.",
    invalidPwd: "Mot de passe incorrect. Veuillez réessayer.",
    noUserWithEmail: "Aucun compte trouvé avec cet e-mail. Inscrivez-vous ci-dessous.",
    gdprHeader: "Protection des données et consentements (RGPD)",
    privacyByDesignNotice: "Privacy by Design & Default : aucun traceur préactivé. Consentement libre et éclairé.",
    oneTimeConsentNotice: "💡 Consentement unique à l'inscription : L'application mémorise vos choix et ne vous redemandera pas à chaque ouverture.",
    grantAllConsentsBtn: "✨ Accorder toutes les autorisations en 1 clic (Recommandé)",
    termsConsentLabel: "J'accepte les Conditions d'utilisation et la Politique de confidentialité (RGPD)",
    termsConsentRequired: "Requis pour l'exécution du service (Art. 6(1)(b) RGPD)",
    viewGdprDetails: "Consulter la clause d'information RGPD complète et vos droits",
    optionalConsentsTitle: "Consentements facultatifs (révocables à tout moment) :",
    geoConsentLabel: "📍 Consentement à la géolocalisation GPS précise",
    geoConsentDesc: "Permet la détection automatique des gares et le calcul de la marge de retour sécurisé (Safe Headway).",
    cameraConsentLabel: "📷 Consentement à l'accès caméra et photos de preuve",
    cameraConsentDesc: "Permet de prendre des photos de preuve horodatées et certifiées SHA pour le Passeport.",
    marketingConsentLabel: "📣 Consentement aux recommandations et conseils de voyage",
    marketingConsentDesc: "Recevez des e-mails sur les nouvelles pistes cyclables, défis photos et réductions.",
    aiConsentLabel: "🤖 Consentement à la personnalisation par IA par Tadzik",
    aiConsentDesc: "Adapte les conseils à votre rythme et à vos besoins d'accessibilité.",
    telemetryConsentLabel: "📊 Télémétrie UX anonyme et diagnostic",
    telemetryConsentDesc: "Nous aide à améliorer les performances sans suivi intersite.",
    termsConsentError: "L'acceptation des Conditions et de la Politique RGPD est obligatoire.",
    privacyCenterTab: "Centre de Confidentialité RGPD",
    profileTab: "Profil & Abonnement",
    travelHistoryTab: "Journal de Voyage",
    exportDataTitle: "Portabilité des Données (Art. 20 RGPD)",
    exportDataBtn: "Télécharger toutes mes données (JSON)",
    exportDataDesc: "Droit à la portabilité : Téléchargez une copie JSON de votre profil et de vos données de voyage.",
    minimalPrivacyBtn: "Activer le Mode Confidentialité Minimale",
    minimalPrivacyDesc: "Révoque immédiatement tous les consentements optionnels.",
    consentManagerTitle: "Gestion des Consentements (Art. 7(3) RGPD)",
    consentManagerDesc: "Activez ou désactivez les consentements individuels à tout moment.",
    deleteAccountTitle: "Droit à l'Effacement (Art. 17 RGPD)",
    deleteAccountBtn: "Supprimer définitivement mon compte et mes données",
    deleteAccountWarning: "Attention : cette action supprimera définitivement votre profil et vos données.",
    deleteAccountConfirmPrompt: "Êtes-vous sûr de vouloir supprimer définitivement votre compte ?",
    deleteAccountConfirmBtn: "Oui, supprimer définitivement",
    deleteAccountCancelBtn: "Annuler",
    saveProfileBtn: "Enregistrer les modifications",
    profileUpdatedSuccess: "Données du profil mises à jour avec succès !",
  },
  ro: {
    firstName: "Prenume",
    lastName: "Nume de familie",
    email: "Adresă de e-mail",
    phone: "Număr de telefon",
    dob: "Data nașterii",
    verificationMethod: "Metodă de verificare a identității",
    verificationValue: "Număr card sau document",
    registerTitle: "Înregistrare",
    loginTitle: "Autentificare",
    verifySeniorCard: "Card European de Senior",
    verifyIdCard: "Carte de Identitate / Pașaport",
    verifyRegular: "Pașaport de Călător Tadzik",
    verifyDobPrompt: "Verificarea vârstei (Recomandat)",
    recoverViaPhone: "Recuperare cont prin telefon 📱",
    recoverMethod: "Ce dorești să recuperezi?",
    recoverPassword: "Recuperează parola",
    recoverEmail: "Recuperează e-mailul / utilizatorul",
    phoneRequired: "Număr de telefon înregistrat",
    dobRequired: "Data nașterii pentru verificare",
    recoverBtn: "Verifică identitatea și recuperează",
    backToLogin: "Anulează și revino la autentificare",
    errorNoUser: "Nu a fost găsit niciun cont cu acest număr de telefon și această dată de naștere.",
    successEmailFound: "Cont verificat! E-mailul tău înregistrat este:",
    successResetPassword: "Identitate verificată! Introdu noua parolă pentru contul:",
    setNewPasswordBtn: "Salvează și setează parola nouă",
    passwordChanged: "Parola a fost schimbată cu succes! Te poți autentifica acum.",
    requiredFields: "Vă rugăm să completați toate câmpurile obligatorii.",
    pwdMismatch: "Parola trebuie să aibă cel puțin 4 caractere.",
    userExists: "Există deja un cont înregistrat cu această adresă de e-mail.",
    welcomeBack: "Autentificare reușită! Bine ai revenit.",
    invalidPwd: "Parolă incorectă. Te rugăm să încerci din nou.",
    noUserWithEmail: "Nu există niciun cont cu acest e-mail. Înregistrează-te mai jos.",
    gdprHeader: "Protecția Datelor și Consimțăminte (GDPR)",
    privacyByDesignNotice: "Confidențialitate implicită: Fără module de urmărire preactivate.",
    oneTimeConsentNotice: "💡 Consimțământ unic la înregistrare: Aplicația memorează opțiunile tale și nu te va mai întreba la fiecare pornire.",
    grantAllConsentsBtn: "✨ Acordă toate permisiunile cu 1 click (Recomandat)",
    termsConsentLabel: "Accept Termenii Serviciului și Politica de Confidențialitate (GDPR)",
    termsConsentRequired: "Necesar pentru furnizarea serviciului (Art. 6(1)(b) GDPR)",
    viewGdprDetails: "Vezi clauza completă de informare GDPR și drepturile tale",
    optionalConsentsTitle: "Consimțăminte opționale (pot fi revocate oricând):",
    geoConsentLabel: "📍 Consimțământ pentru geolocalizare GPS precisă",
    geoConsentDesc: "Permite detectarea automată a gărilor și calculul marjei de siguranță pentru întoarcere (Safe Headway).",
    cameraConsentLabel: "📷 Consimțământ pentru cameră și fotografii de probă",
    cameraConsentDesc: "Permite realizarea de fotografii doveditoare cu marcaj temporal și hash SHA pentru Pașaport.",
    marketingConsentLabel: "📣 Consimțământ pentru recomandări turistice și ponturi",
    marketingConsentDesc: "Primește e-mailuri cu trasee noi de bicicletă, concursuri foto și oferte.",
    aiConsentLabel: "🤖 Consimțământ pentru personalizare AI prin Tadzik",
    aiConsentDesc: "Adaptează recomandările la ritmul tău de călătorie și accesibilitate.",
    telemetryConsentLabel: "📊 Telemetrie anonimă UX și analiză de performanță",
    telemetryConsentDesc: "Ne ajută să îmbunătățim aplicația fără urmărire pe alte site-uri.",
    termsConsentError: "Acceptarea Termenilor și a Politicii GDPR este obligatorie.",
    privacyCenterTab: "Centrul de Confidențialitate GDPR",
    profileTab: "Profil și Abonament",
    travelHistoryTab: "Jurnal de Călătorie",
    exportDataTitle: "Portabilitatea Datelor (Art. 20 GDPR)",
    exportDataBtn: "Descarcă toate datele mele (JSON)",
    exportDataDesc: "Dreptul la portabilitate: Descarcă o copie JSON a profilului și istoricului tău.",
    minimalPrivacyBtn: "Activează Modul de Confidențialitate Minimă",
    minimalPrivacyDesc: "Revocă imediat toate consimțămintele opționale.",
    consentManagerTitle: "Gestionarea Consimțămintelor (Art. 7(3) GDPR)",
    consentManagerDesc: "Activează sau dezactivează consimțămintele individuale oricând.",
    deleteAccountTitle: "Dreptul de a fi Uitat (Art. 17 GDPR)",
    deleteAccountBtn: "Șterge definitiv contul și toate datele mele",
    deleteAccountWarning: "Atenție: Această acțiune va șterge ireversibil profilul, ștampilele și istoricul.",
    deleteAccountConfirmPrompt: "Sigur dorești să îți ștergi definitiv contul și datele?",
    deleteAccountConfirmBtn: "Da, șterge definitiv",
    deleteAccountCancelBtn: "Anulează",
    saveProfileBtn: "Salvează modificările profilului",
    profileUpdatedSuccess: "Datele profilului au fost actualizate cu succes!",
  },
  zh: {
    firstName: "名",
    lastName: "姓氏",
    email: "电子邮箱",
    phone: "电话号码",
    dob: "出生日期",
    verificationMethod: "身份验证方式",
    verificationValue: "证件/会员卡号",
    registerTitle: "注册新账户",
    loginTitle: "登录账户",
    verifySeniorCard: "欧洲长者优待卡",
    verifyIdCard: "身份证 / 护照",
    verifyRegular: "Tadzik 旅行家会员卡",
    verifyDobPrompt: "年龄验证 (推荐长者选择)",
    recoverViaPhone: "通过手机号找回账户 📱",
    recoverMethod: "您需要找回什么？",
    recoverPassword: "找回/重置密码",
    recoverEmail: "找回登录邮箱 / 用户名",
    phoneRequired: "注册时填写的电话号码",
    dobRequired: "用于验证的出生日期",
    recoverBtn: "验证身份并找回",
    backToLogin: "取消并返回登录",
    errorNoUser: "未找到与该电话号码和出生日期匹配的用户账户。",
    successEmailFound: "身份验证成功！您注册的电子邮箱为：",
    successResetPassword: "身份验证成功！请为该账户设置新密码：",
    setNewPasswordBtn: "保存并设置新密码",
    passwordChanged: "密码修改成功！您现在可以登录了。",
    requiredFields: "请完整填写所有必填字段。",
    pwdMismatch: "密码长度必须至少为 4 个字符。",
    userExists: "该邮箱地址已被注册，请直接登录。",
    welcomeBack: "登录成功！欢迎回来。",
    invalidPwd: "密码错误，请重试或找回密码。",
    noUserWithEmail: "未找到该邮箱对应的账户，请在下方注册。",
    gdprHeader: "数据保护与隐私授权 (GDPR / RODO)",
    privacyByDesignNotice: "默认隐私安全设计：默认不开启任何追踪器，所有授权均由您自主选择。",
    oneTimeConsentNotice: "💡 注册时一次性授权：系统将记住您的偏好，避免每次启动应用时重复弹窗打扰。",
    grantAllConsentsBtn: "✨ 一键开启所有权限与推荐（推荐）",
    termsConsentLabel: "我已阅读并同意服务条款与隐私政策 (GDPR)",
    termsConsentRequired: "提供核心旅行服务所必需 (GDPR 第 6(1)(b) 条)",
    viewGdprDetails: "查看完整的 GDPR 隐私条款与您的权利说明",
    optionalConsentsTitle: "可选授权项（您可以随时开启或撤回）：",
    geoConsentLabel: "📍 允许获取精确 GPS 地理位置",
    geoConsentDesc: "用于自动查找周边最近的车站，并计算 30 分钟安全返回余量 (Safe Headway)。",
    cameraConsentLabel: "📷 允许访问相机与防伪照片拍摄",
    cameraConsentDesc: "用于为旅行护照收集和摄影挑战拍摄带有时间戳及防伪签名的证明照片。",
    marketingConsentLabel: "📣 允许接收旅行推荐与实用贴士通知",
    marketingConsentDesc: "通过邮件接收精选骑行路线、摄影打卡竞赛与景点门票优惠信息。",
    aiConsentLabel: "🤖 允许 Tadzik 进行 AI 偏好画像与个性化定制",
    aiConsentDesc: "根据您的旅行节奏与无障碍需求（如长者/推车友好）定制路线。",
    telemetryConsentLabel: "📊 允许匿名 UX 性能诊断与数据分析",
    telemetryConsentDesc: "帮助我们持续优化应用体验，绝不进行跨网站追踪。",
    termsConsentError: "注册前必须同意服务条款与隐私政策 (GDPR)。",
    privacyCenterTab: "GDPR 隐私中心",
    profileTab: "个人资料与会员",
    travelHistoryTab: "旅行日志",
    exportDataTitle: "数据可携带权 (GDPR 第 20 条)",
    exportDataBtn: "导出并下载我的全部数据 (JSON)",
    exportDataDesc: "数据可携带权：以通用的 JSON 格式完整下载您的个人资料、打卡记录、徽章与授权信息。",
    minimalPrivacyBtn: "一键启用最低隐私模式",
    minimalPrivacyDesc: "立即撤回所有可选授权，严格遵循默认隐私保护原则。",
    consentManagerTitle: "授权管理 (GDPR 第 7(3) 条)",
    consentManagerDesc: "随时开启或关闭各项独立授权，设置即时生效。",
    deleteAccountTitle: "被遗忘权 / 账户注销 (GDPR 第 17 条)",
    deleteAccountBtn: "永久注销账户并彻底删除全部数据",
    deleteAccountWarning: "警告：此操作不可逆，将彻底清除您的个人资料、徽章贴纸与所有旅行历史记录。",
    deleteAccountConfirmPrompt: "您确定要彻底注销账户并永久删除全部数据吗？",
    deleteAccountConfirmBtn: "是的，确认彻底删除",
    deleteAccountCancelBtn: "取消",
    saveProfileBtn: "保存资料修改",
    profileUpdatedSuccess: "个人资料更新成功！",
  }
};

// Helper to calculate precise age from Date of Birth string (YYYY-MM-DD)
export const calculateAgeFromDob = (dobString?: string): number => {
  if (!dobString) return 0;
  const parts = dobString.split('-');
  if (parts.length < 3) return 0;
  const birthYear = parseInt(parts[0], 10);
  const birthMonth = parseInt(parts[1], 10) - 1;
  const birthDay = parseInt(parts[2], 10);
  const birthDate = new Date(birthYear, birthMonth, birthDay);
  if (isNaN(birthDate.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birthYear;
  const m = today.getMonth() - birthMonth;
  if (m < 0 || (m === 0 && today.getDate() < birthDay)) {
    age--;
  }
  return age >= 0 ? age : 0;
};

export default function AccountModal({ 
  language, 
  onLanguageChange, 
  account, 
  onUpdateAccount, 
  onNavigateTab 
}: AccountModalProps) {
  const t = translations[language];
  const loc = localT[language] || localT['en'];
  const pl = language === 'pl';
  
  // Login / Register Form State
  const [isRegister, setIsRegister] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // New Registration Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+48');
  const [phoneBody, setPhoneBody] = useState('');
  const [dob, setDob] = useState('');
  const [largeFontPreference, setLargeFontPreference] = useState<boolean | null>(null);
  const [regIceName, setRegIceName] = useState('');
  const [regIcePhone, setRegIcePhone] = useState('');
  const [regHomeTarget, setRegHomeTarget] = useState('Amsterdam Centraal');
  const [verificationMethod, setVerificationMethod] = useState('senior_card');
  const [verificationValue, setVerificationValue] = useState('');

  // Password / Email Recovery via Phone Number State
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryType, setRecoveryType] = useState<'password' | 'email'>('password');
  const [recoveryPhonePrefix, setRecoveryPhonePrefix] = useState('+48');
  const [recoveryPhoneBody, setRecoveryPhoneBody] = useState('');
  const [recoveryDob, setRecoveryDob] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');
  const [foundEmail, setFoundEmail] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetAccountUsername, setResetAccountUsername] = useState('');

  // GDPR / RODO Consents state for registration (ALL MUST DEFAULT TO FALSE - NO PRE-TICKED CHECKBOXES)
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [geolocationConsent, setGeolocationConsent] = useState(false);
  const [cameraConsent, setCameraConsent] = useState(false);
  const [notificationsConsent, setNotificationsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [aiPersonalizationConsent, setAiPersonalizationConsent] = useState(false);
  const [telemetryConsent, setTelemetryConsent] = useState(false);

  // Convenient 1-Click helper to grant all permissions at once upon registration
  const handleGrantAllConsents = () => {
    setTermsAccepted(true);
    setGeolocationConsent(true);
    setCameraConsent(true);
    setNotificationsConsent(true);
    setMarketingConsent(true);
    setAiPersonalizationConsent(true);
    setTelemetryConsent(true);
  };

  // Privacy Policy modal & subtab states
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showPWAInstallModal, setShowPWAInstallModal] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'profile' | 'location' | 'favorites' | 'privacy' | 'history'>('profile');

  // Location / GPS State in Profile
  const [profileGpsState, setProfileGpsState] = useState<GpsLocationState>(() => {
    try {
      const stored = localStorage.getItem('tadzik_user_gps_location');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      coords: { lat: 51.9244, lng: 4.4777 },
      status: 'idle',
      locationName: account?.homeStationOrHotel || 'Rotterdam Centraal (51.9244°N, 4.4777°E)',
      accuracyMeters: 15
    };
  });
  const [customAddressInput, setCustomAddressInput] = useState('');
  const [locationFeedbackMsg, setLocationFeedbackMsg] = useState<string | null>(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);

  // Edit profile state (Right to Rectification - Art. 16 RODO)
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editLargeFontMode, setEditLargeFontMode] = useState(false);
  const [editIceName, setEditIceName] = useState('');
  const [editIcePhone, setEditIcePhone] = useState('');
  const [editHomeTarget, setEditHomeTarget] = useState('');
  const [editSuccessMessage, setEditSuccessMessage] = useState('');

  // Sync edit profile form fields whenever account changes
  useEffect(() => {
    if (account) {
      setEditFirstName(account.firstName || '');
      setEditLastName(account.lastName || '');
      setEditPhone(account.phone || '');
      setEditDob(account.dob || '');
      setEditLargeFontMode(account.largeFontMode ?? (account.dob ? calculateAgeFromDob(account.dob) >= 50 : false));
      setEditIceName(account.iceContact?.name || '');
      setEditIcePhone(account.iceContact?.phone || '');
      setEditHomeTarget(account.homeStationOrHotel || '');
    }
  }, [account]);

  // Export User Data in JSON format (Right to Data Portability - Art. 20 RODO)
  const handleExportUserData = () => {
    if (!account) return;
    const exportPayload = {
      metadata: {
        exportedAt: new Date().toISOString(),
        exportVersion: "RODO-AVG-GDPR-2026.1",
        dataController: "Tadzik Tourist Companion (Holenderski Przewodnik)",
        purpose: "Realizacja prawa do przenoszenia danych (Art. 20 RODO / AVG / GDPR)",
        legalNotice: "Wszystkie dane osobowe przetwarzane są zgodnie z RODO i zasadami Privacy by Design."
      },
      userProfile: {
        username: account.username,
        firstName: account.firstName || '',
        lastName: account.lastName || '',
        email: account.email || account.username,
        phone: account.phone || '',
        dob: account.dob || '',
        registeredAt: account.registeredAt || new Date().toISOString().split('T')[0],
        hasPaid: account.hasPaid,
        paymentMethod: account.paymentMethod || 'none',
        subscriptionExpiry: account.subscriptionExpiry || '2027-01-01'
      },
      privacyAndConsents: account.privacyConsents || {
        termsAccepted: true,
        termsAcceptedAt: account.registeredAt || new Date().toISOString(),
        geolocationConsent: false,
        cameraConsent: false,
        notificationsConsent: false,
        marketingConsent: false,
        aiPersonalizationConsent: false,
        telemetryConsent: false,
        lastConsentUpdate: new Date().toISOString(),
        consentVersion: 'GDPR-2026.1'
      },
      travelData: {
        visitedAttractionsCount: account.visitedAttractions?.length || 0,
        visitedAttractions: account.visitedAttractions || [],
        collectedStamps: account.collectedStamps || [],
        visitedHistory: account.visitedHistory || [],
        submittedPhotos: account.submittedPhotos || {}
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tadzik_gdpr_export_${(account.username || 'user').replace(/[^a-zA-Z0-9]/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Toggle Granular Consent in Real-Time (Right to Revoke Consent - Art. 7(3) RODO)
  const handleToggleConsent = (consentKey: keyof UserPrivacyConsents) => {
    if (!account) return;
    const currentConsents: UserPrivacyConsents = account.privacyConsents || {
      termsAccepted: true,
      termsAcceptedAt: account.registeredAt || new Date().toISOString(),
      geolocationConsent: false,
      cameraConsent: false,
      notificationsConsent: false,
      marketingConsent: false,
      aiPersonalizationConsent: false,
      telemetryConsent: false,
      lastConsentUpdate: new Date().toISOString(),
      consentVersion: 'GDPR-2026.1'
    };

    const updatedConsents: UserPrivacyConsents = {
      ...currentConsents,
      [consentKey]: !currentConsents[consentKey],
      lastConsentUpdate: new Date().toISOString()
    };

    if (consentKey === 'geolocationConsent') {
      try {
        localStorage.setItem('tadzik_gps_consent_granted', String(updatedConsents.geolocationConsent));
      } catch (e) {}
    }

    const updatedAccount: UserAccount = {
      ...account,
      privacyConsents: updatedConsents
    };

    try {
      localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
      localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAccount));
    } catch (err) {
      console.error("Error updating consents:", err);
    }
    onUpdateAccount(updatedAccount);
  };

  // Apply Minimal Privacy Mode (Privacy by Default / Right to Restriction of Processing - Art. 18 RODO)
  const handleApplyMinimalPrivacy = () => {
    if (!account) return;
    const updatedConsents: UserPrivacyConsents = {
      termsAccepted: true,
      termsAcceptedAt: account.privacyConsents?.termsAcceptedAt || new Date().toISOString(),
      geolocationConsent: false,
      cameraConsent: false,
      notificationsConsent: false,
      marketingConsent: false,
      aiPersonalizationConsent: false,
      telemetryConsent: false,
      lastConsentUpdate: new Date().toISOString(),
      consentVersion: 'GDPR-2026.1'
    };

    try {
      localStorage.setItem('tadzik_gps_consent_granted', 'false');
    } catch (e) {}

    const updatedAccount: UserAccount = {
      ...account,
      privacyConsents: updatedConsents
    };

    try {
      localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
      localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAccount));
    } catch (err) {
      console.error("Error applying minimal privacy:", err);
    }
    onUpdateAccount(updatedAccount);
  };

  // Update Profile Information (Right to Rectification - Art. 16 RODO)
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    setEditSuccessMessage('');

    const calculatedAge = calculateAgeFromDob(editDob);
    const updatedAccount: UserAccount = {
      ...account,
      firstName: editFirstName.trim(),
      lastName: editLastName.trim(),
      phone: editPhone.trim(),
      dob: editDob,
      age: calculatedAge,
      largeFontMode: editLargeFontMode,
      iceContact: editIcePhone ? { name: editIceName.trim() || (language === 'pl' ? 'Osoba bliska (ICE)' : 'ICE Contact'), phone: editIcePhone.trim() } : account.iceContact,
      homeStationOrHotel: editHomeTarget.trim() || account.homeStationOrHotel
    };

    if (editLargeFontMode) {
      document.documentElement.classList.add('large-font-mode');
    } else {
      document.documentElement.classList.remove('large-font-mode');
    }

    try {
      localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
      localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAccount));
      onUpdateAccount(updatedAccount);
      setEditSuccessMessage(loc.profileUpdatedSuccess);
      setTimeout(() => setEditSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage("Error updating profile in Local Storage.");
    }
  };

  // Permanently Delete Account (Right to Erasure / Right to be Forgotten - Art. 17 RODO)
  const handleDeleteAccount = () => {
    if (!account) return;
    const userKey = `user_profile_${account.username.toLowerCase()}`;
    localStorage.removeItem(userKey);
    localStorage.removeItem('nl_tourist_planner_account');
    onUpdateAccount(null);
    setShowDeleteAccountConfirm(false);
    setIsRegister(true);
    setErrorMessage('');
  };

  // Popular Train Stations and Departure Hubs across NL & EU
  const POPULAR_LOCATION_HUBS = [
    { name: 'Rotterdam Centraal', lat: 51.9244, lng: 4.4777, flag: '🇳🇱', country: 'Holandia / NL', desc: 'Główny hub kolejowy i metra RET' },
    { name: 'Amsterdam Centraal', lat: 52.3791, lng: 4.9003, flag: '🇳🇱', country: 'Holandia / NL', desc: 'Centrum stolicy, promy IJ i tramwaje GVB' },
    { name: 'Utrecht Centraal', lat: 52.0894, lng: 5.1102, flag: '🇳🇱', country: 'Holandia / NL', desc: 'Największy węzeł przesiadkowy w sercu Niderlandów' },
    { name: 'Den Haag Centraal', lat: 52.0809, lng: 4.3242, flag: '🇳🇱', country: 'Holandia / NL', desc: 'Dworzec Hagi, blisko plaży Scheveningen' },
    { name: 'Eindhoven Centraal', lat: 51.4433, lng: 5.4814, flag: '🇳🇱', country: 'Holandia / NL', desc: 'Węzeł technologiczny Brabancji i lotnisko EIN' },
    { name: 'Kraków Główny', lat: 50.0667, lng: 19.9481, flag: '🇵🇱', country: 'Polska / PL', desc: 'Dworzec Główny w Małopolsce, szybki tramwaj' },
    { name: 'Warszawa Centralna', lat: 52.2288, lng: 21.0032, flag: '🇵🇱', country: 'Polska / PL', desc: 'Dworzec Centralny w sercu stolicy Polski' },
    { name: 'Gdańsk Główny', lat: 54.3561, lng: 18.6446, flag: '🇵🇱', country: 'Polska / PL', desc: 'Zabytkowy dworzec Trójmiasta i SKM' },
    { name: 'Wrocław Główny', lat: 51.0989, lng: 17.0366, flag: '🇵🇱', country: 'Polska / PL', desc: 'Neogotycki węzeł Dolnego Śląska' },
    { name: 'Brussels Central', lat: 50.8455, lng: 4.3571, flag: '🇧🇪', country: 'Belgia / BE', desc: 'Serce stolicy Europy i Grand Place' },
    { name: 'Berlin Hbf', lat: 52.5251, lng: 13.3694, flag: '🇩🇪', country: 'Niemcy / DE', desc: 'Nowoczesny wielopoziomowy Hauptbahnhof' },
    { name: 'Paris Gare du Nord', lat: 48.8809, lng: 2.3553, flag: '🇫🇷', country: 'Francja / FR', desc: 'Najbardziej ruchliwy dworzec we Francji' },
  ];

  const handleRefreshProfileGps = () => {
    setIsLocatingGps(true);
    setLocationFeedbackMsg(null);
    setProfileGpsState(prev => ({ ...prev, status: 'locating' }));

    getLiveGpsLocation()
      .then((res) => {
        const newState: GpsLocationState = {
          coords: res.coords,
          status: 'success',
          locationName: res.locationName,
          accuracyMeters: res.accuracy,
          updatedAt: Date.now()
        };
        setProfileGpsState(newState);
        setIsLocatingGps(false);
        try {
          localStorage.setItem('tadzik_user_gps_location', JSON.stringify(newState));
          localStorage.setItem('tadzik_gps_consent_granted', 'true');
        } catch (e) {}

        if (account) {
          const updatedAcc: UserAccount = {
            ...account,
            homeStationOrHotel: res.locationName,
            privacyConsents: {
              termsAccepted: true,
              termsAcceptedAt: account.privacyConsents?.termsAcceptedAt || new Date().toISOString(),
              geolocationConsent: true,
              cameraConsent: account.privacyConsents?.cameraConsent ?? false,
              marketingConsent: account.privacyConsents?.marketingConsent ?? false,
              aiPersonalizationConsent: account.privacyConsents?.aiPersonalizationConsent ?? false,
              telemetryConsent: account.privacyConsents?.telemetryConsent ?? false,
              notificationsConsent: account.privacyConsents?.notificationsConsent ?? true,
              lastConsentUpdate: new Date().toISOString(),
              consentVersion: 'GDPR-2026.1'
            }
          };
          try {
            localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAcc));
            localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAcc));
          } catch (e) {}
          onUpdateAccount(updatedAcc);
        }

        const msg = language === 'pl'
          ? '📡 Współrzędne GPS zostały pomyślnie zaktualizowane i zapisane w Twoim profilu!'
          : language === 'nl'
          ? '📡 GPS-coördinaten succesvol bijgewerkt en opgeslagen in uw profiel!'
          : '📡 Live GPS position successfully acquired and stored in your profile!';
        setLocationFeedbackMsg(msg);
        setTimeout(() => setLocationFeedbackMsg(null), 4000);
      })
      .catch((err) => {
        setIsLocatingGps(false);
        setProfileGpsState(prev => ({
          ...prev,
          status: 'error',
          errorMessage: err.message
        }));
        const errMsg = language === 'pl'
          ? '⚠️ Nie udało się pobrać lokalizacji GPS (brak uprawnień w przeglądarce lub sygnału). Możesz wybrać stację z listy poniżej.'
          : language === 'nl'
          ? '⚠️ Kan GPS-locatie niet ophalen (geen toestemming of geen signaal). U kunt een station kiezen uit de lijst.'
          : '⚠️ Could not acquire GPS location (permission denied or timeout). You can select a departure hub below.';
        setLocationFeedbackMsg(errMsg);
        setTimeout(() => setLocationFeedbackMsg(null), 5000);
      });
  };

  const handleSelectLocationHub = (hub: typeof POPULAR_LOCATION_HUBS[0]) => {
    const formattedName = `${hub.name} (${hub.lat.toFixed(4)}°N, ${hub.lng.toFixed(4)}°E)`;
    const newState: GpsLocationState = {
      coords: { lat: hub.lat, lng: hub.lng },
      status: 'success',
      locationName: formattedName,
      accuracyMeters: 5,
      updatedAt: Date.now()
    };
    setProfileGpsState(newState);
    setEditHomeTarget(hub.name);
    try {
      localStorage.setItem('tadzik_user_gps_location', JSON.stringify(newState));
    } catch (e) {}

    if (account) {
      const updatedAcc: UserAccount = {
        ...account,
        homeStationOrHotel: hub.name
      };
      try {
        localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAcc));
        localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAcc));
      } catch (e) {}
      onUpdateAccount(updatedAcc);
    }

    const msg = language === 'pl'
      ? `📍 Ustawiono stację bazową: ${hub.name} (${hub.country})`
      : language === 'nl'
      ? `📍 Thuisstation ingesteld: ${hub.name} (${hub.country})`
      : `📍 Base location set to: ${hub.name} (${hub.country})`;
    setLocationFeedbackMsg(msg);
    setTimeout(() => setLocationFeedbackMsg(null), 3500);
  };

  const handleSaveCustomLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddressInput.trim() || !account) return;

    const trimmed = customAddressInput.trim();
    const updatedAcc: UserAccount = {
      ...account,
      homeStationOrHotel: trimmed
    };

    const newState: GpsLocationState = {
      ...profileGpsState,
      locationName: trimmed,
      updatedAt: Date.now()
    };
    setProfileGpsState(newState);
    setEditHomeTarget(trimmed);
    try {
      localStorage.setItem('tadzik_user_gps_location', JSON.stringify(newState));
      localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAcc));
      localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAcc));
    } catch (e) {}
    onUpdateAccount(updatedAcc);
    setCustomAddressInput('');

    const msg = language === 'pl'
      ? `✓ Pomyślnie zapisano własną lokalizację / hotel: "${trimmed}"`
      : language === 'nl'
      ? `✓ Aangepaste locatie / hotel succesvol opgeslagen: "${trimmed}"`
      : `✓ Custom location / hotel successfully saved: "${trimmed}"`;
    setLocationFeedbackMsg(msg);
    setTimeout(() => setLocationFeedbackMsg(null), 3500);
  };

  // Automatically select default prefix based on language
  useEffect(() => {
    if (language === 'pl') {
      setPhonePrefix('+48');
      setRecoveryPhonePrefix('+48');
    } else if (language === 'nl') {
      setPhonePrefix('+31');
      setRecoveryPhonePrefix('+31');
    } else {
      setPhonePrefix('+31');
      setRecoveryPhonePrefix('+31');
    }
  }, [language]);

  const handleRecoverAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setRecoverySuccess('');
    setFoundEmail('');
    setShowPasswordReset(false);

    if (!recoveryPhoneBody.trim() || !recoveryDob) {
      setErrorMessage(loc.requiredFields);
      return;
    }

    const fullRecoveryPhone = `${recoveryPhonePrefix} ${recoveryPhoneBody.trim()}`;
    const cleanInputPhone = fullRecoveryPhone.replace(/\s+/g, '');
    const cleanBodyOnly = recoveryPhoneBody.trim().replace(/\s+/g, '');
    let matchedProfile: UserAccount | null = null;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('user_profile_')) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw) as UserAccount;
            const cleanProfilePhone = (parsed.phone || '').trim().replace(/\s+/g, '');
            const isMatch = (cleanProfilePhone === cleanInputPhone) || 
                            (!cleanProfilePhone.startsWith('+') && cleanProfilePhone === cleanBodyOnly) ||
                            (cleanProfilePhone.endsWith(cleanBodyOnly) && cleanBodyOnly.length >= 7);
            if (cleanProfilePhone && isMatch && parsed.dob === recoveryDob) {
              matchedProfile = parsed;
              break;
            }
          }
        } catch (err) {
          // ignore
        }
      }
    }

    if (!matchedProfile) {
      setErrorMessage(loc.errorNoUser);
      return;
    }

    if (recoveryType === 'email') {
      const emailValue = matchedProfile.email || matchedProfile.username;
      setFoundEmail(emailValue);
      setRecoverySuccess(`${loc.successEmailFound} ${emailValue}`);
    } else {
      setResetAccountUsername(matchedProfile.username);
      setShowPasswordReset(true);
      setRecoverySuccess(`${loc.successResetPassword} ${matchedProfile.email || matchedProfile.username}`);
    }
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 4) {
      setErrorMessage(loc.pwdMismatch);
      return;
    }

    try {
      const key = `user_profile_${resetAccountUsername.toLowerCase()}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as UserAccount;
        parsed.password = newPassword;
        localStorage.setItem(key, JSON.stringify(parsed));
        
        // Update active session if relevant
        const activeRaw = localStorage.getItem('nl_tourist_planner_account');
        if (activeRaw) {
          const activeParsed = JSON.parse(activeRaw) as UserAccount;
          if (activeParsed.username.toLowerCase() === resetAccountUsername.toLowerCase()) {
            activeParsed.password = newPassword;
            localStorage.setItem('nl_tourist_planner_account', JSON.stringify(activeParsed));
            onUpdateAccount(activeParsed);
          }
        }
        
        setRecoverySuccess(loc.passwordChanged);
        setShowPasswordReset(false);
        setNewPassword('');
        setRecoveryPhoneBody('');
        setRecoveryDob('');
        
        setTimeout(() => {
          setShowRecovery(false);
          setIsRegister(false);
          setRecoverySuccess('');
        }, 2200);
      }
    } catch (err) {
      setErrorMessage("Error updating password in local storage.");
    }
  };

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'ideal' | 'wero' | 'card' | null>(null);
  const [selectedBank, setSelectedBank] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Travel Visit States
  const [newVisitName, setNewVisitName] = useState('');
  const [newVisitType, setNewVisitType] = useState<'city' | 'attraction' | 'town'>('attraction');
  const [newVisitDate, setNewVisitDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !newVisitName.trim()) return;

    const currentHistory = account.visitedHistory || [
      { name: language === 'pl' ? 'Dworzec Główny w Amsterdamie 🚉' : 'Amsterdam Centraal 🚉', type: 'town', date: '2026-07-07' },
      { name: language === 'pl' ? 'Muzeum Rijksmuseum 🎨' : 'Rijksmuseum 🎨', type: 'attraction', date: '2026-07-09' },
      { name: language === 'pl' ? 'Zabytkowe Centrum Utrechtu ⛪' : 'Utrecht Centraal ⛪', type: 'town', date: '2026-07-11' }
    ];

    const updatedHistory = [
      ...currentHistory,
      {
        name: newVisitName.trim(),
        type: newVisitType,
        date: newVisitDate
      }
    ].sort((a, b) => b.date.localeCompare(a.date));

    const updatedAccount: UserAccount = {
      ...account,
      visitedHistory: updatedHistory
    };

    try {
      localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
      localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAccount));
    } catch (err) {
      console.error("Local storage error:", err);
    }

    onUpdateAccount(updatedAccount);
    setNewVisitName('');
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isRegister) {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !phoneBody.trim() || !dob) {
        setErrorMessage(loc.requiredFields);
        return;
      }
      if (password.length < 4) {
        setErrorMessage(loc.pwdMismatch);
        return;
      }
      if (!termsAccepted) {
        setErrorMessage(loc.termsConsentError);
        return;
      }

      const lowerEmail = email.trim().toLowerCase();
      if (localStorage.getItem(`user_profile_${lowerEmail}`)) {
        setErrorMessage(loc.userExists);
        return;
      }

      const calculatedAge = calculateAgeFromDob(dob);
      const is50Plus = calculatedAge >= 50;
      const willUseLargeFont = largeFontPreference !== null ? largeFontPreference : is50Plus;

      const newUser: UserAccount = {
        username: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: `${phonePrefix} ${phoneBody.trim()}`,
        dob: dob,
        age: calculatedAge,
        largeFontMode: willUseLargeFont,
        iceContact: regIcePhone.trim() ? { name: regIceName.trim() || (language === 'pl' ? 'Osoba bliska (ICE)' : 'ICE Contact'), phone: regIcePhone.trim() } : undefined,
        homeStationOrHotel: regHomeTarget.trim() || 'Amsterdam Centraal',
        password: password,
        hasPaid: false,
        visitedAttractions: [],
        collectedStamps: [],
        submittedPhotos: {},
        registeredAt: new Date().toISOString(),
        privacyConsents: {
          termsAccepted: true,
          termsAcceptedAt: new Date().toISOString(),
          geolocationConsent: geolocationConsent,
          cameraConsent: cameraConsent,
          notificationsConsent: notificationsConsent,
          marketingConsent: marketingConsent,
          aiPersonalizationConsent: aiPersonalizationConsent,
          telemetryConsent: telemetryConsent,
          lastConsentUpdate: new Date().toISOString(),
          consentVersion: 'GDPR-2026.1'
        },
        visitedHistory: [
          { name: language === 'pl' ? 'Dworzec Główny w Amsterdamie 🚉' : 'Amsterdam Centraal 🚉', type: 'town', date: '2026-07-07' },
          { name: language === 'pl' ? 'Muzeum Rijksmuseum 🎨' : 'Rijksmuseum 🎨', type: 'attraction', date: '2026-07-09' },
          { name: language === 'pl' ? 'Zabytkowe Centrum Utrechtu ⛪' : 'Utrecht Centraal ⛪', type: 'town', date: '2026-07-11' }
        ]
      };

      try {
        localStorage.setItem(`user_profile_${lowerEmail}`, JSON.stringify(newUser));
        localStorage.setItem('nl_tourist_planner_account', JSON.stringify(newUser));
        localStorage.setItem('tadzik_gps_consent_granted', String(geolocationConsent));
        
        onUpdateAccount(newUser);

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setPhoneBody('');
        setDob('');
        setTermsAccepted(false);
        setGeolocationConsent(false);
        setCameraConsent(false);
        setNotificationsConsent(false);
        setMarketingConsent(false);
        setAiPersonalizationConsent(false);
        setTelemetryConsent(false);
      } catch (err) {
        setErrorMessage("Error saving profile to Local Storage.");
      }
    } else {
      if (!username.trim() || !password.trim()) {
        setErrorMessage(language === 'nl' ? 'Vul alstublieft alle velden in.' : 'Please fill in all fields.');
        return;
      }

      const lowerUser = username.trim().toLowerCase();

      if (lowerUser === 'szymon') {
        const mockUser: UserAccount = {
          username: 'Szymon',
          hasPaid: false,
          visitedAttractions: [],
          collectedStamps: ['Zuid-Holland', 'Noord-Holland'],
          submittedPhotos: {},
          privacyConsents: {
            termsAccepted: true,
            termsAcceptedAt: new Date().toISOString(),
            geolocationConsent: true,
            cameraConsent: false,
            notificationsConsent: false,
            marketingConsent: false,
            aiPersonalizationConsent: false,
            telemetryConsent: false,
            lastConsentUpdate: new Date().toISOString(),
            consentVersion: 'GDPR-2026.1'
          }
        };
        try {
          const stored = localStorage.getItem(`user_profile_szymon`);
          if (stored) {
            const parsed = JSON.parse(stored);
            localStorage.setItem('tadzik_gps_consent_granted', String(parsed.privacyConsents?.geolocationConsent ?? true));
            onUpdateAccount(parsed);
          } else {
            localStorage.setItem(`user_profile_szymon`, JSON.stringify(mockUser));
            localStorage.setItem('tadzik_gps_consent_granted', 'true');
            onUpdateAccount(mockUser);
          }
        } catch (err) {
          onUpdateAccount(mockUser);
        }
        return;
      }

      try {
        const stored = localStorage.getItem(`user_profile_${lowerUser}`);
        if (!stored) {
          setErrorMessage(loc.noUserWithEmail);
          return;
        }

        const parsed = JSON.parse(stored) as UserAccount;
        if (parsed.password && parsed.password !== password) {
          setErrorMessage(loc.invalidPwd);
          return;
        }

        localStorage.setItem('nl_tourist_planner_account', JSON.stringify(parsed));
        if (parsed.privacyConsents) {
          localStorage.setItem('tadzik_gps_consent_granted', String(parsed.privacyConsents.geolocationConsent ?? false));
        }
        onUpdateAccount(parsed);
      } catch (err) {
        setErrorMessage("Error fetching profile from Local Storage.");
      }
    }
  };

  const handleLogout = () => {
    onUpdateAccount(null);
    setPaymentSuccess(false);
    setPaymentMethod(null);
    setUsername('');
    setPassword('');
  };

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    if (paymentMethod === 'ideal' && !selectedBank) {
      alert(language === 'nl' ? 'Selecteer eerst uw bank.' : 'Please select your bank first.');
      return;
    }
    if (paymentMethod === 'card' && (!cardNumber || !cardName || !cardExpiry || !cardCvc)) {
      alert(language === 'nl' ? 'Vul alstublieft alle kaartgegevens in.' : 'Please fill in all card details.');
      return;
    }

    setPaymentProcessing(true);

    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      
      const updatedAccount: UserAccount = {
        ...account,
        hasPaid: true,
        paymentMethod: paymentMethod || 'card'
      };

      // Save to localStorage
      try {
        localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
        localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAccount));
      } catch (err) {
        console.error("Local storage error:", err);
      }

      onUpdateAccount(updatedAccount);
    }, 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm max-w-2xl mx-auto my-6" id="account-main-card">
      {/* Meticulous Micro Language Selector directly above Konto Użytkownika */}
      {onLanguageChange && (
        <div className="pb-3.5 mb-3.5 border-b border-slate-100 flex flex-col gap-1.5" id="micro-lang-selector">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 select-none">
            {language === 'pl' ? 'Wybierz język' : language === 'nl' ? 'Taal selecteren' : 'Select Language'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { code: 'pl', label: 'PL', flag: '🇵🇱' },
              { code: 'nl', label: 'NL', flag: '🇳🇱' },
              { code: 'en', label: 'EN', flag: '🇬🇧' },
              { code: 'de', label: 'DE', flag: '🇩🇪' },
              { code: 'fr', label: 'FR', flag: '🇫🇷' },
              { code: 'es', label: 'ES', flag: '🇪🇸' },
              { code: 'ro', label: 'RO', flag: '🇷🇴' },
              { code: 'zh', label: 'ZH', flag: '🇨🇳' },
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => onLanguageChange(lang.code as Language)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all border cursor-pointer select-none ${
                  language === lang.code
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
        <ShieldCheck className="w-6 h-6 text-indigo-600" />
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">{t.account}</h2>
          <p className="text-slate-500 text-xs">{t.orContinueMock}</p>
        </div>
      </div>

      {/* 1. NOT LOGGED IN STATE */}
      {!account ? (
        <div className="space-y-4">
          {showRecovery ? (
            <div className="space-y-4" id="phone-recovery-container">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>{loc.recoverViaPhone}</span>
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  {language === 'pl' 
                    ? 'Podaj swój numer telefonu oraz datę urodzenia podane podczas rejestracji, aby odzyskać dane dostępu.' 
                    : language === 'nl'
                    ? 'Voer uw telefoonnummer en geboortedatum in die u bij de registratie hebt opgegeven om uw inloggegevens te herstellen.'
                    : 'Enter your phone number and date of birth provided during registration to recover your access details.'}
                </p>
              </div>

              {errorMessage && (
                <div className="bg-rose-50 text-rose-700 border border-rose-200 p-2.5 rounded-lg font-medium text-xs" id="recovery-error">
                  {errorMessage}
                </div>
              )}

              {recoverySuccess && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl font-bold text-xs space-y-2" id="recovery-success">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>{recoverySuccess}</span>
                  </div>
                </div>
              )}

              {!showPasswordReset ? (
                <form onSubmit={handleRecoverAccount} className="space-y-4" id="phone-recovery-form">
                  {/* Select what to recover */}
                  <div>
                    <label className="block text-slate-700 font-semibold text-xs mb-1.5">
                      {loc.recoverMethod}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRecoveryType('password')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          recoveryType === 'password'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                        {language === 'pl' ? 'Hasło 🔑' : language === 'nl' ? 'Wachtwoord 🔑' : 'Password 🔑'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecoveryType('email')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          recoveryType === 'email'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                        {language === 'pl' ? 'E-mail / Login ✉️' : language === 'nl' ? 'E-mail / Login ✉️' : 'Email / Login ✉️'}
                      </button>
                    </div>
                  </div>

                  {/* Phone input with country prefix selector */}
                  <div>
                    <label className="block text-slate-700 font-semibold text-xs mb-1.5" htmlFor="recovery-phone-input">
                      {loc.phoneRequired} *
                    </label>
                    <div className="flex gap-1.5">
                      <div className="relative shrink-0">
                        <select
                          value={recoveryPhonePrefix}
                          onChange={(e) => setRecoveryPhonePrefix(e.target.value)}
                          className="appearance-none bg-slate-50/50 border border-slate-200 rounded-lg pl-2.5 pr-6 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer h-full"
                          style={{ minWidth: '85px' }}
                        >
                          {COUNTRIES.map((c) => (
                            <option key={`rec-prefix-${c.code}`} value={c.prefix}>
                              {c.flag} {c.prefix}
                            </option>
                          ))}
                        </select>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[7px] text-slate-500">▼</span>
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 select-none text-xs">
                          📞
                        </span>
                        <input
                          type="tel"
                          id="recovery-phone-input"
                          value={recoveryPhoneBody}
                          onChange={(e) => setRecoveryPhoneBody(e.target.value)}
                          className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 font-medium"
                          placeholder="e.g. 501 234 567"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* DOB input */}
                  <div>
                    <label className="block text-slate-700 font-semibold text-xs mb-1.5" htmlFor="recovery-dob-input">
                      {loc.dobRequired} *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 select-none text-xs">
                        📅
                      </span>
                      <input
                        type="date"
                        id="recovery-dob-input"
                        value={recoveryDob}
                        onChange={(e) => setRecoveryDob(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{loc.recoverBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRecovery(false);
                        setRecoverySuccess('');
                        setFoundEmail('');
                        setErrorMessage('');
                      }}
                      className="w-full text-xs font-bold text-slate-500 hover:text-slate-700 py-1 transition-colors cursor-pointer"
                    >
                      {loc.backToLogin}
                    </button>
                  </div>
                </form>
              ) : (
                /* Password Reset Form (Once Identity is verified!) */
                <form onSubmit={handleSaveNewPassword} className="space-y-4" id="password-reset-submit-form">
                  <div>
                    <label className="block text-slate-700 font-semibold text-xs mb-1.5" htmlFor="new-password-input">
                      {language === 'pl' ? 'Wprowadź nowe hasło' : language === 'nl' ? 'Nieuw wachtwoord invoeren' : 'Enter New Password'} *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 select-none text-xs">
                        🔑
                      </span>
                      <input
                        type="password"
                        id="new-password-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 font-medium"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
                    >
                      {loc.setNewPasswordBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRecovery(false);
                        setShowPasswordReset(false);
                        setRecoverySuccess('');
                        setErrorMessage('');
                      }}
                      className="w-full text-xs font-bold text-slate-500 hover:text-slate-700 py-1 transition-colors cursor-pointer"
                    >
                      {loc.backToLogin}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-4" id="auth-form">
              <div className="flex gap-4 border-b border-slate-100 pb-2">
                <button
                  type="button"
                  id="toggle-register"
                  onClick={() => setIsRegister(true)}
                  className={`text-sm font-bold pb-2 px-1 transition-all cursor-pointer ${
                    isRegister ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {loc.registerTitle}
                </button>
                <button
                  type="button"
                  id="toggle-login"
                  onClick={() => setIsRegister(false)}
                  className={`text-sm font-bold pb-2 px-1 transition-all cursor-pointer ${
                    !isRegister ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {loc.loginTitle}
                </button>
              </div>

              {errorMessage && (
                <div className="bg-rose-50 text-rose-700 border border-rose-200 p-2.5 rounded-lg font-medium text-xs" id="auth-error">
                  {errorMessage}
                </div>
              )}

              {/* RENDER FORM FIELDS DYNAMICALLY */}
              {isRegister ? (
                /* REGISTRATION FORM (With First Name, Last Name, Email, Password, Phone, DOB, Identity Verification Method) */
                <div className="space-y-3.5" id="register-fields-group">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold text-xs mb-1.5" htmlFor="reg-first-name">
                        {loc.firstName} *
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 select-none text-xs">
                          👤
                        </span>
                        <input
                          type="text"
                          id="reg-first-name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 font-medium"
                          placeholder="e.g. Jan"
                          required={isRegister}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold text-xs mb-1.5" htmlFor="reg-last-name">
                        {loc.lastName} *
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 select-none text-xs">
                          👤
                        </span>
                        <input
                          type="text"
                          id="reg-last-name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 font-medium"
                          placeholder="e.g. Kowalski"
                          required={isRegister}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold text-xs mb-1.5" htmlFor="reg-email">
                      {loc.email} *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 select-none text-xs">
                        ✉️
                      </span>
                      <input
                        type="email"
                        id="reg-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 font-medium"
                        placeholder="e.g. kowalski@gmail.com"
                        required={isRegister}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold text-xs mb-1.5" htmlFor="reg-password">
                      {t.password} *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 select-none text-xs">
                        🔑
                      </span>
                      <input
                        type="password"
                        id="reg-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 font-medium"
                        placeholder="••••••••"
                        required={isRegister}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold text-xs mb-1.5" htmlFor="reg-phone">
                        {loc.phone} *
                      </label>
                      <div className="flex gap-1.5">
                        <div className="relative shrink-0">
                          <select
                            value={phonePrefix}
                            onChange={(e) => setPhonePrefix(e.target.value)}
                            className="appearance-none bg-slate-50/50 border border-slate-200 rounded-lg pl-2.5 pr-6 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer h-full"
                            style={{ minWidth: '85px' }}
                          >
                            {COUNTRIES.map((c) => (
                              <option key={`reg-prefix-${c.code}`} value={c.prefix}>
                                {c.flag} {c.prefix}
                              </option>
                            ))}
                          </select>
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[7px] text-slate-500">▼</span>
                        </div>
                        <div className="relative flex-1">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 select-none text-xs">
                            📞
                          </span>
                          <input
                            type="tel"
                            id="reg-phone"
                            value={phoneBody}
                            onChange={(e) => setPhoneBody(e.target.value)}
                            className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 font-medium"
                            placeholder="e.g. 501 234 567"
                            required={isRegister}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold text-xs mb-1.5" htmlFor="reg-dob">
                        {loc.dob} *
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 select-none text-xs">
                          📅
                        </span>
                        <input
                          type="date"
                          id="reg-dob"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 font-medium"
                          required={isRegister}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Real-time Age & Senior 50+ Accessibility Banner */}
                  {dob && (() => {
                    const calcAge = calculateAgeFromDob(dob);
                    if (calcAge <= 0) return null;
                    const is50Plus = calcAge >= 50;
                    return (
                      <div className={`p-3 rounded-xl border transition-all duration-300 ${
                        is50Plus 
                          ? 'bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-emerald-500/10 border-amber-300 text-amber-950'
                          : 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                      }`}>
                        <div className="flex items-start gap-2.5">
                          <span className="text-xl shrink-0">{is50Plus ? '🌟' : '🎂'}</span>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-xs">
                                {language === 'pl' ? `Twój wiek: ${calcAge} lat` : `Your age: ${calcAge} years`}
                              </span>
                              {is50Plus && (
                                <span className="text-[10px] font-black uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                                  {language === 'pl' ? 'Profil 50+ Aktywny' : '50+ Profile'}
                                </span>
                              )}
                            </div>
                            {is50Plus ? (
                              <p className="text-[11px] text-amber-900 font-semibold leading-relaxed">
                                {language === 'pl'
                                  ? '✨ Wykryto wiek 50+! Dla Twojego komfortu automatycznie aktywujemy powiększoną, czytelną czcionkę oraz asystenta bezpieczeństwa i powrotu "Zgubiłem się".'
                                  : '✨ Age 50+ detected! Large readable font mode and the "I am lost" return assistant will be enabled automatically for maximum comfort.'}
                              </p>
                            ) : (
                              <p className="text-[11px] text-indigo-700 font-medium">
                                {language === 'pl' ? 'Standardowy profil podróżnika.' : 'Standard traveler profile.'}
                              </p>
                            )}

                            {/* Direct Font Toggle */}
                            <div className="pt-1 flex items-center gap-2">
                              <label className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-800 cursor-pointer">
                                <input 
                                  type="checkbox"
                                  checked={largeFontPreference !== null ? largeFontPreference : is50Plus}
                                  onChange={(e) => setLargeFontPreference(e.target.checked)}
                                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>{language === 'pl' ? '🔤 Włącz powiększoną czcionkę (Easy-to-read font)' : '🔤 Enable large readable font'}</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Optional Emergency ICE Setup in Registration */}
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span>🆘</span>
                        <span>{language === 'pl' ? 'Osoba kontaktowa ICE (W razie zgubienia - Opcjonalnie)' : 'Emergency ICE Contact (Optional)'}</span>
                      </span>
                      <span className="text-[9px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        {language === 'pl' ? 'Opcjonalne' : 'Optional'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder={language === 'pl' ? 'Imię bliskiej osoby / hotel' : 'Name of contact / hotel'}
                        value={regIceName}
                        onChange={(e) => setRegIceName(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:border-indigo-500"
                      />
                      <input
                        type="tel"
                        placeholder={language === 'pl' ? 'Telefon alarmowy ICE (np. +48 501...)' : 'ICE Phone number'}
                        value={regIcePhone}
                        onChange={(e) => setRegIcePhone(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* GDPR / RODO CONSENT & PRIVACY BY DESIGN & DEFAULT BOX */}
                  <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-3 bg-slate-50/80 -mx-1 p-3.5 rounded-xl border" id="gdpr-registration-consents-panel">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>{loc.gdprHeader}</span>
                      </div>
                      <span className="text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full tracking-wider">
                        Privacy by Default
                      </span>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
                          {loc.oneTimeConsentNotice}
                        </p>
                      </div>
                      <button
                        type="button"
                        id="grant-all-consents-btn"
                        onClick={handleGrantAllConsents}
                        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-lg text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>{loc.grantAllConsentsBtn}</span>
                      </button>
                    </div>

                    {/* 1. REQUIRED TERMS & PRIVACY POLICY ACCEPTANCE (Art. 6(1)(b) GDPR) - UNCHECKED BY DEFAULT */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 shadow-2xs">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          id="consent-terms-required"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                          required
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-850">{loc.termsConsentLabel} *</span>
                          <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                            {loc.termsConsentRequired}
                          </div>
                        </div>
                      </label>
                      <div className="pl-6.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowPrivacyModal(true)}
                          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 cursor-pointer flex items-center gap-1"
                        >
                          <span>📄</span>
                          <span>{loc.viewGdprDetails}</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. OPTIONAL & GRANULAR CONSENTS - STRICTLY UNCHECKED BY DEFAULT */}
                    <div className="space-y-2 pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {loc.optionalConsentsTitle}
                      </div>

                      {/* Geolocation Consent - Highlighted One-Time Registration Consent */}
                      <div className={`p-3 rounded-xl border transition-all ${
                        geolocationConsent 
                          ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/20 shadow-xs' 
                          : 'bg-white/95 border-indigo-200/80 hover:border-amber-300'
                      }`}>
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id="consent-opt-geo"
                            checked={geolocationConsent}
                            onChange={(e) => setGeolocationConsent(e.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer shrink-0"
                          />
                          <div className="text-[11px] flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-black text-slate-900">{loc.geoConsentLabel}</span>
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 border border-amber-300">
                                {language === 'pl' ? '⚡ 1 raz przy rejestracji' : '⚡ 1x at sign-up'}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-1 leading-normal font-medium">
                              {loc.geoConsentDesc}
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Camera & Photo Proof Consent */}
                      <div className="bg-white/90 p-2.5 rounded-lg border border-slate-200">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id="consent-opt-camera"
                            checked={cameraConsent}
                            onChange={(e) => setCameraConsent(e.target.checked)}
                            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                          />
                          <div className="text-[11px]">
                            <span className="font-bold text-slate-800">{loc.cameraConsentLabel}</span>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                              {loc.cameraConsentDesc}
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Push Notifications & Travel Alerts Consent */}
                      <div className="bg-white/90 p-2.5 rounded-lg border border-slate-200">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id="consent-opt-notifications"
                            checked={notificationsConsent}
                            onChange={(e) => setNotificationsConsent(e.target.checked)}
                            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                          />
                          <div className="text-[11px]">
                            <span className="font-bold text-slate-800">
                              {language === 'pl' ? '🔔 Zgoda na powiadomienia i alerty podróżne (Opcjonalna)' : language === 'nl' ? '🔔 Toestemming voor meldingen en reiswaarschuwingen (Optioneel)' : '🔔 Push Notifications & Travel Alerts Consent (Optional)'}
                            </span>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                              {language === 'pl' 
                                ? 'Powiadomienia o zbliżających się odjazdach pociągów, zmianach peronów oraz osiągnięciu celów podróży.'
                                : language === 'nl'
                                ? 'Meldingen over aankomende treinen, perronwijzigingen en bereikte bestemmingen.'
                                : 'Real-time alerts for train departures, platform changes, and reached destinations.'}
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Marketing & Travel Tips Consent */}
                      <div className="bg-white/90 p-2.5 rounded-lg border border-slate-200">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id="consent-opt-marketing"
                            checked={marketingConsent}
                            onChange={(e) => setMarketingConsent(e.target.checked)}
                            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                          />
                          <div className="text-[11px]">
                            <span className="font-bold text-slate-800">{loc.marketingConsentLabel}</span>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                              {loc.marketingConsentDesc}
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* AI Personalization Consent */}
                      <div className="bg-white/90 p-2.5 rounded-lg border border-slate-200">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id="consent-opt-ai"
                            checked={aiPersonalizationConsent}
                            onChange={(e) => setAiPersonalizationConsent(e.target.checked)}
                            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                          />
                          <div className="text-[11px]">
                            <span className="font-bold text-slate-800">{loc.aiConsentLabel}</span>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                              {loc.aiConsentDesc}
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* UX Telemetry Consent */}
                      <div className="bg-white/90 p-2.5 rounded-lg border border-slate-200">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id="consent-opt-telemetry"
                            checked={telemetryConsent}
                            onChange={(e) => setTelemetryConsent(e.target.checked)}
                            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                          />
                          <div className="text-[11px]">
                            <span className="font-bold text-slate-800">{loc.telemetryConsentLabel}</span>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                              {loc.telemetryConsentDesc}
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* LOGIN FORM (With Email/Username, Password, and Phone Recovery Link) */
                <div className="space-y-3.5" id="login-fields-group">
                  <div>
                    <label className="block text-slate-700 font-semibold text-xs mb-1.5" htmlFor="username-input">
                      {t.username} *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 select-none text-xs">
                        ✉️
                      </span>
                      <input
                        type="text"
                        id="username-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 font-medium"
                        placeholder="e.g. travel_pioneer@gmail.com"
                        required={!isRegister}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-slate-700 font-semibold text-xs" htmlFor="password-input">
                        {t.password} *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowRecovery(true);
                          setRecoverySuccess('');
                          setErrorMessage('');
                        }}
                        className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer flex items-center gap-0.5"
                      >
                        <span>📱</span>
                        <span>{language === 'pl' ? 'Odzyskaj przez telefon?' : language === 'nl' ? 'Herstellen via telefoon?' : 'Recover via phone?'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 select-none text-xs">
                        🔑
                      </span>
                      <input
                        type="password"
                        id="password-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 font-medium"
                        placeholder="••••••••"
                        required={!isRegister}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                id="auth-submit-btn"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                {isRegister ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{loc.registerTitle}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{loc.loginTitle}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      ) : (
        /* 2. LOGGED IN STATE */
        <div className="space-y-5" id="account-profile-view">
          {/* User Header & Logout */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                {(account.firstName ? account.firstName[0] : (account.username ? account.username[0] : 'U')).toUpperCase()}
              </div>
              <div>
                <div className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                  {language === 'nl' ? 'Aangemeld als:' : language === 'pl' ? 'Zalogowany profil:' : 'Logged in as:'}
                </div>
                <div className="text-sm font-bold text-slate-850 font-mono">
                  {account.firstName && account.lastName ? `${account.firstName} ${account.lastName}` : account.username}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">{account.email || account.username}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              id="logout-btn"
              className="flex items-center gap-1.5 bg-white text-slate-600 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-slate-800 text-xs cursor-pointer transition-all shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'nl' ? 'Afmelden' : language === 'pl' ? 'Wyloguj się' : 'Log Out'}</span>
            </button>
          </div>

          {/* Subtabs: 1. Profil & Płatności, 2. Ulubione Trasy Rowerowe, 3. Centrum Prywatności RODO, 4. Dziennik Podróży */}
          <div className="flex border-b border-slate-200 gap-2 pb-1 overflow-x-auto" id="profile-navigation-tabs">
            <button
              type="button"
              id="tab-profile"
              onClick={() => setActiveProfileTab('profile')}
              className={`flex items-center gap-1.5 pb-2 px-3 text-xs font-extrabold transition-all border-b-2 cursor-pointer shrink-0 ${
                activeProfileTab === 'profile'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{loc.profileTab}</span>
            </button>

            <button
              type="button"
              id="tab-user-location"
              onClick={() => setActiveProfileTab('location')}
              className={`flex items-center gap-1.5 pb-2 px-3 text-xs font-extrabold transition-all border-b-2 cursor-pointer shrink-0 ${
                activeProfileTab === 'location'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/70 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>{pl ? 'Twoja Lokalizacja' : language === 'nl' ? 'Uw Locatie' : 'Your Location'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            <button
              type="button"
              id="tab-favorite-routes"
              onClick={() => setActiveProfileTab('favorites')}
              className={`flex items-center gap-1.5 pb-2 px-3 text-xs font-extrabold transition-all border-b-2 cursor-pointer shrink-0 ${
                activeProfileTab === 'favorites'
                  ? 'border-amber-500 text-amber-700 bg-amber-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>{pl ? 'Ulubione Trasy' : 'Saved Routes'}</span>
              {((account.favoriteCyclingRoutes?.length ?? 0) + (account.favoriteMotorcycleRoutes?.length ?? 0)) > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {(account.favoriteCyclingRoutes?.length ?? 0) + (account.favoriteMotorcycleRoutes?.length ?? 0)}
                </span>
              )}
            </button>

            <button
              type="button"
              id="tab-gdpr-privacy"
              onClick={() => setActiveProfileTab('privacy')}
              className={`flex items-center gap-1.5 pb-2 px-3 text-xs font-extrabold transition-all border-b-2 cursor-pointer shrink-0 ${
                activeProfileTab === 'privacy'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{loc.privacyCenterTab}</span>
            </button>

            <button
              type="button"
              id="tab-travel-history"
              onClick={() => setActiveProfileTab('history')}
              className={`flex items-center gap-1.5 pb-2 px-3 text-xs font-extrabold transition-all border-b-2 cursor-pointer shrink-0 ${
                activeProfileTab === 'history'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>🧭</span>
              <span>{loc.travelHistoryTab}</span>
            </button>
          </div>

          {/* TAB 1: PROFIL & SUBSKRYPCJA & PŁATNOŚCI */}
          {activeProfileTab === 'profile' && (
            <div className="space-y-5" id="profile-content-tab">
              {/* Twoja Obecna Lokalizacja - Karta Podsumowująca w Profilu */}
              <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4.5 border border-indigo-500/30 shadow-lg space-y-3 relative overflow-hidden" id="profile-current-location-hero">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shrink-0 text-indigo-300 shadow-inner">
                      <Compass className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-500/30">
                          {pl ? '📍 Twoja Obecna Lokalizacja' : language === 'nl' ? '📍 Uw Huidige Locatie' : '📍 Your Current Location'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          {profileGpsState.status === 'success' ? (pl ? 'Współrzędne aktywne' : 'Coordinates active') : (pl ? 'Domyślna baza' : 'Default hub')}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-white mt-1 flex items-center gap-1.5">
                        <span>{account.homeStationOrHotel || profileGpsState.locationName}</span>
                      </h3>
                      <p className="text-[11px] text-slate-300">
                        {pl 
                          ? `Lat: ${(profileGpsState.coords?.lat ?? 51.9244).toFixed(4)}°, Lng: ${(profileGpsState.coords?.lng ?? 4.4777).toFixed(4)}° • Dokładność ±${profileGpsState.accuracyMeters || 15}m`
                          : `Lat: ${(profileGpsState.coords?.lat ?? 51.9244).toFixed(4)}°, Lng: ${(profileGpsState.coords?.lng ?? 4.4777).toFixed(4)}° • Accuracy ±${profileGpsState.accuracyMeters || 15}m`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      id="profile-refresh-gps-btn"
                      onClick={handleRefreshProfileGps}
                      disabled={isLocatingGps}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLocatingGps ? 'animate-spin' : ''}`} />
                      <span>{isLocatingGps ? (pl ? 'Szukam GPS...' : 'Locating...') : (pl ? 'Pobierz GPS 📡' : 'Fetch GPS 📡')}</span>
                    </button>
                    
                    <button
                      type="button"
                      id="profile-manage-location-btn"
                      onClick={() => setActiveProfileTab('location')}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-slate-100 font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-300" />
                      <span>{pl ? 'Zmień bazę / Hotel' : 'Change hub / Hotel'}</span>
                    </button>
                  </div>
                </div>

                {locationFeedbackMsg && (
                  <div className="p-2.5 rounded-xl bg-indigo-900/60 border border-indigo-400/40 text-xs font-semibold text-indigo-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{locationFeedbackMsg}</span>
                  </div>
                )}
              </div>

              {/* Profile Rectification Form (Prawo do sprostowania - Art. 16 RODO) */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-850 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    <span>{language === 'pl' ? 'Dane Osobowe i Sprostowanie (Art. 16 RODO)' : language === 'nl' ? 'Persoonsgegevens & Rectificatie (Art. 16 AVG)' : 'Personal Details & Rectification (Art. 16 GDPR)'}</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {account.username}
                  </span>
                </div>

                {editSuccessMessage && (
                  <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs p-2 rounded-lg font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editSuccessMessage}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1" htmlFor="edit-first-name">
                        {loc.firstName}
                      </label>
                      <input
                        type="text"
                        id="edit-first-name"
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1" htmlFor="edit-last-name">
                        {loc.lastName}
                      </label>
                      <input
                        type="text"
                        id="edit-last-name"
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1" htmlFor="edit-phone">
                        {loc.phone}
                      </label>
                      <input
                        type="text"
                        id="edit-phone"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1" htmlFor="edit-dob">
                        {loc.dob}
                      </label>
                      <input
                        type="date"
                        id="edit-dob"
                        value={editDob}
                        onChange={(e) => {
                          setEditDob(e.target.value);
                          const newAge = calculateAgeFromDob(e.target.value);
                          if (newAge >= 50) {
                            setEditLargeFontMode(true);
                          }
                        }}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Accessibility & Senior 50+ Settings Block */}
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <span>🔤</span>
                        <span>{language === 'pl' ? 'Ułatwienia Dostępności (50+)' : 'Accessibility Settings (50+)'}</span>
                      </div>
                      {editDob && (() => {
                        const calculatedAge = calculateAgeFromDob(editDob);
                        return calculatedAge > 0 ? (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            calculatedAge >= 50 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {language === 'pl' ? `Wiek: ${calculatedAge} lat` : `Age: ${calculatedAge} y.o.`}
                          </span>
                        ) : null;
                      })()}
                    </div>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                      <div className="text-xs">
                        <span className="font-bold text-slate-900">{language === 'pl' ? 'Tryb powiększonej czcionki' : 'Large Readable Font Mode'}</span>
                        <p className="text-[10px] text-slate-500">{language === 'pl' ? 'Automatycznie włączany dla osób po 50. roku życia' : 'Automatically enabled for users 50+'}</p>
                      </div>
                      <input 
                        type="checkbox"
                        checked={editLargeFontMode}
                        onChange={(e) => setEditLargeFontMode(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </label>

                    {/* ICE and Emergency Contact in Profile */}
                    <div className="pt-1 space-y-2">
                      <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <span>🆘</span>
                        <span>{language === 'pl' ? 'Osoba kontaktowa ICE & Miejsce pobytu:' : 'Emergency ICE Contact & Stay:'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder={language === 'pl' ? 'Imię osoby ICE' : 'ICE Contact Name'}
                          value={editIceName}
                          onChange={(e) => setEditIceName(e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:border-indigo-500"
                        />
                        <input
                          type="tel"
                          placeholder={language === 'pl' ? 'Telefon ICE (+48...)' : 'ICE Phone'}
                          value={editIcePhone}
                          onChange={(e) => setEditIcePhone(e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:border-indigo-500 font-mono"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder={language === 'pl' ? 'Mój hotel / stacja bazowa (np. Amsterdam Centraal, Ibis Hotel)' : 'Hotel / Home station'}
                        value={editHomeTarget}
                        onChange={(e) => setEditHomeTarget(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      id="save-profile-btn"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{loc.saveProfileBtn}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* SUBSCRIPTION STATUS BOX */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm" id="subscription-status-box">
                <div className="flex items-start gap-3">
                  {account.hasPaid ? (
                    <div className="bg-emerald-50 text-emerald-600 p-2 rounded-full border border-emerald-200">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="bg-slate-50 text-slate-400 p-2 rounded-full border border-slate-200">
                      <Lock className="w-5 h-5 stroke-[2]" />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-1.5">
                    <div className="text-base font-bold text-slate-900">
                      {account.hasPaid ? t.unlockedStatus : t.subscriptionRequired}
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {account.hasPaid
                        ? (language === 'nl' 
                          ? `Hartelijk dank! Uw jaarabonnement is actief en gekoppeld aan uw account. U heeft nu onbeperkte toegang tot fietspaden, stempels, fotowedstrijden en de 9292 dienstregeling.`
                          : `Thank you! Your annual subscription is fully active. You have full access to high-contrast cycling routes, custom weekly challenges, digital regional stamps, and automated return routers.`)
                        : (language === 'nl'
                          ? `Krijg onbeperkt toegang tot alle seniorenvriendelijke routes, bewaar uw favoriete locaties en doe mee aan foto-uitdagingen.`
                          : `Unlock full scenic cycling paths, the automated safe-headway return router, persistent place markers, and compete in the hidden spot photo contests.`)}
                    </p>

                    {account.hasPaid && (
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50/50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs font-bold mt-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Paid via {account.paymentMethod?.toUpperCase() || 'CARD'}</span>
                        </div>

                        {/* Subscription Validity Countdown block */}
                        {(() => {
                          const expiryStr = account.subscriptionExpiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                          const expiryDate = new Date(expiryStr);
                          const today = new Date();
                          const diffTime = expiryDate.getTime() - today.getTime();
                          const remainingDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                          
                          return (
                            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                <span>{language === 'pl' ? 'Status subskrypcji:' : language === 'nl' ? 'Abonnementsstatus:' : 'Subscription Status:'}</span>
                                <span className="text-emerald-600 font-extrabold uppercase bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                                  {language === 'pl' ? 'AKTYWNY PREMIUM' : language === 'nl' ? 'PREMIUM ACTIEF' : 'ACTIVE PREMIUM'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">{language === 'pl' ? 'Ważność konta:' : language === 'nl' ? 'Geldig tot:' : 'Valid until:'}</span>
                                <span className="font-mono font-bold text-slate-800">{expiryStr}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs border-t border-slate-200/50 pt-2">
                                <span className="text-slate-500 font-medium">{language === 'pl' ? 'Pozostały czas:' : language === 'nl' ? 'Resterende tijd:' : 'Remaining time:'}</span>
                                <span className="font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                                  {remainingDays} {language === 'pl' ? 'dni' : language === 'nl' ? 'dagen' : 'days'}
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* PAYMENT WORKFLOW FOR UNPAID ACCOUNT WITH EUROPEAN COUNTRY AND BANK GATEWAYS */}
                {!account.hasPaid && !paymentSuccess && (
                  <div className="mt-6 border-t border-slate-100 pt-5 space-y-4" id="checkout-gateway">
                    <UnifiedPaymentCheckout
                      language={language}
                      account={account}
                      onPaymentSuccess={(method, details) => {
                        const nextYear = new Date();
                        nextYear.setFullYear(nextYear.getFullYear() + 1);
                        const expiryStr = nextYear.toISOString().split('T')[0];

                        const updatedAccount: UserAccount = {
                          ...account,
                          hasPaid: true,
                          paymentMethod: (method as any) || 'card',
                          subscriptionExpiry: expiryStr,
                        };

                        try {
                          localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
                          localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAccount));
                        } catch (err) {
                          console.error("Local storage error:", err);
                        }

                        onUpdateAccount(updatedAccount);
                        setPaymentSuccess(true);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* CLAIMED REWARDS & DISCOUNTS SECTION */}
              {account.claimedRewards && account.claimedRewards.length > 0 && (
                <div className="border border-indigo-200 rounded-2xl p-5 bg-gradient-to-br from-indigo-50/40 via-white to-amber-50/30 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏷️</span>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {language === 'pl' ? 'Zdobyte Vouchery i Zniżki (Paszport)' : 'Claimed Vouchers & Discounts'}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {language === 'pl' ? 'Zweryfikowane, zabezpieczone kryptograficznie kody rabatowe' : 'Verified tamper-proof reward codes'}
                        </p>
                      </div>
                    </div>
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {account.claimedRewards.length} {language === 'pl' ? 'aktywne' : 'active'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {account.claimedRewards.map((voucher) => (
                      <div 
                        key={voucher.id}
                        className="bg-white border border-indigo-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{voucher.tier === 'tier2' ? '🥈' : '🥇'}</span>
                            <span className="font-bold text-xs text-slate-900">{voucher.rewardTitle}</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">
                              STATUS: {voucher.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span>{language === 'pl' ? 'Ważny do:' : 'Valid until:'} {new Date(voucher.expiresAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="font-mono text-[10px] text-slate-400">{voucher.verificationSignature}</span>
                          </div>
                        </div>

                        <div className="bg-slate-950 text-amber-400 px-3 py-1.5 rounded-lg font-mono text-xs font-black tracking-wider text-center shrink-0 border border-amber-400 select-all">
                          {voucher.voucherCode}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: TWOJA OBECNA LOKALIZACJA & CENTRUM GPS */}
          {activeProfileTab === 'location' && (
            <div className="space-y-5" id="user-location-tab">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200 shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                      <span>{pl ? 'Twoja Obecna Lokalizacja & Centrum GPS' : language === 'nl' ? 'Uw Huidige Locatie & GPS Hub' : 'Your Current Location & GPS Hub'}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {pl
                        ? 'Zarządzaj punktem startowym podróży, pobieraj bieżące współrzędne GPS lub ustaw stację / hotel.'
                        : language === 'nl'
                        ? 'Beheer uw startpunt, haal live GPS-coördinaten op of stel uw thuisstation / hotel in.'
                        : 'Manage your trip origin spot, acquire live GPS coordinates, or configure your home station / hotel.'}
                    </p>
                  </div>
                </div>

                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('explore')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{pl ? 'Przejdź do Odkrywania' : 'Go to Explore'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Live Location Hero Card */}
              <div className="bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-indigo-500/30 shadow-md relative overflow-hidden space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-indigo-900/80 text-indigo-300 border border-indigo-400/40 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {pl ? '📍 Aktywny Punkt Wyjścia' : '📍 Active Departure Origin'}
                      </span>
                      <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        {profileGpsState.status === 'success' ? (pl ? 'Współrzędne zweryfikowane' : 'Coordinates verified') : (pl ? 'Stacja domyślna' : 'Default hub')}
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-black text-white pt-1">
                      {account.homeStationOrHotel || profileGpsState.locationName}
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
                      <span>Lat: <strong className="text-indigo-200 font-mono">{(profileGpsState.coords?.lat ?? 51.9244).toFixed(4)}°N</strong></span>
                      <span>•</span>
                      <span>Lng: <strong className="text-indigo-200 font-mono">{(profileGpsState.coords?.lng ?? 4.4777).toFixed(4)}°E</strong></span>
                      <span>•</span>
                      <span>{pl ? 'Dokładność' : 'Accuracy'}: <strong className="text-emerald-300">±{profileGpsState.accuracyMeters || 15}m</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      id="fetch-live-gps-btn"
                      onClick={handleRefreshProfileGps}
                      disabled={isLocatingGps}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-900/50 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLocatingGps ? 'animate-spin' : ''}`} />
                      <span>{isLocatingGps ? (pl ? 'Pobieranie GPS...' : 'Locating GPS...') : (pl ? 'Pobierz sygnał GPS 📡' : 'Acquire Live GPS 📡')}</span>
                    </button>
                  </div>
                </div>

                {locationFeedbackMsg && (
                  <div className="p-3 rounded-xl bg-indigo-900/80 border border-indigo-400/40 text-xs font-bold text-white flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{locationFeedbackMsg}</span>
                  </div>
                )}
              </div>

              {/* Grid: 1. Popular Departure Hubs / Stations, 2. Custom Hotel Address */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>{pl ? 'Wybierz stację bazową lub główny węzeł komunikacyjny:' : 'Select a major departure hub or base station:'}</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {pl ? '12 popularnych miast i hubów' : '12 major cities & hubs'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {POPULAR_LOCATION_HUBS.map((hub) => {
                    const isCurrent = (account.homeStationOrHotel || '').toLowerCase().includes(hub.name.toLowerCase().split(' ')[0]) ||
                      (profileGpsState.coords && Math.abs(profileGpsState.coords.lat - hub.lat) < 0.05 && Math.abs(profileGpsState.coords.lng - hub.lng) < 0.05);
                    const userLat = profileGpsState.coords?.lat ?? 51.9244;
                    const userLng = profileGpsState.coords?.lng ?? 4.4777;
                    const distKm = Math.round(calculateHaversineDistanceKm(userLat, userLng, hub.lat, hub.lng));

                    return (
                      <button
                        key={hub.name}
                        type="button"
                        onClick={() => handleSelectLocationHub(hub)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                          isCurrent
                            ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 shadow-2xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-base">{hub.flag}</span>
                            <span className="text-[10px] font-bold text-slate-400 font-mono">
                              {distKm === 0 ? (pl ? 'Tu jesteś' : 'Here') : `~${distKm} km`}
                            </span>
                          </div>
                          <div className="font-bold text-xs text-slate-900 leading-tight">
                            {hub.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                            {hub.desc}
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {hub.country}
                          </span>
                          {isCurrent ? (
                            <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                              ✓ {pl ? 'Aktywna' : 'Active'}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-600 hover:text-indigo-600">
                              {pl ? 'Wybierz →' : 'Select →'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Hotel / Accommodation Form */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-xs text-slate-850">
                    {pl ? 'Wpisz własny hotel, apartament lub dokładny adres pobytu:' : 'Enter your hotel, rental apartment, or custom stay address:'}
                  </h4>
                </div>

                <form onSubmit={handleSaveCustomLocation} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customAddressInput}
                      onChange={(e) => setCustomAddressInput(e.target.value)}
                      placeholder={pl ? 'np. Hotel citizenM Rotterdam, Coolsingel 10' : 'e.g. Hotel citizenM Rotterdam, Coolsingel 10'}
                      className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-850 focus:bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!customAddressInput.trim()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 disabled:opacity-40 text-white font-bold text-xs rounded-lg transition-all shrink-0 cursor-pointer shadow-2xs"
                  >
                    {pl ? 'Zapisz w profilu' : 'Save in Profile'}
                  </button>
                </form>

                <p className="text-[11px] text-slate-500">
                  {pl
                    ? '💡 Zapisana lokalizacja posłuży Tadzikowi jako baza do obliczania czasów powrotu na kwaterę i bezpiecznego bufora (Safe Headway).'
                    : '💡 This location will be used as your base to compute return transit times and Safe Headway buffers.'}
                </p>
              </div>

              {/* RODO Privacy & GPS Notice */}
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-3.5 flex items-start gap-3 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-[11px] leading-relaxed">
                  <div className="font-bold text-emerald-950">
                    {pl ? 'Prywatność i Zgoda RODO na Geodezję / GPS' : 'GDPR Geolocation Privacy Notice'}
                  </div>
                  <div>
                    {pl
                      ? 'Twoje współrzędne GPS są przetwarzane lokalnie w przeglądarce i nie są wysyłane do zewnętrznych trackerów marketingowych. Zgodnie z zasadą Privacy by Design, wybór jest zapamiętany w Twoim profilu.'
                      : 'Your GPS coordinates are processed locally in your browser and never sold to third-party ad networks. In compliance with Privacy by Design, your choice is preserved in your profile.'}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeProfileTab === 'favorites' && (
            <div className="space-y-4" id="favorite-routes-tab">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {pl ? 'Twoje Zaplanowane i Ulubione Przejażdżki Rowerowe' : 'Your Saved & Favorite Cycling Rides'}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {pl ? 'Szybki dostęp do tras zapisanych podczas przeglądania szlaków' : 'Quick access to routes you saved while browsing trails'}
                    </p>
                  </div>
                </div>

                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('cycling')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs active:scale-95"
                  >
                    <span>{pl ? 'Przeglądaj wszystkie trasy' : 'Browse all routes'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {(() => {
                // Collect custom cycling and motorcycle routes from localStorage if any
                let customCyclingRoutes: CyclingRoute[] = [];
                let customMotorcycleRoutes: MotorcycleRoute[] = [];
                try {
                  const rawC = localStorage.getItem('tadzik_custom_cycling_routes');
                  if (rawC) customCyclingRoutes = JSON.parse(rawC);
                  const rawM = localStorage.getItem('tadzik_custom_motorcycle_routes');
                  if (rawM) customMotorcycleRoutes = JSON.parse(rawM);
                } catch (e) {
                  // ignore
                }

                const allCyclingMap = [...SEEDED_CYCLING_ROUTES, ...customCyclingRoutes];
                const savedCyclingIds = account.favoriteCyclingRoutes || [];
                const savedCyclingRoutes = allCyclingMap.filter(r => savedCyclingIds.includes(r.id));

                const allMotoMap = [...SEEDED_MOTORCYCLE_ROUTES, ...customMotorcycleRoutes];
                const savedMotoIds = account.favoriteMotorcycleRoutes || [];
                const savedMotoRoutes = allMotoMap.filter(r => savedMotoIds.includes(r.id));

                const handleRemoveCyclingFavorite = (routeId: string) => {
                  const updatedFavs = savedCyclingIds.filter(id => id !== routeId);
                  const updatedAccount: UserAccount = {
                    ...account,
                    favoriteCyclingRoutes: updatedFavs
                  };
                  onUpdateAccount(updatedAccount);
                  try {
                    localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
                    localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAccount));
                  } catch (e) {
                    console.error('Failed to update favorites:', e);
                  }
                };

                const handleRemoveMotoFavorite = (routeId: string) => {
                  const updatedFavs = savedMotoIds.filter(id => id !== routeId);
                  const updatedAccount: UserAccount = {
                    ...account,
                    favoriteMotorcycleRoutes: updatedFavs
                  };
                  onUpdateAccount(updatedAccount);
                  try {
                    localStorage.setItem(`user_profile_${account.username.toLowerCase()}`, JSON.stringify(updatedAccount));
                    localStorage.setItem('nl_tourist_planner_account', JSON.stringify(updatedAccount));
                  } catch (e) {
                    console.error('Failed to update moto favorites:', e);
                  }
                };

                if (savedCyclingRoutes.length === 0 && savedMotoRoutes.length === 0) {
                  return (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl">
                        ⭐
                      </div>
                      <div className="space-y-1 max-w-sm mx-auto">
                        <h4 className="font-extrabold text-sm text-slate-800">
                          {pl ? 'Brak zapisanych tras' : 'No saved routes yet'}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {pl 
                            ? 'Przejdź do zakładki "Trasy Rowerowe" lub "Trasy na Motor" i kliknij przycisk "Zapisz do ulubionych" przy dowolnej trasie, aby mieć ją zawsze pod ręką.' 
                            : 'Go to "Cycling Routes" or "Motorcycle Routes" tab and click "Save to Favorites" on any route to keep it handy.'}
                        </p>
                      </div>
                      {onNavigateTab && (
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => onNavigateTab('cycling')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                          >
                            <Bike className="w-4 h-4" />
                            <span>{pl ? 'Trasy Rowerowe 🚴' : 'Cycling Routes 🚴'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigateTab('motorcycle')}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                          >
                            <span>🏍️</span>
                            <span>{pl ? 'Trasy na Motor 🏍️' : 'Motorcycle Routes 🏍️'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    {/* MOTORCYCLE ROUTES (IF ANY) */}
                    {savedMotoRoutes.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase text-rose-600 tracking-wider flex items-center gap-1.5">
                            <span>🏍️</span>
                            <span>{pl ? `Ulubione Trasy Motocyklowe (${savedMotoRoutes.length})` : `Saved Moto Routes (${savedMotoRoutes.length})`}</span>
                          </h4>
                          {onNavigateTab && (
                            <button
                              type="button"
                              onClick={() => onNavigateTab('motorcycle')}
                              className="text-[11px] text-rose-600 hover:underline font-bold"
                            >
                              {pl ? 'Zobacz wszystkie na mapie ➔' : 'Explore all on map ➔'}
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {savedMotoRoutes.map((route) => {
                            const defaultImg = route.destinationImageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80';
                            return (
                              <div 
                                key={route.id}
                                className="bg-white border border-slate-200 hover:border-rose-400/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                              >
                                <div>
                                  {/* Destination Header Image */}
                                  <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                                    <img
                                      src={defaultImg}
                                      alt={route.title}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                      <span className="bg-slate-900/90 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg border border-slate-700 backdrop-blur-xs flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span>{route.rating || 5.0}</span>
                                      </span>
                                      <span className="bg-rose-950/80 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-rose-700/50 backdrop-blur-xs font-mono">
                                        {route.distanceKm} km
                                      </span>
                                    </div>
                                    <div className="absolute bottom-2 left-2 right-2">
                                      <span className="text-[9px] uppercase font-black text-rose-300 tracking-wider block drop-shadow">
                                        🏍️ {route.city} • {route.estimatedDuration || '1h'}
                                      </span>
                                      <h4 className="text-xs sm:text-sm font-extrabold text-white line-clamp-1 drop-shadow">
                                        {route.destinationName || route.title}
                                      </h4>
                                    </div>
                                  </div>

                                  {/* Info snippet */}
                                  <div className="p-3.5 space-y-2">
                                    <h5 className="font-bold text-xs text-slate-900 leading-snug">
                                      {route.title}
                                    </h5>
                                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                                      {route.description}
                                    </p>

                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-[11px] text-slate-600 flex items-center justify-between">
                                      <span className="font-medium truncate max-w-[45%]">
                                        🏁 {route.startPoint}
                                      </span>
                                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span className="font-bold text-slate-900 truncate max-w-[45%] text-right">
                                        🎯 {route.destinationName || route.endPoint}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                                  {onNavigateTab && (
                                    <button
                                      type="button"
                                      onClick={() => onNavigateTab('motorcycle')}
                                      className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                                    >
                                      <span>🏍️</span>
                                      <span>{pl ? 'Zobacz Trasę' : 'View Route'}</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMotoFavorite(route.id)}
                                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                                    title={pl ? 'Usuń z ulubionych' : 'Remove from favorites'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="text-[11px]">{pl ? 'Usuń' : 'Remove'}</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* CYCLING ROUTES (IF ANY) */}
                    {savedCyclingRoutes.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase text-emerald-700 tracking-wider flex items-center gap-1.5">
                            <Bike className="w-4 h-4 text-emerald-600" />
                            <span>{pl ? `Ulubione Trasy Rowerowe (${savedCyclingRoutes.length})` : `Saved Cycling Routes (${savedCyclingRoutes.length})`}</span>
                          </h4>
                          {onNavigateTab && (
                            <button
                              type="button"
                              onClick={() => onNavigateTab('cycling')}
                              className="text-[11px] text-emerald-700 hover:underline font-bold"
                            >
                              {pl ? 'Zobacz wszystkie na mapie ➔' : 'Explore all on map ➔'}
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {savedCyclingRoutes.map((route) => {
                            const defaultImg = route.destinationImageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
                            return (
                              <div 
                                key={route.id}
                                className="bg-white border border-slate-200 hover:border-amber-400/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                              >
                                <div>
                                  {/* Destination Header Image */}
                                  <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                                    <img
                                      src={defaultImg}
                                      alt={route.title}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                      <span className="bg-slate-900/90 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg border border-slate-700 backdrop-blur-xs flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span>{route.rating || 5.0}</span>
                                      </span>
                                      <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-emerald-700/50 backdrop-blur-xs font-mono">
                                        {route.distanceKm} km
                                      </span>
                                    </div>
                                    <div className="absolute bottom-2 left-2 right-2">
                                      <span className="text-[9px] uppercase font-black text-amber-300 tracking-wider block drop-shadow">
                                        🚲 {route.city} • {route.difficulty}
                                      </span>
                                      <h4 className="text-xs sm:text-sm font-extrabold text-white line-clamp-1 drop-shadow">
                                        {route.destinationName || route.title}
                                      </h4>
                                    </div>
                                  </div>

                                  {/* Info snippet */}
                                  <div className="p-3.5 space-y-2">
                                    <h5 className="font-bold text-xs text-slate-900 leading-snug">
                                      {route.title}
                                    </h5>
                                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                                      {route.description}
                                    </p>

                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-[11px] text-slate-600 flex items-center justify-between">
                                      <span className="font-medium truncate max-w-[45%]">
                                        🏁 {route.startPoint}
                                      </span>
                                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span className="font-bold text-slate-900 truncate max-w-[45%] text-right">
                                        🎯 {route.endPoint}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                                  {onNavigateTab && (
                                    <button
                                      type="button"
                                      onClick={() => onNavigateTab('cycling')}
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                                    >
                                      <Bike className="w-3.5 h-3.5" />
                                      <span>{pl ? 'Zobacz Trasę' : 'View Route'}</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCyclingFavorite(route.id)}
                                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                                    title={pl ? 'Usuń z ulubionych' : 'Remove from favorites'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="text-[11px]">{pl ? 'Usuń' : 'Remove'}</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 2: CENTRUM PRYWATNOŚCI RODO (GDPR PRIVACY & USER RIGHTS CENTER) */}
          {activeProfileTab === 'privacy' && (
            <div className="space-y-5" id="privacy-center-content-tab">
              {/* RODO Summary & Transparency Header */}
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-sm text-slate-900">
                      {loc.gdprHeader}
                    </h3>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-200/70 text-emerald-900 px-2.5 py-0.5 rounded-full">
                    EU GDPR / RODO Compliant
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'pl'
                    ? 'Wdrożyliśmy zasady Privacy by Design oraz Privacy by Default. Masz pełną kontrolę nad swoimi danymi osobowymi. Poniżej możesz pobrać kopię danych, zarządzać zgodami lub złożyć wniosek o usunięcie konta.'
                    : language === 'nl'
                    ? 'Wij hanteren de principes van Privacy by Design & Default. Hier kunt u uw rechten uitoefenen: dataportabiliteit, toestemmingen beheren of uw account verwijderen.'
                    : 'We enforce Privacy by Design and Privacy by Default. Exercise your GDPR rights here: export data, toggle consents, or delete your account.'}
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    id="open-privacy-policy-btn"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-white hover:bg-emerald-100/50 border border-emerald-300 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{loc.viewGdprDetails}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyMinimalPrivacy}
                    id="apply-minimal-privacy-btn"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-600" />
                    <span>{loc.minimalPrivacyBtn}</span>
                  </button>
                </div>
              </div>

              {/* 1. DATA PORTABILITY & ACCESS (Art. 20 RODO) */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-xs text-slate-900">{loc.exportDataTitle}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {loc.exportDataDesc}
                </p>
                <div>
                  <button
                    type="button"
                    id="export-user-data-btn"
                    onClick={handleExportUserData}
                    className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-extrabold px-3.5 py-2 rounded-lg transition-all cursor-pointer shadow-2xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>{loc.exportDataBtn}</span>
                  </button>
                </div>
              </div>

              {/* 2. REAL-TIME CONSENT MANAGEMENT (Art. 7(3) RODO) */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-bold text-xs text-slate-900">{loc.consentManagerTitle}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {account.privacyConsents?.lastConsentUpdate ? `Zaktualizowano: ${account.privacyConsents.lastConsentUpdate.split('T')[0]}` : 'Aktywny status'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {loc.consentManagerDesc}
                </p>

                <div className="space-y-2.5 pt-1">
                  {/* Geolocation toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-all">
                    <div className="pr-4">
                      <div className="font-bold text-xs text-slate-850">{loc.geoConsentLabel}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{loc.geoConsentDesc}</div>
                    </div>
                    <button
                      type="button"
                      id="toggle-consent-geo"
                      onClick={() => handleToggleConsent('geolocationConsent')}
                      className="cursor-pointer shrink-0 transition-transform active:scale-95"
                    >
                      {account.privacyConsents?.geolocationConsent ? (
                        <ToggleRight className="w-8 h-8 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-300" />
                      )}
                    </button>
                  </div>

                  {/* Camera & Photo Proof toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-all">
                    <div className="pr-4">
                      <div className="font-bold text-xs text-slate-850">{loc.cameraConsentLabel}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{loc.cameraConsentDesc}</div>
                    </div>
                    <button
                      type="button"
                      id="toggle-consent-camera"
                      onClick={() => handleToggleConsent('cameraConsent')}
                      className="cursor-pointer shrink-0 transition-transform active:scale-95"
                    >
                      {account.privacyConsents?.cameraConsent ? (
                        <ToggleRight className="w-8 h-8 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-300" />
                      )}
                    </button>
                  </div>

                  {/* Marketing toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-all">
                    <div className="pr-4">
                      <div className="font-bold text-xs text-slate-850">{loc.marketingConsentLabel}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{loc.marketingConsentDesc}</div>
                    </div>
                    <button
                      type="button"
                      id="toggle-consent-marketing"
                      onClick={() => handleToggleConsent('marketingConsent')}
                      className="cursor-pointer shrink-0 transition-transform active:scale-95"
                    >
                      {account.privacyConsents?.marketingConsent ? (
                        <ToggleRight className="w-8 h-8 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-300" />
                      )}
                    </button>
                  </div>

                  {/* AI Personalization toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-all">
                    <div className="pr-4">
                      <div className="font-bold text-xs text-slate-850">{loc.aiConsentLabel}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{loc.aiConsentDesc}</div>
                    </div>
                    <button
                      type="button"
                      id="toggle-consent-ai"
                      onClick={() => handleToggleConsent('aiPersonalizationConsent')}
                      className="cursor-pointer shrink-0 transition-transform active:scale-95"
                    >
                      {account.privacyConsents?.aiPersonalizationConsent ? (
                        <ToggleRight className="w-8 h-8 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-300" />
                      )}
                    </button>
                  </div>

                  {/* Telemetry toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-all">
                    <div className="pr-4">
                      <div className="font-bold text-xs text-slate-850">{loc.telemetryConsentLabel}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{loc.telemetryConsentDesc}</div>
                    </div>
                    <button
                      type="button"
                      id="toggle-consent-telemetry"
                      onClick={() => handleToggleConsent('telemetryConsent')}
                      className="cursor-pointer shrink-0 transition-transform active:scale-95"
                    >
                      {account.privacyConsents?.telemetryConsent ? (
                        <ToggleRight className="w-8 h-8 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. RIGHT TO ERASURE / RIGHT TO BE FORGOTTEN (Art. 17 RODO) */}
              <div className="border border-rose-200 rounded-xl p-4 bg-rose-50/40 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <h4 className="font-bold text-xs text-rose-900">{loc.deleteAccountTitle}</h4>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed">
                  {loc.deleteAccountWarning}
                </p>

                {!showDeleteAccountConfirm ? (
                  <button
                    type="button"
                    id="trigger-delete-account-btn"
                    onClick={() => setShowDeleteAccountConfirm(true)}
                    className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{loc.deleteAccountBtn}</span>
                  </button>
                ) : (
                  <div className="p-3 bg-white rounded-lg border border-rose-300 space-y-2.5">
                    <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>{loc.deleteAccountConfirmPrompt}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        id="confirm-delete-account-btn"
                        onClick={handleDeleteAccount}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        {loc.deleteAccountConfirmBtn}
                      </button>
                      <button
                        type="button"
                        id="cancel-delete-account-btn"
                        onClick={() => setShowDeleteAccountConfirm(false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        {loc.deleteAccountCancelBtn}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DZIENNIK PODRÓŻY (TRAVEL HISTORY TIMELINE) */}
          {activeProfileTab === 'history' && (
            <div className="space-y-4" id="travel-history-tab">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧭</span>
                <h3 className="font-extrabold text-sm text-slate-950">
                  {language === 'pl' ? 'Historia Odwiedzonych Miejsc' : language === 'nl' ? 'Geschiedenis van bezochte plaatsen' : 'Travel History log'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'pl' 
                  ? 'Lista miast, miasteczek oraz atrakcji, które odwiedziłeś. Dodaj nowe miejsca poniżej, aby uzupełnić swój dziennik!'
                  : language === 'nl'
                  ? 'Lijst met steden, dorpen en attracties die u heeft bezocht. Voeg hieronder nieuwe plekken toe!'
                  : 'List of cities, towns, and attractions you have visited. Add new spots below to enrich your travel log!'}
              </p>

              {/* Inline logger form */}
              <form onSubmit={handleAddVisit} className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      {language === 'pl' ? 'Nazwa miejsca' : language === 'nl' ? 'Naam van de plaats' : 'Name of place'}
                    </label>
                    <input 
                      type="text"
                      value={newVisitName}
                      onChange={(e) => setNewVisitName(e.target.value)}
                      placeholder="e.g. Giethoorn, Efteling"
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      {language === 'pl' ? 'Kategoria' : language === 'nl' ? 'Categorie' : 'Category'}
                    </label>
                    <select
                      value={newVisitType}
                      onChange={(e) => setNewVisitType(e.target.value as any)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                    >
                      <option value="city">{language === 'pl' ? 'Miasto (Duże)' : language === 'nl' ? 'Grote Stad' : 'City'}</option>
                      <option value="town">{language === 'pl' ? 'Miasteczko/Wieś' : language === 'nl' ? 'Dorp/Stadje' : 'Town/Village'}</option>
                      <option value="attraction">{language === 'pl' ? 'Atrakcja' : language === 'nl' ? 'Attractie' : 'Attraction'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      {language === 'pl' ? 'Data wizyty' : language === 'nl' ? 'Datum van bezoek' : 'Visit Date'}
                    </label>
                    <input 
                      type="date"
                      value={newVisitDate}
                      onChange={(e) => setNewVisitDate(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  ➕ {language === 'pl' ? 'Dodaj do swojego dziennika' : language === 'nl' ? 'Toevoegen aan reisdagboek' : 'Add to Travel Log'}
                </button>
              </form>

              {/* Timeline representation */}
              <div className="space-y-2 mt-4 max-h-60 overflow-y-auto pr-1">
                {(() => {
                  const history = account.visitedHistory || [
                    { name: language === 'pl' ? 'Dworzec Główny w Amsterdamie 🚉' : 'Amsterdam Centraal 🚉', type: 'town', date: '2026-07-07' },
                    { name: language === 'pl' ? 'Muzeum Rijksmuseum 🎨' : 'Rijksmuseum 🎨', type: 'attraction', date: '2026-07-09' },
                    { name: language === 'pl' ? 'Zabytkowe Centrum Utrechtu ⛪' : 'Utrecht Centraal ⛪', type: 'town', date: '2026-07-11' }
                  ];

                  return history.map((visit, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/30 transition-all">
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">
                          {visit.type === 'city' ? '🏙️' : visit.type === 'town' ? '🏡' : '🎡'}
                        </span>
                        <div>
                          <h4 className="font-bold text-xs text-slate-800">{visit.name}</h4>
                          <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                            {visit.type === 'city' ? (language === 'pl' ? 'Miasto' : 'City') : visit.type === 'town' ? (language === 'pl' ? 'Miasteczko' : 'Town') : (language === 'pl' ? 'Atrakcja' : 'Attraction')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-slate-200/60">
                          {visit.date}
                        </span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PRIVACY POLICY & GDPR INFORMATION MODAL */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        language={language}
      />

      {/* SHARE APP & STORE MODAL */}
      <ShareAppModal
        isOpen={showPWAInstallModal}
        onClose={() => setShowPWAInstallModal(false)}
        language={language}
      />
    </div>
  );
}
