/** Shapes of the Toolshop API payloads we use. Field names mirror the API (snake_case). */

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

export interface UserResponse extends Omit<UserData, 'password'> {
  id: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  is_rental: boolean;
  in_stock: boolean;
  category?: { id: string; name: string };
  brand?: { id: string; name: string };
}

export interface Paginated<T> {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: T[];
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
