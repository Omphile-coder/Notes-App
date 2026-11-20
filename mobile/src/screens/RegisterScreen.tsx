import { useState } from 'react';

import { AuthField, EmailField, useAuthAction } from '../auth/AuthForm';
import { AuthError, createAccount } from '../auth/accounts';
import { WashiAuthButton, WashiAuthPage } from '../auth/WashiAuthPage';
import type { ScreenProps } from '../navigation/types';

export function RegisterScreen({ navigation }: ScreenProps<'Register'>) {
  const { busy, error, run } = useAuthAction();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  async function register() {
    if (password !== confirmation) throw new AuthError('The passwords do not match.');
    await createAccount({ username, email, password });
    if (navigation.isFocused()) {
      navigation.popTo('SignIn', { registeredEmail: email.trim().toLowerCase() });
    }
  }

  return (
    <WashiAuthPage
      title="Create an account"
      colour="pink"
      error={error}
      actions={(
        <>
          <WashiAuthButton
            title={busy ? 'Creating account…' : 'Create account'}
            disabled={busy}
            busy={busy}
            onPress={() => void run(register, 'Unable to create an account. Try again.')}
          />
          <WashiAuthButton
            title="Back to sign in"
            secondary
            disabled={busy}
            onPress={() => navigation.goBack()}
          />
        </>
      )}
    >
      <AuthField
        label="Username"
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        editable={!busy}
        autoComplete="username"
      />
      <EmailField value={email} onChangeText={setEmail} editable={!busy} />
      <AuthField
        label="Password"
        placeholder="Create a password"
        value={password}
        onChangeText={setPassword}
        editable={!busy}
        autoComplete="new-password"
        secureTextEntry
      />
      <AuthField
        label="Confirm password"
        placeholder="Re-enter your password"
        value={confirmation}
        onChangeText={setConfirmation}
        editable={!busy}
        secureTextEntry
      />
    </WashiAuthPage>
  );
}
