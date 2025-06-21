export interface Navigation {
  href: string;
  label: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: Date;
  matters?: Matter[];
}

export interface Matter {
  id: number;
  title: string;
  description: string | null;
  status: string;
  customerId: number;
}
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface CustomersResponse {
  customers: Customer[];
  pagination: PaginationInfo;
}

export interface MattersResponse {
  matters: Matter[];
  pagination: PaginationInfo;
}
