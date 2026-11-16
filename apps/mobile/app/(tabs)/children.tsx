/**
 * Children (Patients) Screen
 */

import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, EmptyState, ProgressBar } from "../../src/components";
import { SkeletonList } from "../../src/components/Skeleton";
import { Patient, usePatients } from "../../src/hooks/use-api";

// Calculate progress (placeholder)
const calculateProgress = (): number => Math.floor(Math.random() * 40) + 50;

const calculateAge = (dateOfBirth?: string): number => {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export default function ChildrenScreen() {
  const router = useRouter();
  const {
    data: patients,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = usePatients(1, 50);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const renderPatient = ({ item }: { item: Patient }) => {
    const progress = calculateProgress();
    return (
      <TouchableOpacity
        style={styles.patientCard}
        onPress={() => router.push(`/children/${item.id}`)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.firstName.charAt(0)}
            {item.lastName.charAt(0)}
          </Text>
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>
            {item.firstName} {item.lastName}
          </Text>
          {item.dateOfBirth && (
            <Text style={styles.patientAge}>
              Age: {calculateAge(item.dateOfBirth)} years
            </Text>
          )}
          {item.diagnosis && (
            <Text style={styles.diagnosis}>{item.diagnosis}</Text>
          )}
          <View style={styles.progressContainer}>
            <ProgressBar progress={progress} showLabel={false} height={6} />
          </View>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Children</Text>
        <Text style={styles.subtitle}>Patient Management</Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/children/add")}
      >
        <Text style={styles.addButtonText}>+ Add Patient</Text>
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.list}>
          <SkeletonList count={5} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load patients</Text>
          <Button title="Retry" onPress={() => refetch()} variant="outline" />
        </View>
      ) : (
        <FlatList
          data={patients?.data || []}
          keyExtractor={(item) => item.id}
          renderItem={renderPatient}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              colors={["#8B5CF6"]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No patients yet"
              description="Add your first patient to get started"
              icon="👶"
              actionLabel="Add Patient"
              onAction={() => router.push("/children/add")}
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
  addButton: {
    backgroundColor: "#8B5CF6",
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  patientInfo: {
    flex: 1,
    marginLeft: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  patientAge: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  diagnosis: {
    fontSize: 12,
    color: "#8B5CF6",
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBadge: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 12,
  },
});
