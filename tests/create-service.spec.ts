import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Create a service', () => {
  test('will not advance without a name', async ({ page }) => {
    await page.goto('/services/new');
    await waitForHydration(page);

    await expect(page.getByText('Step').first()).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('alert')).toHaveText('A service needs a name.');
  });

  test('rejects a name that is already taken', async ({ page }) => {
    await page.goto('/services/new');
    await waitForHydration(page);

    await page.getByRole('textbox', { name: 'Service name' }).fill('catalog-api');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('alert')).toContainText(
      'There is already a service called catalog-api',
    );
  });

  test('walks through all three steps and creates the service', async ({
    page,
  }) => {
    await page.goto('/services/new');
    await waitForHydration(page);

    // step 1
    await page.getByRole('textbox', { name: 'Service name' }).fill('payments-api');
    await page.getByRole('textbox', { name: 'Description' }).fill('Takes money.');
    await page.getByRole('button', { name: 'Continue' }).click();

    // step 2
    await expect(page.getByRole('heading', { name: 'Runtime' })).toBeVisible();
    await page.locator('label', { hasText: 'Canary' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // step 3 shows what was entered
    await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible();
    await expect(page.getByText('payments-api')).toBeVisible();
    await expect(page.getByText('Takes money.')).toBeVisible();
    await expect(page.getByText('canary')).toBeVisible();

    await page.getByRole('button', { name: 'Create service' }).click();
    await expect(
      page.getByRole('heading', { name: 'Service created' }),
    ).toBeVisible();
  });

  test('can step back without losing what was entered', async ({ page }) => {
    await page.goto('/services/new');
    await waitForHydration(page);

    await page.getByRole('textbox', { name: 'Service name' }).fill('payments-api');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Back' }).click();

    await expect(
      page.getByRole('textbox', { name: 'Service name' }),
    ).toHaveValue('payments-api');
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/services/new');
    await settle(page);
    await page.screenshot({
      path: 'screenshots/create-service-light.png',
      fullPage: true,
    });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/services/new');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({
      path: 'screenshots/create-service-dark.png',
      fullPage: true,
    });
  });
});
