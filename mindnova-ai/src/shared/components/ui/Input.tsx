import React, {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useId,
} from "react";

// Định nghĩa Props mở rộng từ InputHTMLAttributes mặc định của HTML
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = "",
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Tạo ID tự động nếu parent không truyền vào, rất quan trọng cho Accessibility (A11y)
    const uniqueId = useId();
    const inputId = id || uniqueId;

    // Tách biệt các class CSS để dễ quản lý (Tailwind CSS)
    const baseInputClasses =
      "w-full rounded-md border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

    const stateClasses = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900 placeholder-red-300"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900 placeholder-gray-400";

    const paddingClasses = `py-2 ${leftIcon ? "pl-10" : "pl-3"} ${rightIcon ? "pr-10" : "pr-3"}`;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Core Input */}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            className={`${baseInputClasses} ${stateClasses} ${paddingClasses} ${className}`}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error & Helper Messages */}
        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-red-500 mt-0.5">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-sm text-gray-500 mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

// Khai báo displayName giúp debug dễ dàng hơn trong React DevTools
Input.displayName = "Input";

export default Input;
