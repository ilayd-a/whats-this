import type { AnalysisResult } from "./types";

export const SAMPLE_RESULT: AnalysisResult = {
  documentType: "Electricity bill",
  summary:
    "This is your electricity bill for August. You owe $84.32 by September 27. Your usage was higher than last month, but there are no late fees currently applied.",
  importantItems: [
    { label: "Billing period", value: "Aug 1 – Aug 31" },
    { label: "Electricity usage", value: "412 kWh" },
    { label: "Previous month", value: "315 kWh" },
    { label: "Account status", value: "Current" },
  ],
  money: {
    hasPayment: true,
    amount: "$84.32",
    description: "Amount currently due",
  },
  deadline: {
    hasDeadline: true,
    date: "September 27, 2026",
    description: "Payment due date",
  },
  warnings: [
    "Your electricity usage increased by about 31% compared with last month.",
  ],
  nextSteps: [
    "Pay $84.32 by September 27.",
    "Review whether increased AC usage explains the higher consumption.",
    "No other action is required if the usage looks expected.",
  ],
  confidenceNote: null,
};

export const SAMPLE_FILE_META = {
  name: "electricity-bill-august.pdf",
  type: "application/pdf",
  size: 214_000,
};
