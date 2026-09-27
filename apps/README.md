# Frontend applications

The shell and Issues UI use React and TypeScript. Module Federation will be introduced in Phase 3 of `.agent.md`.

Each application has `public/`, `src/`, and `tests/`. Domain UI lives in `src/features/`, route screens in `src/pages/`, and API clients in `src/api/`. Shared UI belongs in `packages/ui`.

The shell additionally owns `src/auth/`, `src/layouts/`, `src/routes/`, and `src/remotes/` for authentication integration, navigation, and remote loading with failure boundaries.

The shell runs Vite and owns routing, layout, and the TanStack Query provider. `issues-mfe` exposes its pages through its package entry point and owns the issue domain and replaceable asynchronous mock API. The shell currently bundles that source directly. Community and Analytics remain placeholders. Independent remote builds and federation configuration arrive in Phase 3; Dockerfiles arrive later.
