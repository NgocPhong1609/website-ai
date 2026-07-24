"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/src/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

function AlertCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
  );
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log to an error reporting service in production (e.g., Sentry)
    console.error("[GlobalError]:", error);
  }, [error]);

  return (
    <div className="flex min-h-100 w-full flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[600px]">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm">
        <AlertCircleIcon />
      </div>

      <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Đã có lỗi xảy ra!
      </h2>

      <p className="mt-3 max-w-md text-sm text-gray-500">
        Hệ thống gặp sự cố không mong muốn trong quá trình xử lý dữ liệu. Vui
        lòng thử tải lại trang hoặc quay lại sau.
      </p>

      {error.digest && (
        <code className="mt-4 rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-600">
          Error ID: {error.digest}
        </code>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={reset}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Thử lại một lần nữa
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold"
        >
          Quay về Trang chủ
        </Button>
      </div>
    </div>
  );
}
