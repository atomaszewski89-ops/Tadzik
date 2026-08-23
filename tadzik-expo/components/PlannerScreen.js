import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Storage } from '../utils/storage';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false }),
});

export default function PlannerScreen() {
  const { t } = useTranslation();
  const [plan, setPlan] = useState([]);

  useEffect(() => { loadPlan(); requestNotifPerms(); }, []);

  const requestNotifPerms = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') Alert.alert('Powiadomienia', 'Włącz powiadomienia, aby Tadzik przypominał o 9292 i zmroku.');
  };

  const loadPlan = async () => {
    const saved = await Storage.getPlan();
    if (saved) setPlan(saved);
  };

  const toggleDone = async (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updated = plan.map((item, i) => i === index ? { ...item, done: !item.done } : item);
    setPlan(updated);
    await Storage.savePlan(updated);
  };

  const removeItem = async (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const updated = plan.filter((_, i) => i !== index);
    setPlan(updated);
    await Storage.savePlan(updated);
  };

  const saveAndRemind = async () => {
    await Storage.savePlan(plan);
    const returnItem = plan.find(p => p.title.includes('9292') || p.title.includes('Powrót'));
    if (returnItem) {
      const [hour, minute] = returnItem.time.split(':').map(Number);
      const trigger = new Date();
      trigger.setHours(hour, minute - 15, 0);
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Tadzik 🚲', body: `Za 15 min odjazd: ${returnItem.desc}` },
        trigger,
      });
    }
    Alert.alert(t('save'), t('planSaved'));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <Text style={styles.title}>{t('plan')}</Text>
      <View style={styles.timeline}>
        {plan.map((item, i) => (
          <View key={i} style={styles.timelineItem}>
            <View style={[styles.dot, item.done && styles.dotDone]} />
            <View style={styles.line} />
            <View style={styles.card}>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
              {item.tag ? (
                <View style={[styles.tag, item.tagType === 'bike' ? styles.tagBike : item.tagType === 'money' ? styles.tagMoney : styles.tagDefault]}>
                  <Text style={styles.tagText}>{item.tag}</Text>
                </View>
              ) : null}
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => toggleDone(i)}>
                  <Text style={styles.actionText}>{item.done ? 'Cofnij' : t('done') + ' ✓'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => removeItem(i)}>
                  <Text style={styles.actionText}>{t('remove')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.saveBtn} onPress={saveAndRemind}>
        <Text style={styles.saveBtnText}>{t('savePlan')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  timeline: { paddingLeft: 8 },
  timelineItem: { flexDirection: 'row', marginBottom: 16 },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#111', backgroundColor: '#fff', marginTop: 4, marginRight: 12 },
  dotDone: { backgroundColor: '#111' },
  line: { position: 'absolute', left: 5, top: 20, bottom: -16, width: 2, backgroundColor: '#eee' },
  card: { flex: 1, borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 14, backgroundColor: '#fff' },
  time: { fontSize: 12, color: '#999', marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: '500' },
  cardDesc: { fontSize: 13, color: '#666', marginTop: 2 },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 8 },
  tagBike: { backgroundColor: '#e0f2fe' },
  tagMoney: { backgroundColor: '#fef3c7' },
  tagDefault: { backgroundColor: '#f0fdf4' },
  tagText: { fontSize: 11, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#f5f5f5' },
  actionText: { fontSize: 12, color: '#555' },
  saveBtn: { backgroundColor: '#111', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '500' },
});
