/**
 * Settings Screen
 */

import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { type ThemeMode, useTheme } from "../../src/lib/theme";

export default function SettingsScreen() {
  const router = useRouter();
  const { mode, setMode, isDark } = useTheme();

  const handleThemeChange = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const menuItems = [
    {
      icon: "🎨",
      title: "Theme",
      subtitle:
        mode === "system"
          ? "System"
          : mode.charAt(0).toUpperCase() + mode.slice(1),
      onPress: () => {
        Alert.alert("Choose Theme", "Select your preferred theme", [
          { text: "Light", onPress: () => handleThemeChange("light") },
          { text: "Dark", onPress: () => handleThemeChange("dark") },
          { text: "System", onPress: () => handleThemeChange("system") },
          { text: "Cancel", style: "cancel" },
        ]);
      },
    },
    {
      icon: "🔔",
      title: "Notifications",
      subtitle: "Manage alerts",
      onPress: () =>
        Alert.alert("Notifications", "Notification settings coming soon"),
    },
    {
      icon: "🔒",
      title: "Privacy",
      subtitle: "Privacy settings",
      onPress: () => Alert.alert("Privacy", "Privacy settings coming soon"),
    },
    {
      icon: "❓",
      title: "Help & Support",
      subtitle: "Get help",
      onPress: () => Alert.alert("Help", "Contact support@autismcare.app"),
    },
    {
      icon: "📋",
      title: "Terms & Privacy",
      subtitle: "Legal information",
      onPress: () => Alert.alert("Legal", "Terms and Privacy Policy"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.themeSelector}>
          <TouchableOpacity
            style={[
              styles.themeOption,
              mode === "light" && styles.themeOptionActive,
            ]}
            onPress={() => handleThemeChange("light")}
          >
            <Text style={styles.themeIcon}>☀️</Text>
            <Text
              style={[
                styles.themeText,
                mode === "light" && styles.themeTextActive,
              ]}
            >
              Light
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeOption,
              mode === "dark" && styles.themeOptionActive,
            ]}
            onPress={() => handleThemeChange("dark")}
          >
            <Text style={styles.themeIcon}>🌙</Text>
            <Text
              style={[
                styles.themeText,
                mode === "dark" && styles.themeTextActive,
              ]}
            >
              Dark
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeOption,
              mode === "system" && styles.themeOptionActive,
            ]}
            onPress={() => handleThemeChange("system")}
          >
            <Text style={styles.themeIcon}>⚙️</Text>
            <Text
              style={[
                styles.themeText,
                mode === "system" && styles.themeTextActive,
              ]}
            >
              System
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index === menuItems.length - 1 && styles.menuItemLast,
            ]}
            onPress={item.onPress}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Autism Care v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { padding: 20, paddingTop: 60, backgroundColor: "#8B5CF6" },
  backButton: { marginBottom: 12 },
  backText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  section: { backgroundColor: "#fff", marginTop: 16, paddingVertical: 8 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  themeSelector: { flexDirection: "row", paddingHorizontal: 16, gap: 12 },
  themeOption: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  themeOptionActive: { backgroundColor: "#8B5CF6" },
  themeIcon: { fontSize: 24, marginBottom: 8 },
  themeText: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  themeTextActive: { color: "#fff" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuIcon: { fontSize: 20 },
  menuContent: { flex: 1, marginLeft: 12 },
  menuTitle: { fontSize: 16, color: "#1F2937", fontWeight: "500" },
  menuSubtitle: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  chevron: { fontSize: 20, color: "#D1D5DB" },
  versionContainer: { alignItems: "center", padding: 20 },
  versionText: { fontSize: 12, color: "#9CA3AF" },
});
