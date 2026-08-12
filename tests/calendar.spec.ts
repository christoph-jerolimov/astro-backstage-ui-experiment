import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Calendar', () => {
  test('lays out a real month, seven columns wide', async ({ page }) => {
    await page.goto('/calendar');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'Calendar', exact: true })).toBeVisible();
    await expect(page.locator('.calendar-day')).toHaveCount(31);
    // August 2026 starts on a Saturday, so six blanks lead the grid
    await expect(page.locator('.calendar-blank')).toHaveCount(6);
  });

  test('marks today and opens on it', async ({ page }) => {
    await page.goto('/calendar');
    await waitForHydration(page);

    await expect(page.locator('.calendar-day[data-today="true"]')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: '12 August' })).toBeVisible();
    // it appears twice: as a chip in the grid and in the day's detail
    await expect(page.getByText('Platform review').last()).toBeVisible();
  });

  test('picking a day shows what is on it', async ({ page }) => {
    await page.goto('/calendar');
    await waitForHydration(page);

    await page.getByRole('button', { name: '21 August, 1 event' }).click();

    await expect(page.getByRole('heading', { name: '21 August' })).toBeVisible();
    await expect(page.getByText('Through the bank holiday')).toBeVisible();
  });

  test('an empty day says so', async ({ page }) => {
    await page.goto('/calendar');
    await waitForHydration(page);

    await page.getByRole('button', { name: '4 August, 0 events' }).click();
    await expect(page.getByText('Nothing scheduled.')).toBeVisible();
  });

  test('the kind is a word in the detail, not only a colour', async ({ page }) => {
    await page.goto('/calendar');
    await waitForHydration(page);

    await page.getByRole('button', { name: '11 August, 1 event' }).click();
    await expect(page.getByText('Release', { exact: true })).toBeVisible();
  });

  test('today jumps back after wandering', async ({ page }) => {
    await page.goto('/calendar');
    await waitForHydration(page);

    await page.getByRole('button', { name: '31 August, 1 event' }).click();
    await expect(page.getByRole('heading', { name: '31 August' })).toBeVisible();

    await page.getByRole('button', { name: 'Today' }).click();
    await expect(page.getByRole('heading', { name: '12 August' })).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/calendar');
    await settle(page);
    await page.screenshot({ path: 'screenshots/calendar-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/calendar');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/calendar-dark.png', fullPage: true });
  });
});
