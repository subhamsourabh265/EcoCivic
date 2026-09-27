# Phase 2: React architecture discussion

## Where does state live?

The query client owns asynchronous report data and its cache. Search/category/priority/status live in the URL so browser navigation and links preserve the current view. The form owns its unfinished values and errors. A global store would add coordination without solving a current requirement.

## Why an API boundary before a backend?

Pages depend on asynchronous behavior and domain contracts rather than local storage. A context-injected adapter lets tests exercise failures and success without a live server. Later, the adapter can call the gateway. Client validation improves feedback; it will never replace server validation or authorization.

## How does a report reach the feed?

The form validates input and runs a mutation. On success it puts the returned report into the detail cache, invalidates issue queries, and navigates to the detail page. The feed reads from its query and refreshes stale data. No second report array is maintained in component state.

## Why no memoization everywhere?

The current list is small, and filtering is inexpensive. Memoization adds dependencies and complexity. Measure rendering and interaction costs before introducing it. A real, large feed will need server pagination and filtering before client-side optimization becomes the main concern.

## What is still missing from a production application?

Real backend storage, authenticated identities, authorization, controlled uploads, concurrency handling, pagination, and operational telemetry. The explicit demo label prevents synthetic confirmations and sample lifecycle histories from being mistaken for real civic outcomes.

## Demo sequence

Run `pnpm dev`, combine feed filters, open a report, return to the preserved filters, submit an invalid form, then create a valid report and inspect its timeline. Refresh to demonstrate browser persistence. Run `pnpm test` to show automated coverage of failed reads and writes as well as the successful journey.
