# Test Report - Verified Status (March 5, 2026)

## Current Summary

- Total test files: 14
- Total passing suites: 14/14
- Total passing tests: 144/144
- Backend: 4 suites, 21 tests
- Frontend: 3 suites, 9 tests
- Web (apps/web): 7 suites, 114 tests (button/link tests)
- Coverage collected: yes (backend and frontend)

## Verified Test Inventory

### Backend (`backend/src`)

```text
auth/auth.service.spec.ts           -> 7 tests
posts/posts.service.spec.ts         -> 7 tests
analytics/analytics.service.spec.ts -> 4 tests
admin/admin.service.spec.ts         -> 3 tests
```

### Frontend (`frontend/src`)

```text
services/auth.service.spec.ts  -> 3 tests
app/auth/login/page.spec.tsx   -> 3 tests
app/dashboard/page.spec.tsx    -> 3 tests
```

### Web App (`apps/web/src`) — Button & Link Tests

```text
components/__tests__/Navbar.spec.tsx            -> 14 tests (logo, CTAs, dropdowns, mobile hamburger)
components/__tests__/Footer.spec.tsx            -> 54 tests (all 49 footer links + logo + 4 social links)
app/__tests__/landing.spec.tsx                  ->  9 tests (hero CTAs, pricing CTAs, bottom CTA, Navbar/Footer)
app/__tests__/login.spec.tsx                    ->  9 tests (logo, Google btn, submit, show/hide, demo fill, signup link, inputs)
app/__tests__/signup.spec.tsx                   -> 10 tests (logo, Google btn, submit, show/hide, Terms, Privacy, login link, inputs)
app/__tests__/dashboard-layout.spec.tsx         -> 12 tests (sidebar nav 9 links, upgrade, sign out, user info)
app/__tests__/dashboard-page.spec.tsx           ->  6 tests (create post, AI studio, 4 quick actions, view all, stats)
```

---

## Execution Evidence

### Backend run

```text
PASS  src/admin/admin.service.spec.ts
PASS  src/posts/posts.service.spec.ts
PASS  src/auth/auth.service.spec.ts
PASS  src/analytics/analytics.service.spec.ts

Test Suites: 4 passed, 4 total
Tests:       21 passed, 21 total
```

### Frontend run

```text
PASS  src/services/auth.service.spec.ts
PASS  src/app/auth/login/page.spec.tsx
PASS  src/app/dashboard/page.spec.tsx

Test Suites: 3 passed, 3 total
Tests:       9 passed, 9 total
```

### Web App (apps/web) — Button & Link Tests

```text
PASS  src/components/__tests__/Navbar.spec.tsx
PASS  src/components/__tests__/Footer.spec.tsx
PASS  src/app/__tests__/landing.spec.tsx
PASS  src/app/__tests__/login.spec.tsx
PASS  src/app/__tests__/signup.spec.tsx
PASS  src/app/__tests__/dashboard-layout.spec.tsx
PASS  src/app/__tests__/dashboard-page.spec.tsx

Test Suites: 7 passed, 7 total
Tests:       114 passed, 114 total
```

### Coverage runs

```text
Backend: npm run test:coverage
All files: Statements 100% | Branches 92.85% | Functions 100% | Lines 100%
Status: PASSED

Frontend: npm run test:coverage
All files: Statements 94.44% | Branches 100% | Functions 84.61% | Lines 94.44%
Status: PASSED
```

## Coverage Metrics

| App | Statements | Branches | Functions | Lines | Threshold Status |
|-----|------------|----------|-----------|-------|------------------|
| Backend | 100% | 92.85% | 100% | 100% | Pass |
| Frontend | 94.44% | 100% | 84.61% | 94.44% | Pass |

---

## Correct Run Commands

### Backend

```powershell
Set-Location backend
npm test
npm run test:coverage
npm run test:watch
```

### Frontend

```powershell
Set-Location frontend
npm test
npm run test:coverage
npm run test:watch
```

### Web App (apps/web)

```powershell
Set-Location apps/web
npm test
npm run test:watch
```

Note: `test:cov` script is not defined. Use `test:coverage`.

---

## Known Gaps

1. No blocking test/coverage gaps currently identified.

## Next Steps

1. Trigger CI on next push/PR and verify both jobs pass on GitHub Actions.
