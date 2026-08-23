import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { Storage } from '../utils/storage';
import { COUNTRIES } from '../data/attractions';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_TwojKluczPublicznyStripe';
const BACKEND_URL = 'https://twoj-backend.com/create-payment-intent';

const PAYMENT_LABELS = {
  pl: 'BLIK, Visa, Mastercard, Maestro, P24',
  de: 'SOFORT, Klarna, Visa, Mastercard, Maestro, EPS',
  nl: 'iDEAL, Bancontact, Visa, Mastercard, Maestro',
  be: 'Bancontact, iDEAL, Visa, Mastercard, Maestro',
  fr: 'Cartes Bancaires, Visa, Mastercard, Maestro',
};

function PremiumContent({ navigation }) {
  const { t } = useTranslation();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [premium, setPremium] = useState(false);
  const [country, setCountry] = useState('nl');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const saved = await Storage.getProfile();
    setPremium(saved.premium === true);
    setCountry(saved.country || 'nl');
  };

  const fetchPaymentIntentClientSecret = async () => {
    // WERSJA PRODUKCYJNA:
    /*
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 2500,
        currency: 'eur',
        country,
      }),
    });
    const { clientSecret } = await response.json();
    return clientSecret;
    */
    return new Promise((resolve) => {
      setTimeout(() => resolve('pi_demo_secret_123'), 1500);
    });
  };

  const openPayment = async () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const clientSecret = await fetchPaymentIntentClientSecret();
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Tadzik Tourist Planner',
        returnURL: 'tadzik://payment',
        style: 'alwaysLight',
        defaultBillingDetails: { name: 'Tadzik User' },
        allowsDelayedPaymentMethods: true,
      });
      if (initError) { Alert.alert('Błąd', initError.message); setLoading(false); return; }
      setLoading(false);
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        if (presentError.code === 'Canceled') return;
        Alert.alert('Płatność nieudana', presentError.message);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await Storage.saveProfile({ ...(await Storage.getProfile()), premium: true });
        setPremium(true);
        Alert.alert('Premium aktywowane! 🎉', 'Masz pełen dostęp na cały rok. Dziękujemy!',
          [{ text: 'Super!', onPress: () => navigation.goBack() }]);
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Błąd', 'Nie udało się połączyć z systemem płatności.');
    }
  };

  const benefits = [
    { icon: 'compass', title: 'Pełny asystent Tadzika', desc: 'Budżet, transport, przypomnienia' },
    { icon: 'bicycle', title: 'Trasy rowerowe', desc: 'Płaskie, bezpieczne ścieżki' },
    { icon: 'document-text', title: 'Stempelki paszportowe', desc: 'Zbieraj z 5 krajów Europy' },
    { icon: 'images', title: 'Galeria bez limitu', desc: 'Zdjęcia z geotagami' },
    { icon: 'map', title: 'Mapa offline', desc: 'Dostęp bez internetu' },
    { icon: 'cloud-upload', title: 'Backup w chmurze', desc: 'Plany i stempelki bezpieczne' },
  ];

  if (premium) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <View style={styles.premiumBadge}>
          <Ionicons name="star" size={32} color="#f59e0b" />
          <Text style={styles.premiumTitle}>Premium aktywne!</Text>
          <Text style={styles.premiumSub}>Twój planer działa na pełnych obrotach. Dziękujemy za wsparcie!</Text>
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Wróć do aplikacji</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={24} color="#111" />
      </TouchableOpacity>

      <View style={styles.hero}>
        <Ionicons name="diamond" size={40} color="#111" />
        <Text style={styles.heroTitle}>Tadzik Premium</Text>
        <Text style={styles.heroSub}>Pełen dostęp na cały rok • 5 krajów</Text>
        <View style={styles.priceBox}>
          <Text style={styles.price}>€25</Text>
          <Text style={styles.priceSub}>/ rok (jednorazowo)</Text>
        </View>
      </View>

      <View style={styles.countryBox}>
        <Text style={styles.countryLabel}>Kraj rozliczeniowy:</Text>
        <Text style={styles.countryValue}>{COUNTRIES[country]?.flag} {COUNTRIES[country]?.name || country.toUpperCase()}</Text>
        <Text style={styles.methodsText}>Dostępne metody: {PAYMENT_LABELS[country] || 'Karta'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Co zyskujesz?</Text>
      {benefits.map((b, i) => (
        <View key={i} style={styles.benefitRow}>
          <View style={styles.benefitIcon}><Ionicons name={b.icon} size={20} color="#111" /></View>
          <View style={styles.benefitText}>
            <Text style={styles.benefitTitle}>{b.title}</Text>
            <Text style={styles.benefitDesc}>{b.desc}</Text>
          </View>
        </View>
      ))}

      <View style={styles.guarantee}>
        <Ionicons name="shield-checkmark" size={18} color="#666" />
        <Text style={styles.guaranteeText}>Gwarancja 100% satysfakcji. Płatność przez Stripe – szyfrowana SSL 256-bit. Akceptujemy: Visa, Mastercard, Maestro, BLIK, SOFORT, iDEAL, Bancontact, Cartes Bancaires, P24, EPS, Klarna.</Text>
      </View>

      <TouchableOpacity style={styles.payBtn} onPress={openPayment} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : (
          <><Ionicons name="card" size={18} color="#fff" /><Text style={styles.payBtnText}>Kup Premium – €25/rok</Text></>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.restoreBtn} onPress={() => Alert.alert('Przywracanie', 'W produkcyjnej wersji przywrócisz zakup przez App Store / Google Play.')}>
        <Text style={styles.restoreText}>Przywróć zakup</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={18} color="#888" />
        <Text style={styles.infoText}>Wstaw swój klucz Stripe pk_live_... w PremiumScreen.js oraz URL backendu Firebase Functions. Backend obsługuje BLIK (PL), SOFORT (DE), iDEAL (NL), Bancontact (BE), Cartes Bancaires (FR) oraz karty Visa/Mastercard/Maestro.</Text>
      </View>
    </ScrollView>
  );
}

