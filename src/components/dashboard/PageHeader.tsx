import type { ReactNode } from 'react';
import { Flex, PluginHeader, Text } from '@backstage/ui';
import { ThemeSwitch } from './ThemeSwitch';

interface PageHeaderProps {
  title: string;
  description: string;
  tags?: { label: string }[];
  metadata?: { label: string; value: ReactNode }[];
  actions?: ReactNode;
  /** Shown in the toolbar instead of the default glyph. */
  icon?: ReactNode;
}

/**
 * The page title row, on Backstage UI's PluginHeader.
 *
 * PluginHeader is a plugin toolbar rather than a page header: it carries an
 * icon, a title, actions and optional tabs, and it publishes its own height as
 * `--bui-header-height` so a layout can offset against it. It has no slot for
 * a description, tags or metadata — Header is the component with those — so
 * everything below the toolbar is rendered here instead, which keeps what each
 * page already says.
 */
export function PageHeader({
  title,
  description,
  tags,
  metadata,
  actions,
  icon,
}: PageHeaderProps) {
  const hasIntro = Boolean(description || tags?.length || metadata?.length);

  return (
    <>
      <PluginHeader
        title={title}
        icon={icon ?? <IconBrand />}
        customActions={
          <Flex align="center" gap="4">
            {actions}
            <ThemeSwitch />
          </Flex>
        }
      />

      {hasIntro && (
        <div className="page-intro">
          {description && <Text color="secondary">{description}</Text>}

          {(tags?.length || metadata?.length) && (
            <Flex align="center" gap="4" className="page-intro-facts">
              {/* Plain chips, not a TagGroup: react-aria's TagGroup is a grid
                  widget, and a second grid on a page that already has a data
                  table is both wrong semantically and ambiguous to query.
                  These tags are labels, nothing is selectable. */}
              {tags && tags.length > 0 && (
                <ul className="page-tags">
                  {tags.map((tag) => (
                    <li key={tag.label}>{tag.label}</li>
                  ))}
                </ul>
              )}

              {metadata && metadata.length > 0 && (
                <dl className="page-meta">
                  {metadata.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </Flex>
          )}
        </div>
      )}
    </>
  );
}

function IconBrand() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 12c3.5-2 5-5.5 5-9-3.5 0-7 1.5-9 5l-2.5.5L4 11l2.5 2.5L7 11z" />
      <circle cx="9.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
