// Backstage UI's Dialog is a centred modal, so the right-hand detail panel is
// built on react-aria's Modal directly. react-aria supplies the focus trap,
// Escape handling, scroll lock and the click-outside dismiss; everything below
// is presentation and content.
//
// It is deliberately the same component for services, deployments, catalog
// entries and incidents: the tables differ, but "what is this row" is the same
// question, and answering it the same way each time is the point.
import type { ReactNode } from 'react';
import { Button, Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { ButtonLink, Flex, Text } from '@backstage/ui';

export interface DetailField {
  label: string;
  value: ReactNode;
}

interface DetailDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  /** What kind of thing this is, e.g. "Service". */
  kind: string;
  title: string;
  /** A status pill or severity dot, shown next to the title. */
  status?: ReactNode;
  fields: DetailField[];
  /** Anything that does not fit the label/value list, e.g. a timeline. */
  children?: ReactNode;
  link?: { href: string; label: string };
}

export function DetailDrawer({
  isOpen,
  onOpenChange,
  kind,
  title,
  status,
  fields,
  children,
  link,
}: DetailDrawerProps) {
  return (
    <ModalOverlay
      className="detail-overlay"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
    >
      <Modal className="detail-panel">
        <Dialog className="detail-dialog" aria-label={`${kind} details`}>
          <div className="detail-head">
            <Flex direction="column" gap="1">
              <Text variant="body-x-small" color="secondary" as="span">
                {kind}
              </Text>
              <Flex align="center" gap="2">
                <Text variant="title-x-small" as="h2">
                  {title}
                </Text>
                {status}
              </Flex>
            </Flex>
            <Button
              className="drawer-close"
              aria-label="Close details"
              onPress={() => onOpenChange(false)}
            >
              <IconClose />
            </Button>
          </div>

          <dl className="detail-list">
            {fields.map((field) => (
              <div key={field.label}>
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>

          {children}

          {link && (
            <div className="detail-foot">
              <ButtonLink href={link.href} variant="secondary" size="small">
                {link.label}
              </ButtonLink>
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
  );
}
