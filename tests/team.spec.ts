import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Team', () => {
  test('lists people with their role and team', async ({ page }) => {
    await page.goto('/team');
    await waitForHydration(page);

    await expect(page.getByRole('rowheader', { name: /Ada Lovelace/ })).toBeVisible();
    // name and address share one cell rather than two columns of identity
    await expect(page.getByText('ada@acme.cloud')).toBeVisible();
    await expect(page.getByRole('row', { name: /Grace Hopper/ })).toContainText(
      'Billing admin',
    );
  });

  test('filters across name, email and team', async ({ page }) => {
    await page.goto('/team');
    await waitForHydration(page);

    await page.getByRole('searchbox', { name: 'Filter people' }).fill('team-vault');

    await expect(page.getByRole('rowheader', { name: /Alan Turing/ })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: /Ada Lovelace/ })).toHaveCount(0);
  });

  test('invites someone and shows them as pending', async ({ page }) => {
    await page.goto('/team');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'Invite people' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('newcomer@acme.cloud');
    await page.getByRole('button', { name: 'Send invite' }).click();

    // the dialog closes and the row appears, marked as not yet accepted
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('row', { name: /newcomer@acme.cloud/ })).toContainText(
      'Invited',
    );
  });

  test('refuses to invite someone who is already here', async ({ page }) => {
    await page.goto('/team');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'Invite people' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('ada@acme.cloud');
    await page.getByRole('button', { name: 'Send invite' }).click();

    await expect(page.getByRole('alert')).toContainText('already in this workspace');
  });

  test('is a nav destination of its own', async ({ page }) => {
    await page.goto('/team');
    await waitForHydration(page);

    await expect(
      page
        .getByRole('listbox', { name: 'Main navigation' })
        .getByRole('option', { name: 'Team' }),
    ).toHaveAttribute('aria-selected', 'true');
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/team');
    await settle(page);
    await page.screenshot({ path: 'screenshots/team-full-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/team');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/team-full-dark.png', fullPage: true });
  });
});
