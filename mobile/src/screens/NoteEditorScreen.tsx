import { StyleSheet, Text, View } from 'react-native';

import type { ScreenProps } from '../navigation/types';

export function NoteEditorScreen({ route }: ScreenProps<'NoteEditor'>) {
  const params = route.params;

  return (
    <View style={styles.content}>
      {params.mode === 'edit' ? (
        <Text>Note ID: {params.noteId}</Text>
      ) : (
        <Text>{params.category ? `Category: ${params.category}` : 'Choose a category'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
});
