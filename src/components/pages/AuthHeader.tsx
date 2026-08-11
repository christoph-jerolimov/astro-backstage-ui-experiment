// The brand line every page outside the app shell carries. Extracted because
// there are now several of them and they should not drift apart.
import { Flex, Text } from '@backstage/ui';
import { ThemeSwitch } from '../dashboard/ThemeSwitch';
import { withBase } from '../dashboard/base';

export function AuthHeader() {
  return (
    <Flex align="center" justify="between" mb="4">
      <a className="brand-link" href={withBase('/')}>
        <span className="sidebar-brand-mark" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 12c3.5-2 5-5.5 5-9-3.5 0-7 1.5-9 5l-2.5.5L4 11l2.5 2.5L7 11z" />
            <circle cx="9.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <Text variant="title-x-small" as="span">
          Acme Cloud
        </Text>
      </a>
      <ThemeSwitch />
    </Flex>
  );
}
