import { redirect } from 'next/navigation';
import { getServerSideAuth } from '@/lib/auth';
import { Login } from '../components/Login/Login';

export default async function LoginPage() {
  const { authenticated } = await getServerSideAuth();

  if (authenticated) {
    // If user is already logged in, redirect to dashboard
    redirect('/dashboard');
  }

  return <Login />;
}
