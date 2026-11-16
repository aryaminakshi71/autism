/**
 * Goal Detail Screen
 */

import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge, Button, Card, ProgressBar } from "../../src/components";

interface Goal {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  masteryCriteria: number;
  status: string;
  priority: string;
  startDate: string;
  targetDate: string;
}

const DEMO_GOAL: Goal = {
  id: "1",
  name: "Increase eye contact",
  description:
    "Increase sustained eye contact during verbal exchanges with caregivers and therapists",
  category: "Social",
  subcategory: "Joint Attention",
  baselineValue: 20,
  targetValue: 80,
  currentValue: 75,
  unit: "%",
  masteryCriteria: 80,
  status: "active",
  priority: "high",
  startDate: "2024-01-15",
  targetDate: "2024-04-15",
};

export default function GoalDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const progress = (DEMO_GOAL.currentValue / DEMO_GOAL.targetValue) * 100;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "primary";
      case "mastered":
        return "success";
      case "inactive":
        return "default";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{DEMO_GOAL.name}</Text>
        <View style={styles.badges}>
          <Badge variant={getStatusVariant(DEMO_GOAL.status) as any}>
            {DEMO_GOAL.status}
          </Badge>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(DEMO_GOAL.priority) + "20" },
            ]}
          >
            <Text
              style={[
                styles.priorityText,
                { color: getPriorityColor(DEMO_GOAL.priority) },
              ]}
            >
              {DEMO_GOAL.priority} priority
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressValue}>
              {DEMO_GOAL.currentValue}
              {DEMO_GOAL.unit}
            </Text>
            <Text style={styles.progressTarget}>
              {" "}
              / {DEMO_GOAL.targetValue}
              {DEMO_GOAL.unit}
            </Text>
          </View>
          <ProgressBar
            progress={progress}
            color={DEMO_GOAL.status === "mastered" ? "#10B981" : "#8B5CF6"}
          />
          <Text style={styles.progressLabel}>
            {progress >= DEMO_GOAL.masteryCriteria
              ? "Goal Mastered!"
              : `${DEMO_GOAL.masteryCriteria}${DEMO_GOAL.unit} required to master`}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Goal Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{DEMO_GOAL.category}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Subcategory</Text>
            <Text style={styles.infoValue}>{DEMO_GOAL.subcategory}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Baseline</Text>
            <Text style={styles.infoValue}>
              {DEMO_GOAL.baselineValue}
              {DEMO_GOAL.unit}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Target</Text>
            <Text style={styles.infoValue}>
              {DEMO_GOAL.targetValue}
              {DEMO_GOAL.unit}
            </Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Start Date</Text>
            <Text style={styles.infoValue}>{DEMO_GOAL.startDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Target Date</Text>
            <Text style={styles.infoValue}>{DEMO_GOAL.targetDate}</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{DEMO_GOAL.description}</Text>
        </Card>

        <View style={styles.buttonContainer}>
          <Button title="Update Progress" onPress={() => {}} />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { padding: 20, paddingTop: 60, backgroundColor: "#8B5CF6" },
  backButton: { marginBottom: 12 },
  backText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 12 },
  badges: { flexDirection: "row", gap: 8 },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: { fontSize: 12, fontWeight: "600" },
  content: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  progressValue: { fontSize: 36, fontWeight: "bold", color: "#8B5CF6" },
  progressTarget: { fontSize: 18, color: "#6B7280" },
  progressLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: { fontSize: 14, color: "#6B7280" },
  infoValue: { fontSize: 14, color: "#1F2937", fontWeight: "500" },
  description: { fontSize: 14, color: "#6B7280", lineHeight: 22 },
  buttonContainer: { marginTop: 8 },
  bottomPadding: { height: 40 },
});
