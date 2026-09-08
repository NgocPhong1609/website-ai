# AGENTS.md

## 1. Purpose

This file defines the default operating rules for any AI coding agent working in this repository.

These instructions are:

- vendor-neutral
- model-neutral
- programming-language-neutral
- framework-neutral
- architecture-neutral

They apply unless a more specific repository instruction explicitly overrides them.

The goal is not merely to produce working code.

The goal is to produce changes that are:

- correct
- minimal
- maintainable
- secure
- testable
- consistent with the repository
- easy for humans to review

---

# 2. Source of Truth

Never assume how the project works.

Use the repository as the primary source of truth.

Priority order:

1. Explicit user/task requirements
2. Repository-specific instructions
3. Existing code and architecture
4. Existing tests
5. Existing schemas, contracts, and types
6. Existing configuration
7. Existing documentation
8. Established project conventions
9. General engineering best practices

When generic best practices conflict with an intentional repository convention, follow the repository unless doing so would create a clear correctness, security, or reliability problem.

---

# 3. Repository First

Before modifying code, inspect the repository.

For non-trivial tasks, identify:

- relevant files
- related modules
- existing implementations
- similar features
- tests
- types
- schemas
- interfaces
- configuration
- utilities
- services
- dependencies
- data flow
- control flow
- business rules

Do not invent architecture before checking whether the repository already has a solution.

Prefer extending existing patterns over introducing parallel patterns.

---

# 4. Understand Before Coding

Do not immediately implement a non-trivial request.

First determine:

1. What behavior is requested?
2. What is the current behavior?
3. What code owns that behavior?
4. Which modules are affected?
5. What constraints exist?
6. What business rules apply?
7. What edge cases exist?
8. What can regress?
9. What is the smallest correct change?
10. How will the result be verified?

Code only after enough context has been collected to make a defensible implementation decision.

---

# 5. Scope Discipline

Change only what is necessary to complete the task.

Do not:

- refactor unrelated modules
- rename unrelated files
- reorganize folders without necessity
- reformat unrelated code
- rewrite working code without a reason
- upgrade dependencies without necessity
- introduce unrelated features
- change public behavior outside the requested scope
- silently modify configuration unrelated to the task

Keep diffs small, focused, and reviewable.

---

# 6. Minimal Change Principle

Prefer the smallest implementation that fully solves the problem.

A good change should:

- modify the fewest reasonable files
- introduce the fewest new concepts
- preserve existing behavior
- minimize regression risk
- avoid unnecessary abstraction

Do not confuse "more code" with "better engineering".

---

# 7. Existing Architecture First

Respect the architecture already present in the repository.

Before introducing a new:

- module
- layer
- service
- repository
- controller
- handler
- hook
- utility
- component
- package
- abstraction
- state container
- event
- queue
- pattern
- dependency

search for an existing equivalent first.

Do not create a second architecture inside the same repository.

---

# 8. Do Not Over-Engineer

Prefer simple, explicit solutions.

Avoid:

- premature abstraction
- abstraction for one-time use
- speculative extensibility
- unnecessary inheritance
- excessive indirection
- excessive design patterns
- unnecessary factories
- unnecessary wrappers
- unnecessary generic systems
- unnecessary configuration
- unnecessary dependencies

Introduce complexity only when the problem actually requires it.

---

# 9. Do Not Under-Engineer

Simplicity does not mean ignoring real constraints.

Do not:

- implement only the happy path
- skip validation
- ignore authorization
- ignore concurrency
- ignore failure states
- ignore data integrity
- ignore security
- ignore tests
- ignore error handling
- use unsafe shortcuts merely to finish faster

The implementation must be as simple as possible, but no simpler than the problem permits.

---

# 10. Business Logic

Business rules must be explicit and enforceable.

For any feature involving domain behavior, identify:

- valid operations
- invalid operations
- state transitions
- prerequisites
- invariants
- authorization rules
- data ownership
- duplication rules
- ordering rules
- timing rules
- consistency requirements
- failure behavior

Never rely solely on UI behavior to enforce a business rule.

Critical business rules must be enforced at the appropriate trusted layer.

---

# 11. Edge Case Analysis

Before implementing meaningful logic, consider relevant edge cases.

Possible categories include:

- null values
- missing values
- empty values
- malformed values
- invalid types
- unsupported values
- zero values
- negative values
- very large values
- boundary values
- duplicate requests
- repeated actions
- stale data
- outdated state
- deleted resources
- unavailable dependencies
- partial failures
- network failures
- timeouts
- retries
- concurrency
- race conditions
- ordering problems
- unauthorized access
- forbidden access
- expired credentials
- invalid state transitions
- timezone issues
- date boundaries
- pagination boundaries
- empty result sets
- unexpected external responses

Do not add defensive code for irrelevant scenarios.

Handle edge cases according to actual task risk.

---

# 12. State and Invariants

When modifying stateful behavior, identify the invariants that must always remain true.

Examples:

- unique resources remain unique
- counts cannot become invalid
- balances remain consistent
- references remain valid
- ownership remains correct
- state transitions remain legal
- related records remain synchronized

Prefer preventing invalid state over repairing invalid state later.

---

# 13. Concurrency

For operations that may execute concurrently, consider race conditions.

Do not assume this sequence is safe:

1. read state
2. check state
3. write state

when multiple requests can perform the same operation simultaneously.

Where relevant, use appropriate mechanisms such as:

- atomic operations
- transactions
- locks
- unique constraints
- compare-and-set
- idempotency
- optimistic concurrency
- version checks

The exact mechanism depends on the repository and technology in use.

---

# 14. Idempotency

