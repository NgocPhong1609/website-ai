# Admin AI configuration and usage

The writable AI configuration is at `/admin/ai-system`. `/admin` is the general Overview and ends with a read-only seven-day AI summary. `/admin/analytics` remains the dedicated Analytics page.

## API and access

`GET /api/admin/ai-config?period=7d` returns the canonical, unwrapped `providers`, `usage`, `packages`, `prompts`, and `updated_at` payload. `30d` selects thirty calendar days; absent or unsupported periods select seven. `PUT /api/admin/ai-config` accepts only `packages` and `prompts`. Both routes, and `GET /api/admin/overview`, require Sanctum authentication and the admin role.

Unknown keys at every writable level return validation errors. Provider names, models, credentials, and connection objects cannot be saved through this API. The response contains no credential values, suffixes, or masked references. After saving, the UI reloads the current period. Cancel restores the loaded values. Refreshing or switching periods with unsaved edits asks before replacing them.

The frontend uses `NEXT_PUBLIC_API_URL` for browser requests and `BACKEND_URL` for server-rendered Overview requests; point both at the same Laravel deployment. The Laravel CORS configuration must allow the frontend origin.

## Provider configuration and fallback

Keys belong in the server deployment environment and Laravel configuration, never in browser environment variables, database settings, or the admin form. Existing deployments retain the following configuration from `website-MindNova-AI/config/services.php`:

| Runtime branch | Configuration |
| --- | --- |
| Primary Gemini | `GEMINI_API_KEY`, `GEMINI_MODEL` |
| OpenAI-compatible backup | `BACKUP_AI_PROVIDER`, `BACKUP_AI_API_KEY`, `BACKUP_AI_MODEL` |
| Backup key fallback | With no backup key, exact provider `groq` uses `GROQ_API_KEY`; other provider values use `OPENAI_API_KEY` |
| Existing tutor stream | `AI_TUTOR_PROVIDER`, `AI_DEFAULT_MODEL`, and that provider's server-side key/base URI settings |

Set the backup model to one supported by the configured backup endpoint. A displayed model is the configured identifier, not proof that the provider accepts it. Provider cards report only whether a nonblank key is configured; they do not make a connection, validate a key/model, measure latency, or assert service health. Empty backup provider display names normalize to `openai`; runtime branch selection remains the existing exact `groq` comparison. Avoid whitespace or placeholder values in credentials/provider names.

`AiRouterService` still tries Gemini first: at most two primary attempts, then one backup attempt on a transient failure. Authentication/configuration failures do not trigger fallback. The original prompt is preserved across attempts. Provider error bodies and original connection exceptions do not reach public exceptions through these shared services. `AI_FORCE_PRIMARY_FAILURE` remains an existing diagnostic switch and should be disabled in normal operation.

The student tutor stream retains its separate, existing OpenAI-compatible endpoint selection. The primary/backup cards describe the router topology; editing package limits does not switch the tutor's provider or make its stream use the router.

After a server environment change, rebuild Laravel's configuration cache using the deployment's normal process (`php artisan config:cache`) and restart any long-running application/queue workers. No secret-editing endpoint or organization credential setting was added.

## Package settings and prompts

`AdminSetting` stores package configuration as JSON under `ai.packages.v1`:

```json
{
  "free": { "daily_requests": 30, "daily_tokens": null },
  "premium": { "daily_requests": 200, "daily_tokens": null }
}
```

If that versioned setting does not exist, a stored `ai.quotas.student_daily_questions` supplies the Free daily request fallback. Otherwise the defaults above apply. This is a compatibility read, not a migration/backfill; the old `ai.quotas` setting is preserved. The current package contract does not expose a separate `guest_daily_questions` limit: guests resolve to Free. Saving creates/updates the new versioned setting and leaves legacy quota JSON untouched.

Free daily requests must be an integer from 1–2000; Premium accepts 1–10000. The UI also checks that Premium is not below Free. Token limits may be null or positive integers. Null means no enforceable token entitlement is configured. Even a stored nonnull token limit is **not enforced by the current runtime**; the page explicitly labels it as stored configuration.

The repository resolves Premium from the newest subscription matching `plan=premium` and `status=active`, provided its expiry is absent or in the future. Guests, users without such a subscription, and users whose selected subscription has expired resolve to Free. This does not change billing or subscription lifecycle behavior.

Daily request limits apply to the existing AI tutor stream only. It counts today's tutor log rows for the user (or existing guest actor identifier), including failed logged attempts. Other AI features do not consume this quota. Untagged historical rows count as tutor rows only when both retained input and system prompt identify the old tutor shape. Requests rejected before provider execution do not create a usage row. The current count-then-request check is not an atomic reservation: concurrent requests can exceed a boundary, so this is not a strict spending cap.

`ai.prompts` stores only `ai_tro_giang` and `ai_cham_bai`. Both are required strings up to 4000 characters. The tutor uses `ai_tro_giang` as its system prompt. `ai_cham_bai` is stored but is not connected to the grading runtime; the page says so. An absent stored prompt uses the repository's Vietnamese default. `updated_at` reflects the latest package/prompt setting update, not a provider configuration or usage refresh time.

## What usage measures

`AiUsageLog` is the local source of truth. The summary uses the application's configured timezone and includes the selected calendar range through the end of today. It returns daily counts, provider/model groups, and successful/failed/unknown-status counts.

