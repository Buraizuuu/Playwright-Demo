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
| `npx playwright test tests/login.spec.ts` | Run a single spec file |
| `npx playwright show-report` | Open last HTML report |

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

## Claude Code Agent

This project includes a custom Claude Code agent — **qa-sentinel** — specialised for Playwright TypeScript automation.

**Invoke it with:**
```
@agent-qa-sentinel <your request>
```

**What it handles:**
- Writing and reviewing page objects, fixtures, and tests
- Diagnosing flaky tests and synchronization issues
- Refactoring automation code with full dependency analysis
- Enforcing all project conventions (locator priority, import rules, POM structure)

The agent definition lives at `.claude/agents/qa-sentinel.md` and its persistent memory at `.claude/agent-memory/qa-sentinel/`.

---

## Vault (Obsidian Docs)

The `vault/` folder contains framework documentation written in Markdown, designed to be opened in [Obsidian](https://obsidian.md).

**To open in Obsidian:**
1. Download and install [Obsidian](https://obsidian.md)
2. Click **Open folder as vault**
3. Select the `vault/` folder inside this project

**Notes:**
| File | Contents |
|---|---|
| `Project-Overview.md` | Stack, app under test, credentials, run commands |
| `Framework-Architecture.md` | Layer diagram, execution flow, file roles |
| `Framework-Rules.md` | Naming conventions, page object rules, test rules |
| `Folder-Structure.md` | Full directory tree with descriptions |
| `Locator-Strategy.md` | Locator priority order with real examples |
| `Reusable-Patterns.md` | Copy-paste patterns for pages, fixtures, config, logger |
| `Known-Issues.md` | Windows env var conflicts and resolved bugs |
