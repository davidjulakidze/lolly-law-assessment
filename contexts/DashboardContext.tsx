'use client';

import { createContext, ReactNode, useContext, useMemo, useReducer } from 'react';
import { Customer, Matter } from '@/types';

export interface DashboardState {
  // Customer state
  customers: Customer[];
  selectedCustomer: Customer | null;
  searchTerm: string;

  // Pagination state
  customerCurrentPage: number;
  matterCurrentPage: number;

  // Matter state
  selectedMatter: Matter | null;
  loadingMatters: boolean;
  mattersError: string | null;

  // Modal state
  addCustomerOpened: boolean;
  editCustomerOpened: boolean;
  deleteCustomerOpened: boolean;
  addMatterOpened: boolean;
  editMatterOpened: boolean;
  deleteMatterOpened: boolean;
}

export type DashboardAction =
  // Customer actions
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: number }
  | { type: 'SELECT_CUSTOMER'; payload: Customer | null }
  | { type: 'SET_SEARCH_TERM'; payload: string }

  // Pagination actions
  | { type: 'SET_CUSTOMER_PAGE'; payload: number }
  | { type: 'SET_MATTER_PAGE'; payload: number }
  | { type: 'RESET_CUSTOMER_PAGE' }
  | { type: 'RESET_MATTER_PAGE' }

  // Matter actions
  | { type: 'SET_CUSTOMER_MATTERS'; payload: Matter[] }
  | { type: 'ADD_MATTER'; payload: Matter }
  | { type: 'UPDATE_MATTER'; payload: Matter }
  | { type: 'DELETE_MATTER'; payload: number }
  | { type: 'SELECT_MATTER'; payload: Matter | null }
  | { type: 'SET_LOADING_MATTERS'; payload: boolean }
  | { type: 'SET_MATTERS_ERROR'; payload: string | null }

  // Modal actions
  | { type: 'OPEN_ADD_CUSTOMER_MODAL' }
  | { type: 'CLOSE_ADD_CUSTOMER_MODAL' }
  | { type: 'OPEN_EDIT_CUSTOMER_MODAL' }
  | { type: 'CLOSE_EDIT_CUSTOMER_MODAL' }
  | { type: 'OPEN_DELETE_CUSTOMER_MODAL' }
  | { type: 'CLOSE_DELETE_CUSTOMER_MODAL' }
  | { type: 'OPEN_ADD_MATTER_MODAL' }
  | { type: 'CLOSE_ADD_MATTER_MODAL' }
  | { type: 'OPEN_EDIT_MATTER_MODAL' }
  | { type: 'CLOSE_EDIT_MATTER_MODAL' }
  | { type: 'OPEN_DELETE_MATTER_MODAL' }
  | { type: 'CLOSE_DELETE_MATTER_MODAL' };

// Initial state
export const initialState: DashboardState = {
  customers: [],
  selectedCustomer: null,
  searchTerm: '',
  customerCurrentPage: 1,
  matterCurrentPage: 1,
  selectedMatter: null,
  loadingMatters: false,
  mattersError: null,
  addCustomerOpened: false,
  editCustomerOpened: false,
  deleteCustomerOpened: false,
  addMatterOpened: false,
  editMatterOpened: false,
  deleteMatterOpened: false,
};

