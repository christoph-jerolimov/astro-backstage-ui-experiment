import { test, expect, type Page } from '@playwright/test';
import { PAGES } from './pages';

/** Seeds the persisted theme so the page renders dark from first paint. */
async function useDarkTheme(page: Page) {
  await page.addInitScript(() =>
    localStorage.setItem('acme-theme-mode', 'dark'),
  );
}

/**
 * Stacked-bar labels only appear once the island has hydrated and measured
 * them, so a screenshot taken before that catches a half-rendered chart.
 */
async function settle(page: Page) {
  const stacks = page.locator('.stack-track');
  for (let i = 0; i < (await stacks.count()); i++) {
    await expect(stacks.nth(i)).toHaveAttribute('data-measured', 'true');
  }
}

for (const target of PAGES) {
  test.describe(`${target.name} page`, () => {
    test('renders in the light theme', async ({ page }) => {
      await page.goto(target.path);

      await expect(page.locator('html')).toHaveAttribute(
        'data-theme-mode',
        'light',
      );
      await expect(
        page.getByRole('heading', { name: target.heading, exact: true }),
      ).toBeVisible();

      // the sidebar marks this page as the current one
      await expect(
        page.getByRole('option', { name: target.navLabel }),
      ).toHaveAttribute('aria-selected', 'true');

      for (const content of target.expects) {
        await expect(page.getByText(content, { exact: false }).first()).toBeVisible();
      }

      await settle(page);
      await page.screenshot({
        path: `screenshots/${target.name}-light.png`,
        fullPage: true,
      });
    });

    test('renders in the dark theme', async ({ page }) => {
      await useDarkTheme(page);
      await page.goto(target.path);

      await expect(page.locator('html')).toHaveAttribute(
        'data-theme-mode',
        'dark',
      );
      await expect(page.getByRole('switch', { name: 'Dark mode' })).toBeChecked();
      await expect(
        page.getByRole('heading', { name: target.heading, exact: true }),
      ).toBeVisible();

      await settle(page);
      await page.screenshot({
        path: `screenshots/${target.name}-dark.png`,
        fullPage: true,
      });
    });
  });
}
