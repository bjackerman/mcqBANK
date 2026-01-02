import { NextResponse } from "next/server";
import { extractDocxText, parseDocxTextToQuestions } from "@/lib/docx-parser";
import { insertQuestions } from "@/lib/datastore/questions";
import type { NewQuestionInput } from "@/lib/datastore/types";

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

    const parsedQuestions = parseDocxTextToQuestions(rawText);

    if (parsedQuestions.length === 0) {
      return NextResponse.json(
        { error: "No questions were detected. Check the document formatting." },
        { status: 422 },
      );
    }

    const inputs: NewQuestionInput[] = parsedQuestions.map((question) => ({
      questionText: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer ?? null,
      category: "Imported",
      difficulty: "Medium",
      status: question.correctAnswer ? "ready" : "needs-review",
      source: "docx",
    }));

    const { count, ids } = await insertQuestions(inputs);

    return NextResponse.json({ count, ids });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
