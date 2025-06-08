import { Code2, Zap, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-background via-background to-muted/50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
            Organize Your Code Snippets
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Save, manage, and share your code snippets with a beautiful, modern interface. 
            Perfect for developers who want to keep their code organized and accessible.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="features">
            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Organization</h3>
              <p className="text-muted-foreground">
                Organize snippets by language, tags, and categories for easy discovery.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Search and access your code snippets instantly with our fast interface.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your code is secure with user authentication and admin moderation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}