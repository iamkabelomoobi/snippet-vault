'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

const CREATE_SNIPPET_MUTATION = gql`
  mutation CreateSnippet($input: CreateSnippetInput!) {
    createSnippet(input: $input) {
      id
      title
      status
    }
  }
`;

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'HTML', 'CSS', 'SQL', 'Shell', 'Other'
];

export function CreateSnippetForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [createSnippet, { loading }] = useMutation(CREATE_SNIPPET_MUTATION);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const uploadFile = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      
      let fileName = null;
      if (file) {
        const uploadResult = await uploadFile();
        fileName = uploadResult.filePath;
      }

      const { data } = await createSnippet({
        variables: {
          input: {
            title,
            description,
            language,
            code,
            fileName,
          },
        },
      });
      
      toast.success('Snippet created successfully! It will be reviewed by an admin.');
      router.push('/my-snippets');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create snippet');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Snippet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter snippet title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language *</Label>
              <Select value={language} onValueChange={setLanguage} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what this snippet does"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <Textarea
              id="code"
              placeholder="Paste your code here"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              className="font-mono text-sm"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>File Upload (Optional)</Label>
            {file ? (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-muted-foreground">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <Label htmlFor="file" className="cursor-pointer">
                    <span className="text-sm text-muted-foreground">
                      Click to upload a file (.txt, .js, .py, etc.)
                    </span>
                    <Input
                      id="file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".txt,.js,.py,.ts,.jsx,.tsx,.html,.css,.json,.md"
                    />
                  </Label>
                </div>
              </div>
            )}
          </div>
          
          <Button type="submit" disabled={loading || uploading} className="w-full">
            {loading || uploading ? 'Creating Snippet...' : 'Create Snippet'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}