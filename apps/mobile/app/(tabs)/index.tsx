/**
 * Home Screen (Dashboard)
 */

import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { Card } from '../../src/components';
import { Spinner } from '../../src/components';

// Demo data (will be replaced with API calls when endpoints are available)
const DEMO_STATS = [
  { label: 'Active Patients', value: '12', icon: '👶', color: '#8B5CF6' },
  { label: 'Goals in Progress', value: '24', icon: '🎯', color: '#10B981' },
  { label: 'Sessions This Week', value: '18', icon: '📅', color: '#F59E0B' },
  { label: 'Assessments Due', value: '3', icon: '📋', color: '#EF4444' },
];

const DEMO_SESSIONS = [
  {
    id: '1',
    childName: 'Emma Johnson',
    activity: 'ABA Therapy',
    time: '10:00 AM',
    status: 'scheduled',
  },
  {
    id: '2',
    childName: 'Liam Williams',
    activity: 'Speech Therapy',
    time: '11:30 AM',
    status: 'scheduled',
  },
  {
    id: '3',
    childName: 'Noah Martinez',
    activity: 'OT Session',
    time: '2:00 PM',
    status: 'scheduled',
  },
];

interface Session {
  id: string;
  childName: string;
  activity: string;
  time: string;
  status: string;
}

export default function HomeScreen() {
  const [stats] = useState(DEMO_STATS);
  const [sessions, setSessions] = useState<Session[]>(DEMO_SESSIONS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    // In production, this would call the API:
    // const sessionsData = await sessionsApi.upcoming(5);
    // setSessions(sessionsData);

    // For now, use demo data
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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8B5CF6']} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Autism Care</Text>
        <Text style={styles.subtitle}>Dashboard Overview</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Upcoming Sessions</Text>

      {loading ? (
        <Spinner text="Loading sessions..." />
      ) : (
        sessions.map((session) => (
          <Card key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionInfo}>
              <Text style={styles.childName}>{session.childName}</Text>
              <Text style={styles.activity}>{session.activity}</Text>
              <Text style={styles.time}>{session.time}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{session.status}</Text>
            </View>
          </Card>
        ))
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  statCard: {
    width: '46%',
    margin: '2%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 4,
  },
  sessionInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  activity: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#8B5CF6',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  bottomPadding: {
    height: 40,
  },
});
