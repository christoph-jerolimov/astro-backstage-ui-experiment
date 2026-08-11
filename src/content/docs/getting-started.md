---
title: Getting started
description: Ship your first service to Acme Cloud in about ten minutes.
order: 1
updated: 'Aug 4, 2026'
---

## Before you begin

You need a workspace account and the `acme` CLI. Everything below assumes you
are a member of at least one team.

## Create a service

Every service starts from a template. Templates carry the pipeline, the health
checks and the on-call routing, so a new service is wired into the platform
from its first commit.

1. Pick a template that matches your runtime.
2. Give the service a name — this becomes its catalog entry and its URL.
3. Choose the owning team. Ownership drives who gets paged.

## Deploy it

Merging to the default branch builds the service and deploys it to staging.
Production requires an approval unless your workspace has turned that off.

Deployments appear in the catalog within a few seconds, and the deploy history
is kept for ninety days.
