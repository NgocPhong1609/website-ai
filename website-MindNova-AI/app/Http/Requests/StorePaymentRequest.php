<?php // Request để xác thực dữ liệu tạo thanh toán

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule; // Interface rule validation
use Illuminate\Foundation\Http\FormRequest; // Lớp FormRequest của Laravel
use Illuminate\Validation\Rule; // Hỗ trợ Rule cho quy tắc đặc biệt

class StorePaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Cho phép tất cả các yêu cầu đi qua phần authorize
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['nullable', 'integer', 'exists:users,id'], // ID user hợp lệ hoặc null
            'transaction_id' => ['nullable', 'string', 'max:255', Rule::unique('payments', 'transaction_id')], // ID giao dịch phải duy nhất
            'amount' => ['required', 'numeric', 'min:0.01'], // Số tiền bắt buộc và phải lớn hơn 0
            'currency' => ['required', 'string', 'size:3'], // Mã tiền tệ 3 ký tự
            'provider' => ['nullable', 'string', 'max:100'], // Nhà cung cấp cổng thanh toán
            'status' => ['required', Rule::in(['pending', 'completed', 'failed', 'refunded'])], // Trạng thái hợp lệ
            'payment_method' => ['nullable', 'string', 'max:100'], // Phương thức thanh toán
            'description' => ['nullable', 'string', 'max:1000'], // Mô tả giao dịch
            'metadata' => ['nullable', 'array'], // Dữ liệu bổ sung phải là mảng
            'metadata.*' => ['string'], // Các phần tử metadata phải là chuỗi
            'return_url' => ['nullable', 'url'], // URL trả về hợp lệ
        ];
    }
}
