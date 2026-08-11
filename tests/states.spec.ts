import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('States gallery', () => {
  test('opens on the loading state, with the header already in place', async ({
    page,
  }) => {
    await page.goto('/states');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'States', exact: true })).toBeVisible();
    // the column headers are there before the data is, so nothing jumps later
    await expect(page.getByRole('columnheader', { name: 'Service' })).toBeVisible();
    await expect(page.locator('.bui-Skeleton').first()).toBeVisible();
  });

  test('each state can be inspected', async ({ page }) => {
    await page.goto('/states');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'empty', exact: true }).click();
    await expect(page.getByText('No services yet')).toBeVisible();
    // an empty state that only says "nothing here" is a dead end
    await expect(
      page.getByRole('link', { name: 'Create a service' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'error', exact: true }).click();
    await expect(page.getByText('Could not load services')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();

    await page.getByRole('button', { name: 'loaded', exact: true }).click();
    await expect(page.getByRole('rowheader', { name: 'catalog-api' })).toBeVisible();
  });

  test('retrying from the error goes back to loading', async ({ page }) => {
    await page.goto('/states');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'error', exact: true }).click();
    await page.getByRole('button', { name: 'Retry' }).click();

    await expect(page.locator('.bui-Skeleton').first()).toBeVisible();
  });

  test('shows all four alert levels', async ({ page }) => {
    await page.goto('/states');
    await waitForHydration(page);

    for (const title of [
      'Scheduled maintenance on Sunday',
      'Rollout finished',
      'Two services have no owner',
      'Production deploy failed',
    ]) {
      await expect(page.getByText(title)).toBeVisible();
    }
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/states');
    await settle(page);
    await page.screenshot({ path: 'screenshots/states-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/states');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/states-dark.png', fullPage: true });
  });
});
