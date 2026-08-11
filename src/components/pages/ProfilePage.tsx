import { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Flex,
  Select,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  TextAreaField,
  TextField,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';

const TIMEZONES = [
  { id: 'europe-berlin', label: 'Europe/Berlin' },
  { id: 'europe-london', label: 'Europe/London' },
  { id: 'america-new_york', label: 'America/New_York' },
];

const SESSIONS = [
  { id: 'this', device: 'This browser · Chrome on Linux', location: 'Berlin, DE', last: 'Active now' },
  { id: 'phone', device: 'Acme Mobile · iOS', location: 'Berlin, DE', last: '2 hours ago' },
  { id: 'laptop', device: 'Firefox on macOS', location: 'Lisbon, PT', last: '3 days ago' },
];

export function ProfilePage() {
  const [name, setName] = useState('Ada Lovelace');
  const [title, setTitle] = useState('Platform engineer');
  const [bio, setBio] = useState('Keeps the deploy pipeline honest.');
  const [timezone, setTimezone] = useState('europe-berlin');
  const [digests, setDigests] = useState<string[]>(['weekly']);
  const [saved, setSaved] = useState(false);

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your account, preferences and active sessions."
        tags={[{ label: 'account' }]}
        metadata={[
          { label: 'Member since', value: 'Mar 2024' },
          { label: 'Teams', value: 'team-atlas' },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        <Tabs>
          <TabList aria-label="Profile sections">
            <Tab id="details">Details</Tab>
            <Tab id="notifications">Notifications</Tab>
            <Tab id="sessions">Sessions</Tab>
          </TabList>

          <TabPanel id="details">
            <Flex direction="column" gap="4" mt="4">
              <Card>
                <CardBody>
                  <Flex align="center" gap="4">
                    <Avatar src="" name={name} size="medium" />
                    <Flex direction="column" gap="1">
                      <Text variant="title-x-small" as="p">
                        {name}
                      </Text>
                      <Text variant="body-small" color="secondary">
                        {title}
                      </Text>
                    </Flex>
                  </Flex>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <Text variant="title-x-small" as="h2">
                    Details
                  </Text>
                </CardHeader>
                <CardBody>
                  <Flex direction="column" gap="4">
                    <TextField label="Display name" value={name} onChange={setName} />
                    <TextField label="Job title" value={title} onChange={setTitle} />
                    <TextAreaField label="Bio" rows={3} value={bio} onChange={setBio} />
                    <Select
                      label="Time zone"
                      options={TIMEZONES}
                      value={timezone}
                      onChange={(key) => setTimezone(String(key))}
                    />
                    <Flex align="center" justify="between" gap="4">
                      <Text variant="body-small" color="secondary">
                        {saved ? 'Profile saved.' : 'Changes are not saved yet.'}
                      </Text>
                      <Button variant="primary" onPress={() => setSaved(true)}>
                        Save profile
                      </Button>
                    </Flex>
                  </Flex>
                </CardBody>
              </Card>
            </Flex>
          </TabPanel>

          <TabPanel id="notifications">
            <Card>
              <CardHeader>
                <Text variant="title-x-small" as="h2">
                  Email digests
                </Text>
              </CardHeader>
              <CardBody>
                <CheckboxGroup
                  label="Send me"
                  value={digests}
                  onChange={setDigests}
                >
                  <Checkbox value="daily">A daily deploy summary</Checkbox>
                  <Checkbox value="weekly">A weekly platform digest</Checkbox>
                  <Checkbox value="incidents">Every incident I am on call for</Checkbox>
                </CheckboxGroup>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel id="sessions">
            <Card>
              <CardHeader>
                <Text variant="title-x-small" as="h2">
                  Active sessions
                </Text>
              </CardHeader>
              <CardBody>
                <ul className="session-list">
                  {SESSIONS.map((session) => (
                    <li key={session.id}>
                      <Flex align="center" justify="between" gap="4">
                        <Flex direction="column" gap="1">
                          <Text variant="body-medium">{session.device}</Text>
                          <Text variant="body-small" color="secondary">
                            {session.location} · {session.last}
                          </Text>
                        </Flex>
                        <Button
                          variant="secondary"
                          size="small"
                          isDisabled={session.id === 'this'}
                        >
                          {session.id === 'this' ? 'Current' : 'Revoke'}
                        </Button>
                      </Flex>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </TabPanel>
        </Tabs>
      </Flex>
    </>
  );
}
