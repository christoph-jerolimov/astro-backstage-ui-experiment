import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Forgot password', () => {
  test('asks for the address on the account', async ({ page }) => {
    await page.goto('/forgot-password');
    await waitForHydration(page);

    await expect(
      page.getByRole('heading', { name: 'Forgot your password?' }),
    ).toBeVisible();
    await expect(
      page.getByRole('listbox', { name: 'Main navigation' }),
    ).toHaveCount(0);

    await page.getByRole('button', { name: 'Send reset link' }).click();
    await expect(page.getByRole('alert')).toHaveText(
      'Enter the email address on the account.',
    );
  });

  test('confirms without saying whether the account exists', async ({
    page,
  }) => {
    await page.goto('/forgot-password');
    await waitForHydration(page);

    await page.getByRole('textbox', { name: 'Email address' }).fill('nobody@acme.cloud');
    await page.getByRole('button', { name: 'Send reset link' }).click();

    await expect(
      page.getByRole('heading', { name: 'Check your inbox' }),
    ).toBeVisible();
    // the hedge is the point: it must not confirm the address is registered
    await expect(page.getByText(/If nobody@acme.cloud has an account/)).toBeVisible();
  });

  test('you can go back and use a different address', async ({ page }) => {
    await page.goto('/forgot-password');
    await waitForHydration(page);

    await page.getByRole('textbox', { name: 'Email address' }).fill('ada@acme.cloud');
    await page.getByRole('button', { name: 'Send reset link' }).click();
    await page.getByRole('button', { name: 'Use a different address' }).click();

    await expect(
      page.getByRole('textbox', { name: 'Email address' }),
    ).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/forgot-password');
    await settle(page);
    await page.screenshot({
      path: 'screenshots/forgot-password-light.png',
      fullPage: true,
    });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/forgot-password');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({
      path: 'screenshots/forgot-password-dark.png',
      fullPage: true,
    });
  });
});
