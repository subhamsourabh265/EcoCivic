# EcoCivic

Community environmental action platform: report civic issues, confirm nearby reports, track resolutions, participate in initiatives, and measure community impact.

This repository currently contains a folder scaffold only. Applications, dependencies, build configuration, and deployment pipelines will be added as each phase is implemented.

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

Empty directories contain `.gitkeep` placeholders so Git can preserve the structure. No install or run commands are available yet.
