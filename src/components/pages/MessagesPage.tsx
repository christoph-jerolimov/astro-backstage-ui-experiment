import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Flex,
  SearchField,
  Text,
  TextAreaField,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { StatusPill } from '../dashboard/StatusPill';

interface Message {
  id: string;
  from: string;
  at: string;
  body: string;
  mine?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  subtitle: string;
  unread: number;
  last: string;
  messages: Message[];
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'inc-241',
    title: 'INC-241 · notification-hub',
    subtitle: 'Ada, Alan, Katherine',
    unread: 2,
    last: '3 minutes ago',
    messages: [
      { id: 'm1', from: 'Alan Turing', at: '09:14', body: 'Delivery is throwing 5xx on about one request in five. Opening a SEV1.' },
      { id: 'm2', from: 'Katherine Johnson', at: '09:16', body: 'Started right after v0.9.7 went out. Rolling back now.' },
      { id: 'm3', from: 'Ada Lovelace', at: '09:21', body: 'Rollback is done and the error rate is falling. Leaving the incident open until it is flat for ten minutes.' },
      { id: 'm4', from: 'Alan Turing', at: '09:33', body: 'Flat for eleven. Mitigated — I will write it up this afternoon.' },
    ],
  },
  {
    id: 'team-atlas',
    title: 'team-atlas',
    subtitle: 'Ada, Margaret',
    unread: 0,
    last: '2 hours ago',
    messages: [
      { id: 'm1', from: 'Margaret Hamilton', at: '07:40', body: 'Cache work is ready for review, PLAT-309.' },
      { id: 'm2', from: 'Ada Lovelace', at: '07:52', body: 'Looking now. Does it handle the cold-start case we hit in June?' },
      { id: 'm3', from: 'Margaret Hamilton', at: '08:03', body: 'Yes — there is a test for it that fails on the old code.' },
    ],
  },
  {
    id: 'platform',
    title: 'Platform announcements',
    subtitle: 'Everyone',
    unread: 1,
    last: 'Yesterday',
    messages: [
      { id: 'm1', from: 'Grace Hopper', at: 'Yesterday', body: 'Change freeze from 21 to 24 August for the bank holiday. Plan releases around it.' },
    ],
  },
];

export function MessagesPage() {
  const [openId, setOpenId] = useState(CONVERSATIONS[0]!.id);
  const [query, setQuery] = useState('');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Record<string, Message[]>>({});
  const endRef = useRef<HTMLDivElement>(null);

  const conversations = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return CONVERSATIONS;
    return CONVERSATIONS.filter((conversation) =>
      `${conversation.title} ${conversation.subtitle}`
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);

  const open = CONVERSATIONS.find((c) => c.id === openId)!;
  const messages = [...open.messages, ...(sent[openId] ?? [])];
  const draft = drafts[openId] ?? '';

  // A thread opens at the newest message; scrolling up is the deliberate act.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [openId, messages.length]);

  const send = () => {
    const body = draft.trim();
    if (!body) return;
    setSent((prev) => ({
      ...prev,
      [openId]: [
        ...(prev[openId] ?? []),
        { id: `sent-${(prev[openId] ?? []).length}`, from: 'Ada Lovelace', at: 'Just now', body, mine: true },
      ],
    }));
    setDrafts((prev) => ({ ...prev, [openId]: '' }));
  };

  return (
    <>
      <PageHeader
        title="Messages"
        description="Incident channels and team threads, without leaving the platform."
        metadata={[
          { label: 'Conversations', value: String(CONVERSATIONS.length) },
          {
            label: 'Unread',
            value: String(CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0)),
          },
        ]}
      />

      <div className="messages">
        <Card>
          <CardBody>
            <Flex direction="column" gap="3">
              <SearchField
                size="small"
                label="Filter conversations"
                placeholder="Name or channel"
                value={query}
                onChange={setQuery}
              />
              <ul className="conversation-list">
                {conversations.map((conversation) => (
                  <li key={conversation.id}>
                    <button
                      type="button"
                      data-open={conversation.id === openId}
                      aria-pressed={conversation.id === openId}
                      onClick={() => setOpenId(conversation.id)}
                    >
                      <Flex align="center" justify="between" gap="2">
                        <Text variant="body-small" as="span">
                          {conversation.title}
                        </Text>
                        {conversation.unread > 0 && (
                          <StatusPill
                            tone="critical"
                            label={`${conversation.unread} new`}
                          />
                        )}
                      </Flex>
                      <Text variant="body-small" color="secondary" as="span">
                        {conversation.subtitle} · {conversation.last}
                      </Text>
                    </button>
                  </li>
                ))}
              </ul>
              {conversations.length === 0 && (
                <Text color="secondary">No conversations match that.</Text>
              )}
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="1">
                <Text variant="title-x-small" as="h2">
                  {open.title}
                </Text>
                <Text variant="body-small" color="secondary">
                  {open.subtitle}
                </Text>
              </Flex>

              <div className="thread" role="log" aria-label={`${open.title} messages`}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="message"
                    data-mine={message.mine === true}
                  >
                    <Avatar src="" name={message.from} size="small" />
                    <div className="message-body">
                      <Flex align="baseline" gap="2">
                        <Text variant="body-small" as="span">
                          {message.from}
                        </Text>
                        <Text variant="body-small" color="secondary" as="span">
                          {message.at}
                        </Text>
                      </Flex>
                      <Text color="secondary">{message.body}</Text>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <Flex direction="column" gap="2">
                <TextAreaField
                  label="Message"
                  rows={2}
                  placeholder={`Write to ${open.title}`}
                  value={draft}
                  onChange={(value) =>
                    setDrafts((prev) => ({ ...prev, [openId]: value }))
                  }
                />
                <Flex align="center" justify="between" gap="4">
                  {/* Drafts are kept per conversation, so switching away and
                      back does not throw away what you were typing. */}
                  <Text variant="body-small" color="secondary">
                    Drafts are kept per conversation.
                  </Text>
                  <Button
                    variant="primary"
                    size="small"
                    isDisabled={draft.trim() === ''}
                    onPress={send}
                  >
                    Send
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
