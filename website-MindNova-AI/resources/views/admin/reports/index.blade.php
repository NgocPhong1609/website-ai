<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Reports') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <p class="text-sm text-gray-500">{{ __('Monthly Revenue') }}</p>
                    <p class="mt-2 text-2xl font-bold text-gray-900">${{ number_format(\App\Models\Payment::where('status', 'completed')->sum('amount'), 2) }}</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <p class="text-sm text-gray-500">{{ __('New Users') }}</p>
                    <p class="mt-2 text-2xl font-bold text-gray-900">{{ \App\Models\User::whereDate('created_at', today())->count() }}</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <p class="text-sm text-gray-500">{{ __('Active Subscriptions') }}</p>
                    <p class="mt-2 text-2xl font-bold text-gray-900">{{ \App\Models\Subscription::where('status', 'active')->count() }}</p>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
