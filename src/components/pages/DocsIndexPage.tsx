import { Card, CardBody, Flex, Link, Text } from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { withBase } from '../dashboard/base';

export interface DocEntry {
  slug: string;
  title: string;
  description: string;
  updated: string;
}

export function DocsIndexPage({ entries }: { entries: DocEntry[] }) {
  return (
    <>
      <PageHeader
        title="Docs"
        description="How the platform works, written down."
        tags={[{ label: 'handbook' }]}
        metadata={[{ label: 'Articles', value: String(entries.length) }]}
      />

      <Flex direction="column" gap="4" mt="4">
        {entries.map((entry) => (
          <Card key={entry.slug}>
            <CardBody>
              <Flex direction="column" gap="1">
                <Link
                  href={withBase(`/docs/${entry.slug}`)}
                  variant="title-x-small"
                  weight="bold"
                >
                  {entry.title}
                </Link>
                <Text color="secondary">{entry.description}</Text>
                <Text variant="body-small" color="secondary">
                  Updated {entry.updated}
                </Text>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </Flex>
    </>
  );
}
