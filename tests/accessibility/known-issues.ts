// Accessibility issues that are already in the app (found 2026-10-22 with axe, WCAG 2.1 AA).
// The test fails only on a new critical/serious issue. If one here is fixed, the test
// adds a note so I can remove it.
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
