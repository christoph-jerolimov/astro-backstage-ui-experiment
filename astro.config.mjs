// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// GitHub Pages serves a project site from /<repo>/, so the build needs a base
// path. It is only set in the deploy workflow (from actions/configure-pages),
// which keeps `npm run dev`, the local build and the Playwright suite on `/`.
const base = process.env.BASE_PATH || '/';
const site = process.env.SITE_URL || undefined;

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [react()],
});
