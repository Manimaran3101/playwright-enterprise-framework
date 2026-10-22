import type { Locator, Page } from '@playwright/test';
import { step } from '@utils/step';
import { BasePage } from './BasePage';
import { ProductGridComponent } from './components/ProductGridComponent';

export class HomePage extends BasePage {
  protected readonly path = '/';
  readonly products: ProductGridComponent;
  readonly searchInput: Locator;
  readonly searchSubmit: Locator;
  readonly searchCaption: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.products = new ProductGridComponent(page);
    this.searchInput = page.getByTestId('search-query');
    this.searchSubmit = page.getByTestId('search-submit');
    this.searchCaption = page.getByTestId('search-caption');
    this.sortSelect = page.getByTestId('sort');
  }

  @step('Search for product')
  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchSubmit.click();
  }
}
