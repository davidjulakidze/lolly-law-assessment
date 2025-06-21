'use client';

import { Container, Grid, Title } from '@mantine/core';
import { CustomerDetails } from '@/components/CustomerDetails';
import { CustomerList } from '@/components/CustomerList';
import { DashboardModals } from '@/components/DashboardModals';
import { MatterList } from '@/components/MatterList';

export function Dashboard() {
  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl" ta="center">
        Customer & Matter Management
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <CustomerList />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Grid gutter="md">
            <Grid.Col span={12}>
              <CustomerDetails />
            </Grid.Col>
            <Grid.Col span={12}>
              <MatterList />
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>

      <DashboardModals />
    </Container>
  );
}
