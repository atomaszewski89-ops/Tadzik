import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Storage } from '../utils/storage';
import * as Haptics from 'expo-haptics';

export default function AddPlaceScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [time, setTime] = useState('14:00');
  const [tag, setTag] = useState('Atrakcja');

  const savePlace = async () => {
    if (!title.trim()) {
      Alert.alert('Błąd', 'Wpisz nazwę miejsca.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const plan = (await Storage.getPlan()) || [];
    const newItem = {
      time: time || '12:00',
      title: title.trim(),
      desc: city ? `${city} • ${tag}` : tag,
      tag: tag,
      tagType: '',
      done: false,
    };
    await Storage.savePlan([...plan, newItem]);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Dodaj nowe miejsce 📍</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.label}>Nazwa miejsca / atrakcji</Text>
      <TextInput
        style={styles.input}
        placeholder="np. Zamek w Malborku"
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Miasto / Miejscowość</Text>
      <TextInput
        style={styles.input}
        placeholder="np. Malbork"
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={city}
        onChangeText={setCity}
      />

      <Text style={styles.label}>Planowana godzina</Text>
      <TextInput
        style={styles.input}
        placeholder="14:00"
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={time}
        onChangeText={setTime}
      />

      <Text style={styles.label}>Kategoria / Tag</Text>
      <View style={styles.tagRow}>
        {['Muzeum', 'Park', 'Zabytek', 'Jedzenie', 'UNESCO'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tagChip, tag === t && styles.tagChipActive]}
            onPress={() => setTag(t)}
          >
            <Text style={[styles.tagText, tag === t && styles.tagTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={savePlace}>
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.saveBtnText}>Dodaj do planu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, marginBottom: 24 },
  closeBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '600', color: '#fff' },
  label: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginTop: 16, marginBottom: 8 },
  input: { backgroundColor: 'rgba(26,26,46,0.6)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#fff', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  tagChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)' },
  tagChipActive: { backgroundColor: '#6366f1' },
  tagText: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  tagTextActive: { color: '#fff', fontWeight: '600' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#6366f1', paddingVertical: 16, borderRadius: 14, marginTop: 32 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
