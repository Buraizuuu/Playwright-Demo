---
name: project-qa-structure
description: QA documentation structure, module naming, and test suite scope for the Playwright-Demo project
metadata:
  type: project
---

## Test Suite Scope (as of 2026-05-28, updated 2026-05-28)

Two spec files exist under `tests/`:

| File | Role | Describe Block(s) | Tests |
|---|---|---|---|
| `tests/login.spec.ts` | Authentication feature tests | `Authentication` (1 test), `Authentication — Invalid Login` (3 tests) | 4 automated tests total |
| `tests/dashboard.spec.ts` | Dashboard feature tests | `Dashboard` | 1 automated test (load verification) |

Note: `tests/auth.setup.ts` is infrastructure (not a test spec) and is excluded from manual test case generation.

## Module Naming

- `Authentication` — maps to `tests/login.spec.ts`; Test Case IDs use prefix `TC-AUTH-`
- `Dashboard` — maps to `tests/dashboard.spec.ts`; Test Case IDs use prefix `TC-DASH-`

## Standard Preconditions

- All `chromium` project tests inherit `.auth/user.json` — document as "user is pre-authenticated via stored session"
- `tests/login.spec.ts` explicitly clears storageState: `test.use({ storageState: { cookies: [], origins: [] } })` — login UI is exercised from scratch; precondition must state "no active session exists"

## Automation Coverage (updated 2026-05-28)

All 9 test cases are fully automated as of testcases-v4.xlsx:

- TC-AUTH-001 through TC-AUTH-006: Automated (login.spec.ts)
- TC-DASH-001 through TC-DASH-003: Automated (dashboard.spec.ts)

No coverage gaps remain.

## qa-docs Output

```
qa-docs/
├── testcases.xlsx      (9 TCs total, v1 — superseded)
├── testcases-v2.xlsx   (9 TCs total: TC-AUTH-001 to TC-AUTH-006, TC-DASH-001 to TC-DASH-003 — superseded)
├── testcases-v3.xlsx   (9 TCs total: TC-AUTH-001 to TC-AUTH-006, TC-DASH-001 to TC-DASH-003 — superseded)
└── testcases-v4.xlsx   (9 TCs total: all Automation Status = Automated — current)
```

Generated: testcases.xlsx on 2026-05-28 (v1, superseded).
Generated: testcases-v2.xlsx on 2026-05-28 via update request — reflects new `Authentication — Invalid Login` describe block (TC-AUTH-002 through TC-AUTH-004 upgraded from Not Automated to Automated). Superseded.
Generated: testcases-v3.xlsx on 2026-05-28 — fresh full-suite generation, no new spec changes; suite type regression, sheet tab "regression". Superseded.
Generated: testcases-v4.xlsx on 2026-05-28 — TC-AUTH-005, TC-AUTH-006, TC-DASH-002, TC-DASH-003 upgraded from Not Automated to Automated; all 9 cases now fully automated.

## Next Available IDs

- Authentication: TC-AUTH-007 onwards
- Dashboard: TC-DASH-004 onwards

**Why:** TC IDs are stable across versions — testcases-v2 reuses TC-AUTH-001 through TC-DASH-003 with updated automation statuses. No new IDs were assigned.
**How to apply:** Always check existing artifacts before assigning new Test Case IDs to avoid duplicates.
