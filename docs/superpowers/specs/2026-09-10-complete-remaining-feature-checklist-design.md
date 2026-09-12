# Remaining Feature Checklist Completion Design

## Goal

Complete the unresolved items in the 16-feature checklist without weakening the existing quiz, attachment, AI Tutor, Admin AI, course-management, or tier-selection behavior.

## Binding business rules

- Courses keep a partnership tier. The initial supported tiers are `standard` and `exclusive`.
- Default platform commission is 30% for `standard` and 15% for `exclusive`, but neither runtime backend nor frontend may define those percentages independently.
- Admin can edit the platform percentage for each tier. Instructor percentage is always `100 - platform_commission_percent`.
- A single backend commission configuration/service resolves tier definitions and calculates allocations.
- New confirmed transactions snapshot tier, platform percentage, instructor percentage, and both monetary amounts.
- Existing transaction, payout, refund, and reporting records use their stored snapshot. Changing configuration never recalculates history.
- The existing 10% course-progress refund eligibility threshold is unrelated to commission and remains unchanged.
- Tier UI obtains labels and percentages from an API. Adding a configured tier must not require changes to allocation arithmetic.

## Commission architecture

Store the editable tier definitions in `admin_settings` under a versioned key. A repository owns defaults, validation, and persistence; a commission service consumes the repository and returns a normalized quote containing `tier`, `gross_amount`, `platform_commission_percent`, `platform_amount`, `instructor_percent`, and `instructor_amount`.

Expose an authenticated read endpoint for instructor tier selection and add commission configuration to the Admin revenue API. Only Admin may update it. `InstructorPayoutService` creates both `teacher_payouts` and `revenue_allocations` from one quote. Refund and reports locate the existing allocation/payout snapshot and never resolve the current configured rate for historical rows. Legacy rows without a complete snapshot may use stored payout fields, but must not fall back to current configuration or hard-coded percentages.

Add `partnership_tier` to revenue allocation snapshots. Existing rows are backfilled from their related course once; this is metadata completion, not financial recalculation. Historical migrations remain immutable, while runtime code and user-visible frontend copy stop embedding business percentages.

## Admin and instructor UI

The Admin revenue page includes a tier configuration card. Each row shows the tier label, editable platform percentage, and computed instructor percentage. Save errors preserve edits. Revenue tables render percentages and amounts returned by the API snapshot.

The course pricing step fetches tier definitions, retains the existing Standard/Exclusive selection, and renders API-provided labels and percentages. Loading and failure states do not silently invent rates or remove tier selection.

## Chat teacher identity

Chat message APIs and websocket payloads include the sender's normalized role. Frontend types tolerate missing roles from legacy optimistic/cached data. A shared presentation helper determines whether a sender is an instructor (`teacher` or `instructor`). The message name row renders an accessible `Giảng viên` badge and visually distinct incoming bubble styling. Loading remains neutral until authoritative data arrives; realtime and initial messages use the same shape.

## MindNova AI Assist and AI Quiz completion

Replace the existing single strip with a responsive AI workspace card containing two explicit actions: create an AI Quiz and suggest a chapter. Both have consistent icons, descriptions, focus/hover behavior, and compact mobile layout. Chapter suggestion exposes loading and failure state without hiding either action.

The AI Quiz wizard keeps all existing five-step behavior while tightening responsive spacing and providing an always-visible configuration summary in review. Passing score can be edited during review and the saved request uses that final value. Question/answer edits, media, confirmation invalidation, and full-set review remain intact.

## Verification

Use TDD for commission configuration/snapshots, chat role payload/rendering, AI Assist states, and passing-score review persistence. Then run all directly related Laravel and Vitest suites, complete frontend tests, ESLint, TypeScript type-check, production build, and targeted searches proving runtime commission literals were removed. Existing unrelated legacy failures must be identified precisely rather than hidden.
