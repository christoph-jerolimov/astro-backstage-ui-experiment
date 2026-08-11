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
import { AuthHeader } from './AuthHeader';
import { withBase } from '../dashboard/base';

/**
 * Deliberately crude: it counts length and character classes rather than
 * pretending to be zxcvbn. The point is the affordance, not the estimate.
 */
function strengthOf(password: string) {
  if (!password) return null;
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) =>
    re.test(password),
  ).length;
  if (password.length < 8) return { score: 1, label: 'Too short' };
  if (classes >= 3 && password.length >= 12) return { score: 3, label: 'Strong' };
  if (classes >= 2) return { score: 2, label: 'Fair' };
  return { score: 1, label: 'Weak' };
}

export function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = strengthOf(password);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('We need a name to put on the account.');
      return;
    }
    if (!email.includes('@')) {
      setError('Enter a valid work email address.');
      return;
    }
    if (email.endsWith('@gmail.com')) {
      setError('Use your work address — personal accounts cannot own a workspace.');
      return;
    }
    if (!org.trim()) {
      setError('Your workspace needs a name. You can change it later.');
      return;
    }
    if (password.length < 8) {
      setError('Passwords are at least 8 characters.');
      return;
    }
    if (!accepted) {
      setError('You need to accept the terms to continue.');
      return;
    }
    // A demo: there is no backend, so signing up just moves to the state a
    // real one would leave you in — waiting on an email.
    setError(null);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <AuthHeader />
        <Card>
          <CardBody>
            <Flex direction="column" gap="4">
              <Text variant="title-small" as="h1">
                Check your inbox
              </Text>
              <Text color="secondary">
                We sent a six-digit code to {email}. It is good for ten
                minutes.
              </Text>
              <Text variant="body-small" color="secondary">
                <Link href={withBase('/verify')}>Enter the code</Link> — or{' '}
                <Link href={withBase('/signup')}>start again</Link> with a
                different address.
              </Text>
            </Flex>
          </CardBody>
        </Card>
      </>
    );
  }

  return (
    <>
      <AuthHeader />

      <Card>
        <CardBody>
          <form onSubmit={onSubmit} noValidate>
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="1">
                <Text variant="title-small" as="h1">
                  Create an account
                </Text>
                <Text variant="body-small" color="secondary">
                  Fourteen days of everything. No card.
                </Text>
              </Flex>

              {error && (
                <div className="form-error" role="alert">
                  {error}
                </div>
              )}

              <TextField
                label="Your name"
                placeholder="Ada Lovelace"
                value={name}
                onChange={setName}
              />
              <TextField
                label="Work email"
                type="email"
                placeholder="ada@acme.cloud"
                value={email}
                onChange={setEmail}
              />
              <TextField
                label="Workspace name"
                description="Shows up in the sidebar and in invitations."
                placeholder="Acme Cloud"
                value={org}
                onChange={setOrg}
              />

              <Flex direction="column" gap="2">
                <PasswordField
                  label="Password"
                  value={password}
                  onChange={setPassword}
                />
                {strength && (
                  <Flex align="center" gap="3">
                    <div
                      className="strength-meter"
                      data-score={strength.score}
                      aria-hidden="true"
                    >
                      <span />
                      <span />
                      <span />
                    </div>
                    {/* The label carries the meaning; the bars only repeat it. */}
                    <Text variant="body-small" color="secondary">
                      {strength.label}
                    </Text>
                  </Flex>
                )}
              </Flex>

              <Checkbox isSelected={accepted} onChange={setAccepted}>
                I accept the terms and the privacy notice
              </Checkbox>

              <Button type="submit" variant="primary">
                Create account
              </Button>

              <Text variant="body-small" color="secondary">
                Already have one?{' '}
                <Link href={withBase('/signin')}>Sign in</Link>
              </Text>
            </Flex>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
