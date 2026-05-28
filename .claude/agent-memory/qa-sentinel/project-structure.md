---
name: project-structure
description: OrangeHRM Playwright-Demo — confirmed folder layout, page objects, fixtures, and target application details
metadata:
  type: project
---

The target application is OrangeHRM. Base URL configured via `BASE_URL` in `.env`.

Key login URL: `/web/index.php/auth/login`
Dashboard URL: `/web/index.php/dashboard/index`

Page objects in `pages/`:
- `login.page.ts` — LoginPage, covers login form and error alert
- `dashboard.page.ts` — DashboardPage, covers heading verification

Fixtures in `fixtures/index.ts` expose: `loginPage`, `dashboardPage`. Logger is imported from `utils/logger` inside the fixture's `afterEach` and consumed directly in tests.

OrangeHRM UI behavior confirmed:
- Invalid credentials (wrong user or wrong password) → `role="alert"` element with text "Invalid credentials"
- Empty field submission → two inline `getByText('Required')` validation messages, one per field

**Why:** Informed locator choices for LoginPage `errorAlert` (getByRole('alert')) and empty-field assertions (getByText('Required') count: 2).
**How to apply:** Use these locators in any new invalid-login or validation tests without re-investigating the DOM.
