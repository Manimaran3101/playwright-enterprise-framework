import type { Paginated, Product } from '@data/types';
import { step } from '@utils/step';
import { BaseApiClient } from './BaseApiClient';

export class ProductsClient extends BaseApiClient {
  @step('API: list products')
  async list(params: Record<string, string | number> = {}): Promise<Paginated<Product>> {
    return this.send<Paginated<Product>>('get', '/products', { params });
  }

  @step('API: get product')
  async get(id: string): Promise<Product> {
    return this.send<Product>('get', `/products/${id}`);
  }

  @step('API: search products')
  async search(q: string): Promise<Paginated<Product>> {
    return this.send<Paginated<Product>>('get', '/products/search', { params: { q } });
  }

  /** First product that is in stock and not a rental, so it can be bought. */
  async firstPurchasable(): Promise<Product> {
    const { data } = await this.list({ is_rental: 'false' });
    const product = data.find((p) => p.in_stock && !p.is_rental);
    if (!product) throw new Error('No purchasable product found on page 1');
    return product;
  }
}
