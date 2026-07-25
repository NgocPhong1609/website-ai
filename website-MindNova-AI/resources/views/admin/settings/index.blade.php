<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Settings') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm rounded-lg p-6 space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700">{{ __('Site Name') }}</label>
                    <input type="text" value="MindNova AI" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">{{ __('Support Email') }}</label>
                    <input type="email" value="support@example.com" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                </div>
                <div class="flex justify-end">
                    <button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500">{{ __('Save Settings') }}</button>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