For operations that may be retried or duplicated, consider whether they must be idempotent.

Examples include:

- payment operations
- webhook handling
- background jobs
- event processing
- retryable network requests
- resource creation
- state transitions

Repeated execution should not unintentionally create duplicate side effects when idempotency is required.

---

# 15. Data Integrity

Do not rely exclusively on application-level checks when stronger guarantees are available.

Use the strongest appropriate layer to enforce important invariants.

Depending on the system, this may include:

- validation
- schemas
- constraints
- indexes
- transactions
- foreign keys
- unique constraints
- domain types
- API contracts
- authorization checks

Application logic and storage-level guarantees should complement each other.

---

# 16. Validation

Validate inputs at trust boundaries.

Never assume external input is valid.

External input includes:

- user input
- HTTP input
- command-line input
- files
- database data
- message queues
- webhooks
- third-party APIs
- environment variables
- configuration

Validate only what the system needs, but validate critical assumptions explicitly.

---

# 17. Security

Treat security as part of correctness.

Never:

- expose credentials
- commit secrets
- log secrets
- log passwords
- log raw access tokens
- trust client-side authorization
- disable authentication to make a feature work
- bypass authorization checks
- weaken security controls without explicit justification
- introduce obvious injection vulnerabilities
- execute untrusted input without validation
- expose sensitive information in errors

Always consider:

- authentication
- authorization
- input validation
- output encoding
- secret handling
- data exposure
- privilege boundaries
- injection risks
- unsafe deserialization
- file handling
- access control
- dependency risk

Follow the security model already established by the repository.

---

# 18. Authorization

Authentication and authorization are different concerns.

Being authenticated does not imply permission.

For protected operations, verify:

- who the caller is
- what resource is being accessed
- whether the caller owns or may access it
- whether the requested action is allowed
- whether role/permission rules apply

Do not trust authorization information supplied directly by an untrusted client.

---

# 19. Secrets

Never place secrets directly in source code.

Secrets include:

- passwords
- API keys
- private keys
- access tokens
- refresh tokens
- database credentials
- signing secrets

Use the repository's existing secret/configuration mechanism.

---

# 20. Error Handling

Handle expected failures explicitly.

Errors should be:

- meaningful
- actionable
- appropriately scoped
- consistent with existing conventions

Do not:

- swallow important errors
- catch exceptions without a reason
- return misleading success responses
- expose internal implementation details unnecessarily
- convert every error into a generic response when useful distinctions exist

Avoid catch-all error handling that hides root causes.

---

# 21. Failure Semantics

When a multi-step operation can partially fail, determine:

- which steps may succeed
- which steps may fail
- whether rollback is required
- whether retries are safe
- whether operations are idempotent
- how partial state is represented
- how the caller is informed

Do not leave the system in an ambiguous state when avoidable.

---

# 22. External Services

Treat external services as unreliable.

Assume they can:

- timeout
- fail
- return invalid data
- return incomplete data
- change behavior
- rate-limit requests
- become temporarily unavailable

Follow existing retry, timeout, fallback, and error-handling conventions.

Do not introduce retry loops without considering duplicate side effects.

---

# 23. Networking

For network operations, consider:

- timeout behavior
- retries
- cancellation
- rate limits
- connection failure
- malformed responses
- partial responses
- authentication failure
- authorization failure

Do not assume successful connectivity.

---

# 24. Dates and Time

Time-related code must be explicit.

Consider:

- timezone
- UTC vs local time
- daylight saving changes
- inclusive vs exclusive boundaries
- start/end timestamps
- date-only vs timestamp values
- clock skew
- expiration
- scheduling
- recurring events

Do not rely on implicit timezone behavior unless the repository explicitly does so.

---

# 25. Numerical Logic

When handling numbers, consider:

- precision
- rounding
- overflow
- underflow
- integer vs floating-point behavior
- currency representation
- unit conversions
- boundary conditions

Do not use floating point for exact financial calculations unless the repository intentionally does so with appropriate safeguards.

---

# 26. Naming

Use names that communicate intent.

Prefer names that describe:

- what something represents
- what a function does
- why a condition exists

Avoid unnecessarily vague names such as:

- data
- info
- item
- temp
- value
- thing
- manager
- helper

unless their meaning is already unambiguous in context.

---

# 27. Functions and Methods

Functions should have clear responsibilities.

Prefer:

- focused functions
- explicit inputs
- explicit outputs
- limited side effects
- readable control flow

Avoid functions that simultaneously perform unrelated responsibilities.

---

# 28. Control Flow

Prefer readable control flow.

Use:

- early returns where appropriate
- explicit conditions
- small units of logic
- clear branching

Avoid excessive nesting.

Prefer:

bad:

if A:
if B:
if C:
doSomething()

when clearer logic can be expressed with guards.

---

# 29. Comments

Comments should explain:

- why something exists
- non-obvious constraints
- important tradeoffs
- unusual behavior

Comments should not simply restate obvious code.

Do not add excessive comments to self-explanatory code.

---

# 30. Documentation

Update documentation when the change materially affects:

- public behavior
- configuration
- setup
- APIs
- commands
- architecture
- developer workflow

Do not update documentation for purely internal changes unless necessary.

---

# 31. Types

Preserve and improve type safety where applicable.

Do not:

- weaken types merely to silence errors
- blindly cast values
- use unsafe escape hatches unnecessarily
- bypass static checking without justification

Prefer accurate domain-relevant types.

---

# 32. Schema and Contract Changes

Treat public contracts carefully.

Contracts include:

- APIs
- schemas
- events
- function signatures
- configuration formats
- database schemas
- serialized data
- public interfaces

Before changing a contract, consider:

