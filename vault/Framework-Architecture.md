# Framework Architecture

## Overview

This framework is a layered Playwright + TypeScript automation suite using the Page Object Model (POM). Each layer has a single responsibility and only communicates with the layers directly adjacent to it.

```
┌─────────────────────────────────────┐
│            Tests Layer              │  tests/
│   test flow, assertions, logging    │
├─────────────────────────────────────┤
│           Fixtures Layer            │  fixtures/
│   injects page objects into tests   │
├─────────────────────────────────────┤
│         Page Objects Layer          │  pages/
│   locators + actions per page       │
├─────────────────────────────────────┤
│           Utils Layer               │  utils/
│   shared helpers (logger)           │
├─────────────────────────────────────┤
│       Infrastructure Layer          │  configs/  +  playwright.config.ts
│   env config, global hooks, runner  │
└─────────────────────────────────────┘
```

---

## Layers

### Infrastructure — `configs/` + `playwright.config.ts`

| File | Role |
|---|---|
| `playwright.config.ts` | Runner config — browser, baseURL, retries, reporter, projects |
| `configs/global-setup.ts` | Logs `SUITE START` boundary once before all tests |
| `configs/global-teardown.ts` | Logs `SUITE END` boundary once after all tests |

Key settings in `playwright.config.ts`:
- Browser: Chromium only (Desktop Chrome)
- `headless: false`
- `screenshot: 'only-on-failure'`
- `trace: 'on-first-retry'`
- `fullyParallel: true`
- CI-aware: `retries: 2`, `workers: 1` when `process.env.CI` is set

**Projects:**

| Project | Role |
|---|---|
| `setup` | Runs `auth.setup.ts` — logs in once, saves `.auth/user.json` |
| `chromium` | Runs all tests with `storageState: '.auth/user.json'` pre-loaded; depends on `setup` |

Tests that test the login UI directly must clear the state with:
```ts
test.use({ storageState: { cookies: [], origins: [] } });
```

---

### Config — `configs/env.ts` + `.env`

```
.env  →  dotenv (loaded in playwright.config.ts)  →  configs/env.ts  →  tests
```

`configs/env.ts` wraps `process.env` into a typed object so tests never call `process.env` directly:

```ts
export const config = {
  baseUrl: process.env.BASE_URL!,
  username: process.env.LOGIN_USERNAME!,
  password: process.env.LOGIN_PASSWORD!,
};
```

> ⚠️ `USERNAME` is reserved by Windows — always use `LOGIN_USERNAME` instead.
> See [[Known-Issues]].

---

### Utils — `utils/logger.ts`

Winston logger with three file transports + console:

| Transport | File | Content |
|---|---|---|
| Console | — | All levels, colorized |
| File | `logs/info.log` | `info` level only |
| File | `logs/error.log` | `error` level only |
| File | `logs/test.log` | All levels — full trace |

`logs/` is auto-created at runtime if missing. Import and use:
```ts
import { logger } from '../utils/logger';
logger.info('message');
logger.error('message');
```

---

### Page Objects — `pages/`

One file per application page. Each class follows the same structure:

```
constructor  →  readonly Locators
methods      →  actions only (navigate, fill, click)
verify*()    →  optional — wraps assertions for test readability
```

| File | Class | Locator Strategy |
|---|---|---|
| `pages/login.page.ts` | `LoginPage` | CSS `input[name]` — OrangeHRM has no semantic attrs |
| `pages/dashboard.page.ts` | `DashboardPage` | `getByRole('heading')` |

`DashboardPage` uses the `verify*()` pattern — `verifyDashboardLoaded()` asserts URL and heading visibility. This is a deliberate readability tradeoff (see [[Framework-Rules]]).

`DashboardPage` has a `navigate()` method pointing to `/web/index.php/dashboard/index`.

---

### Fixtures — `fixtures/index.ts`

Extends Playwright's `test` to inject page objects automatically. Tests never instantiate page objects manually.

```ts
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  dashboardPage: async ({ page }, use) => { await use(new DashboardPage(page)); },
});
```

**Import rule:** always import `test` from `fixtures/` — never from `@playwright/test` directly.

---

### Tests — `tests/`

Tests are the top consumer. They orchestrate actions via page objects, assert outcomes, and log results.

```ts
import { test } from '../fixtures';       // ← from fixtures, not @playwright/test
import { config } from '../configs/env';  // ← from configs, not process.env
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

Test title format: `[Action] should <expected outcome>`

---

## Execution Flow

```
npx playwright test
  │
  ├─ dotenv loads .env into process.env
  ├─ global-setup.ts     →  logs SUITE START
  │
  ├─ [setup project]
  │    └─ auth.setup.ts  →  logs in, saves .auth/user.json
  │
  ├─ [chromium project — runs after setup]
  │    ├─ loads storageState from .auth/user.json (pre-authenticated)
  │    ├─ fixture injects LoginPage, DashboardPage
  │    ├─ test calls page object actions
  │    ├─ assertions run inside test or via verify*() methods
  │    └─ logger writes to console + logs/
  │
  └─ global-teardown.ts  →  logs SUITE END
```

---

## Current Pages

| Page | File | Path |
|---|---|---|
| Login | `pages/login.page.ts` | `/web/index.php/auth/login` |
| Dashboard | `pages/dashboard.page.ts` | `/web/index.php/dashboard/index` |

---

## Related Notes

- [[Framework-Rules]] — naming conventions, locator rules, test rules
- [[Locator-Strategy]] — locator priority order with real examples
- [[Reusable-Patterns]] — copy-paste patterns for pages, fixtures, config, logger
- [[Folder-Structure]] — full directory tree with descriptions
- [[Known-Issues]] — Windows env var conflicts and other gotchas
