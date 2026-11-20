import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { useAuth } from '../auth/AuthProvider';
import type { NoteCategory } from './categories';
import { listNotes, type Note } from './notes';

type NotesState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; notes: Note[] };

export function useSavedNotes(category?: NoteCategory) {
  const { session } = useAuth();
  const ownerId = session.status === 'ready' ? session.user?.id : undefined;
  const [state, setState] = useState<NotesState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useFocusEffect(useCallback(() => {
    if (!ownerId) return;

    let active = true;
    setState({ status: 'loading' });
    void listNotes(ownerId, category).then(
      (notes) => {
        if (active) setState({ status: 'ready', notes });
      },
      () => {
        if (active) setState({ status: 'error' });
      },
    );

    return () => {
      active = false;
    };
  }, [ownerId, category, attempt]));

  return {
    state,
    retry: () => setAttempt((previous) => previous + 1),
  };
}