- backward compatibility
- existing consumers
- migration requirements
- versioning
- defaults
- rollout strategy

Do not introduce breaking changes unintentionally.

---

# 33. Backward Compatibility

Preserve compatibility unless the task explicitly requires a breaking change.

Check whether existing:

- clients
- integrations
- tests
- stored data
- scripts
- consumers

depend on current behavior.

---

# 34. Database Changes

When database changes are relevant, consider:

- migrations
- reversibility
- existing data
- nullability
- default values
- constraints
- indexes
- uniqueness
- performance
- deployment order
- rollback

Do not assume an empty database.

---

# 35. Migrations

Migrations must account for existing production data where applicable.

Avoid migrations that:

- destroy data unnecessarily
- assume tables are empty
- require unsafe manual intervention without documentation
- block for excessive time without consideration

Follow repository-specific migration conventions.

---

# 36. Performance

Do not prematurely optimize.

However, avoid obvious performance regressions.

Consider:

- unnecessary repeated work
- unnecessary network requests
- unnecessary database queries
- N+1 queries
- large allocations
- unbounded loops
- unbounded collections
- unnecessary serialization
- unnecessary re-rendering
- blocking operations

Optimize based on evidence when possible.

---

# 37. Caching

When modifying caching behavior, consider:

- invalidation
- expiration
- stale data
- ownership
- consistency
- cache key correctness
- tenant/user isolation
- fallback behavior

Caching must not violate correctness or authorization.

---

# 38. Resource Management

Release resources appropriately.

Examples:

- files
- sockets
- database connections
- streams
- locks
- temporary resources

Use repository-standard cleanup mechanisms.

---

# 39. Dependencies

Before adding a dependency:

1. Check whether the repository already has an appropriate dependency.
2. Check whether the standard library/platform already provides the feature.
3. Evaluate whether the dependency is necessary.
4. Prefer established and maintained dependencies.
5. Avoid dependencies for trivial functionality.

Do not add a dependency merely to save a few lines of simple code.

---

# 40. Dependency Changes

Do not:

- upgrade unrelated dependencies
- regenerate lockfiles unnecessarily
- change package managers
- alter version constraints without reason

When dependency changes are required, keep them limited to the task.

---

# 41. Generated Files

Do not manually edit generated code unless the repository explicitly expects it.

Identify whether files are generated from:

- schemas
- API specifications
- database definitions
- code generators
- build tools

Modify the source of generation instead where appropriate.

---

# 42. Configuration

Configuration changes can affect the entire system.

Before changing configuration:

- understand its scope
- inspect environment differences
- inspect defaults
- inspect production implications

Do not change global configuration to fix a local problem unless necessary.

---

# 43. Environment Differences

Consider differences between:

- development
- test
- staging
- production
- local environments

Do not assume development behavior matches production behavior.

---

# 44. Cross-Platform Compatibility

Do not introduce platform-specific behavior unless intentional.

Consider differences in:

- file paths
- line endings
- shell syntax
- case sensitivity
- environment handling

Follow project-supported environments.

---

# 45. Logging

Logs should be useful and safe.

Prefer logs that provide enough context to diagnose issues.

Do not log:

- passwords
- authentication tokens
- sensitive personal data
- secrets
- unnecessary large payloads

Avoid excessive logging in hot paths.

---

# 46. Observability

When appropriate, preserve existing:

- logs
- metrics
- tracing
- error reporting

Do not silently remove observability from important operations.

---

# 47. Testing Philosophy

Tests should verify behavior, not implementation trivia.

Prefer testing:

- externally meaningful behavior
- business rules
- error behavior
- boundaries
- regressions

Avoid brittle tests that fail solely because internal implementation was refactored without changing behavior.

---

# 48. Test Coverage for Changes

For meaningful changes, consider:

- happy path
- invalid input
- missing data
- boundary cases
- authorization
- forbidden operations
- duplicate operations
- state transitions
- concurrency
- failure paths
- regression scenarios

Not every change needs every category.

Test according to risk.

---

# 49. Bug Fixes

For a bug fix:

1. Understand the root cause.
2. Reproduce the incorrect behavior when possible.
3. Fix the root cause.
4. Add or update a regression test when practical.
5. Verify surrounding behavior remains correct.

Do not patch symptoms while leaving the root cause intact unless explicitly necessary.

---

# 50. Do Not Modify Tests to Hide Bugs

Do not:

- delete valid tests because they fail
- weaken assertions to make tests pass
- skip tests without justification
- disable test suites without explanation

If a test is genuinely incorrect or obsolete, explain why before modifying it.

---

# 51. Test Isolation

Tests should not unintentionally depend on:

- execution order
- shared mutable state
- external production services
- timing assumptions
- unrelated global state

Follow existing test-isolation patterns.

---

# 52. Determinism

Prefer deterministic behavior.

Avoid unnecessary dependence on:

- current time
- random values
- network state
- execution order
- global mutable state

when deterministic alternatives are available.

---

# 53. Linting and Static Analysis

Respect repository linting and static-analysis rules.

Do not disable rules simply to remove warnings.

If suppression is necessary:

- keep it narrowly scoped
- document why
- ensure the underlying issue is understood

---

# 54. Build Integrity

Do not leave the repository in a state that:

- fails compilation
- fails type checking
- fails required linting
- cannot build
- breaks expected test commands

unless the task explicitly requires an intermediate state.

---

# 55. User Interface Changes

For UI changes, preserve existing design-system conventions.

Consider:

- consistency
- accessibility
- responsive behavior
- loading states
- empty states
- error states
- disabled states
- keyboard use
- focus behavior

