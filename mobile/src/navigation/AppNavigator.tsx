import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BoardScreen } from '../screens/BoardScreen';
import { CategoryScreen } from '../screens/CategoryScreen';
import {
  NoteEditorScreen,
  ProfileScreen,
  RegisterScreen,
  SignInScreen,
} from '../screens/PlaceholderScreens';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Washi Notes' }} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Board" component={BoardScreen} />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={({ route }) => ({ title: route.params.category })}
        />
        <Stack.Screen
          name="NoteEditor"
          component={NoteEditorScreen}
          options={({ route }) => ({
            title: route.params.mode === 'edit' ? 'Edit note' : 'New note',
          })}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
