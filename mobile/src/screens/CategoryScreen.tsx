import { WashiBoard } from '../board/WashiBoard';
import type { ScreenProps } from '../navigation/types';

export function CategoryScreen({ navigation, route }: ScreenProps<'Category'>) {
  const { category } = route.params;

  return (
    <WashiBoard
      category={category}
      onNewNote={() => navigation.navigate('NoteEditor', { mode: 'create', category })}
    />
  );
}
