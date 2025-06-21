'use client';

import { IconEdit, IconMail, IconPhone, IconTrash } from '@tabler/icons-react';
import { Avatar, Badge, Button, Card, Center, Group, Stack, Text } from '@mantine/core';
import { useDashboard } from '@/contexts/DashboardContext';

export function CustomerDetails() {
  const { state, dispatch } = useDashboard();
  const { selectedCustomer } = state;
  if (!selectedCustomer) {
    return (
      <Card shadow="sm" padding="md" radius="md" withBorder h={200}>
        <Center h="100%">
          <Text c="dimmed" ta="center">
            Select a customer to view details
          </Text>
        </Center>
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
    <Card shadow="sm" padding="md" radius="md" withBorder h={200}>
      <Stack gap="md" justify="space-between" h="100%">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Avatar size="lg" color="blue" radius="xl">
              {selectedCustomer.firstName.charAt(0).toUpperCase()}
            </Avatar>{' '}
            <div>
              <Text fw={600} size="lg">
                {selectedCustomer.firstName} {selectedCustomer.middleName}{' '}
                {selectedCustomer.lastName}
              </Text>
              <Badge variant="light" color="blue" size="sm">
                Customer
              </Badge>
            </div>
          </Group>
          <Group gap="xs">
            <Button
              variant="light"
              size="sm"
              leftSection={<IconEdit size={16} />}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="light"
              color="red"
              size="sm"
              leftSection={<IconTrash size={16} />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Group>
        </Group>

        <Group justify="space-between" align="flex-end">
          <Stack gap="xs">
            <Group gap="sm">
              <IconMail size={16} />
              <Text size="sm">{selectedCustomer.email}</Text>
            </Group>
            <Group gap="sm">
              <IconPhone size={16} />
              <Text size="sm">{selectedCustomer.phone}</Text>
            </Group>
          </Stack>

          <Text size="xs" c="dimmed">
            Created: {new Date(selectedCustomer.createdAt).toLocaleDateString()}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
