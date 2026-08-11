import { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, Flex, Link, Text } from '@backstage/ui';
import { AuthHeader } from './AuthHeader';
import { withBase } from '../dashboard/base';

/** The code the demo accepts. Anything else is refused. */
const GOOD_CODE = '314159';
const RESEND_SECONDS = 30;

export function VerifyPage() {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const focusBox = (index: number) => inputs.current[index]?.focus();

  const write = (index: number, value: string) => {
    // Typing into a full box, or pasting the whole code, should fill forward
    // rather than fight the caret.
    const chars = value.replace(/\D/g, '').split('');
    if (chars.length === 0) {
      setDigits((prev) => prev.map((d, i) => (i === index ? '' : d)));
      return;
    }
    setDigits((prev) => {
      const next = [...prev];
      chars.forEach((char, offset) => {
        if (index + offset < next.length) next[index + offset] = char;
      });
      return next;
    });
    setError(null);
    focusBox(Math.min(index + chars.length, 5));
  };

  const onKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      // Backspace in an empty box steps back, which is what everyone expects.
      event.preventDefault();
      setDigits((prev) => prev.map((d, i) => (i === index - 1 ? '' : d)));
      focusBox(index - 1);
    }
    if (event.key === 'ArrowLeft' && index > 0) focusBox(index - 1);
    if (event.key === 'ArrowRight' && index < 5) focusBox(index + 1);
  };

  const code = digits.join('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (code.length < 6) {
      setError('Enter all six digits.');
      return;
    }
    if (code !== GOOD_CODE) {
      setError('That code is wrong or has expired.');
      setDigits(Array(6).fill(''));
      focusBox(0);
      return;
    }
    setError(null);
    setVerified(true);
  };

  if (verified) {
    return (
      <>
        <AuthHeader />
        <Card>
          <CardBody>
            <Flex direction="column" gap="4">
              <Text variant="title-small" as="h1">
                You are verified
              </Text>
              <Text color="secondary">
                ada@acme.cloud is confirmed. Your workspace is ready.
              </Text>
              <Button
                variant="primary"
                onPress={() => {
                  window.location.href = withBase('/');
                }}
              >
                Go to the dashboard
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
          <form onSubmit={submit} noValidate>
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="1">
                <Text variant="title-small" as="h1">
                  Enter the code
                </Text>
                <Text variant="body-small" color="secondary">
                  We sent six digits to ada@acme.cloud. In this demo the code
                  is {GOOD_CODE}.
                </Text>
              </Flex>

              {error && (
                <div className="form-error" role="alert">
                  {error}
                </div>
              )}

              <div className="code-boxes">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(node) => {
                      inputs.current[index] = node;
                    }}
                    // A one-character text box rather than a number input:
                    // spinners and scroll-to-change are wrong here.
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    aria-label={`Digit ${index + 1} of 6`}
                    value={digit}
                    onChange={(event) => write(index, event.target.value)}
                    onKeyDown={(event) => onKeyDown(index, event)}
                  />
                ))}
              </div>

              <Button type="submit" variant="primary">
                Verify
              </Button>

              <Text variant="body-small" color="secondary">
                {secondsLeft > 0 ? (
                  `You can ask for another code in ${secondsLeft}s.`
                ) : (
                  <Link
                    href="#"
                    onPress={() => {
                      setSecondsLeft(RESEND_SECONDS);
                      setError(null);
                    }}
                  >
                    Send another code
                  </Link>
                )}
              </Text>

              <Text variant="body-small" color="secondary">
                Wrong address? <Link href={withBase('/signup')}>Start again</Link>
              </Text>
            </Flex>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
