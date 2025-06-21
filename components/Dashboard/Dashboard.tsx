'use client';

import { useState } from 'react';
import {
  IconAlertCircle,
  IconEdit,
  IconMail,
  IconPhone,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
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
import { AddCustomer } from '@/components/AddCustomer/AddCustomer';
import { AddMatter } from '@/components/AddMatter/AddMatter';
import { DeleteCustomer } from '@/components/DeleteCustomer/DeleteCustomer';
import { DeleteMatter } from '@/components/DeleteMatter/DeleteMatter';
import { EditCustomer } from '@/components/EditCustomer/EditCustomer';
import { EditMatter } from '@/components/EditMatter/EditMatter';
import { Customer, Matter } from '@/types';

export interface DashboardProps {
  customers: Customer[];
}

export function Dashboard(props: Readonly<DashboardProps>) {
  const { customers } = props;
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMatters, setLoadingMatters] = useState(false);
  const [mattersError, setMattersError] = useState<string | null>(null);
  const [addCustomerOpened, setAddCustomerOpened] = useState(false);
  const [editCustomerOpened, setEditCustomerOpened] = useState(false);
  const [deleteCustomerOpened, setDeleteCustomerOpened] = useState(false);
  const [addMatterOpened, setAddMatterOpened] = useState(false);
  const [editMatterOpened, setEditMatterOpened] = useState(false);
  const [deleteMatterOpened, setDeleteMatterOpened] = useState(false);
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null);
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
    const customerWithMatters: Customer = { ...customer };
    setSelectedCustomer(customerWithMatters);
    fetchCustomerMatters(customer.id);
  };

  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomerList((prev) => [...prev, newCustomer]);
  };

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomerList((prev) =>
      prev.map((customer) => (customer.id === updatedCustomer.id ? updatedCustomer : customer))
    );
    // Update selected customer if it's the one being updated
    if (selectedCustomer?.id === updatedCustomer.id) {
      setSelectedCustomer((prev) => (prev ? { ...prev, ...updatedCustomer } : null));
    }
  };

  const handleCustomerDeleted = (deletedCustomerId: number) => {
    setCustomerList((prev) => prev.filter((customer) => customer.id !== deletedCustomerId));
    // Clear selected customer if it's the one being deleted
    if (selectedCustomer?.id === deletedCustomerId) {
      setSelectedCustomer(null);
    }
  };

  const handleMatterAdded = (newMatter: Matter) => {
    if (selectedCustomer) {
      setSelectedCustomer((prev) =>
        prev
          ? {
              ...prev,
              matters: [...(prev.matters || []), newMatter],
            }
          : null
      );
    }
  };

  const handleMatterUpdated = (updatedMatter: Matter) => {
    if (selectedCustomer) {
      setSelectedCustomer((prev) =>
        prev
          ? {
              ...prev,
              matters:
                prev.matters?.map((matter) =>
                  matter.id === updatedMatter.id ? updatedMatter : matter
                ) || [],
            }
          : null
      );
    }
  };

  const handleMatterDeleted = (deletedMatterId: number) => {
    if (selectedCustomer) {
      setSelectedCustomer((prev) =>
        prev
          ? {
              ...prev,
              matters: prev.matters?.filter((matter) => matter.id !== deletedMatterId) || [],
            }
          : null
      );
    }
  };

  const handleEditMatter = (matter: Matter) => {
    setSelectedMatter(matter);
    setEditMatterOpened(true);
  };

  const handleDeleteMatter = (matter: Matter) => {
    setSelectedMatter(matter);
    setDeleteMatterOpened(true);
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
                    <Button variant="light" size="sm" onClick={() => setEditCustomerOpened(true)}>
                      Edit
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      size="sm"
                      onClick={() => setDeleteCustomerOpened(true)}
                    >
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
                  <Button
                    leftSection={<IconPlus size={16} />}
                    size="sm"
                    onClick={() => setAddMatterOpened(true)}
                  >
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
                          <Group gap="xs">
                            <Badge color={getStatusColor(matter.status)} variant="light" size="sm">
                              {matter.status.replace('-', ' ')}
                            </Badge>
                            <Button
                              size="xs"
                              variant="light"
                              leftSection={<IconEdit size={14} />}
                              onClick={() => handleEditMatter(matter)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="xs"
                              variant="light"
                              color="red"
                              leftSection={<IconTrash size={14} />}
                              onClick={() => handleDeleteMatter(matter)}
                            >
                              Delete
                            </Button>
                          </Group>
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
                      <Button
                        leftSection={<IconPlus size={16} />}
                        variant="light"
                        onClick={() => setAddMatterOpened(true)}
                      >
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

      <EditCustomer
        opened={editCustomerOpened}
        onClose={() => setEditCustomerOpened(false)}
        onCustomerUpdated={handleCustomerUpdated}
        customer={selectedCustomer}
      />

      <DeleteCustomer
        opened={deleteCustomerOpened}
        onClose={() => setDeleteCustomerOpened(false)}
        onCustomerDeleted={handleCustomerDeleted}
        customer={selectedCustomer}
      />

      <AddMatter
        opened={addMatterOpened}
        onClose={() => setAddMatterOpened(false)}
        onMatterAdded={handleMatterAdded}
        customerId={selectedCustomer?.id ?? null}
      />

      <EditMatter
        opened={editMatterOpened}
        onClose={() => setEditMatterOpened(false)}
        onMatterUpdated={handleMatterUpdated}
        matter={selectedMatter}
      />

      <DeleteMatter
        opened={deleteMatterOpened}
        onClose={() => setDeleteMatterOpened(false)}
        onMatterDeleted={handleMatterDeleted}
        matter={selectedMatter}
      />
    </Container>
  );
}
