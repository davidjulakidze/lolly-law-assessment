'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconLock, IconMail, IconUser, IconUserPlus } from '@tabler/icons-react';
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import classes from './Login.module.css';

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export function Login() {
  const [activeTab, setActiveTab] = useState<string | null>('login');
  const router = useRouter();
  const loginForm = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: {
      email: (value) => (isEmail(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const signUpForm = useForm<SignUpFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    validate: {
      firstName: (value) => (value.length < 2 ? 'First name must be at least 2 characters' : null),
      lastName: (value) => (value.length < 2 ? 'Last name must be at least 2 characters' : null),
      email: (value) => (isEmail(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
      acceptTerms: (value) => (!value ? 'You must accept the terms and conditions' : null),
    },
  });

  const handleLoginSubmit = async (values: LoginFormValues) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      const errorData = await response.json();
      notifications.show({
        title: 'Login Failed',
        message: errorData.error ?? 'An error occurred during login',
        color: 'red',
      });
    } else {
      const data = await response.json();
      notifications.show({
        title: 'Login Successful',
        message: `Welcome back, ${data.user.firstName}!`,
        color: 'green',
      });
    }
    loginForm.reset();
    router.push('/dashboard');
  };

  const handleSignUpSubmit = async (values: SignUpFormValues) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      const errorData = await response.json();
      notifications.show({
        title: 'Sign Up Failed',
        message: errorData.error ?? 'An error occurred during sign up',
        color: 'red',
      });
    } else {
      const data = await response.json();
      notifications.show({
        title: 'Sign Up Successful',
        message: `Welcome, ${data.user.firstName}!`,
        color: 'green',
      });
    }
    signUpForm.reset();
    setActiveTab('login');
  };

  return (
    <Container size={420} className={classes.container}>
      <Paper radius="md" p="xl" shadow="md" className={classes.paper}>
        <Title order={2} ta="center" mb="md" className={classes.title}>
          Welcome to LollyLaw
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="xl">
          Please sign in to your account or create a new one
        </Text>

        <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
          <Tabs.List grow mb="xl" className={classes.tabsList}>
            <Tabs.Tab value="login" leftSection={<IconUser size={16} />} className={classes.tab}>
              Sign In
            </Tabs.Tab>
            <Tabs.Tab
              value="signup"
              leftSection={<IconUserPlus size={16} />}
              className={classes.tab}
            >
              Sign Up
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login">
            <form onSubmit={loginForm.onSubmit(handleLoginSubmit)}>
              <Stack gap="md">
                <TextInput
                  required
                  label="Email"
                  placeholder="your@email.com"
                  leftSection={<IconMail size={16} />}
                  {...loginForm.getInputProps('email')}
                />

                <PasswordInput
                  required
                  label="Password"
                  placeholder="Your password"
                  leftSection={<IconLock size={16} />}
                  {...loginForm.getInputProps('password')}
                />

                <Group justify="space-between">
                  <Checkbox
                    label="Remember me"
                    {...loginForm.getInputProps('rememberMe', { type: 'checkbox' })}
                  />
                  <Anchor size="sm" c="dimmed" href="#" onClick={(e) => e.preventDefault()}>
                    Forgot password?
                  </Anchor>
                </Group>

                <Button type="submit" fullWidth size="md" mt="md">
                  Sign In
                </Button>
              </Stack>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="signup">
            <form onSubmit={signUpForm.onSubmit(handleSignUpSubmit)}>
              <Stack gap="md">
                <Group grow>
                  <TextInput
                    required
                    label="First Name"
                    placeholder="John"
                    {...signUpForm.getInputProps('firstName')}
                  />
                  <TextInput
                    required
                    label="Last Name"
                    placeholder="Doe"
                    {...signUpForm.getInputProps('lastName')}
                  />
                </Group>

                <TextInput
                  required
                  label="Email"
                  placeholder="your@email.com"
                  leftSection={<IconMail size={16} />}
                  {...signUpForm.getInputProps('email')}
                />

                <PasswordInput
                  required
                  label="Password"
                  placeholder="Your password"
                  leftSection={<IconLock size={16} />}
                  {...signUpForm.getInputProps('password')}
                />

                <PasswordInput
                  required
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  leftSection={<IconLock size={16} />}
                  {...signUpForm.getInputProps('confirmPassword')}
                />

                <Checkbox
                  required
                  label={
                    <Text size="sm">
                      I accept the{' '}
                      <Anchor href="#" size="sm" onClick={(e) => e.preventDefault()}>
                        terms and conditions
                      </Anchor>
                    </Text>
                  }
                  {...signUpForm.getInputProps('acceptTerms', { type: 'checkbox' })}
                />

                <Button type="submit" fullWidth size="md" mt="md">
                  Create Account
                </Button>
              </Stack>
            </form>
          </Tabs.Panel>
        </Tabs>

        <Divider my="xl" />

        <Text c="dimmed" size="sm" ta="center">
          Having trouble?{' '}
          <Anchor href="#" size="sm">
            Contact support
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}
