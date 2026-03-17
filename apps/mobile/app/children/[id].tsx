/**
 * Patient Detail Screen
 */

import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Card, Badge, ProgressBar } from '../../src/components';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  diagnosis?: string;
  severityLevel?: string;
  status: string;
  primaryLanguage: string;
  preferredCommunication: string;
}

interface Goal {
  id: string;
  name: string;
  category: string;
  currentValue: number;
  targetValue: number;
  status: string;
}

// Demo data
const DEMO_PATIENT: Patient = {
  id: '1',
  firstName: 'Emma',
  lastName: 'Johnson',
  dateOfBirth: '2019-03-15',
  gender: 'female',
  diagnosis: 'ASD Level 1',
  severityLevel: 'Level 1',
  status: 'active',
  primaryLanguage: 'English',
  preferredCommunication: 'Verbal',
};

const DEMO_GOALS: Goal[] = [
  { id: '1', name: 'Increase eye contact', category: 'Social', currentValue: 75, targetValue: 80, status: 'active' },
  { id: '2', name: 'Picture exchange communication', category: 'Communication', currentValue: 100, targetValue: 100, status: 'mastered' },
];

export default function PatientDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusVariant = (status: string) => {
    return status === 'active' ? 'success' : 'default';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{DEMO_PATIENT.firstName} {DEMO_PATIENT.lastName}</Text>
        <Badge variant={getStatusVariant(DEMO_PATIENT.status) as any}>{DEMO_PATIENT.status}</Badge>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{calculateAge(DEMO_PATIENT.dateOfBirth)} years</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{DEMO_PATIENT.dateOfBirth}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{DEMO_PATIENT.gender}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Primary Language</Text>
            <Text style={styles.infoValue}>{DEMO_PATIENT.primaryLanguage}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Preferred Communication</Text>
            <Text style={styles.infoValue}>{DEMO_PATIENT.preferredCommunication}</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Diagnosis</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Diagnosis</Text>
            <Text style={styles.infoValue}>{DEMO_PATIENT.diagnosis || 'Not specified'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Severity Level</Text>
            <Text style={styles.infoValue}>{DEMO_PATIENT.severityLevel || 'Not specified'}</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Goals Progress</Text>
            <TouchableOpacity onPress={() => router.push('/progress/add')}>
              <Text style={styles.addLink}>+ Add Goal</Text>
            </TouchableOpacity>
          </View>
          {DEMO_GOALS.map((goal) => (
            <View key={goal.id} style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <Badge variant={goal.status === 'mastered' ? 'success' : 'primary'} size="sm">
                  {goal.status}
                </Badge>
              </View>
              <Text style={styles.goalCategory}>{goal.category}</Text>
              <ProgressBar progress={(goal.currentValue / goal.targetValue) * 100} />
            </View>
          ))}
        </Card>

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
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  content: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  infoLabel: { fontSize: 14, color: '#6B7280' },
  infoValue: { fontSize: 14, color: '#1F2937', fontWeight: '500' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  addLink: { color: '#8B5CF6', fontWeight: '600' },
  goalItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  goalName: { fontSize: 16, fontWeight: '500', color: '#1F2937' },
  goalCategory: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  bottomPadding: { height: 40 },
});
