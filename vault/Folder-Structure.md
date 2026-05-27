# Folder Structure

## Current Structure
```
Playwright-Demo/
├── .auth/                  # Saved auth state — generated at runtime (gitignored)
│   └── user.json           # Cookies + localStorage from setup project login
├── configs/
│   ├── env.ts              # Typed config object — reads from .env
│   ├── global-setup.ts     # Suite start boundary — logs SUITE START
│   └── global-teardown.ts  # Suite end boundary — logs SUITE END
├── fixtures/
│   └── index.ts            # Extended test with page object fixtures
├── pages/
│   ├── login.page.ts       # LoginPage POM
│   └── dashboard.page.ts   # DashboardPage POM
├── tests/
│   ├── auth.setup.ts       # Setup project — logs in and saves storageState
│   ├── login.spec.ts       # Login test spec (clears storageState)
│   └── dashboard.spec.ts   # Dashboard test spec (uses storageState)
├── utils/
│   └── logger.ts           # Winston logger (console + file output)
├── logs/                   # Runtime log output (gitignored)
│   ├── info.log            # Info-level messages only
│   ├── error.log           # Error-level messages only
│   └── test.log            # All levels — full test execution trace
├── .env                    # Environment variables (not committed)
├── CLAUDE.md               # Claude AI instructions
├── playwright.config.ts    # Playwright configuration
├── package.json
└── tsconfig.json
```

## Folder Descriptions
| Folder | Purpose |
|---|---|
| `configs/` | All configuration — env object, global setup hook, global teardown hook |
| `fixtures/` | Extended `test` object — injects page objects into tests |
| `pages/` | Page Object Models — locators + actions per page |
| `tests/` | Test specs — test flow and logging only |
| `utils/` | Reusable helpers — logger and future utilities |
| `data/` | Static test data in JSON format (not yet created) |

## Rules
- One page object per application page
- Test files should not contain locators
- Fixtures replace repetitive `beforeEach` blocks
