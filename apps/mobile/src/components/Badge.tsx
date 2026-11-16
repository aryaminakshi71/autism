/**
 * Badge Component
 */

import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "outline";
  size?: "sm" | "md";
  style?: ViewStyle;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  style,
}: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], styles[size], style]}>
      <Text
        style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  default: {
    backgroundColor: "#F3F4F6",
  },
  primary: {
    backgroundColor: "#DBEAFE",
  },
  success: {
    backgroundColor: "#D1FAE5",
  },
  warning: {
    backgroundColor: "#FEF3C7",
  },
  danger: {
    backgroundColor: "#FEE2E2",
  },
  info: {
    backgroundColor: "#CFFAFE",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    fontWeight: "600",
  },
  defaultText: {
    color: "#374151",
  },
  primaryText: {
    color: "#1D4ED8",
  },
  successText: {
    color: "#047857",
  },
  warningText: {
    color: "#B45309",
  },
  dangerText: {
    color: "#B91C1C",
  },
  infoText: {
    color: "#155E75",
  },
  outlineText: {
    color: "#374151",
  },
  smText: {
    fontSize: 10,
  },
  mdText: {
    fontSize: 12,
  },
});
