import { test, expect } from '@playwright/test';
import { clickAndNavigate, settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Blog post', () => {
  test('has a page per post, with the Markdown rendered', async ({ page }) => {
    await page.goto('/blog/four-numbers');
    await waitForHydration(page);

    await expect(
      page.getByRole('heading', {
        name: 'The four numbers worth putting on a dashboard',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Change failure rate' }),
    ).toBeVisible();
    await expect(page.getByText(/Below about 15% is/)).toBeVisible();
  });

  test('credits the author and says how long it takes', async ({ page }) => {
    await page.goto('/blog/four-numbers');
    await waitForHydration(page);

    await expect(
      page.getByText(/Grace Hopper · 21 July 2026 · \d+ min read/),
    ).toBeVisible();
  });

  test('keeps the prose to a readable measure', async ({ page }) => {
    await page.goto('/blog/four-numbers');
    await waitForHydration(page);

    const width = await page
      .locator('.post')
      .evaluate((el) => el.getBoundingClientRect().width);
    // a column of prose has one right width, and it is not the viewport
    expect(width).toBeLessThanOrEqual(680);
  });

  test('links to the older and newer post', async ({ page }) => {
    await page.goto('/blog/four-numbers');
    await waitForHydration(page);

    const nav = page.getByRole('navigation', { name: 'More posts' });
    await expect(nav.getByText('Older')).toBeVisible();
    await expect(nav.getByText('Newer')).toBeVisible();
    await expect(
      nav.getByRole('link', { name: 'On-call without heroes' }),
    ).toBeVisible();
  });

  test('the newest post has no newer link', async ({ page }) => {
    await page.goto('/blog/catalog-that-stays-true');
    await waitForHydration(page);

    const nav = page.getByRole('navigation', { name: 'More posts' });
    await expect(nav.getByText('Newer')).toHaveCount(0);
    await expect(nav.getByText('Older')).toBeVisible();
  });

  test('the header goes back to the index', async ({ page }) => {
    await page.goto('/blog/four-numbers');
    await waitForHydration(page);

    await clickAndNavigate(
      page,
      page.getByRole('link', { name: 'Blog', exact: true }),
      /\/blog$/,
    );
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/blog/four-numbers');
    await settle(page);
    await page.screenshot({ path: 'screenshots/blog-post-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/blog/four-numbers');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/blog-post-dark.png', fullPage: true });
  });
});
