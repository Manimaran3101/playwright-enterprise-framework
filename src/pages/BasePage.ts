import type { Page } from '@playwright/test';
import { HeaderComponent } from './components/HeaderComponent';

/**
 * Every page object knows its own route and gets the shared header.
 * Pages are thin: they expose locators and user intents, never assertions,
 * so tests stay the single place where expected behaviour lives.
 */
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
