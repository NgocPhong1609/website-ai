<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Contracts\AiProviderInterface;
use App\DTOs\AiMessageDto;
use Illuminate\Support\Facades\Validator;
use Exception;
use App\Models\Lesson;

class QuizGeneratorController extends Controller
{
    public function __construct(private readonly AiProviderInterface $aiService)
    {
    }

    public function generate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'count' => 'required|integer|min:1|max:20',
            'difficulty' => 'required|string',
            'types' => 'required|array',
            'types.*' => 'string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $content = $request->input('content');
        $count = $request->input('count');
        $difficulty = $request->input('difficulty');
        $types = implode(', ', $request->input('types'));

        $systemPrompt = "You are an expert technical assessor. Generate exactly {$count} quiz questions based on the provided text.
        Difficulty: {$difficulty}.
        Allowed question types: {$types}. (e.g., multiple_choice, true_false, coding_challenge).
        Return ONLY a JSON object with this exact structure (no markdown, no comments):
        {
            \"questions\": [
                {
                    \"id\": \"q-ai-generated-id\",
                    \"type\": \"multiple_choice\",
                    \"question\": \"The question text\",
                    \"correctAnswer\": \"The exact correct answer\",
                    \"distractors\": [\"Incorrect 1\", \"Incorrect 2\", \"Incorrect 3\"],
                    \"explanation\": \"Why it is correct\",
                    \"codeSnippet\": \"(Optional) Any code block associated with the question\"
                }
            ]
        }
        Do NOT wrap in ```json block.";

        try {
            $responseJson = $this->aiService->sendMessage([
                new AiMessageDto("system", $systemPrompt),
                new AiMessageDto("user", "Content to base questions on: \n" . $content)
            ], ['response_mime_type' => 'application/json']);

            $cleanJson = preg_replace('/```json|```/', '', $responseJson);
            $quiz = json_decode(trim($cleanJson), true);

            if (!$quiz || !isset($quiz['questions'])) {
                throw new Exception("Invalid JSON structure returned by AI");
            }

            return response()->json([
                'success' => true,
                'data' => $quiz['questions']
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate quiz: ' . $e->getMessage()
            ], 500);
        }
    }
}
