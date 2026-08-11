import { test, expect } from '@playwright/test';
import { settle, useDarkTheme, waitForHydration } from './helpers';

// A phone-sized viewport for every test in this file.
test.use({ viewport: { width: 390, height: 844 } });

test.describe('Small screens', () => {
  test('the sidebar collapses into a sticky top bar', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    const geometry = await page.evaluate(() => {
      const bar = document.querySelector('.app-sidebar')!.getBoundingClientRect();
      const main = document.querySelector('.app-main')!.getBoundingClientRect();
      return { barHeight: bar.height, barTop: bar.top, mainTop: main.top };
    });

    // it is a bar, not a full-height column taking the whole first screen
    expect(geometry.barHeight).toBeLessThan(120);
    // and the content starts below it rather than under it
    expect(geometry.mainTop).toBeGreaterThanOrEqual(geometry.barHeight - 1);

    // the inline nav is replaced by the drawer trigger
    await expect(
      page.getByRole('button', { name: 'Open navigation' }),
    ).toBeVisible();
    await expect(
      page.getByRole('listbox', { name: 'Main navigation' }),
    ).toBeHidden();
  });

  test('the top bar stays put while the content scrolls under it', async ({
    page,
  }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.evaluate(() => window.scrollTo(0, 600));
    const bar = await page
      .locator('.app-sidebar')
      .evaluate((el) => el.getBoundingClientRect().top);
    expect(bar).toBe(0);
  });

  test('the drawer opens, navigates and closes', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'Open navigation' }).click();
    const drawer = page.getByRole('dialog');
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole('option')).toHaveCount(9);

    // Escape closes it
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);

    // clicking the scrim closes it
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.mouse.click(370, 700);
    await expect(page.getByRole('dialog')).toHaveCount(0);

    // and a nav item inside it still routes
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('dialog').getByRole('option', { name: 'Incidents' }).click();
    await page.waitForURL('**/incidents');
    await expect(
      page.getByRole('heading', { name: 'Incidents', exact: true }),
    ).toBeVisible();
  });

  test('the close button dismisses the drawer', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    await page.getByRole('button', { name: 'Open navigation' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Close navigation' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('no page scrolls sideways; wide tables scroll inside their card', async ({
    page,
  }) => {
    for (const path of ['/', '/deployments', '/services', '/incidents', '/settings']) {
      await page.goto(path);
      await waitForHydration(page);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow, `${path} scrolls horizontally`).toBe(false);
    }

    // the six-column catalog is wider than a phone, so it must scroll within
    // its own card rather than squeezing every column into an ellipsis
    await page.goto('/services');
    await waitForHydration(page);
    const scrollable = await page
      .locator('.table-scroll')
      .first()
      .evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(scrollable).toBe(true);
  });

  test('screenshots', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    await page.screenshot({ path: 'screenshots/mobile-light.png', fullPage: true });

    await page.getByRole('button', { name: 'Open navigation' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.waitForTimeout(400); // let the slide-in settle
    await page.screenshot({ path: 'screenshots/mobile-drawer.png' });
  });

  test('dark screenshot', async ({ page }) => {
    await useDarkTheme(page);
    await page.goto('/');
    await settle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
    await page.screenshot({ path: 'screenshots/mobile-dark.png', fullPage: true });
  });
});
