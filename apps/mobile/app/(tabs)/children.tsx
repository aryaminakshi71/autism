/**
 * Children (Patients) Screen
 */

import { useState, useEffect } from 'react';
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

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  diagnosis?: string;
  status: string;
  progress: number;
}

// Demo data
const DEMO_PATIENTS: Patient[] = [
  {
    id: '1',
    firstName: 'Emma',
    lastName: 'Johnson',
    dateOfBirth: '2019-03-15',
    diagnosis: 'ASD Level 1',
    status: 'active',
    progress: 75,
  },
  {
    id: '2',
    firstName: 'Liam',
    lastName: 'Williams',
    dateOfBirth: '2020-07-22',
    diagnosis: 'ASD Level 2',
    status: 'active',
    progress: 60,
  },
  {
    id: '3',
    firstName: 'Noah',
    lastName: 'Martinez',
    dateOfBirth: '2018-11-08',
    diagnosis: 'ASD Level 1',
    status: 'active',
    progress: 82,
  },
  {
    id: '4',
    firstName: 'Olivia',
    lastName: 'Brown',
    dateOfBirth: '2019-05-30',
    diagnosis: 'ASD Level 2',
    status: 'inactive',
    progress: 45,
  },
];

export default function ChildrenScreen() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>(DEMO_PATIENTS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    // In production: const data = await patientsApi.list();
    setPatients(DEMO_PATIENTS);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

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
        <Text style={styles.patientAge}>Age: {calculateAge(item.dateOfBirth)} years</Text>
        {item.diagnosis && (
          <Text style={styles.diagnosis}>{item.diagnosis}</Text>
        )}
        <View style={styles.progressContainer}>
          <ProgressBar progress={item.progress} showLabel={false} height={6} />
        </View>
      </View>
      <View style={styles.progressBadge}>
        <Text style={styles.progressText}>{item.progress}%</Text>
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
});
