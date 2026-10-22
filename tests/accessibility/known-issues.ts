/**
 * Accessibility baseline: violations that already exist in the app and are tracked.
 * Tests fail on any critical/serious violation NOT listed here, so the suite
 * catches regressions today without being permanently red for known debt.
 * When the app fixes one, the test annotates it so this list can be trimmed.
 *
 * Found on 2026-10-22 against practicesoftwaretesting.com (axe-core, WCAG 2.1 AA).
 * The full per-element details are attached to each test in the HTML report.
 */
const BUTTON_NAME = 'Buttons must have discernible text (critical)';
const LABEL_MISMATCH = 'Elements must have their visible text as part of their accessible name';
const LIST = '<ul> and <ol> must only directly contain <li>, <script> or <template> elements';

export const KNOWN_A11Y_ISSUES: Record<string, Record<string, string>> = {
  home: { 'label-content-name-mismatch': LABEL_MISMATCH, list: LIST },
  login: { 'button-name': BUTTON_NAME, 'label-content-name-mismatch': LABEL_MISMATCH },
  register: {
    'button-name': BUTTON_NAME,
    'label-content-name-mismatch': LABEL_MISMATCH,
    list: LIST,
  },
};
