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
        $media = $this->quizMediaService->uploadTemporary(
            $request->user(),
            $request->file('file'),
            $request->validated('purpose'),
        );

        return $this->createdResponse($media, 'Quiz media uploaded successfully.');
    }
}
