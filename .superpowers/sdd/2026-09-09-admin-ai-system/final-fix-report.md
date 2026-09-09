# Final review fix wave

Base: `614fa86`. Implemented the six findings from `final-fix-brief.md` in the existing isolated `quiz-management` worktree. No subagents were dispatched.

## Changes and scope

1. `AiSettingsRepository::prompts()` now keeps only stored string values for the two canonical names and supplies the existing nonempty defaults for null/non-string values. Valid stored strings remain intact; the compatibility read does not write the database. The frontend normalizes the same two legacy values when creating the writable draft, so real prompt editors, character counts, dirty checking, Cancel, and saving operate on strings even during mixed-version deployment. Both server and browser regression fixtures use the canonical defaults.
2. Tutor deployment selection is centralized in `AiSettingsRepository::tutorProvider()`. A nonblank configured `services.ai_tutor.provider` wins. Absent, null, empty, or whitespace-only configuration falls back to the legacy `ai.providers.primary` only for `openai` or `groq`; unsupported or missing legacy values use `groq`. `config/services.php` preserves absence instead of eagerly injecting `groq`, and the controller uses the repository with no direct `env()` call. Keys, model, and base URI remain server configuration. Nine streamed endpoint cases cover legacy OpenAI/Groq, explicit precedence, blank configuration, unsupported legacy values, endpoint/auth selection, provider logs, and absence of key material in persisted usage.
3. Admin Overview adds canonical `packages` from the same repository to `ai_summary`. The frontend canonical type includes packages and displays read-only Free/Premium requests per day in the final summary. API regressions cover defaults, legacy quota fallback, and stored packages; render assertions cover actual limits, labels, final-summary placement, and absence of writable fields. The existing error fallback remains `ai_summary: null`, now explicitly tested to avoid inventing package values when no data was fetched. No fabricated fallback package limits were added.
4. Both observability exception tests capture a provider exception and assert its existence after the catch, so their own assertion failures cannot satisfy the test. Error-body/key redaction and log assertions remain; exception-chain absence is also asserted. A temporary test-helper mutation proved the former false positive and the strengthened detection, then was fully removed.
5. Backup readiness exactly mirrors `BackupAiService`'s existing `empty()` selection and final presence check. The runtime service, provider branching, and router order were not changed. Eight parity cases cover direct/fallback `"0"`, direct/fallback whitespace, empty keys, a normal direct key, and the Groq/OpenAI branches. The test invokes the real backup service behind an HTTP fake and compares request/no-request behavior and selected synthetic authorization against readiness. Credential content is never added to API responses.
6. AI System errors now carry their origin (`load`, `save`, or `validation`). Fetch errors retain Retry/Reload; save failures retain the draft, explain that it is preserved, and offer `Lưu lại` that calls PUT; client validation displays associated errors and focuses the first invalid field without a reload action. Existing dirty-refresh confirmation remains. A successful PUT followed by failed canonical GET is correctly treated as a load error.

Operational documentation was updated only for these corrected contracts. No migrations, provider topology/order, retries, metrics, credential storage, or external integrations changed.

## Isolation and commands

Created only the task-owned MySQL container, with no published database port:

```sh
docker run -d --name codex-final-fix-mysql \
  -e MYSQL_ROOT_PASSWORD=final-fix-local -e MYSQL_DATABASE=du_an_testing mysql:8.0
```

Backend tests used this command prefix and then the test command listed below:

```sh
docker run --rm --network container:codex-final-fix-mysql \
  -v /home/codexproxy/Codex-project-2/MindNovaAI/.worktrees/quiz-management/website-MindNova-AI:/app \
  -w /app -e DB_CONNECTION=mysql -e DB_HOST=127.0.0.1 -e DB_PORT=3306 \
  -e DB_USERNAME=root -e DB_PASSWORD=final-fix-local -e DB_DATABASE=du_an_testing \
  -e DB_URL= codex-mindnova-php:test <command>
```

The final run also explicitly cleared process-level Groq/OpenAI/Gemini/backup keys. Test cases configure synthetic credentials and fake external HTTP; no live provider call was needed. All database refreshes were isolated to this disposable MySQL instance. Formatter/syntax containers used `--network none`.

## RED evidence

Before runtime changes:

```text
php artisan test tests/Feature/AdminAiSystemApiTest.php \
  tests/Feature/AdminOverviewApiTest.php tests/Feature/Student/AiTutorEntitlementTest.php \
  --filter='legacy|effective|compatibility|dashboard overview'
19 failed, 6 passed (128 assertions), 59.74s, exit 1
```

- Prompt GET fixtures returned null, numeric, boolean, or array values instead of default strings; the independent valid-string/invalid-grading fixture also failed.
- Tutor legacy OpenAI requests went to the wrong endpoint and produced the friendly failure stream. Missing/blank provider configuration also persisted an empty provider identity instead of `groq`. Both explicit-setting cases already passed and were retained.
- Overview lacked `ai_summary.packages` and returned null instead of the legacy Free limit 77.
- Backup readiness differed from runtime for zero/whitespace. One initial whitespace authorization expectation assumed the raw spaces survived the HTTP library; it was corrected to the actual trimmed `Bearer` header, without changing production runtime. The subsequent run left four readiness mismatches for direct zero, direct whitespace without fallback, zero fallback, and whitespace fallback. Other parity cases already matched.

The first prompt GREEN attempt also exposed a transcription error in the test/browser default literal (`uu tieng` instead of canonical `uu tien tieng`). The fixture and defensive browser fallback were corrected to the existing server default; server prompt wording was not changed.

Before frontend implementation:

