import { z } from 'zod';

// API response schemas. The types in types.ts are made from these, and the contract
// tests check the real responses with them. Not strict: a new field is OK, a missing
// field or a wrong type fails.

const id = z.string().min(1);

export const ProductSchema = z.object({
  id,
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  is_location_offer: z.boolean(),
  is_rental: z.boolean(),
  in_stock: z.boolean(),
  co2_rating: z.string().nullable().optional(),
  category: z.object({ id, name: z.string(), slug: z.string() }),
  brand: z.object({ id, name: z.string() }),
  product_image: z.object({ id, file_name: z.string(), title: z.string() }).nullable(),
});

export const paginated = <T extends z.ZodType>(item: T) =>
  z.object({
    current_page: z.number().int().positive(),
    last_page: z.number().int().nonnegative(),
    per_page: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    data: z.array(item),
  });

export const TokenSchema = z.object({
  access_token: z.string().min(20),
  token_type: z.string().regex(/^bearer$/i),
  expires_in: z.number().int().positive(),
});

export const UserSchema = z.object({
  id,
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  phone: z.string().nullable(),
  dob: z.string().nullable(),
  address: z.object({
    street: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string().nullable(),
    postal_code: z.string().nullable(),
  }),
});

export const InvoiceLineSchema = z.object({
  id,
  product_id: id,
  quantity: z.number().int().positive(),
  unit_price: z.number().nonnegative(),
});

export const InvoiceSchema = z.object({
  id,
  invoice_number: z.string().regex(/^INV-\d+$/),
  invoice_date: z.string(),
  billing_city: z.string().nullable(),
  billing_country: z.string().nullable(),
  subtotal: z.number().nonnegative().nullable(),
  total: z.number().nonnegative(),
  status: z.string(),
  invoicelines: z.array(InvoiceLineSchema).optional(),
});

export const ErrorSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
});
