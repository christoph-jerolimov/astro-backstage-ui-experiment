import type { ReactNode } from 'react';
import { Flex, Header } from '@backstage/ui';
import { ThemeSwitch } from './ThemeSwitch';

interface PageHeaderProps {
  title: string;
  description: string;
  tags?: { label: string }[];
  metadata?: { label: string; value: ReactNode }[];
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  tags,
  metadata,
  actions,
}: PageHeaderProps) {
  return (
    <Header
      title={title}
      description={description}
      tags={tags}
      metadata={metadata}
      customActions={
        <Flex align="center" gap="4">
          {actions}
          <ThemeSwitch />
        </Flex>
      }
    />
  );
}
