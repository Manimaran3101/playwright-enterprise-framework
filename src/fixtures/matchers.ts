import { expect as base } from '@playwright/test';
import { z } from 'zod';

/**
 * Custom matcher: `expect(body).toMatchSchema(ProductSchema)`.
 * On failure it prints every violated field path, not just "parse failed".
 */
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
