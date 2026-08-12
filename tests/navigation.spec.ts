import { test, expect } from '@playwright/test';
import { PAGES } from './pages';
import { waitForHydration } from './helpers';

test.describe('Sidebar routing', () => {
  test('every sidebar item navigates to its own page', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    const nav = page.getByRole('listbox', { name: 'Main navigation' });
    await expect(nav.getByRole('option')).toHaveCount(PAGES.length);

    for (const target of PAGES) {
      await nav.getByRole('option', { name: target.navLabel }).click();
      await page.waitForURL(`**${target.path}`);

      await expect(
        page.getByRole('heading', { name: target.heading, exact: true }),
      ).toBeVisible();
      await expect(
        nav.getByRole('option', { name: target.navLabel }),
      ).toHaveAttribute('aria-selected', 'true');
    }
  });

  test('sidebar items are real links, not just click handlers', async ({
    page,
  }) => {
    await page.goto('/');
    await waitForHydration(page);
    const nav = page.getByRole('listbox', { name: 'Main navigation' });

    for (const target of PAGES) {
      await expect(
        nav.getByRole('option', { name: target.navLabel }),
      ).toHaveAttribute('href', target.path);
    }
  });

  test('the chosen theme survives navigation between pages', async ({
    page,
  }) => {
    await page.goto('/');
    await waitForHydration(page);
    await expect(page.locator('html')).toHaveAttribute(
      'data-theme-mode',
      'light',
    );

    await page.locator('label', { hasText: 'Dark mode' }).click();
    await expect(page.locator('html')).toHaveAttribute(
      'data-theme-mode',
      'dark',
    );

    // the client router swaps <html>, so the theme has to be re-applied
    await page
      .getByRole('listbox', { name: 'Main navigation' })
      .getByRole('option', { name: 'Incidents' })
      .click();
    await page.waitForURL('**/incidents');

    await expect(page.locator('html')).toHaveAttribute(
      'data-theme-mode',
      'dark',
    );
    await expect(page.getByRole('switch', { name: 'Dark mode' })).toBeChecked();
  });
});
