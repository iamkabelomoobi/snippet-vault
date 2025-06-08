'use client';

import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { SnippetCard } from '@/components/snippet-card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const MY_SNIPPETS_QUERY = gql`
  query MySnippets {
    mySnippets {
      id
      title
      description
      language
      status
      createdAt
      author {
        email
      }
    }
  }
`;

export function MySnippets() {
  const { loading, error, data } = useQuery(MY_SNIPPETS_QUERY);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-6">My Snippets</h1>
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
        <p className="text-muted-foreground">Failed to load your snippets. Please try again.</p>
      </div>
    );
  }

  const snippets = data?.mySnippets || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Snippets</h1>
      
      {snippets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">You haven't created any snippets yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map((snippet: any) => (
            <div key={snippet.id} className="relative">
              <SnippetCard snippet={snippet} />
              <div className="absolute top-2 left-2">
                <Badge
                  variant={
                    snippet.status === 'APPROVED'
                      ? 'default'
                      : snippet.status === 'PENDING'
                      ? 'secondary'
                      : 'destructive'
                  }
                  className="text-xs"
                >
                  {snippet.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}