import type { Paginated, Product } from '../types';

/** Deterministic catalogue for mocked and visual tests — independent of the live database. */
export function mockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: '01MOCKPRODUCT0000000000001',
    name: 'Mock Combination Pliers',
    description: 'Deterministic product used by mocked tests.',
    price: 14.15,
    is_location_offer: false,
    is_rental: false,
    in_stock: true,
    co2_rating: 'B',
    category: { id: '01MOCKCATEGORY000000000001', name: 'Pliers', slug: 'pliers' },
    brand: { id: '01MOCKBRAND000000000000001', name: 'ForgeFlex Tools' },
    product_image: {
      id: '01MOCKIMAGE000000000000001',
      file_name: 'pliers01.avif',
      title: 'Combination pliers',
    },
    ...overrides,
  };
}

export function mockProductPage(products: Product[]): Paginated<Product> & Record<string, unknown> {
  return {
    current_page: 1,
    last_page: 1,
    per_page: 9,
    total: products.length,
    from: products.length ? 1 : null,
    to: products.length || null,
    data: products,
  };
}

export const MOCK_CATALOGUE: Product[] = [
  mockProduct(),
  mockProduct({
    id: '01MOCKPRODUCT0000000000002',
    name: 'Mock Claw Hammer',
    price: 11.48,
    product_image: {
      id: '01MOCKIMAGE000000000000002',
      file_name: 'hammer01.avif',
      title: 'Hammer',
    },
  }),
  mockProduct({
    id: '01MOCKPRODUCT0000000000003',
    name: 'Mock Out-of-Stock Saw',
    price: 23.0,
    in_stock: false,
    product_image: { id: '01MOCKIMAGE000000000000003', file_name: 'saw01.avif', title: 'Saw' },
  }),
];
