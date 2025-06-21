'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { CustomersResponse, Matter, MattersResponse } from '@/types';

export function useDashboardActions() {
  const { dispatch } = useDashboard();

  const fetchCustomers = async (page: number = 1, limit: number = 10, search: string = '') => {
    dispatch({ type: 'SET_LOADING_CUSTOMERS', payload: true });
    dispatch({ type: 'SET_CUSTOMERS_ERROR', payload: null });

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/customers?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data: CustomersResponse = await response.json();
      dispatch({ type: 'SET_CUSTOMERS', payload: data.customers });
      dispatch({ type: 'SET_CUSTOMER_PAGINATION', payload: data.pagination });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'SET_CUSTOMERS_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING_CUSTOMERS', payload: false });
    }
  };

  const fetchCustomerMatters = async (
    customerId: number,
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ) => {
    dispatch({ type: 'SET_LOADING_MATTERS', payload: true });
    dispatch({ type: 'SET_MATTERS_ERROR', payload: null });

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/customers/${customerId}/matters?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch matters');
      }

      const data: MattersResponse = await response.json();
      dispatch({ type: 'SET_CUSTOMER_MATTERS', payload: data.matters });
      dispatch({ type: 'SET_MATTER_PAGINATION', payload: data.pagination });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'SET_MATTERS_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING_MATTERS', payload: false });
    }
  };

  const handleCustomerSelect = (customer: any, currentSelectedCustomer: any) => {
    if (currentSelectedCustomer && currentSelectedCustomer.id === customer.id) {
      dispatch({ type: 'SELECT_CUSTOMER', payload: null });
      dispatch({ type: 'SET_MATTER_PAGINATION', payload: null });
    } else {
      dispatch({ type: 'SELECT_CUSTOMER', payload: customer });
      fetchCustomerMatters(customer.id);
    }
  };

  const handleCustomerAdded = (newCustomer: any) => {
    dispatch({ type: 'ADD_CUSTOMER', payload: newCustomer });
  };

  const handleCustomerUpdated = (updatedCustomer: any) => {
    dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
  };

  const handleCustomerDeleted = (deletedCustomerId: number) => {
    dispatch({ type: 'DELETE_CUSTOMER', payload: deletedCustomerId });
  };

  const handleMatterAdded = (newMatter: Matter) => {
    dispatch({ type: 'ADD_MATTER', payload: newMatter });
  };

  const handleMatterUpdated = (updatedMatter: Matter) => {
    dispatch({ type: 'UPDATE_MATTER', payload: updatedMatter });
  };

  const handleMatterDeleted = (deletedMatterId: number) => {
    dispatch({ type: 'DELETE_MATTER', payload: deletedMatterId });
  };

  const handleEditMatter = (matter: Matter) => {
    dispatch({ type: 'SELECT_MATTER', payload: matter });
    dispatch({ type: 'OPEN_EDIT_MATTER_MODAL' });
  };

  const handleDeleteMatter = (matter: Matter) => {
    dispatch({ type: 'SELECT_MATTER', payload: matter });
    dispatch({ type: 'OPEN_DELETE_MATTER_MODAL' });
  };

  return {
    fetchCustomers,
    fetchCustomerMatters,
    handleCustomerSelect,
    handleCustomerAdded,
    handleCustomerUpdated,
    handleCustomerDeleted,
    handleMatterAdded,
    handleMatterUpdated,
    handleMatterDeleted,
    handleEditMatter,
    handleDeleteMatter,
  };
}
