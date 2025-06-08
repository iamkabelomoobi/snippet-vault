import { SnippetDetail } from '@/components/snippet-detail';
import { Header } from '@/components/header';

interface SnippetPageProps {
  params: {
    id: string;
  };
}

// Fix: The param must be a string, not a number or object, and must match the dynamic route exactly.
// Also, Next.js expects params as { id: string } (not { params: { id: string } }) in generateStaticParams.
export async function generateStaticParams() {
  // Make sure to return the correct structure for static params
  return [
    { id: 'cmbnact3t00023g1rlol0ka7q' }
  ];
}

export default function SnippetPage({ params }: SnippetPageProps) {
  // Defensive: fallback if params.id is missing
  if (!params?.id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-red-500">Snippet ID is missing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <SnippetDetail id={params.id} />
      </div>
    </div>
  );
}