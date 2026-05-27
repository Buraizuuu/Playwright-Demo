import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { logger } from '../utils/logger';

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

const stripAnsi = (str: string) => str.replace(/\x1B\[[\d;]*[a-zA-Z]/g, '');

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const message = stripAnsi(testInfo.error?.message ?? 'unknown error').trim();
    logger.error(`[FAILED] ${testInfo.title} — ${message}`);
  }
});

export { expect } from '@playwright/test';
