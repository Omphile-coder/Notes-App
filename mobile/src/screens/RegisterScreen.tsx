import { useState } from 'react';
import { Button } from 'react-native';

import { AuthField, AuthForm, EmailField, useAuthAction } from '../auth/AuthForm';
import { AuthError, createAccount } from '../auth/accounts';
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
    <AuthForm error={error}>
      <AuthField
        label="Username"
        value={username}
        onChangeText={setUsername}
        editable={!busy}
        autoComplete="username"
      />
      <EmailField value={email} onChangeText={setEmail} editable={!busy} />
      <AuthField
        label="Password"
        value={password}
        onChangeText={setPassword}
        editable={!busy}
        autoComplete="new-password"
        secureTextEntry
      />
      <AuthField
        label="Confirm password"
        value={confirmation}
        onChangeText={setConfirmation}
        editable={!busy}
        secureTextEntry
      />
      <Button
        title={busy ? 'Creating account…' : 'Create account'}
        disabled={busy}
        onPress={() => void run(register, 'Unable to create an account. Try again.')}
      />
    </AuthForm>
  );
}
