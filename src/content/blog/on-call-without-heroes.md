---
title: On-call without heroes
description: Rotations, runbooks and the two rules that keep a rota survivable.
author: Alan Turing
published: 2026-06-30
tags: [on-call, incidents]
---

Every on-call rota eventually depends on one person who knows everything.
That person is a single point of failure with a family, and the rota is one
resignation away from collapse.

## Rule one: the pager goes to the owning team

Not to the platform team, not to whoever answers first. If a service pages
someone who cannot fix it, the page is a relay, and relays cost minutes at
exactly the wrong time.

## Rule two: a page without a runbook is a bug

If an alert fires and the person receiving it has to reason from first
principles, the alert is not finished. Write the runbook, link it from the
alert, and delete alerts nobody can act on.

Both rules push work back to the teams that own the service, which is the
point: on-call stops being a heroic act and becomes ordinary maintenance.
