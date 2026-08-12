import { ButtonLink, Card, CardBody, Flex, Link, Text } from '@backstage/ui';
import { ThemeSwitch } from '../dashboard/ThemeSwitch';
import { withBase } from '../dashboard/base';

const FEATURES = [
  {
    title: 'A catalog that stays true',
    body: 'Services register themselves from the pipeline, so the catalog is what is running rather than what someone remembered to write down.',
  },
  {
    title: 'Deploys with the approvals built in',
    body: 'Staging on merge, production behind an approval, rollback in one action. The rules live with the service, not in a wiki.',
  },
  {
    title: 'On-call that knows who owns what',
    body: 'Ownership comes from the catalog, so a page reaches the team that can fix it at three in the morning.',
  },
  {
    title: 'Numbers you can act on',
    body: 'Deploy frequency, failure rate and time to restore, per service and per team — the four that actually predict delivery.',
  },
];

const LOGOS = ['Northwind', 'Initech', 'Globex', 'Umbrella', 'Soylent'];

export function LandingPage() {
  return (
    <div className="marketing">
      <Flex align="center" justify="between" mb="6">
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
        <Flex align="center" gap="4">
          <Link href={withBase('/pricing')}>Pricing</Link>
          <Link href={withBase('/blog')}>Blog</Link>
          <Link href={withBase('/docs')}>Docs</Link>
          <ThemeSwitch />
          <ButtonLink href={withBase('/signin')} variant="secondary" size="small">
            Sign in
          </ButtonLink>
        </Flex>
      </Flex>

      <section className="hero">
        <Text variant="title-large" as="h1">
          Ship services, not tickets
        </Text>
        <Text variant="body-large" color="secondary">
          Acme Cloud is the platform layer between your teams and your
          infrastructure: a catalog that stays true, deploys with the approvals
          built in, and on-call that knows who owns what.
        </Text>
        <Flex gap="3" justify="center">
          <ButtonLink href={withBase('/signup')} variant="primary">
            Start free
          </ButtonLink>
          <ButtonLink href={withBase('/')} variant="secondary">
            See the dashboard
          </ButtonLink>
        </Flex>
        {/* The demo is the honest claim, so it is the one made loudest. */}
        <Text variant="body-small" color="secondary">
          No card. Fourteen days. Every page in this site is the real UI.
        </Text>
      </section>

      <section className="logo-strip" aria-label="Customers">
        {LOGOS.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </section>

      <section className="feature-grid">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <CardBody>
              <Flex direction="column" gap="2">
                <Text variant="title-x-small" as="h2">
                  {feature.title}
                </Text>
                <Text color="secondary">{feature.body}</Text>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </section>

      <section className="cta">
        <Flex direction="column" gap="3" align="center">
          <Text variant="title-small" as="h2">
            Have a look before you sign up
          </Text>
          <Text color="secondary">
            The dashboard, the catalog and the incident log are all live in
            this demo, filled with plausible data.
          </Text>
          <Flex gap="3">
            <ButtonLink href={withBase('/')} variant="primary">
              Open the demo
            </ButtonLink>
            <ButtonLink href={withBase('/pricing')} variant="secondary">
              See pricing
            </ButtonLink>
          </Flex>
        </Flex>
      </section>

      <footer className="marketing-footer">
        <Text variant="body-small" color="secondary">
          Acme Cloud is a UI demo built with Astro and Backstage UI. Nothing
          here is a real product.
        </Text>
        <Flex gap="4">
          <Link href={withBase('/docs')}>Docs</Link>
          <Link href={withBase('/blog')}>Blog</Link>
          <Link href={withBase('/changelog')}>Changelog</Link>
          <Link href={withBase('/help')}>Help</Link>
          <Link href={withBase('/pricing')}>Pricing</Link>
          <Link href={withBase('/signin')}>Sign in</Link>
        </Flex>
      </footer>
    </div>
  );
}
