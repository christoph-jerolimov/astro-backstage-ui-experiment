import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Invoices', () => {
  test('lists invoices with totals and status', async ({ page }) => {
    await page.goto('/billing/invoices');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'Invoices', exact: true })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'INV-2026-08' })).toBeVisible();
    // 8 seats at $40 plus 2,400 build minutes at $0.008
    const row = (id: string) =>
      page.getByRole('grid').getByRole('row').filter({ hasText: id });
    await expect(row('INV-2026-08')).toContainText('$339.20');
    await expect(row('INV-2026-05')).toContainText('Failed');
  });

  test('pages through them five at a time', async ({ page }) => {
    await page.goto('/billing/invoices');
    await waitForHydration(page);

    const rows = page.getByRole('grid').getByRole('row');
    await expect(rows).toHaveCount(6); // header plus five

    await page.getByRole('button', { name: 'Next table page' }).click();
    await expect(page.getByRole('rowheader', { name: 'INV-2026-01' })).toBeVisible();
  });

  test('rows link through to the invoice itself', async ({ page }) => {
    await page.goto('/billing/invoices');
    await waitForHydration(page);

    await expect(
      page.getByRole('link', { name: 'INV-2026-07' }),
    ).toHaveAttribute('href', /\/billing\/invoices\/INV-2026-07$/);
  });

  test('the date range narrows the list', async ({ page }) => {
    await page.goto('/billing/invoices');
    await waitForHydration(page);

    // the range picker is three spinbuttons per end, each labelled
    // "<segment>, Start Date," by react-aria
    const segment = (label: string) =>
      page.getByRole('spinbutton', { name: label });
    await segment('month, Start Date, ').fill('7');
    await segment('day, Start Date, ').fill('1');
    await segment('year, Start Date, ').fill('2026');
    await segment('month, End Date, ').fill('8');
    await segment('day, End Date, ').fill('31');
    await segment('year, End Date, ').fill('2026');

    await expect(page.getByText('2 of 8')).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'INV-2026-06' })).toHaveCount(0);
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/billing/invoices');
    await settle(page);
    await page.screenshot({ path: 'screenshots/invoices-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/billing/invoices');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/invoices-dark.png', fullPage: true });
  });
});
