import { test } from '@playwright/test';

// Decorator that runs the method inside test.step, so it shows as a step in the
// report and trace. Example: @step('Add product to cart').
// Without a title the step is called ClassName.methodName.
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
