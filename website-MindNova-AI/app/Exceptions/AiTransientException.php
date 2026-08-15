<?php

namespace App\Exceptions;

use Exception;

class AiTransientException extends Exception
{
    // Lỗi tạm thời (503, 429, timeout, network error) của AI API
}
