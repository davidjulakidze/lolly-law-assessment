import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { NavBar } from '@/components/NavBar/NavBar';
import { AuthProvider } from '@/contexts/AuthContext';
import { getServerSideAuth } from '@/lib/auth';
import { theme } from '../theme';

export const metadata = {
  title: 'LollyLaw Assessment',
  description: 'An assessment for LollyLaw',
};

export default async function RootLayout({ children }: Readonly<{ children: any }>) {
  const { user, authenticated } = await getServerSideAuth();

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          <AuthProvider initialUser={user} initialAuthenticated={authenticated}>
            <NavBar title="LollyLaw">{children}</NavBar>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
