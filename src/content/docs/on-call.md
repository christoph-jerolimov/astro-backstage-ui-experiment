---
title: On-call
description: What happens when something breaks, and who hears about it.
order: 3
updated: 'Aug 9, 2026'
---

## Severities

Severity describes impact, not urgency of the fix.

- **SEV1** — customer-facing outage. Page immediately.
- **SEV2** — degraded behaviour with a workaround.
- **SEV3** — internal or cosmetic; handled in working hours.

## Escalation

Alerts route to the owning team first. If nobody acknowledges within five
minutes, the alert escalates to the platform on-call rotation.

Every incident gets a channel, a timeline and a review. The review is not
optional for SEV1 and SEV2.
