"use client";

import { useEffect, useState } from "react";
import { FileSearch2 } from "lucide-react";

const MESSAGES = [
  "Reading your document...",
  "Finding what matters...",
  "Checking dates and amounts...",
  "Turning legalese into English...",
];

export default function LoadingView() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="animate-fade-in flex w-full flex-col items-center justify-center rounded-3xl border border-border bg-card px-6 py-20 text-center shadow-sm">
      <div className="gradient-ring flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg shadow-accent-blue/20">
        <FileSearch2 className="h-8 w-8 animate-pulse-soft text-white" strokeWidth={2} />
      </div>
      <p className="mt-6 text-lg font-semibold text-foreground">
        {MESSAGES[index]}
      </p>
      <p className="mt-2 text-sm text-muted">This usually takes just a few seconds.</p>
    </div>
  );
}
