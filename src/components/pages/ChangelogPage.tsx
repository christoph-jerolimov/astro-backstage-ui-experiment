import { useMemo, useState } from 'react';
import {
  Card,
  CardBody,
  Flex,
  Link,
  Text,
  ToggleButton,
  ToggleButtonGroup,
} from '@backstage/ui';
import { ThemeSwitch } from '../dashboard/ThemeSwitch';
import { withBase } from '../dashboard/base';

type Kind = 'added' | 'changed' | 'fixed';

interface Change {
  kind: Kind;
  text: string;
}

interface Release {
  version: string;
  date: string;
  headline?: string;
  changes: Change[];
}

const RELEASES: Release[] = [
  {
    version: '2026.8.1',
    date: '11 August 2026',
    headline: 'Command palette',
    changes: [
      { kind: 'added', text: 'Press ⌘K anywhere to jump to a page, a service or a doc.' },
      { kind: 'added', text: 'Selecting a row in any table opens a detail panel on the right.' },
      { kind: 'changed', text: 'Search is now a page of its own rather than a field in the header.' },
      { kind: 'fixed', text: 'The sidebar no longer scrolls under the content on narrow screens.' },
    ],
  },
  {
    version: '2026.7.3',
    date: '28 July 2026',
    changes: [
      { kind: 'added', text: 'Roles can be edited as a grid instead of one person at a time.' },
      { kind: 'changed', text: 'Invoices keep seven years of history, up from two.' },
      { kind: 'fixed', text: 'Deploy duration was rounded down, so 3m 59s showed as 3m.' },
    ],
  },
  {
    version: '2026.7.1',
    date: '9 July 2026',
    headline: 'Incident timelines',
    changes: [
      { kind: 'added', text: 'Incidents carry a timeline of what happened and who did it.' },
      { kind: 'added', text: 'Services show their open incidents on the service page.' },
      { kind: 'fixed', text: 'Acknowledging an incident twice no longer resets its timer.' },
    ],
  },
  {
    version: '2026.6.2',
    date: '18 June 2026',
    changes: [
      { kind: 'changed', text: 'The catalog registers services from the pipeline rather than by hand.' },
      { kind: 'fixed', text: 'Renaming a service kept the old name in on-call routing.' },
    ],
  },
];

const KINDS: { id: Kind | 'all'; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'added', label: 'Added' },
  { id: 'changed', label: 'Changed' },
  { id: 'fixed', label: 'Fixed' },
];

export function ChangelogPage() {
  const [kind, setKind] = useState<Set<string>>(new Set(['all']));
  const active = ([...kind][0] ?? 'all') as Kind | 'all';

  const releases = useMemo(() => {
    if (active === 'all') return RELEASES;
    return RELEASES.map((release) => ({
      ...release,
      changes: release.changes.filter((change) => change.kind === active),
    })).filter((release) => release.changes.length > 0);
  }, [active]);

  return (
    <div className="marketing">
      <Flex align="center" justify="between" mb="6">
        <Flex align="center" gap="4">
          <Link href={withBase('/home')} weight="bold">
            Acme Cloud
          </Link>
          <Text variant="body-small" color="secondary" as="span">
            Changelog
          </Text>
        </Flex>
        <Flex align="center" gap="4">
          <Link href={withBase('/blog')}>Blog</Link>
          <Link href={withBase('/docs')}>Docs</Link>
          <ThemeSwitch />
        </Flex>
      </Flex>

      <Flex direction="column" gap="2" mb="6">
        <Text variant="title-large" as="h1">
          Changelog
        </Text>
        <Text variant="body-large" color="secondary">
          Every release, newest first. Dates are when it reached production,
          not when it was merged.
        </Text>
      </Flex>

      <Flex direction="column" gap="4">
        <ToggleButtonGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={kind}
          onSelectionChange={(keys) => setKind(new Set(keys as Set<string>))}
        >
          {KINDS.map(({ id, label }) => (
            <ToggleButton key={id} id={id}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {releases.map((release) => (
          <Card key={release.version}>
            <CardBody>
              <Flex direction="column" gap="3">
                <Flex align="baseline" gap="3">
                  <Text variant="title-x-small" as="h2">
                    {release.version}
                  </Text>
                  <Text variant="body-small" color="secondary">
                    {release.date}
                  </Text>
                  {release.headline && (
                    <Text variant="body-small" color="secondary">
                      · {release.headline}
                    </Text>
                  )}
                </Flex>
                <ul className="change-list">
                  {release.changes.map((change) => (
                    <li key={change.text} data-kind={change.kind}>
                      {/* The label is a word, not a coloured dot: "fixed" and
                          "added" are not guessable from a hue. */}
                      <span className="change-kind">{change.kind}</span>
                      {change.text}
                    </li>
                  ))}
                </ul>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </Flex>
    </div>
  );
}
