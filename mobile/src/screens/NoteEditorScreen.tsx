import { usePreventRemove } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../auth/AuthProvider';
import { PaperGrid } from '../board/PaperGrid';
import { paper } from '../board/theme';
import type { ScreenProps } from '../navigation/types';
import { noteCategories } from '../notes/categories';
import { createNote, deleteNote, getNote, NoteError, updateNote, type Note, type NoteDraft } from '../notes/notes';

type EditorProps = ScreenProps<'NoteEditor'>;
type LoadedNote =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'missing' }
  | { status: 'ready'; note: Note | null };

const formatTimestamp = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function NoteEditorScreen({ navigation, route }: EditorProps) {
  const { session } = useAuth();
  if (session.status !== 'ready' || !session.user) return null;
  return <NoteEditor key={route.key} ownerId={session.user.id} params={route.params} navigation={navigation} />;
}

function NoteEditor({
  ownerId,
  params,
  navigation,
}: {
  ownerId: string;
  params: EditorProps['route']['params'];
  navigation: EditorProps['navigation'];
}) {
  const noteId = params.mode === 'edit' ? params.noteId : null;
  const [loaded, setLoaded] = useState<LoadedNote>(
    noteId ? { status: 'loading' } : { status: 'ready', note: null },
  );
  const [attempt, setAttempt] = useState(0);
  const [draft, setDraft] = useState<NoteDraft>({
    title: '',
    body: '',
    category: params.mode === 'create' ? params.category ?? null : null,
  });
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState('');
  const writing = useRef(false);

  useEffect(() => {
    if (!noteId) return;
    let active = true;

    void getNote(ownerId, noteId).then(
      (note) => {
        if (!active) return;
        if (note) {
          setDraft({ title: note.title, body: note.body, category: note.category });
          setLoaded({ status: 'ready', note });
        } else {
          setLoaded({ status: 'missing' });
        }
      },
      () => {
        if (active) setLoaded({ status: 'error' });
      },
    );
    return () => {
      active = false;
    };
  }, [noteId, ownerId, attempt]);

  usePreventRemove(busy, () => {});

  useEffect(() => {
    if (finished && !busy && navigation.isFocused()) navigation.goBack();
  }, [busy, finished, navigation]);

  async function save() {
    if (noteId) await updateNote(ownerId, noteId, draft);
    else await createNote(ownerId, draft);
  }

  async function write(action: () => Promise<unknown>, fallback: string) {
    if (writing.current || !navigation.isFocused()) return;
    writing.current = true;
    setBusy(true);
    setError('');
    try {
      await action();
      setFinished(true);
    } catch (failure) {
      writing.current = false;
      setError(failure instanceof NoteError ? failure.message : fallback);
    } finally {
      setBusy(false);
    }
  }

  function confirmDelete() {
    if (!noteId) return;
    Alert.alert('Delete this note?', 'This permanently removes the note.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => void write(() => deleteNote(ownerId, noteId), 'Could not delete your note. Try again.'),
      },
    ]);
  }

  const locked = busy || finished;

  return (
    <SafeAreaView style={styles.page} edges={['left', 'right', 'bottom']}>
      <PaperGrid />
      <KeyboardAvoidingView style={styles.frame} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          {loaded.status === 'loading' ? (
            <ActivityIndicator color={paper.muted} accessibilityLabel="Loading note" />
          ) : null}
          {loaded.status === 'error' ? (
            <>
              <Text style={styles.error} accessibilityRole="alert">Could not open this note.</Text>
              <Pressable
                accessibilityRole="button"
                style={styles.primary}
                onPress={() => {
                  setLoaded({ status: 'loading' });
                  setAttempt((count) => count + 1);
                }}
              >
                <Text style={styles.primaryText}>Try again</Text>
              </Pressable>
            </>
          ) : null}
          {loaded.status === 'missing' ? (
            <Text style={styles.error} accessibilityRole="alert">This note is no longer available.</Text>
          ) : null}
          {loaded.status === 'ready' ? (
            <>
              <View style={styles.field}>
                <Text style={styles.label}>Title (optional)</Text>
                <TextInput
                  accessibilityLabel="Title (optional)"
                  editable={!locked}
                  onChangeText={(title) => setDraft((current) => ({ ...current, title }))}
                  style={styles.input}
                  value={draft.title}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Note</Text>
                <TextInput
                  accessibilityLabel="Note"
                  editable={!locked}
                  multiline
                  onChangeText={(body) => setDraft((current) => ({ ...current, body }))}
                  style={[styles.input, styles.body]}
                  value={draft.body}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categories}>
                  {noteCategories.map((category) => {
                    const selected = draft.category === category;
                    return (
                      <Pressable
                        key={category}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selected, disabled: locked }}
                        disabled={locked}
                        onPress={() => setDraft((current) => ({ ...current, category }))}
                        style={[styles.category, selected && styles.selectedCategory]}
                      >
                        <Text style={[styles.categoryText, selected && styles.primaryText]}>{category}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {loaded.note ? (
                <View style={styles.timestamps}>
                  <Text style={styles.timestamp}>Added {formatTimestamp.format(loaded.note.createdAt)}</Text>
                  {loaded.note.updatedAt !== null ? (
                    <Text style={styles.timestamp}>Edited {formatTimestamp.format(loaded.note.updatedAt)}</Text>
                  ) : null}
                </View>
              ) : null}

              {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: locked, busy }}
                disabled={locked}
                onPress={() => void write(save, 'Could not save your note. Try again.')}
                style={[styles.primary, locked && styles.disabled]}
              >
                <Text style={styles.primaryText}>{busy ? 'Working…' : 'Save note'}</Text>
              </Pressable>
              {noteId ? (
                <Pressable
                  accessibilityRole="button"
                  disabled={locked}
                  onPress={confirmDelete}
                  style={[styles.delete, locked && styles.disabled]}
                >
                  <Text style={styles.error}>Delete note</Text>
                </Pressable>
              ) : null}
            </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: paper.background },
  frame: { flex: 1 },
  form: { gap: 18, padding: 20, paddingBottom: 30, width: '100%', maxWidth: 640, alignSelf: 'center' },
  field: { gap: 6 },
  label: { color: paper.ink, fontSize: 15, fontWeight: '700' },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: paper.outline,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: paper.white,
    color: paper.ink,
    fontSize: 16,
  },
  body: { minHeight: 160, textAlignVertical: 'top' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  category: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: paper.white,
    borderColor: paper.outline,
    borderWidth: 1,
    borderRadius: 24,
  },
  categoryText: { color: paper.ink, fontWeight: '600' },
  selectedCategory: { backgroundColor: paper.ink, borderColor: paper.ink },
  timestamps: { gap: 3 },
  timestamp: { color: paper.muted, fontSize: 13 },
  primary: {
    minHeight: 48,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: paper.ink,
  },
  primaryText: { color: paper.white, fontWeight: '700' },
  disabled: { opacity: 0.6 },
  delete: { minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#982c2d', fontWeight: '600' },
});