`coverage=recorded_requests` means only persisted rows are represented. It does not claim all AI activity, unique user interactions, provider account totals, or billable requests. A retried router request can create two primary rows plus one backup row with a shared `request_id`; all three contribute to the request count. Backup rows retain the existing provider label `backup`, with the configured model. Configuration failures may also produce rows without an upstream request.

The shared Gemini/backup services and tutor path attach sanitized status/error codes, duration, fallback flag, application request ID, optional provider request ID, and source metadata. Other paths are included only if they write `ai_usage_logs`. Logging failures in the shared services are reported with a sanitized message and can leave gaps.

Token/cost metrics expose `source`, `coverage`, `sourced_requests`, and `recorded_requests`:

| Value | Meaning |
| --- | --- |
| `provider` | Explicit provider response metadata or a record explicitly tagged with that provenance |
| `estimated` | An estimate, never relabeled as provider measurement |
| `mixed` | More than one supported source contributes |
| `unavailable` | No supported source supplies that metric |
| `coverage=partial` | Only some recorded rows have a supported source; the displayed sum omits the others |

The tutor prefers provider token metadata. A successful reply without it receives an explicit text-based estimate. A failed reply without usage metadata has unavailable tokens; local error text is not treated as generated output. Historical token counts with no trusted source remain excluded from sourced sums. A real provider-reported zero is available zero; unknown tokens remain null/unavailable in summaries even where legacy numeric columns contain zero.

New shared/tutor usage rows omit raw prompts, assistant output, request payloads, IP addresses, and user agents. They retain only the feature name in usage metadata. This migration does not erase historical content. Existing moderation records may still retain flagged input, and the separate activity audit still records its existing request context; this change is not a global privacy-retention cleanup.

## Cost and OpenAI organization access

`cost_amount` and `cost_currency` are nullable. Null means unavailable, not free. A sourced, recorded zero remains zero. `cost_estimate` is retained for compatibility but is never reinterpreted as actual spend. The current provider/tutor writers set new cost fields to null with `cost_source=unavailable`; there is no hardcoded model price calculation.

The summary can aggregate explicitly sourced cost rows in one currency. It reports partial coverage where applicable. Different currencies are not added or converted: the aggregate amount/currency remain unavailable, with mixed source and coverage metadata. The cost card uses the recorded currency rather than inventing a conversion.

There is **no OpenAI organization-cost importer in this release**. A future integration requires a separate server-side administrative credential authorized for the organization Costs API; an ordinary generation API key is not a substitute. Adding a credential alone does not enable an importer. Without an implemented, authorized and successful integration, organization cost stays unavailable. Keep any future admin credential server-side and preserve organization/project/time-range coverage instead of presenting organization spend as this application's complete spend. See the official [Costs endpoint](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) and [Admin API key documentation](https://platform.openai.com/docs/api-reference/admin-api-keys).

## Migration and rollback

Deploy `2026_09_09_000001_extend_ai_usage_logs_for_observability.php` before enabling application code that reads/writes the new fields. Use the normal reviewed deployment migration command from `website-MindNova-AI`:

```sh
php artisan migrate --pretend
php artisan migrate --force
```

The migration adds nullable request/operation/provenance/cost columns and lookup/aggregation indexes. Existing rows and `cost_estimate` remain intact; no historical measurement or cost backfill occurs. Package settings are written through the API, with no separate schema migration.

For an application rollback, retaining these additive nullable columns is usually sufficient. The older application ignores the versioned package setting and continues to see the preserved legacy quotas. Restoring old code does not automatically translate new package limits into old quota JSON.

If a schema rollback is required, first stop code/workers that access the new columns and back up `ai_usage_logs` plus relevant settings. Inspect `php artisan migrate:status` and the migration batch. Preview a path-scoped rollback:

```sh
php artisan migrate:rollback --pretend --path=database/migrations/2026_09_09_000001_extend_ai_usage_logs_for_observability.php
```

Confirm the preview targets this migration and the intended database before executing the same command without `--pretend` (and with `--force` in production). Laravel's batch rules still apply; do not run an unrestricted rollback of a batch containing unrelated migrations. `down()` drops only the added columns/indexes, which permanently removes their recorded metadata unless restored from backup. It does not delete the original usage rows or `AdminSetting` values.

## Verification and operational checks

Backend tests use schema-refreshing fixtures. Run them only with an explicitly disposable database. Historical migrations are MySQL-specific, so a fresh temporary SQLite database cannot run this repository's complete migration chain. Do not point `RefreshDatabase`, `migrate:fresh`, or test execution at the shared development/production database.

The focused regression command is:

```sh
php artisan test tests/Feature/AdminAiSystemApiTest.php tests/Feature/Student/AiTutorEntitlementTest.php tests/Feature/AiUsageObservabilityTest.php tests/Feature/AdminOverviewApiTest.php tests/Feature/AiFallbackTest.php tests/Feature/Student/GeminiAiServiceTest.php
```

On a configured deployment, verify an admin can read both pages, non-admin API requests are rejected, Save persists supported settings, missing measurements say `Chưa có dữ liệu`, and a missing key says unconfigured. A configured badge alone is never sufficient evidence that an AI request will succeed. Validate mobile navigation with Tab/Shift+Tab, Escape, and focus returning to its trigger.
