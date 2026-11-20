import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../auth/AuthProvider';
import { paper } from '../board/theme';
import { BoardScreen } from '../screens/BoardScreen';
import { CategoryScreen } from '../screens/CategoryScreen';
import { NoteEditorScreen } from '../screens/NoteEditorScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { SignInScreen } from '../screens/SignInScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { session, retry } = useAuth();

  if (session.status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator accessibilityLabel="Loading session" size="large" />
      </View>
    );
  }

  if (session.status === 'error') {
    return (
      <View style={styles.center}>
        <Text accessibilityRole="alert">Could not open your session.</Text>
        <Button title="Try again" onPress={retry} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session.user ? (
          <>
            <Stack.Screen name="Board" component={BoardScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Category"
              component={CategoryScreen}
              options={({ route }) => ({
                title: route.params.category,
                headerStyle: { backgroundColor: paper.background },
                headerTintColor: paper.ink,
                headerShadowVisible: false,
              })}
            />
            <Stack.Screen
              name="NoteEditor"
              component={NoteEditorScreen}
              options={({ route }) => ({
                title: route.params.mode === 'edit' ? 'Edit note' : 'New note',
              })}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 },
});
