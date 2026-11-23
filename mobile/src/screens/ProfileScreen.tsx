import { useState } from 'react';

import { AuthField, EmailField, useAuthAction } from '../auth/AuthForm';
import { useAuth } from '../auth/AuthProvider';
import type { Account } from '../auth/accounts';
import { WashiAuthButton, WashiAuthPage } from '../auth/WashiAuthPage';

// Guards the profile form with the currently signed-in account.
export function ProfileScreen() {
  const { session } = useAuth();
  if (session.status !== 'ready' || !session.user) return null;
  return <ProfileForm key={session.user.id} account={session.user} />;
}

// Displays editable profile and password fields with save and sign-out actions.
function ProfileForm({ account }: { account: Account }) {
  const { saveProfile, signOut } = useAuth();
  const { busy, error, run } = useAuthAction();
  const [username, setUsername] = useState(account.username);
  const [email, setEmail] = useState(account.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saved, setSaved] = useState(false);

  // Applies profile edits and clears password fields after success.
  async function save() {
    setSaved(false);
    await saveProfile({ username, email, currentPassword, newPassword });
    setUsername(username.trim());
    setEmail(email.trim().toLowerCase());
    setCurrentPassword('');
    setNewPassword('');
    setSaved(true);
  }

  return (
    <WashiAuthPage
      title="Profile"
      colour="green"
      belowHeader
      error={error}
      notice={saved ? 'Profile saved.' : undefined}
      actions={(
        <>
          <WashiAuthButton
            title="Save profile"
            disabled={busy || !currentPassword}
            busy={busy}
            onPress={() => void run(save, 'Unable to save your profile. Try again.')}
          />
          <WashiAuthButton
            title="Sign out"
            secondary
            disabled={busy}
            onPress={() => void run(signOut, 'Unable to sign out. Try again.')}
          />
        </>
      )}
    >
      <AuthField
        label="Username"
        value={username}
        onChangeText={(value) => { setSaved(false); setUsername(value); }}
        editable={!busy}
        autoComplete="username"
      />
      <EmailField
        value={email}
        onChangeText={(value) => { setSaved(false); setEmail(value); }}
        editable={!busy}
      />
      <AuthField
        label="Current password"
        placeholder="Enter your current password"
        value={currentPassword}
        onChangeText={(value) => { setSaved(false); setCurrentPassword(value); }}
        editable={!busy}
        autoComplete="current-password"
        secureTextEntry
      />
      <AuthField
        label="New password (optional)"
        placeholder="Enter a new password"
        value={newPassword}
        onChangeText={(value) => { setSaved(false); setNewPassword(value); }}
        editable={!busy}
        autoComplete="new-password"
        secureTextEntry
      />
    </WashiAuthPage>
  );
}
