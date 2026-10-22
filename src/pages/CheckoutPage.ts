import type { Locator, Page } from '@playwright/test';
import { step } from '@utils/step';
import { CartPage } from './CartPage';

export type PaymentMethod =
  'bank-transfer' | 'cash-on-delivery' | 'credit-card' | 'buy-now-pay-later' | 'gift-card';

/**
 * The 4-step checkout wizard (cart → sign in → billing address → payment).
 * Extends CartPage because step 1 *is* the cart.
 */
export class CheckoutPage extends CartPage {
  readonly proceedAsSignedInButton: Locator;
  readonly billing: Record<
    'country' | 'postalCode' | 'houseNumber' | 'street' | 'city' | 'state',
    Locator
  >;
  readonly proceedFromAddressButton: Locator;
  readonly paymentMethodSelect: Locator;
  readonly finishButton: Locator;
  readonly checkPaymentButton: Locator;
  readonly confirmButton: Locator;
  readonly paymentSuccessMessage: Locator;
  readonly orderConfirmation: Locator;
  readonly invoiceNumber: Locator;

  constructor(page: Page) {
    super(page);
    this.proceedAsSignedInButton = page.getByTestId('proceed-2');
    this.billing = {
      country: page.getByTestId('country'),
      postalCode: page.getByTestId('postal_code'),
      houseNumber: page.getByTestId('house_number'),
      street: page.getByTestId('street'),
      city: page.getByTestId('city'),
      state: page.getByTestId('state'),
    };
    this.proceedFromAddressButton = page.getByTestId('proceed-3');
    this.paymentMethodSelect = page.getByTestId('payment-method');
    this.finishButton = page.getByTestId('finish');
    // One element changes role: "Check payment" → (payment accepted) → "Confirm".
    // Targeting each state by text makes clicks wait for the right state.
    this.checkPaymentButton = this.finishButton.filter({ hasText: 'Check payment' });
    this.confirmButton = this.finishButton.filter({ hasText: 'Confirm' });
    this.paymentSuccessMessage = page.getByTestId('payment-success-message');
    // The confirmation has no data-test hook; the id is the most stable option.
    this.orderConfirmation = page.locator('#order-confirmation');
    this.invoiceNumber = this.orderConfirmation.locator('span');
  }

  @step('Checkout: proceed from cart')
  async proceedFromCart(): Promise<void> {
    await this.proceedButton.click();
  }

  @step('Checkout: continue as signed-in user')
  async proceedAsSignedIn(): Promise<void> {
    await this.proceedAsSignedInButton.click();
  }

  @step('Checkout: confirm billing address')
  async proceedFromBillingAddress(): Promise<void> {
    await this.proceedFromAddressButton.click();
  }

  /** Cash on delivery needs no payment details, so no card or bank data is ever typed. */
  @step('Checkout: pay')
  async pay(
    method: Extract<PaymentMethod, 'cash-on-delivery'> = 'cash-on-delivery',
  ): Promise<void> {
    await this.paymentMethodSelect.selectOption(method);
    await this.checkPaymentButton.click();
  }

  @step('Checkout: confirm order')
  async confirmOrder(): Promise<void> {
    await this.confirmButton.click();
  }
}
