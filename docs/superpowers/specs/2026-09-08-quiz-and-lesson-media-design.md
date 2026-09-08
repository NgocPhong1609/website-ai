# Quiz Management and Lesson Attachments Design

**Date:** 2026-09-08

**Status:** Approved

## Goal

Extend the existing lesson and quiz workflows with document attachments, multiple-correct questions, AI-review confirmation, question/answer images, and quiz thumbnails without rewriting the working manual quiz, AI generation, lesson editor, or existing single-choice grading flows.

## Existing Implementation and Scope Decisions

The current implementation already provides:

- article lessons with CKEditor content and R2-backed image/video media;
- manual quiz creation, editing, saving, publishing, and course attachment;
- AI quiz generation from text, topic, or course content;
- an AI review screen with inline editing, per-question approval, deletion, regeneration, score summaries, and draft/published saves;
- single-choice and essay student answering and grading;
- an `answers.is_correct` boolean that can physically represent more than one correct row, although all current application behavior assumes exactly one correct answer.

This work preserves those foundations. It does not introduce a general polymorphic media subsystem, change AI provider behavior, add AI image generation/vision, refactor unrelated code, or replace existing API contracts.

## Confirmed Product Decisions

- Lesson documents support DOC, DOCX, XLS, XLSX, PPT, PPTX, and PDF, with a 25 MB limit per file.
- Question and answer images support both system uploads and external HTTP/HTTPS URLs.
- Each multiple-choice question explicitly declares `single_choice` or `multiple_choice` selection mode.
- Existing questions default to `single_choice` and retain their current behavior.
- Multiple-choice partial credit never becomes negative.
- Selecting an incorrect answer does not subtract already-earned correct-answer credit, but it prevents a full score by applying the approved cap described below.
- The existing AI review UI remains in place. A new whole-quiz confirmation action is added, and any subsequent edit, deletion, or regeneration invalidates that confirmation.
- AI-generated multiple-choice questions remain single-choice unless a later, separately approved feature changes AI generation semantics.

## Architecture

Use domain-specific additive extensions:

1. A dedicated `lesson_attachments` table and lesson attachment API manage downloadable documents.
2. Nullable quiz media fields and a shared quiz-media upload flow manage thumbnails and question/answer images.
3. An explicit question selection mode and a nullable JSON attempt-answer field add multiple-answer behavior while keeping legacy scalar answers intact.
4. Existing services, requests, resources, and frontend components are extended in place rather than replaced or duplicated.

## Database Design

### Lesson attachments

Create `lesson_attachments` with:

- `id`;
- `lesson_id`, foreign key with database cascade delete;
- `uploaded_by`, nullable foreign key to users with null-on-delete behavior;
- `display_name`;
- `original_name`;
- `mime_type`;
- `extension`;
- `size_bytes`;
- `r2_key`, unique;
- timestamps.

The application service deletes the R2 object when an attachment is removed. Database cascade protects relational integrity when a lesson is deleted; lesson deletion logic must delete managed R2 objects before or alongside deletion because a database cascade cannot delete object-storage content.

### Question selection and media

Add to `questions`:

- `selection_type`, string/enum-compatible value with default `single_choice`;
- `image_url`, nullable text/string suitable for the configured R2 URL or an external URL;
- `image_r2_key`, nullable string used only for system-managed uploads.

Add to `answers`:

- `image_url`, nullable text/string;
- `image_r2_key`, nullable string used only for system-managed uploads.

`image_url` is the renderable value. `image_r2_key` determines whether the application owns and may delete the object. External URLs always have a null managed key.

### Quiz thumbnails

Add to `quizzes`:

- `thumbnail_url`, nullable text/string;
- `thumbnail_r2_key`, nullable string used only for system-managed uploads.

Existing quizzes render the frontend fallback and are not backfilled with synthetic or mock URLs.

### Student selections

Add `selected_answer_ids` as nullable JSON to `user_quiz_attempt_answers`.

- Single-choice and essay submissions continue to use the existing `user_answer` field.
- Multiple-choice submissions persist a normalized, de-duplicated list of answer IDs in `selected_answer_ids`.
- No old rows are rewritten.

All schema changes are additive. New media columns are nullable, and `selection_type` defaults to `single_choice`, preserving existing data.

## Storage Design

Use the configured R2 filesystem disk and the existing signed-URL approach.

### Document keys

Persist lesson documents under:

`lessons/{lesson_id}/attachments/{uuid}.{validated_extension}`