export default function PremiumScreen({ navigation }) {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY} urlScheme="tadzik">
      <PremiumContent navigation={navigation} />
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  closeBtn: { alignSelf: 'flex-end', padding: 4 },
  hero: { alignItems: 'center', marginTop: 8, marginBottom: 24 },
  heroTitle: { fontSize: 24, fontWeight: '600', marginTop: 12 },
  heroSub: { fontSize: 15, color: '#666', marginTop: 4 },
  priceBox: { flexDirection: 'row', alignItems: 'baseline', marginTop: 12, gap: 6 },
  price: { fontSize: 36, fontWeight: '700' },
  priceSub: { fontSize: 14, color: '#888' },
  countryBox: { backgroundColor: '#f8f8f8', borderRadius: 12, padding: 14, marginBottom: 20 },
  countryLabel: { fontSize: 13, color: '#888' },
  countryValue: { fontSize: 16, fontWeight: '500', marginTop: 4 },
  methodsText: { fontSize: 12, color: '#666', marginTop: 6 },
  sectionTitle: { fontSize: 17, fontWeight: '600', marginBottom: 14 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  benefitIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  benefitText: { flex: 1 },
  benefitTitle: { fontSize: 15, fontWeight: '500' },
  benefitDesc: { fontSize: 13, color: '#888', marginTop: 1 },
  guarantee: { flexDirection: 'row', gap: 10, backgroundColor: '#f8f8f8', borderRadius: 10, padding: 14, marginTop: 8, marginBottom: 20 },
  guaranteeText: { flex: 1, fontSize: 12, color: '#666', lineHeight: 18 },
  payBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#111', paddingVertical: 16, borderRadius: 12 },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  restoreBtn: { marginTop: 16, alignItems: 'center' },
  restoreText: { fontSize: 14, color: '#666' },
  infoBox: { flexDirection: 'row', gap: 10, backgroundColor: '#fafafa', borderRadius: 10, padding: 14, marginTop: 24 },
  infoText: { flex: 1, fontSize: 11, color: '#aaa', lineHeight: 16 },
  premiumBadge: { alignItems: 'center', marginTop: 40, marginBottom: 24 },
  premiumTitle: { fontSize: 22, fontWeight: '600', marginTop: 12 },
  premiumSub: { fontSize: 14, color: '#666', marginTop: 4, textAlign: 'center' },
  backBtn: { backgroundColor: '#111', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  backText: { color: '#fff', fontSize: 15, fontWeight: '500' },
});
