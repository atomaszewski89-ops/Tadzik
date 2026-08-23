import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const POSTS = [
  { id: '1', author: 'Marek T.', avatar: '🧑‍🌾', time: '2 godz. temu', place: 'Keukenhof, Holandia', content: 'Tulipany w pełnym rozkwicie! Warto przyjechać rano przed tłumami.', likes: 24, comments: 5 },
  { id: '2', author: 'Anna W.', avatar: '👩‍🎨', time: '5 godz. temu', place: 'Brama Brandenburska, Berlin', content: 'Nocne oświetlenie robi niesamowite wrażenie. Polecam spacer wzdłuż Unter den Linden.', likes: 42, comments: 8 },
  { id: '3', author: 'Piotr K.', avatar: '🚴‍♂️', time: '1 dzień temu', place: 'Trasa rowerowa Kinderdijk', content: 'Świetna płaska trasa z widokiem na historyczne wiatraki. 15 km czystej przyjemności!', likes: 56, comments: 12 },
];

export default function CommunityScreen() {
  const [posts, setPosts] = useState(POSTS);

  const toggleLike = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked } : p));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Społeczność Tadzika 🌍</Text>
        <Text style={styles.subtitle}>Poznaj relacje i rekomendacje innych podróżników</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {posts.map(p => (
          <View key={p.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.avatar}>{p.avatar}</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.author}>{p.author}</Text>
                <Text style={styles.time}>{p.time} • {p.place}</Text>
              </View>
            </View>

            <Text style={styles.content}>{p.content}</Text>

            <View style={styles.cardFooter}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => toggleLike(p.id)}>
                <Ionicons name={p.liked ? 'heart' : 'heart-outline'} size={20} color={p.liked ? '#ef4444' : 'rgba(255,255,255,0.5)'} />
                <Text style={[styles.actionText, p.liked && { color: '#ef4444' }]}>{p.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="chatbubble-outline" size={18} color="rgba(255,255,255,0.5)" />
                <Text style={styles.actionText}>{p.comments}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#1a1a2e' },
  title: { fontSize: 24, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  card: { backgroundColor: 'rgba(26,26,46,0.6)', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { fontSize: 28 },
  author: { fontSize: 15, fontWeight: '600', color: '#fff' },
  time: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  content: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 20, marginBottom: 14 },
  cardFooter: { flexDirection: 'row', gap: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
});