Do not create new visual patterns when an existing component can be reused.

---

# 56. Accessibility

When modifying user-facing interfaces, consider:

- semantic structure
- keyboard navigation
- focus handling
- labels
- alternative text
- readable states
- interactive element semantics

Do not sacrifice accessibility for visual convenience.

---

# 57. APIs

For API work, inspect existing conventions for:

- routing
- request validation
- response shape
- error shape
- status codes
- authentication
- authorization
- pagination
- filtering
- versioning

Keep new endpoints consistent with existing ones.

---

# 58. API Errors

Use meaningful error semantics.

Distinguish where appropriate between:

- invalid request
- unauthenticated request
- unauthorized request
- missing resource
- conflict
- rate limit
- server failure
- external dependency failure

Follow repository conventions rather than inventing a new error format.

---

# 59. Serialization

Be careful when changing serialized formats.

Consider:

- backward compatibility
- null handling
- missing fields
- unknown fields
- numeric precision
- dates
- enum values
- versioning

---

# 60. File Operations

For file handling, consider:

- invalid paths
- path traversal
- missing files
- permissions
- concurrent access
- large files
- cleanup
- encoding

Do not trust user-supplied paths without validation.

---

# 61. Background Jobs and Workers

For asynchronous work, consider:

- retries
- idempotency
- duplicate execution
- failure recovery
- observability
- ordering
- poison messages
- timeout behavior

Do not assume a job will run exactly once.

---

# 62. Events and Messaging

For event-driven systems, consider:

- duplicate events
- out-of-order events
- missing events
- retries
- consumer failures
- version compatibility
- idempotency

Do not assume exactly-once delivery unless the infrastructure guarantees it.

---

# 63. Distributed Systems

For distributed operations, remember that:

- networks fail
- nodes disagree
- messages duplicate
- clocks differ
- operations may partially succeed

Do not design distributed behavior as if it were a single synchronous function.

---

# 64. Multi-Tenant Systems

When tenant separation exists, ensure:

- data cannot leak across tenants
- queries are properly scoped
- caches are properly scoped
- authorization checks include tenant boundaries
- background tasks preserve tenant context

Never rely solely on client-supplied tenant identifiers.

---

# 65. Privacy

Handle personal or sensitive data carefully.

Avoid:

- unnecessary collection
- unnecessary logging
- unnecessary exposure
- returning data the caller does not need

Follow existing repository privacy constraints.

---

# 66. Search Before Creating

Before creating new functionality, search for:

- existing helper functions
- existing utilities
- existing services
- existing components
- existing schemas
- existing tests
- existing patterns

Reuse is preferred when reuse improves consistency without creating inappropriate coupling.

---

# 67. Avoid Duplication

Do not duplicate meaningful business logic.

If the same rule exists in multiple places, understand whether a common abstraction already exists or should reasonably exist.

Do not extract trivial duplication prematurely.

---

# 68. Refactoring

Refactor only when:

- required for correctness
- necessary to implement the task safely
- it materially simplifies the changed area
- explicitly requested

Keep task-driven refactoring tightly scoped.

---

# 69. Dead Code

Do not leave unnecessary:

- unused imports
- unused variables
- abandoned functions
- temporary code
- debugging statements
- commented-out implementations

Remove artifacts introduced during implementation.

---

# 70. Temporary Hacks

Avoid temporary hacks.

If an unavoidable workaround is necessary:

- keep it localized
- make its reason clear
- document the limitation where appropriate

Do not disguise a workaround as a permanent design.

---

# 71. TODO Comments

Do not add TODO comments as a substitute for completing required work.

Use TODO only when:

- the remaining work is genuinely outside task scope
- the limitation is intentional
- the repository uses TODOs in a trackable way

Do not create vague TODOs.

---

# 72. Public Behavior

Before modifying existing behavior, determine whether users or external systems depend on it.

Do not silently alter public semantics.

---

# 73. Default Values

Be cautious when changing defaults.

Defaults often affect existing users, stored data, configuration, and deployments.

Prefer explicit migration behavior when changing established defaults.

---

# 74. Feature Flags

When feature flags exist:

- preserve existing rollout logic
- understand default state
- understand environment behavior
- avoid bypassing flags unintentionally

Remove obsolete flags only when explicitly appropriate.

---

# 75. Code Review Mindset

Before considering the task complete, review the change as if reviewing another engineer's pull request.

Ask:

- Is this correct?
- Is this necessary?
- Is this the smallest reasonable change?
- Does it match repository patterns?
- Are edge cases handled?
- Are tests sufficient?
- Is the code readable?
- Is there hidden risk?
- Is there a security problem?
- Is there an easier solution?

---

# 76. Diff Review

Inspect the final diff when possible.

Look for:

- accidental modifications
- debug code
- formatting noise
- duplicated logic
- unrelated changes
- incomplete renames
- missing imports
- unused code
- unintended behavior changes

---

# 77. Verification Before Completion

Do not claim success solely because code was written.

Verify using the strongest reasonable checks available.

Possible checks include:

- targeted tests
- unit tests
- integration tests
- end-to-end tests
- static analysis
- type checking
- linting
- compilation
- build
- manual execution
- API testing
- UI testing

Use checks appropriate to the change.

---

# 78. Verification Honesty

Never claim:

- tests passed
- build passed
- feature works
- bug is fixed
- deployment succeeds

unless there is sufficient evidence.

If verification could not be performed, clearly state:

- what was verified
- what was not verified
- why

---

# 79. Do Not Fabricate

Never fabricate:

- files
- repository behavior
- test results
- command output
- API responses
- dependency APIs
- schemas
- configuration
- documentation
- external behavior

