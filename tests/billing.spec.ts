import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Billing', () => {
  test('shows the plan, the usage and what is owed', async ({ page }) => {
    await page.goto('/billing');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'Billing', exact: true })).toBeVisible();
    await expect(page.getByText('Seats in use')).toBeVisible();
    await expect(page.getByText(/Visa ending 4242/)).toBeVisible();
    await expect(page.getByText(/INV-2026-08/)).toBeVisible();
  });

  test('going over an allowance is said in words, not only colour', async ({
    page,
  }) => {
    await page.goto('/billing');
    await waitForHydration(page);

    await expect(page.getByText(/2,400 over/).first()).toBeVisible();
    await expect(page.locator('.meter[data-over="true"]')).toHaveCount(1);
  });

  test('the seat slider moves the estimate with it', async ({ page }) => {
    await page.goto('/billing');
    await waitForHydration(page);

    await expect(page.getByText('8 seats · $320.00 per month')).toBeVisible();

    const slider = page.getByRole('slider', { name: 'Seats' });
    await slider.focus();
    await page.keyboard.press('ArrowRight');

    await expect(page.getByText('9 seats · $360.00 per month')).toBeVisible();
  });

  test('warns when cutting seats would lock people out', async ({ page }) => {
    await page.goto('/billing');
    await waitForHydration(page);

    const slider = page.getByRole('slider', { name: 'Seats' });
    await slider.focus();
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');

    await expect(page.getByText(/2 people would lose access/)).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/billing');
    await settle(page);
    await page.screenshot({ path: 'screenshots/billing-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/billing');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/billing-dark.png', fullPage: true });
  });
});
