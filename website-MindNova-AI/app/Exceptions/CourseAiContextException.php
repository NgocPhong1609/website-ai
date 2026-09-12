<?php

namespace App\Exceptions;

use RuntimeException;

final class CourseAiContextException extends RuntimeException
{
    public function __construct(string $message, private readonly int $httpStatus)
    {
        parent::__construct($message);
    }

    public function status(): int
    {
        return $this->httpStatus;
    }
}
