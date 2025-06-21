'use client';

import { IconEdit, IconMail, IconPhone, IconTrash } from '@tabler/icons-react';
import {
  Avatar,
  Button,
  Card,
  Center,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { useDashboard } from '@/contexts/DashboardContext';

export function CustomerDetails() {
  const { state, dispatch } = useDashboard();
  const { selectedCustomer } = state;  if (!selectedCustomer) {
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
      <Stack gap="sm" justify="space-between" h="100%">        <Group justify="space-between" align="flex-start">
          <Group gap="sm">
            <Avatar size="md" color="blue" radius="xl">
              {selectedCustomer.firstName.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <Text fw={600} size="md">
                {selectedCustomer.firstName} {selectedCustomer.lastName}
              </Text>
              <Group gap="xs" mt={2}>
                <IconMail size={14} />
                <Text size="xs" c="dimmed">{selectedCustomer.email}</Text>
              </Group>
              <Group gap="xs" mt={2}>
                <IconPhone size={14} />
                <Text size="xs" c="dimmed">{selectedCustomer.phone}</Text>
              </Group>
            </div>
          </Group>
          <Group gap="xs">
            <Button
              variant="light"
              size="xs"
              leftSection={<IconEdit size={14} />}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="light"
              color="red"
              size="xs"
              leftSection={<IconTrash size={14} />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Group>
        </Group>

        <Text size="xs" c="dimmed" ta="right">
          Created: {new Date(selectedCustomer.createdAt).toLocaleDateString()}
        </Text>
      </Stack>
    </Card>
  );
}
