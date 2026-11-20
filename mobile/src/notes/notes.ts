import { randomUUID } from 'expo-crypto';

import { getDatabase } from '../storage/database';
import { noteCategories, type NoteCategory } from './categories';

export type NoteDraft = {
  title: string;
  body: string;
  category: NoteCategory | null;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  category: NoteCategory;
  createdAt: number;
  updatedAt: number | null;
};

export type NoteSortOrder = 'newest' | 'oldest';

export class NoteError extends Error {}

function validateNote(draft: NoteDraft) {
  const body = draft.body.trim();
  if (!body) throw new NoteError('Write your note before saving.');
  if (!draft.category || !noteCategories.includes(draft.category)) {
    throw new NoteError('Choose a category before saving.');
  }

  return { title: draft.title.trim(), body, category: draft.category };
}

export async function listNotes(
  ownerId: string,
  category?: NoteCategory,
  order: NoteSortOrder = 'newest',
) {
  const database = await getDatabase();
  const direction = order === 'oldest' ? 'ASC' : 'DESC';
  const categoryFilter = category ? ' AND category = ?' : '';
  const parameters = category ? [ownerId, category] : [ownerId];

  return database.getAllAsync<Note>(
    `SELECT id, title, body, category, createdAt, updatedAt
     FROM notes WHERE ownerId = ?${categoryFilter}
     ORDER BY createdAt ${direction}, rowid ${direction}`,
    ...parameters,
  );
}

export async function getNote(ownerId: string, id: string) {
  const database = await getDatabase();
  return database.getFirstAsync<Note>(
    'SELECT id, title, body, category, createdAt, updatedAt FROM notes WHERE ownerId = ? AND id = ?',
    ownerId,
    id,
  );
}

export async function createNote(ownerId: string, draft: NoteDraft) {
  const { title, body, category } = validateNote(draft);
  const database = await getDatabase();
  const id = randomUUID();
  await database.runAsync(
    'INSERT INTO notes (id, ownerId, title, body, category, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    id,
    ownerId,
    title,
    body,
    category,
    Date.now(),
  );
  return id;
}

export async function updateNote(ownerId: string, id: string, draft: NoteDraft) {
  const { title, body, category } = validateNote(draft);
  const database = await getDatabase();
  const result = await database.runAsync(
    'UPDATE notes SET title = ?, body = ?, category = ?, updatedAt = ? WHERE ownerId = ? AND id = ?',
    title,
    body,
    category,
    Date.now(),
    ownerId,
    id,
  );
  if (result.changes === 0) throw new NoteError('This note is no longer available.');
}

export async function deleteNote(ownerId: string, id: string) {
  const database = await getDatabase();
  const result = await database.runAsync(
    'DELETE FROM notes WHERE ownerId = ? AND id = ?',
    ownerId,
    id,
  );
  if (result.changes === 0) throw new NoteError('This note is no longer available.');
}

export function matchesNoteSearch(note: Note, query: string) {
  const text = `${note.title} ${note.body}`.toLowerCase();
  return query.trim().toLowerCase().split(/\s+/).every((word) => text.includes(word));
}
