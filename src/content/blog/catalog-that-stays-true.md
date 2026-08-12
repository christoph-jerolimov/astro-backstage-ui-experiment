---
title: A catalog is only useful if it is true
description: Why we made the pipeline register services instead of asking people to.
author: Ada Lovelace
published: 2026-08-04
tags: [catalog, platform]
---

Every service catalog starts accurate and ends up fiction. Someone adds a
service by hand, someone else renames it, and six months later the catalog
lists two things that do not exist and misses four that do.

## The failure is structural, not human

Asking people to keep a second copy of reality up to date is a losing game.
The catalog is not where services live; it is a description of where they
live, and descriptions drift.

So we stopped asking. A service appears in the catalog when its pipeline
first deploys it, and its metadata comes from the same file the pipeline
reads. Rename the service and the catalog renames itself on the next deploy.

## What that changes downstream

Ownership stops being a guess. On-call routing, deploy approvals and the
incident timeline all read from the catalog, so they are only as good as it
is — and now it is as good as the pipeline, which nobody can forget to run.
