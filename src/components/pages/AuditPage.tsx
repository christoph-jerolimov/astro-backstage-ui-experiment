import { useMemo, useState } from 'react';
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Flex,
  SearchField,
  Select,
  Text,
  ToggleButton,
  ToggleButtonGroup,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { MEMBERS } from '../dashboard/people';

type Category = 'access' | 'delivery' | 'billing' | 'catalog';

interface Entry {
  id: string;
  actor: string;
  action: string;
  target: string;
  category: Category;
  at: string;
  day: string;
  ip: string;
}

const ENTRIES: Entry[] = [
  { id: 'a-31', actor: 'Ada Lovelace', action: 'granted Billing admin to', target: 'Grace Hopper', category: 'access', at: '09:41', day: 'Today', ip: '10.4.1.22' },
  { id: 'a-30', actor: 'Alan Turing', action: 'deployed', target: 'catalog-api v2.14.0 to production', category: 'delivery', at: '09:12', day: 'Today', ip: '10.4.2.7' },
  { id: 'a-29', actor: 'Grace Hopper', action: 'changed the plan to', target: 'Team, billed yearly', category: 'billing', at: '08:55', day: 'Today', ip: '10.4.1.9' },
  { id: 'a-28', actor: 'Margaret Hamilton', action: 'rolled back', target: 'notification-hub v0.9.7', category: 'delivery', at: '08:03', day: 'Today', ip: '10.4.2.31' },
  { id: 'a-27', actor: 'Ada Lovelace', action: 'invited', target: 'radia@acme.cloud', category: 'access', at: '17:22', day: 'Yesterday', ip: '10.4.1.22' },
  { id: 'a-26', actor: 'Katherine Johnson', action: 'created', target: 'metrics-collector', category: 'catalog', at: '15:40', day: 'Yesterday', ip: '10.4.3.4' },
  { id: 'a-25', actor: 'Alan Turing', action: 'revoked the API key', target: 'ci-deploy-key', category: 'access', at: '14:07', day: 'Yesterday', ip: '10.4.2.7' },
  { id: 'a-24', actor: 'Ada Lovelace', action: 'suspended', target: 'Jean Bartik', category: 'access', at: '11:36', day: 'Yesterday', ip: '10.4.1.22' },
  { id: 'a-23', actor: 'Grace Hopper', action: 'downloaded the invoice', target: 'INV-2026-07', category: 'billing', at: '10:02', day: '9 August', ip: '10.4.1.9' },
  { id: 'a-22', actor: 'Barbara Liskov', action: 'deleted', target: 'legacy-importer', category: 'catalog', at: '16:48', day: '9 August', ip: '10.4.4.12' },
];

const CATEGORIES: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'access', label: 'Access' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'billing', label: 'Billing' },
  { id: 'catalog', label: 'Catalog' },
];

const ACTORS = [
  { id: 'all', label: 'Anyone' },
  ...MEMBERS.map((member) => ({ id: member.name, label: member.name })),
];

export function AuditPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Set<string>>(new Set(['all']));
  const [actor, setActor] = useState('all');

  const active = ([...category][0] ?? 'all') as Category | 'all';

  const entries = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return ENTRIES.filter((entry) => {
      if (active !== 'all' && entry.category !== active) return false;
      if (actor !== 'all' && entry.actor !== actor) return false;
      if (!needle) return true;
      return `${entry.actor} ${entry.action} ${entry.target}`
        .toLowerCase()
        .includes(needle);
    });
  }, [query, active, actor]);

  // Grouped by day, because "when" is the first question asked of an audit
  // log and a flat list of timestamps answers it badly.
  const days = useMemo(() => {
    const order: string[] = [];
    const byDay = new Map<string, Entry[]>();
    for (const entry of entries) {
      if (!byDay.has(entry.day)) {
        byDay.set(entry.day, []);
        order.push(entry.day);
      }
      byDay.get(entry.day)!.push(entry);
    }
    return order.map((day) => ({ day, entries: byDay.get(day)! }));
  }, [entries]);

  return (
    <>
      <PageHeader
        title="Audit log"
        description="Who did what, to which thing, and when. Retained for 400 days."
        metadata={[
          { label: 'Entries', value: String(ENTRIES.length) },
          { label: 'Retention', value: '400 days' },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        <Flex align="end" gap="4" >
          <div style={{ width: 260 }}>
            <SearchField
              size="small"
              label="Filter entries"
              placeholder="Action or target"
              value={query}
              onChange={setQuery}
            />
          </div>
          <div style={{ width: 200 }}>
            <Select
              size="small"
              label="Actor"
              options={ACTORS}
              value={actor}
              onChange={(key) => setActor(String(key))}
            />
          </div>
        </Flex>

        <ToggleButtonGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={category}
          onSelectionChange={(keys) => setCategory(new Set(keys as Set<string>))}
        >
          {CATEGORIES.map(({ id, label }) => (
            <ToggleButton key={id} id={id}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Card>
          <CardHeader>
            <Flex align="center" justify="between">
              <Text variant="title-x-small" as="h2">
                Activity
              </Text>
              <Text variant="body-small" color="secondary">
                {entries.length} of {ENTRIES.length} entries
              </Text>
            </Flex>
          </CardHeader>
          <CardBody>
            {days.length === 0 ? (
              <div className="empty-state">
                <Text variant="title-x-small" as="p">
                  Nothing matches those filters
                </Text>
                <Text color="secondary">
                  An empty audit log is a filter problem, not an absence of
                  activity — widen it and the entries come back.
                </Text>
              </div>
            ) : (
              <Flex direction="column" gap="4">
                {days.map(({ day, entries: dayEntries }) => (
                  <div key={day}>
                    <Text variant="body-small" color="secondary" as="p">
                      {day}
                    </Text>
                    <ul className="audit-list">
                      {dayEntries.map((entry) => (
                        <li key={entry.id} data-category={entry.category}>
                          <Avatar src="" name={entry.actor} size="small" />
                          <div className="audit-line">
                            <Text as="span">
                              <strong>{entry.actor}</strong> {entry.action}{' '}
                              <strong>{entry.target}</strong>
                            </Text>
                            <Text variant="body-small" color="secondary" as="span">
                              {entry.at} · {entry.ip} · {entry.category}
                            </Text>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Flex>
            )}
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
