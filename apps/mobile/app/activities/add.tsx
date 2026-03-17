/**
 * Add Session Screen
 */

import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Input, Button } from '../../src/components';

const SESSION_TYPES = ['ABA Therapy', 'Speech Therapy', 'OT Session', 'PT Session', 'Social Skills', 'Group Therapy'];

export default function AddSessionScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [sessionType, setSessionType] = useState('');
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');

  const handleSave = async () => {
    if (!sessionType || !patientName || !date || !startTime || !endTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);

    Alert.alert('Success', 'Session scheduled successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Schedule Session</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Session Type *</Text>
          <View style={styles.typeGrid}>
            {SESSION_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeOption, sessionType === type && styles.typeOptionActive]}
                onPress={() => setSessionType(type)}
              >
                <Text style={[styles.typeText, sessionType === type && styles.typeTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Patient *</Text>
          <Input
            label="Patient Name"
            value={patientName}
            onChangeText={setPatientName}
            placeholder="Select patient"
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Schedule *</Text>
          <Input
            label="Date"
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
          />
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="Start Time"
                value={startTime}
                onChangeText={setStartTime}
                placeholder="10:00 AM"
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="End Time"
                value={endTime}
                onChangeText={setEndTime}
                placeholder="11:00 AM"
              />
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Input
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="Room 1"
          />
        </Card>

        <View style={styles.buttonContainer}>
          <Button title="Schedule Session" onPress={handleSave} loading={loading} />
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
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeOption: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' },
  typeOptionActive: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  typeText: { fontSize: 14, color: '#6B7280' },
  typeTextActive: { color: '#fff', fontWeight: '600' },
  row: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  buttonContainer: { marginTop: 8 },
  bottomPadding: { height: 40 },
});
