<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreCourseRequest;
use App\Http\Requests\Instructor\UpdateCoursePriceRequest;
use App\Http\Requests\Instructor\UpdateCourseRequest;
use App\Http\Requests\Instructor\UpdateCourseStatusRequest;
use App\Http\Requests\Instructor\UploadThumbnailRequest;
use App\Http\Resources\CourseCollection;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Services\Instructor\CourseService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CourseController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly CourseService $courseService)
    {
    }

    public function index(Request $request)
    {
        $query = Course::where('teacher_id', $request->user()->id);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $perPage = $request->get('per_page', 15);
        $courses = $query->paginate($perPage);

        return $this->successResponse(new CourseCollection($courses));
    }

    public function store(StoreCourseRequest $request)
    {
        Gate::authorize('create', Course::class);

        $course = $this->courseService->createCourse($request->validated(), $request->user()->id);

        return $this->createdResponse(new CourseResource($course), 'Course created successfully.');
    }

    public function show(Course $course)
    {
        Gate::authorize('view', $course);

        return $this->successResponse(new CourseResource($course));
    }

    public function update(UpdateCourseRequest $request, Course $course)
    {
        Gate::authorize('update', $course);

        $course = $this->courseService->updateCourse($course, $request->validated());

        return $this->successResponse(new CourseResource($course), 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        Gate::authorize('delete', $course);

        $course->delete();

        return $this->noContentResponse();
    }

    public function uploadThumbnail(UploadThumbnailRequest $request, Course $course)
    {
        Gate::authorize('update', $course);

        $course = $this->courseService->uploadThumbnail($course, $request->file('thumbnail'));

        return $this->successResponse(new CourseResource($course), 'Thumbnail uploaded.');
    }

    public function updateStatus(UpdateCourseStatusRequest $request, Course $course)
    {
        Gate::authorize('update', $course);

        try {
            $course = $this->courseService->updateStatus($course, $request->status);
            return $this->successResponse(new CourseResource($course), 'Course status updated.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function updatePrice(UpdateCoursePriceRequest $request, Course $course)
    {
        Gate::authorize('update', $course);

        $course->update(['price' => $request->price]);

        return $this->successResponse(new CourseResource($course), 'Price updated.');
    }
}
