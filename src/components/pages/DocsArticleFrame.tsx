import type { ReactNode } from 'react';
import { Card, CardBody, Link, Text } from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { withBase } from '../dashboard/base';

interface DocsArticleFrameProps {
  title: string;
  description: string;
  updated: string;
  slug: string;
  siblings: { slug: string; title: string }[];
  /** The rendered Markdown, passed through from the Astro page. */
  children: ReactNode;
}

export function DocsArticleFrame({
  title,
  description,
  updated,
  slug,
  siblings,
  children,
}: DocsArticleFrameProps) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link href={withBase('/docs')}>Docs</Link>
        <span aria-hidden="true">/</span>
        <Text variant="body-small" as="span">
          {title}
        </Text>
      </nav>

      <PageHeader
        title={title}
        description={description}
        metadata={[{ label: 'Updated', value: updated }]}
      />

      <div className="docs-layout">
        <Card>
          <CardBody>{children}</CardBody>
        </Card>

        <nav aria-label="Docs" className="docs-toc">
          <Text variant="body-small" color="secondary" as="p">
            All articles
          </Text>
          <ul>
            {siblings.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={withBase(`/docs/${entry.slug}`)}
                  weight={entry.slug === slug ? 'bold' : 'regular'}
                >
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
