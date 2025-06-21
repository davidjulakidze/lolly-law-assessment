'use client';

import { useEffect, useState } from 'react';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { Alert, Button, Group, Modal, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

interface Matter {
  id: number;
  title: string;
  description: string | null;
  status: string;
  customerId: number;
}

interface EditMatterProps {
  opened: boolean;
  onClose: () => void;
  onMatterUpdated: (matter: Matter) => void;
  matter: Matter | null;
}

interface MatterFormValues {
  title: string;
  description: string;
  status: string;
}

export function EditMatter({ opened, onClose, onMatterUpdated, matter }: EditMatterProps) {
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

  // Update form values when matter changes
  useEffect(() => {
    if (matter && opened) {
      form.setValues({
        title: matter.title,
        description: matter.description || '',
        status: matter.status,
      });
    }
  }, [matter, opened]);

  const handleSubmit = async (values: MatterFormValues) => {
    if (!matter) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/customers/${matter.customerId}/matters/${matter.id}`, {
        method: 'PUT',
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
        throw new Error(errorData.error ?? 'Failed to update matter');
      }

      const updatedMatter = await response.json();
      setSuccess(true);

      // Call the callback to update the parent component
      onMatterUpdated(updatedMatter);

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

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={`Edit Matter: ${matter?.title}`}
      size="md"
      centered
    >
      {success ? (
        <Alert icon={<IconCheck size={16} />} title="Success!" color="green" mb="md">
          Matter has been updated successfully.
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
                Update Matter
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
