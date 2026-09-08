# Multiple-Correct Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let authors create explicit multiple-correct questions and grade student answer sets with approved non-negative partial credit while preserving single-choice quizzes.

**Architecture:** Add an explicit question mode and JSON attempt selections, extend existing store/update services and student grading, then adapt current authoring and attempt components. Scalar legacy contracts remain valid.

**Tech Stack:** Laravel, Eloquent, Pest/PHPUnit, React, TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-08-quiz-and-lesson-media-design.md`

## Global Constraints

- Existing questions default to `single_choice`.
- Single-choice behavior and essay grading must not change.
- Multiple-choice requires at least two correct answers.
- Partial credit uses the approved capped formula and never becomes negative.

---

### Task 1: Additive question and attempt schema

**Files:**
- Create: `website-MindNova-AI/database/migrations/2026_09_08_000002_add_selection_fields_to_quiz_tables.php`
- Modify: `website-MindNova-AI/app/Models/Question.php`
- Modify: `website-MindNova-AI/app/Models/UserQuizAttemptAnswer.php`
- Test: `website-MindNova-AI/tests/Feature/Student/MultipleCorrectQuizTest.php`

**Interfaces:**
- Produces: `Question.selection_type` and cast array `UserQuizAttemptAnswer.selected_answer_ids`.

- [ ] **Step 1: Write a failing compatibility test**

Assert a legacy question reads `single_choice`; assert selected ID arrays round-trip through the model without modifying `user_answer`.

- [ ] **Step 2: Run RED**

Run: `php artisan test tests/Feature/Student/MultipleCorrectQuizTest.php --filter=schema`

- [ ] **Step 3: Add migration, fillable fields, and casts**

Use a defaulted string for `selection_type` and nullable JSON for `selected_answer_ids`.

- [ ] **Step 4: Run GREEN and migration check**

Run focused test and `php artisan migrate --pretend`.

- [ ] **Step 5: Commit**

```bash
git add website-MindNova-AI/database/migrations/2026_09_08_000002_add_selection_fields_to_quiz_tables.php website-MindNova-AI/app/Models/Question.php website-MindNova-AI/app/Models/UserQuizAttemptAnswer.php website-MindNova-AI/tests/Feature/Student/MultipleCorrectQuizTest.php
git commit -m "feat: persist multiple answer selections"
```

### Task 2: Authoring validation and persistence

**Files:**
- Modify: `website-MindNova-AI/app/Http/Requests/Instructor/StoreQuizRequest.php`
- Modify: `website-MindNova-AI/app/Http/Requests/Instructor/StoreAiQuizRequest.php`
- Modify: `website-MindNova-AI/app/Services/Instructor/QuizService.php`
- Modify: `website-MindNova-AI/app/Http/Controllers/Api/Instructor/QuizGeneratorController.php`
- Modify: `website-MindNova-AI/app/Services/Instructor/LessonService.php`
- Test: `website-MindNova-AI/tests/Feature/Instructor/AiQuizGeneratorTest.php`

**Interfaces:**
- Consumes/produces: optional `questions.*.selection_type`; answer booleans stay unchanged.

- [ ] **Step 1: Write failing request tests**

Cover legacy omitted mode with exactly one correct answer, explicit single with two correct answers rejected, multiple with one correct rejected, and multiple with two correct accepted and persisted.

- [ ] **Step 2: Run RED**

Run: `php artisan test tests/Feature/Instructor/AiQuizGeneratorTest.php --filter=correct`

- [ ] **Step 3: Extend request validation and every existing quiz persistence path**

Default missing mode to `single_choice`; persist all supplied `is_correct` values without the legacy formatter discarding extra correct answers when mode is multiple.

- [ ] **Step 4: Run GREEN and existing quiz tests**

Run: `php artisan test tests/Feature/Instructor/AiQuizGeneratorTest.php tests/Feature/AttachQuizTest.php`

- [ ] **Step 5: Commit**

```bash
git add website-MindNova-AI/app/Http/Requests/Instructor/StoreQuizRequest.php website-MindNova-AI/app/Http/Requests/Instructor/StoreAiQuizRequest.php website-MindNova-AI/app/Services/Instructor/QuizService.php website-MindNova-AI/app/Http/Controllers/Api/Instructor/QuizGeneratorController.php website-MindNova-AI/app/Services/Instructor/LessonService.php website-MindNova-AI/tests/Feature/Instructor/AiQuizGeneratorTest.php
git commit -m "feat: validate multiple-correct quiz authoring"
```

### Task 3: Multiple-answer grading and persistence

**Files:**
- Modify: `website-MindNova-AI/app/Services/Student/QuizGradingService.php`
- Modify: `website-MindNova-AI/app/Http/Controllers/Api/StudentQuizController.php`
- Test: `website-MindNova-AI/tests/Unit/QuizGradingServiceTest.php`
- Test: `website-MindNova-AI/tests/Feature/Student/MultipleCorrectQuizTest.php`

**Interfaces:**
- Consumes: array of answer IDs for a persisted `multiple_choice` mode question.
- Produces: selected/correct ID lists, selected-correct/missed/incorrect states, and awarded/max points.

- [ ] **Step 1: Write failing unit tests for the scoring matrix**

For a 2-point question with two correct answers, assert: none = 0; one correct = 1; two correct = 2; two correct plus wrong = 1; duplicate IDs do not inflate; foreign IDs are invalid. Add a legacy scalar test proving current single-choice result is unchanged.

- [ ] **Step 2: Run RED**

Run: `php artisan test tests/Unit/QuizGradingServiceTest.php`

- [ ] **Step 3: Implement a focused answer-set resolver and capped scoring branch**

Normalize numeric IDs, de-duplicate, validate membership, calculate the formula from persisted correct answers, and retain the existing resolver for single choice.

- [ ] **Step 4: Run unit tests GREEN**

Run the same focused test.

- [ ] **Step 5: Write failing submission persistence tests**

Submit a full attempt and assert arrays are stored in `selected_answer_ids`, `user_answer` remains usable for old modes, and result JSON exposes the answer sets and partial points.

- [ ] **Step 6: Extend request validation/controller persistence and result serialization**

Never cast an array to string. Branch by persisted question mode and reject IDs outside the question.

- [ ] **Step 7: Run GREEN and student quiz regressions**

Run: `php artisan test tests/Feature/Student/MultipleCorrectQuizTest.php tests/Unit/QuizGradingServiceTest.php`

- [ ] **Step 8: Commit**

```bash
git add website-MindNova-AI/app/Services/Student/QuizGradingService.php website-MindNova-AI/app/Http/Controllers/Api/StudentQuizController.php website-MindNova-AI/tests/Unit/QuizGradingServiceTest.php website-MindNova-AI/tests/Feature/Student/MultipleCorrectQuizTest.php
git commit -m "feat: grade multiple-correct answers"
```

### Task 4: Instructor authoring UI

**Files:**
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/types/quizGenerator.types.ts`
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/components/QuestionCardMultipleChoice.tsx`
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/components/ManualQuizEditor.tsx`
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/hooks/useManualQuizWizard.ts`
- Modify: `mindnova-ai/src/features/instructor/quiz-generator/api/quizGeneratorApi.ts`
- Modify: `mindnova-ai/src/features/instructor/lesson-management/api/index.ts`
- Create: `mindnova-ai/src/features/instructor/quiz-generator/components/__tests__/QuestionCardMultipleChoice.test.tsx`

**Interfaces:**
- Produces: `selection_type: "single_choice" | "multiple_choice"` and multiple answer booleans in save payloads.

- [ ] **Step 1: Write failing mode and payload tests**

Assert radio behavior for legacy mode, checkbox behavior for multiple mode, two correct answers survive serialization, and changing to single is blocked until one correct answer is retained.

- [ ] **Step 2: Run RED**

Run: `npm test -- QuestionCardMultipleChoice.test.tsx`

- [ ] **Step 3: Extend types/state/card behavior and payload serializers minimally**

Do not change AI generation output; generated questions initialize as `single_choice`.

- [ ] **Step 4: Run GREEN, typecheck through build, and lint**

Run: `npm test -- QuestionCardMultipleChoice.test.tsx`

Run: `npm run lint`

Run: `npm run build`

- [ ] **Step 5: Commit**

```bash
git add mindnova-ai/src/features/instructor/quiz-generator mindnova-ai/src/features/instructor/lesson-management/api/index.ts
git commit -m "feat: author multiple-correct quiz questions"
```

### Task 5: Student attempt and result UI

**Files:**
- Modify: `mindnova-ai/src/features/student/quiz/types/index.ts`
- Modify: `mindnova-ai/src/features/student/quiz/api/index.ts`
- Modify: `mindnova-ai/src/features/student/quiz/components/question/QuizQuestionScreen.tsx`
- Modify: `mindnova-ai/src/features/student/quiz/components/result/QuizResultContent.tsx`
- Create: `mindnova-ai/src/features/student/quiz/components/question/__tests__/QuizQuestionScreen.test.tsx`
- Create: `mindnova-ai/src/features/student/quiz/components/result/__tests__/QuizResultContent.test.tsx`

**Interfaces:**
- Consumes: question mode and result answer-set fields.
- Produces: scalar or array submission selected by persisted mode.

- [ ] **Step 1: Write failing student UI tests**

Assert radios/scalar for single mode; checkboxes/de-duplicated arrays for multiple mode; result styles for selected-correct, missed-correct, and selected-incorrect; partial point text.

- [ ] **Step 2: Run RED**

Run: `npm test -- QuizQuestionScreen.test.tsx QuizResultContent.test.tsx`

- [ ] **Step 3: Extend types, state, serialization, and result rendering**

Keep essay state and submission untouched.

- [ ] **Step 4: Run GREEN and frontend verification**

Run focused tests, `npm run lint`, and `npm run build`.

- [ ] **Step 5: Commit**

```bash
git add mindnova-ai/src/features/student/quiz
git commit -m "feat: support multiple selections in student quizzes"
```
