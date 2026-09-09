# Admin AI System and AI Configuration Design

## Objective

Complete the existing Admin AI System without replacing the production AI topology. The application must keep its current primary-AI-to-backup flow, expose only configuration that is truly supported, report real usage where available, and avoid displaying invented quota, token, or cost data.

## Confirmed scope

- Work directly on branch `VipTeacher`.
- Preserve `AiRouterService` and the primary then backup execution model.
- Extend the existing `AdminSetting` and `AiUsageLog` architecture instead of creating a parallel AI platform.
- Preserve environment-backed API secrets. No API secret value, masked fragment, or reversible reference is returned to the browser.
- Treat the existing subscription values `free` and `premium` as the initial AI packages. This work configures AI entitlements for those package codes; it does not redesign payment or subscription lifecycle.
- Keep the full writable configuration at `/admin/ai-system`. Add only a compact read-only AI summary at the bottom of the real Admin Overview.
- Do not expose providers or models which the runtime cannot actually execute.

## Current implementation retained

- Admin-only `GET` and `PUT /api/admin/ai-config` routes.
- `AdminSetting` JSON persistence for runtime-editable AI settings.
- `AiUsageLog` as the canonical source for admin AI usage summaries.
- The existing Gemini primary and OpenAI-compatible backup services and fallback order.
- Existing tutor quota and prompt behavior, after validation and consistency fixes.
- Server-side environment/config storage for provider credentials.

## Backend design

### Configuration contract

`GET /api/admin/ai-config` returns one unwrapped, canonical payload:

- `providers.primary` and `providers.backup`, each containing a stable provider name, configured model, and boolean `configured` readiness.
- `usage` with a selected period, total recorded requests, successful/failed counts when recorded, input/output token totals, nullable cost, cost source, provider/model breakdown, and daily trend.
- `packages.free` and `packages.premium`, each containing a daily request limit and optional token limit. A null token limit means the provider/system cannot enforce one reliably.
- `prompts.ai_tro_giang` and `prompts.ai_cham_bai`.
- A configuration update timestamp when it exists.

The response never includes an API key, key suffix, environment value, or stored arbitrary connection object. Provider readiness is computed on the server from Laravel configuration.

`PUT /api/admin/ai-config` accepts only writable settings: package entitlements and prompts. Provider topology remains read-only in this phase because the user approved retaining current primary/backup logic. Validation uses a dedicated Form Request with explicit keys, integer bounds, nullable token limits, and prompt length bounds. Unknown nested data is not persisted.

### Runtime application

- A focused settings repository supplies defaults and persisted values to both the admin controller and tutor quota/prompt path.
- Existing `student_daily_questions` and `guest_daily_questions` values are read compatibly and migrated into `free`/`premium` package entitlements without breaking current installations.
- Authenticated users resolve their active subscription package; absent or expired subscriptions resolve to `free`.
- Tutor quotas use the resolved package entitlement. This change does not impose new quotas on unrelated AI features until those features can share an atomic request executor safely.
- `ai_cham_bai` is connected only to the existing grading path if that path already has a clear system-prompt extension point. Otherwise it remains labeled as stored/not yet applied rather than falsely claiming it is active.

### Usage and cost integrity

- Provider response token metadata remains the preferred source.
- Estimated tokens are never presented as provider-reported tokens. Existing estimated tutor values are marked with an explicit source.
- New usage metadata records request status, latency, fallback usage, provider request ID when supplied, and token/cost source where available.
- Cost becomes nullable. Null means unavailable; zero means an actual recorded zero.
- No model pricing is hardcoded in application code during this phase.
- OpenAI organization costs may be shown only when a separately configured server-side Admin credential permits the official Costs API. Failure or absence produces an unavailable state, not a fabricated estimate.
- Existing locally recorded cost values are labeled by source; legacy mixed estimates are not relabeled as actual spend.
- Usage summaries disclose their coverage and do not imply that unlogged AI paths are included.

The official OpenAI Usage API provides request and token aggregation and a separate Costs endpoint; organization access requires a server-side administrative credential. The implementation must degrade safely when this is not configured.

### Data changes

Use migrations only. Extend `ai_usage_logs` minimally with nullable operational fields needed for truthful reporting:

- `request_id` UUID/string and optional `provider_request_id`;
- `status` and optional sanitized `error_code`;
- `duration_ms`;
- `fallback_used`;
- `token_source` and `cost_source`;
- nullable `cost_amount` plus `cost_currency`.

