<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiModerationFlag;
use App\Models\SupportTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModerationSupportController extends Controller
{
    public function flags(Request $request): JsonResponse
    {
        $query = AiModerationFlag::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', (string) $request->string('status'));
        }

        return response()->json([
            'data' => $query->take(200)->get(),
        ]);
    }

    public function reviewFlag(Request $request, AiModerationFlag $flag): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:approved,rejected,pending'],
            'review_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $flag->status = $data['status'];
        $flag->review_notes = $data['review_notes'] ?? null;
        $flag->reviewed_by = $request->user()?->id;
        $flag->reviewed_at = now();
        $flag->save();

        return response()->json([
            'message' => 'Da cap nhat ket qua kiem duyet noi dung doc hai.',
            'data' => $flag,
        ]);
    }

    public function tickets(Request $request): JsonResponse
    {
        $query = SupportTicket::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', (string) $request->string('status'));
        }

        return response()->json([
            'data' => $query->take(200)->get(),
        ]);
    }

    public function createTicket(Request $request): JsonResponse
    {
        $data = $request->validate([
            'target_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'type' => ['required', 'string', 'in:system_error,grading_dispute,abuse_report,other'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
        ]);

        $ticket = SupportTicket::create([
            'reporter_id' => $request->user()?->id,
            'target_user_id' => $data['target_user_id'] ?? null,
            'type' => $data['type'],
            'title' => $data['title'],
            'description' => $data['description'],
            'status' => 'open',
        ]);

        return response()->json([
            'message' => 'Da tiep nhan khieu nai/bao loi.',
            'data' => $ticket,
        ], 201);
    }

    public function resolveTicket(Request $request, SupportTicket $ticket): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:in_progress,resolved,rejected'],
            'resolution' => ['nullable', 'string', 'max:3000'],
        ]);

        $ticket->status = $data['status'];
        $ticket->resolution = $data['resolution'] ?? null;
        $ticket->handled_by = $request->user()?->id;
        $ticket->handled_at = now();
        $ticket->save();

        return response()->json([
            'message' => 'Da cap nhat xu ly khiu nai/bao loi.',
            'data' => $ticket,
        ]);
    }
}
