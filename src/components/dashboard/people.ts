/** The workspace's people, shared by the team, roles and audit pages. */
export type MemberRole = 'Owner' | 'Billing admin' | 'Developer' | 'Read only';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  team: string;
  lastActive: string;
  status: 'active' | 'invited' | 'suspended';
}

export const MEMBERS: Member[] = [
  { id: 'ada', name: 'Ada Lovelace', email: 'ada@acme.cloud', role: 'Owner', team: 'team-atlas', lastActive: '2 minutes ago', status: 'active' },
  { id: 'grace', name: 'Grace Hopper', email: 'grace@acme.cloud', role: 'Billing admin', team: 'team-ledger', lastActive: '1 hour ago', status: 'active' },
  { id: 'alan', name: 'Alan Turing', email: 'alan@acme.cloud', role: 'Developer', team: 'team-vault', lastActive: '3 hours ago', status: 'active' },
  { id: 'katherine', name: 'Katherine Johnson', email: 'katherine@acme.cloud', role: 'Developer', team: 'team-signal', lastActive: 'Yesterday', status: 'active' },
  { id: 'margaret', name: 'Margaret Hamilton', email: 'margaret@acme.cloud', role: 'Developer', team: 'team-atlas', lastActive: 'Yesterday', status: 'active' },
  { id: 'barbara', name: 'Barbara Liskov', email: 'barbara@acme.cloud', role: 'Read only', team: 'team-ledger', lastActive: '4 days ago', status: 'active' },
  { id: 'radia', name: 'Radia Perlman', email: 'radia@acme.cloud', role: 'Developer', team: 'team-signal', lastActive: 'Never', status: 'invited' },
  { id: 'jean', name: 'Jean Bartik', email: 'jean@acme.cloud', role: 'Developer', team: 'team-vault', lastActive: '3 weeks ago', status: 'suspended' },
];

export const ROLES: MemberRole[] = ['Owner', 'Billing admin', 'Developer', 'Read only'];
