import { expect, type Locator, type Page } from '@playwright/test';

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
  // Clearing the marker means React has mounted, but react-aria attaches its
  // press handling in effects that run just after. Clicking inside that gap
  // gets swallowed — the press is captured but the navigation never happens —
  // so give the commit a couple of frames to settle.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}

/**
 * Clicks something react-aria owns and waits for the navigation it should
 * cause, retrying if the press is swallowed.
 *
 * react-aria attaches its press handling in effects that land a beat after the
 * island marker clears, and a click inside that window is captured without
 * performing the navigation. It is intermittent — the same click succeeds on a
 * retry — so the assertion retries rather than waiting a fixed time.
 */
export async function clickAndNavigate(
  page: Page,
  target: Locator,
  url: RegExp,
) {
  await expect(async () => {
    await target.click();
    await expect(page).toHaveURL(url, { timeout: 2000 });
  }).toPass({ timeout: 20000 });
}

/**
 * Clicks something react-aria owns until an attribute reaches the value the
 * click is supposed to produce.
 *
 * Same swallowed-press problem as `clickAndNavigate`, but for controls that
 * toggle: a blind retry would undo the first click, so this checks the
 * attribute before pressing again.
 */
export async function clickUntilAttribute(
  target: Locator,
  attribute: string,
  value: string,
) {
  await expect(async () => {
    if ((await target.getAttribute(attribute)) === value) return;
    await target.click();
    await expect(target).toHaveAttribute(attribute, value, { timeout: 2000 });
  }).toPass({ timeout: 20000 });
}

/**
 * Clicks something react-aria owns until whatever it opens is on screen.
 *
 * Same swallowed-press problem as `clickAndNavigate`. Checking first also
 * keeps the retry from clicking through an overlay that is already open.
 */
export async function clickUntilVisible(target: Locator, appears: Locator) {
  await expect(async () => {
    if (await appears.isVisible()) return;
    await target.click();
    await expect(appears).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 20000 });
}

/**
 * Ticks a Backstage UI checkbox.
 *
 * react-aria hides the real input behind its label, so the label is the
 * clickable target, and a press landing right after hydration can be
 * swallowed — hence the retry, guarded on the input's own state so it cannot
 * toggle back off.
 */
export async function tickCheckbox(page: Page, name: string | RegExp) {
  const input = page.getByRole('checkbox', { name });
  const label = page.locator('label.bui-Checkbox').filter({ hasText: name });
  await expect(async () => {
    if (!(await input.isChecked())) {
      await label.first().click();
    }
    await expect(input).toBeChecked({ timeout: 1000 });
  }).toPass({ timeout: 15000 });
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
