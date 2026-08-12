import type { ReactNode } from 'react';
import { Avatar, Card, CardBody, Flex, Link, Tag, TagGroup, Text } from '@backstage/ui';
import { ThemeSwitch } from '../dashboard/ThemeSwitch';
import { withBase } from '../dashboard/base';

interface BlogPostFrameProps {
  title: string;
  description: string;
  author: string;
  published: string;
  readingTime: number;
  tags: string[];
  /** Previous and next by date, for reading straight through. */
  previous?: { slug: string; title: string };
  next?: { slug: string; title: string };
  children: ReactNode;
}

export function BlogPostFrame({
  title,
  description,
  author,
  published,
  readingTime,
  tags,
  previous,
  next,
  children,
}: BlogPostFrameProps) {
  return (
    <div className="marketing">
      <Flex align="center" justify="between" mb="6">
        <Flex align="center" gap="4">
          <Link href={withBase('/home')} weight="bold">
            Acme Cloud
          </Link>
          <Link href={withBase('/blog')}>Blog</Link>
        </Flex>
        <ThemeSwitch />
      </Flex>

      <article className="post">
        <header className="post-head">
          <Text variant="title-large" as="h1">
            {title}
          </Text>
          <Text variant="body-large" color="secondary">
            {description}
          </Text>
          <Flex align="center" gap="3">
            <Avatar src="" name={author} size="small" />
            <Text variant="body-small" color="secondary">
              {author} · {published} · {readingTime} min read
            </Text>
          </Flex>
          <TagGroup aria-label="Tags">
            {tags.map((name) => (
              <Tag key={name} id={name}>
                {name}
              </Tag>
            ))}
          </TagGroup>
        </header>

        {/* The measure is capped in CSS rather than by the grid, because a
            column of prose has one right width and it is not the viewport. */}
        <div className="prose post-body">{children}</div>
      </article>

      <nav className="post-nav" aria-label="More posts">
        <Card>
          <CardBody>
            <Flex justify="between" gap="4">
              {previous ? (
                <Flex direction="column" gap="1">
                  <Text variant="body-small" color="secondary" as="span">
                    Older
                  </Text>
                  <Link href={withBase(`/blog/${previous.slug}`)}>
                    {previous.title}
                  </Link>
                </Flex>
              ) : (
                <span />
              )}
              {next && (
                <Flex direction="column" gap="1" align="end">
                  <Text variant="body-small" color="secondary" as="span">
                    Newer
                  </Text>
                  <Link href={withBase(`/blog/${next.slug}`)}>{next.title}</Link>
                </Flex>
              )}
            </Flex>
          </CardBody>
        </Card>
      </nav>
    </div>
  );
}
