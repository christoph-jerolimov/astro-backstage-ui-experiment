import { test, expect } from '@playwright/test';
import {
  settle,
  tickCheckbox,
  useDarkTheme,
  waitForHydration,
} from './helpers';

test.describe('Sign up', () => {
  test('stands outside the app shell', async ({ page }) => {
    await page.goto('/signup');
    await waitForHydration(page);

    await expect(
      page.getByRole('heading', { name: 'Create an account' }),
    ).toBeVisible();
    await expect(
      page.getByRole('listbox', { name: 'Main navigation' }),
    ).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      /\/signin$/,
    );
  });

  test('validates the fields in the order they are asked for', async ({
    page,
  }) => {
    await page.goto('/signup');
    await waitForHydration(page);

    const submit = page.getByRole('button', { name: 'Create account' });
    const error = page.getByRole('alert');

    await submit.click();
    await expect(error).toHaveText('We need a name to put on the account.');

    await page.getByRole('textbox', { name: 'Your name' }).fill('Ada Lovelace');
    await submit.click();
    await expect(error).toHaveText('Enter a valid work email address.');

    await page.getByRole('textbox', { name: 'Work email' }).fill('ada@gmail.com');
    await submit.click();
    await expect(error).toContainText('Use your work address');

    await page.getByRole('textbox', { name: 'Work email' }).fill('ada@acme.cloud');
    await submit.click();
    await expect(error).toContainText('Your workspace needs a name');

    await page.getByRole('textbox', { name: 'Workspace name' }).fill('Acme');
    await submit.click();
    await expect(error).toHaveText('Passwords are at least 8 characters.');
  });

  test('the password meter says how strong it is in words', async ({ page }) => {
    await page.goto('/signup');
    await waitForHydration(page);

    const password = page.getByLabel('Password', { exact: true });

    await password.fill('short');
    await expect(page.getByText('Too short')).toBeVisible();

    await password.fill('lowercaseonly');
    await expect(page.getByText('Weak')).toBeVisible();

    await password.fill('Sturdier1!passphrase');
    await expect(page.getByText('Strong')).toBeVisible();
  });

  test('a complete form needs the terms before it will go on', async ({
    page,
  }) => {
    await page.goto('/signup');
    await waitForHydration(page);

    await page.getByRole('textbox', { name: 'Your name' }).fill('Ada Lovelace');
    await page.getByRole('textbox', { name: 'Work email' }).fill('ada@acme.cloud');
    await page.getByRole('textbox', { name: 'Workspace name' }).fill('Acme');
    await page.getByLabel('Password', { exact: true }).fill('correct horse');

    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByRole('alert')).toContainText('accept the terms');

    await tickCheckbox(page, /accept the terms/);
    await page.getByRole('button', { name: 'Create account' }).click();

    // signing up leaves you where a real one would: waiting on an email
    await expect(
      page.getByRole('heading', { name: 'Check your inbox' }),
    ).toBeVisible();
    await expect(page.getByText('ada@acme.cloud')).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/signup');
    await settle(page);
    await page.screenshot({ path: 'screenshots/signup-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/signup');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/signup-dark.png', fullPage: true });
  });
});
