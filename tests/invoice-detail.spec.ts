import { test, expect } from '@playwright/test';
import { clickAndNavigate, settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Invoice detail', () => {
  test('has a page per invoice', async ({ page }) => {
    await page.goto('/billing/invoices/INV-2026-07');
    await waitForHydration(page);

    await expect(
      page.getByRole('heading', { name: 'INV-2026-07', exact: true }),
    ).toBeVisible();
    await expect(page.getByText('July 2026')).toBeVisible();
  });

  test('adds up the lines, the VAT and the total', async ({ page }) => {
    await page.goto('/billing/invoices/INV-2026-07');
    await waitForHydration(page);

    // 7 seats at $40 = $280, plus 1,750 minutes at $0.008 = $14
    await expect(page.getByRole('row', { name: /Subtotal/ })).toContainText('$294.00');
    await expect(page.getByRole('row', { name: /VAT at 20%/ })).toContainText('$58.80');
    await expect(page.getByRole('row', { name: /Total/ })).toContainText('$352.80');
  });

  test('a failed invoice explains what happens next', async ({ page }) => {
    await page.goto('/billing/invoices/INV-2026-05');
    await waitForHydration(page);

    await expect(page.getByText(/card was declined/)).toBeVisible();
    // the reassurance matters as much as the error
    await expect(page.getByText(/Nothing was\s+suspended/)).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Update payment method' }),
    ).toBeVisible();
  });

  test('a paid invoice shows no payment warning', async ({ page }) => {
    await page.goto('/billing/invoices/INV-2026-06');
    await waitForHydration(page);

    await expect(page.getByText(/card was declined/)).toHaveCount(0);
    await expect(page.getByText('Paid')).toBeVisible();
  });

  test('the breadcrumb goes back to the list', async ({ page }) => {
    await page.goto('/billing/invoices/INV-2026-07');
    await waitForHydration(page);

    await clickAndNavigate(
      page,
      page.getByRole('link', { name: 'Invoices' }),
      /\/billing\/invoices$/,
    );
  });

  test('offers printing, since that is why receipts get opened', async ({
    page,
  }) => {
    await page.goto('/billing/invoices/INV-2026-07');
    await waitForHydration(page);

    await expect(page.getByRole('button', { name: 'Print' })).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/billing/invoices/INV-2026-05');
    await settle(page);
    await page.screenshot({
      path: 'screenshots/invoice-detail-light.png',
      fullPage: true,
    });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/billing/invoices/INV-2026-05');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({
      path: 'screenshots/invoice-detail-dark.png',
      fullPage: true,
    });
  });
});
