"use client";

export type GatewayId = "vnpay" | "momo";

export const GATEWAY_METHODS: Array<{
  id: GatewayId;
  name: string;
  description: string;
  detail: string;
  status: string;
}> = [
  {
    id: "vnpay",
    name: "VNPAY",
    description: "Thanh toán an toàn qua VNPAY",
    detail: "Bạn chọn ngân hàng và nhập thông tin trên cổng VNPAY. Website không lưu số thẻ hay số tài khoản.",
    status: "Sẵn sàng",
  },
  {
    id: "momo",
    name: "MoMo",
    description: "Thanh toán nhanh qua ví MoMo",
    detail: "Quét QR hoặc xác nhận trên ví MoMo. Website không lưu thông tin ví hay ngân hàng.",
    status: "Sẵn sàng",
  },
];

function VnpayMark() {
  return (
    <div className="w-12 h-12 rounded-xl bg-[#005BAF] text-white flex items-center justify-center shrink-0 shadow-sm" aria-hidden>
      <span className="text-[10px] font-black tracking-tight">VNPAY</span>
    </div>
  );
}

function MomoMark() {
  return (
    <div className="w-12 h-12 rounded-xl bg-[#A50064] text-white flex items-center justify-center shrink-0 shadow-sm" aria-hidden>
      <span className="text-xs font-black">MoMo</span>
    </div>
  );
}

export function GatewayPaymentMethods({
  value,
  onChange,
  name = "paymentGateway",
}: {
  value: GatewayId;
  onChange: (id: GatewayId) => void;
  name?: string;
}) {
  return (
    <div className="space-y-3">
      {GATEWAY_METHODS.map((method) => {
        const selected = value === method.id;
        return (
          <label
            key={method.id}
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
              selected
                ? "border-[#3B82F6] bg-[#F8FAFC] ring-1 ring-[#3B82F6]/30"
                : "border-[#E2E8F0] hover:bg-[#F8FAFC]"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={method.id}
              checked={selected}
              onChange={() => onChange(method.id)}
              className="mt-1 w-4 h-4 text-[#3B82F6]"
            />
            {method.id === "vnpay" ? <VnpayMark /> : <MomoMark />}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-sm text-[#0F172A]">{method.name}</p>
                <span className="text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#059669]/20">
                  {method.status}
                </span>
              </div>
              <p className="text-sm text-[#0F172A] mt-0.5">{method.description}</p>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{method.detail}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
