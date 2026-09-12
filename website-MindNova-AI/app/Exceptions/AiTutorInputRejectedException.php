<?php

namespace App\Exceptions;

use RuntimeException;

final class AiTutorInputRejectedException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('Yêu cầu không hợp lệ. Vui lòng hỏi về nội dung khóa học.');
    }
}
