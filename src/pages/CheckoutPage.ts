import type { Locator, Page } from '@playwright/test';
import { step } from '@utils/step';
import { CartPage } from './CartPage';

export type PaymentMethod =
  'bank-transfer' | 'cash-on-delivery' | 'credit-card' | 'buy-now-pay-later' | 'gift-card';

// Checkout with 4 steps: cart, sign in, billing address, payment. Step 1 is the cart page.
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
    // Same button: first "Check payment", then "Confirm". Filtering by text makes the
    // click wait for the right text (it was flaky on mobile without this).
    this.checkPaymentButton = this.finishButton.filter({ hasText: 'Check payment' });
    this.confirmButton = this.finishButton.filter({ hasText: 'Confirm' });
    this.paymentSuccessMessage = page.getByTestId('payment-success-message');
    // No data-test attribute here, so I use the id.
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

  // Only cash on delivery, so I never type card or bank details.
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
