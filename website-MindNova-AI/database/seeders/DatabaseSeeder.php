<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            InstructorSeeder::class,
            AdminUserSeeder::class,
            SampleCourseSeeder::class,
            DiscussionSeeder::class,
            QuizAssessmentSeeder::class,
            StudentFlowTestSeeder::class,
        ]);
    }
}
