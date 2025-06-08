import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Code2, User } from 'lucide-react';

interface SnippetCardProps {
  snippet: {
    id: string;
    title: string;
    description: string;
    language: string;
    createdAt: string;
    author: {
      email: string;
    };
  };
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <Link href={`/snippets/${snippet.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
              {snippet.title}
            </h3>
            <Badge variant="secondary" className="ml-2 flex-shrink-0">
              {snippet.language}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pb-3">
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {snippet.description}
          </p>
        </CardContent>
        
        <CardFooter className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>{snippet.author.email.split('@')[0]}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}