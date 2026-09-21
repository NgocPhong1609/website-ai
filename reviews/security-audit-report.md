# Security Audit Report - MindNova AI

## 1. Audit Target & Status
**Status:** **FAIL**
**Target:** MindNova AI Project (Laravel Backend, Next.js Frontend)
**Date:** 2026-09-21

## 2. Executive Summary
The security audit revealed several critical vulnerabilities, particularly in authentication and authorization mechanisms. A deliberate backdoor exists in the admin middleware, and client-side access control is broken. Some API routes intended for students lack basic authentication.

| Severity | Count |
| -------- | ----- |
| CRITICAL | 2     |
| HIGH     | 2     |
| MEDIUM   | 2     |
| LOW      | 1     |

---

## 3. Vulnerability Details

### [CRITICAL] Admin Backdoor in AdminMiddleware (CWE-798)
- **CVSS Score:** 9.8 (Critical)
- **Taint Source:** `x-admin-secret` HTTP Header
- **Vulnerable Code:** `app/Http/Middleware/AdminMiddleware.php` lines 18-21
  ```php
  $adminSecret = env('ADMIN_SECRET', 'admin-secret');
  if ($request->header('x-admin-secret') === $adminSecret) {
      return $next($request);
  }
  ```
- **Description:** An intentional backdoor allows anyone who provides the `x-admin-secret` header (defaulting to `admin-secret`) to bypass authentication and role checks entirely.
- **Remediation:** Remove this backdoor immediately. All admin access must be granted through robust authentication and role-based access control.

### [CRITICAL] Client-Side Authorization Bypass via Cookie Forgery (CWE-807)
- **CVSS Score:** 9.1 (Critical)
- **Taint Source:** `userRole` Cookie
- **Vulnerable Code:** `mindnova-ai/middleware.ts` lines 7 & 20
  ```typescript
  const role = request.cookies.get('userRole')?.value?.toLowerCase();
  const isAdminRole = role === 'admin';
  ```
- **Description:** The Next.js frontend middleware relies entirely on the `userRole` cookie to grant access to admin and instructor routes. An attacker can trivially modify their cookie to `userRole=admin` to access restricted frontend pages.
- **Remediation:** Do not trust client-side cookies for authorization. The frontend middleware should verify a securely signed JWT or delegate role validation to an authenticated backend endpoint.

### [HIGH] Missing Authentication on Student Routes (CWE-306)
- **CVSS Score:** 7.5 (High)
- **Vulnerable Code:** `routes/api.php` lines 94-107
- **Description:** Several student routes (e.g., `/student/study-plan`, `/student/practice/overview`, `/student/history/overview`) are placed outside the `auth:sanctum` middleware block. These endpoints are completely unprotected and accessible to unauthenticated users.
- **Remediation:** Move the `Route::prefix('student')` block (lines 94-107) inside the `Route::middleware('auth:sanctum')` group.

### [HIGH] Hardcoded Localhost in Google OAuth Callback (CWE-798 / Info Disclosure)
- **CVSS Score:** 7.1 (High)
- **Vulnerable Code:** `app/Http/Controllers/Api/Auth/AuthController.php` line 285
  ```php
  return redirect()->away('http://localhost:3000/login-success?token=' . $token);
  ```
- **Description:** The Google OAuth callback explicitly redirects to `localhost:3000`, leaking the user's access token to the local environment and breaking the authentication flow in production environments.
- **Remediation:** Use environment variables (e.g., `env('FRONTEND_URL')`) to dynamically determine the frontend redirect URL based on the environment.

### [MEDIUM] Missing Role Verification for Student Endpoints (CWE-285)
- **CVSS Score:** 5.3 (Medium)
- **Vulnerable Code:** `routes/api.php` lines 154-218
- **Description:** While the student endpoints within the `auth:sanctum` group enforce authentication, they lack a `role:student` middleware (unlike the `instructor` and `admin` route groups). This means any authenticated user (e.g., a teacher or admin) can access student endpoints, which might lead to unintended data modification if not handled properly in controllers.
- **Remediation:** Apply a `role:student` middleware to the student API route group to enforce proper role separation.

### [MEDIUM] Prompt Injection via Concatenated User Input (CWE-94)
- **CVSS Score:** 5.3 (Medium)
- **Vulnerable Code:** `app/Http/Controllers/Api/Student/AiQuizGeneratorController.php`
- **Description:** The `custom_prompt` and `topic` parameters are concatenated directly into the AI instructions string. An attacker could provide a malicious prompt to manipulate the AI's behavior, potentially leading to abusive output or token exhaustion.
- **Remediation:** Properly structure AI prompts by keeping system instructions and user input strictly separated using the model's message arrays.

### [LOW] Missing Unique Constraints on Database Tables
- **CVSS Score:** 3.1 (Low)
- **Vulnerable Code:** `app/Http/Controllers/Api/Student/OrderController.php` (line 143)
- **Description:** The code uses `insertOrIgnore()` for `enrollments` and `firstOrCreate()` for `chat_conversation_members`. Without unique constraints at the database schema level (e.g., `user_id` + `course_id`), concurrent requests will bypass the application-level checks and insert duplicate records.
- **Remediation:** Add composite unique constraints to the `enrollments` and `chat_conversation_members` tables in the database migrations.

---

## 4. Verification of Known Issues from AGENTS.md
1. **Student routes without auth:sanctum**: **CONFIRMED** (Routes on lines 94-107).
2. **AdminAuthGuard FE only checks token existence, not admin role**: **CONFIRMED** (Also bypassable via `userRole` cookie in `middleware.ts`).
3. **Admin middleware x-admin-secret backdoor**: **CONFIRMED** (Found in `AdminMiddleware.php`).
4. **Google OAuth callback hardcoded localhost**: **CONFIRMED** (Found in `AuthController.php`).
5. **No role:student on /api/student/*** : **CONFIRMED** (Missing from `routes/api.php`).
6. **Missing unique constraints**: **CONFIRMED** (Code assumes constraints exist, but inserts will duplicate under race conditions).
7. **AiQuizGeneratorController fallback userId = 201**: **FIXED / NOT FOUND** (The current controller retrieves the authenticated user's ID securely without falling back to a hardcoded `201`).

---

## 5. CI/CD Gating Checklist
- [ ] Remove `x-admin-secret` backdoor in `AdminMiddleware.php`
- [ ] Fix `middleware.ts` to validate JWT role payload instead of trusting plaintext `userRole` cookies
- [ ] Move unprotected student routes into the `auth:sanctum` group
- [ ] Apply `role:student` middleware to student API routes
- [ ] Use `env('FRONTEND_URL')` for Google OAuth redirects
- [ ] Add unique constraints in database migrations for `enrollments` and `chat_conversation_members`
- [ ] Implement robust prompt sanitization/separation for the AI quiz generation payload