Keep `cost_estimate` for backward compatibility. Do not add normalized provider/model/credential tables in this phase. Package entitlements remain typed JSON in `admin_settings` under a new versioned setting key, with compatibility reads for old quotas.

### Privacy and security

- New AI logs must not persist full provider request payloads, raw credentials, authorization headers, IP addresses, or user agents in usage metadata.
- Existing content fields are not destructively deleted by the migration, but new shared logging paths omit raw prompt/output by default unless a feature explicitly requires retained content.
- Provider error bodies are sanitized before reaching clients or normal application exceptions.
- All Admin endpoints retain `auth:sanctum` plus `role:admin` protection.

## Frontend design

### Dedicated AI System page

The page uses one canonical TypeScript contract and the existing `adminApi` client. Delete or retire the dead `/admin/ai-system` service contract so there is one source of truth.

Page order:

1. Compact hero with restrained slate/teal/blue gradient.
2. Period selector and usage summary cards for requests, input tokens, output tokens, and cost.
3. Daily request trend and provider/model breakdown from real stored records.
4. Read-only primary and backup status cards showing provider, model, and configured/unavailable state.
5. Editable Free/Premium package entitlement cards.
6. Prompt editor with applied/not-applied status, length guidance, Save and Cancel.

Unavailable metrics display `Chưa có dữ liệu` or an equally explicit explanation. They never display fake zeroes.

### Interaction states

- Skeleton/loading layout preserves the page structure.
- Fetch errors are visible and include Retry.
- Validation errors are associated with their fields.
- Success and error messages use semantic status roles.
- Dirty-state refresh prompts before replacing edits; Save and Cancel are explicit.
- Server response is reloaded after a successful update.

### Visual system and responsive behavior

- Use valid Tailwind utilities and existing project primitives where they fit.
- Use a consistent hierarchy: page panels at `rounded-2xl`, fields/buttons at `rounded-xl`.
- Use one light panel shadow and a single stronger hero shadow; avoid stacked heavy shadows.
- Use 16px base gaps and compact 16–20px panel padding.
- On narrow viewports, form and metric grids stack.
- Add a mobile/tablet Admin navigation drawer or collapsible sidebar and hide/reflow secondary topbar controls. Desktop behavior remains unchanged.
- Remove hardcoded sidebar telemetry claims or label them as navigation decoration; no status may be presented as live without API data.

### Admin Overview

- `/admin` becomes the actual `AdminOverviewPage`; `/admin/analytics` remains analytics.
- Repair the Overview data contract/route before mounting it.
- Add a compact, read-only AI summary at the bottom: recorded requests, token availability, cost availability, primary/backup readiness, package limits, and a link to `/admin/ai-system`.
- Do not embed the full writable configuration form in Overview.

## Testing and verification

Backend tests must cover:

- Admin authentication and role authorization.
- Canonical GET shape and absence of secrets.
- PUT allowlist, validation, persistence, and rejection of unknown provider/connection/key payloads.
- Free/Premium package resolution and runtime tutor quota application.
- Usage summary aggregation, nullable/unavailable cost, real token source labels, period boundaries, and provider breakdown.
- Primary/backup logging metadata without changing fallback order.
- Sanitized logging and provider errors.

Frontend tests must cover:

- Loading, error, retry, loaded and unavailable-metric states.
- Package and prompt validation, dirty state, cancel, save and success/error feedback.
- Primary/backup readiness rendering without secret material.
- Overview summary link and responsive navigation behavior where the project test stack supports DOM viewport tests.

Final verification includes targeted tests first, then relevant Laravel suite, frontend tests, lint, TypeScript check, production build, migration status/rollback safety, and manual viewport inspection at phone, tablet, and desktop widths.

## Non-goals

- Replacing the Gemini-to-backup topology.
- Adding Claude or an internal provider adapter.
- Building a generic provider marketplace or secret vault.
- Reworking payment/subscription lifecycle.
- Applying quotas to every AI feature before a unified atomic executor exists.
- Inventing historical costs or retroactively guessing provider token usage.

## Success criteria

- Admin sees only truthful provider readiness, usage, token, quota, package and cost information.
- Free/Premium AI entitlement changes persist and affect the tutor runtime.
- Primary and backup behavior continues to work in its current order.
- No secret reaches frontend payloads or logs introduced by this work.
- AI System and Admin shell are usable across supported viewport sizes.
- Existing working AI tests remain passing or are corrected only where they assert obsolete contracts.
