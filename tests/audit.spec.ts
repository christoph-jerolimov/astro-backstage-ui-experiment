import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Audit log', () => {
  test('reads as sentences, grouped by day', async ({ page }) => {
    await page.goto('/audit');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'Audit log' })).toBeVisible();
    await expect(page.getByText('Today', { exact: true })).toBeVisible();
    await expect(page.getByText('Yesterday', { exact: true })).toBeVisible();

    await expect(
      page.locator('.audit-list li').filter({ hasText: 'granted Billing admin to' }),
    ).toContainText('Grace Hopper');
  });

  test('filters by category', async ({ page }) => {
    await page.goto('/audit');
    await waitForHydration(page);

    await page.getByRole('radio', { name: 'Billing' }).click();

    await expect(page.getByText('changed the plan to')).toBeVisible();
    await expect(page.getByText('deployed')).toHaveCount(0);
  });

  test('filters by actor', async ({ page }) => {
    await page.goto('/audit');
    await waitForHydration(page);

    await page.getByRole('button', { name: /Anyone/ }).click();
    await page.getByRole('option', { name: 'Alan Turing' }).click();

    await expect(page.getByText('2 of 10 entries')).toBeVisible();
  });

  test('an empty result says it is a filter problem', async ({ page }) => {
    await page.goto('/audit');
    await waitForHydration(page);

    await page.getByRole('searchbox', { name: 'Filter entries' }).fill('zzzznothing');

    await expect(page.getByText('Nothing matches those filters')).toBeVisible();
    await expect(page.getByText(/not an absence of activity/)).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/audit');
    await settle(page);
    await page.screenshot({ path: 'screenshots/audit-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/audit');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/audit-dark.png', fullPage: true });
  });
});
