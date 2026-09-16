export type UserRole = 'CLIENT' | 'ADMIN';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface UserSummary {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}
