'use client';

import { AddCustomer } from '@/components/AddCustomer/AddCustomer';
import { AddMatter } from '@/components/AddMatter/AddMatter';
import { DeleteCustomer } from '@/components/DeleteCustomer/DeleteCustomer';
import { DeleteMatter } from '@/components/DeleteMatter/DeleteMatter';
import { EditCustomer } from '@/components/EditCustomer/EditCustomer';
import { EditMatter } from '@/components/EditMatter/EditMatter';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDashboardActions } from '@/hooks/useDashboardActions';

export function DashboardModals() {
  const { state, dispatch } = useDashboard();
  const {
    handleCustomerAdded,
    handleCustomerUpdated,
    handleCustomerDeleted,
    handleMatterAdded,
    handleMatterUpdated,
    handleMatterDeleted,
  } = useDashboardActions();

  return (
    <>
      {/* Customer Modals */}
      <AddCustomer
        opened={state.addCustomerOpened}
        onClose={() => dispatch({ type: 'CLOSE_ADD_CUSTOMER_MODAL' })}
        onCustomerAdded={handleCustomerAdded}
      />

      <EditCustomer
        opened={state.editCustomerOpened}
        onClose={() => dispatch({ type: 'CLOSE_EDIT_CUSTOMER_MODAL' })}
        customer={state.selectedCustomer}
        onCustomerUpdated={handleCustomerUpdated}
      />

      <DeleteCustomer
        opened={state.deleteCustomerOpened}
        onClose={() => dispatch({ type: 'CLOSE_DELETE_CUSTOMER_MODAL' })}
        customer={state.selectedCustomer}
        onCustomerDeleted={handleCustomerDeleted}
      />

      {/* Matter Modals */}
      <AddMatter
        opened={state.addMatterOpened}
        onClose={() => dispatch({ type: 'CLOSE_ADD_MATTER_MODAL' })}
        customerId={state.selectedCustomer?.id ?? null}
        onMatterAdded={handleMatterAdded}
      />

      <EditMatter
        opened={state.editMatterOpened}
        onClose={() => dispatch({ type: 'CLOSE_EDIT_MATTER_MODAL' })}
        matter={state.selectedMatter}
        onMatterUpdated={handleMatterUpdated}
      />

      <DeleteMatter
        opened={state.deleteMatterOpened}
        onClose={() => dispatch({ type: 'CLOSE_DELETE_MATTER_MODAL' })}
        matter={state.selectedMatter}
        onMatterDeleted={handleMatterDeleted}
      />
    </>
  );
}
