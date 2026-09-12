<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\UploadQuizMediaRequest;
use App\Services\Instructor\QuizMediaService;
use App\Traits\ApiResponse;

class QuizMediaController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly QuizMediaService $quizMediaService)
    {
    }

    public function store(UploadQuizMediaRequest $request)
    {
        try {
            $media = $this->quizMediaService->uploadTemporary(
                $request->user(),
                $request->file('file'),
                $request->validated('purpose'),
            );
        } catch (\Throwable $exception) {
            report($exception);

            return $this->errorResponse('Không thể tải ảnh lên. Vui lòng thử lại.', 500);
        }

        return $this->createdResponse($media, 'Quiz media uploaded successfully.');
    }
}
