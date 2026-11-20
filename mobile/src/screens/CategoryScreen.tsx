import { Button, StyleSheet, View } from 'react-native';

import type { ScreenProps } from '../navigation/types';

export function CategoryScreen({ navigation, route }: ScreenProps<'Category'>) {
  const { category } = route.params;

  return (
    <View style={styles.content}>
      <Button
        title={`New ${category.toLowerCase()} note`}
        onPress={() => navigation.navigate('NoteEditor', { mode: 'create', category })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
});
