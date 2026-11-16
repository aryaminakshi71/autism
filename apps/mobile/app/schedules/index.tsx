/**
 * Visual Schedules Screen
 */

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge, Card, EmptyState, Spinner } from "../../src/components";

interface ScheduleItem {
  time: string;
  activity: string;
  icon?: string;
  completed?: boolean;
}

interface VisualSchedule {
  id: string;
  patientName: string;
  name: string;
  type: "daily" | "therapy" | "bedtime" | "school";
  schedule: ScheduleItem[];
}

const DEMO_SCHEDULES: VisualSchedule[] = [
  {
    id: "1",
    patientName: "Emma Johnson",
    name: "Morning Routine",
    type: "daily",
    schedule: [
      {
        time: "7:00 AM",
        activity: "Wake up & Bathroom",
        icon: "🌅",
        completed: true,
      },
      { time: "7:30 AM", activity: "Breakfast", icon: "🍳", completed: true },
      {
        time: "8:00 AM",
        activity: "Brush teeth",
        icon: "🦷",
        completed: false,
      },
      {
        time: "8:30 AM",
        activity: "Get dressed",
        icon: "👕",
        completed: false,
      },
      {
        time: "9:00 AM",
        activity: "Go to school",
        icon: "🚌",
        completed: false,
      },
    ],
  },
  {
    id: "2",
    patientName: "Emma Johnson",
    name: "Bedtime Routine",
    type: "bedtime",
    schedule: [
      { time: "7:30 PM", activity: "Bath time", icon: "🛁", completed: false },
      {
        time: "8:00 PM",
        activity: "Put on pajamas",
        icon: "🧸",
        completed: false,
      },
      { time: "8:30 PM", activity: "Story time", icon: "📚", completed: false },
      { time: "9:00 PM", activity: "Lights out", icon: "😴", completed: false },
    ],
  },
  {
    id: "3",
    patientName: "Liam Williams",
    name: "Therapy Schedule",
    type: "therapy",
    schedule: [
      {
        time: "10:00 AM",
        activity: "Speech Therapy",
        icon: "🗣️",
        completed: false,
      },
      {
        time: "11:00 AM",
        activity: "OT Session",
        icon: "✋",
        completed: false,
      },
      {
        time: "2:00 PM",
        activity: "ABA Therapy",
        icon: "🎯",
        completed: false,
      },
    ],
  },
];

const TYPE_COLORS = {
  daily: "#8B5CF6",
  therapy: "#10B981",
  bedtime: "#F59E0B",
  school: "#3B82F6",
};

export default function SchedulesScreen() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<VisualSchedule[]>(DEMO_SCHEDULES);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const loadData = async () => {
    setSchedules(DEMO_SCHEDULES);
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

  const toggleItemComplete = (scheduleId: string, itemIndex: number) => {
    setSchedules((prev) =>
      prev.map((schedule) => {
        if (schedule.id === scheduleId) {
          const newSchedule = { ...schedule };
          newSchedule.schedule = [...newSchedule.schedule];
          newSchedule.schedule[itemIndex] = {
            ...newSchedule.schedule[itemIndex],
            completed: !newSchedule.schedule[itemIndex].completed,
          };
          return newSchedule;
        }
        return schedule;
      }),
    );
  };

  const getCompletedCount = (schedule: VisualSchedule) => {
    return schedule.schedule.filter((item) => item.completed).length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Visual Schedules</Text>
        <Text style={styles.subtitle}>Daily Routines & Timelines</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.viewButton,
            viewMode === "list" && styles.viewButtonActive,
          ]}
          onPress={() => setViewMode("list")}
        >
          <Text
            style={[
              styles.viewButtonText,
              viewMode === "list" && styles.viewButtonTextActive,
            ]}
          >
            List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewButton,
            viewMode === "grid" && styles.viewButtonActive,
          ]}
          onPress={() => setViewMode("grid")}
        >
          <Text
            style={[
              styles.viewButtonText,
              viewMode === "grid" && styles.viewButtonTextActive,
            ]}
          >
            Grid
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/schedules/add")}
      >
        <Text style={styles.addButtonText}>+ Add Schedule</Text>
      </TouchableOpacity>

      {loading ? (
        <Spinner text="Loading schedules..." />
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#8B5CF6"]}
            />
          }
        >
          {schedules.length === 0 ? (
            <EmptyState
              title="No schedules yet"
              description="Create visual schedules to help children understand daily routines"
              icon="📅"
              actionLabel="Add Schedule"
              onAction={() => router.push("/schedules/add")}
            />
          ) : (
            schedules.map((schedule) => (
              <Card key={schedule.id} style={styles.scheduleCard}>
                <View style={styles.scheduleHeader}>
                  <View>
                    <Text style={styles.scheduleName}>{schedule.name}</Text>
                    <Text style={styles.patientName}>
                      {schedule.patientName}
                    </Text>
                  </View>
                  <Badge
                    variant={
                      schedule.type === "daily"
                        ? "primary"
                        : schedule.type === "bedtime"
                          ? "warning"
                          : "success"
                    }
                    size="sm"
                  >
                    {schedule.type}
                  </Badge>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(getCompletedCount(schedule) / schedule.schedule.length) * 100}%`,
                          backgroundColor: TYPE_COLORS[schedule.type],
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {getCompletedCount(schedule)}/{schedule.schedule.length}
                  </Text>
                </View>

                <View style={styles.itemsContainer}>
                  {schedule.schedule.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.scheduleItem}
                      onPress={() => toggleItemComplete(schedule.id, index)}
                    >
                      <View style={styles.itemLeft}>
                        <View
                          style={[
                            styles.checkbox,
                            item.completed && styles.checkboxChecked,
                          ]}
                        >
                          {item.completed && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </View>
                        <Text style={styles.itemIcon}>{item.icon}</Text>
                        <View style={styles.itemInfo}>
                          <Text
                            style={[
                              styles.itemActivity,
                              item.completed && styles.itemCompleted,
                            ]}
                          >
                            {item.activity}
                          </Text>
                          <Text style={styles.itemTime}>{item.time}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
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
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#8B5CF6",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#EDE9FE",
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  viewButtonActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  viewButtonText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  viewButtonTextActive: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#8B5CF6",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scheduleCard: {
    marginBottom: 16,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  scheduleName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  patientName: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  itemsContainer: {
    gap: 8,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  itemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemActivity: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  itemCompleted: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  itemTime: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  bottomPadding: {
    height: 40,
  },
});
