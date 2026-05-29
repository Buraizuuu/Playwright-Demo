# Claude Instructions

## Project Stack
- Playwright + TypeScript
- Page Object Model (POM) — UI tests
- Playwright Request API — API tests
- Winston logging
- dotenv for environment variables
- Allure Report (`allure-playwright` reporter + `allure` CLI)

---

# Project Context

Analyze the existing codebase structure before implementing changes.

---

# Key Framework Rules

## Imports
- Import `test` from `fixtures/` — never from `@playwright/test` directly
  - UI tests → import from `fixtures/index.ts`
  - API tests → import from `fixtures/api.fixtures.ts`
- Exception: `auth.setup.ts` uses `test as setup` from `@playwright/test` — it is infrastructure, not a test
- Import `config` from `configs/env` — never use `process.env` directly in tests or page objects

## Page Objects
- Locators declared in constructor as `readonly`
- Methods contain actions only — `navigate()`, `fill()`, `click()`
- `verify*()` methods are allowed when they improve test readability (e.g. `verifyDashboardLoaded()`)
- One file per application page

## Locators (preferred order)
1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByTestId`
5. CSS
6. XPath — last resort only

## Waits
- Never use `waitForTimeout`
- Rely on Playwright auto-waiting
- Use `waitForURL` or `waitForSelector` only when necessary

## storageState
- All tests in the `chromium` project inherit `.auth/user.json` — they start pre-authenticated
- Tests that exercise the login UI must clear inherited state:
  ```ts
  test.use({ storageState: { cookies: [], origins: [] } });
  ```
- `auth.setup.ts` skips login if `.auth/user.json` already exists
- To force fresh auth: `npm run auth:refresh`

## Environment Variables
- All credentials and URLs go in `.env`
- Access via `config` from `configs/env.ts` — never `process.env` directly
- Never hardcode credentials in tests or page objects
- Avoid `USERNAME` — reserved by Windows; use `LOGIN_USERNAME`
- `API_BASE_URL` — base URL for the REST API under test; consumed by the `api` project in `playwright.config.ts` as `use.baseURL`

## Test Structure
- Tests are organised by type under `tests/`:
  - `tests/ui/` — browser-based UI specs
  - `tests/api/` — API specs (feature-based subdirectories)
  - `tests/auth.setup.ts` — infrastructure, stays at root
- Use `test.describe()` to group by feature
- Test title format: `[Action] should <expected outcome>`
- Keep test body to: navigate → act → assert → log

## API Testing

### Layer architecture
```
Test (tests/api/<feature>/*.spec.ts)
  └── imports fixture from fixtures/api.fixtures.ts
        └── BookingService  (api/services/<feature>/<feature>.service.ts)
              └── BaseClient  (api/clients/base.client.ts)
                    └── Playwright APIRequestContext
                          └── resolves baseURL from playwright.config.ts api project
```

### Rules
- Never hardcode paths in tests or services — all endpoint paths live in `api/endpoints/<feature>.endpoints.ts`
- `BaseClient` receives `APIRequestContext` via fixture; Playwright resolves `baseURL` automatically
- Service methods return `APIResponse` — tests assert on both status and body
- The `api` Playwright project has its own `testDir: ./tests/api` and `use.baseURL: API_BASE_URL`
- The `api` project has **no `dependencies`** — it never needs browser auth state
- The `chromium` project uses `testIgnore: '**/api/**'` to prevent it from picking up API specs

### Adding a new API feature
Follow this 5-file pattern:
1. `api/endpoints/<feature>.endpoints.ts` — path constants
2. `api/services/<feature>/<feature>.types.ts` — TypeScript interfaces
3. `api/services/<feature>/<feature>.service.ts` — service methods using `BaseClient` + endpoints
4. `fixtures/api.fixtures.ts` — add fixture property, inject new service
5. `tests/api/<feature>/<test-name>.spec.ts` — import from `fixtures/api.fixtures`

---

## Allure Report

- Reporter configured in `playwright.config.ts` with `resultsDir: 'allure-results'`
- Results are written automatically on every test run (CLI or IDE extension)
- `allure-results/` and `allure-report/` are gitignored — never commit them

### Scripts
| Script | Purpose |
|---|---|
| `npm run allure:serve` | Generate + open report in browser (recommended) |
| `npm run allure:generate` | Generate report to `allure-report/` |
| `npm run allure:open` | Open a previously generated report |
| `npm run allure:clean` | Wipe `allure-results/` and `allure-report/` |

### Workflow
```
Run tests (npm test or IDE extension)
npm run allure:clean      # clear stale results first if running selective tests
npm run allure:serve      # generate + open
```

> The VS Code Playwright extension does **not** trigger `globalSetup`, so `allure-results/` accumulates across IDE runs. Always run `allure:clean` before viewing a selective run.

---

# Change Propagation Rules

When modifying shared or reusable components, always analyze downstream impact.

This includes:
- environment variables
- shared config values (`configs/env.ts`)
- utilities (`utils/`)
- fixtures (`fixtures/`)
- page objects (`pages/`)
- API clients, endpoints, and services (`api/`)
- folder structure

When changes affect shared functionality:
1. Scan the codebase for affected references
2. Update dependent files consistently
3. Verify naming and import consistency

Examples:

- Renaming an env variable (e.g. `PASSWORD` → `LOGIN_PASSWORD`)
  requires updating: `.env`, `configs/env.ts`, all test/page references

- Moving or renaming a folder
  requires updating: all imports and `CLAUDE.md` if folder structure is documented

Do not stop after modifying a single file when shared dependencies exist.

---

# Git Rules

## Before Every Commit

Scan all staged files for sensitive data before committing. This includes:
- Hardcoded credentials (usernames, passwords, tokens, API keys)
- Real environment values (URLs with embedded auth, secrets)
- Session data or cookies

Files that commonly leak credentials in this project:
- `README.md` — setup examples must use placeholders, not real values
- `.env.example` — must show placeholders only, never real credentials

## Safe Patterns

✅ Always safe to commit:
```ts
process.env.LOGIN_USERNAME   // reads from .env at runtime
config.username              // reads from configs/env.ts
```

❌ Never commit:
```
LOGIN_PASSWORD=<actual_password>   // real credential hardcoded in docs
```

✅ Use placeholders in docs and examples:
```
LOGIN_USERNAME=<username>
LOGIN_PASSWORD=<password>
```

## Files That Must Never Be Committed
- `.env` — real credentials
- `.auth/user.json` — live session cookies
- `logs/` — runtime output

These are covered by `.gitignore` — do not remove them from it.

---

---

# Engineering Principles

## 1. Think Before Coding

Do not assume. Surface tradeoffs clearly.

Before implementing:
- State assumptions explicitly
- Ask questions when uncertain
- Push back on unnecessary complexity

If something is unclear — stop and ask.

---

## 2. Simplicity First

Write the minimum code necessary.

- No speculative features
- No unnecessary abstractions
- No overengineering
- Prefer readability over cleverness

Ask: *"Would a senior engineer consider this overcomplicated?"* — if yes, simplify.

---

## 3. Surgical Changes

Touch only what is necessary.

- Do not refactor unrelated code
- Do not change unrelated formatting
- Match the existing project style
- Mention unrelated issues found — do not fix them unless asked

---

## 4. Goal-Driven Execution

Define clear success criteria before implementing.

- "Fix the bug" → reproduce and verify the fix
- "Add validation" → write checks and verify behavior
- "Refactor" → ensure behavior is unchanged before and after

Prefer verifiable outcomes. Avoid vague completion criteria.

---

# Available Agents

## qa-sentinel

A specialised sub-agent for Playwright TypeScript automation tasks.

**Definition:** `.claude/agents/qa-sentinel.md`
**Memory:** `.claude/agent-memory/qa-sentinel/`

**Invoke with:** `@agent-qa-sentinel <request>`

**Use for:**
- Writing or reviewing page objects, fixtures, and test specs
- Diagnosing flaky tests or synchronization failures
- Refactoring automation code with downstream impact analysis
- Enforcing POM conventions, locator strategy, and import rules

**Do not use for:** general TypeScript, infrastructure changes, or non-test code.

## qa-scribe

A specialised sub-agent for generating Excel test case documentation from Playwright specs.

**Definition:** `.claude/agents/qa-scribe.md`
**Memory:** `.claude/agent-memory/qa-scribe/`

**Invoke with:** `@agent-qa-scribe <request>`

**Use for:**
- Converting automation tests into manual test cases
- Producing one Excel file in `qa-docs/` per requested suite type (e.g. `qa-docs/regression-testcases.xlsx`)
- Documenting preconditions, steps, expected results, and source file references

**Output naming:** `qa-docs/<type>-testcases.xlsx` — appends `-v2`, `-v3` if file already exists.

**Do not use for:** multi-file exports or raw TypeScript reporting.

---

# Expected AI Behavior

When implementing:
- Reuse existing architecture and patterns
- Keep implementations readable and beginner-friendly
- Follow Playwright best practices
- Respect the existing framework style

When refactoring:
- Perform dependency analysis first
- Propagate changes safely across all affected files

When unsure:
- Ask before implementing
- Surface assumptions clearly
- Suggest alternatives if appropriate
