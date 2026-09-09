# Task 3 — Package quotas and usage provenance

## Implementation

- Injected `AiSettingsRepository` into the existing streamed tutor endpoint. Free/Premium daily request limits and tutor prompts now come from the same repository as the admin API.
- Quota counts select `meta.feature = ai_tutor`; older tutor records remain included when the feature is missing and both `input_text` and `system_prompt` are present. Quiz/notification rows no longer consume tutor quota.
- Replaced tutor `env()` and generic settings lookups with deployment configuration. Added `services.ai_tutor` configuration (default Groq and existing OpenAI-compatible endpoint format, model/base URI/key environment mappings). The endpoint still returns its existing streamed plain text and headers; no switch to router/JSON/conversation protocol was made.
- Tutor logs now record request/provider IDs, duration, success/failure, sanitized error codes, provider token counts when supplied, explicit estimates otherwise, and unavailable cost. New tutor usage rows contain only the feature metadata and omit raw prompts/output/system prompts, IP, and user agent.
- Router still invokes Gemini first, with two total primary attempts and one backup attempt. A generated UUID is shared across attempt logs and returned in the existing `meta.requestId`; fallback state is supplied through provider options. The response shape is unchanged.
- Applied the task's explicit fallback ruling: only `AiTransientException` triggers backup. HTTP 429/500/502/503/504 and exhausted connection failures are transient. HTTP 401/403/404 surface as configuration/authentication failures without backup. Missing primary credentials fail locally without HTTP; missing backup credentials are recorded as configuration failure.
- Provider services log each success/failure attempt with duration, status, sanitized stable error codes, fallback state, provider response ID where supplied, and token provenance. Missing usage is `unavailable`, including when legacy numeric columns default to zero.
- Shared logging accepts the legacy protected-call signature for compatibility with `MockAiService`, but discards request payloads. Only allowlisted operational fields and feature metadata are persisted. Logging failures no longer interpolate database exception messages (which can contain SQL bindings).
- Removed provider error-body and connection-message interpolation from application logs and client-facing exceptions. Original network exceptions are not chained because their URLs/messages may contain credentials. Both-provider failure retains the existing user-facing error category with a generic message.
- Kept `cost_estimate` backward compatible. New live-provider/tutor logs set `cost_amount = null`, `cost_source = unavailable`, and no currency; these response contracts do not supply authoritative billed amounts, so no model pricing or token-derived billed cost is invented.
- Updated the existing Gemini regression's obsolete columns to `meta.feature`, `input_tokens`, `output_tokens`, and `token_source`; its fixture now explicitly configures the fake key. The existing 401 no-fallback expectation was retained and now passes.
- Added `RefreshDatabase` to the existing fallback test class after the combined runtime/admin run proved its unisolated usage writes contaminated later summaries. No fallback test assertions were weakened.

## Files

- `website-MindNova-AI/app/Http/Controllers/Api/Student/AiTutorController.php`
- `website-MindNova-AI/app/Services/Ai/AbstractAiService.php`
- `website-MindNova-AI/app/Services/Ai/AiRouterService.php`
- `website-MindNova-AI/app/Services/Ai/GeminiAiService.php`
- `website-MindNova-AI/app/Services/Ai/BackupAiService.php`
- `website-MindNova-AI/config/services.php`
- `website-MindNova-AI/tests/Feature/Student/AiTutorEntitlementTest.php`
- `website-MindNova-AI/tests/Feature/AiUsageObservabilityTest.php`
- `website-MindNova-AI/tests/Feature/Student/GeminiAiServiceTest.php`
- `website-MindNova-AI/tests/Feature/AiFallbackTest.php`

## Disposable test environment

No historical migration or persistent database was changed. Tests used a new MySQL container, without published ports:

```sh
docker run -d --name codex-task3-mysql \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -e MYSQL_DATABASE=du_an_testing mysql:8.4
```

All artisan commands below ran through this exact isolated wrapper:

```sh
docker run --rm --network container:codex-task3-mysql \
  -v /home/codexproxy/Codex-project-2/MindNovaAI/.worktrees/quiz-management/website-MindNova-AI:/app \
  -w /app -e DB_HOST=127.0.0.1 -e DB_PORT=3306 -e DB_USERNAME=root \
  -e DB_PASSWORD= -e DB_DATABASE=du_an_testing \
  codex-mindnova-php:test php artisan test <test paths and options below>
```

