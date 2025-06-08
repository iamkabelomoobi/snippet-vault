import { RegisterForm } from '@/components/register-form';
import { Header } from '@/components/header';

export default function Register() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}