When uncertain, inspect or state uncertainty.

---

# 80. Avoid Guess-Driven Coding

Do not code based on guesses when repository evidence can answer the question.

Prefer:

search
→ inspect
→ understand
→ implement

over:

assume
→ implement
→ repair later

---

# 81. Planning

For non-trivial tasks, create a concise internal or explicit implementation plan.

The plan should identify:

- affected area
- implementation approach
- important constraints
- verification strategy

Do not create excessive planning documents for simple changes.

---

# 82. Task Execution Workflow

For a non-trivial implementation task, follow this sequence:

1. Read the task carefully.
2. Inspect repository instructions.
3. Locate relevant code.
4. Understand existing behavior.
5. Search for similar implementations.
6. Identify architecture and conventions.
7. Identify business rules.
8. Identify edge cases.
9. Identify regression risks.
10. Form a minimal implementation plan.
11. Implement the change.
12. Add or update tests where appropriate.
13. Run relevant verification.
14. Review the diff.
15. Fix discovered issues.
16. Report the result accurately.

---

# 83. Investigation Workflow

For debugging:

1. Understand the reported symptom.
2. Reproduce when possible.
3. Trace the execution path.
4. Gather evidence.
5. Identify the root cause.
6. Verify the root cause explains the symptom.
7. Implement the smallest safe fix.
8. Add regression coverage when practical.
9. Verify the fix.
10. Check for related regressions.

Do not randomly modify code until the symptom disappears.

---

# 84. Root Cause Analysis

Distinguish between:

- symptom
- immediate cause
- root cause

Prefer fixing the root cause when reasonably possible.

---

# 85. Research Before Introducing Unknown APIs

When using an unfamiliar library, framework API, platform API, or repository utility:

- inspect local usage
- inspect local type definitions
- inspect installed version
- consult reliable documentation if available

Do not invent API signatures.

---

# 86. Version Awareness

Technology behavior may differ by version.

Before relying on version-sensitive behavior:

- inspect project versions
- avoid assuming the latest API
- avoid assuming deprecated APIs are still valid

Code for the versions actually used by the repository.

---

# 87. Package Manager Discipline

Use the package manager already used by the repository.

Do not switch package managers.

Do not regenerate lockfiles with a different tool.

---

# 88. Formatting

Follow existing formatting.

Do not reformat an entire file or repository unless required.

Formatting-only changes should not obscure functional changes.

---

# 89. File Placement

Place new files according to existing repository structure.

Do not create new top-level directories without a clear reason.

---

# 90. Imports and Dependencies

Follow existing import organization and module boundaries.

Avoid:

- circular dependencies
- inappropriate cross-layer imports
- reaching into internal modules that are not intended to be public

Respect repository boundaries.

---

# 91. Separation of Concerns

Keep unrelated responsibilities separate.

Examples:

- UI should not own unrelated persistence logic
- transport layers should not contain complex domain rules
- storage layers should not contain unrelated presentation logic
- domain rules should not depend unnecessarily on infrastructure details

Follow the repository's actual architectural style.

---

# 92. Side Effects

Make side effects explicit where possible.

Examples:

- database writes
- network calls
- file writes
- event publishing
- notifications
- cache invalidation

Be cautious when moving or duplicating side effects.

---

# 93. Ordering of Side Effects

When multiple side effects occur, consider what happens if execution fails between them.

Determine whether:

- rollback is needed
- ordering matters
- compensation is required
- retries may duplicate effects

---

# 94. Compatibility With Existing Data

Never assume existing stored data perfectly matches new assumptions.

When changing models or schemas, consider older data.

---

# 95. User-Supplied Requirements

Explicit user requirements have priority unless they:

- contradict higher-priority system constraints
- create a serious correctness issue
- create a security issue
- are impossible given the repository

When a requirement conflicts with existing architecture, make the smallest reasonable adaptation and explain important tradeoffs.

---

# 96. Ambiguity

When requirements are ambiguous:

First inspect the repository for context.

If repository evidence strongly suggests the intended behavior, follow it.

If multiple materially different implementations remain possible, choose the safest repository-consistent interpretation unless clarification is essential.

Do not invent business requirements without evidence.

---

# 97. Destructive Operations

Be cautious with destructive actions.

Examples:

- deleting data
- deleting files
- resetting databases
- rewriting history
- force pushing
- dropping tables
- removing migrations
- removing configuration

Do not perform destructive changes unless clearly required.

---

# 98. Existing User Changes

Do not overwrite unrelated existing user changes.

When files already contain modifications outside the task, preserve them unless explicitly instructed otherwise.

---

# 99. Git Discipline

When interacting with version control:

- understand the current branch
- understand the working tree state
- avoid losing uncommitted work
- avoid rewriting shared history without explicit reason
- keep commits focused when commits are requested

Do not use destructive Git commands casually.

---

# 100. Generated Output

Generated code must meet the same quality standards as handwritten code.

Do not accept lower quality merely because code was generated automatically.

---

# 101. Human Reviewability

Optimize changes for human review.

A reviewer should be able to understand:

- what changed
- why it changed
- why the chosen solution is appropriate
- what risks exist
- how it was verified

Avoid unnecessarily large diffs.

---

# 102. Explain Important Decisions

When a non-obvious design decision is made, explain it in the final report.

Do not explain trivial implementation details exhaustively.

---

# 103. Definition of Done

A task should only be considered complete when all relevant conditions are satisfied:

- requested behavior is implemented
- behavior matches repository conventions
- business rules are respected
- relevant edge cases are handled
- important error paths are handled
- security constraints are respected
- unrelated behavior remains unchanged
- tests are added or updated when appropriate
- relevant tests pass
- relevant static checks pass
- relevant build checks pass
- final diff has been reviewed
- no obvious debug artifacts remain
- no known serious regression remains

