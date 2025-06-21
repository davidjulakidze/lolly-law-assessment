import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { NavBar } from '@/components/NavBar/NavBar';
import { theme } from '../theme';

export const metadata = {
  title: 'LollyLaw Assessment',
  description: 'An assessment for LollyLaw',
};

export default function RootLayout({ children }: Readonly<{ children: any }>) {
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
          <NavBar title="LollyLaw">{children}</NavBar>
        </MantineProvider>
      </body>
    </html>
  );
}
