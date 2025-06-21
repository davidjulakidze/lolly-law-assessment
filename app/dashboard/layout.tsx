import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // the path here is hardcoded since we are calling from server side
  // there are ways around this but for simplicity this works
  const userInfo = await fetch('http://localhost:3000/api/auth/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${token ?? ''}`,
    },
  });
  if (!userInfo.ok) {
    redirect('/');
  }
  return <>{children}</>;
}
