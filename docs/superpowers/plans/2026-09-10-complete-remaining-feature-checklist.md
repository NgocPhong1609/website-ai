# Remaining Feature Checklist Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish every unresolved item in the 16-feature checklist and re-verify the already implemented flows.

**Architecture:** Centralize tier commission configuration and snapshot calculations in backend services, expose canonical APIs to Admin and instructor UI, enrich chat payloads with role identity, and complete the AI Assist/AI Quiz presentation without changing established workflows.

**Tech Stack:** Laravel/PHP/Pest/MySQL, Next.js/React/TypeScript/Vitest/Tailwind.

**Spec:** `docs/superpowers/specs/2026-09-10-complete-remaining-feature-checklist-design.md`

## Global Constraints

- Preserve `standard` and `exclusive` tier selection and defaults of 30/70 and 15/85.
- Runtime commission percentages have one canonical backend source; instructor percentage is computed as 100 minus platform percentage.
- Historical financial values come from transaction snapshots and are never recalculated after configuration changes.
- Keep the unrelated 10% refund-progress eligibility rule unchanged.
- Do not hide or remove existing actions to make acceptance pass.
- Follow test-first red/green development and make surgical changes only.

---

### Task 1: Central tier commission configuration and immutable snapshots

**Files:**
- Create: backend commission settings repository/service, Admin request, and migration adding allocation tier snapshot
- Modify: payout/refund/revenue controllers and services, routes, models, Admin revenue UI, instructor pricing API/UI
- Test: commission unit/feature tests plus Admin and instructor frontend tests

**Interfaces:**
- Produces a canonical tier collection and allocation quote with tier, gross, platform percent/amount, instructor percent/amount.
- Consumers must use snapshots for existing records and the quote only for new records.

- [ ] Write failing backend tests for defaults, Admin update, old/new snapshot stability, sum-to-100, refund snapshot use, and canonical revenue response.
- [ ] Run the focused backend tests and confirm the expected failures.
- [ ] Implement the repository, service, validation, APIs, migration, snapshot creation, refund and report changes.
- [ ] Run focused backend tests to green.
- [ ] Write failing frontend tests for Admin tier editing and API-driven instructor tier selection.
- [ ] Implement the minimal UI/data changes and remove runtime/user-visible hard-coded percentages.
- [ ] Run frontend tests to green and scan all financial runtime paths for forbidden literals.
- [ ] Commit the task.

### Task 2: Instructor identity throughout chat

**Files:**
- Modify: `website-MindNova-AI/app/Http/Controllers/Api/ChatController.php`, chat broadcast event, frontend chat types and message components
- Test: backend chat API/event tests and frontend chat component tests

**Interfaces:**
- Message sender contains a nullable normalized role; legacy data may omit it.

- [ ] Write failing backend tests for initial, sent, recalled, and broadcast message sender roles.
- [ ] Run tests and verify red.
- [ ] Load and serialize role consistently in backend payloads.
- [ ] Write failing frontend tests for teacher/instructor badges, ordinary users, legacy missing role, and loading/optimistic messages.
- [ ] Add the accessible badge and teacher-specific styling through a shared helper/component.
- [ ] Run focused tests to green and commit.

### Task 3: MindNova AI Assist redesign and AI Quiz final UI behavior

**Files:**
- Modify: lesson-management AI Assist component and handlers, AI Quiz wizard/review/config hook, relevant page styles
- Test: AI Assist and AI Quiz review component/hook tests

**Interfaces:**
- Chapter suggestion exposes idle/loading/error behavior.
- Review editor receives and updates the final passing score used by save serialization.

- [ ] Write failing tests for both AI Assist actions, loading/error/retry, responsive semantics, passing-score review editing, and saved payload.
- [ ] Run tests and verify red.
- [ ] Implement the redesigned responsive card and state handling.
- [ ] Implement review configuration summary and final passing-score editing without weakening confirmation rules.
- [ ] Run focused tests to green, visually smoke-test relevant authenticated pages at mobile and desktop widths, and commit.

### Task 4: Full checklist regression and final review

**Files:**
- Modify only defects directly affecting the 16 requested features.

- [ ] Run the complete targeted backend suite covering quiz management, attachments, multiple-correct grading, quiz media, Admin AI/course/revenue, chat, AI Tutor context, and quotas.
- [ ] Run all frontend tests, ESLint, TypeScript type-check, and production build.
- [ ] Exercise important browser flows and responsive viewports.
- [ ] Audit the checklist line-by-line and search for stale course-approval copy and financial hard-codes.
- [ ] Request independent whole-branch code review; fix all Critical/Important findings and re-run affected verification.
- [ ] Commit final fixes, confirm clean worktree and branch synchronization status, then report each numbered requirement.
