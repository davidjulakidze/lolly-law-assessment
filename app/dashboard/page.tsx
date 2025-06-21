import { cookies } from 'next/headers';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { Customer } from '@/types';
import { logger } from '@/server-utils/logger';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const customersResponse = await fetch('http://localhost:3000/api/customers', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${token ?? ''}`,
    },
  });
  let customers: Customer[] = [];
  if (!customersResponse.ok) {
    logger.error('Failed to fetch customers');
  } else {
    customers = await customersResponse.json();
  }

  return (
    <DashboardProvider initialCustomers={customers}>
      <Dashboard />
    </DashboardProvider>
  );
}
