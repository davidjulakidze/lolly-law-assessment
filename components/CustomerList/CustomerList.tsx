'use client';

import { useEffect, useState } from 'react';
import { IconAlertCircle, IconPlus, IconSearch } from '@tabler/icons-react';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Pagination,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { maxCustomerItemsPerPage as itemsPerPage } from '@/constants';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDashboardActions } from '@/hooks/useDashboardActions';
import { Customer } from '@/types';

export function CustomerList() {
  const { state, dispatch } = useDashboard();
  const { fetchCustomers, handleCustomerSelect } = useDashboardActions();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300);

  // Fetch customers when component mounts or when search/pagination changes
  useEffect(() => {
    fetchCustomers(state.customerPagination?.page ?? 1, itemsPerPage, debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    dispatch({ type: 'SET_SEARCH_TERM', payload: value });
  };

  const handlePageChange = (page: number) => {
    fetchCustomers(page, itemsPerPage, debouncedSearchTerm);
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
          value={searchTerm}
          onChange={(event) => handleSearch(event.currentTarget.value)}
        />

        {state.customersError && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" variant="light">
            {state.customersError}
          </Alert>
        )}

        {state.loadingCustomers ? (
          <Center style={{ flex: 1 }}>
            <Loader />
          </Center>
        ) : (
          <ScrollArea style={{ flex: 1 }} offsetScrollbars>
            <Stack gap="xs">
              {state.customers.map((customer) => (
                <CustomerListItem
                  key={customer.id}
                  customer={customer}
                  isSelected={state.selectedCustomer?.id === customer.id}
                  onSelect={(customer) => handleCustomerSelect(customer, state.selectedCustomer)}
                />
              ))}
              {state.customers.length === 0 && !state.loadingCustomers && (
                <Text c="dimmed" ta="center" py="xl">
                  {searchTerm ? 'No customers found matching your search' : 'No customers found'}
                </Text>
              )}
            </Stack>
          </ScrollArea>
        )}

        {state.customerPagination && state.customerPagination.totalPages > 1 && (
          <Group justify="center" mt="auto">
            <Pagination
              value={state.customerPagination.page}
              onChange={handlePageChange}
              total={state.customerPagination.totalPages}
              size="sm"
              withEdges
            />
          </Group>
        )}

        {state.customerPagination && state.customers.length > 0 && (
          <Text size="xs" c="dimmed" ta="center">
            Showing {(state.customerPagination.page - 1) * state.customerPagination.limit + 1}-
            {Math.min(
              state.customerPagination.page * state.customerPagination.limit,
              state.customerPagination.totalCount
            )}{' '}
            of {state.customerPagination.totalCount} customers
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
