import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  Text,
  TextAreaField,
  TextField,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { SERVICES } from '../dashboard/data';

const TEMPLATES = [
  { id: 'node-service', label: 'Node service (TypeScript)' },
  { id: 'go-service', label: 'Go service' },
  { id: 'python-worker', label: 'Python worker' },
];

const OWNERS = Array.from(new Set(SERVICES.map((s) => s.owner)))
  .sort()
  .map((owner) => ({ id: owner, label: owner }));

const STEPS = ['Basics', 'Runtime', 'Review'] as const;

export function CreateServicePage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState(OWNERS[0]!.id);
  const [template, setTemplate] = useState('node-service');
  const [replicas, setReplicas] = useState(2);
  const [strategy, setStrategy] = useState('rolling');
  const [pageOnCall, setPageOnCall] = useState(true);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const taken = SERVICES.some((s) => s.name === name.trim());

  const next = () => {
    if (step === 0) {
      if (!name.trim()) {
        setError('A service needs a name.');
        return;
      }
      if (taken) {
        setError(`There is already a service called ${name.trim()}.`);
        return;
      }
    }
    setError(null);
    setStep(step + 1);
  };

  if (created) {
    return (
      <>
        <PageHeader
          title="Service created"
          description={`${name} is in the catalog and its first build is running.`}
        />
        <Flex direction="column" gap="4" mt="4">
          <Card>
            <CardBody>
              <Flex direction="column" gap="3">
                <Text variant="title-x-small" as="h2">
                  What happens next
                </Text>
                <Text color="secondary">
                  The template pipeline builds {name}, deploys it to staging,
                  and registers it with {owner}. Production needs an approval.
                </Text>
                <Flex gap="2">
                  <Button
                    variant="secondary"
                    onPress={() => {
                      setCreated(false);
                      setStep(0);
                      setName('');
                    }}
                  >
                    Create another
                  </Button>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
        </Flex>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Create a service"
        description="Templates carry the pipeline, health checks and on-call routing."
        metadata={[{ label: 'Step', value: `${step + 1} of ${STEPS.length}` }]}
      />

      <Flex direction="column" gap="4" mt="4">
        <ol className="wizard-steps" aria-label="Progress">
          {STEPS.map((label, index) => (
            <li
              key={label}
              data-state={
                index === step ? 'current' : index < step ? 'done' : 'todo'
              }
              aria-current={index === step ? 'step' : undefined}
            >
              <span className="wizard-step-index">{index + 1}</span>
              {label}
            </li>
          ))}
        </ol>

        <Card>
          <CardHeader>
            <Text variant="title-x-small" as="h2">
              {STEPS[step]}
            </Text>
          </CardHeader>
          <CardBody>
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            {step === 0 && (
              <Flex direction="column" gap="4" mt={error ? '4' : undefined}>
                <TextField
                  label="Service name"
                  description="Lowercase, hyphenated. This becomes the catalog id."
                  placeholder="payments-api"
                  value={name}
                  onChange={setName}
                />
                <TextAreaField
                  label="Description"
                  rows={3}
                  placeholder="What does this service do?"
                  value={description}
                  onChange={setDescription}
                />
                <Select
                  label="Owning team"
                  options={OWNERS}
                  value={owner}
                  onChange={(key) => setOwner(String(key))}
                />
              </Flex>
            )}

            {step === 1 && (
              <Flex direction="column" gap="4">
                <Select
                  label="Template"
                  options={TEMPLATES}
                  value={template}
                  onChange={(key) => setTemplate(String(key))}
                />
                <NumberField
                  label="Replicas"
                  minValue={1}
                  maxValue={20}
                  value={replicas}
                  onChange={setReplicas}
                />
                <RadioGroup
                  label="Rollout strategy"
                  value={strategy}
                  onChange={setStrategy}
                >
                  <Radio value="rolling">Rolling update</Radio>
                  <Radio value="blue-green">Blue / green</Radio>
                  <Radio value="canary">Canary</Radio>
                </RadioGroup>
                <Checkbox isSelected={pageOnCall} onChange={setPageOnCall}>
                  Page the owning team for SEV1 and SEV2
                </Checkbox>
              </Flex>
            )}

            {step === 2 && (
              <dl className="review-list">
                <div>
                  <dt>Name</dt>
                  <dd>{name}</dd>
                </div>
                <div>
                  <dt>Description</dt>
                  <dd>{description || '—'}</dd>
                </div>
                <div>
                  <dt>Owner</dt>
                  <dd>{owner}</dd>
                </div>
                <div>
                  <dt>Template</dt>
                  <dd>{TEMPLATES.find((t) => t.id === template)?.label}</dd>
                </div>
                <div>
                  <dt>Replicas</dt>
                  <dd>{replicas}</dd>
                </div>
                <div>
                  <dt>Strategy</dt>
                  <dd>{strategy}</dd>
                </div>
                <div>
                  <dt>Paging</dt>
                  <dd>{pageOnCall ? 'On for SEV1 and SEV2' : 'Off'}</dd>
                </div>
              </dl>
            )}
          </CardBody>
        </Card>

        <Flex justify="between" gap="4">
          <Button
            variant="secondary"
            isDisabled={step === 0}
            onPress={() => {
              setError(null);
              setStep(step - 1);
            }}
          >
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="primary" onPress={next}>
              Continue
            </Button>
          ) : (
            <Button variant="primary" onPress={() => setCreated(true)}>
              Create service
            </Button>
          )}
        </Flex>
      </Flex>
    </>
  );
}
