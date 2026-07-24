<x-app-layout>
    <x-slot name="header">
        <div class="flex items-center justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Xếp học viên vào lớp: <span class="text-blue-600">{{ $courseClass->class_name }}</span>
            </h2>
            <a href="{{ route('admin.course_classes.index', $course->id) }}" class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">
                Trở về
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm rounded-lg p-6">
                <div class="mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Danh sách chờ (Chưa xếp lớp) của khóa: {{ $course->title }}</h3>
                    <p class="text-sm text-gray-500">Tick chọn những học viên bạn muốn đưa vào lớp này và ấn Lưu.</p>
                </div>

                <form action="{{ route('admin.course_classes.assignStudents', ['course' => $course->id, 'courseClass' => $courseClass->id]) }}" method="POST">
                    @csrf

                    <div class="overflow-x-auto mb-4 border rounded-md">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-3 text-left w-12">
                                        <!-- Bỏ qua code JS check all phức tạp tạm thời, dùng checkbox thường -->
                                        <input type="checkbox" id="checkAll" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ và tên</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày mua</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                @forelse($waitingEnrollments as $enrollment)
                                    <tr>
                                        <td class="px-4 py-3">
                                            <input type="checkbox" name="enrollment_ids[]" value="{{ $enrollment->id }}" class="rounded border-gray-300 text-blue-600 shadow-sm">
                                        </td>
                                        <td class="px-6 py-4 text-sm text-gray-500">#{{ $enrollment->id }}</td>
                                        <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ $enrollment->user->name }}</td>
                                        <td class="px-6 py-4 text-sm text-gray-500">{{ $enrollment->user->email }}</td>
                                        <td class="px-6 py-4 text-sm text-gray-500">{{ $enrollment->enrolled_at ? $enrollment->enrolled_at->format('d/m/Y') : 'N/A' }}</td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                                            Không có học viên nào đang chờ xếp lớp cho khóa học này.
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>

                    @if($waitingEnrollments->count() > 0)
                        <div class="flex justify-end">
                            <button type="submit" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
                                Lưu danh sách xếp lớp
                            </button>
                        </div>
                    @endif
                </form>
            </div>
        </div>
    </div>
</x-app-layout>
