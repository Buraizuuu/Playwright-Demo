import { test } from '../fixtures';
import { logger } from '../utils/logger';

// storageState is inherited from the chromium project — starts pre-authenticated

test.describe('Dashboard', () => {
  test('[Dashboard] should load for authenticated user', async ({ dashboardPage }) => {
    await dashboardPage.navigate();
    await dashboardPage.verifyDashboardLoaded();

    logger.info('Dashboard verified via storageState');
  });
});
