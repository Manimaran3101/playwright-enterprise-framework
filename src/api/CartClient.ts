import type { Cart } from '@data/types';
import { step } from '@utils/step';
import { BaseApiClient } from './BaseApiClient';

export class CartClient extends BaseApiClient {
  @step('API: create cart')
  async create(): Promise<string> {
    const { id } = await this.send<{ id: string }>('post', '/carts', { expectedStatus: 201 });
    return id;
  }

  @step('API: add item to cart')
  async addItem(cartId: string, productId: string, quantity = 1): Promise<void> {
    await this.send('post', `/carts/${cartId}`, {
      data: { product_id: productId, quantity },
    });
  }

  @step('API: get cart')
  async get(cartId: string): Promise<Cart> {
    return this.send<Cart>('get', `/carts/${cartId}`);
  }
}