## RED evidence

Initial tests, before runtime edits:

```text
php artisan test tests/Feature/Student/AiTutorEntitlementTest.php tests/Feature/AiUsageObservabilityTest.php

FAIL Tests\Feature\Student\AiTutorEntitlementTest
  package boundary blocks http: all four subscription fixtures expected 429, received 422
  only tutor rows count and stream records sanitized provider usage: expected 200, received 422
FAIL Tests\Feature\AiUsageObservabilityTest
  primary success: status expected success, received null
  transient failure attempts: expected gemini, gemini, backup logs; only backup existed
  401/403/404 failures: no failure log existed
  redaction: public exception included private-key, private-prompt, private-provider-body
  missing provider usage: expected unavailable, received null
Tests: 12 failed (15 assertions)
Duration: 42.67s
```

Self-review added an explicit missing-primary-key test before adding its guard:

```text
php artisan test tests/Feature/AiUsageObservabilityTest.php --filter=missing_primary_key
FAIL Tests\Feature\AiUsageObservabilityTest
  missing primary key surfaces configuration failure without http
  Failed asserting that null is not null (the service returned successfully through HTTP).
Tests: 1 failed (1 assertions)
Duration: 43.39s
```

## GREEN evidence

First complete required regression:

```text
php artisan test tests/Feature/Student/AiTutorEntitlementTest.php tests/Feature/AiUsageObservabilityTest.php tests/Feature/AiFallbackTest.php tests/Feature/Student/GeminiAiServiceTest.php
PASS Tests\Feature\Student\AiTutorEntitlementTest
PASS Tests\Feature\AiUsageObservabilityTest
PASS Tests\Feature\AiFallbackTest
PASS Tests\Feature\Student\GeminiAiServiceTest
Tests: 19 passed (107 assertions)
Duration: 49.94s
```

Final regression including the new missing-key guard and admin integration:

```text
php artisan test tests/Feature/Student/AiTutorEntitlementTest.php tests/Feature/AiUsageObservabilityTest.php tests/Feature/AiFallbackTest.php tests/Feature/Student/GeminiAiServiceTest.php tests/Feature/AdminAiSystemApiTest.php
PASS Tests\Feature\Student\AiTutorEntitlementTest (5 tests)
PASS Tests\Feature\AiUsageObservabilityTest (8 tests)
PASS Tests\Feature\AiFallbackTest (6 tests)
PASS Tests\Feature\Student\GeminiAiServiceTest (1 test)
PASS Tests\Feature\AdminAiSystemApiTest (15 tests)
Tests: 35 passed (229 assertions)
Duration: 41.17s
```

The first combined runtime/admin run provided an additional isolation regression:

```text
php artisan test tests/Feature/Student/AiTutorEntitlementTest.php tests/Feature/AiUsageObservabilityTest.php tests/Feature/AiFallbackTest.php tests/Feature/Student/GeminiAiServiceTest.php tests/Feature/AdminAiSystemApiTest.php
All 20 runtime tests passed; four admin summary tests failed.
Tests: 4 failed, 31 passed (199 assertions)
Duration: 52.53s
```

Root cause was verified with read-only SQL after the test run: 13 rows remained (`gemini/success=2`, `gemini/failed=8`, `backup/success=2`, `backup/failed=1`), exactly matching the fallback test fixtures. That test class lacked the database transaction trait used by the other feature tests. Adding `RefreshDatabase` is the only change to that class.

Style and whitespace:

```text
php -l <all ten changed PHP files>
No syntax errors detected (10 files)
vendor/bin/pint --test <nine runtime/config/new-test/Gemini-test PHP files>
PASS (9 files)
git diff --check
exit 0
```

`AiFallbackTest` retains its existing formatting; its diff is only the transaction-trait import and use.

## Self-review

- Mutation check: reverting repository package selection breaks four boundary fixtures; removing the feature filter or legacy compatibility branch breaks the successful stream/boundary test.
- Real HTTP fakes retain application controllers/services/database behavior. Assertions cover provider call counts, request payloads, provider order, log ordering, shared request IDs, status/error/fallback values, returned stream text/headers, and persisted settings prompt use.
- Returning to catch-all fallback breaks authentication/configuration expectations; dropping attempt logging breaks ordered failure/success assertions; dropping provider token provenance or falsely using zero as sourced usage breaks usage assertions.
- Raw request options containing authorization/IP/user agent never enter usage metadata. Log-spy assertions cover normal application log channels; persisted-record assertions cover payload/content omission.
- The new missing-key fixture verifies the failure itself, no HTTP, and the recorded stable configuration error.

