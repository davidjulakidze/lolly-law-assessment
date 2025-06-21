'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  Text,
  Title,
  Badge,
  Stack,
  Group,
  Button,
  TextInput,
  ScrollArea,
  Avatar,
  Loader,
  Center,
} from '@mantine/core';
import { IconSearch, IconPlus, IconMail, IconPhone } from '@tabler/icons-react';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  matters?: Matter[];
}

interface Matter {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  customerId: number;
}

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
      if (data.length > 0) {
        setSelectedCustomer(data[0]);
        fetchCustomerMatters(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerMatters = async (customerId: number) => {
    try {
      const response = await fetch(`/api/customers/${customerId}/matters`);
      const matters = await response.json();
      setSelectedCustomer(prev => prev ? { ...prev, matters } : null);
    } catch (error) {
      console.error('Error fetching matters:', error);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'blue';
      case 'in-progress': return 'yellow';
      case 'completed': return 'green';
      case 'closed': return 'gray';
      default: return 'blue';
    }
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Center h={400}>
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Customer Management</Title>
      
      <Grid>
        {/* Customer List Sidebar */}
        <Grid.Col span={4}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="calc(100vh - 200px)">
            <Group justify="space-between" mb="md">
              <Title order={3}>Customers</Title>
              <Button leftSection={<IconPlus size={16} />} size="sm">
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
                {filteredCustomers.map((customer) => (
                  <Card
                    key={customer.id}
                    padding="md"
                    radius="sm"
                    withBorder
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedCustomer?.id === customer.id ? 'var(--mantine-color-blue-0)' : undefined,
                      borderColor: selectedCustomer?.id === customer.id ? 'var(--mantine-color-blue-4)' : undefined,
                    }}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      fetchCustomerMatters(customer.id);
                    }}
                  >
                    <Group>
                      <Avatar size="sm" color="blue">
                        {customer.firstName[0]}{customer.lastName[0]}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" fw={500}>
                          {customer.firstName} {customer.lastName}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {customer.email}
                        </Text>
                      </div>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </ScrollArea>
          </Card>
        </Grid.Col>

        {/* Customer Details and Matters */}
        <Grid.Col span={8}>
          {selectedCustomer ? (
            <Stack gap="lg">
              {/* Customer Info Card */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={3}>
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </Title>
                  <Group gap="xs">
                    <Button variant="light" size="sm">Edit</Button>
                    <Button variant="light" color="red" size="sm">Delete</Button>
                  </Group>
                </Group>
                
                <Grid>
                  <Grid.Col span={6}>
                    <Group gap="xs">
                      <IconMail size={16} />
                      <Text size="sm">{selectedCustomer.email}</Text>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group gap="xs">
                      <IconPhone size={16} />
                      <Text size="sm">{selectedCustomer.phone}</Text>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Card>

              {/* Matters Card */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={4}>Matters</Title>
                  <Button leftSection={<IconPlus size={16} />} size="sm">
                    New Matter
                  </Button>
                </Group>
                
                {selectedCustomer.matters && selectedCustomer.matters.length > 0 ? (
                  <Stack gap="md">
                    {selectedCustomer.matters.map((matter) => (
                      <Card key={matter.id} padding="md" radius="sm" withBorder>
                        <Group justify="space-between" mb="xs">
                          <Text fw={500}>{matter.title}</Text>
                          <Badge color={getStatusColor(matter.status)} variant="light">
                            {matter.status}
                          </Badge>
                        </Group>
                        
                        {matter.description && (
                          <Text size="sm" c="dimmed" mb="xs">
                            {matter.description}
                          </Text>
                        )}
                        
                        <Text size="xs" c="dimmed">
                          Created: {new Date(matter.createdAt).toLocaleDateString()}
                        </Text>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Center h={200}>
                    <Stack align="center" gap="md">
                      <Text c="dimmed">No matters found for this customer</Text>
                      <Button leftSection={<IconPlus size={16} />}>
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
                <Text c="dimmed">Select a customer to view details</Text>
              </Center>
            </Card>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}