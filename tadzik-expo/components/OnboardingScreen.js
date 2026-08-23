import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  Dimensions, SafeAreaView, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const COUNTRIES = [
  { id: 'pl', label: 'Polska', flag: '🇵🇱', sub: 'Warszawa, Kraków, Gdańsk, Tatry' },
  { id: 'de', label: 'Niemcy', flag: '🇩🇪', sub: 'Berlin, Monachium, Hamburg, Zamek Neuschwanstein' },
  { id: 'nl', label: 'Holandia', flag: '🇳🇱', sub: 'Amsterdam, Rotterdam, Keukenhof, Kinderdijk' },
  { id: 'be', label: 'Belgia', flag: '🇧🇪', sub: 'Bruksela, Brugia, Antwerpia, Gandawa' },
  { id: 'fr', label: 'Francja', flag: '🇫🇷', sub: 'Paryż, Lyon, Lazurowe Wybrzeże, Wersal' },
];

const REGIONS = {
  pl: [
    { id: 'warszawa', label: 'Warszawa & Mazowsze', sub: 'Stolica, Łazienki, Wilanów', icon: 'location' },
    { id: 'krakow', label: 'Kraków & Małopolska', sub: 'Wawel, Wieliczka, Zakopane', icon: 'location' },
    { id: 'trojmiasto', label: 'Trójmiasto & Pomorze', sub: 'Gdańsk, Sopot, Malbork', icon: 'location' },
    { id: 'wroclaw', label: 'Wrocław & Dolny Śląsk', sub: 'Hala Stulecia, Kopalnia Guido', icon: 'location' },
  ],
  de: [
    { id: 'berlin', label: 'Berlin & Brandenburgia', sub: 'Brama Brandenburska, Mur', icon: 'location' },
    { id: 'bawaria', label: 'Bawaria & Alpy', sub: 'Monachium, Neuschwanstein', icon: 'location' },
    { id: 'rein', label: 'Dolina Renu & Kolonia', sub: 'Kölner Dom, Heidelberg', icon: 'location' },
    { id: 'hamburg', label: 'Hamburg & Północ', sub: 'Hafen, Miniatur Wunderland', icon: 'location' },
  ],
  nl: [
    { id: 'amsterdam', label: 'Amsterdam & okolice', sub: 'Muzea, kanały, parki', icon: 'location' },
    { id: 'rotterdam', label: 'Rotterdam & Haga', sub: 'Architektura, morze, port', icon: 'location' },
    { id: 'veluwe', label: 'Veluwe & natura', sub: 'Lasy, rowery, dzika przyroda', icon: 'leaf' },
    { id: 'limburg', label: 'Limburg & południe', sub: 'Wzgórza, winnice, Maastricht', icon: 'wine' },
  ],
  be: [
    { id: 'brussels', label: 'Bruksela & okolice', sub: 'Grand Place, Atomium, Waterloo', icon: 'location' },
    { id: 'brugge', label: 'Brugia & Flandria', sub: 'Kanały, średniowieczne miasto', icon: 'location' },
    { id: 'antwerp', label: 'Antwerpia & północ', sub: 'Diamenty, sztuka, moda', icon: 'location' },
    { id: 'ardennen', label: 'Ardeny & południe', sub: 'Jaskinie, natura, Bouillon', icon: 'leaf' },
  ],
  fr: [
    { id: 'paris', label: 'Paryż & Île-de-France', sub: 'Wieża Eiffla, Luwr, Wersal', icon: 'location' },
    { id: 'cotedazur', label: 'Lazurowe Wybrzeże', sub: 'Nicea, Cannes, Monaco', icon: 'sunny' },
    { id: 'alsace', label: 'Alzacja & Lotaryngia', sub: 'Strasburg, winnice, kolędy', icon: 'wine' },
    { id: 'normandia', label: 'Normandia & Bretania', sub: 'Mont Saint-Michel, plaże D-Day', icon: 'water' },
  ],
};

