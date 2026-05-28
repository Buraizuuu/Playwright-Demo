<div align="center">

# 🎭 Playwright Demo

### End-to-end automation framework for OrangeHRM

[![Playwright](https://img.shields.io/badge/Playwright-1.60-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-ISC-blue)](#)

</div>

---

Playwright + TypeScript automation framework for [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com) using the Page Object Model.

---

## Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation |
| TypeScript | Type-safe test code |
| Winston | Structured logging |
| dotenv | Environment variable management |

---

## Project Structure

```
Playwright-Demo/
├── .auth/                  # Saved auth state — generated at runtime (gitignored)
├── configs/
│   ├── env.ts              # Typed config object — wraps .env values
│   ├── global-setup.ts     # Logs SUITE START before all tests
│   └── global-teardown.ts  # Logs SUITE END after all tests
├── fixtures/
│   └── index.ts            # Extended test — injects page objects
├── pages/
│   ├── login.page.ts       # LoginPage — locators + actions
│   └── dashboard.page.ts   # DashboardPage — locators + actions + verify
├── tests/
│   ├── auth.setup.ts       # Logs in once and saves storageState
│   ├── login.spec.ts       # Tests the login UI flow
│   └── dashboard.spec.ts   # Tests dashboard using saved auth state
├── utils/
│   └── logger.ts           # Winston logger (console + file output)
├── logs/                   # Runtime logs — gitignored
├── qa-docs/                # Generated QA artifacts and test case output
├── .claude/                # Claude agent definitions and memory
├── .env                    # Credentials — never committed
└── playwright.config.ts    # Playwright configuration
```

---

## Setup

**1. Install dependencies**
```bash
npm install
```

**2. Install Playwright browsers**
```bash
npx playwright install
```

**3. Create `.env` file** (copy from `.env.example` and fill in your credentials)
```
BASE_URL=https://opensource-demo.orangehrmlive.com
LOGIN_USERNAME=<username>
LOGIN_PASSWORD=<password>
```

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests |
| `npm run test:ui` | Open Playwright UI mode |
| `npx playwright test --project=chromium` | Run chromium project only |
| `npx playwright test tests/login.spec.ts` | Run login spec only |
| `npx playwright test tests/dashboard.spec.ts` | Run dashboard spec only |
| `npx playwright show-report` | Open last HTML report |

---

## Test Coverage

| Spec File | Describe | Test |
|---|---|---|
| `login.spec.ts` | Authentication | `[Login] should allow user access with valid credentials` |
| `login.spec.ts` | Authentication — Invalid Login | `[Login] should display error when wrong password is provided` |
| `login.spec.ts` | Authentication — Invalid Login | `[Login] should display error when wrong username is provided` |
| `login.spec.ts` | Authentication — Invalid Login | `[Login] should display required field errors when both fields are empty` |
| `dashboard.spec.ts` | Dashboard | `[Dashboard] should load for authenticated user` |

---

## Auth State (storageState)

Tests run against a pre-authenticated browser context to skip login on every test.

**How it works:**
1. The `setup` project runs `auth.setup.ts` — logs in once and saves `.auth/user.json`
2. All tests in the `chromium` project load that saved state automatically
3. `auth.setup.ts` skips the login if `.auth/user.json` already exists

**To generate a fresh auth state:**
```bash
npm run auth:refresh
```

> Tests that specifically test the login UI (e.g. `login.spec.ts`) clear the inherited state with `test.use({ storageState: { cookies: [], origins: [] } })`.

---

## Logs

Logs are written to `logs/` at runtime (gitignored).

| File | Content |
|---|---|
| `logs/info.log` | Info-level messages |
| `logs/error.log` | Error-level messages |
| `logs/test.log` | All levels — full execution trace |

**To clear all log files:**
```bash
npm run logs:clear
```

---

## Claude Code Agents

This project includes custom Claude Code agents for automation and QA documentation.

**Available agents:**
- `qa-sentinel` — specialized for Playwright TypeScript automation engineering
- `qa-scribe` — converts automation tests into manual Excel test case artifacts

**Invoke them with:**
```
@agent-qa-sentinel <your request>
@agent-qa-scribe <request for manual test cases>
```

**What they handle:**
- `qa-sentinel`: writing and reviewing page objects, fixtures, and tests
- `qa-sentinel`: diagnosing flaky tests and synchronization issues
- `qa-sentinel`: refactoring automation code with full dependency analysis
- `qa-sentinel`: enforcing project conventions (locator priority, import rules, POM structure)
- `qa-scribe`: generating one Excel test case file in `qa-docs/` from the tests directory

The agent definitions live at `.claude/agents/qa-sentinel.md` and `.claude/agents/qa-scribe.md`, with memory in `.claude/agent-memory/`.

---

## QA Docs

The `qa-docs/` folder contains generated QA artifacts and manual test case output.

**Example file:**
- `qa-docs/testcases.xlsx`

**How it works:**
- `qa-scribe` reads the `tests/` directory
- It converts automation flows into a single Excel test case document
- Generated files are written to `qa-docs/`

> The `qa-docs/` folder is used for manual test case artifacts, not runtime test results.
