import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DocumentsPage() {
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
                    <CardDescription>Select a .docx file containing questions and answers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="docx-file">.docx file</Label>
                        <Input id="docx-file" type="file" accept=".docx" />
                    </div>
                     <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Note</AlertTitle>
                        <AlertDescription>
                            This is a demonstration UI. The backend for parsing .docx files and storing them in the database is not implemented in this version.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" disabled>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload and Process
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
