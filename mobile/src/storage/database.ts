import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

let databasePromise: Promise<SQLiteDatabase> | undefined;

// Opens SQLite and creates tables, indexes, and foreign-key behavior.
async function openDatabase() {
  const database = await openDatabaseAsync('washi-accounts.db');

  try {
    await database.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY NOT NULL,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        passwordSalt TEXT NOT NULL,
        passwordHash TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY NOT NULL,
        ownerId TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        category TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER
      );

      CREATE TABLE IF NOT EXISTS note_pins (
        noteId TEXT PRIMARY KEY NOT NULL REFERENCES notes(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS notes_owner_created
      ON notes (ownerId, createdAt DESC);
    `);
    return database;
  } catch (error) {
    await database.closeAsync();
    throw error;
  }
}

// Returns one shared database connection promise for the app.
// Resets the cached promise when opening or initialization fails.
export function getDatabase() {
  databasePromise ??= openDatabase().catch((error: unknown) => {
    databasePromise = undefined;
    throw error;
  });
  return databasePromise;
}
