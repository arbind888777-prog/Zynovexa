# Security Review

Executive summary: the repo is not obviously leaking backend secrets from tracked source files right now, but there are still important deployment risks to fix before going public. I fixed two immediate issues: the deploy workflow now uses a pinned SSH action version, and command echoing was removed from deploy logs.

## High

### SBP-001
Severity: High
Location: [apps/web/.env.local](/C:/Users/dell/Desktop/zynovexa.app/apps/web/.env.local)
Evidence: `git ls-files` showed this local env file is currently tracked by git.
Impact: local env files are easy to accidentally commit with public or future-sensitive values, which can expose API endpoints, auth settings, or secrets if someone later adds a non-public value there.
Fix: remove this file from git tracking and keep it only as a local untracked env file.
Mitigation: keep only template values in [.env.example](/C:/Users/dell/Desktop/zynovexa.app/.env.example) and never store real secrets in any `NEXT_PUBLIC_*` variable.

### SBP-002
Severity: High
Location: [.github/workflows/deploy.yaml](/C:/Users/dell/Desktop/zynovexa.app/.github/workflows/deploy.yaml)
Evidence: the workflow previously used `appleboy/ssh-action@master`.
Impact: floating action refs can change unexpectedly and create supply-chain risk in CI/CD.
Fix: pin the action to a specific release.
Mitigation: prefer commit-SHA pinning for third-party GitHub Actions in production.

## Medium

### SBP-003
Severity: Medium
Location: [apps/web/src/stores/auth.store.ts](/C:/Users/dell/Desktop/zynovexa.app/apps/web/src/stores/auth.store.ts)
Evidence: access and refresh tokens are written to `localStorage`.
Impact: if the frontend ever gets an XSS bug, those tokens can be stolen directly from the browser.
Fix: move long-lived auth to secure `HttpOnly` cookies and avoid storing refresh tokens in browser storage.
Mitigation: keep CSP strict, avoid raw HTML injection, and reduce token lifetime.

### SBP-004
Severity: Medium
Location: [apps/api/src/main.ts](/C:/Users/dell/Desktop/zynovexa.app/apps/api/src/main.ts)
Evidence: `helmet()` is enabled, but no explicit CSP is configured in app code.
Impact: CSP is an important defense-in-depth layer against frontend XSS and script injection.
Fix: add a production CSP policy aligned with the actual frontend asset/script requirements.
Mitigation: if CSP is enforced at nginx/CDN instead, verify it at runtime before deployment.

## Notes

- Root local env and API local env contain real secrets on disk, but they do not appear to be tracked by git in the current repo state.
- Public client vars such as `NEXT_PUBLIC_SUPABASE_URL` are expected to be browser-visible; they are not secrets by themselves.
- This review cannot prove a hosted deployment is unhackable. It reduces obvious risks visible from the current codebase.
