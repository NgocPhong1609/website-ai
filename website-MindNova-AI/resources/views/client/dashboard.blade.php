<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('My Learning Dashboard') }}
            </h2>
            <span class="text-sm text-gray-600">{{ auth()->user()->name }}</span>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <!-- Welcome Section -->
            <div class="mb-8">
                <div class="bg-gradient-to-r from-indigo-100 to-blue-200 overflow-hidden shadow-lg rounded-lg">
                    <div class="px-6 py-8 text-gray-900">
                        <h3 class="text-2xl font-bold mb-2">{{ __('Welcome back, ' . auth()->user()->name . '!') }}</h3>
                        <p class="text-gray-700">{{ __('Continue your learning journey and explore new courses.') }}</p>
                    </div>
                </div>
            </div>

            <!-- Learning Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <!-- Enrolled Courses -->
                <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm font-medium">{{ __('Enrolled Courses') }}</p>
                                <p class="text-3xl font-bold text-gray-900 mt-2">{{ $enrolledCourses }}</p>
                            </div>
                            <div class="text-4xl text-blue-500 opacity-20">📖</div>
                        </div>
                        <p class="text-xs text-gray-500 mt-4">{{ __('Active enrollments') }}</p>
                    </div>
                </div>

                <!-- Total Spent -->
                <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm font-medium">{{ __('Total Spent') }}</p>
                                <p class="text-3xl font-bold text-gray-900 mt-2">
                                    ${{ number_format($totalSpent, 2) }}
                                </p>
                            </div>
                            <div class="text-4xl text-green-500 opacity-20">💳</div>
                        </div>
                        <p class="text-xs text-gray-500 mt-4">{{ __('On learning') }}</p>
                    </div>
                </div>

                <!-- Hours Learned -->
                <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm font-medium">{{ __('Hours Learned') }}</p>
                                <p class="text-3xl font-bold text-gray-900 mt-2">12.5</p>
                            </div>
                            <div class="text-4xl text-purple-500 opacity-20">⏱️</div>
                        </div>
                        <p class="text-xs text-gray-500 mt-4">{{ __('Total learning time') }}</p>
                    </div>
                </div>

                <!-- Completion Rate -->
                <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm font-medium">{{ __('Completion Rate') }}</p>
                                <p class="text-3xl font-bold text-gray-900 mt-2">65%</p>
                            </div>
                            <div class="text-4xl text-yellow-500 opacity-20">🎯</div>
                        </div>
                        <p class="text-xs text-gray-500 mt-4">{{ __('Average progress') }}</p>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <!-- Current Courses -->
                <div class="lg:col-span-2 bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">{{ __('Your Courses') }}</h3>
                    </div>
                    <div class="p-6">
                        @if($subscriptions->count() > 0)
                            <div class="space-y-4">
                                @foreach($subscriptions as $subscription)
                                    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div class="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 class="font-semibold text-gray-900">{{ $subscription->metadata['title'] ?? 'Course' }}</h4>
                                                <p class="text-sm text-gray-600 mt-1">{{ $subscription->metadata['description'] ?? 'Learn amazing skills' }}</p>
                                            </div>
                                            <span class="inline-block text-xs font-medium px-3 py-1 rounded-full 
                                                @if($subscription->status === 'active') bg-green-100 text-green-800
                                                @elseif($subscription->status === 'paused') bg-yellow-100 text-yellow-800
                                                @else bg-red-100 text-red-800
                                                @endif">
                                                {{ ucfirst($subscription->status) }}
                                            </span>
                                        </div>
                                        <div class="bg-gray-200 rounded-full h-2 mb-3">
                                            <div class="bg-blue-500 h-2 rounded-full" style="width: {{ $subscription->metadata['progress'] ?? 65 }}%"></div>
                                        </div>
                                        <div class="flex items-center justify-between text-sm">
                                            <span class="text-gray-600">{{ __('Progress: ') }}{{ $subscription->metadata['progress'] ?? 65 }}%</span>
                                            <a href="#" class="text-blue-500 hover:text-blue-700 font-medium">{{ __('Continue Learning') }}</a>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <div class="text-center py-8">
                                <p class="text-gray-600 mb-4">{{ __('No courses enrolled yet.') }}</p>
                                <a href="#" class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                                    {{ __('Explore Courses') }}
                                </a>
                            </div>
                        @endif
                    </div>
                </div>

                <!-- Quick Actions & Info -->
                <div class="space-y-6">
                    <!-- Quick Actions -->
                    <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900">{{ __('Quick Actions') }}</h3>
                        </div>
                        <div class="p-6 space-y-3">
                            <a href="#" class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center text-sm">
                                {{ __('Browse Courses') }}
                            </a>
                            <a href="#" class="block w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center text-sm">
                                {{ __('My Certificates') }}
                            </a>
                            <a href="#" class="block w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center text-sm">
                                {{ __('Support') }}
                            </a>
                        </div>
                    </div>

                    <!-- Subscription Status -->
                    <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900">{{ __('Subscription') }}</h3>
                        </div>
                        <div class="p-6">
                            @php
                                $subscription = auth()->user()->subscriptions()->first();
                            @endphp
                            @if($subscription)
                                <div class="space-y-3">
                                    <div>
                                        <p class="text-sm text-gray-600">{{ __('Status') }}</p>
                                        <p class="font-semibold text-green-600">{{ __('Active') }}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-600">{{ __('Renewal Date') }}</p>
                                        <p class="font-semibold text-gray-900">{{ $subscription->ends_at?->format('M d, Y') ?? 'Lifetime' }}</p>
                                    </div>
                                    <button class="w-full mt-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200">
                                        {{ __('Manage Subscription') }}
                                    </button>
                                </div>
                            @else
                                <div class="text-center">
                                    <p class="text-gray-600 mb-4">{{ __('No active subscription') }}</p>
                                    <button class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                                        {{ __('Subscribe Now') }}
                                    </button>
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Payments & Notifications -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Recent Payments -->
                <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">{{ __('Recent Payments') }}</h3>
                    </div>
                    <div class="p-6">
                        @forelse(auth()->user()->payments()->latest()->limit(5)->get() as $payment)
                            <div class="flex items-center justify-between border-b pb-3 mb-3 last:border-b-0 last:mb-0">
                                <div>
                                    <p class="font-medium text-gray-900">{{ $payment->description ?? 'Course Payment' }}</p>
                                    <p class="text-xs text-gray-500">{{ $payment->created_at->format('M d, Y') }}</p>
                                </div>
                                <div class="text-right">
                                    <p class="font-semibold text-gray-900">${{ number_format($payment->amount / 100, 2) }}</p>
                                    <span class="text-xs font-medium 
                                        @if($payment->status === 'completed') text-green-600
                                        @elseif($payment->status === 'pending') text-yellow-600
                                        @else text-red-600
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

                <!-- Recent Notifications -->
                <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">{{ __('Notifications') }}</h3>
                    </div>
                    <div class="p-6">
                        @forelse(auth()->user()->notifications()->latest()->limit(5)->get() as $notification)
                            <div class="border-b pb-3 mb-3 last:border-b-0 last:mb-0">
                                <p class="font-medium text-black text-sm">{{ $notification->data['title'] ?? 'Notification' }}</p>
                                <p class="text-xs text-black mt-1">{{ $notification->data['message'] ?? '' }}</p>
                                <p class="text-xs text-black mt-2">{{ $notification->created_at->diffForHumans() }}</p>
                            </div>
                        @empty
                            <p class="text-center text-black">{{ __('No notifications') }}</p>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
