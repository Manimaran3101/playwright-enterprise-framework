import type { Locator, Page } from '@playwright/test';
import { expandIfCollapsed } from '@utils/collapsible';
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
  /** Mobile-only button that reveals the search and filter panel. */
  readonly filtersToggle: Locator;

  constructor(page: Page) {
    super(page);
    this.products = new ProductGridComponent(page);
    this.searchInput = page.getByTestId('search-query');
    this.searchSubmit = page.getByTestId('search-submit');
    this.searchCaption = page.getByTestId('search-caption');
    this.sortSelect = page.getByTestId('sort');
    // data-test="filters" is on both the toggle and the panel; we want the button.
    this.filtersToggle = page.locator('button[data-test="filters"]');
  }

  @step('Search for product')
  async search(term: string): Promise<void> {
    await expandIfCollapsed(this.filtersToggle);
    await this.searchInput.fill(term);
    await this.searchSubmit.click();
  }
}
