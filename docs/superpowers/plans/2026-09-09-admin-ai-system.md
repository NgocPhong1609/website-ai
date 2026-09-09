# Admin AI System Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a truthful, secure, responsive Admin AI System whose Free/Premium limits apply to AI Tutor while preserving the existing primary-to-backup AI topology.

**Architecture:** Extend the current `AdminSetting` and `AiUsageLog` paths with focused repositories/services and a versioned JSON entitlement setting. Keep provider credentials in Laravel config and expose only computed readiness; aggregate local usage with explicit provenance and nullable cost. Replace the monolithic frontend screen with one canonical contract and small presentational sections, then add a read-only summary to the repaired Admin Overview.

**Tech Stack:** PHP 8.3, Laravel 13, Pest 4, MySQL/SQLite test database, Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Vitest/Testing Library, Recharts.

**Spec:** `docs/superpowers/specs/2026-09-09-admin-ai-system-design.md`

## Global Constraints

- Work directly on branch `VipTeacher` as explicitly approved by the user.
- Preserve the existing primary-AI-to-backup runtime topology and fallback order.
- Do not return API secrets, key suffixes, authorization headers, or arbitrary connection payloads to the frontend.
- Never manufacture token, quota, or cost values; unavailable values are nullable and visibly labeled unavailable.
- Extend existing AI configuration and usage structures; do not create a parallel provider platform.
- Use migrations for every schema change.
- Keep changes surgical and write a failing behavior test before production code.
- Do not redesign payment or subscription lifecycle; use existing `free` and `premium` plan strings.

## File map

- `website-MindNova-AI/app/Settings/AiSettingsRepository.php`: typed defaults, compatibility reads, package resolution, prompt persistence.
- `website-MindNova-AI/app/Services/Ai/AiUsageSummaryService.php`: period-safe aggregation and truthful nullable cost semantics.
- `website-MindNova-AI/app/Http/Requests/Admin/UpdateAiConfigRequest.php`: strict writable contract.
- `website-MindNova-AI/app/Http/Controllers/Api/Admin/SystemConfigController.php`: compose config/readiness/usage; delegate writes.
- `website-MindNova-AI/app/Http/Controllers/Api/Student/AiTutorController.php`: consume package entitlement and log trustworthy operational metadata.
- `website-MindNova-AI/app/Services/Ai/{AbstractAiService,AiRouterService,GeminiAiService,BackupAiService}.php`: preserve topology while enriching sanitized usage provenance.
- `website-MindNova-AI/database/migrations/2026_09_09_000001_extend_ai_usage_logs_for_observability.php`: nullable observability columns.
- `website-MindNova-AI/app/Models/AiUsageLog.php`: casts/fillable for new columns.
- `website-MindNova-AI/routes/api.php`: repair Admin Overview route only; retain AI config routes.
- `website-MindNova-AI/tests/Feature/AdminAiSystemApiTest.php`: admin contract, auth, validation, secrets, aggregation.
- `website-MindNova-AI/tests/Feature/Student/AiTutorEntitlementTest.php`: package selection and quota behavior.
- `website-MindNova-AI/tests/Feature/AiUsageObservabilityTest.php`: token/cost provenance and fallback metadata.
- `mindnova-ai/src/features/admin/ai-system/types.ts`: canonical frontend contract.
- `mindnova-ai/src/features/admin/ai-system/validation.ts`: pure client validation.
- `mindnova-ai/src/features/admin/components/AdminAiSystemPage.tsx`: data/state coordinator.
- `mindnova-ai/src/features/admin/components/ai-system/*.tsx`: usage, providers, packages, prompts, save/status UI.
- `mindnova-ai/src/features/admin/components/__tests__/AdminAiSystemPage.test.tsx`: route behavior tests.
- `mindnova-ai/src/features/admin/components/{AdminDashboardShell,AdminSidebar,AdminTopbar}.tsx`: responsive shell and removal of false telemetry.
- `mindnova-ai/app/admin/page.tsx`, `mindnova-ai/src/features/admin/components/AdminOverviewPage.tsx`, `mindnova-ai/src/features/admin/services/admin-overview.service.ts`: true overview and AI summary.
- `mindnova-ai/src/features/admin/services/admin-module-data.service.ts`, `mindnova-ai/src/features/admin/types.ts`: retire only obsolete AI contract while preserving unrelated module types.

