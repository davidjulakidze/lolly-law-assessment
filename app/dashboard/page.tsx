import { cookies } from 'next/headers';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { logger } from '@/server-utils/logger';
import { Customer, CustomersResponse } from '@/types';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const customersResponse = await fetch(`${process.env.url}/api/customers?page=1&limit=10`, {
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
    const data: CustomersResponse = await customersResponse.json();
    customers = data.customers;
  }

  return (
    <DashboardProvider initialCustomers={customers}>
      <Dashboard />
    </DashboardProvider>
  );
}
