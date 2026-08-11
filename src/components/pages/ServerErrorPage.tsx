import { ButtonLink, Card, CardBody, Flex, Link, Text } from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { withBase } from '../dashboard/base';

/**
 * A fixed id, because this page is prerendered. A real one would come from
 * the request; the reason it is on the page at all is that "it broke" is
 * useless to support without something to look up.
 */
const REQUEST_ID = 'req_8f3c1a94e77b';

export function ServerErrorPage() {
  return (
    <>
      <PageHeader
        title="Something went wrong"
        description="The request reached us and then fell over on our side."
      />

      <Flex direction="column" gap="4" mt="4">
        <Card>
          <CardBody>
            <Flex direction="column" gap="4">
              <span className="notfound-code" aria-hidden="true">
                500
              </span>
              <Text>
                Nothing you did caused this and nothing you were working on was
                lost. The team has already been paged — errors like this open an
                incident automatically.
              </Text>

              <div className="request-id">
                <Text variant="body-small" color="secondary" as="span">
                  Request id
                </Text>
                {/* Quotable: support can find the exact request from this. */}
                <code>{REQUEST_ID}</code>
              </div>

              <Flex gap="2">
                <ButtonLink
                  href={withBase('/500')}
                  variant="primary"
                  data-testid="retry"
                >
                  Try again
                </ButtonLink>
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
                If it keeps happening
              </Text>
              <Text color="secondary">
                Check <Link href={withBase('/incidents')}>incidents</Link> — if
                this is widespread it will be listed there with an update.
                Otherwise send the request id to support and they can pull the
                trace.
              </Text>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
