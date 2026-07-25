<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpgradeSubscriptionRequest;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $subscriptions = Subscription::when($request->filled('user_id'), fn ($query) => $query->where('user_id', $request->user_id))
            ->latest()
            ->get();

        return response()->json(['data' => $subscriptions]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'plan' => ['required', 'string', 'in:free,premium'],
            'payment_id' => ['nullable', 'integer', 'exists:payments,id'],
            'started_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date'],
            'metadata' => ['nullable', 'array'],
        ]);

        $subscription = Subscription::create(array_merge($data, [
            'status' => 'active',
        ]));

        return response()->json(['message' => 'Subscription created.', 'data' => $subscription], 201);
    }

    public function upgrade(UpgradeSubscriptionRequest $request, Subscription $subscription): JsonResponse
    {
        $data = $request->validated();
        $subscription->update($data);

        return response()->json(['message' => 'Subscription upgraded.', 'data' => $subscription]);
    }

    public function cancel(Subscription $subscription): JsonResponse
    {
        $subscription->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Subscription cancelled.', 'data' => $subscription]);
    }

    public function show(Subscription $subscription): JsonResponse
    {
        return response()->json(['data' => $subscription]);
    }
}
