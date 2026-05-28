---
name: project-qa-structure
description: QA documentation structure, module naming, and test suite scope for the Playwright-Demo project
metadata:
  type: project
---

## Test Suite Scope (as of 2026-05-28)

Two spec files exist under `tests/`:

| File | Role | Describe Block | Tests |
|---|---|---|---|
| `tests/login.spec.ts` | Authentication feature tests | `Authentication` | 1 automated test (positive login only) |
| `tests/dashboard.spec.ts` | Dashboard feature tests | `Dashboard` | 1 automated test (load verification) |

Note: `tests/auth.setup.ts` is infrastructure (not a test spec) and is excluded from manual test case generation.

## Module Naming

- `Authentication` — maps to `tests/login.spec.ts`; Test Case IDs use prefix `TC-AUTH-`
- `Dashboard` — maps to `tests/dashboard.spec.ts`; Test Case IDs use prefix `TC-DASH-`

## Standard Preconditions

- All `chromium` project tests inherit `.auth/user.json` — document as "user is pre-authenticated via stored session"
- `tests/login.spec.ts` explicitly clears storageState: `test.use({ storageState: { cookies: [], origins: [] } })` — login UI is exercised from scratch; precondition must state "no active session exists"

## Automation Coverage Gaps (identified 2026-05-28)

- No negative login scenarios automated (empty username, empty password, invalid credentials, wrong password)
- No unauthenticated Dashboard access scenario automated
- Dashboard assertions cover URL + heading only — no widget/content assertions

## qa-docs Output

```
qa-docs/
└── testcases.xlsx   (9 TCs total: TC-AUTH-001 to TC-AUTH-006, TC-DASH-001 to TC-DASH-003)
```

Generated: 2026-05-28 via `generate` request (all tests, single flat file).

## Next Available IDs

- Authentication: TC-AUTH-007 onwards
- Dashboard: TC-DASH-004 onwards

**Why:** First full-suite flat-file pass. These IDs must not be reused.
**How to apply:** Always check existing artifacts before assigning new Test Case IDs to avoid duplicates.
