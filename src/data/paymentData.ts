/**
 * International Payment & Banking Configuration
 * Covers: Poland (PL), Netherlands (NL), Belgium (BE), Germany (DE), France (FR), and Global Credit/Debit Cards.
 * Price: 30 EUR / Year (30 € / rok)
 */

export const PREMIUM_ANNUAL_PRICE_EUR = 30;

export type SupportedPaymentCountry = 'pl' | 'nl' | 'be' | 'de' | 'fr' | 'all';

export interface PaymentCountryInfo {
  code: SupportedPaymentCountry;
  name: {
    pl: string;
    nl: string;
    en: string;
    de: string;
    fr: string;
  };
  flag: string;
  currency: string;
  popularMethods: string[];
}

export const PAYMENT_COUNTRIES: PaymentCountryInfo[] = [
  {
    code: 'pl',
    name: {
      pl: 'Polska (PL)',
      nl: 'Polen (PL)',
      en: 'Poland (PL)',
      de: 'Polen (PL)',
      fr: 'Pologne (PL)',
    },
    flag: '🇵🇱',
    currency: 'PLN / EUR (30 €)',
    popularMethods: ['BLIK', 'Polskie Banki', 'Karta Płatnicza']
  },
  {
    code: 'nl',
    name: {
      pl: 'Holandia (NL)',
      nl: 'Nederland (NL)',
      en: 'Netherlands (NL)',
      de: 'Niederlande (NL)',
      fr: 'Pays-Bas (NL)',
    },
    flag: '🇳🇱',
    currency: 'EUR (30 €)',
    popularMethods: ['iDEAL', 'Wero / SEPA', 'Creditcard']
  },
  {
    code: 'be',
    name: {
      pl: 'Belgia (BE)',
      nl: 'België (BE)',
      en: 'Belgium (BE)',
      de: 'Belgien (BE)',
      fr: 'Belgique (BE)',
    },
    flag: '🇧🇪',
    currency: 'EUR (30 €)',
    popularMethods: ['Bancontact', 'Belfius', 'KBC/CBC', 'ING BE', 'Carte']
  },
  {
    code: 'de',
    name: {
      pl: 'Niemcy (DE)',
      nl: 'Duitsland (DE)',
      en: 'Germany (DE)',
      de: 'Deutschland (DE)',
      fr: 'Allemagne (DE)',
    },
    flag: '🇩🇪',
    currency: 'EUR (30 €)',
    popularMethods: ['Giropay / Sofort', 'Deutsche Banken', 'SEPA', 'Kreditkarte']
  },
  {
    code: 'fr',
    name: {
      pl: 'Francja (FR)',
      nl: 'Frankrijk (FR)',
      en: 'France (FR)',
      de: 'Frankreich (FR)',
      fr: 'France (FR)',
    },
    flag: '🇫🇷',
    currency: 'EUR (30 €)',
    popularMethods: ['Cartes Bancaires', 'Banques Françaises', 'Virement', 'Carte']
  },
  {
    code: 'all',
    name: {
      pl: 'Inny kraj / Wszystkie karty',
      nl: 'Ander land / Alle kaarten',
      en: 'International / All Cards',
      de: 'International / Alle Karten',
      fr: 'International / Toutes cartes',
    },
    flag: '🌍',
    currency: 'EUR (30 €)',
    popularMethods: ['Visa', 'Mastercard', 'Maestro', 'Amex']
  }
];

export interface BankOption {
  id: string;
  name: string;
  country: SupportedPaymentCountry;
  popular?: boolean;
  category?: 'bank' | 'instant' | 'app';
  icon?: string;
}

