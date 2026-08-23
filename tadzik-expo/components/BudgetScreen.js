import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Storage } from '../utils/storage';
import * as Haptics from 'expo-haptics';

const CATS = ['Jedzenie', 'Transport', 'Bilety', 'Inne'];

export default function BudgetScreen() {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState('');
  const [val, setVal] = useState('');
  const [cat, setCat] = useState('Jedzenie');

  useEffect(() => { loadExpenses(); }, []);

  const loadExpenses = async () => {
    const saved = await Storage.getExpenses();
    setExpenses(saved);
  };

  const addExpense = async () => {
    const amount = parseFloat(val);
    if (!name.trim() || !amount || amount <= 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updated = [...expenses, { name: name.trim(), val: amount, cat, id: Date.now() }];
    setExpenses(updated);
    await Storage.saveExpenses(updated);
    setName(''); setVal('');
  };

  const total = expenses.reduce((a, b) => a + b.val, 0);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{t('budget')}</Text>
        <View style={styles.totalBox}>
          <Text style={styles.totalAmount}>€{total.toFixed(2)}</Text>
          <Text style={styles.totalLabel}>{t('today')}</Text>
        </View>
        <View style={styles.inputRow}>
          <TextInput style={[styles.input, { flex: 2 }]} placeholder={t('expenseName')} value={name} onChangeText={setName} placeholderTextColor="#999" />
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="€" keyboardType="decimal-pad" value={val} onChangeText={setVal} placeholderTextColor="#999" />
        </View>
        <View style={styles.catRow}>
          {CATS.map(c => (
            <TouchableOpacity key={c} style={[styles.catChip, cat === c && styles.catChipActive]} onPress={() => setCat(c)}>
              <Text style={[styles.catText, cat === c && styles.catTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={addExpense}>
          <Text style={styles.addBtnText}>{t('addExpense')}</Text>
        </TouchableOpacity>
        <Text style={styles.subTitle}>Historia</Text>
        {expenses.slice().reverse().map(e => (
          <View key={e.id} style={styles.expenseRow}>
            <View style={styles.expenseLeft}>
              <Text style={styles.expenseName}>{e.name}</Text>
              <View style={styles.expenseTag}><Text style={styles.expenseTagText}>{e.cat}</Text></View>
            </View>
            <Text style={styles.expenseVal}>€{e.val.toFixed(2)}</Text>
          </View>
        ))}
        {expenses.length === 0 && <Text style={styles.empty}>Brak wydatków. Dodaj pierwszy!</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  totalBox: { borderWidth: 1, borderColor: '#eee', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20, backgroundColor: '#fff' },
  totalAmount: { fontSize: 40, fontWeight: '600', fontVariant: ['tabular-nums'] },
  totalLabel: { fontSize: 14, color: '#666', marginTop: 4 },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: '#fff' },
  catRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  catChipActive: { backgroundColor: '#111', borderColor: '#111' },
  catText: { fontSize: 13, color: '#555' },
  catTextActive: { color: '#fff' },
  addBtn: { backgroundColor: '#111', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '500' },
  subTitle: { fontSize: 15, fontWeight: '600', marginTop: 24, marginBottom: 10 },
  expenseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  expenseLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  expenseName: { fontSize: 14 },
  expenseTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, backgroundColor: '#f0f0f0' },
  expenseTagText: { fontSize: 11, color: '#666' },
  expenseVal: { fontSize: 14, fontWeight: '500', fontVariant: ['tabular-nums'] },
  empty: { color: '#999', fontSize: 13, textAlign: 'center', marginTop: 20 },
});
