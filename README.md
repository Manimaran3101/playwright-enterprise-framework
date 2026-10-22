# Playwright Enterprise Framework

Hybrid **UI + API** test automation framework built with [Playwright](https://playwright.dev) and TypeScript, targeting the [Practice Software Testing (Toolshop)](https://practicesoftwaretesting.com) demo application.

> 🚧 Work in progress — built in phases. See the roadmap below.

## Tech stack

- Playwright Test + TypeScript (strict mode)
- ESLint (with `eslint-plugin-playwright`) + Prettier
- Husky + lint-staged pre-commit checks
- Environment presets via `dotenv` (`TEST_ENV=prod | with-bugs | local`)
- Faker test data factories

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
src/
├── config/        Environment presets, auth file paths
├── pages/         Page Objects (BasePage + pages)
│   └── components/  Reusable parts: header, product grid
├── api/           Typed API clients (auth, products, cart)
├── data/          API types + Faker test data factories
├── fixtures/      Custom `test` with pages, API clients and test users injected
└── utils/         @step decorator for readable reports
tests/
├── auth.setup.ts  Registers a user and saves the logged-in session once
├── ui/            Browser end-to-end tests
└── api/           REST API tests
```

## Design decisions

| Decision                                             | Why                                                                                                                                                       |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fresh users via API, not shared demo accounts**    | Public demo accounts get locked by other people's failed logins. Each run registers its own users, so tests are independent and parallel-safe.            |
| **API login + token injection in `auth.setup.ts`**   | Logging in through the UI once per test is slow. The setup project logs in via API, writes the JWT to `localStorage`, and saves `storageState` for reuse. |
| **Tests that mutate a session use their own user**   | Signing out can revoke a token; doing that to the shared saved session would break parallel tests.                                                        |
| **Custom fixtures instead of `new Page()` in tests** | Tests declare what they need (`{ homePage, productsApi, newUser }`); setup and teardown live in one place.                                                |
| **Components inside Page Objects**                   | The header and product grid appear on many pages; composing them avoids duplication.                                                                      |
| **No assertions inside Page Objects**                | Pages describe _how_ to interact; tests own _what_ is expected.                                                                                           |
| **`@step` decorator**                                | Page and API methods appear as named steps in the HTML report and trace viewer.                                                                           |
| **API as the test oracle**                           | e.g. search results in the UI are compared with `/products/search`, rather than guessing expected data.                                                   |
| **`data-test` attributes as selectors**              | Configured via `testIdAttribute`, so `getByTestId()` survives CSS and layout changes.                                                                     |

## Roadmap

- [x] Phase 1 — Foundation: tooling, config, environment switching, smoke tests
- [x] Phase 2 — Architecture: Page Objects, custom fixtures, auth reuse, data factories
- [ ] Phase 3 — Test suites: E2E, API + schema validation, hybrid, mocking, visual, a11y
- [ ] Phase 4 — CI/CD: GitHub Actions, sharding, Allure report on GitHub Pages
- [ ] Phase 5 — Polish: badges, architecture diagram, design decisions
