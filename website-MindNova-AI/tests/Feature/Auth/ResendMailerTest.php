<?php

namespace Tests\Feature\Auth;

use Illuminate\Mail\Transport\ResendTransport;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ResendMailerTest extends TestCase
{
    public function test_resend_mailer_can_be_resolved_with_the_installed_sdk(): void
    {
        config(['services.resend.key' => 're_test_not_a_real_key']);

        $this->assertInstanceOf(
            ResendTransport::class,
            Mail::mailer('resend')->getSymfonyTransport(),
        );
    }
}
