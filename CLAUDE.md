# Claude Instructions

## Project Stack
- Playwright + TypeScript
- Page Object Model (POM)
- Winston logging
- dotenv for environment variables

---

# Project Context

Before generating or modifying code, always read:

- vault/Project-Overview.md
- vault/Framework-Architecture.md
- vault/Framework-Rules.md
- vault/Folder-Structure.md
- vault/Locator-Strategy.md
- vault/Reusable-Patterns.md
- vault/Known-Issues.md

Analyze the existing codebase structure before implementing changes.

---

# Key Framework Rules

## Imports
- Import `test` from `fixtures/` — never from `@playwright/test` directly
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

## Test Structure
- Use `test.describe()` to group by feature
- Test title format: `[Action] should <expected outcome>`
- Keep test body to: navigate → act → assert → log

---

# Change Propagation Rules

When modifying shared or reusable components, always analyze downstream impact.

This includes:
- environment variables
- shared config values (`configs/env.ts`)
- utilities (`utils/`)
- fixtures (`fixtures/`)
- page objects (`pages/`)
- folder structure

When changes affect shared functionality:
1. Scan the codebase for affected references
2. Update dependent files consistently
3. Verify naming and import consistency
4. Update related vault documentation

Examples:

- Renaming an env variable (e.g. `PASSWORD` → `LOGIN_PASSWORD`)
  requires updating: `.env`, `configs/env.ts`, all test/page references, vault docs

- Moving or renaming a folder
  requires updating: all imports, `Folder-Structure.md`, `Framework-Architecture.md`

Do not stop after modifying a single file when shared dependencies exist.

---

# Documentation Synchronization

When requested:
- Analyze the current codebase
- Update existing vault notes — do not create unnecessary new ones
- Keep vault in sync with the actual implementation

Focus on:
- reusable patterns
- framework architecture
- locator strategies
- important implementation decisions
- known issues

Avoid:
- noisy or redundant notes
- trivial implementation details

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

# Expected AI Behavior

When implementing:
- Reuse existing architecture and patterns
- Keep implementations readable and beginner-friendly
- Follow Playwright best practices
- Respect the existing framework style

When refactoring:
- Perform dependency analysis first
- Propagate changes safely across all affected files
- Keep vault documentation synchronized

When unsure:
- Ask before implementing
- Surface assumptions clearly
- Suggest alternatives if appropriate
