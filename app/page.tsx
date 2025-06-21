import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Login } from '../components/Login/Login';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const userInfo = await fetch(`${process.env.url}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${token ?? ''}`,
    },
  });
  if (userInfo.ok) {
    // If user is already logged in, redirect to dashboard
    redirect('/dashboard');
  }
  return <Login />;
}
