import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { NavBar } from '@/components/NavBar/NavBar';
import { theme } from '../theme';
import { Navigation } from '@/types';

export const metadata = {
  title: 'LollyLaw Assessment',
  description: 'An assessment for LollyLaw',
};

const navigations: Navigation[] = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

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
          <NavBar title='LollyLaw' navigations={navigations}>{children}</NavBar>
        </MantineProvider>
      </body>
    </html>
  );
}
