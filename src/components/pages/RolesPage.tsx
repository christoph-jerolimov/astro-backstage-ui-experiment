import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  Text,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { MEMBERS, ROLES, type MemberRole } from '../dashboard/people';

interface Permission {
  id: string;
  label: string;
  group: string;
  /** Roles that hold this permission and cannot give it up. */
  fixed?: MemberRole[];
}

const PERMISSIONS: Permission[] = [
  { id: 'services.read', label: 'View services', group: 'Catalog', fixed: ['Owner', 'Billing admin', 'Developer', 'Read only'] },
  { id: 'services.create', label: 'Create services', group: 'Catalog', fixed: ['Owner'] },
  { id: 'services.delete', label: 'Delete services', group: 'Catalog', fixed: ['Owner'] },
  { id: 'deploy.staging', label: 'Deploy to staging', group: 'Delivery' },
  { id: 'deploy.production', label: 'Deploy to production', group: 'Delivery', fixed: ['Owner'] },
  { id: 'deploy.rollback', label: 'Roll back a release', group: 'Delivery', fixed: ['Owner'] },
  { id: 'incidents.ack', label: 'Acknowledge incidents', group: 'On-call' },
  { id: 'incidents.close', label: 'Close incidents', group: 'On-call' },
  { id: 'billing.view', label: 'View invoices', group: 'Billing', fixed: ['Owner', 'Billing admin'] },
  { id: 'billing.manage', label: 'Change the plan', group: 'Billing', fixed: ['Owner', 'Billing admin'] },
  { id: 'people.invite', label: 'Invite people', group: 'Workspace', fixed: ['Owner'] },
  { id: 'people.roles', label: 'Change roles', group: 'Workspace', fixed: ['Owner'] },
];

/** Where each role starts, before anything is toggled. */
const DEFAULTS: Record<MemberRole, string[]> = {
  Owner: PERMISSIONS.map((p) => p.id),
  'Billing admin': ['services.read', 'deploy.staging', 'billing.view', 'billing.manage'],
  Developer: ['services.read', 'deploy.staging', 'incidents.ack', 'incidents.close'],
  'Read only': ['services.read'],
};

const GROUPS = [...new Set(PERMISSIONS.map((p) => p.group))];

export function RolesPage() {
  const [granted, setGranted] = useState<Record<MemberRole, string[]>>(DEFAULTS);

  const toggle = (role: MemberRole, permission: string) => {
    setGranted((prev) => {
      const held = prev[role];
      return {
        ...prev,
        [role]: held.includes(permission)
          ? held.filter((id) => id !== permission)
          : [...held, permission],
      };
    });
  };

  const countFor = (role: MemberRole) => granted[role].length;
  const peopleWith = (role: MemberRole) =>
    MEMBERS.filter((member) => member.role === role).length;

  return (
    <>
      <PageHeader
        title="Roles"
        description="What each role can do. Changes apply to everyone holding it."
        metadata={[
          { label: 'Roles', value: String(ROLES.length) },
          { label: 'Permissions', value: String(PERMISSIONS.length) },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        <Card>
          <CardHeader>
            <Text variant="title-x-small" as="h2">
              Permissions by role
            </Text>
          </CardHeader>
          <CardBody>
            <div className="table-scroll">
              {/* A plain table, not the data table: this grid is edited in
                  place, and every cell is a control rather than a value. */}
              <table className="matrix">
                <thead>
                  <tr>
                    <th scope="col">Permission</th>
                    {ROLES.map((role) => (
                      <th key={role} scope="col">
                        <span>{role}</span>
                        <span className="matrix-sub">
                          {countFor(role)} of {PERMISSIONS.length} ·{' '}
                          {peopleWith(role)}{' '}
                          {peopleWith(role) === 1 ? 'person' : 'people'}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                {GROUPS.map((group) => (
                  <tbody key={group}>
                    <tr className="matrix-group">
                      <th scope="rowgroup" colSpan={ROLES.length + 1}>
                        {group}
                      </th>
                    </tr>
                    {PERMISSIONS.filter((p) => p.group === group).map((permission) => (
                      <tr key={permission.id}>
                        <th scope="row">{permission.label}</th>
                        {ROLES.map((role) => {
                          const locked = permission.fixed?.includes(role) ?? false;
                          return (
                            <td key={role}>
                              {/* Locked cells stay checked and disabled rather
                                  than disappearing: an empty cell would read
                                  as "not granted". */}
                              <Checkbox
                                isSelected={
                                  locked || granted[role].includes(permission.id)
                                }
                                isDisabled={locked}
                                onChange={() => toggle(role, permission.id)}
                                aria-label={`${permission.label} for ${role}`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Flex direction="column" gap="2">
              <Text variant="title-x-small" as="h2">
                Why some boxes cannot be unticked
              </Text>
              <Text color="secondary">
                An Owner keeps every permission by definition — a workspace
                with no one who can invite people or change the plan is
                unrecoverable. Billing admins keep the billing permissions for
                the same reason. Those cells are disabled rather than hidden,
                so the grid still reads as a complete picture.
              </Text>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
