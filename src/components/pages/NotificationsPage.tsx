import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  List,
  ListRow,
  Text,
  ToggleButton,
  ToggleButtonGroup,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';

type Kind = 'deploy' | 'incident' | 'mention';

interface Notification {
  id: string;
  kind: Kind;
  title: string;
  detail: string;
  when: string;
  unread: boolean;
}

const INITIAL: Notification[] = [
  { id: 'n1', kind: 'incident', title: 'INC-241 opened on notification-hub', detail: 'SEV1 · elevated 5xx on delivery', when: '9 minutes ago', unread: true },
  { id: 'n2', kind: 'deploy', title: 'catalog-api v2.14.0 reached production', detail: 'Deployed by ada · 3m 12s', when: '12 minutes ago', unread: true },
  { id: 'n3', kind: 'mention', title: 'Grace mentioned you in INC-240', detail: '"can you check the token refresh path?"', when: '1 hour ago', unread: true },
  { id: 'n4', kind: 'deploy', title: 'notification-hub v0.9.7 rolled back', detail: 'Automatic rollback after health check', when: '1 hour ago', unread: false },
  { id: 'n5', kind: 'incident', title: 'INC-238 mitigated', detail: 'Search index lag back within threshold', when: 'Yesterday', unread: false },
  { id: 'n6', kind: 'deploy', title: 'billing-worker v1.4.2 failed', detail: 'Migration step exited non-zero', when: 'Yesterday', unread: false },
];

const FILTERS: { id: 'all' | Kind; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'deploy', label: 'Deploys' },
  { id: 'incident', label: 'Incidents' },
  { id: 'mention', label: 'Mentions' },
];

export function NotificationsPage() {
  const [items, setItems] = useState(INITIAL);
  const [filter, setFilter] = useState<Set<string>>(new Set(['all']));

  const active = ([...filter][0] ?? 'all') as 'all' | Kind;
  const shown = active === 'all' ? items : items.filter((n) => n.kind === active);
  const unread = items.filter((n) => n.unread).length;

  const markAllRead = () =>
    setItems(items.map((item) => ({ ...item, unread: false })));

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Everything the platform wanted to tell you."
        tags={[{ label: 'inbox' }]}
        metadata={[{ label: 'Unread', value: String(unread) }]}
      />

      <Flex direction="column" gap="4" mt="4">
        {unread > 0 && (
          <Alert
            status="info"
            title={`${unread} unread notification${unread === 1 ? '' : 's'}`}
            description="Anything marked read stays in the list."
            customActions={
              <Button variant="secondary" size="small" onPress={markAllRead}>
                Mark all read
              </Button>
            }
          />
        )}

        <ToggleButtonGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={filter}
          onSelectionChange={(keys) => setFilter(new Set(keys as Set<string>))}
        >
          {FILTERS.map(({ id, label }) => (
            <ToggleButton key={id} id={id}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Card>
          <CardHeader>
            <Flex align="center" justify="between">
              <Text variant="title-x-small" as="h2">
                Inbox
              </Text>
              <Text variant="body-small" color="secondary">
                {shown.length} shown · {unread} unread
              </Text>
            </Flex>
          </CardHeader>
          <CardBody>
            <List
              aria-label="Notifications"
              renderEmptyState={() => (
                <Text color="secondary">Nothing of that kind yet.</Text>
              )}
            >
              {shown.map((item) => (
                <ListRow
                  key={item.id}
                  id={item.id}
                  textValue={item.title}
                  description={`${item.detail} · ${item.when}`}
                  customActions={
                    item.unread ? (
                      <span className="unread-dot" aria-label="Unread" />
                    ) : undefined
                  }
                >
                  {item.title}
                </ListRow>
              ))}
            </List>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
