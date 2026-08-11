import { test, expect } from '@playwright/test';
import { waitForHydration } from './helpers';

test.describe('Charts', () => {
  test('line chart shows a tooltip with every series on hover', async ({
    page,
  }) => {
    await page.goto('/');
    await waitForHydration(page);

    const chart = page.getByRole('application').filter({
      has: page.getByRole('img', {
        name: 'Deployments per day by environment',
      }),
    });
    await chart.hover({ position: { x: 200, y: 80 } });
    await chart.hover({ position: { x: 204, y: 84 } });

    const tooltip = page.locator('.chart-tooltip').first();
    await expect(tooltip).toBeVisible();
    await expect(tooltip.getByText('Production')).toBeVisible();
    await expect(tooltip.getByText('Staging')).toBeVisible();
  });

  test('date range filter rescopes the charts', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.getByRole('button', { name: /Date range/ }).click();
    await page.getByRole('option', { name: 'Last 7 days' }).click();

    const chart = page.getByRole('img', {
      name: 'Deployments per day by environment',
    });
    await expect(chart.getByText('Aug 5')).toBeVisible();
    await expect(chart.getByText('Aug 11')).toBeVisible();
  });
});

test.describe('Services page', () => {
  test('the search field filters the catalog', async ({ page }) => {
    await page.goto('/services');
    await waitForHydration(page);

    const table = page.getByRole('grid', { name: 'Services' });
    await expect(table.getByText('catalog-api')).toBeVisible();
    await expect(table.getByText('billing-worker')).toBeVisible();

    await page.getByRole('searchbox', { name: 'Filter services' }).fill('Go');

    await expect(page.getByText('3 of 6 services')).toBeVisible();
    await expect(table.getByText('search-indexer')).toBeVisible();
    await expect(table.getByText('billing-worker')).toHaveCount(0);
  });

  test('the owner filter narrows the catalog', async ({ page }) => {
    await page.goto('/services');
    await waitForHydration(page);

    await page.getByRole('button', { name: /Owner/ }).click();
    await page.getByRole('option', { name: 'team-signal' }).click();

    await expect(page.getByText('2 of 6 services')).toBeVisible();
  });
});

test.describe('Settings page', () => {
  test('the form saves and resets', async ({ page }) => {
    await page.goto('/settings');
    await waitForHydration(page);

    await expect(page.getByText('Changes are not saved yet.')).toBeVisible();

    await page.getByRole('textbox', { name: 'Workspace name' }).fill('Acme Labs');
    // react-aria wraps the visually-hidden input in its label, so the label is
    // the thing a real user (and Playwright) can actually click.
    await page.locator('label', { hasText: 'Canary' }).click();
    await page.locator('label', { hasText: 'PagerDuty' }).click();
    await expect(page.getByRole('radio', { name: 'Canary' })).toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'PagerDuty' })).toBeChecked();

    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Settings saved.')).toBeVisible();

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.getByText('Changes are not saved yet.')).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: 'Workspace name' }),
    ).toHaveValue('Acme Cloud');
    await expect(page.getByRole('radio', { name: 'Rolling update' })).toBeChecked();
  });
});
