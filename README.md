# EcoCivic

Community environmental action platform: report civic issues, confirm nearby reports, track resolutions, participate in initiatives, and measure community impact.

Phases 1 and 2 are implemented: a pnpm workspace with shared tooling and CI, plus a React shell and working Issues UI. The Issues package is imported directly by the shell; Module Federation is the next phase. Community, Analytics, and NestJS services remain placeholders.

## Getting started

Use Node.js 24 (the reproducible development/CI version is recorded in `.nvmrc`) and pnpm 10.34.5. With a Node version manager, install and select the version in `.nvmrc`; on nvm-windows, pass that version explicitly to `nvm install` and `nvm use`.

```sh
npm install --global pnpm@10.34.5
pnpm install --frozen-lockfile
pnpm check
pnpm dev
```

If you prefer not to install pnpm globally, use `npm exec --yes --package=pnpm@10.34.5 -- pnpm <command>` instead. Run all commands from the repository root.

Open **http://127.0.0.1:5173** after starting the development server. No environment file, database, credentials, or Docker services are needed. `.env.example` documents future conventions; it is not automatically loaded.

## Try the reporting flow

1. Browse the six fictional community reports and combine search, category, priority, and status filters.
2. Select **Report an issue**, enter a title, public location, category, priority, and description, then submit.
3. See the success message and report timeline, return to the feed, and search for your report.
4. Refresh the page: reports persist in local storage for this browser and origin.

This is a browser-only demo. Reports are not shared between users or sent to an authority. Confirmations and historical status updates are synthetic. Photos, map selection, authentication, and status changes will arrive in later phases. The only external UI resource is Google Fonts, with system-font fallbacks.

To reset the demo, remove only the `ecocivic.demo.issues.v1` local-storage entry in browser developer tools and reload. That removes locally created reports and reseeds the six examples. To inspect error recovery, temporarily set that entry to invalid JSON and reload; restore or remove it before selecting **Try again**.

For a production-build preview: `pnpm build`, then `pnpm --filter @ecocivic/shell preview`. Static hosting must rewrite application routes such as `/issues/new` to `index.html`.

## Workspace commands

| Command             | Behavior                                                                |
| ------------------- | ----------------------------------------------------------------------- |
| `pnpm dev`          | Starts the shell and integrated Issues UI on port 5173.                 |
| `pnpm build`        | Builds shared packages and the production shell, including Issues.      |
| `pnpm lint`         | Checks JavaScript and TypeScript with ESLint; warnings fail the check.  |
| `pnpm lint:fix`     | Applies available ESLint fixes.                                         |
| `pnpm typecheck`    | Checks the shell, Issues, and shared packages without emitting output.  |
| `pnpm test`         | Runs Vitest and React Testing Library reporting-flow and storage tests. |
| `pnpm format`       | Formats supported source, configuration, and documentation files.       |
| `pnpm format:check` | Checks formatting without writing files.                                |
| `pnpm check`        | Runs formatting, lint, type checks, available tests, and builds.        |

Recursive commands skip packages without the requested script. Add scripts to the remaining applications and services as they are implemented. Issues currently exports source code for the shell's Vite build; it is not yet an independently deployed remote.

To target a package, use `pnpm --filter @ecocivic/types build`. Declare internal dependencies with `workspace:*` when introducing package consumers. pnpm then builds declared dependencies before their dependents.

Commit `pnpm-lock.yaml` with dependency changes. CI uses a frozen install and runs the same checks for pull requests and pushes to `main`. The workflow has not run on GitHub until this repository is pushed there.

See [the full build plan](.agent.md) and [the workspace decision](docs/adr/0001-workspace-foundation.md).

See also [the frontend architecture decision](docs/adr/0002-integrated-issues-ui.md) and [Phase 2 interview notes](docs/interview-prep/phase-2-react.md).

## Repository layout

```text
EcoCivic/
├── apps/
│   ├── shell/                # React host: navigation, routing, auth integration, layout
│   ├── issues-mfe/           # Report creation, search, details, status tracking
│   ├── community-mfe/        # Confirmations, comments, volunteering, initiatives
│   └── analytics-mfe/        # Resolution metrics, hotspots, environmental impact
├── services/
│   ├── api-gateway/          # Public HTTP API, authentication and request routing
│   ├── identity-service/     # Local profiles and role mappings for an external IdP
│   ├── issue-service/        # Reports, confirmations, comments, lifecycle
│   └── impact-service/       # Impact aggregation and analytics projections
├── packages/
│   ├── ui/                   # Shared accessible React components and design tokens
│   ├── auth/                 # Shared browser authentication integration
│   ├── types/                # Versioned API and event contracts
│   └── utilities/            # Framework-independent shared helpers
├── tests/                    # Cross-application integration and E2E scenarios
├── infrastructure/           # Docker, Kubernetes, Helm, Terraform, observability
├── docs/                     # Architecture, decisions, API, security, interview notes
├── scripts/                  # Development, CI, deployment helpers
└── .github/workflows/        # Future independently scoped CI/CD pipelines
```

## Boundaries

- The shell owns global routing, layout, and authentication integration. Each MFE owns its domain UI and will have its own build and deployment configuration.
- TanStack Query will manage server state; application state and local component state remain separate.
- Backend services own their domain data and migrations. A shared database server does not imply shared table ownership.
- The identity service integrates with an external OIDC provider; it is not a custom identity provider. Services must enforce authorization at their own boundaries.
- Shared packages expose stable contracts and reusable concerns, not service repositories or domain implementations.
- Community UI initially uses the issue service for confirmations and comments. A dedicated community service and notification service can be extracted later if needed.
- Impact metrics must distinguish measured results from estimates and document their calculation methods.

## Implementation phases

1. React + TypeScript shell and Issues application.
2. Independently buildable MFEs using Module Federation.
3. NestJS API gateway, domain services, and database persistence.
4. OAuth/OIDC, RBAC, input validation, rate limiting, and security headers.
5. Unit, component, integration, and Playwright end-to-end tests.
6. Docker and CI/CD.
7. Kubernetes, Helm, Terraform, and Azure or GCP deployment.
8. Observability, performance, caching, and resilience.
9. Kafka events, impact analytics, and responsibly evaluated GenAI features.

Empty directories contain `.gitkeep` placeholders so Git can preserve the structure.
