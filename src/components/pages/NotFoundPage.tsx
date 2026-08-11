import { ButtonLink, Card, CardBody, Flex, Link, Text } from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { withBase } from '../dashboard/base';

const SUGGESTIONS = [
  { href: '/', label: 'Overview', hint: 'Fleet-wide deployments, builds and health' },
  { href: '/services', label: 'Services', hint: 'The service catalog' },
  { href: '/incidents', label: 'Incidents', hint: 'Open and recent incidents' },
  { href: '/settings', label: 'Settings', hint: 'Workspace defaults' },
];

export function NotFoundPage() {
  return (
    <>
      <PageHeader
        title="Page not found"
        description="That URL does not match anything in this workspace."
      />

      <Flex direction="column" gap="4" mt="4">
        <Card>
          <CardBody>
            <Flex direction="column" gap="4">
              <span className="notfound-code" aria-hidden="true">
                404
              </span>
              <Text>
                The page may have been moved or renamed. If you followed a link
                from somewhere inside Acme Cloud, that link needs updating.
              </Text>
              <Flex gap="2">
                <ButtonLink href={withBase('/')} variant="primary">
                  Back to overview
                </ButtonLink>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Flex direction="column" gap="3">
              <Text variant="title-x-small" as="h2">
                Try one of these
              </Text>
              <ul className="suggestion-list">
                {SUGGESTIONS.map((item) => (
                  <li key={item.href}>
                    <Link href={withBase(item.href)} weight="bold">
                      {item.label}
                    </Link>
                    <Text variant="body-small" color="secondary" as="span">
                      {item.hint}
                    </Text>
                  </li>
                ))}
              </ul>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
