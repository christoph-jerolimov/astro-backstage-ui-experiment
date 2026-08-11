import { expect, type Page } from '@playwright/test';

/**
 * Every page is server-rendered first, so its controls exist in the DOM before
 * React has attached any handlers — clicking in that window silently does
 * nothing. Astro tags each island with `astro-island[ssr]` and drops the
 * attribute once it hydrates, which gives us an exact signal to wait for.
 */
export async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const islands = document.querySelectorAll('astro-island');
    return (
      islands.length > 0 &&
      document.querySelectorAll('astro-island[ssr]').length === 0
    );
  });
}

/** Seeds the persisted theme so the page renders dark from first paint. */
export async function useDarkTheme(page: Page) {
  await page.addInitScript(() =>
    localStorage.setItem('acme-theme-mode', 'dark'),
  );
}

/**
 * Waits until the page is safe to screenshot: hydrated, and with any
 * stacked-bar labels measured (they are hidden until they are known to fit).
 */
export async function settle(page: Page) {
  await waitForHydration(page);
  const stacks = page.locator('.stack-track');
  for (let i = 0; i < (await stacks.count()); i++) {
    await expect(stacks.nth(i)).toHaveAttribute('data-measured', 'true');
  }
}
