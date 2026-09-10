# Task 1 Report: Central tier commission configuration and immutable snapshots

## Outcome

- Added `CommissionSettingsRepository` backed by versioned `admin_settings` key `commission.tiers.v1`, with canonical defaults, validation, persistence, labels, and computed instructor percentages.
- Added `CommissionService` as the single allocation arithmetic owner. Its quote returns tier, gross, platform percentage/amount, and instructor percentage/amount, with monetary sides summing to gross.
- Added authenticated instructor tier read API and Admin-only validated update API. Admin revenue responses now include the canonical tier collection.
- Added `partnership_tier` to `revenue_allocations`, including one-time course-based metadata backfill for historical rows.
- Updated payout creation so `teacher_payouts`, `revenue_allocations`, and instructor transactions are created from one quote and retain immutable financial snapshots.
- Updated standard and development refunds to use the stored allocation snapshot first and stored teacher payout amount as the only legacy fallback. Current configuration, course tier, and hard-coded percentages are never used for historical refund deductions.
- Updated Admin reporting to use allocation/payout snapshots, return stored percentages and amounts, and avoid current-configuration or hard-coded financial fallbacks.
- Added Admin tier editing UI with computed instructor complement and edit preservation on save errors.
- Updated instructor course pricing to fetch API tier labels/percentages, calculate from returned definitions, and show explicit loading/failure states without hiding tier selection.
- Removed user-visible hard-coded commission percentages from Admin, instructor pricing, and instructor revenue UI, plus the demo revenue generator's embedded financial arithmetic.
- Preserved the unrelated 10% course-progress refund eligibility threshold.

## TDD evidence

- Backend RED: `6 failed, 2 passed (27 assertions)`; failures were the missing tier routes/service, Admin update, historical snapshot fields, refund snapshot behavior, and canonical revenue fields.
- Backend GREEN: `8 passed (59 assertions)` in `40.12s`.
- Frontend RED: `2 files failed, 4 tests failed`.
- Frontend GREEN: `2 files passed, 4 tests passed` in `11.94s`.

## Verification

- Backend: `php artisan test tests/Feature/CommissionConfigurationTest.php tests/Feature/InstructorPayoutTest.php tests/Feature/AdminRevenueApiTest.php` via the local PHP test container and MySQL test database — 8 passed, 59 assertions.
- Frontend: `npm test -- src/features/admin/components/__tests__/AdminRevenueView.test.tsx src/features/instructor/create-course/components/__tests__/Step3SettingsPrice.test.tsx` — 4 passed.
- TypeScript: `npx tsc --noEmit` — exit 0.
- Targeted ESLint: 0 errors; four existing ignore-pattern warnings for create-course files.
- `git diff --check` — clean.
- Targeted runtime/user-visible scan for `0.15`, `0.30`, `0.70`, `0.85`, and equivalent commission copy — no financial-path matches outside canonical defaults/tests/nonfinancial values.

## Concerns

- PHP is not installed on the host; backend verification used the available `codex-mindnova-php:test` Docker image and `mindnova-test-db` container.
- Vitest prints its existing Vite native-config compatibility warning; tests still pass.
