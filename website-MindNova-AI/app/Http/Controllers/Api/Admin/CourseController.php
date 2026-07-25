<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminLog;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(): JsonResponse
    {
        $courses = Course::with('author')->latest()->get();

        return response()->json(['data' => $courses]);
    }

    public function show(Course $course): JsonResponse
    {
        $course->load('author');

        return response()->json(['data' => $course]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'author_id' => ['nullable', 'integer', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'max:50'],
            'is_published' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'metadata' => ['nullable', 'array'],
        ]);

        $course = Course::create($data);
        $this->logAdminAction($request, 'create_course', $course, 'Created a new course.');

        return response()->json(['message' => 'Course created.', 'data' => $course], 201);
    }

    public function update(Request $request, Course $course): JsonResponse
    {
        $data = $request->validate([
            'author_id' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'nullable', 'string', 'max:50'],
            'is_published' => ['sometimes', 'boolean'],
            'published_at' => ['sometimes', 'nullable', 'date'],
            'metadata' => ['sometimes', 'nullable', 'array'],
        ]);

        $course->update($data);
        $this->logAdminAction($request, 'update_course', $course, 'Updated course details.');

        return response()->json(['message' => 'Course updated.', 'data' => $course]);
    }

    public function destroy(Request $request, Course $course): JsonResponse
    {
        $course->delete();
        $this->logAdminAction($request, 'delete_course', $course, 'Deleted a course.');

        return response()->json(['message' => 'Course deleted.']);
    }

    protected function logAdminAction(Request $request, string $action, Course $target, string $details): void
    {
        AdminLog::create([
            'admin_id' => $request->header('x-admin-user-id'),
            'action' => $action,
            'target_type' => Course::class,
            'target_id' => $target->id,
            'details' => $details,
            'metadata' => [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ],
        ]);
    }
}
