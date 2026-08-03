<x-app-layout>
    <x-slot name="header">
        <div class="flex items-center justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Quản lý lớp học: {{ $course->title }}
            </h2>
            <div class="space-x-2">
                <a href="{{ route('admin.courses.index') }}" class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">
                    Trở về
                </a>
                <a href="{{ route('admin.course_classes.create', $course->id) }}" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
                    + Thêm lớp học
                </a>
            </div>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            @if (session('success'))
                <div class="mb-4 rounded-md bg-green-100 border border-green-300 text-green-700 px-4 py-3">
                    {{ session('success') }}
                </div>
            @endif

            <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên lớp</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giáo viên</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sĩ số</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày bắt đầu</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            @forelse($classes as $class)
                                <tr>
                                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ $class->class_name }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-600">{{ $class->teacher?->name ?? 'Chưa phân công' }}</td>
                                    <td class="px-6 py-4 text-sm font-bold text-blue-600">{{ $class->enrollments_count ?? 0 }} học viên</td>
                                    <td class="px-6 py-4 text-sm text-gray-600">{{ $class->start_date }}</td>
                                    <td class="px-6 py-4 text-sm">
                                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {{ $class->status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700' }}">
                                            {{ ucfirst($class->status) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-sm flex space-x-2 items-center">
                                        <a href="{{ route('admin.course_classes.assign', ['course' => $course->id, 'courseClass' => $class->id]) }}" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                                            Xếp học viên
                                        </a>
                                        <a href="{{ route('admin.course_classes.students.index', [$course->id, $class->id]) }}"
                                        class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        Xem HS
                                        </a>
                                        <a href="#" class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                                            Sửa
                                        </a>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-600">Khóa học này chưa có lớp nào.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
