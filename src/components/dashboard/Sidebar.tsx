// Backstage UI has no sidebar component, so this one is built directly on
// react-aria-components. Items carry an `href`, so react-aria renders them as
// real links and the browser handles navigation between the Astro pages. The
// active page is expressed as the ListBox's controlled selection — react-aria
// does not forward `aria-current`, and inside a listbox `aria-selected` is the
// semantic assistive tech reads.
//
// Below 900px the same nav moves into an off-canvas drawer built on react-aria's
// Modal, which brings the focus trap, Escape-to-close and scroll lock with it.
import {
  Button,
  Dialog,
  DialogTrigger,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import {
  Avatar,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Text,
} from '@backstage/ui';
import { withBase } from './base';
import { OPEN_EVENT } from './CommandPalette';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', href: '/', icon: IconGrid },
  { id: 'search', label: 'Search', href: '/search', icon: IconSearch },
  { id: 'deployments', label: 'Deployments', href: '/deployments', icon: IconRocket },
  { id: 'services', label: 'Services', href: '/services', icon: IconBox },
  { id: 'catalog', label: 'Catalog', href: '/catalog', icon: IconTable },
  { id: 'incidents', label: 'Incidents', href: '/incidents', icon: IconBell },
  { id: 'notifications', label: 'Notifications', href: '/notifications', icon: IconInbox },
  { id: 'docs', label: 'Docs', href: '/docs', icon: IconBook },
  { id: 'settings', label: 'Settings', href: '/settings', icon: IconGear },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]['id'];

interface SidebarProps {
  /** Omitted on pages that are not part of the navigation. */
  current?: NavKey;
}

function NavList({ current, label }: { current?: NavKey; label: string }) {
  return (
    <ListBox
      className="sidebar-nav"
      aria-label={label}
      selectionMode="single"
      selectedKeys={current ? [current] : []}
    >
      {NAV_ITEMS.map(({ id, label: itemLabel, href, icon: Icon }) => (
        <ListBoxItem
          key={id}
          id={id}
          href={withBase(href)}
          className="sidebar-item"
          textValue={itemLabel}
        >
          <Icon />
          {itemLabel}
        </ListBoxItem>
      ))}
    </ListBox>
  );
}

/**
 * The palette is a separate island, so this cannot open it directly — it
 * dispatches the event the palette listens for.
 */
function PaletteTrigger() {
  return (
    <Button
      className="palette-trigger"
      onPress={() => window.dispatchEvent(new CustomEvent(OPEN_EVENT))}
    >
      <span>Jump to…</span>
      <span aria-hidden="true">
        <kbd>⌘</kbd>
        <kbd>K</kbd>
      </span>
    </Button>
  );
}

function Brand() {
  return (
    <div className="sidebar-brand">
      <span className="sidebar-brand-mark" aria-hidden="true">
        <IconRocket />
      </span>
      <Text variant="title-x-small" as="span">
        Acme Cloud
      </Text>
    </div>
  );
}

function User() {
  return (
    <div className="sidebar-footer">
      {/* The account menu; the pages it links to are not in the main nav. */}
      <MenuTrigger>
        <Button className="user-trigger" aria-label="Account menu">
          <Avatar src="" name="Ada Lovelace" size="small" />
          <Text variant="body-small" color="secondary" as="span">
            Ada Lovelace
          </Text>
        </Button>
        <Menu>
          <MenuItem href={withBase('/profile')}>Profile</MenuItem>
          <MenuItem href={withBase('/api-keys')}>API keys</MenuItem>
          <MenuSeparator />
          <MenuItem href={withBase('/signin')} color="danger">
            Sign out
          </MenuItem>
        </Menu>
      </MenuTrigger>
    </div>
  );
}

export function Sidebar({ current }: SidebarProps) {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-top">
        {/* Only rendered as a control below 900px; the drawer itself portals
            out of the sidebar, so it is not constrained by the app grid. */}
        <DialogTrigger>
          <Button className="drawer-trigger" aria-label="Open navigation">
            <IconMenu />
          </Button>
          <ModalOverlay className="drawer-overlay" isDismissable>
            <Modal className="drawer">
              <Dialog className="drawer-dialog" aria-label="Navigation">
                {({ close }) => (
                  <>
                    <div className="drawer-head">
                      <Brand />
                      <Button
                        className="drawer-close"
                        aria-label="Close navigation"
                        onPress={close}
                      >
                        <IconClose />
                      </Button>
                    </div>
                    <PaletteTrigger />
                    <NavList current={current} label="Main navigation" />
                    <User />
                  </>
                )}
              </Dialog>
            </Modal>
          </ModalOverlay>
        </DialogTrigger>
        <Brand />
      </div>

      {/* The always-visible nav; hidden below 900px in favour of the drawer. */}
      <div className="sidebar-body">
        <PaletteTrigger />
        <NavList current={current} label="Main navigation" />
        <User />
      </div>
    </aside>
  );
}

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M3 5.5h14M3 10h14M3 14.5h14" strokeLinecap="round" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
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

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5l4 4" strokeLinecap="round" />
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

function IconTable() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
      <path d="M1.5 6.5h13M6 6.5v7" />
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

function IconInbox() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M1.5 9.5h3l1 2h5l1-2h3" />
      <path d="M2.5 9.5l1.5-6h8l1.5 6v3a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1z" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2.5 2.5h4a2 2 0 0 1 2 2v9a1.5 1.5 0 0 0-1.5-1.5h-4.5z" />
      <path d="M13.5 2.5h-4a2 2 0 0 0-2 2v9a1.5 1.5 0 0 1 1.5-1.5h4.5z" />
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
