/**
 * Home Screen (Dashboard)
 */

import { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Spinner } from '../../src/components';
import { usePatientStats, useSessions, useGoals, Session } from '../../src/hooks/use-api';
import { authStore } from '../../src/stores/auth-store';

export default function HomeScreen() {
  const router = useRouter();
  const { data: stats, loading: statsLoading, refetch: refetchStats } = usePatientStats();
  const { data: sessions, loading: sessionsLoading } = useSessions();
  const { data: goals } = useGoals();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchStats();
    setRefreshing(false);
  }, [refetchStats]);

  const upcomingSessions = sessions?.slice(0, 3) || [];
  const activeGoals = goals?.filter(g => g.status === 'active').length || 0;

  // Format stats for display
  const statsData = [
    { label: 'Active Patients', value: String(stats?.active || 0), icon: '👶', color: '#8B5CF6' },
    { label: 'Goals in Progress', value: String(activeGoals), icon: '🎯', color: '#10B981' },
    { label: 'Sessions This Week', value: String(upcomingSessions.length), icon: '📅', color: '#F59E0B' },
    { label: 'Assessments Due', value: '0', icon: '📋', color: '#EF4444' },
  ];

  const formatSessionTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const user = authStore.getState().user;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8B5CF6']} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Autism Care</Text>
        <Text style={styles.subtitle}>Welcome back, {user?.name || 'User'}</Text>
      </View>

      <View style={styles.statsGrid}>
        {statsData.map((stat, index) => (
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

      {sessionsLoading ? (
        <Spinner text="Loading sessions..." />
      ) : upcomingSessions.length > 0 ? (
        upcomingSessions.map((session: Session) => (
          <Card key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionInfo}>
              <Text style={styles.childName}>{session.patientName || 'Unknown Patient'}</Text>
              <Text style={styles.activity}>{session.type}</Text>
              <Text style={styles.time}>{formatSessionTime(session.scheduledStart)}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{getStatusText(session.status)}</Text>
            </View>
          </Card>
        ))
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No upcoming sessions</Text>
        </Card>
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
  emptyCard: {
    marginHorizontal: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
  },
  bottomPadding: {
    height: 40,
  },
});
