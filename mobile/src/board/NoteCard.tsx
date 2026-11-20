import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
  onTogglePin,
  pinDisabled,
  pinBusy,
}: {
  note: Note;
  compact: boolean;
  handwritten: boolean;
  onPress: () => void;
  onTogglePin: () => void;
  pinDisabled: boolean;
  pinBusy: boolean;
}) {
  const colours = noteColours[colourByCategory[note.category]];

  const label = note.title || note.body.replace(/\s+/g, ' ').slice(0, 100);
  const pinned = note.pinned === 1;

  return (
    <View style={[styles.card, compact && styles.compact, { backgroundColor: colours.paper }]}>
      <Tape background={colours.tape} stripe={colours.stripe} style={styles.tape} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint="Opens the note editor"
        onPress={onPress}
        style={({ pressed }) => [styles.content, pressed && styles.pressed]}
      >
        {note.title ? <Text numberOfLines={2} style={styles.title}>{note.title}</Text> : null}
        <Text numberOfLines={4} style={[styles.writing, handwritten && styles.handwritten]}>
          {note.body}
        </Text>
        <View style={[styles.tag, { backgroundColor: colours.tag }]}>
          <Text style={styles.tagText}>{note.category}</Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${pinned ? 'Unpin' : 'Pin'} ${label}`}
        accessibilityState={{ busy: pinBusy, disabled: pinDisabled }}
        disabled={pinDisabled}
        onPress={onTogglePin}
        style={({ pressed }) => [
          styles.pin,
          pinned && { backgroundColor: colours.tag },
          (pressed || pinBusy) && styles.pressed,
        ]}
      >
        <MaterialCommunityIcons name={pinned ? 'pin' : 'pin-outline'} size={21} color={paper.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    boxShadow: '0 10px 20px rgba(54, 41, 24, 0.13)',
  },
  compact: { minHeight: 158 },
  content: { flex: 1, paddingHorizontal: 15, paddingTop: 47, paddingBottom: 14, gap: 7 },
  pin: {
    position: 'absolute',
    top: 3,
    right: 5,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
