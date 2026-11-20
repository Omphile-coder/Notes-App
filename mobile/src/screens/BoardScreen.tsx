import { Button, ScrollView, StyleSheet } from 'react-native';

import type { ScreenProps } from '../navigation/types';
import { noteCategories } from '../notes/categories';

export function BoardScreen({ navigation }: ScreenProps<'Board'>) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {noteCategories.map((category) => (
        <Button
          key={category}
          title={category}
          onPress={() => navigation.navigate('Category', { category })}
        />
      ))}
      <Button
        title="New note"
        onPress={() => navigation.navigate('NoteEditor', { mode: 'create' })}
      />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    padding: 20,
  },
});
