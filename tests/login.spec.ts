import { config } from '../configs/env';
import { test, expect } from '../fixtures';
import { logger } from '../utils/logger';

// Clear auth state — this spec tests the login UI directly
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {
  test('[Login] should allow user access with valid credentials', async ({ loginPage, dashboardPage }) => {
    await loginPage.navigate();
    await loginPage.login(config.username, config.password);
    await dashboardPage.verifyDashboardLoaded();

    logger.info(`Authenticated as "${config.username}"`);
  });
});

test.describe('Authentication — Invalid Login', () => {
  test('[Login] should display error when wrong password is provided', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(config.username, 'wrong-password');

    await expect(loginPage.errorAlert).toBeVisible();
    const message = await loginPage.getErrorMessage();
    expect(message).toContain('Invalid credentials');

    logger.info(`Wrong password rejected — error displayed: "${message.trim()}"`);
  });

  test('[Login] should display error when wrong username is provided', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('invalid.user@example.com', config.password);

    await expect(loginPage.errorAlert).toBeVisible();
    const message = await loginPage.getErrorMessage();
    expect(message).toContain('Invalid credentials');

    logger.info(`Wrong username rejected — error displayed: "${message.trim()}"`);
  });

  test('[Login] should display required field errors when both fields are empty', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('', '');

    // OrangeHRM renders inline "Required" validation under each empty field
    const requiredErrors = loginPage.page.getByText('Required');
    await expect(requiredErrors).toHaveCount(2);

    logger.info('Empty credentials rejected — "Required" validation displayed for both fields');
  });
});
