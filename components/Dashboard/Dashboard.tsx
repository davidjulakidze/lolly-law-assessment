'use client';

import { useState } from 'react';
import { IconAlertCircle, IconMail, IconPhone, IconPlus, IconSearch } from '@tabler/icons-react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Grid,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Customer } from '@/generated/prisma';
import { AddCustomer } from '@/components/AddCustomer/AddCustomer';

interface Matter {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface CustomerWithMatters extends Customer {
  matters?: Matter[];
}

export interface DashboardProps {
  customers: Customer[];
}

export function Dashboard(props: Readonly<DashboardProps>) {
  const { customers } = props;
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithMatters | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMatters, setLoadingMatters] = useState(false);
  const [mattersError, setMattersError] = useState<string | null>(null);
  const [addCustomerOpened, setAddCustomerOpened] = useState(false);
  const [customerList, setCustomerList] = useState<Customer[]>(customers);

  const fetchCustomerMatters = async (customerId: number) => {
    setLoadingMatters(true);
    setMattersError(null);
    try {
      const response = await fetch(`/api/customers/${customerId}/matters`);
      if (!response.ok) {
        throw new Error('Failed to fetch matters');
      }
      const matters: Matter[] = await response.json();
      setSelectedCustomer((prev) =>
        prev
          ? {
              ...prev,
              matters,
            }
          : null
      );
    } catch (error) {
      setMattersError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoadingMatters(false);
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    const customerWithMatters: CustomerWithMatters = { ...customer };
    setSelectedCustomer(customerWithMatters);
    fetchCustomerMatters(customer.id);
  };

  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomerList(prev => [...prev, newCustomer]);
  };

  const filteredCustomers = customerList.filter(
    (customer) =>
      `${customer.firstName} ${customer.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'blue';
      case 'in-progress':
        return 'yellow';
      case 'completed':
        return 'green';
      case 'closed':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Customer Management
      </Title>

      <Grid>
        {/* Customer List Sidebar */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="calc(100vh - 200px)">
            <Group justify="space-between" mb="md">
              <Title order={3}>Customers</Title>
              <Button 
                leftSection={<IconPlus size={16} />} 
                size="sm"
                onClick={() => setAddCustomerOpened(true)}
              >
                Add Customer
              </Button>
            </Group>

            <TextInput
              placeholder="Search customers..."
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              mb="md"
            />

            <ScrollArea h="calc(100% - 120px)">
              <Stack gap="xs">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <Card
                      key={customer.id}
                      padding="md"
                      radius="sm"
                      withBorder
                      style={{
                        cursor: 'pointer',
                        backgroundColor:
                          selectedCustomer?.id === customer.id
                            ? 'var(--mantine-color-blue-0)'
                            : undefined,
                        borderColor:
                          selectedCustomer?.id === customer.id
                            ? 'var(--mantine-color-blue-4)'
                            : undefined,
                      }}
                      onClick={() => handleCustomerSelect(customer)}
                    >
                      <Group>
                        <Avatar size="sm" color="blue">
                          {customer.firstName[0]}
                          {customer.lastName[0]}
                        </Avatar>
                        <div style={{ flex: 1 }}>
                          <Text size="sm" fw={500}>
                            {customer.firstName} {customer.lastName}
                          </Text>
                          <Text size="xs" c="dimmed" truncate>
                            {customer.email}
                          </Text>
                        </div>
                      </Group>
                    </Card>
                  ))
                ) : (
                  <Center py="xl">
                    <Text c="dimmed" size="sm">
                      {searchTerm ? 'No customers found' : 'No customers available'}
                    </Text>
                  </Center>
                )}
              </Stack>
            </ScrollArea>
          </Card>
        </Grid.Col>

        {/* Customer Details and Matters */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          {selectedCustomer ? (
            <Stack gap="lg">
              {/* Customer Info Card */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={3}>
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </Title>
                  <Group gap="xs">
                    <Button variant="light" size="sm">
                      Edit
                    </Button>
                    <Button variant="light" color="red" size="sm">
                      Delete
                    </Button>
                  </Group>
                </Group>

                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Group gap="xs">
                      <IconMail size={16} />
                      <Text size="sm">{selectedCustomer.email}</Text>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Group gap="xs">
                      <IconPhone size={16} />
                      <Text size="sm">{selectedCustomer.phone}</Text>
                    </Group>
                  </Grid.Col>
                </Grid>

                <Text size="xs" c="dimmed" mt="md">
                  Customer since: {formatDate(selectedCustomer.createdAt.toString())}
                </Text>
              </Card>

              {/* Matters Card */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={4}>Matters</Title>
                  <Button leftSection={<IconPlus size={16} />} size="sm">
                    New Matter
                  </Button>
                </Group>

                {mattersError && (
                  <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
                    {mattersError}
                  </Alert>
                )}

                {loadingMatters ? (
                  <Center h={200}>
                    <Loader size="md" />
                  </Center>
                ) : selectedCustomer.matters && selectedCustomer.matters.length > 0 ? (
                  <Stack gap="md">
                    {selectedCustomer.matters.map((matter) => (
                      <Card key={matter.id} padding="md" radius="sm" withBorder>
                        <Group justify="space-between" mb="xs">
                          <Text fw={500} size="sm">
                            {matter.title}
                          </Text>
                          <Badge color={getStatusColor(matter.status)} variant="light" size="sm">
                            {matter.status.replace('-', ' ')}
                          </Badge>
                        </Group>

                        {matter.description && (
                          <Text size="sm" c="dimmed" mb="xs" lineClamp={2}>
                            {matter.description}
                          </Text>
                        )}
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Center h={200}>
                    <Stack align="center" gap="md">
                      <Text c="dimmed">No matters found for this customer</Text>
                      <Button leftSection={<IconPlus size={16} />} variant="light">
                        Create First Matter
                      </Button>
                    </Stack>
                  </Center>
                )}
              </Card>
            </Stack>
          ) : (
            <Card shadow="sm" padding="lg" radius="md" withBorder h="calc(100vh - 200px)">
              <Center h="100%">
                <Stack align="center" gap="md">
                  <Text c="dimmed" size="lg">
                    Select a customer to view details
                  </Text>
                  <Text c="dimmed" size="sm" ta="center">
                    Choose a customer from the list to see their information and matters
                  </Text>
                </Stack>
              </Center>
            </Card>
          )}
        </Grid.Col>
      </Grid>
      
      <AddCustomer
        opened={addCustomerOpened}
        onClose={() => setAddCustomerOpened(false)}
        onCustomerAdded={handleCustomerAdded}
      />
    </Container>
  );
}
