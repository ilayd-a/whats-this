"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, Sparkles, Zap, Receipt, Mail, Landmark, FileWarning } from "lucide-react";

const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const EXAMPLE_CHIPS = [
  { label: "Utility bill", icon: Receipt },
  { label: "University email", icon: Mail },
  { label: "Bank statement", icon: Landmark },
  { label: "Government notice", icon: FileWarning },
];

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  onTryDemo: () => void;
  onInvalidFile: (message: string) => void;
}

export default function UploadZone({
  onFileSelected,
  onTryDemo,
  onInvalidFile,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (file: File | undefined | null) => {
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        onInvalidFile("Unsupported file type. Please upload a PDF, PNG, or JPG.");
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        onInvalidFile("That file is larger than 10 MB. Try a smaller one.");
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected, onInvalidFile]
  );

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          validateAndSelect(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`group relative w-full cursor-pointer rounded-3xl border-2 border-dashed px-6 py-14 sm:py-16 text-center transition-all duration-200 ${
          isDragging
            ? "border-accent-blue bg-accent-blue/5 scale-[1.01]"
            : "border-border bg-card hover:border-accent-blue/50 hover:bg-accent-blue/[0.03]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
          className="hidden"
          onChange={(e) => validateAndSelect(e.target.files?.[0])}
        />

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl gradient-ring shadow-lg shadow-accent-blue/20 transition-transform duration-200 group-hover:scale-105">
          <UploadCloud className="h-8 w-8 text-white" strokeWidth={2} />
        </div>

        <p className="text-lg font-semibold text-foreground">
          Drag &amp; drop your document here
        </p>
        <p className="mt-1 text-sm text-muted">
          or click to browse — PDF, PNG, or JPG, up to 10 MB
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTryDemo();
          }}
          className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent-purple/40 hover:text-accent-purple"
        >
          <Sparkles className="h-4 w-4" />
          Try a demo — no upload needed
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted">
          <Zap className="h-3.5 w-3.5" />
          Works great with
        </span>
        {EXAMPLE_CHIPS.map(({ label, icon: Icon }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted"
          >
            <Icon className="h-3.5 w-3.5 text-accent-blue" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
