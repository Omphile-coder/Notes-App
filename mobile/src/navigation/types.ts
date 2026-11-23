import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { NoteCategory } from '../notes/categories';

// Defines route names and parameters for the native stack navigator.
export type RootStackParamList = {
  SignIn: { registeredEmail: string } | undefined;
  Register: undefined;
  Board: undefined;
  Category: { category: NoteCategory };
  NoteEditor:
    | { mode: 'create'; category?: NoteCategory }
    | { mode: 'edit'; noteId: string };
  Profile: undefined;
};

export type ScreenProps<RouteName extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, RouteName>;
