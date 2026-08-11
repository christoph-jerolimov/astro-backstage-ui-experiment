// Backstage UI has no sidebar component, so this one is built directly on
// react-aria-components' ListBox. Items carry an `href`, so react-aria renders
// them as real links and the browser handles navigation between the Astro
// pages. The active page is expressed as the ListBox's controlled selection —
// react-aria does not forward `aria-current` to the DOM, and inside a listbox
// `aria-selected` is the semantic that assistive tech actually reads.
import { ListBox, ListBoxItem } from 'react-aria-components';
import { Avatar, Text } from '@backstage/ui';
import { withBase } from './base';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', href: '/', icon: IconGrid },
  { id: 'deployments', label: 'Deployments', href: '/deployments', icon: IconRocket },
  { id: 'services', label: 'Services', href: '/services', icon: IconBox },
  { id: 'incidents', label: 'Incidents', href: '/incidents', icon: IconBell },
  { id: 'settings', label: 'Settings', href: '/settings', icon: IconGear },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]['id'];

interface SidebarProps {
  current: NavKey;
}

export function Sidebar({ current }: SidebarProps) {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark" aria-hidden="true">
          <IconRocket />
        </span>
        <Text variant="title-x-small" as="span">
          Acme Cloud
        </Text>
      </div>
      <ListBox
        className="sidebar-nav"
        aria-label="Main navigation"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[current]}
      >
        {NAV_ITEMS.map(({ id, label, href, icon: Icon }) => (
          <ListBoxItem
            key={id}
            id={id}
            href={withBase(href)}
            className="sidebar-item"
            textValue={label}
          >
            <Icon />
            {label}
          </ListBoxItem>
        ))}
      </ListBox>
      <div className="sidebar-footer">
        <Avatar src="" name="Ada Lovelace" size="small" />
        <Text variant="body-small" color="secondary" as="span">
          Ada Lovelace
        </Text>
      </div>
    </aside>
  );
}

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    </svg>
  );
}

function IconRocket() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 12c3.5-2 5-5.5 5-9-3.5 0-7 1.5-9 5l-2.5.5L4 11l2.5 2.5L7 11z" />
      <circle cx="9.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 5l6-3 6 3v6l-6 3-6-3z" />
      <path d="M2 5l6 3 6-3M8 8v6" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 2a4 4 0 0 0-4 4v3l-1.5 2.5h11L12 9V6a4 4 0 0 0-4-4z" />
      <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0" />
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4" />
    </svg>
  );
}
