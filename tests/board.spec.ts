import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

const column = (page: import('@playwright/test').Page, name: string) =>
  page.getByRole('grid', { name });

test.describe('Board', () => {
  test('has a column per state with its cards', async ({ page }) => {
    await page.goto('/board');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'Board', exact: true })).toBeVisible();
    for (const name of ['Backlog', 'In progress', 'In review', 'Done']) {
      await expect(column(page, name)).toBeVisible();
    }
    await expect(column(page, 'Backlog').getByRole('row')).toHaveCount(3);
    await expect(column(page, 'In review').getByRole('row')).toHaveCount(1);
  });

  test('a card can be moved without dragging', async ({ page }) => {
    await page.goto('/board');
    await waitForHydration(page);

    // dragging is the mouse path; this is the one a keyboard user has
    await page.getByRole('button', { name: 'Move PLAT-311' }).click();
    await page.getByRole('menuitem', { name: 'In review' }).click();

    await expect(column(page, 'Backlog').getByRole('row')).toHaveCount(2);
    await expect(column(page, 'In review').getByRole('row')).toHaveCount(2);
    await expect(column(page, 'In review')).toContainText('Retire the legacy importer');
  });

  test('a card cannot be moved to the column it is already in', async ({
    page,
  }) => {
    await page.goto('/board');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'Move PLAT-311' }).click();

    await expect(page.getByRole('menuitem', { name: 'Backlog' })).toHaveCount(0);
    await expect(page.getByRole('menuitem')).toHaveCount(3);
  });

  test('the counts follow the cards', async ({ page }) => {
    await page.goto('/board');
    await waitForHydration(page);

    const head = (name: string) =>
      page.locator('.board-column').filter({ hasText: name }).locator('.board-column-head');

    await expect(head('In review')).toContainText('1');
    await page.getByRole('button', { name: 'Move PLAT-311' }).click();
    await page.getByRole('menuitem', { name: 'In review' }).click();
    await expect(head('In review')).toContainText('2');
  });

  test('cards say which service and team they belong to', async ({ page }) => {
    await page.goto('/board');
    await waitForHydration(page);

    await expect(
      page.getByText('Move deploy approvals into the service file'),
    ).toBeVisible();
    await expect(page.getByText('catalog-api · team-atlas').first()).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/board');
    await settle(page);
    await page.screenshot({ path: 'screenshots/board-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/board');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/board-dark.png', fullPage: true });
  });
});
