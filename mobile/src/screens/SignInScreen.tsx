import { useEffect, useState } from "react";

import { AuthField, EmailField, useAuthAction } from "../auth/AuthForm";
import { useAuth } from "../auth/AuthProvider";
import { WashiAuthButton, WashiAuthPage } from "../auth/WashiAuthPage";
import type { ScreenProps } from "../navigation/types";

// Presents sign-in fields and routes users to registration.
export function SignInScreen({ navigation, route }: ScreenProps<"SignIn">) {
  const { signIn } = useAuth();
  const { busy, error, run } = useAuthAction();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const registeredEmail = route.params?.registeredEmail;

  useEffect(() => {
    if (registeredEmail) {
      setEmail(registeredEmail);
      setPassword("");
    }
  }, [registeredEmail]);

  return (
    <WashiAuthPage
      title="Sign in"
      colour="yellow"
      error={error}
      notice={
        registeredEmail ? "Account created. Sign in to continue." : undefined
      }
      actions={
        <>
          <WashiAuthButton
            title={busy ? "Signing in…" : "Sign in"}
            disabled={busy || !email.trim() || !password}
            busy={busy}
            onPress={() =>
              void run(
                () => signIn(email, password),
                "Unable to sign in. Try again.",
              )
            }
          />
          <WashiAuthButton
            title="Create an account"
            secondary
            disabled={busy}
            onPress={() => {
              setPassword("");
              navigation.navigate("Register");
            }}
          />
        </>
      }
    >
      <EmailField value={email} onChangeText={setEmail} editable={!busy} />
      <AuthField
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        editable={!busy}
        autoComplete="current-password"
        secureTextEntry
      />
    </WashiAuthPage>
  );
}
