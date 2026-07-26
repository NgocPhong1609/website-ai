<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreCourseModuleRequest;
use App\Http\Resources\CourseModuleResource;
use App\Models\Course;
use App\Models\CourseModule;
use App\Services\Instructor\CourseModuleService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;

class CourseModuleController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly CourseModuleService $moduleService)
    {
    }

    public function index(Course $course)
    {
        Gate::authorize('view', $course);

        return $this->successResponse(
            CourseModuleResource::collection($course->modules()->with('lessons')->orderBy('order')->get()), 
            'Modules retrieved successfully.'
        );
    }

    public function show(CourseModule $module)
    {
        Gate::authorize('manage', $module);

        return $this->successResponse(new CourseModuleResource($module), 'Module retrieved successfully.');
    }

    public function store(StoreCourseModuleRequest $request, Course $course)
    {
        Gate::authorize('update', $course);

        $module = $this->moduleService->createModule($course, $request->validated());

        return $this->createdResponse(new CourseModuleResource($module), 'Module created successfully.');
    }

    public function update(StoreCourseModuleRequest $request, CourseModule $module)
    {
        Gate::authorize('manage', $module);

        $module = $this->moduleService->updateModule($module, $request->validated());

        return $this->successResponse(new CourseModuleResource($module), 'Module updated successfully.');
    }

    public function destroy(CourseModule $module)
    {
        Gate::authorize('manage', $module);

        $this->moduleService->deleteModule($module);

        return $this->noContentResponse();
    }
}
