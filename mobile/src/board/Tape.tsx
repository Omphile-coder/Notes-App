import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type Props = {
  background: string;
  stripe: string;
  style?: StyleProp<ViewStyle>;
};

const stripes = [-7, 7, 21, 35, 49, 63, 77, 91];

export function Tape({ background, stripe, style }: Props) {
  return (
    <View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      style={[styles.tape, { backgroundColor: background }, style]}
    >
      {stripes.map((left) => (
        <View key={left} style={[styles.stripe, { left, backgroundColor: stripe }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tape: {
    position: 'absolute',
    width: 68,
    height: 18,
    overflow: 'hidden',
    opacity: 0.86,
    transform: [{ rotate: '-4deg' }],
  },
  stripe: {
    position: 'absolute',
    width: 6,
    height: 44,
    top: -13,
    transform: [{ rotate: '43deg' }],
  },
});
