<?php

namespace App\Services\Instructor;

use App\Models\Quiz;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class QuizMediaService
{
    public function uploadTemporary(User $instructor, UploadedFile $file, string $purpose): array
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $directory = "temp/quiz-media/{$instructor->id}";
        $filename = Str::uuid().".{$extension}";
        $key = "{$directory}/{$filename}";

        Storage::disk('r2')->putFileAs($directory, $file, $filename);

        return [
            'url' => Storage::disk('r2')->url($key),
            'r2_key' => $key,
            'mime_type' => $file->getMimeType() ?: 'application/octet-stream',
            'size_bytes' => $file->getSize(),
            'purpose' => $purpose,
        ];
    }

    public function promotePayload(User $instructor, Quiz $quiz, array $data): array
    {
        $promotedKeys = [];
        [$data['thumbnail_url'], $data['thumbnail_r2_key']] = $this->promotePair(
            $instructor,
            $quiz,
            $data['thumbnail_url'] ?? null,
            $data['thumbnail_r2_key'] ?? null,
            'thumbnail',
            'thumbnail_r2_key',
            $promotedKeys,
        );

        $questions = $data['questions'] ?? [];
        foreach ($questions as $questionIndex => &$question) {
            [$question['image_url'], $question['image_r2_key']] = $this->promotePair(
                $instructor,
                $quiz,
                $question['image_url'] ?? null,
                $question['image_r2_key'] ?? null,
                'questions',
                "questions.{$questionIndex}.image_r2_key",
                $promotedKeys,
            );

            $answers = $question['answers'] ?? [];
            foreach ($answers as $answerIndex => &$answer) {
                [$answer['image_url'], $answer['image_r2_key']] = $this->promotePair(
                    $instructor,
                    $quiz,
                    $answer['image_url'] ?? null,
                    $answer['image_r2_key'] ?? null,
                    'answers',
                    "questions.{$questionIndex}.answers.{$answerIndex}.image_r2_key",
                    $promotedKeys,
                );
            }
            unset($answer);
            $question['answers'] = $answers;
        }
        unset($question);
        $data['questions'] = $questions;

        return ['data' => $data, 'promoted_keys' => $promotedKeys];
    }

    public function managedKeys(Quiz $quiz): array
    {
        $quiz->loadMissing('questions.answers');

        return collect([$quiz->thumbnail_r2_key])
            ->merge($quiz->questions->pluck('image_r2_key'))
            ->merge($quiz->questions->flatMap(fn ($question) => $question->answers->pluck('image_r2_key')))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    public function deleteKeys(array $keys): void
    {
        if ($keys !== []) {
            Storage::disk('r2')->delete(array_values(array_unique($keys)));
        }
    }

    private function promotePair(
        User $instructor,
        Quiz $quiz,
        ?string $url,
        ?string $key,
        string $directory,
        string $errorPath,
        array &$promotedKeys,
    ): array {
        if (!$key) {
            return [$url, null];
        }

        $quizPrefix = "quizzes/{$quiz->id}/";
        if (str_starts_with($key, $quizPrefix) && Storage::disk('r2')->exists($key)) {
            return [Storage::disk('r2')->url($key), $key];
        }

        $tempPrefix = "temp/quiz-media/{$instructor->id}/";
        if (!str_starts_with($key, $tempPrefix) || !Storage::disk('r2')->exists($key)) {
            throw ValidationException::withMessages([
                $errorPath => 'Managed quiz media key is invalid or not owned by this instructor.',
            ]);
        }

        $extension = strtolower(pathinfo($key, PATHINFO_EXTENSION));
        $newKey = "{$quizPrefix}{$directory}/".Str::uuid().".{$extension}";
        Storage::disk('r2')->move($key, $newKey);
        $promotedKeys[] = $newKey;

        return [Storage::disk('r2')->url($newKey), $newKey];
    }
}
