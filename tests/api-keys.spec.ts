import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('API keys', () => {
  test('lists keys with the secret masked', async ({ page }) => {
    await page.goto('/api-keys');
    await waitForHydration(page);

    await expect(page.getByRole('grid', { name: 'API keys' })).toBeVisible();
    await expect(page.getByText('CI pipeline')).toBeVisible();
    // only the prefix is ever shown for an existing key
    await expect(page.getByText(/acm_live_8f2c•+/)).toBeVisible();
  });

  test('creating a key reveals the value once', async ({ page }) => {
    await page.goto('/api-keys');
    await waitForHydration(page);

    await page.getByRole('textbox', { name: 'Key name' }).fill('Release bot');
    await page.getByRole('button', { name: 'Create key' }).click();

    await expect(page.getByText('Copy your new key now')).toBeVisible();
    await expect(page.locator('.secret')).toContainText('SECRETVALUEONLYSHOWNONCE');
    await expect(page.getByText('Release bot')).toBeVisible();

    await page.getByRole('button', { name: 'Done' }).click();
    await expect(page.getByText('Copy your new key now')).toHaveCount(0);
  });

  test('revoking asks for confirmation first', async ({ page }) => {
    await page.goto('/api-keys');
    await waitForHydration(page);

    await page
      .getByRole('row', { name: /Terraform/ })
      .getByRole('button', { name: 'Revoke' })
      .click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Revoke Terraform?')).toBeVisible();

    // cancelling leaves the key alone
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByText('Terraform')).toBeVisible();

    // confirming removes it
    await page
      .getByRole('row', { name: /Terraform/ })
      .getByRole('button', { name: 'Revoke' })
      .click();
    await page.getByRole('dialog').getByRole('button', { name: 'Revoke key' }).click();
    await expect(page.getByText('Terraform')).toHaveCount(0);
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/api-keys');
    await settle(page);
    await page.screenshot({ path: 'screenshots/api-keys-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/api-keys');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/api-keys-dark.png', fullPage: true });
  });
});
