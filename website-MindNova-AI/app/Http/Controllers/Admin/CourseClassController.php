<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseClass;
use App\Models\User;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class CourseClassController extends Controller
{
    // Hiển thị danh sách các lớp của 1 khóa học
    public function index(Course $course)
    {
        // Lấy các lớp thuộc khóa học này kèm thông tin giáo viên và đếm số lượng học viên đã xếp vào lớp
        $classes = $course->classes()->with('teacher')->withCount('enrollments')->latest()->get();

        return view('admin.course_classes.index', compact('course', 'classes'));
    }

    // Hiển thị form mở lớp mới
    public function create(Course $course)
    {
        // Lấy danh sách những user có role là 'teacher' hoặc tùy vào logic hệ thống của bạn để phân quyền
        $teachers = User::whereHas('roles', function ($query) {
            $query->where('name', 'teacher');
        })->get();

        return view('admin.course_classes.create', compact('course', 'teachers'));
    }

    // Lưu thông tin lớp học vào DB
    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'teacher_id' => ['required', 'exists:users,id'],
            'class_name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date'   => ['nullable', 'date', 'after_or_equal:start_date'],
            'schedule'   => ['nullable', 'string', 'max:255'],
            'status'     => ['required', 'in:upcoming,ongoing,completed,cancelled'],
        ]);

        // Gắn class này vào khóa học hiện tại
        $course->classes()->create($validated);

        return redirect()->route('admin.course_classes.index', $course->id)
                         ->with('success', 'Mở lớp mới thành công!');
    }

    // ==============================================================================
    // CÁC HÀM XỬ LÝ PHÂN BỔ HỌC VIÊN (GOM NHÓM VÀO LỚP)
    // ==============================================================================

    // Hiển thị giao diện danh sách học viên đang ở "phòng chờ" của khóa học này
    public function assign(Course $course, CourseClass $courseClass)
    {
        // Lấy các học viên đã mua khóa này nhưng chưa được xếp lớp (course_class_id là null)
        $waitingEnrollments = Enrollment::with('user')
            ->where('course_id', $course->id)
            ->whereNull('course_class_id')
            ->where('status', 'waiting')
            ->get();

        return view('admin.course_classes.assign', compact('course', 'courseClass', 'waitingEnrollments'));
    }

    // Xử lý logic gán học viên vào lớp sau khi Admin tick chọn và bấm "Lưu"
    public function assignStudents(Request $request, Course $course, CourseClass $courseClass)
    {
        // Validate dữ liệu từ form gửi lên (Yêu cầu phải là mảng chứa các ID hợp lệ)
        $request->validate([
            'enrollment_ids'   => ['required', 'array'],
            'enrollment_ids.*' => ['exists:enrollments,id']
        ]);

        // Cập nhật hàng loạt: Tìm các enrollments được tick chọn và gán ID lớp học vào
        Enrollment::whereIn('id', $request->enrollment_ids)
            ->where('course_id', $course->id) // Bảo mật: Đảm bảo chỉ thao tác trên học viên của khóa học này
            ->update([
                'course_class_id' => $courseClass->id,
                'status'          => 'enrolled'
            ]);

        // Trả về trang danh sách lớp học kèm thông báo thành công
        return redirect()->route('admin.course_classes.index', $course->id)
                         ->with('success', 'Đã xếp ' . count($request->enrollment_ids) . ' học viên vào ' . $courseClass->class_name . ' thành công!');
    }

    public function showStudents($courseId, CourseClass $courseClass)
    {
        // Lấy danh sách học viên đã được xếp vào lớp này
        $students = \App\Models\Enrollment::where('course_class_id', $courseClass->id)
            ->with('user') // Tải thông tin User
            ->get();

        return view('admin.course_classes.students', compact('courseClass', 'students'));
    }
}
