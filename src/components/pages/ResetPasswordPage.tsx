import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Flex,
  Link,
  PasswordField,
  Text,
} from '@backstage/ui';
import { AuthHeader } from './AuthHeader';
import { withBase } from '../dashboard/base';

/** The rules, stated up front, so nothing is a surprise at submit time. */
const RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { id: 'case', label: 'Upper and lower case', test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { id: 'number', label: 'A number or symbol', test: (v: string) => /[\d\W]/.test(v) },
];

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unmet = RULES.filter((rule) => !rule.test(password));

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (unmet.length > 0) {
      setError(`Password still needs: ${unmet[0]!.label.toLowerCase()}.`);
      return;
    }
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }
    setError(null);
    setDone(true);
  };

  if (done) {
    return (
      <>
        <AuthHeader />
        <Card>
          <CardBody>
            <Flex direction="column" gap="4">
              <Text variant="title-small" as="h1">
                Password changed
              </Text>
              <Text color="secondary">
                You have been signed out everywhere else. Any other sessions
                will need the new password.
              </Text>
              <Button
                variant="primary"
                onPress={() => {
                  window.location.href = withBase('/signin');
                }}
              >
                Sign in
              </Button>
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
                  Set a new password
                </Text>
                <Text variant="body-small" color="secondary">
                  Resetting for ada@acme.cloud. This link expires in an hour.
                </Text>
              </Flex>

              {error && (
                <div className="form-error" role="alert">
                  {error}
                </div>
              )}

              <PasswordField
                label="New password"
                value={password}
                onChange={setPassword}
              />

              <ul className="rule-list">
                {RULES.map((rule) => {
                  const met = rule.test(password);
                  return (
                    <li key={rule.id} data-met={met}>
                      {/* The tick and the word both change, so the state does
                          not rest on colour alone. */}
                      <span aria-hidden="true">{met ? '✓' : '○'}</span>
                      {rule.label}
                      <span className="visually-hidden">
                        {met ? ' — met' : ' — not met yet'}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <PasswordField
                label="Confirm new password"
                value={confirm}
                onChange={setConfirm}
              />

              <Button type="submit" variant="primary">
                Change password
              </Button>

              <Text variant="body-small" color="secondary">
                Link expired?{' '}
                <Link href={withBase('/forgot-password')}>Send a new one</Link>
              </Text>
            </Flex>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