// 🇵🇱 Polish Banks & Methods
export const POLISH_BANKS: BankOption[] = [
  { id: 'pko_bp', name: 'PKO Bank Polski (iPKO)', country: 'pl', popular: true },
  { id: 'mbank', name: 'mBank', country: 'pl', popular: true },
  { id: 'santander_pl', name: 'Santander Bank Polska', country: 'pl', popular: true },
  { id: 'ing_pl', name: 'ING Bank Śląski (Moje ING)', country: 'pl', popular: true },
  { id: 'pekao', name: 'Bank Pekao S.A. (PeoPay)', country: 'pl', popular: true },
  { id: 'millennium', name: 'Bank Millennium', country: 'pl', popular: true },
  { id: 'alior', name: 'Alior Bank', country: 'pl', popular: true },
  { id: 'velobank', name: 'VeloBank', country: 'pl' },
  { id: 'bnp_pl', name: 'BNP Paribas Polska (GOmobile)', country: 'pl' },
  { id: 'credit_agricole_pl', name: 'Credit Agricole Polska', country: 'pl' },
  { id: 'pocztowy', name: 'Bank Pocztowy', country: 'pl' },
  { id: 'nest_bank', name: 'Nest Bank', country: 'pl' },
  { id: 'spoldzielcze', name: 'Banki Spółdzielcze (SGB / BPS)', country: 'pl' },
  { id: 'revolut_pl', name: 'Revolut Pay (PL)', country: 'pl', popular: true }
];

// 🇳🇱 Dutch Banks (iDEAL)
export const DUTCH_BANKS_FULL: BankOption[] = [
  { id: 'abn', name: 'ABN AMRO', country: 'nl', popular: true },
  { id: 'ing_nl', name: 'ING Bank (Mijn ING)', country: 'nl', popular: true },
  { id: 'rabobank', name: 'Rabobank', country: 'nl', popular: true },
  { id: 'asn', name: 'ASN Bank', country: 'nl', popular: true },
  { id: 'bunq', name: 'Bunq (Bank of the Free)', country: 'nl', popular: true },
  { id: 'sns', name: 'SNS Bank', country: 'nl' },
  { id: 'regio', name: 'RegioBank', country: 'nl' },
  { id: 'triodos', name: 'Triodos Bank', country: 'nl' },
  { id: 'knab', name: 'Knab', country: 'nl' },
  { id: 'revolut_nl', name: 'Revolut NL', country: 'nl' },
  { id: 'n26_nl', name: 'N26 Nederland', country: 'nl' },
  { id: 'van_lanschot', name: 'Van Lanschot Kempen', country: 'nl' }
];

// 🇧🇪 Belgian Banks (Bancontact, Belfius, KBC/CBC, ING BE)
export const BELGIAN_BANKS: BankOption[] = [
  { id: 'bancontact_payconiq', name: 'Bancontact / Payconiq App', country: 'be', popular: true },
  { id: 'belfius', name: 'Belfius Direct Net / Mobile', country: 'be', popular: true },
  { id: 'kbc_cbc', name: 'KBC Touch / CBC Mobile Button', country: 'be', popular: true },
  { id: 'ing_be', name: 'ING Belgium (Home\'Bank)', country: 'be', popular: true },
  { id: 'bnp_fortis', name: 'BNP Paribas Fortis (Easy Banking)', country: 'be', popular: true },
  { id: 'argenta', name: 'Argenta Bank', country: 'be' },
  { id: 'beobank', name: 'Beobank', country: 'be' },
  { id: 'crelan', name: 'Crelan / AXA Bank Belgium', country: 'be' },
  { id: 'hellobank_be', name: 'Hello bank! Belgium', country: 'be' },
  { id: 'nagelmackers', name: 'Bank Nagelmackers', country: 'be' }
];

