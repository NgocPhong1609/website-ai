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

use App\Services\Instructor\CourseStructureService;

use App\Models\Lesson;
use App\Models\QuizCourseAttachment;

class CourseModuleController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly CourseModuleService $moduleService,
        private readonly CourseStructureService $structureService
    ) {
    }

    public function index(Course $course)
    {
        Gate::authorize('view', $course);

        $structure = $this->structureService->getCourseStructure($course, false);

        return $this->successResponse(
            $structure, 
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

    public function reorderItems(Request $request, CourseModule $module)
    {
        Gate::authorize('manage', $module);

        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required',
            'items.*.order' => 'required|integer',
        ]);

        foreach ($request->items as $item) {
            $itemId = (string) $item['id'];
            $order = (int) $item['order'];

            if (str_starts_with($itemId, 'quiz-')) {
                $quizId = (int) str_replace('quiz-', '', $itemId);
                QuizCourseAttachment::where('quiz_id', $quizId)
                    ->where('course_id', $module->course_id)
                    ->update(['order' => $order]);
            } else {
                $lessonId = (int) $itemId;
                Lesson::where('id', $lessonId)
                    ->where('module_id', $module->id)
                    ->update(['order' => $order]);
            }
        }

        return $this->successResponse(null, 'Module items reordered successfully.');
    }

    public function destroy(CourseModule $module)
    {
        Gate::authorize('manage', $module);

        $this->moduleService->deleteModule($module);

        return $this->noContentResponse();
    }
}
