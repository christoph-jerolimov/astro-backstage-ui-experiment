import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

const box = (page: import('@playwright/test').Page, n: number) =>
  page.getByRole('textbox', { name: `Digit ${n} of 6` });

test.describe('Verify code', () => {
  test('shows six boxes and asks for all of them', async ({ page }) => {
    await page.goto('/verify');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'Enter the code' })).toBeVisible();
    await expect(page.locator('.code-boxes input')).toHaveCount(6);

    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByRole('alert')).toHaveText('Enter all six digits.');
  });

  test('typing moves forward and backspace steps back', async ({ page }) => {
    await page.goto('/verify');
    await waitForHydration(page);

    await box(page, 1).click();
    await page.keyboard.type('31');
    await expect(box(page, 1)).toHaveValue('3');
    await expect(box(page, 2)).toHaveValue('1');
    await expect(box(page, 3)).toBeFocused();

    await page.keyboard.press('Backspace');
    // an empty box sends backspace to the previous one
    await expect(box(page, 2)).toHaveValue('');
    await expect(box(page, 2)).toBeFocused();
  });

  test('the whole code can go into the first box at once', async ({ page }) => {
    await page.goto('/verify');
    await waitForHydration(page);

    await box(page, 1).fill('314159');

    await expect(box(page, 1)).toHaveValue('3');
    await expect(box(page, 6)).toHaveValue('9');
  });

  test('a wrong code is refused and the boxes are cleared', async ({ page }) => {
    await page.goto('/verify');
    await waitForHydration(page);

    await box(page, 1).fill('000000');
    await page.getByRole('button', { name: 'Verify' }).click();

    await expect(page.getByRole('alert')).toHaveText(
      'That code is wrong or has expired.',
    );
    await expect(box(page, 1)).toHaveValue('');
    await expect(box(page, 1)).toBeFocused();
  });

  test('the right code verifies the account', async ({ page }) => {
    await page.goto('/verify');
    await waitForHydration(page);

    await box(page, 1).fill('314159');
    await page.getByRole('button', { name: 'Verify' }).click();

    await expect(page.getByRole('heading', { name: 'You are verified' })).toBeVisible();
  });

  test('resending is held back until the countdown runs out', async ({ page }) => {
    await page.goto('/verify');
    await waitForHydration(page);

    await expect(page.getByText(/You can ask for another code in \d+s/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Send another code' })).toHaveCount(0);
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/verify');
    await settle(page);
    await page.screenshot({ path: 'screenshots/verify-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/verify');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/verify-dark.png', fullPage: true });
  });
});
