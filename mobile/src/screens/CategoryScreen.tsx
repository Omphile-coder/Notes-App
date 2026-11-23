import { WashiBoard } from '../board/WashiBoard';
import type { ScreenProps } from '../navigation/types';

// Shows a filtered board for one selected note category.
export function CategoryScreen({ navigation, route }: ScreenProps<'Category'>) {
  const { category } = route.params;

  return (
    <WashiBoard
      key={category}
      category={category}
      onOpenNote={(noteId) => navigation.navigate('NoteEditor', { mode: 'edit', noteId })}
      onNewNote={() => navigation.navigate('NoteEditor', { mode: 'create', category })}
    />
  );
}
