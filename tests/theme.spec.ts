import { test, expect } from '@playwright/test';

test.describe('Backstage UI page themes', () => {
  test('renders the light theme and is interactive', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'light');
    await expect(
      page.getByRole('heading', { name: 'Astro × Backstage UI' }),
    ).toBeVisible();

    await page.getByLabel('Your name').fill('Ada Lovelace');
    await page.getByRole('button', { name: 'Greet' }).click();
    await expect(page.getByText('Hello, Ada Lovelace!')).toBeVisible();

    await page.screenshot({
      path: 'screenshots/light-theme.png',
      fullPage: true,
    });
  });

  test('switches to the dark theme', async ({ page }) => {
    await page.goto('/');

    await page.locator('label', { hasText: 'Dark mode' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await expect(page.getByRole('switch')).toBeChecked();

    await page.getByLabel('Your name').fill('Grace Hopper');
    await page.getByRole('button', { name: 'Greet' }).click();
    await expect(page.getByText('Hello, Grace Hopper!')).toBeVisible();

    await page.screenshot({
      path: 'screenshots/dark-theme.png',
      fullPage: true,
    });
  });
});
