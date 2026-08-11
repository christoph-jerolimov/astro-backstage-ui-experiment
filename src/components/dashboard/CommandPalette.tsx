// A ⌘K palette for jumping to any page, built on cmdk.
//
// The palette is its own island, so the sidebar cannot call into it directly —
// islands do not share a React tree. The sidebar's button dispatches
// OPEN_EVENT on window instead, which is the whole contract between them.
import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import {
  ACCOUNT,
  ACTIONS,
  PAGES,
  SERVICE_DESTINATIONS,
  type Destination,
} from './destinations';
import { withBase } from './base';

/** Dispatch on window to open the palette from another island. */
export const OPEN_EVENT = 'acme:open-command-palette';

interface CommandPaletteProps {
  /** Passed in from Astro so the docs stay in step with the collection. */
  docs?: { slug: string; title: string }[];
}

export function CommandPalette({ docs = [] }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    const onOpen = () => setIsOpen(true);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  // Astro serves separate documents, so going somewhere is a real navigation.
  const go = (href: string) => {
    window.location.href = withBase(href);
  };

  const docDestinations: Destination[] = docs.map((doc) => ({
    id: `doc-${doc.slug}`,
    label: doc.title,
    href: `/docs/${doc.slug}`,
    keywords: 'docs documentation guide',
  }));

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      label="Command palette"
      className="palette"
      overlayClassName="palette-overlay"
      contentClassName="palette-content"
    >
      <Command.Input placeholder="Jump to a page, service or doc…" />
      <Command.List>
        <Command.Empty>Nothing matches that.</Command.Empty>

        <Group heading="Pages" items={PAGES} onSelect={go} />
        <Group heading="Actions" items={ACTIONS} onSelect={go} />
        <Group heading="Account" items={ACCOUNT} onSelect={go} />
        <Group heading="Docs" items={docDestinations} onSelect={go} />
        <Group heading="Services" items={SERVICE_DESTINATIONS} onSelect={go} />
      </Command.List>
      <div className="palette-foot">
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> to move
        </span>
        <span>
          <kbd>↵</kbd> to open
        </span>
        <span>
          <kbd>esc</kbd> to close
        </span>
      </div>
    </Command.Dialog>
  );
}

function Group({
  heading,
  items,
  onSelect,
}: {
  heading: string;
  items: Destination[];
  onSelect: (href: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <Command.Group heading={heading}>
      {items.map((item) => (
        <Command.Item
          key={item.id}
          value={`${item.label} ${item.keywords ?? ''}`}
          onSelect={() => onSelect(item.href)}
        >
          {item.label}
        </Command.Item>
      ))}
    </Command.Group>
  );
}
