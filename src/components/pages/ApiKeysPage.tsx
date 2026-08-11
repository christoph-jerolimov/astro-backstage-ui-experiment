import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Cell,
  CellText,
  Column,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Flex,
  Row,
  TableBody,
  TableHeader,
  TableRoot,
  Text,
  TextField,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
}

const INITIAL_KEYS: ApiKey[] = [
  { id: 'k1', name: 'CI pipeline', prefix: 'acm_live_8f2c', created: 'Mar 4, 2026', lastUsed: '12 minutes ago' },
  { id: 'k2', name: 'Terraform', prefix: 'acm_live_1d7a', created: 'Jan 19, 2026', lastUsed: '2 days ago' },
  { id: 'k3', name: 'Local dev (Ada)', prefix: 'acm_test_44b0', created: 'Dec 2, 2025', lastUsed: 'Never' },
];

export function ApiKeysPage() {
  const [keys, setKeys] = useState(INITIAL_KEYS);
  const [newName, setNewName] = useState('');
  const [created, setCreated] = useState<string | null>(null);
  // Backstage UI's Dialog takes plain children, not react-aria's render prop,
  // so the open state is held here and the trigger is controlled.
  const [revoking, setRevoking] = useState<string | null>(null);

  const createKey = () => {
    const name = newName.trim();
    if (!name) return;
    const id = `k${keys.length + 1}`;
    setKeys([
      ...keys,
      {
        id,
        name,
        prefix: `acm_live_${id}9f`,
        created: 'Just now',
        lastUsed: 'Never',
      },
    ]);
    setCreated(`acm_live_${id}9f_SECRETVALUEONLYSHOWNONCE`);
    setNewName('');
  };

  const revoke = (id: string) => setKeys(keys.filter((key) => key.id !== id));

  return (
    <>
      <PageHeader
        title="API keys"
        description="Tokens that can act on this workspace. Treat them like passwords."
        tags={[{ label: 'account' }]}
        metadata={[{ label: 'Active keys', value: String(keys.length) }]}
      />

      <Flex direction="column" gap="4" mt="4">
        {created && (
          <Card>
            <CardBody>
              <Flex direction="column" gap="2">
                <Text variant="title-x-small" as="h2">
                  Copy your new key now
                </Text>
                <Text variant="body-small" color="secondary">
                  This is the only time the full value is shown.
                </Text>
                <code className="secret">{created}</code>
                <Flex justify="end">
                  <Button
                    variant="secondary"
                    size="small"
                    onPress={() => setCreated(null)}
                  >
                    Done
                  </Button>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader>
            <Text variant="title-x-small" as="h2">
              Create a key
            </Text>
          </CardHeader>
          <CardBody>
            <Flex align="end" gap="4">
              <div style={{ flex: 1 }}>
                <TextField
                  label="Key name"
                  placeholder="What will use this key?"
                  value={newName}
                  onChange={setNewName}
                />
              </div>
              <Button variant="primary" onPress={createKey}>
                Create key
              </Button>
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Text variant="title-x-small" as="h2">
              Your keys
            </Text>
          </CardHeader>
          <CardBody>
            {keys.length > 0 ? (
              <div className="table-scroll">
                <TableRoot aria-label="API keys">
                  <TableHeader>
                    <Column isRowHeader>Name</Column>
                    <Column>Key</Column>
                    <Column>Created</Column>
                    <Column>Last used</Column>
                    <Column>Actions</Column>
                  </TableHeader>
                  <TableBody>
                    {keys.map((key) => (
                      <Row key={key.id}>
                        <CellText title={key.name} />
                        <CellText title={`${key.prefix}••••••••`} />
                        <CellText title={key.created} />
                        <CellText title={key.lastUsed} />
                        <Cell>
                          <DialogTrigger
                            isOpen={revoking === key.id}
                            onOpenChange={(open) =>
                              setRevoking(open ? key.id : null)
                            }
                          >
                            <Button variant="secondary" size="small" destructive>
                              Revoke
                            </Button>
                            <Dialog>
                              <DialogHeader>
                                <Text variant="title-x-small" as="h2">
                                  Revoke {key.name}?
                                </Text>
                              </DialogHeader>
                              <DialogBody>
                                <Text>
                                  Anything using this key stops working
                                  immediately. This cannot be undone.
                                </Text>
                              </DialogBody>
                              <DialogFooter>
                                <Flex gap="2" justify="end">
                                  <Button
                                    variant="secondary"
                                    onPress={() => setRevoking(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="primary"
                                    destructive
                                    onPress={() => {
                                      revoke(key.id);
                                      setRevoking(null);
                                    }}
                                  >
                                    Revoke key
                                  </Button>
                                </Flex>
                              </DialogFooter>
                            </Dialog>
                          </DialogTrigger>
                        </Cell>
                      </Row>
                    ))}
                  </TableBody>
                </TableRoot>
              </div>
            ) : (
              <Text color="secondary">
                No API keys yet. Create one above to get started.
              </Text>
            )}
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
