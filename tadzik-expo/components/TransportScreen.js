import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const PLANNERS = {
  pl: 'https://jakdojade.pl',
  de: 'https://bahn.de',
  nl: 'https://9292.nl',
  be: 'https://nmbs.be',
  fr: 'https://sncf-connect.com',
};

const STATIONS = {
  pl: ['Warszawa Centralna', 'Kraków Główny', 'Gdańsk Główny', 'Wrocław Główny', 'Katowice'],
  de: ['Berlin Hbf', 'München Hbf', 'Hamburg Hbf', 'Köln Hbf', 'Frankfurt Hbf'],
  nl: ['Amsterdam Centraal', 'Rotterdam Centraal', 'Den Haag Centraal', 'Utrecht Centraal', 'Maastricht'],
  be: ['Brussels Central', 'Brugge', 'Antwerpen Central', 'Gent St. Pieters', 'Liège'],
  fr: ['Paris Gare du Nord', 'Lyon Part-Dieu', 'Nice Ville', 'Strasbourg', 'Marseille'],
};

export default function TransportScreen({ route }) {
  const { country = 'nl' } = route.params || {};
  const stations = STATIONS[country] || STATIONS.nl;
  const planner = PLANNERS[country] || PLANNERS.nl;

  const [from, setFrom] = useState(stations[0]);
  const [to, setTo] = useState(stations[1]);

  const openPlanner = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const url = `${planner}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
      else Alert.alert('Błąd', 'Nie można otworzyć plannera');
    });
  };

  const quickRoutes = [
    { from: stations[0], to: stations[2], label: `${stations[0]} → ${stations[2]}` },
    { from: stations[1], to: stations[3], label: `${stations[1]} → ${stations[3]}` },
    { from: stations[0], to: stations[1], label: `${stations[0]} → ${stations[1]}` },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <Text style={styles.title}>Transport</Text>
      <Text style={styles.subtitle}>Znajdź połączenie w wybranym kraju</Text>

      <View style={styles.inputBox}>
        <View style={styles.inputRow}>
          <Ionicons name="location-outline" size={18} color="#666" />
          <TextInput style={styles.input} value={from} onChangeText={setFrom} placeholder="Z (stacja)" />
        </View>
        <View style={styles.divider} />
        <View style={styles.inputRow}>
          <Ionicons name="navigate-outline" size={18} color="#666" />
          <TextInput style={styles.input} value={to} onChangeText={setTo} placeholder="Do (stacja)" />
        </View>
      </View>

      <TouchableOpacity style={styles.findBtn} onPress={openPlanner}>
        <Ionicons name="search" size={18} color="#fff" />
        <Text style={styles.findBtnText}>Znajdź połączenie</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Szybkie trasy</Text>
      {quickRoutes.map((r, i) => (
        <TouchableOpacity key={i} style={styles.routeCard} onPress={() => { setFrom(r.from); setTo(r.to); openPlanner(); }}>
          <View><Text style={styles.routeLabel}>{r.label}</Text></View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
      ))}

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={18} color="#666" />
        <Text style={styles.infoText}>W zależności od kraju otwieramy: jakdojade.pl (PL), bahn.de (DE), 9292.nl (NL), nmbs.be (BE), sncf-connect.com (FR).</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  inputBox: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, backgroundColor: '#fff', marginBottom: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  input: { flex: 1, fontSize: 15 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 14 },
  findBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#111', paddingVertical: 14, borderRadius: 12, marginBottom: 24 },
  findBtnText: { color: '#fff', fontSize: 15, fontWeight: '500' },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginBottom: 10 },
  routeCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 14, marginBottom: 10, backgroundColor: '#fff' },
  routeLabel: { fontSize: 14, fontWeight: '500' },
  infoBox: { flexDirection: 'row', gap: 10, backgroundColor: '#f8f8f8', borderRadius: 10, padding: 14, marginTop: 10 },
  infoText: { flex: 1, fontSize: 13, color: '#666', lineHeight: 18 },
});
