import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { ATTRACTIONS, COUNTRIES } from '../data/attractions';

const INITIAL_REGIONS = {
  pl: { latitude: 52.2297, longitude: 21.0122, latitudeDelta: 3.5, longitudeDelta: 3.5 },
  de: { latitude: 51.1657, longitude: 10.4515, latitudeDelta: 4.5, longitudeDelta: 4.5 },
  nl: { latitude: 52.1326, longitude: 5.2913, latitudeDelta: 1.8, longitudeDelta: 1.8 },
  be: { latitude: 50.5039, longitude: 4.4699, latitudeDelta: 1.5, longitudeDelta: 1.5 },
  fr: { latitude: 46.2276, longitude: 2.2137, latitudeDelta: 5.5, longitudeDelta: 5.5 },
};

export default function MapScreen({ route }) {
  const { country = 'nl' } = route.params || {};
  const [selected, setSelected] = useState(null);

  const initialRegion = INITIAL_REGIONS[country] || INITIAL_REGIONS.nl;
  const filteredAttractions = ATTRACTIONS.filter(a => a.country === country);
  const c = COUNTRIES[country] || COUNTRIES.nl;

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {filteredAttractions.map(a => (
          <Marker
            key={a.id}
            coordinate={{ latitude: a.coords.lat, longitude: a.coords.lng }}
            title={a.name}
            description={`${a.city} • ${a.price}`}
            onPress={() => setSelected(a)}
          />
        ))}
      </MapView>

      <View style={styles.headerBadge}>
        <Text style={styles.badgeText}>{c.flag} {c.name} ({filteredAttractions.length})</Text>
      </View>

      {selected && (
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeCard} onPress={() => setSelected(null)}>
            <Ionicons name="close" size={18} color="#111" />
          </TouchableOpacity>
          <Text style={styles.cardTitle}>{selected.name}</Text>
          <Text style={styles.cardSub}>{selected.city} • {selected.cat}</Text>
          <Text style={styles.cardPrice}>Cena: {selected.price}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: '100%', height: '100%' },
  headerBadge: { position: 'absolute', top: 50, left: 16, backgroundColor: '#111', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  card: { position: 'absolute', bottom: 30, left: 16, right: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#eee', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  closeCard: { alignSelf: 'flex-end' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSub: { fontSize: 13, color: '#666', marginTop: 2 },
  cardPrice: { fontSize: 13, fontWeight: '500', color: '#111', marginTop: 8 },
});
