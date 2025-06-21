'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconMoon, IconSun } from '@tabler/icons-react';
import {
  ActionIcon,
  AppShell,
  AppShellHeader,
  Burger,
  Group,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/types';
import classes from './NavBar.module.css';

export interface NavBarProps {
  children?: React.ReactNode;
  title?: string;
  navigations?: Navigation[];
}

export const NavBar = (props: NavBarProps) => {
  const { children, title, navigations } = props;
  const [opened, { toggle }] = useDisclosure();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { state, logout } = useAuth();
  const router = useRouter();

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getColorSchemeIcon = () => {
    return colorScheme === 'light' ? <IconSun size={18} /> : <IconMoon size={18} />;
  };
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShellHeader>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Group>
              <UnstyledButton component={Link} href="/" className={classes.logoButton}>
                <Text fw={600} size="lg">
                  {title}
                </Text>
              </UnstyledButton>
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={toggleColorScheme}
                title={`Switch to ${colorScheme === 'light' ? 'dark' : 'light'} mode`}
                className={classes.colorSchemeButton}
              >
                {getColorSchemeIcon()}
              </ActionIcon>
            </Group>
            <Group ml="xl" gap="xs" visibleFrom="sm">
              {navigations?.map((nav) => (
                <UnstyledButton
                  component={Link}
                  href={nav.href}
                  px="lg"
                  py="sm"
                  className={classes.navButton}
                  key={nav.label}
                >
                  {nav.label}
                </UnstyledButton>
              ))}
              {state.isAuthenticated && (
                <UnstyledButton
                  component="button"
                  onClick={handleLogout}
                  px="lg"
                  py="sm"
                  className={classes.navButton}
                >
                  Logout
                </UnstyledButton>
              )}
            </Group>
          </Group>
        </Group>
      </AppShellHeader>
      <AppShell.Navbar py="md" px={4}>
        {navigations?.map((nav) => (
          <UnstyledButton
            component={Link}
            href={nav.href}
            px="lg"
            py="md"
            w="100%"
            className={classes.mobileNavButton}
            key={nav.label}
          >
            {nav.label}
          </UnstyledButton>
        ))}
        {state.isAuthenticated && (
          <UnstyledButton
            component="button"
            onClick={handleLogout}
            px="lg"
            py="md"
            w="100%"
            className={classes.mobileNavButton}
          >
            Logout
          </UnstyledButton>
        )}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
