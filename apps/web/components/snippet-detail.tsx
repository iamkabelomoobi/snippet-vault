"use client";

import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/code-block";
import { Download, User, Calendar } from "lucide-react";
import { formatDistanceToNow, isValid } from "date-fns";

const SNIPPET_QUERY = gql`
  query Snippet($id: String!) {
    snippet(id: $id) {
      id
      title
      description
      language
      code
      fileName
      filePath
      createdAt
      author {
        email
      }
    }
  }
`;

interface SnippetDetailProps {
  id: string;
}

export function SnippetDetail({ id }: SnippetDetailProps) {
  const { loading, error, data } = useQuery(SNIPPET_QUERY, {
    variables: { id },
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data?.snippet) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Snippet not found or you don&#39;t have permission to view it.
        </p>
      </div>
    );
  }

  const snippet = data.snippet;

  const handleDownload = () => {
    if (snippet.filePath) {
      fetch(`http://localhost:4000/download/${snippet.filePath}`)
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = snippet.fileName || "snippet-file";
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch((err) => {
          alert("Failed to download file.");
          console.error("Download error:", err);
        });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{snippet.title}</h1>
              <p className="text-muted-foreground">{snippet.description}</p>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {snippet.language}
            </Badge>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground pt-4 border-t">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{snippet.author.email}</span>
            </div>
            {/* <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{renderCreatedAt(snippet.createdAt)}</span>
            </div> */}
            {snippet.fileName && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Download {snippet.fileName}</span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <CodeBlock code={snippet.code} language={snippet.language} />
        </CardContent>
      </Card>
    </div>
  );
}