---

# 104. Final Response

After completing implementation work, provide a concise summary containing:

## What changed

Describe the implemented behavior.

## Key decisions

Mention important architectural or implementation decisions only when relevant.

## Files changed

List important files or areas changed.

## Verification

State the actual checks performed.

Examples:

- unit tests
- integration tests
- type checking
- lint
- build
- manual verification

## Remaining risks

Mention unresolved assumptions, limitations, or checks that could not be completed.

Do not claim checks were run if they were not.

---

# 105. Project-Specific Instructions

The rules above are universal defaults.

Repository-specific instructions should be added below this section.

Project-specific instructions may define:

- project purpose
- technology stack
- architecture
- module boundaries
- folder conventions
- naming conventions
- domain rules
- security rules
- commands
- test commands
- build commands
- deployment process
- coding conventions
- API conventions
- database conventions
- UI conventions
- forbidden patterns
- deprecated patterns
- definition of done

Project-specific rules override generic recommendations when explicitly stated, unless doing so would introduce a serious correctness or security problem.

---

# 106. Recommended Project-Specific Template

## Project Overview

Describe what this repository does.

## Architecture

Describe the major modules and dependency direction.

## Directory Structure

Explain important folders.

## Coding Conventions

Document repository-specific conventions.

## Business Rules

Document domain invariants and restrictions.

## Security Constraints

Document repository-specific authorization and security rules.

## Testing

Document test frameworks and expectations.

## Commands

Document actual repository commands.

Example categories:

- install
- development
- test
- lint
- typecheck
- build
- migration
- seed

## Forbidden Patterns

Document patterns agents must not introduce.

## Definition of Done

Add additional project-specific completion requirements if needed.

---

# Core Operating Principle

Always prefer:

Understand
→ inspect
→ reason
→ implement
→ test
→ verify
→ review

over:

Guess
→ generate
→ hope

# Project-Specific Instructions

## Project Stack

This project uses:

Frontend:

- Next.js
- React
- TypeScript

Backend:

- PHP
- Laravel

The frontend and backend are separate application layers.

The frontend must communicate with the Laravel backend through the defined API contracts.

Do not move backend business logic into the frontend merely for convenience.

---

# Frontend Rules

## Next.js Responsibilities

The Next.js application is responsible for:

- rendering UI
- user interaction
- client-side state where necessary
- calling backend APIs
- displaying loading states
- displaying error states
- basic client-side validation
- frontend routing
- presentation logic

Critical business rules must not rely exclusively on frontend validation.

---

# Server and Client Components

Prefer Server Components by default when the project architecture supports them.

Use Client Components only when client-side behavior is required, such as:

- event handlers
- browser APIs
- local component state
- client-side hooks
- interactive UI

Do not add:

```ts
"use client";
```

without a concrete reason.

Keep the client-side JavaScript surface as small as reasonably possible.

---

# Component Design

Components should remain focused.

Avoid components that simultaneously handle:

- complex API orchestration
- large amounts of business logic
- rendering
- data transformation
- unrelated UI responsibilities

Extract reusable logic when doing so improves readability and consistency.

Do not extract abstractions merely because code appears once.

---

# UI Logic vs Business Logic

Frontend logic may handle:

- UI state
- loading state
- form state
- display formatting
- basic input feedback
- interaction behavior

Backend logic must enforce authoritative rules such as:

- authorization
- ownership
- resource availability
- business invariants
- state transitions
- uniqueness
- permission checks
- critical validation

Never trust frontend checks as the only enforcement mechanism.

---

# API Layer

Do not scatter raw API calls throughout unrelated UI components when the repository already has a service/API abstraction.

Before creating a new API function:

1. Search for existing API clients.
2. Search for existing service patterns.
3. Reuse existing request infrastructure.
4. Follow existing error handling.
5. Follow existing authentication handling.

Keep endpoint paths, request schemas, and response types consistent with the backend API.

---

# API Types

When practical, define explicit TypeScript types for:

- request payloads
- API responses
- domain entities
- pagination
- errors

Avoid:

```ts
any;
```

for API data.

Do not invent frontend types that materially contradict the Laravel response contract.

---

# Form Handling

Forms should account for:

- valid input
- missing input
- invalid input
- loading state
- disabled state
- backend validation errors
- submission failures
- duplicate submission

Prevent accidental repeated submissions when they can cause duplicate side effects.

---

# Frontend Error Handling

Do not assume every request succeeds.

Handle relevant states:

```text
idle
loading
success
empty
error
```

When Laravel returns validation errors, display them using the existing project convention.

Do not expose raw backend stack traces or internal errors to users.

---

# Authentication

Follow the authentication mechanism already used by the repository.

Do not introduce a second authentication strategy without explicit justification.

Frontend authentication state is not an authorization boundary.

Laravel remains responsible for verifying protected operations.

---

# Next.js Performance

Avoid obvious performance problems such as:

- unnecessary client components
- unnecessary re-renders
- duplicate API calls
- unnecessary sequential requests
- unnecessarily large client bundles
- fetching the same data repeatedly without reason

Do not optimize prematurely.

Follow the caching and rendering strategy already used by the project.

---

# Backend Rules

## Laravel Responsibilities

Laravel is responsible for:

- authoritative business logic
- authentication
- authorization
- server-side validation
- persistence
- database integrity
- transactions
- API contracts
- domain operations
- external integrations

Do not rely on the frontend for critical enforcement.

---

# Laravel Architecture

Follow the repository's existing Laravel architecture.