const STEPS_BASE = [
  {
    title: 'Kim jesteś?',
    subtitle: 'Dopasujemy trasę i tempo do Ciebie.',
    options: [
      { id: 'family', label: 'Rodzina', sub: 'Atrakcje dla każdego wieku, przerwy, plac zabaw', icon: 'people-outline' },
      { id: 'single', label: 'Singiel', sub: 'Szybkie tempo, kawiarnie, nightlife, muzea', icon: 'person-outline' },
      { id: 'senior', label: 'Senior (60+)', sub: 'Wolniejsze tempo, płaskie trasy, łatwy dostęp', icon: 'accessibility-outline' },
    ],
  },
  {
    title: 'Wybierz kraj',
    subtitle: 'Tadzik działa w 5 krajach Europy.',
    type: 'country',
  },
  {
    title: 'Wybierz region',
    subtitle: 'Gdzie zaczynasz swoją przygodę?',
    type: 'region',
  },
  {
    title: 'Jaki masz budżet?',
    subtitle: 'Pokażemy atrakcje w Twoim zasięgu.',
    options: [
      { id: 'low', label: 'Oszczędny', sub: 'Darmowe parki, wioski, pikniki', icon: 'wallet-outline' },
      { id: 'mid', label: 'Średni', sub: 'Muzea, rejsy, dobra restauracja', icon: 'card-outline' },
      { id: 'high', label: 'Bez limitu', sub: 'Wszystkie atrakcje, premium, noclegi', icon: 'diamond-outline' },
    ],
  },
];

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({ profile: null, country: null, region: null, budget: null });
  const flatListRef = useRef(null);

  const getSteps = () => {
    const steps = [...STEPS_BASE];
    if (selections.country && REGIONS[selections.country]) {
      steps[2] = {
        ...steps[2],
        options: REGIONS[selections.country].map(r => ({ ...r, icon: 'location-outline' })),
      };
    }
    return steps;
  };

  const steps = getSteps();

  const select = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const key = step === 0 ? 'profile' : step === 1 ? 'country' : step === 2 ? 'region' : 'budget';
    setSelections(prev => ({ ...prev, [key]: id }));
  };

  const next = () => {
    if (step < steps.length - 1) {
      flatListRef.current?.scrollToIndex({ index: step + 1, animated: true });
      setStep(step + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete({
        profile: selections.profile,
        country: selections.country,
        region: selections.region,
        budget: selections.budget,
        senior: selections.profile === 'senior',
      });
    }
  };

  const canProceed = step === 0 ? selections.profile : step === 1 ? selections.country : step === 2 ? selections.region : selections.budget;

  const renderStep = ({ item, index }) => {
    const key = index === 0 ? 'profile' : index === 1 ? 'country' : index === 2 ? 'region' : 'budget';
    return (
      <View style={[styles.stepContainer, { width }]}>
        <Text style={styles.stepTitle}>{item.title}</Text>
        <Text style={styles.stepSubtitle}>{item.subtitle}</Text>
        <View style={styles.optionsList}>
          {item.type === 'country' ? (
            COUNTRIES.map(c => {
              const selected = selections.country === c.id;
              return (
                <TouchableOpacity key={c.id} style={[styles.optionCard, selected && styles.optionCardSelected]} onPress={() => select(c.id)} activeOpacity={0.8}>
                  <View style={styles.iconBox}><Text style={styles.flag}>{c.flag}</Text></View>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{c.label}</Text>
                    <Text style={styles.optionSub}>{c.sub}</Text>
                  </View>
                  {selected && <Ionicons name="checkmark-circle" size={22} color="#111" />}
                </TouchableOpacity>
              );
            })
          ) : (
            item.options?.map(opt => {
              const selected = selections[key] === opt.id;
              return (
                <TouchableOpacity key={opt.id} style={[styles.optionCard, selected && styles.optionCardSelected]} onPress={() => select(opt.id)} activeOpacity={0.8}>
                  <View style={styles.iconBox}>
                    <Ionicons name={opt.icon} size={22} color={selected ? '#111' : '#666'} />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{opt.label}</Text>
                    <Text style={styles.optionSub}>{opt.sub}</Text>
                  </View>
                  {selected && <Ionicons name="checkmark-circle" size={22} color="#111" />}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.dots}>
          {steps.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={steps}
        renderItem={renderStep}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.btn, !canProceed && styles.btnDisabled]} onPress={next} disabled={!canProceed} activeOpacity={0.8}>
          <Text style={styles.btnText}>{step === steps.length - 1 ? 'Startuj! 🚀' : 'Dalej'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 16, paddingHorizontal: 24 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd' },
  dotActive: { backgroundColor: '#111' },
  stepContainer: { paddingHorizontal: 24, paddingTop: 32 },
  stepTitle: { fontSize: 24, fontWeight: '600', marginBottom: 6 },
  stepSubtitle: { fontSize: 15, color: '#666', marginBottom: 24, lineHeight: 22 },
  optionsList: { gap: 10 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1.5, borderColor: '#e5e5e5', borderRadius: 12,
    padding: 16, backgroundColor: '#fff',
  },
  optionCardSelected: { borderColor: '#111', backgroundColor: '#f5f5f5' },
  iconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center',
  },
  flag: { fontSize: 24 },
  optionText: { flex: 1 },
  optionLabel: { fontSize: 16, fontWeight: '500', marginBottom: 2 },
  optionLabelSelected: { color: '#111' },
  optionSub: { fontSize: 13, color: '#888' },
  footer: { padding: 24, paddingBottom: 36 },
  btn: { backgroundColor: '#111', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  btnDisabled: { opacity: 0.3 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
