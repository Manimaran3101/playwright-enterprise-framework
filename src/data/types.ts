import type { z } from 'zod';
import type {
  InvoiceLineSchema,
  InvoiceSchema,
  ProductSchema,
  TokenSchema,
  UserSchema,
} from './schemas';

// Response types come from the Zod schemas.
export type Product = z.infer<typeof ProductSchema>;
export type TokenResponse = z.infer<typeof TokenSchema>;
export type UserResponse = z.infer<typeof UserSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoiceLine = z.infer<typeof InvoiceLineSchema>;

export interface Paginated<T> {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: T[];
}

// Request bodies, written by hand with the API field names.

export interface Address {
  street: string;
  house_number: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface UserData {
  first_name: string;
  last_name: string;
  dob: string;
  phone: string;
  email: string;
  password: string;
  address: Address;
}

export interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  product: Product;
}

export interface Cart {
  id: string;
  cart_items: CartItem[];
}
