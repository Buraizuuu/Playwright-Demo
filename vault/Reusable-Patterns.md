# Reusable Patterns

## Test Structure

```ts
// tests/login.spec.ts
import { config } from '../configs/env';
import { test } from '../fixtures';
import { logger } from '../utils/logger';

test.describe('Authentication', () => {
  test('[Login] should allow user access with valid credentials', async ({ loginPage, dashboardPage }) => {
    await loginPage.navigate();
    await loginPage.login(config.username, config.password);
    await dashboardPage.verifyDashboardLoaded();

    logger.info(`Authenticated as "${config.username}"`);
  });
});
```

## Page Object Model

```ts
// pages/example.page.ts
import { Page, Locator } from '@playwright/test';

export class ExamplePage {
  readonly page: Page;
  readonly someButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.someButton = page.getByRole('button', { name: 'Submit' });
  }

  async navigate(): Promise<void> {
    await this.page.goto('/path');
  }

  async clickSubmit(): Promise<void> {
    await this.someButton.click();
  }
}
```

## Verify Method Pattern

Page objects may contain `verify*()` methods for readability.

```ts
// pages/dashboard.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
  }

  async verifyDashboardLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.heading).toBeVisible();
  }
}
```

## Fixture Pattern

```ts
// fixtures/index.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

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

export { expect } from '@playwright/test';
```

## Config Pattern

```ts
// configs/env.ts
export const config = {
  baseUrl: process.env.BASE_URL!,
  username: process.env.LOGIN_USERNAME!,
  password: process.env.LOGIN_PASSWORD!,
};
```

```ts
// usage in tests
import { config } from '../configs/env';

await loginPage.login(config.username, config.password);
```

## Logger Pattern

```ts
import { logger } from '../utils/logger';

logger.info(`Authenticated as "${config.username}"`);
logger.error(`Login failed: ${error}`);
```

| Transport | File | Content |
|---|---|---|
| Console | — | All levels, colorized |
| File | `logs/info.log` | Info-level only |
| File | `logs/error.log` | Error-level only |
| File | `logs/test.log` | All levels — full execution trace |

## storageState Pattern

Login once via the `setup` project — all other tests start pre-authenticated.

```ts
// tests/auth.setup.ts
import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { config } from '../configs/env';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(config.username, config.password);
  await page.waitForURL(/dashboard/);

  await page.context().storageState({ path: authFile });
  logger.info('Auth state saved');
});
```

```ts
// playwright.config.ts — projects
projects: [
  { name: 'setup', testMatch: '**/auth.setup.ts' },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },
    dependencies: ['setup'],
  },
],
```

Tests that exercise the login UI must clear the inherited state:
```ts
// tests/login.spec.ts
test.use({ storageState: { cookies: [], origins: [] } });
```

---

## Environment Variables

```ts
// Always use non-reserved names
process.env.LOGIN_USERNAME   // ✅ safe
process.env.USERNAME         // ❌ reserved by Windows
```
