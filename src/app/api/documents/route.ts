import { NextResponse } from "next/server";
import { extractDocxText, parseDocxTextToQuestions } from "@/lib/docx-parser";
import { FieldValue, getFirestoreDb } from "@/lib/firebase-admin";

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

    const db = getFirestoreDb();
    const batch = db.batch();
    const collection = db.collection("questions");
    const createdAt = FieldValue.serverTimestamp();
    const ids: string[] = [];

    parsedQuestions.forEach((question) => {
      const docRef = collection.doc();
      ids.push(docRef.id);
      batch.set(docRef, {
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer ?? null,
        category: "Imported",
        difficulty: "Medium",
        status: question.correctAnswer ? "ready" : "needs-review",
        source: "docx",
        createdAt,
      });
    });

    await batch.commit();

    return NextResponse.json({ count: parsedQuestions.length, ids });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
