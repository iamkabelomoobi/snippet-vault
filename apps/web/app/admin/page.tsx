import { AdminDashboard } from '@/components/admin-dashboard';
import { Header } from '@/components/header';

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </div>
    </div>
  );
}