# Lesson Attachments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add authorized DOC/DOCX/XLS/XLSX/PPT/PPTX/PDF attachments to article lessons using the configured R2 storage.

**Architecture:** Add a dedicated attachment model/table and extend the existing lesson controller/service/resource and frontend lesson forms. Reuse current lesson authorization and signed-URL patterns; keep CKEditor media unchanged.

**Tech Stack:** Laravel, Eloquent, Pest/PHPUnit, Next.js, React, TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-08-quiz-and-lesson-media-design.md`

## Global Constraints

- Documents: DOC, DOCX, XLS, XLSX, PPT, PPTX, PDF; maximum 25 MB each.
- Use the configured `r2` disk and signed download URLs.
- Do not put documents into `lesson_media` or CKEditor HTML.
- Preserve all existing lesson payloads and behavior.

---

### Task 1: Attachment schema and model

**Files:**
- Create: `website-MindNova-AI/database/migrations/2026_09_08_000001_create_lesson_attachments_table.php`
- Create: `website-MindNova-AI/app/Models/LessonAttachment.php`
- Modify: `website-MindNova-AI/app/Models/Lesson.php`
- Test: `website-MindNova-AI/tests/Feature/Instructor/LessonAttachmentTest.php`

**Interfaces:**
- Produces: `Lesson::attachments(): HasMany`, attachment metadata fields defined by the spec.

- [ ] **Step 1: Write a failing schema/model test**

Create a lesson attachment through `$lesson->attachments()->create([...])`, assert the row exists, assert `size_bytes` casts to integer, and assert deleting the lesson removes the row.

- [ ] **Step 2: Run RED**

Run: `php artisan test tests/Feature/Instructor/LessonAttachmentTest.php --filter=schema`

Expected: FAIL because the table/model/relation does not exist.

- [ ] **Step 3: Add the additive migration, model, casts, fillable fields, and lesson relation**

Use `foreignId('lesson_id')->constrained()->cascadeOnDelete()`, nullable `uploaded_by` with `nullOnDelete()`, unique `r2_key`, and the metadata fields exactly as specified.

- [ ] **Step 4: Run GREEN and rollback verification**

Run: `php artisan test tests/Feature/Instructor/LessonAttachmentTest.php --filter=schema`

Run: `php artisan migrate --pretend`

Expected: PASS; migration SQL is additive.

- [ ] **Step 5: Commit**

```bash
git add website-MindNova-AI/database/migrations/2026_09_08_000001_create_lesson_attachments_table.php website-MindNova-AI/app/Models/LessonAttachment.php website-MindNova-AI/app/Models/Lesson.php website-MindNova-AI/tests/Feature/Instructor/LessonAttachmentTest.php
git commit -m "feat: add lesson attachment persistence"
```

### Task 2: Instructor attachment API and storage lifecycle

**Files:**
- Create: `website-MindNova-AI/app/Http/Requests/Instructor/UploadLessonAttachmentRequest.php`
- Create: `website-MindNova-AI/app/Http/Requests/Instructor/UpdateLessonAttachmentRequest.php`
- Modify: `website-MindNova-AI/app/Http/Controllers/Api/Instructor/LessonController.php`
- Modify: `website-MindNova-AI/app/Services/Instructor/LessonService.php`
- Modify: `website-MindNova-AI/routes/api.php`
- Test: `website-MindNova-AI/tests/Feature/Instructor/LessonAttachmentTest.php`

**Interfaces:**
- Produces: upload/list metadata, rename, delete, and signed-download endpoints under `/api/instructor/lessons/{lesson}/attachments`.
- Depends on: `LessonAttachment` and current lesson ownership authorization.

- [ ] **Step 1: Write failing upload validation and authorization tests**

Cover a valid PDF, each allowed extension, a disallowed executable, an incompatible MIME, a file above 25 MB, unauthenticated access, and a different teacher's lesson. Use `Storage::fake('r2')` and `UploadedFile::fake()`.

- [ ] **Step 2: Run RED**

Run: `php artisan test tests/Feature/Instructor/LessonAttachmentTest.php --filter=upload`

Expected: FAIL with missing routes.

- [ ] **Step 3: Add request validation and minimal upload service/controller/routes**

Store with a generated UUID key under `lessons/{lesson_id}/attachments`, persist original/display names and trusted file metadata, and return the attachment resource envelope used by existing controllers.

- [ ] **Step 4: Run upload tests GREEN**

Run the same focused command and confirm the R2 fake contains the exact persisted key.

- [ ] **Step 5: Write failing rename/delete/download tests**

Assert rename changes metadata only; delete removes DB row and managed object; signed download requires ownership and returns a temporary URL.

- [ ] **Step 6: Implement rename/delete/signed URL behavior and cleanup during lesson deletion**

Do not parse arbitrary public URLs for deletion; delete only the persisted `r2_key`.

- [ ] **Step 7: Run all attachment tests GREEN**

Run: `php artisan test tests/Feature/Instructor/LessonAttachmentTest.php`

- [ ] **Step 8: Commit**

```bash
git add website-MindNova-AI/app/Http/Requests/Instructor/UploadLessonAttachmentRequest.php website-MindNova-AI/app/Http/Requests/Instructor/UpdateLessonAttachmentRequest.php website-MindNova-AI/app/Http/Controllers/Api/Instructor/LessonController.php website-MindNova-AI/app/Services/Instructor/LessonService.php website-MindNova-AI/routes/api.php website-MindNova-AI/tests/Feature/Instructor/LessonAttachmentTest.php
git commit -m "feat: add instructor lesson attachment API"
```

### Task 3: Student attachment access and lesson serialization

**Files:**
- Modify: `website-MindNova-AI/app/Http/Resources/LessonResource.php`
- Modify: `website-MindNova-AI/app/Http/Controllers/Api/Student/LessonController.php`
- Modify: `website-MindNova-AI/routes/api.php`
- Test: `website-MindNova-AI/tests/Feature/Student/LessonAttachmentAccessTest.php`

**Interfaces:**
- Produces: attachment metadata in lesson responses and `/api/student/lessons/{lesson}/attachments/{attachment}/download`.

- [ ] **Step 1: Write failing access tests**

Create enrolled/unenrolled students using existing course access fixtures. Assert only an authorized student receives attachment metadata and a signed URL, and assert an attachment from another lesson is rejected.

- [ ] **Step 2: Run RED**

Run: `php artisan test tests/Feature/Student/LessonAttachmentAccessTest.php`

- [ ] **Step 3: Extend eager loading/resource and add authorized student download action**

Reuse the student lesson access decision already applied by the controller/service rather than inventing a parallel enrollment rule.

- [ ] **Step 4: Run GREEN and relevant lesson regressions**

Run: `php artisan test tests/Feature/Student/LessonAttachmentAccessTest.php tests/Feature/Instructor/ModuleAndLessonManagementTest.php`

- [ ] **Step 5: Commit**

```bash
git add website-MindNova-AI/app/Http/Resources/LessonResource.php website-MindNova-AI/app/Http/Controllers/Api/Student/LessonController.php website-MindNova-AI/routes/api.php website-MindNova-AI/tests/Feature/Student/LessonAttachmentAccessTest.php
git commit -m "feat: expose authorized lesson attachments"
```

### Task 4: Lesson attachment frontend

**Files:**
- Create: `mindnova-ai/src/features/instructor/lesson-management/components/LessonAttachments.tsx`
- Create: `mindnova-ai/src/features/instructor/lesson-management/components/__tests__/LessonAttachments.test.tsx`
- Modify: `mindnova-ai/src/features/instructor/lesson-management/api/index.ts`
- Modify: `mindnova-ai/src/features/instructor/lesson-management/components/LessonEditModal.tsx`
- Modify: `mindnova-ai/src/features/student/courses/components/lesson/LessonContent.tsx`
- Modify: `mindnova-ai/src/features/student/courses/components/lesson/__tests__/LessonContent.test.tsx`

**Interfaces:**
- Produces: typed `LessonAttachment`, instructor upload/rename/delete/download API helpers, and student attachment list.

- [ ] **Step 1: Write failing component/API behavior tests**

Assert accepted extensions, 25 MB client rejection, per-file status, rendered metadata, rename/delete calls, and student download action. Mock HTTP boundaries only; assert visible behavior and submitted `FormData`.

- [ ] **Step 2: Run RED**

Run: `npm test -- LessonAttachments.test.tsx LessonContent.test.tsx`

- [ ] **Step 3: Add typed API helpers and minimal instructor component**

Use the existing API client and toast/error patterns. Do not alter rich-text upload behavior.

- [ ] **Step 4: Integrate instructor and student views**

Render the instructor component only for persisted lessons; after creation, use returned lesson ID before accepting attachments. Render student metadata below article content.

- [ ] **Step 5: Run GREEN and frontend checks**

Run: `npm test -- LessonAttachments.test.tsx LessonContent.test.tsx`

Run: `npm run lint`

Run: `npm run build`

- [ ] **Step 6: Commit**

```bash
git add mindnova-ai/src/features/instructor/lesson-management mindnova-ai/src/features/student/courses/components/lesson
git commit -m "feat: add lesson attachment interfaces"
```
