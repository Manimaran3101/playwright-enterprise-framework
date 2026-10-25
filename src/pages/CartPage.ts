import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Cart page (step 1 of checkout).
export class CartPage extends BasePage {
  protected readonly path = '/checkout';
  readonly productTitles: Locator;
  readonly productQuantities: Locator;
  readonly linePrices: Locator;
  readonly total: Locator;
  readonly proceedButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitles = page.getByTestId('product-title');
    this.productQuantities = page.getByTestId('product-quantity');
    this.linePrices = page.getByTestId('line-price');
    this.total = page.getByTestId('cart-total');
    this.proceedButton = page.getByTestId('proceed-1');
  }
}