Do not automatically introduce new architectural layers simply because they are considered best practices.

Before creating:

- Service classes
- Repository classes
- Actions
- DTOs
- Jobs
- Events
- Listeners
- Policies
- Observers
- Traits

search the repository and determine whether that pattern is already used.

Consistency with the existing project is preferred over creating a new architectural style.

---

# Controllers

Controllers should primarily handle HTTP concerns.

Typical controller responsibilities include:

- receiving requests
- invoking validation
- calling application/domain logic
- returning responses

Avoid placing large amounts of complex business logic directly inside controllers.

If a controller becomes difficult to understand because of business logic, move the logic into the repository's established abstraction.

---

# Request Validation

Prefer Laravel's established validation mechanisms.

When the repository uses Form Requests, follow that pattern.

Validation should cover relevant concerns such as:

- required fields
- types
- formats
- ranges
- allowed values
- relationships
- resource existence

Validation is not the same as authorization.

Both may be required.

---

# Authorization

Use the project's existing Laravel authorization strategy.

Possible mechanisms may include:

- Policies
- Gates
- middleware
- permission services
- domain-specific permission checks

Do not assume that knowing a resource ID means the caller may access it.

Check ownership and permission where required.

---

# Models

Keep Eloquent models consistent with existing project conventions.

Be cautious when changing:

- relationships
- casts
- fillable fields
- guarded fields
- accessors
- mutators
- scopes
- events

Do not add mass-assignable fields without considering security implications.

---

# Database Queries

Avoid obvious query problems.

Watch for:

- N+1 queries
- repeated queries inside loops
- unnecessary full-table reads
- missing pagination
- unnecessary eager loading
- excessive eager loading

Use existing Laravel query patterns.

Do not optimize blindly without evidence.

---

# Eloquent Relationships

Use existing Eloquent relationships when appropriate rather than manually rebuilding relationships with duplicated queries.

Before adding a relationship:

- inspect existing models
- confirm naming conventions
- confirm expected cardinality
- check whether the relationship already exists

---

# Database Integrity

Critical invariants should not depend entirely on PHP checks when the database can enforce them safely.

Where appropriate, consider:

- unique constraints
- foreign keys
- indexes
- transactions
- nullability constraints

Example:

Do not rely solely on:

```text
SELECT
→ check duplicate
→ INSERT
```

when concurrent requests could still create duplicate records.

---

# Transactions

Use database transactions when multiple writes must succeed or fail together.

Examples:

- create multiple dependent records
- modify balances
- reserve resources
- update related state
- perform state transitions requiring consistency

Do not wrap every database operation in a transaction unnecessarily.

---

# Race Conditions

For business operations that can happen concurrently, explicitly consider race conditions.

Examples:

- booking
- inventory
- quotas
- payments
- counters
- reservations
- unique resource allocation

A Laravel validation check alone may not protect against simultaneous requests.

Use appropriate database guarantees or transactional logic where required.

---

# API Responses

Follow the project's existing API response structure.

Do not create a new response shape for a single endpoint.

Keep consistent conventions for:

- successful responses
- validation errors
- unauthorized responses
- forbidden responses
- missing resources
- conflicts
- server errors

---

# HTTP Status Codes

Use status codes according to the existing API conventions.

Do not return successful status codes for failed operations merely to simplify frontend handling.

---

# Laravel Exceptions

Do not use broad exception handling that hides the real failure.

Avoid patterns that catch every exception and always return a generic success/failure response without preserving meaningful semantics.

Use the project's existing exception handling strategy.

---

# Laravel Jobs

Use queued jobs when the project already uses queues and the operation is appropriate for asynchronous processing.

Examples may include:

- email
- notifications
- slow integrations
- heavy processing

Jobs must consider:

- retries
- duplicate execution
- idempotency
- failure behavior

Do not assume jobs run exactly once.

---

# Laravel Events and Listeners

Use events only when they improve decoupling and match the existing architecture.

Do not introduce events merely to avoid calling a function directly.

Business behavior should remain easy to trace.

---

# Migrations

Database changes must use migrations according to project conventions.

When creating migrations:

- consider existing data
- consider nullable values
- consider defaults
- consider indexes
- consider foreign keys
- consider rollback behavior
- avoid unnecessary destructive operations

Do not assume the production database is empty.

---

# Seeders and Factories

Do not modify production-relevant seed behavior merely to make local development easier.

When tests require data, prefer the project's established factory/test data patterns.

---

# Cross-Layer Rules

## API Contract Is a Boundary

Next.js and Laravel must agree on:

- endpoint
- method
- authentication
- request payload
- response payload
- error structure
- pagination structure
- field naming
- date format
- nullability

When changing an API contract, inspect both frontend and backend consumers.

---

# Contract Changes

Before changing a Laravel API response, search the Next.js codebase for usages.

Before changing a Next.js request payload, inspect the Laravel request validation and controller behavior.

Do not modify one side of the contract in isolation when the other side depends on it.

---

# Field Naming

Follow the existing project convention for field naming.

Do not arbitrarily mix conventions such as:

```text
snake_case
camelCase
```

If Laravel returns `snake_case` and the frontend maps it to `camelCase`, continue using the existing mapping strategy.

Do not introduce a second mapping convention.

---

# Date and Time Contract

When frontend and backend exchange dates, explicitly understand:

- expected format
- timezone
- UTC behavior
- local-time behavior
- date-only fields
- datetime fields

Avoid frontend/backend disagreement about timezone interpretation.

---

# Pagination

If the API uses pagination, follow the existing Laravel pagination structure.

Do not load an unbounded dataset in the frontend when the backend already supports pagination.

