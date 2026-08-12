---
title: The four numbers worth putting on a dashboard
description: Deploy frequency, lead time, failure rate, time to restore — and what each one hides.
author: Grace Hopper
published: 2026-07-21
tags: [metrics, delivery]
---

A platform dashboard can show almost anything, which is why most of them show
too much. Four measures predict delivery performance well enough that the rest
are decoration.

## Deploy frequency

How often you ship. Easy to game — split one release into ten — so read it
next to failure rate, never alone.

## Lead time for changes

Merge to production. This is the one that exposes the approval queue nobody
wants to talk about.

## Change failure rate

The share of deploys that need a fix or a rollback. Below about 15% is
healthy; a suspiciously low number usually means failures are being fixed
forward without being recorded.

## Time to restore

How long until the service is healthy again. This is the number your users
actually feel, and the only one worth waking someone up over.
