import {
  Button,
  ButtonLink,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Link,
  Text,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { StatusPill, type StatusTone } from '../dashboard/StatusPill';
import { withBase } from '../dashboard/base';
import { invoiceTotal, money, type Invoice } from '../dashboard/billing';

const STATUS: Record<Invoice['status'], { tone: StatusTone; label: string }> = {
  paid: { tone: 'good', label: 'Paid' },
  open: { tone: 'warning', label: 'Open' },
  failed: { tone: 'critical', label: 'Failed' },
};

const VAT_RATE = 0.2;

export function InvoiceDetailPage({ invoice }: { invoice: Invoice }) {
  const subtotal = invoiceTotal(invoice);
  const vat = subtotal * VAT_RATE;

  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link href={withBase('/billing/invoices')}>Invoices</Link>
        <span aria-hidden="true">/</span>
        <Text variant="body-small" as="span">
          {invoice.id}
        </Text>
      </nav>

      <PageHeader
        title={invoice.id}
        description={`${invoice.period} · issued ${invoice.issued}`}
        metadata={[
          { label: 'Total', value: money(subtotal * (1 + VAT_RATE)) },
          { label: 'Due', value: invoice.due },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        {invoice.status === 'failed' && (
          <Card>
            <CardBody>
              <Flex align="center" justify="between" gap="4">
                <Text color="secondary">
                  The card was declined on {invoice.due}. Nothing was
                  suspended — we retry three times before that happens.
                </Text>
                <ButtonLink href={withBase('/billing')} variant="primary" size="small">
                  Update payment method
                </ButtonLink>
              </Flex>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader>
            <Flex align="center" justify="between" gap="4">
              <Text variant="title-x-small" as="h2">
                Invoice
              </Text>
              <Flex align="center" gap="3">
                <StatusPill {...STATUS[invoice.status]} />
                {/* Printing is the reason receipts get opened, so it is a
                    first-class action rather than a browser afterthought. */}
                <Button
                  variant="secondary"
                  size="small"
                  onPress={() => window.print()}
                >
                  Print
                </Button>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody>
            <Flex direction="column" gap="4">
              <div className="invoice-parties">
                <div>
                  <Text variant="body-small" color="secondary" as="p">
                    From
                  </Text>
                  <Text as="p">Acme Cloud Ltd</Text>
                  <Text variant="body-small" color="secondary" as="p">
                    1 Fleet Street, London EC4Y 1AA
                    <br />
                    VAT GB 123 4567 89
                  </Text>
                </div>
                <div>
                  <Text variant="body-small" color="secondary" as="p">
                    Billed to
                  </Text>
                  <Text as="p">Acme Cloud workspace</Text>
                  <Text variant="body-small" color="secondary" as="p">
                    grace@acme.cloud
                    <br />
                    Payment due {invoice.due}
                  </Text>
                </div>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Unit</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lines.map((line) => (
                    <tr key={line.description}>
                      <td>{line.description}</td>
                      <td>{line.quantity.toLocaleString()}</td>
                      <td>{money(line.unit)}</td>
                      <td>{money(line.quantity * line.unit)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row" colSpan={3}>
                      Subtotal
                    </th>
                    <td>{money(subtotal)}</td>
                  </tr>
                  <tr>
                    <th scope="row" colSpan={3}>
                      VAT at 20%
                    </th>
                    <td>{money(vat)}</td>
                  </tr>
                  <tr className="invoice-total">
                    <th scope="row" colSpan={3}>
                      Total
                    </th>
                    <td>{money(subtotal + vat)}</td>
                  </tr>
                </tfoot>
              </table>

              <Text variant="body-small" color="secondary">
                Questions about this invoice? Reply to the billing email, or
                read the <Link href={withBase('/help')}>help centre</Link>.
              </Text>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
