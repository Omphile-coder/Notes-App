import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { paper } from './theme';

const spacing = 20;

export function PaperGrid() {
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });

  return (
    <View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      style={styles.grid}
      onLayout={({ nativeEvent: { layout } }) => {
        setSize({ width: layout.width, height: layout.height });
      }}
    >
      {Array.from({ length: Math.ceil(width / spacing) }, (_, column) => (
        <View key={column} style={[styles.vertical, { left: column * spacing }]} />
      ))}
      {Array.from({ length: Math.ceil(height / spacing) }, (_, row) => (
        <View key={row} style={[styles.horizontal, { top: row * spacing }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  vertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: paper.grid,
  },
  horizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.grid,
  },
});
