'use client';

import { IconEdit, IconPlus, IconTrash, IconAlertCircle } from '@tabler/icons-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Center,
  Group,
  Loader,
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

  const handleAddMatter = () => {
    dispatch({ type: 'OPEN_ADD_MATTER_MODAL' });
  };

  if (!selectedCustomer) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder h={400}>
        <Text c="dimmed" ta="center" mt="xl">
          Select a customer to view their matters
        </Text>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Matters</Title>
          <Button
            variant="filled"
            leftSection={<IconPlus size={16} />}
            onClick={handleAddMatter}
          >
            Add Matter
          </Button>
        </Group>

        {loadingMatters && (
          <Center py="xl">
            <Loader />
          </Center>
        )}

        {mattersError && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            variant="light"
          >
            {mattersError}
          </Alert>
        )}

        {!loadingMatters && !mattersError && (
          <ScrollArea h={300}>
            <Stack gap="xs">
              {selectedCustomer.matters && selectedCustomer.matters.length > 0 ? (
                selectedCustomer.matters.map((matter) => (
                  <MatterListItem
                    key={matter.id}
                    matter={matter}
                    onEdit={handleEditMatter}
                    onDelete={handleDeleteMatter}
                  />
                ))
              ) : (
                <Text c="dimmed" ta="center" py="xl">
                  No matters found for this customer
                </Text>
              )}
            </Stack>
          </ScrollArea>
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
          <Badge
            variant="light"
            color={getStatusColor(matter.status)}
            size="sm"
          >
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
