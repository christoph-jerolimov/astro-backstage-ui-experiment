import { test, expect } from '@playwright/test';
import { clickAndNavigate, waitForHydration } from './helpers';

/** Stamps the window so a full document load can be detected by its absence. */
const stamp = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    (window as unknown as { __spa?: number }).__spa = Date.now();
  });

const stampSurvived = (page: import('@playwright/test').Page) =>
  page.evaluate(() => (window as unknown as { __spa?: number }).__spa !== undefined);

test.describe('Client-side routing', () => {
  test('navigating swaps the document instead of reloading it', async ({
    page,
  }) => {
    await page.goto('/');
    await waitForHydration(page);
    await stamp(page);

    await clickAndNavigate(
      page,
      page.getByRole('option', { name: 'Deployments' }),
      /\/deployments$/,
    );
    await expect(
      page.getByRole('heading', { name: 'Deployments', exact: true }),
    ).toBeVisible();

    // a real page load would have wiped this
    expect(await stampSurvived(page)).toBe(true);
  });

  test('the sidebar island is kept, not re-mounted', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.evaluate(() => {
      const el = document.querySelector('.app-sidebar') as HTMLElement & {
        __kept?: boolean;
      };
      el.__kept = true;
    });

    await clickAndNavigate(
      page,
      page.getByRole('option', { name: 'Catalog' }),
      /\/catalog$/,
    );

    const kept = await page.evaluate(
      () =>
        (document.querySelector('.app-sidebar') as HTMLElement & {
          __kept?: boolean;
        }).__kept === true,
    );
    expect(kept).toBe(true);
  });

  test('the active item still follows the URL', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    const nav = page.getByRole('listbox', { name: 'Main navigation' });
    await expect(nav.getByRole('option', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    // the sidebar is persisted, so this cannot come from a new prop
    await clickAndNavigate(
      page,
      nav.getByRole('option', { name: 'Incidents' }),
      /\/incidents$/,
    );

    await expect(nav.getByRole('option', { name: 'Incidents' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(nav.getByRole('option', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  test('going back and forward works', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await clickAndNavigate(
      page,
      page.getByRole('option', { name: 'Services' }),
      /\/services$/,
    );

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole('heading', { name: 'Platform overview' }),
    ).toBeVisible();

    await page.goForward();
    await expect(page).toHaveURL(/\/services$/);
  });

  test('the palette navigates without a reload either', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);
    await stamp(page);

    await page.keyboard.press('Meta+k');
    await page.getByPlaceholder('Jump to a page, service or doc').fill('audit');
    await page.keyboard.press('Enter');

    await page.waitForURL('**/audit');
    await expect(page.getByRole('heading', { name: 'Audit log' })).toBeVisible();
    expect(await stampSurvived(page)).toBe(true);
  });

  test('the theme survives a swap', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.locator('label', { hasText: 'Dark mode' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');

    await clickAndNavigate(
      page,
      page.getByRole('option', { name: 'Docs' }),
      /\/docs$/,
    );

    // the swap replaces <html>, so the attribute has to be re-applied
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
  });

  test('leaving the app shell drops the sidebar', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.goto('/team');
    await waitForHydration(page);
    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();

    await page.waitForURL('**/profile');
    await expect(
      page.getByRole('listbox', { name: 'Main navigation' }),
    ).toBeVisible();
  });
});

test.describe('Without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the nav is still real links', async ({ page }) => {
    await page.goto('/');

    // no hydration, no client router — the anchors carry the navigation.
    // react-aria gives them role="option", so match the element, not the role.
    await page.locator('a.sidebar-item', { hasText: 'Incidents' }).click();
    await expect(page).toHaveURL(/\/incidents$/);
    await expect(
      page.getByRole('heading', { name: 'Incidents', exact: true }),
    ).toBeVisible();
  });
});
