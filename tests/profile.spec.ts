import { test, expect } from '@playwright/test';
import { clickAndNavigate, settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Profile', () => {
  test('is reachable from the account menu', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'Account menu' }).click();
    await clickAndNavigate(
      page,
      page.getByRole('menuitem', { name: 'Profile' }),
      /\/profile$/,
    );
    await expect(
      page.getByRole('heading', { name: 'Profile', exact: true }),
    ).toBeVisible();
  });

  test('the account menu lists the off-nav destinations', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'Account menu' }).click();
    const menu = page.getByRole('menu');
    await expect(menu.getByRole('menuitem')).toHaveCount(3);
    await expect(menu.getByRole('menuitem', { name: 'API keys' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Sign out' })).toBeVisible();
  });

  test('tabs switch between details, notifications and sessions', async ({
    page,
  }) => {
    await page.goto('/profile');
    await waitForHydration(page);

    await expect(page.getByRole('tab')).toHaveCount(3);
    await expect(page.getByRole('textbox', { name: 'Display name' })).toBeVisible();

    await page.getByRole('tab', { name: 'Notifications' }).click();
    await expect(page.getByText('A weekly platform digest')).toBeVisible();

    await page.getByRole('tab', { name: 'Sessions' }).click();
    await expect(page.getByText('Acme Mobile · iOS')).toBeVisible();
    // the current session cannot be revoked
    await expect(page.getByRole('button', { name: 'Current' })).toBeDisabled();
  });

  test('saving the profile confirms', async ({ page }) => {
    await page.goto('/profile');
    await waitForHydration(page);

    await expect(page.getByText('Changes are not saved yet.')).toBeVisible();
    await page.getByRole('textbox', { name: 'Display name' }).fill('Ada L.');
    await page.getByRole('button', { name: 'Save profile' }).click();
    await expect(page.getByText('Profile saved.')).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/profile');
    await settle(page);
    await page.screenshot({ path: 'screenshots/profile-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/profile');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/profile-dark.png', fullPage: true });
  });
});
