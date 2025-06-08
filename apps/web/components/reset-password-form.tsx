'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password)
  }
`;

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      await resetPassword({ variables: { token, password } });
      toast.success('Password reset successfully!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    }
  };

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Invalid Reset Link</CardTitle>
          <CardDescription>
            The password reset link is invalid or has expired
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/forgot-password">Request New Reset Link</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}