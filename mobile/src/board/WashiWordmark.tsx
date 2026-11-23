import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Tape } from './Tape';
import { noteColours, paper } from './theme';

// Renders the branded Washi Notes wordmark with tape decoration.
export function WashiWordmark({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.wordmark, style]} accessible accessibilityLabel="Washi Notes">
      <Tape
        background={noteColours.pink.tape}
        stripe={noteColours.pink.stripe}
        style={styles.tape}
      />
      <Text style={styles.brand}>
        washi<Text style={styles.brandLight}> notes</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wordmark: { paddingVertical: 4, paddingRight: 4 },
  brand: { color: paper.ink, fontSize: 24, fontWeight: '900', letterSpacing: -1.1 },
  brandLight: { color: paper.muted, fontWeight: '600' },
  tape: { left: -3, bottom: 6, width: 74, height: 12 },
});
