import { test, expect } from '@playwright/test';
import { waitForHydration } from './helpers';

// Backstage UI's Alert renders no role attribute, so it cannot be found by
// role; target it by its component class instead.
const banner = (page: import('@playwright/test').Page) =>
  page.locator('.bui-Alert');

test.describe('Notifications', () => {
  test('lists the inbox with an unread summary', async ({ page }) => {
    await page.goto('/notifications');
    await waitForHydration(page);

    await expect(banner(page)).toContainText('3 unread notifications');
    await expect(page.getByText('6 shown · 3 unread')).toBeVisible();
    await expect(
      page.getByText('INC-241 opened on notification-hub'),
    ).toBeVisible();
  });

  test('filters by kind', async ({ page }) => {
    await page.goto('/notifications');
    await waitForHydration(page);

    await page.getByRole('radio', { name: 'Mentions' }).click();
    await expect(page.getByText('1 shown · 3 unread')).toBeVisible();
    await expect(page.getByText('Grace mentioned you in INC-240')).toBeVisible();
    await expect(
      page.getByText('catalog-api v2.14.0 reached production'),
    ).toHaveCount(0);

    await page.getByRole('radio', { name: 'Deploys' }).click();
    await expect(page.getByText('3 shown · 3 unread')).toBeVisible();
  });

  test('marking all read clears the banner', async ({ page }) => {
    await page.goto('/notifications');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'Mark all read' }).click();
    await expect(banner(page)).toHaveCount(0);
    await expect(page.getByText('6 shown · 0 unread')).toBeVisible();
  });
});
