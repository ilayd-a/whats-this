"use client";

import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="animate-fade-in flex w-full flex-col items-center gap-4 rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <p className="max-w-sm text-sm font-medium text-red-800">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-700 shadow-sm transition-colors hover:bg-red-100"
      >
        <RotateCcw className="h-4 w-4" />
        Start over
      </button>
    </div>
  );
}
