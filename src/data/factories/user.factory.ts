import { faker } from '@faker-js/faker';
import type { UserData } from '../types';

/**
 * Builds a valid, unique user for registration.
 * Every field can be overridden, so negative tests only state what differs:
 *
 *   buildUser({ password: 'short' })
 */
export function buildUser(overrides: Partial<UserData> = {}): UserData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    first_name: firstName,
    last_name: lastName.slice(0, 20),
    // API accepts ages 18–75
    dob: faker.date.birthdate({ mode: 'age', min: 20, max: 70 }).toISOString().slice(0, 10),
    phone: faker.string.numeric(10),
    // A unique, clearly fake address on a reserved test domain
    email: `pw.${faker.string.alphanumeric(10).toLowerCase()}.${Date.now()}@example.test`,
    password: strongPassword(),
    address: {
      street: faker.location.street().slice(0, 70),
      house_number: faker.string.numeric({ length: { min: 1, max: 3 } }),
      city: faker.location.city().slice(0, 40),
      state: faker.location.state().slice(0, 40),
      // ISO 3166 alpha-2 code: what the register form's <select> submits
      country: 'NL',
      postal_code: `${faker.string.numeric(4)}AB`,
    },
    ...overrides,
  };
}

/** Meets the API rule: upper, lower, digit and symbol, min 8 characters. */
function strongPassword(): string {
  return `${faker.string.alpha({ length: 4, casing: 'upper' })}${faker.string.alpha({ length: 4, casing: 'lower' })}${faker.string.numeric(3)}!#`;
}
