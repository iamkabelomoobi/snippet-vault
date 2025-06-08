import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { Header } from '@/components/header';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}