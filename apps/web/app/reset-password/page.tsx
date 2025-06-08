import { ResetPasswordForm } from '@/components/reset-password-form';
import { Header } from '@/components/header';

export default function ResetPassword() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <ResetPasswordForm />
      </div>
    </div>
  );
}