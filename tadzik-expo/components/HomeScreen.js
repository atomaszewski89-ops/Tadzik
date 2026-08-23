import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Storage } from '../utils/storage';
import { COUNTRIES } from '../data/attractions';

const { width } = Dimensions.get('window');

const JOKES = {
  morning: [
    'Kawa gotowa? Plan też! ☕',
    'Dzień dobry, odkrywco! 🧭',
    'Twoje buty turystyczne już czekają! 👟',
    'Nowy dzień = nowe miejsce do zdobycia! 🎯',
  ],
  afternoon: [
    'Pora na lunch... albo zamek! 🏰',
    'Południe – idealny czas na muzeum (i drzemkę potem) 😴',
    'Nie zapomnij o wodzie! Aplikacja też pije... dane. 📊',
  ],
  evening: [
    'Zmierzch nadchodzi! Tadzik pilnuje. 🌅',
    'Czas na kolację – znajdź coś pysznego! 🍽️',
    'Dobry wieczór! Ile stempli dziś zdobyłeś? 🏅',
  ],
};

const DEFAULT_PLANS = {
  pl: [
    { time: '09:00', title: 'Zamek Królewski', desc: 'Bilety online – wstęp od 9:00', tag: 'Bilety', tagType: 'money', done: false },
    { time: '11:30', title: 'Łazienki Królewskie', desc: 'Spacer po parku, płaska trasa', tag: 'Park', tagType: '', done: false },
    { time: '13:00', title: 'Lunch: Zapiecek', desc: 'Pierogi, ok. €10/osoba', tag: 'Jedzenie', tagType: 'money', done: false },
  ],
  de: [
    { time: '09:00', title: 'Brama Brandenburska', desc: 'Symbol Berlina, zdjęcia', tag: 'Zabytek', tagType: '', done: false },
    { time: '11:00', title: 'Mauermuseum', desc: 'Muzeum Muru, €15', tag: 'Muzeum', tagType: 'money', done: false },
    { time: '13:00', title: 'Lunch: Curry 36', desc: 'Currywurst, ok. €6', tag: 'Jedzenie', tagType: 'money', done: false },
  ],
  nl: [
    { time: '09:00', title: 'Rijksmuseum', desc: 'Bilety online – wstęp od 9:00', tag: 'Bilety', tagType: 'money', done: false },
    { time: '11:30', title: 'Vondelpark', desc: 'Płaska trasa rowerowa, 15 min', tag: 'Fietspad', tagType: 'bike', done: false },
    { time: '13:00', title: 'Lunch: De Foodhallen', desc: 'Street food, ok. €15', tag: 'Jedzenie', tagType: 'money', done: false },
  ],
  be: [
    { time: '09:00', title: 'Grand Place', desc: 'UNESCO, płaski dostęp', tag: 'UNESCO', tagType: '', done: false },
    { time: '11:00', title: 'Atomium', desc: 'Bilety €16, winda', tag: 'Bilety', tagType: 'money', done: false },
    { time: '13:00', title: 'Lunch: Maison Dandoy', desc: 'Waffle, ok. €8', tag: 'Jedzenie', tagType: 'money', done: false },
  ],
  fr: [
    { time: '09:00', title: 'Wieża Eiffla', desc: 'Wstęp od 9:30, €29', tag: 'Bilety', tagType: 'money', done: false },
    { time: '11:30', title: 'Luwr', desc: 'Mona Lisa, rezerwacja online', tag: 'Muzeum', tagType: 'money', done: false },
    { time: '13:00', title: 'Lunch: Le Petit', desc: 'Croque-monsieur, €12', tag: 'Jedzenie', tagType: 'money', done: false },
  ],
};

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

function getRandomJoke() {
  const time = getTimeOfDay();
  const jokes = JOKES[time];
  return jokes[Math.floor(Math.random() * jokes.length)];
}

