import { useMemo, useState } from 'react';
import type { Key, Selection, SortDescriptor } from 'react-aria-components';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Cell,
  CellText,
  Flex,
  SearchField,
  Select,
  Table,
  Text,
  type ColumnConfig,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { StatusPill, type StatusTone } from '../dashboard/StatusPill';
import { withBase } from '../dashboard/base';
import { SERVICES, type Service, type ServiceStatus } from '../dashboard/data';

const STATUS: Record<ServiceStatus, { tone: StatusTone; label: string }> = {
  healthy: { tone: 'good', label: 'Healthy' },
  degraded: { tone: 'warning', label: 'Degraded' },
  down: { tone: 'critical', label: 'Down' },
};

/** The table needs a stable id per row; the service name is unique. */
type CatalogRow = Service & { id: string };

const ROWS: CatalogRow[] = SERVICES.map((service) => ({
  ...service,
  id: service.name,
}));

const OWNERS = [
  { id: 'all', label: 'All teams' },
  ...Array.from(new Set(SERVICES.map((s) => s.owner)))
    .sort()
    .map((owner) => ({ id: owner, label: owner })),
];

const COLUMNS: readonly ColumnConfig<CatalogRow>[] = [
  {
    id: 'name',
    label: 'Service',
    isRowHeader: true,
    isSortable: true,
    cell: (row) => (
      <CellText title={row.name} href={withBase(`/services/${row.name}`)} />
    ),
  },
  { id: 'owner', label: 'Owner', isSortable: true, cell: (row) => <CellText title={row.owner} /> },
  { id: 'language', label: 'Language', isSortable: true, cell: (row) => <CellText title={row.language} /> },
  { id: 'uptime', label: 'Uptime (30d)', isSortable: true, cell: (row) => <CellText title={row.uptime} /> },
  {
    id: 'deploysPerWeek',
    label: 'Deploys / week',
    isSortable: true,
    cell: (row) => <CellText title={String(row.deploysPerWeek)} />,
  },
  {
    id: 'status',
    label: 'Status',
    isSortable: true,
    cell: (row) => (
      <Cell>
        <StatusPill {...STATUS[row.status]} />
      </Cell>
    ),
  },
];

export function CatalogPage() {
  const [query, setQuery] = useState('');
  const [owner, setOwner] = useState('all');
  const [sort, setSort] = useState<SortDescriptor | null>({
    column: 'name',
    direction: 'ascending',
  });
  const [selected, setSelected] = useState<Selection>(new Set<Key>());
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = ROWS.filter((row) => {
      const matchesOwner = owner === 'all' || row.owner === owner;
      const matchesQuery =
        needle === '' ||
        row.name.toLowerCase().includes(needle) ||
        row.language.toLowerCase().includes(needle);
      return matchesOwner && matchesQuery;
    });

    if (!sort) return rows;
    const key = sort.column as keyof CatalogRow;
    return [...rows].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sort.direction === 'descending' ? -cmp : cmp;
    });
  }, [query, owner, sort]);

  // keep the window in range when the filters shrink the result set
  const start = Math.min(offset, Math.max(0, filtered.length - 1));
  const page = filtered.slice(start, start + pageSize);
  const selectedCount =
    selected === 'all' ? filtered.length : selected.size;

  const resetPaging = () => setOffset(0);

  return (
    <>
      <PageHeader
        title="Catalog"
        description="Every service, sortable and selectable, with server-style paging."
        tags={[{ label: 'catalog' }]}
        metadata={[
          { label: 'Services', value: String(SERVICES.length) },
          { label: 'Owners', value: String(OWNERS.length - 1) },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        <Flex align="end" gap="4">
          <div style={{ width: 260 }}>
            <SearchField
              size="small"
              label="Filter services"
              placeholder="Name or language"
              value={query}
              onChange={(value) => {
                setQuery(value);
                resetPaging();
              }}
            />
          </div>
          <div style={{ width: 200 }}>
            <Select
              size="small"
              label="Owner"
              options={OWNERS}
              value={owner}
              onChange={(key) => {
                setOwner(String(key));
                resetPaging();
              }}
            />
          </div>
        </Flex>

        {selectedCount > 0 && (
          <Card>
            <CardBody>
              <Flex align="center" justify="between" gap="4">
                <Text variant="body-small">
                  {selectedCount} selected
                </Text>
                <Flex gap="2">
                  <Button
                    variant="secondary"
                    size="small"
                    onPress={() => setSelected(new Set<Key>())}
                  >
                    Clear
                  </Button>
                  <Button variant="primary" size="small" isDisabled>
                    Add to team
                  </Button>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader>
            <Flex align="center" justify="between">
              <Text variant="title-x-small" as="h2">
                Services
              </Text>
              <Text variant="body-small" color="secondary">
                {filtered.length} of {SERVICES.length} services
              </Text>
            </Flex>
          </CardHeader>
          <CardBody>
            <div className="table-scroll">
              {/* Table renders its own grid label ("Data table"); it does not
                  accept aria-label. */}
              <Table
                columnConfig={COLUMNS}
                data={page}
                sort={{
                  descriptor: sort,
                  onSortChange: (descriptor) => {
                    setSort(descriptor);
                    resetPaging();
                  },
                }}
                selection={{
                  mode: 'multiple',
                  selected,
                  onSelectionChange: setSelected,
                }}
                pagination={{
                  type: 'page',
                  pageSize,
                  offset: start,
                  totalCount: filtered.length,
                  hasPreviousPage: start > 0,
                  hasNextPage: start + pageSize < filtered.length,
                  onPreviousPage: () =>
                    setOffset(Math.max(0, start - pageSize)),
                  onNextPage: () => setOffset(start + pageSize),
                  showPageSizeOptions: true,
                  pageSizeOptions: [10, 25, 50],
                  onPageSizeChange: (size) => {
                    setPageSize(size);
                    resetPaging();
                  },
                }}
                emptyState={
                  <Text color="secondary">No services match those filters.</Text>
                }
              />
            </div>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
