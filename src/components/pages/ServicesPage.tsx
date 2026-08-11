import { useMemo, useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  SearchField,
  Select,
  Text,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { StatTile } from '../dashboard/StatTile';
import { ServicesTable } from '../dashboard/ServicesTable';
import { StackedBar } from '../dashboard/charts/StackedBar';
import { LANGUAGES, SERVICES } from '../dashboard/data';

const OWNERS = [
  { id: 'all', label: 'All teams' },
  ...Array.from(new Set(SERVICES.map((s) => s.owner))).map((owner) => ({
    id: owner,
    label: owner,
  })),
];

export function ServicesPage() {
  const [query, setQuery] = useState('');
  const [owner, setOwner] = useState('all');

  const filtered = useMemo(
    () =>
      SERVICES.filter((service) => {
        const matchesOwner = owner === 'all' || service.owner === owner;
        const needle = query.trim().toLowerCase();
        const matchesQuery =
          needle === '' ||
          service.name.toLowerCase().includes(needle) ||
          service.language.toLowerCase().includes(needle);
        return matchesOwner && matchesQuery;
      }),
    [query, owner],
  );

  const healthy = SERVICES.filter((s) => s.status === 'healthy').length;

  return (
    <>
      <PageHeader
        title="Services"
        description="Every service in the catalog, with ownership and health."
        tags={[{ label: 'catalog' }]}
        metadata={[
          { label: 'Services', value: String(SERVICES.length) },
          { label: 'Owners', value: String(OWNERS.length - 1) },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        <div className="kpi-row">
          <StatTile label="Services" value={String(SERVICES.length)} />
          <StatTile
            label="Healthy"
            value={`${healthy} / ${SERVICES.length}`}
            delta={{ text: '1 fewer than last week', direction: 'down', upIsGood: true }}
          />
          <StatTile label="Median uptime (30d)" value="99.96%" />
          <StatTile
            label="Deploys / week"
            value={String(SERVICES.reduce((sum, s) => sum + s.deploysPerWeek, 0))}
          />
        </div>

        {/* Filters scope everything below them */}
        <Flex align="end" gap="4">
          <div style={{ width: 260 }}>
            <SearchField
              size="small"
              label="Filter services"
              placeholder="Name or language"
              value={query}
              onChange={setQuery}
            />
          </div>
          <div style={{ width: 200 }}>
            <Select
              size="small"
              label="Owner"
              options={OWNERS}
              value={owner}
              onChange={(key) => setOwner(String(key))}
            />
          </div>
        </Flex>

        <Card>
          <CardHeader>
            <Flex align="center" justify="between">
              <Text variant="title-x-small" as="h2">
                Catalog
              </Text>
              <Text variant="body-small" color="secondary">
                {filtered.length} of {SERVICES.length} services
              </Text>
            </Flex>
          </CardHeader>
          <CardBody>
            {filtered.length > 0 ? (
              <ServicesTable services={filtered} />
            ) : (
              <Text color="secondary">No services match those filters.</Text>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Text variant="title-x-small" as="h2">
              Fleet by language
            </Text>
          </CardHeader>
          <CardBody>
            <StackedBar
              title="Fleet by language"
              unit="services"
              segments={LANGUAGES.map((lang, i) => ({
                name: lang.name,
                value: lang.services,
                color: `var(--chart-series-${i + 1})`,
              }))}
            />
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
