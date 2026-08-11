import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Roles', () => {
  test('is a grid of permissions by role', async ({ page }) => {
    await page.goto('/roles');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'Roles', exact: true })).toBeVisible();
    for (const role of ['Owner', 'Billing admin', 'Developer', 'Read only']) {
      await expect(page.getByRole('columnheader', { name: new RegExp(role) })).toBeVisible();
    }
    await expect(page.getByRole('rowheader', { name: 'Deploy to production' })).toBeVisible();
  });

  test('permissions an owner cannot give up are locked, not hidden', async ({
    page,
  }) => {
    await page.goto('/roles');
    await waitForHydration(page);

    const ownerInvite = page.getByRole('checkbox', {
      name: 'Invite people for Owner',
    });
    // ticked and disabled: an empty cell would read as "not granted"
    await expect(ownerInvite).toBeChecked();
    await expect(ownerInvite).toBeDisabled();
  });

  test('a grantable permission can be toggled', async ({ page }) => {
    await page.goto('/roles');
    await waitForHydration(page);

    const box = page.getByRole('checkbox', {
      name: 'Close incidents for Read only',
    });
    await expect(box).not.toBeChecked();

    await page
      .locator('label.bui-Checkbox')
      .filter({ has: page.getByRole('checkbox', { name: 'Close incidents for Read only' }) })
      .click();

    await expect(box).toBeChecked();
  });

  test('the header counts what each role holds', async ({ page }) => {
    await page.goto('/roles');
    await waitForHydration(page);

    // read only starts with a single permission
    await expect(
      page.getByRole('columnheader', { name: /Read only/ }),
    ).toContainText('1 of 12');
    await expect(
      page.getByRole('columnheader', { name: /Owner/ }),
    ).toContainText('12 of 12');
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/roles');
    await settle(page);
    await page.screenshot({ path: 'screenshots/roles-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/roles');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/roles-dark.png', fullPage: true });
  });
});
