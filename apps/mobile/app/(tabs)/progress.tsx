/**
 * Progress (Goals) Screen
 */

import { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Button, Spinner, EmptyState, ProgressBar, Badge } from '../../src/components';
import { useGoals, Goal } from '../../src/hooks/use-api';

const TREND_ICONS = {
  improving: '↗',
  stable: '→',
  declining: '↘',
};

const PRIORITY_COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
};

export default function ProgressScreen() {
  const router = useRouter();
  const { data: goals, loading, error, refetch } = useGoals();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filteredGoals = goals?.filter((goal) => {
    if (filter === 'all') return true;
    return goal.status === filter;
  }) || [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'mastered':
        return 'success';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || '#6B7280';
  };

  const getTrend = (goal: Goal): 'improving' | 'stable' | 'declining' => {
    const progress = goal.currentValue / goal.targetValue;
    if (progress >= 0.7) return 'improving';
    if (progress >= 0.3) return 'stable';
    return 'declining';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>Goals & Development Tracking</Text>
      </View>

      <View style={styles.filterContainer}>
        {['all', 'active', 'mastered', 'inactive'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, filter === status && styles.filterButtonActive]}
            onPress={() => setFilter(status)}
          >
            <Text style={[styles.filterText, filter === status && styles.filterTextActive]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/progress/add')}
      >
        <Text style={styles.addButtonText}>+ Add Goal</Text>
      </TouchableOpacity>

      {loading ? (
        <Spinner text="Loading goals..." />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Retry" onPress={refetch} variant="outline" />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8B5CF6']} />
          }
        >
          {filteredGoals.length === 0 ? (
            <EmptyState
              title="No goals found"
              description="Create goals to track progress"
              icon="🎯"
              actionLabel="Add Goal"
              onAction={() => router.push('/progress/add')}
            />
          ) : (
            filteredGoals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={styles.goalCard}
                onPress={() => router.push(`/progress/${goal.id}`)}
              >
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.patientName}>{goal.patientName || 'Unknown Patient'}</Text>
                  </View>
                  <View style={styles.goalBadges}>
                    <Badge variant={getStatusVariant(goal.status) as any} size="sm">
                      {goal.status}
                    </Badge>
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(goal.priority) }]} />
                  </View>
                </View>

                <View style={styles.progressSection}>
                  <ProgressBar
                    progress={(goal.currentValue / goal.targetValue) * 100}
                    color={goal.status === 'mastered' ? '#10B981' : '#8B5CF6'}
                  />
                </View>

                <View style={styles.goalFooter}>
                  <View style={styles.categoryContainer}>
                    <Text style={styles.category}>{goal.category}</Text>
                  </View>
                  <View style={styles.trendContainer}>
                    <Text style={styles.trendIcon}>{TREND_ICONS[getTrend(goal)]}</Text>
                    <Text style={styles.trendText}>{getTrend(goal)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
          <View style={styles.bottomPadding} />
        </ScrollView>
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
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  goalCard: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  patientName: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  goalBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressSection: {
    marginBottom: 12,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  category: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendIcon: {
    fontSize: 14,
  },
  trendText: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  bottomPadding: {
    height: 40,
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
