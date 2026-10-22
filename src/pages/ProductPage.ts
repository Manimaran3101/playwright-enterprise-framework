import type { Locator, Page } from '@playwright/test';
import { step } from '@utils/step';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  protected path = '/product';
  readonly name: Locator;
  readonly unitPrice: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly toast: Locator;

  constructor(page: Page) {
    super(page);
    this.name = page.getByTestId('product-name');
    this.unitPrice = page.getByTestId('unit-price');
    this.quantityInput = page.getByTestId('quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.toast = page.getByRole('alert');
  }

  async gotoProduct(productId: string): Promise<void> {
    this.path = `/product/${productId}`;
    await this.goto();
  }

  @step('Add product to cart')
  async addToCart(quantity = 1): Promise<void> {
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
  }
}
