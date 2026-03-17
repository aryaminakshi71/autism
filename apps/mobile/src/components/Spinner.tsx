/**
 * Loading Spinner Component
 */

import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
}

export function Spinner({ size = 'large', color = '#7C3AED', text }: SpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
});
