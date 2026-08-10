import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Flex,
  Switch,
  Text,
  TextField,
} from '@backstage/ui';

export function BackstageUiDemo() {
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState<string | null>(null);

  const toggleTheme = (isSelected: boolean) => {
    setDarkMode(isSelected);
    document.documentElement.setAttribute(
      'data-theme-mode',
      isSelected ? 'dark' : 'light',
    );
  };

  return (
    <Container my="8">
      <Flex direction="column" gap="6">
        <Flex justify="between" align="center">
          <Flex direction="column" gap="2">
            <Text variant="title-large" as="h1">
              Astro × Backstage UI
            </Text>
            <Text variant="body-large" color="secondary">
              An Astro default page rendering React components from{' '}
              <code>@backstage/ui</code>.
            </Text>
          </Flex>
          <Switch label="Dark mode" isSelected={darkMode} onChange={toggleTheme} />
        </Flex>

        <Flex gap="2">
          <Badge>Astro</Badge>
          <Badge>React island</Badge>
          <Badge>@backstage/ui</Badge>
        </Flex>

        <Card>
          <CardHeader>
            <Text variant="title-small" as="h2">
              Say hello
            </Text>
          </CardHeader>
          <CardBody>
            <Flex direction="column" gap="4">
              <Text>
                This card is a Backstage UI component hydrated as an Astro
                island, so it is fully interactive on an otherwise static page.
              </Text>
              <TextField
                label="Your name"
                placeholder="Ada Lovelace"
                value={name}
                onChange={setName}
              />
              {greeting && (
                <Text variant="body-large" weight="bold">
                  {greeting}
                </Text>
              )}
            </Flex>
          </CardBody>
          <CardFooter>
            <Flex gap="2" justify="end">
              <Button
                variant="secondary"
                onPress={() => {
                  setName('');
                  setGreeting(null);
                }}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                onPress={() => setGreeting(`Hello, ${name.trim() || 'world'}!`)}
              >
                Greet
              </Button>
            </Flex>
          </CardFooter>
        </Card>
      </Flex>
    </Container>
  );
}
