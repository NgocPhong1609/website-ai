<?php

namespace App\Exceptions;

use RuntimeException;

final class AiVideoUnavailableException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct(
            'Gemini chưa thể đọc video. Kiểm tra quyền Gemini API của khóa và project hoặc thử lại; AI văn bản dự phòng không hỗ trợ video.'
        );
    }
}
