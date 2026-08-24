<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\HistoryOverviewResource;
use App\Services\Student\HistoryService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly HistoryService $historyService)
    {
    }

    /**
      * Display chronological student activity timeline and achievements for Learning History page.
      */
     public function overview(Request $request): JsonResponse
     {
         $user = $request->user('sanctum') ?? $request->user();
         $page = (int) $request->query('page', 1);
         $perPage = (int) $request->query('per_page', 10);
 
         $historyData = $this->historyService->getHistory($user, $page, $perPage);
 
         return $this->successResponse(
             new HistoryOverviewResource($historyData),
             'Student learning history retrieved successfully.'
         );
     }
}