---

### Task 1: Canonical AI settings and package entitlements

**Files:**
- Create: `website-MindNova-AI/app/Settings/AiSettingsRepository.php`
- Create: `website-MindNova-AI/app/Http/Requests/Admin/UpdateAiConfigRequest.php`
- Modify: `website-MindNova-AI/app/Http/Controllers/Api/Admin/SystemConfigController.php`
- Test: `website-MindNova-AI/tests/Feature/AdminAiSystemApiTest.php`

**Interfaces:**
- Produces: `AiSettingsRepository::packages(): array`, `prompts(): array`, `packageForUser(?User): string`, `saveWritable(array): void`, `providerReadiness(): array`.
- Produces: canonical `GET /api/admin/ai-config?period=7d|30d` top-level keys `providers`, `usage`, `packages`, `prompts`, `updated_at`.
- Consumes later: Tasks 2, 3, 5 and 6 use this response and repository.

- [ ] **Step 1: Write failing admin authorization, shape, and secret-absence tests**

```php
it('returns the canonical config without secret material', function () {
    config()->set('services.gemini.api_key', 'never-return-this');
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->getJson('/api/admin/ai-config');

    $response->assertOk()->assertJsonStructure([
        'providers' => ['primary' => ['name', 'model', 'configured'], 'backup' => ['name', 'model', 'configured']],
        'usage', 'packages' => ['free', 'premium'], 'prompts', 'updated_at',
    ]);
    expect($response->getContent())->not->toContain('never-return-this')
        ->and($response->json('providers.primary'))->not->toHaveKeys(['api_key', 'apiKeyHint']);
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `cd website-MindNova-AI && php artisan test tests/Feature/AdminAiSystemApiTest.php --filter='canonical config'`

Expected: FAIL because the current response uses the legacy provider/usage contract.

- [ ] **Step 3: Add repository defaults, compatibility reads, and server-only provider readiness**

```php
interface AiSettingsContract
{
    public function packages(): array;
    public function prompts(): array;
    public function packageForUser(?User $user): string;
    public function providerReadiness(): array;
    public function saveWritable(array $validated): void;
}
```

Implement `packages()` by recursively merging persisted `ai.packages.v1` values over exact defaults `free.daily_requests=30`, `premium.daily_requests=200`, and both `daily_tokens=null`; when the new key is absent, map legacy `ai.quotas.student_daily_questions` to Free and retain the Premium default. Implement `prompts()` by merging only the two named prompt keys over the current controller defaults. Implement `packageForUser()` as Premium only when the latest active Premium subscription has no expiry or an expiry after `now()`, otherwise Free. Implement `providerReadiness()` from `config('services.gemini.*')`, `config('services.backup_ai.*')`, and the configured backup provider name; return only `name`, `model`, and `configured`. Implement `saveWritable()` with two `AdminSetting::updateOrCreate()` calls for the two allowed keys.

- [ ] **Step 4: Add strict Form Request and refactor controller composition**

```php
public function rules(): array
{
    return [
        'packages' => ['required', 'array:free,premium'],
        'packages.free.daily_requests' => ['required', 'integer', 'min:1', 'max:2000'],
        'packages.free.daily_tokens' => ['nullable', 'integer', 'min:1'],
        'packages.premium.daily_requests' => ['required', 'integer', 'min:1', 'max:10000'],
        'packages.premium.daily_tokens' => ['nullable', 'integer', 'min:1'],
        'prompts' => ['required', 'array:ai_tro_giang,ai_cham_bai'],
        'prompts.ai_tro_giang' => ['required', 'string', 'max:4000'],
        'prompts.ai_cham_bai' => ['required', 'string', 'max:4000'],
    ];
}
```

Explicitly reject `providers`, `connections`, `api_key`, and unknown top-level keys with a 422 response rather than silently persisting them.

- [ ] **Step 5: Add persistence, compatibility, validation, and role tests**

Cover unauthenticated 401, non-admin 403, exact free/premium persistence, legacy quota fallback, invalid numeric bounds, unknown keys, and absence of every configured secret in response JSON.

- [ ] **Step 6: Run focused tests and commit**

Run: `cd website-MindNova-AI && php artisan test tests/Feature/AdminAiSystemApiTest.php`

Expected: PASS.

Commit: `git commit -m "feat: define secure admin AI configuration contract"`

---

### Task 2: Truthful usage observability and summaries

**Files:**
- Create: `website-MindNova-AI/database/migrations/2026_09_09_000001_extend_ai_usage_logs_for_observability.php`
- Modify: `website-MindNova-AI/app/Models/AiUsageLog.php`
- Create: `website-MindNova-AI/app/Services/Ai/AiUsageSummaryService.php`
- Modify: `website-MindNova-AI/app/Http/Controllers/Api/Admin/SystemConfigController.php`
- Test: `website-MindNova-AI/tests/Feature/AdminAiSystemApiTest.php`

**Interfaces:**
- Produces: `AiUsageSummaryService::summarize(string $period): array` with request counts, nullable cost, token totals/source, daily trend, and provider breakdown.
- Produces schema fields named in the design spec; Tasks 3 and 5 write/read them.

- [ ] **Step 1: Write failing summary tests with actual, estimated, and unavailable records**

```php
it('does not present unavailable cost as zero', function () {
    AiUsageLog::factory()->create(['cost_amount' => null, 'cost_source' => 'unavailable']);
    $summary = app(AiUsageSummaryService::class)->summarize('7d');
    expect($summary['cost']['amount'])->toBeNull()
        ->and($summary['cost']['available'])->toBeFalse();
});
```

Also assert date boundaries, token totals, status counts, provider/model grouping, and zero request count as a real zero.

- [ ] **Step 2: Run tests and confirm RED**

Run: `cd website-MindNova-AI && php artisan test tests/Feature/AdminAiSystemApiTest.php --filter=usage`

Expected: FAIL because columns/service do not exist.

- [ ] **Step 3: Add reversible migration and model casts**

Use nullable/indexed columns from the spec. `down()` drops exactly the new indexes/columns. Do not rewrite legacy `cost_estimate` values or claim they are actual.

- [ ] **Step 4: Implement period-safe aggregation**

Accept only `7d` and `30d`, default to `7d`, use application timezone boundaries, group by date/provider/model, and return explicit provenance values (`provider`, `estimated`, `mixed`, `unavailable`). Do not fetch external provider APIs inside the page request.

- [ ] **Step 5: Connect summary to GET and rerun tests**

Run: `cd website-MindNova-AI && php artisan test tests/Feature/AdminAiSystemApiTest.php`

Expected: PASS.

- [ ] **Step 6: Verify migration round trip and commit**

Run against an isolated SQLite test database: migrate, inspect columns, rollback one step, and migrate again. Do not run destructive refresh commands against configured MySQL.

Commit: `git commit -m "feat: add truthful AI usage observability"`

---

### Task 3: Apply package quota and enrich provider logging without changing fallback

**Files:**
- Modify: `website-MindNova-AI/app/Http/Controllers/Api/Student/AiTutorController.php`
- Modify: `website-MindNova-AI/app/Services/Ai/AbstractAiService.php`
- Modify: `website-MindNova-AI/app/Services/Ai/AiRouterService.php`
- Modify: `website-MindNova-AI/app/Services/Ai/GeminiAiService.php`
- Modify: `website-MindNova-AI/app/Services/Ai/BackupAiService.php`
- Test: `website-MindNova-AI/tests/Feature/Student/AiTutorEntitlementTest.php`
- Test: `website-MindNova-AI/tests/Feature/AiUsageObservabilityTest.php`

**Interfaces:**
- Consumes: `AiSettingsRepository::packageForUser()` and `packages()` from Task 1.
- Produces: logs conforming to Task 2 fields while preserving router response shape and primary-then-backup order.

- [ ] **Step 1: Write failing free/premium quota tests**

Create users with no subscription, active premium, expired premium, and overlapping inactive subscriptions. Assert the resolved daily limit and that the boundary request returns 429 without invoking HTTP.

- [ ] **Step 2: Run entitlement tests and confirm RED**

Run: `cd website-MindNova-AI && php artisan test tests/Feature/Student/AiTutorEntitlementTest.php`

Expected: FAIL because tutor still uses student/guest quotas.

- [ ] **Step 3: Inject the settings repository and apply package limits**

Replace controller `env()`/generic setting reads with repository and `config()` calls. Count only tutor usage records intended for this quota, using a stable `feature=ai_tutor` metadata predicate compatible with existing rows. Preserve the endpoint response protocol in this task.

- [ ] **Step 4: Write failing observability/fallback tests**

Assert primary success logs provider metadata, primary transient failure still invokes backup exactly once, fallback success records `fallback_used=true`, provider usage tokens use `token_source=provider`, and sanitized logs omit `request_payload`, authorization data, IP and user agent.

- [ ] **Step 5: Run observability tests and confirm RED**

Run: `cd website-MindNova-AI && php artisan test tests/Feature/AiUsageObservabilityTest.php`

Expected: FAIL because current logs omit operational fields and store payload metadata.

- [ ] **Step 6: Enrich existing services surgically**

Keep `AiRouterService` primary then backup calls unchanged. Pass a generated request ID and fallback flag into provider options; record provider-returned usage counts, latency, status and sanitized error codes. Set cost unavailable unless the response provides an authoritative billed value. Never include raw provider error bodies in client-facing exceptions.

- [ ] **Step 7: Run AI regression tests and commit**

Run: `cd website-MindNova-AI && php artisan test tests/Feature/Student/AiTutorEntitlementTest.php tests/Feature/AiUsageObservabilityTest.php tests/Feature/AiFallbackTest.php tests/Feature/Student/GeminiAiServiceTest.php`

Expected: PASS; update only obsolete assertions in existing tests to the current canonical schema.

Commit: `git commit -m "fix: apply AI package quotas and usage provenance"`

---

### Task 4: Build the canonical responsive AI System frontend

**Files:**
- Create: `mindnova-ai/src/features/admin/ai-system/types.ts`
- Create: `mindnova-ai/src/features/admin/ai-system/validation.ts`
- Create: `mindnova-ai/src/features/admin/components/ai-system/AiUsageSummary.tsx`
- Create: `mindnova-ai/src/features/admin/components/ai-system/AiProviderStatus.tsx`
- Create: `mindnova-ai/src/features/admin/components/ai-system/AiPackageEditor.tsx`
- Create: `mindnova-ai/src/features/admin/components/ai-system/AiPromptEditor.tsx`
- Modify: `mindnova-ai/src/features/admin/components/AdminAiSystemPage.tsx`
- Modify: `mindnova-ai/src/features/admin/services/admin-module-data.service.ts`
- Modify: `mindnova-ai/src/features/admin/types.ts`
- Test: `mindnova-ai/src/features/admin/components/__tests__/AdminAiSystemPage.test.tsx`
- Test: `mindnova-ai/src/features/admin/ai-system/validation.test.ts`

**Interfaces:**
- Consumes: canonical Task 1/2 payload.
- Produces: reusable `AdminAiSystemData`, `WritableAiConfig`, and read-only usage/provider components used in Task 6.

- [ ] **Step 1: Write failing pure validation tests**

```ts
it("rejects a premium request limit below the free limit", () => {
  expect(validateAiConfig(candidate).packages?.premium).toBeDefined();
});
```

Cover empty prompts, 4001-character prompts, non-integer/NaN limits, and nullable token limits.

- [ ] **Step 2: Run validation tests and confirm RED**

Run: `cd mindnova-ai && npm test -- src/features/admin/ai-system/validation.test.ts`

Expected: FAIL because module is absent.

- [ ] **Step 3: Implement canonical types and minimal validation**

Define exact snake_case fields matching Laravel. Return a typed field-error map; do not introduce another API client.

- [ ] **Step 4: Write failing component behavior tests**

Mock only `adminApi` at the network boundary. Assert visible loading skeleton, fetch-error Retry, real zero requests, unavailable cost copy, provider readiness, no key-like text, editing/cancel, validation blocking PUT, success reload, and refresh dirty-confirm behavior.

- [ ] **Step 5: Run component tests and confirm RED**

Run: `cd mindnova-ai && npm test -- src/features/admin/components/__tests__/AdminAiSystemPage.test.tsx`

Expected: FAIL against the monolithic legacy screen.

- [ ] **Step 6: Implement the page and focused components**

Use valid `border-[#FAF7F2]`, `bg-[#C0392B]`, `text-[#2C3039]`, and `text-[#C0392B]` utilities; `rounded-2xl` panels, `rounded-xl` controls, one light card shadow, and compact padding. Use Recharts only for non-empty real trends; empty trends render explicit empty copy. Surface `role=status`/`role=alert`, field descriptions, character counts, Save and Cancel.

- [ ] **Step 7: Remove only the dead AI frontend contract**

Delete `getAdminAiSystemData()` and obsolete AI-only types from shared admin modules after confirming no imports. Preserve all unrelated admin service/type exports.

- [ ] **Step 8: Run frontend focused checks and commit**

Run:

```bash
cd mindnova-ai
npm test -- src/features/admin/ai-system/validation.test.ts src/features/admin/components/__tests__/AdminAiSystemPage.test.tsx
npx eslint app/admin/ai-system/page.tsx src/features/admin/ai-system src/features/admin/components/AdminAiSystemPage.tsx
npx tsc --noEmit
```

Expected: PASS.

Commit: `git commit -m "feat: redesign admin AI system with real usage"`

---

### Task 5: Make the Admin shell responsive and remove false live telemetry

**Files:**
- Modify: `mindnova-ai/src/features/admin/components/AdminDashboardShell.tsx`
- Modify: `mindnova-ai/src/features/admin/components/AdminSidebar.tsx`
- Modify: `mindnova-ai/src/features/admin/components/AdminTopbar.tsx`
- Modify: `mindnova-ai/app/admin/layout.tsx`
- Test: `mindnova-ai/src/features/admin/components/__tests__/AdminShellResponsive.test.tsx`

**Interfaces:**
- Produces: controlled mobile sidebar open/close state and desktop-compatible shell consumed by every Admin route.

- [ ] **Step 1: Write failing navigation behavior tests**

Assert a labeled menu button opens/closes the sidebar, route selection closes it, Escape closes it, focus returns to the trigger, and the sidebar no longer renders hardcoded `12ms` or “Tất cả dịch vụ đang ổn định”.

- [ ] **Step 2: Run tests and confirm RED**

Run: `cd mindnova-ai && npm test -- src/features/admin/components/__tests__/AdminShellResponsive.test.tsx`

Expected: FAIL because fixed sidebar has no drawer state.

- [ ] **Step 3: Implement responsive shell behavior**

Keep the existing desktop widths at `lg+`. Below `lg`, render an overlay drawer, backdrop, accessible close controls and compact topbar. Hide or move export/search controls that cannot fit, but preserve refresh/logout access.

- [ ] **Step 4: Remove hardcoded operational claims**

Replace the carousel with a neutral navigation/help panel or omit it on mobile. Do not label anything LIVE without API-backed data.

- [ ] **Step 5: Run tests, lint, typecheck and commit**

Run:

```bash
cd mindnova-ai
npm test -- src/features/admin/components/__tests__/AdminShellResponsive.test.tsx
npx eslint app/admin/layout.tsx src/features/admin/components/AdminDashboardShell.tsx src/features/admin/components/AdminSidebar.tsx src/features/admin/components/AdminTopbar.tsx
npx tsc --noEmit
```

Expected: PASS.

Commit: `git commit -m "fix: make admin navigation responsive"`

---

### Task 6: Restore Admin Overview and add read-only AI summary

**Files:**
- Modify: `website-MindNova-AI/routes/api.php`
- Modify: `website-MindNova-AI/app/Http/Controllers/Api/Admin/DashboardController.php`
- Modify: `mindnova-ai/app/admin/page.tsx`
- Modify: `mindnova-ai/src/features/admin/services/admin-overview.service.ts`
- Modify: `mindnova-ai/src/features/admin/components/AdminOverviewPage.tsx`
- Create: `mindnova-ai/src/features/admin/components/ai-system/AdminAiOverviewSummary.tsx`
- Test: `website-MindNova-AI/tests/Feature/AdminOverviewApiTest.php`
- Test: `mindnova-ai/src/features/admin/components/__tests__/AdminOverviewPage.test.tsx`

**Interfaces:**
- Consumes: `AiUsageSummaryService` and `AiSettingsRepository` from Tasks 1/2 and reusable frontend types from Task 4.
- Produces: authenticated `GET /api/admin/overview` and `/admin` overview page with AI summary link.

- [ ] **Step 1: Write failing backend overview contract test**

Assert admin-only access and a payload containing real overview fields plus `ai_summary`, without hardcoded health/latency or secret material.

- [ ] **Step 2: Run backend test and confirm RED**

Run: `cd website-MindNova-AI && php artisan test tests/Feature/AdminOverviewApiTest.php`

Expected: FAIL because the overview route is not registered or lacks AI summary.

- [ ] **Step 3: Register and compose the existing overview endpoint**

Reuse existing dashboard queries and the canonical usage/settings services. Remove or leave unrouted the legacy placeholder `aiSystem()` method; do not return formula-based fake quotas/prompts.

- [ ] **Step 4: Write failing frontend overview test**

Assert `/admin` renders overview content, AI availability/usage states, and a link with `href=/admin/ai-system`; ensure analytics-specific heading is absent.

- [ ] **Step 5: Run frontend test and confirm RED**

Run: `cd mindnova-ai && npm test -- src/features/admin/components/__tests__/AdminOverviewPage.test.tsx`

Expected: FAIL because `/admin` currently renders Analytics.

- [ ] **Step 6: Repair overview data contract and render compact summary last**

Make fallback data fully shaped; remove hardcoded hero metrics and empty chart placeholders encountered in the mounted path. Keep AI settings read-only on Overview.

- [ ] **Step 7: Run focused checks and commit**

Run backend and frontend overview tests, ESLint on changed frontend files, and `npx tsc --noEmit`.

Commit: `git commit -m "feat: add AI status to admin overview"`

---

### Task 7: Full regression, responsive inspection, and documentation

**Files:**
- Modify if required by verified failures only: files already in Tasks 1–6.
- Create: `docs/admin-ai-system.md`

**Interfaces:**
- Consumes all prior tasks; produces the final operational handoff.

- [ ] **Step 1: Run backend format and targeted suites**

```bash
cd website-MindNova-AI
vendor/bin/pint --test
php artisan test tests/Feature/AdminAiSystemApiTest.php tests/Feature/Student/AiTutorEntitlementTest.php tests/Feature/AiUsageObservabilityTest.php tests/Feature/AdminOverviewApiTest.php tests/Feature/AiFallbackTest.php tests/Feature/Student/GeminiAiServiceTest.php
```

Expected: PASS with no schema-contract failures.

- [ ] **Step 2: Run broader backend tests safely**

Confirm the test database is isolated before running `php artisan test`. If the configured database is persistent/shared, use an explicit temporary SQLite environment instead of refresh/migration commands against MySQL. Record unrelated pre-existing failures separately.

- [ ] **Step 3: Run complete frontend verification**

```bash
cd mindnova-ai
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Expected: PASS.

- [ ] **Step 4: Inspect responsive UI**

Run the existing app against an isolated/local backend and inspect `/admin` and `/admin/ai-system` at 390x844, 768x1024, 1280x800, and 1536x864. Verify no horizontal overflow, drawer keyboard behavior, readable charts/forms, and explicit unavailable states. Capture findings in the implementation report; fix only reproducible scope-related defects through a RED/GREEN test cycle.

- [ ] **Step 5: Document configuration and data semantics**

Document environment-only provider keys, primary/backup preservation, package setting key/defaults, usage coverage, nullable cost semantics, migration, rollback, and the fact that OpenAI organization cost integration requires a server-side admin credential and is unavailable otherwise.

- [ ] **Step 6: Review changed files and commit**

Run `git diff --check`, `git status --short`, inspect every diff, verify no `.env`, credential, build output, or unrelated file is staged.

Commit: `git commit -m "docs: document admin AI configuration and usage"`

- [ ] **Step 7: Request whole-branch code review**

Review from the pre-plan base commit through HEAD for spec compliance, security, migrations, data truthfulness, fallback preservation, test quality, UI accessibility, and responsive regressions. Resolve every load-bearing finding before completion.
