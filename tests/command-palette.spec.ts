import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

const palette = (page: import('@playwright/test').Page) =>
  page.locator('.palette');

const input = (page: import('@playwright/test').Page) =>
  page.getByPlaceholder('Jump to a page, service or doc');

test.describe('Command palette', () => {
  test('opens on the shortcut and toggles back closed', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await expect(palette(page)).toHaveCount(0);
    await page.keyboard.press('Meta+k');
    await expect(palette(page)).toBeVisible();

    await page.keyboard.press('Meta+k');
    await expect(palette(page)).toHaveCount(0);
  });

  test('control-k works too, and escape closes', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.keyboard.press('Control+k');
    await expect(palette(page)).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(palette(page)).toHaveCount(0);
  });

  test('the sidebar button opens it for people who do not know the keys', async ({
    page,
  }) => {
    await page.goto('/');
    await waitForHydration(page);

    await expect(async () => {
      if (!(await palette(page).isVisible())) {
        await page.getByRole('button', { name: 'Jump to…' }).first().click();
      }
      await expect(palette(page)).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 20000 });
  });

  test('filters as you type and opens what you pick', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.keyboard.press('Meta+k');
    await input(page).fill('incid');

    // the group headings that no longer have matches are gone
    await expect(palette(page).getByText('Incidents')).toBeVisible();
    await expect(palette(page).getByText('Settings')).toHaveCount(0);

    await page.keyboard.press('Enter');
    await page.waitForURL('**/incidents');
    await expect(
      page.getByRole('heading', { name: 'Incidents', exact: true }),
    ).toBeVisible();
  });

  test('reaches pages that are not in the sidebar', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.keyboard.press('Meta+k');
    await input(page).fill('api key');
    await page.keyboard.press('Enter');

    await page.waitForURL('**/api-keys');
    await expect(
      page.getByRole('heading', { name: 'API keys', exact: true }),
    ).toBeVisible();
  });

  test('jumps straight to a single service', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.keyboard.press('Meta+k');
    await input(page).fill('billing-worker');
    await page.keyboard.press('Enter');

    await page.waitForURL('**/services/billing-worker');
    await expect(
      page.getByRole('heading', { name: 'billing-worker', exact: true }),
    ).toBeVisible();
  });

  test('matches on keywords, not just the label', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.keyboard.press('Meta+k');
    // "scaffold" appears nowhere in the label
    await input(page).fill('scaffold');
    await expect(palette(page).getByText('Create a service')).toBeVisible();
  });

  test('says so when nothing matches', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.keyboard.press('Meta+k');
    await input(page).fill('zzzznothing');
    await expect(palette(page).getByText('Nothing matches that.')).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    await page.keyboard.press('Meta+k');
    await expect(palette(page)).toBeVisible();
    await page.screenshot({ path: 'screenshots/command-palette-light.png' });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/');
    await settle(page);
    await page.keyboard.press('Meta+k');
    await expect(palette(page)).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/command-palette-dark.png' });
  });
});
