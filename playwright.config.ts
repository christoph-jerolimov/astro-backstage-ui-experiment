import { defineConfig, devices } from '@playwright/test';

// In environments with a pre-installed Chromium (e.g. sandboxed containers),
// point PLAYWRIGHT_CHROMIUM_PATH at the browser binary instead of running
// `playwright install`.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    viewport: { width: 1100, height: 800 },
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Serves ./dist, so run `npm run build` first.
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    env: {
      // `astro preview` normally runs in the foreground, which is what
      // Playwright needs — but it daemonizes itself when it detects it is being
      // run by a coding agent, and a web server that exits immediately makes
      // Playwright give up. Setting this opts out of that detection; it has no
      // effect in CI or in a normal terminal, where the check is already false.
      ASTRO_PREVIEW_BACKGROUND: '1',
    },
  },
});
