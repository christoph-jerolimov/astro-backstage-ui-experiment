import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Messages', () => {
  test('opens on the first conversation', async ({ page }) => {
    await page.goto('/messages');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'Messages', exact: true })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'INC-241 · notification-hub' }),
    ).toBeVisible();
    await expect(page.getByText(/Opening a SEV1/)).toBeVisible();
  });

  test('switching conversations swaps the thread', async ({ page }) => {
    await page.goto('/messages');
    await waitForHydration(page);

    await page.getByRole('button', { name: /team-atlas/ }).click();

    await expect(page.getByText(/Cache work is ready for review/)).toBeVisible();
    await expect(page.getByText(/Opening a SEV1/)).toHaveCount(0);
  });

  test('sending adds the message to the thread', async ({ page }) => {
    await page.goto('/messages');
    await waitForHydration(page);

    await page.getByRole('textbox', { name: 'Message' }).fill('Writing the postmortem now.');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText('Writing the postmortem now.')).toBeVisible();
    await expect(page.getByText('Just now')).toBeVisible();
    // the box is cleared, so the next message does not start with the last
    await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue('');
  });

  test('an empty message cannot be sent', async ({ page }) => {
    await page.goto('/messages');
    await waitForHydration(page);

    await expect(page.getByRole('button', { name: 'Send' })).toBeDisabled();
    await page.getByRole('textbox', { name: 'Message' }).fill('   ');
    await expect(page.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  test('a draft survives switching away and back', async ({ page }) => {
    await page.goto('/messages');
    await waitForHydration(page);

    await page.getByRole('textbox', { name: 'Message' }).fill('Half a thought');
    await page.getByRole('button', { name: /team-atlas/ }).click();
    await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue('');

    await page.getByRole('button', { name: /INC-241/ }).click();
    await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue(
      'Half a thought',
    );
  });

  test('unread counts are shown per conversation', async ({ page }) => {
    await page.goto('/messages');
    await waitForHydration(page);

    await expect(page.getByText('2 new')).toBeVisible();
    await expect(page.getByText('1 new')).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/messages');
    await settle(page);
    await page.screenshot({ path: 'screenshots/messages-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/messages');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/messages-dark.png', fullPage: true });
  });
});
