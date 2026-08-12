---
title: Why this demo is built with Astro
description: Islands, static output, and what breaks when a component library assumes a router.
author: Katherine Johnson
published: 2026-06-12
tags: [astro, frontend]
---

This site is a static build with React islands. Each page ships its own HTML;
the only JavaScript is the components that need it.

## What that costs

Navigation is a real page load. A component library that assumes a client
router — Backstage UI peers on react-router — has to be handed real `href`
values instead, and its link components have to render actual anchors.

## What that buys

Every page is prerendered, so the first paint is HTML and the demo survives
having JavaScript blocked. The theme is applied by an inline script before
first paint, which is why navigating between pages never flashes light.

The trade is worth it for a demo, and probably for a docs site. For an app
with a lot of shared client state, it would not be.
