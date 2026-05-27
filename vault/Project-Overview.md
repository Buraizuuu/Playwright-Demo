# Project Overview

## Stack
- Playwright with TypeScript
- Page Object Model (POM)
- dotenv for environment variables
- Winston for logging

This project follows:
- [[Framework-Rules]]
- [[Locator-Strategy]]
- [[Reusable-Patterns]]

Known problems are tracked in:
- [[Known-Issues]]

## Application Under Test
**OrangeHRM Demo**
- URL: `https://opensource-demo.orangehrmlive.com`
- Login path: `/web/index.php/auth/login`
- Post-login: redirects to `/dashboard`

## Project Goal
Learn and build a clean Playwright automation framework using best practices — simple architecture, reusable page objects, and stable locators.

## Current Features
| Feature | File |
|---|---|
| Login automation | `tests/login.spec.ts` |
| Dashboard verification (storageState) | `tests/dashboard.spec.ts` |
| Auth setup (storageState save) | `tests/auth.setup.ts` |
| Login page object | `pages/login.page.ts` |
| Dashboard page object | `pages/dashboard.page.ts` |
| Environment variables | `.env` |
| Chrome-only config | `playwright.config.ts` |
| Centralized logging | `utils/logger.ts` |

## Test Credentials
Stored in `.env` — never hardcoded in tests.
```
BASE_URL=https://opensource-demo.orangehrmlive.com
LOGIN_USERNAME=Admin
LOGIN_PASSWORD=admin123
```

## Run Commands
```bash
npx playwright test
npx playwright test --ui
```