// 🇩🇪 German Banks (Giropay, Sofort, SEPA, Banken)
export const GERMAN_BANKS: BankOption[] = [
  { id: 'sparkasse', name: 'Sparkassen-Finanzgruppe', country: 'de', popular: true },
  { id: 'deutsche_bank', name: 'Deutsche Bank', country: 'de', popular: true },
  { id: 'commerzbank', name: 'Commerzbank', country: 'de', popular: true },
  { id: 'ing_de', name: 'ING-DiBa Deutschland', country: 'de', popular: true },
  { id: 'postbank', name: 'Postbank (Deutsche Bank)', country: 'de', popular: true },
  { id: 'volksbank', name: 'Volksbanken Raiffeisenbanken', country: 'de', popular: true },
  { id: 'dkb', name: 'DKB (Deutsche Kreditbank)', country: 'de', popular: true },
  { id: 'n26_de', name: 'N26 Deutschland', country: 'de' },
  { id: 'sparda', name: 'Sparda-Banken', country: 'de' },
  { id: 'hypovereinsbank', name: 'HypoVereinsbank (UniCredit)', country: 'de' },
  { id: 'targobank', name: 'TARGOBANK', country: 'de' },
  { id: 'consorsbank', name: 'Consorsbank / BNP', country: 'de' }
];

// 🇫🇷 French Banks (Cartes Bancaires, Virement, Banques)
export const FRENCH_BANKS: BankOption[] = [
  { id: 'bnp_fr', name: 'BNP Paribas', country: 'fr', popular: true },
  { id: 'credit_agricole_fr', name: 'Crédit Agricole (Ma Banque)', country: 'fr', popular: true },
  { id: 'societe_generale', name: 'Société Générale (SG)', country: 'fr', popular: true },
  { id: 'credit_mutuel', name: 'Crédit Mutuel / CIC', country: 'fr', popular: true },
  { id: 'banque_populaire', name: 'Banque Populaire', country: 'fr', popular: true },
  { id: 'caisse_epargne', name: 'Caisse d\'Épargne', country: 'fr', popular: true },
  { id: 'lcl', name: 'LCL (Le Crédit Lyonnais)', country: 'fr' },
  { id: 'boursobank', name: 'BoursoBank (Boursorama)', country: 'fr', popular: true },
  { id: 'banque_postale', name: 'La Banque Postale', country: 'fr' },
  { id: 'fortuneo', name: 'Fortuneo Banque', country: 'fr' },
  { id: 'hellobank_fr', name: 'Hello bank! France', country: 'fr' }
];

export interface PaymentMethodDetails {
  id: string;
  name: string;
  country: SupportedPaymentCountry;
  badge: string;
  icon: string;
  type: 'blik' | 'bank_transfer' | 'ideal' | 'bancontact' | 'wero' | 'card' | 'giropay' | 'cartes_bancaires';
  description: {
    pl: string;
    nl: string;
    en: string;
    de: string;
    fr: string;
  };
}

