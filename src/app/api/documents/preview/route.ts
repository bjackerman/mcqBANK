import { NextResponse } from "next/server";
import { extractDocxText, parseDocxTextToQuestionsWithDiagnostics } from "@/lib/docx-parser";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".docx")) {
      return NextResponse.json({ error: "Only .docx files are supported." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rawText = extractDocxText(buffer);

    if (!rawText.trim()) {
      return NextResponse.json({ error: "Unable to extract text from the document." }, { status: 422 });
    }

    const diagnostics = parseDocxTextToQuestionsWithDiagnostics(rawText);

    return NextResponse.json({
      extractedText: rawText,
      questions: diagnostics.questions,
      issues: diagnostics.issues,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
