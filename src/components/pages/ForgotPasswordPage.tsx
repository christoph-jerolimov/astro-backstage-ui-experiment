import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Flex,
  Link,
  Text,
  TextField,
} from '@backstage/ui';
import { AuthHeader } from './AuthHeader';
import { withBase } from '../dashboard/base';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes('@')) {
      setError('Enter the email address on the account.');
      return;
    }
    setError(null);
    setSent(true);
  };

  if (sent) {
    return (
      <>
        <AuthHeader />
        <Card>
          <CardBody>
            <Flex direction="column" gap="4">
              <Text variant="title-small" as="h1">
                Check your inbox
              </Text>
              {/* Never confirm whether the address exists — that would turn
                  this form into an account-enumeration oracle. */}
              <Text color="secondary">
                If {email} has an account, a reset link is on its way. The
                link is good for one hour and can only be used once.
              </Text>
              <Flex direction="column" gap="2">
                <Text variant="body-small" color="secondary">
                  Nothing after a minute? Check spam, then try again.
                </Text>
                <Flex gap="4">
                  <Button variant="secondary" onPress={() => setSent(false)}>
                    Use a different address
                  </Button>
                </Flex>
              </Flex>
              <Text variant="body-small" color="secondary">
                <Link href={withBase('/signin')}>Back to sign in</Link>
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
                  Forgot your password?
                </Text>
                <Text variant="body-small" color="secondary">
                  We will email you a link to set a new one.
                </Text>
              </Flex>

              {error && (
                <div className="form-error" role="alert">
                  {error}
                </div>
              )}

              <TextField
                label="Email address"
                type="email"
                placeholder="ada@acme.cloud"
                value={email}
                onChange={setEmail}
              />

              <Button type="submit" variant="primary">
                Send reset link
              </Button>

              <Text variant="body-small" color="secondary">
                Remembered it? <Link href={withBase('/signin')}>Sign in</Link>
              </Text>
            </Flex>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
