# ADR 0001: Workspace foundation

Status: Accepted

## Context

EcoCivic will contain four frontend applications, four backend services, and four shared packages. Phase 1 needs repeatable dependency installation and consistent checks without prematurely implementing the applications.

## Decision

Use pnpm workspaces across `apps/*`, `services/*`, and `packages/*`. Pin pnpm in the root `packageManager` field, pin direct tooling dependencies, and commit the generated lockfile. Use Node.js 24, with the preferred patch recorded in `.nvmrc` and consumed by CI.

All workspaces are private. Shared packages build explicit ESM entry points and declaration files. Application/service manifests remain placeholders until their frameworks are initialized. The strict TypeScript base stays framework-neutral; library-specific module resolution and emission live in a separate configuration.

Use ESLint flat configuration for code correctness and Prettier for formatting. Do not add overlapping formatting lint rules. Root scripts delegate builds, type checking, development, and tests to packages that provide the corresponding scripts. There are no feature tests or development servers in Phase 1.

GitHub Actions installs from the frozen lockfile and runs formatting, linting, type checking, available tests, and builds with read-only repository permissions. Deployment pipelines arrive later.

## Alternatives and consequences

- npm workspaces could manage these packages, but pnpm matches the agreed roadmap and makes workspace dependencies explicit.
- Nx or Turborepo could add caching and affected-project execution later. Native pnpm orchestration is sufficient for the initial package count.
- Empty public entry points validate compilation without inventing domain APIs. These checks establish a toolchain, not feature coverage.
- Independent deployment still requires compatible contracts and release configuration; a workspace alone does not provide it.
- Add actual package dependencies with `workspace:*` instead of cross-package relative imports. Topological builds depend on accurate manifests.

## References

- [pnpm workspaces](https://pnpm.io/workspaces)
- [typescript-eslint flat configuration](https://typescript-eslint.io/getting-started/)
- [GitHub Actions Node setup](https://github.com/actions/setup-node)
- [GitHub Actions pnpm setup](https://github.com/pnpm/action-setup)
