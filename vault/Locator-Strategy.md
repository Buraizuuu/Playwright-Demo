# Locator Strategy

## Preferred Order
| Priority | Locator | When to Use |
|---|---|---|
| 1 | `getByRole()` | Buttons, links, headings, inputs with roles |
| 2 | `getByLabel()` | Form fields with visible labels |
| 3 | `getByPlaceholder()` | Inputs with placeholder text |
| 4 | `getByTestId()` | Elements with `data-testid` attributes |
| 5 | `locator('css')` | When no semantic locator is available |
| 6 | XPath | Last resort only |

## What to Avoid
- `nth-child` — breaks when order changes
- Dynamic class names — changes across builds
- Long CSS chains — brittle and hard to read
- Hardcoded indexes — fragile

## Real Examples from This Project

```ts
// login.page.ts — CSS used because OrangeHRM lacks semantic attributes
page.locator('input[name="username"]')
page.locator('input[name="password"]')
page.locator('button[type="submit"]')
```

```ts
// login.spec.ts — role-based assertion for the dashboard heading
page.getByRole('heading', { name: 'Dashboard' })
```

## Notes
- OrangeHRM's login form doesn't expose `data-testid` or `aria-label`
- `input[name="..."]` is stable and acceptable here as a fallback
- Always check DevTools before picking a locator strategy
