import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('403 page', () => {
  test('distinguishes itself from a 404', async ({ page }) => {
    await page.goto('/403');
    await waitForHydration(page);

    await expect(
      page.getByRole('heading', { name: 'You do not have access' }),
    ).toBeVisible();
    await expect(page.getByText('403')).toBeVisible();
    // the page exists — that is the whole difference from a 404
    await expect(page.getByText('This page exists.')).toBeVisible();
  });

  test('says who you are signed in as and what is missing', async ({ page }) => {
    await page.goto('/403');
    await waitForHydration(page);

    await expect(page.getByText('Signed in as Ada Lovelace')).toBeVisible();
    await expect(page.getByText(/Developer in team-atlas/)).toBeVisible();
    await expect(page.getByText(/needs the/)).toContainText('Billing admin');
  });

  test('requesting access confirms in place', async ({ page }) => {
    await page.goto('/403');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'Request access' }).click();

    await expect(page.getByText(/Request sent/)).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Request access' }),
    ).toHaveCount(0);
  });

  test('offers signing in as someone else', async ({ page }) => {
    await page.goto('/403');
    await waitForHydration(page);

    await expect(
      page.getByRole('link', { name: 'sign in as someone else' }),
    ).toHaveAttribute('href', /\/signin$/);
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/403');
    await settle(page);
    await page.screenshot({ path: 'screenshots/403-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/403');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/403-dark.png', fullPage: true });
  });
});
