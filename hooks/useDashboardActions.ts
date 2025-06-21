'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { Matter } from '@/types';

export function useDashboardActions() {
  const { dispatch } = useDashboard();

  const fetchCustomerMatters = async (customerId: number) => {
    dispatch({ type: 'SET_LOADING_MATTERS', payload: true });
    dispatch({ type: 'SET_MATTERS_ERROR', payload: null });
    
    try {
      const response = await fetch(`/api/customers/${customerId}/matters`);
      if (!response.ok) {
        throw new Error('Failed to fetch matters');
      }
      const matters: Matter[] = await response.json();
      dispatch({ type: 'SET_CUSTOMER_MATTERS', payload: matters });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'SET_MATTERS_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING_MATTERS', payload: false });
    }
  };

  const handleCustomerSelect = (customer: any) => {
    dispatch({ type: 'SELECT_CUSTOMER', payload: customer });
    fetchCustomerMatters(customer.id);
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

  const setSearchTerm = (term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  };

  return {
    handleCustomerSelect,
    handleCustomerAdded,
    handleCustomerUpdated,
    handleCustomerDeleted,
    handleMatterAdded,
    handleMatterUpdated,
    handleMatterDeleted,
    handleEditMatter,
    handleDeleteMatter,
    setSearchTerm,
  };
}
