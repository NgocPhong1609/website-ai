<?php

use App\Models\Course;
use App\Models\ChatConversation;
use App\Models\ChatConversationMember;
use App\Models\Enrollment;

$courses = Course::all();
$count = 0;
foreach($courses as $course) {
    $conversation = ChatConversation::firstOrCreate(
        ['course_id' => $course->id],
        ['title' => $course->title, 'type' => 'course']
    );
    
    if ($course->teacher_id) {
        ChatConversationMember::firstOrCreate([
            'chat_conversation_id' => $conversation->id,
            'user_id' => $course->teacher_id
        ], [
            'joined_at' => now()
        ]);
    }
    
    $enrollments = Enrollment::where('course_id', $course->id)->get();
    foreach($enrollments as $enrollment) {
        ChatConversationMember::firstOrCreate([
            'chat_conversation_id' => $conversation->id,
            'user_id' => $enrollment->user_id
        ], [
            'joined_at' => now()
        ]);
    }
    $count++;
}

echo "Successfully migrated $count courses into chat groups!\n";
