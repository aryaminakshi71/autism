/**
 * Assessments Screen
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

interface Assessment {
  id: string;
  patientName: string;
  type: "ADOS-2" | "VB-MAPP" | "PEP-R" | "M-CHAT" | "CARS-2" | "SRS-2";
  name: string;
  status: "scheduled" | "in-progress" | "completed";
  scheduledDate: string;
  completedDate?: string;
  provider?: string;
}

const DEMO_ASSESSMENTS: Assessment[] = [
  {
    id: "1",
    patientName: "Emma Johnson",
    type: "ADOS-2",
    name: "Autism Diagnostic Observation Schedule",
    status: "completed",
    scheduledDate: "2024-01-10",
    completedDate: "2024-01-10",
    provider: "Dr. Smith",
  },
  {
    id: "2",
    patientName: "Emma Johnson",
    type: "VB-MAPP",
    name: "Verbal Behavior Milestones Assessment",
    status: "scheduled",
    scheduledDate: "2024-02-15",
    provider: "BCBA Williams",
  },
  {
    id: "3",
    patientName: "Liam Williams",
    type: "M-CHAT",
    name: "Modified Checklist for Autism in Toddlers",
    status: "scheduled",
    scheduledDate: "2024-02-20",
    provider: "Nurse Johnson",
  },
  {
    id: "4",
    patientName: "Noah Martinez",
    type: "CARS-2",
    name: "Childhood Autism Rating Scale",
    status: "in-progress",
    scheduledDate: "2024-02-01",
    provider: "Dr. Chen",
  },
  {
    id: "5",
    patientName: "Olivia Brown",
    type: "SRS-2",
    name: "Social Responsiveness Scale",
    status: "completed",
    scheduledDate: "2024-01-15",
    completedDate: "2024-01-15",
    provider: "Dr. Smith",
  },
];

const TYPE_INFO = {
  "ADOS-2": { color: "#8B5CF6", icon: "🔬" },
  "VB-MAPP": { color: "#10B981", icon: "📊" },
  "PEP-R": { color: "#F59E0B", icon: "📝" },
  "M-CHAT": { color: "#3B82F6", icon: "✅" },
  "CARS-2": { color: "#EF4444", icon: "📋" },
  "SRS-2": { color: "#EC4899", icon: "💬" },
};

export default function AssessmentsScreen() {
  const router = useRouter();
  const [assessments, setAssessments] =
    useState<Assessment[]>(DEMO_ASSESSMENTS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const loadData = async () => {
    setAssessments(DEMO_ASSESSMENTS);
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

  const filteredAssessments = assessments.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "scheduled":
        return "primary";
      case "in-progress":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const scheduledCount = assessments.filter(
    (a) => a.status === "scheduled",
  ).length;
  const completedCount = assessments.filter(
    (a) => a.status === "completed",
  ).length;
  const inProgressCount = assessments.filter(
    (a) => a.status === "in-progress",
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Assessments</Text>
        <Text style={styles.subtitle}>Track Progress & Screenings</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#EDE9FE" }]}>
          <Text style={styles.statValue}>{scheduledCount}</Text>
          <Text style={styles.statLabel}>Scheduled</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#FEF3C7" }]}>
          <Text style={[styles.statValue, { color: "#B45309" }]}>
            {inProgressCount}
          </Text>
          <Text style={[styles.statLabel, { color: "#B45309" }]}>
            In Progress
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#D1FAE5" }]}>
          <Text style={[styles.statValue, { color: "#047857" }]}>
            {completedCount}
          </Text>
          <Text style={[styles.statLabel, { color: "#047857" }]}>
            Completed
          </Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {["all", "scheduled", "in-progress", "completed"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filter === status && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(status)}
          >
            <Text
              style={[
                styles.filterText,
                filter === status && styles.filterTextActive,
              ]}
            >
              {status === "in-progress"
                ? "In Progress"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/assessments/add")}
      >
        <Text style={styles.addButtonText}>+ Schedule Assessment</Text>
      </TouchableOpacity>

      {loading ? (
        <Spinner text="Loading assessments..." />
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
          {filteredAssessments.length === 0 ? (
            <EmptyState
              title="No assessments found"
              description="Schedule assessments to track patient progress"
              icon="📋"
              actionLabel="Schedule Assessment"
              onAction={() => router.push("/assessments/add")}
            />
          ) : (
            filteredAssessments.map((assessment) => (
              <Card key={assessment.id} style={styles.assessmentCard}>
                <View style={styles.assessmentHeader}>
                  <View
                    style={[
                      styles.typeIcon,
                      {
                        backgroundColor:
                          TYPE_INFO[assessment.type].color + "20",
                      },
                    ]}
                  >
                    <Text style={styles.typeIconText}>
                      {TYPE_INFO[assessment.type].icon}
                    </Text>
                  </View>
                  <View style={styles.assessmentInfo}>
                    <Text style={styles.assessmentType}>{assessment.type}</Text>
                    <Text style={styles.assessmentName}>{assessment.name}</Text>
                    <Text style={styles.patientName}>
                      {assessment.patientName}
                    </Text>
                  </View>
                  <Badge
                    variant={getStatusVariant(assessment.status) as any}
                    size="sm"
                  >
                    {assessment.status}
                  </Badge>
                </View>

                <View style={styles.assessmentDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>📅</Text>
                    <Text style={styles.detailText}>
                      {assessment.status === "completed" &&
                      assessment.completedDate
                        ? `Completed: ${formatDate(assessment.completedDate)}`
                        : `Scheduled: ${formatDate(assessment.scheduledDate)}`}
                    </Text>
                  </View>
                  {assessment.provider && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>👤</Text>
                      <Text style={styles.detailText}>
                        {assessment.provider}
                      </Text>
                    </View>
                  )}
                </View>

                {assessment.status === "scheduled" && (
                  <TouchableOpacity style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start Assessment</Text>
                  </TouchableOpacity>
                )}
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
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { padding: 20, paddingTop: 60, backgroundColor: "#8B5CF6" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#EDE9FE", marginTop: 4 },
  statsRow: { flexDirection: "row", padding: 16, gap: 12 },
  statCard: { flex: 1, padding: 16, borderRadius: 12, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#7C3AED" },
  statLabel: { fontSize: 12, color: "#7C3AED", marginTop: 4 },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterButtonActive: { backgroundColor: "#8B5CF6", borderColor: "#8B5CF6" },
  filterText: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  filterTextActive: { color: "#fff" },
  addButton: {
    backgroundColor: "#8B5CF6",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  scrollView: { flex: 1, paddingHorizontal: 16 },
  assessmentCard: { marginBottom: 12 },
  assessmentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  typeIconText: { fontSize: 24 },
  assessmentInfo: { flex: 1 },
  assessmentType: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  assessmentName: { fontSize: 14, color: "#6B7280", marginTop: 2 },
  patientName: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  assessmentDetails: { gap: 8, marginBottom: 12 },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailLabel: { fontSize: 14 },
  detailText: { fontSize: 14, color: "#6B7280" },
  startButton: {
    backgroundColor: "#8B5CF6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  startButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  bottomPadding: { height: 40 },
});
