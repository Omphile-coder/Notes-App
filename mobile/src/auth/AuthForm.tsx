import { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { AuthError } from './accounts';

export function useAuthAction() {
  const running = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

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
        {...props}
        accessibilityLabel={label}
        style={styles.input}
      />
    </View>
  );
}

export function EmailField(props: TextInputProps) {
  return <AuthField {...props} label="Email" autoComplete="email" keyboardType="email-address" />;
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
