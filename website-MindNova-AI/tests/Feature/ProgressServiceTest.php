<?php

use App\Models\User;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\Category;
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

test('it correctly maps modules for 0% progress', function () {
    $user = User::factory()->create();
    
    Enrollment::create([
        'user_id' => $user->id,
        'course_id' => $this->course->id,
        'status' => 'enrolled',
        'progress_percentage' => 0,
        'enrolled_at' => now(),
    ]);
    
    CourseModule::create(['course_id' => $this->course->id, 'title' => 'M1', 'order' => 1, 'slug' => 'm1']);
    CourseModule::create(['course_id' => $this->course->id, 'title' => 'M2', 'order' => 2, 'slug' => 'm2']);
    CourseModule::create(['course_id' => $this->course->id, 'title' => 'M3', 'order' => 3, 'slug' => 'm3']);
    
    $result = $this->service->getOverview($user);
    
    $modules = $result['roadmap_modules'];
    expect($modules)->toHaveCount(3);
    
    // First module active, others locked
    expect($modules[0]['status'])->toBe('active')
        ->and($modules[0]['progress_percentage'])->toBe(0);
        
    expect($modules[1]['status'])->toBe('locked');
    expect($modules[2]['status'])->toBe('locked');
});

test('it correctly maps modules for 25% progress', function () {
    $user = User::factory()->create();
    
    Enrollment::create([
        'user_id' => $user->id,
        'course_id' => $this->course->id,
        'status' => 'enrolled',
        'progress_percentage' => 25,
        'enrolled_at' => now(),
    ]);
    
    CourseModule::create(['course_id' => $this->course->id, 'title' => 'M1', 'order' => 1, 'slug' => 'm1']);
    CourseModule::create(['course_id' => $this->course->id, 'title' => 'M2', 'order' => 2, 'slug' => 'm2']);
    CourseModule::create(['course_id' => $this->course->id, 'title' => 'M3', 'order' => 3, 'slug' => 'm3']);
    
    $result = $this->service->getOverview($user);
    $modules = $result['roadmap_modules'];
    
    expect($modules[0]['status'])->toBe('completed')
        ->and($modules[0]['progress_percentage'])->toBe(100);
        
    expect($modules[1]['status'])->toBe('active')
        ->and($modules[1]['progress_percentage'])->toBe(0);
        
    expect($modules[2]['status'])->toBe('locked');
});

test('it correctly maps partial module progress (37.5%)', function () {
    $user = User::factory()->create();
    
    Enrollment::create([
        'user_id' => $user->id,
        'course_id' => $this->course->id,
        'status' => 'enrolled',
        'progress_percentage' => 37.5,
        'enrolled_at' => now(),
    ]);
    
    CourseModule::create(['course_id' => $this->course->id, 'title' => 'M1', 'order' => 1, 'slug' => 'm1']);
    CourseModule::create(['course_id' => $this->course->id, 'title' => 'M2', 'order' => 2, 'slug' => 'm2']);
    
    $result = $this->service->getOverview($user);
    $modules = $result['roadmap_modules'];
    
    expect($modules[0]['status'])->toBe('completed');
    
    // Module 2 formula: (38 - 25) * 4 = 13 * 4 = 52% (Since progress_percentage is an INT in DB, 37.5 becomes 38)
    expect($modules[1]['status'])->toBe('active')
        ->and($modules[1]['progress_percentage'])->toBe(52);
});
