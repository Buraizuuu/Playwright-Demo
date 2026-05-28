import { test, expect } from '../fixtures';
import { logger } from '../utils/logger';

// storageState is inherited from the chromium project — starts pre-authenticated

test.describe('Dashboard', () => {
  test('[Dashboard] should load for authenticated user', async ({ dashboardPage }) => {
    await dashboardPage.navigate();
    await dashboardPage.verifyDashboardLoaded();

    logger.info('Dashboard verified via storageState');
  });

  test('[Dashboard] should display expected widgets for authenticated user', async ({ dashboardPage }) => {
    await dashboardPage.navigate();
    await dashboardPage.verifyWidgetsVisible();

    logger.info('Dashboard widgets verified: Quick Launch, Time at Work, My Actions');
  });
});

test.describe('Dashboard — Unauthenticated', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('[Dashboard] should redirect unauthenticated user to login page', async ({ dashboardPage, page }) => {
    await dashboardPage.navigate();

    await expect(page).toHaveURL(/auth\/login/);
    await expect(dashboardPage.heading).not.toBeVisible();

    logger.info('Unauthenticated dashboard access redirected to login page');
  });
});
