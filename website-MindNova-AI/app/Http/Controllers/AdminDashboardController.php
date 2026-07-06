<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\View\View;

class AdminDashboardController extends Controller
{
    public function __invoke(): View
    {
        return view('admin.dashboard', [
            'totalUsers' => User::count(),
            'totalCourses' => Course::count(),
            'totalRevenue' => Payment::where('status', 'completed')->sum('amount'),
            'activeSubscriptions' => Subscription::where('status', 'active')->count(),
            'recentUsers' => User::latest()->limit(5)->get(),
            'recentPayments' => Payment::with('user')->latest()->limit(5)->get(),
        ]);
    }
}
