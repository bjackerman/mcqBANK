"use client";

import { type ChangeEvent, useState } from "react";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DocumentsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message?: string }>({
    type: "idle",
  });

  const isLoading = status.type === "loading";

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setStatus({ type: "idle" });
  };

  const handleUpload = async () => {
    if (!selectedFile || isLoading) {
      return;
    }

    setStatus({ type: "loading" });

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { count?: number; error?: string };

      if (!response.ok) {
        setStatus({ type: "error", message: data.error ?? "Upload failed. Please try again." });
        return;
      }

      setStatus({
        type: "success",
        message: `Uploaded ${data.count ?? 0} questions. Review them in your question bank.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed. Please try again.";
      setStatus({ type: "error", message });
    }
  };

  return (
    <AppLayout title="Documents">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight font-headline">Document Ingestion</h2>
          <p className="text-muted-foreground">Upload .docx files to automatically create questions.</p>
        </div>
        
        <div className="flex justify-center pt-8">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle>Upload Document</CardTitle>
                    <CardDescription>
                      Select a .docx file containing questions and answers. We will parse and save them to your
                      question bank.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="docx-file">.docx file</Label>
                        <Input id="docx-file" type="file" accept=".docx" onChange={handleFileChange} />
                    </div>
                    {status.type === "error" && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Upload failed</AlertTitle>
                        <AlertDescription>{status.message}</AlertDescription>
                      </Alert>
                    )}
                    {status.type === "success" && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Upload complete</AlertTitle>
                        <AlertDescription>{status.message}</AlertDescription>
                      </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleUpload} disabled={!selectedFile || isLoading}>
                        <Upload className="mr-2 h-4 w-4" />
                        {isLoading ? "Processing..." : "Upload and Process"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
