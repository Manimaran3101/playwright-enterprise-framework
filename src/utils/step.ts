import { test } from '@playwright/test';

/**
 * Method decorator that wraps a page-object or API-client method in `test.step`,
 * so the HTML report and trace show readable business steps instead of raw clicks.
 *
 *   @step('Add product to cart')
 *   async addToCart() { ... }
 *
 * Without a title, the step is named `ClassName.methodName`.
 */
export function step(title?: string) {
  return function <This, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
  ) {
    return function replacement(this: This, ...args: Args): Promise<Return> {
      const className = (this as { constructor: { name: string } }).constructor.name;
      const name = title ?? `${className}.${String(context.name)}`;
      return test.step(name, () => target.call(this, ...args), { box: true });
    };
  };
}
