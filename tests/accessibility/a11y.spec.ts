import { test, expect } from '@fixtures/index';
import { KNOWN_A11Y_ISSUES } from './known-issues';

const pages = [
  { name: 'home', path: '/', ready: 'product-name' },
  { name: 'login', path: '/auth/login', ready: 'login-form' },
  { name: 'register', path: '/auth/register', ready: 'register-form' },
] as const;

test.describe('Accessibility (WCAG 2.1 AA)', { tag: ['@a11y', '@regression'] }, () => {
  for (const { name, path, ready } of pages) {
    test(`${name} page has no new critical or serious violations`, async ({
      page,
      makeAxeBuilder,
    }, testInfo) => {
      await page.goto(path);
      await expect(page.getByTestId(ready).first()).toBeVisible();

      const results = await makeAxeBuilder().analyze();

      // Full report attached to the HTML report for triage, whatever the outcome.
      await testInfo.attach(`axe-${name}.json`, {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
      });

      const known = KNOWN_A11Y_ISSUES[name] ?? {};
      const blocking = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );

      for (const v of blocking.filter((v) => v.id in known)) {
        testInfo.annotations.push({
          type: 'known a11y issue',
          description: `${v.id}: ${known[v.id]}`,
        });
      }
      for (const id of Object.keys(known).filter((id) => !blocking.some((v) => v.id === id))) {
        testInfo.annotations.push({
          type: 'a11y issue resolved',
          description: `${id} no longer occurs — remove it from known-issues.ts`,
        });
      }

      const newViolations = blocking
        .filter((v) => !(v.id in known))
        .map((v) => `${v.impact}: ${v.id} — ${v.help} (${v.nodes.length} element(s))`);

      expect(newViolations, 'new critical/serious accessibility violations').toEqual([]);
    });
  }
});
