import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Landing page', () => {
  test('leads with what the product does', async ({ page }) => {
    await page.goto('/home');
    await waitForHydration(page);

    await expect(
      page.getByRole('heading', { name: 'Ship services, not tickets' }),
    ).toBeVisible();
    await expect(
      page.getByRole('listbox', { name: 'Main navigation' }),
    ).toHaveCount(0);
  });

  test('offers signing up and looking around', async ({ page }) => {
    await page.goto('/home');
    await waitForHydration(page);

    await expect(page.getByRole('link', { name: 'Start free' })).toHaveAttribute(
      'href',
      /\/signup$/,
    );
    await expect(
      page.getByRole('link', { name: 'See the dashboard' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open the demo' })).toBeVisible();
  });

  test('every claim on it is checkable in the demo', async ({ page }) => {
    await page.goto('/home');
    await waitForHydration(page);

    await expect(page.getByText(/Every page in this site is the real UI/)).toBeVisible();
    await expect(page.getByText(/Nothing\s+here is a real product/)).toBeVisible();
  });

  test('lists the four things the platform does', async ({ page }) => {
    await page.goto('/home');
    await waitForHydration(page);

    for (const title of [
      'A catalog that stays true',
      'Deploys with the approvals built in',
      'On-call that knows who owns what',
      'Numbers you can act on',
    ]) {
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
    }
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/home');
    await settle(page);
    await page.screenshot({ path: 'screenshots/home-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/home');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/home-dark.png', fullPage: true });
  });
});
