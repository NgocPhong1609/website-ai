# Quiz Media and AI Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add uploaded/external question and answer images, quiz thumbnails, and whole-set AI review confirmation across create, edit, management, attempt, and result flows.

**Architecture:** Add nullable managed-key/renderable-URL pairs to quiz entities, implement one purpose-aware temporary image endpoint and promotion service, then extend the existing quiz components. Confirmation is client workflow state and does not break legacy API callers.

**Tech Stack:** Laravel, Eloquent, R2 filesystem, Pest/PHPUnit, Next.js, React, TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-08-quiz-and-lesson-media-design.md`

## Global Constraints

- Images: JPEG, PNG, WebP, GIF; maximum 5 MB.
- External sources must be absolute HTTP/HTTPS URLs.
- Delete only objects represented by an application-owned R2 key.
- AI generation remains text-only and generates single-choice questions.
- Existing save/update payloads remain valid.

---

### Task 1: Quiz media schema and serialization

**Files:**
- Create: `website-MindNova-AI/database/migrations/2026_09_08_000003_add_media_to_quiz_tables.php`
- Modify: `website-MindNova-AI/app/Models/Quiz.php`
- Modify: `website-MindNova-AI/app/Models/Question.php`
- Modify: `website-MindNova-AI/app/Models/Answer.php`
- Modify: `website-MindNova-AI/app/Services/Instructor/QuizService.php`
- Modify: `website-MindNova-AI/app/Http/Controllers/Api/Instructor/QuizGeneratorController.php`
- Test: `website-MindNova-AI/tests/Feature/Instructor/QuizMediaTest.php`

**Interfaces:**
- Produces: nullable quiz thumbnail and question/answer image URL/key pairs in save, update, show, and list responses.

- [ ] **Step 1: Write failing persistence/reload tests**

Store and update a quiz with external HTTP/HTTPS media URLs, assert all values reload, assert invalid schemes receive 422, and assert an old payload still stores successfully.

- [ ] **Step 2: Run RED**

Run: `php artisan test tests/Feature/Instructor/QuizMediaTest.php --filter=persists`

- [ ] **Step 3: Add migration/model fields and extend existing request/service/resource mappings**

Validate external URLs while allowing upload-returned managed key/URL pairs to pass later ownership checks.

- [ ] **Step 4: Run GREEN and existing AI quiz regression tests**

Run: `php artisan test tests/Feature/Instructor/QuizMediaTest.php tests/Feature/Instructor/AiQuizGeneratorTest.php`

- [ ] **Step 5: Commit**

```bash
git add website-MindNova-AI/database/migrations/2026_09_08_000003_add_media_to_quiz_tables.php website-MindNova-AI/app/Models/Quiz.php website-MindNova-AI/app/Models/Question.php website-MindNova-AI/app/Models/Answer.php website-MindNova-AI/app/Services/Instructor/QuizService.php website-MindNova-AI/app/Http/Controllers/Api/Instructor/QuizGeneratorController.php website-MindNova-AI/tests/Feature/Instructor/QuizMediaTest.php
git commit -m "feat: persist quiz media metadata"
```

### Task 2: Temporary quiz image upload and promotion

**Files:**
- Create: `website-MindNova-AI/app/Http/Requests/Instructor/UploadQuizMediaRequest.php`
- Create: `website-MindNova-AI/app/Http/Controllers/Api/Instructor/QuizMediaController.php`
- Create: `website-MindNova-AI/app/Services/Instructor/QuizMediaService.php`
- Modify: `website-MindNova-AI/routes/api.php`
- Modify: `website-MindNova-AI/app/Services/Instructor/QuizService.php`
- Modify: `website-MindNova-AI/app/Http/Controllers/Api/Instructor/QuizGeneratorController.php`
- Test: `website-MindNova-AI/tests/Feature/Instructor/QuizMediaTest.php`

**Interfaces:**
- Produces: `POST /api/instructor/quiz-media` returning `{url, r2_key, mime_type, size_bytes}`.
- Consumes: purpose plus authenticated instructor-owned temporary key during quiz store/update.

- [ ] **Step 1: Write failing upload security tests**

Cover allowed formats, >5 MB, SVG/executable rejection, auth/role rejection, purpose validation, and R2 key namespacing under the authenticated instructor.

- [ ] **Step 2: Run RED**

Run: `php artisan test tests/Feature/Instructor/QuizMediaTest.php --filter=upload`

- [ ] **Step 3: Implement upload endpoint with generated keys and trusted metadata**

Use `Storage::fake('r2')` in tests and existing response envelopes.

- [ ] **Step 4: Write failing promotion/replacement/deletion tests**

Assert only the authenticated instructor's temp keys promote; foreign/stale/arbitrary keys fail; replacing managed media deletes the previous key; external URLs do not invoke deletion; quiz deletion cleans all managed keys.

- [ ] **Step 5: Implement minimal promotion and compensating cleanup service**

Integrate at quiz transaction boundaries and keep storage side effects explicit.

- [ ] **Step 6: Run all quiz media tests GREEN**

Run: `php artisan test tests/Feature/Instructor/QuizMediaTest.php`

- [ ] **Step 7: Commit**

```bash
git add website-MindNova-AI/app/Http/Requests/Instructor/UploadQuizMediaRequest.php website-MindNova-AI/app/Http/Controllers/Api/Instructor/QuizMediaController.php website-MindNova-AI/app/Services/Instructor/QuizMediaService.php website-MindNova-AI/app/Services/Instructor/QuizService.php website-MindNova-AI/app/Http/Controllers/Api/Instructor/QuizGeneratorController.php website-MindNova-AI/routes/api.php website-MindNova-AI/tests/Feature/Instructor/QuizMediaTest.php
git commit -m "feat: manage uploaded quiz media"
```

### Task 3: Shared frontend media editor and quiz authoring integration

**Files:**
- Create: `mindnova-ai/src/features/instructor/quiz-generator/components/QuizImageField.tsx`
- Create: `mindnova-ai/src/features/instructor/quiz-generator/components/__tests__/QuizImageField.test.tsx`
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/types/quizGenerator.types.ts`
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/api/quizGeneratorApi.ts`
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/components/ManualConfigForm.tsx`
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/components/QuestionCardMultipleChoice.tsx`
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/components/QuestionCardEssay.tsx`
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/hooks/useManualQuizWizard.ts`
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/hooks/useAiQuizWizard.ts`