export function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    // Customer actions
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };

    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };

    case 'UPDATE_CUSTOMER': {
      const updatedCustomers = state.customers.map((customer) =>
        customer.id === action.payload.id ? action.payload : customer
      );
      const updatedSelectedCustomer =
        state.selectedCustomer?.id === action.payload.id
          ? { ...state.selectedCustomer, ...action.payload }
          : state.selectedCustomer;

      return {
        ...state,
        customers: updatedCustomers,
        selectedCustomer: updatedSelectedCustomer,
      };
    }

    case 'DELETE_CUSTOMER': {
      const filteredCustomers = state.customers.filter(
        (customer) => customer.id !== action.payload
      );
      const clearedSelectedCustomer =
        state.selectedCustomer?.id === action.payload ? null : state.selectedCustomer;

      return {
        ...state,
        customers: filteredCustomers,
        selectedCustomer: clearedSelectedCustomer,
      };
    }

    case 'SELECT_CUSTOMER':
      return { ...state, selectedCustomer: action.payload };

    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };

    // Pagination actions
    case 'SET_CUSTOMER_PAGE':
      return { ...state, customerCurrentPage: action.payload };

    case 'SET_MATTER_PAGE':
      return { ...state, matterCurrentPage: action.payload };

    case 'RESET_CUSTOMER_PAGE':
      return { ...state, customerCurrentPage: 1 };

    case 'RESET_MATTER_PAGE':
      return { ...state, matterCurrentPage: 1 };

    // Matter actions
    case 'SET_CUSTOMER_MATTERS':
      return {
        ...state,
        selectedCustomer: state.selectedCustomer
          ? { ...state.selectedCustomer, matters: action.payload }
          : null,
      };

    case 'ADD_MATTER':
      return {
        ...state,
        selectedCustomer: state.selectedCustomer
          ? {
              ...state.selectedCustomer,
              matters: [...(state.selectedCustomer.matters || []), action.payload],
            }
          : null,
      };

    case 'UPDATE_MATTER':
      return {
        ...state,
        selectedCustomer: state.selectedCustomer
          ? {
              ...state.selectedCustomer,
              matters:
                state.selectedCustomer.matters?.map((matter) =>
                  matter.id === action.payload.id ? action.payload : matter
                ) || [],
            }
          : null,
      };

    case 'DELETE_MATTER':
      return {
        ...state,
        selectedCustomer: state.selectedCustomer
          ? {
              ...state.selectedCustomer,
              matters:
                state.selectedCustomer.matters?.filter((matter) => matter.id !== action.payload) ||
                [],
            }
          : null,
      };

    case 'SELECT_MATTER':
      return { ...state, selectedMatter: action.payload };

    case 'SET_LOADING_MATTERS':
      return { ...state, loadingMatters: action.payload };

    case 'SET_MATTERS_ERROR':
      return { ...state, mattersError: action.payload };

    // Modal actions
    case 'OPEN_ADD_CUSTOMER_MODAL':
      return { ...state, addCustomerOpened: true };
    case 'CLOSE_ADD_CUSTOMER_MODAL':
      return { ...state, addCustomerOpened: false };

    case 'OPEN_EDIT_CUSTOMER_MODAL':
      return { ...state, editCustomerOpened: true };
    case 'CLOSE_EDIT_CUSTOMER_MODAL':
      return { ...state, editCustomerOpened: false };

    case 'OPEN_DELETE_CUSTOMER_MODAL':
      return { ...state, deleteCustomerOpened: true };
    case 'CLOSE_DELETE_CUSTOMER_MODAL':
      return { ...state, deleteCustomerOpened: false };

    case 'OPEN_ADD_MATTER_MODAL':
      return { ...state, addMatterOpened: true };
    case 'CLOSE_ADD_MATTER_MODAL':
      return { ...state, addMatterOpened: false };

    case 'OPEN_EDIT_MATTER_MODAL':
      return { ...state, editMatterOpened: true };
    case 'CLOSE_EDIT_MATTER_MODAL':
      return { ...state, editMatterOpened: false };

    case 'OPEN_DELETE_MATTER_MODAL':
      return { ...state, deleteMatterOpened: true };
    case 'CLOSE_DELETE_MATTER_MODAL':
      return { ...state, deleteMatterOpened: false };

    default:
      return state;
  }
}

export const DashboardContext = createContext<{
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
} | null>(null);

export function DashboardProvider({
  children,
  initialCustomers,
}: Readonly<{
  children: ReactNode;
  initialCustomers: Customer[];
}>) {
  const [state, dispatch] = useReducer(dashboardReducer, {
    ...initialState,
    customers: initialCustomers,
  });

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
