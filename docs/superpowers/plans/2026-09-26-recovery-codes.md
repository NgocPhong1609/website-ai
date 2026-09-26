# Recovery codes implementation plan

**Goal:** Replace email OTP password recovery with saved recovery codes and administrator fallback, preserving other features.
**Approved design:** User selected saved recovery codes plus administrator support on 2026-09-26.
**Architecture:** Dedicated recovery controller/service and additive credential table. Existing reset URL now accepts a recovery code. Profile creates saved codes; administrators issue expiring credentials after manual identity verification. Public support requests enter existing support tickets without granting access.
**Stack:** Laravel/Sanctum, Next.js/React, Pest/PHPUnit and Vitest.

## Constraints and contract
- No email delivery, dependency changes, login/register changes, or course/payment/media changes.
- Saved codes: eight cryptographically random 128-bit codes, printable hex grouped with hyphens; case/hyphen normalization. Store only SHA-256 digests (high-entropy random credentials). Show plaintext only on creation. Regeneration invalidates previous credentials.
- GET /api/profile/recovery-codes returns {remaining: number}. POST same URL accepts {current_password}, returns {codes: string[]}. Every role, authenticated and password reconfirmed; throttle.
- POST /api/reset-password accepts {email,recovery_code,password,password_confirmation}. Password: 8–128 chars, uppercase, digit and special character, matching existing change-password rules. Atomic one-time use under user row lock; invalidate all recovery credentials after successful reset, revoke Sanctum tokens, database sessions and remember token. No auto-login, unlock, or email change. Same error for missing user and invalid/expired code.
- POST /api/password-recovery/support accepts {email,contact,description}; lengths bounded, IP throttle, generic response regardless of existence. Create existing SupportTicket (other, open, null reporter, target only if matched). Admin must not trust requester-supplied contact as identity proof.
- POST /api/admin/users/{user}/password-recovery accepts {current_password,verification_note}; admin role middleware, own password confirmed, note >=20 chars. Refuse admin targets and locked targets. Issue one new random expiring code (30 minutes), replacing only earlier admin credentials. Return {reset_url,expires_at}; frontend URL /forgot-password#email=...&recovery_code=... . Audit actor/target/note but never raw credential/link. Issue does not change password; redemption revokes all credentials/sessions.
- Legacy send/verify OTP and profile request-otp endpoints return 410 without mail. Remove old OTP logic. Retain unrelated email features.
- UI: public recovery form and support request; shared RecoveryCodesPanel mounted in student security, teacher profile and admin users page. Admin action with password/verification note and one-time displayed link. Codes/secrets stay only component state, never localStorage; reset success clears auth storage/cookies. Hash link consumed and removed from address bar.

## Task 1: backend
- [ ] Write tests first: creation authentication/password gating, digest-only storage, rotation, valid reset, wrong/reused/expired code, no enumeration, no unlock, token/session revocation, admin role and reconfirmation/note, audit, generic support request and throttles; old OTP 410/no mail.
- [ ] Run tests and observe expected missing behavior failures.
- [ ] Add migration/model/service/controller/routes with contract above; use existing models and patterns.
- [ ] Run focused backend tests including login/register/password regressions. Only safe local DB, never production refresh.

## Task 2: frontend
- [ ] Replace obsolete OTP tests with saved-code reset/support flow tests, preserving login/register tests; add profile/admin component behavior tests.
- [ ] Observe failures before implementing.
- [ ] Implement UI contract above using existing color/layout/errors helpers.
- [ ] Run focused tests, frontend suite and build/type checks; record unrelated pre-existing failures separately.

## Task 3: review and delivery
- [ ] Document account migration (existing accounts must generate codes while signed in), manual verification requirements and fallback limitations.
- [ ] Review complete diff for scope/security/API consistency; fix findings and rerun affected tests.
- [ ] Report exact verified state and deployment status. Production deployment requires prior authorization evidence; do not assume a successful deploy from local tests.

## Implementation ledger
- Dedicated branch `feat/recovery-codes` from clean base `854f1a0`; existing task checkout reused to preserve installed test/build dependencies.
- Backend delegated through subagent-driven-development; frontend implemented by primary agent. Shared API contract is above. Backend owns only Laravel subtree; root owns frontend/docs.
- Interface check: reset form, code panel, admin panel and support form match endpoint paths and request/response fields; no shared implementation file edits.
- Frontend red: 4 recovery tests failed on old OTP UI, while 3 login/register tests passed. Panel red: 3 tests failed on absent recovery functionality. Green: recovery form 7/7 and panels 3/3.
- Ruling: new reset passwords match existing password-change complexity rules, because weaker reset passwords cannot pass unchanged current-password validation later.

## Final verification and review
- Frontend focused: 40 tests passed (authentication errors/recovery, security panel, admin recovery and error helpers).
- TypeScript `tsc --noEmit`: passed. Next production build: passed.
- Browser smoke: Chromium, 390px viewport, fragment consumption/reset/support with mocked API; passed without horizontal overflow.
- Full frontend: 32 files passed, 5 files failed (160 tests passed / 3 failed, plus two suite import failures). Every failing file reproduced on clean base 854f1a0: LearningHistory loading text, ChatMessageBubble styling, two quiz @shared import failures, environment-urls websocket config. These are unchanged and outside the requested scope.
- Backend full legacy auth suite cannot bootstrap all migrations on SQLite because of pre-existing MySQL-specific ALTER syntax. Isolated integration harness covers actual auth/recovery routes instead.
- Independent review identified an API-login/reset race. Fixed by serializing password validation and token issuance under the same user-row transaction.
- Independent MySQL8.4 concurrency probe: separate processes/connections, observed actual LOCK WAIT; fixed login returns401 with zero surviving tokens. Counterproof original login returns200 with a surviving token. 1 test / 8 assertions passed.
- Production read-only evidence showed SESSION_DRIVER=file. Added nullable per-account recovery version, captured on successful web Login and validated by web middleware; stale session rejection returns immediately. No global session invalidation. Added old/new/unrelated file-session tests.
- Independent reviewer approved latest recovery/session implementation after testing; final commit and deployment tracked in handoff/status.
