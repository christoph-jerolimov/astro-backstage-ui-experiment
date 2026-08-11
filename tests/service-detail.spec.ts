import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Service detail', () => {
  test('is reachable from the catalog', async ({ page }) => {
    await page.goto('/services');
    await waitForHydration(page);

    await page.getByRole('link', { name: 'catalog-api' }).click();
    await page.waitForURL('**/services/catalog-api');
    await expect(
      page.getByRole('heading', { name: 'catalog-api', exact: true }),
    ).toBeVisible();

    // Services stays the current section in the sidebar
    await expect(
      page.getByRole('option', { name: 'Services' }),
    ).toHaveAttribute('aria-selected', 'true');
  });

  test('has a page per service', async ({ page }) => {
    for (const name of ['search-indexer', 'auth-gateway', 'metrics-collector']) {
      await page.goto(`/services/${name}`);
      await waitForHydration(page);
      await expect(
        page.getByRole('heading', { name, exact: true }),
      ).toBeVisible();
    }
  });

  test('tabs switch the panel', async ({ page }) => {
    await page.goto('/services/catalog-api');
    await waitForHydration(page);

    await expect(page.getByRole('tab')).toHaveCount(3);
    await expect(page.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await page.getByRole('tab', { name: 'Deployments' }).click();
    await expect(
      page.getByRole('grid', { name: 'catalog-api deployments' }),
    ).toBeVisible();
    await expect(page.getByText('dep-8842')).toBeVisible();

    await page.getByRole('tab', { name: 'Incidents' }).click();
    await expect(page.getByText('Cold-start regression')).toBeVisible();
  });

  test('shows an empty state when a service has no incidents', async ({
    page,
  }) => {
    await page.goto('/services/metrics-collector');
    await waitForHydration(page);

    await page.getByRole('tab', { name: 'Incidents' }).click();
    await expect(
      page.getByText('No incidents have been raised for this service.'),
    ).toBeVisible();
  });

  test('the breadcrumb goes back to the catalog', async ({ page }) => {
    await page.goto('/services/catalog-api');
    await waitForHydration(page);

    await page.getByRole('navigation', { name: 'Breadcrumb' })
      .getByRole('link', { name: 'Services' })
      .click();
    await page.waitForURL('**/services');
    await expect(
      page.getByRole('heading', { name: 'Services', exact: true }),
    ).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/services/catalog-api');
    await settle(page);
    await page.screenshot({
      path: 'screenshots/service-detail-light.png',
      fullPage: true,
    });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/services/catalog-api');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({
      path: 'screenshots/service-detail-dark.png',
      fullPage: true,
    });
  });
});
