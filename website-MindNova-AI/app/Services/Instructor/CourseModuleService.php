<?php

namespace App\Services\Instructor;

use App\Models\Course;
use App\Models\CourseModule;

class CourseModuleService
{
    public function createModule(Course $course, array $data): CourseModule
    {
        $data['course_id'] = $course->id;
        if (!isset($data['order'])) {
            $maxOrder = $course->modules()->max('order') ?? 0;
            $data['order'] = $maxOrder + 1;
        }

        return CourseModule::create($data);
    }

    public function updateModule(CourseModule $module, array $data): CourseModule
    {
        $module->update($data);
        return $module;
    }

    public function deleteModule(CourseModule $module): void
    {
        $module->delete();
    }
}
