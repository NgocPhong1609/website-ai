<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\Instructor\LessonService;
use Illuminate\Support\Facades\Log;

class MediaController extends Controller
{
    protected $lessonService;

    public function __construct(LessonService $lessonService)
    {
        $this->lessonService = $lessonService;
    }

    public function uploadTemp(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:mp4,mov,avi,webm,mkv,jpg,jpeg,png,webp|max:2097152', // Max 2GB, support videos and images
        ]);

        try {
            $result = $this->lessonService->uploadTempMedia($request->file('file'));
            return response()->json($result);
        } catch (\Throwable $e) {
            Log::error('Temp media upload failed: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
            return response()->json([
                'error' => 'Upload failed', 
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function deleteTemp($mediaId)
    {
        try {
            $this->lessonService->deleteTempMedia((int) $mediaId);
            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            Log::error('Temp media delete failed: ' . $e->getMessage());
            return response()->json(['error' => 'Delete failed', 'message' => $e->getMessage()], 500);
        }
    }
}
