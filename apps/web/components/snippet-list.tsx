"use client";

import { SnippetCard } from "@/components/snippet-card";

export function SnippetList({ snippets }: { snippets: any[] }) {
  if (!snippets || snippets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No snippets available yet. Be the first to create one!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Snippets</h2>
        <p className="text-muted-foreground">
          {snippets.length} snippet{snippets.length !== 1 ? "s" : ""} available
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {snippets.map((snippet: any) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
      </div>
    </div>
  );
}
