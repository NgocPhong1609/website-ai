import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge"; // Thư viện giải quyết xung đột class Tailwind

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "unstyled"; // Thêm unstyled để tùy biến tự do 100% từ bên ngoài

export type ButtonSize = "sm" | "md" | "lg" | "unstyled";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * MAPPING STYLES VỚI TAILWIND CSS
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500",
  secondary:
    "bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 focus:ring-gray-500",
  outline:
    "border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-blue-500",
  ghost:
    "text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500",
  unstyled: "", // Không có màu mặc định, toàn quyền cho className quyết định
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded",
  md: "px-4 py-2 text-sm rounded-md",
  lg: "px-5 py-2.5 text-base rounded-lg",
  unstyled: "", // Không có padding/radius mặc định
};

// Các class cốt lõi cho mọi button (flexbox, căn giữa, hiệu ứng mượt)
const baseClassName =
  "inline-flex items-center justify-center font-medium transition-all duration-200 " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2 " +
  "disabled:opacity-50 disabled:pointer-events-none";

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    children,
    className = "",
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled,
    leftIcon,
    rightIcon,
    type = "button",
    ...rest
  } = props;

  // twMerge sẽ ưu tiên các class nằm ở `className` (bên ngoài truyền vào)
  // và tự động loại bỏ các class bị trùng lặp ở `variantStyles` hay `sizeStyles`.
  const combinedClasses = twMerge(
    baseClassName,
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  return (
    <button
      ref={ref}
      type={type}
      className={combinedClasses}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {/* Spinner SVG chuẩn của Tailwind khi Loading */}
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Left Icon */}
      {leftIcon && !isLoading && (
        <span className="mr-2 inline-flex items-center">{leftIcon}</span>
      )}

      {/* Text nội dung */}
      <span className="flex items-center justify-center">{children}</span>

      {/* Right Icon */}
      {rightIcon && (
        <span className="ml-2 inline-flex items-center">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
