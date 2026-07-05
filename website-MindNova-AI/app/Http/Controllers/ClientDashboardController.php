<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\View\View;

class ClientDashboardController extends Controller
{
    public function __invoke(): View
    {
        $user = auth()->user();

        $subscriptions = $user->subscriptions()->latest()->limit(5)->get();
        $recentPayments = $user->payments()->latest()->limit(5)->get();
        $notifications = $user->notifications()->latest()->limit(5)->get();
        $activeSubscription = $user->subscriptions()->where('status', 'active')->first();

        return view('client.dashboard', [
            'enrolledCourses' => $subscriptions->count(),
            'totalSpent' => $recentPayments->where('status', 'completed')->sum('amount'),
            'subscriptions' => $subscriptions,
            'recentPayments' => $recentPayments,
            'notifications' => $notifications,
            'activeSubscription' => $activeSubscription,
        ]);
    }
}
