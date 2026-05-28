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

## Automation Coverage Gaps (updated 2026-05-28)

- TC-AUTH-002 through TC-AUTH-004 are now automated (wrong password, wrong username, empty fields) — reflected in testcases-v2.xlsx
- TC-AUTH-005 and TC-AUTH-006 (empty username only / empty password only) remain Not Automated
- No unauthenticated Dashboard access scenario automated (TC-DASH-002 remains Not Automated)
- Dashboard assertions cover URL + heading only — no widget/content assertions (TC-DASH-003 remains Not Automated)

## qa-docs Output

```
qa-docs/
├── testcases.xlsx      (9 TCs total, v1 — superseded)
└── testcases-v2.xlsx   (9 TCs total: TC-AUTH-001 to TC-AUTH-006, TC-DASH-001 to TC-DASH-003)
```

Generated: testcases.xlsx on 2026-05-28 (v1, superseded).
Generated: testcases-v2.xlsx on 2026-05-28 via update request — reflects new `Authentication — Invalid Login` describe block (TC-AUTH-002 through TC-AUTH-004 upgraded from Not Automated to Automated).

## Next Available IDs

- Authentication: TC-AUTH-007 onwards
- Dashboard: TC-DASH-004 onwards

**Why:** TC IDs are stable across versions — testcases-v2 reuses TC-AUTH-001 through TC-DASH-003 with updated automation statuses. No new IDs were assigned.
**How to apply:** Always check existing artifacts before assigning new Test Case IDs to avoid duplicates.
