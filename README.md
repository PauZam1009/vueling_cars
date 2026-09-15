# Vueling Car Rental — Fare Selection E2E Tests

End-to-end test suite that validates the Basic and Premium insurance rate
selection flow on [cars.vueling.com](https://cars.vueling.com/), from the
search form through to the Driver Information page.

## Tech stack

- **Test runner:** [Playwright](https://playwright.dev/)
- **Language:** TypeScript
- **Pattern:** Page Object Model (POM)

> **Note on tooling:** the original assignment specified Cypress + TypeScript.
> This implementation uses Playwright instead, as agreed beforehand, since
> it's the tool I currently work with. All required concepts (`describe`,
> lifecycle hooks, fixtures, cookie clearing, etc.) were mapped to their
> Playwright equivalents — see the "Cypress → Playwright mapping" section
> below.

## Project structure

```
vueling-car-rental/
├── fixtures/
│   └── testData.json          # Test data: pickup location, driver age, insurance types
├── pages/
│   ├── SearchPage.ts           # Search form: location, dates, driver age
│   ├── CarSelectionPage.ts     # Car carousel + SUV selection
│   ├── FarePage.ts             # Basic / Premium insurance selection
│   └── DriverInfoPage.ts       # Driver info page (coverage verification)
├── tests/
│   └── car-rental-fare-selection.spec.ts
├── playwright.config.ts
└── package.json
```

## Setup

```bash
npm install
```

## Running the tests

```bash
# Run all tests headless
npx playwright test

# Run with the browser visible
npx playwright test --headed

# Step through the test interactively
npx playwright test --debug

# View the HTML report after a run
npx playwright show-report
```

Both test cases run at a **430x932** viewport, configured globally in
`playwright.config.ts`.

## Test scenario

1. Navigate to the site and search for a car:
   - Pickup location: Barcelona Airport
   - Pickup date: today + 3 days
   - Return date: today + 5 days
   - Driver age: 40
2. Select the first SUV listed.
3. **Case 1 — Basic fare:** select the Basic insurance plan and verify it's
   reflected on the Driver Information page.
4. **Case 2 — Premium fare:** select the Premium insurance plan and verify
   it's reflected on the Driver Information page.

Both cases share the exact same flow except for the insurance type, so the
logic lives in a single parametrized helper, `selectFareAndVerify()`, and
each `test()` only supplies which fare to run
(see `tests/car-rental-fare-selection.spec.ts`).

## Assertions covered

- The search page loads correctly (URL + search form visible).
- The selected car is an SUV (category visible in the carousel before
  clicking).
- The selected fare button (Basic/Premium) is visible before confirming.
- The Driver Information page reflects the correct coverage.

## Design notes / things worth knowing

- **Dynamic dates:** pickup/return dates are calculated at runtime
  (`today + N days`), never hardcoded, so the suite stays valid regardless
  of when it's run.
- **Autocomplete needs a real click before typing.** The pickup location
  field is an Angular autocomplete; without an explicit `.click()` before
  `.fill()`, the dropdown never opens.
- **"Basic" is displayed as "Limited".** The site's own UI shows
  `Limited` (not `Basic`) as the coverage label on the Driver Info page.
  `testData.json` keeps the fixture values as specified in the requirements
  (`"Basic"` / `"Premium"`); the mapping to the on-screen label is handled
  in the test itself.
- **The car selection opens a new tab (popup),** and the coverage page can
  briefly open a second, short-lived popup before settling on the final
  URL. Instead of trusting a single `Page` reference captured early on, the
  test re-queries `context.pages()` at the point of use and waits for the
  `details-with-payment` URL before reading any text — this avoids racing
  against tabs the site closes automatically.
- **Driver age uses the "Other" option**, typing `40` explicitly, rather
  than relying on the default `30-69` range that's pre-selected on the
  site. This keeps the test's intent explicit and makes it resilient if the
  default range ever changes.

## Cypress → Playwright mapping

| Requirement (Cypress)         | Playwright equivalent                          |
|--------------------------------|------------------------------------------------|
| `describe()`                   | `test.describe()`                               |
| `before()` / `after()`         | `test.beforeAll()` / `test.afterAll()`          |
| `beforeEach()` / `afterEach()` | `test.beforeEach()` / `test.afterEach()`        |
| `it()`                         | `test()`                                        |
| `cy.clearCookies()`            | `context.clearCookies()`                        |