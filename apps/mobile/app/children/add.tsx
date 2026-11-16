/**
 * Add Patient Screen
 */

import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Input } from "../../src/components";
import { useCreatePatient } from "../../src/hooks/use-api";

export default function AddPatientScreen() {
  const router = useRouter();
  const { createPatient, loading, error } = useCreatePatient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [severityLevel, setSeverityLevel] = useState("");

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert("Error", "First name and last name are required");
      return;
    }

    const result = await createPatient({
      firstName,
      lastName,
      dateOfBirth: dateOfBirth || undefined,
      gender: gender || undefined,
      diagnosis: diagnosis || undefined,
      severityLevel: severityLevel || undefined,
      status: "active",
    });

    if (result) {
      Alert.alert("Success", "Patient added successfully", [
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
        <Text style={styles.title}>Add Patient</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <Input
            label="First Name *"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
          />
          <Input
            label="Last Name *"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
          />
          <Input
            label="Date of Birth"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="YYYY-MM-DD"
          />
          <View style={styles.genderSelector}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderOptions}>
              {["Male", "Female", "Other"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderOption,
                    gender === option && styles.genderOptionActive,
                  ]}
                  onPress={() => setGender(option)}
                >
                  <Text
                    style={[
                      styles.genderText,
                      gender === option && styles.genderTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Diagnosis Information</Text>
          <Input
            label="Diagnosis"
            value={diagnosis}
            onChangeText={setDiagnosis}
            placeholder="e.g., ASD Level 1"
          />
          <View style={styles.genderSelector}>
            <Text style={styles.label}>Severity Level</Text>
            <View style={styles.genderOptions}>
              {["Level 1", "Level 2", "Level 3"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderOption,
                    severityLevel === option && styles.genderOptionActive,
                  ]}
                  onPress={() => setSeverityLevel(option)}
                >
                  <Text
                    style={[
                      styles.genderText,
                      severityLevel === option && styles.genderTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button title="Save Patient" onPress={handleSave} loading={loading} />
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
  genderSelector: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  genderOptions: { flexDirection: "row", gap: 12 },
  genderOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  genderOptionActive: { backgroundColor: "#8B5CF6", borderColor: "#8B5CF6" },
  genderText: { fontSize: 14, color: "#6B7280" },
  genderTextActive: { color: "#fff", fontWeight: "600" },
  buttonContainer: { marginTop: 8 },
  bottomPadding: { height: 40 },
});
