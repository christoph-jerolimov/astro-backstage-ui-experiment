import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Maintenance page', () => {
  test('stands alone, with no shell to depend on', async ({ page }) => {
    await page.goto('/maintenance');
    await waitForHydration(page);

    await expect(
      page.getByRole('heading', { name: 'Down for maintenance' }),
    ).toBeVisible();
    await expect(
      page.getByRole('listbox', { name: 'Main navigation' }),
    ).toHaveCount(0);
  });

  test('says when it is coming back and what happens to queued work', async ({
    page,
  }) => {
    await page.goto('/maintenance');
    await waitForHydration(page);

    await expect(page.getByText('Back by')).toBeVisible();
    await expect(page.getByText('00:30 UTC')).toBeVisible();
    await expect(page.getByText(/queued and will start on their own/)).toBeVisible();
  });

  test('shows which step it is up to', async ({ page }) => {
    await page.goto('/maintenance');
    await waitForHydration(page);

    const step = (text: string) =>
      page.locator('.progress-list li').filter({ hasText: text });

    await expect(step('Database migration')).toHaveAttribute('data-state', 'done');
    await expect(step('Rebuilding search indexes')).toHaveAttribute(
      'data-state',
      'doing',
    );
    await expect(step('Draining old workers')).toHaveAttribute('data-state', 'todo');
  });

  test('points at a status page hosted somewhere else', async ({ page }) => {
    await page.goto('/maintenance');
    await waitForHydration(page);

    // the point of the link is that it is not on this host
    await expect(page.getByRole('link', { name: 'status page' })).toHaveAttribute(
      'href',
      /^https:\/\//,
    );
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/maintenance');
    await settle(page);
    await page.screenshot({
      path: 'screenshots/maintenance-light.png',
      fullPage: true,
    });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/maintenance');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({
      path: 'screenshots/maintenance-dark.png',
      fullPage: true,
    });
  });
});