**Interfaces:**
- Produces: a controlled image field for upload, external URL, preview, replace, and remove; media metadata in save payloads.

- [ ] **Step 1: Write failing controlled-field tests**

Assert image validation, upload progress/error state, external URL validation, successful preview state, remove clearing both URL/key, and replacing an upload with a URL clearing the managed key.

- [ ] **Step 2: Run RED**

Run: `npm test -- QuizImageField.test.tsx`

- [ ] **Step 3: Implement the shared field and typed upload helper**

Use the existing API client and visual patterns; avoid a second upload client.

- [ ] **Step 4: Write failing integration serialization tests**

Assert thumbnail/question/answer media flow through manual and AI state to API payloads and reload into edit controls.

- [ ] **Step 5: Integrate the field into configuration and question cards**

Reuse one component for thumbnail, question, and answer purposes.

- [ ] **Step 6: Run focused tests GREEN**

Run: `npm test -- QuizImageField.test.tsx QuestionCardMultipleChoice.test.tsx`

- [ ] **Step 7: Commit**

```bash
git add mindnova-ai/src/features/instructor/quiz-generator
git commit -m "feat: add quiz image authoring controls"
```

### Task 4: Whole-set AI review confirmation

**Files:**
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/hooks/useAiQuizWizard.ts`
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/components/Step4ReviewEditor.tsx`
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/components/QuizGeneratorWizard.tsx`
- Create: `mindnova-ai/src/features/instructor/quiz-generator/components/__tests__/Step4ReviewEditor.test.tsx`

**Interfaces:**
- Produces: `isReviewConfirmed`, `confirmAllQuestions()`, and automatic invalidation for edit/delete/regenerate/media mutations.

- [ ] **Step 1: Write failing confirmation tests**

Assert save disabled initially, confirm-all enables save with valid total, edit invalidates, delete invalidates, single/all regeneration invalidates, and image edits invalidate.

- [ ] **Step 2: Run RED**

Run: `npm test -- Step4ReviewEditor.test.tsx`

- [ ] **Step 3: Add confirmation state and button with complete invalidation paths**

Keep per-question approval and counters intact. Do not make a new backend request field mandatory.

- [ ] **Step 4: Run GREEN**

Run the same focused test.

- [ ] **Step 5: Commit**

```bash
git add mindnova-ai/src/features/instructor/quiz-generator/hooks/useAiQuizWizard.ts mindnova-ai/src/features/instructor/quiz-generator/components/Step4ReviewEditor.tsx mindnova-ai/src/features/instructor/quiz-generator/components/QuizGeneratorWizard.tsx mindnova-ai/src/features/instructor/quiz-generator/components/__tests__/Step4ReviewEditor.test.tsx
git commit -m "feat: confirm complete AI quiz review"
```

### Task 5: Thumbnail management list and student media rendering

**Files:**
- Modify: `mindnova-ai/app/(instructor)/instructor/quiz-generator/page.tsx`
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/types/quizGenerator.types.ts`
- Modify: `mindnova-ai/src/features/student/quiz/types/index.ts`
- Modify: `mindnova-ai/src/features/student/quiz/components/question/QuizQuestionScreen.tsx`
- Modify: `mindnova-ai/src/features/student/quiz/components/result/QuizResultContent.tsx`
- Create: `mindnova-ai/src/features/instructor/quiz-generator/components/__tests__/QuizThumbnailList.test.tsx`
- Extend: `mindnova-ai/src/features/student/quiz/components/question/__tests__/QuizQuestionScreen.test.tsx`
- Extend: `mindnova-ai/src/features/student/quiz/components/result/__tests__/QuizResultContent.test.tsx`
- Modify: `website-MindNova-AI/app/Http/Controllers/Api/StudentQuizController.php`
- Modify: `website-MindNova-AI/app/Services/Student/CourseService.php`
- Test: `website-MindNova-AI/tests/Feature/Student/MultipleCorrectQuizTest.php`

