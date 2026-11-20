import * as SecureStore from 'expo-secure-store';

const sessionKey = 'washi.session.account';
const options = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

export function readSession() {
  return SecureStore.getItemAsync(sessionKey, options);
}

export function writeSession(accountId: string) {
  return SecureStore.setItemAsync(sessionKey, accountId, options);
}

export function clearSession() {
  return SecureStore.deleteItemAsync(sessionKey, options);
}
