import { expect as base } from '@playwright/test';
import { z } from 'zod';

// expect(body).toMatchSchema(ProductSchema). On failure it prints every wrong field.
export const expect = base.extend({
  toMatchSchema(received: unknown, schema: z.ZodType) {
    const result = schema.safeParse(received);
    return {
      pass: result.success,
      name: 'toMatchSchema',
      message: () =>
        result.success
          ? 'Expected value NOT to match the schema, but it did'
          : `Response does not match the API contract:\n${z.prettifyError(result.error)}`,
    };
  },
});
