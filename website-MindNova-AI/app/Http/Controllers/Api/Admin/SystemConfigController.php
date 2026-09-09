<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAiConfigRequest;
use App\Settings\AiSettingsRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemConfigController extends Controller
{
    public function __construct(private readonly AiSettingsRepository $settings) {}

    public function show(Request $request): JsonResponse
    {
        $period = $request->query('period') === '30d' ? '30d' : '7d';

        return response()->json([
            'providers' => $this->settings->providerReadiness(),
            'usage' => [
                'period' => $period,
                'available' => false,
            ],
            'packages' => $this->settings->packages(),
            'prompts' => $this->settings->prompts(),
            'updated_at' => $this->settings->updatedAt(),
        ]);
    }

    public function update(UpdateAiConfigRequest $request): JsonResponse
    {
        $this->settings->saveWritable($request->validated());

        return response()->json([
            'message' => 'Cap nhat cau hinh AI va he thong thanh cong.',
        ]);
    }
}
