# ADR 0002: Integrated Issues UI and replaceable mock API

Status: Accepted

## Decision

Use React with TypeScript and Vite for the shell. Import the Issues workspace package directly for Phase 2. Keep global layout and routes in the shell, and issue pages, domain rules, and API behavior in Issues. Avoid relative imports across workspace boundaries. Federation and independent deployment remain Phase 3 work.

The shell provides React Router and one TanStack Query client. Query data owns the report list and detail cache; mutations invalidate related queries. URL search parameters own shareable feed filters. Controlled component state owns unfinished form input and validation errors. No separate global state store is needed yet.

An `IssuesApi` interface exposes asynchronous list, get, and create operations. The default adapter simulates latency and stores versioned reports in local storage. Tests inject the adapter through context, exercising the same UI without a real network. The backend phase can replace this implementation with HTTP calls.

Sample records and metrics are explicitly labeled as demo data. Reports are local to a browser origin; there are no real users, authorities, photo uploads, or status mutations. Browser storage is not a production persistence mechanism, and multi-tab simultaneous writes are not coordinated.

## Validation and accessibility

Validate trimmed title, location, and description lengths both in the form and at the mock boundary. Show inline errors, focus the first invalid input, preserve input after save failures, and prevent duplicate submissions while pending. Never silently replace damaged stored reports.

Use semantic navigation, headings, labeled controls, a skip link, route-change focus, live status/error messages, visible keyboard focus, and reduced-motion styling. Layouts adapt from a multi-column feed to a single column on phones.

## Testing and consequences

Vitest and React Testing Library cover creation through the feed and timeline, persistence, combined filters, validation, retries, failed saves, empty results, and missing routes. These complement browser inspection; jsdom cannot establish visual layout or full accessibility compliance.

Direct package integration keeps the first feature easy to debug. It does not demonstrate independent releases yet. The mock API is asynchronous but does not test real HTTP contracts, server authorization, or network resilience.

## References

- [Vite guide](https://vite.dev/guide/)
- [React TypeScript guide](https://react.dev/learn/typescript)
- [React Router declarative routing](https://reactrouter.com/start/declarative/routing)
- [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview)
