'use client';

import { IconEdit, IconMail, IconPhone, IconTrash } from '@tabler/icons-react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDashboard } from '@/contexts/DashboardContext';

export function CustomerDetails() {
  const { state, dispatch } = useDashboard();
  const { selectedCustomer } = state;

  if (!selectedCustomer) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder h={300}>
        <Text c="dimmed" ta="center" mt="xl">
          Select a customer to view details
        </Text>
      </Card>
    );
  }

  const handleEdit = () => {
    dispatch({ type: 'OPEN_EDIT_CUSTOMER_MODAL' });
  };

  const handleDelete = () => {
    dispatch({ type: 'OPEN_DELETE_CUSTOMER_MODAL' });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Customer Details</Title>
          <Group gap="xs">
            <Button
              variant="light"
              leftSection={<IconEdit size={16} />}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="light"
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Group>
        </Group>

        <Group gap="md">
          <Avatar size="lg" color="blue" radius="xl">
            {selectedCustomer.firstName.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Text fw={600} size="lg">
              {selectedCustomer.firstName} {selectedCustomer.lastName}
            </Text>
            <Badge variant="light" color="blue">
              Customer
            </Badge>
          </div>
        </Group>

        <Stack gap="sm">
          <Group gap="xs">
            <IconMail size={16} />
            <Text size="sm">{selectedCustomer.email}</Text>
          </Group>
          <Group gap="xs">
            <IconPhone size={16} />
            <Text size="sm">{selectedCustomer.phone}</Text>
          </Group>
        </Stack>

        <Text size="xs" c="dimmed">
          Created: {new Date(selectedCustomer.createdAt).toLocaleDateString()}
        </Text>
      </Stack>
    </Card>
  );
}
