'use client';

import { IconSearch, IconPlus } from '@tabler/icons-react';
import {
  Avatar,
  Button,
  Card,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDashboardActions } from '@/hooks/useDashboardActions';
import { Customer } from '@/types';

export function CustomerList() {
  const { state, dispatch } = useDashboard();
  const { handleCustomerSelect, setSearchTerm } = useDashboardActions();
  const filteredCustomers = state.customers.filter(
    (customer) =>
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    dispatch({ type: 'OPEN_ADD_CUSTOMER_MODAL' });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Customers</Title>
          <Button
            variant="filled"
            leftSection={<IconPlus size={16} />}
            onClick={handleAddCustomer}
          >
            Add Customer
          </Button>
        </Group>

        <TextInput
          placeholder="Search customers..."
          leftSection={<IconSearch size={16} />}
          value={state.searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
        />

        <ScrollArea h={400}>
          <Stack gap="xs">
            {filteredCustomers.map((customer) => (
              <CustomerListItem
                key={customer.id}
                customer={customer}
                isSelected={state.selectedCustomer?.id === customer.id}
                onSelect={handleCustomerSelect}
              />
            ))}
            {filteredCustomers.length === 0 && (
              <Text c="dimmed" ta="center" py="xl">
                No customers found
              </Text>
            )}
          </Stack>
        </ScrollArea>
      </Stack>
    </Card>
  );
}

interface CustomerListItemProps {
  customer: Customer;
  isSelected: boolean;
  onSelect: (customer: Customer) => void;
}

function CustomerListItem({ customer, isSelected, onSelect }: Readonly<CustomerListItemProps>) {
  return (
    <Card
      key={customer.id}
      padding="sm"
      radius="sm"
      withBorder
      style={{
        cursor: 'pointer',
        backgroundColor: isSelected ? 'var(--mantine-color-blue-0)' : undefined,
        borderColor: isSelected ? 'var(--mantine-color-blue-3)' : undefined,
      }}
      onClick={() => onSelect(customer)}
    >
      <Group gap="sm">        <Avatar color="blue" radius="xl">
          {customer.firstName.charAt(0).toUpperCase()}
        </Avatar>
        <div style={{ flex: 1 }}>
          <Text fw={500} size="sm">
            {customer.firstName} {customer.lastName}
          </Text>
          <Text size="xs" c="dimmed">
            {customer.email}
          </Text>
        </div>
      </Group>
    </Card>
  );
}
