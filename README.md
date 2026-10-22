# Playwright Enterprise Framework

[![CI](https://github.com/Manimaran3101/playwright-enterprise-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/Manimaran3101/playwright-enterprise-framework/actions/workflows/ci.yml)
[![Test report](https://img.shields.io/badge/test%20report-live-2ea44f?logo=playwright)](https://manimaran3101.github.io/playwright-enterprise-framework/)
![Playwright](https://img.shields.io/badge/Playwright-1.64-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Hybrid **UI + API** test automation framework built with [Playwright](https://playwright.dev) and TypeScript, targeting the [Practice Software Testing (Toolshop)](https://practicesoftwaretesting.com) demo application.

**📊 [View the latest test report](https://manimaran3101.github.io/playwright-enterprise-framework/)**, published by CI on every push to `main` and nightly.

## Tech stack

- Playwright Test + TypeScript (strict mode)
- Zod API contracts (types inferred from schemas) + custom `toMatchSchema` matcher
- axe-core accessibility scanning (WCAG 2.1 AA)
- Faker test data factories, deterministic mock catalogue
- ESLint (with `eslint-plugin-playwright`) + Prettier, Husky + lint-staged
- Environment presets via `dotenv` (`TEST_ENV=prod | with-bugs | local`)

## Test coverage

| Suite           | Tag           | What it proves                                                                       |
| --------------- | ------------- | ------------------------------------------------------------------------------------ |
| UI E2E          | `@e2e`        | Full checkout: cart → sign-in → billing → payment → invoice, verified in the backend |
| UI functional   | `@regression` | Register, login, wrong password, sign out, saved session, cart totals                |
| API functional  | `@regression` | Register → login → `/users/me`, duplicate email (409), 401 cases, products           |
| API contract    | `@contract`   | Live responses validated against Zod schemas                                         |
| Hybrid          | `@hybrid`     | API-created data shows in the UI; UI changes are persisted in the API                |
| Network mocking | `@mocked`     | Empty catalogue, exact rendering, extreme values, HTTP 500 handling                  |
| Visual          | `@visual`     | Login form and product grid screenshots (mocked data, masked images)                 |
| Accessibility   | `@a11y`       | No _new_ critical/serious axe violations on key pages                                |
| Smoke           | `@smoke`      | Fast health check of UI and API                                                      |

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

Run any tag with `npx playwright test --grep @a11y`. Update visual baselines with `npm run test:visual:update`.

## CI/CD pipeline

```
quality gate (typecheck · lint · format)
   ├── API tests ──────────────────────┐
   └── UI tests, sharded ──────────────┤   each job starts its own Toolshop
       PR / push: chromium × 2 shards  │   instance with Docker Compose
       nightly:   4 browsers × 2 shards│
                                       ▼
                    merge blob reports → one HTML report
                                       ▼
                    publish to GitHub Pages (main + nightly)
```

- **Hermetic test environment** — [`.github/actions/start-toolshop`](.github/actions/start-toolshop/action.yml) runs the app (Laravel API, Angular UI, MariaDB) inside every CI job, pinned to a commit and freshly seeded. The public demo is behind a Cloudflare bot check that challenges CI runners; testing a private instance avoids that _without_ trying to bypass it, and also removes cold starts and shared data.
- **Sharding + blob reports** — shards run in parallel and their reports are merged into a single HTML report with traces.
- **Linux visual baselines** — [`update-snapshots.yml`](.github/workflows/update-snapshots.yml) regenerates them on the same runner and app version CI uses.
- **Dependabot** keeps npm packages and GitHub Actions current.
- Locally, tests run against the public demo by default (`TEST_ENV=prod`).

## Project structure

```
src/
├── config/        Environment presets, auth file paths
├── pages/         Page Objects (BasePage + pages, checkout wizard)
│   └── components/  Reusable parts: header, product grid
├── api/           Typed API clients (auth, products, cart, invoices)
├── data/
│   ├── schemas.ts   Zod API contracts — the single source of truth for response types
│   ├── factories/   Faker builders for request payloads
│   └── mocks/       Deterministic catalogue for mocked and visual tests
├── fixtures/      pages / api / a11y fixtures merged with mergeTests, custom matchers
└── utils/         @step decorator, API route matcher
tests/
├── auth.setup.ts  Registers a user and saves the logged-in session once
├── ui/            Browser tests (E2E checkout, auth, cart, network mocking)
├── api/           REST API functional + contract tests
├── hybrid/        API ⇄ UI consistency tests
├── visual/        Screenshot comparison (+ committed baselines)
└── accessibility/ axe-core scans + known-issues baseline
```

## Design decisions

| Decision                                                  | Why                                                                                                                                                       |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fresh users via API, not shared demo accounts**         | Public demo accounts get locked by other people's failed logins. Each run registers its own users, so tests are independent and parallel-safe.            |
| **API login + token injection in `auth.setup.ts`**        | Logging in through the UI once per test is slow. The setup project logs in via API, writes the JWT to `localStorage`, and saves `storageState` for reuse. |
| **Tests that mutate a session use their own user**        | Signing out can revoke a token; doing that to the shared saved session would break parallel tests.                                                        |
| **Never hard-code IDs**                                   | The demo database resets and product IDs change. Tests look data up through the API (`firstPurchasable()`).                                               |
| **Fixtures split by concern, merged with `mergeTests`**   | Pages, API clients and a11y tooling stay independent; tests just ask for `{ checkoutPage, invoicesApi }`.                                                 |
| **Components inside Page Objects; no assertions in them** | Shared UI parts are composed, not duplicated. Pages describe _how_ to interact; tests own _what_ is expected.                                             |
| **`@step` decorator**                                     | Page and API methods appear as named steps in the HTML report and trace viewer.                                                                           |
| **Types inferred from Zod schemas**                       | The contract test and the TypeScript types use the same definition, so they can never drift apart.                                                        |
| **Schemas are non-strict**                                | New fields are not a breaking change; missing or retyped fields are.                                                                                      |
| **API as the test oracle**                                | UI search results are compared with `/products/search`; checkout totals are checked against `/invoices`.                                                  |
| **Visual tests on mocked data**                           | Real data changes; mocked data plus masked images keeps screenshots deterministic. Baselines are kept for Chromium only.                                  |
| **Known defects as `test.fail()` with annotations**       | Real bugs stay visible in the report and flip to "unexpectedly passed" when fixed, without keeping the suite red.                                         |
| **Accessibility baseline (ratchet)**                      | Existing violations are listed in `known-issues.ts`; any _new_ critical/serious violation fails the build.                                                |
| **Separate API timeout**                                  | The demo API has occasional 20s+ cold starts; API calls get 30s, UI actions keep 10s.                                                                     |
| **Cash on delivery in checkout**                          | The E2E flow never types card or bank details, even fake ones.                                                                                            |
| **Private app instance in CI**                            | The public demo challenges datacenter IPs (Cloudflare). CI runs its own seeded copy instead of bypassing the check — faster, deterministic, and isolated. |

## Findings in the application under test

Real issues this suite uncovered, each documented by a test:

1. **HTTP 500 on `/products` shows nothing** — the grid renders empty with no error or "no results" message (`network-mocking.spec.ts`).
2. **`/products/search` omits `category.slug`** — the same resource has two shapes depending on the endpoint (`contract.api.spec.ts`).
3. **Accessibility** — buttons without accessible names (critical), label/name mismatches and invalid list markup (`known-issues.ts`).
4. **Shared demo account `customer@…` locked** — by other users' failed logins; the reason this framework creates its own users.

## Roadmap

- [x] Phase 1 — Foundation: tooling, config, environment switching, smoke tests
- [x] Phase 2 — Architecture: Page Objects, custom fixtures, auth reuse, data factories
- [x] Phase 3 — Test suites: E2E, API + schema validation, hybrid, mocking, visual, a11y
- [x] Phase 4 — CI/CD: GitHub Actions, hermetic app in Docker, sharding, merged report on GitHub Pages
- [ ] Phase 5 — Polish: badges, architecture diagram, demo GIF
