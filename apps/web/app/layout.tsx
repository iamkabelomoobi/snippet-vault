import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ApolloProvider } from '@/components/apollo-provider';
import { AuthProvider } from '@/components/auth-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Snippet Vault - Organize Your Code',
  description: 'A modern platform to save, manage, and share your code snippets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ApolloProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ApolloProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}