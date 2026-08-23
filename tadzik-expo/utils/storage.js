import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PROFILE: '@tadzik_profile',
  COUNTRY: '@tadzik_country',
  REGION: '@tadzik_region',
  BUDGET: '@tadzik_budget',
  SENIOR: '@tadzik_senior',
  PREMIUM: '@tadzik_premium',
  PLAN: '@tadzik_plan',
  EXPENSES: '@tadzik_expenses',
  STAMPS: '@tadzik_stamps',
  GALLERY: '@tadzik_gallery',
  ONBOARDED: '@tadzik_onboarded',
  STREAK: '@tadzik_streak',
};

export const Storage = {
  async getProfile() {
    const [profile, country, region, budget, senior, premium, onboarded] = await Promise.all([
      AsyncStorage.getItem(KEYS.PROFILE),
      AsyncStorage.getItem(KEYS.COUNTRY),
      AsyncStorage.getItem(KEYS.REGION),
      AsyncStorage.getItem(KEYS.BUDGET),
      AsyncStorage.getItem(KEYS.SENIOR),
      AsyncStorage.getItem(KEYS.PREMIUM),
      AsyncStorage.getItem(KEYS.ONBOARDED),
    ]);
    return {
      profile: profile || null,
      country: country || null,
      region: region || null,
      budget: budget || null,
      senior: senior === 'true',
      premium: premium === 'true',
      onboarded: onboarded === 'true',
    };
  },
  async saveProfile({ profile, country, region, budget, senior, premium }) {
    await AsyncStorage.multiSet([
      [KEYS.PROFILE, profile || ''],
      [KEYS.COUNTRY, country || ''],
      [KEYS.REGION, region || ''],
      [KEYS.BUDGET, budget || ''],
      [KEYS.SENIOR, senior ? 'true' : 'false'],
      [KEYS.PREMIUM, premium ? 'true' : 'false'],
      [KEYS.ONBOARDED, 'true'],
    ]);
  },
  async getPlan() {
    const raw = await AsyncStorage.getItem(KEYS.PLAN);
    return raw ? JSON.parse(raw) : null;
  },
  async savePlan(plan) {
    await AsyncStorage.setItem(KEYS.PLAN, JSON.stringify(plan));
  },
  async getExpenses() {
    const raw = await AsyncStorage.getItem(KEYS.EXPENSES);
    return raw ? JSON.parse(raw) : [];
  },
  async saveExpenses(expenses) {
    await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
  },
  async getStamps() {
    const raw = await AsyncStorage.getItem(KEYS.STAMPS);
    return raw ? JSON.parse(raw) : null;
  },
  async saveStamps(stamps) {
    await AsyncStorage.setItem(KEYS.STAMPS, JSON.stringify(stamps));
  },
  async getGallery() {
    const raw = await AsyncStorage.getItem(KEYS.GALLERY);
    return raw ? JSON.parse(raw) : [];
  },
  async saveGallery(gallery) {
    await AsyncStorage.setItem(KEYS.GALLERY, JSON.stringify(gallery));
  },
  async getStreak() {
    const raw = await AsyncStorage.getItem(KEYS.STREAK);
    return raw ? parseInt(raw, 10) : 3;
  },
  async saveStreak(count) {
    await AsyncStorage.setItem(KEYS.STREAK, String(count));
  },
  async clearAll() {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  },
};
