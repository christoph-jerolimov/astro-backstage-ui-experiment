import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Organizations', () => {
  test('lists every workspace and marks the current one', async ({ page }) => {
    await page.goto('/organizations');
    await waitForHydration(page);

    await expect(
      page.getByRole('heading', { name: 'Organizations', exact: true }),
    ).toBeVisible();
    for (const name of ['Acme Cloud', 'Acme Labs', 'Northwind Platform']) {
      await expect(page.getByText(name).first()).toBeVisible();
    }
    await expect(
      page.locator('.workspace-row[data-current="true"]'),
    ).toContainText('Acme Cloud');
  });

  test('says what your role is in each one', async ({ page }) => {
    await page.goto('/organizations');
    await waitForHydration(page);

    await expect(
      page.locator('.workspace-row').filter({ hasText: 'Northwind Platform' }),
    ).toContainText('You are Read only');
  });

  test('switching changes which one is current', async ({ page }) => {
    await page.goto('/organizations');
    await waitForHydration(page);

    const row = page.locator('.workspace-row').filter({ hasText: 'Acme Labs' });
    await row.getByRole('button', { name: 'Switch' }).click();

    await expect(
      page.locator('.workspace-row[data-current="true"]'),
    ).toContainText('Acme Labs');
    // the one you are in cannot be switched to
    await expect(row.getByRole('button', { name: 'Open' })).toBeDisabled();
  });

  test('the switcher menu groups by whether a new session is needed', async ({
    page,
  }) => {
    await page.goto('/organizations');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'Acme Cloud' }).click();
    const menu = page.getByRole('menu');
    await expect(menu.getByText('Signed in')).toBeVisible();
    await expect(menu.getByText('Needs a new session')).toBeVisible();
  });

  test('creating a workspace opens a submenu of ways to start', async ({
    page,
  }) => {
    await page.goto('/organizations');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'Acme Cloud' }).click();
    await page.getByRole('menuitem', { name: 'Create a workspace' }).click();

    await expect(
      page.getByRole('menuitem', { name: 'Copy Acme Cloud settings' }),
    ).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/organizations');
    await settle(page);
    await page.screenshot({
      path: 'screenshots/organizations-light.png',
      fullPage: true,
    });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/organizations');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({
      path: 'screenshots/organizations-dark.png',
      fullPage: true,
    });
  });
});
