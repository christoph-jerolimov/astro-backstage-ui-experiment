import { test, expect } from '@playwright/test';
import {
  clickUntilVisible,
  settle,
  useDarkTheme,
  waitForHydration,
} from './helpers';

const drawer = (page: import('@playwright/test').Page) =>
  page.getByRole('dialog');

/**
 * Rows carry a link in their first cell, so tests click a plain cell: clicking
 * the name is navigation, clicking the row is "tell me about this".
 */
const cell = (
  page: import('@playwright/test').Page,
  row: RegExp,
  text: string,
) => page.getByRole('row', { name: row }).getByRole('gridcell').filter({ hasText: text }).first();

test.describe('Detail drawer', () => {
  test('a deployment row opens its details', async ({ page }) => {
    await page.goto('/deployments');
    await waitForHydration(page);

    await expect(drawer(page)).toHaveCount(0);
    await clickUntilVisible(cell(page, /dep-8842/, 'catalog-api'), drawer(page));

    await expect(drawer(page)).toBeVisible();
    await expect(drawer(page).getByText('Deployment', { exact: true })).toBeVisible();
    await expect(drawer(page).getByRole('heading', { name: 'dep-8842' })).toBeVisible();
    await expect(drawer(page).getByText('v2.14.0')).toBeVisible();
    await expect(drawer(page).getByText('Release approval')).toBeVisible();
  });

  test('escape and the close button both dismiss it', async ({ page }) => {
    await page.goto('/deployments');
    await waitForHydration(page);

    await clickUntilVisible(cell(page, /dep-8842/, 'catalog-api'), drawer(page));
    await expect(drawer(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer(page)).toHaveCount(0);

    await clickUntilVisible(cell(page, /dep-8841/, 'search-indexer'), drawer(page));
    await expect(drawer(page)).toBeVisible();
    await page.getByRole('button', { name: 'Close details' }).click();
    await expect(drawer(page)).toHaveCount(0);
  });

  test('an incident row opens its details', async ({ page }) => {
    await page.goto('/incidents');
    await waitForHydration(page);

    await clickUntilVisible(cell(page, /INC-241/, 'notification-hub'), drawer(page));

    await expect(drawer(page)).toBeVisible();
    await expect(
      drawer(page).getByRole('heading', { name: /INC-241/ }),
    ).toBeVisible();
    await expect(drawer(page).getByText('SEV1')).toBeVisible();
    // a SEV1 has a named commander; lower severities do not
    await expect(drawer(page).getByText('Ada Lovelace')).toBeVisible();
  });

  test('a service row opens its details and links to the full page', async ({
    page,
  }) => {
    await page.goto('/services');
    await waitForHydration(page);

    await clickUntilVisible(cell(page, /catalog-api/, 'team-atlas'), drawer(page));

    await expect(drawer(page)).toBeVisible();
    await expect(
      drawer(page).getByRole('heading', { name: 'catalog-api' }),
    ).toBeVisible();
    await expect(
      drawer(page).getByRole('link', { name: 'Open service page' }),
    ).toHaveAttribute('href', /\/services\/catalog-api$/);
  });

  test('a catalog row opens the same drawer', async ({ page }) => {
    await page.goto('/catalog');
    await waitForHydration(page);

    await clickUntilVisible(cell(page, /catalog-api/, 'team-atlas'), drawer(page));

    await expect(drawer(page)).toBeVisible();
    await expect(drawer(page).getByText('Service', { exact: true })).toBeVisible();
    await expect(
      drawer(page).getByRole('heading', { name: 'catalog-api' }),
    ).toBeVisible();
    await expect(drawer(page).getByText('Uptime (30d)')).toBeVisible();
  });

  test('selecting a catalog row does not open it', async ({ page }) => {
    await page.goto('/catalog');
    await waitForHydration(page);

    // The checkbox lives in its own cell, so pressing it selects rather than
    // opening the row. react-aria hides the real input behind its label, and a
    // press landing right after hydration can be swallowed, so this retries
    // guarded on the checkbox's own state.
    const row = page.getByRole('row', { name: /catalog-api/ });
    const input = row.getByRole('checkbox');
    await expect(async () => {
      if (!(await input.isChecked())) {
        await row.locator('label.bui-Checkbox').click();
      }
      await expect(input).toBeChecked({ timeout: 1000 });
    }).toPass({ timeout: 15000 });

    await expect(page.getByText(/^1 selected$/)).toBeVisible();
    await expect(drawer(page)).toHaveCount(0);
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/deployments');
    await settle(page);
    await clickUntilVisible(cell(page, /dep-8842/, 'catalog-api'), drawer(page));
    await expect(drawer(page)).toBeVisible();
    await page.screenshot({ path: 'screenshots/detail-drawer-light.png' });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/deployments');
    await settle(page);
    await clickUntilVisible(cell(page, /dep-8842/, 'catalog-api'), drawer(page));
    await expect(drawer(page)).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/detail-drawer-dark.png' });
  });
});
