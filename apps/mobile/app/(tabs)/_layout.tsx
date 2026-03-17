import { Tabs } from "expo/native";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#8B5CF6" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="children"
        options={{
          title: "Patients",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👶</Text>,
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: "Sessions",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📅</Text>,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Goals",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🎯</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "More",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>☰</Text>,
        }}
      />
    </Tabs>
  );
}
