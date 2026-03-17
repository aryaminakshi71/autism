/**
 * Patient Detail Screen
 */

import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Card, Badge, ProgressBar, Spinner } from '../../src/components';
import { usePatient, useGoals } from '../../src/hooks/use-api';

export default function PatientDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: patient, loading: patientLoading, error: patientError } = usePatient(id || '');
  const { data: goals, loading: goalsLoading } = useGoals(id);

  const calculateAge = (dateOfBirth?: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusVariant = (status?: string) => {
    return status === 'active' ? 'success' : 'default';
  };

  if (patientLoading || goalsLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Loading...</Text>
        </View>
        <Spinner text="Loading patient details..." />
      </View>
    );
  }

  if (patientError || !patient) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Error</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{patientError || 'Patient not found'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{patient.firstName} {patient.lastName}</Text>
        <Badge variant={getStatusVariant(patient.status) as any}>{patient.status}</Badge>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{calculateAge(patient.dateOfBirth)} years</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{patient.dateOfBirth || 'Not specified'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{patient.gender || 'Not specified'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Primary Language</Text>
            <Text style={styles.infoValue}>{patient.primaryLanguage || 'English'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Preferred Communication</Text>
            <Text style={styles.infoValue}>{patient.preferredCommunication || 'Verbal'}</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Diagnosis</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Diagnosis</Text>
            <Text style={styles.infoValue}>{patient.diagnosis || 'Not specified'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Severity Level</Text>
            <Text style={styles.infoValue}>{patient.severityLevel || 'Not specified'}</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Goals Progress</Text>
            <TouchableOpacity onPress={() => router.push('/progress/add')}>
              <Text style={styles.addLink}>+ Add Goal</Text>
            </TouchableOpacity>
          </View>
          {goals && goals.length > 0 ? (
            goals.map((goal) => (
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
            ))
          ) : (
            <Text style={styles.noGoalsText}>No goals yet</Text>
          )}
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
  errorContainer: { padding: 20, alignItems: 'center' },
  errorText: { color: '#EF4444', fontSize: 16 },
  noGoalsText: { color: '#6B7280', fontStyle: 'italic' },
});
