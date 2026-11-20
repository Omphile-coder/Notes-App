import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';

import type { BoardNote } from './sampleNotes';
import { Tape } from './Tape';
import { noteColours, paper } from './theme';

export function NoteCard({
  note,
  compact,
  handwritten,
}: {
  note: BoardNote;
  compact: boolean;
  handwritten: boolean;
}) {
  const colours = noteColours[note.colour];
  const outstanding = note.checklist?.filter((item) => !item.checked) ?? [];
  const completed = (note.checklist?.length ?? 0) - outstanding.length;
  const writing = [styles.writing, handwritten && styles.handwritten];

  return (
    <View style={[styles.card, compact && styles.compact, { backgroundColor: colours.paper }]}>
      <Tape background={colours.tape} stripe={colours.stripe} style={styles.tape} />
      {note.pinned ? (
        <View style={styles.pin} accessibilityLabel="Pinned" accessible>
          <MaterialCommunityIcons name="pin" size={17} color={paper.ink} />
        </View>
      ) : null}

      {note.title ? <Text style={styles.title}>{note.title}</Text> : null}
      {note.body ? <Text style={writing}>{note.body}</Text> : null}
      {outstanding.map((item) => (
        <View key={item.text} style={styles.checkItem}>
          <View style={styles.checkSquare} />
          <Text style={[writing, styles.checkText]}>{item.text}</Text>
        </View>
      ))}
      {completed > 0 ? (
        <Text style={styles.completed}>
          + {completed} checked {completed === 1 ? 'item' : 'items'}
        </Text>
      ) : null}

      <View style={[styles.tag, { backgroundColor: colours.tag }]}>
        <Text style={styles.tagText}>{note.category}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 15,
    paddingTop: 28,
    paddingBottom: 14,
    gap: 5,
    boxShadow: '0 10px 20px rgba(54, 41, 24, 0.13)',
  },
  compact: { minHeight: 164 },
  tape: { top: -9, alignSelf: 'center' },
  pin: { position: 'absolute', top: 12, right: 10, opacity: 0.85 },
  title: { color: paper.ink, fontSize: 16, fontWeight: '700' },
  writing: { color: paper.ink, fontSize: 16, fontStyle: 'italic' },
  handwritten: { fontFamily: 'Caveat_400Regular', fontSize: 21, fontStyle: 'normal' },
  checkItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
  checkSquare: {
    width: 13,
    height: 13,
    borderWidth: 1.4,
    borderColor: 'rgba(65, 55, 44, 0.55)',
    borderRadius: 3,
    marginTop: 5,
  },
  checkText: { flex: 1, minWidth: 0 },
  completed: { color: paper.muted, fontSize: 12 },
  tag: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 16,
  },
  tagText: { color: paper.ink, fontSize: 11 },
});
