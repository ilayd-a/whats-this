"use client";

import { useCallback, useState } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";
import UploadZone from "@/components/UploadZone";
import FilePreviewCard from "@/components/FilePreviewCard";
import LoadingView from "@/components/LoadingView";
import ResultsView from "@/components/ResultsView";
import ErrorBanner from "@/components/ErrorBanner";
import { SAMPLE_RESULT } from "@/lib/sample-result";
import type { AnalysisResult } from "@/lib/types";

type Stage = "idle" | "preview" | "loading" | "results" | "error";

export default function Home() {
  const [stage, setStage] = useState<Stage>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const reset = useCallback(() => {
    setStage("idle");
    setFile(null);
    setResult(null);
    setErrorMessage("");
  }, []);

  const handleFileSelected = useCallback((selected: File) => {
    setFile(selected);
    setResult(null);
    setStage("preview");
  }, []);

  const handleInvalidFile = useCallback((message: string) => {
    setErrorMessage(message);
    setStage("error");
  }, []);

  const handleTryDemo = useCallback(() => {
    setStage("loading");
    setFile(null);
    window.setTimeout(() => {
      setResult(SAMPLE_RESULT);
      setStage("results");
    }, 1600);
  }, []);

  const handleExplain = useCallback(async () => {
    if (!file) return;
    setStage("loading");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStage("error");
        return;
      }
      setResult(data as AnalysisResult);
      setStage("results");
    } catch {
      setErrorMessage(
        "Couldn't reach the server. Check your connection and try again."
      );
      setStage("error");
    }
  }, [file]);

  const showHero = stage === "idle";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="w-full">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
          <button
            onClick={reset}
            className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground"
          >
            <span className="gradient-ring flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            What&apos;s This?
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-6 pb-16">
        {showHero && (
          <div className="animate-fade-in mb-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              <span className="gradient-text">What&apos;s This?</span>
            </h1>
            <p className="mt-4 text-xl font-semibold text-foreground sm:text-2xl">
              Turn confusing documents into clear answers.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted">
              Upload a bill, notice, form, statement, screenshot, or document
              and instantly understand what matters.
            </p>
          </div>
        )}

        <div className="w-full">
          {stage === "idle" && (
            <UploadZone
              onFileSelected={handleFileSelected}
              onTryDemo={handleTryDemo}
              onInvalidFile={handleInvalidFile}
            />
          )}

          {stage === "preview" && file && (
            <FilePreviewCard
              file={file}
              onRemove={reset}
              onExplain={handleExplain}
            />
          )}

          {stage === "loading" && <LoadingView />}

          {stage === "results" && result && (
            <ResultsView result={result} onReset={reset} />
          )}

          {stage === "error" && (
            <ErrorBanner message={errorMessage} onRetry={reset} />
          )}
        </div>

        <p className="mt-8 flex items-center gap-1.5 text-center text-xs text-muted">
          <ShieldCheck className="h-3.5 w-3.5" />
          Your file is analyzed only to generate this explanation.
        </p>
      </main>

      <footer className="w-full py-6 text-center text-xs text-muted">
        Built for HackMIT 2026
      </footer>
    </div>
  );
}
