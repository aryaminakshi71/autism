/**
 * Children (Patients) Screen
 */

import { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Button, Spinner, EmptyState, ProgressBar } from '../../src/components';
import { usePatients, usePatientStats, Patient } from '../../src/hooks/use-api';

// Calculate progress from goals (placeholder - in real app would come from API)
const calculateProgress = (patient: Patient): number => {
  // This would ideally come from goals associated with the patient
  return Math.floor(Math.random() * 40) + 50; // 50-90% for demo
};

const calculateAge = (dateOfBirth: string): number => {
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

export default function ChildrenScreen() {
  const router = useRouter();
  const { data: patients, loading, error, refetch } = usePatients(1, 50);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderPatient = ({ item }: { item: Patient }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => router.push(`/children/${item.id}`)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.firstName.charAt(0)}{item.lastName.charAt(0)}
        </Text>
      </View>
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>
          {item.firstName} {item.lastName}
        </Text>
        {item.dateOfBirth && (
          <Text style={styles.patientAge}>Age: {calculateAge(item.dateOfBirth)} years</Text>
        )}
        {item.diagnosis && (
          <Text style={styles.diagnosis}>{item.diagnosis}</Text>
        )}
        <View style={styles.progressContainer}>
          <ProgressBar progress={calculateProgress(item)} showLabel={false} height={6} />
        </View>
      </View>
      <View style={styles.progressBadge}>
        <Text style={styles.progressText}>{calculateProgress(item)}%</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Children</Text>
        <Text style={styles.subtitle}>Patient Management</Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/children/add')}
      >
        <Text style={styles.addButtonText}>+ Add Patient</Text>
      </TouchableOpacity>

      {loading ? (
        <Spinner text="Loading patients..." />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Retry" onPress={refetch} variant="outline" />
        </View>
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={renderPatient}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#8B5CF6']}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No patients yet"
              description="Add your first patient to get started"
              icon="👶"
              actionLabel="Add Patient"
              onAction={() => router.push('/children/add')}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#8B5CF6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#EDE9FE',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  patientInfo: {
    flex: 1,
    marginLeft: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  patientAge: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  diagnosis: {
    fontSize: 12,
    color: '#8B5CF6',
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 12,
  },
});
