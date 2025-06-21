import { Dashboard } from '@/components/Dashboard/Dashboard';
import { DashboardProvider } from '@/contexts/DashboardContext';

export default async function DashboardPage() {
  return (
    <DashboardProvider initialCustomers={[]}>
      <Dashboard />
    </DashboardProvider>
  );
}
