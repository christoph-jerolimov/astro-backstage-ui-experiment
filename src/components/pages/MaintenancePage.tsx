import { Card, CardBody, Flex, Link, Text } from '@backstage/ui';
import { AuthHeader } from './AuthHeader';

/**
 * Fixed rather than counted down from the clock: this page is prerendered,
 * and a timer that starts when the tab opens would be a lie.
 */
const WINDOW = {
  started: '23:00 UTC',
  expected: '00:30 UTC',
  duration: 'about 90 minutes',
};

const STEPS = [
  { label: 'Database migration', state: 'done' },
  { label: 'Rebuilding search indexes', state: 'doing' },
  { label: 'Draining old workers', state: 'todo' },
];

export function MaintenancePage() {
  return (
    <>
      <AuthHeader />
      <Card>
        <CardBody>
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="1">
              <Text variant="title-small" as="h1">
                Down for maintenance
              </Text>
              <Text variant="body-small" color="secondary">
                Planned, announced two weeks ago, and on schedule.
              </Text>
            </Flex>

            <Text>
              Acme Cloud is being upgraded. Deployments already in flight will
              finish; new ones are queued and will start on their own once this
              is over. Nothing is lost.
            </Text>

            <dl className="detail-list">
              <div>
                <dt>Started</dt>
                <dd>{WINDOW.started}</dd>
              </div>
              <div>
                <dt>Back by</dt>
                <dd>{WINDOW.expected}</dd>
              </div>
              <div>
                <dt>Window</dt>
                <dd>{WINDOW.duration}</dd>
              </div>
            </dl>

            <Flex direction="column" gap="2">
              <Text variant="title-x-small" as="h2">
                Where it is up to
              </Text>
              <ul className="progress-list">
                {STEPS.map((step) => (
                  <li key={step.label} data-state={step.state}>
                    <span aria-hidden="true">
                      {step.state === 'done' ? '✓' : step.state === 'doing' ? '•' : '○'}
                    </span>
                    {step.label}
                    <span className="visually-hidden">
                      {step.state === 'done'
                        ? ' — done'
                        : step.state === 'doing'
                          ? ' — in progress'
                          : ' — not started'}
                    </span>
                  </li>
                ))}
              </ul>
            </Flex>

            <Text variant="body-small" color="secondary">
              Live updates are on the{' '}
              <Link href="https://status.example.com">status page</Link>, which
              is hosted elsewhere and stays up when this does not.
            </Text>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
}
