# PB-036 - Admin Email Notification with Queue

## What was implemented

- API endpoint `POST /api/admin/notifications/test-email` now sends email via queue (asynchronous).
- Added queued mailable: `App\\Mail\\AdminSystemNotificationMail`.
- Added email template view: `resources/views/emails/admin/system-notification.blade.php`.

## Request payload

```json
{
  "email": "admin@example.com",
  "subject": "Thong bao he thong",
  "message": "Noi dung email thong bao"
}
```

All fields are optional.
- `email`: if missing, system uses the current authenticated admin email.
- `subject`: default `MindNova Admin Notification`.
- `message`: default `Thong bao he thong tu trang quan tri MindNova.`.

## Expected response

```json
{
  "message": "Notification email queued successfully.",
  "meta": {
    "recipient": "admin@example.com",
    "queue": "default"
  }
}
```

## Queue and mail setup

1. Make sure environment is configured:

```env
QUEUE_CONNECTION=database
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="noreply@mindnova.local"
MAIL_FROM_NAME="MindNova"
```

2. Run migrations (for jobs/failed_jobs table):

```bash
php artisan migrate
```

3. Start queue worker:

```bash
php artisan queue:work
```

4. Call endpoint from admin panel or API client with Bearer token admin.

## Local testing tip

For local testing, use Mailpit/Mailhog and set `MAIL_HOST` + `MAIL_PORT` accordingly.
