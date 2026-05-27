import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { config } from '../configs/env';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  if (fs.existsSync(authFile)) {
    await page.context().addCookies(
      JSON.parse(fs.readFileSync(authFile, 'utf-8')).cookies ?? []
    );
    await page.goto('/web/index.php/dashboard/index');

    if (page.url().includes('dashboard')) {
      logger.info('Auth state valid — skipping login');
      return;
    }

    logger.info('Auth state expired — logging in again');
  }

  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(config.username, config.password);
  await page.waitForURL(/dashboard/);

  await page.context().storageState({ path: authFile });
  logger.info('Auth state saved');
});
