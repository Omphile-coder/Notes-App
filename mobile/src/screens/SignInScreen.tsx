import { useEffect, useState } from 'react';
import { Button, Text } from 'react-native';

import { AuthField, AuthForm, EmailField, useAuthAction } from '../auth/AuthForm';
import { useAuth } from '../auth/AuthProvider';
import type { ScreenProps } from '../navigation/types';

export function SignInScreen({ navigation, route }: ScreenProps<'SignIn'>) {
  const { signIn } = useAuth();
  const { busy, error, run } = useAuthAction();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registeredEmail = route.params?.registeredEmail;

  useEffect(() => {
    if (registeredEmail) {
      setEmail(registeredEmail);
      setPassword('');
    }
  }, [registeredEmail]);

  return (
    <AuthForm error={error}>
      {registeredEmail && !error ? (
        <Text accessibilityRole="alert">Account created. Sign in to continue.</Text>
      ) : null}
      <EmailField value={email} onChangeText={setEmail} editable={!busy} />
      <AuthField
        label="Password"
        value={password}
        onChangeText={setPassword}
        editable={!busy}
        autoComplete="current-password"
        secureTextEntry
      />
      <Button
        title={busy ? 'Signing in…' : 'Sign in'}
        disabled={busy || !email.trim() || !password}
        onPress={() => void run(() => signIn(email, password), 'Unable to sign in. Try again.')}
      />
      <Button
        title="Create an account"
        disabled={busy}
        onPress={() => {
          setPassword('');
          navigation.navigate('Register');
        }}
      />
    </AuthForm>
  );
}
