import { useMemo, useState } from 'react';
import { parseDate, type DateValue } from '@internationalized/date';
import {
  Card,
  CardBody,
  CardHeader,
  Cell,
  CellText,
  Column,
  DateRangePicker,
  Flex,
  Row,
  TableBody,
  TableHeader,
  TablePagination,
  TableRoot,
  Text,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { StatusPill, type StatusTone } from '../dashboard/StatusPill';
import { withBase } from '../dashboard/base';
import { INVOICES, invoiceTotal, money, type Invoice } from '../dashboard/billing';

const STATUS: Record<Invoice['status'], { tone: StatusTone; label: string }> = {
  paid: { tone: 'good', label: 'Paid' },
  open: { tone: 'warning', label: 'Open' },
  failed: { tone: 'critical', label: 'Failed' },
};

/** Issue dates, so the range filter has something real to compare against. */
const ISSUED: Record<string, string> = {
  'INV-2026-08': '2026-08-01',
  'INV-2026-07': '2026-07-01',
  'INV-2026-06': '2026-06-01',
  'INV-2026-05': '2026-05-01',
  'INV-2026-04': '2026-04-01',
  'INV-2026-03': '2026-03-01',
  'INV-2026-02': '2026-02-01',
  'INV-2026-01': '2026-01-01',
};

export function InvoicesPage() {
  const [range, setRange] = useState<{ start: DateValue; end: DateValue } | null>(
    null,
  );
  const [pageSize, setPageSize] = useState(5);
  const [offset, setOffset] = useState(0);

  const filtered = useMemo(() => {
    if (!range) return INVOICES;
    return INVOICES.filter((invoice) => {
      const issued = parseDate(ISSUED[invoice.id]!);
      return (
        issued.compare(range.start) >= 0 && issued.compare(range.end) <= 0
      );
    });
  }, [range]);

  const start = Math.min(offset, Math.max(0, filtered.length - 1));
  const page = filtered.slice(start, start + pageSize);
  const outstanding = filtered
    .filter((invoice) => invoice.status !== 'paid')
    .reduce((sum, invoice) => sum + invoiceTotal(invoice), 0);

  return (
    <>
      <PageHeader
        title="Invoices"
        description="Every invoice on this workspace, oldest kept for seven years."
        metadata={[
          { label: 'Invoices', value: String(INVOICES.length) },
          { label: 'Outstanding', value: money(outstanding) },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        <Flex align="end" gap="4">
          <DateRangePicker
            label="Issued between"
            description="Leave empty for all time."
            value={range}
            onChange={(value) => {
              setRange(value as { start: DateValue; end: DateValue } | null);
              setOffset(0);
            }}
          />
        </Flex>

        <Card>
          <CardHeader>
            <Flex align="center" justify="between">
              <Text variant="title-x-small" as="h2">
                All invoices
              </Text>
              <Text variant="body-small" color="secondary">
                {filtered.length} of {INVOICES.length}
              </Text>
            </Flex>
          </CardHeader>
          <CardBody>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <Text variant="title-x-small" as="p">
                  No invoices in that range
                </Text>
                <Text color="secondary">
                  Widen the dates, or clear them to see all eight.
                </Text>
              </div>
            ) : (
              <>
                <div className="table-scroll">
                  <TableRoot aria-label="Invoices">
                    <TableHeader>
                      <Column isRowHeader>Invoice</Column>
                      <Column>Period</Column>
                      <Column>Issued</Column>
                      <Column>Due</Column>
                      <Column>Total</Column>
                      <Column>Status</Column>
                    </TableHeader>
                    <TableBody>
                      {page.map((invoice) => (
                        <Row key={invoice.id} id={invoice.id}>
                          <CellText
                            title={invoice.id}
                            href={withBase(`/billing/invoices/${invoice.id}`)}
                          />
                          <CellText title={invoice.period} />
                          <CellText title={invoice.issued} />
                          <CellText title={invoice.due} />
                          <CellText title={money(invoiceTotal(invoice))} />
                          <Cell>
                            <StatusPill {...STATUS[invoice.status]} />
                          </Cell>
                        </Row>
                      ))}
                    </TableBody>
                  </TableRoot>
                </div>
                {/* The low-level table has no pagination of its own, so this
                    is the same control the data table uses, mounted by hand. */}
                <TablePagination
                  pageSize={pageSize}
                  offset={start}
                  totalCount={filtered.length}
                  hasPreviousPage={start > 0}
                  hasNextPage={start + pageSize < filtered.length}
                  onPreviousPage={() => setOffset(Math.max(0, start - pageSize))}
                  onNextPage={() => setOffset(start + pageSize)}
                  showPageSizeOptions
                  pageSizeOptions={[5, 10, 25]}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setOffset(0);
                  }}
                />
              </>
            )}
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
