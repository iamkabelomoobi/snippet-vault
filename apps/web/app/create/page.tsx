import { CreateSnippetForm } from '@/components/create-snippet-form';
import { Header } from '@/components/header';

export default function CreateSnippet() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Snippet</h1>
          <CreateSnippetForm />
        </div>
      </div>
    </div>
  );
}