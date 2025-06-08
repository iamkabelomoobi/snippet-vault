'use client';

import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { SnippetCard } from '@/components/snippet-card';
import { Skeleton } from '@/components/ui/skeleton';

const SNIPPETS_QUERY = gql`
  query Snippets {
    snippets {
      id
      title
      description
      language
      createdAt
      author {
        email
      }
    }
  }
`;

export function SnippetList() {
  const { loading, error, data } = useQuery(SNIPPETS_QUERY);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Recent Snippets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load snippets. Please try again.</p>
      </div>
    );
  }

  const snippets = data?.snippets || [];

  if (snippets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No snippets available yet. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recent Snippets</h2>
        <p className="text-muted-foreground">{snippets.length} snippet{snippets.length !== 1 ? 's' : ''} available</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {snippets.map((snippet: any) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
      </div>
    </div>
  );
}