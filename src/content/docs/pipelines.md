---
title: Pipelines
description: How builds, tests and deployments fit together.
order: 2
updated: 'Jul 22, 2026'
---

## Stages

A pipeline has three stages, and each one has to pass before the next starts.

- **Build** compiles the service and produces an image.
- **Test** runs the suite the template installed.
- **Deploy** rolls the image out using the workspace strategy.

## Rollout strategies

The workspace default is a rolling update. Blue/green and canary are available
per service, and a service can override the workspace default.

A failed health check after deploy triggers an automatic rollback. The rollback
is recorded as its own deployment so the history stays honest about what
actually ran.
