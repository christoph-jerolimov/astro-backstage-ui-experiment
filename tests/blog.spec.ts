import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Blog index', () => {
  test('lists posts newest first', async ({ page }) => {
    await page.goto('/blog');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'Writing' })).toBeVisible();

    const titles = await page.locator('.bui-Card a').allInnerTexts();
    expect(titles[0]).toContain('A catalog is only useful if it is true');
    expect(titles).toHaveLength(4);
  });

  test('says who wrote it, when, and how long it is', async ({ page }) => {
    await page.goto('/blog');
    await waitForHydration(page);

    await expect(
      page.getByText(/Ada Lovelace · 4 August 2026 · \d+ min read/),
    ).toBeVisible();
  });

  test('filters by tag', async ({ page }) => {
    await page.goto('/blog');
    await waitForHydration(page);

    await page.getByRole('radio', { name: 'on-call' }).click();

    await expect(
      page.getByRole('link', { name: 'On-call without heroes' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Why this demo is built with Astro' }),
    ).toHaveCount(0);
  });

  test('stands outside the app shell', async ({ page }) => {
    await page.goto('/blog');
    await waitForHydration(page);

    await expect(
      page.getByRole('listbox', { name: 'Main navigation' }),
    ).toHaveCount(0);
    await expect(page.getByRole('switch', { name: 'Dark mode' })).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/blog');
    await settle(page);
    await page.screenshot({ path: 'screenshots/blog-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/blog');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/blog-dark.png', fullPage: true });
  });
});
