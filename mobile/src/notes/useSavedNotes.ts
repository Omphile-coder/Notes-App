import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';

import { useAuth } from '../auth/AuthProvider';
import type { NoteCategory } from './categories';
import { listNotes, setNotePinned, type Note, type NoteSortOrder } from './notes';

type NotesState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; notes: Note[] };

// Loads notes for the signed-in account and handles pin updates.
// Refreshes data when navigation, filters, sort, or retry state changes.
export function useSavedNotes(order: NoteSortOrder, category?: NoteCategory) {
  const { session } = useAuth();
  const ownerId = session.status === 'ready' ? session.user?.id : undefined;
  const [state, setState] = useState<NotesState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  const pinRequest = useRef(false);
  const [pendingPinId, setPendingPinId] = useState<string | null>(null);
  const [pinError, setPinError] = useState('');

  useFocusEffect(useCallback(() => {
    if (!ownerId) return;

    let active = true;
    void listNotes(ownerId, category, order).then(
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
  }, [ownerId, category, order, attempt]));

  // Toggles one note pin and updates the loaded note state.
  async function changePin(note: Note) {
    if (!ownerId || pinRequest.current) return;
    const pinned = note.pinned === 0;
    pinRequest.current = true;
    setPendingPinId(note.id);
    setPinError('');
    try {
      await setNotePinned(ownerId, note.id, pinned);
      setState((current) => current.status === 'ready'
        ? {
            status: 'ready',
            notes: current.notes.map((item) => item.id === note.id
              ? { ...item, pinned: pinned ? 1 : 0 }
              : item),
          }
        : current);
      setAttempt((previous) => previous + 1);
    } catch {
      setPinError(pinned ? 'Could not pin this note. Try again.' : 'Could not unpin this note. Try again.');
    } finally {
      pinRequest.current = false;
      setPendingPinId(null);
    }
  }

  return {
    state,
    changePin,
    pendingPinId,
    pinError,
    retry: () => {
      setState({ status: 'loading' });
      setAttempt((previous) => previous + 1);
    },
  };
}
