import type { NoteCategory } from '../notes/categories';
import type { noteColours } from './theme';

export type BoardNote = {
  id: string;
  title?: string;
  category: NoteCategory;
  colour: keyof typeof noteColours;
  pinned?: boolean;
  body?: string;
  checklist?: readonly { text: string; checked?: boolean }[];
};

export const sampleNotes: readonly BoardNote[] = [
  {
    id: 'groceries',
    title: 'Groceries',
    category: 'Personal',
    colour: 'yellow',
    pinned: true,
    checklist: [
      { text: 'Oat milk' },
      { text: 'Basil' },
      { text: 'Lemons' },
      { text: 'Eggs', checked: true },
    ],
  },
  {
    id: 'this-week',
    title: 'This week',
    category: 'Work',
    colour: 'pink',
    pinned: true,
    checklist: [
      { text: 'Send the November invoices' },
      { text: 'Confirm Friday’s meeting' },
      { text: 'Review the brief' },
    ],
  },
  {
    id: 'garden',
    category: 'Personal',
    colour: 'green',
    body: 'Ideas for the garden: tomatoes, basil, one lemon tree',
  },
  {
    id: 'library',
    title: 'Library',
    category: 'Study',
    colour: 'pink',
    body: 'Return the design books by Friday',
  },
];

export function matchesBoardSearch(note: BoardNote, query: string) {
  const text = [
    note.title,
    note.body,
    note.category,
    ...(note.checklist?.map((item) => item.text) ?? []),
  ].join(' ').toLowerCase();

  return query.trim().toLowerCase().split(/\s+/).every((word) => text.includes(word));
}
