import type { Page } from '@playwright/test';
import { HeaderComponent } from './components/HeaderComponent';

// Base class: each page has its path and the header. No assertions in page objects.
export abstract class BasePage {
  readonly header: HeaderComponent;
  protected abstract readonly path: string;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }
}
