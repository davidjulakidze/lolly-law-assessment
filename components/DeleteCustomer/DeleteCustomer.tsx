'use client';

import { useState } from 'react';
import { IconAlertCircle, IconCheck, IconTrash } from '@tabler/icons-react';
import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { Customer } from '@/types';

interface DeleteCustomerProps {
  opened: boolean;
  onClose: () => void;
  onCustomerDeleted: (customerId: number) => void;
  customer: Customer | null;
}

export function DeleteCustomer({
  opened,
  onClose,
  onCustomerDeleted,
  customer,
}: Readonly<DeleteCustomerProps>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    if (!customer) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Failed to delete customer');
      }

      setSuccess(true);

      // Call the callback to update the parent component
      onCustomerDeleted(customer.id);

      // Close modal after a brief delay to show success message
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  if (!customer) {
    return null;
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Delete Customer" size="sm" centered>
      {success ? (
        <Alert icon={<IconCheck size={16} />} title="Success!" color="green" mb="md">
          Customer has been deleted successfully.
        </Alert>
      ) : (
        <Stack gap="md">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
              {error}
            </Alert>
          )}

          <Text size="sm">
            Are you sure you want to delete{' '}
            <strong>
              {customer.firstName} {customer.middleName} {customer.lastName}
            </strong>
            ?
          </Text>

          <Text size="sm" c="dimmed">
            This action cannot be undone. All associated matters will also be deleted.
          </Text>

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDelete}
              loading={loading}
              leftSection={<IconTrash size={16} />}
            >
              Delete Customer
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
