"use client";

import { useEffect, useMemo } from "react";
import { FileText, Image as ImageIcon, X, Sparkles } from "lucide-react";
import { formatFileSize, fileTypeLabel } from "@/lib/format";

interface FilePreviewCardProps {
  file: File;
  onRemove: () => void;
  onExplain: () => void;
}

export default function FilePreviewCard({
  file,
  onRemove,
  onExplain,
}: FilePreviewCardProps) {
  const isImage = file.type.startsWith("image/");
  const previewUrl = useMemo(
    () => (isImage ? URL.createObjectURL(file) : null),
    [file, isImage]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="animate-fade-in w-full rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-background">
          {isImage && previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Preview of uploaded document"
              className="h-full w-full object-cover"
            />
          ) : (
            <FileText className="h-10 w-10 text-accent-blue" strokeWidth={1.5} />
          )}
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="truncate text-base font-semibold text-foreground">
            {file.name}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2 text-sm text-muted sm:justify-start">
            <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-0.5 font-medium">
              {isImage ? (
                <ImageIcon className="h-3.5 w-3.5" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
              {fileTypeLabel(file.type)}
            </span>
            <span>{formatFileSize(file.size)}</span>
          </div>

          <div className="mt-5 flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-start">
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-background hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Remove
            </button>
            <button
              type="button"
              onClick={onExplain}
              className="gradient-ring inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent-blue/25 transition-transform hover:scale-[1.02] active:scale-[0.99] sm:w-auto"
            >
              <Sparkles className="h-4 w-4" />
              Explain this
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
