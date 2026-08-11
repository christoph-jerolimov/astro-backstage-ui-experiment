import { useMemo, useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Header,
  SearchField,
  Select,
  Switch,
  Text,
} from '@backstage/ui';
import '../styles/dashboard.css';
import { Sidebar, type NavKey } from './dashboard/Sidebar';
import { StatTile } from './dashboard/StatTile';
import { ServicesTable } from './dashboard/ServicesTable';
import { LineChart } from './dashboard/charts/LineChart';
import { ColumnChart } from './dashboard/charts/ColumnChart';
import { StackedBar } from './dashboard/charts/StackedBar';
import { Sparkline } from './dashboard/charts/Sparkline';
import {
  DAYS,
  LANGUAGES,
  RANGE_OPTIONS,
  SERVICES,
  type RangeKey,
} from './dashboard/data';

export function DashboardApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [nav, setNav] = useState<NavKey>('overview');
  const [range, setRange] = useState<RangeKey>('30d');

  const toggleTheme = (isSelected: boolean) => {
    setDarkMode(isSelected);
    document.documentElement.setAttribute(
      'data-theme-mode',
      isSelected ? 'dark' : 'light',
    );
  };

  const days = useMemo(() => {
    const count = RANGE_OPTIONS.find((option) => option.id === range)!.days;
    return DAYS.slice(-count);
  }, [range]);

  const week = DAYS.slice(-7);
  const prevWeek = DAYS.slice(-14, -7);
  const deploys = (list: typeof DAYS) =>
    list.reduce((sum, d) => sum + d.production + d.staging, 0);
  const weekDeploys = deploys(week);
  const weekDelta = Math.round(
    ((weekDeploys - deploys(prevWeek)) / deploys(prevWeek)) * 100,
  );
  const healthy = SERVICES.filter((s) => s.status === 'healthy').length;

  return (
    <div className="app-shell">
      <Sidebar selected={nav} onSelect={setNav} />
      <main className="app-main">
        <Header
          title="Platform overview"
          description="Deployments, builds and service health across the Acme Cloud fleet."
          tags={[{ label: 'production' }, { label: 'eu-west-1' }]}
          metadata={[
            { label: 'Services', value: String(SERVICES.length) },
            { label: 'Teams', value: '4' },
          ]}
          customActions={
            <Flex align="center" gap="4">
              <SearchField
                size="small"
                placeholder="Search services"
                aria-label="Search services"
              />
              <Switch
                label="Dark mode"
                isSelected={darkMode}
                onChange={toggleTheme}
              />
            </Flex>
          }
        />

        <Flex direction="column" gap="4" mt="4">
          <div className="kpi-row">
            <StatTile
              label="Deployments (7d)"
              value={String(weekDeploys)}
              delta={{
                text: `${Math.abs(weekDelta)}% vs prior week`,
                direction: weekDelta >= 0 ? 'up' : 'down',
              }}
              trend={<Sparkline values={DAYS.slice(-12).map((d) => d.production + d.staging)} />}
            />
            <StatTile
              label="Deploy success rate"
              value="98.2%"
              delta={{ text: '0.4pt vs prior week', direction: 'up' }}
            />
            <StatTile
              label="Healthy services"
              value={`${healthy} / ${SERVICES.length}`}
            />
            <StatTile
              label="Open incidents"
              value="2"
              delta={{
                text: '3 fewer than last week',
                direction: 'down',
                upIsGood: false,
              }}
            />
          </div>

          {/* Filter row: one row, above the charts it scopes */}
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

          <div className="charts-row">
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
                  Build minutes per day
                </Text>
              </CardHeader>
              <CardBody>
                <ColumnChart
                  title="Build minutes per day"
                  labels={days.map((d) => d.label)}
                  values={days.map((d) => d.buildMinutes)}
                />
              </CardBody>
            </Card>
          </div>

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

          <Card>
            <CardHeader>
              <Flex align="center" justify="between">
                <Text variant="title-x-small" as="h2">
                  Services
                </Text>
                <Text variant="body-small" color="secondary">
                  {healthy} healthy · {SERVICES.length - healthy} attention
                </Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <ServicesTable />
            </CardBody>
          </Card>
        </Flex>
      </main>
    </div>
  );
}
