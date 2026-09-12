# Task 4 fix report: AI Tutor compatibility boundary

## Status

Complete. The reachable compatibility endpoint `POST /api/student/ai-tutor/chat` now uses the same authenticated, course-scoped tutor service as the live Study Plan endpoint while retaining its streamed success response and quota headers.

## Root cause

- `StudyPlanController` already delegated through `StudyPlanService` to `CourseAiTutorService`, which owns course context, the immutable platform guard, injection rejection, daily quota reservation, provider routing/fallback, usage logging, and conversation persistence.
- `AiTutorController` was a second independent implementation. It selected an OpenAI-compatible provider itself, sent only the editable Admin tutor prompt, reserved the quota directly, and wrote separate logs. Consequently, the compatibility endpoint could answer without an enrolled published course and could bypass the canonical course guard and provider routing.
- `AiTutorTest` still expected an obsolete JSON response and unscoped mock provider behavior even though the endpoint's established compatibility contract is `StreamedResponse`.
- `AdminOverviewApiTest` expected the old free quota of 30, while `AiSettingsRepository` defines the canonical free default as 5.

## Implementation

- Replaced the duplicate provider implementation in `AiTutorController` with a thin adapter over `CourseAiTutorService::answer()`.
- Applied the shared `AiChatRequest` validation to `message`, optional `lesson_id`, and bounded `history`.
- Preserved the compatibility success contract: `text/event-stream`, the answer body, and `X-AI-Daily-Limit`, `X-AI-Used`, and `X-AI-Remaining` headers.
- Mapped canonical failures without exposing provider details:
  - implicit missing context: 422;
  - explicit missing/inaccessible context: canonical generic 403;
  - prompt injection: 422;
  - exhausted quota: 429 with the legacy direct `meta` quota shape;
  - provider/configuration/internal failure: safe 503.
- Replaced the obsolete compatibility test with enrolled, published course/lesson fixtures and assertions for streamed output, immutable course context, Admin style as an untrusted user message, bounded history, canonical provider selection, conversation persistence, and provider usage logging.
- Reconciled entitlement coverage around the shared service: free and premium counters are shared across both routes; context/configuration/prompt-preparation failures do not spend quota or call providers.
- Updated only the stale Admin overview test expectation from 30 to 5; no production quota change was made.

## TDD evidence

Initial compatibility RED:

- 5 failed, 14 assertions, 39.32 seconds.
- The scoped provider test received `Legacy bypass answer` instead of the canonical Gemini answer.
- Invalid `lesson_id`/history, missing implicit context, and prompt injection each returned 200 instead of 422.
- Provider exhaustion returned the legacy streamed 200 fallback instead of safe 503.

Focused GREEN after the minimal adapter:

- `AiTutorTest`: 5 passed, 52 assertions, 43.14 seconds.
- `AiTutorEntitlementTest`: 4 passed, 63 assertions, 43.57 seconds.
- The final combined run includes an additional explicit inaccessible-context compatibility case.

## Exact verification

Run from `website-MindNova-AI` using the available PHP test image and MySQL test database:

```bash
docker run --rm --network mindnova-test-network \
  -e APP_ENV=testing \
  -e DB_CONNECTION=mysql \
  -e DB_HOST=mindnova-test-db \
  -e DB_PORT=3306 \
  -e DB_DATABASE=mindnova_test \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=mindnova_test \
  -v "$PWD":/app -w /app codex-mindnova-php:test \
  php artisan test \
    tests/Feature/Student/AiTutorTest.php \
    tests/Feature/Student/AiTutorEntitlementTest.php \
    tests/Feature/Student/CourseAiTutorServiceTest.php \
    tests/Feature/StudentStudyPlanApiTest.php \
    tests/Feature/AdminOverviewApiTest.php
```

Result: PASS — 56 tests, 528 assertions, 98.71 seconds on the final verification run.

Syntax and formatting:

```bash
docker run --rm -v "$PWD":/app -w /app codex-mindnova-php:test sh -lc \
  'php -l app/Http/Controllers/Api/Student/AiTutorController.php && \
   php -l tests/Feature/Student/AiTutorTest.php && \
   php -l tests/Feature/Student/AiTutorEntitlementTest.php && \
   php -l tests/Feature/AdminOverviewApiTest.php && \
   vendor/bin/pint --test \
     app/Http/Controllers/Api/Student/AiTutorController.php \
     tests/Feature/Student/AiTutorTest.php \
     tests/Feature/Student/AiTutorEntitlementTest.php \
     tests/Feature/AdminOverviewApiTest.php'
```

Result: PASS — no PHP syntax errors; Pint passed all four files.

## Concerns and compatibility notes

- Canonical router configuration now controls the compatibility endpoint (Gemini primary plus configured backup). The old `services.ai_tutor.provider` direct-routing behavior was the security bypass and is intentionally no longer used by this endpoint.
- Success still uses `StreamedResponse`, but `CourseAiTutorService` resolves the provider answer synchronously before the response callback emits the complete answer as one chunk. The previous implementation also buffered the complete provider answer rather than forwarding provider tokens incrementally, so no token-level streaming capability was removed.
- Compatibility-only toxic-keyword moderation and `ActivityLog` writes were removed with the duplicate stack. The endpoint now has the same immutable guard, injection rejection, provider usage logging, and conversation persistence behavior as the canonical Study Plan tutor.
- PHP is unavailable on the host; all backend execution used the repository's established `codex-mindnova-php:test` Docker image.
- Three unrelated pre-existing Task 4 changes were committed independently as `e6bf0a0` while this fix was in progress; they are excluded from this fix commit.
