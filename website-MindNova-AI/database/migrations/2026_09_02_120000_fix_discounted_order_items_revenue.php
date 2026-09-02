<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $orders = DB::table('orders')
            ->where('status', 'completed')
            ->get();

        foreach ($orders as $order) {
            $items = DB::table('order_items')
                ->where('order_id', $order->id)
                ->get();

            if ($items->isEmpty()) {
                continue;
            }

            $orderTotal = (float) $order->total_amount;
            $itemsSum = (float) $items->sum('price');

            // If order was free (0 VND) but order_items had non-zero prices (e.g. Order #201)
            if ($orderTotal <= 0 && $itemsSum > 0) {
                foreach ($items as $item) {
                    DB::table('order_items')
                        ->where('id', $item->id)
                        ->update(['price' => 0.00]);

                    DB::table('teacher_payouts')
                        ->where('order_id', $order->id)
                        ->where('course_id', $item->course_id)
                        ->update([
                            'gross_amount' => 0.00,
                            'teacher_amount' => 0.00,
                            'admin_share_amount' => 0.00,
                        ]);

                    DB::table('instructor_transactions')
                        ->where('reference_type', 'App\\Models\\OrderItem')
                        ->where('reference_id', $item->id)
                        ->update(['amount' => 0.00]);
                }
            } elseif ($orderTotal > 0 && $itemsSum > $orderTotal) {
                // If order had partial discount
                $factor = $orderTotal / $itemsSum;
                foreach ($items as $item) {
                    $newPrice = round((float) $item->price * $factor, 2);
                    DB::table('order_items')
                        ->where('id', $item->id)
                        ->update(['price' => $newPrice]);

                    $teacherAmount = round($newPrice * 0.90, 2);
                    $adminAmount = round($newPrice * 0.10, 2);

                    DB::table('teacher_payouts')
                        ->where('order_id', $order->id)
                        ->where('course_id', $item->course_id)
                        ->update([
                            'gross_amount' => $newPrice,
                            'teacher_amount' => $teacherAmount,
                            'admin_share_amount' => $adminAmount,
                        ]);

                    DB::table('instructor_transactions')
                        ->where('reference_type', 'App\\Models\\OrderItem')
                        ->where('reference_id', $item->id)
                        ->update(['amount' => $teacherAmount]);
                }
            }
        }
    }

    public function down(): void
    {
        // Non-reversible backfill
    }
};
