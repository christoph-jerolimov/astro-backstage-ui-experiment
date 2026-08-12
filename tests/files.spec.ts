import { test, expect } from '@playwright/test';
import { clickUntilVisible, settle, useDarkTheme, waitForHydration } from './helpers';

test.describe('Files', () => {
  test('opens at the root with folders and files', async ({ page }) => {
    await page.goto('/files');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'Files', exact: true })).toBeVisible();
    await expect(page.getByRole('row', { name: /artifacts/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /terraform.tfstate/ })).toBeVisible();
  });

  test('sizes are written the way people read them', async ({ page }) => {
    await page.goto('/files');
    await waitForHydration(page);

    // 2,411,000 bytes, not "2411000"
    await expect(page.getByText(/2 MB · team-vault/)).toBeVisible();

    await clickUntilVisible(
      page.getByRole('row', { name: /backups/ }),
      page.getByText(/1\.2 GB/).first(),
    );
  });

  test('folders open and the breadcrumb walks back', async ({ page }) => {
    await page.goto('/files');
    await waitForHydration(page);

    await clickUntilVisible(
      page.getByRole('row', { name: /artifacts/ }),
      page.getByRole('row', { name: /catalog-api/ }),
    );
    await clickUntilVisible(
      page.getByRole('row', { name: /catalog-api/ }),
      page.getByRole('row', { name: /sbom.json/ }),
    );

    // every segment is a link, not just the parent
    await expect(page.getByRole('link', { name: 'Files' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'artifacts' })).toBeVisible();

    await page.getByRole('link', { name: 'artifacts' }).click();
    await expect(page.getByRole('row', { name: /billing-worker/ })).toBeVisible();
  });

  test('up one level is disabled at the root', async ({ page }) => {
    await page.goto('/files');
    await waitForHydration(page);

    await expect(page.getByRole('button', { name: 'Up one level' })).toBeDisabled();

    await clickUntilVisible(
      page.getByRole('row', { name: /runbooks/ }),
      page.getByRole('row', { name: /rotate-deploy-key/ }),
    );
    await expect(page.getByRole('button', { name: 'Up one level' })).toBeEnabled();
  });

  test('the filter says it only looks in this folder', async ({ page }) => {
    await page.goto('/files');
    await waitForHydration(page);

    await page.getByRole('searchbox', { name: 'Filter this folder' }).fill('zzzznothing');

    await expect(page.getByText('Nothing here matches')).toBeVisible();
    await expect(page.getByText(/only looks in this folder/)).toBeVisible();
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/files');
    await settle(page);
    await page.screenshot({ path: 'screenshots/files-light.png', fullPage: true });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/files');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/files-dark.png', fullPage: true });
  });
});
