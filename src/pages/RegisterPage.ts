import type { Locator, Page } from '@playwright/test';
import type { UserData } from '@data/types';
import { step } from '@utils/step';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  protected readonly path = '/auth/register';
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = page.getByTestId('register-submit');
  }

  @step('Register through the UI')
  async register(user: UserData): Promise<void> {
    const field = (id: string) => this.page.getByTestId(id);
    await field('first-name').fill(user.first_name);
    await field('last-name').fill(user.last_name);
    await field('dob').fill(user.dob);
    await field('country').selectOption(user.address.country);
    await field('postal_code').fill(user.address.postal_code);
    await field('house_number').fill(user.address.house_number);
    await field('street').fill(user.address.street);
    await field('city').fill(user.address.city);
    await field('state').fill(user.address.state);
    await field('phone').fill(user.phone);
    await field('email').fill(user.email);
    await field('password').fill(user.password);
    await this.submitButton.click();
  }
}
