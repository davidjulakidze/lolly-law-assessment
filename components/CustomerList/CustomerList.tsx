'use client';

import { IconPlus, IconSearch } from '@tabler/icons-react';
import {
  Avatar,
  Button,
  Card,
  Group,
  Pagination,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { maxCustomerItemsPerPage as itemsPerPage } from '@/constants';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDashboardActions } from '@/hooks/useDashboardActions';
import { Customer } from '@/types';

export function CustomerList() {
  const { state, dispatch } = useDashboard();
  const { handleCustomerSelect, setSearchTerm, setCustomerPage } = useDashboardActions();

  const filteredCustomers = state.customers.filter(
    (customer) =>
      `${customer.firstName} ${customer.lastName}`
        .toLowerCase()
        .includes(state.searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (state.customerCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddCustomer = () => {
    dispatch({ type: 'OPEN_ADD_CUSTOMER_MODAL' });
  };
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mah="80vh">
      <Stack gap="md" h="100%">
        <Group justify="space-between">
          <Title order={3}>Customers</Title>
          <Button variant="filled" leftSection={<IconPlus size={16} />} onClick={handleAddCustomer}>
            Add Customer
          </Button>
        </Group>

        <TextInput
          placeholder="Search customers..."
          leftSection={<IconSearch size={16} />}
          value={state.searchTerm}
          onChange={(event) => handleSearch(event.currentTarget.value)}
        />

        <ScrollArea style={{ flex: 1 }} offsetScrollbars>
          <Stack gap="xs">
            {paginatedCustomers.map((customer) => (
              <CustomerListItem
                key={customer.id}
                customer={customer}
                isSelected={state.selectedCustomer?.id === customer.id}
                onSelect={(customer) => handleCustomerSelect(customer, state.selectedCustomer)}
              />
            ))}
            {filteredCustomers.length === 0 && (
              <Text c="dimmed" ta="center" py="xl">
                {state.searchTerm
                  ? 'No customers found matching your search'
                  : 'No customers found'}
              </Text>
            )}
          </Stack>
        </ScrollArea>

        {totalPages > 1 && (
          <Group justify="center" mt="auto">
            <Pagination
              value={state.customerCurrentPage}
              onChange={setCustomerPage}
              total={totalPages}
              size="sm"
              withEdges
            />
          </Group>
        )}

        {filteredCustomers.length > 0 && (
          <Text size="xs" c="dimmed" ta="center">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredCustomers.length)} of{' '}
            {filteredCustomers.length} customers
          </Text>
        )}
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
      title={isSelected ? 'Click to deselect customer' : 'Click to select customer'}
    >
      <Group gap="sm">
        <Avatar color="blue" radius="xl">
          {customer.firstName.charAt(0).toUpperCase()}
        </Avatar>
        <div style={{ flex: 1 }}>
          <Text fw={500} size="sm">
            {customer.firstName} {customer.lastName}
            {isSelected && (
              <Text component="span" size="xs" c="blue" ml="xs">
                (selected)
              </Text>
            )}
          </Text>
          <Text size="xs" c="dimmed">
            {customer.email}
          </Text>
        </div>
      </Group>
    </Card>
  );
}
