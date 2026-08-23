import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  pl: {
    translation: {
      welcome: 'Witaj!', search: 'Szukaj', plan: 'Plan dnia', stamps: 'Stempelki',
      budget: 'Budżet', gallery: 'Zdjęcia', map: 'Mapa', transport: 'Transport',
      profile: 'Profil', login: 'Zaloguj się', logout: 'Wyloguj',
      family: 'Rodzina', single: 'Singiel', senior: 'Senior (60+)',
      low: 'Oszczędny', mid: 'Średni', high: 'Bez limitu',
      add: 'Dodaj', save: 'Zapisz', cancel: 'Anuluj', done: 'Zrobione', remove: 'Usuń',
      total: 'Suma', today: 'Dzisiaj', free: 'Darmowe', flat: 'Płaskie', lit: 'Oświetlone',
      darkReminder: 'Przypomnienie o zmroku', notif9292: 'Powiadomienia 9292',
      seniorMode: 'Tryb seniora', resetData: 'Wyczyść dane',
      nextStamp: 'Następny stempel', earned: 'zdobytych',
      addExpense: 'Dodaj wydatek', expenseName: 'Co kupiłeś?', expenseAmount: 'Kwota',
      category: 'Kategoria', food: 'Jedzenie', transportCat: 'Transport', tickets: 'Bilety', other: 'Inne',
      searchPlaceholder: 'Np. Warszawa, Berlin, Paryż...',
      results: 'wyników', noResults: 'Brak wyników',
      savePlan: 'Zapisz plan i przypomnienie', planSaved: 'Plan zapisany! Tadzik przypomni o odjeździe.',
      from: 'Z', to: 'Do', findRoute: 'Znajdź połączenie', open9292: 'Otwórz planner',
      country: 'Kraj', region: 'Region', budgetLabel: 'Budżet',
      poland: 'Polska', germany: 'Niemcy', netherlands: 'Holandia', belgium: 'Belgia', france: 'Francja',
      premium: 'Premium', premiumActive: 'Premium aktywne', premiumBuy: 'Kup Premium',
      premiumPrice: '€25 / rok', premiumDesc: 'Pełen dostęp do wszystkich funkcji',
      paymentMethods: 'Metody płatności: BLIK, karta, SOFORT',
      all: 'Wszystko', museum: 'Muzeum', park: 'Park', nature: 'Przyroda',
      foodCat: 'Jedzenie', unesco: 'UNESCO', village: 'Wioska', tech: 'Technika',
    }
  },
  nl: {
    translation: {
      welcome: 'Welkom!', search: 'Zoeken', plan: 'Dagplan', stamps: 'Stempels',
      budget: 'Budget', gallery: 'Foto\'s', map: 'Kaart', transport: 'OV',
      profile: 'Profiel', login: 'Inloggen', logout: 'Uitloggen',
      family: 'Gezin', single: 'Single', senior: 'Senior (60+)',
      low: 'Budget', mid: 'Gemiddeld', high: 'Onbeperkt',
      add: 'Toevoegen', save: 'Opslaan', cancel: 'Annuleren', done: 'Klaar', remove: 'Verwijderen',
      total: 'Totaal', today: 'Vandaag', free: 'Gratis', flat: 'Vlak', lit: 'Verlicht',
      darkReminder: 'Herinnering schemering', notif9292: '9292 meldingen',
      seniorMode: 'Senior modus', resetData: 'Gegevens wissen',
      nextStamp: 'Volgende stempel', earned: 'verdiend',
      addExpense: 'Uitgave toevoegen', expenseName: 'Wat heb je gekocht?', expenseAmount: 'Bedrag',
      category: 'Categorie', food: 'Eten', transportCat: 'Vervoer', tickets: 'Kaartjes', other: 'Overig',
      searchPlaceholder: 'Bijv. Amsterdam, Rotterdam...',
      results: 'resultaten', noResults: 'Geen resultaten',
      savePlan: 'Plan opslaan & herinnering', planSaved: 'Plan opgeslagen! Tadzik herinnert aan 9292.',
      from: 'Van', to: 'Naar', findRoute: 'Zoek route', open9292: 'Open planner',
      country: 'Land', region: 'Regio', budgetLabel: 'Budget',
      poland: 'Polen', germany: 'Duitsland', netherlands: 'Nederland', belgium: 'België', france: 'Frankrijk',
      premium: 'Premium', premiumActive: 'Premium actief', premiumBuy: 'Koop Premium',
      premiumPrice: '€25 / jaar', premiumDesc: 'Volledige toegang tot alle functies',
      paymentMethods: 'Betaalmethoden: iDEAL, Bancontact, kaart',
      all: 'Alles', museum: 'Museum', park: 'Park', nature: 'Natuur',
      foodCat: 'Eten', unesco: 'UNESCO', village: 'Dorp', tech: 'Techniek',
    }
  },
  en: {
    translation: {
      welcome: 'Welcome!', search: 'Search', plan: 'Day Plan', stamps: 'Stamps',
      budget: 'Budget', gallery: 'Photos', map: 'Map', transport: 'Transit',
      profile: 'Profile', login: 'Log in', logout: 'Log out',
      family: 'Family', single: 'Single', senior: 'Senior (60+)',
      low: 'Budget', mid: 'Standard', high: 'Unlimited',
      add: 'Add', save: 'Save', cancel: 'Cancel', done: 'Done', remove: 'Remove',
      total: 'Total', today: 'Today', free: 'Free', flat: 'Flat', lit: 'Lit',
      darkReminder: 'Sunset reminder', notif9292: 'Transit notifications',
      seniorMode: 'Senior mode', resetData: 'Reset data',
      nextStamp: 'Next stamp', earned: 'earned',
      addExpense: 'Add expense', expenseName: 'What did you buy?', expenseAmount: 'Amount',
      category: 'Category', food: 'Food', transportCat: 'Transport', tickets: 'Tickets', other: 'Other',
      searchPlaceholder: 'e.g. Paris, Berlin, Warsaw...',
      results: 'results', noResults: 'No results',
      savePlan: 'Save plan & reminder', planSaved: 'Plan saved! Tadzik will remind you.',
      from: 'From', to: 'To', findRoute: 'Find route', open9292: 'Open transit planner',
      country: 'Country', region: 'Region', budgetLabel: 'Budget',
      poland: 'Poland', germany: 'Germany', netherlands: 'Netherlands', belgium: 'Belgium', france: 'France',
      premium: 'Premium', premiumActive: 'Premium active', premiumBuy: 'Buy Premium',
      premiumPrice: '€25 / year', premiumDesc: 'Full access to all features',
      paymentMethods: 'Payment methods: card, SOFORT, iDEAL',
      all: 'All', museum: 'Museum', park: 'Park', nature: 'Nature',
      foodCat: 'Food', unesco: 'UNESCO', village: 'Village', tech: 'Technology',
    }
  },
  de: {
    translation: {
      welcome: 'Willkommen!', search: 'Suchen', plan: 'Tagesplan', stamps: 'Stempel',
      budget: 'Budget', gallery: 'Fotos', map: 'Karte', transport: 'ÖPNV',
      profile: 'Profil', login: 'Anmelden', logout: 'Abmelden',
      family: 'Familie', single: 'Single', senior: 'Senior (60+)',
      low: 'Sparfuchs', mid: 'Mittel', high: 'Unbegrenzt',
      add: 'Hinzufügen', save: 'Speichern', cancel: 'Abbrechen', done: 'Erledigt', remove: 'Entfernen',
      total: 'Gesamt', today: 'Heute', free: 'Kostenlos', flat: 'Flach', lit: 'Beleuchtet',
      darkReminder: 'Erinnerung bei Dämmerung', notif9292: 'ÖPNV-Benachrichtigungen',
      seniorMode: 'Seniorenmodus', resetData: 'Daten zurücksetzen',
      nextStamp: 'Nächster Stempel', earned: 'verdient',
      addExpense: 'Ausgabe hinzufügen', expenseName: 'Was hast du gekauft?', expenseAmount: 'Betrag',
      category: 'Kategorie', food: 'Essen', transportCat: 'Verkehr', tickets: 'Tickets', other: 'Sonstiges',
      searchPlaceholder: 'z.B. Berlin, München, Hamburg...',
      results: 'Ergebnisse', noResults: 'Keine Ergebnisse',
      savePlan: 'Plan speichern & Erinnerung', planSaved: 'Plan gespeichert! Tadzik erinnert dich.',
      from: 'Von', to: 'Nach', findRoute: 'Route finden', open9292: 'ÖPNV-Planer öffnen',
      country: 'Land', region: 'Region', budgetLabel: 'Budget',
      poland: 'Polen', germany: 'Deutschland', netherlands: 'Niederlande', belgium: 'Belgien', france: 'Frankreich',
      premium: 'Premium', premiumActive: 'Premium aktiv', premiumBuy: 'Premium kaufen',
      premiumPrice: '€25 / Jahr', premiumDesc: 'Voller Zugriff auf alle Funktionen',
      paymentMethods: 'Zahlungsmethoden: SOFORT, Klarna, Karte',
      all: 'Alle', museum: 'Museum', park: 'Park', nature: 'Natur',
      foodCat: 'Essen', unesco: 'UNESCO', village: 'Dorf', tech: 'Technik',
    }
  },
  fr: {
    translation: {
      welcome: 'Bienvenue!', search: 'Rechercher', plan: 'Plan du jour', stamps: 'Tampons',
      budget: 'Budget', gallery: 'Photos', map: 'Carte', transport: 'Transport',
      profile: 'Profil', login: 'Connexion', logout: 'Déconnexion',
      family: 'Famille', single: 'Célibataire', senior: 'Senior (60+)',
      low: 'Économique', mid: 'Moyen', high: 'Illimité',
      add: 'Ajouter', save: 'Enregistrer', cancel: 'Annuler', done: 'Terminé', remove: 'Supprimer',
      total: 'Total', today: 'Aujourd\'hui', free: 'Gratuit', flat: 'Plat', lit: 'Éclairé',
      darkReminder: 'Rappel au crépuscule', notif9292: 'Notifications transport',
      seniorMode: 'Mode senior', resetData: 'Réinitialiser les données',
      nextStamp: 'Prochain tampon', earned: 'gagnés',
      addExpense: 'Ajouter une dépense', expenseName: 'Qu\'avez-vous acheté?', expenseAmount: 'Montant',
      category: 'Catégorie', food: 'Nourriture', transportCat: 'Transport', tickets: 'Billets', other: 'Autre',
      searchPlaceholder: 'ex. Paris, Lyon, Nice...',
      results: 'résultats', noResults: 'Aucun résultat',
      savePlan: 'Enregistrer le plan & rappel', planSaved: 'Plan enregistré! Tadzik vous rappellera.',
      from: 'De', to: 'À', findRoute: 'Trouver un itinéraire', open9292: 'Ouvrir le planificateur',
      country: 'Pays', region: 'Région', budgetLabel: 'Budget',
      poland: 'Pologne', germany: 'Allemagne', netherlands: 'Pays-Bas', belgium: 'Belgique', france: 'France',
      premium: 'Premium', premiumActive: 'Premium actif', premiumBuy: 'Acheter Premium',
      premiumPrice: '€25 / an', premiumDesc: 'Accès complet à toutes les fonctionnalités',
      paymentMethods: 'Méthodes: Cartes Bancaires, carte',
      all: 'Tout', museum: 'Musée', park: 'Parc', nature: 'Nature',
      foodCat: 'Nourriture', unesco: 'UNESCO', village: 'Village', tech: 'Technologie',
    }
  },
  zh: {
    translation: {
      welcome: '欢迎!', search: '搜索', plan: '日程', stamps: '印章',
      budget: '预算', gallery: '照片', map: '地图', transport: '交通',
      profile: '个人资料', login: '登录', logout: '退出',
      family: '家庭', single: '单身', senior: '长者 (60+)',
      low: '经济型', mid: '标准型', high: '豪华型',
      add: '添加', save: '保存', cancel: '取消', done: '完成', remove: '删除',
      total: '总计', today: '今天', free: '免费', flat: '平坦', lit: '照明',
      darkReminder: '黄昏提醒', notif9292: '交通通知',
      seniorMode: '长者模式', resetData: '重置数据',
      nextStamp: '下一个印章', earned: '已获得',
      addExpense: '添加支出', expenseName: '买了什么?', expenseAmount: '金额',
      category: '类别', food: '食物', transportCat: '交通', tickets: '门票', other: '其他',
      searchPlaceholder: '例如: 巴黎, 柏林, 华沙...',
      results: '结果', noResults: '无结果',
      savePlan: '保存计划并设置提醒', planSaved: '计划已保存! Tadzik会提醒您。',
      from: '从', to: '到', findRoute: '查找路线', open9292: '打开交通规划',
      country: '国家', region: '地区', budgetLabel: '预算',
      poland: '波兰', germany: '德国', netherlands: '荷兰', belgium: '比利时', france: '法国',
      premium: '高级版', premiumActive: '高级版已激活', premiumBuy: '购买高级版',
      premiumPrice: '€25 / 年', premiumDesc: '使用所有功能的完整权限',
      paymentMethods: '支付方式: 银行卡, 支付宝, 微信',
      all: '全部', museum: '博物馆', park: '公园', nature: '自然',
      foodCat: '美食', unesco: '世界遗产', village: '村庄', tech: '科技',
    }
  }
};

const lng = Localization.locale.split('-')[0];
const supported = ['pl', 'nl', 'en', 'de', 'fr', 'zh'];
const fallback = supported.includes(lng) ? lng : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: fallback,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
