import AxeBuilder from '@axe-core/playwright';
import { test as base } from '@playwright/test';

export interface A11yFixtures {
  /** Pre-configured axe scanner: WCAG 2.1 A/AA rules, third-party widgets excluded. */
  makeAxeBuilder: () => AxeBuilder;
}

export const test = base.extend<A11yFixtures>({
  makeAxeBuilder: async ({ page }, use) => {
    await use(() =>
      new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        // Floating chat / live-activity widgets are not part of the product under test.
        .exclude('[data-test="chat-toggle"]')
        .exclude('[data-test="live-activity-toggle"]'),
    );
  },
});
