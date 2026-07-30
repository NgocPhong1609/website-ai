export type OrderStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface ICheckoutOrder {
  orderId: string;
  courseId: number;
  courseTitle: string;
  amount: number; // in VND
  status: OrderStatus;
  idempotencyKey: string;
  checksum: string;
  createdAt: string;
  paidAt?: string;
  invoiceUrl?: string;
}

export interface ICouponValidationResult {
  isValid: boolean;
  code: string;
  discountPercent: number;
  discountAmount: number;
  finalAmount: number;
  errorMessage?: string;
  isLocked: boolean; // Simulated DB lock on coupon during transaction
}

export type RefundRequestStatus = "AUTO_APPROVED" | "MANUAL_REVIEW" | "REJECTED" | "PENDING_SUBMISSION";

export interface IRefundRequestPayload {
  orderId: string;
  courseId: number;
  reason: string;
  daysSincePurchase: number;
  learningProgressPercent: number;
}

export interface IRefundRequestResult {
  orderId: string;
  status: RefundRequestStatus;
  message: string;
  processedAt: string;
  amountRefunded: number;
}
