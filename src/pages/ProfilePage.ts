import type { Locator, Page } from '@playwright/test';
import { step } from '@utils/step';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  protected readonly path = '/account/profile';
  readonly title: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly street: Locator;
  readonly postalCode: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly country: Locator;
  readonly updateButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('page-title');
    this.firstName = page.getByTestId('first-name');
    this.lastName = page.getByTestId('last-name');
    this.email = page.getByTestId('email');
    this.phone = page.getByTestId('phone');
    this.street = page.getByTestId('street');
    this.postalCode = page.getByTestId('postal_code');
    this.city = page.getByTestId('city');
    this.state = page.getByTestId('state');
    this.country = page.getByTestId('country');
    this.updateButton = page.getByTestId('update-profile-submit');
  }

  @step('Update phone number in profile')
  async updatePhone(phone: string): Promise<void> {
    await this.phone.fill(phone);
    await this.updateButton.click();
  }
}
