<?php

namespace App\Exceptions;

use RuntimeException;

class AiQuotaExceededException extends RuntimeException
{
    public function __construct(private readonly array $quota)
    {
        parent::__construct('Bạn đã sử dụng hết lượt AI hôm nay.');
    }

    public function quota(): array
    {
        return $this->quota;
    }
}
