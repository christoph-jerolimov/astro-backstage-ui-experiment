import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Pricing', () => {
  test('stands outside the app shell', async ({ page }) => {
    await page.goto('/pricing');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'Pricing' })).toBeVisible();
    await expect(
      page.getByRole('listbox', { name: 'Main navigation' }),
    ).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });

  test('every plan sends you to sign in', async ({ page }) => {
    await page.goto('/pricing');
    await waitForHydration(page);

    for (const name of ['Start free', 'Choose Team', 'Choose Enterprise']) {
      await expect(page.getByRole('link', { name })).toHaveAttribute(
        'href',
        /\/signin$/,
      );
    }
  });

  test('lists three plans with the popular one marked', async ({ page }) => {
    await page.goto('/pricing');
    await waitForHydration(page);

    for (const plan of ['Starter', 'Team', 'Enterprise']) {
      await expect(
        page.getByRole('heading', { name: plan, exact: true }),
      ).toBeVisible();
    }
    await expect(page.getByText('Most popular')).toBeVisible();
    // the starter plan costs nothing — "Free" also appears on its button,
    // so match the price element rather than the text.
    await expect(page.locator('.price', { hasText: /^Free$/ })).toBeVisible();
  });

  test('the yearly toggle changes the prices', async ({ page }) => {
    await page.goto('/pricing');
    await waitForHydration(page);

    await expect(page.locator('.price', { hasText: '$40' })).toBeVisible();
    await expect(page.getByText('per developer, per month').first()).toBeVisible();

    await page.locator('label', { hasText: 'Bill yearly' }).click();

    // 40 * 12 with 20% off
    await expect(page.locator('.price', { hasText: '$384' })).toBeVisible();
    await expect(page.getByText('per developer, per year').first()).toBeVisible();
    // the free plan stays free
    await expect(page.locator('.price', { hasText: /^Free$/ })).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/pricing');
    await settle(page);
    await page.screenshot({ path: 'screenshots/pricing-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/pricing');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/pricing-dark.png', fullPage: true });
  });
});
