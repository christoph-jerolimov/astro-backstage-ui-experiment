import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('500 page', () => {
  test('says what happened and gives something to quote', async ({ page }) => {
    await page.goto('/500');
    await waitForHydration(page);

    await expect(
      page.getByRole('heading', { name: 'Something went wrong' }),
    ).toBeVisible();
    await expect(page.getByText('500')).toBeVisible();
    // the request id is the reason this page is useful to support
    await expect(page.locator('.request-id code')).toHaveText(/^req_[a-f0-9]+$/);
  });

  test('keeps the shell, unlike the auth pages', async ({ page }) => {
    await page.goto('/500');
    await waitForHydration(page);

    const nav = page.getByRole('listbox', { name: 'Main navigation' });
    await expect(nav).toBeVisible();
    // it is not a nav destination, so nothing is marked current
    await expect(nav.getByRole('option', { selected: true })).toHaveCount(0);
  });

  test('offers a retry and a way out', async ({ page }) => {
    await page.goto('/500');
    await waitForHydration(page);

    await expect(page.getByRole('link', { name: 'Try again' })).toHaveAttribute(
      'href',
      /\/500$/,
    );
    await expect(
      page.getByRole('link', { name: 'Back to overview' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'incidents' })).toHaveAttribute(
      'href',
      /\/incidents$/,
    );
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/500');
    await settle(page);
    await page.screenshot({ path: 'screenshots/500-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/500');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/500-dark.png', fullPage: true });
  });
});
