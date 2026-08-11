import { useState } from 'react';
import {
  Badge,
  ButtonLink,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Switch,
  Text,
} from '@backstage/ui';
import { ThemeSwitch } from '../dashboard/ThemeSwitch';
import { withBase } from '../dashboard/base';

interface Plan {
  id: string;
  name: string;
  monthly: number;
  blurb: string;
  features: string[];
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 0,
    blurb: 'For a team finding its feet.',
    features: ['Up to 5 services', 'Staging deploys', 'Community support', '7-day deploy history'],
  },
  {
    id: 'team',
    name: 'Team',
    monthly: 40,
    blurb: 'For teams shipping every day.',
    features: ['Unlimited services', 'Production approvals', 'On-call routing', '90-day deploy history'],
    featured: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthly: 120,
    blurb: 'For a platform team supporting many teams.',
    features: ['Everything in Team', 'SSO and SCIM', 'Audit log export', 'Named support engineer'],
  },
];

export function PricingPage() {
  const [yearly, setYearly] = useState(false);

  const price = (plan: Plan) => {
    if (plan.monthly === 0) return 'Free';
    const value = yearly ? Math.round(plan.monthly * 12 * 0.8) : plan.monthly;
    return `$${value}`;
  };

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
          <ThemeSwitch />
          <ButtonLink href={withBase('/signin')} variant="secondary" size="small">
            Sign in
          </ButtonLink>
        </Flex>
      </Flex>

      <Flex direction="column" gap="3" align="center" mb="6">
        <Text variant="title-large" as="h1">
          Pricing
        </Text>
        <Text variant="body-large" color="secondary">
          Per developer, per month. Cancel whenever.
        </Text>
        <Flex align="center" gap="3">
          <Switch
            label="Bill yearly (save 20%)"
            isSelected={yearly}
            onChange={setYearly}
          />
        </Flex>
      </Flex>

      <div className="pricing-grid">
        {PLANS.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <Flex align="center" justify="between" gap="2">
                <Text variant="title-x-small" as="h2">
                  {plan.name}
                </Text>
                {plan.featured && <Badge>Most popular</Badge>}
              </Flex>
            </CardHeader>
            <CardBody>
              <Flex direction="column" gap="4">
                <Flex direction="column" gap="1">
                  <span className="price">{price(plan)}</span>
                  <Text variant="body-small" color="secondary">
                    {plan.monthly === 0
                      ? 'No card needed'
                      : yearly
                        ? 'per developer, per year'
                        : 'per developer, per month'}
                  </Text>
                </Flex>
                <Text color="secondary">{plan.blurb}</Text>
                <ul className="feature-list">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M2.5 7.5l3 3 6-7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={withBase('/signin')}
                  variant={plan.featured ? 'primary' : 'secondary'}
                >
                  {plan.monthly === 0 ? 'Start free' : `Choose ${plan.name}`}
                </ButtonLink>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </div>

      <Flex justify="center" mt="6">
        <Text variant="body-small" color="secondary">
          Prices are illustrative. This is a UI demo, not a product.
        </Text>
      </Flex>
    </div>
  );
}
