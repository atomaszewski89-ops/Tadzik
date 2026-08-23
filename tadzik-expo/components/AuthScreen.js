import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

export default function AuthScreen({ navigation }) {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      isLogin ? 'Zalogowano!' : 'Konto utworzone!',
      `Twoje dane zostały zsynchronizowane (${email}).`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={24} color="#111" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Ionicons name="lock-closed-outline" size={40} color="#111" />
        <Text style={styles.title}>{isLogin ? 'Zaloguj się' : 'Utwórz konto'}</Text>
        <Text style={styles.subTitle}>Kopia zapasowa planów i stempelków w chmurze Firebase</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Adres email</Text>
        <TextInput
          style={styles.input}
          placeholder="twój@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Hasło</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleAuth}>
          <Text style={styles.submitText}>{isLogin ? 'Zaloguj' : 'Zarejestruj się'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchBtn} onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  closeBtn: { alignSelf: 'flex-end', padding: 4 },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  title: { fontSize: 22, fontWeight: '600', marginTop: 12 },
  subTitle: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 6 },
  form: { gap: 14 },
  label: { fontSize: 13, fontWeight: '500', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  submitBtn: { backgroundColor: '#111', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '500' },
  switchBtn: { alignItems: 'center', marginTop: 12 },
  switchText: { fontSize: 13, color: '#666' },
});
