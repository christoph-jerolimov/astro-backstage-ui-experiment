import { useState } from 'react';
import {
  Alert,
  Button,
  ButtonLink,
  Card,
  CardBody,
  CardHeader,
  CellText,
  Column,
  Flex,
  Row,
  Skeleton,
  TableBody,
  TableBodySkeleton,
  TableHeader,
  TableRoot,
  Text,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { withBase } from '../dashboard/base';

const COLUMNS = [
  { id: 'name', label: 'Service' },
  { id: 'owner', label: 'Owner' },
  { id: 'uptime', label: 'Uptime (30d)' },
  { id: 'status', label: 'Status' },
];

/**
 * Every state a data-backed page can be in, on one page, so they can be
 * compared side by side instead of being discovered one bug at a time.
 */
export function StatesPage() {
  const [phase, setPhase] = useState<'loading' | 'empty' | 'error' | 'loaded'>(
    'loading',
  );

  return (
    <>
      <PageHeader
        title="States"
        description="Loading, empty, error and loaded — the four a real page has to handle."
        tags={[{ label: 'reference' }]}
      />

      <Flex direction="column" gap="4" mt="4">
        <Card>
          <CardHeader>
            <Flex align="center" justify="between" gap="4">
              <Text variant="title-x-small" as="h2">
                A table in each state
              </Text>
              <Flex gap="2">
                {(['loading', 'empty', 'error', 'loaded'] as const).map((id) => (
                  <Button
                    key={id}
                    size="small"
                    variant={phase === id ? 'primary' : 'secondary'}
                    onPress={() => setPhase(id)}
                  >
                    {id}
                  </Button>
                ))}
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody>
            {phase === 'error' ? (
              <Alert
                status="danger"
                title="Could not load services"
                description="The catalog API returned a 502. This is usually brief."
                customActions={
                  <Button size="small" variant="secondary" onPress={() => setPhase('loading')}>
                    Retry
                  </Button>
                }
              />
            ) : phase === 'empty' ? (
              <div className="empty-state">
                <Text variant="title-x-small" as="p">
                  No services yet
                </Text>
                <Text color="secondary">
                  An empty state should say what to do next, not just that
                  there is nothing here.
                </Text>
                <ButtonLink href={withBase('/services/new')} variant="primary" size="small">
                  Create a service
                </ButtonLink>
              </div>
            ) : (
              <div className="table-scroll">
                <TableRoot aria-label="Services">
                  <TableHeader>
                    {COLUMNS.map((column, index) => (
                      <Column key={column.id} isRowHeader={index === 0}>
                        {column.label}
                      </Column>
                    ))}
                  </TableHeader>
                  {phase === 'loading' ? (
                    // The header stays put and only the body swaps, so the
                    // table does not jump when the data lands.
                    <TableBodySkeleton columns={COLUMNS} />
                  ) : (
                    <LoadedBody />
                  )}
                </TableRoot>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Text variant="title-x-small" as="h2">
              Skeletons match what replaces them
            </Text>
          </CardHeader>
          <CardBody>
            <Flex gap="4" align="start">
              <Flex direction="column" gap="3" grow>
                <Skeleton width="60%" height={20} />
                <Skeleton width="100%" height={12} />
                <Skeleton width="90%" height={12} />
                <Skeleton width="40%" height={12} />
              </Flex>
              <Flex direction="column" gap="3" grow>
                <Text variant="title-x-small" as="p">
                  catalog-api
                </Text>
                <Text variant="body-small" color="secondary">
                  Owned by team-atlas, written in TypeScript, deployed fourteen
                  times a week.
                </Text>
                <Text variant="body-small" color="secondary">
                  99.99% uptime over the last thirty days.
                </Text>
                <Text variant="body-small" color="secondary">
                  No open incidents.
                </Text>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Text variant="title-x-small" as="h2">
              Alerts, by how much they interrupt
            </Text>
          </CardHeader>
          <CardBody>
            <Flex direction="column" gap="3">
              <Alert
                status="info"
                title="Scheduled maintenance on Sunday"
                description="Deploys are queued for about 90 minutes from 23:00 UTC."
              />
              <Alert
                status="success"
                title="Rollout finished"
                description="catalog-api v2.14.0 is on every production replica."
              />
              <Alert
                status="warning"
                title="Two services have no owner"
                description="Unowned services do not page anyone when they break."
              />
              <Alert
                status="danger"
                title="Production deploy failed"
                description="billing-worker v1.4.2 failed its health check and was rolled back."
              />
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}

const LOADED = [
  { name: 'catalog-api', owner: 'team-atlas', uptime: '99.99%', status: 'Healthy' },
  { name: 'search-indexer', owner: 'team-atlas', uptime: '99.95%', status: 'Healthy' },
  { name: 'auth-gateway', owner: 'team-vault', uptime: '99.90%', status: 'Degraded' },
];

function LoadedBody() {
  return (
    <TableBody>
      {LOADED.map((row) => (
        <Row key={row.name} id={row.name}>
          <CellText title={row.name} />
          <CellText title={row.owner} />
          <CellText title={row.uptime} />
          <CellText title={row.status} />
        </Row>
      ))}
    </TableBody>
  );
}
