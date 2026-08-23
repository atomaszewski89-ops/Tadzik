import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ATTRACTIONS, CATEGORIES, COUNTRIES } from '../data/attractions';
import { Storage } from '../utils/storage';
import * as Haptics from 'expo-haptics';

export default function ExploreScreen({ route, navigation }) {
  const { country = 'nl' } = route.params || {};
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Wszystko');

  const filtered = ATTRACTIONS.filter(a => {
    const matchesCountry = !country || a.country === country;
    const matchesQuery = !query || a.name.toLowerCase().includes(query.toLowerCase()) || a.city.toLowerCase().includes(query.toLowerCase());
    const matchesCat = filter === 'Wszystko' || (filter === 'Darmowe' ? a.price === '€0' : a.cat === filter);
    return matchesCountry && matchesQuery && matchesCat;
  });

  const addToPlan = async (attraction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const plan = (await Storage.getPlan()) || [];
    const newItem = {
      time: '12:00', title: attraction.name,
      desc: `${attraction.city} • ${attraction.cat}`,
      tag: attraction.price, tagType: 'money', done: false
    };
    const updated = [...plan, newItem];
    await Storage.savePlan(updated);
  };

  const c = COUNTRIES[country] || COUNTRIES.nl;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Odkrywaj {c.flag}</Text>
        <Text style={styles.subtitle}>{c.name} • Znajdź najpiękniejsze miejsca</Text>
        
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="rgba(255,255,255,0.4)" />
          <TextInput
            style={styles.input}
            placeholder="Szukaj miasta lub atrakcji..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat} style={[styles.chip, filter === cat && styles.chipActive]} onPress={() => setFilter(cat)}>
              <Text style={[styles.chipText, filter === cat && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {filtered.map(a => (
          <View key={a.id} style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name="compass-outline" size={24} color="#6366f1" />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{a.name}</Text>
              <Text style={styles.meta}>{a.city} • {a.cat}</Text>
              <Text style={styles.details}>{a.price} • {a.flat ? 'Płaski teren' : 'Wymagające'} • {a.light ? 'Oświetlone' : 'Dzienne'}</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => addToPlan(a)}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
        {filtered.length === 0 && (
          <Text style={styles.empty}>Brak wyników wyszukiwania</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#1a1a2e' },
  title: { fontSize: 24, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4, marginBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, gap: 10 },
  input: { flex: 1, fontSize: 15, color: '#fff' },
  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)' },
  chipActive: { backgroundColor: '#6366f1' },
  chipText: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(26,26,46,0.6)', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(99,102,241,0.15)', alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: '#fff' },
  meta: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  details: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: 40, fontSize: 14 },
});
