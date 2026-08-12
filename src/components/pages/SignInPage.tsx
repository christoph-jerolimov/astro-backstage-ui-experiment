import { useState } from 'react';
import { navigate } from 'astro:transitions/client';
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Flex,
  Link,
  PasswordField,
  Text,
  TextField,
} from '@backstage/ui';
import { AuthHeader } from './AuthHeader';
import { withBase } from '../dashboard/base';

const DEMO_EMAIL = 'ada@acme.cloud';

export function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Passwords are at least 8 characters.');
      return;
    }
    // A demo: there is no backend, so a correct-looking sign-in just routes on.
    setError(null);
    navigate(withBase('/'));
  };

  return (
    <>
      <AuthHeader />

      <Card>
        <CardBody>
          <form onSubmit={onSubmit} noValidate>
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="1">
                <Text variant="title-small" as="h1">
                  Sign in
                </Text>
                <Text variant="body-small" color="secondary">
                  Use your workspace account to continue.
                </Text>
              </Flex>

              {error && (
                <div className="form-error" role="alert">
                  {error}
                </div>
              )}

              <TextField
                label="Email"
                type="email"
                placeholder={DEMO_EMAIL}
                value={email}
                onChange={setEmail}
              />
              <PasswordField
                label="Password"
                value={password}
                onChange={setPassword}
              />

              <Flex align="center" justify="between" gap="4">
                <Checkbox isSelected={remember} onChange={setRemember}>
                  Keep me signed in
                </Checkbox>
                <Link href={withBase('/forgot-password')}>Forgot password?</Link>
              </Flex>

              <Button type="submit" variant="primary">
                Sign in
              </Button>

              <Text variant="body-small" color="secondary">
                This is a demo. Any address with an @ and eight characters of
                password will get you in.
              </Text>
            </Flex>
          </form>
        </CardBody>
      </Card>

      <Flex justify="center" mt="4">
        <Text variant="body-small" color="secondary">
          No account yet?{' '}
          <Link href={withBase('/signup')}>Create one</Link> or{' '}
          <Link href={withBase('/pricing')}>see pricing</Link>
        </Text>
      </Flex>
    </>
  );
}
