import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Storage } from '../utils/storage';
import { COUNTRIES } from '../data/attractions';
import * as Haptics from 'expo-haptics';

const PROFILE_NAMES = { family: 'Rodzina', single: 'Singiel', senior: 'Senior (60+)' };

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const [data, setData] = useState({ profile: '', country: 'nl', region: '', senior: false, premium: false });
  const [notif9292, setNotif9292] = useState(true);
  const [notifDark, setNotifDark] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const saved = await Storage.getProfile();
    setData(saved);
  };

  const toggleSenior = async (val) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updated = { ...data, senior: val };
    setData(updated);
    await Storage.saveProfile(updated);
  };

  const resetApp = () => {
    Alert.alert(t('resetData'), 'Czy na pewno chcesz wyczyścić wszystkie dane?',
      [{ text: t('cancel'), style: 'cancel' },
       { text: 'Wyczyść', style: 'destructive', onPress: async () => {
         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
         await Storage.clearAll();
         navigation.replace('Onboarding');
       }}]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}><Ionicons name="close" size={24} color="#111" /></TouchableOpacity>
        <Text style={styles.title}>{t('profile')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {!data.premium && (
        <TouchableOpacity style={styles.premiumBanner} onPress={() => navigation.navigate('Premium')}>
          <Ionicons name="diamond" size={24} color="#f59e0b" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.premiumTitle}>Tadzik Premium</Text>
            <Text style={styles.premiumSub}>Pełen dostęp na rok – €25</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
      )}
      {data.premium && (
        <View style={styles.premiumActive}>
          <Ionicons name="star" size={20} color="#f59e0b" />
          <Text style={styles.premiumActiveText}>Premium aktywne</Text>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t('profile')}</Text>
          <Text style={styles.rowValue}>{PROFILE_NAMES[data.profile] || '-'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t('country')}</Text>
          <Text style={styles.rowValue}>{COUNTRIES[data.country]?.flag} {COUNTRIES[data.country]?.name || data.country}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t('region')}</Text>
          <Text style={styles.rowValue}>{data.region || '-'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t('seniorMode')}</Text>
          <Switch value={data.senior} onValueChange={toggleSenior} trackColor={{ false: '#ddd', true: '#111' }} thumbColor="#fff" />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t('notif9292')}</Text>
          <Switch value={notif9292} onValueChange={setNotif9292} trackColor={{ false: '#ddd', true: '#111' }} thumbColor="#fff" />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t('darkReminder')}</Text>
          <Switch value={notifDark} onValueChange={setNotifDark} trackColor={{ false: '#ddd', true: '#111' }} thumbColor="#fff" />
        </View>
      </View>

      <TouchableOpacity style={styles.authBtn} onPress={() => navigation.navigate('Auth')}>
        <Ionicons name="log-in-outline" size={20} color="#111" />
        <Text style={styles.authText}>{t('login')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetBtn} onPress={resetApp}>
        <Text style={styles.resetText}>{t('resetData')}</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Tadzik v1.2.0 • 5 krajów • 6 języków</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  closeBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '600' },
  premiumBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef3c7', borderRadius: 12, padding: 16, marginBottom: 16 },
  premiumTitle: { fontSize: 15, fontWeight: '600' },
  premiumSub: { fontSize: 13, color: '#666', marginTop: 2 },
  premiumActive: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f0fdf4', borderRadius: 12, padding: 12, marginBottom: 16 },
  premiumActiveText: { fontSize: 14, fontWeight: '500', color: '#15803d' },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, marginBottom: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rowLabel: { fontSize: 15 },
  rowValue: { fontSize: 15, color: '#666' },
  authBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#111', paddingVertical: 14, borderRadius: 12, marginBottom: 12 },
  authText: { fontSize: 15, fontWeight: '500' },
  resetBtn: { paddingVertical: 14, alignItems: 'center' },
  resetText: { color: '#dc2626', fontSize: 15 },
  version: { textAlign: 'center', color: '#bbb', fontSize: 12, marginTop: 24 },
});
