import { argon2idAsync } from "@noble/hashes/argon2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { Buffer } from "buffer";
import { getRandomBytesAsync, randomUUID } from "expo-crypto";

import { getDatabase } from "../storage/database";

export type Account = {
  id: string;
  username: string;
  email: string;
};

type Credentials = {
  passwordSalt: string;
  passwordHash: string;
};

type StoredAccount = Account & Credentials;

export type Registration = {
  username: string;
  email: string;
  password: string;
};

export type ProfileUpdate = {
  username: string;
  email: string;
  currentPassword: string;
  newPassword: string;
};

// Represents validation or authentication failures shown to users.
export class AuthError extends Error {}

// Normalizes email input before validation or database lookup.
function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

// Validates profile text and returns normalized values.
function validateProfile(username: string, email: string) {
  const name = username.trim();
  const address = normalizeEmail(email);
  if (name.length < 2 || name.length > 50) {
    throw new AuthError("Enter a username between 2 and 50 characters.");
  }
  if (address.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
    throw new AuthError("Enter a valid email address.");
  }
  return { username: name, email: address };
}

// Enforces the supported password length and non-empty value.
function validateNewPassword(password: string) {
  if (password.length < 8 || password.length > 128 || !password.trim()) {
    throw new AuthError("Use a password between 8 and 128 characters.");
  }
}

// Derives a password hash with Argon2id from a salt.
function derivePassword(password: string, salt: Uint8Array) {
  const bytes = Buffer.from(password, "utf8");
  return argon2idAsync(bytes, salt, { m: 19_456, t: 2, p: 1, dkLen: 32 });
}

// Generates a random salt and password hash for secure account storage.
async function createCredentials(password: string): Promise<Credentials> {
  const salt = await getRandomBytesAsync(16);
  return {
    passwordSalt: bytesToHex(salt),
    passwordHash: bytesToHex(await derivePassword(password, salt)),
  };
}

// Checks a submitted password against stored credentials safely.
async function passwordMatches(password: string, credentials: Credentials) {
  if (password.length > 128) return false;
  const computed = await derivePassword(
    password,
    hexToBytes(credentials.passwordSalt),
  );
  const expected = hexToBytes(credentials.passwordHash);
  if (computed.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < computed.length; index += 1) {
    difference |= computed[index] ^ expected[index];
  }
  return difference === 0;
}

// Retrieves public account fields for a saved account identifier.
export async function getAccount(id: string) {
  const database = await getDatabase();
  return database.getFirstAsync<Account>(
    "SELECT id, username, email FROM accounts WHERE id = ?",
    id,
  );
}

// Validates and creates a locally stored account.
export async function createAccount(input: Registration) {
  const { username, email } = validateProfile(input.username, input.email);
  validateNewPassword(input.password);
  const id = randomUUID();
  const database = await getDatabase();
  const credentials = await createCredentials(input.password);

  const result = await database.runAsync(
    `INSERT INTO accounts (id, username, email, passwordSalt, passwordHash)
     VALUES (?, ?, ?, ?, ?) ON CONFLICT(email) DO NOTHING`,
    id,
    username,
    email,
    credentials.passwordSalt,
    credentials.passwordHash,
  );
  if (result.changes === 0) {
    throw new AuthError(
      "An account with this email already exists on this device.",
    );
  }
  return { id, username, email };
}

// Verifies email and password credentials for sign-in.
export async function authenticate(
  email: string,
  password: string,
): Promise<Account> {
  const database = await getDatabase();
  const account = await database.getFirstAsync<StoredAccount>(
    "SELECT * FROM accounts WHERE email = ?",
    normalizeEmail(email),
  );

  if (!account || !(await passwordMatches(password, account))) {
    throw new AuthError("Incorrect email or password.");
  }

  return { id: account.id, username: account.username, email: account.email };
}

// Updates account profile fields and optionally changes its password.
export async function updateAccount(
  id: string,
  input: ProfileUpdate,
): Promise<Account> {
  const { username, email } = validateProfile(input.username, input.email);
  if (input.newPassword) validateNewPassword(input.newPassword);

  const database = await getDatabase();
  const account = await database.getFirstAsync<StoredAccount>(
    "SELECT * FROM accounts WHERE id = ?",
    id,
  );
  if (!account || !(await passwordMatches(input.currentPassword, account))) {
    throw new AuthError("Your current password is incorrect.");
  }

  const credentials = input.newPassword
    ? await createCredentials(input.newPassword)
    : account;
  const result = await database.runAsync(
    `UPDATE OR IGNORE accounts
     SET username = ?, email = ?, passwordSalt = ?, passwordHash = ?
     WHERE id = ? AND username = ? AND email = ? AND passwordSalt = ? AND passwordHash = ?`,
    username,
    email,
    credentials.passwordSalt,
    credentials.passwordHash,
    id,
    account.username,
    account.email,
    account.passwordSalt,
    account.passwordHash,
  );

  if (result.changes === 0) {
    const conflict = await database.getFirstAsync<{ id: string }>(
      "SELECT id FROM accounts WHERE email = ? AND id <> ?",
      email,
      id,
    );
    if (conflict) {
      throw new AuthError(
        "An account with this email already exists on this device.",
      );
    }
    throw new AuthError(
      "Your profile changed while saving. Reopen Profile and try again.",
    );
  }
  return { id, username, email };
}
