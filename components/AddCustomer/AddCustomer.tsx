'use client';

import { useState } from 'react';
import {
  Modal,
  TextInput,
  Button,
  Stack,
  Group,
  Alert,
  Loader,
} from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';

interface AddCustomerProps {
  opened: boolean;
  onClose: () => void;
  onCustomerAdded: (customer: any) => void;
}

interface CustomerFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function AddCustomer({ opened, onClose, onCustomerAdded }: Readonly<AddCustomerProps>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<CustomerFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    validate: {
      firstName: (value) => (value.trim().length < 2 ? 'First name must be at least 2 characters' : null),
      lastName: (value) => (value.trim().length < 2 ? 'Last name must be at least 2 characters' : null),
      email: (value) => isEmail(value) ? null : 'Invalid email address',
      phone: (value) => (value.trim().length < 10 ? 'Phone number must be at least 10 characters' : null),
    },
  });

  const handleSubmit = async (values: CustomerFormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Failed to create customer');
      }

      const newCustomer = await response.json();
      setSuccess(true);
      
      // Reset form
      form.reset();
      
      // Call the callback to update the parent component
      onCustomerAdded(newCustomer);
      
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

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Add New Customer"
      size="md"
      centered
    >
      {success ? (
        <Alert
          icon={<IconCheck size={16} />}
          title="Success!"
          color="green"
          mb="md"
        >
          Customer has been added successfully.
        </Alert>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Error"
                color="red"
                mb="md"
              >
                {error}
              </Alert>
            )}

            <Group grow>
              <TextInput
                label="First Name"
                placeholder="John"
                required
                disabled={loading}
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Last Name"
                placeholder="Doe"
                required
                disabled={loading}
                {...form.getInputProps('lastName')}
              />
            </Group>

            <TextInput
              label="Email"
              placeholder="john.doe@example.com"
              type="email"
              required
              disabled={loading}
              {...form.getInputProps('email')}
            />

            <TextInput
              label="Phone"
              placeholder="(555) 123-4567"
              required
              disabled={loading}
              {...form.getInputProps('phone')}
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                leftSection={loading ? <Loader size={16} /> : undefined}
              >
                Add Customer
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
