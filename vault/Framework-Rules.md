# Framework Rules

## General Rules
- Use Playwright with TypeScript only
- Follow simple Page Object Model — one file per page
- Keep the framework beginner-friendly and scalable
- No overengineering — add complexity only when needed

## File Naming
| Type | Convention | Example |
|---|---|---|
| Page Object | `<page>.page.ts` | `login.page.ts` |
| Test Spec | `<feature>.spec.ts` | `login.spec.ts` |
| Fixture | `index.ts` inside `fixtures/` | `fixtures/index.ts` |

## Page Object Rules
- Locators are declared in the constructor
- Methods contain actions only (fill, click, navigate)
- Use `readonly` for all locator properties
- Use `navigate()` as the standard method name for page navigation
- Page objects may contain `verify*()` methods that wrap assertions when it improves test readability
  — e.g. `verifyDashboardLoaded()` — this is a deliberate tradeoff for cleaner test bodies

## Locator Rules
- Prefer `getByRole` → `getByLabel` → `getByPlaceholder` → `getByTestId` → CSS
- Avoid XPath unless absolutely necessary
- Avoid `nth-child`, dynamic classes, or long CSS chains

## Test Rules
- Import `test` from `fixtures/` — never directly from `@playwright/test`
- Import `config` from `configs/env` — never use `process.env` directly in tests
- Use `test.describe()` to group tests by feature
- Keep test titles in format: `[Action] should <expected outcome>`

## Wait Rules
- Never use `waitForTimeout` (hardcoded sleeps)
- Rely on Playwright's built-in auto-waiting
- Use `waitForURL` or `waitForSelector` only when necessary

## Environment Rules
- All credentials and URLs go in `.env`
- Access them via `config` from `configs/env.ts` — not `process.env` directly
- Never hardcode sensitive values in test or page files
- Avoid the variable name `USERNAME` — it is reserved by Windows
