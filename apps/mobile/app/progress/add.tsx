/**
 * Add Goal Screen
 */

import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Input, Button } from '../../src/components';

const CATEGORIES = ['Communication', 'Social', 'Motor', 'Cognitive', 'Adaptive', 'Language'];

export default function AddGoalScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [baselineValue, setBaselineValue] = useState('');
  const [targetValue, setTargetValue] = useState('');

  const handleSave = async () => {
    if (!name || !category || !targetValue) {
      Alert.alert('Error', 'Name, category, and target value are required');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);

    Alert.alert('Success', 'Goal added successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Goal</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Goal Information</Text>
          <Input
            label="Goal Name *"
            value={name}
            onChangeText={setName}
            placeholder="e.g., Increase eye contact"
          />
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the goal"
            multiline
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Category *</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryOption, category === cat && styles.categoryOptionActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Target Values</Text>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="Baseline"
                value={baselineValue}
                onChangeText={setBaselineValue}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Target *"
                value={targetValue}
                onChangeText={setTargetValue}
                placeholder="100"
                keyboardType="numeric"
              />
            </View>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button title="Save Goal" onPress={handleSave} loading={loading} />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#8B5CF6' },
  backButton: { marginBottom: 12 },
  backText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 16 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryOption: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' },
  categoryOptionActive: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  categoryText: { fontSize: 14, color: '#6B7280' },
  categoryTextActive: { color: '#fff', fontWeight: '600' },
  row: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  buttonContainer: { marginTop: 8 },
  bottomPadding: { height: 40 },
});
