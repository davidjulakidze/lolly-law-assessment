'use client';

import { useEffect, useState } from 'react';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { Alert, Button, Group, Loader, Modal, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Customer } from '@/types';

interface EditCustomerProps {
  opened: boolean;
  onClose: () => void;
  onCustomerUpdated: (customer: Customer) => void;
  customer: Customer | null;
}

interface CustomerFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function EditCustomer({
  opened,
  onClose,
  onCustomerUpdated,
  customer,
}: Readonly<EditCustomerProps>) {
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
      firstName: (value) =>
        value.trim().length < 2 ? 'First name must be at least 2 characters' : null,
      lastName: (value) =>
        value.trim().length < 2 ? 'Last name must be at least 2 characters' : null,
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address'),
      phone: (value) =>
        value.trim().length < 10 ? 'Phone number must be at least 10 characters' : null,
    },
  });

  // Update form values when customer changes
  useEffect(() => {
    if (customer && opened) {
      form.setValues({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      });
    }
  }, [customer, opened]);
  const handleSubmit = async (values: CustomerFormValues) => {
    if (!customer) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: customer.id,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Failed to update customer');
      }

      const updatedCustomer = await response.json();
      setSuccess(true);

      // Call the callback to update the parent component
      onCustomerUpdated(updatedCustomer);

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

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={`Edit Customer: ${customer?.firstName} ${customer?.lastName}`}
      size="md"
      centered
    >
      {success ? (
        <Alert icon={<IconCheck size={16} />} title="Success!" color="green" mb="md">
          Customer has been updated successfully.
        </Alert>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
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
              <Button variant="outline" onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                leftSection={loading ? <Loader size={16} /> : undefined}
              >
                Update Customer
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
