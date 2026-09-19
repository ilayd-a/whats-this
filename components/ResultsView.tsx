"use client";

import {
  FileCheck2,
  ListChecks,
  DollarSign,
  CalendarClock,
  TriangleAlert,
  ClipboardList,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

interface ResultsViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultsView({ result, onReset }: ResultsViewProps) {
  const showMoney = result.money?.hasPayment;
  const showDeadline = result.deadline?.hasDeadline;
  const showWarnings = result.warnings && result.warnings.length > 0;
  const showConfidenceNote = Boolean(result.confidenceNote);

  return (
    <div className="animate-fade-in w-full space-y-5">
      {/* Header / summary */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-blue">
          <FileCheck2 className="h-3.5 w-3.5" />
          {result.documentType}
        </div>
        <p className="mt-4 text-xl font-semibold leading-relaxed text-foreground sm:text-2xl">
          {result.summary}
        </p>
      </div>

      {/* Money + Deadline side by side when both present */}
      {(showMoney || showDeadline) && (
        <div className="grid gap-5 sm:grid-cols-2">
          {showMoney && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                <DollarSign className="h-4 w-4 text-accent-blue" />
                Money
              </div>
              <p className="mt-3 text-4xl font-bold tracking-tight text-foreground">
                {result.money?.amount ?? "—"}
              </p>
              {result.money?.description && (
                <p className="mt-2 text-sm text-muted">{result.money.description}</p>
              )}
            </div>
          )}

          {showDeadline && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                <CalendarClock className="h-4 w-4 text-accent-purple" />
                Deadline
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {result.deadline?.date ?? "—"}
              </p>
              {result.deadline?.description && (
                <p className="mt-2 text-sm text-muted">{result.deadline.description}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* What matters */}
      {result.importantItems && result.importantItems.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ListChecks className="h-4 w-4 text-accent-blue" />
            What matters
          </div>
          <dl className="mt-4 divide-y divide-border">
            {result.importantItems.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <dt className="text-sm text-muted">{item.label}</dt>
                <dd className="text-sm font-semibold text-foreground sm:text-right">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Watch out */}
      {showWarnings && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
            <TriangleAlert className="h-4 w-4" />
            Watch out
          </div>
          <ul className="mt-4 space-y-2">
            {result.warnings.map((warning, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-900">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What to do next */}
      {result.nextSteps && result.nextSteps.length > 0 && (
        <div className="rounded-3xl border border-border bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ClipboardList className="h-4 w-4 text-accent-purple" />
            What to do next
          </div>
          <ol className="mt-4 space-y-3">
            {result.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="gradient-ring mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Ambiguity note */}
      {showConfidenceNote && (
        <div className="flex items-start gap-3 rounded-3xl border border-border bg-card px-6 py-4 text-sm text-muted shadow-sm">
          <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted" />
          {result.confidenceNote}
        </div>
      )}

      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent-blue/40 hover:text-accent-blue"
        >
          <RotateCcw className="h-4 w-4" />
          Start over
        </button>
      </div>
    </div>
  );
}
