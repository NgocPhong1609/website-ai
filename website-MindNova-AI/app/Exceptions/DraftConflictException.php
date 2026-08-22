<?php

namespace App\Exceptions;

use RuntimeException;

class DraftConflictException extends RuntimeException
{
    public function __construct(
        public readonly int $currentLockVersion,
    ) {
        parent::__construct('Bản nháp đã được thay đổi ở một phiên khác. Hãy tải lại trước khi tiếp tục.');
    }
}
