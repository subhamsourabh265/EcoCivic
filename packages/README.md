# Shared packages

- `ui/src/components`, `ui/src/tokens`, `ui/src/styles`: reusable accessible UI and visual foundations.
- `auth/src`: OIDC integration, authentication state, and role-aware UI helpers. Backend authorization remains mandatory.
- `types/src/api`, `types/src/events`, `types/src/domain`: explicit API/event contracts and shared domain vocabulary. TypeScript types do not replace runtime validation.
- `utilities/src`: small framework-independent helpers.

Each package has a `tests/` directory. Add manifests and explicit exports as implementations are introduced; avoid imports into another package's private files.