```text
npm test -- src/features/admin/components/__tests__/AdminAiSystemPage.test.tsx \
  src/features/admin/components/__tests__/AdminOverviewPage.test.tsx --maxWorkers=1
7 failed, 19 passed; 1 uncaught error; 20.26s, exit 1
```

- Four real-render legacy-value cases failed; null reproduced `TypeError: object null is not iterable` at `AiPromptEditor`'s `Array.from`.
- Save/validation cases found the erroneous reload Retry button.
- Overview could not find the read-only request-limit region.
- Fetch-retry and post-save-fetch-failure controls were already exercised successfully.

Exception-test mutation evidence, all with real service HTTP/log effects preserved:

```text
php artisan test tests/Feature/AiUsageObservabilityTest.php \
  --filter='authentication_and_configuration|error_bodies' --compact
Old test assertions + temporary helper suppressing provider exceptions:
4 passed (24 assertions), 54.90s, exit 0 — demonstrated false positive.
Strengthened assertions + identical temporary helper mutation:
4 failed (4 assertions), 69.09s, exit 1 — null is not an instance of Exception.
```

The temporary helper mutation was removed before final verification and is absent from the final diff.

## GREEN and verification

Frontend focused runs after implementation:

- Real legacy editor render: 4 passed (16 skipped), exit 0.
- Complete AI System component file: 20 passed, exit 0.
- Overview component file: 6 passed, exit 0.
- Full `npm test`: **16 files, 82 tests passed**, 120.12s, exit 0. This final full run includes the corrected canonical prompt literal and all error-origin regressions.
- Changed-file `npx eslint` on `prompts.ts`, `AdminAiSystemPage.tsx`, `AdminAiOverviewSummary.tsx`, both changed component test files, and `types.ts`: exit 0.
- `npx tsc --noEmit`: exit 0.

PHP validation:

- `php -l` passes on all eight changed PHP files.
- Pint corrected import ordering/fully-qualified built-in exception style in the changed Admin AI test.
- Final `vendor/bin/pint --test` on all eight changed PHP files identifies only `app/Http/Controllers/Api/Admin/DashboardController.php`. This controller already appears in both recorded `task7-baseline-pint.json` and `task7-current-pint.json`. Its only change in this wave is the correctly indented canonical packages entry; historical whole-file style debt was not reformatted. The other seven changed PHP files pass.
- `git diff --check`: exit 0 during self-review.

Final combined backend command:

```text
php artisan test tests/Feature/AdminAiSystemApiTest.php \
  tests/Feature/AdminOverviewApiTest.php \
  tests/Feature/Student/AiTutorEntitlementTest.php \
  tests/Feature/AiUsageObservabilityTest.php tests/Feature/AiFallbackTest.php \
  tests/Feature/Student/GeminiAiServiceTest.php tests/Feature/Student/AiTutorTest.php --compact
66 passed, 1 failed (485 assertions), 74.13s, exit 1
```

All six current Admin AI/Overview/tutor-entitlement/observability/fallback/Gemini test files pass. This includes every added regression, all eight backup parity fixtures, all nine tutor deployment fixtures, and the strengthened exception tests with the original real service helper restored. The extra historical `AiTutorTest::test_student_can_chat_with_ai_tutor` still expects a JSON/conversation endpoint and receives 422 with no provider credential. It is unchanged by this wave, and the exact 200-versus-422 failure at line 37 is recorded in both `task7-baseline-junit.xml` and `task7-current-junit.xml`. The active endpoint's existing streamed protocol remains intentionally unchanged.

`npm run build`: **exit 0**, successfully compiled and generated all 51 routes. The existing Next middleware naming deprecation and caught `DYNAMIC_SERVER_USAGE` messages remain. The build skips TypeScript validation, so the separate successful `npx tsc --noEmit` above is required evidence. The existing Vitest CommonJS/ESM configuration warning remains; the final full test run has no unhandled test exceptions.

## Self-review and limitations

- Verified the final diff against all six brief requirements; only the requested settings compatibility, summary display, error actions, associated tests, and relevant documentation changed.
- Router/backup provider implementations and primary→backup ordering are unchanged. Exception tests still assert failure order/no unauthorized fallback and redact provider bodies, credentials, and original exception chains.
- Readiness remains a configuration-presence signal, including legacy whitespace semantics. It cannot verify credential validity or live provider health.
- Canonical prompt fallback strings are duplicated only in the small defensive browser adapter, with real-render literal expectations matching the backend GET regressions. Stored strings (including legacy empty strings) remain strings and are subject to the existing required-field validation on save.
- The Overview unavailable fallback is deliberately null, so failed requests cannot manufacture configured package values.
- No authenticated browser session was added for this small fix wave; real React DOM render/interaction tests, backend HTTP/database integration, TypeScript, and the production build provide the requested evidence. The prior task-7 responsive/browser evidence remains available separately.
- Existing whole-file Dashboard Pint debt and the obsolete tutor JSON test are retained and disclosed; this wave does not claim a globally clean backend suite/formatter.
- No environment file, real secret, dependency, generated build output, or migration is part of the change.

## Cleanup and handoff

Inspected the exact task-owned container (`/codex-final-fix-mysql`, image `mysql:8.0`, no port bindings), then removed it and its disposable anonymous data volume with `docker rm -fv codex-final-fix-mysql`. Only synthetic test records were removed; they are reproducible from the tests. Shared databases/containers were untouched.

Commit message: `fix: address final admin AI compatibility review`. This report is included with the surgical implementation and regression changes in that single commit; the resulting hash is supplied in the task handoff. Pre-commit `git diff --check` passed.
