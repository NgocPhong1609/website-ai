<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $categories = Category::query()
            ->where(function ($query) {
                $query->where('status', 'active')->orWhereNull('status');
            })
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return $this->successResponse($categories);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $name = trim($data['name']);

        $existing = Category::query()
            ->whereRaw('LOWER(name) = ?', [mb_strtolower($name)])
            ->first();

        if ($existing) {
            return $this->successResponse([
                'id' => $existing->id,
                'name' => $existing->name,
                'slug' => $existing->slug,
                'status' => $existing->status ?? 'active',
            ], $existing->status === 'active'
                ? 'Danh mục đã tồn tại.'
                : 'Danh mục đang chờ admin duyệt.');
        }

        $base = Str::slug($name) ?: 'danh-muc';
        $slug = $base;
        $i = 1;
        while (Category::query()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        $category = Category::create([
            'name' => $name,
            'slug' => $slug,
            'description' => $data['description'] ?? 'Đề xuất bởi giáo viên',
            'status' => 'pending',
            'requested_by' => $request->user()->id,
        ]);

        return $this->createdResponse([
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'status' => $category->status,
        ], 'Đã gửi danh mục cho admin duyệt.');
    }
}
