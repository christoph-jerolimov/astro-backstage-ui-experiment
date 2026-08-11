import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Search', () => {
  test('indexes nothing until you type', async ({ page }) => {
    await page.goto('/search');
    await waitForHydration(page);

    await expect(
      page.getByText('Type something to search. Nothing is indexed until you do.'),
    ).toBeVisible();
  });

  test('finds across services, incidents, deployments and docs', async ({
    page,
  }) => {
    await page.goto('/search');
    await waitForHydration(page);

    await page.getByRole('searchbox', { name: 'Search everything' }).fill('catalog');

    // the service itself, plus its deployments, so several results mention it
    await expect(
      page.getByRole('link', { name: 'catalog-api', exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /catalog-api/ }).first(),
    ).toBeVisible();
    await expect(page.getByText(/\d+ results?/)).toBeVisible();
  });

  test('filters results by kind', async ({ page }) => {
    await page.goto('/search');
    await waitForHydration(page);

    await page.getByRole('searchbox', { name: 'Search everything' }).fill('pipeline');
    await page.getByRole('radio', { name: 'Docs' }).click();

    await expect(page.getByRole('link', { name: 'Pipelines' })).toBeVisible();
  });

  test('says so when nothing matches', async ({ page }) => {
    await page.goto('/search');
    await waitForHydration(page);

    await page
      .getByRole('searchbox', { name: 'Search everything' })
      .fill('zzzznothing');
    await expect(page.getByText(/No matches for/)).toBeVisible();
  });

  // The empty state is captured by pages.spec; these show actual results.
  test('screenshots', async ({ page }) => {
    await page.goto('/search');
    await waitForHydration(page);
    await page.getByRole('searchbox', { name: 'Search everything' }).fill('catalog');
    await settle(page);
    await page.screenshot({ path: 'screenshots/search-results-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/search');
    await waitForHydration(page);
    await page.getByRole('searchbox', { name: 'Search everything' }).fill('catalog');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/search-results-dark.png', fullPage: true });
  });
});
