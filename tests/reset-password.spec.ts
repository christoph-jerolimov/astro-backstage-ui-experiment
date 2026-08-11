import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Reset password', () => {
  test('states the rules before you type anything', async ({ page }) => {
    await page.goto('/reset-password');
    await waitForHydration(page);

    await expect(
      page.getByRole('heading', { name: 'Set a new password' }),
    ).toBeVisible();
    for (const rule of [
      'At least 8 characters',
      'Upper and lower case',
      'A number or symbol',
    ]) {
      await expect(page.getByText(rule)).toBeVisible();
    }
  });

  test('the rules tick off as the password satisfies them', async ({ page }) => {
    await page.goto('/reset-password');
    await waitForHydration(page);

    const rule = (text: string) =>
      page.locator('.rule-list li').filter({ hasText: text });

    await page.getByLabel('New password', { exact: true }).fill('shortone');
    await expect(rule('At least 8 characters')).toHaveAttribute('data-met', 'true');
    await expect(rule('Upper and lower case')).toHaveAttribute('data-met', 'false');

    await page.getByLabel('New password', { exact: true }).fill('Shortone1');
    await expect(rule('Upper and lower case')).toHaveAttribute('data-met', 'true');
    await expect(rule('A number or symbol')).toHaveAttribute('data-met', 'true');
  });

  test('names the first unmet rule rather than a generic complaint', async ({
    page,
  }) => {
    await page.goto('/reset-password');
    await waitForHydration(page);

    await page.getByLabel('New password', { exact: true }).fill('short');
    await page.getByRole('button', { name: 'Change password' }).click();
    await expect(page.getByRole('alert')).toHaveText(
      'Password still needs: at least 8 characters.',
    );
  });

  test('refuses a mismatched confirmation', async ({ page }) => {
    await page.goto('/reset-password');
    await waitForHydration(page);

    await page.getByLabel('New password', { exact: true }).fill('Sturdier1!');
    await page.getByLabel('Confirm new password').fill('Sturdier2!');
    await page.getByRole('button', { name: 'Change password' }).click();

    await expect(page.getByRole('alert')).toHaveText(
      'The two passwords do not match.',
    );
  });

  test('a matching pair changes the password and offers sign in', async ({
    page,
  }) => {
    await page.goto('/reset-password');
    await waitForHydration(page);

    await page.getByLabel('New password', { exact: true }).fill('Sturdier1!');
    await page.getByLabel('Confirm new password').fill('Sturdier1!');
    await page.getByRole('button', { name: 'Change password' }).click();

    await expect(
      page.getByRole('heading', { name: 'Password changed' }),
    ).toBeVisible();
    await expect(page.getByText(/signed out everywhere else/)).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/reset-password');
    await settle(page);
    await page.screenshot({
      path: 'screenshots/reset-password-light.png',
      fullPage: true,
    });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/reset-password');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({
      path: 'screenshots/reset-password-dark.png',
      fullPage: true,
    });
  });
});
