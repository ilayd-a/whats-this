// JSON Schema for OpenAI Structured Outputs (strict mode).
// Every property must be listed in "required" under strict mode; optional
// values are expressed as nullable types instead of omitting the key.
export const ANALYSIS_JSON_SCHEMA = {
  type: "json_schema" as const,
  name: "document_explanation",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      documentType: {
        type: "string",
        description: "Short human-readable description of what this document is.",
      },
      summary: {
        type: "string",
        description: "2-3 sentence explanation in extremely clear, plain language.",
      },
      importantItems: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            label: { type: "string" },
            value: { type: "string" },
          },
          required: ["label", "value"],
        },
      },
      money: {
        type: ["object", "null"],
        additionalProperties: false,
        properties: {
          hasPayment: { type: "boolean" },
          amount: { type: ["string", "null"] },
          description: { type: ["string", "null"] },
        },
        required: ["hasPayment", "amount", "description"],
      },
      deadline: {
        type: ["object", "null"],
        additionalProperties: false,
        properties: {
          hasDeadline: { type: "boolean" },
          date: { type: ["string", "null"] },
          description: { type: ["string", "null"] },
        },
        required: ["hasDeadline", "date", "description"],
      },
      warnings: {
        type: "array",
        items: { type: "string" },
        description: "Anything unusual, potentially concerning, or easy to miss.",
      },
      nextSteps: {
        type: "array",
        items: { type: "string" },
        description: "Concrete actions the user should take, in order.",
      },
      confidenceNote: {
        type: ["string", "null"],
        description: "Brief note only if something in the document is ambiguous.",
      },
    },
    required: [
      "documentType",
      "summary",
      "importantItems",
      "money",
      "deadline",
      "warnings",
      "nextSteps",
      "confidenceNote",
    ],
  },
} as const;

export const SYSTEM_PROMPT = `You explain confusing documents to normal people. Use simple, direct language. Do not use jargon unless you explain it. Focus on practical consequences. Never invent information that is not visible in the document. If something is unclear, say that it is unclear. Separate facts from interpretation. Prioritize amounts owed, deadlines, required actions, penalties, unusual charges, important dates, and anything the user could easily miss.

Analyze ONLY what is present in the uploaded document. Do not invent facts. Respond with the structured JSON fields you are given. If a field does not apply (e.g. there is no payment due), set hasPayment/hasDeadline to false and leave the related string fields null. Leave arrays empty when there is nothing relevant to include.`;
