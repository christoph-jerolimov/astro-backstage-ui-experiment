import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Changelog', () => {
  test('lists releases newest first', async ({ page }) => {
    await page.goto('/changelog');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'Changelog', level: 1 })).toBeVisible();

    const versions = await page.locator('h2').allInnerTexts();
    expect(versions[0]).toBe('2026.8.1');
    expect(versions.at(-1)).toBe('2026.6.2');
  });

  test('labels each change with a word, not a colour', async ({ page }) => {
    await page.goto('/changelog');
    await waitForHydration(page);

    // rendered uppercase by CSS, so compare the underlying words
    const kinds = await page.locator('.change-kind').allInnerTexts();
    expect(new Set(kinds.map((k) => k.toLowerCase()))).toEqual(
      new Set(['added', 'changed', 'fixed']),
    );
  });

  test('says when the date refers to', async ({ page }) => {
    await page.goto('/changelog');
    await waitForHydration(page);

    await expect(
      page.getByText(/when it reached production,\s+not when it was merged/),
    ).toBeVisible();
  });

  test('filtering to one kind drops releases that have none', async ({ page }) => {
    await page.goto('/changelog');
    await waitForHydration(page);

    await page.getByRole('radio', { name: 'Added' }).click();

    const kinds = await page.locator('.change-kind').allInnerTexts();
    expect(new Set(kinds.map((k) => k.toLowerCase()))).toEqual(new Set(['added']));
    // 2026.6.2 has no additions, so it is not shown at all
    await expect(page.getByRole('heading', { name: '2026.6.2' })).toHaveCount(0);
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/changelog');
    await settle(page);
    await page.screenshot({ path: 'screenshots/changelog-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/changelog');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/changelog-dark.png', fullPage: true });
  });
});
