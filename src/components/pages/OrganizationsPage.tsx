import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Menu,
  MenuItem,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
  SubmenuTrigger,
  Text,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { StatusPill } from '../dashboard/StatusPill';

interface Workspace {
  id: string;
  name: string;
  plan: 'Starter' | 'Team' | 'Enterprise';
  members: number;
  services: number;
  role: string;
  region: string;
}

const WORKSPACES: Workspace[] = [
  { id: 'acme', name: 'Acme Cloud', plan: 'Team', members: 8, services: 24, role: 'Owner', region: 'eu-west-1' },
  { id: 'acme-labs', name: 'Acme Labs', plan: 'Starter', members: 3, services: 4, role: 'Developer', region: 'eu-west-1' },
  { id: 'northwind', name: 'Northwind Platform', plan: 'Enterprise', members: 142, services: 310, role: 'Read only', region: 'us-east-1' },
];

export function OrganizationsPage() {
  const [current, setCurrent] = useState('acme');
  const active = WORKSPACES.find((w) => w.id === current)!;

  return (
    <>
      <PageHeader
        title="Organizations"
        description="Every workspace this account belongs to, and which one you are in."
        metadata={[
          { label: 'Workspaces', value: String(WORKSPACES.length) },
          { label: 'Current', value: active.name },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        <Card>
          <CardHeader>
            <Flex align="center" justify="between" gap="4">
              <Text variant="title-x-small" as="h2">
                Switch workspace
              </Text>
              {/* Grouped by whether switching is instant or needs a new
                  session, because that is the part with a consequence. */}
              <MenuTrigger>
                <Button variant="secondary" size="small">
                  {active.name}
                </Button>
                <Menu>
                  <MenuSection title="Signed in">
                    {WORKSPACES.filter((w) => w.role !== 'Read only').map((workspace) => (
                      <MenuItem
                        key={workspace.id}
                        onAction={() => setCurrent(workspace.id)}
                      >
                        {workspace.name}
                      </MenuItem>
                    ))}
                  </MenuSection>
                  <MenuSection title="Needs a new session">
                    {WORKSPACES.filter((w) => w.role === 'Read only').map((workspace) => (
                      <MenuItem
                        key={workspace.id}
                        onAction={() => setCurrent(workspace.id)}
                      >
                        {workspace.name}
                      </MenuItem>
                    ))}
                  </MenuSection>
                  <MenuSeparator />
                  <SubmenuTrigger>
                    <MenuItem>Create a workspace</MenuItem>
                    <Menu>
                      <MenuItem>Empty workspace</MenuItem>
                      <MenuItem>Copy Acme Cloud settings</MenuItem>
                      <MenuItem>Import from another provider</MenuItem>
                    </Menu>
                  </SubmenuTrigger>
                </Menu>
              </MenuTrigger>
            </Flex>
          </CardHeader>
          <CardBody>
            <Flex direction="column" gap="3">
              {WORKSPACES.map((workspace) => (
                <div
                  key={workspace.id}
                  className="workspace-row"
                  data-current={workspace.id === current}
                >
                  <Avatar src="" name={workspace.name} size="small" />
                  <Flex direction="column" gap="1">
                    <Flex align="center" gap="2">
                      <Text variant="body-medium" as="span">
                        {workspace.name}
                      </Text>
                      {workspace.id === current && (
                        <StatusPill tone="good" label="Current" />
                      )}
                    </Flex>
                    <Text variant="body-small" color="secondary">
                      {workspace.members} members · {workspace.services} services ·{' '}
                      {workspace.region}
                    </Text>
                  </Flex>
                  <Flex align="center" gap="3" className="workspace-end">
                    <Badge>{workspace.plan}</Badge>
                    <Text variant="body-small" color="secondary">
                      You are {workspace.role}
                    </Text>
                    <Button
                      size="small"
                      variant="secondary"
                      isDisabled={workspace.id === current}
                      onPress={() => setCurrent(workspace.id)}
                    >
                      {workspace.id === current ? 'Open' : 'Switch'}
                    </Button>
                  </Flex>
                </div>
              ))}
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Flex direction="column" gap="2">
              <Text variant="title-x-small" as="h2">
                One account, several workspaces
              </Text>
              <Text color="secondary">
                Your role is per workspace, not per account: you own Acme Cloud
                and can only read Northwind Platform. Nothing you do in one
                carries over to another, including API keys.
              </Text>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
