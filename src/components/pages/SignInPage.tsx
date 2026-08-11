import { useState } from 'react';
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
import { ThemeSwitch } from '../dashboard/ThemeSwitch';
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
    window.location.href = withBase('/');
  };

  return (
    <>
      <Flex align="center" justify="between" mb="4">
        <Flex align="center" gap="2">
          <span className="sidebar-brand-mark" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 12c3.5-2 5-5.5 5-9-3.5 0-7 1.5-9 5l-2.5.5L4 11l2.5 2.5L7 11z" />
              <circle cx="9.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <Text variant="title-x-small" as="span">
            Acme Cloud
          </Text>
        </Flex>
        <ThemeSwitch />
      </Flex>

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
                <Link href={withBase('/signin')}>Forgot password?</Link>
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
    </>
  );
}
