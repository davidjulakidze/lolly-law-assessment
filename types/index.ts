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
