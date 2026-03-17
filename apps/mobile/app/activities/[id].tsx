/**
 * Session Detail Screen
 */

import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Card, Badge, Button } from '../../src/components';

interface Session {
  id: string;
  patientName: string;
  type: string;
  status: string;
  scheduledStart: string;
  scheduledEnd: string;
  location?: string;
  telehealth: boolean;
  therapistName?: string;
}

const DEMO_SESSION: Session = {
  id: '1',
  patientName: 'Emma Johnson',
  type: 'ABA Therapy',
  status: 'scheduled',
  scheduledStart: '2024-02-15T10:00:00',
  scheduledEnd: '2024-02-15T11:00:00',
  location: 'Room 1',
  telehealth: false,
  therapistName: 'Dr. Smith',
};

export default function SessionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'scheduled': return 'primary';
      case 'in-progress': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{DEMO_SESSION.type}</Text>
        <Badge variant={getStatusVariant(DEMO_SESSION.status) as any}>{DEMO_SESSION.status}</Badge>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Session Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Patient</Text>
            <Text style={styles.infoValue}>{DEMO_SESSION.patientName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Therapist</Text>
            <Text style={styles.infoValue}>{DEMO_SESSION.therapistName || 'Not assigned'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{DEMO_SESSION.type}</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Start</Text>
            <Text style={styles.infoValue}>{formatDateTime(DEMO_SESSION.scheduledStart)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>End</Text>
            <Text style={styles.infoValue}>{formatDateTime(DEMO_SESSION.scheduledEnd)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>
              {DEMO_SESSION.telehealth ? 'Telehealth' : DEMO_SESSION.location || 'TBD'}
            </Text>
          </View>
        </Card>

        {DEMO_SESSION.status === 'scheduled' && (
          <View style={styles.buttonContainer}>
            <Button title="Start Session" onPress={() => {}} />
            <View style={styles.buttonSpacer} />
            <Button title="Cancel Session" variant="outline" onPress={() => {}} />
          </View>
        )}

        {DEMO_SESSION.status === 'in-progress' && (
          <View style={styles.buttonContainer}>
            <Button title="Complete Session" onPress={() => {}} />
          </View>
        )}

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
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  content: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  infoLabel: { fontSize: 14, color: '#6B7280' },
  infoValue: { fontSize: 14, color: '#1F2937', fontWeight: '500' },
  buttonContainer: { marginTop: 8 },
  buttonSpacer: { height: 12 },
  bottomPadding: { height: 40 },
});
