# Playwright Enterprise Framework

Hybrid **UI + API** test automation framework built with [Playwright](https://playwright.dev) and TypeScript, targeting the [Practice Software Testing (Toolshop)](https://practicesoftwaretesting.com) demo application.

> 🚧 Work in progress — built in phases. See the roadmap below.

## Tech stack

- Playwright Test + TypeScript (strict mode)
- ESLint (with `eslint-plugin-playwright`) + Prettier
- Husky + lint-staged pre-commit checks
- Environment presets via `dotenv` (`TEST_ENV=prod | with-bugs | local`)

## Getting started

```bash
npm ci
npx playwright install chromium
cp .env.example .env
npm run test:chromium   # UI tests in Chromium
npm run test:api        # API tests (no browser)
npm run test:smoke      # everything tagged @smoke
npm run report          # open the last HTML report
```

## Project structure

```
src/config/      Environment presets and settings
tests/ui/        Browser end-to-end tests
tests/api/       REST API tests
```

## Roadmap

- [x] Phase 1 — Foundation: tooling, config, environment switching, smoke tests
- [ ] Phase 2 — Architecture: Page Objects, custom fixtures, auth reuse, data factories
- [ ] Phase 3 — Test suites: E2E, API + schema validation, hybrid, mocking, visual, a11y
- [ ] Phase 4 — CI/CD: GitHub Actions, sharding, Allure report on GitHub Pages
- [ ] Phase 5 — Polish: badges, architecture diagram, design decisions
