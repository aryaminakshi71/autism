/**
 * ProgressBar Component
 */

import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  showLabel?: boolean;
  height?: number;
}

export function ProgressBar({
  progress,
  color = '#7C3AED',
  showLabel = true,
  height = 8,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: color,
              height,
            },
          ]}
        />
      </View>
      {showLabel && (
        <Text style={styles.label}>{Math.round(clampedProgress)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  track: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    minWidth: 40,
    textAlign: 'right',
  },
});
