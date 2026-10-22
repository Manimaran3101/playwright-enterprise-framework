import type { Locator, Page } from '@playwright/test';
import { step } from '@utils/step';

/** The product card grid used on the home page and category pages. */
export class ProductGridComponent {
  readonly cards: Locator;
  readonly names: Locator;
  readonly prices: Locator;

  constructor(page: Page) {
    this.cards = page.locator('a[data-test^="product-"]');
    this.names = page.getByTestId('product-name');
    this.prices = page.getByTestId('product-price');
  }

  async productNames(): Promise<string[]> {
    await this.names.first().waitFor();
    return (await this.names.allTextContents()).map((n) => n.trim());
  }

  @step('Open product from grid')
  async openProduct(name: string): Promise<void> {
    await this.cards.filter({ has: this.names.getByText(name, { exact: true }) }).click();
  }
}
