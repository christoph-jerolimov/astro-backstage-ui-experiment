import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Cell,
  CellProfile,
  CellText,
  Column,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Flex,
  Row,
  SearchField,
  Select,
  TableBody,
  TableHeader,
  TableRoot,
  Text,
  TextField,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { StatusPill, type StatusTone } from '../dashboard/StatusPill';
import { MEMBERS, ROLES, type Member } from '../dashboard/people';

const STATUS: Record<Member['status'], { tone: StatusTone; label: string }> = {
  active: { tone: 'good', label: 'Active' },
  invited: { tone: 'warning', label: 'Invited' },
  suspended: { tone: 'critical', label: 'Suspended' },
};

const ROLE_OPTIONS = ROLES.map((role) => ({ id: role, label: role }));

export function TeamPage() {
  const [query, setQuery] = useState('');
  const [invited, setInvited] = useState<string[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('Developer');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const members = useMemo(() => {
    const rows = [
      ...MEMBERS,
      ...invited.map((email, index) => ({
        id: `invited-${index}`,
        name: email.split('@')[0]!,
        email,
        role: inviteRole as Member['role'],
        team: 'unassigned',
        lastActive: 'Never',
        status: 'invited' as const,
      })),
    ];
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((member) =>
      `${member.name} ${member.email} ${member.team} ${member.role}`
        .toLowerCase()
        .includes(needle),
    );
  }, [query, invited, inviteRole]);

  const send = () => {
    const email = inviteEmail.trim();
    if (!email.includes('@')) {
      setInviteError('Enter an email address to invite.');
      return;
    }
    if ([...MEMBERS.map((m) => m.email), ...invited].includes(email)) {
      setInviteError(`${email} is already in this workspace.`);
      return;
    }
    setInvited((prev) => [...prev, email]);
    setInviteEmail('');
    setInviteError(null);
    setIsOpen(false);
  };

  const pending = members.filter((m) => m.status === 'invited').length;

  return (
    <>
      <PageHeader
        title="Team"
        description="Everyone in the Acme Cloud workspace, and what they can do."
        metadata={[
          { label: 'Members', value: String(MEMBERS.length + invited.length) },
          { label: 'Pending invites', value: String(pending) },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        <Flex align="end" justify="between" gap="4">
          <div style={{ width: 280 }}>
            <SearchField
              size="small"
              label="Filter people"
              placeholder="Name, email or team"
              value={query}
              onChange={setQuery}
            />
          </div>

          {/* Controlled, because sending an invite has to close it. */}
          <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <Button variant="primary" size="small">
              Invite people
            </Button>
            <Dialog width={420}>
              <DialogHeader>Invite someone</DialogHeader>
              <DialogBody>
                <Flex direction="column" gap="4">
                  {inviteError && (
                    <div className="form-error" role="alert">
                      {inviteError}
                    </div>
                  )}
                  <TextField
                    label="Email address"
                    placeholder="newcomer@acme.cloud"
                    value={inviteEmail}
                    onChange={setInviteEmail}
                  />
                  <Select
                    label="Role"
                    description="Roles can be changed later from this page."
                    options={ROLE_OPTIONS}
                    value={inviteRole}
                    onChange={(key) => setInviteRole(String(key))}
                  />
                </Flex>
              </DialogBody>
              <DialogFooter>
                <Flex gap="2" justify="end">
                  <Button variant="secondary" onPress={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onPress={send}>
                    Send invite
                  </Button>
                </Flex>
              </DialogFooter>
            </Dialog>
          </DialogTrigger>
        </Flex>

        <Card>
          <CardHeader>
            <Flex align="center" justify="between">
              <Text variant="title-x-small" as="h2">
                People
              </Text>
              <Text variant="body-small" color="secondary">
                {members.length} shown
              </Text>
            </Flex>
          </CardHeader>
          <CardBody>
            <div className="table-scroll">
              <TableRoot aria-label="People">
                <TableHeader>
                  <Column isRowHeader>Person</Column>
                  <Column>Role</Column>
                  <Column>Team</Column>
                  <Column>Last active</Column>
                  <Column>Status</Column>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <Row key={member.id} id={member.id}>
                      {/* Name and address in one cell: two columns of the
                          same identity is wasted width. */}
                      <CellProfile
                        name={member.name}
                        description={member.email}
                        src=""
                      />
                      <CellText title={member.role} />
                      <CellText title={member.team} />
                      <CellText title={member.lastActive} />
                      <Cell>
                        <StatusPill {...STATUS[member.status]} />
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
