<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MindNova Notification</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f8fafc; font-family: Arial, Helvetica, sans-serif; color: #0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <tr>
            <td style="padding: 20px 24px; background: linear-gradient(90deg, #0f766e 0%, #2563eb 100%); color: #ffffff;">
                <h1 style="margin: 0; font-size: 20px;">MindNova Admin Notification</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 24px; font-size: 14px; line-height: 1.7;">
                <p style="margin: 0 0 16px 0;">You have received a notification from the MindNova admin system.</p>
                <div style="padding: 16px; border-radius: 10px; background-color: #f1f5f9; border: 1px solid #dbeafe; white-space: pre-wrap;">
                    {{ $messageBody }}
                </div>
                @if(!empty($senderName))
                    <p style="margin: 16px 0 0 0; color: #334155;">Sender: {{ $senderName }}</p>
                @endif
            </td>
        </tr>
    </table>
</body>
</html>
