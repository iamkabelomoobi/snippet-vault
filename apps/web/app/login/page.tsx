import { LoginForm } from '@/components/login-form';
import { Header } from '@/components/header';

export default function Login() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}