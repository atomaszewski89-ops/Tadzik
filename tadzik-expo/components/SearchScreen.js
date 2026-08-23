import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ATTRACTIONS, CATEGORIES, COUNTRIES } from '../data/attractions';
import { Storage } from '../utils/storage';
import * as Haptics from 'expo-haptics';

export default function SearchScreen({ route }) {
  const { t } = useTranslation();
  const { country } = route.params || {};
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Wszystko');
  const [plan, setPlan] = useState([]);

  useEffect(() => {
    Storage.getPlan().then(p => { if (p) setPlan(p); });
  }, []);

  const filtered = ATTRACTIONS.filter(a => {
    const matchesCountry = !country || a.country === country;
    const matchesQuery = !query || a.name.toLowerCase().includes(query.toLowerCase()) || a.city.toLowerCase().includes(query.toLowerCase());
    const matchesCat = filter === 'Wszystko' || (filter === 'Darmowe' ? a.price === '€0' : a.cat === filter);
    return matchesCountry && matchesQuery && matchesCat;
  });

  const addToPlan = async (attraction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newItem = {
      time: '--:--', title: attraction.name,
      desc: `${attraction.city} • ${attraction.cat}`,
      tag: attraction.price, tagType: 'money', done: false
    };
    const updated = [...plan, newItem];
    setPlan(updated);
    await Storage.savePlan(updated);
  };

  const c = COUNTRIES[country] || COUNTRIES.nl;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{c.flag} {t('search')}</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput style={styles.input} placeholder={t('searchPlaceholder')} value={query} onChangeText={setQuery} placeholderTextColor="#999" />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}><Ionicons name="close-circle" size={18} color="#999" /></TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat} style={[styles.chip, filter === cat && styles.chipActive]} onPress={() => setFilter(cat)}>
              <Text style={[styles.chipText, filter === cat && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.resultsCount}>{filtered.length} {t('results')}</Text>

        {filtered.map(a => (
          <View key={a.id} style={styles.resultCard}>
            <View style={styles.imgPlaceholder}><Ionicons name="image" size={20} color="#bbb" /></View>
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{a.name}</Text>
              <Text style={styles.resultMeta}>{a.city} • {a.cat}</Text>
              <Text style={styles.resultDetails}>{a.price} • {a.flat ? t('flat') : 'Wymagające'} • {a.light ? t('lit') : 'Dzienne'}</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => addToPlan(a)}>
              <Ionicons name="add" size={20} color="#111" />
            </TouchableOpacity>
          </View>
        ))}

        {filtered.length === 0 && <Text style={styles.empty}>{t('noResults')}</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#fff' },
  input: { flex: 1, fontSize: 15 },
  chipsRow: { flexDirection: 'row', gap: 8, marginVertical: 14 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { fontSize: 13, color: '#555' },
  chipTextActive: { color: '#fff' },
  resultsCount: { fontSize: 13, color: '#888', marginBottom: 10 },
  resultCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 14, marginBottom: 10, backgroundColor: '#fff' },
  imgPlaceholder: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 15, fontWeight: '500' },
  resultMeta: { fontSize: 13, color: '#666', marginTop: 2 },
  resultDetails: { fontSize: 12, color: '#999', marginTop: 4 },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 14 },
});
