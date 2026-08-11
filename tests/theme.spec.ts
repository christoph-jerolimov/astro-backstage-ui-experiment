import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('renders the light theme with sidebar, header, charts and table', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'light');
    await expect(
      page.getByRole('heading', { name: 'Platform overview' }),
    ).toBeVisible();

    // sidebar navigation (react-aria ListBox)
    const nav = page.getByRole('listbox', { name: 'Main navigation' });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('option')).toHaveCount(5);
    await nav.getByRole('option', { name: 'Deployments' }).click();
    await expect(
      nav.getByRole('option', { name: 'Deployments' }),
    ).toHaveAttribute('aria-selected', 'true');

    // KPI row and charts
    await expect(page.getByText('Deployments (7d)')).toBeVisible();
    await expect(
      page.getByRole('img', { name: 'Deployments per day by environment' }),
    ).toBeVisible();
    await expect(
      page.getByRole('img', { name: 'Build minutes per day' }),
    ).toBeVisible();
    await expect(
      page.getByRole('img', { name: 'Fleet by language' }),
    ).toBeVisible();

    // services table
    const table = page.getByRole('grid', { name: 'Services' });
    await expect(table).toBeVisible();
    await expect(table.getByText('catalog-api')).toBeVisible();
    await expect(table.getByText('Degraded')).toBeVisible();

    await page.screenshot({
      path: 'screenshots/light-theme.png',
      fullPage: true,
    });
  });

  test('line chart shows a tooltip with every series on hover', async ({
    page,
  }) => {
    await page.goto('/');

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

    await page.getByRole('button', { name: /Date range/ }).click();
    await page.getByRole('option', { name: 'Last 7 days' }).click();

    // 7 data points -> every x label rendered, first one is Aug 5
    const chart = page.getByRole('img', {
      name: 'Deployments per day by environment',
    });
    await expect(chart.getByText('Aug 5')).toBeVisible();
    await expect(chart.getByText('Aug 11')).toBeVisible();
  });

  test('switches to the dark theme', async ({ page }) => {
    await page.goto('/');

    await page.locator('label', { hasText: 'Dark mode' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await expect(page.getByRole('switch')).toBeChecked();

    await expect(
      page.getByRole('heading', { name: 'Platform overview' }),
    ).toBeVisible();

    await page.screenshot({
      path: 'screenshots/dark-theme.png',
      fullPage: true,
    });
  });
});
