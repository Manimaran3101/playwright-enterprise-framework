import { expect, type Locator } from '@playwright/test';

/**
 * Opens a Bootstrap collapse toggle (hamburger menu, filter panel) only when the
 * responsive layout is actually showing it. On desktop the toggle is hidden, so
 * this is a no-op — page objects can call it unconditionally on every viewport.
 */
export async function expandIfCollapsed(toggle: Locator): Promise<void> {
  if (!(await toggle.isVisible())) return;
  if ((await toggle.getAttribute('aria-expanded')) === 'true') return;
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
}
