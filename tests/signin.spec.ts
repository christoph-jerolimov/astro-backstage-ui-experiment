import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Sign in', () => {
  test('stands outside the app shell', async ({ page }) => {
    await page.goto('/signin');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    // no sidebar on this layout
    await expect(
      page.getByRole('listbox', { name: 'Main navigation' }),
    ).toHaveCount(0);
    // but the theme toggle still works here
    await expect(page.getByRole('switch', { name: 'Dark mode' })).toBeVisible();
    // the only way into the pricing page from inside the demo
    await expect(page.getByRole('link', { name: 'See pricing' })).toHaveAttribute(
      'href',
      /\/pricing$/,
    );
  });

  test('validates the email before the password', async ({ page }) => {
    await page.goto('/signin');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('alert')).toHaveText(
      'Enter a valid email address.',
    );

    await page.getByRole('textbox', { name: 'Email' }).fill('ada@acme.cloud');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('alert')).toHaveText(
      'Passwords are at least 8 characters.',
    );
  });

  test('signs in and lands on the overview', async ({ page }) => {
    await page.goto('/signin');
    await waitForHydration(page);

    await page.getByRole('textbox', { name: 'Email' }).fill('ada@acme.cloud');
    await page.getByLabel('Password', { exact: true }).fill('hunter2hunter2');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.waitForURL(/\/$/);
    await expect(
      page.getByRole('heading', { name: 'Platform overview', exact: true }),
    ).toBeVisible();
  });

  test('the password is masked and can be revealed', async ({ page }) => {
    await page.goto('/signin');
    await waitForHydration(page);

    const field = page.getByLabel('Password', { exact: true });
    await field.fill('hunter2hunter2');
    await expect(field).toHaveAttribute('type', 'password');
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/signin');
    await settle(page);
    await page.screenshot({ path: 'screenshots/signin-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/signin');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/signin-dark.png', fullPage: true });
  });
});
