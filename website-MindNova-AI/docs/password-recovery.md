# Password recovery API and operations

Apply the `2026_09_26_000000_create_password_recovery_codes_table` migration before enabling this flow. Existing accounts have no saved codes until the owner signs in and generates them. Owners who have lost access and have no saved codes need administrator support.

Authenticated users of every role can call `GET /api/profile/recovery-codes` for `{ "remaining": number }` and `POST /api/profile/recovery-codes` with `{ "current_password": "..." }`. The POST returns eight codes once as `{ "codes": [...] }`; generating a new set invalidates the previous set. The server stores only SHA-256 digests. Users must save the returned codes somewhere they can access without logging in.

`POST /api/reset-password` accepts `{ "email": "...", "recovery_code": "...", "password": "...", "password_confirmation": "..." }`. The new password must have at least eight characters, including an uppercase letter, a digit, and a special character. Codes ignore letter case and hyphens. A successful reset consumes every recovery credential for the account and revokes Sanctum tokens, database sessions, and the remember token. It does not sign in, unlock, or change the email address. Missing users and wrong or expired codes receive the same error. The endpoint is limited by both email and IP address.

`POST /api/password-recovery/support` accepts an email, contact details, and a description of at least 20 characters. It returns the same response whether or not the email matches an account and opens a support ticket. The supplied contact information is a way to respond, **not identity evidence**.

After verifying identity through an established independent process, an administrator can call `POST /api/admin/users/{user}/password-recovery` with their own `current_password` and a `verification_note` of at least 20 characters. The endpoint refuses locked accounts and other administrators. It returns a one-time `reset_url` and `expires_at` 30 minutes later. The administrator must give the link to the verified owner through an appropriate channel. Issuance is recorded in `admin_logs` with actor, target, and verification note; raw codes and links are never logged. A later administrator issuance replaces earlier administrator codes, while saved owner codes remain usable.

Legacy `POST /api/forgot-password`, `POST /api/forgot-password/verify-otp`, and `POST /api/profile/change-password/request-otp` return HTTP 410. The recovery flow sends no email. Existing unrelated email functionality remains available.

## Website workflow

- Student: Profile → Bảo mật & Mật khẩu → Mã khôi phục tài khoản.
- Instructor: profile page → Mã khôi phục tài khoản.
- Administrator: user management page → own recovery-code panel at the bottom.
- Enter the current password to create codes. To replace an existing set, explicitly acknowledge that old codes will stop working. Save the displayed codes outside the account; closing the panel hides them permanently.
- On the login page choose Quên mật khẩu, then enter email, saved code and the new password. New passwords must have 8–128 characters including an uppercase letter, digit and special character, matching the existing password-change form.
- If codes are unavailable, choose Tôi không có mã khôi phục and submit contact details and supporting information. Requests appear in the existing admin moderation/support list with their complete description. This does not send mail or change the password.
- Admin reviews the support request, verifies identity independently, finds the account under Users and chooses Khôi phục mật khẩu. Enter the administrator's password and record the verification performed. Deliver the generated 30-minute link through the verified channel. Never treat a newly supplied phone number or Telegram handle, public account details or a checked box alone as proof of ownership. If ownership cannot be established, do not issue a link.
- Administrator accounts cannot be recovered by another admin through this endpoint. They should generate and retain their own codes; loss of all credentials requires the platform operator's established recovery process.

Existing accounts do not receive codes automatically. They must generate them while signed in. Codes are not sent by email, stored in browser localStorage, or shown again later. A successful reset invalidates the entire old set; generate a new set after logging in. Ordinary password changes, login, registration and non-authentication features retain their existing behavior.
