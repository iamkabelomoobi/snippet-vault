'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });
      
      login(data.login.token);
      toast.success('Logged in successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          <div className="text-center space-y-2">
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Forgot your password?
            </Link>
            <div className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}