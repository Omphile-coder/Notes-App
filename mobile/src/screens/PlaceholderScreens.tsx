import { Button, StyleSheet, Text, View } from 'react-native';

import type { ScreenProps } from '../navigation/types';

export function SignInScreen({ navigation }: ScreenProps<'SignIn'>) {
  return (
    <View style={styles.content}>
      <Button title="Create an account" onPress={() => navigation.navigate('Register')} />
      <Button title="Preview notes board" onPress={() => navigation.navigate('Board')} />
    </View>
  );
}

export function RegisterScreen() {
  return (
    <View style={styles.content}>
      <Text>Registration form coming in Step 3.</Text>
    </View>
  );
}

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

export function ProfileScreen() {
  return (
    <View style={styles.content}>
      <Text>Profile settings coming in Step 3.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    padding: 20,
  },
});
