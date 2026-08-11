import { test, expect } from '@playwright/test';
import {
  clickAndNavigate,
  clickUntilAttribute,
  settle,
  useDarkTheme,
  waitForHydration,
} from './helpers';

// Backstage UI's Table does not forward aria-label, so the grid is always
// labelled "Data table"; there is only one on this page.
const grid = (page: import('@playwright/test').Page) => page.getByRole('grid');
const rows = (page: import('@playwright/test').Page) => grid(page).getByRole('row');

test.describe('Catalog table', () => {
  test('pages through the catalog', async ({ page }) => {
    await page.goto('/catalog');
    await waitForHydration(page);

    // header row + 10 data rows on the first page
    await expect(rows(page)).toHaveCount(11);
    await expect(page.getByText('24 of 24 services')).toBeVisible();
    await expect(page.getByText('catalog-api')).toBeVisible();

    await page.getByRole('button', { name: 'Next table page' }).click();
    await expect(page.getByText('catalog-api')).toHaveCount(0);
    await expect(rows(page)).toHaveCount(11);

    await page.getByRole('button', { name: 'Previous table page' }).click();
    await expect(page.getByText('catalog-api')).toBeVisible();
  });

  test('sorts by a column', async ({ page }) => {
    await page.goto('/catalog');
    await waitForHydration(page);

    const firstCell = () => rows(page).nth(1).getByRole('rowheader');
    await expect(firstCell()).toHaveText(/alert-router/);

    const header = page.getByRole('columnheader', { name: 'Service' });
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await clickUntilAttribute(header, 'aria-sort', 'descending');
    await expect(firstCell()).toHaveText(/webhook-dispatcher/);
  });

  test('selects rows and offers bulk actions', async ({ page }) => {
    await page.goto('/catalog');
    await waitForHydration(page);

    // react-aria hides the real input behind its label, so the label is the
    // clickable target (index 0 is the select-all box in the header)
    const boxes = grid(page).locator('label.bui-Checkbox');
    const inputs = grid(page).getByRole('checkbox');

    // A press landing right after hydration can be swallowed, so retry — but
    // guard on the checkbox's own state, because blindly re-clicking a toggle
    // would just switch it back off.
    const select = async (index: number) => {
      await expect(async () => {
        if (!(await inputs.nth(index).isChecked())) {
          await boxes.nth(index).click();
        }
        await expect(inputs.nth(index)).toBeChecked({ timeout: 1000 });
      }).toPass({ timeout: 15000 });
    };

    await select(1);
    await expect(page.getByText('1 selected')).toBeVisible();

    await select(2);
    await expect(page.getByText('2 selected')).toBeVisible();

    await page.getByRole('button', { name: 'Clear' }).click();
    // anchored, because react-aria also emits live-region announcements like
    // "2 items selected." that would otherwise match
    await expect(page.getByText(/^\d+ selected$/)).toHaveCount(0);
  });

  test('filters, and shows an empty state when nothing matches', async ({
    page,
  }) => {
    await page.goto('/catalog');
    await waitForHydration(page);

    await page.getByRole('searchbox', { name: 'Filter services' }).fill('image');
    await expect(page.getByText('1 of 24 services')).toBeVisible();
    await expect(page.getByText('image-resizer')).toBeVisible();

    await page
      .getByRole('searchbox', { name: 'Filter services' })
      .fill('nothing-matches-this');
    await expect(page.getByText('No services match those filters.')).toBeVisible();
  });

  test('rows link through to the service detail page', async ({ page }) => {
    await page.goto('/catalog');
    await waitForHydration(page);

    await clickAndNavigate(
      page,
      page.getByRole('link', { name: 'audit-log' }),
      /\/services\/audit-log$/,
    );
    await expect(
      page.getByRole('heading', { name: 'audit-log', exact: true }),
    ).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/catalog');
    await settle(page);
    await page.screenshot({ path: 'screenshots/catalog-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/catalog');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/catalog-dark.png', fullPage: true });
  });
});
