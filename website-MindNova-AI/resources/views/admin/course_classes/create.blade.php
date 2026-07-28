<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">Thêm lớp mới cho: {{ $course->title }}</h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white p-6 shadow-sm rounded-lg">
                <form action="{{ route('admin.course_classes.store', $course->id) }}" method="POST">
                    @csrf
                    <!-- Tên lớp -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Tên lớp</label>
                        <input type="text" name="class_name" class="w-full mt-1 border-gray-300 rounded-md shadow-sm" required>
                    </div>
                    <!-- Chọn giáo viên -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Giáo viên</label>
                        <select name="teacher_id" class="w-full mt-1 border-gray-300 rounded-md shadow-sm" required>
                            @foreach($teachers as $teacher)
                                <option value="{{ $teacher->id }}">{{ $teacher->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <!-- Ngày bắt đầu -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                        <input type="date" name="start_date" class="w-full mt-1 border-gray-300 rounded-md shadow-sm" required>
                    </div>
                    <!-- Trạng thái -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Trạng thái</label>
                        <select name="status" class="w-full mt-1 border-gray-300 rounded-md shadow-sm">
                            <option value="upcoming">Sắp khai giảng</option>
                            <option value="ongoing">Đang học</option>
                        </select>
                    </div>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Lưu lớp học</button>
                </form>
            </div>
        </div>
    </div>
</x-app-layout>
