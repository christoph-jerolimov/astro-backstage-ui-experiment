import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Flex,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Text,
  TextAreaField,
  TextField,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';

const REGIONS = [
  { id: 'eu-west-1', label: 'eu-west-1 (Ireland)' },
  { id: 'us-east-1', label: 'us-east-1 (N. Virginia)' },
  { id: 'ap-south-1', label: 'ap-south-1 (Mumbai)' },
];

export function SettingsPage() {
  const [name, setName] = useState('Acme Cloud');
  const [region, setRegion] = useState('eu-west-1');
  const [strategy, setStrategy] = useState('rolling');
  const [channels, setChannels] = useState<string[]>(['email', 'slack']);
  const [requireApproval, setRequireApproval] = useState(true);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const onSave = () => setSaved(true);

  const onReset = () => {
    setName('Acme Cloud');
    setRegion('eu-west-1');
    setStrategy('rolling');
    setChannels(['email', 'slack']);
    setRequireApproval(true);
    setNotes('');
    setSaved(false);
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Workspace defaults applied to every pipeline in this organisation."
        tags={[{ label: 'admin' }]}
        metadata={[
          { label: 'Workspace', value: 'acme-cloud' },
          { label: 'Plan', value: 'Enterprise' },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        <div className="settings-grid">
          <Card>
            <CardHeader>
              <Text variant="title-x-small" as="h2">
                General
              </Text>
            </CardHeader>
            <CardBody>
              <Flex direction="column" gap="4">
                <TextField
                  label="Workspace name"
                  description="Shown in the sidebar and on every report."
                  value={name}
                  onChange={setName}
                />
                <Select
                  label="Default region"
                  options={REGIONS}
                  value={region}
                  onChange={(key) => setRegion(String(key))}
                />
                <TextAreaField
                  label="Description"
                  placeholder="What does this workspace deploy?"
                  rows={3}
                  value={notes}
                  onChange={setNotes}
                />
              </Flex>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Text variant="title-x-small" as="h2">
                Deployments
              </Text>
            </CardHeader>
            <CardBody>
              <Flex direction="column" gap="4">
                <RadioGroup
                  label="Rollout strategy"
                  value={strategy}
                  onChange={setStrategy}
                >
                  <Radio value="rolling">Rolling update</Radio>
                  <Radio value="blue-green">Blue / green</Radio>
                  <Radio value="canary">Canary</Radio>
                </RadioGroup>
                <Switch
                  label="Require approval for production"
                  isSelected={requireApproval}
                  onChange={setRequireApproval}
                />
              </Flex>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Text variant="title-x-small" as="h2">
                Notifications
              </Text>
            </CardHeader>
            <CardBody>
              <CheckboxGroup
                label="Notify on failed deploys"
                value={channels}
                onChange={setChannels}
              >
                <Checkbox value="email">Email</Checkbox>
                <Checkbox value="slack">Slack</Checkbox>
                <Checkbox value="pagerduty">PagerDuty</Checkbox>
              </CheckboxGroup>
            </CardBody>
          </Card>
        </div>

        {/* The actions save the whole form, so they belong below the grid
            rather than inside whichever card happens to come last. */}
        <Card>
          <CardBody>
            <Flex align="center" justify="between" gap="4">
              <Text variant="body-small" color="secondary">
                {saved ? 'Settings saved.' : 'Changes are not saved yet.'}
              </Text>
              <Flex gap="2">
                <Button variant="secondary" onPress={onReset}>
                  Reset
                </Button>
                <Button variant="primary" onPress={onSave}>
                  Save changes
                </Button>
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
