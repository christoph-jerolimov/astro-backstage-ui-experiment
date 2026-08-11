import { useMemo, useState } from 'react';
import {
  Card,
  CardBody,
  Flex,
  Link,
  SearchField,
  Tag,
  TagGroup,
  Text,
  ToggleButton,
  ToggleButtonGroup,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { withBase } from '../dashboard/base';
import { DEPLOYMENTS, INCIDENTS, SERVICES } from '../dashboard/data';

type ResultKind = 'service' | 'incident' | 'deployment' | 'doc';

interface Result {
  id: string;
  kind: ResultKind;
  title: string;
  detail: string;
  href: string;
}

const DOCS: Result[] = [
  { id: 'doc-getting-started', kind: 'doc', title: 'Getting started', detail: 'Ship your first service in about ten minutes', href: '/docs/getting-started' },
  { id: 'doc-pipelines', kind: 'doc', title: 'Pipelines', detail: 'How builds, tests and deployments fit together', href: '/docs/pipelines' },
  { id: 'doc-on-call', kind: 'doc', title: 'On-call', detail: 'What happens when something breaks', href: '/docs/on-call' },
];

const INDEX: Result[] = [
  ...SERVICES.map((service) => ({
    id: `service-${service.name}`,
    kind: 'service' as const,
    title: service.name,
    detail: `${service.language} · owned by ${service.owner}`,
    href: `/services/${service.name}`,
  })),
  ...INCIDENTS.map((incident) => ({
    id: `incident-${incident.id}`,
    kind: 'incident' as const,
    title: `${incident.id} ${incident.title}`,
    detail: `${incident.severity.toUpperCase()} · ${incident.service}`,
    href: '/incidents',
  })),
  ...DEPLOYMENTS.map((deployment) => ({
    id: `deployment-${deployment.id}`,
    kind: 'deployment' as const,
    title: `${deployment.id} ${deployment.service}`,
    detail: `${deployment.version} · ${deployment.environment}`,
    href: '/deployments',
  })),
  ...DOCS,
];

const KINDS: { id: 'all' | ResultKind; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'service', label: 'Services' },
  { id: 'incident', label: 'Incidents' },
  { id: 'deployment', label: 'Deployments' },
  { id: 'doc', label: 'Docs' },
];

const KIND_LABEL: Record<ResultKind, string> = {
  service: 'Service',
  incident: 'Incident',
  deployment: 'Deployment',
  doc: 'Doc',
};

export function SearchPage({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [kind, setKind] = useState<Set<string>>(new Set(['all']));

  const active = ([...kind][0] ?? 'all') as 'all' | ResultKind;

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return INDEX.filter((entry) => {
      const matchesKind = active === 'all' || entry.kind === active;
      const haystack = `${entry.title} ${entry.detail}`.toLowerCase();
      return matchesKind && haystack.includes(needle);
    });
  }, [query, active]);

  return (
    <>
      <PageHeader
        title="Search"
        description="Services, incidents, deployments and docs in one place."
      />

      <Flex direction="column" gap="4" mt="4">
        <div style={{ maxWidth: 480 }}>
          <SearchField
            label="Search everything"
            placeholder="Try catalog, SEV1 or pipeline"
            value={query}
            onChange={setQuery}
          />
        </div>

        <ToggleButtonGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={kind}
          onSelectionChange={(keys) => setKind(new Set(keys as Set<string>))}
        >
          {KINDS.map(({ id, label }) => (
            <ToggleButton key={id} id={id}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {query.trim() === '' ? (
          <Card>
            <CardBody>
              <Text color="secondary">
                Type something to search. Nothing is indexed until you do.
              </Text>
            </CardBody>
          </Card>
        ) : results.length === 0 ? (
          <Card>
            <CardBody>
              <Flex direction="column" gap="2">
                <Text variant="title-x-small" as="p">
                  No matches for “{query}”
                </Text>
                <Text color="secondary">
                  Try a shorter term, or switch the filter back to Everything.
                </Text>
              </Flex>
            </CardBody>
          </Card>
        ) : (
          <>
            <Text variant="body-small" color="secondary">
              {results.length} result{results.length === 1 ? '' : 's'}
            </Text>
            <Flex direction="column" gap="2">
              {results.map((result) => (
                <Card key={result.id}>
                  <CardBody>
                    <Flex align="center" justify="between" gap="4">
                      <Flex direction="column" gap="1">
                        <Link href={withBase(result.href)} weight="bold">
                          {result.title}
                        </Link>
                        <Text variant="body-small" color="secondary">
                          {result.detail}
                        </Text>
                      </Flex>
                      <TagGroup aria-label="Result type">
                        <Tag id={result.kind}>{KIND_LABEL[result.kind]}</Tag>
                      </TagGroup>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </Flex>
          </>
        )}
      </Flex>
    </>
  );
}
