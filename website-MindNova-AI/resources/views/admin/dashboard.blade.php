<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('Admin Dashboard') }}
            </h2>
            <span class="text-sm text-gray-600">{{ auth()->user()->name }}</span>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <!-- Welcome Section -->
            <div class="mb-8">
                <div class="bg-gradient-to-r from-blue-100 to-indigo-200 overflow-hidden shadow-lg rounded-lg">
                    <div class="px-6 py-8 text-gray-900">
                        <h3 class="text-2xl font-bold mb-2">{{ __('Welcome back, ' . auth()->user()->name . '!') }}</h3>
                        <p class="text-gray-700">{{ __('Here\'s what\'s happening with your platform today.') }}</p>
                    </div>
                </div>
            </div>

            <!-- Key Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <!-- Total Users -->
                <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm font-medium">{{ __('Total Users') }}</p>
                                <p class="text-3xl font-bold text-gray-900 mt-2">{{ $totalUsers }}</p>
                            </div>
                            <div class="text-4xl text-blue-500 opacity-20">👥</div>
                        </div>
                        <p class="text-xs text-gray-500 mt-4">{{ __('Active platform users') }}</p>
                    </div>
                </div>

                <!-- Total Courses -->
                <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm font-medium">{{ __('Total Courses') }}</p>
                                <p class="text-3xl font-bold text-gray-900 mt-2">{{ $totalCourses }}</p>
                            </div>
                            <div class="text-4xl text-green-500 opacity-20">📚</div>
                        </div>
                        <p class="text-xs text-gray-500 mt-4">{{ __('Published courses') }}</p>
                    </div>
                </div>

                <!-- Total Revenue -->
                <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm font-medium">{{ __('Total Revenue') }}</p>
                                <p class="text-3xl font-bold text-gray-900 mt-2">
                                    ${{ number_format($totalRevenue, 2) }}
                                </p>
                            </div>
                            <div class="text-4xl text-purple-500 opacity-20">💰</div>
                        </div>
                        <p class="text-xs text-gray-500 mt-4">{{ __('From completed payments') }}</p>
                    </div>
                </div>

                <!-- Active Subscriptions -->
                <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm font-medium">{{ __('Active Subscriptions') }}</p>
                                <p class="text-3xl font-bold text-gray-900 mt-2">{{ $activeSubscriptions }}</p>
                            </div>
                            <div class="text-4xl text-yellow-500 opacity-20">✨</div>
                        </div>
                        <p class="text-xs text-gray-500 mt-4">{{ __('Premium users') }}</p>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <!-- Recent Users Section -->
                <div class="lg:col-span-2 bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">{{ __('Recent Users') }}</h3>
                    </div>
                    <div class="p-6">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Name') }}</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Email') }}</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Joined') }}</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    @forelse($recentUsers as $user)
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ $user->name }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ $user->email }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ $user->created_at->format('M d, Y') }}</td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-600">{{ __('No users yet') }}</td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">{{ __('Quick Actions') }}</h3>
                    </div>
                    <div class="p-6 space-y-3">
                        <a href="#" class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center">
                            {{ __('Add New Course') }}
                        </a>
                        <a href="#" class="block w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center">
                            {{ __('Manage Users') }}
                        </a>
                        <a href="#" class="block w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center">
                            {{ __('View Reports') }}
                        </a>
                        <a href="#" class="block w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center">
                            {{ __('Settings') }}
                        </a>
                    </div>
                </div>
            </div>

            <!-- Recent Payments & Activity -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Recent Payments -->
                <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">{{ __('Recent Payments') }}</h3>
                    </div>
                    <div class="p-6">
                        <div class="space-y-4">
                            @forelse($recentPayments as $payment)
                                <div class="flex items-center justify-between border-b pb-4 last:border-b-0">
                                    <div>
                                        <p class="font-medium text-gray-900">{{ $payment->user->name }}</p>
                                        <p class="text-sm text-gray-600">{{ $payment->description ?? 'Course Payment' }}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-semibold text-gray-900">${{ number_format($payment->amount, 2) }}</p>
                                        <span class="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full 
                                            @if($payment->status === 'completed') bg-green-100 text-green-800
                                            @elseif($payment->status === 'pending') bg-yellow-100 text-yellow-800
                                            @else bg-red-100 text-red-800
                                            @endif">
                                            {{ ucfirst($payment->status) }}
                                        </span>
                                    </div>
                                </div>
                            @empty
                                <p class="text-center text-gray-600">{{ __('No payments yet') }}</p>
                            @endforelse
                        </div>
                    </div>
                </div>

                <!-- System Status -->
                <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">{{ __('System Status') }}</h3>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-gray-700">{{ __('Database') }}</span>
                            <span class="inline-block text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">{{ __('Healthy') }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-700">{{ __('Server') }}</span>
                            <span class="inline-block text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">{{ __('Running') }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-700">{{ __('API') }}</span>
                            <span class="inline-block text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">{{ __('Active') }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-700">{{ __('Cache') }}</span>
                            <span class="inline-block text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">{{ __('Optimal') }}</span>
                        </div>
                        <div class="mt-6 pt-4 border-t">
                            <p class="text-xs text-gray-600">{{ __('Last checked: now') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
