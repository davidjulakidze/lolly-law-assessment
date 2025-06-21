'use client';

import { useState } from 'react';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { Alert, Button, Group, Modal, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

interface AddMatterProps {
  opened: boolean;
  onClose: () => void;
  onMatterAdded: (matter: any) => void;
  customerId: number | null;
}

interface MatterFormValues {
  title: string;
  description: string;
  status: string;
}

export function AddMatter({ opened, onClose, onMatterAdded, customerId }: AddMatterProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<MatterFormValues>({
    initialValues: {
      title: '',
      description: '',
      status: 'open',
    },
    validate: {
      title: (value) => (value.trim().length < 2 ? 'Title must be at least 2 characters' : null),
      status: (value) => (!value ? 'Status is required' : null),
    },
  });

  const handleSubmit = async (values: MatterFormValues) => {
    if (!customerId) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/customers/${customerId}/matters`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: values.title.trim(),
          description: values.description.trim() || null,
          status: values.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Failed to create matter');
      }

      const newMatter = await response.json();
      setSuccess(true);

      // Reset form
      form.reset();

      // Call the callback to update the parent component
      onMatterAdded(newMatter);

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
      form.reset();
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <Modal opened={opened} onClose={handleClose} title="Add New Matter" size="md" centered>
      {success ? (
        <Alert icon={<IconCheck size={16} />} title="Success!" color="green" mb="md">
          Matter has been added successfully.
        </Alert>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
                {error}
              </Alert>
            )}

            <TextInput
              label="Title"
              placeholder="Enter matter title"
              required
              disabled={loading}
              {...form.getInputProps('title')}
            />

            <Textarea
              label="Description"
              placeholder="Enter matter description (optional)"
              rows={4}
              disabled={loading}
              {...form.getInputProps('description')}
            />

            <Select
              label="Status"
              placeholder="Select status"
              data={statusOptions}
              required
              disabled={loading}
              {...form.getInputProps('status')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Add Matter
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