export default function HomeScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { profile, country, region, senior } = route.params || {};
  
  const [plan, setPlan] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(3);
  const [joke, setJoke] = useState(getRandomJoke);
  const [premium, setPremium] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const saved = await Storage.getPlan();
      const prof = await Storage.getProfile();
      const streakData = await Storage.getStreak();

      if (saved && Array.isArray(saved)) {
        setPlan(saved);
      } else {
        const defaultPlan = DEFAULT_PLANS[country] || DEFAULT_PLANS.nl;
        setPlan(defaultPlan);
        await Storage.savePlan(defaultPlan);
      }

      setPremium(prof?.premium === true);
      setStreak(streakData || 1);
    } catch (err) {
      console.error('Błąd ładowania HomeScreen:', err);
      setError('Nie udało się wczytać danych. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  }, [country]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setJoke(getRandomJoke());
    setRefreshing(false);
  }, [loadData]);

  const navTo = useCallback((screen, params) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(screen, params);
  }, [navigation]);

  const tagStyle = useMemo(() => (type) => {
    if (type === 'bike') return { bg: 'rgba(59,130,246,0.15)', text: '#93c5fd' };
    if (type === 'money') return { bg: 'rgba(245,158,11,0.15)', text: '#fcd34d' };
    return { bg: 'rgba(34,197,94,0.15)', text: '#86efac' };
  }, []);

  const c = COUNTRIES[country] || COUNTRIES.nl;
  const completedToday = plan.filter((p) => p.done).length;
  const progress = plan.length ? (completedToday / plan.length) * 100 : 0;

  // Unikalny klucz dla elementu planu
  const planKey = (item, index) => `${item.time}-${item.title}-${index}`;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6366f1" accessibilityLabel="Wczytywanie danych" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 140, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366f1"
            accessibilityLabel="Odśwież ekran główny"
          />
        }
      >
        {/* Header */}
        <LinearGradient colors={['#0f172a', '#1e1b4b']} style={styles.header}>
          <Animated.View entering={FadeInUp.duration(600)}>
            <View style={styles.headerTop}>
              <View style={styles.headerText}>
                <Text
                  style={styles.greeting}
                  maxFontSizeMultiplier={1.3}
                  accessibilityRole="header"
                >
                  Cześć, odkrywco! 👋
                </Text>
                <Text style={styles.joke} maxFontSizeMultiplier={1.2}>
                  {joke}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.streakBadge}
                onPress={() => navTo('Profile')}
                accessibilityRole="button"
                accessibilityLabel="Twój profil"
                accessibilityHint="Przejdź do ekranu profilu i statystyk"
                activeOpacity={0.7}
              >
                <Ionicons name="flame" size={18} color="#f59e0b" accessibilityLabel="Płomień serii" />
                <Text style={styles.streakText} maxFontSizeMultiplier={1.2}>
                  {streak}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.countryPill}>
              <Text style={styles.countryFlag}>{c.flag}</Text>
              <Text style={styles.countryName} maxFontSizeMultiplier={1.2}>
                {c.name}
              </Text>
              <Text style={styles.countryDivider}>•</Text>
              <Text style={styles.countryRegion} maxFontSizeMultiplier={1.2}>
                {region || 'Wybierz region'}
              </Text>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Error Banner */}
        {error && (
          <Animated.View entering={FadeIn} style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color="#ef4444" />
            <Text style={styles.errorText} maxFontSizeMultiplier={1.2}>{error}</Text>
          </Animated.View>
        )}

        {/* Progress Card */}
        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.glassCardWrapper}>
          <BlurView intensity={40} tint="dark" style={styles.glassBlur}>
            <View style={styles.glassCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle} maxFontSizeMultiplier={1.2}>
                  Dzisiejszy postęp
                </Text>
                <Text style={styles.progressPercent} maxFontSizeMultiplier={1.2}>
                  {Math.round(progress)}%
                </Text>
              </View>
              <View
                style={styles.progressBarBg}
                accessibilityRole="progressbar"
                accessibilityValue={{ min: 0, max: 100, now: Math.round(progress) }}
                accessibilityLabel={`Postęp wykonania planu: ${Math.round(progress)} procent`}
              >
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressSub} maxFontSizeMultiplier={1.2}>
                {completedToday === 0
                  ? 'Jeszcze nic nie zrobione... ale to się zmieni! 💪'
                  : completedToday === plan.length
                  ? 'Wszystko zrobione! Jesteś maszyną! 🤖'
                  : `${completedToday} z ${plan.length} zrobione – keep going!`}
              </Text>
            </View>
          </BlurView>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.2}>
            Szybkie akcje
          </Text>
          <View style={styles.actionsRow}>
            {[
              { icon: 'compass', label: 'Odkryj', color: '#818cf8', screen: 'Explore', desc: 'Mapa & szukaj' },
              { icon: 'calendar', label: 'Plan', color: '#f472b6', screen: 'Plan', desc: 'Twoja trasa' },
              { icon: 'add-circle', label: 'Dodaj', color: '#4ade80', screen: 'AddPlace', desc: 'Nowe miejsce' },
              { icon: 'people', label: 'Społeczność', color: '#fbbf24', screen: 'Community', desc: 'Inni odkrywcy' },
            ].map((item) => (
              <TouchableOpacity
                key={item.screen}
                style={[styles.actionBtn, { backgroundColor: item.color + '18' }]}
                onPress={() => navTo(item.screen)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                accessibilityHint={`Przejdź do sekcji ${item.label}: ${item.desc}`}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: item.color + '28' }]}>
                  <Ionicons name={item.icon} size={22} color={item.color} accessibilityLabel="" />
                </View>
                <Text style={styles.actionLabel} maxFontSizeMultiplier={1.2}>
                  {item.label}
                </Text>
                <Text style={styles.actionDesc} maxFontSizeMultiplier={1.1}>
                  {item.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Today's Plan */}
        <Animated.View entering={FadeInUp.delay(300).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.2}>
              Dzisiaj na trasie
            </Text>
            <TouchableOpacity
              onPress={() => navTo('Plan')}
              accessibilityRole="button"
              accessibilityLabel="Zobacz cały plan"
              accessibilityHint="Przejdź do pełnego planu podróży"
              style={styles.seeAllTouchable}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.seeAll} maxFontSizeMultiplier={1.2}>
                Zobacz cały plan →
              </Text>
            </TouchableOpacity>
          </View>

          {plan.slice(0, 3).map((item, i) => {
            const ts = tagStyle(item.tagType);
            const itemKey = planKey(item, i);
            return (
              <TouchableOpacity
                key={itemKey}
                style={[styles.planCard, item.done && styles.planCardDone]}
                onPress={() => navTo('Plan')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`${item.time}: ${item.title}. ${item.desc}`}
                accessibilityState={{ selected: item.done }}
                accessibilityHint="Przejdź do szczegółów planu"
              >
                <View
                  style={[
                    styles.planTimeBox,
                    item.done && { backgroundColor: 'rgba(34,197,94,0.2)' },
                  ]}
                >
                  <Text
                    style={[styles.planTime, item.done && { color: '#86efac' }]}
                    maxFontSizeMultiplier={1.2}
                  >
                    {item.time}
                  </Text>
                </View>
                <View style={styles.planContent}>
                  <Text
                    style={[styles.planTitle, item.done && styles.planTitleDone]}
                    maxFontSizeMultiplier={1.2}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.planDesc} maxFontSizeMultiplier={1.2}>
                    {item.desc}
                  </Text>
                  {item.tag && (
                    <View style={[styles.planTag, { backgroundColor: ts.bg }]}>
                      <Text style={[styles.planTagText, { color: ts.text }]} maxFontSizeMultiplier={1.1}>
                        {item.tag}
                      </Text>
                    </View>
                  )}
                </View>
                {item.done && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="#4ade80"
                    accessibilityLabel="Wykonane"
                  />
                )}
              </TouchableOpacity>
            );
          })}

          {plan.length === 0 && (
            <View style={styles.emptyCard}>
              <Ionicons name="sad-outline" size={32} color="#94a3b8" accessibilityLabel="Brak planu" />
              <Text style={styles.emptyText} maxFontSizeMultiplier={1.2}>
                Pusto jak w pustyni Gobi... 🐪
              </Text>
              <Text style={styles.emptySub} maxFontSizeMultiplier={1.2}>
                Dodaj pierwsze miejsce w zakładce Plan!
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Fun Fact */}
        <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.funFactCard}>
          <Ionicons name="bulb" size={20} color="#fbbf24" accessibilityLabel="Ciekawostka" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.funFactTitle} maxFontSizeMultiplier={1.2}>
              Czy wiesz, że...?
            </Text>
            <Text style={styles.funFactText} maxFontSizeMultiplier={1.2}>
              W Amsterdamie jest więcej rowerów niż ludzi? 🚲👥
            </Text>
          </View>
        </Animated.View>

        {/* Premium Banner */}
        {!premium && (
          <TouchableOpacity
            style={styles.premiumBanner}
            onPress={() => navigation.navigate('Premium')}
            accessibilityRole="button"
            accessibilityLabel="Tadzik Premium"
            accessibilityHint="Przejdź do zakupu subskrypcji Premium za 25 euro rocznie"
            activeOpacity={0.85}
          >
            <LinearGradient colors={['#4f46e5', '#7c3aed']} style={styles.premiumGradient}>
              <Ionicons name="diamond" size={24} color="#fff" accessibilityLabel="Diament" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.premiumTitle} maxFontSizeMultiplier={1.2}>
                  Tadzik Premium
                </Text>
                <Text style={styles.premiumSub} maxFontSizeMultiplier={1.2}>
                  Odblokuj pełną moc odkrywcy – €25/rok
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#fff" accessibilityLabel="Przejdź dalej" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },

  // Header
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  headerText: { flex: 1, marginRight: 12 },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: -0.5,
  },
  joke: {
    fontSize: 14,
    color: 'rgba(248,250,252,0.75)',
    marginTop: 6,
    lineHeight: 20,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,158,11,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    minWidth: 44,
    minHeight: 44,
  },
  streakText: {
    color: '#fbbf24',
    fontWeight: '800',
    marginLeft: 6,
    fontSize: 15,
  },

  // Country Pill
  countryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  countryFlag: { fontSize: 18 },
  countryName: { color: '#f1f5f9', fontWeight: '700', marginLeft: 8, fontSize: 15 },
  countryDivider: { color: 'rgba(255,255,255,0.25)', marginHorizontal: 10, fontSize: 14 },
  countryRegion: { color: 'rgba(255,255,255,0.55)', fontSize: 14 },

  // Error
  errorBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    gap: 10,
  },
  errorText: { color: '#fca5a5', fontSize: 13, flex: 1, fontWeight: '500' },

  // Glass Card
  glassCardWrapper: {
    marginHorizontal: 16,
    marginTop: -14,
    borderRadius: 24,
    overflow: 'hidden',
  },
  glassBlur: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  glassCard: {
    padding: 20,
    backgroundColor: 'rgba(30,41,59,0.45)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.12)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: { fontSize: 16, fontWeight: '700', color: '#f1f5f9' },
  progressPercent: { fontSize: 20, fontWeight: '800', color: '#818cf8' },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  progressSub: {
    fontSize: 13,
    color: 'rgba(248,250,252,0.65)',
    marginTop: 10,
    lineHeight: 18,
  },

  // Actions
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#f8fafc',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionLabel: { fontSize: 14, fontWeight: '700', color: '#f1f5f9' },
  actionDesc: { fontSize: 11, color: 'rgba(248,250,252,0.55)', marginTop: 3, textAlign: 'center' },

  // Plan Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 28,
    marginBottom: 14,
  },
  seeAllTouchable: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  seeAll: { fontSize: 14, color: '#818cf8', fontWeight: '600' },

  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(30,41,59,0.5)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    minHeight: 80,
  },
  planCardDone: {
    borderColor: 'rgba(34,197,94,0.25)',
    backgroundColor: 'rgba(34,197,94,0.06)',
  },
  planTimeBox: {
    backgroundColor: 'rgba(99,102,241,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 14,
    minWidth: 56,
    alignItems: 'center',
  },
  planTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#a5b4fc',
  },
  planContent: { flex: 1 },
  planTitle: { fontSize: 16, fontWeight: '700', color: '#f8fafc', marginBottom: 2 },
  planTitleDone: { textDecorationLine: 'line-through', color: 'rgba(248,250,252,0.45)' },
  planDesc: { fontSize: 13, color: 'rgba(248,250,252,0.6)', lineHeight: 18 },
  planTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  planTagText: { fontSize: 11, fontWeight: '700' },

  // Empty
  emptyCard: {
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 32,
    backgroundColor: 'rgba(30,41,59,0.35)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyText: { fontSize: 16, color: '#f1f5f9', marginTop: 14, fontWeight: '600' },
  emptySub: { fontSize: 13, color: 'rgba(248,250,252,0.55)', marginTop: 6, textAlign: 'center' },

  // Fun Fact
  funFactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  funFactTitle: { fontSize: 13, fontWeight: '700', color: '#fbbf24', marginBottom: 4 },
  funFactText: { fontSize: 13, color: 'rgba(248,250,252,0.75)', lineHeight: 18 },

  // Premium
  premiumBanner: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 20,
    overflow: 'hidden',
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  premiumTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  premiumSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
});
