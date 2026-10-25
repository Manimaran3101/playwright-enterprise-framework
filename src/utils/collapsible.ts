import { expect, type Locator } from '@playwright/test';

// Opens the hamburger menu or filter panel on mobile. On desktop the toggle is hidden, so this does nothing.
export async function expandIfCollapsed(toggle: Locator): Promise<void> {
  if (!(await toggle.isVisible())) return;
  if ((await toggle.getAttribute('aria-expanded')) === 'true') return;
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
}