## Concerns / intentional limits

- Daily quota enforcement retains the existing count-then-stream behavior; atomic cross-request reservation and quotas for unrelated features remain explicitly outside this task.
- Historical tutor identification is a compatibility predicate, not a backfill: untagged records without retained tutor input/system prompt cannot reliably be assigned a feature.
- The streamed tutor remains an independent OpenAI-compatible path, as required by the endpoint-protocol constraint. Deployment provider selection now uses `AI_TUTOR_PROVIDER` (default `groq`); a deployment previously relying on legacy `ai.providers.primary` needs the equivalent environment configuration.
- Shared usage summaries count recorded provider attempts, including failed retries; the existing streamed tutor emits one usage row per submitted request. No change to the Task 2 summary aggregation contract was made.
- Current provider response contracts expose token usage, not authoritative billed cost. Those costs intentionally remain unavailable.

## Commit

Implementation and report are committed together with message `fix: apply AI package quotas and usage provenance`; the resulting hash is supplied in the task handoff.

## Fix round 1 — Failed tutor requests do not invent token usage

### Finding and implementation

The tutor's `finally` block estimated tokens even after an HTTP or connection failure. This could assign input tokens to an unmeasured failed call and output tokens to a locally generated friendly error message, then copy those counters into activity metadata without provenance.

- The existing `input_tokens` and `output_tokens` schema columns are non-nullable unsigned integers. Failed calls without provider usage now use the canonical storage representation `0/0` plus `token_source = unavailable`.
- Token estimation runs only for successful tutor responses without provider counts, and retains `token_source = estimated`.
- Activity metadata always includes token provenance. It includes input/output counters only for `provider` or `estimated` sources; unavailable counts are omitted.
- Genuine provider-supplied counts remain preferred. The streamed response and error text are unchanged.

Changed files: `AiTutorController.php`, `AiTutorEntitlementTest.php`, and this report.

### RED

Run through the same disposable MySQL/container wrapper documented above:

```text
php artisan test tests/Feature/Student/AiTutorEntitlementTest.php
FAIL Tests\Feature\Student\AiTutorEntitlementTest
  HTTP failure: expected input_tokens 0, received 23
  Connection failure: expected input_tokens 0, received 23
  Provider success activity metadata: token_source missing
  Estimated success activity metadata: token_source missing
Tests: 4 failed, 4 passed (52 assertions)
Duration: 38.75s
```

### GREEN

```text
php artisan test tests/Feature/Student/AiTutorEntitlementTest.php tests/Feature/AiUsageObservabilityTest.php tests/Feature/AiFallbackTest.php tests/Feature/Student/GeminiAiServiceTest.php tests/Feature/AdminAiSystemApiTest.php
PASS Tests\Feature\Student\AiTutorEntitlementTest (8 tests)
PASS Tests\Feature\AiUsageObservabilityTest (8 tests)
PASS Tests\Feature\AiFallbackTest (6 tests)
PASS Tests\Feature\Student\GeminiAiServiceTest (1 test)
PASS Tests\Feature\AdminAiSystemApiTest (15 tests)
Tests: 38 passed (267 assertions)
Duration: 45.19s

php -l app/Http/Controllers/Api/Student/AiTutorController.php
No syntax errors detected
php -l tests/Feature/Student/AiTutorEntitlementTest.php
No syntax errors detected
vendor/bin/pint --test app/Http/Controllers/Api/Student/AiTutorController.php tests/Feature/Student/AiTutorEntitlementTest.php
PASS (2 files)
git diff --check
exit 0
```

### Self-review

- Both HTTP and connection failures assert zero stored counters, unavailable provenance, no activity counters, and unavailable/null token totals from the real admin summary service.
- Successful estimates have independent literal expectations (6 input and 7 output tokens) and explicit provenance in both usage and activity logs.
- The existing provider-success fixture now also verifies provider provenance and its 11/3 counts in activity metadata.
- No migration, provider routing, endpoint protocol, or quota behavior changed. Existing historical rows are not rewritten.

Fix commit message: `fix: avoid estimated usage for failed tutor requests`.
