# Backend services

Each service will be a separate NestJS application with domain modules under `src/modules/`, service-local shared code under `src/common/`, configuration under `src/config/`, and integration tests under `test/`.

Within a domain module, add controllers, providers/services, DTOs, and repositories when implementing the feature. Avoid empty implementation files or premature abstractions.

- `api-gateway`: public routes, token validation, rate limiting, and routing to domain services.
- `identity-service`: profiles and application role mappings linked to external OIDC identities.
- `issue-service`: reports, confirmations, comments, and authorized status transitions.
- `impact-service`: impact metrics, analytics queries, and later event-driven projections.

Domain services have `database/migrations/` and `database/seeds/`. Choose the database and ORM in phase 3 before adding schemas. Keep each service's data ownership explicit.

Add event publishers and consumers in phase 9 with versioned contracts, retry policies, and idempotent handlers.
