import { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
  Card,
  CardBody,
  Flex,
  Link,
  SearchField,
  Text,
} from '@backstage/ui';
import { ThemeSwitch } from '../dashboard/ThemeSwitch';
import { withBase } from '../dashboard/base';

interface Question {
  id: string;
  topic: string;
  question: string;
  answer: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'q-register',
    topic: 'Getting started',
    question: 'How does a service get into the catalog?',
    answer:
      'It registers itself the first time its pipeline deploys it. There is no form to fill in — if a service is running and is not listed, its pipeline has not finished a deploy yet.',
  },
  {
    id: 'q-rename',
    topic: 'Getting started',
    question: 'What happens if I rename a service?',
    answer:
      'The catalog picks up the new name on the next deploy, and on-call routing follows it. The old name keeps working as a redirect for thirty days.',
  },
  {
    id: 'q-approve',
    topic: 'Deploys',
    question: 'Why does my production deploy need an approval?',
    answer:
      'Production approvals are on by default for every service. An owner can turn them off per service in settings, but the audit log records who did and when.',
  },
  {
    id: 'q-rollback',
    topic: 'Deploys',
    question: 'How do I roll back?',
    answer:
      'Open the deployment and choose Roll back. It redeploys the previous version that passed its health check — not simply the previous version, which may be the one that broke.',
  },
  {
    id: 'q-page',
    topic: 'On-call',
    question: 'Who gets paged when my service breaks?',
    answer:
      'The team that owns it in the catalog. If ownership is unset, the page escalates to the platform team, which is slower — so unowned services are worth fixing.',
  },
  {
    id: 'q-sev',
    topic: 'On-call',
    question: 'What is the difference between SEV1, SEV2 and SEV3?',
    answer:
      'SEV1 pages immediately and wakes people. SEV2 pages during working hours. SEV3 opens a ticket and never wakes anyone. Severity is set when the incident opens and can be changed later.',
  },
  {
    id: 'q-seats',
    topic: 'Billing',
    question: 'What counts as a seat?',
    answer:
      'Anyone who signs in during the billing period. Invited people who never accept are not charged, and suspended accounts stop counting the day they are suspended.',
  },
  {
    id: 'q-invoice',
    topic: 'Billing',
    question: 'Where do I find an old invoice?',
    answer:
      'Billing, then All invoices. Seven years are kept, and each one can be printed as a receipt with the VAT breakdown.',
  },
];

const TOPICS = [...new Set(QUESTIONS.map((q) => q.topic))];

export function HelpPage() {
  const [query, setQuery] = useState('');

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return QUESTIONS;
    return QUESTIONS.filter((q) =>
      `${q.question} ${q.answer} ${q.topic}`.toLowerCase().includes(needle),
    );
  }, [query]);

  const topics = TOPICS.filter((topic) =>
    matches.some((q) => q.topic === topic),
  );

  return (
    <div className="marketing">
      <Flex align="center" justify="between" mb="6">
        <Flex align="center" gap="4">
          <Link href={withBase('/home')} weight="bold">
            Acme Cloud
          </Link>
          <Text variant="body-small" color="secondary" as="span">
            Help
          </Text>
        </Flex>
        <Flex align="center" gap="4">
          <Link href={withBase('/docs')}>Docs</Link>
          <Link href={withBase('/changelog')}>Changelog</Link>
          <ThemeSwitch />
        </Flex>
      </Flex>

      <Flex direction="column" gap="2" mb="6">
        <Text variant="title-large" as="h1">
          Help centre
        </Text>
        <Text variant="body-large" color="secondary">
          The questions people actually ask, answered without a support ticket.
        </Text>
      </Flex>

      <Flex direction="column" gap="4">
        <div style={{ maxWidth: 420 }}>
          <SearchField
            label="Search the answers"
            placeholder="Try rollback, seats or paging"
            value={query}
            onChange={setQuery}
          />
        </div>

        {topics.length === 0 ? (
          <Card>
            <CardBody>
              <Flex direction="column" gap="2">
                <Text variant="title-x-small" as="p">
                  Nothing here answers that
                </Text>
                <Text color="secondary">
                  Try fewer words, or read <Link href={withBase('/docs')}>the
                  docs</Link>, which go deeper than this page does.
                </Text>
              </Flex>
            </CardBody>
          </Card>
        ) : (
          topics.map((topic) => (
            <Flex key={topic} direction="column" gap="2">
              <Text variant="title-x-small" as="h2">
                {topic}
              </Text>
              {/* One open at a time: an FAQ where everything is expanded is
                  just a page of prose with extra chrome. */}
              <AccordionGroup>
                {matches
                  .filter((q) => q.topic === topic)
                  .map((q) => (
                    <Accordion key={q.id} id={q.id}>
                      <AccordionTrigger title={q.question} />
                      <AccordionPanel>
                        <Text color="secondary">{q.answer}</Text>
                      </AccordionPanel>
                    </Accordion>
                  ))}
              </AccordionGroup>
            </Flex>
          ))
        )}

        <Card>
          <CardBody>
            <Flex direction="column" gap="2">
              <Text variant="title-x-small" as="h2">
                Still stuck?
              </Text>
              <Text color="secondary">
                Owners and billing admins can open a ticket from{' '}
                <Link href={withBase('/settings')}>settings</Link>. Include the
                request id if you saw an error page — it is the fastest way to
                the trace.
              </Text>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </div>
  );
}
