import { useState } from 'react';
import { Button, Text } from 'react-native';

import { AuthField, AuthForm, EmailField, useAuthAction } from '../auth/AuthForm';
import { useAuth } from '../auth/AuthProvider';
import type { Account } from '../auth/accounts';

export function ProfileScreen() {
  const { session } = useAuth();
  if (session.status !== 'ready' || !session.user) return null;
  return <ProfileForm key={session.user.id} account={session.user} />;
}

function ProfileForm({ account }: { account: Account }) {
  const { saveProfile, signOut } = useAuth();
  const { busy, error, run } = useAuthAction();
  const [username, setUsername] = useState(account.username);
  const [email, setEmail] = useState(account.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saved, setSaved] = useState(false);

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
    <AuthForm error={error}>
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
        value={currentPassword}
        onChangeText={(value) => { setSaved(false); setCurrentPassword(value); }}
        editable={!busy}
        autoComplete="current-password"
        secureTextEntry
      />
      <AuthField
        label="New password (optional)"
        value={newPassword}
        onChangeText={(value) => { setSaved(false); setNewPassword(value); }}
        editable={!busy}
        autoComplete="new-password"
        secureTextEntry
      />
      <Button
        title="Save profile"
        disabled={busy || !currentPassword}
        onPress={() => void run(save, 'Unable to save your profile. Try again.')}
      />
      <Button
        title="Sign out"
        disabled={busy}
        onPress={() => void run(signOut, 'Unable to sign out. Try again.')}
      />
      {saved && !error ? <Text accessibilityRole="alert">Profile saved.</Text> : null}
    </AuthForm>
  );
}
