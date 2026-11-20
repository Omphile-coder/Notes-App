import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

let databasePromise: Promise<SQLiteDatabase> | undefined;

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

      CREATE INDEX IF NOT EXISTS notes_owner_created
      ON notes (ownerId, createdAt DESC);
    `);
    return database;
  } catch (error) {
    await database.closeAsync();
    throw error;
  }
}

export function getDatabase() {
  databasePromise ??= openDatabase().catch((error: unknown) => {
    databasePromise = undefined;
    throw error;
  });
  return databasePromise;
}