---

# Validation Flow

Use layered validation.

Example:

```text
User input
↓
Next.js basic validation
↓
HTTP request
↓
Laravel request validation
↓
Authorization
↓
Business rule validation
↓
Database integrity
```

Each layer has a different purpose.

Do not remove server-side validation because the frontend already validates the field.

---

# Business Logic Placement

A useful default dependency flow is:

```text
Next.js UI
↓
Frontend API layer
↓
Laravel route
↓
Controller
↓
Application / business logic
↓
Eloquent / persistence
↓
Database
```

The exact Laravel middle layers depend on the architecture already present in the repository.

Do not force a Service/Repository architecture if the project does not use one.

---

# Example: Booking-Like Operation

For operations similar to booking/reservation, do not implement only:

```text
frontend checks availability
↓
frontend sends request
↓
backend inserts record
```

Backend should re-check authoritative state.

Relevant considerations may include:

- resource exists
- caller may access resource
- requested state is valid
- slot/resource remains available
- duplicate request
- conflicting existing record
- concurrency
- transaction requirement
- database constraint
- idempotency

Frontend availability is informational.

Backend availability is authoritative.

---

# Testing Rules

## Frontend Tests

For meaningful frontend behavior, test where appropriate:

- rendering
- interaction
- form validation
- loading state
- error state
- empty state
- API-result handling

Avoid testing framework internals.

---

# Backend Tests

Laravel business behavior should be covered at the appropriate level.

Consider:

- feature tests
- unit tests
- authorization tests
- validation tests
- database behavior
- regression tests

High-value Laravel tests usually verify observable behavior rather than private implementation details.

---

# API Integration Testing

For important frontend-backend flows, verify:

```text
Next.js request
↓
Laravel validation
↓
Laravel business logic
↓
database
↓
Laravel response
↓
Next.js response handling
```

Do not assume both applications are compatible merely because each one builds independently.

---

# Bug Fix Workflow

For bugs spanning Next.js and Laravel:

1. Identify where the incorrect behavior originates.
2. Determine whether the frontend, backend, or contract is responsible.
3. Fix the authoritative source.
4. Avoid duplicating workaround logic on both sides.
5. Add regression coverage where practical.
6. Verify the complete flow.

---

# Security Boundary

Treat Laravel as the primary trusted application boundary.

Never assume the Next.js client can protect:

- authorization
- ownership
- pricing
- permissions
- availability
- role access
- resource integrity
- business state

Any request sent by Next.js can potentially be reproduced directly by another HTTP client.

Therefore Laravel must independently enforce critical rules.

---

# Development Workflow

For tasks affecting only frontend:

1. Inspect Next.js implementation.
2. Inspect the corresponding API contract.
3. Implement the smallest frontend change.
4. Run frontend verification.

For tasks affecting only backend:

1. Inspect Laravel route and affected flow.
2. Inspect frontend consumers before changing public contracts.
3. Implement the smallest backend change.
4. Run backend verification.

For full-stack tasks:

1. Trace the feature from UI to database.
2. Identify the API contract.
3. Identify Laravel business rules.
4. Identify affected frontend behavior.
5. Implement backend correctness first when backend rules are authoritative.
6. Update frontend integration.
7. Test both sides.
8. Verify the complete flow.

---

# Full-Stack Change Checklist

Before completing a full-stack task, check:

- frontend request matches backend validation
- frontend response types match backend response
- error handling matches backend errors
- authentication is correctly sent
- backend authorization is enforced
- backend business rules are enforced
- database integrity is preserved
- loading state works
- error state works
- duplicate submission is considered
- relevant tests pass

---

# Forbidden Patterns

Do not introduce these patterns without an explicit repository-specific reason:

- business rules enforced only in Next.js
- authorization enforced only in Next.js
- direct database access from Next.js when Laravel owns persistence
- duplicated backend business rules in frontend
- `any` used to bypass API typing
- giant Laravel controllers
- raw database queries when an established Eloquent pattern exists without reason
- new architectural layers inconsistent with the repository
- catch-all exceptions that hide root causes
- silent API failures
- unbounded database reads
- unsafe mass assignment
- unrelated refactors inside feature work
- new dependencies when existing tools are adequate

---

# Repository Discovery Before Implementation

Before implementing a task, search for:

Frontend:

- existing page
- existing component
- API client
- hooks
- types
- shared UI
- validation
- similar feature

Backend:

- route
- controller
- Form Request
- model
- relationship
- Policy/Gate
- service/action if used
- migration
- feature test
- similar endpoint

Then trace:

```text
UI
↓
API request
↓
Laravel route
↓
validation
↓
authorization
↓
business logic
↓
database
↓
response
↓
UI
```

Do not begin implementation until the relevant path is understood.

---

# Verification

When relevant, verify both applications using the commands already defined by the repository.

Typical frontend verification categories:

- lint
- type checking
- tests
- build

Typical Laravel verification categories:

- automated tests
- static analysis if configured
- formatting/linting if configured

Do not invent commands.

Inspect the repository's:

```text
package.json
composer.json
README
CI configuration
```

to determine the actual commands.

---

# Definition of Done

A Next.js + Laravel task is complete only when all relevant conditions are met:

- requested behavior works
- frontend follows existing architecture
- backend follows existing architecture
- API contract is consistent
- backend validation is correct
- backend authorization is correct
- business rules are enforced server-side
- relevant edge cases are handled
- data integrity is preserved
- relevant tests pass
- frontend type checking passes where configured
- frontend lint passes where configured
- backend checks pass where configured
- no unrelated code was changed
- no obvious security regression exists
- final diff has been reviewed
