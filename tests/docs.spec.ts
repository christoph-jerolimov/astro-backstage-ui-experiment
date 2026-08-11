import { test, expect } from '@playwright/test';
import { clickAndNavigate, settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Docs', () => {
  test('lists the articles in order', async ({ page }) => {
    await page.goto('/docs');
    await waitForHydration(page);

    const links = page.getByRole('link', { name: /Getting started|Pipelines|On-call/ });
    await expect(links).toHaveCount(3);
    // sorted by the frontmatter `order`, not alphabetically
    await expect(links.first()).toHaveText('Getting started');
  });

  test('renders Markdown from the content collection', async ({ page }) => {
    await page.goto('/docs/pipelines');
    await waitForHydration(page);

    await expect(
      page.getByRole('heading', { name: 'Pipelines', exact: true }),
    ).toBeVisible();
    // headings and lists come from the Markdown, not from JSX
    await expect(
      page.getByRole('heading', { name: 'Rollout strategies' }),
    ).toBeVisible();
    await expect(page.locator('.prose li').first()).toContainText('Build');
    // PageHeader renders the metadata label and value as separate nodes
    await expect(page.getByText('Jul 22, 2026')).toBeVisible();
  });

  test('navigates between articles', async ({ page }) => {
    await page.goto('/docs');
    await waitForHydration(page);

    await clickAndNavigate(
      page,
      page.getByRole('link', { name: 'On-call' }),
      /\/docs\/on-call$/,
    );
    await expect(page.getByRole('heading', { name: 'Severities' })).toBeVisible();

    // the sidebar of articles is on every page
    await clickAndNavigate(
      page,
      page.getByRole('navigation', { name: 'Docs' }).getByRole('link', {
        name: 'Getting started',
      }),
      /\/docs\/getting-started$/,
    );
    await expect(page.getByRole('heading', { name: 'Create a service' })).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/docs/getting-started');
    await settle(page);
    await page.screenshot({ path: 'screenshots/docs-article-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/docs/getting-started');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/docs-article-dark.png', fullPage: true });
  });
});
