import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Not found', () => {
  test('an unknown URL renders the 404 page inside the app shell', async ({
    page,
  }) => {
    const response = await page.goto('/no-such-page');
    expect(response?.status()).toBe(404);
    await waitForHydration(page);

    await expect(
      page.getByRole('heading', { name: 'Page not found', exact: true }),
    ).toBeVisible();

    // the shell is still there, but nothing in the nav is marked current
    const nav = page.getByRole('listbox', { name: 'Main navigation' });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('option', { selected: true })).toHaveCount(0);
  });

  test('offers a way back', async ({ page }) => {
    await page.goto('/no-such-page');
    await waitForHydration(page);

    await page.getByRole('link', { name: 'Back to overview' }).click();
    await page.waitForURL('**/');
    await expect(
      page.getByRole('heading', { name: 'Platform overview', exact: true }),
    ).toBeVisible();
  });

  test('suggestion links route', async ({ page }) => {
    await page.goto('/no-such-page');
    await waitForHydration(page);

    await page.getByRole('link', { name: 'Incidents', exact: true }).click();
    await page.waitForURL('**/incidents');
    await expect(
      page.getByRole('heading', { name: 'Incidents', exact: true }),
    ).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/no-such-page');
    await settle(page);
    await page.screenshot({ path: 'screenshots/404-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/no-such-page');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/404-dark.png', fullPage: true });
  });
});
