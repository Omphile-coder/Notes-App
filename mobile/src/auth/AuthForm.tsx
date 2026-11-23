import { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { paper } from '../board/theme';

import { AuthError } from './accounts';

// Tracks pending auth work and presents user-facing failures.
// Prevents duplicate actions with a synchronous running guard.
export function useAuthAction() {
  const running = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Runs one authentication action and records its error state.
  async function run(action: () => Promise<void>, fallback: string) {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (failure) {
      setError(failure instanceof AuthError ? failure.message : fallback);
    } finally {
      running.current = false;
      setBusy(false);
    }
  }

  return { busy, error, run };
}

// Renders a labeled text input with consistent app styling.
export function AuthField({
  label,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={paper.muted}
        {...props}
        accessibilityLabel={label}
        style={styles.input}
      />
    </View>
  );
}

// Renders an email input with mobile keyboard and autofill settings.
export function EmailField(props: TextInputProps) {
  return (
    <AuthField
      placeholder="name@example.com"
      {...props}
      label="Email"
      autoComplete="email"
      keyboardType="email-address"
    />
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontWeight: '600', color: '#27241f' },
  input: {
    backgroundColor: '#fff',
    color: '#27241f',
    borderColor: '#a8a196',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 46,
  },
});