Never derive storage keys from untrusted original names. Preserve the original name only as metadata.

### Quiz media keys

Because quiz media can be selected before a quiz exists, initial uploads use:

`temp/quiz-media/{instructor_id}/{uuid}.{validated_extension}`

After a successful quiz save, managed files referenced by the payload are promoted to quiz-owned locations:

- `quizzes/{quiz_id}/thumbnail/{uuid}.{extension}`;
- `quizzes/{quiz_id}/questions/{question_id}/{uuid}.{extension}`;
- `quizzes/{quiz_id}/questions/{question_id}/answers/{answer_id}/{uuid}.{extension}`.

Only keys created for the authenticated instructor and returned by the upload API may be promoted. Unreferenced temporary media is eligible for the same scheduled/stale cleanup pattern used by current lesson temporary media.

### Cleanup rules

- Replacing or removing managed media deletes its previous R2 key after the database update is known to be valid.
- Removing a quiz, question, answer, attachment, or lesson deletes its owned R2 objects.
- External URLs are never deleted by the application.
- If a storage move succeeds but the database transaction fails, the service performs compensating cleanup or moves the object back when safe.
- API responses return renderable URLs; document download access uses short-lived signed URLs after authorization.

## Validation

### Lesson documents

Each document must satisfy all of:

- maximum size 25 MB;
- extension in DOC, DOCX, XLS, XLSX, PPT, PPTX, PDF;
- MIME type compatible with the declared extension;
- an actual uploaded file accepted by Laravel's file validation.

The frontend `accept` filter mirrors, but does not replace, backend validation.

### Quiz images and thumbnails

- Maximum size: 5 MB per file.
- Formats: JPEG, PNG, WebP, and GIF.
- External source: absolute HTTP or HTTPS URL only.
- A media value is either managed upload metadata or an external URL, never both from unrelated sources.

### Questions and answers

- `single_choice` requires exactly one correct answer.
- `multiple_choice` requires at least two correct answers.
- Submitted selected answer IDs must be unique and belong to the submitted question.
- Existing scalar single-choice submissions remain valid.

## API Design

### Lesson attachments

Add authenticated endpoints consistent with current instructor/student route groups for:

- upload one or more attachments to an instructor-owned lesson;
- list lesson attachments through the lesson resource;
- update an attachment display name;
- delete an attachment;
- request an authorized signed download URL.

Students may obtain a signed URL only when existing course/lesson access rules permit them to view the lesson. Instructors must own or otherwise be authorized to update the course containing the lesson.

### Quiz media

Add an instructor-only temporary media upload endpoint. It accepts an image plus a declared purpose (`thumbnail`, `question`, or `answer`) and returns:

- renderable temporary URL;
- managed temporary R2 key;
- MIME type and size needed for frontend display/validation.

The existing save/update quiz payload is extended with optional fields:

- quiz `thumbnail_url`, `thumbnail_r2_key`;
- question `selection_type`, `image_url`, `image_r2_key`;
- answer `image_url`, `image_r2_key`.

Legacy payloads remain accepted.

### Student answers

The answer-submission contract accepts:

- the existing scalar value for single-choice or essay questions;
- an array of answer IDs for `multiple_choice` questions.

The service normalizes the input according to the persisted question mode and rejects cross-question or nonexistent answer IDs.

## Multiple-Answer Scoring

For a multiple-choice question:

```text
base_score = question_points * selected_correct_count / total_correct_count
```

If one or more incorrect answers were selected:

```text
maximum_score = question_points * (total_correct_count - 1) / total_correct_count
awarded_score = min(base_score, maximum_score)
```

Otherwise:

```text
awarded_score = base_score
```

The score is bounded from zero to the question's points and rounded using the same precision policy as existing quiz totals. This means an incorrect selection never subtracts credit already earned from correct selections, but selecting every option cannot yield full credit. Multiple-choice questions require at least two correct answers, so the approved cap is meaningful.

Single-choice and essay grading paths remain unchanged.

The grading response includes selected answer IDs, correct answer IDs, awarded points, and question points so the result screen can distinguish selected-correct, missed-correct, and selected-incorrect answers.

## Frontend Design

### Lesson authoring and learning

The article lesson create/edit UI gains a document attachment area without modifying CKEditor behavior. It supports multi-file selection, per-file upload status, validation feedback, display-name editing, removal, and download.

The student lesson view renders an attachment list below lesson content with file name, type, size, and an authorized download/open action.

