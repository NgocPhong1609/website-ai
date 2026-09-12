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
    private const PUBLIC_KEY_PREFIX = 'public:';

    public function uploadTemporary(User $instructor, UploadedFile $file, string $purpose): array
    {
        $diskName = $this->mediaDisk();
        $disk = Storage::disk($diskName);
        $extension = strtolower($file->getClientOriginalExtension());
        $directory = "temp/quiz-media/{$instructor->id}";
        $filename = Str::uuid().".{$extension}";
        $key = "{$directory}/{$filename}";

        if ($disk->putFileAs($directory, $file, $filename) === false) {
            throw new \RuntimeException('Không thể lưu ảnh. Vui lòng thử lại.');
        }

        return [
            'url' => $disk->url($key),
            'r2_key' => $this->encodeKey($diskName, $key),
            'storage_disk' => $diskName,
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
            if (empty($answers) && !empty($question['options']) && is_array($question['options'])) {
                $correctIdx = is_numeric($question['correct_answer_index'] ?? null) ? (int)$question['correct_answer_index'] : 0;
                $correctIndices = is_array($question['correct_answer_indices'] ?? null) ? $question['correct_answer_indices'] : [$correctIdx];
                $answers = [];
                foreach ($question['options'] as $oIdx => $optContent) {
                    $isCorrect = ($question['selection_type'] ?? 'single_choice') === 'multiple_choice'
                        ? in_array($oIdx, $correctIndices, true)
                        : $oIdx === $correctIdx;
                    $answers[] = [
                        'content' => (string) $optContent,
                        'is_correct' => $isCorrect,
                        'image_url' => $question['answer_images'][$oIdx]['url'] ?? null,
                        'image_r2_key' => $question['answer_images'][$oIdx]['r2_key'] ?? null,
                    ];
                }
            }

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
        $keysByDisk = [];
        foreach (array_unique($keys) as $storedKey) {
            [$diskName, $key] = $this->decodeKey($storedKey);
            if ($diskName === 'r2' && !$this->r2Configured()) {
                continue;
            }
            $keysByDisk[$diskName][] = $key;
        }

        foreach ($keysByDisk as $diskName => $diskKeys) {
            Storage::disk($diskName)->delete($diskKeys);
        }
    }

    public function isManagedKeyValid(User $instructor, ?Quiz $quiz, string $storedKey): bool
    {
        [$diskName, $key] = $this->decodeKey($storedKey);
        $tempPrefix = "temp/quiz-media/{$instructor->id}/";
        $quizPrefix = $quiz ? "quizzes/{$quiz->id}/" : null;
        $hasAllowedPrefix = str_starts_with($key, $tempPrefix)
            || ($quizPrefix && str_starts_with($key, $quizPrefix));

        if (!$hasAllowedPrefix) {
            return false;
        }

        if ($quizPrefix && str_starts_with($key, $quizPrefix)
            && in_array($storedKey, $this->managedKeys($quiz), true)) {
            return true;
        }

        if ($diskName === 'r2' && !$this->r2Configured()) {
            return false;
        }

        return Storage::disk($diskName)->exists($key);
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

        [$diskName, $storageKey] = $this->decodeKey($key);
        $quizPrefix = "quizzes/{$quiz->id}/";
        if ($diskName === 'r2' && !$this->r2Configured()) {
            if (str_starts_with($storageKey, $quizPrefix)
                && in_array($key, $this->managedKeys($quiz), true)) {
                return [$url, $key];
            }

            throw ValidationException::withMessages([
                $errorPath => 'Cloudflare R2 chưa được cấu hình để xử lý ảnh này.',
            ]);
        }

        $disk = Storage::disk($diskName);

        if (str_starts_with($storageKey, $quizPrefix) && $disk->exists($storageKey)) {
            return [$disk->url($storageKey), $key];
        }

        $tempPrefix = "temp/quiz-media/{$instructor->id}/";
        if (!str_starts_with($storageKey, $tempPrefix) || !$disk->exists($storageKey)) {
            throw ValidationException::withMessages([
                $errorPath => 'Managed quiz media key is invalid or not owned by this instructor.',
            ]);
        }

        $extension = strtolower(pathinfo($storageKey, PATHINFO_EXTENSION));
        $newKey = "{$quizPrefix}{$directory}/".Str::uuid().".{$extension}";
        if (!$disk->move($storageKey, $newKey)) {
            throw ValidationException::withMessages([
                $errorPath => 'Không thể lưu ảnh vào bài kiểm tra. Vui lòng thử lại.',
            ]);
        }
        $promotedKeys[] = $this->encodeKey($diskName, $newKey);

        return [$disk->url($newKey), $this->encodeKey($diskName, $newKey)];
    }

    private function mediaDisk(): string
    {
        return $this->r2Configured() ? 'r2' : 'public';
    }

    private function r2Configured(): bool
    {
        $r2 = config('filesystems.disks.r2', []);

        return !empty($r2['key'])
            && !empty($r2['secret'])
            && !empty($r2['bucket'])
            && !empty($r2['endpoint']);
    }

    private function encodeKey(string $diskName, string $key): string
    {
        return $diskName === 'public' ? self::PUBLIC_KEY_PREFIX.$key : $key;
    }

    private function decodeKey(string $storedKey): array
    {
        if (str_starts_with($storedKey, self::PUBLIC_KEY_PREFIX)) {
            return ['public', substr($storedKey, strlen(self::PUBLIC_KEY_PREFIX))];
        }

        return ['r2', $storedKey];
    }
}
