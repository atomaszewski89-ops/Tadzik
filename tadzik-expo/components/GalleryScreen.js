import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Storage } from '../utils/storage';

export default function GalleryScreen() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    Storage.getGallery().then(saved => { if (saved) setPhotos(saved); });
  }, []);

  const takePhoto = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      Alert.alert('Brak uprawnień', 'Potrzebny jest dostęp do aparatu.');
      return;
    }

    let locationTag = 'Holandia';
    try {
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      if (locStatus === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        locationTag = `${loc.coords.latitude.toFixed(2)}, ${loc.coords.longitude.toFixed(2)}`;
      }
    } catch (e) {
      console.log('Loc error', e);
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      const newPhoto = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        tag: locationTag,
        date: new Date().toLocaleDateString(),
      };
      const updated = [newPhoto, ...photos];
      setPhotos(updated);
      await Storage.saveGallery(updated);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <Text style={styles.title}>Galeria Wspomnień</Text>
      <Text style={styles.sub}>Rób zdjęcia z geotagami podczas swoich wycieczek!</Text>

      <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto}>
        <Ionicons name="camera" size={20} color="#fff" />
        <Text style={styles.cameraBtnText}>Zrób zdjęcie</Text>
      </TouchableOpacity>

      <View style={styles.grid}>
        {photos.map(p => (
          <View key={p.id} style={styles.photoCard}>
            <Image source={{ uri: p.uri }} style={styles.photoImg} />
            <Text style={styles.photoTag}>{p.tag}</Text>
            <Text style={styles.photoDate}>{p.date}</Text>
          </View>
        ))}
      </View>

      {photos.length === 0 && (
        <Text style={styles.empty}>Brak zdjęć w galerii. Zrób swoje pierwsze zdjęcie z podróży!</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600' },
  sub: { fontSize: 13, color: '#666', marginTop: 4, marginBottom: 16 },
  cameraBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#111', paddingVertical: 14, borderRadius: 12, marginBottom: 20 },
  cameraBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  photoCard: { width: '48%', borderWidth: 1, borderColor: '#eee', borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff' },
  photoImg: { width: '100%', height: 120 },
  photoTag: { fontSize: 11, fontWeight: '600', paddingHorizontal: 8, paddingTop: 6, color: '#333' },
  photoDate: { fontSize: 10, color: '#888', paddingHorizontal: 8, paddingBottom: 8 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 14 },
});
