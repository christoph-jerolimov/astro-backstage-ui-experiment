import {
  Card,
  CardBody,
  CardHeader,
  Cell,
  CellText,
  Column,
  Flex,
  Row,
  TableBody,
  TableHeader,
  TableRoot,
  Text,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { StatTile } from '../dashboard/StatTile';
import { StatusPill } from '../dashboard/StatusPill';
import { ColumnChart } from '../dashboard/charts/ColumnChart';
import {
  INCIDENTS,
  INCIDENTS_PER_WEEK,
  type Incident,
  type Severity,
} from '../dashboard/data';

// Severity is an ordered scale, not a state, so it gets a ranked dot rather
// than the icon+label status treatment — a green check beside SEV3 would read
// as "resolved", which is a different column entirely.
const SEVERITY: Record<Severity, { color: string; label: string }> = {
  sev1: { color: 'var(--status-critical)', label: 'SEV1' },
  sev2: { color: 'var(--status-warning)', label: 'SEV2' },
  sev3: { color: 'var(--chart-muted)', label: 'SEV3' },
};

const STATUS: Record<
  Incident['status'],
  { tone: 'good' | 'warning' | 'critical'; label: string }
> = {
  open: { tone: 'critical', label: 'Open' },
  mitigated: { tone: 'warning', label: 'Mitigated' },
  resolved: { tone: 'good', label: 'Resolved' },
};

function SeverityDot({ severity }: { severity: Severity }) {
  const { color, label } = SEVERITY[severity];
  return (
    <span className="severity-cell">
      <span className="severity-dot" style={{ background: color }} aria-hidden="true" />
      {label}
    </span>
  );
}

export function IncidentsPage() {
  const open = INCIDENTS.filter((i) => i.status === 'open').length;
  const resolved = INCIDENTS.filter((i) => i.status === 'resolved').length;

  return (
    <>
      <PageHeader
        title="Incidents"
        description="Open and recently resolved incidents across the fleet."
        tags={[{ label: 'on-call' }, { label: 'eu-west-1' }]}
        metadata={[
          { label: 'On call', value: 'team-signal' },
          { label: 'Escalation', value: '#platform-oncall' },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        <div className="kpi-row">
          <StatTile
            label="Open incidents"
            value={String(open)}
            delta={{ text: '3 fewer than last week', direction: 'down', upIsGood: false }}
          />
          <StatTile
            label="Mean time to resolve"
            value="42m"
            delta={{ text: '11m faster', direction: 'down', upIsGood: false }}
          />
          <StatTile label="Resolved (30d)" value={String(resolved + 9)} />
          <StatTile
            label="SEV1 this quarter"
            value="2"
            delta={{ text: '1 more than last quarter', direction: 'up', upIsGood: false }}
          />
        </div>

        <Card>
          <CardHeader>
            <Text variant="title-x-small" as="h2">
              Incidents opened per week
            </Text>
          </CardHeader>
          <CardBody>
            <ColumnChart
              title="Incidents opened per week"
              seriesName="Incidents"
              labels={INCIDENTS_PER_WEEK.map((w) => w.label)}
              values={INCIDENTS_PER_WEEK.map((w) => w.value)}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Flex align="center" justify="between">
              <Text variant="title-x-small" as="h2">
                Incident log
              </Text>
              <Text variant="body-small" color="secondary">
                {open} open · {INCIDENTS.length - open} closed out
              </Text>
            </Flex>
          </CardHeader>
          <CardBody>
            <div className="table-scroll">
              <TableRoot aria-label="Incidents">
                <TableHeader>
                  <Column isRowHeader>Incident</Column>
                  <Column>Title</Column>
                  <Column>Service</Column>
                  <Column>Severity</Column>
                  <Column>Opened</Column>
                  <Column>Status</Column>
                </TableHeader>
                <TableBody>
                  {INCIDENTS.map((incident) => (
                    <Row key={incident.id}>
                      <CellText title={incident.id} />
                      <CellText title={incident.title} />
                      <CellText title={incident.service} />
                      <Cell>
                        <SeverityDot severity={incident.severity} />
                      </Cell>
                      <CellText title={incident.opened} />
                      <Cell>
                        <StatusPill {...STATUS[incident.status]} />
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </TableRoot>
            </div>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
