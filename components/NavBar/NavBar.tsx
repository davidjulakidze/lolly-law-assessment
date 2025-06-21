'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconChevronDown, IconLogout, IconMoon, IconSun, IconUser } from '@tabler/icons-react';
import {
  ActionIcon,
  AppShell,
  AppShellHeader,
  Avatar,
  Burger,
  Group,
  Menu,
  rem,
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
                <Menu shadow="md" width={200} position="bottom-end" withArrow>
                  <Menu.Target>
                    <UnstyledButton
                      px="lg"
                      py="sm"
                      mr="xl"
                      className={classes.navButton}
                      style={{ display: 'flex', alignItems: 'center', gap: rem(8) }}
                    >
                      <Avatar size={24} radius="xl">
                        <IconUser size={16} />
                      </Avatar>
                      <Text size="sm">{state.user?.firstName ?? 'User'}</Text>
                      <IconChevronDown size={16} />
                    </UnstyledButton>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Account</Menu.Label>
                    <Menu.Item>
                      <Text size="sm" fw={500}>
                        {state.user?.firstName ?? 'User'} {state.user?.middleName ?? ''}{' '}
                        {state.user?.lastName ?? ''}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {state.user?.email ?? ''}
                      </Text>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                      onClick={handleLogout}
                      color="red"
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
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
          <>
            <UnstyledButton
              px="lg"
              py="md"
              w="100%"
              className={classes.mobileNavButton}
              style={{ cursor: 'default' }}
            >
              <Group>
                <Avatar size={32} radius="xl">
                  <IconUser size={18} />
                </Avatar>
                <div>
                  <Text size="sm" fw={500}>
                    {state.user?.firstName ?? 'User'} {state.user?.middleName ?? ''}{' '}
                    {state.user?.lastName ?? ''}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {state.user?.email ?? ''}
                  </Text>
                </div>
              </Group>
            </UnstyledButton>
            <UnstyledButton
              onClick={handleLogout}
              px="lg"
              py="md"
              w="100%"
              className={classes.mobileNavButton}
              style={{ color: 'var(--mantine-color-red-6)' }}
            >
              <Group>
                <IconLogout size={18} />
                <Text>Logout</Text>
              </Group>
            </UnstyledButton>
          </>
        )}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
