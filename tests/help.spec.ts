import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Help centre', () => {
  test('groups questions by topic', async ({ page }) => {
    await page.goto('/help');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'Help centre' })).toBeVisible();
    for (const topic of ['Getting started', 'Deploys', 'On-call', 'Billing']) {
      await expect(page.getByRole('heading', { name: topic })).toBeVisible();
    }
  });

  test('answers are hidden until asked for', async ({ page }) => {
    await page.goto('/help');
    await waitForHydration(page);

    const answer = page.getByText(/It redeploys the previous version/);
    await expect(answer).toBeHidden();

    await page.getByRole('button', { name: 'How do I roll back?' }).click();
    await expect(answer).toBeVisible();
  });

  test('one answer at a time within a topic', async ({ page }) => {
    await page.goto('/help');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'How do I roll back?' }).click();
    await expect(page.getByText(/It redeploys the previous version/)).toBeVisible();

    await page
      .getByRole('button', { name: 'Why does my production deploy need an approval?' })
      .click();

    // opening the second closes the first
    await expect(page.getByText(/It redeploys the previous version/)).toBeHidden();
  });

  test('searching narrows to the matching questions', async ({ page }) => {
    await page.goto('/help');
    await waitForHydration(page);

    await page.getByRole('searchbox', { name: 'Search the answers' }).fill('seat');

    await expect(
      page.getByRole('button', { name: 'What counts as a seat?' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'How do I roll back?' }),
    ).toHaveCount(0);
    // topics with no matches disappear with their questions
    await expect(page.getByRole('heading', { name: 'On-call' })).toHaveCount(0);
  });

  test('says where to go when nothing matches', async ({ page }) => {
    await page.goto('/help');
    await waitForHydration(page);

    await page.getByRole('searchbox', { name: 'Search the answers' }).fill('zzzznothing');
    await expect(page.getByText('Nothing here answers that')).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/help');
    await settle(page);
    await page.screenshot({ path: 'screenshots/help-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/help');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/help-dark.png', fullPage: true });
  });
});
