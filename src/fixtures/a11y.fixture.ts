import AxeBuilder from '@axe-core/playwright';
import { test as base } from '@playwright/test';

export interface A11yFixtures {
  /** axe scanner with WCAG 2.1 A/AA rules, chat widgets excluded. */
  makeAxeBuilder: () => AxeBuilder;
}

export const test = base.extend<A11yFixtures>({
  makeAxeBuilder: async ({ page }, use) => {
    await use(() =>
      new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        // Chat and live-activity widgets are not part of the shop.
        .exclude('[data-test="chat-toggle"]')
        .exclude('[data-test="live-activity-toggle"]'),
    );
  },
});
