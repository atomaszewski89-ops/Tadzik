import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { STAMPS } from '../data/stamps';
import { Storage } from '../utils/storage';
import * as Haptics from 'expo-haptics';

export default function StampsScreen() {
  const { t } = useTranslation();
  const [stamps, setStamps] = useState(STAMPS);

  useEffect(() => { loadStamps(); }, []);

  const loadStamps = async () => {
    const saved = await Storage.getStamps();
    if (saved) setStamps(saved);
    else await Storage.saveStamps(STAMPS);
  };

  const earnStamp = async (id) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updated = stamps.map(s => s.id === id ? { ...s, earned: true } : s);
    setStamps(updated);
    await Storage.saveStamps(updated);
  };

  const earnedCount = stamps.filter(s => s.earned).length;
  const progress = (earnedCount / stamps.length) * 100;
  const nextStamp = stamps.find(s => !s.earned);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <Text style={styles.title}>{t('stamps')}</Text>
      <View style={styles.progressBox}>
        <View style={styles.barBg}><View style={[styles.barFill, { width: `${progress}%` }]} /></View>
        <Text style={styles.progressLabel}>{earnedCount} {t('earned')} / {stamps.length}</Text>
      </View>
      <View style={styles.grid}>
        {stamps.map(s => (
          <TouchableOpacity key={s.id} style={[styles.stampCell, s.earned && styles.stampEarned]}
            onPress={() => !s.earned && earnStamp(s.id)} disabled={s.earned} activeOpacity={0.7}>
            <Ionicons name="document-text" size={20} color={s.earned ? '#15803d' : '#ccc'} />
            <Text style={[styles.stampName, s.earned && styles.stampNameEarned]}>{s.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.subTitle}>{t('nextStamp')}</Text>
      {nextStamp ? (
        <View style={styles.nextCard}>
          <Text style={styles.nextTitle}>{nextStamp.name}</Text>
          <Text style={styles.nextDesc}>Odwiedź to miasto, aby zdobyć stempel!</Text>
          <View style={styles.nextTag}><Text style={styles.nextTagText}>Nagroda: odznaka regionalna</Text></View>
        </View>
      ) : (
        <Text style={styles.allDone}>🎉 Zdobyłeś wszystkie stempelki!</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  progressBox: { marginBottom: 20 },
  barBg: { height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#111', borderRadius: 4 },
  progressLabel: { fontSize: 13, color: '#666', marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stampCell: { width: '22%', aspectRatio: 1, borderWidth: 1.5, borderColor: '#ddd', borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: 4 },
  stampEarned: { borderStyle: 'solid', borderColor: '#22c55e', backgroundColor: '#f0fdf4' },
  stampName: { fontSize: 11, color: '#aaa', marginTop: 4, textAlign: 'center' },
  stampNameEarned: { color: '#111' },
  subTitle: { fontSize: 15, fontWeight: '600', marginTop: 24, marginBottom: 10 },
  nextCard: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 16, backgroundColor: '#fff' },
  nextTitle: { fontSize: 15, fontWeight: '500' },
  nextDesc: { fontSize: 13, color: '#666', marginTop: 4 },
  nextTag: { alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6, backgroundColor: '#f0f0f0' },
  nextTagText: { fontSize: 11, color: '#666' },
  allDone: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 20 },
});
