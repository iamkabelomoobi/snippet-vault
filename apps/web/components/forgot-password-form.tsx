'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await forgotPassword({ variables: { email } });
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    }
  };

  if (sent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent a password reset link to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a reset link
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
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}