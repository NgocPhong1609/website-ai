# Local setup and test report — 2026-09-21

Source: `NgocPhong1609/website-ai`, commit `313caaa`; local branch `setup/local-test`.
Setup and test support only; application business logic and existing tests were not modified.

## Verified results

| Check | Result |
|---|---|
| Frontend locked dependencies | Installed, pnpm 11.25.0 / Node 22.23.2 |
| Backend locked dependencies | Installed, PHP 8.3 / Composer 2.7.1 |
| Database | MariaDB 10.11; app `website_ai_local`, tests `website_ai_testing` |
| Migrations / seed | 109 migrations, 8 users, 4 courses, 5 modules, 10 lessons |
| `pnpm build` | Passed, Next.js production build |
| `pnpm lint` | Passed |
| `pnpm exec tsc --noEmit` | Passed independently of ignoreBuildErrors |
| Backend `npm ci && npm run build` | Passed; Blade Vite manifest created |
| Frontend full tests, single worker | 104 passed, 2 failed, total 106 |
| Backend full tests after setup | 204 passed, 7 failed assertions, 68 errors, total 279 |
| `node scripts/smoke-local.mjs` | Passed |
| Chrome headless login | Student → `/explore`; teacher → `/instructor`; no pageerror observed |
| Public catalog via Next.js API proxy | HTTP 200 with array response |
| Auth boundary | Unauthenticated profile 401; student/teacher admin users request 403 |

The backend is not fully green. Passing boot/login checks does not establish that
all application features work. Third-party AI, payment, R2, SMTP and realtime
delivery were not live-tested. No admin demo account exists by default.

## Frontend test findings

1. `mindnova-ai/src/features/chat/components/__tests__/ChatMessageBubble.test.tsx:31`
   expects `bg-[#EFF6FF]`, while the rendered component uses `bg-blue-50/80`.
   This is a stale style assertion, not proof that teacher identity is missing.
2. `mindnova-ai/src/features/student/history/components/__tests__/LearningHistory.test.tsx:52`
   expects old loading text; the component now renders a skeleton.
3. The initial full parallel run had 103 passed / 3 failed. The additional failure
   in `ChatPanelQuota.test.tsx` could not find the Send message button before its
   wait timed out. All 5 quota tests passed on focused and full single-worker
   reruns. Treat this as a timing-sensitive test requiring further diagnosis,
   not a confirmed quota enforcement defect.

## Backend test findings

Remaining failing assertions:

- `AdminCouponApiTest`: admin coupon creation returns 500 because `instructor_id`
  has no default value.
- `Api/ProfileApiTest`: settings endpoint returns 404.
- `Auth/AuthenticationTest`: expected `/dashboard`, actual `/client/dashboard`.
- `Auth/RegistrationTest`: legacy registration fails on unknown named parameter
  `absolute` in the redirect call.
- `ChatTeacherRoleTest`: expects `instructor`, actual sender role is `teacher`.
- `Instructor/R2UploadTest`: upload requires a configured R2 bucket; local setup
  has no real R2 credentials and this test does not isolate the integration.
- `RoleAccessTest`: expects obsolete `/api/admin/courses`; current endpoint is
  `/api/admin/content/courses`.

The 68 execution errors include duplicate `teacher` roles (21 tests), duplicate
role-user pivot rows, an existing category slug, use of `stripe` outside the
payment-method enum, and invalid published-version foreign keys. These are
fixture/schema alignment issues; constraints were not disabled to hide them.

Initial backend run on a pristine test database: 196 passed, 14 failed, 69 errors.
After building Blade assets, the ViteManifestNotFound failures disappeared.
One unit test initially queried an unmigrated database; it passed on the subsequent
run after feature tests had migrated it. Its test isolation still needs attention.

## Fresh-seed issues found by skill-assisted review

1. `website-MindNova-AI/database/seeders/DatabaseSeeder.php:11` suppresses model
   events. The three scenario users created by `StudentFlowTestSeeder.php:57`
   rely on the saved callback in `app/Models/User.php:200` to write role pivots.
   Runtime SQL and login confirmed all three `student.*@mindnova.com` users have
   null roles. The standard student/teacher accounts work.
2. The same seed event suppression leaves zero chat conversations for four seeded
   courses. The default seed does not exercise the normal Course/Enrollment
   initialization callbacks.
3. `website-MindNova-AI/database/seeders/InstructorSeeder.php:195` seeds published
   lessons without published versions; curriculum filtering in
   `app/Services/Student/CourseService.php:111` omits them. Runtime SQL found only
   1 of 10 lessons has a published version. The documented demo learning scenarios
   therefore need seed repairs before comprehensive end-to-end learning tests.
4. `website-MindNova-AI/tests/Feature/RoleAccessTest.php:39` tests a removed route,
   confirmed by the failing backend assertion above.

The student catalog loaded in Chrome, but a seed thumbnail references missing
`/images/sample-ai-course.jpg`; Next.js logged an invalid image response.

## Skills and evidence

Applied Superpowers systematic-debugging and verification-before-completion;
reviewed code-review-testing, code-review-breaking-changes, code-review-change-size
and code-review-context. The review skill's Rust/Codex-specific paths are not
requirements for this Laravel/Next.js project. Review was scoped to setup and
tests, not an exhaustive security audit. Promptfoo was not used because this run
does not evaluate live model outputs.

Commands and local credentials are documented in `docs/local-setup.md`.
Repeatable HTTP assertions are in `scripts/smoke-local.mjs`.
Machine-local detailed logs (not committed): `/tmp/website-ai-backend-final.log`,
`/tmp/website-ai-frontend-final.json`, `/tmp/website-ai-frontend-focused.log`,
`/tmp/website-ai-build.log`, `/tmp/website-ai-types.log`, `/tmp/website-ai-lint.log`.
Browser screenshot: `/tmp/website-ai-student.png`.
