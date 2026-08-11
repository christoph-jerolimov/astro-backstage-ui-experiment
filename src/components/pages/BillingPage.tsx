import { useState } from 'react';
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Slider,
  Text,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { StatTile } from '../dashboard/StatTile';
import { withBase } from '../dashboard/base';
import { INVOICES, USAGE, invoiceTotal, money } from '../dashboard/billing';

const SEAT_PRICE = 40;
const OVERAGE_PER_MINUTE = 0.008;

export function BillingPage() {
  // The seat count is the one number on this page that changes the bill, so
  // it is the one thing you can move — and the estimate moves with it.
  const [seats, setSeats] = useState(USAGE.seats.used);

  const overageMinutes = Math.max(
    0,
    USAGE.buildMinutes.used - USAGE.buildMinutes.included,
  );
  const estimate = seats * SEAT_PRICE + overageMinutes * OVERAGE_PER_MINUTE;
  const current = INVOICES.find((invoice) => invoice.status === 'open');

  return (
    <>
      <PageHeader
        title="Billing"
        description="What the workspace is on, what it is using, and what that costs."
        metadata={[
          { label: 'Plan', value: 'Team' },
          { label: 'Billing period', value: 'Monthly' },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        <div className="kpi-row">
          <StatTile label="This month so far" value={money(estimate)} />
          <StatTile
            label="Seats in use"
            value={`${USAGE.seats.used} of ${USAGE.seats.included}`}
          />
          <StatTile
            label="Build minutes"
            value={USAGE.buildMinutes.used.toLocaleString()}
            delta={{
              text: `${overageMinutes.toLocaleString()} over the included 10,000`,
              direction: 'up',
              upIsGood: false,
            }}
          />
          <StatTile
            label="Artifact storage"
            value={`${USAGE.storage.used} GB`}
          />
        </div>

        <Card>
          <CardHeader>
            <Flex align="center" justify="between" gap="4">
              <Text variant="title-x-small" as="h2">
                Plan
              </Text>
              <Badge>Team</Badge>
            </Flex>
          </CardHeader>
          <CardBody>
            <Flex direction="column" gap="4">
              <Text color="secondary">
                ${SEAT_PRICE} per developer per month, billed monthly. Build
                minutes past the included 10,000 are ${OVERAGE_PER_MINUTE} each.
              </Text>

              <Flex direction="column" gap="2">
                <Slider
                  label="Seats"
                  minValue={1}
                  maxValue={25}
                  value={seats}
                  onChange={(value) => setSeats(Number(value))}
                />
                <Text variant="body-small" color="secondary">
                  {seats} seats · {money(seats * SEAT_PRICE)} per month
                  {seats < USAGE.seats.used &&
                    ` — ${USAGE.seats.used - seats} people would lose access`}
                </Text>
              </Flex>

              <Flex gap="2">
                <ButtonLink href={withBase('/pricing')} variant="secondary" size="small">
                  Compare plans
                </ButtonLink>
                <Button variant="primary" size="small">
                  Save seat count
                </Button>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Text variant="title-x-small" as="h2">
              Usage this period
            </Text>
          </CardHeader>
          <CardBody>
            <Flex direction="column" gap="4">
              <Meter
                label="Build minutes"
                used={USAGE.buildMinutes.used}
                included={USAGE.buildMinutes.included}
                suffix="minutes"
              />
              <Meter
                label="Seats"
                used={USAGE.seats.used}
                included={USAGE.seats.included}
                suffix="seats"
              />
              <Meter
                label="Artifact storage"
                used={USAGE.storage.used}
                included={USAGE.storage.included}
                suffix="GB"
              />
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Flex align="center" justify="between" gap="4">
              <Text variant="title-x-small" as="h2">
                Payment
              </Text>
              <ButtonLink
                href={withBase('/billing/invoices')}
                variant="secondary"
                size="small"
              >
                All invoices
              </ButtonLink>
            </Flex>
          </CardHeader>
          <CardBody>
            <dl className="detail-list">
              <div>
                <dt>Method</dt>
                <dd>Visa ending 4242, expires 09/28</dd>
              </div>
              <div>
                <dt>Billing email</dt>
                <dd>grace@acme.cloud</dd>
              </div>
              <div>
                <dt>Next invoice</dt>
                <dd>
                  {current
                    ? `${current.id} · ${money(invoiceTotal(current))} due ${current.due}`
                    : 'Nothing outstanding'}
                </dd>
              </div>
            </dl>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}

function Meter({
  label,
  used,
  included,
  suffix,
}: {
  label: string;
  used: number;
  included: number;
  suffix: string;
}) {
  const ratio = Math.min(1, used / included);
  const over = used > included;
  return (
    <Flex direction="column" gap="2">
      <Flex align="center" justify="between" gap="4">
        <Text variant="body-small">{label}</Text>
        {/* The numbers carry it; the bar is a second reading, not the only
            one, and "over" is a word rather than just a colour. */}
        <Text variant="body-small" color="secondary">
          {used.toLocaleString()} of {included.toLocaleString()} {suffix}
          {over && ` · ${(used - included).toLocaleString()} over`}
        </Text>
      </Flex>
      <div className="meter" data-over={over} aria-hidden="true">
        <span style={{ width: `${ratio * 100}%` }} />
      </div>
    </Flex>
  );
}
