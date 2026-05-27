# Known Issues

## Resolved

| # | Issue | Fix | Date |
|---|---|---|---|
| 1 | `process.env.USERNAME` resolved to Windows system username instead of `.env` value | Renamed to `LOGIN_USERNAME` in `.env` and `login.spec.ts` | 2026-05-27 |

## Active Issues
None.

## Notes
- Windows reserves the `USERNAME` environment variable — dotenv will not override it
- Always check for reserved env var names when running on Windows:
  - `USERNAME` → use `LOGIN_USERNAME`
  - `PATH`, `TEMP`, `TMP`, `APPDATA` — avoid overriding these
