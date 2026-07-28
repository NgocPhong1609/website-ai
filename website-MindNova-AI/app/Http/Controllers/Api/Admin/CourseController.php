<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminLog;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    public function index(): JsonResponse
    {
        $query = Course::query()->with(['teacher:id,name', 'category:id,name'])->latest();

        if (request()->filled('search')) {
            $keyword = trim((string) request()->string('search'));
            $query->where('title', 'like', '%' . $keyword . '%');
        }

        if (request()->filled('category_id')) {
            $query->where('category_id', (int) request()->input('category_id'));
        }

        if (request()->filled('level')) {
            $query->where('level', (string) request()->string('level'));
        }

        $courses = $query->get();

        return response()->json(['data' => $courses]);
    }

    public function show(Course $course): JsonResponse
    {
        $course->load(['teacher:id,name', 'category:id,name']);

        return response()->json(['data' => $course]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'level' => ['nullable', 'in:beginner,intermediate,advanced'],
            'status' => ['nullable', 'in:draft,published,archived'],
        ]);

        $slug = Str::slug($data['title']);
        $baseSlug = $slug;
        $suffix = 1;
        while (Course::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $suffix;
            $suffix++;
        }

        $course = Course::create([
            'teacher_id' => (int) $request->user()->id,
            'category_id' => $data['category_id'] ?? null,
            'title' => $data['title'],
            'slug' => $slug,
            'description' => $data['description'] ?? '',
            'thumbnail' => $data['thumbnail'] ?? null,
            'price' => $data['price'] ?? 0,
            'level' => $data['level'] ?? 'beginner',
            'status' => $data['status'] ?? 'draft',
        ]);

        $this->logAdminAction($request, 'create_course', $course, 'Created a new course.');

        return response()->json(['message' => 'Course created.', 'data' => $course], 201);
    }

    public function update(Request $request, Course $course): JsonResponse
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'thumbnail' => ['sometimes', 'nullable', 'string', 'max:255'],
            'price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'category_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
            'level' => ['sometimes', 'in:beginner,intermediate,advanced'],
            'status' => ['sometimes', 'in:draft,published,archived'],
        ]);

        if (array_key_exists('title', $data)) {
            $slug = Str::slug($data['title']);
            $baseSlug = $slug;
            $suffix = 1;
            while (Course::where('slug', $slug)->where('id', '!=', $course->id)->exists()) {
                $slug = $baseSlug . '-' . $suffix;
                $suffix++;
            }
            $data['slug'] = $slug;
        }

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
            'admin_id' => $request->user()?->id,
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
