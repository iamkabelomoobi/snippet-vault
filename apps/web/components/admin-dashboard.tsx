'use client';

import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Check, X, Eye } from 'lucide-react';
import Link from 'next/link';

const ALL_SNIPPETS_QUERY = gql`
  query AllSnippets {
    allSnippets {
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

const PENDING_SNIPPETS_QUERY = gql`
  query PendingSnippets {
    pendingSnippets {
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

const APPROVE_SNIPPET_MUTATION = gql`
  mutation ApproveSnippet($id: String!) {
    approveSnippet(id: $id) {
      id
      status
    }
  }
`;

const REJECT_SNIPPET_MUTATION = gql`
  mutation RejectSnippet($id: String!) {
    rejectSnippet(id: $id) {
      id
      status
    }
  }
`;

export function AdminDashboard() {
  const { user } = useAuth();
  const { loading: allLoading, data: allData, refetch: refetchAll } = useQuery(ALL_SNIPPETS_QUERY);
  const { loading: pendingLoading, data: pendingData, refetch: refetchPending } = useQuery(PENDING_SNIPPETS_QUERY);
  
  const [approveSnippet] = useMutation(APPROVE_SNIPPET_MUTATION);
  const [rejectSnippet] = useMutation(REJECT_SNIPPET_MUTATION);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const handleApprove = async (id: string) => {
    try {
      await approveSnippet({ variables: { id } });
      toast.success('Snippet approved successfully');
      refetchAll();
      refetchPending();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve snippet');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectSnippet({ variables: { id } });
      toast.success('Snippet rejected');
      refetchAll();
      refetchPending();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject snippet');
    }
  };

  const SnippetActions = ({ snippet }: { snippet: any }) => (
    <div className="flex items-center space-x-2">
      <Button asChild variant="outline" size="sm">
        <Link href={`/snippets/${snippet.id}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      {snippet.status === 'PENDING' && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleApprove(snippet.id)}
            className="text-green-600 hover:text-green-700"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReject(snippet.id)}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );

  const SnippetList = ({ snippets, loading }: { snippets: any[], loading: boolean }) => {
    if (loading) {
      return <div className="text-center py-4">Loading...</div>;
    }

    if (snippets.length === 0) {
      return <div className="text-center py-4 text-muted-foreground">No snippets found</div>;
    }

    return (
      <div className="space-y-4">
        {snippets.map((snippet) => (
          <Card key={snippet.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{snippet.title}</h3>
                    <Badge variant="secondary">{snippet.language}</Badge>
                    <Badge
                      variant={
                        snippet.status === 'APPROVED'
                          ? 'default'
                          : snippet.status === 'PENDING'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {snippet.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {snippet.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>By {snippet.author.email}</span>
                  </div>
                </div>
                <SnippetActions snippet={snippet} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const allSnippets = allData?.allSnippets || [];
  const pendingSnippets = pendingData?.pendingSnippets || [];
  const approvedSnippets = allSnippets.filter((s: any) => s.status === 'APPROVED');
  const rejectedSnippets = allSnippets.filter((s: any) => s.status === 'REJECTED');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Snippets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allSnippets.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingSnippets.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedSnippets.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedSnippets.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="all">All Snippets</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <SnippetList snippets={pendingSnippets} loading={pendingLoading} />
        </TabsContent>
        
        <TabsContent value="all">
          <SnippetList snippets={allSnippets} loading={allLoading} />
        </TabsContent>
        
        <TabsContent value="approved">
          <SnippetList snippets={approvedSnippets} loading={allLoading} />
        </TabsContent>
        
        <TabsContent value="rejected">
          <SnippetList snippets={rejectedSnippets} loading={allLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}