import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Note } from '../notes/notes';
import { Tape } from './Tape';
import { noteColours, paper } from './theme';

const colourByCategory = { Personal: 'yellow', Work: 'pink', Study: 'green' } as const;

export function NoteCard({
  note,
  compact,
  handwritten,
  onPress,
}: {
  note: Note;
  compact: boolean;
  handwritten: boolean;
  onPress: () => void;
}) {
  const colours = noteColours[colourByCategory[note.category]];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={note.title || note.body.replace(/\s+/g, ' ').slice(0, 100)}
      accessibilityHint="Opens the note editor"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.compact,
        { backgroundColor: colours.paper },
        pressed && styles.pressed,
      ]}
    >
      <Tape background={colours.tape} stripe={colours.stripe} style={styles.tape} />
      {note.title ? <Text numberOfLines={2} style={styles.title}>{note.title}</Text> : null}
      <Text numberOfLines={4} style={[styles.writing, handwritten && styles.handwritten]}>
        {note.body}
      </Text>
      <View style={[styles.tag, { backgroundColor: colours.tag }]}>
        <Text style={styles.tagText}>{note.category}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 15,
    paddingTop: 27,
    paddingBottom: 14,
    gap: 7,
    boxShadow: '0 10px 20px rgba(54, 41, 24, 0.13)',
  },
  compact: { minHeight: 158 },
  pressed: { opacity: 0.8 },
  tape: { top: -9, alignSelf: 'center' },
  title: { color: paper.ink, fontSize: 16, fontWeight: '700' },
  writing: { color: paper.ink, fontSize: 16, fontStyle: 'italic' },
  handwritten: { fontFamily: 'Caveat_400Regular', fontSize: 21, fontStyle: 'normal' },
  tag: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 16,
  },
  tagText: { color: paper.ink, fontSize: 11 },
});
