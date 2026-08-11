import { useState } from 'react';
import {
  Avatar,
  Button,
  ButtonLink,
  Card,
  CardBody,
  Flex,
  Link,
  Text,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { withBase } from '../dashboard/base';

export function ForbiddenPage() {
  const [requested, setRequested] = useState(false);

  return (
    <>
      <PageHeader
        title="You do not have access"
        description="This page exists. Your account is not allowed to open it."
      />

      <Flex direction="column" gap="4" mt="4">
        <Card>
          <CardBody>
            <Flex direction="column" gap="4">
              <span className="notfound-code" aria-hidden="true">
                403
              </span>
              {/* 403 and 404 differ in exactly one way that matters to the
                  person reading: whether signing in as someone else would
                  help. Saying who you are is what makes that answerable. */}
              <Flex align="center" gap="3">
                <Avatar src="" name="Ada Lovelace" size="small" />
                <Flex direction="column">
                  <Text variant="body-small">
                    Signed in as Ada Lovelace
                  </Text>
                  <Text variant="body-small" color="secondary">
                    ada@acme.cloud · Developer in team-atlas
                  </Text>
                </Flex>
              </Flex>
              <Text>
                Opening this page needs the <strong>Billing admin</strong> role.
                Two people in Acme Cloud can grant it.
              </Text>

              <Flex gap="2">
                {requested ? (
                  <Text variant="body-small" color="secondary">
                    Request sent. The admins have been notified and will see it
                    in their inbox.
                  </Text>
                ) : (
                  <Button variant="primary" onPress={() => setRequested(true)}>
                    Request access
                  </Button>
                )}
                <ButtonLink href={withBase('/')} variant="secondary">
                  Back to overview
                </ButtonLink>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Flex direction="column" gap="2">
              <Text variant="title-x-small" as="h2">
                Wrong account?
              </Text>
              <Text color="secondary">
                If you have a second account with the role,{' '}
                <Link href={withBase('/signin')}>sign in as someone else</Link>.
                Otherwise your{' '}
                <Link href={withBase('/profile')}>profile</Link> lists the roles
                you do have.
              </Text>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
