export interface ImportantItem {
  label: string;
  value: string;
}

export interface MoneyInfo {
  hasPayment: boolean;
  amount: string | null;
  description: string | null;
}

export interface DeadlineInfo {
  hasDeadline: boolean;
  date: string | null;
  description: string | null;
}

export interface AnalysisResult {
  documentType: string;
  summary: string;
  importantItems: ImportantItem[];
  money: MoneyInfo | null;
  deadline: DeadlineInfo | null;
  warnings: string[];
  nextSteps: string[];
  confidenceNote: string | null;
}
