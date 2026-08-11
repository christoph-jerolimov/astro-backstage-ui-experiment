import { useMemo, useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Cell,
  CellText,
  Column,
  Flex,
  Row,
  Select,
  TableBody,
  TableHeader,
  TableRoot,
  Text,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { DetailDrawer } from '../dashboard/DetailDrawer';
import { deploymentDetail } from '../dashboard/detail';
import { StatTile } from '../dashboard/StatTile';
import { LineChart } from '../dashboard/charts/LineChart';
import { Sparkline } from '../dashboard/charts/Sparkline';
import { StatusPill } from '../dashboard/StatusPill';
import {
  DAYS,
  DEPLOYMENTS,
  RANGE_OPTIONS,
  type Deployment,
  type RangeKey,
} from '../dashboard/data';

export function DeploymentsPage() {
  const [range, setRange] = useState<RangeKey>('30d');
  // The row whose details are open in the drawer; null when it is closed.
  const [detail, setDetail] = useState<Deployment | null>(null);

  const days = useMemo(() => {
    const count = RANGE_OPTIONS.find((option) => option.id === range)!.days;
    return DAYS.slice(-count);
  }, [range]);

  const week = DAYS.slice(-7);
  const production = week.reduce((sum, d) => sum + d.production, 0);
  const staging = week.reduce((sum, d) => sum + d.staging, 0);
  const rolledBack = DEPLOYMENTS.filter((d) => d.status === 'rolled-back').length;

  return (
    <>
      <PageHeader
        title="Deployments"
        description="Every release the platform shipped, by environment."
        tags={[{ label: 'continuous delivery' }]}
        metadata={[
          { label: 'Pipelines', value: '18' },
          { label: 'Environments', value: '2' },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        <div className="kpi-row">
          <StatTile
            label="Production deploys (7d)"
            value={String(production)}
            delta={{ text: '6% vs prior week', direction: 'up' }}
            trend={<Sparkline values={DAYS.slice(-12).map((d) => d.production)} />}
          />
          <StatTile label="Staging deploys (7d)" value={String(staging)} />
          <StatTile
            label="Median duration"
            value="3m 41s"
            delta={{ text: '18s faster', direction: 'down', upIsGood: false }}
          />
          <StatTile
            label="Rollbacks (7d)"
            value={String(rolledBack)}
            delta={{ text: '1 more than last week', direction: 'up', upIsGood: false }}
          />
        </div>

        <Flex align="center" gap="4">
          <div style={{ width: 200 }}>
            <Select
              size="small"
              label="Date range"
              options={RANGE_OPTIONS.map(({ id, label }) => ({ id, label }))}
              value={range}
              onChange={(key) => setRange(key as RangeKey)}
            />
          </div>
        </Flex>

        <Card>
          <CardHeader>
            <Text variant="title-x-small" as="h2">
              Deployments per day
            </Text>
          </CardHeader>
          <CardBody>
            <LineChart
              title="Deployments per day by environment"
              labels={days.map((d) => d.label)}
              series={[
                {
                  name: 'Production',
                  color: 'var(--chart-series-1)',
                  values: days.map((d) => d.production),
                },
                {
                  name: 'Staging',
                  color: 'var(--chart-series-2)',
                  values: days.map((d) => d.staging),
                },
              ]}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Text variant="title-x-small" as="h2">
              Recent deployments
            </Text>
          </CardHeader>
          <CardBody>
            <div className="table-scroll" data-row-action="true">
              <TableRoot
                aria-label="Recent deployments"
                onRowAction={(key) =>
                  setDetail(DEPLOYMENTS.find((d) => d.id === key) ?? null)
                }
              >
                <TableHeader>
                  <Column isRowHeader>Deployment</Column>
                  <Column>Service</Column>
                  <Column>Environment</Column>
                  <Column>Version</Column>
                  <Column>Duration</Column>
                  <Column>When</Column>
                  <Column>Status</Column>
                </TableHeader>
                <TableBody>
                  {DEPLOYMENTS.map((deployment) => (
                    <Row key={deployment.id} id={deployment.id}>
                      <CellText title={deployment.id} />
                      <CellText title={deployment.service} />
                      <CellText title={deployment.environment} />
                      <CellText title={deployment.version} />
                      <CellText title={deployment.duration} />
                      <CellText title={deployment.when} />
                      <Cell>
                        <StatusPill
                          tone={
                            deployment.status === 'succeeded'
                              ? 'good'
                              : deployment.status === 'failed'
                                ? 'critical'
                                : 'warning'
                          }
                          label={
                            deployment.status === 'succeeded'
                              ? 'Succeeded'
                              : deployment.status === 'failed'
                                ? 'Failed'
                                : 'Rolled back'
                          }
                        />
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </TableRoot>
            </div>
          </CardBody>
        </Card>
      </Flex>

      {detail && (
        <DetailDrawer
          isOpen
          onOpenChange={(open) => !open && setDetail(null)}
          {...deploymentDetail(detail)}
        />
      )}
    </>
  );
}
