import { MySnippets } from '@/components/my-snippets';
import { Header } from '@/components/header';

export default function MySnippetsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <MySnippets />
      </div>
    </div>
  );
}