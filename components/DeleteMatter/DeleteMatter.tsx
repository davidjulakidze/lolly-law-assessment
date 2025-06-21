'use client';

import { useState } from 'react';
import { IconAlertCircle, IconCheck, IconTrash } from '@tabler/icons-react';
import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core';

interface Matter {
  id: number;
  title: string;
  description: string | null;
  status: string;
  customerId: number;
}

interface DeleteMatterProps {
  opened: boolean;
  onClose: () => void;
  onMatterDeleted: (matterId: number) => void;
  matter: Matter | null;
}

export function DeleteMatter({ opened, onClose, onMatterDeleted, matter }: DeleteMatterProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    if (!matter) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/customers/${matter.customerId}/matters/${matter.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Failed to delete matter');
      }

      setSuccess(true);

      // Call the callback to update the parent component
      onMatterDeleted(matter.id);

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

  if (!matter) {
    return null;
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Delete Matter" size="sm" centered>
      {success ? (
        <Alert icon={<IconCheck size={16} />} title="Success!" color="green" mb="md">
          Matter has been deleted successfully.
        </Alert>
      ) : (
        <Stack gap="md">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
              {error}
            </Alert>
          )}

          <Text size="sm">
            Are you sure you want to delete the matter <strong>"{matter.title}"</strong>?
          </Text>

          <Text size="sm" c="dimmed">
            This action cannot be undone.
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
              Delete Matter
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
