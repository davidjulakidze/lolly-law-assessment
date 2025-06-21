'use client';

import React, { useEffect, useState } from 'react';
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
import { useDashboard } from '@/contexts/DashboardContext';
import { useDashboardActions } from '@/hooks/useDashboardActions';
import { Matter } from '@/types';

export function MatterList() {
  const { state, dispatch } = useDashboard();
  const { handleEditMatter, handleDeleteMatter } = useDashboardActions();
  const { selectedCustomer, loadingMatters, mattersError } = state;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleAddMatter = () => {
    dispatch({ type: 'OPEN_ADD_MATTER_MODAL' });
  };

  const matters = selectedCustomer?.matters || [];

  const totalPages = Math.ceil(matters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMatters = matters.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCustomer?.id]);
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
        )}{' '}
        {loadingMatters ? (
          <Center style={{ flex: 1 }}>
            <Loader />
          </Center>
        ) : (
          <ScrollArea style={{ flex: 1 }} offsetScrollbars>
            <Stack gap="xs">
              {paginatedMatters.length > 0 ? (
                paginatedMatters.map((matter) => (
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
        {totalPages > 1 && (
          <Group justify="center" mt="auto">
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
              size="sm"
              withEdges
            />
          </Group>
        )}
        {matters.length > 0 && (
          <Text size="xs" c="dimmed" ta="center">
            Showing {startIndex + 1}-{Math.min(endIndex, matters.length)} of {matters.length}{' '}
            matters
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
