<?php

namespace App\Services\Instructor;

class CourseOutlineValidator
{
    public static function decode(string $content): ?array
    {
        $data = json_decode(trim(preg_replace('/```json|```/', '', $content)), true);
        if (! is_array($data) || ! is_array($data['chapters'] ?? null)
            || ! array_is_list($data['chapters']) || count($data['chapters']) < 4 || count($data['chapters']) > 6) {
            return null;
        }
        foreach ($data['chapters'] as $chapter) {
            if (! is_array($chapter) || ! self::text($chapter['title'] ?? null)
                || ! is_array($chapter['lessons'] ?? null) || ! array_is_list($chapter['lessons']) || count($chapter['lessons']) !== 4) {
                return null;
            }
            foreach ($chapter['lessons'] as $i => $lesson) {
                if (! is_array($lesson) || ! self::text($lesson['title'] ?? null)) {
                    return null;
                }
                if ($i < 3) {
                    if (($lesson['type'] ?? null) !== 'document' || ! self::text($lesson['content'] ?? null)) {
                        return null;
                    }

                    continue;
                }
                if (($lesson['type'] ?? null) !== 'quiz' || ! is_array($lesson['questions'] ?? null)
                    || ! array_is_list($lesson['questions']) || count($lesson['questions']) !== 3) {
                    return null;
                }
                foreach ($lesson['questions'] as $question) {
                    if (! is_array($question) || ! self::text($question['content'] ?? null)
                        || ! is_array($question['answers'] ?? null) || ! array_is_list($question['answers']) || count($question['answers']) !== 4) {
                        return null;
                    }
                    $correct = 0;
                    foreach ($question['answers'] as $answer) {
                        if (! is_array($answer) || ! self::text($answer['content'] ?? null) || ! is_bool($answer['is_correct'] ?? null)) {
                            return null;
                        }
                        $correct += (int) $answer['is_correct'];
                    }
                    if ($correct !== 1) {
                        return null;
                    }
                }
            }
        }

        return $data;
    }

    private static function text(mixed $value): bool
    {
        return is_string($value) && trim(strip_tags($value)) !== '';
    }
}
