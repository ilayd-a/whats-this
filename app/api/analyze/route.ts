import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ANALYSIS_JSON_SCHEMA, SYSTEM_PROMPT } from "@/lib/schema";
import type { AnalysisResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
]);

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return jsonError("Could not read the uploaded file.", 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return jsonError("No file was uploaded.", 400);
  }

  if (file.size === 0) {
    return jsonError("That file looks empty. Try a different one.", 400);
  }

  if (file.size > MAX_FILE_BYTES) {
    return jsonError("That file is larger than 10 MB. Try a smaller one.", 400);
  }

  const fileType = file.type || "";
  if (!ACCEPTED_TYPES.has(fileType)) {
    return jsonError(
      "Unsupported file type. Please upload a PDF, PNG, or JPG.",
      400
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return jsonError(
      "The server is missing an OPENAI_API_KEY. Add one to .env.local and restart the app.",
      500
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUrl = `data:${fileType};base64,${base64}`;

  const isPdf = fileType === "application/pdf";

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Explain this document following your instructions. Here is the document:",
            },
            isPdf
              ? {
                  type: "input_file",
                  filename: file.name || "document.pdf",
                  file_data: dataUrl,
                }
              : {
                  type: "input_image",
                  image_url: dataUrl,
                  detail: "high",
                },
          ],
        },
      ],
      text: {
        format: ANALYSIS_JSON_SCHEMA,
      },
    });

    const outputText = response.output_text;
    if (!outputText) {
      return jsonError(
        "The AI didn't return a readable explanation. Please try again.",
        502
      );
    }

    const parsed = JSON.parse(outputText) as AnalysisResult;
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Analysis failed:", err);
    return jsonError(
      "Something went wrong while analyzing your document. Please try again.",
      502
    );
  }
}
