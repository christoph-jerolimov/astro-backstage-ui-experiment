import { useMemo, useState } from 'react';
import { Badge, Button, Card, CardBody, CardHeader, Flex, Text } from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';

type EventKind = 'release' | 'oncall' | 'freeze' | 'review';

interface CalendarEvent {
  day: number;
  kind: EventKind;
  title: string;
  detail: string;
}

const KIND_LABEL: Record<EventKind, string> = {
  release: 'Release',
  oncall: 'On-call',
  freeze: 'Freeze',
  review: 'Review',
};

/** August 2026: starts on a Saturday, 31 days. */
const MONTH = { label: 'August 2026', days: 31, startsOn: 6 };
const TODAY = 12;

const EVENTS: CalendarEvent[] = [
  { day: 3, kind: 'oncall', title: 'Ada on call', detail: 'Primary, week of 3 August' },
  { day: 5, kind: 'release', title: 'catalog-api v2.13.0', detail: 'Production, 09:40' },
  { day: 10, kind: 'oncall', title: 'Alan on call', detail: 'Primary, week of 10 August' },
  { day: 11, kind: 'release', title: 'catalog-api v2.14.0', detail: 'Production, 09:12' },
  { day: 12, kind: 'review', title: 'Platform review', detail: '14:00, 45 minutes' },
  { day: 14, kind: 'release', title: 'auth-gateway v3.2.0', detail: 'Production, planned' },
  { day: 17, kind: 'oncall', title: 'Grace on call', detail: 'Primary, week of 17 August' },
  { day: 21, kind: 'freeze', title: 'Change freeze begins', detail: 'Through the bank holiday' },
  { day: 24, kind: 'freeze', title: 'Change freeze ends', detail: 'Normal service resumes' },
  { day: 26, kind: 'release', title: 'billing-worker v1.5.0', detail: 'Production, planned' },
  { day: 31, kind: 'review', title: 'Month in review', detail: '10:00, 60 minutes' },
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CalendarPage() {
  const [selected, setSelected] = useState<number>(TODAY);

  const byDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    for (const event of EVENTS) {
      if (!map.has(event.day)) map.set(event.day, []);
      map.get(event.day)!.push(event);
    }
    return map;
  }, []);

  // A leading run of blanks so the first day lands on its weekday.
  const leading = Array.from({ length: MONTH.startsOn }, (_, i) => -i - 1);
  const days = Array.from({ length: MONTH.days }, (_, i) => i + 1);
  const selectedEvents = byDay.get(selected) ?? [];

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Releases, on-call weeks and change freezes in one month."
        metadata={[
          { label: 'Month', value: MONTH.label },
          { label: 'Events', value: String(EVENTS.length) },
        ]}
      />

      <Flex direction="column" gap="4" mt="4">
        <Card>
          <CardHeader>
            <Flex align="center" justify="between" gap="4">
              <Text variant="title-x-small" as="h2">
                {MONTH.label}
              </Text>
              <Flex align="center" gap="2">
                {/* A single month of demo data, so moving between months
                    would be a lie. Today is the only jump worth offering. */}
                <Button
                  variant="secondary"
                  size="small"
                  onPress={() => setSelected(TODAY)}
                >
                  Today
                </Button>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody>
            <div className="calendar">
              {WEEKDAYS.map((weekday) => (
                <div key={weekday} className="calendar-weekday" aria-hidden="true">
                  {weekday}
                </div>
              ))}
              {leading.map((key) => (
                <div key={key} className="calendar-blank" />
              ))}
              {days.map((day) => {
                const events = byDay.get(day) ?? [];
                return (
                  <button
                    key={day}
                    type="button"
                    className="calendar-day"
                    data-today={day === TODAY}
                    data-selected={day === selected}
                    aria-pressed={day === selected}
                    aria-label={`${day} August, ${events.length} ${
                      events.length === 1 ? 'event' : 'events'
                    }`}
                    onClick={() => setSelected(day)}
                  >
                    <span className="calendar-date">{day}</span>
                    <span className="calendar-events">
                      {events.map((event) => (
                        <span
                          key={event.title}
                          className="calendar-chip"
                          data-kind={event.kind}
                        >
                          {event.title}
                        </span>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Flex align="center" justify="between" gap="4">
              <Text variant="title-x-small" as="h2">
                {selected} August
              </Text>
              {selected === TODAY && <Badge>Today</Badge>}
            </Flex>
          </CardHeader>
          <CardBody>
            {selectedEvents.length === 0 ? (
              <Text color="secondary">Nothing scheduled.</Text>
            ) : (
              <Flex direction="column" gap="3">
                {selectedEvents.map((event) => (
                  <Flex key={event.title} direction="column" gap="1">
                    <Flex align="center" gap="2">
                      {/* The kind is a word next to the title, not only the
                          colour of the chip in the grid. */}
                      <span className="calendar-chip" data-kind={event.kind}>
                        {KIND_LABEL[event.kind]}
                      </span>
                      <Text as="span">{event.title}</Text>
                    </Flex>
                    <Text variant="body-small" color="secondary">
                      {event.detail}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            )}
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}
