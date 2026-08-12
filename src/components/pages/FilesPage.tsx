import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Link,
  List,
  ListRow,
  SearchField,
  Text,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';

interface Node {
  name: string;
  kind: 'folder' | 'file';
  size?: number;
  owner?: string;
  changed?: string;
}

/** A flat map of path to contents; the demo never needs a real tree. */
const TREE: Record<string, Node[]> = {
  '': [
    { name: 'artifacts', kind: 'folder' },
    { name: 'backups', kind: 'folder' },
    { name: 'runbooks', kind: 'folder' },
    { name: 'terraform.tfstate', kind: 'file', size: 2_411_000, owner: 'team-vault', changed: '2 hours ago' },
    { name: 'README.md', kind: 'file', size: 4_200, owner: 'team-atlas', changed: 'Yesterday' },
  ],
  artifacts: [
    { name: 'catalog-api', kind: 'folder' },
    { name: 'auth-gateway', kind: 'folder' },
    { name: 'billing-worker', kind: 'folder' },
  ],
  'artifacts/catalog-api': [
    { name: 'catalog-api-2.14.0.tar.gz', kind: 'file', size: 48_200_000, owner: 'ci', changed: '12 minutes ago' },
    { name: 'catalog-api-2.13.0.tar.gz', kind: 'file', size: 47_900_000, owner: 'ci', changed: '6 days ago' },
    { name: 'catalog-api-2.12.4.tar.gz', kind: 'file', size: 47_100_000, owner: 'ci', changed: '3 weeks ago' },
    { name: 'sbom.json', kind: 'file', size: 812_000, owner: 'ci', changed: '12 minutes ago' },
  ],
  'artifacts/auth-gateway': [
    { name: 'auth-gateway-3.2.0-rc1.tar.gz', kind: 'file', size: 22_400_000, owner: 'ci', changed: '2 hours ago' },
  ],
  'artifacts/billing-worker': [
    { name: 'billing-worker-1.4.2.tar.gz', kind: 'file', size: 31_000_000, owner: 'ci', changed: '3 hours ago' },
  ],
  backups: [
    { name: 'postgres-2026-08-12.dump', kind: 'file', size: 1_240_000_000, owner: 'team-ledger', changed: '4 hours ago' },
    { name: 'postgres-2026-08-11.dump', kind: 'file', size: 1_230_000_000, owner: 'team-ledger', changed: 'Yesterday' },
  ],
  runbooks: [
    { name: 'sev1-elevated-5xx.md', kind: 'file', size: 8_100, owner: 'team-signal', changed: 'Last week' },
    { name: 'rotate-deploy-key.md', kind: 'file', size: 3_400, owner: 'team-vault', changed: '2 weeks ago' },
  ],
};

/** Bytes as people read them, not as they are stored. */
function fileSize(bytes: number) {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${Math.round(bytes / 1e6)} MB`;
  if (bytes >= 1e3) return `${Math.round(bytes / 1e3)} KB`;
  return `${bytes} B`;
}

export function FilesPage() {
  const [path, setPath] = useState('');
  const [query, setQuery] = useState('');

  const nodes = TREE[path] ?? [];
  const segments = path ? path.split('/') : [];

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return nodes;
    return nodes.filter((node) => node.name.toLowerCase().includes(needle));
  }, [nodes, query]);

  const open = (name: string) => {
    setPath(path ? `${path}/${name}` : name);
    setQuery('');
  };

  return (
    <>
      <PageHeader
        title="Files"
        description="Build artifacts, backups and runbooks, wherever the platform put them."
        metadata={[
          { label: 'Location', value: path === '' ? '/' : `/${path}` },
          { label: 'Items', value: String(nodes.length) },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        <Flex align="center" justify="between" gap="4">
          {/* The breadcrumb is the only way up, so every segment is a link
              rather than just the parent. */}
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <Link href="#" onPress={() => setPath('')}>
              Files
            </Link>
            {segments.map((segment, index) => {
              const target = segments.slice(0, index + 1).join('/');
              const isLast = index === segments.length - 1;
              return (
                <span key={target} className="breadcrumb-part">
                  <span aria-hidden="true">/</span>
                  {isLast ? (
                    <Text variant="body-small" as="span">
                      {segment}
                    </Text>
                  ) : (
                    <Link href="#" onPress={() => setPath(target)}>
                      {segment}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>

          <div style={{ width: 240 }}>
            <SearchField
              size="small"
              label="Filter this folder"
              placeholder="Name"
              value={query}
              onChange={setQuery}
            />
          </div>
        </Flex>

        <Card>
          <CardHeader>
            <Flex align="center" justify="between" gap="4">
              <Text variant="title-x-small" as="h2">
                {path === '' ? 'All files' : segments.at(-1)}
              </Text>
              <Button
                variant="secondary"
                size="small"
                isDisabled={path === ''}
                onPress={() =>
                  setPath(segments.slice(0, -1).join('/'))
                }
              >
                Up one level
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            {shown.length === 0 ? (
              <div className="empty-state">
                <Text variant="title-x-small" as="p">
                  {query ? 'Nothing here matches' : 'This folder is empty'}
                </Text>
                <Text color="secondary">
                  {query
                    ? 'The filter only looks in this folder, not below it.'
                    : 'Artifacts land here when a pipeline publishes them.'}
                </Text>
              </div>
            ) : (
              <List aria-label="Files">
                {shown.map((node) => (
                  <ListRow
                    key={node.name}
                    id={node.name}
                    textValue={node.name}
                    icon={node.kind === 'folder' ? <IconFolder /> : <IconFile />}
                    description={
                      node.kind === 'folder'
                        ? `${(TREE[path ? `${path}/${node.name}` : node.name] ?? []).length} items`
                        : `${fileSize(node.size!)} · ${node.owner} · ${node.changed}`
                    }
                    onAction={
                      node.kind === 'folder' ? () => open(node.name) : undefined
                    }
                  >
                    {node.name}
                  </ListRow>
                ))}
              </List>
            )}
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}

function IconFolder() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 5a1 1 0 0 1 1-1h3.5l1.5 2H15a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
    </svg>
  );
}

function IconFile() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 2.5h6L14 6v9.5H4z" />
      <path d="M10 2.5V6h4" />
    </svg>
  );
}
