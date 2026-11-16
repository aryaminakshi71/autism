/**
 * Add Session Screen
 */

import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Input } from "../../src/components";
import { useCreateSession, usePatients } from "../../src/hooks/use-api";

const SESSION_TYPES = [
  "ABA Therapy",
  "Speech Therapy",
  "OT Session",
  "PT Session",
  "Social Skills",
  "Group Therapy",
];

export default function AddSessionScreen() {
  const router = useRouter();
  const { createSession, loading, error } = useCreateSession();
  const { data: patients } = usePatients();

  const [sessionType, setSessionType] = useState("");
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [telehealth, setTelehealth] = useState(false);

  const handleSave = async () => {
    if (!sessionType || !date || !startTime || !endTime) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Combine date and time into ISO format
    const scheduledStart = `${date}T${startTime}:00`;
    const scheduledEnd = `${date}T${endTime}:00`;

    const result = await createSession({
      type: sessionType,
      patientId: patientId || undefined,
      scheduledStart,
      scheduledEnd,
      location: location || undefined,
      telehealth,
      status: "scheduled",
    });

    if (result) {
      Alert.alert("Success", "Session scheduled successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else if (error) {
      Alert.alert("Error", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Schedule Session</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Session Type *</Text>
          <View style={styles.typeGrid}>
            {SESSION_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeOption,
                  sessionType === type && styles.typeOptionActive,
                ]}
                onPress={() => setSessionType(type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    sessionType === type && styles.typeTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {patients && patients.length > 0 && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Patient</Text>
            <View style={styles.typeGrid}>
              {patients.slice(0, 5).map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  style={[
                    styles.typeOption,
                    patientId === patient.id && styles.typeOptionActive,
                  ]}
                  onPress={() => setPatientId(patient.id)}
                >
                  <Text
                    style={[
                      styles.typeText,
                      patientId === patient.id && styles.typeTextActive,
                    ]}
                  >
                    {patient.firstName} {patient.lastName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Schedule *</Text>
          <Input
            label="Date"
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
          />
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="Start Time"
                value={startTime}
                onChangeText={setStartTime}
                placeholder="10:00"
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="End Time"
                value={endTime}
                onChangeText={setEndTime}
                placeholder="11:00"
              />
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Input
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="Room 1"
          />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Telehealth</Text>
            <Switch
              value={telehealth}
              onValueChange={setTelehealth}
              trackColor={{ false: "#E5E7EB", true: "#8B5CF6" }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Schedule Session"
            onPress={handleSave}
            loading={loading}
          />
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
  title: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  content: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
  },
  typeOptionActive: { backgroundColor: "#8B5CF6", borderColor: "#8B5CF6" },
  typeText: { fontSize: 14, color: "#6B7280" },
  typeTextActive: { color: "#fff", fontWeight: "600" },
  row: { flexDirection: "row", gap: 12 },
  halfInput: { flex: 1 },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  switchLabel: { fontSize: 14, color: "#374151" },
  buttonContainer: { marginTop: 8 },
  bottomPadding: { height: 40 },
});
