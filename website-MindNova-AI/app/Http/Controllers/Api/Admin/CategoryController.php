<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Category::query()->latest();

        if ($request->filled('search')) {
            $keyword = trim((string) $request->string('search'));
            $query->where('name', 'like', '%' . $keyword . '%');
        }

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'parent_id' => ['nullable', 'integer', 'exists:categories,id'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        $slug = Str::slug($data['name']);
        $baseSlug = $slug;
        $suffix = 1;

        while (Category::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $suffix;
            $suffix++;
        }

        $category = Category::create([
            'name' => $data['name'],
            'slug' => $slug,
            'description' => $data['description'] ?? null,
            'parent_id' => $data['parent_id'] ?? null,
            'status' => $data['status'] ?? 'active',
        ]);

        return response()->json([
            'message' => 'Category created successfully.',
            'data' => $category,
        ], 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'parent_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
            'status' => ['sometimes', 'in:active,inactive'],
        ]);

        if (array_key_exists('name', $data)) {
            $slug = Str::slug($data['name']);
            $baseSlug = $slug;
            $suffix = 1;

            while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                $slug = $baseSlug . '-' . $suffix;
                $suffix++;
            }

            $data['slug'] = $slug;
        }

        $category->update($data);

        return response()->json([
            'message' => 'Category updated successfully.',
            'data' => $category,
        ]);
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully.',
        ]);
    }
}
