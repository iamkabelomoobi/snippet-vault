import { SnippetList } from '@/components/snippet-list';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <SnippetList />
      </main>
    </div>
  );
}