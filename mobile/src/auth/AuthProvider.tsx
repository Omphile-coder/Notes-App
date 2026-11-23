import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { authenticate, getAccount, updateAccount, type Account, type ProfileUpdate } from './accounts';
import { clearSession, readSession, writeSession } from './session';

type SessionState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; user: Account | null };

type Auth = {
  session: SessionState;
  retry: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  saveProfile: (input: ProfileUpdate) => Promise<void>;
};

const AuthContext = createContext<Auth | null>(null);

// Shares session state and account actions with the app.
// Restores the saved session and exposes sign-in and profile operations.
export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<SessionState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    // Restores the account associated with the saved session.
    async function restoreSession() {
      try {
        const id = await readSession();
        const user = id ? await getAccount(id) : null;
        if (id && !user) await clearSession();
        if (active) setSession({ status: 'ready', user });
      } catch {
        if (active) setSession({ status: 'error' });
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, [attempt]);

  // Restarts session restoration after an initialization error.
  function retry() {
    setSession({ status: 'loading' });
    setAttempt((value) => value + 1);
  }

  // Authenticates an account and stores it as the active session.
  async function signIn(email: string, password: string) {
    const user = await authenticate(email, password);
    await writeSession(user.id);
    setSession({ status: 'ready', user });
  }

  // Clears the active session and signed-in account state.
  async function signOut() {
    await clearSession();
    setSession({ status: 'ready', user: null });
  }

  // Updates the signed-in account profile and refreshes auth state.
  async function saveProfile(input: ProfileUpdate) {
    if (session.status !== 'ready' || !session.user) {
      throw new Error('A signed-in account is required to edit a profile.');
    }
    const user = await updateAccount(session.user.id, input);
    setSession((current) => {
      if (current.status !== 'ready' || current.user?.id !== user.id) return current;
      return { status: 'ready', user };
    });
  }

  return (
    <AuthContext.Provider value={{ session, retry, signIn, signOut, saveProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// Reads the nearest authentication context and guards misuse.
export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth must be used inside AuthProvider.');
  return auth;
}