### Manual quiz authoring and editing

Each multiple-choice question exposes a selection-mode control:

- `single_choice` renders correct-answer radios;
- `multiple_choice` renders correct-answer checkboxes.

Changing from multiple to single does not silently discard correctness choices. The UI asks the author to retain one correct answer before accepting the mode change.

Question and answer editors add:

- image upload;
- external URL entry;
- preview;
- replace action;
- remove action.

Quiz configuration adds the same controls for a thumbnail. The edit flow reloads all persisted media values.

### AI review

Keep the current full-list review, inline editing, filtering, deletion, per-question approval, regeneration, and point summary.

Add a whole-quiz confirmation state and action:

- “Confirm all questions” marks the current reviewed set as confirmed;
- save controls are disabled until confirmation;
- editing, deleting, regenerating one question, or regenerating the set invalidates confirmation;
- image edits also invalidate confirmation;
- this guard applies in the AI wizard UI and does not make an incompatible field mandatory for legacy API callers.

### Student quiz and results

- Single-choice questions retain radio controls and scalar submission.
- Multiple-choice questions use checkboxes and submit answer ID arrays.
- Question and answer images render in the attempt UI and results UI.
- Results visually distinguish correct selected answers, correct missed answers, and incorrect selected answers, and show partial points awarded.

### Quiz management

Create and edit pages show thumbnail upload/URL controls and preview. Management list cards/rows display the thumbnail. Quizzes with no thumbnail use a local design fallback without writing fallback data to the database.

## Error Handling

- Validation failures return field-specific 422 responses in the existing API envelope.
- Unauthorized media and attachment access returns the existing authorization response format.
- Upload failures do not mutate quiz/lesson records.
- Save failures retain enough frontend state for retry and clean up newly promoted orphan objects.
- A failed external image load shows the existing visual fallback and keeps the URL editable.
- A stale or foreign temporary R2 key is rejected during save.

## Testing Strategy

Use TDD for every behavior change.

Backend coverage includes:

- document extension, MIME, and 25 MB boundary validation;
- instructor ownership and student lesson-access authorization;
- attachment upload, metadata, signed URL, rename, delete, and cleanup;
- migrations and model serialization for nullable/default fields;
- legacy single-choice payload and grading regression cases;
- valid and invalid correct-answer counts for each selection mode;
- multiple selection normalization, cross-question ID rejection, persistence, and response shape;
- partial-credit cases: none correct, some correct, all correct, correct plus incorrect, duplicates, and all options;
- managed upload promotion, external URLs, replacement, deletion, and cleanup;
- quiz thumbnail/question/answer image persistence and reload.

Frontend coverage includes:

- single/multiple mode control behavior and serialization;
- preventing invalid mode transitions or save states;
- question, answer, and thumbnail media upload/URL/remove flows;
- whole-AI-review confirmation and invalidation on every mutation;
- lesson attachment validation and UI lifecycle;
- student array submissions and partial-result rendering;
- quiz list thumbnail and fallback rendering.

Verification includes relevant focused tests, available backend/frontend suites, migration and rollback checks against the test database, frontend typecheck, lint, and production build. If PHP, Composer dependencies, Node dependencies, storage credentials, or external AI credentials remain unavailable, the final report must distinguish static verification from commands that were actually executed and must not claim unverified runtime success.

## Compatibility and Non-Goals

- No destructive data migration.
- No required changes to old quiz payloads.
- No scoring change for old `single_choice` questions or essays.
- No changes to AI provider selection, prompt routing, or AI multimedia understanding.
- No document embedding inside CKEditor HTML; lesson attachments remain structured resources.
- No general-purpose media abstraction or unrelated refactor.
- No mock data or hardcoded production content.

## Completion Criteria

The work is complete only when:

1. Approved document types upload to the configured storage, reload with lesson data, and can be authorized, listed, renamed, downloaded, and removed.
2. Existing quizzes remain single-choice by default and retain current save/attempt/grade behavior.
3. Authors can create and edit multiple-correct questions, and student submissions persist and receive the approved partial-credit result.
4. AI-generated questions are fully reviewable and require whole-set confirmation in the UI before saving.
5. Question, answer, and quiz images support upload and external URLs throughout create, edit, management, attempt, and result flows.
6. Quiz thumbnails reload correctly and appear in create/edit and management pages with a non-persisted fallback for old quizzes.
7. Relevant automated checks pass where the environment permits, and every unavailable verification is explicitly reported.
