import * as SecureStore from 'expo-secure-store';

const sessionKey = 'washi.session.account';
const options = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

// Reads the account identifier saved in secure device storage.
export function readSession() {
  return SecureStore.getItemAsync(sessionKey, options);
}

// Stores the signed-in account identifier securely.
export function writeSession(accountId: string) {
  return SecureStore.setItemAsync(sessionKey, accountId, options);
}

// Removes the saved account session from secure storage.
export function clearSession() {
  return SecureStore.deleteItemAsync(sessionKey, options);
}
