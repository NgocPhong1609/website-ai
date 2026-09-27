<?php

use App\Models\User;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\Category;
use App\Models\Lesson;
use App\Models\LessonCompletion;
use App\Services\Student\ProgressService;

beforeEach(function () {
    $this->service = new ProgressService();
    
    // Create base data for course
    $this->category = Category::create([
        'name' => 'Tech',
        'slug' => 'tech',
        'is_active' => true
    ]);
    
    $this->course = Course::create([
        'title' => 'AI Masterclass',
        'slug' => 'ai-masterclass',
        'category_id' => $this->category->id,
        'teacher_id' => User::factory()->create()->id,
        'description' => 'Test',
        'price' => 0,
        'status' => 'published'
    ]);
});

test('it returns default values when user is null', function () {
    $result = $this->service->getOverview(null);
    
    expect($result['overview_card']['completion_percentage'])->toBe(0)
        ->and($result['roadmap_modules'])->toBeArray()->toBeEmpty();
});

test('it returns default values when user has no active enrollment', function () {
    $user = User::factory()->create();
    
    $result = $this->service->getOverview($user);
    
    expect($result['overview_card']['completion_percentage'])->toBe(0)
        ->and($result['roadmap_modules'])->toBeEmpty();
});

function progressModuleWithLessons(int $courseId, int $order, int $lessonCount): array
{
    $module = CourseModule::create(['course_id' => $courseId, 'title' => "M{$order}", 'order' => $order, 'slug' => "m{$order}"]);
    $ids = [];
    for ($i = 1; $i <= $lessonCount; $i++) {
        $ids[] = Lesson::create([
            'course_id' => $courseId,
            'module_id' => $module->id,
            'title' => "L{$order}.{$i}",
            'type' => 'article',
            'order' => $i,
        ])->id;
    }

    return $ids;
}

function completeProgressLessons(User $user, array $lessonIds): void
{
    foreach ($lessonIds as $id) {
        LessonCompletion::create(['user_id' => $user->id, 'lesson_id' => $id, 'completed_at' => now()]);
    }
}

function enrollForProgress(User $user, int $courseId): void
{
    Enrollment::create([
        'user_id' => $user->id,
        'course_id' => $courseId,
        'status' => 'enrolled',
        'progress_percentage' => 0,
        'enrolled_at' => now(),
    ]);
}

test('the first unfinished module is active and later ones have not started', function () {
    $user = User::factory()->create();
    enrollForProgress($user, $this->course->id);
    progressModuleWithLessons($this->course->id, 1, 2);
    progressModuleWithLessons($this->course->id, 2, 2);
    progressModuleWithLessons($this->course->id, 3, 2);

    $modules = $this->service->getOverview($user)['roadmap_modules'];

    expect($modules)->toHaveCount(3)
        ->and($modules[0]['status'])->toBe('active')
        ->and($modules[0]['progress_percentage'])->toBe(0)
        ->and($modules[1]['status'])->toBe('locked')
        ->and($modules[2]['status'])->toBe('locked')
        ->and($modules[0]['action_link'])->toBe("/courses/detail?courseId={$this->course->id}");
});

test('a module is completed only when all of its lessons are completed', function () {
    $user = User::factory()->create();
    enrollForProgress($user, $this->course->id);
    $first = progressModuleWithLessons($this->course->id, 1, 2);
    $second = progressModuleWithLessons($this->course->id, 2, 4);
    progressModuleWithLessons($this->course->id, 3, 1);
    completeProgressLessons($user, [...$first, $second[0]]);

    $modules = $this->service->getOverview($user)['roadmap_modules'];

    expect($modules[0]['status'])->toBe('completed')
        ->and($modules[0]['progress_percentage'])->toBe(100)
        ->and($modules[1]['status'])->toBe('active')
        ->and($modules[1]['progress_percentage'])->toBe(25)
        ->and($modules[2]['status'])->toBe('locked');
});

test('lessons completed in other courses do not count towards this course', function () {
    $user = User::factory()->create();
    enrollForProgress($user, $this->course->id);
    progressModuleWithLessons($this->course->id, 1, 2);

    $otherCourse = Course::create([
        'title' => 'Other', 'slug' => 'other-course', 'category_id' => $this->category->id,
        'teacher_id' => $this->course->teacher_id, 'description' => 'Other', 'price' => 0, 'status' => 'published',
    ]);
    $otherLessons = progressModuleWithLessons($otherCourse->id, 1, 3);
    completeProgressLessons($user, $otherLessons);

    $modules = $this->service->getOverview($user)['roadmap_modules'];

    expect($modules[0]['status'])->toBe('active')
        ->and($modules[0]['progress_percentage'])->toBe(0);
});
