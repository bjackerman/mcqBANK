"use client";

import { type ChangeEvent, useMemo, useState } from "react";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, AlertCircle } from "lucide-react";

type ParsedQuestion = {
  questionText: string;
  options: string[];
  correctAnswer?: string;
};

type ParseIssue = {
  type: "warning" | "error";
  message: string;
  line?: number;
  questionText?: string;
};

type PreviewResponse = {
  extractedText: string;
  questions: ParsedQuestion[];
  issues: ParseIssue[];
  error?: string;
};

export default function DocumentPreviewPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "error"; message?: string }>({ type: "idle" });
  const [preview, setPreview] = useState<PreviewResponse | null>(null);

  const isLoading = status.type === "loading";

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setStatus({ type: "idle" });
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || isLoading) {
      return;
    }

    setStatus({ type: "loading" });
    setPreview(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/documents/preview", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as PreviewResponse;

      if (!response.ok) {
        setStatus({ type: "error", message: data.error ?? "Preview failed. Please try again." });
        return;
      }

      setPreview(data);
      setStatus({ type: "idle" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Preview failed. Please try again.";
      setStatus({ type: "error", message });
    }
  };

  const previewRows = useMemo(() => {
    if (!preview) return [];
    return preview.questions.map((question) => ({
      questionText: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer ?? null,
      category: "Imported",
      difficulty: "Medium",
      status: question.correctAnswer ? "ready" : "needs-review",
      source: "docx",
    }));
  }, [preview]);

  return (
    <AppLayout title="Document Preview">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight font-headline">Document Preview</h2>
          <p className="text-muted-foreground">
            Upload a .docx file to preview extracted questions and any parsing issues before ingestion.
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Preview Document</CardTitle>
              <CardDescription>We will show the extracted text, parsed questions, and any errors.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="docx-preview-file">.docx file</Label>
                <Input id="docx-preview-file" type="file" accept=".docx" onChange={handleFileChange} />
              </div>
              {status.type === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Preview failed</AlertTitle>
                  <AlertDescription>{status.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleUpload} disabled={!selectedFile || isLoading}>
                <Upload className="mr-2 h-4 w-4" />
                {isLoading ? "Processing..." : "Analyze Document"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {preview && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Issues</CardTitle>
                <CardDescription>Parsing warnings and errors found in the document.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {preview.issues.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No issues detected.</p>
                ) : (
                  preview.issues.map((issue, index) => (
                    <Alert key={`${issue.type}-${index}`} variant={issue.type === "error" ? "destructive" : "default"}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="capitalize">{issue.type}</AlertTitle>
                      <AlertDescription>
                        {issue.message}
                        {issue.line ? ` (line ${issue.line})` : ""}
                        {issue.questionText ? ` — ${issue.questionText}` : ""}
                      </AlertDescription>
                    </Alert>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Extracted Text</CardTitle>
                <CardDescription>Raw text extracted from the document.</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">{preview.extractedText}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Would Insert</CardTitle>
                <CardDescription>Records that would be written to the datastore.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {previewRows.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No valid questions detected.</p>
                ) : (
                  previewRows.map((row, index) => (
                    <div key={`${row.questionText}-${index}`} className="rounded-md border p-4 text-sm">
                      <div className="font-medium">{row.questionText}</div>
                      <div className="mt-2 space-y-1">
                        <div>Options: {row.options.join(" | ")}</div>
                        <div>Correct Answer: {row.correctAnswer ?? "None"}</div>
                        <div>Status: {row.status}</div>
                        <div>
                          Category: {row.category} · Difficulty: {row.difficulty} · Source: {row.source}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
