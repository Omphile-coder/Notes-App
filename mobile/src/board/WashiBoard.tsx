import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Caveat_400Regular } from '@expo-google-fonts/caveat/400Regular';
import { InstrumentSerif_400Regular } from '@expo-google-fonts/instrument-serif/400Regular';
import { useFonts } from 'expo-font';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { noteCategories, type NoteCategory } from '../notes/categories';
import { NoteCard } from './NoteCard';
import { PaperGrid } from './PaperGrid';
import { matchesBoardSearch, sampleNotes, type BoardNote } from './sampleNotes';
import { Tape } from './Tape';
import { noteColours, paper } from './theme';

type Layout = 'Board' | 'List';
type HeaderActions = {
  onCategory: (category: NoteCategory) => void;
  onProfile: () => void;
};

type Props = {
  onNewNote: () => void;
} & ({ header: HeaderActions; category?: never } | { category: NoteCategory; header?: never });

const layouts: Layout[] = ['Board', 'List'];
const dateFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

export function WashiBoard({ category, header, onNewNote }: Props) {
  const [fontLoaded] = useFonts({ Caveat_400Regular, InstrumentSerif_400Regular });
  const [layout, setLayout] = useState<Layout>('Board');
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [query, setQuery] = useState('');
  const { width, fontScale } = useWindowDimensions();
  const inColumns = layout === 'Board' && width >= 350 && fontScale <= 1.3;

  const filtered = sampleNotes.filter(
    (note) => (!category || note.category === category) && matchesBoardSearch(note, query),
  );
  const pinned = filtered.filter((note) => note.pinned);
  const others = pinnedOnly ? [] : filtered.filter((note) => !note.pinned);

  return (
    <SafeAreaView style={styles.page} edges={header ? ['top', 'left', 'right', 'bottom'] : ['left', 'right', 'bottom']}>
      <PaperGrid />
      <View style={styles.frame}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.top}>
            {header ? (
              <View style={styles.wordmark} accessible accessibilityLabel="Washi Notes">
                <Tape
                  background={noteColours.pink.tape}
                  stripe={noteColours.pink.stripe}
                  style={styles.wordmarkTape}
                />
                <Text style={styles.brand}>
                  washi<Text style={styles.brandLight}> notes</Text>
                </Text>
              </View>
            ) : null}

            <View accessibilityRole="tablist" style={styles.switcher}>
              {layouts.map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: layout === option }}
                  onPress={() => setLayout(option)}
                  style={[styles.layoutOption, layout === option && styles.activeLayout]}
                >
                  <Text style={[styles.layoutLabel, layout === option && styles.activeLayoutLabel]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>

            {header ? (
              <Pressable
                accessibilityLabel="Open profile"
                accessibilityRole="button"
                onPress={header.onProfile}
                style={styles.profile}
              >
                <MaterialCommunityIcons name="dots-horizontal" size={24} color={paper.muted} />
              </Pressable>
            ) : null}
          </View>

          {header ? (
            <Text accessibilityRole="header" style={[styles.date, fontLoaded && styles.serif]}>
              {dateFormat.format(new Date())}
            </Text>
          ) : null}

          <View style={styles.search}>
            <MaterialCommunityIcons name="magnify" size={22} color={paper.muted} />
            <TextInput
              accessibilityLabel="Search your notes"
              onChangeText={setQuery}
              value={query}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Search your notes"
              placeholderTextColor={paper.muted}
              returnKeyType="search"
              style={styles.searchInput}
            />
            {query ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} style={styles.clear}>
                <MaterialCommunityIcons name="close" size={19} color={paper.muted} />
              </Pressable>
            ) : null}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.filters}
          >
            <Filter label="All" selected={!pinnedOnly} onPress={() => setPinnedOnly(false)} />
            <Filter label="Pinned" selected={pinnedOnly} onPress={() => setPinnedOnly(true)} />
            {header && noteCategories.map((name) => (
              <Filter key={name} label={name} onPress={() => header.onCategory(name)} />
            ))}
          </ScrollView>

          <View style={styles.sections}>
            <NoteSection title="Pinned" notes={pinned} inColumns={inColumns} handwritten={fontLoaded} />
            <NoteSection title="Others" notes={others} inColumns={inColumns} handwritten={fontLoaded} />
            {!pinned.length && !others.length ? (
              <Text style={styles.empty}>{query.trim() ? 'No matching notes.' : 'No notes here yet.'}</Text>
            ) : null}
          </View>
        </ScrollView>

        <Pressable
          accessibilityRole="button"
          onPress={onNewNote}
          style={({ pressed }) => [styles.newNote, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons name="plus" size={25} color={paper.white} />
          <Text style={styles.newNoteLabel}>New note</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Filter({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={selected === undefined ? undefined : { selected }}
      onPress={onPress}
      style={[styles.filter, selected && styles.activeFilter]}
    >
      <Text style={[styles.filterLabel, selected && styles.activeFilterLabel]}>{label}</Text>
    </Pressable>
  );
}

function NoteSection({
  title,
  notes,
  inColumns,
  handwritten,
}: {
  title: string;
  notes: readonly BoardNote[];
  inColumns: boolean;
  handwritten: boolean;
}) {
  if (!notes.length) return null;

  const rowSize = inColumns ? 2 : 1;
  const rows = Array.from(
    { length: Math.ceil(notes.length / rowSize) },
    (_, index) => notes.slice(index * rowSize, (index + 1) * rowSize),
  );

  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>{title}</Text>
      {rows.map((row) => (
        <View key={row[0].id} style={styles.row}>
          {row.map((note) => (
            <NoteCard key={note.id} note={note} compact={inColumns} handwritten={handwritten} />
          ))}
          {inColumns && row.length === 1 ? <View style={styles.emptyColumn} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: paper.background },
  frame: { flex: 1, width: '100%', maxWidth: 680, alignSelf: 'center' },
  scroll: { flex: 1 },
  content: { paddingTop: 16, paddingHorizontal: 16, paddingBottom: 88, gap: 14 },
  top: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, minHeight: 44 },
  wordmark: { flexGrow: 1, paddingVertical: 4, paddingRight: 4 },
  brand: { color: paper.ink, fontSize: 24, fontWeight: '900', letterSpacing: -1.1 },
  brandLight: { color: paper.muted, fontWeight: '600' },
  wordmarkTape: { left: -3, bottom: 6, width: 74, height: 12 },
  switcher: {
    flexDirection: 'row',
    borderRadius: 24,
    backgroundColor: paper.search,
    padding: 3,
    alignSelf: 'flex-start',
  },
  layoutOption: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeLayout: { backgroundColor: paper.white, boxShadow: '0 2px 5px rgba(40, 32, 22, 0.13)' },
  layoutLabel: { color: paper.muted, fontSize: 14, fontWeight: '700' },
  activeLayoutLabel: { color: paper.ink },
  profile: { minWidth: 40, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  date: { fontSize: 32, color: paper.ink, letterSpacing: -0.6 },
  serif: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 37, letterSpacing: 0 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    borderRadius: 15,
    backgroundColor: paper.search,
    paddingLeft: 12,
    paddingRight: 9,
    gap: 8,
  },
  searchInput: { flex: 1, minHeight: 46, paddingVertical: 8, color: paper.ink, fontSize: 16 },
  clear: { minWidth: 34, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  filters: { gap: 7, alignItems: 'center', paddingBottom: 2, paddingRight: 1 },
  filter: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: paper.outline,
    borderRadius: 22,
    backgroundColor: paper.white,
  },
  activeFilter: { backgroundColor: paper.ink, borderColor: paper.ink },
  filterLabel: { color: paper.muted, fontSize: 13, fontWeight: '700' },
  activeFilterLabel: { color: paper.white },
  sections: { gap: 34, marginTop: 14 },
  section: { gap: 16 },
  sectionTitle: { color: paper.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'stretch', gap: 14, paddingTop: 8 },
  emptyColumn: { flex: 1 },
  empty: { color: paper.muted, fontSize: 15, marginTop: 18 },
  newNote: {
    position: 'absolute',
    right: 16,
    bottom: 14,
    flexDirection: 'row',
    minHeight: 54,
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 19,
    paddingVertical: 8,
    borderRadius: 21,
    backgroundColor: paper.ink,
    boxShadow: '0 7px 16px rgba(40, 32, 22, 0.24)',
  },
  pressed: { opacity: 0.8 },
  newNoteLabel: { color: paper.white, fontSize: 16, fontWeight: '800' },
});
