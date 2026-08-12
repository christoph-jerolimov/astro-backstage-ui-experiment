import { useMemo, useState } from 'react';
import {
  Card,
  CardBody,
  Flex,
  Link,
  Tag,
  TagGroup,
  Text,
  ToggleButton,
  ToggleButtonGroup,
} from '@backstage/ui';
import { ThemeSwitch } from '../dashboard/ThemeSwitch';
import { withBase } from '../dashboard/base';

export interface BlogEntry {
  slug: string;
  title: string;
  description: string;
  author: string;
  published: string;
  readingTime: number;
  tags: string[];
}

export function BlogIndexPage({ entries }: { entries: BlogEntry[] }) {
  const tags = useMemo(
    () => [...new Set(entries.flatMap((entry) => entry.tags))].sort(),
    [entries],
  );
  const [tag, setTag] = useState<Set<string>>(new Set(['all']));
  const active = [...tag][0] ?? 'all';

  const shown =
    active === 'all'
      ? entries
      : entries.filter((entry) => entry.tags.includes(active));

  return (
    <div className="marketing">
      <Flex align="center" justify="between" mb="6">
        <Flex align="center" gap="4">
          <Link href={withBase('/home')} weight="bold">
            Acme Cloud
          </Link>
          <Text variant="body-small" color="secondary" as="span">
            Blog
          </Text>
        </Flex>
        <Flex align="center" gap="4">
          <Link href={withBase('/docs')}>Docs</Link>
          <Link href={withBase('/pricing')}>Pricing</Link>
          <ThemeSwitch />
        </Flex>
      </Flex>

      <Flex direction="column" gap="2" mb="6">
        <Text variant="title-large" as="h1">
          Writing
        </Text>
        <Text variant="body-large" color="secondary">
          Notes on running a platform, from the people who run this one.
        </Text>
      </Flex>

      <Flex direction="column" gap="4">
        <ToggleButtonGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={tag}
          onSelectionChange={(keys) => setTag(new Set(keys as Set<string>))}
        >
          <ToggleButton id="all">Everything</ToggleButton>
          {tags.map((name) => (
            <ToggleButton key={name} id={name}>
              {name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {shown.map((entry) => (
          <Card key={entry.slug}>
            <CardBody>
              <Flex direction="column" gap="2">
                <Link
                  href={withBase(`/blog/${entry.slug}`)}
                  variant="title-x-small"
                  weight="bold"
                >
                  {entry.title}
                </Link>
                <Text color="secondary">{entry.description}</Text>
                <Flex align="center" justify="between" gap="4">
                  {/* Author, date and length together: the three things
                      people use to decide whether to start reading. */}
                  <Text variant="body-small" color="secondary">
                    {entry.author} · {entry.published} · {entry.readingTime} min
                    read
                  </Text>
                  <TagGroup aria-label="Tags">
                    {entry.tags.map((name) => (
                      <Tag key={name} id={name}>
                        {name}
                      </Tag>
                    ))}
                  </TagGroup>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </Flex>
    </div>
  );
}
