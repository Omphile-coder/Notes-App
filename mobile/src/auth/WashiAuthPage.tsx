import { Caveat_400Regular } from '@expo-google-fonts/caveat/400Regular';
import { useFonts } from 'expo-font';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaperGrid } from '../board/PaperGrid';
import { Tape } from '../board/Tape';
import { noteColours, paper } from '../board/theme';
import { WashiWordmark } from '../board/WashiWordmark';

type Props = {
  title: string;
  colour: 'yellow' | 'pink';
  error: string;
  notice?: string;
  actions: ReactNode;
};

export function WashiAuthPage({ title, colour, error, notice, children, actions }: PropsWithChildren<Props>) {
  const [fontLoaded] = useFonts({ Caveat_400Regular });
  const palette = noteColours[colour];

  return (
    <SafeAreaView style={styles.page}>
      <PaperGrid />
      <KeyboardAvoidingView
        style={styles.frame}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.sheetGroup}>
            <WashiWordmark style={styles.wordmark} />
            <View style={[styles.sheet, { backgroundColor: palette.paper }]}>
              <Tape background={palette.tape} stripe={palette.stripe} style={styles.tape} />
              <Text accessibilityRole="header" style={[styles.title, fontLoaded && styles.handwritten]}>
                {title}
              </Text>
              {notice && !error ? (
                <Text accessibilityRole="alert" style={styles.notice}>{notice}</Text>
              ) : null}
              <View style={styles.fields}>{children}</View>
              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
              <View style={styles.actions}>{actions}</View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function WashiAuthButton({
  title,
  onPress,
  disabled = false,
  busy = false,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, busy }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        (pressed || disabled) && styles.dimmed,
      ]}
    >
      <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: paper.background },
  frame: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 28 },
  sheetGroup: { width: '100%', maxWidth: 420, alignSelf: 'center', gap: 22 },
  wordmark: { alignSelf: 'flex-start' },
  sheet: {
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 14,
    boxShadow: '0 10px 20px rgba(54, 41, 24, 0.13)',
  },
  tape: { alignSelf: 'center', top: -9 },
  title: { color: paper.ink, fontSize: 28, fontWeight: '700' },
  handwritten: { fontFamily: 'Caveat_400Regular', fontSize: 38, fontWeight: '400' },
  fields: { gap: 12 },
  actions: { gap: 8, marginTop: 4 },
  notice: { color: paper.ink, backgroundColor: noteColours.green.paper, padding: 10, borderRadius: 8 },
  error: { color: '#8c2426', fontWeight: '600' },
  button: {
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: paper.ink,
    borderWidth: 1,
    borderColor: paper.ink,
  },
  buttonText: { color: paper.white, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  secondary: { backgroundColor: paper.white, borderColor: paper.outline },
  secondaryText: { color: paper.ink },
  dimmed: { opacity: 0.65 },
});