**Interfaces:**
- Consumes: thumbnail/question/answer media response fields.
- Produces: management thumbnails with local fallback and student attempt/result images.

- [ ] **Step 1: Write failing backend response and frontend render tests**

Assert media fields appear in student quiz data/results; assert list uses stored thumbnail and local fallback for null; assert broken images expose fallback; assert question/answer images render with meaningful alt text.

- [ ] **Step 2: Run RED**

Run backend focused test and frontend three focused test files.

- [ ] **Step 3: Extend existing response mappings and frontend render paths**

Do not expose correctness before submission and do not persist fallback URLs.

- [ ] **Step 4: Run GREEN and full available verification**

Run:

```bash
cd website-MindNova-AI && php artisan test
cd ../mindnova-ai && npm test
npm run lint
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add website-MindNova-AI/app/Http/Controllers/Api/StudentQuizController.php website-MindNova-AI/app/Services/Student/CourseService.php website-MindNova-AI/tests/Feature/Student/MultipleCorrectQuizTest.php mindnova-ai/app/'(instructor)'/instructor/quiz-generator/page.tsx mindnova-ai/src/features/instructor/quiz-generator mindnova-ai/src/features/student/quiz
git commit -m "feat: display quiz media across quiz flows"
```

### Task 6: Final cross-subsystem verification

**Files:**
- Verify only; update tests solely when a demonstrated requirement gap exists.

**Interfaces:**
- Consumes all deliverables from the three implementation plans.

- [ ] **Step 1: Run backend focused suites**

```bash
cd website-MindNova-AI
php artisan test tests/Feature/Instructor/LessonAttachmentTest.php tests/Feature/Student/LessonAttachmentAccessTest.php tests/Feature/Instructor/QuizMediaTest.php tests/Feature/Instructor/AiQuizGeneratorTest.php tests/Feature/Student/MultipleCorrectQuizTest.php tests/Unit/QuizGradingServiceTest.php
```

- [ ] **Step 2: Run backend full suite and migration checks**

Run `php artisan migrate:fresh --env=testing`, `php artisan test`, then verify rollback on an isolated test database.

- [ ] **Step 3: Run frontend checks**

Run `npm test`, `npm run lint`, and `npm run build` from `mindnova-ai`.

- [ ] **Step 4: Inspect working tree and diff**

Run `git status --short`, `git diff --check`, and review the complete diff against every completion criterion in the spec.

- [ ] **Step 5: Report evidence and limitations**

List actual commands/results, migrations, changed files, existing functionality retained, additions made, and any checks impossible because dependencies, runtimes, credentials, or services are unavailable.