export const ALL_PAYMENT_METHODS: PaymentMethodDetails[] = [
  // PL
  {
    id: 'blik',
    name: 'BLIK',
    country: 'pl',
    badge: '⚡ Natychmiast',
    icon: '🔴',
    type: 'blik',
    description: {
      pl: 'Szybka płatność kodem BLIK z aplikacji Twojego polskiego banku.',
      nl: 'Snelle mobiele betaling met 6-cijferige BLIK-code uit uw Poolse bank-app.',
      en: 'Fast 6-digit BLIK code payment directly from your Polish banking app.',
      de: 'Schnelle 6-stellige BLIK-Code-Zahlung über Ihre polnische Banking-App.',
      fr: 'Paiement mobile instantané par code BLIK à 6 chiffres depuis votre banque polonaise.'
    }
  },
  {
    id: 'p24_pl',
    name: 'Polskie Banki (Przelew Online)',
    country: 'pl',
    badge: '🏦 PKO, mBank, ING, Santander...',
    icon: '🇵🇱',
    type: 'bank_transfer',
    description: {
      pl: 'Wybierz swój polski bank (iPKO, mBank, Santander, ING, Pekao, Millennium, Alior itp.).',
      nl: 'Kies uw Poolse bank voor een directe overboeking.',
      en: 'Direct instant bank transfer via your preferred Polish bank.',
      de: 'Direkte Online-Überweisung über Ihre polnische Bank.',
      fr: 'Virement bancaire direct depuis votre compte bancaire polonais.'
    }
  },
  // NL
  {
    id: 'ideal',
    name: 'iDEAL',
    country: 'nl',
    badge: '🇳🇱 Standaard NL',
    icon: '🌸',
    type: 'ideal',
    description: {
      pl: 'Bezpośrednia płatność z holenderskiego konta bankowego (ABN, ING, Rabobank, ASN, Bunq).',
      nl: 'Betaal veilig en direct via uw eigen vertrouwde Nederlandse bankomgeving.',
      en: 'Secure online banking transfer via your Dutch bank (ABN, ING, Rabobank, Bunq, etc.).',
      de: 'Sichere Direktüberweisung über Ihre niederländische Bank.',
      fr: 'Paiement sécurisé via votre compte bancaire néerlandais.'
    }
  },
  {
    id: 'wero_nl',
    name: 'Wero / SEPA Instant',
    country: 'nl',
    badge: '🇪🇺 Europees Netwerk',
    icon: '⚡',
    type: 'wero',
    description: {
      pl: 'Nowoczesny europejski standard natychmiastowych płatności bankowych Wero.',
      nl: 'Nieuwe Europese standaard voor directe bankbetalingen via mobiel nummer.',
      en: 'Next-gen European instant payment standard across EU retail banks.',
      de: 'Neuer europäischer Standard für sofortige Banküberweisungen.',
      fr: 'Nouveau standard européen de paiement instantané interbancaire.'
    }
  },
  // BE
  {
    id: 'bancontact',
    name: 'Bancontact / Payconiq',
    country: 'be',
    badge: '🇧🇪 Populair België',
    icon: '🟡',
    type: 'bancontact',
    description: {
      pl: 'Płatność kartą Bancontact lub aplikacją Payconiq z kodem QR.',
      nl: 'Betaal met de Bancontact-kaart of scan met de Payconiq by Bancontact-app.',
      en: 'Pay with your Belgian Bancontact card or scan with the Payconiq app.',
      de: 'Zahlen Sie mit Ihrer belgischen Bancontact-Karte oder der Payconiq-App.',
      fr: 'Payez avec votre carte Bancontact belge ou l\'application Payconiq.'
    }
  },
  {
    id: 'belfius_kbc_be',
    name: 'Belgische Banken (Belfius, KBC, ING BE)',
    country: 'be',
    badge: '🏦 Belfius, KBC, BNP Fortis',
    icon: '🇧🇪',
    type: 'bank_transfer',
    description: {
      pl: 'Wybierz swój belgijski bank: Belfius Direct Net, KBC Touch, CBC Mobile, ING Belgium lub BNP Paribas Fortis.',
      nl: 'Kies uw Belgische bank: Belfius, KBC/CBC, ING België of BNP Paribas Fortis.',
      en: 'Select your Belgian bank: Belfius, KBC, ING Belgium, or BNP Paribas Fortis.',
      de: 'Wählen Sie Ihre belgische Bank: Belfius, KBC, ING Belgien oder BNP Paribas Fortis.',
      fr: 'Sélectionnez votre banque belge : Belfius, KBC, ING Belgique ou BNP Paribas Fortis.'
    }
  },
  // DE
  {
    id: 'giropay_sofort',
    name: 'Giropay / Sofort / EPS',
    country: 'de',
    badge: '🇩🇪 Deutschland',
    icon: '🇩🇪',
    type: 'giropay',
    description: {
      pl: 'Płatność niemieckim przelewem natychmiastowym Giropay lub Sofort Überweisung.',
      nl: 'Directe bankoverboeking via Giropay of Sofort voor Duitse rekeningen.',
      en: 'Direct secure bank transfer for German bank accounts via Giropay or Sofort.',
      de: 'Direkte und sichere Online-Überweisung über Giropay, Sofort oder Paydirekt.',
      fr: 'Virement bancaire direct et sécurisé pour comptes bancaires allemands.'
    }
  },
  {
    id: 'german_banks',
    name: 'Deutsche Banken & SEPA-Lastschrift',
    country: 'de',
    badge: '🏦 Sparkasse, DKB, Postbank...',
    icon: '🏛️',
    type: 'bank_transfer',
    description: {
      pl: 'Wybierz swój niemiecki bank: Sparkasse, Deutsche Bank, Commerzbank, ING-DiBa, DKB itp.',
      nl: 'Kies uw Duitse bank voor een beveiligde transactie.',
      en: 'Select your German bank: Sparkasse, Deutsche Bank, Commerzbank, ING-DiBa, etc.',
      de: 'Wählen Sie Ihre Bank: Sparkasse, Deutsche Bank, Commerzbank, ING-DiBa, DKB usw.',
      fr: 'Sélectionnez votre banque allemande : Sparkasse, Deutsche Bank, Commerzbank, etc.'
    }
  },
  // FR
  {
    id: 'cartes_bancaires',
    name: 'Cartes Bancaires (CB)',
    country: 'fr',
    badge: '🇫🇷 France CB',
    icon: '💳',
    type: 'cartes_bancaires',
    description: {
      pl: 'Płatność francuską kartą płatniczą Carte Bleue / Cartes Bancaires.',
      nl: 'Betaling met Franse bankkaart Carte Bancaire (CB).',
      en: 'Standard French payment card Cartes Bancaires (CB).',
      de: 'Zahlung mit französischer Carte Bancaire (CB).',
      fr: 'Paiement sécurisé par Carte Bancaire (CB) française avec authentification 3D Secure.'
    }
  },
  {
    id: 'french_banks',
    name: 'Banques Françaises (Virement / Paylib)',
    country: 'fr',
    badge: '🏦 BNP, Crédit Agricole, SG...',
    icon: '🇫🇷',
    type: 'bank_transfer',
    description: {
      pl: 'Wybierz swój francuski bank: BNP Paribas, Crédit Agricole, Société Générale, Crédit Mutuel itp.',
      nl: 'Kies uw Franse bank voor een beveiligde transactie.',
      en: 'Select your French bank: BNP Paribas, Crédit Agricole, Société Générale, etc.',
      de: 'Wählen Sie Ihre französische Bank.',
      fr: 'Sélectionnez votre banque : BNP Paribas, Crédit Agricole, Société Générale, BoursoBank, etc.'
    }
  },
  // CARD FOR ALL
  {
    id: 'card_international',
    name: 'Karta Kredytowa / Debetowa (Visa, Mastercard, Maestro, Amex)',
    country: 'all',
    badge: '💳 3D Secure 2.0',
    icon: '🌍',
    type: 'card',
    description: {
      pl: 'Obsługa wszystkich kart Visa, Mastercard, Maestro, American Express z ochroną 3D Secure.',
      nl: 'Geschikt voor alle Visa, Mastercard, Maestro en American Express kaarten met 3D Secure.',
      en: 'Universal credit & debit card checkout (Visa, Mastercard, Maestro, Amex) with 3D Secure.',
      de: 'Für alle Visa, Mastercard, Maestro und American Express Karten mit 3D Secure 2.0.',
      fr: 'Toutes cartes bancaires Visa, Mastercard, Maestro, American Express avec 3D Secure.'
    }
  }
];

export function getBanksForCountry(country: SupportedPaymentCountry): BankOption[] {
  switch (country) {
    case 'pl':
      return POLISH_BANKS;
    case 'nl':
      return DUTCH_BANKS_FULL;
    case 'be':
      return BELGIAN_BANKS;
    case 'de':
      return GERMAN_BANKS;
    case 'fr':
      return FRENCH_BANKS;
    default:
      return [...POLISH_BANKS.slice(0, 3), ...DUTCH_BANKS_FULL.slice(0, 3), ...BELGIAN_BANKS.slice(0, 2), ...GERMAN_BANKS.slice(0, 2), ...FRENCH_BANKS.slice(0, 2)];
  }
}
