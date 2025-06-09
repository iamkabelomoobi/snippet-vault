import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Code2, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  const router = useRouter();
  const { user, loading } = useAuth();

  let getStartedHref = "/register";
  if (!loading && user) {
    if (user.role === "USER") {
      getStartedHref = "/create";
    } else if (user.role === "ADMIN") {
      getStartedHref = "/admin";
    }
  }

  return (
    <section className="bg-gradient-to-br from-background via-background to-muted/50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
            Organize Your Code Snippets
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Save, manage, and share your code snippets with a beautiful, modern
            interface. Perfect for developers who want to keep their code
            organized and accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href={getStartedHref}>Get Started Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
