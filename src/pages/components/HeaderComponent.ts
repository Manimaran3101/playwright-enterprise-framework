import type { Locator, Page } from '@playwright/test';
import { expandIfCollapsed } from '@utils/collapsible';
import { step } from '@utils/step';

/** Top navigation bar, shared by every page. */
export class HeaderComponent {
  readonly menuToggle: Locator;
  readonly signInLink: Locator;
  readonly userMenu: Locator;
  readonly signOutLink: Locator;
  readonly cartLink: Locator;
  readonly cartQuantity: Locator;

  constructor(page: Page) {
    this.menuToggle = page.getByRole('button', { name: 'Toggle navigation' });
    this.signInLink = page.getByTestId('nav-sign-in');
    this.userMenu = page.getByTestId('nav-menu');
    this.signOutLink = page.getByTestId('nav-sign-out');
    this.cartLink = page.getByTestId('nav-cart');
    this.cartQuantity = page.getByTestId('cart-quantity');
  }

  /** On mobile widths the nav links live behind a hamburger menu; open it if needed. */
  async expand(): Promise<void> {
    // Wait until Angular has rendered the nav (logged in or out) before checking the toggle.
    await this.signInLink.or(this.userMenu).waitFor({ state: 'attached' });
    await expandIfCollapsed(this.menuToggle);
  }

  @step('Open cart from header')
  async openCart(): Promise<void> {
    await this.expand();
    await this.cartLink.click();
  }

  @step('Sign out')
  async signOut(): Promise<void> {
    await this.expand();
    await this.userMenu.click();
    await this.signOutLink.click();
  }
}
