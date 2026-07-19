<div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Danh sách học viên lớp: {{ $courseClass->class_name }}</h1>
    <table class="min-w-full bg-white border">
        <thead>
            <tr>
                <th class="py-2 border">STT</th>
                <th class="py-2 border">Tên học viên</th>
                <th class="py-2 border">Email</th>
            </tr>
        </thead>
        <tbody>
            @foreach($students as $index => $enrollment)
            <tr>
                <td class="py-2 border text-center">{{ $index + 1 }}</td>
                <td class="py-2 border text-center">{{ $enrollment->user->name }}</td>
                <td class="py-2 border text-center">{{ $enrollment->user->email }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
