import type { ReactNode } from 'react';
import { Card, CardBody, Flex, Text } from '@backstage/ui';

interface StatTileProps {
  label: string;
  value: string;
  delta?: { text: string; direction: 'up' | 'down'; upIsGood?: boolean };
  trend?: ReactNode;
}

export function StatTile({ label, value, delta, trend }: StatTileProps) {
  const good =
    delta && (delta.direction === 'up') === (delta.upIsGood ?? true);
  return (
    <Card>
      <CardBody>
        <Flex direction="column" gap="2">
          <Text variant="body-small" color="secondary">
            {label}
          </Text>
          <Flex align="end" justify="between" gap="4">
            <span className="stat-value">{value}</span>
            {trend}
          </Flex>
          {delta && (
            <span className={good ? 'stat-delta-up' : 'stat-delta-down'}>
              {delta.direction === 'up' ? '▲' : '▼'} {delta.text}
            </span>
          )}
        </Flex>
      </CardBody>
    </Card>
  );
}
