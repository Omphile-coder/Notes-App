import { WashiBoard } from '../board/WashiBoard';
import type { ScreenProps } from '../navigation/types';

// Connects the main board to category, profile, and editor routes.
export function BoardScreen({ navigation }: ScreenProps<'Board'>) {
  return (
    <WashiBoard
      header={{
        onCategory: (category) => navigation.navigate('Category', { category }),
        onProfile: () => navigation.navigate('Profile'),
      }}
      onOpenNote={(noteId) => navigation.navigate('NoteEditor', { mode: 'edit', noteId })}
      onNewNote={() => navigation.navigate('NoteEditor', { mode: 'create' })}
    />
  );
}
