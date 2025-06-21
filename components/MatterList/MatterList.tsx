'use client';

import React from 'react';
import { IconAlertCircle, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Pagination,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { maxMatterItemsPerPage as itemsPerPage } from '@/constants';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDashboardActions } from '@/hooks/useDashboardActions';
import { Matter } from '@/types';

export function MatterList() {
  const { state, dispatch } = useDashboard();
  const { fetchCustomerMatters, handleEditMatter, handleDeleteMatter } = useDashboardActions();
  const { selectedCustomer, loadingMatters, mattersError } = state;

  const handleAddMatter = () => {
    dispatch({ type: 'OPEN_ADD_MATTER_MODAL' });
  };

  const handlePageChange = (page: number) => {
    if (selectedCustomer) {
      fetchCustomerMatters(selectedCustomer.id, page, itemsPerPage);
    }
  };

  const matters = selectedCustomer?.matters ?? [];

  if (!selectedCustomer) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Center h="100%">
          <Text c="dimmed" ta="center">
            Select a customer to view their matters
          </Text>
        </Center>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mah="80vh">
      <Stack gap="md" h="100%">
        <Group justify="space-between">
          <Title order={3}>Matters</Title>
          <Button variant="filled" leftSection={<IconPlus size={16} />} onClick={handleAddMatter}>
            Add Matter
          </Button>
        </Group>

        {mattersError && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" variant="light">
            {mattersError}
          </Alert>
        )}

        {loadingMatters ? (
          <Center style={{ flex: 1 }}>
            <Loader />
          </Center>
        ) : (
          <ScrollArea style={{ flex: 1 }} offsetScrollbars>
            <Stack gap="xs">
              {matters.length > 0 ? (
                matters.map((matter) => (
                  <MatterListItem
                    key={matter.id}
                    matter={matter}
                    onEdit={handleEditMatter}
                    onDelete={handleDeleteMatter}
                  />
                ))
              ) : (
                <Center py="xl">
                  <Stack align="center" gap="md">
                    <Text c="dimmed" ta="center">
                      No matters found for this customer
                    </Text>
                    <Button
                      variant="light"
                      leftSection={<IconPlus size={16} />}
                      onClick={handleAddMatter}
                    >
                      Create First Matter
                    </Button>
                  </Stack>
                </Center>
              )}
            </Stack>
          </ScrollArea>
        )}

        {state.matterPagination && state.matterPagination.totalPages > 1 && (
          <Group justify="center" mt="auto">
            <Pagination
              value={state.matterPagination.page}
              onChange={handlePageChange}
              total={state.matterPagination.totalPages}
              size="sm"
              withEdges
            />
          </Group>
        )}

        {state.matterPagination && matters.length > 0 && (
          <Text size="xs" c="dimmed" ta="center">
            Showing {(state.matterPagination.page - 1) * state.matterPagination.limit + 1}-
            {Math.min(
              state.matterPagination.page * state.matterPagination.limit,
              state.matterPagination.totalCount
            )}{' '}
            of {state.matterPagination.totalCount} matters
          </Text>
        )}
      </Stack>
    </Card>
  );
}

interface MatterListItemProps {
  matter: Matter;
  onEdit: (matter: Matter) => void;
  onDelete: (matter: Matter) => void;
}

function MatterListItem({ matter, onEdit, onDelete }: Readonly<MatterListItemProps>) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'green';
      case 'closed':
        return 'gray';
      case 'pending':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  return (
    <Card padding="sm" radius="sm" withBorder>
      <Group justify="space-between">
        <div style={{ flex: 1 }}>
          <Text fw={500} size="sm" mb={4}>
            {matter.title}
          </Text>
          {matter.description && (
            <Text size="xs" c="dimmed" mb={8}>
              {matter.description}
            </Text>
          )}
          <Badge variant="light" color={getStatusColor(matter.status)} size="sm">
            {matter.status}
          </Badge>
        </div>
        <Group gap="xs">
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconEdit size={14} />}
            onClick={() => onEdit(matter)}
          >
            Edit
          </Button>
          <Button
            variant="subtle"
            color="red"
            size="xs"
            leftSection={<IconTrash size={14} />}
            onClick={() => onDelete(matter)}
          >
            Delete
          </Button>
        </Group>
      </Group>
    </Card>
  );
}
