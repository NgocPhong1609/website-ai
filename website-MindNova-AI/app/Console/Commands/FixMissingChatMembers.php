<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Course;
use App\Models\ChatConversation;
use App\Models\ChatConversationMember;
use App\Models\Enrollment;

#[Signature('chat:fix-missing-members')]
#[Description('Quét toàn bộ Học viên đã mua khóa học và đảm bảo họ có trong nhóm chat')]
class FixMissingChatMembers extends Command
{
    public function handle()
    {
        $this->info('Đang quét và đồng bộ các học viên bị thiếu trong Chat Group...');
        
        $courses = Course::all();
        $totalAdded = 0;
        
        foreach ($courses as $course) {
            $conversation = ChatConversation::firstOrCreate(
                ['course_id' => $course->id],
                ['title' => $course->title, 'type' => 'course']
            );
            
            if ($course->teacher_id) {
                $teacherAdded = ChatConversationMember::firstOrCreate([
                    'chat_conversation_id' => $conversation->id,
                    'user_id' => $course->teacher_id
                ]);
            }
            
            $enrollments = DB::table('enrollments')->where('course_id', $course->id)->get();
            
            foreach ($enrollments as $enrollment) {
                $member = ChatConversationMember::firstOrCreate([
                    'chat_conversation_id' => $conversation->id,
                    'user_id' => $enrollment->user_id
                ]);
                
                if ($member->wasRecentlyCreated) {
                    $totalAdded++;
                }
            }
        }
        
        $this->info("Đã chạy xong! Đã thêm thành công $totalAdded thành viên mới vào các nhóm chat.");
    }
}
